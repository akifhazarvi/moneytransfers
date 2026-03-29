/**
 * rate-history.ts
 *
 * Reads per-corridor historical data from history/corridors/{FROM}-{TO}.json
 * and computes Google Flights-style rate insights:
 *  - Current rate vs 30-day avg/best/worst
 *  - Rate level indicator (low / typical / good / great)
 *  - Per-provider badges (best X of Y days, most improved, etc.)
 *  - Sparkline data points for mini charts
 */

import fs from "fs";
import path from "path";

const CORRIDORS_DIR = path.join(
  process.cwd(),
  "src/data/scraped/history/corridors"
);

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
  corridor: string; // "USD-INR"
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
  levelPct: number; // 0-100, where today's best sits in the range
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

export function getCorridorHistory(
  fromCurrency: string,
  toCurrency: string
): DayEntry[] | null {
  const filePath = path.join(CORRIDORS_DIR, `${fromCurrency}-${toCurrency}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

export function getRateInsight(
  fromCurrency: string,
  toCurrency: string
): RateInsight | null {
  const history = getCorridorHistory(fromCurrency, toCurrency);
  if (!history || history.length < 2) return null;

  const corridor = `${fromCurrency}-${toCurrency}`;
  const latestDay = history[history.length - 1];

  // Find today's best provider by receiveAmount (what matters to users)
  const todayProviders = Object.entries(latestDay.providers);
  if (todayProviders.length === 0) return null;

  const todayBest = todayProviders.reduce((best, [slug, data]) =>
    data.receiveAmount > best[1].receiveAmount ? [slug, data] : best
  );

  // Compute stats across all days — best rate per day (by receiveAmount)
  const dailyBestRates: { date: string; rate: number; provider: string; receiveAmount: number }[] = [];

  for (const day of history) {
    const entries = Object.entries(day.providers);
    if (entries.length === 0) continue;
    const best = entries.reduce((b, [slug, d]) =>
      d.receiveAmount > b[1].receiveAmount ? [slug, d] : b
    );
    dailyBestRates.push({
      date: day.date,
      rate: best[1].rate,
      provider: best[0],
      receiveAmount: best[1].receiveAmount,
    });
  }

  if (dailyBestRates.length < 2) return null;

  const avgRate =
    dailyBestRates.reduce((s, d) => s + d.rate, 0) / dailyBestRates.length;
  const bestDay = dailyBestRates.reduce((b, d) =>
    d.receiveAmount > b.receiveAmount ? d : b
  );
  const worstDay = dailyBestRates.reduce((w, d) =>
    d.receiveAmount < w.receiveAmount ? d : w
  );

  // Rate level: where does today sit in the min-max range?
  const range = bestDay.receiveAmount - worstDay.receiveAmount;
  const todayPos = range > 0
    ? ((todayBest[1].receiveAmount - worstDay.receiveAmount) / range) * 100
    : 50;

  const level: RateLevel =
    todayPos >= 75 ? "great" : todayPos >= 50 ? "good" : todayPos >= 25 ? "typical" : "low";

  // Provider badges
  const providerBadges = computeProviderBadges(history);

  // Sparklines: rate over time per provider
  const sparklines: Record<string, SparklinePoint[]> = {};
  const allProviders = new Set<string>();
  for (const day of history) {
    for (const slug of Object.keys(day.providers)) allProviders.add(slug);
  }
  for (const slug of allProviders) {
    sparklines[slug] = history
      .filter((d) => d.providers[slug])
      .map((d) => ({
        date: d.date,
        rate: d.providers[slug].rate,
        receiveAmount: d.providers[slug].receiveAmount,
      }));
  }

  return {
    corridor,
    totalDays: history.length,
    dateRange: {
      from: history[0].date,
      to: history[history.length - 1].date,
    },
    today: {
      bestProvider: todayBest[0],
      bestRate: todayBest[1].rate,
      bestReceiveAmount: todayBest[1].receiveAmount,
    },
    stats: {
      avgRate: Math.round(avgRate * 10000) / 10000,
      bestRate: bestDay.rate,
      bestRateDate: bestDay.date,
      bestRateProvider: bestDay.provider,
      worstRate: worstDay.rate,
      worstRateDate: worstDay.date,
      worstRateProvider: worstDay.provider,
    },
    level,
    levelPct: Math.round(todayPos),
    providerBadges,
    sparklines,
  };
}

// ── Provider Badges ────────────────────────────────────────────

function computeProviderBadges(history: DayEntry[]): ProviderBadge[] {
  const badges: ProviderBadge[] = [];
  const totalDays = history.length;

  // Count how many days each provider had the best receiveAmount
  const bestDayCount: Record<string, number> = {};
  // Track latest markup per provider for worst-markup badge
  const latestMarkup: Record<string, number> = {};
  // Track first and last rate for "most improved"
  const firstRate: Record<string, number> = {};
  const lastRate: Record<string, number> = {};

  for (const day of history) {
    const entries = Object.entries(day.providers);
    if (entries.length === 0) continue;

    const dayBestSlug = entries.reduce((b, [slug, d]) =>
      d.receiveAmount > b.receiveAmount ? { slug, ...d } : b
    , { slug: "", rate: 0, fee: 0, markup: 0, receiveAmount: 0 });

    bestDayCount[dayBestSlug.slug] = (bestDayCount[dayBestSlug.slug] || 0) + 1;

    for (const [slug, data] of entries) {
      latestMarkup[slug] = data.markup;
      if (!(slug in firstRate)) firstRate[slug] = data.rate;
      lastRate[slug] = data.rate;
    }
  }

  // Best rate badge — provider who was cheapest most days
  const bestSlug = Object.entries(bestDayCount).sort((a, b) => b[1] - a[1])[0];
  if (bestSlug) {
    badges.push({
      providerSlug: bestSlug[0],
      type: "best-rate",
      label: `Best rate ${bestSlug[1]} of ${totalDays} days`,
      detail: `Had the best receive amount on ${bestSlug[1]} out of the last ${totalDays} days tracked`,
    });
  }

  // Most improved — biggest positive rate change from first to last appearance
  let bestImprovement = { slug: "", pct: 0 };
  for (const [slug, first] of Object.entries(firstRate)) {
    const last = lastRate[slug];
    if (first > 0) {
      const pct = ((last - first) / first) * 100;
      if (pct > bestImprovement.pct) bestImprovement = { slug, pct };
    }
  }
  if (bestImprovement.pct > 0.1) {
    badges.push({
      providerSlug: bestImprovement.slug,
      type: "most-improved",
      label: `Rate up ${bestImprovement.pct.toFixed(1)}%`,
      detail: `Exchange rate improved by ${bestImprovement.pct.toFixed(1)}% over the tracking period`,
    });
  }

  // Most consistent — lowest rate variance (needs 3+ data points)
  const providerRates: Record<string, number[]> = {};
  for (const day of history) {
    for (const [slug, data] of Object.entries(day.providers)) {
      if (!providerRates[slug]) providerRates[slug] = [];
      providerRates[slug].push(data.rate);
    }
  }
  let mostConsistent = { slug: "", cv: Infinity };
  for (const [slug, rates] of Object.entries(providerRates)) {
    if (rates.length < 3) continue;
    const mean = rates.reduce((s, r) => s + r, 0) / rates.length;
    const variance = rates.reduce((s, r) => s + (r - mean) ** 2, 0) / rates.length;
    const cv = Math.sqrt(variance) / mean; // coefficient of variation
    if (cv < mostConsistent.cv) mostConsistent = { slug, cv };
  }
  if (mostConsistent.slug && mostConsistent.cv < Infinity) {
    badges.push({
      providerSlug: mostConsistent.slug,
      type: "most-consistent",
      label: "Most stable rate",
      detail: `Lowest rate variation over the tracking period (CV: ${(mostConsistent.cv * 100).toFixed(2)}%)`,
    });
  }

  // Worst markup — highest markup in the latest day
  const latestDay = history[history.length - 1];
  const worstMarkupEntry = Object.entries(latestDay.providers)
    .filter(([, d]) => d.markup > 0)
    .sort((a, b) => b[1].markup - a[1].markup)[0];
  if (worstMarkupEntry && worstMarkupEntry[1].markup > 1) {
    badges.push({
      providerSlug: worstMarkupEntry[0],
      type: "worst-markup",
      label: `${worstMarkupEntry[1].markup.toFixed(1)}% markup`,
      detail: `Highest exchange rate markup among tracked providers today`,
    });
  }

  return badges;
}

// ── Helpers ────────────────────────────────────────────────────

/** Get list of all corridor pairs that have history data */
export function getAvailableCorridors(): string[] {
  if (!fs.existsSync(CORRIDORS_DIR)) return [];
  return fs
    .readdirSync(CORRIDORS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

/** Format a rate level for display */
export function rateLevelConfig(level: RateLevel) {
  const config = {
    great: { label: "Great", color: "#0d652d", bg: "#e6f4ea", icon: "↑" },
    good: { label: "Good", color: "#1a73e8", bg: "#e8f0fe", icon: "↗" },
    typical: { label: "Typical", color: "#e37400", bg: "#fef7e0", icon: "→" },
    low: { label: "Low", color: "#c5221f", bg: "#fce8e6", icon: "↓" },
  };
  return config[level];
}
