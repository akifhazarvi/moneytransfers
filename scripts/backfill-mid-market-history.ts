/**
 * One-shot backfill of mid-market FX history from CurrencyAPI.
 *
 * Writes into src/data/scraped/history/midmarket-daily.json — the source of
 * truth that build-rate-insights.ts reads. (The published midmarket-history.json
 * is regenerated from this source on every scraper run; backfilling the
 * published file directly would be wiped by the next run.)
 *
 * The output schema is unchanged so every consumer (rate-history.ts,
 * RateHistorySection on corridor pages, weekly digest) picks up the deeper
 * history without code changes. No new pages, no duplicated content — just
 * richer data behind existing visualisations.
 *
 * Usage: CURRENCY_API_KEY=... npx tsx scripts/backfill-mid-market-history.ts
 *
 * Quota cost: ~1,825 requests (one per day) — well under our 600k/month plan.
 *
 * After running, raise HISTORY_WINDOW_DAYS in build-rate-insights.ts so the
 * deeper history is actually surfaced in the published midmarket-history.json.
 */

import * as fs from "fs";
import * as path from "path";

const HISTORY_PATH = path.join(__dirname, "..", "src", "data", "scraped", "history", "midmarket-daily.json");
const API_BASE = "https://api.currencyapi.com/v3/historical";
const START_DATE = process.env.BACKFILL_START ?? "2021-01-01";
const REQUEST_DELAY_MS = 150;

// Currencies to fetch — matches the set that the live scraper produces.
const CURRENCIES = [
  "AED", "ARS", "AUD", "BDT", "BHD", "BOB", "BRL", "CAD", "CHF", "CLP",
  "CNY", "COP", "CZK", "DKK", "DOP", "EGP", "ETB", "EUR", "FJD", "GBP",
  "GHS", "GTQ", "HKD", "HNL", "HUF", "IDR", "ILS", "INR", "JMD", "JOD",
  "JPY", "KES", "KRW", "KWD", "LKR", "MAD", "MXN", "MYR", "NGN", "NOK",
  "NPR", "NZD", "OMR", "PEN", "PHP", "PKR", "PLN", "QAR", "RON", "RWF",
  "SAR", "SEK", "SGD", "THB", "TRY", "TWD", "TZS", "UAH", "UGX", "VND",
  "XAF", "XOF", "ZAR", "ZMW",
];

interface DayEntry {
  date: string;
  rates: Record<string, number>;
}

interface CurrencyApiResponse {
  meta?: { last_updated_at?: string };
  data?: Record<string, { code: string; value: number }>;
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function eachDayBetween(start: string, end: string): string[] {
  const out: string[] = [];
  const cur = new Date(start + "T00:00:00Z");
  const stop = new Date(end + "T00:00:00Z");
  while (cur < stop) {
    out.push(toISODate(cur));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

async function fetchDay(apiKey: string, date: string, currencies: string[]): Promise<DayEntry | null> {
  const url = `${API_BASE}?apikey=${apiKey}&base_currency=USD&date=${date}&currencies=${currencies.join(",")}`;
  const res = await fetch(url);
  if (!res.ok) {
    process.stderr.write(`  ! ${date} HTTP ${res.status}\n`);
    return null;
  }
  const json = (await res.json()) as CurrencyApiResponse;
  const rates: Record<string, number> = {};
  for (const [code, entry] of Object.entries(json.data ?? {})) {
    if (typeof entry.value === "number" && entry.value > 0) rates[code] = entry.value;
  }
  if (Object.keys(rates).length === 0) return null;
  return { date, rates };
}

async function main(): Promise<void> {
  const apiKey = process.env.CURRENCY_API_KEY?.trim();
  if (!apiKey) {
    process.stderr.write("CURRENCY_API_KEY not set\n");
    process.exit(1);
  }

  const raw = fs.readFileSync(HISTORY_PATH, "utf8");
  const existing = JSON.parse(raw) as DayEntry[];
  const existingDates = new Set(existing.map((d) => d.date));
  const earliestExisting = existing.length > 0 ? existing[0].date : toISODate(new Date());

  process.stdout.write(`History: ${existing.length} days from ${earliestExisting} to ${existing.at(-1)?.date}\n`);
  process.stdout.write(`Backfilling ${START_DATE} -> ${earliestExisting}\n`);

  const dates = eachDayBetween(START_DATE, earliestExisting).filter((d) => !existingDates.has(d));
  process.stdout.write(`Dates to fetch: ${dates.length}\n`);

  const backfilled: DayEntry[] = [];
  let okCount = 0;
  let failCount = 0;
  for (const date of dates) {
    const entry = await fetchDay(apiKey, date, CURRENCIES);
    if (entry) {
      backfilled.push(entry);
      okCount += 1;
    } else {
      failCount += 1;
    }
    if ((okCount + failCount) % 50 === 0) {
      process.stdout.write(`  ${okCount + failCount}/${dates.length} (ok ${okCount}, fail ${failCount})\n`);
    }
    await delay(REQUEST_DELAY_MS);
  }

  const merged: DayEntry[] = [...backfilled, ...existing].sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  fs.writeFileSync(HISTORY_PATH, JSON.stringify(merged));
  process.stdout.write(`\nDone. Days: ${existing.length} -> ${merged.length} (added ${backfilled.length}, ${failCount} failures)\n`);
  process.stdout.write(`Range: ${merged[0].date} -> ${merged.at(-1)?.date}\n`);
}

main().catch((err) => {
  process.stderr.write(String(err) + "\n");
  process.exit(1);
});
