/**
 * rate-history.ts
 *
 * Reads pre-computed rate insights from rate-insights.json (built by
 * scripts/build-rate-insights.ts). Uses static import so it works on Vercel.
 */

import insightsData from "@/data/scraped/rate-insights.json";
import midmarketHistoryData from "@/data/scraped/midmarket-history.json";
import type {
  RateInsight,
  ProviderInsight,
  SparklinePoint,
} from "./rate-history-types";

// Types + pure helpers live in the dataless ./rate-history-types module so
// client components can use them without pulling these datasets into the bundle.
// This file (with the static JSON imports) must stay server-side only.
export * from "./rate-history-types";

// ── Core ───────────────────────────────────────────────────────

const insights = insightsData as Record<string, RateInsight>;

export function getRateInsight(
  fromCurrency: string,
  toCurrency: string
): RateInsight | null {
  return insights[`${fromCurrency}-${toCurrency}`] ?? null;
}

/**
 * Pick the single strongest corridor to feature in the "Rate of the Month" bar.
 * Restricted to a caller-supplied allowlist of pairs that have a real, indexable
 * /exchange-rates/[pair] page, so the link is always valid and SEO-safe.
 * Ranks by rate level (great > good > typical > low) then by levelPct.
 * Returns null if nothing qualifies (the bar then doesn't render).
 *
 * @param allowedPairs slugs like "usd-to-inr" (matching SITEMAP_RATE_PAIR_SLUGS)
 * @param minLevel only feature corridors at this level or better (default "good")
 */
export function getRateOfTheMonth(
  allowedPairs: string[],
  minLevel: "good" | "great" = "good"
): { pairSlug: string; corridor: string; from: string; to: string; insight: RateInsight } | null {
  const rank: Record<string, number> = { great: 3, good: 2, typical: 1, low: 0 };
  const threshold = rank[minLevel];

  const candidates = allowedPairs
    .map((slug) => {
      const [from, to] = slug.split("-to-").map((s) => s.toUpperCase());
      const insight = insights[`${from}-${to}`];
      if (!insight) return null;
      if (rank[insight.level] < threshold) return null;
      return { pairSlug: slug, corridor: `${from}-${to}`, from, to, insight };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (candidates.length === 0) return null;

  candidates.sort(
    (a, b) =>
      rank[b.insight.level] - rank[a.insight.level] ||
      b.insight.levelPct - a.insight.levelPct
  );
  return candidates[0];
}

// ── Per-provider insights ──────────────────────────────────────

export function getProviderInsight(
  fromCurrency: string,
  toCurrency: string,
  providerSlug: string
): ProviderInsight | null {
  const insight = getRateInsight(fromCurrency, toCurrency);
  if (!insight) return null;
  const points = insight.sparklines[providerSlug];
  if (!points || points.length < 2) return null;

  const rates = points.map((p) => p.rate);
  const avg = rates.reduce((s, r) => s + r, 0) / rates.length;
  const current = rates[rates.length - 1];
  const first = rates[0];
  const trendPct = first > 0 ? ((current - first) / first) * 100 : 0;
  const currentVsAvg = avg > 0 ? ((current - avg) / avg) * 100 : 0;

  return {
    avgRate: Math.round(avg * 10000) / 10000,
    minRate: Math.min(...rates),
    maxRate: Math.max(...rates),
    currentRate: current,
    trendPct: Math.round(trendPct * 100) / 100,
    trendDirection: Math.abs(trendPct) < 0.05 ? "stable" : trendPct > 0 ? "up" : "down",
    daysTracked: points.length,
    currentVsAvg: Math.round(currentVsAvg * 100) / 100,
  };
}

// ── All corridors ─────────────────────────────────────────────

/** Get all corridor insights, optionally filtered by minimum days */
export function getAllInsights(minDays = 2): RateInsight[] {
  return Object.values(insights).filter((i) => i.totalDays >= minDays);
}

/** Get insight by URL slug (e.g. "usd-to-inr") */
export function getInsightBySlug(slug: string): RateInsight | null {
  const [from, to] = slug.toUpperCase().split("-TO-");
  if (!from || !to) return null;
  return insights[`${from}-${to}`] ?? null;
}

// corridorToSlug, slugToCorridor, and rateLevelConfig moved to
// ./rate-history-types (re-exported above) so client code can use them without
// importing this module's datasets.

// ── Mid-market history ────────────────────────────────────────

const midmarketHistory = midmarketHistoryData as {
  currencies: string[];
  days: { date: string; rates: Record<string, number> }[];
};

/** All currencies that have mid-market history data */
export function getMidMarketCurrencies(): string[] {
  return midmarketHistory.currencies;
}

/** Get mid-market rate history for a currency pair (from/to vs USD base) */
export function getMidMarketHistory(from: string, to: string): SparklinePoint[] | null {
  if (midmarketHistory.days.length === 0) return null;

  const points: SparklinePoint[] = [];
  for (const day of midmarketHistory.days) {
    const fromRate = from === "USD" ? 1 : day.rates[from];
    const toRate = to === "USD" ? 1 : day.rates[to];
    if (!fromRate || !toRate) continue;
    const rate = Math.round((toRate / fromRate) * 1000000) / 1000000;
    points.push({ date: day.date, rate, receiveAmount: rate * 100 });
  }

  return points.length > 0 ? points : null;
}

/** Check if a mid-market pair exists */
export function hasMidMarketPair(from: string, to: string): boolean {
  if (midmarketHistory.days.length === 0) return false;
  const latestDay = midmarketHistory.days[midmarketHistory.days.length - 1];
  const hasFrom = from === "USD" || from in latestDay.rates;
  const hasTo = to === "USD" || to in latestDay.rates;
  return hasFrom && hasTo;
}

/**
 * The only exchange-rates/history/[pair] slugs that resolve (HTTP 200).
 *
 * Scaled-content cleanup (2026-06-25): the route previously rendered all ~851
 * pairs as 200+noindex — none in the sitemap, only usd-to-gbp drawing any Bing
 * traffic (20 impr / 0 clicks). Google kept recrawling 850 dead shells. The
 * page now sets dynamicParams=false and generates only this major-pair set;
 * everything else 404s. Both the [pair] related-links and the /history hub
 * filter against this so no internal link points at a 404'd pair.
 */
export const KEEP_HISTORY_PAIRS = new Set<string>([
  // Major, liquid FX pairs only. Standalone rate-history charts for diaspora
  // corridors (NGN/INR/PKR/PHP/MXN etc.) were thin pages nothing organically
  // links to — the real value for those routes is the /send-money/* comparison
  // page, which carries its own live rate data. Those history charts 404.
  "usd-to-gbp", "gbp-to-usd",
  "eur-to-usd", "usd-to-eur",
  "gbp-to-eur", "eur-to-gbp",
  "aud-to-usd", "usd-to-aud",
  "usd-to-cad", "cad-to-usd",
  "usd-to-jpy", "eur-to-jpy",
  // Restored 2026-09-01: /es/exchange-rates/history/usd-to-hnl held position 1
  // with a click while its 301 target 404'd. Not a liquid major, but it ranks.
  "usd-to-hnl",
]);
