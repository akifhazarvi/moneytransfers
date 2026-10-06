/**
 * Prices a reader's provider choice against the comparison as archived that
 * day. Shared by scripts/build-reader-savings.ts (the frozen September study)
 * and scripts/build-reader-pulse.ts (the rolling figures on the reader pulse
 * card), so the two can never disagree on what a choice was worth.
 *
 * A "choice" is one GA4 `provider_clicked` user: one person picking one
 * provider for one corridor on one day. It is priced against the LAST snapshot
 * of that day at the send amount nearest $1,000 that at least three providers
 * quote.
 *
 * Row resolution mirrors scripts/aggregate-history.ts (source tiers, the
 * quote-integrity guards, TapTap's restated flat fees, lower-median among a
 * provider's same-tier rows) plus two rules the live engine applies that the
 * $100 history series does not need: RemitRoutes is gap-fill only, and
 * HIDDEN_PROVIDER_SLUGS never enter a pool. Change those rules there first.
 *
 * Choices that cannot be priced honestly are counted and named, never
 * silently dropped:
 *   - placeholder:   Wise on a Gulf-origin route. Until 2026-10-03 those rows
 *                    were the mid-market rate at $0 fee, written when Wise
 *                    returned no quote (Wise does not accept SAR as a source).
 *   - promo-rate:    a provider now hidden because its stored rate was a
 *                    first-transfer promotion (Unplex's BlendedRate, 2026-06-09
 *                    to 2026-09-26).
 *   - not-quoted:    the provider had no quote at the reference amount that day
 *                    (account-managed brokers, banks we only price elsewhere).
 *   - thin:          fewer than three providers quoted the corridor that day, so
 *                    there is no meaningful median to compare against.
 */

import fs from "fs";
import path from "path";
import { implausibilityReason, isSelfConsistent, unreadTapTapFee, GAP_FILL_TIER } from "../../src/lib/quote-integrity";
import { HIDDEN_PROVIDER_SLUGS } from "../../src/data/providers";
import { listSnapshotFiles, readSnapshot } from "./history-snapshots";
import type { NormalizedQuote } from "../../src/lib/unified-quotes";

export const HISTORY_DIR = "src/data/scraped/history";
const MIDMARKET = path.join(HISTORY_DIR, "midmarket-daily.json");

/** The amount every choice is normalised to when we total it. */
export const REFERENCE_USD = 1000;
/** A reference amount further than this from $1,000 is not comparable. */
export const REF_MIN_USD = 300;
export const REF_MAX_USD = 3000;
export const MIN_POOL = 3;
/** rank-quotes.ts treats payouts within 0.1% as a tie. */
export const TIE_BAND = 0.001;
/** Gulf-origin currencies where every "Wise" row was a placeholder. */
const GULF = new Set(["AED", "SAR", "KWD", "QAR", "OMR", "BHD"]);

// Mirrors SLUG_ALIASES in scripts/aggregate-history.ts.
const SLUG_ALIASES: Record<string, string> = {
  "world-remit": "worldremit",
  western_union: "western-union",
  westernunion: "western-union",
  "xe-money-transfer": "xe",
  "xe-money-transfer-fx": "xe",
  "revolut-money-transfer": "revolut",
  taptapsend: "taptap-send",
  "tap-tap-send": "taptap-send",
  "ria-money-transfer": "ria",
  "ria-financial": "ria",
  money_gram: "moneygram",
  "money-gram": "moneygram",
  "currency-fair": "currencyfair",
  "send-wave": "sendwave",
  "chase-bank": "chase",
  "state-bank-of-india": "sbi",
  "the-royal-bank-of-scotland": "rbs",
  "commonwealth-bank-of-australia": "commonwealth-bank",
  "national-australia-bank": "nab",
  "hsbc-australia": "hsbc",
  "lloyds-bank": "lloyds",
  "bank-of-scotland": "lloyds",
  "santander-uk": "santander",
  "starling-bank": "starling",
  "chase-us": "chase",
  "wells-fargo-expresssend": "wells-fargo",
};
export const normalizeSlug = (s: string) => SLUG_ALIASES[s] || s;

// Mirrors sourceTier() in scripts/aggregate-history.ts.
function sourceTier(source: string | undefined): number | null {
  const src = source ?? "";
  if (src === "compareremit") return null;
  if (/^(ofx-api|instarem-api|xoom-browser|taptapsend|wise-direct|ace-|ria-|remitly-|pandaremit|skyremit|lemfi|unplex)/.test(src)) return 1;
  if (src.startsWith("wise-comparison")) return 2;
  if (src.startsWith("monito")) return 3;
  if (src.startsWith("exiap")) return 4;
  if (src.startsWith("remitroutes")) return 5;
  return 9;
}

export interface RawQuote {
  providerSlug: string;
  providerType?: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  fee: number;
  exchangeRate: number;
  midMarketRate?: number;
  receiveAmount: number;
  source?: string;
}

export interface PoolQuote {
  slug: string;
  receive: number;
  fee: number;
  rate: number;
  markup: number;
  isBank: boolean;
}

export interface Pool {
  amount: number;
  amountUsd: number;
  quotes: PoolQuote[]; // best payout first
}

type MidDay = { date: string; rates: Record<string, number> };
export type MidRates = Map<string, Record<string, number>>;

export function loadMidmarketByDay(): MidRates {
  return new Map((JSON.parse(fs.readFileSync(MIDMARKET, "utf-8")) as MidDay[]).map((d) => [d.date, d.rates]));
}

const usdPer = (cur: string, rates?: Record<string, number>) =>
  cur === "USD" ? 1 : rates?.[cur] ? 1 / rates[cur] : NaN;

export const median = (xs: number[]) => {
  if (!xs.length) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
export const round = (n: number, dp = 2) => Math.round(n * 10 ** dp) / 10 ** dp;
export const per1000 = (pct: number) => round((pct / 100) * REFERENCE_USD, 2);

/** The comparison as archived for one corridor on one day, at ~$1,000. */
export function priceCorridor(rows: RawQuote[], rates: Record<string, number> | undefined): Pool | null {
  interface Cand extends PoolQuote { tier: number; consistent: boolean; amount: number }
  const cands: Cand[] = [];
  for (const q of rows) {
    const slug = normalizeSlug(q.providerSlug);
    if (HIDDEN_PROVIDER_SLUGS.has(slug)) continue;
    const tier = sourceTier(q.source);
    if (tier == null) continue;
    const rate = Number(q.exchangeRate) || 0;
    if (rate <= 0 || !(q.sendAmount > 0)) continue;
    const storedFee = q.source === "remitroutes-bridge" ? 0 : Math.max(0, Number(q.fee) || 0);
    const fee = storedFee || unreadTapTapFee({ source: q.source, sendCurrency: q.sendCurrency, receiveCurrency: q.receiveCurrency, fee: storedFee });
    const midFromDay = rates ? (rates[q.receiveCurrency] ?? (q.receiveCurrency === "USD" ? 1 : 0)) / (rates[q.sendCurrency] ?? (q.sendCurrency === "USD" ? 1 : NaN)) : 0;
    const mid = Number(q.midMarketRate) > 0 ? Number(q.midMarketRate) : Number.isFinite(midFromDay) ? midFromDay : 0;
    const markup = mid > 0 ? ((mid - rate) / mid) * 100 : 0;
    const receive = Math.max(0, q.sendAmount - fee) * rate;
    const asQuote = { source: q.source, sendCurrency: q.sendCurrency, receiveCurrency: q.receiveCurrency, sendAmount: q.sendAmount, fee, exchangeRate: rate, receiveAmount: receive, markup } as NormalizedQuote;
    if (implausibilityReason(asQuote, { beatsInterbankPct: -1.0 })) continue;
    cands.push({
      slug, tier, amount: q.sendAmount, receive, fee, rate, markup,
      consistent: isSelfConsistent({ ...asQuote, receiveAmount: Number(q.receiveAmount) || 0 } as NormalizedQuote),
      isBank: q.providerType === "bank",
    });
  }
  // RemitRoutes fills gaps only: never for a provider a better tier covers on
  // this corridor at any amount, and never for USD-origin Wise.
  const covered = new Set(cands.filter((c) => c.tier < GAP_FILL_TIER).map((c) => c.slug));
  const send = rows[0]?.sendCurrency;
  const usable = cands.filter((c) => c.tier < GAP_FILL_TIER || (!covered.has(c.slug) && !(c.slug === "wise" && send === "USD")));

  const providersAt = new Map<number, Set<string>>();
  for (const c of usable) {
    if (!providersAt.has(c.amount)) providersAt.set(c.amount, new Set());
    providersAt.get(c.amount)!.add(c.slug);
  }
  const unit = usdPer(send, rates);
  let best: { amount: number; dist: number; n: number } | null = null;
  for (const [amount, set] of providersAt) {
    if (set.size < MIN_POOL) continue;
    const usd = amount * unit;
    if (!(usd >= REF_MIN_USD && usd <= REF_MAX_USD)) continue;
    const dist = Math.abs(Math.log(usd / REFERENCE_USD));
    if (!best || dist < best.dist - 1e-9 || (Math.abs(dist - best.dist) < 1e-9 && set.size > best.n)) best = { amount, dist, n: set.size };
  }
  if (!best) return null;

  const bySlug = new Map<string, Cand[]>();
  for (const c of usable) if (c.amount === best.amount) (bySlug.get(c.slug) ?? bySlug.set(c.slug, []).get(c.slug)!).push(c);
  const quotes: PoolQuote[] = [];
  for (const [slug, list] of bySlug) {
    const top = Math.min(...list.map((c) => c.tier));
    let pool = list.filter((c) => c.tier === top);
    if (pool.some((c) => c.consistent)) pool = pool.filter((c) => c.consistent);
    pool.sort((a, b) => a.receive - b.receive);
    const pick = pool[Math.floor((pool.length - 1) / 2)];
    quotes.push({ slug, receive: pick.receive, fee: pick.fee, rate: pick.rate, markup: pick.markup, isBank: pool.some((c) => c.isBank) });
  }
  quotes.sort((a, b) => b.receive - a.receive);
  return { amount: best.amount, amountUsd: best.amount * unit, quotes };
}

/** The last snapshot file of each day in [from, to], keyed by YYYY-MM-DD. */
export function lastSnapshotByDate(from: string, to: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const f of listSnapshotFiles(HISTORY_DIR)) {
    const d = f.match(/quotes-(\d{4}-\d{2}-\d{2})/)?.[1];
    if (d && d >= from && d <= to) out.set(d, f); // sorted: last wins
  }
  return out;
}

/**
 * Prices every (date, corridor) pair in `needed` from that day's last
 * snapshot. Keys are `${date}|${corridor}`; a corridor absent from the
 * snapshot maps to null.
 */
export function loadPools(needed: Map<string, Set<string>>, lastFileByDate: Map<string, string>, mids: MidRates): Map<string, Pool | null> {
  const pools = new Map<string, Pool | null>();
  for (const [date, corridors] of [...needed].sort()) {
    const file = lastFileByDate.get(date);
    if (!file) continue;
    const rows = readSnapshot<RawQuote[]>(HISTORY_DIR, file);
    const byCorridor = new Map<string, RawQuote[]>();
    for (const q of rows) {
      const k = `${q.sendCurrency}-${q.receiveCurrency}`;
      if (corridors.has(k)) (byCorridor.get(k) ?? byCorridor.set(k, []).get(k)!).push(q);
    }
    for (const c of corridors) pools.set(`${date}|${c}`, byCorridor.has(c) ? priceCorridor(byCorridor.get(c)!, mids.get(date)) : null);
  }
  return pools;
}

export interface Choice { date: string; corridor: string; provider: string; users: number }
export type Reason = "placeholder" | "promo-rate" | "not-quoted" | "thin";
export interface Priced extends Choice {
  rank: number; n: number; refAmount: number;
  gainVsMedianPct: number; bestVsMedianPct: number; gapToBestPct: number; vsBankPct: number | null;
}

/** Prices each choice against its day's pool; names every one it cannot price. */
export function priceChoices(choices: Choice[], pools: Map<string, Pool | null>) {
  const priced: Priced[] = [];
  const excluded: Record<Reason, number> = { placeholder: 0, "promo-rate": 0, "not-quoted": 0, thin: 0 };
  const excludedByProvider: Record<string, Partial<Record<Reason, number>>> = {};
  const exclude = (r: Reason, provider: string, users: number) => {
    excluded[r] += users;
    (excludedByProvider[provider] ??= {})[r] = ((excludedByProvider[provider] ??= {})[r] ?? 0) + users;
  };

  for (const c of choices) {
    const send = c.corridor.slice(0, 3);
    if (c.provider === "wise" && GULF.has(send)) { exclude("placeholder", c.provider, c.users); continue; }
    if (HIDDEN_PROVIDER_SLUGS.has(c.provider)) { exclude("promo-rate", c.provider, c.users); continue; }
    const pool = pools.get(`${c.date}|${c.corridor}`);
    if (!pool || pool.quotes.length < MIN_POOL) { exclude("thin", c.provider, c.users); continue; }
    const chosen = pool.quotes.find((q) => q.slug === c.provider);
    if (!chosen) { exclude("not-quoted", c.provider, c.users); continue; }
    const receives = pool.quotes.map((q) => q.receive);
    const med = median(receives);
    const banks = pool.quotes.filter((q) => q.isBank).map((q) => q.receive);
    priced.push({
      ...c,
      rank: 1 + pool.quotes.filter((q) => q.receive > chosen.receive * (1 + TIE_BAND)).length,
      n: pool.quotes.length,
      refAmount: pool.amount,
      gainVsMedianPct: (chosen.receive / med - 1) * 100,
      bestVsMedianPct: (receives[0] / med - 1) * 100,
      gapToBestPct: (receives[0] / chosen.receive - 1) * 100,
      vsBankPct: banks.length ? (chosen.receive / median(banks) - 1) * 100 : null,
    });
  }
  return { priced, excluded, excludedByProvider };
}

// Expand by users so every statistic weights each choice once.
const expand = <T>(rows: { users: number }[], f: (r: never) => T) => rows.flatMap((r) => Array(r.users).fill(f(r as never)) as T[]);

export function summarise(rows: Priced[]) {
  const gains = expand(rows, (r: Priced) => r.gainVsMedianPct);
  const opp = expand(rows, (r: Priced) => r.bestVsMedianPct);
  const ranks = expand(rows, (r: Priced) => r.rank);
  const bank = expand(rows.filter((r) => r.vsBankPct != null), (r: Priced) => r.vsBankPct as number);
  const n = gains.length;
  return {
    pricedDecisions: n,
    medianGainVsMedianPct: round(median(gains), 2),
    medianGainVsMedianPer1000: per1000(median(gains)),
    totalVsMedianPer1000: round(gains.reduce((s, g) => s + (g / 100) * REFERENCE_USD, 0), 0),
    shareAboveMedian: round(gains.filter((g) => g > TIE_BAND * 100).length / n, 3),
    shareTopPayer: round(ranks.filter((r) => r === 1).length / n, 3),
    shareTop3: round(ranks.filter((r) => r <= 3).length / n, 3),
    medianOpportunityPct: round(median(opp), 2),
    medianOpportunityPer1000: per1000(median(opp)),
    bankDecisions: bank.length,
    medianVsBankPer1000: bank.length ? per1000(median(bank)) : null,
    totalVsBankPer1000: bank.length ? round(bank.reduce((s, g) => s + (g / 100) * REFERENCE_USD, 0), 0) : null,
  };
}
