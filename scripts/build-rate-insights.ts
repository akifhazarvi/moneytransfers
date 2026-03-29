/**
 * build-rate-insights.ts
 *
 * Pre-computes rate insights for all corridor history files and writes
 * a single JSON file at src/data/scraped/rate-insights.json.
 *
 * This runs as part of the build pipeline so the data can be statically
 * imported (avoiding fs.readFileSync at runtime on Vercel).
 *
 * Usage: npx tsx scripts/build-rate-insights.ts
 */

import fs from "fs";
import path from "path";

const CORRIDORS_DIR = path.join("src/data/scraped/history/corridors");
const OUTPUT_PATH = path.join("src/data/scraped/rate-insights.json");

interface ProviderDayData {
  rate: number;
  fee: number;
  markup: number;
  receiveAmount: number;
}

interface DayEntry {
  date: string;
  providers: Record<string, ProviderDayData>;
}

interface SparklinePoint {
  date: string;
  rate: number;
  receiveAmount: number;
}

interface ProviderBadge {
  providerSlug: string;
  type: "best-rate" | "most-improved" | "most-consistent" | "worst-markup";
  label: string;
  detail: string;
}

type RateLevel = "low" | "typical" | "good" | "great";

interface RateInsight {
  corridor: string;
  totalDays: number;
  dateRange: { from: string; to: string };
  today: { bestProvider: string; bestRate: number; bestReceiveAmount: number };
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

function computeInsight(corridor: string, history: DayEntry[]): RateInsight | null {
  if (history.length < 2) return null;

  const latestDay = history[history.length - 1];
  const todayProviders = Object.entries(latestDay.providers);
  if (todayProviders.length === 0) return null;

  const todayBest = todayProviders.reduce((best, curr) =>
    curr[1].receiveAmount > best[1].receiveAmount ? curr : best
  );

  const dailyBestRates: { date: string; rate: number; provider: string; receiveAmount: number }[] = [];
  for (const day of history) {
    const entries = Object.entries(day.providers);
    if (entries.length === 0) continue;
    const best = entries.reduce((b, curr) =>
      curr[1].receiveAmount > b[1].receiveAmount ? curr : b
    );
    dailyBestRates.push({ date: day.date, rate: best[1].rate, provider: best[0], receiveAmount: best[1].receiveAmount });
  }

  if (dailyBestRates.length < 2) return null;

  const avgRate = dailyBestRates.reduce((s, d) => s + d.rate, 0) / dailyBestRates.length;
  const bestDay = dailyBestRates.reduce((b, d) => d.receiveAmount > b.receiveAmount ? d : b);
  const worstDay = dailyBestRates.reduce((w, d) => d.receiveAmount < w.receiveAmount ? d : w);

  const range = bestDay.receiveAmount - worstDay.receiveAmount;
  const todayPos = range > 0 ? ((todayBest[1].receiveAmount - worstDay.receiveAmount) / range) * 100 : 50;
  const level: RateLevel = todayPos >= 75 ? "great" : todayPos >= 50 ? "good" : todayPos >= 25 ? "typical" : "low";

  // Badges
  const badges: ProviderBadge[] = [];
  const totalDays = history.length;
  const bestDayCount: Record<string, number> = {};
  const firstRate: Record<string, number> = {};
  const lastRate: Record<string, number> = {};

  for (const day of history) {
    const entries = Object.entries(day.providers);
    if (entries.length === 0) continue;
    const dayBest = entries.reduce((b, [slug, d]) =>
      d.receiveAmount > b.receiveAmount ? { slug, ...d } : b
    , { slug: "", rate: 0, fee: 0, markup: 0, receiveAmount: 0 });
    bestDayCount[dayBest.slug] = (bestDayCount[dayBest.slug] || 0) + 1;
    for (const [slug, data] of entries) {
      if (!(slug in firstRate)) firstRate[slug] = data.rate;
      lastRate[slug] = data.rate;
    }
  }

  const bestSlug = Object.entries(bestDayCount).sort((a, b) => b[1] - a[1])[0];
  if (bestSlug) {
    badges.push({ providerSlug: bestSlug[0], type: "best-rate", label: `Best rate ${bestSlug[1]} of ${totalDays} days`, detail: `Had the best receive amount on ${bestSlug[1]} out of the last ${totalDays} days tracked` });
  }

  let bestImprovement = { slug: "", pct: 0 };
  for (const [slug, first] of Object.entries(firstRate)) {
    const last = lastRate[slug];
    if (first > 0) {
      const pct = ((last - first) / first) * 100;
      if (pct > bestImprovement.pct) bestImprovement = { slug, pct };
    }
  }
  if (bestImprovement.pct > 0.1) {
    badges.push({ providerSlug: bestImprovement.slug, type: "most-improved", label: `Rate up ${bestImprovement.pct.toFixed(1)}%`, detail: `Exchange rate improved by ${bestImprovement.pct.toFixed(1)}% over the tracking period` });
  }

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
    const cv = Math.sqrt(variance) / mean;
    if (cv < mostConsistent.cv) mostConsistent = { slug, cv };
  }
  if (mostConsistent.slug && mostConsistent.cv < Infinity) {
    badges.push({ providerSlug: mostConsistent.slug, type: "most-consistent", label: "Most stable rate", detail: `Lowest rate variation over the tracking period (CV: ${(mostConsistent.cv * 100).toFixed(2)}%)` });
  }

  const worstMarkupEntry = Object.entries(latestDay.providers).filter(([, d]) => d.markup > 0).sort((a, b) => b[1].markup - a[1].markup)[0];
  if (worstMarkupEntry && worstMarkupEntry[1].markup > 1) {
    badges.push({ providerSlug: worstMarkupEntry[0], type: "worst-markup", label: `${worstMarkupEntry[1].markup.toFixed(1)}% markup`, detail: `Highest exchange rate markup among tracked providers today` });
  }

  // Sparklines
  const sparklines: Record<string, SparklinePoint[]> = {};
  const allProviders = new Set<string>();
  for (const day of history) for (const slug of Object.keys(day.providers)) allProviders.add(slug);
  for (const slug of allProviders) {
    sparklines[slug] = history.filter(d => d.providers[slug]).map(d => ({
      date: d.date, rate: d.providers[slug].rate, receiveAmount: d.providers[slug].receiveAmount,
    }));
  }

  // Mid-market rate line: estimate from provider with lowest markup per day
  const midMarketLine: SparklinePoint[] = [];
  for (const day of history) {
    const entries = Object.entries(day.providers).filter(([, d]) => d.rate > 0);
    if (entries.length === 0) continue;
    // Find provider with lowest markup (closest to mid-market)
    const lowestMarkup = entries.reduce((best, [, d]) =>
      d.markup < best.markup ? d : best
    , { rate: 0, fee: 0, markup: Infinity, receiveAmount: 0 });
    // Derive mid-market: rate / (1 - markup/100)
    const midRate = lowestMarkup.markup > 0
      ? lowestMarkup.rate / (1 - lowestMarkup.markup / 100)
      : lowestMarkup.rate;
    midMarketLine.push({ date: day.date, rate: Math.round(midRate * 10000) / 10000, receiveAmount: 0 });
  }
  if (midMarketLine.length >= 2) {
    sparklines["__mid-market__"] = midMarketLine;
  }

  return {
    corridor, totalDays: history.length,
    dateRange: { from: history[0].date, to: history[history.length - 1].date },
    today: { bestProvider: todayBest[0], bestRate: todayBest[1].rate, bestReceiveAmount: todayBest[1].receiveAmount },
    stats: { avgRate: Math.round(avgRate * 10000) / 10000, bestRate: bestDay.rate, bestRateDate: bestDay.date, bestRateProvider: bestDay.provider, worstRate: worstDay.rate, worstRateDate: worstDay.date, worstRateProvider: worstDay.provider },
    level, levelPct: Math.round(todayPos), providerBadges: badges, sparklines,
  };
}

function main() {
  if (!fs.existsSync(CORRIDORS_DIR)) {
    console.log("No corridors directory — writing empty insights");
    fs.writeFileSync(OUTPUT_PATH, "{}");
    return;
  }

  const files = fs.readdirSync(CORRIDORS_DIR).filter(f => f.endsWith(".json"));
  const insights: Record<string, RateInsight> = {};

  for (const file of files) {
    const corridor = file.replace(".json", "");
    try {
      const history: DayEntry[] = JSON.parse(fs.readFileSync(path.join(CORRIDORS_DIR, file), "utf-8"));
      const insight = computeInsight(corridor, history);
      if (insight) insights[corridor] = insight;
    } catch {
      console.warn(`Warning: failed to parse ${file}`);
    }
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(insights));
  console.log(`Wrote ${Object.keys(insights).length} corridor insights to ${OUTPUT_PATH}`);
}

main();
