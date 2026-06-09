/**
 * Quote engine — server-only.
 *
 * Houses generateQuotes() and the exchange-rate helpers. This module statically
 * imports the full scraped quote dataset via @/lib/unified-quotes (taptapsend
 * alone is ~4 MB), so it must NEVER be imported by a client component. Client
 * code reaches quotes through /api/quotes (see src/lib/fetch-quotes.ts); server
 * components and API routes import generateQuotes from here directly.
 *
 * The static provider data (the `providers` array, getProviderName, etc.) lives
 * in @/data/providers, which is client-safe — it no longer pulls in this engine
 * or the dataset.
 */
import { providers, getExchangeRate, type Provider, type TransferQuote } from "@/data/providers";
import {
  quotesByCorridor,
  quotesByCorridorAmount,
  findNearestAmount,
  trustpilotIndex,
  type NormalizedQuote,
} from "@/lib/unified-quotes";

// exchangeRates / getExchangeRate live in @/data/providers (client-safe, sourced
// from the small XE rates file). generateQuotes uses getExchangeRate for its
// base rate below; re-export it for the handful of server callers that imported
// it from the old providers location alongside generateQuotes.
export { getExchangeRate, exchangeRates } from "@/data/providers";

// Map Trustpilot labels to our 4-value system
function toRatingLabel(score: number): Provider["ratingLabel"] {
  if (score >= 4.3) return "Excellent";
  if (score >= 3.5) return "Good";
  if (score >= 2.5) return "Fair";
  return "Poor";
}

export function generateQuotes(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  liveRates?: Record<string, number>
): TransferQuote[] {
  const corridorKey = `${fromCurrency}_${toCurrency}`;
  const corridorQuotes = quotesByCorridor[corridorKey];

  const baseRate = liveRates
    ? (liveRates[toCurrency] || 1) / (liveRates[fromCurrency] || 1)
    : getExchangeRate(fromCurrency, toCurrency);

  if (corridorQuotes && corridorQuotes.length > 0) {
    // Try exact amount match first, then nearest scraped amount
    const nearestAmount = findNearestAmount(amount, corridorKey);
    const amountKey = `${corridorKey}_${nearestAmount}`;
    const nearestQuotes = quotesByCorridorAmount[amountKey] || [];
    const isExactAmount = nearestAmount === amount;

    // Start from every provider that quotes this corridor at any amount,
    // then prefer the nearest-amount quote when one exists. Without this
    // fallback, sparse amount buckets (e.g. USD→EUR @ $500 has only 1
    // scraped quote) would collapse the result to a single provider.
    const providerQuoteMap = new Map<string, NormalizedQuote>();
    for (const sq of corridorQuotes) {
      const existing = providerQuoteMap.get(sq.providerSlug);
      if (!existing || sq.sourcePriority < existing.sourcePriority) {
        providerQuoteMap.set(sq.providerSlug, sq);
      }
    }
    for (const sq of nearestQuotes) {
      providerQuoteMap.set(sq.providerSlug, sq);
    }

    const quotes: TransferQuote[] = [];

    for (const sq of providerQuoteMap.values()) {
      const provider = providers.find((p) => p.slug === sq.providerSlug);

      // Use real markup from scraped data, apply to live or static base rate
      const markupPct = sq.markup / 100;
      const providerRate = baseRate * (1 - markupPct);

      let fee: number;
      let receiveAmount: number;

      if (isExactAmount) {
        fee = sq.fee;
        receiveAmount = (amount - fee) * providerRate;
      } else {
        const feeRatio = sq.fee / (sq.sendAmount || 1000);
        fee = Math.max(feeRatio * amount, sq.fee * 0.5);
        receiveAmount = (amount - fee) * providerRate;
      }

      // Use Trustpilot rating if available, otherwise provider default or 3.5
      const tp = trustpilotIndex[sq.providerSlug];
      const rating = tp?.score ?? provider?.rating ?? 3.5;
      const ratingLabel = toRatingLabel(rating);

      quotes.push({
        providerSlug: sq.providerSlug,
        sendAmount: amount,
        sendCurrency: fromCurrency,
        receiveCurrency: toCurrency,
        exchangeRate: Math.round(providerRate * 10000) / 10000,
        fee: Math.round(fee * 100) / 100,
        receiveAmount: Math.round(receiveAmount * 100) / 100,
        transferSpeed: sq.deliveryEstimate || provider?.transferSpeed || "1-3 business days",
        rating,
        ratingLabel,
        ...(sq.promoNote ? { promoNote: sq.promoNote } : {}),
      });
    }

    // Indicative quotes always sit after real scraped quotes — they're
    // pinned at mid-market and would otherwise win on receiveAmount and
    // claim the "Best Deal" badge.
    const indicative = buildIndicativeQuotes(amount, fromCurrency, toCurrency, baseRate);
    return [...quotes.sort((a, b) => b.receiveAmount - a.receiveAmount), ...indicative];
  }

  // No scraped data for this corridor — still surface indicative-only quotes
  return buildIndicativeQuotes(amount, fromCurrency, toCurrency, baseRate);
}

// Providers we surface as estimated/indicative — they don't expose a public
// rate feed, so we show the mid-market rate with no fee and route the user
// to their partner page for a real quote. Always rendered after scraped
// quotes so they never claim to be the cheapest.
//
// Each provider declares supported `from` and `to` currency sets. A corridor
// only gets an indicative quote when fromCurrency is in `from` AND
// toCurrency is in `to` — pulled directly from the partner's quote form
// dropdowns, so we never surface a corridor they don't actually serve.
const INDICATIVE_PROVIDERS: {
  slug: string;
  from: ReadonlySet<string>;
  to: ReadonlySet<string>;
}[] = [
  {
    slug: "regencyfx",
    // Source: regencyfx.com/partner/sendmoneycompare quote form (May 2026)
    from: new Set([
      "GBP", "EUR", "USD", "CAD", "AUD", "NZD", "JPY", "ZAR", "CHF",
      "BHD", "BWP", "BGN", "CNY", "HRK", "CZK", "DKK", "EGP", "GHS",
      "HKD", "HUF", "ILS", "JOD", "KES", "KWD", "LVL", "LTL", "MUR",
      "MXN", "MAD", "NOK", "OMR", "PLN", "QAR", "RON", "SAR", "SGD",
      "SEK", "THB", "TND", "TRY", "AED", "UGX",
    ]),
    to: new Set([
      "GBP", "EUR", "USD", "CAD", "AUD", "NZD", "JPY", "ZAR", "CHF",
      "BHD", "BWP", "BRL", "BGN", "XAF", "CNY", "HRK", "CZK", "DKK",
      "EGP", "GHS", "HKD", "HUF", "INR", "IDR", "ILS", "JOD", "KES",
      "KWD", "LVL", "LTL", "MYR", "MUR", "MXN", "MAD", "NOK", "OMR",
      "PKR", "PHP", "PLN", "QAR", "RON", "SAR", "SGD", "SEK", "THB",
      "TND", "TRY", "AED", "UGX", "XOF",
    ]),
  },
];

// Currencies that broker desks treat as majors — tighter spreads, ~0.5%.
// Everything else (EM, exotics, GCC) gets ~0.8% to reflect wider desk pricing.
const INDICATIVE_MAJOR_CURRENCIES = new Set([
  "GBP", "EUR", "USD", "CAD", "AUD", "NZD", "JPY", "CHF",
]);

function indicativeMarkup(fromCurrency: string, toCurrency: string): number {
  const bothMajor =
    INDICATIVE_MAJOR_CURRENCIES.has(fromCurrency) &&
    INDICATIVE_MAJOR_CURRENCIES.has(toCurrency);
  return bothMajor ? 0.005 : 0.008;
}

function buildIndicativeQuotes(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  baseRate: number,
): TransferQuote[] {
  if (!baseRate || baseRate <= 0) return [];
  const markup = indicativeMarkup(fromCurrency, toCurrency);
  const adjustedRate = baseRate * (1 - markup);
  return INDICATIVE_PROVIDERS.flatMap(({ slug, from, to }) => {
    if (!from.has(fromCurrency) || !to.has(toCurrency)) return [];
    const provider = providers.find((p) => p.slug === slug);
    if (!provider) return [];
    const tp = trustpilotIndex[slug];
    const rating = tp?.score ?? provider.rating ?? 4.0;
    return [{
      providerSlug: slug,
      sendAmount: amount,
      sendCurrency: fromCurrency,
      receiveCurrency: toCurrency,
      exchangeRate: Math.round(adjustedRate * 10000) / 10000,
      fee: 0,
      receiveAmount: Math.round(amount * adjustedRate * 100) / 100,
      transferSpeed: provider.transferSpeed,
      rating,
      ratingLabel: toRatingLabel(rating),
      isIndicative: true,
    }];
  });
}
