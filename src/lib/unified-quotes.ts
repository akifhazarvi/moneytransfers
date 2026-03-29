/**
 * Unified Quote Index
 *
 * Merges all scraped data sources into a single lookup with source priority:
 *   1. Direct provider scrape (OFX, Instarem, Xoom, TapTap Send, Wise, ACE)
 *   2. Wise Comparison API (8-18 competitors per corridor, pure API)
 *   2. Exiap / TheCurrencyShop (JSON-LD, US+UK+AU corridors)
 *   2. Monito comparison (covers 39 providers including Remitly, WU, Revolut, etc.)
 *
 * Also loads XE mid-market rates and Trustpilot ratings.
 */

// --- Raw data imports ---
import monitoQuotes from "@/data/scraped/monito-quotes.json";
import wiseComparisonQuotes from "@/data/scraped/wise-comparison-quotes.json";
import exiapQuotes from "@/data/scraped/exiap-quotes.json";
import ofxQuotes from "@/data/scraped/ofx-quotes.json";
import instaremQuotes from "@/data/scraped/instarem-quotes.json";
import xoomQuotes from "@/data/scraped/xoom-quotes.json";
import taptapsendQuotes from "@/data/scraped/taptapsend-quotes.json";
import wiseDirectQuotes from "@/data/scraped/wise-direct-quotes.json";
import aceQuotes from "@/data/scraped/ace-money-transfer-quotes.json";
import riaQuotes from "@/data/scraped/ria-quotes.json";
import remitlyQuotes from "@/data/scraped/remitly-quotes.json";
import compareremitQuotes from "@/data/scraped/compareremit-quotes.json";
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
  "commonwealth-bank-of-australia": "commonwealth-bank",
  "national-australia-bank": "nab",
  "hsbc-australia": "hsbc",
  "lloyds-bank": "lloyds",
  "bank-of-scotland": "lloyds",
  "santander-uk": "santander",
  "starling-bank": "starling",
  "deutsche-bank": "deutsche-bank",
  "currencies-direct": "currencies-direct",
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
addQuotes(xoomQuotes as unknown[], 1, "xoom-browser");
addQuotes(taptapsendQuotes as unknown[], 1, "taptapsend-api");
addQuotes(wiseDirectQuotes as unknown[], 1, "wise-direct-api");
addQuotes(aceQuotes as unknown[], 1, "ace-direct");
addQuotes(riaQuotes as unknown[], 1, "ria-browser");
addQuotes(remitlyQuotes as unknown[], 1, "remitly-browser");
addQuotes(compareremitQuotes as unknown[], 1, "compareremit-browser");

// Priority 2: Wise Comparison API (8-18 competitors per corridor, pure REST API)
addQuotes(wiseComparisonQuotes as unknown[], 2, "wise-comparison-api");

// Priority 2: Exiap / TheCurrencyShop (JSON-LD, US+UK+AU corridors)
addQuotes(exiapQuotes as unknown[], 2, "exiap");

// Priority 2: Monito comparison aggregator (covers 39 providers)
addQuotes(monitoQuotes as unknown[], 2, "monito-comparison");

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

