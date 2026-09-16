/**
 * Hand-written editorial for the provider review pages.
 *
 * WHY THIS FILE EXISTS
 * The Sep 2026 content brief (§4) names 11 /companies/* pages at 30-60%
 * duplicate and asks for unique blocks on each. src/lib/provider-profile.ts
 * already made the argument against solving that with more generation, in its
 * own header: "More skeletons filled from the same fields is the same
 * scaled-content signal in a different costume." Measured on the build it was
 * right — rewriting the /compare/* blurbs to cite each pair's own numbers moved
 * one page from 87.5% to 88.9% duplicate, because sentence frames collide even
 * when every figure inside them differs. So these are written one at a time.
 *
 * WHAT WE CAN SAY THAT COMPETITORS CANNOT
 * Monito, Exiap, NerdWallet and the rest publish a point-in-time quote and an
 * editorial opinion. We hold 125,676 provider-day observations across 216
 * comparable corridors over a 91-day window, which supports three claims none
 * of them can make:
 *
 *   1. How often a provider actually LED its corridors, with the denominator —
 *      not "cheap", but 41 of 153.
 *   2. How far behind it sits when it does not lead (average shortfall), which
 *      separates "rarely first but always close" from "rarely first and far
 *      back" — the difference between Revolut and PayPal.
 *   3. What a provider costs at $100 versus $1,000. This is the finding most
 *      worth publishing: Wise costs 7.77% on $100 against 1.75% on $1,000, a
 *      6.02pp penalty and the worst of any provider we price, while InstaReM is
 *      cheaper on the small transfer than the large one. Every competitor
 *      review recommends Wise flatly; none of them tells a reader sending $100
 *      that it is the wrong tool.
 *
 * WHY THE FIGURES ARE TOKENS
 * CLAUDE.md: never hand-type a figure a dataset already knows. Figures below are
 * {{TOKEN}}s resolved at render against the same indices the rest of the site
 * publishes, so the prose cannot drift from the data. A provider we do not
 * measure gets no measured claim at all — check:rankings fails a silent one.
 */

export interface CompanyEditorialSection {
  heading: string;
  /** May contain {{TOKEN}}s and inline <a>/<strong>/<em>. */
  body: string;
}

export interface CompanyEditorial {
  /** What this provider actually is, and the decision it belongs in. */
  theVerdict: string;
  /** Our longitudinal record for it, stated with denominators. */
  measuredRecord: string;
  /** Where it genuinely wins. */
  whereItWins: CompanyEditorialSection;
  /** Where it is the wrong tool — named plainly. */
  whereItLoses: CompanyEditorialSection;
  /** The specific thing a reader should check before committing. */
  watchOut: string;
}

export const companyEditorial: Record<string, CompanyEditorial> = {
  wise: {
    theVerdict: `Wise is the default recommendation of almost every comparison site, and on the evidence we hold that is mostly deserved — but the recommendation is usually made without a condition attached, and it needs one. Wise publishes the mid-market rate and charges a visible fee instead of burying its margin in the rate, which is why it leads more corridors than anything else we track. That same fee structure is what makes it the wrong tool for a small transfer: the fee does not shrink with the amount, so it eats a much larger share of $100 than of $1,000. Wise is a bank-to-bank service with no cash payout at all, so it is also not an option when the recipient cannot receive a deposit.`,
    measuredRecord: `Over the last 91 days Wise led {{LED:wise}} of the corridors where we could compare it — a {{WINRATE:wise}} win rate, the highest of any provider we track — and when it was not first it trailed the leader by {{SHORTFALL:wise}} on average. Across {{COSTCORRIDORS:wise}} corridors its average all-in cost at $1,000 was {{AVGCOST:wise}}. Now the part that is usually left out: at $100 that figure is {{SMALLCOST:wise}} against {{BIGCOST:wise}} at $1,000, a penalty of {{SMALLPENALTY:wise}} — the largest gap between small and large transfers of any provider we price. Wise is simultaneously the most reliable choice at $1,000 and one of the most expensive at $100. Both statements come from the same dataset.`,
    whereItWins: {
      heading: "Best for bank-to-bank transfers of $1,000 and up",
      body: `If the recipient has an account and the amount is meaningful, Wise is the strongest evidence-backed choice on this site. The 0% markup means its cost does not scale with the transfer the way a percentage markup does, so the advantage widens as the amount grows — which is why it suits tuition, rent, payroll, contractor invoices and moving money between your own accounts abroad. It supports transfers to $1,000,000, holds balances in 50 currencies, and is regulated by the FCA, FinCEN and ASIC. The rate it gives you is one you can check against any published mid-market quote, which is not true of a provider that marks the rate up.`,
    },
    whereItLoses: {
      heading: "Avoid for small amounts and any cash payout",
      body: `At $100 Wise cost {{SMALLCOST:wise}} on our measurements — worse than most specialist remittance apps, several of which charge roughly the same in percentage terms at $100 as at $1,000. If you are sending small amounts regularly, this is the single most expensive habit on this page, and the providers built for that pattern beat it clearly. Wise also has no cash pickup, no mobile money and no home delivery, and reaches 80 countries against 100-200 for the remittance networks. For a recipient without a usable bank account, Wise is not a more expensive option — it is not an option.`,
    },
    watchOut: `Check the amount before you assume the recommendation holds: our figures show the ranking genuinely inverts between $100 and $1,000, so run your own number rather than carrying a general recommendation across. Wise's fee also varies by currency and by how you fund the transfer — a card-funded transfer costs more than one funded from a bank account. Safeguarded funds are not the same thing as FSCS or FDIC deposit insurance; confirm what protection applies to your balance if you intend to hold money rather than send it.`,
  },

  instarem: {
    theVerdict: `InstaReM is the most consistently underrated provider in our data, and the gap between how often it is recommended and how well it performs is the largest on the site. It is a Singapore-headquartered transfer service, part of the Nium group, running bank-to-bank payouts across Asia-Pacific, Europe and North America. It has no cash pickup network and no retail brand to speak of, which is most of why it goes unmentioned — comparison sites tend to rank the names readers already know. On the corridors where we can price it, it is the second most consistent leader we track, and the cheapest provider in our set on small transfers.`,
    measuredRecord: `Over the last 91 days InstaReM led {{LED:instarem}} of its comparable corridors — a {{WINRATE:instarem}} win rate, second only to Wise — and when it lost it trailed the leader by just {{SHORTFALL:instarem}}, among the tightest average shortfalls we record. Average all-in cost at $1,000 across {{COSTCORRIDORS:instarem}} corridors was {{AVGCOST:instarem}}. The striking figure is the small-transfer one: {{SMALLCOST:instarem}} at $100 against {{BIGCOST:instarem}} at $1,000, a difference of {{SMALLPENALTY:instarem}} — one of the only providers we price that is not more expensive on a small transfer, and the cheapest of all of them at $100. For comparison, Wise costs {{SMALLCOST:wise}} on the same $100.`,
    whereItWins: {
      heading: "Best measured value on small transfers",
      body: `If you send $100-200 regularly — the pattern most remittance senders actually follow — InstaReM was the cheapest provider in our set at that amount, and unlike most of the field it does not charge a meaningfully higher percentage for sending less. It combines that with a lead rate close to Wise's and a very small average shortfall, meaning that even on the corridors where it is not first it is rarely far behind. It is regulated across multiple jurisdictions including MAS in Singapore, and pays out to bank accounts across roughly 55 currencies.`,
    },
    whereItLoses: {
      heading: "No cash, no wallet, and a narrower corridor list",
      body: `InstaReM pays out to bank accounts only. There is no cash pickup, no mobile money and no home delivery, so for a recipient collecting cash it is not usable at any price. We could price it on {{COSTCORRIDORS:instarem}} corridors against {{COSTCORRIDORS:taptap-send}} for TapTap Send and {{COSTCORRIDORS:wise}} for Wise, so its coverage is narrower than the leaders — on an unusual corridor it may simply not quote. Its consumer brand recognition is low, which matters only insofar as a recipient may not recognise the sender's name on an incoming payment.`,
    },
    watchOut: `Confirm InstaReM serves your specific corridor and payout method before planning around it — our quotes are collected by currency pair rather than by sending country, so a good price on your currency pair does not confirm it accepts senders in your country. First-transfer promotional rates are excluded from our figures but may change what you pay once; compare the returning-customer price if you intend to send regularly.`,
  },

  "taptap-send": {
    theVerdict: `TapTap Send is a mobile-first remittance app aimed squarely at diaspora senders moving money to Africa, Asia and Latin America, with bank, mobile wallet and cash payout depending on the destination. It is also a paid partner of this site, which is why the claim below is a measured record with its denominator rather than an adjective — it appears in our rankings in the position the data puts it, and a commercial relationship does not move it. On the evidence, it is one of the two most consistent leaders we track, and it holds the widest corridor coverage in our cost index.`,
    measuredRecord: `Over the last 91 days TapTap Send led {{LED:taptap-send}} of its comparable corridors, a {{WINRATE:taptap-send}} win rate, second only to Wise's {{WINRATE:wise}} — and it did that across a far larger corridor set than most of the field. When it did not lead it trailed by {{SHORTFALL:taptap-send}} on average, the smallest average shortfall of any provider we measure. Average all-in cost at $1,000 was {{AVGCOST:taptap-send}} across {{COSTCORRIDORS:taptap-send}} corridors, the widest coverage in our cost index. It is also close to flat across transfer sizes: {{SMALLCOST:taptap-send}} at $100 against {{BIGCOST:taptap-send}} at $1,000, a difference of {{SMALLPENALTY:taptap-send}} — where Wise's equivalent gap is {{SMALLPENALTY:wise}}.`,
    whereItWins: {
      heading: "Small, frequent transfers to Africa, Asia and Latin America",
      body: `TapTap Send is built for the sender moving modest amounts home on a regular schedule, and the measurements fit that design: a flat cost curve between $100 and $1,000, no transfer fee on the corridors we price, and the tightest average shortfall in our data, meaning you rarely lose much by using it even when it is not first. Payout to mobile wallets and cash makes it usable where a bank-only service is not, and delivery on most corridors is quoted in minutes.`,
    },
    whereItLoses: {
      heading: "Not a general-purpose or large-transfer service",
      body: `Its whole cost advantage sits in the rate rather than a fee, so on corridors where a bank-rail specialist like Wise or InstaReM prices tightly it can be beaten, particularly at larger amounts where a 0% markup compounds in the other direction. It is a consumer remittance app rather than a business or high-value FX service: there is no multi-currency account, no forward contract, no dealer, and it is not the tool for a property purchase or a commercial payment. Coverage is destination-led — strong where the diaspora corridors are, thin elsewhere.`,
    },
    watchOut: `TapTap Send is a paid partner of SendMoneyCompare. That relationship pays for a highlighted placement; it does not change its position in any ranked table on this site, which is ordered by what the recipient receives. Treat the figures above as what we measured, and check a live quote for your own corridor, amount and payout method before sending — availability and final rates depend on your transfer.`,
  },

  xe: {
    theVerdict: `XE is best known for its currency data — the rate pages and the converter — and the transfer service sits alongside that brand. It is a long-established, heavily regulated bank-to-bank service with a very wide published currency list, owned by Euronet. Our measurements show a pattern worth understanding before you use it, because it is the clearest example on the site of why a low average cost and a good deal are not the same claim: XE looks inexpensive on the corridors where it quotes, and almost never actually wins one.`,
    measuredRecord: `Over the last 91 days XE led {{LED:xe}} comparable corridors — a {{WINRATE:xe}} win rate, effectively never first — and when it lost it trailed the leader by {{SHORTFALL:xe}} on average, one of the wider shortfalls we record. Its average all-in cost at $1,000 was {{AVGCOST:xe}}, which reads as the lowest on this page until you see the denominator: that average is taken over just {{COSTCORRIDORS:xe}} corridors, against {{COSTCORRIDORS:wise}} for Wise and {{COSTCORRIDORS:taptap-send}} for TapTap Send. A low average over a small, self-selected corridor set is not comparable to a low average over a large one. On small transfers it costs {{SMALLCOST:xe}} against {{BIGCOST:xe}} at $1,000, a {{SMALLPENALTY:xe}} penalty.`,
    whereItWins: {
      heading: "Unusual currencies and larger, planned transfers",
      body: `XE's published currency list is one of the widest available, which is the practical reason to use it: if you are sending to a destination the remittance apps do not serve, it may quote where they do not. It charges no transfer fee, supports transfers up to $500,000, and carries an unusually broad regulatory footprint — FCA, FinCEN, ASIC and FINTRAC. Like other broker-model services its rates improve as the amount rises, so its natural case is a larger, planned, bank-to-bank transfer rather than a small urgent one.`,
    },
    whereItLoses: {
      heading: "Rarely the cheapest on a contested corridor",
      body: `On the corridors where several providers compete, XE was first {{LED:xe}} times in 91 days. If your corridor is well served, you are very likely to find a better payout elsewhere, and on average you are giving up {{SHORTFALL:xe}} to do so. There is no cash pickup, no mobile money and no spending account — it is bank deposit only — and settlement is quoted in business days rather than minutes, so it is the wrong instrument for anything urgent.`,
    },
    watchOut: `Read XE's "no transfer fees" as a description of the fee line, not of the cost: our figures are all-in, combining fee and exchange-rate markup, and the markup is where this service is priced. Because we could compare XE on relatively few corridors, treat its average cost as indicative rather than as a like-for-like ranking against providers measured across hundreds. Get a quote for your own corridor and amount.`,
  },

  ofx: {
    theVerdict: `OFX is a broker-model FX service: no transfer fee, bank-to-bank only, no upper transfer limit, and a dealer you can speak to once the amount is large. That model is aimed at a specific customer — someone moving a substantial sum on a planned timetable, such as a property purchase, an emigration or a business payment — and it is a reasonable fit for that. It is a poor fit for ordinary remittance-sized transfers, and our cost measurements say so plainly, which is the opposite of how a fee-free service is usually presented.`,
    measuredRecord: `Across {{COSTCORRIDORS:ofx}} corridors, OFX's average all-in cost at $1,000 was {{AVGCOST:ofx}} — the highest of any provider covered on this page, despite charging no transfer fee at all. That cost sits entirely in the exchange rate. A caveat on the win data, because the sample does not support a strong claim: we could compare OFX head-to-head on only a handful of corridors, where it led {{LED:ofx}}. That produces a {{WINRATE:ofx}} win rate which looks strong beside Wise's {{WINRATE:wise}}, but Wise's is measured across {{LED:wise}} corridors and OFX's across five. The denominators are not comparable and the smaller sample is the less reliable figure; average shortfall, at {{SHORTFALL:ofx}}, is the fairer read.`,
    whereItWins: {
      heading: "Large, planned transfers with dealer support",
      body: `There is no upper limit and no transfer fee, and above roughly $10,000 OFX assigns a dealer you can call — genuinely useful when a transfer is time-sensitive, needs splitting across dates, or forms part of a property or emigration transaction where a fractional rate improvement outweighs everything else. Its published reach is among the widest here at around 190 countries, and it is regulated by ASIC, the FCA and FinCEN. Broker rates improve with size, so the figures above, measured at $1,000, understate how it performs at the amounts it is built for.`,
    },
    whereItLoses: {
      heading: "The most expensive option we measured at $1,000",
      body: `At the amount most people actually send, OFX was the costliest provider on this page on our measurements, at {{AVGCOST:ofx}} all-in. "No transfer fees" is accurate and, read as a statement about total cost, misleading — the margin is in the rate. It pays out to bank accounts only, with no cash pickup or mobile money, and settles in one to three business days rather than minutes. For a small or urgent transfer, this is the wrong instrument on both counts.`,
    },
    watchOut: `Our figures are measured at $1,000 and OFX's proposition is quoted rates that improve with transfer size, so do not carry the number above to a $50,000 transfer — request a quote at your actual amount, and ask explicitly what rate you are being given against the mid-market rate on the day. We also could not compare OFX on enough corridors to publish a small-transfer figure, so no claim is made here about what it costs at $100.`,
  },
  remitly: {
    theVerdict: `Remitly is a remittance app rather than a general transfer service, and the distinction explains almost everything about how it performs in our data. It is built for the recurring sender supporting family abroad, with cash pickup, mobile money and home delivery across roughly 100 countries, and it competes on reach, speed and reliability rather than on being the cheapest payout. It carries one of the highest Trustpilot scores of any provider we list while leading very few corridors on price — a combination that is easy to misread. Customers are rating whether the money arrived, to the right person, on time. They are not rating the exchange rate.`,
    measuredRecord: `Over the last 91 days Remitly led {{LEADS:remitly}}, a {{WINRATE:remitly}} win rate, and when it was not first it trailed the leader by {{SHORTFALL:remitly}} on average. The corridors it did lead were {{LEAD_PAIRS:remitly}}. Its average all-in cost at $1,000 was {{AVGCOST:remitly}} across {{COSTCORRIDORS:remitly}} corridors; at $100 it was {{SMALLCOST:remitly}}, a {{SMALLPENALTY:remitly}} penalty — moderate, and well below Wise's {{SMALLPENALTY:wise}}. Read those together: Remitly is usually not the cheapest payout, but it is not badly placed either, and it holds up better than most on the small transfers its customers actually send.`,
    whereItWins: {
      heading: "Recurring remittances where the payout method matters",
      body: `Remitly is the stronger choice when the recipient's collection method decides the transfer: cash pickup, mobile money or home delivery, none of which bank-rail services like Wise or InstaReM offer at any price. Express delivery arrives in minutes; economy costs less when the money can wait, and choosing between them is a real lever most providers do not give you. Its Trustpilot standing is among the best we track, which for a service people use monthly to support family is not a trivial consideration.`,
    },
    whereItLoses: {
      heading: "Rarely the cheapest payout on a contested corridor",
      body: `On the corridors where several providers compete, Remitly led {{LEADS:remitly}} in 91 days. If your recipient can take a bank deposit and you are optimising on cost, you will usually find a better payout elsewhere — on average {{SHORTFALL:remitly}} better. Remitly publishes a $300,000 ceiling on US transfers, though an individual account's actual limit is lower and depends on verification level, payment method and destination; coverage is 100 countries and roughly 40 currencies, narrower than the legacy cash networks. Its promotional first-transfer rates are excluded from our figures deliberately, because they apply once and the ongoing price applies every month after.`,
    },
    watchOut: `Compare the returning-customer price, not the welcome offer. For a realistic annual cost, price the first transfer plus eleven repeats at the same amount rather than treating an introductory rate as your ongoing cost — this is the single most common way a remittance app looks cheaper than it is. Also confirm the arrival estimate for your actual payment and payout method: an express quote assumes funding and verification are already done.`,
  },

  worldremit: {
    theVerdict: `WorldRemit is a digital remittance service built around the last mile in emerging markets: mobile money wallets, cash pickup and airtime top-up alongside bank deposit, across roughly 130 countries and one of the widest currency lists in the category. It runs no agent network of its own, so it is cheaper to operate than the legacy cash providers and prices accordingly. In our data it sits in a consistent middle position — rarely the cheapest, rarely far off — and its real argument is what it can do rather than what it costs.`,
    measuredRecord: `Over the last 91 days WorldRemit led {{LEADS:worldremit}}, a {{WINRATE:worldremit}} win rate, specifically on {{LEAD_PAIRS:worldremit}}. When it was not first it trailed by {{SHORTFALL:worldremit}} on average, which is tighter than most of the cash-capable field. Average all-in cost at $1,000 was {{AVGCOST:worldremit}} across {{COSTCORRIDORS:worldremit}} corridors. Its small-transfer behaviour is one of its better features: {{SMALLCOST:worldremit}} at $100 against {{BIGCOST:worldremit}} at $1,000, a {{SMALLPENALTY:worldremit}} penalty — one of the flatter cost curves we measure, and a fifth of Wise's {{SMALLPENALTY:wise}}.`,
    whereItWins: {
      heading: "Mobile money, cash and airtime in emerging markets",
      body: `Mobile money into wallets such as M-Pesa and MTN, and airtime top-up direct to a recipient's phone, are payout methods most competitors do not offer at all — and across much of sub-Saharan Africa and parts of South and Southeast Asia they are how money is normally received. Add cash pickup and bank deposit, roughly 70 currencies, fees from $0.99, and a flat cost curve that does not punish the $100 transfers this audience actually sends. For that sender, the comparison is frequently not close, because the alternatives cannot complete the transfer.`,
    },
    whereItLoses: {
      heading: "Not the cost leader, and not built for large amounts",
      body: `WorldRemit led {{LEADS:worldremit}} over 91 days, so on a well-served bank corridor you will usually do better elsewhere. Transfers cap at $10,000, which rules out property, tuition instalments and most business payments, and there is no multi-currency account or dealer service. We could price it on {{COSTCORRIDORS:worldremit}} corridors — a narrower set than the leaders — so on an unusual route it may not quote at all.`,
    },
    watchOut: `Mobile money and airtime availability vary by country and by network, and pricing differs by payout method, so a good bank-deposit quote does not tell you what a wallet payout costs. Confirm the recipient's wallet provider is supported before relying on it. Our quotes are collected by currency pair rather than sending country, so check that WorldRemit accepts senders from your country.`,
  },

  "western-union": {
    theVerdict: `Western Union has been moving money since 1851 and its product is the agent network: roughly 200 countries, 130 currencies, and a staffed counter in places no app reaches. That network is a genuine asset and it is also the thing you are paying for. In our measurements it is the strongest performer among the legacy cash providers and still well behind the digital specialists on cost, which is the honest summary — the premium is real, it is quantifiable, and for a large number of senders it buys the only option that works.`,
    measuredRecord: `Over the last 91 days Western Union led {{LEADS:western-union}}, a {{WINRATE:western-union}} win rate — the best of the legacy networks — on {{LEAD_PAIRS:western-union}}. When it was not first it trailed the leader by {{SHORTFALL:western-union}} on average. Its average all-in cost at $1,000 was {{AVGCOST:western-union}} across {{COSTCORRIDORS:western-union}} corridors, against {{AVGCOST:wise}} for Wise and {{AVGCOST:taptap-send}} for TapTap Send. At $100 it cost {{SMALLCOST:western-union}}, a {{SMALLPENALTY:western-union}} penalty — notably flat, so unlike most of the field it does not get disproportionately worse on small amounts.`,
    whereItWins: {
      heading: "Reach, cash, and transfers a digital service cannot complete",
      body: `Around 200 countries, 130 currencies and transfers to $50,000, with bank deposit and mobile wallet alongside cash. For a recipient without a bank account, in a country the apps do not serve, or who needs to walk into a known location and collect cash with identification, this is the service that works. It is also comparatively flat across transfer sizes, so the small-transfer penalty that hits Wise hardest does not apply here.`,
    },
    whereItLoses: {
      heading: "A measurable premium on any corridor with competition",
      body: `At {{AVGCOST:western-union}} average all-in cost, Western Union is roughly double the digital leaders on the corridors we price, and it led only {{LEADS:western-union}}. If your recipient can take a bank deposit or a mobile wallet, you are very likely paying for a network you are not using. Pricing also varies sharply by payout method and by how you fund the transfer, so the figure above is an average across conditions rather than a quote.`,
    },
    watchOut: `Western Union prices cash pickup differently from bank deposit, and card-funded transfers cost more than bank-funded ones, so quote your exact combination rather than assuming the average applies. Agent-level pricing is not something we observe. Check the collection location and the identification your recipient will need before sending — a better rate at an agent two hours away is worth nothing.`,
  },

  moneygram: {
    theVerdict: `MoneyGram is the other incumbent cash network, reaching roughly 200 countries through agent locations in supermarkets, banks and post offices. Our data shows an unusual pattern for it, and it is worth stating plainly because it cuts against the obvious reading: MoneyGram essentially never comes first on price, yet its average cost is materially lower than Western Union's. It is a consistent mid-table provider rather than a cheap one or an expensive one, and the case for using it is almost always locational.`,
    measuredRecord: `Over the last 91 days MoneyGram led {{LEADS:moneygram}} — a {{WINRATE:moneygram}} win rate, effectively never first — while trailing the leader by {{SHORTFALL:moneygram}} on average when it lost. That shortfall is smaller than Western Union's {{SHORTFALL:western-union}}, and its average all-in cost at $1,000, {{AVGCOST:moneygram}} across {{COSTCORRIDORS:moneygram}} corridors, is well below Western Union's {{AVGCOST:western-union}}. So between the two legacy networks, Western Union wins outright more often and MoneyGram is cheaper on average — a genuine split that a simple "who is cheapest" ranking hides. At $100 MoneyGram cost {{SMALLCOST:moneygram}}, a {{SMALLPENALTY:moneygram}} penalty.`,
    whereItWins: {
      heading: "When its agent is the convenient one",
      body: `MoneyGram's argument is where its counters are. Roughly 200 countries, fees from $1.99, bank deposit and mobile wallet alongside cash, and on our figures a lower average cost and a tighter average shortfall than Western Union. If the recipient's nearest reliable collection point is a MoneyGram agent, that settles the question, and the pricing is not a reason to argue with it.`,
    },
    whereItLoses: {
      heading: "Never the cheapest, and capped at $10,000",
      body: `MoneyGram led {{LEADS:moneygram}} in 91 days. On any corridor with digital competition there is a better payout available, and if the recipient can take a bank deposit you are paying a cash-network premium for nothing. Transfers cap at $10,000, against $50,000 at Western Union, and its currency list is roughly 50 against Western Union's 130.`,
    },
    watchOut: `Fees vary by corridor, payout method and funding method, and agent-level pricing is not something we observe, so the averages above are not a quote. Confirm the collection location, the agent's opening hours and the identification required before you send. If the recipient can receive a bank deposit or a mobile wallet payment, price those options too before defaulting to cash.`,
  },

  xoom: {
    theVerdict: `Xoom is PayPal's remittance service: cash pickup, mobile reload and bank deposit across roughly 130 countries, funded from a PayPal balance, a bank account or a card, and settling in minutes on most routes. Its proposition is speed and the removal of friction for people who already hold a PayPal account — the identity checks are largely done, and funding is immediate. It is priced accordingly, and our coverage of it is thinner than for most providers on this page, which we would rather say than paper over.`,
    measuredRecord: `Over the last 91 days Xoom led {{LEADS:xoom}}, a {{WINRATE:xoom}} win rate, on {{LEAD_PAIRS:xoom}}. When it was not first it trailed by {{SHORTFALL:xoom}} on average — one of the wider average shortfalls we record, meaning that choosing it by default has a measurable cost. Its average all-in cost at $1,000 was {{AVGCOST:xoom}}, but that figure rests on only {{COSTCORRIDORS:xoom}} corridors, far fewer than the {{COSTCORRIDORS:wise}} behind Wise's, so treat it as indicative rather than as a like-for-like ranking. We do not hold enough quotes at both transfer sizes to publish a small-transfer figure for Xoom, so none is claimed here.`,
    whereItWins: {
      heading: "Speed, and an account you already have",
      body: `If the money has to arrive today and the recipient needs cash, Xoom is built for exactly that: minutes to most destinations, cash pickup and mobile reload alongside bank deposit, and transfers to $50,000. For an existing PayPal user the first transfer is dramatically faster to complete than opening a new account with a specialist, which is a real advantage the day you need it rather than a theoretical one.`,
    },
    whereItLoses: {
      heading: "A wide average shortfall and thin measured coverage",
      body: `At {{SHORTFALL:xoom}} average shortfall, Xoom gives up more than most providers when it is not leading, and it led {{LEADS:xoom}}. If the transfer is not urgent and the recipient can take a bank deposit, the specialists beat it clearly. Our own coverage is a limitation worth weighing: {{COSTCORRIDORS:xoom}} corridors is a thin base, so we are less confident about Xoom than about providers we price across hundreds.`,
    },
    watchOut: `Xoom prices cash pickup differently from bank deposit, and funding from a card costs more than funding from a bank account, so quote your exact combination. Because our measured coverage of Xoom is narrow, treat the figures above as indicative and get a live quote for your corridor and amount before relying on them.`,
  },

  "ace-money-transfer": {
    theVerdict: `ACE Money Transfer is a UK-headquartered remittance service focused on corridors from Europe, the UK and Australia into South Asia, Africa and the Philippines, offering bank deposit, cash pickup and mobile wallet payout. We are going to be straight about the limits of this page: ACE does not appear in any of the pricing datasets behind the rest of this site, so nothing here ranks it on cost, and we make no claim about how it compares. That gap is not unique to us — ACE has no provider review on Monito, MoneyTransfers.com or Exiap either, which is itself worth knowing when you are trying to research it.`,
    measuredRecord: `We hold no measured pricing record for ACE Money Transfer. It is absent from our consistency index, which tracks how often each provider leads its corridors over a rolling 91-day window, and from our remittance cost index, which prices providers across more than a thousand corridors at $1,000. Every other provider reviewed on this site carries a figure in both. Rather than fill the gap with a plausible-sounding estimate, we are stating it: the win rates, average shortfalls and cost percentages quoted elsewhere on this site do not exist for ACE, and any comparison you see between ACE and another provider on those measures — here or anywhere — is not coming from observed quote data.`,
    whereItWins: {
      heading: "Corridors and features it publishes",
      body: `ACE advertises South Asian, African and Philippine corridors from the UK, Europe and Australia, with bank deposit, cash pickup and mobile wallet payout, and it is authorised as a payment institution in the jurisdictions it serves. Its Trustpilot standing is strong. These are the company's own published claims and a third-party review score, not our measurements — we are reporting what it says about itself, clearly labelled as such, because that is the honest version of a review we cannot price.`,
    },
    whereItLoses: {
      heading: "We cannot tell you what it costs",
      body: `The thing a comparison site exists to answer — is this cheaper than the alternative, and by how much — is the thing this page cannot answer for ACE. Our scrapers do not collect its quotes, so it never enters a ranked table on this site, and its absence from those tables reflects missing data rather than poor performance. If you are considering ACE, get a live quote from it and compare the total received against the providers we do price on your corridor.`,
    },
    watchOut: `Treat any cost claim about ACE Money Transfer on this site as absent rather than favourable or unfavourable. The practical check is the same one we would recommend anywhere: request a quote for your exact amount, funding method and payout method, note the total debited and the amount your recipient receives, and compare that against a quote from the providers in our comparison table for the same corridor on the same day.`,
  },
};

export function getCompanyEditorial(slug: string): CompanyEditorial | undefined {
  return companyEditorial[slug];
}