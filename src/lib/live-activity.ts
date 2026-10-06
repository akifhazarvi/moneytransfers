import snapshot from "@/data/research/live-activity.json";
import { activityStoreEnabled, readStore } from "@/lib/activity-store";

/**
 * What readers are doing on the site, for the live activity strip
 * (src/components/live-activity/). Every item is a real event — a reader in a
 * country compared a route or chose a provider — with the time it happened.
 * Nothing is generated, padded or replayed as new.
 *
 * Two sources, newest first:
 *   - the first-party store (src/lib/activity-store.ts), recorded by
 *     /api/live-activity as readers act: to the second, plus "here now" and
 *     "in the last 6 hours" counts;
 *   - src/data/research/live-activity.json, real GA4 events from before the
 *     store existed (Oct 4–5 2026), timed to the hour. They age out after 48
 *     hours like everything else, so the file needs no upkeep.
 */

export type ActivityKind = "compared" | "chose";

export interface ActivityItem {
  /** When it happened, UTC ms: exact, or the start of its hour when `hourly`. */
  at: number;
  hourly?: true;
  /** ISO 3166-1 alpha-2. */
  country: string;
  kind: ActivityKind;
  from?: string;
  to?: string;
  /** Display name of the chosen provider. */
  provider?: string;
}

export interface LiveActivity {
  /** "live" when the first-party store answered; "snapshot" when only the GA4 history did. */
  source: "live" | "snapshot";
  /** People on the site in the last 5 minutes (the reader included). */
  here: number | null;
  /** Different people on the site in the last 6 hours. */
  people: number | null;
  items: ActivityItem[];
}

const MAX_ITEMS = 40;
const MAX_AGE_MS = 48 * 3_600_000;

const recent = (items: ActivityItem[], now: number) =>
  items.filter((i) => now - i.at <= MAX_AGE_MS && i.at <= now + 60_000).sort((a, b) => b.at - a.at).slice(0, MAX_ITEMS);

export async function getLiveActivity(now = Date.now()): Promise<LiveActivity> {
  const history = (snapshot as { items: ActivityItem[] }).items;
  if (activityStoreEnabled) {
    try {
      const { events, here, people } = await readStore(now);
      return { source: "live", here, people, items: recent([...events, ...history], now) };
    } catch {
      // fall through to the history
    }
  }
  return { source: "snapshot", here: null, people: null, items: recent(history, now) };
}
