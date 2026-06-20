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
    ]);
  }).then(() => {
    // Indexes for the reports we actually run: by event+time, by provider, by
    // click_id (partner reconciliation). IF NOT EXISTS keeps this idempotent.
    return Promise.all([
      sql`CREATE INDEX IF NOT EXISTS events_event_ts_idx ON events (event, ts);`,
      sql`CREATE INDEX IF NOT EXISTS events_provider_idx ON events (provider);`,
      sql`CREATE INDEX IF NOT EXISTS events_click_id_idx ON events (click_id);`,
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
  refererHost?: string;
  country?: string;
  region?: string;
  city?: string;
};

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
         referer_host, country, region, city)
      VALUES
        (${e.event}, ${e.vid ?? null}, ${e.clientId ?? null}, ${e.clickId ?? null},
         ${e.provider ?? null}, ${e.corridor ?? null}, ${e.amount ?? null},
         ${e.source ?? null}, ${e.trafficSource ?? null}, ${e.idSource ?? null},
         ${e.isBot ?? null}, ${e.botScore ?? null}, ${e.botReasons ?? null},
         ${e.refererHost ?? null},
         ${e.country ?? null}, ${e.region ?? null}, ${e.city ?? null});
    `;
  } catch {
    // swallow — never let a logging failure affect the request
  }
}
