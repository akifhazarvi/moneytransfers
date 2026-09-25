/**
 * Hand-written editorial for the corridor pages the Sep 2026 content brief
 * named for rewriting (§4, "Pages_to_Rewrite_30pct").
 *
 * WHY HAND-WRITTEN
 * These pages are generated from a template shared with ~429 siblings, and the
 * shared blocks are large: a 714-word "how to send money in 3 simple steps", a
 * 362-word "understanding the total cost", a 125-word context paragraph that
 * differs only by country name. Filling more skeletons from the same fields
 * does not fix that — measured on this build, rewriting generated blurbs to
 * carry each page's own numbers moved one page from 87.5% to 88.9% duplicate,
 * because sentence frames collide even when every figure inside them differs.
 *
 * WHAT GOES IN HERE
 * Only what is specific to THIS route and cannot be said about any other:
 *   - the 91-day measured leader for the currency pair, via {{CORRIDOR_LEADER}};
 *   - the destination's actual payment rails (UPI and IMPS, InstaPay and
 *     PESONet, Raast and the PRI free channels), which decide what "instant"
 *     means on that route and are documented properties of the rail rather than
 *     provider claims;
 *   - the recipient details and restrictions that apply to that country;
 *   - the tax and compliance facts that apply to that direction.
 *
 * CLAIM DISCIPLINE
 * scripts/check-corridor-claims.ts exists because 71 of 108 corridors once named
 * a provider as a permanent winner that the live table contradicted. That guard
 * scans the generated corridor fields; this file is a NEW prose surface, so it
 * is scanned too (see that script's SOURCES list). The rule here is simple: any
 * sentence naming a provider as a winner must be a {{TOKEN}} that resolves from
 * the measured record, never a typed name.
 */

export interface CorridorEditorialSection {
  heading: string;
  /** May contain {{TOKEN}}s and inline <a>/<strong>/<em>. */
  body: string;
}

export interface CorridorEditorial {
  /** What is actually distinctive about sending on this route. */
  theRoute: string;
  /** The 91-day measured record for this currency pair. Token-backed. */
  measuredRecord: string;
  /** The destination's payment rails and what they mean for arrival time. */
  localRails: CorridorEditorialSection;
  /** Recipient details, limits, tax and compliance for this direction. */
  beforeYouSend: CorridorEditorialSection;
}

export const corridorEditorial: Record<string, CorridorEditorial> = {
  "send-money-to-algeria": {
    theRoute: `For Algeria, agree the receiving currency before comparing the rate. An offer paying Algerian dinars in cash, a DZD bank credit and a foreign-currency account credit are different outcomes. Confirm which one the recipient needs and which the selected provider actually supports from your sending country. The familiar € or $ symbol on the sending side does not tell you what will be available for collection in Algeria.`,
    measuredRecord: `Read each offer as a combination of source currency, fee, DZD payout and delivery method. The quotes shown here cover the selected inputs; they do not establish a universal Algeria winner or verify every collection location. An advertised exchange rate is useful only alongside a supported way for this recipient to receive the payment.`,
    localRails: {
      heading: "Arrange an Algerian collection point before paying",
      body: `<a href="https://www.poste.dz/services/particular/mandats" target="_blank" rel="noopener noreferrer">Algérie Poste's published mandate instructions</a> describe collecting a Western Union remittance at a connected postal office with the required identity and transaction details. Treat those instructions as a description of that service, not confirmation that it is currently available at every post office. Before buying a cash-pickup transfer, have the recipient confirm that the chosen office is actively paying the selected provider's transfers, the identification it accepts and its collection hours. Share the transfer reference privately after payment. For a bank credit instead, obtain the receiving bank's instructions for the intended account and currency; cash-collection instructions are not bank-routing details. Keep the quoted payout beside the collection receipt so the family can identify an unexpected deduction rather than assuming it is an exchange-rate movement.`,
    },
    beforeYouSend: {
      heading: "What a €300 budget could leave in dinars",
      body: `Consider two hypothetical offers, both charging exactly €300 in total. One deducts a €5 fee and converts €295 at DZD 145 per euro, delivering <strong>DZD 42,775</strong>. Another takes no separate fee but converts at DZD 142, delivering <strong>DZD 42,600</strong>. The first yields DZD 175 more after its fee. These invented rates explain the arithmetic; they are not a current Algerian market rate, a cash-office tariff or an offer from a named company. If the first service charged its €5 on top of the €300 principal, the total debit would be €305 and this comparison would no longer use equal budgets. Confirm the exact DZD amount promised before authorising the payment, along with any disclosed receiving charges. A recipient planning a DZD expense needs that usable amount, not an estimate derived from a different currency market or an earlier rate screenshot.`,
    },
  },
  "usa-to-india": {
    theRoute: `USD to INR is the most competitively priced corridor we track, and that is the single most useful thing to know before choosing a provider on it. A large number of services compete for it, the spread between the best and worst payout is wide enough to matter on an ordinary transfer, and the ranking moves. It is also a corridor where the payout method genuinely changes the answer: a UPI payout, a bank deposit by IFSC and a cash collection are three different products, and a provider that prices well on one may not offer another.`,
    measuredRecord: `Over the last 91 days the provider that led this corridor most often was {{CORRIDOR_LEADER:USD:INR}}. That is a different question from who is cheapest in the table on this page today, and the gap between the two is the point: a single day's ranking moves with a scrape, whereas three months of daily observations show who holds the position. Use today's table for the transfer you are about to make, and the 91-day record to judge whether a provider is worth defaulting to for the ones after that.`,
    localRails: {     heading: "UPI, IMPS, NEFT and RTGS — what a US-funded transfer actually rides on",
      body: `The rail your provider uses to pay out in India decides arrival time more than the provider's own speed claim does, and all four of India's rails are now round-the-clock: <strong>UPI</strong> and <strong>IMPS</strong> settle in seconds any time, any day. <strong>NEFT</strong> runs 24x7x365 in 48 half-hourly batches — that has been true since 16 December 2019, so a payment sent Saturday is not waiting for Monday. <strong>RTGS</strong>, for larger transfers, has settled in real time 24x7x365 since 14 December 2020 (sources: <a href="https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=11750" target="_blank" rel="noopener noreferrer">RBI NEFT master direction</a>, <a href="https://www.rbi.org.in/scripts/FS_FAQs.aspx?Id=65" target="_blank" rel="noopener noreferrer">RBI RTGS FAQ</a>). What actually adds time on a USD-funded transfer is the US side: ACH funding from a US bank account typically takes one to two business days to clear before the Indian leg even starts, while a debit card funds instantly but usually carries a higher fee. If arrival date matters, the US funding method is the lever to check — the Indian rail is no longer the bottleneck it used to be.` },
    beforeYouSend: {
      heading: "Recipient details, purpose and the US remittance tax",
      body: `For a bank deposit you need the account-holder name exactly as the bank holds it, the account number and the branch <strong>IFSC</strong>; for a UPI payout you need the UPI ID and must select UPI explicitly, because a bank-deposit quote does not necessarily cover it. Some providers also ask the purpose of the payment, and the permitted purposes differ — a service that quotes you a rate for family support is not automatically available for a property or business payment, so confirm the purpose and the receiving account type before relying on a quoted price. On tax: since 1 January 2026 a US federal excise tax of 1% applies to covered remittance transfers funded with cash, money orders, cashier's cheques or similar physical instruments, while transfers funded from an account or with a US-issued debit or credit card are excluded. How you pay therefore changes what you owe, separately from any gift-tax reporting and from Indian tax treatment at the receiving end.`,
    },
  },

  "send-money-to-india": {
    theRoute: `This page covers sending to India from anywhere, which makes it a different question from any single-country route: the providers available to you, the funding methods and the price all depend on where you are sending from, while the receiving side — the rails, the recipient details, the restrictions — is the same for everyone. What follows is the receiving side, which is the half that does not change, plus the measured record for the largest corridor into India.`,
    measuredRecord: `On USD to INR, the highest-volume route into the country, the provider that led most often over the last 91 days was {{CORRIDOR_LEADER:USD:INR}}. If you are sending from the UK, the Gulf, Canada, Australia or the EU the competitive set differs, so treat that as the benchmark for the largest corridor rather than a universal answer, and check the comparison for your own currency above. The broader pattern holds across most routes into India: several providers price closely, and the leader is not the same every day.`,
    localRails: {     heading: "UPI, IMPS, NEFT and RTGS — what each means for arrival time",
      body: `India runs several domestic rails and which one your provider uses decides when the money is usable, independently of how fast the provider says it is. All four of India's major payment rails now run continuously: <strong>UPI</strong> and <strong>IMPS</strong> settle in seconds, 24/7 including weekends and holidays, addressed by a UPI ID or by account number plus IFSC. <strong>NEFT</strong> has run 24x7x365 in 48 half-hourly batches since 16 December 2019 — a Friday-evening NEFT payment no longer waits for Monday, it settles in the next half-hourly window, any day of the week. <strong>RTGS</strong>, for higher-value transfers, has settled in real time 24x7x365 since 14 December 2020. These are properties of the rail, published by the Reserve Bank of India, not promises by any transfer company (sources: <a href="https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=11750" target="_blank" rel="noopener noreferrer">RBI NEFT master direction</a>, <a href="https://www.rbi.org.in/scripts/FS_FAQs.aspx?Id=65" target="_blank" rel="noopener noreferrer">RBI RTGS FAQ</a>) — a provider quoting "instant" is describing the leg it controls, which does not include the time your own funding takes to clear or how long verification runs on a first transfer. If the deadline matters, pick the payout rail first and the provider second.` },
    beforeYouSend: {
      heading: "What the recipient needs, wherever you send from",
      body: `A bank deposit into an Indian account needs the account-holder name as the bank holds it, the account number and the branch <strong>IFSC</strong>. A UPI payout needs the UPI ID and has to be selected explicitly. Many providers ask the purpose of the payment, and permitted purposes vary between services — family maintenance is routinely supported, while investment, property and business payments frequently are not, so confirm before you commit to a provider on price alone. Recipients should also expect that the name on the transfer must match the account exactly; a mismatch is the most common cause of a returned payment on this route. If you are sending from the United States, check how you are funding the transfer, because a 1% federal excise tax applies to covered transfers funded with cash or similar physical instruments and not to account-funded or card-funded ones.`,
    },
  },

  "usa-to-philippines": {
    theRoute: `USD to PHP is one of the most heavily served corridors in the world and the competition shows up in the pricing, but the decision here is rarely about price alone. The Philippines has an unusually developed wallet ecosystem alongside a large cash-collection network, so the realistic question is how your recipient prefers to receive money — GCash or Maya, a bank account, or cash at a branch or pawnshop counter — and only then which provider prices that method best.`,
    measuredRecord: `Over the last 91 days the provider that led this corridor most often was {{CORRIDOR_LEADER:USD:PHP}}. That is a measure of who held the best payout across three months of daily observations, not of who is cheapest in the table above right now — the two frequently differ, which is exactly why a single check is a poor basis for a habit. For a one-off transfer use today's figures; for monthly support, the longer record is the better guide.`,
    localRails: {    heading: "InstaPay, PESONet and the wallets — plus the US-funding lag",
      body: `The Philippines has two domestic clearing rails and they behave differently. <strong>InstaPay</strong> is real-time, runs 24/7, and is capped per transaction — so a larger transfer may be split or routed elsewhere. <strong>PESONet</strong> is a batch rail: submit before the day's cut-off and it credits the same banking day, submit after and it lands the next one, with weekends and holidays not counting. Wallet payouts to <strong>GCash</strong> and <strong>Maya</strong> generally ride InstaPay. What a US sender should weigh alongside the Philippine side: funding from a US bank account via ACH typically takes a day or two to clear before the transfer even starts, so a debit-card-funded transfer often beats an ACH-funded one to InstaPay on total elapsed time, even though InstaPay itself is instant once the money moves. These are documented rail properties from BSP and the clearing operators, not provider claims.` },
    beforeYouSend: {
      heading: "Wallet numbers, name matching and the US remittance tax",
      body: `For a wallet payout you need the recipient's <strong>GCash</strong> or <strong>Maya</strong> mobile number and the registered name, which must match — wallets reject mismatches rather than holding them. For a bank deposit you need the account number and the account-holder name as registered. For cash pickup the recipient needs valid photo identification matching the name on the transfer exactly, and it is worth confirming the specific branch or agent before sending, because coverage varies a great deal outside the metros. On tax: since 1 January 2026 a 1% US federal excise tax applies to covered remittance transfers funded with cash, money orders or cashier's cheques, and does not apply to transfers funded from an account or with a US-issued card — so the way you pay changes the total, not just the fee.`,
    },
  },

  "send-money-to-philippines": {
    theRoute: `Sending to the Philippines is defined by how money is received rather than by where it is sent from. The country has one of the highest rates of wallet adoption for remittances anywhere, alongside a dense cash-collection network built over decades of overseas work, and both are used heavily. A provider that prices well into a bank account may be irrelevant if your recipient uses GCash and has no bank, and the reverse is also true.`,
    measuredRecord: `On USD to PHP, the largest corridor into the country, the provider that led most often over the last 91 days was {{CORRIDOR_LEADER:USD:PHP}}. If you are sending from the Gulf, Singapore, Hong Kong, Japan or Europe the competing set is different — those are major Philippine corridors in their own right — so use the comparison above for your own currency and treat the figure here as the benchmark for the largest route.`,
    localRails: {    heading: "InstaPay, PESONet and the wallets",
      body: `The Philippines has two domestic clearing rails and they behave differently. <strong>InstaPay</strong> is real-time, runs 24/7, and is capped per transaction — so a larger transfer may be split or routed elsewhere. <strong>PESONet</strong> is a batch rail: submit before the day's cut-off and it credits the same banking day, submit after and it lands the next one, with weekends and holidays not counting. Wallet payouts to <strong>GCash</strong> and <strong>Maya</strong> generally ride InstaPay and are the usual way money is received by recipients without a bank account. Cash pickup through the pawnshop and remittance networks remains widely used outside the cities. These are documented rail properties from BSP and the clearing operators rather than provider claims; the practical consequence is that "same day" through PESONet and "instant" through InstaPay are different promises, and a wallet payout is usually the faster of the two.` },
    beforeYouSend: {
      heading: "What your recipient needs to collect the money",
      body: `A wallet payout needs the registered mobile number and the name exactly as registered on the <strong>GCash</strong> or <strong>Maya</strong> account. A bank deposit needs the account number and matching account-holder name. Cash collection needs photo identification matching the transfer exactly, and a specific branch or agent that is actually open — coverage and hours vary widely outside the cities, and a marginally better rate at an inconvenient counter is worth nothing to the person collecting. Confirm the payout method before comparing prices, because the cheapest quote on this page may be for a method your recipient cannot use.`,
    },
  },

  "usa-to-pakistan": {
    theRoute: `USD to PKR is a heavily used corridor with an unusual feature: Pakistan actively encourages remittances through formal channels, and that policy shows up as waived charges on some routes rather than as a better headline rate. The result is that the cheapest published quote is not always the cheapest transfer, and it is worth asking a provider or the receiving bank directly whether a transfer qualifies for free-channel treatment before assuming the comparison table is the whole picture.`,
    measuredRecord: `Over the last 91 days the provider that led this corridor most often was {{CORRIDOR_LEADER:USD:PKR}}. That reflects who held the best payout across three months of daily observation rather than who tops the table on this page today. Both are useful and they answer different questions — today's table for the transfer you are making now, the 91-day record for whether a provider deserves to be your default.`,
    localRails: {    heading: "Raast, IBFT and the wallets — and the US-funding lag",
      body: `Pakistan's instant rail is <strong>Raast</strong>, run by the State Bank of Pakistan, which settles bank-to-bank in real time, 24/7, and is addressed by a Raast ID linked to a mobile number or by IBAN. <strong>IBFT</strong> is the older interbank transfer rail, also effectively immediate. Wallet payouts to <strong>JazzCash</strong> and <strong>Easypaisa</strong> reach recipients without a bank account. What actually adds time on a USD-funded transfer is usually the US side, not Pakistan's: ACH funding from a US bank account typically takes a day or two to clear before the Pakistani leg starts, while a debit card funds instantly at a higher fee. Separately, ask whether your transfer qualifies for free-channel treatment under the <strong>Pakistan Remittance Initiative</strong> — some banks waive charges on qualifying inward remittances, a saving invisible in any rate comparison.` },
    beforeYouSend: {
      heading: "Recipient details, verification and the US remittance tax",
      body: `A bank deposit needs the recipient's <strong>IBAN</strong> and the account-holder name as the bank holds it; a Raast payout can be addressed by Raast ID linked to a mobile number. Wallet payouts to <strong>JazzCash</strong> or <strong>Easypaisa</strong> need the registered mobile number and matching name. Recipients collecting cash for the first time may be asked for biometric verification at the counter, which is routine but worth warning them about. Ask explicitly whether the transfer qualifies for free-channel treatment under the remittance initiative, since that saving is invisible in a rate comparison. On tax: since 1 January 2026 a 1% US federal excise tax applies to covered transfers funded with cash, money orders or cashier's cheques, and not to account-funded or US card-funded transfers.`,
    },
  },

  "send-money-to-pakistan": {
    theRoute: `Pakistan receives remittances from a small number of very large corridors — the Gulf states, the UK, the US, Saudi Arabia — and the sending country changes the competitive set considerably. What does not change is the receiving side: the rails, the recipient details, the verification a first-time cash collection triggers, and the formal-channel policy that can waive charges on qualifying transfers. Those are the parts worth understanding before you pick on price.`,
    measuredRecord: `On USD to PKR the provider that led most often over the last 91 days was {{CORRIDOR_LEADER:USD:PKR}}. From the UK, the UAE or Saudi Arabia the competing providers differ, so use the comparison above for your own currency; the figure here is the benchmark for the US route specifically, measured across three months of daily observations rather than a single check.`,
    localRails: {    heading: "Raast, IBFT and the wallets — and the free-channel question",
      body: `Pakistan's instant rail is <strong>Raast</strong>, run by the State Bank of Pakistan, which settles bank-to-bank in real time, 24/7, and is addressed by a Raast ID linked to a mobile number or by IBAN. <strong>IBFT</strong> is the older interbank transfer rail, also effectively immediate. Wallet payouts to <strong>JazzCash</strong> and <strong>Easypaisa</strong> reach recipients without a bank account and are the dominant method outside the major cities. Separately, the <strong>Pakistan Remittance Initiative</strong> exists specifically to move remittances through formal channels, and the reason it matters to a sender is that some banks and providers waive charges on qualifying inward remittances. That is worth asking about directly, because it is the kind of saving that never appears in a comparison table. Recipients may also be asked to complete biometric verification before a first cash collection.` },
    beforeYouSend: {
      heading: "Recipient details and the free-channel question",
      body: `For a bank deposit you need the recipient's <strong>IBAN</strong> and the name as the bank holds it. For a wallet payout to <strong>JazzCash</strong> or <strong>Easypaisa</strong> you need the registered mobile number and the matching registered name. For cash collection the recipient needs identification matching the transfer, and may face biometric verification on a first collection. Ask the provider or the receiving bank whether your transfer qualifies for free-channel treatment under Pakistan's remittance initiative — several banks waive charges on qualifying inward remittances, and because that saving sits outside the quoted rate it never appears in any comparison table, including ours.`,
    },
  },

  "uk-to-vietnam": {
    theRoute: `GBP to VND is a thinner corridor than the South Asian and Philippine routes, and that thinness is the main thing to plan around: fewer providers quote it, the spread between them can be wide, and availability varies by payout method more than on a heavily contested route. Vietnam is also a managed-currency destination, which means the receiving bank takes a closer interest in what the money is for than a recipient bank in the eurozone would.`,
    measuredRecord: `We do not hold a 91-day leader record for GBP to VND. The corridor is not contested on enough days in our data for that measure to mean anything, so rather than publish a figure with a sample too thin to support it, we are saying plainly that it does not exist. Use the live comparison above, and check a second quote directly with the provider before sending — on a thin corridor the spread between services is typically wider than on a busy one, so the comparison is worth more here, not less.`,
    localRails: {     heading: "How money actually reaches a recipient in Vietnam",
      body: `Vietnam clears domestic transfers through <strong>NAPAS</strong>, which supports fast interbank credit to the major banks, and payouts are typically made to a VND bank account or collected in cash at a bank branch or agent. The dong is a managed currency and inward personal remittances are permitted and routine, but the receiving bank will ask what the money is for — family support is the ordinary category — and the recipient will need identification that matches the account exactly. Name-matching is stricter here than most senders expect: a middle name transposed or a diacritic dropped is a common reason a payment is returned rather than credited. These are properties of the receiving system rather than of any provider, so they apply whichever service you choose.` },
    beforeYouSend: {
      heading: "Recipient details and the purpose question",
      body: `You will need the recipient's full name exactly as the bank holds it, including middle names and correct diacritics, their account number and the bank's name and branch. Expect to state the purpose of the transfer — family support is the ordinary category for personal remittances — and expect the recipient to present identification matching the account when collecting cash. Because fewer services compete on this route, confirm that your chosen provider actually supports GBP to VND for your funding method and payout method before committing: a quote on a currency pair does not confirm the provider accepts senders in the UK or pays out the way your recipient needs.`,
    },
  },
};

export function getCorridorEditorial(slug: string): CorridorEditorial | undefined {
  return corridorEditorial[slug];
}
