/**
 * Hand-written editorial for the head-to-head comparison pages.
 *
 * WHY THIS FILE EXISTS
 * The Sep 2026 content brief (§4) names 10 /compare/* pages measuring 31-79%
 * duplicate and asks for "unique blocks (real fees/timelines/providers for that
 * corridor, local specifics, worked examples)" on each, explicitly without
 * merging them — each targets a different query.
 *
 * The first attempt at that was to make the generated blurbs cite each pair's
 * own measured numbers. It did not work: /compare/wise-vs-remitly went from
 * 87.5% to 88.9% duplicate, because the sentence FRAMES collide even when every
 * figure inside them differs. Generated prose cannot de-duplicate generated
 * pages. So this file is written by hand, one entry per pair, and the template
 * renders it INSTEAD of the canned "when to choose" and pros/cons blocks rather
 * than in addition to them — the brief asks to remove verbatim boilerplate, not
 * to bury it under more text.
 *
 * WHY THE FIGURES ARE TOKENS
 * CLAUDE.md: never hand-type a figure a dataset already knows. Every number
 * below is a {{TOKEN}} resolved at render by ratings-tokens.ts against the same
 * quote data the comparison table uses, so the prose cannot drift from the table
 * beneath it. Hand-typed figures in editorial copy go stale silently, which is
 * the failure the token renderer was built for.
 *
 * WHAT THE PROSE MAY CLAIM
 * Only what we measure or what the provider publishes. The per-provider records
 * quoted here come from the consistency index (corridors led out of corridors
 * quoted, over the tracked window) and are stated with their denominator,
 * because a win rate without its sample size is how OFX's 12.83% — measured on
 * five corridors — would read as though it beat Wise's 32.35% on 128.
 */

export interface CompareEditorialSection {
  heading: string;
  /** May contain {{TOKEN}}s and inline <a>/<strong>/<em>. */
  body: string;
}

export interface CompareEditorial {
  /** The decision the reader is actually making. Leads the page. */
  theDecision: string;
  /** What our own record shows for this pair, with denominators. */
  measuredRecord: string;
  /** Brief §10-A step 3: "a worked calculation example". */
  workedExample: CompareEditorialSection;
  /**
   * A second worked example on a different corridor. Optional — only where
   * both providers actually quote a second corridor we price; several pairs
   * (e.g. ofx-vs-xoom) only overlap on one. Genuinely new information, not
   * padding: whether the same provider wins across corridors is itself a
   * finding, not a restatement of the first example.
   */
  secondExample?: CompareEditorialSection;
  /** Where each genuinely wins, written for this pair only. */
  pickA: CompareEditorialSection;
  pickB: CompareEditorialSection;
  /** What this comparison does not settle. */
  limits: string;
}

export const compareEditorial: Record<string, CompareEditorial> = {
  "wise-vs-remitly": {
    theDecision: `This is not a price comparison, even though it is usually framed as one. Wise and Remitly are built around different assumptions about who collects the money. Wise moves funds between bank accounts at the mid-market rate and charges for it openly; it has no cash payout at all. Remitly assumes the recipient may have no usable bank account, and sells reach — cash pickup, mobile money and home delivery across 100 countries — with the cost folded into the rate. So the question that decides this page is not "which is cheaper" but "can the person receiving it use a bank deposit?" If they can, the comparison is about cost and Wise usually wins it. If they cannot, Wise is not an option at any price.`,
    measuredRecord: `Across the corridors we price continuously, Wise led on {{LED:wise}} and Remitly on {{LED:remitly}}. That gap is the clearest in this set of comparisons, and it is structural rather than promotional: Wise's published markup is 0% against the mid-market rate, so its entire cost is the visible fee, while Remitly's sits at 0.5–2% inside the rate where it is harder to see. When Remitly is not the best-priced option it trails the leader by {{SHORTFALL:remitly}} on average, against {{SHORTFALL:wise}} for Wise. Remitly's Trustpilot score is nonetheless the higher of the two, which is worth taking seriously — it measures whether the transfer felt reliable, not whether it was cheap.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On a $1,000 USD→INR transfer, the gap between these two is {{RECEIVE_DIFF:wise:remitly:USD:INR:1000}}, with {{CHEAPER:wise:remitly:USD:INR:1000}} delivering more. Wise's fee on that transfer is {{FEE:wise:USD:INR:1000}} and its all-in cost {{COST_PCT:wise:USD:INR:1000}} of the amount sent; Remitly's fee is {{FEE:remitly:USD:INR:1000}} at an all-in cost of {{COST_PCT:remitly:USD:INR:1000}}. Note what the fee column does and does not tell you: the lower fee is not automatically the lower total, because the rate carries the rest. Run the same check on your own amount — the ranking can invert between $200 and $5,000, and a first-transfer promotion applies once while the ongoing price applies every month after.`,
    },
    pickA: {
      heading: "Pick Wise when the recipient has a bank account",
      body: `Wise is the better instrument when the money is going account-to-account and you want to be able to audit what you paid. The mid-market rate with a stated fee means the cost is a number you can read rather than infer, which matters most on larger amounts where a rate markup outgrows any fee. It also supports transfers up to $1,000,000 against Remitly's $300,000 from the US (Remitly's published ceiling varies by sending country), holds balances in 50 currencies, and is regulated by the FCA, FinCEN and ASIC — though on Remitly the $300,000 is a published ceiling rather than a typical limit; an individual account's limit may be lower, depending on verification level, payment method and destination. If you are paying tuition, a mortgage, a contractor or yourself, this is the one to start with.`,
    },
    pickB: {
      heading: "Pick Remitly when the payout method is the constraint",
      body: `Remitly is the better instrument when the recipient's collection method is fixed and non-bank. Cash pickup, mobile money and home delivery are not features Wise offers at any price, so for a family member collecting cash in a town without a branch, or a recipient using a mobile wallet, the comparison ends there. Its express tier settles in minutes where Wise quotes instant to two days, and it reaches 100 countries against Wise's 80. You are paying for that reach through the rate; on these corridors that premium is real, and for many senders it buys the only option that actually works.`,
    },
    limits: `Both figures above are estimates built from collected pricing against a mid-market reference, not guaranteed quotes, and our quotes are gathered by currency pair rather than by sending country — so we cannot confirm either provider serves your specific country, funding method or transfer purpose. Confirm eligibility, payout method and limits with the provider before you commit.`,
  },

  "wise-vs-paypal": {
    theDecision: `These two are not competitors so much as different categories that happen to overlap. PayPal is a payments account that can send money abroad; Wise is a cross-border transfer service. The distinction shows up in the pricing model: PayPal charges a percentage fee of 5% (minimum $0.99, capped at $4.99) and then adds 3–4% inside the exchange rate, while Wise charges a visible fee from 0.41% and applies no markup at all. Two separate charges, one of them hidden, against one visible charge. The decision is usually settled by whether the recipient already uses PayPal and whether convenience is worth the spread.`,
    measuredRecord: `This is the widest cost gap of any pair on the site. PayPal led on {{LED:paypal}} of the corridors we price and, when it is not the leader, trails by {{SHORTFALL:paypal}} on average — the largest average shortfall we record for any provider. Wise led {{LED:wise}} with an average shortfall of {{SHORTFALL:wise}}. PayPal's Trustpilot rating is also the lowest in our provider set by a wide margin. None of that makes PayPal unusable; it makes it an expensive way to move money internationally, which is a different claim.`,
    workedExample: {
      heading: "A worked example: £1,000 to euros",
      body: `On £1,000 GBP→EUR, the difference between these two is {{RECEIVE_DIFF:wise:paypal:GBP:EUR:1000}}, with {{CHEAPER:wise:paypal:GBP:EUR:1000}} delivering more. Wise's all-in cost on that transfer is {{COST_PCT:wise:GBP:EUR:1000}} against {{COST_PCT:paypal:GBP:EUR:1000}} for PayPal. The instructive part is where the money goes: PayPal's fee is capped at $4.99, so on a larger transfer the fee looks trivial while the 3–4% rate markup scales with the amount. A fee cap is not a cost cap when the markup is uncapped.`,
    },
    secondExample: {
      heading: "A second corridor: $1,000 to Mexico",
      body: `On $1,000 USD→MXN the gap is {{RECEIVE_DIFF:wise:paypal:USD:MXN:1000}}, with {{CHEAPER:wise:paypal:USD:MXN:1000}} ahead — {{COST_PCT:wise:USD:MXN:1000}} all-in against {{COST_PCT:paypal:USD:MXN:1000}} for PayPal. The margin here is proportionally similar to the GBP→EUR example above: PayPal's combined fee-plus-markup model doesn't have a corridor where it becomes the cheaper option in our data.`,
    },
    pickA: {
      heading: "Pick Wise for essentially any deliberate transfer",
      body: `If you have decided in advance to send money abroad, Wise is the cheaper instrument on the corridors we measure, and the gap is not marginal. It supports transfers to $1,000,000, holds 50 currencies, and gives you a rate you can verify against any published mid-market quote. For recurring transfers — rent, family support, salary — the difference compounds every month and is the single largest lever available on this page.`,
    },
    pickB: {
      heading: "Pick PayPal when the payment is already inside PayPal",
      body: `PayPal earns its place in one situation: the counterparty already transacts with you through PayPal, and moving the payment outside it would cost you buyer protection, an invoice trail or the relationship itself. Paying a freelancer who invoices via PayPal, or refunding a customer, is a payments problem rather than an FX problem, and the spread is the price of staying inside a system both sides already trust. It reaches 200 countries and settles instantly to another PayPal balance. Choosing it as a general-purpose remittance route is the expensive mistake; choosing it because the payment already lives there is reasonable.`,
    },
    limits: `Figures are estimates from collected pricing against a mid-market reference, not guaranteed quotes. PayPal's consumer and business pricing differ, card funding adds a further charge on both services, and quotes are collected by currency pair — confirm the rate, the funding method and the fee schedule that applies to your account before sending.`,
  },

  "paypal-vs-revolut": {
    theDecision: `Both of these are accounts first and transfer services second, which makes this a comparison between two conveniences rather than two remittance products. Revolut gives you the interbank rate with no markup on weekdays and free transfers up to £1,000 a month, then 0.5%; the catch is the weekend, when a 0.5–1% markup applies because the underlying FX market is closed. PayPal charges 5% (min $0.99, max $4.99) and adds 3–4% to the rate every day of the week. The practical decision is whether both parties can hold a Revolut account, and whether you can wait until Monday.`,
    measuredRecord: `Neither provider led a single corridor: Revolut {{LED:revolut}}, PayPal {{LED:paypal}}. What separates them is how far back they sit when they lose. Revolut's average shortfall is {{SHORTFALL:revolut}} — close to the front, and among the tightest we record — while PayPal's is {{SHORTFALL:paypal}}, the widest of any provider we track. Read that together: Revolut rarely wins because specialist services undercut it at the margin, but it is never far off. PayPal is consistently far off. Revolut also carries the higher Trustpilot rating of the two by a wide margin.`,
    workedExample: {
      heading: "A worked example: £1,000 to euros",
      body: `On £1,000 GBP→EUR the gap is {{RECEIVE_DIFF:paypal:revolut:GBP:EUR:1000}}, with {{CHEAPER:paypal:revolut:GBP:EUR:1000}} delivering more. Revolut's all-in cost is {{COST_PCT:revolut:GBP:EUR:1000}} against {{COST_PCT:paypal:GBP:EUR:1000}} for PayPal. One timing note this example cannot show: our pricing is observed at a point in time, and Revolut's weekend markup means the same transfer sent on a Saturday costs more than the figure above. If the transfer is not urgent, the day you send is a real lever here — the only page on this site where that is true of one provider and not the other.`,
    },
    secondExample: {
      heading: "A second corridor: $1,000 to Mexico",
      body: `Outside Europe the gap widens rather than narrows: on $1,000 USD→MXN, {{CHEAPER:paypal:revolut:USD:MXN:1000}} delivers {{RECEIVE_DIFF:paypal:revolut:USD:MXN:1000}} more, at {{COST_PCT:revolut:USD:MXN:1000}} all-in against {{COST_PCT:paypal:USD:MXN:1000}} for PayPal. Revolut's weekday interbank rate holds up well outside the euro corridors it's most associated with; PayPal's 3–4% markup applies the same way everywhere, which is the more consistent (and more expensive) of the two patterns.`,
    },
    pickA: {
      heading: "Pick PayPal only where the transaction already lives there",
      body: `PayPal's case is the same here as anywhere: an invoice, a refund, a marketplace payment or a counterparty who will accept nothing else. It reaches 200 countries against Revolut's 150 and needs nothing of the recipient beyond an email address, where Revolut is at its best when both sides hold the app. If the recipient cannot or will not open a new financial account, PayPal's reach is the argument, and you are paying roughly 8–9% all-in for it.`,
    },
    pickB: {
      heading: "Pick Revolut when both sides hold the app and it is a weekday",
      body: `Revolut is the better instrument for anyone moving money regularly between countries they live and work in, rather than sending remittances to a third party. Free allowance to £1,000 a month, the interbank rate on weekdays, balances in 36 currencies, no upper transfer limit, and regulation by the FCA and ECB. Revolut-to-Revolut transfers land instantly and cost nothing. The constraint is that this only works when the recipient is willing to hold an account too — which is precisely the constraint PayPal does not have.`,
    },
    limits: `Estimates from collected pricing against a mid-market reference, not guaranteed quotes. Revolut's free allowance and weekend markup depend on your plan tier, PayPal's pricing differs between personal and business accounts, and card funding adds a further charge on both. Quotes are collected by currency pair, so confirm your own eligibility and the applicable schedule before sending.`,
  },

  "western-union-vs-moneygram": {
    theDecision: `This is the comparison between the two incumbent cash networks, and price is close to the least useful way to decide it. Western Union has been moving money since 1851 and MoneyGram since 1940; both reach around 200 countries, both pay out in cash at agent locations, and neither is priced to beat a digital specialist. What actually separates them is which network has a staffed agent near the person collecting the money, and what that specific agent charges — a figure that varies by country, by payout method and by whether the sender pays with cash or card, and which no comparison table can resolve for you.`,
    measuredRecord: `Western Union led on {{LED:western-union}} of the corridors we price and MoneyGram on {{LED:moneygram}} — a win rate of {{WINRATE:moneygram}} for MoneyGram, effectively never. Average shortfalls are {{SHORTFALL:western-union}} and {{SHORTFALL:moneygram}} respectively, so MoneyGram is typically the closer of the two when both lose, while Western Union wins outright more often. Both sit well behind the digital leaders on cost. Treat these as a measure of the cash-network premium rather than a reason to pick one over the other.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On $1,000 USD→INR the gap between them is {{RECEIVE_DIFF:western-union:moneygram:USD:INR:1000}}, with {{CHEAPER:western-union:moneygram:USD:INR:1000}} ahead. Western Union's all-in cost is {{COST_PCT:western-union:USD:INR:1000}} against {{COST_PCT:moneygram:USD:INR:1000}} for MoneyGram. This example understates how much your own quote can differ: both providers price cash pickup differently from bank deposit, and both charge more when the transfer is funded with a card than from a bank account. Get a quote for your exact payout method before treating either figure as yours.`,
    },
    pickA: {
      heading: "Pick Western Union for the larger network and higher ceiling",
      body: `Western Union supports transfers up to $50,000 against MoneyGram's $10,000, quotes 130 currencies against 50, and wins more of the corridors we price outright. If the amount is substantial, or the destination is somewhere thinly served, the larger agent footprint and higher limit are the practical arguments. It also offers bank deposit and mobile wallet alongside cash, so a single account covers more payout methods.`,
    },
    pickB: {
      heading: "Pick MoneyGram when its agent is the one nearby",
      body: `MoneyGram's argument is locational rather than financial. Its fees start lower at $1.99, it reaches roughly the same 200 countries, and on our measurements it trails the leader by less on average than Western Union does. If the recipient's nearest reliable agent — a specific supermarket, bank branch or post office — is a MoneyGram agent, that settles it, because a marginally better rate at a counter two hours away is worth nothing. Check the agent locator for the collection town first and let the price question follow.`,
    },
    limits: `Estimates from collected pricing against a mid-market reference, not guaranteed quotes, and agent-level pricing is not something we observe. Both networks vary fees by corridor, payout method and funding method, and cash pickup availability depends on the specific agent. Confirm the quote, the collection location and the identification the recipient will need before sending.`,
  },

  "remitly-vs-western-union": {
    theDecision: `Both of these will put cash in someone's hand, which is why the comparison gets made. The difference is what each was designed around. Western Union is an agent network that added an app; Remitly is an app that contracts with payout networks. That shapes everything downstream: Western Union covers roughly 200 countries and 130 currencies because it spent a century building counters, while Remitly covers 100 countries and 40 currencies but prices its core remittance corridors harder and settles its express tier in minutes. If your corridor is one Remitly serves, it is usually the better-priced route; if it is not, Western Union probably still reaches it.`,
    measuredRecord: `Western Union led on {{LED:western-union}} of the corridors we price against {{LED:remitly}} for Remitly — Western Union wins outright more often across the whole tracked set. But average shortfall reverses the picture: Remitly trails the leader by {{SHORTFALL:remitly}} when it loses, against {{SHORTFALL:western-union}} for Western Union. So Remitly is more consistently near the front while Western Union more often takes the front outright, which is the signature of a broad network that is sharp on some routes and expensive on others.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On $1,000 USD→INR the gap is {{RECEIVE_DIFF:remitly:western-union:USD:INR:1000}}, with {{CHEAPER:remitly:western-union:USD:INR:1000}} delivering more. Remitly's fee is {{FEE:remitly:USD:INR:1000}} at an all-in cost of {{COST_PCT:remitly:USD:INR:1000}}; Western Union's is {{FEE:western-union:USD:INR:1000}} at {{COST_PCT:western-union:USD:INR:1000}}. Remitly's headline promotions apply to a first transfer only, so for regular sending compare the returning-customer price: the useful figure is the first transfer plus eleven repeats, not the welcome offer.`,
    },
    pickA: {
      heading: "Pick Remitly for a corridor it actually serves",
      body: `Remitly is the sharper instrument on established remittance routes — the US, UK, Canada and Australia into South Asia, the Philippines, Mexico and East Africa. Express delivery arrives in minutes, economy costs less if the money can wait, and cash pickup, mobile money and home delivery are all available. Its Trustpilot rating is the higher of the two. The constraint is the narrower country list, and — depending on your account's verification level and sending country — a per-transfer limit that may sit below Remitly's published $300,000 US ceiling, itself already below Western Union's $50,000.`,
    },
    pickB: {
      heading: "Pick Western Union for reach, size and unusual destinations",
      body: `Western Union's argument is coverage: around 200 countries, 130 currencies, transfers to $50,000, and a physical counter in places where app-based payout partners do not operate. For a destination Remitly does not serve, an amount above Remitly's limit, or a recipient who needs to walk into a known location and collect cash with a passport, this is the one that works. You pay for that through the rate, and on our measurements the premium is real.`,
    },
    limits: `Estimates from collected pricing against a mid-market reference, not guaranteed quotes. Promotional first-transfer rates are excluded from the comparison but may change what you actually pay once. Quotes are collected by currency pair, so confirm that your corridor, payout method and amount are supported before relying on either figure.`,
  },

  "wise-vs-western-union": {
    theDecision: `This is the clearest statement of the trade-off the whole category runs on: transparent pricing against physical reach. Wise publishes the mid-market rate, adds no markup, and charges a fee you can read — but it pays out to bank accounts only, in 80 countries. Western Union pays cash across roughly 200 countries through an agent network it has been building since 1851, and recovers its cost through a 1–4% rate markup. Neither is a better product in the abstract. The decision is made by the recipient: if they bank, Wise is cheaper by a clear margin; if they collect cash, Wise is not in the running.`,
    measuredRecord: `Wise led on {{LED:wise}} of the corridors we price against {{LED:western-union}} for Western Union, with average shortfalls of {{SHORTFALL:wise}} and {{SHORTFALL:western-union}}. Wise is the most consistent leader in our data and Western Union the strongest of the legacy cash networks — which makes this pair the cleanest measure available of what the cash option costs. The gap is the price of the counter, not evidence that Western Union is mispriced.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On $1,000 USD→INR the difference is {{RECEIVE_DIFF:wise:western-union:USD:INR:1000}}, with {{CHEAPER:wise:western-union:USD:INR:1000}} ahead. Wise's all-in cost is {{COST_PCT:wise:USD:INR:1000}} against {{COST_PCT:western-union:USD:INR:1000}} for Western Union. Worth isolating: Wise's cost is entirely its fee, because its markup is 0% — so on a larger transfer Wise's cost grows slowly while a percentage markup grows in step with the amount. On recurring transfers that difference compounds monthly.`,
    },
    secondExample: {
      heading: "A second corridor: $1,000 to Mexico",
      body: `On $1,000 USD→MXN the gap narrows to {{RECEIVE_DIFF:wise:western-union:USD:MXN:1000}}, with {{CHEAPER:wise:western-union:USD:MXN:1000}} ahead at {{COST_PCT:wise:USD:MXN:1000}} against {{COST_PCT:western-union:USD:MXN:1000}} for Western Union. That's a noticeably tighter margin than the India example — Western Union's markup isn't flat across corridors, and Mexico is one of the routes where its agent network keeps it closer to competitive.`,
    },
    pickA: {
      heading: "Pick Wise for bank-to-bank transfers of any size",
      body: `If the recipient has an account that can receive a deposit, Wise is the cheaper route on the corridors we measure, and it scales: transfers to $1,000,000, balances in 50 currencies, regulation by the FCA, FinCEN and ASIC. For tuition, property, payroll, contractors or your own accounts abroad, the audit trail matters as much as the price — you can check the rate you were given against any published mid-market quote, which is not true of a marked-up rate.`,
    },
    pickB: {
      heading: "Pick Western Union when cash or coverage decides it",
      body: `Western Union reaches destinations and recipients Wise structurally cannot: someone without a bank account, a country outside Wise's 80, a recipient who needs money within minutes at a counter, or a payout in one of the 130 currencies it quotes. Add mobile wallet delivery and a $50,000 ceiling. When any of those apply, the comparison is not close, because the alternative is not a worse price — it is no transfer at all.`,
    },
    limits: `Estimates from collected pricing against a mid-market reference, not guaranteed quotes. Western Union's pricing varies by payout method, funding method and agent; Wise's fee varies by currency and funding method. Quotes are collected by currency pair, so we cannot confirm either serves your specific sending country — check before you commit.`,
  },

  "wise-vs-worldremit": {
    theDecision: `Both are digital-first and neither runs its own counters, so this is a narrower comparison than it looks: it turns almost entirely on payout method. Wise is bank deposit only, at the mid-market rate with a visible fee. WorldRemit is built for the last mile in emerging markets — mobile money, cash pickup and airtime top-up alongside bank deposit, across 130 countries and 70 currencies, with 0.5–3% inside the rate. If the money is going to a bank account, this is a cost comparison. If it is going to an M-Pesa wallet or a phone balance, only one of them can do it.`,
    measuredRecord: `Wise led on {{LED:wise}} of the corridors we price against {{LED:worldremit}} for WorldRemit. WorldRemit's average shortfall is {{SHORTFALL:worldremit}} against {{SHORTFALL:wise}} for Wise — closer than the lead counts suggest, and tighter than most of the cash-capable providers we track. WorldRemit is competitive without often being first, which is a reasonable position for a service selling payout reach rather than price.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On $1,000 USD→INR the gap is {{RECEIVE_DIFF:wise:worldremit:USD:INR:1000}}, with {{CHEAPER:wise:worldremit:USD:INR:1000}} delivering more. Wise's all-in cost is {{COST_PCT:wise:USD:INR:1000}} against {{COST_PCT:worldremit:USD:INR:1000}} for WorldRemit. India is a bank-deposit corridor, which is Wise's strongest ground; the comparison narrows considerably on corridors where mobile money is the normal way to receive money, because there the alternative is not a cheaper bank transfer but no transfer.`,
    },
    secondExample: {
      heading: "A second corridor: $1,000 to Mexico",
      body: `The pattern holds outside India: on $1,000 USD→MXN, {{CHEAPER:wise:worldremit:USD:MXN:1000}} delivers {{RECEIVE_DIFF:wise:worldremit:USD:MXN:1000}} more, at an all-in cost of {{COST_PCT:wise:USD:MXN:1000}} against {{COST_PCT:worldremit:USD:MXN:1000}} for WorldRemit. WorldRemit's markup runs wider on a bank-deposit corridor like this one than on the mobile-money routes it's built for — the gap you saw on India isn't a one-off.`,
    },
    pickA: {
      heading: "Pick Wise for bank deposits and larger amounts",
      body: `Wise is the better instrument when the destination is a bank account and you want the rate to be checkable. The 0% markup means cost does not scale with the amount the way a percentage markup does, which matters above a few thousand: transfers run to $1,000,000 against WorldRemit's $10,000 ceiling. Balances in 50 currencies and FCA, FinCEN and ASIC regulation round it out.`,
    },
    pickB: {
      heading: "Pick WorldRemit for mobile money, cash and airtime",
      body: `WorldRemit's case is the last mile. Mobile money into wallets like M-Pesa and MTN, cash pickup, and airtime top-up direct to a recipient's phone are payout methods Wise does not offer at all, and in much of sub-Saharan Africa and parts of South and Southeast Asia they are how money is actually received. It quotes 70 currencies against Wise's 50 and reaches 130 countries against 80. Fees start at $0.99, and delivery is typically minutes to three days.`,
    },
    limits: `Estimates from collected pricing against a mid-market reference, not guaranteed quotes. Mobile money and airtime availability vary by country and network, and WorldRemit's pricing differs by payout method. Quotes are collected by currency pair, so confirm that your corridor and chosen payout method are supported before sending.`,
  },

  "ofx-vs-xe": {
    theDecision: `These two are the closest match on the site, and that is the finding rather than a failure of the comparison. Both are long-established FX brokers — OFX since 1998, XE since 1993 — both charge no transfer fee, both recover cost through a 0.5–1.5% rate markup, both pay out to bank accounts only, and both quote in one to four business days. Neither offers cash pickup, mobile money or a spending account. The decision comes down to two things a price table does not show: the size of the transfer, and whether you want a dealer on the phone.`,
    measuredRecord: `A caution before the numbers, because this pair is where a win rate misleads. OFX led {{LED:ofx}} of the corridors we price and XE led {{LED:xe}}. OFX's headline win rate of {{WINRATE:ofx}} is measured on a handful of corridors, while XE's {{WINRATE:xe}} is measured across a much larger set — the denominators are not comparable, and the higher percentage is the less reliable figure. Average shortfall is the fairer read at these sample sizes: {{SHORTFALL:ofx}} for OFX and {{SHORTFALL:xe}} for XE. Both sit behind the digital leaders on the corridors we price; the broker model competes on service and size, not on small-transfer pricing.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On $1,000 USD→INR the gap is {{RECEIVE_DIFF:ofx:xe:USD:INR:1000}}, with {{CHEAPER:ofx:xe:USD:INR:1000}} ahead — all-in costs of {{COST_PCT:ofx:USD:INR:1000}} and {{COST_PCT:xe:USD:INR:1000}} respectively. Read this one with care: $1,000 is well below the amount at which either broker is competitive. Both quote better rates as the amount rises, and neither charges a fee, so their cost curve flattens where a per-transfer fee would not. The meaningful comparison for these two happens at $20,000 and above, which our sample corridors do not reach.`,
    },
    secondExample: {
      heading: "A second corridor: $1,000 to Mexico",
      body: `The same ordering holds on $1,000 USD→MXN: {{CHEAPER:ofx:xe:USD:MXN:1000}} delivers {{RECEIVE_DIFF:ofx:xe:USD:MXN:1000}} more, at {{COST_PCT:xe:USD:MXN:1000}} against {{COST_PCT:ofx:USD:MXN:1000}} for OFX. Two data points from two different currency pairs pointing the same way is weak evidence on its own, but it's enough to say the India result wasn't a one-off — get a live quote for your own corridor rather than assuming either pattern generalises further than that.`,
    },
    pickA: {
      heading: "Pick OFX for large transfers and a named dealer",
      body: `OFX has no upper transfer limit and no transfer fee, and its proposition above roughly $10,000 is a dealer you can call — useful when a transfer is time-sensitive, needs to be split, or is part of something larger like a property purchase or an emigration. It reaches 190 countries, the widest in this pair, and is regulated by ASIC, the FCA and FinCEN. For a one-off five- or six-figure transfer where a fractional rate improvement outweighs any fee, this is the model that fits.`,
    },
    pickB: {
      heading: "Pick XE for breadth of currency and a self-serve transfer",
      body: `XE quotes 130 currencies against OFX's 55, which is the widest currency list in this comparison and the practical argument for anyone sending to a less common destination. It carries the higher Trustpilot rating of the two, adds FINTRAC to the regulatory set, and caps transfers at $500,000 — above almost any personal transfer. If you want to run the transfer yourself without a dealer relationship, and your currency is an unusual one, XE is the better fit.`,
    },
    limits: `Estimates from collected pricing against a mid-market reference, not guaranteed quotes, and both brokers quote rates that improve with transfer size in a way a fixed-amount comparison cannot capture. Neither offers cash payout. Quotes are collected by currency pair, so confirm your corridor, amount band and account eligibility directly. OFX's "no transfer fee" is confirmed fee-free regardless of amount for US-dollar transfers specifically; outside the US it charges a flat fee (e.g. AU$/CA$15) below a country-specific threshold, so check the policy for your own country before sending.`,
  },

  "ofx-vs-xoom": {
    theDecision: `There is very little overlap between these two, and the page is most useful for showing that. OFX is a no-fee FX broker for bank-to-bank transfers, with no upper limit, one to three business days, and a dealer for larger amounts. Xoom is PayPal's remittance arm: cash pickup, mobile reload and bank deposit across 130 countries, settling in minutes, priced with a 1–3% rate markup and a fee up to $4.99. One is built for a large planned transfer; the other for a small urgent one. Anyone genuinely choosing between them has not yet decided what kind of transfer this is.`,
    measuredRecord: `OFX led {{LED:ofx}} of the corridors we price and Xoom {{LED:xoom}}. OFX's win rate is measured on a very small corridor sample and should not be read against Xoom's larger one; average shortfall is the more comparable figure, at {{SHORTFALL:ofx}} for OFX and {{SHORTFALL:xoom}} for Xoom. Xoom quotes far more of the remittance corridors we track, which is consistent with what it is for. Neither leads often.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On $1,000 USD→INR the gap is {{RECEIVE_DIFF:ofx:xoom:USD:INR:1000}}, with {{CHEAPER:ofx:xoom:USD:INR:1000}} delivering more — {{COST_PCT:ofx:USD:INR:1000}} all-in for OFX against {{COST_PCT:xoom:USD:INR:1000}} for Xoom. The number that does not appear here is time. OFX quotes one to three business days; Xoom quotes minutes. If the money has to arrive today, the cheaper figure above is not available to you at any speed, and the comparison is decided before price enters it.`,
    },
    secondExample: {
      heading: "Why there's only one worked example here",
      body: `We could not build a second one for this pair, and that's worth explaining rather than skipping past. Xoom quotes {{COSTCORRIDORS:xoom}} of the corridors we price, against {{COSTCORRIDORS:ofx}} for OFX — a broker with a global reach and a remittance app built around a much narrower set of routes rarely overlap on the same currency pair at the same amount. USD→INR is one of the few places they do. If your corridor isn't USD→INR, neither provider's figure above is a reliable stand-in for it — get a live quote from both rather than extrapolating from this example.`,
    },
    pickA: {
      heading: "Pick OFX for planned transfers, especially large ones",
      body: `OFX suits a transfer you can schedule: no fee at all, no upper limit, 190 countries, and dealer support once the amount is substantial. Property deposits, tuition instalments, emigration transfers and business payments are its natural cases. The trade-off is that it settles in business days and pays out only to bank accounts, so it is the wrong instrument for anything urgent or anything a recipient needs to collect in cash.`,
    },
    pickB: {
      heading: "Pick Xoom for speed and non-bank payout",
      body: `Xoom is built for the transfer that has to land now. Cash pickup, mobile reload and bank deposit across 130 countries, settlement in minutes, and a familiar PayPal login and balance behind it. Transfers run to $50,000. You pay for the speed and the payout options through a 1–3% markup plus a fee, which on our measurements leaves it behind the cheapest digital routes — but "behind on price" and "the only option that arrives in time" are not competing claims.`,
    },
    limits: `Estimates from collected pricing against a mid-market reference, not guaranteed quotes. OFX's rates improve with transfer size in a way a $1,000 comparison cannot show, and Xoom prices cash pickup differently from bank deposit. Quotes are collected by currency pair — confirm corridor, payout method and speed with the provider before sending. OFX's "no fee" claim is confirmed fee-free regardless of amount for US-dollar transfers specifically; outside the US it charges a flat fee below a country-specific threshold, so check the policy for your own country before sending.`,
  },

  "moneygram-vs-xoom": {
    theDecision: `Both put cash in a recipient's hand within minutes, so this is a genuine like-for-like comparison — rarer on this site than you would think. MoneyGram is an agent network dating to 1940, reaching roughly 200 countries with fees from $1.99 and a 1–3% rate markup. Xoom is PayPal's remittance service, reaching 130 countries with cash pickup, mobile reload and bank deposit, a fee up to $4.99 and a similar 1–3% markup. The decision is usually made by two things: whether a convenient agent is a MoneyGram or a Xoom partner, and whether you already have a PayPal account.`,
    measuredRecord: `Xoom led {{LED:xoom}} of the corridors we price against {{LED:moneygram}} for MoneyGram, whose win rate of {{WINRATE:moneygram}} means it effectively never takes the front. The averages invert that, though: MoneyGram's average shortfall is {{SHORTFALL:moneygram}} while Xoom's is {{SHORTFALL:xoom}}. So Xoom takes the lead more often but is further behind when it does not, and MoneyGram is steadier without ever winning. For a regular sender the average matters more than the count, and it favours MoneyGram slightly.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On $1,000 USD→INR the gap is {{RECEIVE_DIFF:moneygram:xoom:USD:INR:1000}}, with {{CHEAPER:moneygram:xoom:USD:INR:1000}} ahead — {{COST_PCT:moneygram:USD:INR:1000}} all-in against {{COST_PCT:xoom:USD:INR:1000}}. Both price cash pickup differently from bank deposit and both charge more for card funding than bank funding, so quote your actual combination rather than assuming this ordering holds. On a corridor where both are within a percent of each other, the collection location is worth more than the rate.`,
    },
    pickA: {
      heading: "Pick MoneyGram for agent coverage and steadier pricing",
      body: `MoneyGram reaches roughly 200 countries against Xoom's 130 and trails the leader by less on average, so for regular sending to a destination both serve it is the marginally better-priced of the two. Fees start at $1.99. Its real argument is the same as any cash network's: if the recipient's nearest reliable counter is a MoneyGram agent, that decides it, because a better rate at an inconvenient location is worth nothing to the person collecting.`,
    },
    pickB: {
      heading: "Pick Xoom if you already use PayPal, or need mobile reload",
      body: `Xoom's advantages are account-shaped rather than network-shaped. If you already hold a PayPal balance, funding is immediate and the identity checks are largely done, which removes the slowest part of a first transfer. It led more of our priced corridors than MoneyGram, carries the higher Trustpilot rating, supports transfers to $50,000 against MoneyGram's $10,000, and offers mobile reload — topping up a recipient's phone directly — which MoneyGram does not.`,
    },
    limits: `Estimates from collected pricing against a mid-market reference, not guaranteed quotes, and agent-level pricing is not something we observe. Both vary fees by corridor, payout method and funding method; cash pickup depends on the specific agent. Confirm the quote, the collection point and the identification required before sending.`,
  },
};

export function getCompareEditorial(slug: string): CompareEditorial | undefined {
  return compareEditorial[slug];
}
