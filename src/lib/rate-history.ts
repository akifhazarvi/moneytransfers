/**
 * rate-history.ts
 *
 * Reads pre-computed rate insights from rate-insights.json (built by
 * scripts/build-rate-insights.ts). Uses static import so it works on Vercel.
 */

import insightsData from "@/data/scraped/rate-insights.json";

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

// ── Helpers ────────────────────────────────────────────────────

export function rateLevelConfig(level: RateLevel) {
  const config = {
    great: { label: "Great", color: "#0d652d", bg: "#e6f4ea", icon: "↑" },
    good: { label: "Good", color: "#1a73e8", bg: "#e8f0fe", icon: "↗" },
    typical: { label: "Typical", color: "#e37400", bg: "#fef7e0", icon: "→" },
    low: { label: "Low", color: "#c5221f", bg: "#fce8e6", icon: "↓" },
  };
  return config[level];
}
