/**
 * Builds src/data/research/reader-savings.json — the dataset behind
 * /guides/how-much-can-you-save-comparing-money-transfers.
 *
 * INPUT 1: src/data/research/reader-clicks.json, a frozen GA4 pull of
 * `provider_clicked` (client-side, China/Singapore excluded) as
 * day × corridor × provider → users. One row-user is one person choosing one
 * provider for one corridor on one day: a "decision".
 *
 * INPUT 2: the quote archive (history/quotes-*.json.gz). Each decision is
 * priced against the comparison as archived THAT day — not today's quotes —
 * at the send amount nearest $1,000 that at least three providers quote.
 *
 * The question it answers: did the provider a reader picked pay more or less
 * than the median provider on the same corridor that day, and by how much?
 *
 * Pricing rules — source tiers, integrity guards, the $1,000 reference pool
 * and the named exclusions (placeholder, promo-rate, not-quoted, thin) — live
 * in scripts/lib/reader-choice-pricing.ts, shared with build-reader-pulse.ts.
 *
 * Inputs are frozen, so this is run by hand when reader-clicks.json is
 * refreshed — not by the scrape workflows.
 *
 * Usage: npx tsx scripts/build-reader-savings.ts
 */

import fs from "fs";
import { PARALLEL_RATE_CURRENCIES } from "../src/lib/quote-integrity";
import {
  REFERENCE_USD, REF_MIN_USD, REF_MAX_USD, MIN_POOL, TIE_BAND,
  normalizeSlug, loadMidmarketByDay, median, round, lastSnapshotByDate, loadPools, priceChoices, summarise,
} from "./lib/reader-choice-pricing";

const IN = "src/data/research/reader-clicks.json";
const OUT = "src/data/research/reader-savings.json";

/** A corridor needs this many priced decisions for its own table row. */
const MIN_CORRIDOR_DECISIONS = 4;

// ── load ────────────────────────────────────────────────────────────────────
interface ClickFile {
  meta: Record<string, unknown> & { window: { from: string; to: string } };
  clicks: [string, string, string, number][];
  noCorridorByProvider: Record<string, number>;
  monthlyUsers: [string, number][];
  channelUsers: Record<string, number>;
  countryUsers: [string, number][];
  countryCount: number;
  searchQueries: [string, number, number][];
}
const input = JSON.parse(fs.readFileSync(IN, "utf-8")) as ClickFile;
const clicks = input.clicks.map(([date, corridor, provider, users]) => ({ date, corridor, provider: normalizeSlug(provider), users }));

const decisionsByCorridor = new Map<string, number>();
for (const c of clicks) decisionsByCorridor.set(c.corridor, (decisionsByCorridor.get(c.corridor) ?? 0) + c.users);
// Corridors priced on EVERY day of the window, not only on click days, so the
// "what comparing is worth here" figure is a 118-day median, not a handful.
const tracked = new Set([...decisionsByCorridor].filter(([, n]) => n >= 5).map(([c]) => c));

const lastFileByDate = lastSnapshotByDate(input.meta.window.from, input.meta.window.to);

const needed = new Map<string, Set<string>>();
for (const c of clicks) (needed.get(c.date) ?? needed.set(c.date, new Set()).get(c.date)!).add(c.corridor);
for (const d of lastFileByDate.keys()) for (const c of tracked) (needed.get(d) ?? needed.set(d, new Set()).get(d)!).add(c);
const pools = loadPools(needed, lastFileByDate, loadMidmarketByDay()); // `${date}|${corridor}`

// ── price each decision ─────────────────────────────────────────────────────
const { priced, excluded, excludedByProvider } = priceChoices(clicks, pools);

// ── corridor-level series over the whole window ─────────────────────────────
function corridorWindow(corridor: string) {
  const days: { date: string; amount: number; n: number; bestVsMedianPct: number; bestVsWorstPct: number; bestVsBankPct: number | null; best: string }[] = [];
  for (const [key, pool] of pools) {
    const [date, c] = key.split("|");
    if (c !== corridor || !pool || pool.quotes.length < MIN_POOL) continue;
    const r = pool.quotes.map((q) => q.receive);
    const banks = pool.quotes.filter((q) => q.isBank).map((q) => q.receive);
    days.push({
      date, amount: pool.amount, n: pool.quotes.length, best: pool.quotes[0].slug,
      bestVsMedianPct: (r[0] / median(r) - 1) * 100,
      bestVsWorstPct: (r[0] / r[r.length - 1] - 1) * 100,
      bestVsBankPct: banks.length ? (r[0] / median(banks) - 1) * 100 : null,
    });
  }
  days.sort((a, b) => a.date.localeCompare(b.date));
  return days;
}

const corridorRows = [...decisionsByCorridor]
  .map(([corridor, decisions]) => {
    const rows = priced.filter((p) => p.corridor === corridor);
    const chosen = new Map<string, number>();
    for (const c of clicks) if (c.corridor === corridor) chosen.set(c.provider, (chosen.get(c.provider) ?? 0) + c.users);
    const window = tracked.has(corridor) ? corridorWindow(corridor) : [];
    const leaders = new Map<string, number>();
    for (const d of window) leaders.set(d.best, (leaders.get(d.best) ?? 0) + 1);
    const bankDays = window.filter((d) => d.bestVsBankPct != null);
    const last = window[window.length - 1];
    const lastPool = last ? pools.get(`${last.date}|${corridor}`) : null;
    return {
      corridor,
      decisions,
      chosen: [...chosen].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([slug, users]) => ({ slug, users })),
      priced: rows.length ? summarise(rows) : null,
      window: window.length
        ? {
            days: window.length,
            referenceAmount: median(window.map((d) => d.amount)),
            medianProviders: Math.round(median(window.map((d) => d.n))),
            medianBestVsMedianPct: round(median(window.map((d) => d.bestVsMedianPct)), 2),
            medianBestVsWorstPct: round(median(window.map((d) => d.bestVsWorstPct)), 2),
            medianBestVsBankPct: bankDays.length >= 7 ? round(median(bankDays.map((d) => d.bestVsBankPct as number)), 2) : null,
            bankDays: bankDays.length,
            mostFrequentLeader: [...leaders].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([slug, days]) => ({ slug, days })),
            latest: lastPool
              ? {
                  date: last.date,
                  amount: lastPool.amount,
                  best: { slug: lastPool.quotes[0].slug, receive: round(lastPool.quotes[0].receive) },
                  median: round(median(lastPool.quotes.map((q) => q.receive))),
                  worst: { slug: lastPool.quotes[lastPool.quotes.length - 1].slug, receive: round(lastPool.quotes[lastPool.quotes.length - 1].receive) },
                  providers: lastPool.quotes.length,
                }
              : null,
          }
        : null,
    };
  })
  .sort((a, b) => b.decisions - a.decisions);

const providerRows = [...new Set(clicks.map((c) => c.provider))]
  .map((slug) => {
    const all = clicks.filter((c) => c.provider === slug).reduce((s, c) => s + c.users, 0);
    const rows = priced.filter((p) => p.provider === slug);
    return { slug, decisions: all, corridors: new Set(clicks.filter((c) => c.provider === slug).map((c) => c.corridor)).size, priced: rows.length ? summarise(rows) : null };
  })
  .sort((a, b) => b.decisions - a.decisions);

const totalDecisions = clicks.reduce((s, c) => s + c.users, 0);
const noCorridor = Object.values(input.noCorridorByProvider).reduce((s, n) => s + n, 0);
const out = {
  generatedAt: new Date().toISOString().slice(0, 10),
  method: {
    referenceUsd: REFERENCE_USD,
    referenceRangeUsd: [REF_MIN_USD, REF_MAX_USD],
    minProviders: MIN_POOL,
    tieBandPct: TIE_BAND * 100,
    minCorridorDecisions: MIN_CORRIDOR_DECISIONS,
    snapshotsUsed: lastFileByDate.size,
  },
  clicksMeta: input.meta,
  totals: {
    decisions: totalDecisions,
    decisionsWithoutCorridor: noCorridor,
    corridors: decisionsByCorridor.size,
    providersChosen: new Set(clicks.map((c) => c.provider)).size,
    excluded,
    excludedByProvider,
    ...summarise(priced),
  },
  // Where the official rate is not the rate people trade at (USD→ETB, GBP→NGN),
  // providers' payouts spread far wider, so a handful of decisions can carry the
  // total. The page reports both so neither figure leans on those corridors.
  totalsExParallel: summarise(
    priced.filter((p) => !PARALLEL_RATE_CURRENCIES.has(p.corridor.slice(0, 3)) && !PARALLEL_RATE_CURRENCIES.has(p.corridor.slice(4))),
  ),
  corridors: corridorRows,
  providers: providerRows,
  monthlyUsers: input.monthlyUsers,
  channelUsers: input.channelUsers,
  countryUsers: input.countryUsers,
  countryCount: input.countryCount,
  searchQueries: input.searchQueries,
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
console.log(`Wrote ${OUT}: ${totalDecisions} decisions, ${out.totals.pricedDecisions} priced, excluded ${JSON.stringify(excluded)}`);
console.log(JSON.stringify({ ...out.totals, excludedByProvider: undefined }, null, 1));
