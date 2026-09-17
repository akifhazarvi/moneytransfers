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
  /**
   * Replaces the generated cost/speed/coverage verdict boxes and "Bottom
   * line" summary. Added 2026-09-16: the first pass of this file only swapped
   * the pros/cons and "when to choose" blocks, but generateComparisonContent's
   * verdict object and FAQs (below) render unconditionally regardless of
   * whether an editorial entry exists — the Sep 16 Premium SiteLiner re-scan
   * showed these 10 pages still 30-59% duplicate because the verdict/FAQ mad
   * lib ("Overall, X edges ahead for most users thanks to its ___") was still
   * the majority of what was left. See src/app/[locale]/compare/[slug]/page.tsx.
   */
  verdict: {
    costExplanation: string;
    speedExplanation: string;
    coverageExplanation: string;
    /** The "Bottom line" box. */
    bottomLine: string;
  };
  /**
   * Replaces generateFAQs' fixed 5-6 question set (same six questions, same
   * answer skeleton, for every pair on the site). Written per pair — fewer
   * questions, chosen for what's actually distinctive about this pair rather
   * than a fixed checklist, per the brief's "condense repeated blocks" ask.
   */
  faqs: { q: string; a: string }[];
  /**
   * Replaces generateKeyDifferences' fixed "**Label**: A does X, while B does
   * Y" bullets — a second generator-template source, smaller than verdict/FAQ
   * but the same pattern. (Its markdown bold never actually rendered: the
   * page passes the string through sanitizeHtml, which strips dangerous tags
   * but doesn't parse markdown, so "**Fee model**" showed as literal
   * asterisks. Written as plain prose here instead of re-introducing that.)
   */
  keyDifferences: string[];
}

export const compareEditorial: Record<string, CompareEditorial> = {
  "wise-vs-remitly": {
    theDecision: `This is not a price comparison, even though it is usually framed as one. Wise and Remitly are built around different assumptions about who collects the money. Wise moves funds between bank accounts at the mid-market rate and charges for it openly; it has no cash payout at all. Remitly assumes the recipient may have no usable bank account, and sells reach — cash pickup, mobile money and home delivery across 100 countries — with the cost folded into the rate. So the question that decides this page is not "which is cheaper" but "can the person receiving it use a bank deposit?" If they can, the comparison is about cost and Wise usually wins it. If they cannot, Wise is not an option at any price.`,
    measuredRecord: `Across the corridors we price continuously, Wise led on {{LED:wise}} and Remitly on {{LED:remitly}}. That gap is the clearest in this set of comparisons, and it is structural rather than promotional: Wise's published markup is 0% against the mid-market rate, so its entire cost is the visible fee, while Remitly's sits at 0.5–2% inside the rate where it is harder to see. When Remitly is not the best-priced option it trails the leader by {{SHORTFALL:remitly}} on average, against {{SHORTFALL:wise}} for Wise. Remitly's <a href="https://www.trustpilot.com/review/remitly.com" target="_blank" rel="noopener noreferrer nofollow">Trustpilot score</a> is nonetheless the higher of the two — <a href="https://www.trustpilot.com/review/wise.com" target="_blank" rel="noopener noreferrer nofollow">Wise's own record</a> is close behind — which is worth taking seriously — it measures whether the transfer felt reliable, not whether it was cheap.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On a $1,000 USD→INR transfer, the gap between these two is {{RECEIVE_DIFF:wise:remitly:USD:INR:1000}}, with {{CHEAPER:wise:remitly:USD:INR:1000}} delivering more. Wise's fee on that transfer is {{FEE:wise:USD:INR:1000}} and its all-in cost {{COST_PCT:wise:USD:INR:1000}} of the amount sent; Remitly's fee is {{FEE:remitly:USD:INR:1000}} at an all-in cost of {{COST_PCT:remitly:USD:INR:1000}}. Note what the fee column does and does not tell you: the lower fee is not automatically the lower total, because the rate carries the rest. Run the same check on your own amount — the ranking can invert between $200 and $5,000, and a first-transfer promotion applies once while the ongoing price applies every month after.`,
    },
    secondExample: {
      heading: "A second corridor: $1,000 to Mexico",
      body: `India is a bank-deposit corridor, which favours Wise's model — Mexico is one of Remitly's core remittance routes, so it's the fairer test of Remitly's actual strength. On $1,000 USD→MXN the gap is {{RECEIVE_DIFF:wise:remitly:USD:MXN:1000}}, with {{CHEAPER:wise:remitly:USD:MXN:1000}} delivering more, at {{COST_PCT:wise:USD:MXN:1000}} all-in for Wise against {{COST_PCT:remitly:USD:MXN:1000}} for Remitly. Even on Remitly's own strongest ground, check both figures against your own amount rather than assuming the India result generalises.`,
    },
    pickA: {
      heading: "Pick Wise when the recipient has a bank account",
      body: `Wise is the better instrument when the money is going account-to-account and you want to be able to audit what you paid. The mid-market rate with a stated fee means the cost is a number you can read rather than infer, which matters most on larger amounts where a rate markup outgrows any fee. It also supports transfers up to $1,000,000 against Remitly's $300,000 from the US (Remitly's published ceiling varies by sending country), holds balances in 50 currencies, and is regulated by the <a href="https://register.fca.org.uk/s/firm?id=001b000001EjC6SAAV" target="_blank" rel="noopener noreferrer">FCA</a>, <a href="https://www.fincen.gov/msb-registrant-search" target="_blank" rel="noopener noreferrer">FinCEN</a> and ASIC — though on Remitly the $300,000 is a published ceiling rather than a typical limit; an individual account's limit may be lower, depending on verification level, payment method and destination. If you are paying tuition, a mortgage, a contractor or yourself, this is the one to start with.`,
    },
    pickB: {
      heading: "Pick Remitly when the payout method is the constraint",
      body: `Remitly is the better instrument when the recipient's collection method is fixed and non-bank. Cash pickup, mobile money and home delivery are not features Wise offers at any price, so for a family member collecting cash in a town without a branch, or a recipient using a mobile wallet, the comparison ends there. Its express tier settles in minutes where Wise quotes instant to two days, and it reaches 100 countries against Wise's 80. You are paying for that reach through the rate; on these corridors that premium is real, and for many senders it buys the only option that actually works.`,
    },
    limits: `Both figures above are estimates built from collected pricing against a mid-market reference, not guaranteed quotes, and our quotes are gathered by currency pair rather than by sending country — so we cannot confirm either provider serves your specific country, funding method or transfer purpose. Confirm eligibility, payout method and limits with the provider before you commit.`,
    verdict: {
      costExplanation: `Wise wins the cost comparison on {{LED:wise}} of the corridors we price, trailing the leader by {{SHORTFALL:wise}} on the corridors it doesn't win; Remitly trails by {{SHORTFALL:remitly}}. The gap tracks Remitly's rate markup rather than its fee — a visible $0-$3.99 charge next to a 0.5-2% spread that moves with the amount sent.`,
      speedExplanation: `Both quote overlapping windows — Wise instant to two days, Remitly's express tier minutes to five days — so speed alone rarely decides this pair. Remitly's express settlement matters when the money is needed same-day; Wise's window holds regardless of how urgently you need it delivered.`,
      coverageExplanation: `Remitly reaches 100 countries against Wise's 80 and adds cash pickup, mobile money and home delivery that Wise does not offer at any price. Wise counters with a $1,000,000 ceiling against Remitly's $300,000 US cap and an extra regulator (FCA, FinCEN and ASIC against Remitly's FinCEN and FCA).`,
      bottomLine: `This page is decided by the recipient's bank access, not by either provider's marketing. A banked recipient makes it a cost question, and Wise wins that one on the numbers above. An unbanked recipient makes coverage the only question that matters, and Remitly is the only one of the two that can answer it.`,
    },
    faqs: [
      {
        q: "Does Wise ever beat Remitly on price for cash pickup?",
        a: "No — Wise has no cash payout option at any price, on any corridor, so this isn't a pricing question when the recipient needs cash. Remitly is the only one of the two that can deliver it at all.",
      },
      {
        q: "Is Remitly's $300,000 limit the same for every sender?",
        a: "No. It's Remitly's published US ceiling; the actual limit on your account depends on verification level, payment method and destination country, and can sit well below it. Wise's $1,000,000 ceiling has similar account-level caveats — confirm your own limit before relying on either figure.",
      },
      {
        q: "Why does Remitly have a higher Trustpilot score if Wise is cheaper?",
        a: "Trustpilot measures whether the transfer felt reliable and arrived as promised, not whether it was the cheapest option available. Remitly's cash-pickup and mobile-money network gives it more chances to satisfy a recipient who has no other way to collect money — a different thing from winning on rate.",
      },
      {
        q: "Which is better for a first large transfer, like a house deposit?",
        a: "Wise, on the numbers we track: no cash-network markup to absorb, a rate you can check against the published mid-market quote independently, and a $1,000,000 ceiling with no promotional pricing that expires after the first transfer. Remitly's model is built around recurring remittances, not a one-off payment.",
      },
    ],
    keyDifferences: [
      "Wise's fee is a visible 0.41%-and-up charge with zero markup; Remitly's fee looks smaller ($0-$3.99) but its 0.5-2% markup is where the real cost sits, which is why the total more often favours Wise despite the sticker fee looking similar.",
      "Remitly settles in minutes on its express tier; Wise's window is instant to two days but applies uniformly, without an express upcharge.",
      "Wise caps out at $1,000,000 against Remitly's $300,000 US ceiling — real headroom for a large one-off transfer that Remitly's remittance-sized limit doesn't match.",
      "Cash pickup, mobile money and home delivery exist only on Remitly's side; Wise's only payout is a bank deposit.",
    ],
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
    verdict: {
      costExplanation: `PayPal's combined fee-and-markup model costs roughly 8-9% all-in on typical amounts — the widest gap tracked on this site. It led {{LED:paypal}} of the corridors we price; Wise led {{LED:wise}}, trailing by {{SHORTFALL:wise}} on the rare corridor it doesn't win outright.`,
      speedExplanation: `PayPal settles instantly between two PayPal balances, which nothing here beats on raw speed. Wise's instant-to-two-day window is close behind for a bank deposit — and unlike a PayPal balance transfer, the money lands somewhere the recipient can spend or withdraw without opening a PayPal account.`,
      coverageExplanation: `PayPal's 200 countries and email-only setup beat Wise's 80 countries and bank-account requirement on pure reach. Wise answers with a $1,000,000 ceiling against a service that is a payments account with an FX feature attached, not a transfer specialist.`,
      bottomLine: `PayPal is the expensive option for a genuine remittance and the right one only when the money is already moving through a PayPal balance — an invoice, a refund, a marketplace payout. For a transfer you're choosing to make from scratch, Wise's visible fee and zero markup make it the cheaper instrument on every corridor we've measured.`,
    },
    faqs: [
      {
        q: "Why is PayPal so much more expensive than Wise for the same transfer?",
        a: "PayPal charges twice: a percentage fee up front (5%, capped at $4.99) and then a 3-4% markup hidden inside the exchange rate. Wise charges once — a visible fee from 0.41% — and passes on the mid-market rate with no markup at all. Neither charge is disclosed as clearly as the other.",
      },
      {
        q: "Does PayPal's $4.99 fee cap make it cheap on large transfers?",
        a: "The fee cap is real, but the rate markup isn't capped — it scales with the amount, so a larger transfer can still cost more in absolute terms even once the fee stops growing. A capped fee next to an uncapped markup is not the same as a capped total cost.",
      },
      {
        q: "Can I avoid the PayPal markup by sending as “friends and family”?",
        a: "That changes the fee PayPal applies to domestic transfers, not the cross-border exchange rate markup, which is built into the conversion regardless of transfer type. It doesn't close the gap with Wise's mid-market rate.",
      },
      {
        q: "Is Wise available if the recipient only has a PayPal account?",
        a: "No — Wise pays out to bank accounts only, so if the recipient can't or won't provide bank details, Wise isn't an option regardless of price. That's the one scenario on this page where PayPal's reach settles the question before cost does.",
      },
    ],
    keyDifferences: [
      "PayPal's cost is two separate charges stacked — a percentage fee capped at $4.99, then a 3-4% markup with no cap at all. Wise charges once, with no markup layered on top.",
      "PayPal settles instantly between two PayPal balances; Wise's instant-to-two-day window is for an actual bank deposit, a different kind of speed.",
      "Wise's $1,000,000 ceiling dwarfs anything PayPal publishes for a standard consumer transfer, and its rate holds regardless of amount.",
      "PayPal reaches 200 countries against Wise's 80 and needs only an email address; Wise requires the recipient to hold a bank account that can receive the deposit.",
    ],
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
    verdict: {
      costExplanation: `Revolut's weekday rate is the interbank rate with no markup up to £1,000 a month, then 0.5% — the tightest margin tracked on this site. PayPal charges 5% plus a 3-4% markup regardless of day or amount, which is why its average shortfall of {{SHORTFALL:paypal}} is the widest we record for any provider on the site.`,
      speedExplanation: `Revolut-to-Revolut transfers land instantly, matching PayPal's balance-to-balance speed, but only when both sides hold the app. Where the recipient doesn't have Revolut, delivery depends on the destination bank's own processing time; PayPal's instant settlement has no such condition attached.`,
      coverageExplanation: `PayPal reaches 200 countries against Revolut's 150 and needs only an email address, where Revolut needs the recipient to open an account. That's the entire coverage argument for PayPal here — everything else favours Revolut once both sides are willing to install the app.`,
      bottomLine: `The day of the week is a genuine lever here in a way it isn't on almost any other comparison on this site: a Revolut transfer sent on a weekday at the interbank rate is a different transfer, price-wise, than the same amount sent on a Saturday. Time it right and Revolut wins comfortably; PayPal's price doesn't move regardless of when you send.`,
    },
    faqs: [
      {
        q: "Why does Revolut cost more on weekends?",
        a: "The interbank FX market is closed on weekends, so Revolut applies a 0.5-1% markup instead of passing through the live interbank rate it uses on weekdays. If the transfer isn't urgent, waiting until Monday is the single cheapest thing you can do on this comparison.",
      },
      {
        q: "What happens after I use Revolut's free £1,000 monthly allowance?",
        a: "Transfers above the free allowance are charged at 0.5%, which is still well below PayPal's combined fee-and-markup cost on the same amount. The allowance resets monthly and favours smaller, recurring transfers rather than being a one-time promotion.",
      },
      {
        q: "Is PayPal ever the cheaper option in your data?",
        a: "Not on the corridors we price — PayPal didn't lead a single one against Revolut, and its average shortfall when it loses is the widest of any provider we track. Its case is convenience and reach, not price.",
      },
      {
        q: "Do I need a Revolut account to receive a Revolut transfer?",
        a: "Yes, for the free and fastest route — Revolut-to-Revolut transfers are instant and cost nothing. Revolut can also send to an external bank account, but that removes the main price advantage over a specialist transfer service.",
      },
    ],
    keyDifferences: [
      "Revolut's markup is 0% on weekdays up to £1,000 a month, then 0.5% — PayPal's 3-4% markup applies every day regardless of amount or plan.",
      "Revolut-to-Revolut transfers are instant and free; sending to an external bank adds the destination bank's own processing time, which PayPal's balance transfer doesn't depend on.",
      "PayPal reaches 200 countries against Revolut's 150, and needs nothing from the recipient beyond an email address — Revolut needs an account.",
      "Revolut has no published upper transfer limit; PayPal's practical ceiling is set by its own risk and compliance policies rather than one published figure.",
    ],
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
    verdict: {
      costExplanation: `MoneyGram's fees start lower, at $1.99 against Western Union's typically higher opening fee, but Western Union wins outright on {{LED:western-union}} of the corridors we price against just {{LED:moneygram}} for MoneyGram — a {{WINRATE:moneygram}} win rate. Average shortfall tells a gentler story for MoneyGram, at {{SHORTFALL:moneygram}} against {{SHORTFALL:western-union}}, so it's rarely first but rarely far off either.`,
      speedExplanation: `Both are cash networks built for same-day collection, and neither is meaningfully faster than the other on the corridors we track — the real speed variable is which network's nearest agent is actually staffed and open, not a published delivery window.`,
      coverageExplanation: `Western Union quotes 130 currencies against MoneyGram's roughly 50 and caps transfers at $50,000 against MoneyGram's $10,000 — a real ceiling difference for anyone sending a larger amount through a cash network rather than a bank transfer.`,
      bottomLine: `Price is close to the least useful way to choose between these two. Both have spent the better part of a century building physical agent networks, and the question that actually decides a transfer is which network has a staffed counter near the person collecting it — something no comparison table, including this one, can answer for your specific town.`,
    },
    faqs: [
      {
        q: "Which agent network is bigger, Western Union or MoneyGram?",
        a: "Western Union's is larger by most published counts and has a longer operating history (1851 against 1940), which shows up in its wider currency list — 130 against MoneyGram's roughly 50. Neither company publishes a directly comparable agent-location count, so check the agent locator for the specific collection town rather than assuming reach from brand size.",
      },
      {
        q: "Why does Western Union win more often if MoneyGram's average shortfall is smaller?",
        a: "The two measurements answer different questions. Win rate counts how often a provider is outright cheapest; average shortfall measures how far behind it falls on the corridors it doesn't win. MoneyGram loses more often but by less each time, while Western Union wins more often outright — both can be true at once.",
      },
      {
        q: "Can I send more than $10,000 through MoneyGram?",
        a: "Not on a single transfer under its published $10,000 ceiling — Western Union's $50,000 limit is the higher of the two for a large cash-network transfer. For anything close to either limit, confirm the current figure and any reporting requirements directly with the provider before sending.",
      },
      {
        q: "Is one of these networks cheaper for a first-time sender?",
        a: "Both frequently run first-transfer promotions that undercut their standing price, so a first transfer through either is a poor guide to what you'll pay on the second one. Compare the returning-customer rate, not the welcome offer, if this is a corridor you'll use more than once.",
      },
    ],
    keyDifferences: [
      "MoneyGram's opening fee is lower, from $1.99; Western Union's wider agent network and 130-currency list come with a correspondingly higher typical fee.",
      "Western Union's $50,000 ceiling is five times MoneyGram's $10,000 — the gap that matters for anyone sending a genuinely large amount through a cash network.",
      "Both settle same-day at a staffed counter; neither publishes a meaningfully faster standard window than the other.",
      "Western Union has been building its agent network since 1851, nearly a century before MoneyGram (1940) — the age gap shows up in Western Union's wider currency and country reach.",
    ],
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
      body: `Remitly is the sharper instrument on established remittance routes — the US, UK, Canada and Australia into South Asia, the Philippines, Mexico and East Africa. Express delivery arrives in minutes, economy costs less if the money can wait, and cash pickup, mobile money and home delivery are all available. Its Trustpilot rating is the higher of the two. The constraint is the narrower country list — and depending on your account's verification level and sending country, your actual per-transfer limit may sit well below Remitly's published $300,000 US ceiling, which is itself six times Western Union's $50,000 cap.`,
    },
    pickB: {
      heading: "Pick Western Union for reach, size and unusual destinations",
      body: `Western Union's argument is coverage: around 200 countries, 130 currencies, transfers to $50,000, and a physical counter in places where app-based payout partners do not operate. For a destination Remitly does not serve, an amount above Remitly's limit, or a recipient who needs to walk into a known location and collect cash with a passport, this is the one that works. You pay for that through the rate, and on our measurements the premium is real.`,
    },
    limits: `Estimates from collected pricing against a mid-market reference, not guaranteed quotes. Promotional first-transfer rates are excluded from the comparison but may change what you actually pay once. Quotes are collected by currency pair, so confirm that your corridor, payout method and amount are supported before relying on either figure.`,
    verdict: {
      costExplanation: `Western Union takes the front more often across the corridors we price — {{LED:western-union}} against {{LED:remitly}} for Remitly — but Remitly trails the leader by less when it isn't first, {{SHORTFALL:remitly}} against {{SHORTFALL:western-union}}. Read together: Remitly is consistently near the front on its supported routes, Western Union more often takes the front outright across a much wider set.`,
      speedExplanation: `Remitly's express tier settles in minutes on the corridors it serves, ahead of anything Western Union publishes as a standard window. That speed is specific to Remitly's narrower, digitally-optimised route list — it doesn't extend to destinations only Western Union's older agent network reaches.`,
      coverageExplanation: `Western Union's century-old agent network reaches roughly 200 countries and 130 currencies against Remitly's 100 countries and 40 currencies, built around established remittance corridors rather than global reach. Remitly's $300,000 US ceiling is six times Western Union's $50,000 cap on the corridors where both operate.`,
      bottomLine: `If your corridor is one of the established routes Remitly prices sharply — the US, UK, Canada or Australia into South Asia, the Philippines, Mexico or East Africa — it's usually the better-priced choice. Outside that list, Western Union's older, wider network is more likely to actually serve the destination at all, which makes coverage the deciding factor rather than price.`,
    },
    faqs: [
      {
        q: "Does Remitly serve every country Western Union does?",
        a: "No — Remitly covers around 100 countries against Western Union's roughly 200, concentrated on established remittance corridors rather than global reach. If your destination is a less common one, check Remitly's coverage list before assuming it's an option at all.",
      },
      {
        q: "Is Remitly's $300,000 limit reliable for a large one-off transfer?",
        a: "It's Remitly's published US ceiling, not a guarantee for your specific account — verification level, payment method and sending country can all lower the practical limit well below it. For a transfer near either provider's stated ceiling, confirm your actual limit before relying on the headline figure.",
      },
      {
        q: "Why would Western Union ever be cheaper than a digital-first competitor like Remitly?",
        a: "It isn't, consistently — Remitly is cheaper more often on the corridors it prices sharply. Western Union's advantage is reaching routes and payout situations Remitly doesn't serve at all, not beating it on price where both compete.",
      },
      {
        q: "Which is better for sending cash to a recipient with no bank account?",
        a: "Both support cash pickup, so the deciding factor is which network has a working agent location near the recipient — not the two providers' published country counts. Check the specific collection town in each provider's agent locator rather than assuming from national coverage.",
      },
    ],
    keyDifferences: [
      "Remitly's narrower, digitally-optimised route list prices established corridors (US/UK/Canada/Australia into South Asia, the Philippines, Mexico, East Africa) sharper than Western Union's century-old agent network typically does.",
      "Western Union's $50,000 ceiling and 200-country, 130-currency reach cover destinations and amounts Remitly's $300,000 US-only ceiling and 100-country list don't.",
      "Remitly's express tier settles in minutes; Western Union's standard cash-counter window is same-day but not minutes-fast.",
      "Remitly is a digital-first app with contracted payout partners; Western Union is a physical agent network that added an app on top — the two started from opposite ends of the same problem.",
    ],
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
    verdict: {
      costExplanation: `Wise led {{LED:wise}} of the corridors we price against {{LED:western-union}} for Western Union — the cleanest lead margin tracked on the site, because Wise's cost is entirely a stated fee with no markup, while Western Union recovers its network cost through a 1-4% spread that scales with the amount sent.`,
      speedExplanation: `Wise's instant-to-two-day window covers bank deposits only; Western Union can put cash in a hand within minutes at a staffed counter, something Wise cannot do at any speed. Neither is faster in an absolute sense — they're fast at different things.`,
      coverageExplanation: `Western Union's 200-country, 130-currency agent network reaches destinations and payout situations Wise structurally cannot serve — no bank account, no address to deposit into, nothing but a name and an ID at a counter. Wise counters with a $1,000,000 ceiling and a third regulator (FCA, FinCEN and ASIC) for the bank-to-bank transfers it does handle.`,
      bottomLine: `This pair is close to the cleanest read on this site of what a physical cash network actually costs: Wise's zero-markup rate against Western Union's agent-funded spread, on a recipient who could use either. If the recipient banks, that gap is the whole decision. If they don't, Western Union isn't competing on price — it's the only option that exists.`,
    },
    faqs: [
      {
        q: "Is Western Union ever cheaper than Wise in your data?",
        a: "Not on the corridors we price — Wise's zero-markup, fee-only model keeps it ahead everywhere we measure. Western Union's case isn't price; it's reaching a recipient who has no bank account or lives somewhere Wise doesn't operate.",
      },
      {
        q: "Does Wise's fee ever get more expensive than Western Union's markup?",
        a: "Wise's fee is a small percentage with no markup layered on top, so its total cost grows slowly with the transfer size. Western Union's markup is a percentage of the whole amount, so it grows in step — the gap between them tends to widen, not narrow, as the transfer gets larger.",
      },
      {
        q: "Can Western Union deposit directly to a bank account like Wise does?",
        a: "Yes, bank deposit is one of its payout options alongside cash pickup and mobile wallet — but choosing bank deposit doesn't remove Western Union's rate markup, so on that specific payout method Wise remains the cheaper route for a recipient who could use either.",
      },
      {
        q: "Why does this comparison matter if Wise doesn't offer cash pickup at all?",
        a: "Because it isolates the price of physical reach for a recipient who could receive either way. For someone who genuinely has no other option but cash, the comparison is moot — Western Union is the only route on this page, not the cheaper one.",
      },
    ],
    keyDifferences: [
      "Wise's cost is a stated fee with 0% markup; Western Union recovers its network cost through a 1-4% markup that scales with the amount sent.",
      "Western Union pays cash at a staffed counter; Wise pays out to a bank account only — neither can substitute for the other's payout method.",
      "Wise's $1,000,000 ceiling and three regulators (FCA, FinCEN, ASIC) fit a large, audit-trail-conscious transfer; Western Union's $50,000 cap and agent network fit reach into places Wise doesn't operate.",
      "Western Union quotes 130 currencies and roughly 200 countries against Wise's 50 currencies and 80 countries — the reach gap is the price of the counter.",
    ],
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
    verdict: {
      costExplanation: `Wise led {{LED:wise}} of the corridors we price against {{LED:worldremit}} for WorldRemit, but WorldRemit's average shortfall of {{SHORTFALL:worldremit}} is tighter than most cash-and-mobile-money providers we track against Wise's {{SHORTFALL:wise}} — competitive without often finishing first, consistent with a service selling payout reach rather than the lowest possible rate.`,
      speedExplanation: `Both quote similar delivery windows on bank deposit corridors — Wise instant to two days, WorldRemit minutes to three days — so speed rarely separates them on a route both can serve. The real speed question is how fast the recipient can use the money once it lands, which depends on the payout method more than the provider.`,
      coverageExplanation: `WorldRemit's 130 countries and 70 currencies include mobile money and airtime top-up, payout methods built for markets where a bank account isn't the default — Wise offers neither. Wise answers with a $1,000,000 ceiling against WorldRemit's $10,000, a real constraint for anyone sending a larger amount.`,
      bottomLine: `For a bank-deposit corridor, this is mostly a cost comparison and Wise usually wins it. For mobile money, cash pickup or airtime — the payout methods WorldRemit is actually built around — Wise has nothing to offer at any price, which makes this less a price comparison than a question of what the recipient can receive at all.`,
    },
    faqs: [
      {
        q: "Can Wise send money to a mobile money wallet like M-Pesa?",
        a: "No — Wise pays out to bank accounts only. WorldRemit is the option on this page for mobile money, cash pickup or airtime top-up; if the recipient uses any of those, the comparison is decided before cost enters it.",
      },
      {
        q: "Is WorldRemit's markup the same on every corridor?",
        a: "No, it varies by payout method and destination — our data shows it runs wider on bank-deposit corridors like the ones priced here than it likely does on the mobile-money routes WorldRemit is built for, where it competes more on reach than on a broker-style bank transfer.",
      },
      {
        q: "Why would I choose WorldRemit over Wise if Wise is cheaper on bank transfers?",
        a: "Only if the recipient can't or won't receive a bank deposit. WorldRemit's mobile money and airtime options serve recipients Wise structurally can't reach, and in much of the markets WorldRemit targets, a mobile wallet is the normal way money is actually received, not a fallback.",
      },
      {
        q: "Does WorldRemit's $10,000 limit apply to every transfer?",
        a: "It's WorldRemit's published ceiling; the practical limit on your account can be lower depending on verification level and payout method. For a transfer approaching either provider's limit, confirm the current figure directly rather than relying on the published number.",
      },
    ],
    keyDifferences: [
      "WorldRemit's 0.5-3% markup buys mobile money, cash pickup and airtime top-up — payout methods Wise doesn't offer at any price; Wise's 0% markup only buys a bank deposit.",
      "Wise's $1,000,000 ceiling is a hundred times WorldRemit's $10,000 — the gap that matters for a transfer well above remittance size.",
      "Both quote similar delivery windows on a bank-deposit corridor (Wise instant to two days, WorldRemit minutes to three days); the real speed difference shows up on WorldRemit's mobile-money routes, which Wise can't serve at all.",
      "WorldRemit's 130 countries and 70 currencies edge out Wise's 80 countries and 50 currencies, concentrated in markets where mobile money is the normal way to receive money.",
    ],
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
    verdict: {
      costExplanation: `Both charge no transfer fee and recover cost through a similar 0.5-1.5% rate markup, so the win-rate gap between them ({{WINRATE:ofx}} for OFX against {{WINRATE:xe}} for XE) is measured on very different sample sizes and shouldn't be read as a real cost verdict — average shortfall, {{SHORTFALL:ofx}} against {{SHORTFALL:xe}}, is the fairer comparison at this scale.`,
      speedExplanation: `Neither is faster than the other in any meaningful sense — both quote one to four business days and neither offers same-day or cash delivery. Speed simply isn't the variable this pair is decided on.`,
      coverageExplanation: `XE quotes 130 currencies against OFX's 55, the widest currency list in this comparison; OFX counters with no upper transfer limit against XE's $500,000 cap and reaches 190 countries, the broadest of the two on country count.`,
      bottomLine: `This is the closest match on the site, and that's the actual finding rather than a gap in the comparison — two long-established brokers with near-identical pricing models. The decision comes down to two things no price table shows: the size of the transfer, where OFX's uncapped limit and dealer service start to matter, and whether you want to run the transfer yourself, where XE's wider currency list and self-serve model fit better.`,
    },
    faqs: [
      {
        q: "Is OFX's win rate more reliable than XE's given they're both brokers?",
        a: "No — OFX's win rate is measured on a much smaller set of corridors than XE's, so the higher-looking percentage is actually the less reliable figure. Average shortfall, which controls for sample size, is the fairer number to compare between these two.",
      },
      {
        q: "At what transfer size do OFX and XE actually become competitive?",
        a: "Both brokers' rates improve as the transfer size grows, in a way our $1,000 sample corridors don't capture — their real competitive range is generally well above $10,000-$20,000, where a fractional rate improvement outweighs the absence of a fee on either side.",
      },
      {
        q: "Does OFX really charge no fee on every transfer?",
        a: "OFX's no-fee claim is confirmed for US-dollar transfers regardless of amount. Outside the US, it charges a flat fee (for example AU$/CA$15) below a country-specific threshold, so check the policy that applies to your sending country before assuming the fee-free claim covers your transfer.",
      },
      {
        q: "Which broker is better for an emigration or property transfer?",
        a: "OFX's dealer service and lack of an upper limit suit a large, one-off transfer like a property purchase, where a named contact can help split or time the payment. XE's wider currency list is the better fit if the destination currency itself is the constraint rather than the transfer size.",
      },
    ],
    keyDifferences: [
      "Both charge no transfer fee and recover cost through a similar 0.5-1.5% markup — the closest pricing match tracked on this site.",
      "OFX has no upper transfer limit; XE caps at $500,000, still well above almost any personal transfer.",
      "XE's 130 currencies is the widest list in this comparison, against OFX's 55 — the practical argument for an unusual destination currency.",
      "XE adds FINTRAC to its regulator set alongside ASIC, FCA and FinCEN; OFX carries the same three without FINTRAC.",
    ],
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
    verdict: {
      costExplanation: `OFX charges no fee at all and recovers cost through its markup alone; Xoom adds a fee up to $4.99 on top of a similar 1-3% markup. OFX's win rate is measured on a small corridor sample and shouldn't be compared directly against Xoom's much larger one — {{SHORTFALL:ofx}} against {{SHORTFALL:xoom}} average shortfall is the more comparable figure.`,
      speedExplanation: `This is the widest speed gap tracked on the site: OFX settles in one to three business days, Xoom in minutes. That difference alone decides the comparison for anyone who needs the money to arrive today, regardless of which one is nominally cheaper.`,
      coverageExplanation: `Xoom pays out via cash pickup, mobile reload and bank deposit across 130 countries; OFX pays to bank accounts only but has no upper transfer limit against Xoom's $50,000 cap, and adds dealer support once the amount is substantial.`,
      bottomLine: `These two barely overlap in what they're actually for. OFX is built for a transfer you can schedule — large, planned, bank-to-bank. Xoom is built for the transfer that has to land today, in cash or a mobile wallet if needed. Anyone genuinely torn between them likely hasn't decided yet what kind of transfer this is.`,
    },
    faqs: [
      {
        q: "Why is there only one corridor priced for this pair?",
        a: "Xoom prices far more of the remittance corridors we track than OFX, whose route list is built around large planned transfers rather than everyday remittance pairs — USD to INR is one of the few currency pairs and amounts where both actually quote, so it's the only like-for-like example we can show.",
      },
      {
        q: "Can OFX deliver cash the way Xoom does?",
        a: "No — OFX pays out to bank accounts only, on a one-to-three business day timeline. If the recipient needs cash pickup or a mobile wallet today, Xoom is the only one of the two that can do it, regardless of price.",
      },
      {
        q: "Is OFX cheaper than Xoom once you account for the fee?",
        a: "On the one corridor we can price both on, yes — but that single data point shouldn't be extrapolated to your own transfer. OFX's rates also improve with transfer size in a way our $1,000 sample doesn't capture; get a live quote from both for your actual amount and corridor.",
      },
      {
        q: "Does OFX's no-fee claim apply everywhere?",
        a: "It's confirmed fee-free regardless of amount for US-dollar transfers specifically. Outside the US, OFX charges a flat fee below a country-specific threshold — check the policy for your sending country before assuming it applies to your transfer.",
      },
    ],
    keyDifferences: [
      "OFX charges no fee and settles in one to three business days; Xoom charges a fee up to $4.99 and settles in minutes — the two are optimised for opposite priorities.",
      "Xoom pays out via cash pickup, mobile reload and bank deposit across 130 countries; OFX pays to a bank account only, with no upper limit against Xoom's $50,000 cap.",
      "OFX adds dealer support once a transfer is substantial; Xoom's PayPal-linked balance makes funding instant for an existing PayPal user.",
      "Xoom prices far more remittance-sized corridors than OFX, whose route list is built around larger, planned transfers rather than everyday sending pairs.",
    ],
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
    verdict: {
      costExplanation: `Xoom took the lead more often across the corridors we price — {{LED:xoom}} against {{LED:moneygram}} for MoneyGram, whose {{WINRATE:moneygram}} win rate means it effectively never finishes first — but MoneyGram's average shortfall of {{SHORTFALL:moneygram}} is tighter than Xoom's {{SHORTFALL:xoom}}, so it loses more often but by less each time.`,
      speedExplanation: `Both settle in minutes on their express options, and neither has a meaningful speed edge over the other in the corridors we track. The variable that actually matters is whether a convenient agent or partner location belongs to one network or the other.`,
      coverageExplanation: `MoneyGram reaches roughly 200 countries against Xoom's 130, but Xoom adds mobile reload — topping up a recipient's phone directly — which MoneyGram doesn't offer, and a $50,000 ceiling against MoneyGram's $10,000.`,
      bottomLine: `For a regular sender the average shortfall favours MoneyGram slightly, even though Xoom takes the outright lead more often. In practice this comparison is usually settled by two things a price table can't show: whether the recipient's nearest reliable agent is a MoneyGram or Xoom partner, and whether you already hold a PayPal account that makes Xoom's funding instant.`,
    },
    faqs: [
      {
        q: "Does already having a PayPal account make Xoom cheaper?",
        a: "It doesn't change Xoom's price, but it removes the slowest part of a first transfer — funding is immediate and identity checks are largely already done through your existing PayPal account. MoneyGram has no equivalent shortcut for a first-time sender.",
      },
      {
        q: "Which is more consistent, MoneyGram or Xoom?",
        a: "MoneyGram is the steadier of the two — it rarely leads outright but trails the leader by less on average when it doesn't. Xoom takes the outright lead more often but falls further behind on the corridors it loses. Steadier isn't the same as cheaper on any single transfer.",
      },
      {
        q: "Can MoneyGram top up a recipient's phone the way Xoom can?",
        a: "No — mobile reload is specific to Xoom in this comparison. If that's the payout method you need, MoneyGram isn't an option regardless of its pricing on the corridors it does serve.",
      },
      {
        q: "Is MoneyGram's $10,000 limit fixed for every country?",
        a: "It's MoneyGram's general published ceiling; the practical limit can vary by country, verification level and payout method. For a transfer approaching either provider's limit — MoneyGram's $10,000 or Xoom's $50,000 — confirm the current figure for your specific corridor before sending.",
      },
    ],
    keyDifferences: [
      "MoneyGram's fees start lower, from $1.99; Xoom's fee runs up to $4.99 but is funded instantly from an existing PayPal balance.",
      "Xoom offers mobile reload — topping up a recipient's phone directly — which MoneyGram doesn't; MoneyGram's reach is wider at roughly 200 countries against Xoom's 130.",
      "Xoom's $50,000 ceiling is five times MoneyGram's $10,000.",
      "Both settle in minutes on their express options; the deciding factor is usually whose agent or partner is nearest the recipient, not the published speed.",
    ],
  },
};

export function getCompareEditorial(slug: string): CompareEditorial | undefined {
  return compareEditorial[slug];
}
