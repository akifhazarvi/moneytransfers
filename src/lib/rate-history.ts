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
