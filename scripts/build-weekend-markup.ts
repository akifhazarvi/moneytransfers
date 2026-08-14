/**
 * Builds src/data/scraped/weekend-markup.json — the dataset behind the
 * "does the day you send matter?" guide.
 *
 * For every archived quote snapshot we recover the provider's FX markup by
 * comparing its quoted rate against that day's real mid-market rate:
 *
 *   markup% = (mid - quoted) / mid * 100
 *
 * then group by the UTC weekday the quote was collected. The question this
 * answers is one AI assistants field constantly and nobody can source: does it
 * actually cost more to send money at the weekend?
 *
 * WHY PRECOMPUTED: the join reads ~278 snapshot files (hundreds of MB) against
 * 5 years of daily mid-market history — far too slow to run at build time the
 * way computeBankVsAppIndex does. This emits a few KB the page imports
 * directly, same pattern as build-rate-insights.ts.
 *
 * SAMPLING NOTE: snapshot COUNT is near-uniform across weekdays, but row counts
 * are not — different scrapers emit wildly different volumes and don't all run
 * on the same cadence, so Friday carries ~4x the rows of a typical day. Pooling
 * every row would let Friday dominate the aggregate. The headline weekday and
 * weekend figures are therefore the unweighted mean of the seven per-day means,
 * so each weekday counts once regardless of how many rows it contributed.
 * Per-provider figures compare a provider only against itself, so they are
 * unaffected by cross-provider volume differences.
 *
 * Usage: npx tsx scripts/build-weekend-markup.ts
 */

import * as fs from "fs";
import * as path from "path";

const SCRAPED = "src/data/scraped";
const HISTORY_DIR = path.join(SCRAPED, "history");
const MIDMARKET = path.join(SCRAPED, "history/midmarket-daily.json");
const OUT = path.join(SCRAPED, "weekend-markup.json");

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
const WEEKEND = ["Sat", "Sun"] as const;

// Guard against unit mismatches and bad rows rather than letting a single
// mis-scaled quote (e.g. rate quoted per 100 units) swing a provider's mean.
const MIN_MARKUP = -5;
const MAX_MARKUP = 25;
// A provider needs this many observations on BOTH sides before we report a
// weekend premium for it — below that the difference is noise.
const MIN_SIDE_N = 300;
// Providers whose MEAN markup exceeds this are quarantined rather than
// published. Legitimate retail FX markups top out around 4-5% (PayPal ~4.8%,
// BMO ~4.4% here); a double-digit mean is far more likely a bad upstream row
// than a real price. pnb-europe measures 19.4% — consistently, across
// snapshots, sourced from Monito (GBP->PHP quoted 66.85 against a mid of
// 82.64) — but naming a regulated bank as charging 19% on the strength of one
// unverified aggregator is a claim this dataset can't support. They stay in
// `quarantined` so the exclusion is visible and auditable rather than a silent
// filter, and can be promoted if a second source ever corroborates them.
const PUBLISHABLE_MAX_MEAN = 8;

interface MidDay { date: string; rates: Record<string, number> }
interface Quote {
  providerSlug?: string; provider?: string;
  sendCurrency?: string; receiveCurrency?: string;
  exchangeRate?: number; dateCollected?: string;
}

const mean = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const r2 = (n: number) => Math.round(n * 100) / 100;
const r3 = (n: number) => Math.round(n * 1000) / 1000;

function main(): void {
  const history = JSON.parse(fs.readFileSync(MIDMARKET, "utf-8")) as MidDay[];
  const midByDate = new Map(history.map((d) => [d.date, d.rates]));

  const midRate = (date: string, from: string, to: string): number | null => {
    const r = midByDate.get(date);
    if (!r) return null;
    const f = from === "USD" ? 1 : r[from];
    const t = to === "USD" ? 1 : r[to];
    if (!f || !t) return null;
    return t / f;
  };

  const files = fs.readdirSync(HISTORY_DIR).filter((f) => f.startsWith("quotes-") && f.endsWith(".json"));
  const byDow: Record<string, number[]> = {};
  const byProvDow: Record<string, Record<string, number[]>> = {};
  const snapshotDays = new Set<string>();
  let used = 0, skipped = 0;

  for (const file of files) {
    let arr: Quote[];
    try { arr = JSON.parse(fs.readFileSync(path.join(HISTORY_DIR, file), "utf-8")); } catch { continue; }
    if (!Array.isArray(arr)) continue;

    for (const q of arr) {
      const dc = q.dateCollected;
      if (!dc || !q.exchangeRate || !q.sendCurrency || !q.receiveCurrency) { skipped++; continue; }
      const date = dc.slice(0, 10);
      const mid = midRate(date, q.sendCurrency, q.receiveCurrency);
      if (!mid || mid <= 0) { skipped++; continue; }
      const markup = ((mid - q.exchangeRate) / mid) * 100;
      if (!isFinite(markup) || markup < MIN_MARKUP || markup > MAX_MARKUP) { skipped++; continue; }

      const dow = DOW[new Date(dc).getUTCDay()];
      (byDow[dow] ||= []).push(markup);
      const slug = q.providerSlug || q.provider || "unknown";
      ((byProvDow[slug] ||= {})[dow] ||= []).push(markup);
      snapshotDays.add(date);
      used++;
    }
  }

  const dayMeans: Record<string, number> = {};
  const byDayOfWeek = DOW.map((d) => {
    const a = byDow[d] ?? [];
    if (a.length) dayMeans[d] = mean(a);
    return { day: d, n: a.length, mean: a.length ? r3(mean(a)) : null, median: a.length ? r3(median(a)) : null };
  }).sort((a, b) => DOW.indexOf(a.day) - DOW.indexOf(b.day));

  // Unweighted across days — see SAMPLING NOTE above.
  const weekdayMean = mean(WEEKDAYS.map((d) => dayMeans[d]).filter((n) => n != null));
  const weekendMean = mean(WEEKEND.map((d) => dayMeans[d]).filter((n) => n != null));

  const scored = Object.entries(byProvDow)
    .map(([slug, m]) => {
      const wd = WEEKDAYS.flatMap((d) => m[d] ?? []);
      const we = WEEKEND.flatMap((d) => m[d] ?? []);
      if (wd.length < MIN_SIDE_N || we.length < MIN_SIDE_N) return null;
      const w = mean(wd), e = mean(we);
      return { slug, weekday: r2(w), weekend: r2(e), premiumPp: r2(e - w), n: wd.length + we.length };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.premiumPp - a.premiumPp);

  const providers = scored.filter((p) => Math.max(p.weekday, p.weekend) <= PUBLISHABLE_MAX_MEAN);
  const quarantined = scored.filter((p) => Math.max(p.weekday, p.weekend) > PUBLISHABLE_MAX_MEAN);

  const dates = [...snapshotDays].sort();
  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    dataRange: { from: dates[0], to: dates[dates.length - 1] },
    observations: used,
    skipped,
    snapshots: files.length,
    byDayOfWeek,
    weekdayMean: r3(weekdayMean),
    weekendMean: r3(weekendMean),
    weekendDeltaPp: r3(weekendMean - weekdayMean),
    minSideN: MIN_SIDE_N,
    publishableMaxMean: PUBLISHABLE_MAX_MEAN,
    providers,
    quarantined,
  };

  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log(
    `Wrote ${OUT}\n` +
      `  ${used.toLocaleString()} observations from ${files.length} snapshots (${out.dataRange.from} -> ${out.dataRange.to})\n` +
      `  weekday ${out.weekdayMean}%  weekend ${out.weekendMean}%  delta ${out.weekendDeltaPp}pp\n` +
      `  ${providers.length} providers published, ${quarantined.length} quarantined (mean >${PUBLISHABLE_MAX_MEAN}%)`,
  );
}

main();
