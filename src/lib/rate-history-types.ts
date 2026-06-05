/**
 * rate-history-types.ts
 *
 * Dataless companion to rate-history.ts: types + pure helpers that carry NO
 * dependency on the multi-megabyte rate-insights.json / midmarket-history.json
 * datasets. Client components import from here so the datasets stay server-side
 * only (they live behind /api/rate-insight). Importing any value from
 * rate-history.ts itself would drag the whole JSON into the client bundle.
 */

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

// ── Pure helpers (no dataset dependency) ───────────────────────

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

export function rateLevelConfig(level: RateLevel) {
  const config = {
    great: { label: "Great", color: "var(--color-success)", bg: "var(--color-success-surface)", icon: "↑" },
    good: { label: "Good", color: "var(--color-primary)", bg: "var(--color-primary-surface)", icon: "↗" },
    typical: { label: "Typical", color: "var(--color-warning)", bg: "var(--color-warning-surface)", icon: "→" },
    low: { label: "Low", color: "var(--color-danger)", bg: "var(--color-danger-surface)", icon: "↓" },
  };
  return config[level];
}
