/**
 * Hand-written editorial for the /banks/* pages named in the Sep 2026 content
 * brief (§4): Chase, HSBC.
 *
 * WHAT IS UNIQUE HERE
 * These pages already carry something no comparison competitor publishes: a
 * live, same-day comparison of what a specific bank quotes against what the
 * best digital provider quotes, on the same corridor and amount, from the
 * Wise-comparison feed. The generic boilerplate the brief flagged sits around
 * that data rather than in it — this file replaces the generic framing with
 * prose specific to how each bank's international transfer product actually
 * works, while the live comparison table stays exactly as it was.
 *
 * MEDIAN, NOT MEAN
 * bank-comparisons.ts's averageLossPct is skewed by outlier corridors on a
 * small quote set — HSBC's mean reads 2.20% against a 1.36% median because one
 * AUD->THB row sits at 31.5%. Every figure here reads medianLossPct via the
 * {{BANK_MEDIAN}} token, and the hero stat elsewhere on the page was fixed in
 * the same pass to match.
 */

export interface BankEditorial {
  /** What this bank's international transfer product actually is. */
  theProduct: string;
  /** The measured record from bank-comparisons.ts, token-backed. */
  measuredRecord: string;
  /** When using the bank directly is genuinely the reasonable choice. */
  whenItMakesSense: string;
  /** The specific thing to check before wiring money through this bank. */
  watchOut: string;
}

export const bankEditorial: Record<string, BankEditorial> = {
  chase: {
    theProduct: `Chase's international wire is the product most of its customers reach for by default, because it sits inside the app they already use, and that is precisely the habit this page exists to interrupt. A wire is a same-day-to-a-few-days transfer priced with a flat fee and a rate Chase sets itself — there is no published mid-market benchmark on the confirmation screen, so the customer has no way to see the markup at the point of sending. Chase does not compete on price for this product; it competes on being already open.`,
    measuredRecord: `Across {{BANK_CORRIDORS:chase}} corridors where we hold both a live Chase quote and a digital-provider quote for the same amount, the median Chase customer received {{BANK_MEDIAN:chase}} less than the best digital alternative on the same transfer. The worst corridor we measured was {{BANK_WORST:chase}}, where a specialist delivered meaningfully more for the same amount sent. We did not find a corridor in our sample where Chase's quote beat every digital provider we track.`,
    whenItMakesSense: `A Chase wire is defensible when the amount is large enough that the flat fee is a rounding error, the destination bank requires a same-day domestic-style wire your own bank can originate faster than a third party can onboard you, or the payment is part of a transaction — a property closing, a legal settlement — where the counterparty's instructions specify a bank wire and nothing else. None of those are price arguments; they are speed or compliance arguments, and it's worth being honest with yourself about which one applies before defaulting to the button already in your banking app.`,
    watchOut: `Ask for the exchange rate in writing before you confirm, and compare it to the mid-market rate for that currency pair at the same moment — the gap is the actual cost, and it will not appear as a separate line item. Also confirm whether the receiving bank charges its own incoming-wire fee, which is common and is never included in what Chase quotes you.`,
  },

  hsbc: {
    theProduct: `HSBC's position is more nuanced than "banks are expensive," and the data backs that up: HSBC Premier and Advance customers get free transfers through Global Money on many currency pairs, which genuinely competes with specialist pricing — while a standard HSBC current account holder sending the same transfer pays a visible fee plus a rate markup on top. The product is the same name covering two different price points depending entirely on which account tier you hold, which is the detail most comparisons miss.`,
    measuredRecord: `Across {{BANK_CORRIDORS:hsbc}} corridors where we hold both a live HSBC quote and a digital-provider quote for the same amount, the median HSBC customer received {{BANK_MEDIAN:hsbc}} less than the best digital alternative. That is a real cost, and it is also the more honest number than a straight average, which is dragged upward by a small number of thin corridors — our worst measured case was {{BANK_WORST:hsbc}}. On {{BANK_WINS:hsbc}} of the corridors we compare, HSBC's quote matched or beat every digital provider we track, which is worth stating plainly rather than letting the median stand in for every route.`,
    whenItMakesSense: `If you hold Premier or Advance and Global Money covers your currency pair, use it before comparing anywhere else — it is genuinely one of the better-priced options available to you, not merely the most convenient. For a standard account holder, HSBC is worth checking specifically on the corridors where our data shows it competitive rather than assumed to be expensive across the board; the pattern is not uniform, and a blanket "avoid your bank" rule would be wrong here more often than on most banks we track.`,
    watchOut: `Confirm which HSBC product you are actually being offered — Global Money and a standard international payment are priced completely differently, and the branch or app screen does not always make that obvious. If you are quoted a standard international payment, ask for the exchange rate against the mid-market rate before confirming, the same check that applies to any bank transfer.`,
  },
};

export function getBankEditorial(slug: string): BankEditorial | undefined {
  return bankEditorial[slug];
}
