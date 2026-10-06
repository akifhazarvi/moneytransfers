import { createHmac } from "crypto";

/**
 * First-party store for the live activity strip: what readers do on the site,
 * recorded by /api/live-activity and read back by it. Upstash Redis (Vercel
 * Marketplace, Free plan) over its REST API, so no client library ships in
 * the function. Every call no-ops when the store is not connected, and the
 * strip falls back to the GA4 snapshot.
 *
 * What is kept, and for how long:
 *   - la:ev        the last 200 events (country, route, provider, time) — no
 *                  visitor id on them.
 *   - la:h:<hour>  one HyperLogLog per UTC hour (26 h): how many different
 *                  people, for "N in the last 6 hours".
 *   - la:m:<min>   one HyperLogLog per minute (15 min): "N here now".
 *   - dedupe and per-IP caps, expiring within the hour.
 * A visitor is an HMAC of IP + user agent + the UTC day. It is never stored
 * as such — HyperLogLog keeps only registers — and changes every day, so it
 * cannot follow anyone across days. No cookie is set or read.
 *
 * Budget: Upstash Free allows 500K commands a month. A visitor costs ~4
 * commands a minute while reading (heartbeats stop after 10 minutes), an
 * event ~6, an uncached feed read 3; the feed is cached at the edge.
 */

const URL_ = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
const SALT = process.env.CLICK_TOKEN_SECRET || "smc-live-activity";

export const activityStoreEnabled = Boolean(URL_ && TOKEN);

const EVENTS_KEY = "la:ev";
const MAX_EVENTS = 200;
/** One reader repeating one action on one route counts once in this window. */
const DEDUPE_SECONDS = 1800;
/** No single IP adds more than this many events an hour. */
const EVENTS_PER_IP_HOUR = 20;
export const HERE_MINUTES = 5;
export const PEOPLE_HOURS = 6;

type Command = (string | number)[];

async function pipeline(commands: Command[]): Promise<unknown[]> {
  const res = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: { authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`activity store ${res.status}`);
  return ((await res.json()) as { result?: unknown; error?: string }[]).map((r) => r.result ?? null);
}

const hourKey = (t: number) => `la:h:${new Date(t).toISOString().slice(0, 13)}`;
const minuteKey = (t: number) => `la:m:${Math.floor(t / 60_000)}`;
const hash = (value: string) => createHmac("sha256", SALT).update(value).digest("hex").slice(0, 20);

export function visitorId(ip: string, userAgent: string, now = Date.now()): string {
  return hash(`${new Date(now).toISOString().slice(0, 10)}|${ip}|${userAgent}`);
}

export interface StoredEvent {
  at: number;
  country: string;
  kind: "compared" | "chose";
  from?: string;
  to?: string;
  provider?: string;
}

/** The reader is on the site now. */
export async function recordPresence(visitor: string, now = Date.now()): Promise<void> {
  if (!activityStoreEnabled) return;
  await pipeline([
    ["PFADD", minuteKey(now), visitor],
    ["EXPIRE", minuteKey(now), 900],
    ["PFADD", hourKey(now), visitor],
    ["EXPIRE", hourKey(now), 26 * 3600],
  ]);
}

/** A comparison or a choice. Dropped when it repeats or the IP is over its cap. */
export async function recordEvent(event: StoredEvent, visitor: string, ip: string): Promise<boolean> {
  if (!activityStoreEnabled) return false;
  const hour = new Date(event.at).toISOString().slice(0, 13);
  const capKey = `la:cap:${hash(ip)}:${hour}`;
  const dedupeKey = `la:d:${visitor}:${event.kind}:${event.from ?? ""}${event.to ?? ""}:${event.provider ?? ""}`;
  const [fresh, count] = await pipeline([
    ["SET", dedupeKey, "1", "NX", "EX", DEDUPE_SECONDS],
    ["INCR", capKey],
    ["EXPIRE", capKey, 3600],
  ]);
  if (fresh !== "OK" || Number(count) > EVENTS_PER_IP_HOUR) return false;
  await pipeline([
    ["LPUSH", EVENTS_KEY, JSON.stringify(event)],
    ["LTRIM", EVENTS_KEY, 0, MAX_EVENTS - 1],
  ]);
  return true;
}

export async function readStore(now = Date.now()): Promise<{ events: StoredEvent[]; here: number; people: number }> {
  const minutes = Array.from({ length: HERE_MINUTES }, (_, i) => minuteKey(now - i * 60_000));
  const hours = Array.from({ length: PEOPLE_HOURS }, (_, i) => hourKey(now - i * 3_600_000));
  const [raw, here, people] = await pipeline([
    ["LRANGE", EVENTS_KEY, 0, 59],
    ["PFCOUNT", ...minutes],
    ["PFCOUNT", ...hours],
  ]);
  const events = ((raw as string[] | null) ?? []).flatMap((s) => {
    try {
      return [JSON.parse(s) as StoredEvent];
    } catch {
      return [];
    }
  });
  return { events, here: Number(here) || 0, people: Number(people) || 0 };
}
