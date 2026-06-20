import { sql } from "@vercel/postgres";

/**
 * First-party event store — the auditable, owned source of truth for the
 * provider-exit events. GA4 + Vercel are the convenience sinks; this Postgres
 * table is the record we can query row-by-row for clean per-use-case numbers
 * and partner reconciliation (e.g. TapTap $1/click proof via click_id).
 *
 * Scope (phase 1): the two server redirect events only — affiliate_redirect and
 * provider_clicked_server. These are 100% of what matters for billing and the
 * (not set) leak fix. Client events come in a later phase.
 *
 * SAFE TO SHIP BEFORE PROVISIONING: every call no-ops when POSTGRES_URL is
 * absent, so deploying this never breaks the redirect path. Once Vercel
 * Postgres is provisioned (it injects POSTGRES_URL), writes begin automatically.
 */

const ENABLED = !!process.env.POSTGRES_URL;

// Ensure the table once per warm lambda. A module-level promise dedupes
// concurrent first-calls without re-running DDL on every event.
let ensured: Promise<void> | null = null;
function ensureTable(): Promise<void> {
  if (ensured) return ensured;
  ensured = sql`
    CREATE TABLE IF NOT EXISTS events (
      id          BIGSERIAL PRIMARY KEY,
      ts          TIMESTAMPTZ NOT NULL DEFAULT now(),
      event       TEXT NOT NULL,
      vid         TEXT,
      client_id   TEXT,
      click_id    TEXT,
      provider    TEXT,
      corridor    TEXT,
      amount      INTEGER,
      source      TEXT,
      traffic_source TEXT,
      id_source   TEXT,
      is_bot      BOOLEAN,
      bot_score   INTEGER,
      bot_reasons TEXT,
      ip_hash     TEXT,
      referer_host TEXT,
      country     TEXT,
      region      TEXT,
      city        TEXT
    );
  `.then(() => {
    // Add columns to an already-created table (CREATE IF NOT EXISTS won't).
    // Idempotent — safe to run every cold start.
    return Promise.all([
      sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS bot_score INTEGER;`,
      sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS bot_reasons TEXT;`,
      sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS ip_hash TEXT;`,
    ]);
  }).then(() => {
    // Indexes for the reports we run + the behavioral IP lookup window.
    return Promise.all([
      sql`CREATE INDEX IF NOT EXISTS events_event_ts_idx ON events (event, ts);`,
      sql`CREATE INDEX IF NOT EXISTS events_provider_idx ON events (provider);`,
      sql`CREATE INDEX IF NOT EXISTS events_click_id_idx ON events (click_id);`,
      sql`CREATE INDEX IF NOT EXISTS events_iphash_ts_idx ON events (ip_hash, ts);`,
    ]).then(() => undefined);
  }).catch((e) => {
    // If DDL fails, reset so a later call can retry; never throw to caller.
    ensured = null;
    throw e;
  });
  return ensured;
}

export type StoredEvent = {
  event: string;
  vid?: string;
  clientId?: string;
  clickId?: string;
  provider?: string;
  corridor?: string;
  amount?: number;
  source?: string;
  trafficSource?: string;
  idSource?: string;
  isBot?: boolean;
  botScore?: number;
  botReasons?: string;
  ipHash?: string;
  refererHost?: string;
  country?: string;
  region?: string;
  city?: string;
};

/**
 * Behavioral bot score for an IP over the recent window — the stateful half of
 * detection (the request-shape half is in bot-score.ts). Catches what a single
 * request can't: enumeration (one IP walking many providers/corridors), bursts,
 * and machine-regular cadence. Returns 0 quickly when not provisioned or on any
 * error so it never delays/blocks a redirect.
 *
 * Validated against live data: the CN scraper showed 33 hits from 33 distinct
 * visitor ids across 14 providers / 19 corridors — pure enumeration.
 */
export async function behavioralBotScore(
  ipHash: string | null | undefined,
): Promise<{ score: number; reasons: string[] }> {
  if (!ENABLED || !ipHash) return { score: 0, reasons: [] };
  try {
    // One round-trip: enumeration breadth + burst count + cadence regularity
    // for this IP over the last hour. Each is an independent behavioral signal.
    const { rows } = await sql`
      WITH recent AS (
        SELECT ts,
               extract(epoch FROM ts - lag(ts) OVER (ORDER BY ts)) AS gap
        FROM events
        WHERE event = 'affiliate_redirect' AND ip_hash = ${ipHash}
          AND ts > now() - interval '60 minutes'
      )
      SELECT
        (SELECT count(*) FROM events
           WHERE event='affiliate_redirect' AND ip_hash=${ipHash}
             AND ts > now() - interval '60 minutes')::int               AS hits,
        (SELECT count(DISTINCT provider) FROM events
           WHERE event='affiliate_redirect' AND ip_hash=${ipHash}
             AND ts > now() - interval '60 minutes')::int               AS providers,
        (SELECT count(DISTINCT corridor) FROM events
           WHERE event='affiliate_redirect' AND ip_hash=${ipHash}
             AND ts > now() - interval '60 minutes')::int               AS corridors,
        (SELECT count(DISTINCT vid) FROM events
           WHERE event='affiliate_redirect' AND ip_hash=${ipHash}
             AND ts > now() - interval '60 minutes')::int               AS vids,
        (SELECT stddev_pop(gap) FROM recent WHERE gap IS NOT NULL)       AS gap_sd,
        (SELECT avg(gap) FROM recent WHERE gap IS NOT NULL)              AS gap_avg
      `;
    const r = rows[0] || {};
    const hits = Number(r.hits) || 0;
    const providers = Number(r.providers) || 0;
    const corridors = Number(r.corridors) || 0;
    const vids = Number(r.vids) || 0;
    const gapSd = r.gap_sd != null ? Number(r.gap_sd) : null;
    const gapAvg = r.gap_avg != null ? Number(r.gap_avg) : null;

    let score = 0;
    const reasons: string[] = [];

    // Enumeration — STRONGEST intent signal. Walking many providers from one IP.
    if (providers >= 8) { score += 22; reasons.push(`enumeration: ${providers} providers/1h (+22)`); }
    else if (providers >= 5) { score += 12; reasons.push(`enumeration: ${providers} providers/1h (+12)`); }
    if (corridors >= 10) { score += 10; reasons.push(`${corridors} corridors/1h (+10)`); }

    // Cadence regularity — humans can't produce a near-constant gap.
    if (gapSd != null && gapAvg != null && gapAvg > 0 && hits >= 5) {
      const cv = gapSd / gapAvg;
      if (cv < 0.1) { score += 20; reasons.push(`machine cadence cv=${cv.toFixed(2)} (+20)`); }
      else if (cv < 0.25) { score += 10; reasons.push(`regular cadence cv=${cv.toFixed(2)} (+10)`); }
    }

    // Burst rate from one IP.
    if (hits >= 30) { score += 14; reasons.push(`${hits} hits/1h from IP (+14)`); }
    else if (hits >= 12) { score += 8; reasons.push(`${hits} hits/1h from IP (+8)`); }

    // Fresh-visitor-every-time: many hits, ~1 vid each (no session continuity).
    if (hits >= 8 && vids >= hits * 0.9) { score += 12; reasons.push(`${vids} fresh vids / ${hits} hits (+12)`); }

    return { score: Math.min(100, score), reasons };
  } catch {
    return { score: 0, reasons: [] };
  }
}

/**
 * Write one event row. No-ops (resolves) when the store isn't provisioned, and
 * never throws — analytics must never break a redirect.
 */
export async function storeEvent(e: StoredEvent): Promise<void> {
  if (!ENABLED) return;
  try {
    await ensureTable();
    await sql`
      INSERT INTO events
        (event, vid, client_id, click_id, provider, corridor, amount,
         source, traffic_source, id_source, is_bot, bot_score, bot_reasons,
         ip_hash, referer_host, country, region, city)
      VALUES
        (${e.event}, ${e.vid ?? null}, ${e.clientId ?? null}, ${e.clickId ?? null},
         ${e.provider ?? null}, ${e.corridor ?? null}, ${e.amount ?? null},
         ${e.source ?? null}, ${e.trafficSource ?? null}, ${e.idSource ?? null},
         ${e.isBot ?? null}, ${e.botScore ?? null}, ${e.botReasons ?? null},
         ${e.ipHash ?? null}, ${e.refererHost ?? null},
         ${e.country ?? null}, ${e.region ?? null}, ${e.city ?? null});
    `;
  } catch {
    // swallow — never let a logging failure affect the request
  }
}
