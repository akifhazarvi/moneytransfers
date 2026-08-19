/**
 * Unified Quote Index
 *
 * Merges all scraped data sources into a single lookup with source priority
 * (lower number wins the dedup for the same provider+corridor+amount):
 *   1. Direct provider scrape (OFX, Instarem, Xoom, TapTap Send, Wise, ACE, …)
 *   2. Wise Comparison API (8-18 competitors per corridor, pure API)
 *   3. Monito comparison (covers 39 providers including Remitly, WU, Revolut, etc.)
 *   4. Rest — Exiap / TheCurrencyShop (JSON-LD, US+UK+AU corridors), gap-fill only
 *   5. RemitRoutes bridge — extra banks (BNP Paribas, HSBC, Chase, Santander,
 *      BMO, NAB, Crédit Agricole, …) on corridors we thinly cover, gap-fill only.
 *      Crypto rails from the same source are handled separately in crypto-rails.ts.
 *
 * Also loads XE mid-market rates and Trustpilot ratings.
 */

// --- Raw data imports ---
import monitoQuotes from "@/data/scraped/monito-quotes.json";
import { implausibilityReason, isSelfConsistent, dropRateOutliers } from "@/lib/quote-integrity";
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
import pandaremitQuotes from "@/data/scraped/pandaremit-quotes.json";
import skyremitQuotes from "@/data/scraped/skyremit-quotes.json";
import lemfiQuotes from "@/data/scraped/lemfi-quotes.json";
import unplexQuotes from "@/data/scraped/unplex-quotes.json";
import remitroutesQuotes from "@/data/scraped/remitroutes-quotes.json";
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
  /** Short promo note (e.g. a better first-transfer rate) to surface on the
   * card. The comparison rate stays the standard rate; this only informs. */
  promoNote?: string;
}

// --- Trustpilot ratings ---
// Note: score/stars/totalReviews/ratingLabel can be null for providers where
// the scrape failed or the provider has no reviews yet. Consumers must handle nulls.
export interface TrustpilotRating {
  slug: string;
  name: string;
  trustpilotDomain: string;
  score: number | null;
  totalReviews: number | null;
  ratingLabel: string | null;
  stars: number | null;
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
  pandaremit: "panda-remit",
  "panda-remit": "panda-remit",
  skyremit: "skyremit",
  "sky-remit": "skyremit",
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
  let fee = (raw.fee as number) || 0;
  // A negative fee is never real pricing. 42 remitroutes-bridge rows (all ARS
  // corridors) carried values like -55.80, which through (sendAmount - fee) would
  // INFLATE the payout and could hand the provider a "cheapest" badge it has not
  // earned. Clamping to 0 is also what the source's own numbers support: that Western
  // Union AUD->ARS row states 223,460.90 received, and 200 * 1117.3045 reproduces it
  // exactly with no fee at all. Clamp rather than drop, and never in the direction
  // that overstates what the recipient gets.
  if (fee < 0) {
    fee = 0;
    restatedCounts.negativeFee = (restatedCounts.negativeFee ?? 0) + 1;
  }
  const exchangeRate = (raw.exchangeRate as number) || 0;
  let receiveAmount = (raw.receiveAmount as number) || 0;
  const fromCcy = (raw.sendCurrency as string) || "";
  const toCcy = (raw.receiveCurrency as string) || "";

  // Mid-market: use the value scraped alongside this quote when available;
  // otherwise fall back to the global mid-market table so markup can still
  // be computed for sources that don't include it (TapTap, Remitly, Wise direct).
  const midMarket = (raw.midMarketRate as number)
    || (fromCcy && toCcy ? getMidMarketRate(fromCcy, toCcy) : 0);

  // Calculate markup if we have mid-market rate
  let markup = (raw.markup as number) || 0;
  if (!markup && midMarket > 0 && exchangeRate > 0) {
    markup = Math.round(((midMarket - exchangeRate) / midMarket) * 10000) / 100;
  }

  // --- Normalize the fee convention so every row means the same thing. ---
  // Sources disagree about whether the transfer fee comes OUT of the send amount
  // or is charged ON TOP of it. All 4,716 remitroutes rows satisfy
  // receiveAmount == sendAmount * exchangeRate exactly, i.e. the sender pays
  // (sendAmount + fee) and the recipient gets the full sendAmount converted.
  // Other sources deduct the fee first.
  //
  // The site asks "you send X", so the comparable answer is what the recipient
  // gets for a total outlay of X — which is (X - fee) * rate under EITHER
  // convention. The engine already computes that, so rankings were never wrong;
  // but the stored receiveAmount was left in the source's own convention, making
  // 16.2% of rows disagree with their own fee/rate pair and any consumer that
  // reads the field directly (studies, exports) silently inconsistent.
  // Restate fee-on-top rows into the deducted convention here, so the dataset is
  // internally consistent rather than requiring every reader to know the source.
  if (fee > 0 && exchangeRate > 0 && sendAmount > 0 && receiveAmount > 0) {
    const feeOnTop = Math.abs(sendAmount * exchangeRate - receiveAmount) / receiveAmount <= 0.005;
    if (feeOnTop) {
      receiveAmount = Math.max(0, sendAmount - fee) * exchangeRate;
      restatedCounts.feeOnTop = (restatedCounts.feeOnTop ?? 0) + 1;
    }
  }

  // A residual few rows contradict themselves under BOTH conventions — e.g. a Ria
  // USD->INR row whose receive amount implies a rate of 96.33 against its own
  // stated 95.36. One of the fields is stale and we cannot tell which from the
  // row alone, but the engine prices from fee and rate, so those are the fields
  // that matter. Derive the receive amount from them rather than keep a stored
  // contradiction that any direct reader would surface as wrong data. Counted, not
  // silent, so a scraper regression still shows up in /scrape-debug.
  if (fee >= 0 && exchangeRate > 0 && sendAmount > 0 && receiveAmount > 0) {
    const expected = Math.max(0, sendAmount - fee) * exchangeRate;
    if (Math.abs(expected - receiveAmount) / receiveAmount > 0.02) {
      receiveAmount = expected;
      restatedCounts.contradictory = (restatedCounts.contradictory ?? 0) + 1;
    }
  }

  // First-transfer promo (e.g. Unplex): a better rate up to a small send cap.
  // We carry it as an informational note only — the comparison rate above stays
  // the standard rate so we never overstate what a sender actually receives.
  const firstTimeRate = raw.firstTimeRate as number | null | undefined;
  const firstTimeLimit = raw.firstTimeLimit as number | null | undefined;
  let promoNote: string | undefined;
  if (firstTimeRate && firstTimeRate > exchangeRate && firstTimeLimit) {
    promoNote = `First transfer rate ${firstTimeRate} ${toCcy} (up to ${firstTimeLimit} ${fromCcy})`;
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
    ...(promoNote ? { promoNote } : {}),
  };
}

// --- Build unified index ---
// Key: "{sendCurrency}_{receiveCurrency}" → quotes[]
// Key: "{sendCurrency}_{receiveCurrency}_{amount}" → quotes[]

export const quotesByCorridor: Record<string, NormalizedQuote[]> = {};
export const quotesByCorridorAmount: Record<string, NormalizedQuote[]> = {};
export const allProviderSlugs = new Set<string>();
/** Rows rejected by the integrity guards, by reason — surfaced for /scrape-debug. */
export const quarantineCounts: Record<string, number> = {};

/**
 * The most recent `dateCollected` across every quote we loaded, as YYYY-MM-DD.
 *
 * Pages that show users a "data updated" date MUST derive it from this, not from
 * file mtimes. The /compare templates previously stat()'d three filenames —
 * provider-quotes.json (which does not exist), mid-market-rates.json and
 * exchange-rates.json (both last written in March) — and so told readers the
 * comparison data was five months old while the quotes were same-day. On a fresh
 * deploy the same code reports the BUILD time instead, which is not the data date
 * either. Neither is a freshness signal; both are wrong data on the page.
 */
export let quoteDataDate: string | null = null;

/**
 * Rows whose stored receive amount we restated to keep the dataset internally
 * consistent, by reason. Exposed so a scraper regression is visible rather than
 * quietly absorbed — a jump here means a source changed its fee convention or
 * started emitting contradictory fields.
 */
export const restatedCounts: Record<string, number> = {};
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

    // Quarantine rows that cannot be true (a rate beating interbank on a freely
    // floating currency, an absurd markup or fee). See quote-integrity.ts for
    // why self-inconsistent rows are deliberately NOT dropped here.
    const reason = implausibilityReason(q);
    if (reason) {
      quarantineCounts[reason] = (quarantineCounts[reason] ?? 0) + 1;
      continue;
    }

    allProviderSlugs.add(q.providerSlug);
    if (q.provider && !providerNames[q.providerSlug]) {
      providerNames[q.providerSlug] = q.provider;
    }

    const collected = typeof (raw as Record<string, unknown>).dateCollected === "string"
      ? ((raw as Record<string, unknown>).dateCollected as string).slice(0, 10)
      : null;
    if (collected && (!quoteDataDate || collected > quoteDataDate)) quoteDataDate = collected;

    const corridorKey = `${q.sendCurrency}_${q.receiveCurrency}`;
    if (!quotesByCorridor[corridorKey]) quotesByCorridor[corridorKey] = [];
    quotesByCorridor[corridorKey].push(q);

    const amountKey = `${corridorKey}_${q.sendAmount}`;
    if (!quotesByCorridorAmount[amountKey]) quotesByCorridorAmount[amountKey] = [];
    quotesByCorridorAmount[amountKey].push(q);
  }
}

// Load sources in priority order (lower priority number = preferred).
// Four tiers, most-trusted first — a quote from a better tier always wins the
// dedup for the same provider+corridor+amount:
//
//   1. Direct  — first-party scrapes (the provider's own API / calculator)
//   2. Wise    — Wise Comparison API (Wise's own REST aggregator)
//   3. Monito  — Monito comparison aggregator (39 providers)
//   4. Rest    — everything else (Exiap etc.), gap-fill only
//
// TIER 1: Direct provider scrapes (first-party, most accurate)
addQuotes(ofxQuotes as unknown[], 1, "ofx-api");
addQuotes(instaremQuotes as unknown[], 1, "instarem-api");
addQuotes(xoomQuotes as unknown[], 1, "xoom-browser");
addQuotes(taptapsendQuotes as unknown[], 1, "taptapsend-api");
addQuotes(wiseDirectQuotes as unknown[], 1, "wise-direct-api");
addQuotes(aceQuotes as unknown[], 1, "ace-direct");
addQuotes(riaQuotes as unknown[], 1, "ria-browser");
addQuotes(remitlyQuotes as unknown[], 1, "remitly-browser");
addQuotes(compareremitQuotes as unknown[], 1, "compareremit-browser");
addQuotes(pandaremitQuotes as unknown[], 1, "pandaremit-api");
addQuotes(skyremitQuotes as unknown[], 1, "skyremit-api");
addQuotes(lemfiQuotes as unknown[], 1, "lemfi-api");
addQuotes(unplexQuotes as unknown[], 1, "unplex-api");

// TIER 2: Wise Comparison API (8-18 competitors per corridor, pure REST API)
addQuotes(wiseComparisonQuotes as unknown[], 2, "wise-comparison-api");

// TIER 3: Monito comparison aggregator (covers 39 providers)
addQuotes(monitoQuotes as unknown[], 3, "monito-comparison");

// TIER 4: Everything else — gap-fill only.
// Exiap / TheCurrencyShop (JSON-LD, US+UK+AU corridors). Demoted below
// Wise/Monito because Exiap's "fee" field is unreliable — it reports XE (and
// other fee-free providers) with spurious flat fees that are multiples of a
// base number (e.g. 30.18 / 60.36 / 90.54 USD), inflating the effective cost
// and producing wrong receive amounts. Only used where no better tier covers
// the provider+corridor.
addQuotes(exiapQuotes as unknown[], 4, "exiap");

// TIER 5: RemitRoutes bridge — traditional rows only (crypto rails are consumed
// separately by crypto-rails.ts). Lowest priority so it never displaces a
// first-party / Wise / Monito quote for a provider we already cover; it only
// adds providers (mostly retail banks) on corridors we'd otherwise show thin.
addQuotes(remitroutesQuotes as unknown[], 5, "remitroutes-bridge");

// --- Deduplicate: for the same provider+corridor+amount, keep highest priority ---
function deduplicateQuotes(quotes: NormalizedQuote[]): NormalizedQuote[] {
  const best = new Map<string, NormalizedQuote>();
  for (const q of quotes) {
    const key = `${q.providerSlug}_${q.sendAmount}`;
    const existing = best.get(key);
    if (!existing || q.sourcePriority < existing.sourcePriority) {
      best.set(key, q);
    } else if (
      q.sourcePriority === existing.sourcePriority &&
      isSelfConsistent(q) &&
      !isSelfConsistent(existing)
    ) {
      // Same tier: prefer the row whose own fee/rate/receive figures reconcile.
      best.set(key, q);
    }
  }
  return Array.from(best.values());
}

// Deduplicate corridor-level index. dropRateOutliers runs FIRST so that a lone
// source contradicting two that agree is discarded before the priority rule gets
// a chance to prefer it for being "direct" — that ordering is the whole point.
for (const key of Object.keys(quotesByCorridor)) {
  quotesByCorridor[key] = deduplicateQuotes(dropRateOutliers(quotesByCorridor[key]));
}

// Deduplicate corridor+amount index
for (const key of Object.keys(quotesByCorridorAmount)) {
  quotesByCorridorAmount[key] = deduplicateQuotes(dropRateOutliers(quotesByCorridorAmount[key]));
}

// --- Available scraped amounts (for nearest-match lookup) ---
const allAmounts = new Set<number>();
const amountsByCorridor: Record<string, number[]> = {};
for (const quotes of Object.values(quotesByCorridor)) {
  for (const q of quotes) {
    allAmounts.add(q.sendAmount);
    const k = `${q.sendCurrency}_${q.receiveCurrency}`;
    if (!amountsByCorridor[k]) amountsByCorridor[k] = [];
    if (!amountsByCorridor[k].includes(q.sendAmount)) {
      amountsByCorridor[k].push(q.sendAmount);
    }
  }
}
for (const k of Object.keys(amountsByCorridor)) {
  amountsByCorridor[k].sort((a, b) => a - b);
}
export const SCRAPED_AMOUNTS = [...allAmounts].sort((a, b) => a - b);

// Picks the closest scraped amount. When `corridorKey` is provided, the
// search is restricted to amounts that actually exist for that corridor —
// otherwise sparse corridors snap to a global amount with zero quotes
// (e.g. USD→EUR @ $500 used to surface only 1 provider).
export function findNearestAmount(target: number, corridorKey?: string): number {
  const pool = corridorKey
    ? amountsByCorridor[corridorKey]
    : SCRAPED_AMOUNTS;
  if (!pool || pool.length === 0) return 1000;
  let closest = pool[0];
  let minDiff = Math.abs(target - closest);
  for (const amt of pool) {
    const diff = Math.abs(target - amt);
    if (diff < minDiff) {
      minDiff = diff;
      closest = amt;
    }
  }
  return closest;
}

