import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { ensureAlertStore, alertStoreEnabled } from "@/lib/alert-store";
import { getDataVersion } from "@/lib/data-freshness";
import { generateQuotes } from "@/lib/quotes-engine";
import { mintClickToken } from "@/lib/click-token";
import { sendPush, type PushMessage } from "@/lib/push";
import type { TransferQuote } from "@/data/providers";

/**
 * The alert evaluator. Vercel Cron calls this hourly.
 *
 * WHY IT IS VERSION-GATED RATHER THAN TIME-DRIVEN
 * Quote data is build-time embedded: quotes-engine.ts statically imports the
 * whole scraped dataset, so generateQuotes() only sees what shipped with the
 * current deployment. Fresh numbers arrive when a deploy completes — the three
 * scrape workflows each fire VERCEL_DEPLOY_HOOK, because vercel-ignore.sh skips
 * the normal build for data-only commits — and never on a schedule we control.
 *
 * A cron that simply ran at 00:30 would race that deploy and evaluate stale
 * rates. So instead every alert stores the data version it was last evaluated
 * against, and this job skips anything already stamped with the deployment's
 * current version. Consequences, all of them wanted:
 *   - running hourly is cheap: real work happens only on the ~3 runs a day that
 *     actually carry new numbers
 *   - a late deploy is picked up by the next hour instead of missed
 *   - a run that dies halfway resumes, because only unprocessed alerts still
 *     carry the old version
 *
 * See lib/data-freshness.ts getDataVersion().
 */

export const dynamic = "force-dynamic";
// Bounded by ALERT_BATCH below, but generateQuotes() walks a large embedded
// dataset, so give it room rather than dying mid-batch.
export const maxDuration = 300;

/** Alerts processed per invocation. The version gate makes this resumable. */
const ALERT_BATCH = 500;

/**
 * How much better the best option must be before a comparison alert fires.
 * Without a floor, every trivial rate wobble becomes a notification and people
 * mute the app — which costs more than a missed alert ever does.
 */
const MIN_IMPROVEMENT = 0.005; // 0.5% more received

/** Devices that registered, never took a push token and never made an alert. */
const ORPHAN_DEVICE_DAYS = 7;

type PendingRow = {
  id: string;
  device_id: string;
  from_currency: string;
  to_currency: string;
  amount: number;
  kind: string;
  threshold: string | null;
  baseline_provider: string | null;
  cooldown_hours: number;
  quiet_start: number | null;
  quiet_end: number | null;
  last_fired_at: string | null;
  timezone: string | null;
  push_token: string;
};

/** Current hour 0-23 in a device's own timezone. */
function localHour(timezone: string | null): number {
  if (!timezone) return new Date().getUTCHours();
  try {
    const formatted = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hour: "numeric",
      hour12: false,
    }).format(new Date());
    const hour = Number(formatted);
    return Number.isInteger(hour) ? hour % 24 : new Date().getUTCHours();
  } catch {
    return new Date().getUTCHours();
  }
}

/** Quiet windows may wrap midnight (22 -> 7), so this is not a simple range. */
function inQuietHours(hour: number, start: number | null, end: number | null): boolean {
  if (start === null || end === null) return false;
  if (start === end) return false;
  return start < end ? hour >= start && hour < end : hour >= start || hour < end;
}

function cooledDown(lastFiredAt: string | null, cooldownHours: number): boolean {
  if (!lastFiredAt) return true;
  const elapsedMs = Date.now() - new Date(lastFiredAt).getTime();
  return elapsedMs >= cooldownHours * 3_600_000;
}

/**
 * Decide whether an alert fires, and what to say.
 *
 * Indicative quotes are excluded before we get here: a broker's mid-market
 * placeholder is not a real price, and alerting on one would send people to a
 * provider that never quoted that rate.
 */
function evaluate(row: PendingRow, quotes: TransferQuote[]): { quote: TransferQuote; body: string } | null {
  const real = quotes.filter((q) => !q.isIndicative && q.receiveAmount > 0);
  if (real.length === 0) return null;

  const best = real[0];
  const to = row.to_currency;
  const money = (n: number) => `${Math.round(n).toLocaleString("en-GB")} ${to}`;

  if (row.kind === "rate_above") {
    const threshold = row.threshold === null ? null : Number(row.threshold);
    if (threshold === null || !(best.exchangeRate >= threshold)) return null;
    return {
      quote: best,
      body: `${row.from_currency}→${to} hit ${best.exchangeRate.toFixed(2)} — ${best.providerSlug} sends ${money(best.receiveAmount)} on ${row.amount} ${row.from_currency}.`,
    };
  }

  if (row.kind === "beats_provider") {
    const baseline = real.find((q) => q.providerSlug === row.baseline_provider);
    // No baseline quote means nothing to compare against — stay quiet rather
    // than guessing.
    if (!baseline || baseline.providerSlug === best.providerSlug) return null;
    const gain = (best.receiveAmount - baseline.receiveAmount) / baseline.receiveAmount;
    if (!(gain >= MIN_IMPROVEMENT)) return null;
    return {
      quote: best,
      body: `${best.providerSlug} now beats ${row.baseline_provider} by ${money(best.receiveAmount - baseline.receiveAmount)} on ${row.amount} ${row.from_currency}.`,
    };
  }

  // daily_best — cooldown alone paces this one.
  return {
    quote: best,
    body: `Today's cheapest ${row.from_currency}→${to}: ${best.providerSlug}, ${money(best.receiveAmount)} on ${row.amount} ${row.from_currency}.`,
  };
}

export async function GET(request: Request) {
  // Vercel Cron sends CRON_SECRET as a bearer. Nothing else may run this.
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!alertStoreEnabled) {
    return NextResponse.json({ error: "App backend is not provisioned" }, { status: 503 });
  }

  const dataVersion = getDataVersion();
  const summary = {
    dataVersion,
    considered: 0,
    corridorsPriced: 0,
    fired: 0,
    deferredQuiet: 0,
    coolingDown: 0,
    noMatch: 0,
    pushFailed: 0,
    tokensDisabled: 0,
    orphanDevicesPruned: 0,
  };

  try {
    await ensureAlertStore();

    // Only alerts that can actually be delivered: a device with no live push
    // token has no channel at all (there is no email fallback), so evaluating
    // it would burn work on a notification nobody can receive.
    const { rows } = await sql<PendingRow>`
      SELECT a.id, a.device_id, a.from_currency, a.to_currency, a.amount, a.kind,
             a.threshold, a.baseline_provider, a.cooldown_hours,
             a.quiet_start, a.quiet_end, a.last_fired_at,
             d.timezone, d.push_token
        FROM alerts a
        JOIN devices d ON d.id = a.device_id
       WHERE a.active
         AND (a.last_data_version IS NULL OR a.last_data_version <> ${dataVersion})
         AND d.push_token IS NOT NULL
         AND d.push_disabled_at IS NULL
       ORDER BY a.last_data_version NULLS FIRST, a.id
       LIMIT ${ALERT_BATCH};
    `;
    summary.considered = rows.length;

    // Price each distinct corridor+amount ONCE and fan the result out. Calling
    // generateQuotes() per alert would walk the embedded dataset per row and
    // time the function out as soon as there are real users.
    const groups = new Map<string, PendingRow[]>();
    for (const row of rows) {
      const key = `${row.from_currency}|${row.to_currency}|${row.amount}`;
      const list = groups.get(key);
      if (list) list.push(row);
      else groups.set(key, [row]);
    }

    const messages: PushMessage[] = [];
    const deliveries: { alertId: string; deviceId: string; clickId: string; quote: TransferQuote }[] = [];
    const stampOnly: string[] = [];
    const deferred: string[] = [];

    for (const [key, alerts] of groups) {
      const [from, to, amountStr] = key.split("|");
      const amount = Number(amountStr);
      const quotes = generateQuotes(amount, from, to);
      summary.corridorsPriced++;

      // One snapshot per corridor per day, written while we already hold fresh
      // quotes. This is what lets transfer history later say "you got 0.4% under
      // the best available that day" without querying the embedded dataset.
      const realBest = quotes.filter((q) => !q.isIndicative && q.receiveAmount > 0)[0];
      if (realBest) {
        await sql`
          INSERT INTO corridor_daily_best
            (day, from_currency, to_currency, amount_bucket,
             best_provider, best_rate, best_receive, mid_rate)
          VALUES
            (CURRENT_DATE, ${from}, ${to}, ${amount},
             ${realBest.providerSlug}, ${realBest.exchangeRate},
             ${realBest.receiveAmount}, ${realBest.exchangeRate})
          ON CONFLICT (day, from_currency, to_currency, amount_bucket)
          DO UPDATE SET best_provider = EXCLUDED.best_provider,
                        best_rate     = EXCLUDED.best_rate,
                        best_receive  = EXCLUDED.best_receive,
                        mid_rate      = EXCLUDED.mid_rate,
                        updated_at    = now();
        `;
      }

      for (const row of alerts) {
        // Quiet hours DEFER rather than drop: the version is deliberately not
        // stamped, so a later run the same day can still fire. Stamping here
        // would silence anyone whose quiet window happens to cover the only
        // deploy of the day.
        if (inQuietHours(localHour(row.timezone), row.quiet_start, row.quiet_end)) {
          deferred.push(row.id);
          summary.deferredQuiet++;
          continue;
        }

        if (!cooledDown(row.last_fired_at, row.cooldown_hours)) {
          stampOnly.push(row.id);
          summary.coolingDown++;
          continue;
        }

        const hit = evaluate(row, quotes);
        if (!hit) {
          stampOnly.push(row.id);
          summary.noMatch++;
          continue;
        }

        // Mint the click id and a signed token so a tap travels through
        // /go/[provider] exactly like an on-site click, landing in the events
        // table with genuine_click set. That makes push -> provider_clicked
        // queryable with no new analytics work. The token gets a long TTL
        // because a notification can sit unread for days.
        const clickId = `alert_${Date.now().toString(36)}_${row.id.slice(0, 8)}`;
        const token = mintClickToken(hit.quote.providerSlug, 7 * 24 * 3_600_000);
        const url =
          `https://sendmoneycompare.com/go/${hit.quote.providerSlug}` +
          `?from=${from}&to=${to}&amount=${amount}` +
          `&src=alert&click_id=${encodeURIComponent(clickId)}&t=${encodeURIComponent(token)}`;

        deliveries.push({ alertId: row.id, deviceId: row.device_id, clickId, quote: hit.quote });
        messages.push({
          to: row.push_token,
          title: `${from}→${to} · ${hit.quote.providerSlug}`,
          body: hit.body,
          data: { url, alertId: row.id, clickId },
        });
      }
    }

    // Write the delivery rows BEFORE sending. A crash mid-send then leaves a
    // record to reconcile; the reverse leaves someone notified with no trace.
    for (const d of deliveries) {
      await sql`
        INSERT INTO alert_deliveries
          (alert_id, device_id, data_version, provider, rate, receive_amount, fee, click_id, push_status)
        VALUES
          (${d.alertId}, ${d.deviceId}, ${dataVersion}, ${d.quote.providerSlug},
           ${d.quote.exchangeRate}, ${d.quote.receiveAmount}, ${d.quote.fee},
           ${d.clickId}, 'pending');
      `;
    }

    const outcomes = await sendPush(messages);

    // Reconcile: record what Expo said, and retire tokens it says are dead.
    for (let i = 0; i < outcomes.length; i++) {
      const outcome = outcomes[i];
      const delivery = deliveries[i];
      if (!delivery) continue;

      if (outcome.ok) summary.fired++;
      else summary.pushFailed++;

      await sql`
        UPDATE alert_deliveries
           SET push_status = ${outcome.ok ? "sent" : (outcome.error ?? "failed").slice(0, 200)},
               push_receipt_id = ${outcome.ticketId ?? null}
         WHERE click_id = ${delivery.clickId};
      `;

      if (outcome.deviceNotRegistered) {
        summary.tokensDisabled++;
        await sql`
          UPDATE devices
             SET push_disabled_at = now(), push_disabled_reason = 'DeviceNotRegistered'
           WHERE id = ${delivery.deviceId};
        `;
      }
    }

    // Stamp everything we finished with. Fired alerts also get last_fired_at,
    // which is what the cooldown reads next time.
    const firedIds = deliveries
      .filter((_, i) => outcomes[i]?.ok)
      .map((d) => d.alertId);

    // The sql template only binds primitives, so ids go over as one delimited
    // string and Postgres splits it. Still fully parameterised — the ids are
    // uuids we just read from our own table, and the ::uuid[] cast would reject
    // anything that wasn't.
    if (firedIds.length > 0) {
      await sql`
        UPDATE alerts
           SET last_data_version = ${dataVersion}, last_fired_at = now()
         WHERE id = ANY(string_to_array(${firedIds.join(",")}, ',')::uuid[]);
      `;
    }
    if (stampOnly.length > 0) {
      await sql`
        UPDATE alerts SET last_data_version = ${dataVersion}
         WHERE id = ANY(string_to_array(${stampOnly.join(",")}, ',')::uuid[]);
      `;
    }
    // `deferred` is intentionally absent from both — see the quiet-hours note.

    // Housekeeping: registration is the one unauthenticated write endpoint, so
    // a device that never took a push token and never made an alert is either
    // abandoned or abuse. Either way it is dead weight.
    const { rowCount } = await sql`
      DELETE FROM devices
       WHERE push_token IS NULL
         AND created_at < now() - ${`${ORPHAN_DEVICE_DAYS} days`}::interval
         AND NOT EXISTS (SELECT 1 FROM alerts WHERE alerts.device_id = devices.id)
         AND NOT EXISTS (SELECT 1 FROM transfers WHERE transfers.device_id = devices.id);
    `;
    summary.orphanDevicesPruned = rowCount ?? 0;

    return NextResponse.json({ ok: true, ...summary });
  } catch (err) {
    // Surface the reason: a silently failing evaluator looks exactly like an
    // evaluator with nothing to do, and this pipeline has been frozen by a
    // silent misconfiguration before.
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ ok: false, error: message, ...summary }, { status: 500 });
  }
}

/** Manual trigger for testing. Same auth, same work. */
export const POST = GET;
