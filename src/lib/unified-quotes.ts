/**
 * Unified Quote Index
 *
 * Merges all scraped data sources into a single lookup with source priority:
 *   1. Direct provider scrape (first-party, most accurate)
 *   2. Monito comparison (multi-provider aggregator)
 *   3. Wise comparison API (broad but third-party)
 *   4. Fallback simulation (hardcoded markups)
 *
 * Also loads XE mid-market rates and Trustpilot ratings.
 */

// --- Raw data imports ---
import wiseQuotes from "@/data/scraped/provider-quotes.json";
import monitoQuotes from "@/data/scraped/monito-quotes.json";
import ofxQuotes from "@/data/scraped/ofx-quotes.json";
import instaremQuotes from "@/data/scraped/instarem-quotes.json";
import westernUnionQuotes from "@/data/scraped/western-union-quotes.json";
import revolutQuotes from "@/data/scraped/revolut-quotes.json";
import xoomQuotes from "@/data/scraped/xoom-quotes.json";
import worldremitQuotes from "@/data/scraped/worldremit-quotes.json";
import remitlyQuotes from "@/data/scraped/remitly-quotes.json";
import moneytransfersQuotes from "@/data/scraped/moneytransfers-quotes.json";
import remitfinderQuotes from "@/data/scraped/remitfinder-quotes.json";
import riaQuotes from "@/data/scraped/ria-quotes.json";
import xeTransferQuotes from "@/data/scraped/xe-transfer-quotes.json";
import taptapsendQuotes from "@/data/scraped/taptapsend-quotes.json";
import moneygramQuotes from "@/data/scraped/moneygram-quotes.json";
import wiseDirectQuotes from "@/data/scraped/wise-direct-quotes.json";
import exchangeratesUkQuotes from "@/data/scraped/exchangerates-uk-quotes.json";
// New direct scrapers (Priority 1)
import paysendQuotes from "@/data/scraped/paysend-quotes.json";
import skrillQuotes from "@/data/scraped/skrill-quotes.json";
import torfxQuotes from "@/data/scraped/torfx-quotes.json";
import aceQuotes from "@/data/scraped/ace-money-transfer-quotes.json";
import paypalQuotes from "@/data/scraped/paypal-quotes.json";
import currencyfairQuotes from "@/data/scraped/currencyfair-quotes.json";
import sendwaveQuotes from "@/data/scraped/sendwave-quotes.json";
import profeeQuotes from "@/data/scraped/profee-quotes.json";
import xeRatesData from "@/data/scraped/xe-midmarket-rates.json";
import trustpilotData from "@/data/scraped/trustpilot-ratings.json";

// --- Normalized quote interface ---
export interface NormalizedQuote {
  provider: string;
  providerSlug: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  fee: number;
  exchangeRate: number;
  receiveAmount: number;
  midMarketRate: number;
  markup: number; // percentage
  deliveryEstimate: string | null;
  source: string;
  sourcePriority: number; // lower = better (1=direct, 2=monito, 3=wise)
}

// --- Trustpilot ratings ---
export interface TrustpilotRating {
  slug: string;
  name: string;
  trustpilotDomain: string;
  score: number;
  totalReviews: number;
  ratingLabel: string;
  stars: number;
  dateCollected: string;
}

const trustpilotRatings = trustpilotData as TrustpilotRating[];

export const trustpilotIndex: Record<string, TrustpilotRating> = {};
for (const r of trustpilotRatings) {
  trustpilotIndex[r.slug] = r;
}

// --- XE mid-market rates (authoritative base rates) ---
const xeRates = xeRatesData as { baseCurrency: string; timestamp: string; rates: Record<string, number>; source: string };

export const midMarketRates: Record<string, number> = { USD: 1 };
if (xeRates.rates) {
  for (const [code, rate] of Object.entries(xeRates.rates)) {
    midMarketRates[code] = rate as number;
  }
}

export function getMidMarketRate(from: string, to: string): number {
  const fromRate = midMarketRates[from] || 1;
  const toRate = midMarketRates[to] || 1;
  return toRate / fromRate;
}

// --- Slug normalization ---
const SLUG_ALIASES: Record<string, string> = {
  "world-remit": "worldremit",
  "western_union": "western-union",
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
  "ace-money-transfer": "ace-money-transfer",
  "ace_money_transfer": "ace-money-transfer",
  "currency-fair": "currencyfair",
  "currency_fair": "currencyfair",
  "send-wave": "sendwave",
  "send_wave": "sendwave",
  "tor-fx": "torfx",
  "tor_fx": "torfx",
  "chase-bank": "chase",
  "state-bank-of-india": "sbi",
  "the-royal-bank-of-scotland": "rbs",
  "bank-of-america": "bank-of-america",
  "commonwealth-bank": "commonwealth-bank",
  "lloyds-bank": "lloyds",
  "bank-of-scotland": "lloyds",
};

function normalizeSlug(slug: string): string {
  return SLUG_ALIASES[slug] || slug;
}

// --- Normalize quotes from all sources ---
function normalizeQuote(
  raw: Record<string, unknown>,
  sourcePriority: number,
  defaultSource: string
): NormalizedQuote {
  const sendAmount = (raw.sendAmount as number) || 0;
  const fee = (raw.fee as number) || 0;
  const exchangeRate = (raw.exchangeRate as number) || 0;
  const receiveAmount = (raw.receiveAmount as number) || 0;
  const midMarket = (raw.midMarketRate as number) || 0;

  // Calculate markup if we have mid-market rate
  let markup = (raw.markup as number) || 0;
  if (!markup && midMarket > 0 && exchangeRate > 0) {
    markup = Math.round(((midMarket - exchangeRate) / midMarket) * 10000) / 100;
  }

  return {
    provider: (raw.provider as string) || "",
    providerSlug: normalizeSlug(
      (raw.providerSlug as string) || ""
    ),
    sendCurrency: (raw.sendCurrency as string) || "",
    receiveCurrency: (raw.receiveCurrency as string) || "",
    sendAmount,
    fee: Math.round(fee * 100) / 100,
    exchangeRate,
    receiveAmount: Math.round(receiveAmount * 100) / 100,
    midMarketRate: midMarket,
    markup,
    deliveryEstimate:
      (raw.deliveryEstimate as string) ||
      (raw.deliveryMethod as string) ||
      null,
    source: (raw.source as string) || defaultSource,
    sourcePriority,
  };
}

// --- Build unified index ---
// Key: "{sendCurrency}_{receiveCurrency}" → quotes[]
// Key: "{sendCurrency}_{receiveCurrency}_{amount}" → quotes[]

export const quotesByCorridor: Record<string, NormalizedQuote[]> = {};
export const quotesByCorridorAmount: Record<string, NormalizedQuote[]> = {};
export const allProviderSlugs = new Set<string>();
export const providerNames: Record<string, string> = {};

function addQuotes(
  rawQuotes: unknown[],
  sourcePriority: number,
  defaultSource: string
) {
  for (const raw of rawQuotes) {
    const q = normalizeQuote(raw as Record<string, unknown>, sourcePriority, defaultSource);
    if (!q.sendCurrency || !q.receiveCurrency || !q.providerSlug) continue;
    if (q.receiveAmount <= 0 && q.exchangeRate <= 0) continue;

    allProviderSlugs.add(q.providerSlug);
    if (q.provider && !providerNames[q.providerSlug]) {
      providerNames[q.providerSlug] = q.provider;
    }

    const corridorKey = `${q.sendCurrency}_${q.receiveCurrency}`;
    if (!quotesByCorridor[corridorKey]) quotesByCorridor[corridorKey] = [];
    quotesByCorridor[corridorKey].push(q);

    const amountKey = `${corridorKey}_${q.sendAmount}`;
    if (!quotesByCorridorAmount[amountKey]) quotesByCorridorAmount[amountKey] = [];
    quotesByCorridorAmount[amountKey].push(q);
  }
}

// Load sources in priority order (lower priority number = preferred)
// Priority 1: Direct provider scrapes (first-party, most accurate)
addQuotes(ofxQuotes as unknown[], 1, "ofx-api");
addQuotes(instaremQuotes as unknown[], 1, "instarem-api");
addQuotes(westernUnionQuotes as unknown[], 1, "western-union-browser");
addQuotes(revolutQuotes as unknown[], 1, "revolut-browser");
addQuotes(xoomQuotes as unknown[], 1, "xoom-browser");
addQuotes(worldremitQuotes as unknown[], 1, "worldremit-browser");
addQuotes(remitlyQuotes as unknown[], 1, "remitly-browser");
addQuotes(riaQuotes as unknown[], 1, "ria-browser");
addQuotes(xeTransferQuotes as unknown[], 1, "xe-transfer-browser");
addQuotes(taptapsendQuotes as unknown[], 1, "taptapsend-api");
addQuotes(moneygramQuotes as unknown[], 1, "moneygram-browser");
addQuotes(wiseDirectQuotes as unknown[], 1, "wise-direct-api");
// New direct scrapers
addQuotes(paysendQuotes as unknown[], 1, "paysend-direct");
addQuotes(skrillQuotes as unknown[], 1, "skrill-direct");
addQuotes(torfxQuotes as unknown[], 1, "torfx-direct");
addQuotes(aceQuotes as unknown[], 1, "ace-direct");
addQuotes(paypalQuotes as unknown[], 1, "paypal-direct");
addQuotes(currencyfairQuotes as unknown[], 1, "currencyfair-direct");
addQuotes(sendwaveQuotes as unknown[], 1, "sendwave-direct");
addQuotes(profeeQuotes as unknown[], 1, "profee-direct");

// Priority 2: Comparison aggregators (fallback when no direct scrape exists)
addQuotes(monitoQuotes as unknown[], 2, "monito-comparison");
addQuotes(moneytransfersQuotes as unknown[], 2, "moneytransfers-comparison");
addQuotes(remitfinderQuotes as unknown[], 2, "remitfinder-comparison");
addQuotes(exchangeratesUkQuotes as unknown[], 2, "exchangerates-uk");

// Priority 3: Wise comparison API (broadest coverage, last resort)
addQuotes(wiseQuotes as unknown[], 3, "wise-comparison");

// --- Deduplicate: for the same provider+corridor+amount, keep highest priority ---
function deduplicateQuotes(quotes: NormalizedQuote[]): NormalizedQuote[] {
  const best = new Map<string, NormalizedQuote>();
  for (const q of quotes) {
    const key = `${q.providerSlug}_${q.sendAmount}`;
    const existing = best.get(key);
    if (!existing || q.sourcePriority < existing.sourcePriority) {
      best.set(key, q);
    }
  }
  return Array.from(best.values());
}

// Deduplicate corridor-level index
for (const key of Object.keys(quotesByCorridor)) {
  quotesByCorridor[key] = deduplicateQuotes(quotesByCorridor[key]);
}

// Deduplicate corridor+amount index
for (const key of Object.keys(quotesByCorridorAmount)) {
  quotesByCorridorAmount[key] = deduplicateQuotes(quotesByCorridorAmount[key]);
}

// --- Available scraped amounts (for nearest-match lookup) ---
const allAmounts = new Set<number>();
for (const quotes of Object.values(quotesByCorridorAmount)) {
  for (const q of quotes) allAmounts.add(q.sendAmount);
}
export const SCRAPED_AMOUNTS = [...allAmounts].sort((a, b) => a - b);

export function findNearestAmount(target: number): number {
  if (SCRAPED_AMOUNTS.length === 0) return 1000;
  let closest = SCRAPED_AMOUNTS[0];
  let minDiff = Math.abs(target - closest);
  for (const amt of SCRAPED_AMOUNTS) {
    const diff = Math.abs(target - amt);
    if (diff < minDiff) {
      minDiff = diff;
      closest = amt;
    }
  }
  return closest;
}

