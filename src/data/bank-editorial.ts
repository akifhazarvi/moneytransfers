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
  /** Bank-specific questions, appended to the page's FAQ list. */
  faqs?: { q: string; a: string }[];
}

export const bankEditorial: Record<string, BankEditorial> = {
  "wells-fargo": {"theProduct": "Wells Fargo customers can initiate eligible international wires through Digital Wires. The decision is which currency the bank will send and what the beneficiary\u2019s bank expects to receive. A dollar wire and a foreign-currency wire can lead to different conversion steps even when they pay the same invoice.", "measuredRecord": "Our Wells Fargo comparison covers {{BANK_CORRIDORS:wells-fargo}} priced corridors. Its median payout shortfall against the best digital alternative is {{BANK_MEDIAN:wells-fargo}}; that is a relative difference in recipient amounts, not Wells Fargo\u2019s published fee schedule. Inspect the individual rows below for the route that matches your payment.", "whenItMakesSense": "An existing Wells Fargo account may make a bank wire convenient when the beneficiary has supplied bank-wire instructions. Confirm the receiving currency, beneficiary details and any intermediary fields before weighing that convenience against the quoted recipient amount.", "watchOut": "A returned foreign-currency wire can be converted back to dollars at a different rate, so the refunded dollar amount may differ from the original debit. Wells Fargo explains this in its <a href=\"https://www.wellsfargo.com/help/online-banking/wires-faqs/\" target=\"_blank\" rel=\"noopener noreferrer\">Digital Wires FAQs</a>. Save both the original instruction and any return confirmation when reconciling a failed payment."},
  chase: {
    theProduct: `Chase's international wire is the product most of its customers reach for by default, because it sits inside the app they already use, and that is precisely the habit this page exists to interrupt. A wire is a same-day-to-a-few-days transfer priced with a flat fee and a rate Chase sets itself — there is no published mid-market benchmark on the confirmation screen, so the customer has no way to see the markup at the point of sending. Chase does not compete on price for this product; it competes on being already open.`,
    measuredRecord: `Across {{BANK_CORRIDORS:chase}} corridors where we hold both a live Chase quote and a digital-provider quote for the same amount, the median Chase customer received {{BANK_MEDIAN:chase}} less than the best digital alternative on the same transfer. The worst corridor we measured was {{BANK_WORST:chase}}, where a specialist delivered meaningfully more for the same amount sent. We did not find a corridor in our sample where Chase's quote beat every digital provider we track.`,
    whenItMakesSense: `A Chase wire is defensible when the amount is large enough that the flat fee is a rounding error, the destination bank requires a same-day domestic-style wire your own bank can originate faster than a third party can onboard you, or the payment is part of a transaction — a property closing, a legal settlement — where the counterparty's instructions specify a bank wire and nothing else. None of those are price arguments; they are speed or compliance arguments, and it's worth being honest with yourself about which one applies before defaulting to the button already in your banking app.`,
    watchOut: `Ask for the exchange rate in writing before you confirm, and compare it to the mid-market rate for that currency pair at the same moment — the gap is the actual cost, and it will not appear as a separate line item. Also confirm whether the receiving bank charges its own incoming-wire fee, which is common and is never included in what Chase quotes you. Chase Private Client Checking waives Chase's wire fee, but the fee schedule says that waiver "does not apply to the spread we include in the foreign currency exchange rate", so the rate check applies on every tier. A wire sent in US dollars to an account held in another currency is usually converted by the receiving bank, at a rate you cannot see before you send.`,
  },

  // Lloyds Bank (2026-10-18): from Lloyds' own help pages as published in
  // April–July 2026 (lloydsbank.com answered scripted requests with an Akamai
  // "Error 1007" page on the day, so the figures were read from archived copies
  // of those pages and are dated in the copy). The previous note ("£9.50 for a
  // SEPA payment, up to £20 for SWIFT, a 2.8-4.5% margin, less online") was
  // wrong: euro payments carry no Lloyds fee and the fee is the same by channel.
  lloyds: {
    theProduct: `As Lloyds published it in April 2026, personal customers pay no Lloyds fee for an international payment in euro and £9.50 for any other, whether it is made in the app, online, in a branch or by phone (the fee does not apply to pounds sent from its Basic Account). App and online payments always use shared charges, so the recipient bears any agent-bank or receiving-bank deductions; in a branch or by phone, a payment outside the UK and EEA can arrive in full if you add a correspondent bank fee of £12 to the USA, Canada and non-EEA Europe or £20 elsewhere (<a href=\"https://www.lloydsbank.com/help-guidance/everyday-banking/payments-and-transfers/send-international-payment.html\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Lloyds international payments</a>). Lloyds converts at its standard exchange rate, which it says "includes a margin" over the wholesale rate that "changes depending on how much you send".`,
    measuredRecord: `Across {{BANK_CORRIDORS:lloyds}} corridors where we priced Lloyds and a digital provider on the same route and amount, the median Lloyds payout came in {{BANK_MEDIAN:lloyds}} below the best digital quote. Lloyds' £9.50 fee is part of that gap; the rest is the margin in its standard exchange rate, which is why the recipient amount is the figure to compare.`,
    whenItMakesSense: `Lloyds charges no fee on euro payments, so for euros to an account in the UK or the EEA the exchange rate is the only cost, and Lloyds says it tells you that rate when you request the payment. A branch or phone payment with the correspondent fee added also suits a recipient who must receive the exact amount sent, which shared-charge app payments cannot promise.`,
    watchOut: `Lloyds processes a payment requested before 3pm on a working day the same day; later requests, and those made at weekends or on bank holidays, wait for the next working day, and Lloyds says euro payments made in a branch or by phone may have an earlier 2pm cut-off. Its guide then gives times to reach the recipient's bank: euro to the UK, the EEA, Monaco, Switzerland or San Marino "no later than the next working day"; North America, South Africa, Australia, New Zealand, the Middle East and the Far East "no longer than four working days"; any other country "no longer than five working days". The minimum payment is £1.01, and Lloyds lists limits of £100,000 a day in the app or online banking and £10,000 through Telephone Banking. If you send pounds, Lloyds notes you may not know the rate the receiving bank will use, and a payment held over to the next working day is cancelled if your account lacks the money when Lloyds tries to take it.`,
    faqs: [
      {
        q: "What details does Lloyds Bank need to send money abroad?",
        a: `For payments to the UK and EEA, <a href=\"https://www.lloydsbank.com/help-guidance/everyday-banking/payments-and-transfers/send-international-payment.html\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Lloyds asks for</a> the recipient's full name and address, IBAN and SWIFT/BIC; for the rest of the world it also wants the name and address of the recipient's bank, a clearing code and the reason for the payment. Lloyds says it needs an IBAN and BIC for every EU and EEA country and for others including Pakistan, Turkey, the UAE, Saudi Arabia, Switzerland and Israel. Some countries also need a purpose-of-payment code typed into the reference field: Lloyds says one is required for all payments to Qatar and for dinar payments to Kuwait, and that you must give it to avoid a delay.`,
      },
      {
        q: "Does Lloyds Bank charge to receive money from abroad?",
        a: `Usually. Lloyds' <a href=\"https://www.lloydsbank.com/help-guidance/everyday-banking/payments-and-transfers/receive-international-payment.html\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">receiving page</a> lists no fee for euro payments from within the UK, the EEA or by SEPA credit transfer, £2 for other incoming payments up to and including £100 and £7 above £100; the fee does not apply to pounds received from within the EU into its Basic Account. Money in another currency is converted into pounds on the day it is paid in, at Lloyds' standard exchange rate. The sender's bank may route the payment through an agent bank that takes a fee, so Lloyds can receive, and credit, less than was sent.`,
      },
      {
        q: "Can I track, cancel or recall an international payment from Lloyds Bank?",
        a: `Lloyds' guidance is to phone: if you gave the wrong details, want to cancel the payment, or the recipient says an overdue payment has not arrived, it asks you to call as soon as you can, checks its payment tracking system and talks you through the options. Lloyds does not charge to trace a payment, though other banks involved may. If a foreign-currency payment is returned, Lloyds refunds your account at its standard exchange rate, so the amount you get back may be less than you sent, and it has a separate contact route for suspected scams.`,
      },
      {
        q: "Does Confirmation of Payee check an international payment from Lloyds Bank?",
        a: `No. Lloyds' <a href=\"https://www.lloydsbank.com/help-guidance/everyday-banking/payments-and-transfers/name-checks.html\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">name checks page</a> says Confirmation of Payee, which it runs on UK sterling payments to someone you have not paid before, "doesn't cover sending money outside of the UK", and asks you to send only to someone you know or have looked into and trust. Lloyds does run <a href=\"https://www.lloydsbank.com/help-guidance/everyday-banking/payments-and-transfers/security-checks.html\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">extra security checks</a> when you pay someone new, and says that if you do not use its app, or it does not have your phone number, you might not be able to continue. It warns that a fraudulent payment is very hard to recover, because paying into a bank account "is like handing over cash".`,
      },
    ],
  },

  // Barclays (2026-10-18): every fee below is from Barclays' own tariff and
  // help pages. The previous note ("£25 online, £15 for Premier, a 2-3% FX
  // margin") was wrong: app and Online Banking payments carry no Barclays fee.
  barclays: {
    theProduct: `Barclays charges no fee for an international payment made in its app or Online Banking, and £25 in a branch or by Telephone Banking; SEPA Credit Transfers cost £0 by any channel (<a href=\"https://www.barclays.co.uk/content/dam/documents/personal/current-accounts/barclays-tariff-for-personal-customers.pdf\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Barclays personal tariff</a>). Sending US dollars to an account outside the US adds a £3 USD cover charge. You choose who pays other banks' charges: SHA (the recipient bears overseas banks' fees), OUR (you also pay an overseas bank charge of £4, £6 or £12, by destination) or BEN (the recipient pays them). Barclays converts at "the latest Barclays reference exchange rate", which it says is "based on the market exchange rates for the two currencies" (<a href=\"https://www.barclays.co.uk/ways-to-bank/international-bank-transfers/\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Barclays international payments</a>), plus a currency conversion charge.`,
    measuredRecord: `Where we hold a live Barclays quote and a digital provider's quote for the same route and amount ({{BANK_CORRIDORS:barclays}} corridors), the median Barclays payout falls {{BANK_MEDIAN:barclays}} short of the best digital alternative. With no Barclays fee in the app, that gap arrives through the exchange rate, so compare the amount the recipient gets, not the fee line.`,
    whenItMakesSense: `A euro payment that goes as a SEPA Credit Transfer costs £0 through any Barclays channel, and other international payments carry no Barclays fee in the app, so a Barclays transfer is reasonable when the recipient's bank asks for a payment from a UK bank account and the amount is large: Barclays says its exchange rates "are usually better for higher value transactions", and its tariff says the conversion charge reduces above £25,000.`,
    watchOut: `Barclays publishes a cut-off time for each currency on its <a href=\"https://www.barclays.co.uk/ways-to-bank/online-banking/help/payment-account-transfer-deadlines/\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">payment deadlines page</a>. Pay before it and Barclays says it sends the payment the same day; pay after it and the money still leaves your account that day, but the recipient receives it the next working day, and payments made at weekends or on UK bank holidays go the next working day. The table lists euros at 14:00, sterling and US dollars at 18:00, Indian rupees at 14:30 and Philippine pesos at 09:15. Payments in Chinese yuan, Pakistani rupees, Sri Lankan rupees and Zambian kwacha can only be made in person at a Barclays location. <a href=\"https://www.barclays.co.uk/ways-to-bank/international-bank-transfers/sending-international-payments/\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Barclays says</a> payments to Europe usually arrive within one working day and payments to the US the same or the next working day, that it shows when to expect the money before you confirm, and that delivery can take longer if it needs extra checks or the recipient's bank delays the payment.`,
    faqs: [
      {
        q: "What does Barclays need for an international payment, and how much can I send?",
        a: `<a href=\"https://www.barclays.co.uk/ways-to-bank/international-bank-transfers/\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Barclays asks for</a> the recipient's full name as shown on their account, their address, their bank's address, their account number or IBAN, and their bank's SWIFT/BIC or national clearing code; a SEPA payment needs only the name, bank address and IBAN. Some countries also require a purpose of payment: for India, Barclays says a family maintenance payment that omits the payee's relationship to you won't be accepted. You must be 16 or over with a Barclays current account to send from the app. The <a href=\"https://www.barclays.co.uk/help/payments/payment-information/online-banking-limits/\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">daily payment limit</a> is £50,000 from a personal current account and £100,000 from Premier, including international payments set up that day; Barclays says limits may be different in a branch.`,
      },
      {
        q: "Should I send pounds or the recipient's currency from a Barclays account?",
        a: `Barclays' <a href=\"https://www.barclays.co.uk/content/dam/documents/personal/site-hygiene/9910542b_RCA_04.25%20_hi_res.pdf\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">personal terms</a> say that when you pay in a currency other than your account's, it converts at the Barclays reference exchange rate plus a margin "based on the payment amount", which it will tell you if you ask, and it shows rates, fees and charges before you send. Barclays says its rates are usually better for higher value transactions, so splitting a payment can cost more. A sterling payment from a sterling account needs no Barclays conversion, but then the receiving bank converts it, and Barclays does not publish what that costs. For some branch-only destinations the home currency is not available, so you send sterling, euros or US dollars.`,
      },
      {
        q: "Does Barclays charge to receive money from abroad?",
        a: `<a href=\"https://www.barclays.co.uk/ways-to-bank/international-bank-transfers/receiving-international-payments/\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Barclays charges £6</a> for an incoming international payment over £100, unless it arrives in euros as a SEPA payment or from the EEA; £100 or less is free. The sender may be offered the option to pay the charges; if not, overseas banks' fees and Barclays' own come out of the payment before it reaches you. Give the sender your IBAN, Barclays' SWIFT/BIC, your full name and address, and the amount and currency. Barclays converts foreign currency into your account's currency at its reference rate plus a margin, and says most payments arrive within one or two working days but cannot guarantee it; if one is missing, ask the sender to contact their bank.`,
      },
      {
        q: "Can I cancel or recall a Barclays international payment, and is it covered by scam refunds?",
        a: `Under Barclays' terms, cancelling is free if the payment hasn't left your account. Once it has, the <a href=\"https://www.barclays.co.uk/content/dam/documents/personal/current-accounts/barclays-tariff-for-personal-customers.pdf\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">tariff</a> lists £20 for cancelling, recalling, tracing or changing it, with tracing charged only if you gave incorrect details. Barclays refunds the original amount less fees already charged and normally won't pass on currency gains or losses; if you gave wrong details you are responsible, though Barclays says it will try to help. Its Confirmation of Payee check covers new CHAPS, Faster Payment and standing order payees, and its terms define an APP scam as a sterling payment to a UK account. The <a href=\"https://www.psr.org.uk/our-work/app-scams/\" target=\"_blank\" rel=\"noopener noreferrer\">Payment Systems Regulator's</a> reimbursement scheme covers Faster Payments and CHAPS between UK accounts, which leaves an international payment outside it.`,
      },
    ],
  },

  hsbc: {
    theProduct: `HSBC's position is more nuanced than "banks are expensive": the price depends on which route a customer takes inside the same app. A Global Money Account — open to most HSBC UK current account holders — sends abroad with no HSBC fee, while a standard international payment to a non-HSBC bank outside the EEA, or in a currency other than euros, costs £5 unless the customer banks with Premier or Private Banking. Both convert at an exchange rate HSBC sets, so the fee line is never the whole cost. Two routes priced differently under one name is the detail most comparisons miss.`,
    measuredRecord: `Across {{BANK_CORRIDORS:hsbc}} corridors where we hold both a live HSBC quote and a digital-provider quote for the same amount, the median HSBC customer received {{BANK_MEDIAN:hsbc}} less than the best digital alternative. That is a real cost, and it is also the more honest number than a straight average, which is dragged upward by a small number of thin corridors — our worst measured case was {{BANK_WORST:hsbc}}. On {{BANK_WINS:hsbc}} of the corridors we compare, HSBC's quote matched or beat every digital provider we track, which is worth stating plainly rather than letting the median stand in for every route.`,
    whenItMakesSense: `If you have an HSBC UK current account and Global Money covers your currency pair, check it before comparing anywhere else: it carries no HSBC fee, so the exchange rate is the entire cost, and that is easy to hold against the mid-market rate. For a standard international payment, HSBC is worth checking specifically on the corridors where our data shows it competitive rather than assumed to be expensive across the board; the pattern is not uniform, and a blanket "avoid your bank" rule would be wrong here more often than on most banks we track.`,
    watchOut: `Confirm which HSBC product you are actually being offered — Global Money and a standard international payment are priced completely differently, and the branch or app screen does not always make that obvious. If you are quoted a standard international payment, ask for the exchange rate against the mid-market rate before confirming, the same check that applies to any bank transfer.`,
    namedWins: `Named, since "matched or beat every digital provider" is a claim worth being specific about: {{BANK_WIN_LIST:hsbc}}. Both are small-value transfers, and the AUD→NZD case is a single corridor rather than a pattern — don't read either as HSBC being broadly competitive, read it as the exception the median above already accounts for.`,
  },
};

export function getBankEditorial(slug: string): BankEditorial | undefined {
  return bankEditorial[slug];
}
