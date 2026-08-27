import { sql } from "@vercel/postgres";

/**
 * Schema for the app backend: rate alerts, push delivery, and self-reported
 * transfer history.
 *
 * Follows the same contract as event-store.ts, deliberately:
 *   - one module-level promise dedupes concurrent first-calls, so DDL runs once
 *     per warm lambda rather than on every request
 *   - CREATE TABLE IF NOT EXISTS for new deployments, plus idempotent
 *     ALTER TABLE ... ADD COLUMN IF NOT EXISTS for columns added later (a bare
 *     CREATE IF NOT EXISTS silently skips them on an existing table)
 *   - every call no-ops when POSTGRES_URL is absent
 *
 * SAFE TO SHIP BEFORE ANYTHING USES IT. Nothing imports this module yet, and
 * ensureAlertStore() is the only way to trigger the DDL, so deploying it is a
 * zero-behaviour-change deploy. That is the point: the app backend lands in
 * production dark, and the website's request path is never involved.
 *
 * NO ACCOUNTS. There is no users table and no sessions table. A device is the
 * identity: it registers once, the server mints a secret, and every row below
 * hangs off devices.id. See the `devices` comment for what that costs.
 */

const ENABLED = !!process.env.POSTGRES_URL;

/**
 * Whether the app backend has a database behind it. Routes check this to return
 * an honest 503 rather than a confusing empty success, since every store call
 * silently no-ops when unprovisioned.
 */
export const alertStoreEnabled = ENABLED;

let ensured: Promise<void> | null = null;

/**
 * Create/upgrade the app schema. Callers should await this before their first
 * query — readers included, since a reader that SELECTs a newly-added column
 * 500s if no writer has run since that column was introduced (the exact trap
 * event-store.ts documents). No-ops when not provisioned.
 */
export async function ensureAlertStore(): Promise<void> {
  if (!ENABLED) return;
  await ensureTables();
}

function ensureTables(): Promise<void> {
  if (ensured) return ensured;

  // devices must exist before the tables that reference it, and alerts before
  // alert_deliveries — hence the sequential steps rather than one Promise.all.
  ensured = sql`
    CREATE TABLE IF NOT EXISTS devices (
      id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      -- SHA-256 of the secret handed to the device once at registration. The
      -- secret itself is never stored, exactly as click tokens are never
      -- stored: a database dump must not be enough to impersonate a device.
      secret_hash           TEXT NOT NULL UNIQUE,
      platform              TEXT,
      -- Quiet hours are evaluated in the device's own timezone. A 03:00 UTC
      -- scrape is the middle of the night for much of the UK/Gulf audience.
      timezone              TEXT,
      locale                TEXT,
      -- Expo push token. Lives here rather than in its own table because a
      -- device holds exactly one at a time — Expo rotates it on reinstall
      -- rather than accumulating them.
      push_token            TEXT,
      push_token_updated_at TIMESTAMPTZ,
      -- Set when Expo reports DeviceNotRegistered. Retrying dead tokens gets
      -- the whole sender rate-limited.
      push_disabled_at      TIMESTAMPTZ,
      push_disabled_reason  TEXT,
      -- Deliberately nullable and unused for now. Without accounts, deleting
      -- the app loses the transfer history for good — which reads as a bug to
      -- someone who built it up over months. This column keeps the door open
      -- for a later "back up my history" that emails a restore link: export
      -- and restore, not login. Costs nothing to reserve now.
      backup_email          TEXT,
      created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
      last_seen_at          TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `
    .then(() =>
      Promise.all([
        sql`
          CREATE TABLE IF NOT EXISTS alerts (
            id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            device_id         UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
            from_currency     TEXT NOT NULL,
            to_currency       TEXT NOT NULL,
            -- Part of the identity of an alert, not decoration: the fee model
            -- is amount-dependent, so "best provider" differs at £200 and
            -- £2000 on the same corridor.
            amount            INTEGER NOT NULL,
            -- 'rate_above' | 'beats_provider' | 'daily_best'
            kind              TEXT NOT NULL,
            threshold         NUMERIC,
            baseline_provider TEXT,
            cooldown_hours    SMALLINT NOT NULL DEFAULT 24,
            quiet_start       SMALLINT,
            quiet_end         SMALLINT,
            active            BOOLEAN NOT NULL DEFAULT TRUE,
            last_fired_at     TIMESTAMPTZ,
            -- The idempotency key the evaluator gates on. Holds the data
            -- version (full dateCollected timestamp) this alert was last
            -- evaluated against; the cron skips any alert already at the
            -- deployment's current version. That is what makes running it
            -- hourly harmless and a half-failed run resumable.
            last_data_version TEXT,
            created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
            -- Two taps on Create must not produce two identical alerts.
            UNIQUE (device_id, from_currency, to_currency, kind, amount)
          );
        `,
        sql`
          CREATE TABLE IF NOT EXISTS transfers (
            id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            device_id      UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
            sent_on        DATE NOT NULL,
            from_currency  TEXT NOT NULL,
            to_currency    TEXT NOT NULL,
            send_amount    NUMERIC NOT NULL,
            receive_amount NUMERIC,
            -- Nullable so "my bank" is expressible without inventing a slug.
            provider_slug  TEXT,
            fee            NUMERIC,
            note           TEXT,
            created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
            deleted_at     TIMESTAMPTZ
          );
        `,
        sql`
          CREATE TABLE IF NOT EXISTS corridor_daily_best (
            day            DATE NOT NULL,
            from_currency  TEXT NOT NULL,
            to_currency    TEXT NOT NULL,
            amount_bucket  INTEGER NOT NULL,
            best_provider  TEXT,
            best_rate      NUMERIC,
            best_receive   NUMERIC,
            mid_rate       NUMERIC,
            updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
            PRIMARY KEY (day, from_currency, to_currency, amount_bucket)
          );
        `,
      ])
    )
    .then(() =>
      sql`
        CREATE TABLE IF NOT EXISTS alert_deliveries (
          id               BIGSERIAL PRIMARY KEY,
          alert_id         UUID REFERENCES alerts(id) ON DELETE CASCADE,
          device_id        UUID REFERENCES devices(id) ON DELETE CASCADE,
          fired_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
          data_version     TEXT,
          provider         TEXT,
          rate             NUMERIC,
          receive_amount   NUMERIC,
          fee              NUMERIC,
          -- Minted with the existing click-token machinery so a tap on the
          -- notification travels through /go/[provider] like an on-site click
          -- and lands in the events table. Joining this to events.click_id is
          -- what makes "which alert kinds actually produce revenue" answerable
          -- without any new analytics plumbing.
          click_id         TEXT,
          push_status      TEXT,
          push_receipt_id  TEXT,
          opened_at        TIMESTAMPTZ
        );
      `
    )
    .then(() =>
      Promise.all([
        // The evaluator's hot query: active alerts not yet seen at this data
        // version.
        sql`CREATE INDEX IF NOT EXISTS alerts_active_version_idx ON alerts (active, last_data_version);`,
        sql`CREATE INDEX IF NOT EXISTS alerts_device_idx ON alerts (device_id);`,
        // Corridor batching — the evaluator groups by corridor+amount so
        // generateQuotes() runs once per distinct tuple, not once per alert.
        sql`CREATE INDEX IF NOT EXISTS alerts_corridor_idx ON alerts (from_currency, to_currency, amount);`,
        sql`CREATE INDEX IF NOT EXISTS transfers_device_sent_idx ON transfers (device_id, sent_on DESC);`,
        sql`CREATE INDEX IF NOT EXISTS deliveries_click_idx ON alert_deliveries (click_id);`,
        sql`CREATE INDEX IF NOT EXISTS deliveries_alert_fired_idx ON alert_deliveries (alert_id, fired_at DESC);`,
        // Not UNIQUE: an Expo token can legitimately move to a new device row
        // after a reinstall or an OS restore, and a unique constraint would
        // turn that into a failed registration instead of a reassignment.
        sql`CREATE INDEX IF NOT EXISTS devices_push_token_idx ON devices (push_token);`,
      ]).then(() => undefined)
    )
    .catch((e) => {
      // Reset so a later call can retry, then rethrow — unlike event-store's
      // write path, a caller here needs to know the schema isn't ready.
      ensured = null;
      throw e;
    });

  return ensured;
}

/** 'rate_above' fires when the corridor's best rate crosses `threshold`.
 *  'beats_provider' fires when any provider beats `baseline_provider`.
 *  'daily_best' is a once-a-day digest of the cheapest option. */
export type AlertKind = "rate_above" | "beats_provider" | "daily_best";

export type Device = {
  id: string;
  platform?: string;
  timezone?: string;
  locale?: string;
  pushToken?: string;
  pushDisabledAt?: string;
  backupEmail?: string;
  createdAt: string;
  lastSeenAt: string;
};

export type Alert = {
  id: string;
  deviceId: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  kind: AlertKind;
  threshold?: number;
  baselineProvider?: string;
  cooldownHours: number;
  quietStart?: number;
  quietEnd?: number;
  active: boolean;
  lastFiredAt?: string;
  lastDataVersion?: string;
};

export type AlertDelivery = {
  id: number;
  alertId: string;
  deviceId: string;
  firedAt: string;
  dataVersion?: string;
  provider?: string;
  rate?: number;
  receiveAmount?: number;
  fee?: number;
  clickId?: string;
  pushStatus?: string;
  openedAt?: string;
};

export type Transfer = {
  id: string;
  deviceId: string;
  sentOn: string;
  fromCurrency: string;
  toCurrency: string;
  sendAmount: number;
  receiveAmount?: number;
  providerSlug?: string;
  fee?: number;
  note?: string;
};

export type CorridorDailyBest = {
  day: string;
  fromCurrency: string;
  toCurrency: string;
  amountBucket: number;
  bestProvider?: string;
  bestRate?: number;
  bestReceive?: number;
  midRate?: number;
};
