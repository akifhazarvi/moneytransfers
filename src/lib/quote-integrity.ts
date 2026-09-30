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
  // Bolivia — dual-rate since the 2025 dollar shortage; the reference itself is
  // unstable. XE's USD→BOB mid fell 1.2% in a day (12.2196 → 12.079, Sep 26→27
  // 2026), flipping TapTap's steady 12.15 from +0.57% to −0.59% and quarantining
  // the only USD→BOB quote — which un-rendered /send-money/send-money-to-bolivia
  // while the sitemap still submitted it (check:indexing failed on main).
  "BOB",
  // Mozambique — the metical has been held stable against the dollar since 2021
  // while the parallel premium widened to ~14% at end-2025, with exchange houses
  // 10-15% above banks (IMF 2025 Article IV, Feb 2026). TapTap, the only source
  // quoting MZN, paid 3-9% above XE's official mid from every origin — exactly
  // that gap — and was quarantined off every Mozambique corridor. GNF was checked
  // too and is NOT listed: the IMF reports Guinea's parallel premium "virtually
  // eliminated" by 2022, so TapTap's GNF rates above mid stay unexplained.
  "MZN",
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
export function implausibilityReason(
  quote: NormalizedQuote,
  opts: {
    /** Override for callers whose reference mid is coarser than the live one
     *  (history benchmarks against ONE daily XE snapshot, so intraday drift
     *  alone can put a mid-priced Wise quote 0.5–1% "better" than it). */
    beatsInterbankPct?: number;
    /** False where a flat fee can legitimately exceed half the send amount. */
    checkFeeShare?: boolean;
  } = {},
): string | null {
  const beatsPct = opts.beatsInterbankPct ?? BEATS_INTERBANK_PCT;
  if (!quote.exchangeRate || quote.exchangeRate <= 0) return "no-rate";
  if (quote.markup > ABSURD_MARKUP_PCT) return "markup-absurd";
  if (opts.checkFeeShare !== false && quote.sendAmount > 0 && quote.fee / quote.sendAmount > ABSURD_FEE_SHARE) return "fee-absurd";
  if (quote.markup < beatsPct && !hasParallelMarket(quote)) return "beats-interbank";
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

/**
 * TapTap Send's published flat fees, per currency pair, as its public
 * /api/fxRates listed them on 2026-09-29 ({ type: "standard", flatFee }).
 *
 * Until that date scrape-taptapsend.ts read only TIERED fee schedules, so every
 * flat one was stored as a $0 fee: USD→INR carried no fee where TapTap charges
 * $1.99, which on history's $100 reference is 2% of the transfer. That made
 * TapTap the "most frequent leader" on USD/CAD/GBP/EUR→INR and USD→THB, and #1
 * at $1,000 on USD→INR and CAD→INR, where with its fee it ranks second.
 *
 * The scraper now reads flat fees. Rows written before the fix still carry $0,
 * so they are restated with the fee TapTap publishes — the best evidence we
 * hold of what it charged over the window. A row that already carries a fee is
 * left alone, so this stops applying as fixed rows replace the old ones.
 * Pairs whose schedule varies by origin country (EUR→NPR, EUR→XOF) or is a
 * percentage are not listed; neither are pairs we do not emit.
 */
export const TAPTAP_FLAT_FEES: Record<string, number> = {
  "AED-ARS": 5, "AED-BOB": 5, "AED-INR": 5, "AUD-ARS": 1.49, "AUD-BOB": 2.89, "AUD-INR": 1.99,
  "BRL-HTG": 4.99, "BRL-INR": 9.99, "CAD-ARS": 4.99, "CAD-BOB": 2.99, "CAD-INR": 1.99, "CAD-THB": 2.99,
  "CZK-ARS": 40, "CZK-BOB": 40, "DKK-ARS": 15, "DKK-BOB": 15, "EUR-ARS": 2.49, "EUR-BOB": 1.99,
  "EUR-INR": 1.99, "EUR-THB": 1.49, "GBP-ARS": 1.99, "GBP-BOB": 2.49, "GBP-INR": 0.99, "GBP-NPR": 0.99,
  "GBP-THB": 0.99, "HUF-ARS": 490, "NOK-ARS": 20, "NOK-BOB": 20, "PLN-ARS": 9, "PLN-BOB": 9,
  "RON-ARS": 10, "RON-BOB": 10, "SEK-ARS": 20, "SEK-BOB": 20, "USD-ARS": 1.99, "USD-BOB": 1.99,
  "USD-INR": 1.99, "USD-THB": 1.99,
};

/**
 * The flat fee a TapTap row should have carried, or 0 when it needs no
 * restating (not TapTap's own feed, a pair without a flat fee, or a row that
 * already has one). Callers restate receive = (sendAmount − fee) × rate.
 */
export function unreadTapTapFee(q: { source?: string; sendCurrency: string; receiveCurrency: string; fee: number }): number {
  if (!q.source?.startsWith("taptapsend") || q.fee > 0) return 0;
  return TAPTAP_FLAT_FEES[`${q.sendCurrency}-${q.receiveCurrency}`] ?? 0;
}

/** Source tier of the gap-fill-only feed (RemitRoutes) in unified-quotes.ts. */
export const GAP_FILL_TIER = 5;

/**
 * Keep the gap-fill feed to gap-filling.
 *
 * RemitRoutes (tier 5) exists to add providers — mostly retail banks — that no
 * better source covers. Dedup, though, runs per provider AND amount, so on any
 * amount the better tiers do not happen to scrape it won the slot outright: the
 * Wise API quotes $100 and $1,000, so RemitRoutes supplied Wise at $200 and
 * $5,000 on every corridor. Its rows there are not quotes at those amounts —
 * each carries one markup per provider and corridor, the same at $200 as at
 * $5,000 (Wise USD→EUR 3.70% at both) — and for Wise, whose rate is the
 * mid-market rate, 257 of the 524 slots it held (2026-09-29) showed a markup
 * above 1%, up to 5.43%. That put Wise near the bottom of $200 and $5,000
 * tables. The same pattern ran 1–5 points above first-party pricing for OFX,
 * Remitly, Monese and the banks we also price directly.
 *
 * So a gap-fill row is dropped wherever the same provider has ANY better-tier
 * row on the corridor, at any amount. The engine then prices that provider at
 * every amount from its own better-sourced points (see estimatePricing), and
 * RemitRoutes keeps adding the providers nobody else covers.
 */
export function dropCoveredGapFill(quotes: NormalizedQuote[], covered: Set<string>): NormalizedQuote[] {
  return quotes.filter(
    (q) => q.sourcePriority < GAP_FILL_TIER || (!covered.has(q.providerSlug) && !gapFillUnreliable(q)),
  );
}

/**
 * Where the gap-fill feed is measurably wrong even as the only source. Its Wise
 * figure is an all-in cost folded into the rate, and against Wise's own API at
 * $1,000 (50 overlapping corridors, 2026-09-29) it matched from every origin
 * but one: EUR 9 of 10 within 0.5 points, GBP 5 of 5, SGD/CHF/CAD/AUD/HKD all
 * within — but USD-origin rows ran a median 3.27 points high (USD→GHS 5.10%
 * against Wise's 0.54%, USD→ZAR 5.16% against 1.15%). So its non-USD Wise rows
 * stay as gap-fill and its USD-origin Wise rows are never used.
 */
const GAP_FILL_UNRELIABLE: { provider: string; sendCurrency: string }[] = [
  { provider: "wise", sendCurrency: "USD" },
];
function gapFillUnreliable(q: NormalizedQuote): boolean {
  return GAP_FILL_UNRELIABLE.some((u) => u.provider === q.providerSlug && u.sendCurrency === q.sendCurrency);
}

/** Providers on a corridor quoted by at least one source better than the gap-fill tier. */
export function providersCoveredAboveGapFill(quotes: NormalizedQuote[]): Set<string> {
  const covered = new Set<string>();
  for (const q of quotes) if (q.sourcePriority < GAP_FILL_TIER) covered.add(q.providerSlug);
  return covered;
}
