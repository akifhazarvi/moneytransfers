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
import { MONETISED_SLUGS } from "@/lib/affiliate";
import {
  quotesByCorridor,
  quotesByCorridorAmount,
  findNearestAmount,
  trustpilotIndex,
  type NormalizedQuote,
} from "@/lib/unified-quotes";
import { buildPricePoints, estimatePricing, feeModelFor } from "@/lib/fee-model";

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

/**
 * Whether a provider's published headline limits allow this send amount.
 * Unknown provider (no static record) or no stated maximum => allowed.
 */
function withinTransferLimits(provider: Provider | undefined, amount: number): boolean {
  if (!provider) return true;
  if (provider.maxTransfer != null && amount > provider.maxTransfer) return false;
  if (provider.minTransfer != null && amount < provider.minTransfer) return false;
  return true;
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
    // Prefer the nearest-amount quote, but never let a lower-quality source
    // (e.g. Exiap, tier 4) overwrite a better one already chosen above.
    // Without this guard an Exiap row scraped only at a far amount can clobber
    // a Monito/Wise quote and surface its unreliable flat fee (see XE fee bug).
    for (const sq of nearestQuotes) {
      const existing = providerQuoteMap.get(sq.providerSlug);
      if (!existing || sq.sourcePriority <= existing.sourcePriority) {
        providerQuoteMap.set(sq.providerSlug, sq);
      }
    }

    const quotes: TransferQuote[] = [];

    // Every price point we hold for this corridor, per provider — the basis for
    // pricing each provider AT the requested amount instead of reusing whatever
    // bucket happened to be nearest corridor-wide.
    const pricePoints = buildPricePoints(corridorQuotes);

    for (const sq of providerQuoteMap.values()) {
      const provider = providers.find((p) => p.slug === sq.providerSlug);

      // Fees are NOT uniformly flat: ~45% of provider+corridor pairs are flat
      // (TapTap Send, LemFi, Paysend, Ria) but ~36% scale with the amount (Wise,
      // OFX, Western Union, Remitly, Instarem). Treating every fee as flat let a
      // fee scraped at $100 stand in at $50,000 and understated the cheapest-
      // looking providers by up to ~100x. estimatePricing derives both fee and
      // markup from the provider's own observed curve at THIS amount.
      const points = pricePoints.get(sq.providerSlug) ?? [];
      const estimate = estimatePricing(points, amount, feeModelFor(sq.providerSlug));

      // No defensible number for this amount — drop the provider rather than
      // show a fabricated price. Better a shorter honest table than a wrong
      // "cheapest" badge.
      if (!estimate || estimate.confidence === "unsupported") continue;

      // Don't recommend a provider that would refuse the transfer. These limits
      // were previously only used in editorial copy, so the table happily
      // crowned TapTap Send (max $10k), Remitly ($10k) and WorldRemit ($10k) as
      // "cheapest" for a $50,000 send the user could never actually make.
      // Only filter on an explicit published limit — null means no stated cap,
      // and providers with no record at all (aggregator-only slugs) are left
      // alone since we have nothing to judge them by. Real limits also vary by
      // corridor and verification level, so this is a headline-limit guard, not
      // a precise eligibility check.
      if (!withinTransferLimits(provider, amount)) continue;

      const markupPct = estimate.markup / 100;
      const providerRate = baseRate * (1 - markupPct);
      const fee = estimate.fee;
      // Clamp so a flat fee larger than a tiny send can't yield a negative
      // payout — the recipient gets nothing, not a negative amount.
      const receiveAmount = Math.max(0, amount - fee) * providerRate;

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
        transferSpeed: estimate.deliveryEstimate || sq.deliveryEstimate || provider?.transferSpeed || "1-3 business days",
        rating,
        ratingLabel,
        ...(estimate.promoNote || sq.promoNote ? { promoNote: estimate.promoNote ?? sq.promoNote } : {}),
      });
    }

    // Indicative quotes always sit after real scraped quotes — they're
    // pinned at mid-market and would otherwise win on receiveAmount and
    // claim the "Best Deal" badge.
    const indicative = buildIndicativeQuotes(amount, fromCurrency, toCurrency, baseRate);
    return [...rankQuotes(quotes), ...indicative];
  }

  // No scraped data for this corridor — still surface indicative-only quotes
  return buildIndicativeQuotes(amount, fromCurrency, toCurrency, baseRate);
}

// How close two payouts must be before the difference stops being real
// information. Quotes are scraped every ~6 hours and major pairs routinely move
// more than this intraday, so a gap under the band says nothing reliable about
// which provider is actually cheaper at the moment someone transfers. On the
// USD->PKR screenshot that prompted this, the top two were separated by Rs47 on
// Rs138,500 — 0.034%, well inside the band, while the 4.7-rated provider sat
// below the 4.0-rated one. Kept deliberately tight: a wider band starts putting
// a visibly SMALLER payout above a larger one in a table that prints both in
// large type, which reads as broken and costs more trust than the slot is worth.
const MATERIALITY_BAND = 0.001; // 0.10%

/**
 * Rank by payout, then break *immaterial* differences toward a provider we have
 * a commercial relationship with.
 *
 * The strict payout order is preserved everywhere it carries information: a
 * provider that is materially cheaper always stays ahead, and nothing outside the
 * band ever moves. Only within the band — where the ordering was previously
 * decided by scrape timing and rounding — does the tie-break apply.
 *
 * This IS a commercial thumb on the scale and is disclosed as one. The affiliate
 * disclosure and the editorial policy both state the band and its size; changing
 * MATERIALITY_BAND without updating that copy makes the site's own claims false.
 */
export function rankQuotes<T extends { receiveAmount: number; providerSlug: string; rating?: number }>(
  quotes: T[],
): T[] {
  const ratingOf = (q: T) => q.rating ?? 0;
  const byPayout = [...quotes].sort((a, b) => b.receiveAmount - a.receiveAmount);
  const ranked: T[] = [];
  const pool = [...byPayout];
  while (pool.length) {
    const leader = pool[0].receiveAmount;
    // Everything indistinguishable from the current leader, in payout order.
    const bandEnd = pool.findIndex(
      (q) => leader <= 0 || (leader - q.receiveAmount) / leader > MATERIALITY_BAND,
    );
    const band = pool.splice(0, bandEnd === -1 ? pool.length : bandEnd);
    // Within the band the payout carries no information, so rating decides —
    // which is also the honest answer to "why is a 4.7 below a 4.0?". Partners
    // sort ahead of non-partners at equal standing; that part is commercial and
    // is disclosed as such.
    const byMerit = (a: T, b: T) =>
      (ratingOf(b) - ratingOf(a)) || (b.receiveAmount - a.receiveAmount);
    ranked.push(
      ...band.filter((q) => MONETISED_SLUGS.has(q.providerSlug)).sort(byMerit),
      ...band.filter((q) => !MONETISED_SLUGS.has(q.providerSlug)).sort(byMerit),
    );
  }
  return ranked;
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
  {
    // Korea-outbound only. GME sends FROM South Korea (KRW) to its migrant-worker
    // corridors. `to` covers the receive currencies of the KRW corridors the site
    // runs plus GME's documented destinations (Nepal, Vietnam, Philippines,
    // Indonesia, India, Thailand, Sri Lanka, Pakistan, Bangladesh, China, Cambodia).
    // No public rate feed — surfaced as indicative until a quotes integration lands.
    slug: "gme-remit",
    from: new Set(["KRW"]),
    to: new Set([
      "NPR", "VND", "PHP", "IDR", "INR", "THB", "LKR", "PKR", "BDT", "CNY", "KHR", "USD",
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
