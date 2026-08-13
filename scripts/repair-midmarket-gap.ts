/**
 * Repairs forward-filled days in history/midmarket-daily.json.
 *
 * WHY THIS EXISTS
 * ---------------
 * Between 2026-07-03 and 2026-08-13 the API scrape workflow timed out before
 * its commit step, so scrape-xe.ts stopped publishing fresh rates. But
 * aggregate-history.ts ran daily from the browser workflow and — having no
 * staleness check at the time — kept appending a NEW date carrying the OLD
 * rates. The result was 42 consecutive byte-identical days: /exchange-rates
 * showed "0.00 %" for every 24h and 7d cell across all 64 currencies, and the
 * 90-day sparkline flat-lined.
 *
 * aggregate-history.ts now refuses to derive a day from a stale source, so this
 * cannot recur. That fix stops new damage; it does not repair days already
 * written. Left alone the bad rows age out slowly and keep lying meanwhile:
 * 7d deltas stay wrong for a week, the 90-day sparkline stays flat for ~3
 * months, and the 1y column is wrong for a full year.
 *
 * WHY THIS SOURCE
 * ---------------
 * @fawazahmed0/currency-api on jsDelivr serves real per-date historical rates,
 * needs no API key, and cdn.jsdelivr.net is already allowlisted in the
 * middleware CSP. scripts/backfill-mid-market-history.ts can't do this job: it
 * only fills dates BEFORE the earliest existing row and skips dates already
 * present, so it can prepend history but never repair a corrupted tail. It also
 * requires CURRENCY_API_KEY, which isn't configured anywhere.
 *
 * USAGE
 *   npx tsx scripts/repair-midmarket-gap.ts                  # auto-detect, dry run
 *   APPLY=1 npx tsx scripts/repair-midmarket-gap.ts          # write changes
 *   REPAIR_FROM=2026-07-03 REPAIR_TO=2026-08-13 APPLY=1 npx tsx scripts/repair-midmarket-gap.ts
 *
 * Defaults to a DRY RUN — it prints what it would change and exits without
 * touching the file. Pass APPLY=1 to write.
 *
 * Auto-detection finds the trailing run of identical rate-vectors, which is
 * exactly the forward-fill signature. An explicit REPAIR_FROM/REPAIR_TO
 * overrides it.
 *
 * Rates are "units per 1 USD", matching both the existing schema and the
 * source's usd.json orientation. Only currencies already present in the file
 * are written, so the schema is preserved; a date the source can't supply is
 * left untouched and reported rather than guessed at.
 */

import * as fs from "fs";
import * as path from "path";

const HISTORY_PATH = path.join("src/data/scraped/history/midmarket-daily.json");
const CDN = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api";
const REQUEST_DELAY_MS = 120;
const APPLY = process.env.APPLY === "1";

interface DayEntry {
  date: string;
  rates: Record<string, number>;
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Trailing run of days whose rate-vector is identical to the final day. */
function detectForwardFill(days: DayEntry[]): DayEntry[] {
  if (days.length === 0) return [];
  const last = JSON.stringify(days[days.length - 1].rates);
  const run: DayEntry[] = [];
  for (let i = days.length - 1; i >= 0; i--) {
    if (JSON.stringify(days[i].rates) === last) run.unshift(days[i]);
    else break;
  }
  // A 1-2 day run is normal (weekend/holiday carry-forward by the FX source).
  return run.length >= 3 ? run : [];
}

async function fetchDay(date: string): Promise<Record<string, number> | null> {
  for (const url of [
    `${CDN}@${date}/v1/currencies/usd.json`,
    `${CDN}@${date}/v1/currencies/usd.min.json`,
  ]) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const json = (await res.json()) as { date?: string; usd?: Record<string, number> };
      if (json.usd && Object.keys(json.usd).length > 50) return json.usd;
    } catch {
      // try next URL shape
    }
  }
  return null;
}

async function main(): Promise<void> {
  const days = JSON.parse(fs.readFileSync(HISTORY_PATH, "utf-8")) as DayEntry[];
  process.stdout.write(`Loaded ${days.length} days (${days[0].date} → ${days.at(-1)?.date})\n`);

  const from = process.env.REPAIR_FROM;
  const to = process.env.REPAIR_TO;
  const targets =
    from && to
      ? days.filter((d) => d.date >= from && d.date <= to)
      : detectForwardFill(days);

  if (targets.length === 0) {
    process.stdout.write("No forward-filled run detected — nothing to repair.\n");
    return;
  }
  process.stdout.write(
    `Repairing ${targets.length} days: ${targets[0].date} → ${targets.at(-1)?.date}\n` +
      `Mode: ${APPLY ? "APPLY (will write)" : "DRY RUN (no changes; pass APPLY=1 to write)"}\n\n`,
  );

  // Preserve the exact currency set already in the file.
  const currencies = Object.keys(targets[0].rates);
  const byDate = new Map(days.map((d) => [d.date, d]));

  let repaired = 0;
  let failed = 0;
  const samples: string[] = [];

  for (const target of targets) {
    const usd = await fetchDay(target.date);
    if (!usd) {
      failed++;
      process.stdout.write(`  ${target.date}  UNAVAILABLE — left untouched\n`);
      continue;
    }

    const next: Record<string, number> = {};
    let missing = 0;
    for (const code of currencies) {
      const v = usd[code.toLowerCase()];
      if (typeof v === "number" && isFinite(v) && v > 0) {
        next[code] = Math.round(v * 1_000_000) / 1_000_000;
      } else {
        // Keep the prior value rather than dropping a currency mid-series.
        next[code] = target.rates[code];
        missing++;
      }
    }

    const before = target.rates.INR;
    const after = next.INR;
    const driftPct = before ? ((after - before) / before) * 100 : 0;
    if (samples.length < 6) {
      samples.push(
        `  ${target.date}  INR ${before?.toFixed(4)} → ${after?.toFixed(4)} (${driftPct >= 0 ? "+" : ""}${driftPct.toFixed(2)}%)${missing ? `  [${missing} kept]` : ""}`,
      );
    }

    if (APPLY) byDate.get(target.date)!.rates = next;
    repaired++;
    await delay(REQUEST_DELAY_MS);
  }

  process.stdout.write(samples.join("\n") + (samples.length ? "\n" : ""));
  if (repaired > samples.length) {
    process.stdout.write(`  … ${repaired - samples.length} more\n`);
  }

  if (APPLY && repaired > 0) {
    const merged = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
    fs.writeFileSync(HISTORY_PATH, JSON.stringify(merged));
    process.stdout.write(`\nWrote ${merged.length} days to ${HISTORY_PATH}\n`);
    const stillFlat = detectForwardFill(merged).length;
    process.stdout.write(
      stillFlat
        ? `WARNING: a ${stillFlat}-day identical run remains.\n`
        : "Verified: no forward-filled run remains.\n",
    );
  }

  process.stdout.write(`\nRepaired: ${repaired}   Unavailable: ${failed}\n`);
  if (!APPLY) process.stdout.write("Dry run — no changes written. Re-run with APPLY=1.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
