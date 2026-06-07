/**
 * exchange-rates-today.ts
 *
 * SERVER-ONLY helper for the /exchange-rates page. Reads the pre-built
 * midmarket-history.json (365 days × 65 currencies, base USD) and derives
 * today's mid-market rates, day-over-day + week + year change, and a
 * downsampled sparkline for each currency pair.
 *
 * The whole point: render this as real text/tables on the server so AI
 * crawlers (ChatGPT, Perplexity, Gemini) and Bing can read the rates without
 * executing JavaScript. The client LiveRatesBoard stays for the live ticker,
 * but it is no longer the only source of rate content.
 *
 * Static JSON import → works on Vercel, no runtime fetch. Keep this file
 * server-side only (the dataset is ~450 KB).
 */

import midmarketHistoryData from "@/data/scraped/midmarket-history.json";
import { getRateInsight } from "./rate-history";

const history = midmarketHistoryData as {
  currencies: string[];
  days: { date: string; rates: Record<string, number> }[];
};

export interface PairRate {
  from: string;
  to: string;
  rate: number;           // 1 `from` = rate `to`, mid-market
  changePct24h: number;   // vs previous day, %
  changePct7d: number;    // vs 7 days ago, %
  changePct1y: number;    // vs ~365 days ago, %
  direction24h: "up" | "down" | "flat";
  sparkline: { date: string; rate: number }[]; // downsampled 90-day line
}

export const RATES_AS_OF = history.days.length
  ? history.days[history.days.length - 1].date
  : "";

function rateOn(day: { rates: Record<string, number> }, from: string, to: string): number | null {
  const fr = from === "USD" ? 1 : day.rates[from];
  const tr = to === "USD" ? 1 : day.rates[to];
  if (!fr || !tr) return null;
  return tr / fr;
}

function pct(now: number, then: number | null): number {
  if (!then || then <= 0) return 0;
  return Math.round(((now - then) / then) * 10000) / 100; // 2 dp
}

/** Compute a full PairRate for a currency pair. Returns null if data missing. */
export function getPairRate(from: string, to: string): PairRate | null {
  const days = history.days;
  if (days.length < 2) return null;

  const last = days[days.length - 1];
  const rate = rateOn(last, from, to);
  if (rate === null) return null;

  const prev = days[days.length - 2];
  const week = days[Math.max(0, days.length - 8)];
  const year = days[0];

  const rPrev = rateOn(prev, from, to);
  const rWeek = rateOn(week, from, to);
  const rYear = rateOn(year, from, to);

  const changePct24h = pct(rate, rPrev);

  // Downsample to ~90 evenly-spaced points for a clean, light sparkline.
  const window = days.slice(Math.max(0, days.length - 90));
  const step = Math.max(1, Math.ceil(window.length / 90));
  const sparkline: { date: string; rate: number }[] = [];
  for (let i = 0; i < window.length; i += step) {
    const r = rateOn(window[i], from, to);
    if (r !== null) sparkline.push({ date: window[i].date, rate: Math.round(r * 1e6) / 1e6 });
  }
  // Always include the final day
  if (sparkline.length === 0 || sparkline[sparkline.length - 1].date !== last.date) {
    sparkline.push({ date: last.date, rate: Math.round(rate * 1e6) / 1e6 });
  }

  return {
    from,
    to,
    rate: Math.round(rate * 1e6) / 1e6,
    changePct24h,
    changePct7d: pct(rate, rWeek),
    changePct1y: pct(rate, rYear),
    direction24h: changePct24h > 0.005 ? "up" : changePct24h < -0.005 ? "down" : "flat",
    sparkline,
  };
}

/** Format a rate with sensible precision for its magnitude. */
export function formatRate(rate: number): string {
  if (rate >= 1000) return rate.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (rate >= 100) return rate.toFixed(2);
  if (rate >= 1) return rate.toFixed(4);
  return rate.toFixed(4);
}

/** All currencies present in the history dataset (for the full expandable table). */
export function getHistoryCurrencies(): string[] {
  return history.currencies;
}

// ── Provider best-rate overlay ─────────────────────────────────

export interface BestProvider {
  slug: string;            // provider slug, e.g. "wise"
  rate: number;            // provider's exchange rate for the corridor
  receiveAmount: number;   // amount recipient gets on a SEND_AMOUNT send
  markupPct: number;       // how far below mid-market, % (0 = at mid-market)
  level: "low" | "typical" | "good" | "great";
}

/** Standard send amount used for "you receive" payout figures. */
export const SEND_AMOUNT = 1000;

/**
 * Best provider for a corridor today, with the actual rate, payout on a
 * SEND_AMOUNT send, and how far that rate sits below the mid-market rate.
 * Pulls from the pre-built rate-insights.json. Returns null if no provider
 * data exists for the pair.
 */
export function getBestProvider(from: string, to: string): BestProvider | null {
  const insight = getRateInsight(from, to);
  if (!insight) return null;

  const { bestProvider, bestRate, bestReceiveAmount } = insight.today;
  if (!bestProvider || !bestRate) return null;

  const mid = getPairRate(from, to)?.rate ?? bestRate;
  // Provider rate below mid-market → positive markup. Cash-payout services
  // can occasionally beat the aggregate mid via promo rates, so clamp at 0.
  const markupPct = mid > 0 ? Math.max(0, ((mid - bestRate) / mid) * 100) : 0;

  return {
    slug: bestProvider,
    rate: bestRate,
    receiveAmount: bestReceiveAmount || bestRate * SEND_AMOUNT,
    markupPct: Math.round(markupPct * 100) / 100,
    level: insight.level,
  };
}

// ── "Good time to send?" verdict ───────────────────────────────

export interface SendVerdict {
  from: string;
  to: string;
  amount: number;
  level: "low" | "typical" | "good" | "great";
  levelPct: number;          // today's rate beats this % of tracked days
  daysTracked: number;
  bestProviderSlug: string;
  bestRate: number;
  receiveNow: number;        // payout for `amount` at today's best rate
  receiveBest: number;       // payout if it were the best day in the window
  receiveWorst: number;      // payout on the worst day in the window
  rangePos: number;          // 0 (worst) .. 1 (best) — today's spot on the bar
  bestRateDate: string;
  worstRateDate: string;
}

/**
 * The hero answer: is now a good time to send, how much you get, and how that
 * compares to the best/worst day we've tracked. Pure longitudinal insight —
 * the thing competitors can't show. Returns null if no provider history.
 */
export function getSendVerdict(from: string, to: string, amount: number): SendVerdict | null {
  const insight = getRateInsight(from, to);
  if (!insight) return null;

  const { today, stats, level, levelPct, totalDays } = insight;
  if (!today?.bestProvider || !today.bestRate) return null;

  // Per-unit receive = today's payout on the standard send, scaled to `amount`.
  const perUnit = today.bestReceiveAmount
    ? today.bestReceiveAmount / SEND_AMOUNT
    : today.bestRate;

  const receiveNow = perUnit * amount;
  // Scale the window's best/worst rate by the same fee-inclusive ratio.
  const feeRatio = today.bestRate > 0 ? perUnit / today.bestRate : 1;
  const receiveBest = stats.bestRate * feeRatio * amount;
  const receiveWorst = stats.worstRate * feeRatio * amount;

  const span = stats.bestRate - stats.worstRate;
  const rangePos = span > 0 ? Math.min(1, Math.max(0, (today.bestRate - stats.worstRate) / span)) : 0.5;

  return {
    from,
    to,
    amount,
    level,
    levelPct,
    daysTracked: totalDays,
    bestProviderSlug: today.bestProvider,
    bestRate: today.bestRate,
    receiveNow: Math.round(receiveNow),
    receiveBest: Math.round(receiveBest),
    receiveWorst: Math.round(receiveWorst),
    rangePos,
    bestRateDate: stats.bestRateDate,
    worstRateDate: stats.worstRateDate,
  };
}
