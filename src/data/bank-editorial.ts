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
  /**
   * The specific corridors this bank actually beat every digital provider
   * on, via {{BANK_WIN_LIST}}. Optional — most banks have none.
   */
  namedWins?: string;
}

export const bankEditorial: Record<string, BankEditorial> = {
  "wells-fargo": {"theProduct": "Wells Fargo customers can initiate eligible international wires through Digital Wires. The decision is which currency the bank will send and what the beneficiary\u2019s bank expects to receive. A dollar wire and a foreign-currency wire can lead to different conversion steps even when they pay the same invoice.", "measuredRecord": "Our Wells Fargo comparison covers {{BANK_CORRIDORS:wells-fargo}} priced corridors. Its median payout shortfall against the best digital alternative is {{BANK_MEDIAN:wells-fargo}}; that is a relative difference in recipient amounts, not Wells Fargo\u2019s published fee schedule. Inspect the individual rows below for the route that matches your payment.", "whenItMakesSense": "An existing Wells Fargo account may make a bank wire convenient when the beneficiary has supplied bank-wire instructions. Confirm the receiving currency, beneficiary details and any intermediary fields before weighing that convenience against the quoted recipient amount.", "watchOut": "A returned foreign-currency wire can be converted back to dollars at a different rate, so the refunded dollar amount may differ from the original debit. Wells Fargo explains this in its <a href=\"https://www.wellsfargo.com/help/online-banking/wires-faqs/\" target=\"_blank\" rel=\"noopener noreferrer\">Digital Wires FAQs</a>. Save both the original instruction and any return confirmation when reconciling a failed payment."},
  chase: {
    theProduct: `Chase's international wire is the product most of its customers reach for by default, because it sits inside the app they already use, and that is precisely the habit this page exists to interrupt. The fee structure breaks down by how you send and what currency you use: $0 for foreign-currency wires above $5,000 sent through online banking or the Chase app, $5 for foreign-currency wires below that threshold, and $40 for any wire sent in US dollars regardless of amount. Branch-initiated wires add another $10 on top of those figures. Chase Private Client account holders pay no wire fees at all — a meaningful difference at mid-range transfer amounts where the $40 flat fee represents a significant slice of the total cost.

Beyond the flat fee, every Chase wire carries an exchange rate markup Chase sets itself. That markup does not appear as a fee on the confirmation screen; Chase's fee schedule acknowledges that it "makes money on foreign exchange conversions" without disclosing how much at the point of sending. A wire is a same-day-to-a-few-days transfer, and Chase does not compete on price for this product; it competes on being already open.`,
    measuredRecord: `Across {{BANK_CORRIDORS:chase}} corridors where we hold both a live Chase quote and a digital-provider quote for the same amount, the median Chase customer received {{BANK_MEDIAN:chase}} less than the best digital alternative on the same transfer. The worst corridor we measured was {{BANK_WORST:chase}}, where a specialist delivered meaningfully more for the same amount sent. We did not find a corridor in our sample where Chase's quote beat every digital provider we track.`,
    whenItMakesSense: `A Chase wire is defensible when the amount is large enough that the flat fee becomes negligible — at $50,000, a $40 fee is 0.08% of the transfer, well inside what a specialist charges on a thin corridor. It is also the practical choice when the destination bank requires a same-day bank wire your own institution can originate faster than a third-party app can verify your identity, or when the payment is part of a formal transaction — a property closing, a legal settlement, a business acquisition — where the counterparty's instructions specify a bank wire and nothing else.

Chase Private Client customers have a stronger case: no wire fee means the total cost is just the exchange rate markup, which still exists but is simpler to evaluate in isolation. For standard accounts, the $40 fee on a $1,000 transfer is 4% of the amount before any spread is added — that is the number you are comparing a specialist against, and being clear about it is the right starting point before defaulting to the button already in your banking app.`,
    watchOut: `Ask for the exchange rate in writing before you confirm, and compare it to the mid-market rate for that currency pair at the same moment — the gap is the actual cost, and it will not appear as a separate line item on the Chase confirmation screen. Also confirm whether the receiving bank charges its own incoming-wire fee; many banks levy a flat charge on inbound international wires, and that amount is never included in what Chase quotes you.

Check your account type before initiating: Chase Private Client customers pay no wire fee, which changes the total-cost picture substantially on transfers under $10,000. If you send in US dollars to an account denominated in another currency, the conversion may happen at an intermediary or receiving bank's rate rather than Chase's, so the FX markup can be split across institutions and harder to audit after the fact.`,
    namedWins: `Eligibility: any active Chase checking account supports international wires — Total Checking, Sapphire Banking, and Private Client Checking are the main tiers. There is no minimum balance requirement purely for wire access, though Chase may request additional verification for first-time international wires or amounts that fall outside your usual account activity. If you hold a Private Client relationship, confirm the fee waiver applies to outgoing international wires before initiating, since the waiver is account-level and product terms can change; it does not automatically extend to all Chase business accounts.`,
  },

  hsbc: {
    theProduct: `HSBC's position is more nuanced than "banks are expensive": the price depends on which route a customer takes inside the same app. A Global Money Account — open to most HSBC UK current account holders — sends abroad with no HSBC fee, while a standard international payment to a non-HSBC bank outside the EEA, or in a currency other than euros, costs £5 unless the customer banks with Premier or Private Banking. Both convert at an exchange rate HSBC sets, so the fee line is never the whole cost. Two routes priced differently under one name is the detail most comparisons miss.`,
    measuredRecord: `Across {{BANK_CORRIDORS:hsbc}} corridors where we hold both a live HSBC quote and a digital-provider quote for the same amount, the median HSBC customer received {{BANK_MEDIAN:hsbc}} less than the best digital alternative. That is a real cost, and it is also the more honest number than a straight average, which is dragged upward by a small number of thin corridors — our worst measured case was {{BANK_WORST:hsbc}}. On {{BANK_WINS:hsbc}} of the corridors we compare, HSBC's quote matched or beat every digital provider we track, which is worth stating plainly rather than letting the median stand in for every route.`,
    whenItMakesSense: `If you have an HSBC UK current account and Global Money covers your currency pair, check it before comparing anywhere else: it carries no HSBC fee, so the exchange rate is the entire cost, and that is easy to hold against the mid-market rate. For a standard international payment, HSBC is worth checking specifically on the corridors where our data shows it competitive rather than assumed to be expensive across the board; the pattern is not uniform, and a blanket "avoid your bank" rule would be wrong here more often than on most banks we track.`,
    watchOut: `Confirm which HSBC product you are actually being offered — Global Money and a standard international payment are priced completely differently, and the branch or app screen does not always make that obvious. If you are quoted a standard international payment, ask for the exchange rate against the mid-market rate before confirming, the same check that applies to any bank transfer.`,
    namedWins: `Named, since "matched or beat every digital provider" is a claim worth being specific about: {{BANK_WIN_LIST:hsbc}}. Both are small-value transfers, and the AUD\u2192NZD case is a single corridor rather than a pattern — don't read either as HSBC being broadly competitive, read it as the exception the median above already accounts for.`,
  },
};

export function getBankEditorial(slug: string): BankEditorial | undefined {
  return bankEditorial[slug];
}
