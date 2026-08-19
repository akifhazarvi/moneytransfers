/**
 * Quote integrity guards.
 *
 * An audit of the 13,512 normalized rows that reach users found several classes
 * of quote that cannot be true, and one structural flaw in how we pick between
 * sources that disagree:
 *
 *  - 9.6% of #1 "cheapest" slots were held by a provider whose scraped rate
 *    BEAT the interbank rate on that corridor. Unplex held #1 on USD->INR,
 *    GBP->INR and USD->PHP off eight rows, five of which beat interbank — one by
 *    +4.06%. No provider gives 4% more than interbank as a standing rate; that
 *    is a promotional rate stored as the standard one.
 *  - Source priority was `direct API > Monito > Wise` BY SOURCE TYPE, with no
 *    regard for agreement. On USD->PHP, Xoom's own scraper said +2.60% while
 *    Monito (-3.31%) and Wise-comparison (-3.14%) agreed with each other. The
 *    lone outlier won for being "direct".
 *  - 7 rows carried a markup above 25% (TapTap HUF->EUR quoting 0.002 against a
 *    0.00274 mid — a decimal parse).
 *
 * Two deliberate non-decisions, so the next person does not "fix" them:
 *
 *  1. Rows whose own fee/rate/receive triplet disagrees (16.2% of the set, mostly
 *     remitroutes-bridge) are NOT dropped. The engine prices from fee and markup
 *     and never reads the scraped receive amount, so a mismatch proves one of the
 *     three is wrong without telling us which. Discarding 16% of the corpus on
 *     that basis would thin real corridors to chase a field we do not use.
 *     Instead consistency is used as a tie-break between equally-ranked sources.
 *  2. Currencies with an active parallel market are EXEMPT from the
 *     beats-interbank rule. For NGN, ARS, ETB and similar, the official mid we
 *     compare against is not the rate anyone actually trades at, so beating it is
 *     normal and the quote is real. A blanket rule would have deleted legitimate
 *     diaspora-corridor quotes, which is where much of the site's traffic lives.
 */
import type { NormalizedQuote } from "@/lib/unified-quotes";

/**
 * Currencies whose official/reference rate diverges materially from the rate
 * actually transacted, because of capital controls or a parallel market. A quote
 * that "beats" the official mid in these is expected, not broken.
 */
export const PARALLEL_RATE_CURRENCIES = new Set([
  "NGN", // Nigeria — parallel market, the dominant case in our data
  "ARS", // Argentina — blue dollar
  "ETB", // Ethiopia
  "VES", // Venezuela
  "ZWL", // Zimbabwe
  "SDG", // Sudan
  "SYP", // Syria
  "LBP", // Lebanon
  "IRR", // Iran
  "AOA", // Angola
  "MMK", // Myanmar
  "CUP", // Cuba
  "EGP", // Egypt — parallel market persisted well past the 2024 devaluation
  "GHS", // Ghana
]);

/** A rate this far better than the reference mid is not a real standing rate. */
const BEATS_INTERBANK_PCT = -0.5;
/** Above this, the row is a parse error rather than an expensive provider. */
const ABSURD_MARKUP_PCT = 25;
/** A fee above this share of the send amount is a decimal error, not pricing. */
const ABSURD_FEE_SHARE = 0.5;
/** Rate spread beyond which a lone source is treated as contradicting its peers. */
const OUTLIER_TOLERANCE = 0.02;

export function hasParallelMarket(quote: NormalizedQuote): boolean {
  return (
    PARALLEL_RATE_CURRENCIES.has(quote.sendCurrency) ||
    PARALLEL_RATE_CURRENCIES.has(quote.receiveCurrency)
  );
}

/**
 * Why this row cannot be shown to a user, or null if it is plausible.
 * Returning a reason (rather than a boolean) so the loader can report the
 * breakdown instead of silently shrinking the dataset.
 */
export function implausibilityReason(quote: NormalizedQuote): string | null {
  if (!quote.exchangeRate || quote.exchangeRate <= 0) return "no-rate";
  if (quote.markup > ABSURD_MARKUP_PCT) return "markup-absurd";
  if (quote.sendAmount > 0 && quote.fee / quote.sendAmount > ABSURD_FEE_SHARE) return "fee-absurd";
  if (quote.markup < BEATS_INTERBANK_PCT && !hasParallelMarket(quote)) return "beats-interbank";
  return null;
}

/** Whether the row's own fee/rate/receive figures reconcile. */
export function isSelfConsistent(quote: NormalizedQuote): boolean {
  if (!quote.exchangeRate || !quote.receiveAmount || !quote.sendAmount) return true;
  const expected = Math.max(0, quote.sendAmount - quote.fee) * quote.exchangeRate;
  return Math.abs(expected - quote.receiveAmount) / quote.receiveAmount <= 0.02;
}

/**
 * Drop rows that contradict their peers.
 *
 * When three or more sources quote the same provider at the same amount, the
 * median rate is the corroborated view and a row more than 2% away from it is
 * the odd one out — regardless of how "direct" its source claims to be. This is
 * what stops a single misparsed first-party scrape from overriding two
 * aggregators that agree.
 *
 * With only two sources there is no majority to appeal to, so both survive here
 * and implausibilityReason is left to catch the impossible direction.
 */
export function dropRateOutliers(quotes: NormalizedQuote[]): NormalizedQuote[] {
  const groups = new Map<string, NormalizedQuote[]>();
  for (const q of quotes) {
    const key = `${q.providerSlug}_${q.sendAmount}`;
    const g = groups.get(key);
    if (g) g.push(q);
    else groups.set(key, [q]);
  }

  const kept: NormalizedQuote[] = [];
  for (const group of groups.values()) {
    if (group.length < 3) {
      kept.push(...group);
      continue;
    }
    const rates = group.map((q) => q.exchangeRate).sort((a, b) => a - b);
    const median = rates[Math.floor(rates.length / 2)];
    if (!median) {
      kept.push(...group);
      continue;
    }
    const survivors = group.filter((q) => Math.abs(q.exchangeRate / median - 1) <= OUTLIER_TOLERANCE);
    // Never let the filter empty a group — if everything disagrees we have no
    // basis to pick, so fall back to the full set rather than dropping the
    // provider from the corridor entirely.
    kept.push(...(survivors.length ? survivors : group));
  }
  return kept;
}
