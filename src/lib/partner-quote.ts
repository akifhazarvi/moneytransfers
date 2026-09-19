import { generateQuotes } from "@/lib/quotes-engine";
import type { PartnerQuote } from "@/components/PartnerFeatureBlock";

/**
 * Default corridor for the TapTap Send ad on surfaces that aren't about one
 * route (the homepage, the research-guide layout). USD→INR at $1,000 is the
 * site's highest-traffic corridor and one TapTap quotes, so the ad carries a
 * real rate there instead of rendering as a bare button.
 */
export const DEFAULT_PARTNER_CORRIDOR = { from: "USD", to: "INR", amount: 1000 } as const;

/**
 * TapTap Send's live quote for a corridor, pulled from the SAME
 * `generateQuotes()` array any ranked table on the page renders, so the ad
 * cannot disagree with the comparison beside it. Returns undefined when we
 * hold no TapTap quote for the route — the ad then shows no numbers rather
 * than inventing any.
 *
 * Server-only: `quotes-engine` carries the multi-MB scraped dataset and must
 * never cross a client boundary. See [[project_route_map_bundle_leak_sep18]].
 */
export function getPartnerQuote(
  from: string = DEFAULT_PARTNER_CORRIDOR.from,
  to: string = DEFAULT_PARTNER_CORRIDOR.to,
  amount: number = DEFAULT_PARTNER_CORRIDOR.amount,
): PartnerQuote | undefined {
  return partnerQuoteFrom(generateQuotes(amount, from, to), from, to);
}

/**
 * Same thing for callers that already hold the corridor's quote array — the
 * inline comparison tables do, so the ad beside them costs no second
 * `generateQuotes()` pass and is guaranteed to read off the same rows the
 * table ranks.
 *
 * `quotes` must be the UNSLICED, unfiltered array: `providerCount` and the
 * lowest-payout comparison are only true against the full set.
 */
export function partnerQuoteFrom(
  quotes: ReturnType<typeof generateQuotes>,
  from: string,
  to: string,
): PartnerQuote | undefined {
  const tt = quotes.find((q) => q.providerSlug === "taptap-send");
  if (!tt) return undefined;
  return {
    fromCurrency: from,
    toCurrency: to,
    sendAmount: tt.sendAmount,
    receiveAmount: tt.receiveAmount,
    exchangeRate: tt.exchangeRate,
    fee: tt.fee,
    transferSpeed: tt.transferSpeed,
    worstReceiveAmount: quotes[quotes.length - 1]?.receiveAmount,
    providerCount: quotes.length,
    isBest: quotes[0]?.providerSlug === "taptap-send",
  };
}
