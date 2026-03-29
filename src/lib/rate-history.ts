/**
 * rate-history.ts
 *
 * Reads pre-computed rate insights from rate-insights.json (built by
 * scripts/build-rate-insights.ts). Uses static import so it works on Vercel.
 */

import insightsData from "@/data/scraped/rate-insights.json";
import midmarketHistoryData from "@/data/scraped/midmarket-history.json";

// ── Types ──────────────────────────────────────────────────────

export interface ProviderDayData {
  rate: number;
  fee: number;
  markup: number;
  receiveAmount: number;
}

export interface DayEntry {
  date: string;
  providers: Record<string, ProviderDayData>;
}

export type RateLevel = "low" | "typical" | "good" | "great";

export interface RateInsight {
  corridor: string;
  totalDays: number;
  dateRange: { from: string; to: string };
  today: {
    bestProvider: string;
    bestRate: number;
    bestReceiveAmount: number;
  };
  stats: {
    avgRate: number;
    bestRate: number;
    bestRateDate: string;
    bestRateProvider: string;
    worstRate: number;
    worstRateDate: string;
    worstRateProvider: string;
  };
  level: RateLevel;
  levelPct: number;
  providerBadges: ProviderBadge[];
  sparklines: Record<string, SparklinePoint[]>;
}

export interface ProviderBadge {
  providerSlug: string;
  type: "best-rate" | "most-improved" | "most-consistent" | "worst-markup";
  label: string;
  detail: string;
}

export interface SparklinePoint {
  date: string;
  rate: number;
  receiveAmount: number;
}

// ── Core ───────────────────────────────────────────────────────

const insights = insightsData as Record<string, RateInsight>;

export function getRateInsight(
  fromCurrency: string,
  toCurrency: string
): RateInsight | null {
  return insights[`${fromCurrency}-${toCurrency}`] ?? null;
}

// ── Per-provider insights ──────────────────────────────────────

export interface ProviderInsight {
  avgRate: number;
  minRate: number;
  maxRate: number;
  currentRate: number;
  trendPct: number;
  trendDirection: "up" | "down" | "stable";
  daysTracked: number;
  currentVsAvg: number;
}

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

/** Convert corridor key "USD-INR" to URL slug "usd-to-inr" */
export function corridorToSlug(corridor: string): string {
  const [from, to] = corridor.split("-");
  return `${from.toLowerCase()}-to-${to.toLowerCase()}`;
}

/** Convert URL slug "usd-to-inr" to corridor key "USD-INR" */
export function slugToCorridor(slug: string): string {
  const [from, to] = slug.split("-to-");
  return `${from.toUpperCase()}-${to.toUpperCase()}`;
}

// ── Helpers ────────────────────────────────────────────────────

export function rateLevelConfig(level: RateLevel) {
  const config = {
    great: { label: "Great", color: "var(--color-success)", bg: "var(--color-success-surface)", icon: "↑" },
    good: { label: "Good", color: "var(--color-primary)", bg: "var(--color-primary-surface)", icon: "↗" },
    typical: { label: "Typical", color: "var(--color-warning)", bg: "var(--color-warning-surface)", icon: "→" },
    low: { label: "Low", color: "var(--color-danger)", bg: "var(--color-danger-surface)", icon: "↓" },
  };
  return config[level];
}

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
