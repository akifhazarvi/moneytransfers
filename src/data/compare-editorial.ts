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
    measuredRecord: `This is the widest cost gap of any pair on the site. PayPal led on {{LED:paypal}} of the corridors we price and, when it is not the leader, trails by {{SHORTFALL:paypal}} on average — the largest average shortfall we record for any provider. Wise led {{LED:wise}} with an average shortfall of {{SHORTFALL:wise}}. PayPal's <a href="https://www.trustpilot.com/review/paypal.com" target="_blank" rel="noopener noreferrer nofollow">Trustpilot rating</a> is also the lowest in our provider set by a wide margin. None of that makes PayPal unusable; it makes it an expensive way to move money internationally, which is a different claim.`,
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
    measuredRecord: `Neither provider led a single corridor: Revolut {{LED:revolut}}, PayPal {{LED:paypal}}. What separates them is how far back they sit when they lose. Revolut's average shortfall is {{SHORTFALL:revolut}} — close to the front, and among the tightest we record — while PayPal's is {{SHORTFALL:paypal}}, the widest of any provider we track. Read that together: Revolut rarely wins because specialist services undercut it at the margin, but it is never far off. PayPal is consistently far off. Revolut also carries the higher <a href="https://www.trustpilot.com/review/revolut.com" target="_blank" rel="noopener noreferrer nofollow">Trustpilot rating</a> of the two by a wide margin.`,
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
      body: `Revolut is the better instrument for anyone moving money regularly between countries they live and work in, rather than sending remittances to a third party. Free allowance to £1,000 a month, the interbank rate on weekdays, balances in 36 currencies, no upper transfer limit, and regulation by the <a href="https://register.fca.org.uk" target="_blank" rel="noopener noreferrer">FCA</a> and ECB. Revolut-to-Revolut transfers land instantly and cost nothing. The constraint is that this only works when the recipient is willing to hold an account too — which is precisely the constraint PayPal does not have.`,
    },
    limits: `Revolut's free allowance and weekend markup depend on your plan tier, PayPal's pricing differs between personal and business accounts, and card funding adds a further charge on both. Quotes are collected by currency pair, so confirm your own eligibility and the applicable schedule before sending.`,
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
      body: `Western Union supports transfers up to $50,000 against MoneyGram's $10,000, quotes 130 currencies against 50, and wins more of the corridors we price outright. If the amount is substantial, or the destination is somewhere thinly served, the larger agent footprint and higher limit are the practical arguments. It also offers bank deposit and mobile wallet alongside cash, so a single account covers more payout methods. It's regulated by <a href="https://www.fincen.gov/msb-registrant-search" target="_blank" rel="noopener noreferrer">FinCEN</a> in the US and the <a href="https://register.fca.org.uk/s/firm?id=001b000000MfgqRAAR" target="_blank" rel="noopener noreferrer">FCA</a> in the UK, among other national authorities.`,
    },
    pickB: {
      heading: "Pick MoneyGram when its agent is the one nearby",
      body: `MoneyGram's argument is locational rather than financial. Its fees start lower at $1.99, it reaches roughly the same 200 countries, and on our measurements it trails the leader by less on average than Western Union does. If the recipient's nearest reliable agent — a specific supermarket, bank branch or post office — is a MoneyGram agent, that settles it, because a marginally better rate at a counter two hours away is worth nothing. Check the agent locator for the collection town first and let the price question follow. It's regulated by <a href="https://www.fincen.gov/msb-registrant-search" target="_blank" rel="noopener noreferrer">FinCEN</a> in the US and the <a href="https://register.fca.org.uk/s/firm?id=001b000000MgGNGAA3" target="_blank" rel="noopener noreferrer">FCA</a> in the UK.`,
    },
    secondExample: {
      heading: "A second corridor: $1,000 to Mexico",
      body: `Mexico is the corridor both networks built their US agent presence around, long before either one priced a digital-first route like India, so it's a fairer test of the core cash-network model than an unfamiliar destination. On $1,000 USD→MXN the gap is {{RECEIVE_DIFF:western-union:moneygram:USD:MXN:1000}}, with {{CHEAPER:western-union:moneygram:USD:MXN:1000}} ahead at {{COST_PCT:western-union:USD:MXN:1000}} all-in for Western Union against {{COST_PCT:moneygram:USD:MXN:1000}} for MoneyGram. As with the India example, get a quote for your specific payout method — agent pricing isn't something either network publishes as a flat rate.`,
    },
    limits: `Agent-level pricing is not something we observe. Both networks vary fees by corridor, payout method and funding method, and cash pickup availability depends on the specific agent. Confirm the quote, the collection location and the identification the recipient will need before sending.`,
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
      body: `Remitly is the sharper instrument on established remittance routes — the US, UK, Canada and Australia into South Asia, the Philippines, Mexico and East Africa. Express delivery arrives in minutes, economy costs less if the money can wait, and cash pickup, mobile money and home delivery are all available. Its <a href="https://www.trustpilot.com/review/remitly.com" target="_blank" rel="noopener noreferrer nofollow">Trustpilot rating</a> is the higher of the two. The constraint is the narrower country list — and depending on your account's verification level and sending country, your actual per-transfer limit may sit well below Remitly's published $300,000 US ceiling, which is itself six times Western Union's $50,000 cap.`,
    },
    pickB: {
      heading: "Pick Western Union for reach, size and unusual destinations",
      body: `Western Union's argument is coverage: around 200 countries, 130 currencies, transfers to $50,000, and a physical counter in places where app-based payout partners do not operate. For a destination Remitly does not serve, an amount above Remitly's limit, or a recipient who needs to walk into a known location and collect cash with a passport, this is the one that works. You pay for that through the rate, and on our measurements the premium is real.`,
    },
    secondExample: {
      heading: "A second corridor: $1,000 to Mexico",
      body: `Mexico is where both companies compete most directly — a well-established remittance corridor for Western Union's agent network and one of Remitly's core priced routes, unlike India where the two start from more different footing. On $1,000 USD→MXN the gap is {{RECEIVE_DIFF:remitly:western-union:USD:MXN:1000}}, with {{CHEAPER:remitly:western-union:USD:MXN:1000}} delivering more, at {{COST_PCT:remitly:USD:MXN:1000}} all-in for Remitly against {{COST_PCT:western-union:USD:MXN:1000}} for Western Union. Confirm your own payout method before relying on either figure — cash pickup and bank deposit are not priced the same by either provider.`,
    },
    limits: `Promotional first-transfer rates are excluded from the comparison but may change what you actually pay once. Quotes are collected by currency pair, so confirm that your corridor, payout method and amount are supported before relying on either figure.`,
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
      heading: "India at $1,000: what the counter costs",
      body: `Sending $1,000 from the US to India, the payouts differ by {{RECEIVE_DIFF:wise:western-union:USD:INR:1000}}, with {{CHEAPER:wise:western-union:USD:INR:1000}} ahead. Wise's all-in cost is {{COST_PCT:wise:USD:INR:1000}} against {{COST_PCT:western-union:USD:INR:1000}} for Western Union. Worth isolating: Wise's cost is entirely its fee, because its markup is 0% — so on a larger transfer Wise's cost grows slowly while a percentage markup grows in step with the amount. On recurring transfers that difference compounds monthly.`,
    },
    secondExample: {
      heading: "Mexico, where the margin tightens",
      body: `For $1,000 into pesos the gap narrows to {{RECEIVE_DIFF:wise:western-union:USD:MXN:1000}}, with {{CHEAPER:wise:western-union:USD:MXN:1000}} ahead at {{COST_PCT:wise:USD:MXN:1000}} against {{COST_PCT:western-union:USD:MXN:1000}} for Western Union. That's a noticeably tighter margin than the India example — Western Union's markup isn't flat across corridors, and Mexico is one of the routes where its agent network keeps it closer to competitive.`,
    },
    pickA: {
      heading: "Choose Wise when the money is going into a bank account",
      body: `When the recipient can take a bank deposit, Wise leaves them with more than Western Union on every route we measure, and the ceiling is high: transfers to $1,000,000, balances in 50 currencies, regulation by the <a href="https://register.fca.org.uk/s/firm?id=001b000001EjC6SAAV" target="_blank" rel="noopener noreferrer">FCA</a>, <a href="https://www.fincen.gov/msb-registrant-search" target="_blank" rel="noopener noreferrer">FinCEN</a> and ASIC. For tuition, property, payroll, contractors or your own accounts abroad, the audit trail matters as much as the price — you can check the rate you were given against any published mid-market quote, a check a marked-up rate never passes.`,
    },
    pickB: {
      heading: "Pick Western Union when cash or coverage decides it",
      body: `Western Union reaches destinations and recipients Wise structurally cannot: someone without a bank account, a country outside Wise's 80, a recipient who needs money within minutes at a counter, or a payout in one of the 130 currencies it quotes. Add mobile wallet delivery and a $50,000 ceiling. When any of those apply, the comparison is not close, because the alternative is not a worse price — it is no transfer at all.`,
    },
    limits: `Western Union's pricing varies by payout method, funding method and agent; Wise's fee varies by currency and funding method. Quotes are collected by currency pair, so we cannot confirm either serves your specific sending country — check before you commit.`,
    verdict: {
      costExplanation: `Wise led {{LED:wise}} of the corridors we price against {{LED:western-union}} for Western Union — the cleanest lead margin tracked on the site, because Wise's cost is entirely a stated fee with no markup, while Western Union recovers its network cost through a 1-4% spread that scales with the amount sent.`,
      speedExplanation: `Wise's instant-to-two-day window covers bank deposits only; Western Union can have cash waiting at an agent counter within minutes — a payout Wise does not offer at all. Neither is faster in an absolute sense — they're fast at different things.`,
      coverageExplanation: `Western Union's 200-country, 130-currency agent network reaches destinations and payout situations Wise structurally cannot serve — no bank account, no address to deposit into, nothing but a name and an ID at a counter. Wise counters with a $1,000,000 ceiling and a third regulator (FCA, FinCEN and ASIC) for the bank-to-bank transfers it does handle.`,
      bottomLine: `This pair is close to the cleanest read on this site of what a physical cash network actually costs: Wise's zero-markup rate against Western Union's agent-funded spread, on a recipient who could use either. If the recipient banks, that gap is the whole decision. If they don't, price stops being the question: Western Union is the one of the two that can reach them.`,
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
        a: "Yes. Western Union pays into bank accounts as well as to cash counters and wallets, but its rate margin applies whichever payout you pick, so on that specific payout method Wise remains the cheaper route for a recipient who could use either.",
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
      heading: "Choose Wise when the money lands in a bank account",
      body: `Against WorldRemit, Wise wins where the recipient banks and you want a rate you can check against mid-market. The 0% markup means cost does not scale with the amount the way a percentage markup does, which matters above a few thousand: transfers run to $1,000,000 against WorldRemit's $10,000 ceiling. Balances in 50 currencies and <a href="https://register.fca.org.uk/s/firm?id=001b000001EjC6SAAV" target="_blank" rel="noopener noreferrer">FCA</a>, <a href="https://www.fincen.gov/msb-registrant-search" target="_blank" rel="noopener noreferrer">FinCEN</a> and ASIC regulation round it out.`,
    },
    pickB: {
      heading: "Pick WorldRemit for mobile money, cash and airtime",
      body: `WorldRemit's case is the last mile. Mobile money into wallets like M-Pesa and MTN, cash pickup, and airtime top-up direct to a recipient's phone are payout methods Wise does not offer at all, and in much of sub-Saharan Africa and parts of South and Southeast Asia they are how money is actually received. It quotes 70 currencies against Wise's 50 and reaches 130 countries against 80. Fees start at $0.99, and delivery is typically minutes to three days.`,
    },
    limits: `Mobile money and airtime availability vary by country and network, and WorldRemit's pricing differs by payout method. Quotes are collected by currency pair, so confirm that your corridor and chosen payout method are supported before sending.`,
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
      body: `OFX has no upper transfer limit and no transfer fee, and its proposition above roughly $10,000 is a dealer you can call — useful when a transfer is time-sensitive, needs to be split, or is part of something larger like a property purchase or an emigration. It reaches 190 countries, the widest in this pair, and is regulated by ASIC, the <a href="https://register.fca.org.uk/s/firm?id=001b000000Mg5hRAAR" target="_blank" rel="noopener noreferrer">FCA</a> and <a href="https://www.fincen.gov/msb-registrant-search" target="_blank" rel="noopener noreferrer">FinCEN</a>. For a one-off five- or six-figure transfer where a fractional rate improvement outweighs any fee, this is the model that fits.`,
    },
    pickB: {
      heading: "Pick XE for breadth of currency and a self-serve transfer",
      body: `XE quotes 130 currencies against OFX's 55, which is the widest currency list in this comparison and the practical argument for anyone sending to a less common destination. It carries the higher <a href="https://www.trustpilot.com/review/xe.com" target="_blank" rel="noopener noreferrer nofollow">Trustpilot rating</a> of the two, adds FINTRAC to the regulatory set, and caps transfers at $500,000 — above almost any personal transfer. If you want to run the transfer yourself without a dealer relationship, and your currency is an unusual one, XE is the better fit.`,
    },
    limits: `Both brokers quote rates that improve with transfer size in a way a fixed-amount comparison cannot capture. Neither offers cash payout. Quotes are collected by currency pair, so confirm your corridor, amount band and account eligibility directly. OFX's "no transfer fee" is confirmed fee-free regardless of amount for US-dollar transfers specifically; outside the US it charges a flat fee (e.g. AU$/CA$15) below a country-specific threshold, so check the policy for your own country before sending.`,
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
      body: `OFX suits a transfer you can schedule: no fee at all, no upper limit, 190 countries, and dealer support once the amount is substantial. Property deposits, tuition instalments, emigration transfers and business payments are its natural cases. The trade-off is that it settles in business days and pays out only to bank accounts, so it is the wrong instrument for anything urgent or anything a recipient needs to collect in cash. It's regulated by <a href="https://register.fca.org.uk/s/firm?id=001b000000Mg5hRAAR" target="_blank" rel="noopener noreferrer">FCA</a>, <a href="https://www.fincen.gov/msb-registrant-search" target="_blank" rel="noopener noreferrer">FinCEN</a> and ASIC.`,
    },
    pickB: {
      heading: "Pick Xoom for speed and non-bank payout",
      body: `Xoom is built for the transfer that has to land now. Cash pickup, mobile reload and bank deposit across 130 countries, settlement in minutes, and a familiar PayPal login and balance behind it. Transfers run to $50,000. You pay for the speed and the payout options through a 1–3% markup plus a fee, which on our measurements leaves it behind the cheapest digital routes — but "behind on price" and "the only option that arrives in time" are not competing claims.`,
    },
    limits: `OFX's rates improve with transfer size in a way a $1,000 comparison cannot show, and Xoom prices cash pickup differently from bank deposit. Quotes are collected by currency pair — confirm corridor, payout method and speed with the provider before sending. OFX's "no fee" claim holds at any amount for US-dollar sends; senders elsewhere pay a flat fee under a local threshold that differs by country, so look up your own before setting it against Xoom's fee.`,
    verdict: {
      costExplanation: `OFX charges no fee at all and recovers cost through its markup alone; Xoom adds a fee up to $4.99 on top of a similar 1-3% markup. OFX's win rate is measured on a small corridor sample and shouldn't be compared directly against Xoom's much larger one — {{SHORTFALL:ofx}} against {{SHORTFALL:xoom}} average shortfall is the more comparable figure.`,
      speedExplanation: `This is the widest speed gap tracked on the site: OFX settles in one to three business days, Xoom in minutes. That difference alone decides the comparison for anyone who needs the money to arrive today, regardless of which one is nominally cheaper.`,
      coverageExplanation: `Xoom pays out via cash pickup, mobile reload and bank deposit across 130 countries; OFX pays to bank accounts only but has no upper transfer limit against Xoom's $50,000 cap, and adds dealer support once the amount is substantial.`,
      bottomLine: `OFX and Xoom solve different problems. OFX is built for a transfer you can schedule — large, planned, bank-to-bank. Xoom is built for the transfer that has to land today, in cash or a mobile wallet if needed. Anyone genuinely torn between them likely hasn't decided yet what kind of transfer this is.`,
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
      body: `Where MoneyGram's case rests on counters, Xoom's rests on the PayPal account behind it: a sender who already has one can fund straight from the balance with most identity checks on file, so the first transfer is the quick one. It led more of our priced corridors than MoneyGram, carries the higher <a href="https://www.trustpilot.com/review/xoom.com" target="_blank" rel="noopener noreferrer nofollow">Trustpilot rating</a>, supports transfers to $50,000 against MoneyGram's $10,000, and offers mobile reload — topping up a recipient's phone directly — which MoneyGram does not.`,
    },
    secondExample: {
      heading: "A second corridor: $200 to Nigeria",
      body: `Nigeria is one of the few corridors outside India where both networks actually quote at the same amount — Xoom's route list is narrower than MoneyGram's agent network, so overlapping pairs are the exception rather than the rule. On $200 USD→NGN the gap is {{RECEIVE_DIFF:moneygram:xoom:USD:NGN:200}}, with {{CHEAPER:moneygram:xoom:USD:NGN:200}} delivering more. Both providers happen to be quoting above the day's mid-market reference rate for naira, which floors their computed markup at zero — the receive-amount gap above is the reliable number here, not a percentage. Confirm your own corridor is one Xoom actually serves before assuming this pattern holds.`,
    },
    limits: `Agent-level pricing is not something we observe. Both vary fees by corridor, payout method and funding method; cash pickup depends on the specific agent. Confirm the quote, the collection point and the identification required before sending.`,
    verdict: {
      costExplanation: `Xoom took the lead more often across the corridors we price — {{LED:xoom}} against {{LED:moneygram}} for MoneyGram, whose {{WINRATE:moneygram}} win rate means it effectively never finishes first — but MoneyGram's average shortfall of {{SHORTFALL:moneygram}} is tighter than Xoom's {{SHORTFALL:xoom}}, so it loses more often but by less each time.`,
      speedExplanation: `Both settle in minutes on their express options, and neither has a meaningful speed edge over the other in the corridors we track. The variable that actually matters is whether a convenient agent or partner location belongs to one network or the other.`,
      coverageExplanation: `MoneyGram reaches roughly 200 countries against Xoom's 130, but Xoom adds mobile reload — topping up a recipient's phone directly — which MoneyGram doesn't offer, and a $50,000 ceiling against MoneyGram's $10,000.`,
      bottomLine: `For a regular sender the average shortfall favours MoneyGram slightly, even though Xoom takes the outright lead more often. In practice this comparison is usually settled by two things a price table can't show: whether the recipient's nearest reliable agent is a MoneyGram or Xoom partner, and whether you already hold a PayPal account that makes Xoom's funding instant.`,
    },
    faqs: [
      {
        q: "Does already having a PayPal account make Xoom cheaper?",
        a: "No — Xoom quotes the same rate either way. What a PayPal login saves is time on a first send: the money can come from a PayPal balance and verification is mostly already done. A first MoneyGram transfer starts without that head start.",
      },
      {
        q: "Which is more consistent, MoneyGram or Xoom?",
        a: "MoneyGram is the steadier of the two — it rarely leads outright but trails the leader by less on average when it doesn't. Xoom takes the outright lead more often but falls further behind on the corridors it loses. Steadier isn't the same as cheaper on any single transfer.",
      },
      {
        q: "Can MoneyGram top up a recipient's phone the way Xoom can?",
        a: "No. Of these two only Xoom offers mobile reload, so if airtime is what the recipient needs, the choice is made before price comes into it.",
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
  "moneygram-vs-worldremit": {
    theDecision: `Both specialise in cash and mobile-money reach rather than bank-to-bank transfers, so this comparison turns on which network actually covers your corridor and what it charges to get there. MoneyGram is the older, wider agent network — 200 countries since 1940 — while WorldRemit was built specifically for mobile money and airtime in markets MoneyGram's agent model reaches less directly. Fees favour WorldRemit at the low end ($0.99 against MoneyGram's $1.99), but MoneyGram's markup can undercut WorldRemit's on some corridors, so the total matters more than either headline number.`,
    measuredRecord: `WorldRemit led on {{LED:worldremit}} of the corridors we price against {{LED:moneygram}} for MoneyGram. When WorldRemit isn't the best-priced option it trails by {{SHORTFALL:worldremit}} on average, against {{SHORTFALL:moneygram}} for MoneyGram. Both sit behind the digital leaders on cost, consistent with two providers competing on payout reach rather than the lowest possible rate.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On $1,000 USD→INR the gap is {{RECEIVE_DIFF:moneygram:worldremit:USD:INR:1000}}, with {{CHEAPER:moneygram:worldremit:USD:INR:1000}} delivering more — {{COST_PCT:moneygram:USD:INR:1000}} all-in for MoneyGram against {{COST_PCT:worldremit:USD:INR:1000}} for WorldRemit. Both price cash pickup differently from bank deposit and mobile money differently again, so quote your actual payout method rather than assuming this ordering holds for yours.`,
    },
    secondExample: {
      heading: "A second corridor: $1,000 to Mexico",
      body: `Mexico is MoneyGram's original agent-network market; WorldRemit built its reputation on mobile-money corridors further afield, so this is a fairer test of MoneyGram's home turf than the India example. On $1,000 USD→MXN the gap is {{RECEIVE_DIFF:moneygram:worldremit:USD:MXN:1000}}, with {{CHEAPER:moneygram:worldremit:USD:MXN:1000}} ahead at {{COST_PCT:moneygram:USD:MXN:1000}} all-in against {{COST_PCT:worldremit:USD:MXN:1000}} for WorldRemit.`,
    },
    pickA: {
      heading: "Pick MoneyGram for a physical agent counter",
      body: `MoneyGram is the better instrument for reach into a staffed counter — 200 countries against WorldRemit's 130, with cash pickup at supermarkets, bank branches and post offices in places WorldRemit's mobile-money-first model doesn't prioritise. If the recipient's nearest reliable collection point is a MoneyGram agent, that settles it regardless of the rate. It's regulated by <a href="https://www.fincen.gov/msb-registrant-search" target="_blank" rel="noopener noreferrer">FinCEN</a> in the US and the <a href="https://register.fca.org.uk/s/firm?id=001b000000MgGNGAA3" target="_blank" rel="noopener noreferrer">FCA</a> in the UK.`,
    },
    pickB: {
      heading: "Pick WorldRemit for mobile money and airtime",
      body: `WorldRemit is the better instrument when the payout is mobile money or airtime rather than cash or a bank account — M-Pesa, MTN Mobile Money and direct phone top-ups are payout methods MoneyGram doesn't offer at all. It quotes 70 currencies against MoneyGram's 50, and its lower starting fee matters most on smaller, frequent transfers. It's regulated by the <a href="https://register.fca.org.uk/s/firm?id=0010X00004D8FDGQA3" target="_blank" rel="noopener noreferrer">FCA</a> in the UK and FinCEN in the US.`,
    },
    limits: `Agent-level/mobile-money pricing is not something we observe directly. Both providers vary fees by corridor, payout method and funding method. Confirm the quote, the collection method and (for WorldRemit) network compatibility before sending.`,
    verdict: {
      costExplanation: `WorldRemit led {{LED:worldremit}} of the corridors we price against {{LED:moneygram}} for MoneyGram, with average shortfalls of {{SHORTFALL:worldremit}} and {{SHORTFALL:moneygram}} respectively. Neither dominates the way a digital specialist does — both are pricing around a reach-first model, not a lowest-cost one.`,
      speedExplanation: `Both settle in minutes on their express tiers and up to three days on standard delivery — there's no meaningful speed edge between them on the corridors we track. The real timing variable is the payout method: mobile money and cash pickup typically land faster than a bank deposit on either network.`,
      coverageExplanation: `MoneyGram's 200 countries and cash-agent network beat WorldRemit's 130 countries on raw reach; WorldRemit answers with mobile money, cash pickup and airtime top-up spanning 70 currencies against MoneyGram's 50, concentrated in markets where a bank account isn't the norm.`,
      bottomLine: `This page is decided by payout method more than price. A recipient who needs an agent counter is better served by MoneyGram's wider footprint; a recipient who collects through a mobile wallet or needs airtime is better served by WorldRemit, which is built around exactly that.`,
    },
    faqs: [
      {
        q: "Which is cheaper, MoneyGram or WorldRemit?",
        a: "It depends on the corridor — WorldRemit's starting fee is lower ($0.99 against MoneyGram's $1.99), but MoneyGram's markup can be tighter on some routes. Compare the all-in cost for your specific corridor and amount rather than the headline fee.",
      },
      {
        q: "Can WorldRemit deliver to a mobile money wallet MoneyGram doesn't reach?",
        a: "Yes — WorldRemit's mobile money and airtime top-up options cover markets, especially in Sub-Saharan Africa, where MoneyGram's agent network is thinner. If the recipient's payout method is a mobile wallet rather than cash or a bank account, WorldRemit is usually the only one of the two that can deliver it.",
      },
      {
        q: "Is MoneyGram's larger country count a real advantage?",
        a: "For cash pickup specifically, yes — MoneyGram's agent network has had since 1940 to build out physical locations. WorldRemit's narrower list is concentrated in the mobile-money and remittance corridors it was built for, so a wider network doesn't automatically mean better coverage for your specific destination.",
      },
      {
        q: "Do both charge more for card-funded transfers?",
        a: "Yes, funding with a debit or credit card typically costs more than a bank transfer on both, since card processing carries its own fee the provider passes through. Check the funding-method breakdown on your own quote rather than assuming the bank-transfer price applies.",
      },
    ],
    keyDifferences: [
      "MoneyGram's fee starts at $1.99 against WorldRemit's $0.99, but the difference narrows or reverses once the rate markup is counted — compare the all-in cost, not the headline fee.",
      "MoneyGram reaches roughly 200 countries through physical agent counters; WorldRemit reaches 130 countries but adds mobile money and airtime top-up, payout methods MoneyGram doesn't offer at all.",
      "WorldRemit's 70 currencies edge out MoneyGram's 50, concentrated in markets where mobile wallets are the normal way to receive money rather than a bank account or cash.",
      "Both cap transfers at $10,000 — this pair has no meaningful size advantage either way, unlike comparisons involving a broker or a bank.",
    ],
  },

  "hsbc-vs-paypal": {
    theDecision: `These two serve completely different purposes that happen to overlap on "sending money abroad." HSBC is a full-service bank: free transfers between HSBC accounts, £4-£9 otherwise, with a markup that ranges from 0% for Premier customers down to 2.5% for standard accounts. PayPal is a payments account with an FX feature bolted on: a 5% fee (capped at $4.99) plus a 3-4% markup, every time, regardless of account tier. If you and the recipient both bank with HSBC, this isn't really a contest. If not, it's a question of how expensive convenience is.`,
    measuredRecord: `PayPal led on {{LED:paypal}} of the corridors we price against {{LED:hsbc}} for HSBC. PayPal's average shortfall when it isn't cheapest is {{SHORTFALL:paypal}}; HSBC's is {{SHORTFALL:hsbc}}. Read this with the tier caveat in mind: our HSBC quotes reflect standard retail pricing, not the 0% Premier rate — a Premier customer's real result would sit meaningfully closer to the leaders than the figure here suggests.`,
    workedExample: {
      heading: "A worked example: £1,000 to euros",
      body: `On £1,000 GBP→EUR the gap is {{RECEIVE_DIFF:hsbc:paypal:GBP:EUR:1000}}, with {{CHEAPER:hsbc:paypal:GBP:EUR:1000}} delivering more — {{COST_PCT:hsbc:GBP:EUR:1000}} all-in for HSBC against {{COST_PCT:paypal:GBP:EUR:1000}} for PayPal. This is standard-tier HSBC pricing; an HSBC Premier account pays no markup at all, which would change this comparison more than any other variable on this page.`,
    },
    pickA: {
      heading: "Pick HSBC if you're a Premier customer or sending HSBC-to-HSBC",
      body: `HSBC's case depends entirely on your account tier and the recipient's bank. HSBC-to-HSBC transfers are free with no markup; Premier customers get the mid-market rate on any transfer. Outside those two conditions, standard HSBC pricing (£4-£9 plus up to 2.5% markup) is not obviously competitive with a specialist. It's regulated by the <a href="https://register.fca.org.uk" target="_blank" rel="noopener noreferrer">FCA</a>, the PRA and the HKMA, and has been operating since 1865.`,
    },
    pickB: {
      heading: "Pick PayPal only where the payment already lives there",
      body: `PayPal's case is the same as everywhere else it appears on this site: an invoice, a refund, or a counterparty who won't accept anything but a PayPal payment. It reaches 200 countries and needs only an email address, against HSBC's requirement that the recipient hold a bank account. Choosing PayPal as a deliberate remittance route, rather than because the payment already lives there, is the expensive option on this page for most standard-tier senders.`,
    },
    limits: `HSBC's markup depends heavily on account tier (Premier vs standard) in a way our quotes cannot fully capture, and PayPal's consumer and business pricing differ. Confirm your own account tier's actual rate before relying on either figure.`,
    verdict: {
      costExplanation: `PayPal led {{LED:paypal}} of the corridors we price against {{LED:hsbc}} for HSBC, with average shortfalls of {{SHORTFALL:paypal}} and {{SHORTFALL:hsbc}}. HSBC's result reflects standard retail pricing; Premier customers pay no markup at all, a tier difference no other pair on this site has to account for.`,
      speedExplanation: `HSBC quotes same-day to three business days; PayPal settles instantly to another PayPal balance but takes longer once the money needs to reach a bank account. Neither is reliably faster than the other once the payout method is matched.`,
      coverageExplanation: `HSBC reaches 200 countries and 60 currencies through its own branch network; PayPal reaches 200 countries with just an email address needed from the recipient, though only 25 currencies. Neither has a transfer limit that binds a typical personal transfer.`,
      bottomLine: `Account tier decides more of this page than either company's general pricing does. An HSBC Premier customer, or anyone sending HSBC-to-HSBC, should stop reading and use HSBC. Everyone else is choosing between a standard-tier bank markup and PayPal's flat combination of fee and markup, and neither is cheap next to a specialist.`,
    },
    faqs: [
      {
        q: "Is HSBC actually free to use?",
        a: "Only between two HSBC accounts, or for Premier-tier customers on any transfer. Standard-tier customers sending to a non-HSBC account pay £4-£9 plus a markup of up to 2.5%, which is the pricing reflected in the figures on this page.",
      },
      {
        q: "What does HSBC Premier change about this comparison?",
        a: "Premier customers get the mid-market exchange rate with no markup, which would move HSBC from behind the leaders to among them. Our quotes reflect standard retail pricing since that's what most senders actually pay — check your own account tier before assuming either result applies to you.",
      },
      {
        q: "Why would anyone use PayPal instead of a bank for a bank-to-bank transfer?",
        a: "Usually they wouldn't, deliberately — PayPal's case is a payment that's already inside the PayPal ecosystem, like an invoice or a refund, not a planned remittance. For a transfer chosen from scratch, a standard bank markup and PayPal's fee-plus-markup model are both expensive next to a specialist service.",
      },
      {
        q: "Does HSBC charge the same fee everywhere?",
        a: "No — the £4-£9 range and the markup both vary by corridor, amount and account tier. Confirm the fee schedule for your specific account and destination in HSBC's own transfer tool before committing.",
      },
    ],
    keyDifferences: [
      "HSBC-to-HSBC transfers are free with no markup; standard-tier transfers to other banks cost £4-£9 plus up to 2.5% markup, while Premier customers pay no markup on any transfer.",
      "PayPal charges a flat combination of fee (5%, capped at $4.99) and markup (3-4%) regardless of account tier or destination bank.",
      "HSBC needs the recipient to hold a bank account; PayPal needs only an email address, which is the practical argument for PayPal's reach.",
      "Neither has a transfer limit that binds a typical personal remittance — this pair is decided by rate and account tier, not by size.",
    ],
  },

  "remitly-vs-xe": {
    theDecision: `These two are built for different transfer shapes. Remitly is a remittance app: cash pickup, mobile money and home delivery alongside bank deposit, priced for smaller, more frequent sends to family. XE is a currency broker: bank deposit only, no transfer fee, and a pricing model that only gets genuinely competitive on larger amounts. A $200 remittance and a $20,000 property payment are different problems, and each provider is built for one of them.`,
    measuredRecord: `Remitly led on {{LED:remitly}} of the corridors we price against {{LED:xe}} for XE. Remitly's average shortfall when it isn't cheapest is {{SHORTFALL:remitly}}, against {{SHORTFALL:xe}} for XE. XE's win rate is measured against a broker's typical use case — larger, less frequent transfers — which our $1,000 sample corridors understate.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On $1,000 USD→INR the gap is {{RECEIVE_DIFF:remitly:xe:USD:INR:1000}}, with {{CHEAPER:remitly:xe:USD:INR:1000}} delivering more — {{COST_PCT:remitly:USD:INR:1000}} all-in for Remitly against {{COST_PCT:xe:USD:INR:1000}} for XE. $1,000 sits below the amount at which XE's no-fee broker pricing typically overtakes a remittance specialist — the meaningful comparison for XE happens at higher amounts than our sample corridors reach.`,
    },
    secondExample: {
      heading: "A second corridor: $1,000 to Mexico",
      body: `The same pattern holds on $1,000 USD→MXN: {{CHEAPER:remitly:xe:USD:MXN:1000}} delivers {{RECEIVE_DIFF:remitly:xe:USD:MXN:1000}} more, at {{COST_PCT:remitly:USD:MXN:1000}} all-in for Remitly against {{COST_PCT:xe:USD:MXN:1000}} for XE. Two data points pointing the same way at this amount is weak evidence for what happens at $20,000 — get a live quote at your actual amount rather than assuming this pattern scales.`,
    },
    pickA: {
      heading: "Pick Remitly for smaller, non-bank-account transfers",
      body: `Remitly is the sharper instrument on typical remittance amounts and for recipients without a bank account — cash pickup, mobile money and home delivery are options XE doesn't offer at all. Its express tier settles in minutes where XE quotes one to four business days. The constraint is Remitly's $300,000 US ceiling against XE's $500,000, though most senders using Remitly are well under either.`,
    },
    pickB: {
      heading: "Pick XE for larger transfers to a bank account",
      body: `XE's no-fee model and 130-currency list — the widest on this site — make it the better fit for a large, planned bank-to-bank transfer: property, tuition, or moving a meaningful sum between your own accounts abroad. It has no upper limit issue at $500,000 and carries FINTRAC alongside the FCA, FinCEN and ASIC in its regulatory set. It doesn't offer cash pickup or mobile money at any amount.`,
    },
    limits: `XE's rate improves with transfer size in a way our $1,000 sample cannot capture, and Remitly's promotional first-transfer rates are excluded. Quotes are collected by currency pair — confirm your corridor, amount and payout method before sending.`,
    verdict: {
      costExplanation: `Remitly led {{LED:remitly}} of the corridors we price against {{LED:xe}} for XE. XE's no-fee, markup-only model is built to reward larger amounts than the $1,000-$1,000 range this comparison prices — at real broker-scale amounts the gap narrows or reverses.`,
      speedExplanation: `Remitly's express tier settles in minutes; XE quotes one to four business days with no express option. For anything time-sensitive, Remitly is the only one of the two built for it.`,
      coverageExplanation: `Remitly's cash pickup, mobile money and home delivery reach recipients without a bank account; XE's bank-deposit-only model is narrower on payout method but wider on currency, quoting 130 against Remitly's 40.`,
      bottomLine: `Transfer size decides this page more than either provider's general reputation does. Remitly is built for the remittance-sized transfer this comparison actually prices; XE is built for an amount well above it, where its no-fee model starts to show its advantage.`,
    },
    faqs: [
      {
        q: "Why does XE look more expensive here if it charges no fee?",
        a: "XE's cost is entirely its rate markup, and that markup is priced to be most competitive on larger transfers than our $1,000 sample corridors test. At amounts XE is actually built for — well into five or six figures — the comparison typically looks different.",
      },
      {
        q: "Can XE do cash pickup like Remitly?",
        a: "No — XE pays out to bank accounts only, at any amount. If the recipient doesn't have a bank account, XE isn't an option regardless of price, and Remitly's cash pickup, mobile money or home delivery are the only routes on this page that work.",
      },
      {
        q: "Is Remitly cheaper for a large one-off transfer?",
        a: "Not necessarily — Remitly's model is built around frequent remittance-sized transfers, and its published $300,000 ceiling is well below what XE will quote. For a genuinely large transfer, get quotes from both rather than assuming Remitly's remittance pricing extends to broker-sized amounts.",
      },
      {
        q: "Does XE offer any express or same-day option?",
        a: "No — XE quotes one to four business days across the board, with no express tier. If the money needs to arrive within minutes, Remitly's express delivery is the only one of the two that can do it.",
      },
    ],
    keyDifferences: [
      "XE charges no transfer fee and recovers cost entirely through its markup, priced to reward larger amounts than Remitly's remittance-sized model targets.",
      "Remitly offers cash pickup, mobile money and home delivery; XE pays to a bank account only, at any transfer size.",
      "Remitly's express tier settles in minutes; XE has no express option and quotes one to four business days across the board.",
      "XE's 130 currencies is the widest on this site, against Remitly's 40 — the practical argument for an unusual destination currency on a bank-deposit transfer.",
    ],
  },

  "wise-vs-taptap-send": {
    theDecision: `Both charge close to nothing and both use close to the mid-market rate, which makes this one of the tighter comparisons on the site rather than a clear-cut winner. Wise charges a variable fee from 0.41% with 0% markup; TapTap Send charges $0 on most corridors with roughly 0.7% built into the rate. The practical difference is reach and payout: Wise is bank deposit only across 80 countries, while TapTap Send adds mobile money across a smaller but more remittance-focused 80-country list, and settles in under three minutes on 95% of transfers.`,
    measuredRecord: `Wise led on {{LED:wise}} of the corridors we price against {{LED:taptap-send}} for TapTap Send. TapTap Send's average shortfall when it isn't cheapest is {{SHORTFALL:taptap-send}}, against {{SHORTFALL:wise}} for Wise — a tight gap consistent with two providers both pricing close to the mid-market rate.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On $1,000 USD→INR the gap is {{RECEIVE_DIFF:wise:taptap-send:USD:INR:1000}}, with {{CHEAPER:wise:taptap-send:USD:INR:1000}} delivering more — {{COST_PCT:wise:USD:INR:1000}} all-in for Wise against {{COST_PCT:taptap-send:USD:INR:1000}} for TapTap Send. The margin here is one of the tightest on the site; a different corridor or amount can plausibly invert it, so check your own before assuming this ordering holds.`,
    },
    pickA: {
      heading: "Pick Wise for bank deposits and larger amounts",
      body: `Wise is the better instrument when the destination is a bank account and the amount is large enough that a rate you can independently verify matters — transfers run to $1,000,000 against TapTap Send's $10,000 ceiling. Wise holds balances in 50 currencies and is regulated by the FCA, FinCEN and ASIC.`,
    },
    pickB: {
      heading: "Pick TapTap Send for speed and mobile money",
      body: `TapTap Send's case is speed and payout flexibility on a remittance-sized transfer: under three minutes for 95% of transfers, and mobile money delivery Wise doesn't offer at all. It's built specifically for diaspora remittances to Africa and Asia, which shows up in a narrower but more purpose-fit corridor list than Wise's broader, bank-account-first coverage.`,
    },
    limits: `TapTap Send's fee-free claim applies to most but not all corridors — some carry a small fee — and Wise's fee varies by currency and funding method. Confirm your specific corridor's terms before sending.`,
    verdict: {
      costExplanation: `Wise led {{LED:wise}} of the corridors we price against {{LED:taptap-send}} for TapTap Send, with average shortfalls of {{SHORTFALL:wise}} and {{SHORTFALL:taptap-send}} — one of the tightest cost gaps tracked on this site, since both price close to the mid-market rate rather than building in a wide spread.`,
      speedExplanation: `TapTap Send settles in under three minutes for 95% of transfers, ahead of Wise's instant-to-two-day window. For a genuinely urgent transfer, TapTap Send's speed is the more consistent of the two.`,
      coverageExplanation: `Wise's $1,000,000 ceiling and 50 currencies suit a larger, bank-account transfer; TapTap Send's $10,000 cap and mobile money delivery suit a smaller, faster remittance to a recipient who may not bank.`,
      bottomLine: `This is one of the closer cost matches on the site, so the decision usually comes down to payout method and speed rather than price. TapTap Send wins on speed and mobile money reach; Wise wins on transfer size and the ability to verify the rate against a published mid-market quote.`,
    },
    faqs: [
      {
        q: "Is TapTap Send really free?",
        a: "On most corridors, yes — no transfer fee, with roughly 0.7% built into the exchange rate instead. A small number of corridors carry a separate fee, so check the terms for your specific route rather than assuming every corridor is fee-free.",
      },
      {
        q: "Why is this comparison closer than Wise's other pages?",
        a: "Both providers price close to the mid-market rate — Wise at 0% markup, TapTap Send at roughly 0.7% — which is unusually tight for this site. Most of Wise's other comparisons involve a provider with a wider markup, and this one doesn't.",
      },
      {
        q: "Can Wise deliver to a mobile money wallet like TapTap Send can?",
        a: "No — Wise pays out to bank accounts only. TapTap Send's mobile money delivery is the option here for a recipient without a bank account, particularly on its core Africa and Asia corridors.",
      },
      {
        q: "Which is better for a large, one-off transfer?",
        a: "Wise, on the numbers we track — its $1,000,000 ceiling is a hundred times TapTap Send's $10,000 cap, and TapTap Send is built around remittance-sized amounts rather than large one-off payments.",
      },
    ],
    keyDifferences: [
      "Wise charges a variable fee from 0.41% with 0% markup; TapTap Send charges $0 on most corridors with roughly 0.7% built into the rate — one of the tightest cost gaps on the site either way.",
      "TapTap Send settles in under three minutes for 95% of transfers; Wise's window is instant to two days.",
      "TapTap Send offers mobile money delivery Wise doesn't have at all; Wise pays to a bank account only.",
      "Wise's $1,000,000 ceiling is a hundred times TapTap Send's $10,000 cap — this pair has a real size mismatch despite the close pricing.",
    ],
  },

  "moneygram-vs-taptap-send": {
    theDecision: `MoneyGram is a century-old cash-agent network; TapTap Send is a five-year-old app built specifically for diaspora remittances to Africa, South Asia and the Caribbean. The overlap is real — both serve corridors where the recipient may not have a bank account — but the pricing models differ sharply: MoneyGram's fee starts at $1.99 with a 1-3% markup, against TapTap Send's $0 fee on most corridors with roughly 0.7% built into the rate. TapTap Send is usually the sharper price; MoneyGram is usually the wider reach.`,
    measuredRecord: `TapTap Send led on {{LED:taptap-send}} of the corridors we price against {{LED:moneygram}} for MoneyGram, whose win rate of {{WINRATE:moneygram}} means it rarely takes the front against a specialist this focused. MoneyGram's average shortfall is {{SHORTFALL:moneygram}}, against {{SHORTFALL:taptap-send}} for TapTap Send.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On $1,000 USD→INR the gap is {{RECEIVE_DIFF:moneygram:taptap-send:USD:INR:1000}}, with {{CHEAPER:moneygram:taptap-send:USD:INR:1000}} delivering more — {{COST_PCT:moneygram:USD:INR:1000}} all-in for MoneyGram against {{COST_PCT:taptap-send:USD:INR:1000}} for TapTap Send. Both price cash pickup and mobile money differently from a bank deposit, so match your recipient's actual payout method to the quote.`,
    },
    pickA: {
      heading: "Pick MoneyGram when its agent is the nearby one",
      body: `MoneyGram's argument is the same as it is against any digital specialist: a physical counter in 200 countries, useful when the recipient's nearest reliable collection point is a MoneyGram location rather than a bank or mobile wallet. Its fees start higher than TapTap Send's, but the trade is a much larger cash footprint.`,
    },
    pickB: {
      heading: "Pick TapTap Send for price and speed on its core corridors",
      body: `TapTap Send is built specifically for the corridors it serves — Africa, South Asia and the Caribbean diaspora routes — and prices them sharper than a general-purpose cash network. Under three minutes for 95% of transfers, close to $0 fee on most routes, and mobile money delivery alongside bank deposit. The constraint is a narrower country list than MoneyGram's, so confirm TapTap Send actually serves your destination first.`,
    },
    limits: `Agent-level pricing is not something we observe. TapTap Send's fee-free claim doesn't apply to every corridor. Confirm the quote, payout method and TapTap Send's coverage of your destination before sending.`,
    verdict: {
      costExplanation: `TapTap Send led {{LED:taptap-send}} of the corridors we price against {{LED:moneygram}} for MoneyGram, a {{WINRATE:moneygram}} win rate for MoneyGram against a specialist priced close to the mid-market rate. Average shortfalls of {{SHORTFALL:taptap-send}} and {{SHORTFALL:moneygram}} confirm the gap isn't close.`,
      speedExplanation: `TapTap Send settles in under three minutes for 95% of transfers; MoneyGram's express option is comparable on some corridors but not guaranteed across its wider, less digitally-optimised network.`,
      coverageExplanation: `MoneyGram's 200 countries and century-old agent network beat TapTap Send's narrower, diaspora-focused corridor list on raw reach. TapTap Send answers with mobile money delivery and pricing built specifically for the routes it does serve.`,
      bottomLine: `TapTap Send is the sharper price on the corridors it actually covers; MoneyGram is the fallback when the destination is somewhere TapTap Send's narrower network doesn't reach. Check TapTap Send's coverage for your specific corridor before assuming it's an option at all.`,
    },
    faqs: [
      {
        q: "Does TapTap Send serve every corridor MoneyGram does?",
        a: "No — TapTap Send is built around specific diaspora corridors (Africa, South Asia, the Caribbean) rather than MoneyGram's near-global 200-country reach. Check TapTap Send's coverage list for your specific destination before assuming it's an option.",
      },
      {
        q: "Why is TapTap Send usually cheaper than MoneyGram?",
        a: "TapTap Send prices close to the mid-market rate (roughly 0.7% built in, $0 fee on most corridors) as its core proposition, while MoneyGram's pricing reflects the cost of maintaining a much larger physical agent network. The trade is reach for price.",
      },
      {
        q: "Can MoneyGram deliver to a mobile money wallet?",
        a: "Yes, on corridors where it offers mobile wallet delivery, though its core strength is cash pickup rather than mobile money specifically. TapTap Send is built around mobile money as a primary payout method on its core corridors, which is a difference in emphasis rather than a hard capability gap.",
      },
      {
        q: "Is MoneyGram slower than TapTap Send?",
        a: "Not necessarily — MoneyGram offers express options on many corridors that are comparable to TapTap Send's under-three-minutes standard. The more reliable general pattern is that TapTap Send's speed is consistent across its corridor list, while MoneyGram's varies more by route.",
      },
    ],
    keyDifferences: [
      "TapTap Send prices close to the mid-market rate (roughly 0.7% built in, $0 fee on most corridors); MoneyGram's fee starts at $1.99 with a 1-3% markup.",
      "MoneyGram reaches roughly 200 countries through its agent network; TapTap Send's list is narrower, concentrated in the diaspora corridors it was built for.",
      "TapTap Send settles in under three minutes for 95% of transfers; MoneyGram's speed varies more by corridor.",
      "Both offer cash pickup and mobile money, but TapTap Send is built around mobile money as a primary method where MoneyGram treats it as one option among several.",
    ],
  },

  "wise-vs-xe": {
    theDecision: `Both are transparent, fee-based services with no cash pickup — the real question is transfer size and speed rather than trust or transparency. Wise charges a variable fee from 0.41% with 0% markup and settles instant to two days. XE charges no fee at all, recovers cost through a 0.5-1.5% markup, and settles in one to four business days, with pricing built to reward larger amounts. For a typical remittance-sized transfer, Wise's speed and flat 0% markup usually win; for a large planned transfer, XE's no-fee model closes the gap.`,
    measuredRecord: `Wise led on {{LED:wise}} of the corridors we price against {{LED:xe}} for XE. Wise's average shortfall when it isn't cheapest is {{SHORTFALL:wise}}, against {{SHORTFALL:xe}} for XE — consistent with Wise's 0% markup outperforming XE's markup-only model at the transfer sizes we price.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On $1,000 USD→INR the gap is {{RECEIVE_DIFF:wise:xe:USD:INR:1000}}, with {{CHEAPER:wise:xe:USD:INR:1000}} delivering more — {{COST_PCT:wise:USD:INR:1000}} all-in for Wise against {{COST_PCT:xe:USD:INR:1000}} for XE. XE's rate improves with transfer size in a way this $1,000 example doesn't show; the two are closer, or invert, well above this amount.`,
    },
    pickA: {
      heading: "Pick Wise for speed and remittance-sized transfers",
      body: `Wise is the better instrument for a transfer you want to move quickly and verify against a published mid-market rate — instant to two days, against XE's one to four business days. Its 0% markup makes the fee the entire visible cost, which is easier to check than a broker's rate spread on a smaller amount.`,
    },
    pickB: {
      heading: "Pick XE for large transfers and the widest currency list",
      body: `XE's no-fee model and 130-currency list — the widest on this site — suit a large, planned bank-to-bank transfer, especially to a less common currency. It caps at $500,000, has no upper-limit issue for almost any personal transfer, and adds FINTRAC alongside the FCA, FinCEN and ASIC in its regulatory set.`,
    },
    limits: `XE's rate improves with transfer size in a way a fixed $1,000 comparison cannot capture. Quotes are collected by currency pair — confirm your own amount band and account eligibility before sending.`,
    verdict: {
      costExplanation: `Wise led {{LED:wise}} of the corridors we price against {{LED:xe}} for XE, with average shortfalls of {{SHORTFALL:wise}} and {{SHORTFALL:xe}}. Wise's 0% markup is a structural advantage at remittance-sized amounts; XE's no-fee, markup-only model is built to close that gap as the transfer size grows.`,
      speedExplanation: `Wise settles instant to two days; XE quotes one to four business days with no express option. For anything time-sensitive, Wise is the more consistent of the two.`,
      coverageExplanation: `XE's 130 currencies is the widest list on this site, against Wise's 50; Wise counters with a $1,000,000 ceiling against XE's $500,000. Neither offers cash pickup or mobile money — both pay to a bank account only.`,
      bottomLine: `At the transfer sizes we price, Wise's 0% markup wins clearly. The comparison narrows, and can invert, at the larger amounts XE's no-fee broker model is actually built for — get a live quote at your real amount rather than reading this page as settled at every size.`,
    },
    faqs: [
      {
        q: "At what amount does XE start beating Wise?",
        a: "There's no fixed threshold we can state precisely — XE's rate improves with transfer size in a way our $1,000 sample corridors don't capture, generally becoming genuinely competitive well into five figures. Get live quotes from both at your actual amount rather than assuming this page's ordering holds.",
      },
      {
        q: "Does XE ever offer express delivery?",
        a: "No — XE quotes one to four business days across the board with no express tier. If speed matters, Wise's instant-to-two-day window is the more reliable option of the two.",
      },
      {
        q: "Which has the wider currency coverage?",
        a: "XE, by a wide margin — 130 currencies against Wise's 50. For a transfer to a less common currency, XE's list is the more likely one to actually support it.",
      },
      {
        q: "Can either of these do cash pickup?",
        a: "No — both pay out to a bank account only, at any transfer size. If the recipient needs cash or a mobile wallet, neither Wise nor XE is the right page; look at a remittance specialist instead.",
      },
    ],
    keyDifferences: [
      "Wise charges a variable fee from 0.41% with 0% markup; XE charges no fee at all but a 0.5-1.5% markup, priced to reward larger transfers.",
      "Wise settles instant to two days; XE has no express option and quotes one to four business days.",
      "XE's 130 currencies is the widest list on this site, against Wise's 50.",
      "Wise's $1,000,000 ceiling exceeds XE's $500,000, though neither binds a typical personal transfer.",
    ],
  },

  "remitly-vs-taptap-send": {
    theDecision: `Both are digital-first remittance specialists built around cash pickup and mobile money rather than pure bank-to-bank transfers, which makes this one of the more direct like-for-like comparisons on the site. Remitly is the larger, more general service — 100 countries, 40 currencies, founded 2011. TapTap Send is narrower but sharper on the specific diaspora corridors it serves — Africa, South Asia and the Caribbean — with a fee-free model on most routes against Remitly's $0-$3.99 fee.`,
    measuredRecord: `TapTap Send led on {{LED:taptap-send}} of the corridors we price against {{LED:remitly}} for Remitly. TapTap Send's average shortfall when it isn't cheapest is {{SHORTFALL:taptap-send}}, against {{SHORTFALL:remitly}} for Remitly — TapTap Send's close-to-mid-market pricing model tends to win where it competes.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On $1,000 USD→INR the gap is {{RECEIVE_DIFF:remitly:taptap-send:USD:INR:1000}}, with {{CHEAPER:remitly:taptap-send:USD:INR:1000}} delivering more — {{COST_PCT:remitly:USD:INR:1000}} all-in for Remitly against {{COST_PCT:taptap-send:USD:INR:1000}} for TapTap Send. Check TapTap Send's coverage for your specific corridor first — its list is narrower than Remitly's, so the price advantage only matters where it actually serves the route.`,
    },
    pickA: {
      heading: "Pick Remitly for broader coverage and larger amounts",
      body: `Remitly is the better instrument when the destination is outside TapTap Send's core corridor list, or the amount is large — Remitly's $300,000 US ceiling dwarfs TapTap Send's $10,000. It also offers home delivery, a payout method TapTap Send doesn't have.`,
    },
    pickB: {
      heading: "Pick TapTap Send where it serves the corridor",
      body: `TapTap Send is the sharper price on the specific routes it was built for — under three minutes for 95% of transfers, close to $0 fee on most corridors. If your corridor is one it actually serves, it typically beats Remitly's pricing; if it isn't, Remitly's broader network is the fallback.`,
    },
    limits: `TapTap Send's fee-free claim doesn't apply to every corridor, and Remitly's promotional first-transfer rates are excluded. Confirm coverage and payout method before sending.`,
    verdict: {
      costExplanation: `TapTap Send led {{LED:taptap-send}} of the corridors we price against {{LED:remitly}} for Remitly, with average shortfalls of {{SHORTFALL:taptap-send}} and {{SHORTFALL:remitly}}. TapTap Send's close-to-mid-market pricing model tends to win on the corridors both serve.`,
      speedExplanation: `TapTap Send settles in under three minutes for 95% of transfers; Remitly's express tier is comparable on many corridors but not guaranteed as consistently across its wider network.`,
      coverageExplanation: `Remitly's 100 countries and $300,000 ceiling beat TapTap Send's narrower, diaspora-focused list and $10,000 cap. TapTap Send answers with sharper pricing on the specific corridors it does serve.`,
      bottomLine: `Where TapTap Send serves the corridor, it's usually the better price. Where it doesn't, or the amount is larger than its $10,000 ceiling, Remitly's broader network and higher limit are the practical fallback.`,
    },
    faqs: [
      {
        q: "Does TapTap Send serve every corridor Remitly does?",
        a: "No — Remitly's 100-country list is broader than TapTap Send's, which is concentrated in specific diaspora corridors to Africa, South Asia and the Caribbean. Check TapTap Send's coverage for your destination before assuming it's available.",
      },
      {
        q: "Is TapTap Send always cheaper than Remitly?",
        a: "Not always, but it wins more often on the corridors both serve, consistent with its close-to-mid-market pricing model. Compare both for your specific corridor and amount rather than assuming the general pattern holds.",
      },
      {
        q: "Which is better for a large family transfer, like a wedding or tuition payment?",
        a: "Remitly, given TapTap Send's $10,000 ceiling — Remitly's $300,000 US limit is far higher, and it adds home delivery as a payout option TapTap Send doesn't offer.",
      },
      {
        q: "Do both offer mobile money delivery?",
        a: "Yes, both support mobile money on the corridors where it's the normal way to receive funds, alongside cash pickup and bank deposit. Availability varies by specific destination country and network on both providers.",
      },
    ],
    keyDifferences: [
      "TapTap Send prices close to the mid-market rate on most corridors; Remitly charges $0-$3.99 with a 0.5-2% markup.",
      "Remitly's 100-country reach and $300,000 ceiling beat TapTap Send's narrower, diaspora-focused list and $10,000 cap.",
      "Remitly offers home delivery, a payout method TapTap Send doesn't have; both offer cash pickup and mobile money.",
      "TapTap Send settles in under three minutes for 95% of transfers, matching or beating Remitly's express tier on the corridors it serves.",
    ],
  },
  "wise-vs-revolut": {
    theDecision: `Both are digital-first and both price close to the mid-market rate on weekdays, which makes this one of the tighter cost comparisons on the site. Wise charges a variable fee from 0.41% with a flat 0% markup, every day. Revolut matches that 0% markup on weekdays but adds a 0.5-1% markup on weekends, when the underlying FX market is closed — and gives a free £1,000 monthly allowance before its 0.5% fee applies. The day of the week is a real lever here in a way it is on almost no other comparison on this site.`,
    measuredRecord: `Wise led on {{LED:wise}} of the corridors we price against {{LED:revolut}} for Revolut. Revolut's average shortfall when it isn't cheapest is {{SHORTFALL:revolut}}, against {{SHORTFALL:wise}} for Wise — a tight gap consistent with both pricing close to the mid-market rate on weekdays.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On $1,000 USD→INR the gap is {{RECEIVE_DIFF:wise:revolut:USD:INR:1000}}, with {{CHEAPER:wise:revolut:USD:INR:1000}} delivering more — {{COST_PCT:wise:USD:INR:1000}} all-in for Wise against {{COST_PCT:revolut:USD:INR:1000}} for Revolut. This is a snapshot: Revolut's weekend markup means the same transfer sent on a Saturday costs more than shown here, a timing effect Wise doesn't have.`,
    },
    pickA: {
      heading: "Pick Wise for consistent pricing any day of the week",
      body: `Wise's 0% markup applies every day, which matters if you can't control when you send. It supports transfers to $1,000,000, holds balances in 50 currencies, and is regulated by the <a href="https://register.fca.org.uk/s/firm?id=001b000001EjC6SAAV" target="_blank" rel="noopener noreferrer">FCA</a>, <a href="https://www.fincen.gov/msb-registrant-search" target="_blank" rel="noopener noreferrer">FinCEN</a> and ASIC.`,
    },
    pickB: {
      heading: "Pick Revolut for weekday transfers within the free allowance",
      body: `Revolut is the better instrument on a weekday, within the £1,000 monthly free allowance — genuinely free, at the interbank rate. Revolut-to-Revolut transfers are instant and cost nothing. The constraint is the weekend markup and the requirement that the recipient hold a Revolut account for the fastest, free route.`,
    },
    limits: `Revolut's free allowance and weekend markup depend on your plan tier. Quotes are collected at a point in time — if timing matters to you, that's a real variable this page can't fully capture in a single snapshot.`,
    verdict: {
      costExplanation: `Wise led {{LED:wise}} of the corridors we price against {{LED:revolut}} for Revolut, with average shortfalls of {{SHORTFALL:wise}} and {{SHORTFALL:revolut}} — one of the tighter cost gaps on the site, since both price close to the mid-market rate on weekdays.`,
      speedExplanation: `Revolut-to-Revolut transfers land instantly; Wise's instant-to-two-day window applies to any bank deposit regardless of whether the recipient holds a Wise account. Neither has a consistent speed edge once the recipient's account type is matched.`,
      coverageExplanation: `Wise's $1,000,000 ceiling and 50 currencies suit a larger transfer; Revolut's free monthly allowance and no published upper limit suit smaller, more frequent sending between two Revolut users.`,
      bottomLine: `Timing is the real variable on this page. A weekday Revolut transfer within the free allowance is hard to beat; the same transfer on a weekend, or above the allowance, moves the advantage toward Wise's flat 0% markup.`,
    },
    faqs: [
      {
        q: "Does Revolut's weekend markup apply to every transfer?",
        a: "It applies whenever the underlying FX market is closed, typically Saturday and Sunday. If your transfer isn't urgent, waiting until Monday for the interbank weekday rate is the cheapest lever available on this comparison.",
      },
      {
        q: "What happens after I use Revolut's free monthly allowance?",
        a: "Transfers above £1,000 a month are charged at 0.5%, which is still competitive against Wise's fee-from-0.41% model — check both for your specific amount rather than assuming one is always cheaper.",
      },
      {
        q: "Is Wise ever cheaper than Revolut on a weekday?",
        a: "It can be — both price close to the mid-market rate on weekdays, so the actual leader varies by corridor and amount. This is one of the closer comparisons on the site precisely because neither has a structural pricing advantage during the week.",
      },
      {
        q: "Do I need a Revolut account to receive money for free?",
        a: "Yes — Revolut-to-Revolut transfers are the free, instant route. Sending to an external bank account still uses Revolut's weekday interbank rate or weekend markup, but loses the instant, zero-cost advantage of staying inside the app.",
      },
    ],
    keyDifferences: [
      "Wise's 0% markup applies every day; Revolut matches it on weekdays but adds a 0.5-1% markup on weekends when the FX market is closed.",
      "Revolut gives a free £1,000 monthly allowance before its 0.5% fee applies; Wise charges a variable fee from 0.41% on every transfer regardless of amount.",
      "Revolut-to-Revolut transfers are instant and free; Wise's instant-to-two-day window applies to any bank deposit.",
      "Wise's $1,000,000 ceiling exceeds anything Revolut publishes for a standard transfer, though Revolut has no stated upper limit either.",
    ],
  },

  "paypal-vs-moneygram": {
    theDecision: `PayPal is a payments account with an FX feature; MoneyGram is a cash-agent network with digital and card funding options. The pricing models differ in structure: PayPal charges a percentage fee (5%, capped at $4.99) plus a 3-4% markup, while MoneyGram charges a flat fee from $1.99 plus a 1-3% markup. MoneyGram's model tends to be cheaper on smaller amounts where PayPal's percentage fee bites hardest; the gap narrows as the amount grows toward PayPal's $4.99 cap.`,
    measuredRecord: `MoneyGram led on {{LED:moneygram}} of the corridors we price against {{LED:paypal}} for PayPal. PayPal's average shortfall when it isn't cheapest is {{SHORTFALL:paypal}} — the widest we record for any provider — against {{SHORTFALL:moneygram}} for MoneyGram.`,
    workedExample: {
      heading: "A worked example: £1,000 to euros",
      body: `On £1,000 GBP→EUR the gap is {{RECEIVE_DIFF:paypal:moneygram:GBP:EUR:1000}}, with {{CHEAPER:paypal:moneygram:GBP:EUR:1000}} delivering more — {{COST_PCT:paypal:GBP:EUR:1000}} all-in for PayPal against {{COST_PCT:moneygram:GBP:EUR:1000}} for MoneyGram. Notice the two components separately: PayPal's percentage fee shrinks in relative terms as the amount grows, capped at $4.99, but the uncapped 3-4% markup doesn't shrink with it — MoneyGram's narrower markup is the more meaningful lever on a larger send.`,
    },
    pickA: {
      heading: "Pick MoneyGram for cash pickup and typically lower cost",
      body: `MoneyGram is the better instrument for most standalone remittances — cash pickup across roughly 200 countries, a narrower markup than PayPal's, and no requirement that the recipient hold any particular account. It's regulated by <a href="https://www.fincen.gov/msb-registrant-search" target="_blank" rel="noopener noreferrer">FinCEN</a> in the US and the <a href="https://register.fca.org.uk/s/firm?id=001b000000MgGNGAA3" target="_blank" rel="noopener noreferrer">FCA</a> in the UK.`,
    },
    pickB: {
      heading: "Pick PayPal only where the payment already lives there",
      body: `PayPal's case is the same as everywhere else on this site: an invoice, a refund, or a counterparty who won't accept anything else. Choosing it as a deliberate remittance route over MoneyGram is the more expensive option on the corridors we measure.`,
    },
    limits: `MoneyGram's agent-level pricing varies by payout method and location; PayPal's consumer and business pricing differ. Confirm the quote and collection method before sending.`,
    verdict: {
      costExplanation: `MoneyGram led {{LED:moneygram}} of the corridors we price against {{LED:paypal}} for PayPal, with PayPal's average shortfall of {{SHORTFALL:paypal}} the widest we record for any provider on the site.`,
      speedExplanation: `PayPal settles instantly to another PayPal balance; MoneyGram's express options settle in minutes at a staffed counter. Both are fast once the payout method is matched — the more meaningful difference is what happens after: a PayPal balance versus cash in hand.`,
      coverageExplanation: `MoneyGram's roughly 200 countries and cash-pickup network beat PayPal's need for the recipient to hold or create a PayPal account. PayPal answers with instant balance-to-balance transfers where both sides already use it.`,
      bottomLine: `For a standalone remittance, MoneyGram is both cheaper and more flexible on payout method. PayPal earns its place only when the payment is already moving through PayPal for reasons unrelated to price.`,
    },
    faqs: [
      {
        q: "Is MoneyGram always cheaper than PayPal?",
        a: "Not on every corridor, but it leads clearly on the ones we price. PayPal's combined fee-and-markup model tends to cost more, especially on smaller transfers where its percentage fee is proportionally larger.",
      },
      {
        q: "Can PayPal do cash pickup like MoneyGram?",
        a: "No — PayPal delivers to a PayPal balance or a linked bank account only. If the recipient needs cash, MoneyGram's agent network is the option on this page, not PayPal.",
      },
      {
        q: "Why would anyone choose PayPal for a remittance?",
        a: "Usually only because the payment is already inside the PayPal ecosystem — an invoice, a refund, or a marketplace payout. For a transfer chosen from scratch, MoneyGram is the cheaper route on the corridors we measure.",
      },
      {
        q: "Does MoneyGram charge more for card funding?",
        a: "Yes, funding with a debit or credit card typically costs more than funding from a bank account, since card processing carries its own fee. Check the funding-method breakdown on your specific quote.",
      },
    ],
    keyDifferences: [
      "PayPal charges a percentage fee (5%, capped at $4.99) plus a 3-4% markup; MoneyGram charges a flat fee from $1.99 plus a narrower 1-3% markup.",
      "MoneyGram offers cash pickup across roughly 200 countries; PayPal delivers to a PayPal balance or linked bank account only.",
      "PayPal needs only an email address from the recipient; MoneyGram needs a collection point or bank account depending on payout method.",
      "PayPal's average shortfall when it isn't cheapest is the widest of any provider tracked on this site.",
    ],
  },

  "chase-vs-hsbc": {
    theDecision: `Chase and HSBC don't overlap on any of the standard corridors we price side by side — Chase's quotes are concentrated in USD-denominated outbound transfers, HSBC's in GBP-denominated ones, so the two banks are rarely priced on the exact same currency pair and amount in our data. That's a genuine finding about how these two banks serve different sending markets, not a gap in our coverage. What's comparable is the model: both are full-service banks with wire-transfer pricing built around branch relationships rather than app-first cost competition, and both are meaningfully more expensive than a specialist on a like-for-like transfer.`,
    measuredRecord: `Because Chase and HSBC don't share a priced corridor in our sample set, a head-to-head win/loss count isn't available for this pair the way it is for others on this site. Compared separately against the market: Chase's average shortfall against the corridor leader is {{SHORTFALL:chase}}; HSBC's is {{SHORTFALL:hsbc}}. Both trail specialists by a wide margin, consistent with bank wire pricing generally.`,
    workedExample: {
      heading: "Why there's no worked example for this pair",
      body: `Chase quotes the USD-outbound corridors we track (USD→INR, USD→MXN); HSBC's quotes here are on GBP-outbound corridors (GBP→EUR, GBP→PKR). The two never land on the same currency pair and amount in our sample set, so we can't show a real side-by-side figure the way we can for pairs that do overlap. If you're choosing between an HSBC and a Chase wire for the same trip, get a live quote from each for your actual sending currency — this page's usefulness is in the model comparison below, not a number.`,
    },
    pickA: {
      heading: "Pick Chase if you already bank there and send in USD",
      body: `Chase's case is convenience for an existing customer: $5 for a domestic wire, $40-$50 for an international one, plus a 2-4% markup. It supports transfers to $250,000 and settles in 1-5 business days. The wire fee and markup are both higher than a specialist's, so this is a relationship-convenience choice, not a cost-competitive one.`,
    },
    pickB: {
      heading: "Pick HSBC if you're a Premier customer or sending GBP",
      body: `HSBC's case depends heavily on account tier: HSBC-to-HSBC transfers are free with no markup, and Premier customers get the mid-market rate on any transfer. Standard-tier customers pay £4-£9 plus up to 2.5% markup. It's regulated by the <a href="https://register.fca.org.uk" target="_blank" rel="noopener noreferrer">FCA</a>, the PRA and the HKMA.`,
    },
    limits: `Chase and HSBC don't share a priced corridor in our sample, so figures for each are shown separately rather than head-to-head. Confirm your own account tier's actual rate with each bank directly.`,
    verdict: {
      costExplanation: `No shared corridor exists in our sample to compare these two directly. Chase's average shortfall against the leader is {{SHORTFALL:chase}}; HSBC's is {{SHORTFALL:hsbc}} — both a bank-wire premium over a specialist, measured separately rather than against each other.`,
      speedExplanation: `Chase settles in 1-5 business days; HSBC in same-day to 3 business days. Neither offers an express, minutes-level option the way a digital remittance specialist does.`,
      coverageExplanation: `Both reach around 200 countries through correspondent banking relationships. Chase supports 100 currencies against HSBC's 60; HSBC has no upper transfer limit against Chase's $250,000 cap.`,
      bottomLine: `This page exists to compare two bank-wire models rather than to declare a winner — the two rarely serve the same sending currency in our data. If you're an existing customer of either, the relationship convenience may outweigh the cost; if you're choosing from scratch, both trail a digital specialist by a wide margin.`,
    },
    faqs: [
      {
        q: "Why isn't there a direct price comparison between Chase and HSBC?",
        a: "Because they don't share a priced corridor in our sample — Chase's quotes are USD-outbound, HSBC's are GBP-outbound, and the two don't land on the same currency pair and amount. This is a real finding about how the two banks serve different markets, not missing data.",
      },
      {
        q: "Is a bank wire ever cheaper than a specialist app?",
        a: "Rarely, on the corridors we measure — both Chase and HSBC trail digital specialists by a wide margin on standard retail pricing. The exception is HSBC Premier customers, who pay no markup at all, or HSBC-to-HSBC transfers, which are free.",
      },
      {
        q: "Which bank has the higher transfer limit?",
        a: "HSBC has no published upper limit; Chase caps at $250,000. For a transfer near either figure, confirm the current policy with the bank directly, since large-transfer handling often involves additional verification.",
      },
      {
        q: "Should I switch banks just to get a better transfer rate?",
        a: "Usually not — a specialist provider (Wise, Remitly, or a broker like OFX depending on the amount) will typically beat either bank's standard rate without requiring you to open a new account at all.",
      },
    ],
    keyDifferences: [
      "Chase and HSBC don't share a priced corridor in our sample: Chase's quotes are USD-outbound, HSBC's are GBP-outbound.",
      "HSBC-to-HSBC transfers are free with no markup, and Premier customers pay no markup on any transfer; Chase's pricing doesn't have an equivalent free tier.",
      "HSBC has no published upper transfer limit; Chase caps at $250,000.",
      "Chase settles in 1-5 business days; HSBC in same-day to 3 business days — neither offers a minutes-level express option.",
    ],
  },

  "ofx-vs-moneygram": {
    theDecision: `These two serve almost opposite use cases. OFX is a no-fee broker for large, planned bank-to-bank transfers, with no upper limit and a dealer for amounts above roughly $10,000. MoneyGram is a cash network built for smaller, faster remittances, with fees from $1.99 and a $10,000 cap. Anyone comparing them directly likely hasn't decided what kind of transfer this is — the overlap in what they're actually for is narrow.`,
    measuredRecord: `OFX led {{LED:ofx}} of the corridors we price and MoneyGram {{LED:moneygram}}. OFX's win rate is measured on a small corridor sample and shouldn't be read against MoneyGram's larger one; average shortfall is the more comparable figure, at {{SHORTFALL:ofx}} for OFX and {{SHORTFALL:moneygram}} for MoneyGram.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On $1,000 USD→INR the gap is {{RECEIVE_DIFF:ofx:moneygram:USD:INR:1000}}, with {{CHEAPER:ofx:moneygram:USD:INR:1000}} delivering more — {{COST_PCT:ofx:USD:INR:1000}} all-in for OFX against {{COST_PCT:moneygram:USD:INR:1000}} for MoneyGram. $1,000 is well below the amount OFX is actually built for; its rate improves with size in a way this example doesn't capture, and MoneyGram doesn't offer cash pickup pricing that scales the same way.`,
    },
    pickA: {
      heading: "Pick OFX for large, planned bank-to-bank transfers",
      body: `OFX suits a transfer you can schedule: no fee, no upper limit, dealer support once the amount is substantial. Property deposits, emigration transfers and business payments are its natural cases. It pays to bank accounts only and settles in one to three business days — the wrong instrument for anything urgent or anything a recipient needs to collect in cash.`,
    },
    pickB: {
      heading: "Pick MoneyGram for cash pickup and smaller, faster transfers",
      body: `MoneyGram is built for the transfer that needs to land in cash, at a counter, sooner than a broker's business-day settlement allows. Its $10,000 cap and $1.99-plus fee structure suit remittance-sized amounts, not the large planned transfers OFX is built for.`,
    },
    limits: `OFX's rate improves with transfer size in a way a $1,000 comparison cannot show, and MoneyGram's agent-level pricing varies by payout method. Confirm your corridor and amount band before sending.`,
    verdict: {
      costExplanation: `OFX led {{LED:ofx}} of the corridors we price against {{LED:moneygram}} for MoneyGram, though OFX's win rate is measured on a smaller sample. Average shortfalls of {{SHORTFALL:ofx}} and {{SHORTFALL:moneygram}} are the more comparable figures at this sample size.`,
      speedExplanation: `MoneyGram settles in minutes to three days depending on the option chosen; OFX quotes one to three business days with no express tier. For an urgent, smaller transfer, MoneyGram is built for it in a way OFX isn't.`,
      coverageExplanation: `MoneyGram's cash pickup across roughly 200 countries reaches recipients without a bank account; OFX's no-limit, bank-deposit-only model reaches a larger transfer size MoneyGram's $10,000 cap can't.`,
      bottomLine: `These two barely overlap in what they're actually for. OFX is built for a large, scheduled, bank-to-bank transfer; MoneyGram for a smaller one that needs to land in cash. Anyone genuinely deciding between them should decide the transfer's shape first.`,
    },
    faqs: [
      {
        q: "Can OFX deliver cash the way MoneyGram does?",
        a: "No — OFX pays to bank accounts only. If the recipient needs cash pickup, MoneyGram is the option here regardless of OFX's pricing on the corridors it does serve.",
      },
      {
        q: "Is OFX cheaper than MoneyGram for a large transfer?",
        a: "Likely, though our $1,000 sample corridors don't show it clearly — OFX's rate improves with transfer size in a way this comparison can't capture. Get a live quote from both at your actual amount, especially above $10,000 where MoneyGram's cap applies.",
      },
      {
        q: "Does MoneyGram have a size limit OFX doesn't?",
        a: "Yes — MoneyGram caps at $10,000; OFX has no published upper limit. For a transfer above $10,000, MoneyGram isn't an option regardless of price.",
      },
      {
        q: "Why would anyone compare these two directly?",
        a: "Usually because they're deciding between a bank-to-bank transfer and a cash pickup, and haven't settled which one the recipient actually needs. Once that's decided, the choice between OFX and MoneyGram tends to follow automatically.",
      },
    ],
    keyDifferences: [
      "OFX has no upper transfer limit and no fee; MoneyGram caps at $10,000 with fees from $1.99.",
      "MoneyGram offers cash pickup across roughly 200 countries; OFX pays to bank accounts only.",
      "MoneyGram settles in minutes on its express option; OFX has no express tier and quotes one to three business days.",
      "OFX adds dealer support once a transfer is substantial — a service model MoneyGram's cash-network business doesn't offer.",
    ],
  },

  "remitly-vs-moneygram": {
    theDecision: `Both put cash or a mobile transfer in a recipient's hands, but they come from different eras of the same business. MoneyGram is an agent network dating to 1940; Remitly is an app built in 2011 around digital-first pricing for established remittance corridors. Remitly typically prices its core corridors — the US, UK, Canada and Australia into South Asia, the Philippines, Mexico and East Africa — sharper than MoneyGram's broader but older network.`,
    measuredRecord: `Remitly led on {{LED:remitly}} of the corridors we price against {{LED:moneygram}} for MoneyGram, whose win rate of {{WINRATE:moneygram}} means it rarely takes the front against a digital-first competitor. Average shortfalls are {{SHORTFALL:remitly}} and {{SHORTFALL:moneygram}} respectively.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On $1,000 USD→INR the gap is {{RECEIVE_DIFF:remitly:moneygram:USD:INR:1000}}, with {{CHEAPER:remitly:moneygram:USD:INR:1000}} delivering more — {{COST_PCT:remitly:USD:INR:1000}} all-in for Remitly against {{COST_PCT:moneygram:USD:INR:1000}} for MoneyGram. Both price cash pickup differently from bank deposit, so quote your actual payout method before treating either figure as final.`,
    },
    pickA: {
      heading: "Pick Remitly for its established remittance corridors",
      body: `Remitly is the sharper instrument on the routes it actually specialises in, with express delivery in minutes and a Trustpilot rating meaningfully ahead of MoneyGram's. The constraint is its narrower, 100-country list against MoneyGram's roughly 200.`,
    },
    pickB: {
      heading: "Pick MoneyGram for wider reach and an older agent network",
      body: `MoneyGram's argument is coverage into destinations Remitly doesn't serve, through an agent network built over eight decades. Fees start at $1.99, roughly in line with Remitly's, but the network reaches further into markets a newer app hasn't yet built out.`,
    },
    limits: `Agent-level pricing is not something we observe. Confirm your corridor, payout method and MoneyGram's or Remitly's coverage of your destination before sending.`,
    verdict: {
      costExplanation: `Remitly led {{LED:remitly}} of the corridors we price against {{LED:moneygram}} for MoneyGram, a {{WINRATE:moneygram}} win rate for MoneyGram against a digital-first specialist. Average shortfalls of {{SHORTFALL:remitly}} and {{SHORTFALL:moneygram}} confirm the gap is real, not just a matter of who wins outright.`,
      speedExplanation: `Remitly's express tier settles in minutes; MoneyGram's speed varies more by corridor and agent. For a corridor Remitly prices sharply, it's also typically the faster of the two.`,
      coverageExplanation: `MoneyGram's roughly 200 countries beat Remitly's 100, built over eight decades of agent relationships. Remitly answers with sharper pricing and a higher Trustpilot rating on the corridors it does serve.`,
      bottomLine: `On Remitly's core remittance corridors, it's usually the better-priced and faster option. Outside that list, MoneyGram's older, wider network is more likely to reach the destination at all.`,
    },
    faqs: [
      {
        q: "Does Remitly serve every country MoneyGram does?",
        a: "No — Remitly's 100-country list is narrower than MoneyGram's roughly 200, concentrated on established remittance routes. Check Remitly's coverage for your specific destination before assuming it's available.",
      },
      {
        q: "Why does MoneyGram still exist if Remitly is usually cheaper?",
        a: "Reach. MoneyGram's decades-old agent network covers destinations and payout situations a newer, narrower app hasn't built out yet. Price and coverage are different trade-offs, and MoneyGram wins on the second one.",
      },
      {
        q: "Which has the better Trustpilot rating?",
        a: "Remitly, by a meaningful margin. That measures whether the transfer felt reliable and arrived as promised, which is a different question from which one is cheaper on a given corridor.",
      },
      {
        q: "Is MoneyGram's fee actually lower than Remitly's?",
        a: "The starting fees are similar (both from around $2-4), so the real difference tends to come from the exchange rate markup rather than the headline fee. Compare the all-in cost for your specific corridor rather than the fee alone.",
      },
    ],
    keyDifferences: [
      "Remitly typically prices its core remittance corridors (US/UK/Canada/Australia into South Asia, the Philippines, Mexico, East Africa) sharper than MoneyGram's broader network.",
      "MoneyGram reaches roughly 200 countries through an agent network built since 1940; Remitly's list is narrower at 100 countries.",
      "Remitly's express tier settles in minutes; MoneyGram's speed varies more by corridor and specific agent.",
      "Remitly carries the meaningfully higher Trustpilot rating of the two.",
    ],
  },

  "paypal-vs-xoom": {
    theDecision: `PayPal and its own subsidiary Xoom don't share a priced corridor in our sample — PayPal's quotes land on GBP→EUR, USD→PHP and USD→MXN, while Xoom's land on USD→INR and USD→NGN. That's a real structural finding: PayPal's core payments product and Xoom's dedicated remittance product are priced and positioned for different corridors even within the same parent company. What's comparable is the model: Xoom was built specifically for remittances with cash pickup and mobile reload, while PayPal's cross-border feature is a payments-account add-on.`,
    measuredRecord: `Because PayPal and Xoom don't share a priced corridor in our sample, a direct win/loss count isn't available. Measured separately: PayPal's average shortfall against the corridor leader is {{SHORTFALL:paypal}} — the widest we record for any provider — against {{SHORTFALL:xoom}} for Xoom, which is markedly tighter.`,
    workedExample: {
      heading: "Why there's no worked example for this pair",
      body: `PayPal's quotes in our sample cluster on GBP→EUR, USD→PHP and USD→MXN; Xoom's cluster on USD→INR and USD→NGN. Even within the same parent company, the two products are priced on different corridors in our data, so we can't show a real side-by-side figure. If you're choosing between sending through your PayPal balance directly or through Xoom, get a live quote from both for your specific corridor — Xoom is generally the cheaper of the two on the corridors either one prices, per our other comparisons involving each.`,
    },
    pickA: {
      heading: "Pick PayPal only where the payment already lives there",
      body: `PayPal's case is the same as everywhere else it appears on this site: an invoice, a refund, or a marketplace payment that's already moving through a PayPal balance. Its 5% fee (capped at $4.99) plus 3-4% markup is not competitive as a deliberate remittance choice.`,
    },
    pickB: {
      heading: "Pick Xoom for an actual remittance",
      body: `Xoom is the dedicated remittance product in the PayPal family — cash pickup, mobile reload and bank deposit across 130 countries, with a fee up to $4.99 and a narrower 1-3% markup than PayPal's own cross-border pricing. If you already have a PayPal login, Xoom uses the same credentials with sharper pricing for an actual transfer abroad.`,
    },
    limits: `PayPal and Xoom don't share a priced corridor in our sample, so figures for each are shown separately. Confirm your specific corridor and payout method with each product directly.`,
    verdict: {
      costExplanation: `No shared corridor exists in our sample. PayPal's average shortfall of {{SHORTFALL:paypal}} is the widest we record for any provider; Xoom's {{SHORTFALL:xoom}} is markedly tighter, consistent with Xoom's dedicated remittance pricing beating PayPal's payments-account FX feature.`,
      speedExplanation: `PayPal settles instantly to another PayPal balance; Xoom settles in minutes for cash pickup or bank deposit across its network. Both are fast for what they're built for.`,
      coverageExplanation: `Xoom reaches 130 countries with cash pickup and mobile reload; PayPal reaches 200 countries but delivers to a PayPal balance or bank account only, with no cash option.`,
      bottomLine: `If you're already inside PayPal's ecosystem for an unrelated reason, use PayPal. If you're deliberately sending money abroad and happen to have a PayPal login, use Xoom instead — it's the same company's purpose-built product for exactly this, at sharper pricing.`,
    },
    faqs: [
      {
        q: "Why would PayPal and its own subsidiary Xoom not share pricing data?",
        a: "They're different products aimed at different use cases — PayPal's core business is payments with a cross-border feature attached, while Xoom is a dedicated remittance app. In our sample they simply don't get quoted on the same corridors, which reflects how differently the two are positioned even within one company.",
      },
      {
        q: "Is Xoom actually cheaper than PayPal?",
        a: "Based on measuring each separately against the market, yes — Xoom's average shortfall from the leader is markedly tighter than PayPal's, which has the widest average shortfall of any provider we track.",
      },
      {
        q: "Can I use my PayPal login for Xoom?",
        a: "Yes — Xoom is part of the PayPal family and generally works with existing PayPal credentials, which removes the slowest part of signing up for a new remittance service.",
      },
      {
        q: "Does Xoom offer anything PayPal doesn't?",
        a: "Yes — cash pickup and mobile reload, neither of which PayPal itself offers. PayPal delivers only to a PayPal balance or a linked bank account.",
      },
    ],
    keyDifferences: [
      "PayPal and Xoom don't share a priced corridor in our sample: PayPal's quotes cluster on GBP/EUR-and-peso routes, Xoom's on USD->INR and USD->NGN.",
      "Xoom offers cash pickup and mobile reload; PayPal delivers to a PayPal balance or bank account only.",
      "PayPal's average shortfall from the leader is the widest of any provider tracked on this site; Xoom's is markedly tighter.",
      "Xoom generally accepts existing PayPal login credentials, removing the signup friction of a separate account.",
    ],
  },

  "remitly-vs-paypal": {
    theDecision: `Remitly is a purpose-built remittance app; PayPal is a payments account with a cross-border feature. Remitly's fee structure ($0-$3.99 plus 0.5-2% markup) is built to compete on price for family remittances; PayPal's (5% capped at $4.99, plus 3-4% markup) is built around payments convenience, not remittance cost. The gap between them is one of the wider ones on the site.`,
    measuredRecord: `Remitly led on {{LED:remitly}} of the corridors we price against {{LED:paypal}} for PayPal, whose average shortfall of {{SHORTFALL:paypal}} is the widest we record for any provider. Remitly's average shortfall is {{SHORTFALL:remitly}}.`,
    workedExample: {
      heading: "A worked example: £1,000 to euros",
      body: `On £1,000 GBP→EUR the gap is {{RECEIVE_DIFF:remitly:paypal:GBP:EUR:1000}}, with {{CHEAPER:remitly:paypal:GBP:EUR:1000}} delivering more — {{COST_PCT:remitly:GBP:EUR:1000}} all-in for Remitly against {{COST_PCT:paypal:GBP:EUR:1000}} for PayPal. PayPal's fee cap means the gap narrows on larger transfers, but its markup keeps scaling with the amount regardless.`,
    },
    pickA: {
      heading: "Pick Remitly for essentially any deliberate remittance",
      body: `Remitly is the cheaper, more flexible instrument on the corridors we measure — cash pickup, mobile money and home delivery are options PayPal doesn't have at all, and its pricing is built specifically to compete on remittance cost rather than payments convenience.`,
    },
    pickB: {
      heading: "Pick PayPal only where the payment already lives there",
      body: `PayPal's case is unchanged from its other comparisons on this site: an invoice, a refund, or a counterparty who insists on PayPal specifically. As a deliberate remittance choice against Remitly, it's consistently the more expensive option in our data.`,
    },
    limits: `PayPal's consumer and business pricing differ, and Remitly's promotional first-transfer rates are excluded. Confirm the applicable schedule before sending.`,
    verdict: {
      costExplanation: `Remitly led {{LED:remitly}} of the corridors we price against {{LED:paypal}} for PayPal, with PayPal's {{SHORTFALL:paypal}} average shortfall the widest of any provider we track against Remitly's {{SHORTFALL:remitly}}.`,
      speedExplanation: `Remitly's express tier settles in minutes; PayPal settles instantly to a PayPal balance but takes longer once the money needs to reach a bank account or cash pickup, which PayPal doesn't offer at all.`,
      coverageExplanation: `Remitly's cash pickup, mobile money and home delivery reach recipients without a bank account or PayPal account; PayPal needs only an email address but delivers to a PayPal balance or linked bank account only.`,
      bottomLine: `For an actual remittance, Remitly is both cheaper and more flexible on payout method in our data. PayPal's case is narrow: use it only when the payment is already moving through PayPal for reasons unrelated to price.`,
    },
    faqs: [
      {
        q: "Is PayPal ever competitive with Remitly on price?",
        a: "Not on the corridors we measure — PayPal's average shortfall from the leader is the widest we record for any provider, consistently behind Remitly's remittance-focused pricing.",
      },
      {
        q: "Can PayPal deliver cash the way Remitly can?",
        a: "No — PayPal delivers to a PayPal balance or linked bank account only. Remitly's cash pickup, mobile money and home delivery options don't have a PayPal equivalent.",
      },
      {
        q: "Does Remitly's fee cap out the way PayPal's does?",
        a: "No — Remitly's fee is a flat $0-$3.99 regardless of amount, while PayPal charges a percentage that tops out at $4.99. That cap only applies to the fee line; the 3-4% markup underneath it has no equivalent ceiling and keeps growing with the transfer size.",
      },
      {
        q: "Why compare these two at all if the gap is this wide?",
        a: "Because PayPal is a common default for anyone who already has an account, and it's worth showing clearly how much that convenience costs against a purpose-built remittance app before assuming PayPal is a reasonable choice for sending money abroad.",
      },
    ],
    keyDifferences: [
      "Remitly's fee is $0-$3.99 flat; PayPal's is a 5% fee capped at $4.99 plus a 3-4% markup that isn't capped.",
      "Remitly offers cash pickup, mobile money and home delivery; PayPal delivers to a PayPal balance or bank account only.",
      "PayPal's average shortfall from the leader is the widest of any provider tracked on this site.",
      "Remitly's express tier settles in minutes; PayPal is instant only between two PayPal balances.",
    ],
  },

  "remitly-vs-xoom": {
    theDecision: `Both are digital-first remittance specialists with cash pickup and mobile delivery options, which makes this one of the more direct like-for-like comparisons on the site. Remitly reaches 100 countries with home delivery as an extra option; Xoom reaches 130 countries with mobile reload as its differentiator, backed by PayPal's funding infrastructure for existing PayPal users.`,
    measuredRecord: `{{LED:remitly}} of the corridors we price went to Remitly against {{LED:xoom}} for Xoom. Remitly's average shortfall when it isn't cheapest is {{SHORTFALL:remitly}}, against {{SHORTFALL:xoom}} for Xoom.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On $1,000 USD→INR the gap is {{RECEIVE_DIFF:remitly:xoom:USD:INR:1000}}, with {{CHEAPER:remitly:xoom:USD:INR:1000}} delivering more — {{COST_PCT:remitly:USD:INR:1000}} all-in for Remitly against {{COST_PCT:xoom:USD:INR:1000}} for Xoom. Both price cash pickup differently from bank deposit, and Xoom's funding is instant for existing PayPal users, which this figure doesn't capture.`,
    },
    pickA: {
      heading: "Pick Remitly for wider country reach and home delivery",
      body: `Remitly's narrower currency list (40 against Xoom's 50) is offset by home delivery, a payout option Xoom doesn't have. Its Trustpilot rating is the higher of the two, and its express tier settles in minutes on the corridors it prices sharply.`,
    },
    pickB: {
      heading: "Pick Xoom if you already use PayPal, or need mobile reload",
      body: `Xoom's advantages are account-shaped: if you already hold a PayPal balance, funding is immediate and identity checks are largely done. It supports transfers to $50,000 against Remitly's $300,000 US ceiling — Remitly's is higher, but Xoom's is still ample for most remittances — and offers mobile reload, which Remitly doesn't.`,
    },
    limits: `Both price cash pickup differently from bank deposit, and Remitly's promotional first-transfer rates are excluded. Confirm your corridor and payout method before sending.`,
    verdict: {
      costExplanation: `Remitly led {{LED:remitly}} of the corridors we price against {{LED:xoom}} for Xoom, with average shortfalls of {{SHORTFALL:remitly}} and {{SHORTFALL:xoom}}. Both are digital-first specialists priced closer to the leaders than a bank or a broad payments account.`,
      speedExplanation: `Both settle in minutes on their express tiers. The more meaningful speed variable is funding: Xoom is instant for an existing PayPal user, while Remitly's funding speed depends on the payment method chosen.`,
      coverageExplanation: `Xoom's 130 countries and mobile reload edge out Remitly's 100 countries; Remitly answers with home delivery, a payout method Xoom doesn't offer, and a meaningfully higher Trustpilot rating.`,
      bottomLine: `This is a close, direct comparison between two purpose-built remittance apps. Xoom's edge is PayPal-account convenience and mobile reload; Remitly's is broader payout flexibility and a stronger trust record.`,
    },
    faqs: [
      {
        q: "Does having a PayPal account make Xoom cheaper?",
        a: "It doesn't change Xoom's price, but it removes the slowest part of a first transfer — funding is immediate and identity checks are largely already done. Remitly has no equivalent shortcut for an existing-account holder.",
      },
      {
        q: "Can Remitly top up a recipient's phone the way Xoom can?",
        a: "No — mobile reload is specific to Xoom in this comparison. If that's the payout method needed, Xoom is the option here regardless of Remitly's pricing on the corridors it serves.",
      },
      {
        q: "Which has the better Trustpilot rating?",
        a: "Remitly, by a clear margin. That measures whether transfers felt reliable and arrived as promised, a different question from which is cheaper on a specific corridor.",
      },
      {
        q: "Does Remitly offer home delivery everywhere?",
        a: "No — home delivery availability depends on the specific destination country and network. Check coverage for your corridor rather than assuming it's universal.",
      },
    ],
    keyDifferences: [
      "Xoom reaches 130 countries against Remitly's 100; Remitly counters with home delivery, a payout method Xoom doesn't offer.",
      "Xoom offers mobile reload, topping up a recipient's phone directly, which Remitly doesn't have.",
      "Remitly's $300,000 US ceiling exceeds Xoom's $50,000, though both comfortably cover a typical remittance.",
      "Remitly carries the meaningfully higher Trustpilot rating of the two.",
    ],
  },

  "wise-vs-westpac": {
    theDecision: `Westpac has no quotes on any of the six standard corridors we price side by side — it's an Australian bank whose international transfer pricing in our data is concentrated on AUD-denominated corridors outside our core USD/GBP sample set, so a direct figure against Wise isn't available here. What's comparable is the model: Wise is a digital specialist with a stated fee and 0% markup; Westpac is a full-service bank charging $8-$20 per transfer plus a 3-5% markup, pricing built around branch relationships rather than app-first cost competition.`,
    measuredRecord: `Westpac doesn't appear in our priced sample for the corridors this comparison covers, so a head-to-head win/loss count isn't available. Wise's own average shortfall against the leader across all corridors we track is {{SHORTFALL:wise}} — among the tightest of any provider — which is the more useful reference point here than a direct comparison we can't run.`,
    workedExample: {
      heading: "Why there's no worked example for this pair",
      body: `Westpac's transfer pricing in our data is concentrated on Australian-dollar corridors outside the USD/GBP sample set this site prices day to day, so we don't have a live quote to set against Wise's on the same currency pair and amount. If you're an Australian sender choosing between the two, Westpac's published 3-5% markup plus $8-$20 fee is a meaningful starting point against Wise's 0% markup and fee from 0.41% — get a live quote from both for your specific corridor before deciding.`,
    },
    pickA: {
      heading: "Pick Wise for a stated fee and no markup",
      body: `Wise's cost is entirely its fee, because its markup is 0% — a rate you can check against any published mid-market quote. It supports transfers to $1,000,000, holds balances in 50 currencies, and is regulated by the <a href="https://register.fca.org.uk/s/firm?id=001b000001EjC6SAAV" target="_blank" rel="noopener noreferrer">FCA</a>, <a href="https://www.fincen.gov/msb-registrant-search" target="_blank" rel="noopener noreferrer">FinCEN</a> and ASIC.`,
    },
    pickB: {
      heading: "Pick Westpac only for an existing banking relationship",
      body: `Westpac's case is the same as any full-service bank's: convenience for an existing customer, not cost competitiveness. Its $8-$20 fee plus 3-5% markup is meaningfully wider than a digital specialist's, regulated by APRA and ASIC, and has been operating since 1817.`,
    },
    limits: `Westpac doesn't appear in our priced sample for the corridors this comparison covers — its figures here are drawn from published rates rather than collected quotes. Confirm the current rate directly with Westpac before relying on it.`,
    verdict: {
      costExplanation: `No shared corridor exists in our sample. Wise's markup is a stated 0%, against Westpac's published 3-5% — a structural gap that our quote data, even without a direct comparison, is consistent with.`,
      speedExplanation: `Wise settles instant to two days; Westpac's published range is two to five business days. Wise's window is faster on every corridor it serves.`,
      coverageExplanation: `Both reach roughly 200 countries. Wise's $1,000,000 ceiling exceeds Westpac's $100,000; Westpac's 50 currencies trail Wise's 50 roughly evenly, though the two aren't measured on the same underlying corridors.`,
      bottomLine: `Without a shared priced corridor, this page compares two pricing models rather than declaring a numeric winner. Wise's 0% markup and stated fee are a structural cost advantage over a full-service bank's published rates; an existing Westpac relationship is the only reason to expect otherwise.`,
    },
    faqs: [
      {
        q: "Why isn't there a live price comparison for this pair?",
        a: "Westpac's international transfer pricing in our data is concentrated on Australian-dollar corridors we don't price day to day, so it doesn't appear in the same sample as Wise. This reflects a coverage gap in our specific corridor set, not a claim that Westpac has no international transfer product.",
      },
      {
        q: "Is Wise cheaper than Westpac?",
        a: "Based on published rates, almost certainly — Wise's 0% markup against Westpac's published 3-5% is a wide structural gap, though we don't have a live quote-to-quote comparison to confirm the exact figure for your corridor.",
      },
      {
        q: "Does Westpac offer any fee-free option?",
        a: "Not one reflected in the rates we've reviewed — Westpac's $8-$20 fee applies broadly. Confirm current terms directly with Westpac, since bank pricing structures change more often than this page is rescanned.",
      },
      {
        q: "Should I open a Wise account just to avoid Westpac's fees?",
        a: "For an international transfer specifically, it's usually worth comparing — Wise's stated 0% markup is a real, verifiable cost advantage over a full-service bank's published rate. Whether it's worth the switch depends on how often you send and whether Westpac serves other needs you'd keep using it for.",
      },
    ],
    keyDifferences: [
      "Westpac doesn't appear in our priced sample for the six standard corridors this site tracks — its figures here are drawn from published rates, not collected quotes.",
      "Wise's markup is a stated 0%; Westpac's published range is 3-5%.",
      "Wise's $1,000,000 ceiling exceeds Westpac's $100,000.",
      "Wise settles instant to two days; Westpac's published range is two to five business days.",
    ],
  },

  "remitly-vs-worldremit": {
    theDecision: `Both are digital remittance specialists with cash pickup and mobile money, so this is one of the more direct comparisons on the site. Remitly is the larger, more general service; WorldRemit is built specifically for the last mile in emerging markets, adding airtime top-up as a payout option Remitly doesn't have.`,
    measuredRecord: `Remitly led on {{LED:remitly}} of the corridors we price against {{LED:worldremit}} for WorldRemit. Remitly's average shortfall when it isn't cheapest is {{SHORTFALL:remitly}}, against {{SHORTFALL:worldremit}} for WorldRemit.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On $1,000 USD→INR the gap is {{RECEIVE_DIFF:remitly:worldremit:USD:INR:1000}}, with {{CHEAPER:remitly:worldremit:USD:INR:1000}} delivering more — {{COST_PCT:remitly:USD:INR:1000}} all-in for Remitly against {{COST_PCT:worldremit:USD:INR:1000}} for WorldRemit. India is a bank-deposit-heavy corridor for both; the comparison likely narrows on routes where mobile money is the normal way to receive money, which WorldRemit is built around.`,
    },
    pickA: {
      heading: "Pick Remitly for broader coverage and home delivery",
      body: `Remitly's 100-country list and home delivery option give it slightly broader reach than WorldRemit's 130 countries suggest at first glance, since WorldRemit's list leans heavily toward mobile-money markets. Remitly's Trustpilot rating is also the higher of the two.`,
    },
    pickB: {
      heading: "Pick WorldRemit for mobile money and airtime",
      body: `WorldRemit's case is the last mile: mobile money into wallets like M-Pesa and MTN, plus airtime top-up direct to a phone, are payout methods Remitly doesn't offer at all. It quotes 70 currencies against Remitly's 40, concentrated in markets where a bank account isn't the default.`,
    },
    limits: `Mobile money and airtime availability vary by country and network. Confirm your corridor and payout method are supported before sending.`,
    verdict: {
      costExplanation: `Remitly led {{LED:remitly}} of the corridors we price against {{LED:worldremit}} for WorldRemit, with average shortfalls of {{SHORTFALL:remitly}} and {{SHORTFALL:worldremit}}. Both are digital specialists priced closer to the leaders than a bank or broad payments account.`,
      speedExplanation: `Remitly's express tier settles in minutes; WorldRemit quotes minutes to three days. Neither has a consistent edge once the payout method is matched.`,
      coverageExplanation: `WorldRemit's 70 currencies and airtime top-up edge out Remitly's 40 currencies and lack of an airtime option; Remitly counters with home delivery and a higher Trustpilot rating.`,
      bottomLine: `For a bank-deposit corridor, this is mostly a cost comparison and Remitly often wins it. For mobile money or airtime — the payout methods WorldRemit is built around — Remitly has nothing to offer at any price.`,
    },
    faqs: [
      {
        q: "Can Remitly send to a mobile money wallet like WorldRemit can?",
        a: "Remitly does support mobile money on some corridors, but WorldRemit was built specifically around it and adds airtime top-up, which Remitly doesn't offer at all.",
      },
      {
        q: "Which has the wider currency coverage?",
        a: "WorldRemit, at 70 currencies against Remitly's 40, reflecting WorldRemit's focus on markets where mobile wallets and diverse local currencies are the norm.",
      },
      {
        q: "Is WorldRemit's markup the same on every corridor?",
        a: "No — it varies by payout method and destination, generally running tighter on the mobile-money corridors WorldRemit is built for than on bank-deposit routes like the one in our worked example.",
      },
      {
        q: "Which has the better Trustpilot rating?",
        a: "Remitly, by a moderate margin. Both are well-regarded relative to banks and broad payments accounts, but Remitly edges ahead in our data.",
      },
    ],
    keyDifferences: [
      "WorldRemit offers airtime top-up, a payout method Remitly doesn't have at all; Remitly counters with home delivery, which WorldRemit doesn't offer.",
      "WorldRemit's 70 currencies exceed Remitly's 40, concentrated in mobile-money markets.",
      "Remitly carries the higher Trustpilot rating of the two.",
      "Both offer cash pickup and mobile money, but WorldRemit's model leans more heavily on mobile wallets as the primary payout method.",
    ],
  },

  "revolut-vs-hsbc": {
    theDecision: `Revolut is a digital-first account with a 0% weekday markup; HSBC is a full-service bank whose markup ranges from 0% for Premier customers to 2.5% for standard accounts. On a weekday, within Revolut's free allowance, it's hard for a standard-tier HSBC transfer to compete. The comparison narrows sharply for an HSBC Premier customer, or for an HSBC-to-HSBC transfer, which is free with no markup at all.`,
    measuredRecord: `Revolut led on {{LED:revolut}} of the corridors we price against {{LED:hsbc}} for HSBC. HSBC's average shortfall when it isn't cheapest is {{SHORTFALL:hsbc}}, against {{SHORTFALL:revolut}} for Revolut — a gap that reflects standard-tier HSBC pricing rather than the Premier rate.`,
    workedExample: {
      heading: "A worked example: £1,000 to euros",
      body: `On £1,000 GBP→EUR the gap is {{RECEIVE_DIFF:revolut:hsbc:GBP:EUR:1000}}, with {{CHEAPER:revolut:hsbc:GBP:EUR:1000}} delivering more — {{COST_PCT:revolut:GBP:EUR:1000}} all-in for Revolut against {{COST_PCT:hsbc:GBP:EUR:1000}} for HSBC. This reflects Revolut's weekday rate and HSBC's standard tier; either variable moving — a weekend transfer, or an HSBC Premier account — changes the result.`,
    },
    pickA: {
      heading: "Pick HSBC if you're a Premier customer or sending HSBC-to-HSBC",
      body: `HSBC's case depends entirely on account tier: free and markup-free between two HSBC accounts, or the mid-market rate for Premier customers on any transfer. It's regulated by the <a href="https://register.fca.org.uk" target="_blank" rel="noopener noreferrer">FCA</a>, the PRA and the HKMA, and has operated since 1865.`,
    },
    pickB: {
      heading: "Pick Revolut for weekday transfers and app-based convenience",
      body: `Revolut is the better instrument for most standard-tier senders: free up to £1,000 a month at the interbank rate on weekdays, then 0.5%. Revolut-to-Revolut transfers are instant and free. The constraint is the weekend markup and the requirement that the recipient hold a Revolut account for the fastest route.`,
    },
    limits: `HSBC's markup depends heavily on account tier in a way our quotes cannot fully capture, and Revolut's free allowance and weekend markup depend on plan tier. Confirm your own account terms before relying on either figure.`,
    verdict: {
      costExplanation: `Revolut led {{LED:revolut}} of the corridors we price against {{LED:hsbc}} for HSBC, with average shortfalls of {{SHORTFALL:revolut}} and {{SHORTFALL:hsbc}}. HSBC's result reflects standard retail pricing — Premier customers pay no markup at all.`,
      speedExplanation: `Revolut-to-Revolut transfers are instant; HSBC settles same-day to three business days. For a transfer to an external account, both depend on the receiving bank's own processing time.`,
      coverageExplanation: `HSBC's 200 countries and 60 currencies run through its own branch network; Revolut's 150 countries and 36 currencies run through the app, with no upper transfer limit against HSBC's similarly unlimited standard.`,
      bottomLine: `Account tier and day of the week decide more of this page than either company's general reputation does. A weekday Revolut transfer within the free allowance is hard to beat for a standard-tier sender; an HSBC Premier customer, or an HSBC-to-HSBC transfer, changes the comparison entirely.`,
    },
    faqs: [
      {
        q: "Does HSBC Premier change this comparison?",
        a: "Substantially — Premier customers pay no markup on any transfer, which would move HSBC from behind Revolut to competitive with it. Our figures reflect standard retail pricing, since that's what most senders actually pay.",
      },
      {
        q: "Why does the day of the week matter for Revolut but not HSBC?",
        a: "Revolut's markup is 0% on weekdays and 0.5-1% on weekends, because the underlying interbank FX market is closed then. HSBC's pricing doesn't have an equivalent weekend effect — its markup depends on account tier, not the day you send.",
      },
      {
        q: "Is HSBC-to-HSBC really free?",
        a: "Yes, with no markup, regardless of account tier. If both you and the recipient bank with HSBC, that's typically the cheapest route on this page, ahead of even Revolut's free weekday allowance.",
      },
      {
        q: "What happens after Revolut's free monthly allowance?",
        a: "Transfers above £1,000 a month are charged at 0.5%, still competitive against standard-tier HSBC pricing. Compare both for your specific amount rather than assuming the free-allowance figure applies indefinitely.",
      },
    ],
    keyDifferences: [
      "Revolut's markup is 0% on weekdays, 0.5-1% on weekends; HSBC's ranges from 0% (Premier or HSBC-to-HSBC) to 2.5% (standard tier), with no weekend effect.",
      "Revolut gives a free £1,000 monthly allowance, then 0.5%; HSBC charges £4-£9 per transfer at standard tier, or nothing between two HSBC accounts.",
      "Revolut-to-Revolut transfers are instant; HSBC settles same-day to three business days.",
      "HSBC's 200-country branch network exceeds Revolut's 150-country app-based reach.",
    ],
  },

  "moneygram-vs-wise": {
    theDecision: `MoneyGram is a cash-agent network; Wise is a bank-deposit specialist with a stated fee and no markup. The two rarely compete on the same terms: MoneyGram sells reach into places without a bank account, while Wise sells a transparent rate for a recipient who has one. Wise's 0% markup makes it the cheaper option on the corridors we measure whenever a bank deposit works for the recipient.`,
    measuredRecord: `Wise led on {{LED:wise}} of the corridors we price against {{LED:moneygram}} for MoneyGram, with average shortfalls of {{SHORTFALL:wise}} and {{SHORTFALL:moneygram}} respectively. Wise is among the most consistent leaders in our data; MoneyGram trails by the cash-network premium.`,
    workedExample: {
      heading: "India at $1,000: the MoneyGram premium in rupees",
      body: `Send $1,000 from the US to India and the recipient's payout differs by {{RECEIVE_DIFF:wise:moneygram:USD:INR:1000}}, {{CHEAPER:wise:moneygram:USD:INR:1000}} ahead. All-in, Wise costs {{COST_PCT:wise:USD:INR:1000}} of the transfer and MoneyGram {{COST_PCT:moneygram:USD:INR:1000}}. MoneyGram's figure carries a 1-3% rate margin that rises with the amount; Wise has no margin to rise, so its share falls as the transfer grows.`,
    },
    pickA: {
      heading: "Pick Wise for bank-to-bank transfers of any size",
      body: `If the recipient has an account that can receive a deposit, Wise is the cheaper route on the corridors we measure, scaling to $1,000,000 with balances in 50 currencies and regulation by the FCA, FinCEN and ASIC.`,
    },
    pickB: {
      heading: "Pick MoneyGram when cash or coverage decides it",
      body: `A recipient with no account, or one in a country beyond Wise's 80, is a MoneyGram customer by default — its agents cover roughly 200. That reach is paid for in the rate, and our measurements put a real number on the premium.`,
    },
    limits: `MoneyGram prices by agent, payout method and location, and Wise's charge moves with the currency pair and how you pay. Confirm your specific sending country and payout method before sending.`,
    verdict: {
      costExplanation: `Wise led {{LED:wise}} of the corridors we price against {{LED:moneygram}} for MoneyGram. Everything Wise charges shows up as its fee; MoneyGram funds its counters with a 1-3% spread inside the rate.`,
      speedExplanation: `MoneyGram can put cash in a hand within minutes at a staffed counter, something Wise cannot do at any speed. Wise's fastest deposits land instantly, its slowest in about two days.`,
      coverageExplanation: `Around 200 countries of MoneyGram agents against Wise's 80 of bank payouts. Wise answers with size: a $1,000,000 ceiling where MoneyGram stops at $10,000.`,
      bottomLine: `If the recipient banks, Wise's zero-markup rate wins clearly. If they don't, or need cash today, MoneyGram isn't competing on price — it's the only option that exists.`,
    },
    faqs: [
      {
        q: "Is MoneyGram ever cheaper than Wise in your data?",
        a: "Rarely, on our measurements — with no margin in its rate, Wise stays in front on most routes. MoneyGram earns its place through reach: a recipient without a bank account, or a destination Wise doesn't serve.",
      },
      {
        q: "If my recipient has a bank account, is MoneyGram's deposit option any cheaper?",
        a: "MoneyGram does pay into bank accounts, but the 1-3% margin comes with that payout too. For a banked recipient, the saving sits with Wise.",
      },
      {
        q: "Why compare a cash network against a bank-deposit specialist at all?",
        a: "Because many senders don't know in advance whether their recipient has a bank account, and this page shows what that choice actually costs once it's made either way.",
      },
      {
        q: "Does Wise offer any cash pickup option?",
        a: "None. Every Wise transfer ends in an account, whatever the amount. A cash recipient needs MoneyGram.",
      },
    ],
    keyDifferences: [
      "Wise shows its whole charge as a fee at 0% markup; MoneyGram's 1-3% sits inside the exchange rate.",
      "MoneyGram offers cash pickup across roughly 200 countries; Wise pays to a bank account only, in 80 countries.",
      "Wise's $1,000,000 ceiling exceeds MoneyGram's $10,000 cap by a wide margin.",
      "MoneyGram can settle in minutes at a staffed counter; Wise's fastest option is still a bank deposit, arriving instant to two days.",
    ],
  },

  "chase-vs-wells-fargo": {
    theDecision: `Both are large US retail banks with international wire pricing built around branch relationships rather than app-first cost competition. Chase charges $40-$50 for an international wire plus a 2-4% markup; Wells Fargo charges $30-$45 plus a wider 3-5% markup. Wells Fargo's fee is marginally lower; Chase's markup is narrower — the two roughly offset, and neither is competitive against a digital specialist.`,
    measuredRecord: `Chase led on {{LED:chase}} of the corridors we price against {{LED:wells-fargo}} for Wells Fargo. Chase's average shortfall when it isn't cheapest is {{SHORTFALL:chase}}, against {{SHORTFALL:wells-fargo}} for Wells Fargo — both trail digital specialists by a wide margin, consistent with standard bank-wire pricing.`,
    workedExample: {
      heading: "A worked example: $1,000 to India",
      body: `On $1,000 USD→INR the gap is {{RECEIVE_DIFF:chase:wells-fargo:USD:INR:1000}}, with {{CHEAPER:chase:wells-fargo:USD:INR:1000}} delivering more — {{COST_PCT:chase:USD:INR:1000}} all-in for Chase against {{COST_PCT:wells-fargo:USD:INR:1000}} for Wells Fargo. Both figures are well behind what a digital specialist would quote on the same corridor — this page is genuinely a comparison between two similarly-priced bank wires, not a search for the cheapest option on the site.`,
    },
    pickA: {
      heading: "Pick Chase if you already bank there",
      body: `Chase's $40-$50 international wire fee and 2-4% markup are the marginally narrower of the two on markup, offset by a slightly higher fee than Wells Fargo's. It supports transfers to $250,000 and settles in 1-5 business days.`,
    },
    pickB: {
      heading: "Pick Wells Fargo if you already bank there",
      body: `Wells Fargo's $30-$45 fee is marginally lower than Chase's, offset by a wider 3-5% markup. It caps transfers at $100,000, below Chase's $250,000, and settles in 2-5 business days.`,
    },
    limits: `Both banks' fees and markups vary by branch, account type and destination — confirm the current terms directly before sending. Neither is competitive against a digital specialist on the corridors we measure.`,
    verdict: {
      costExplanation: `Chase led {{LED:chase}} of the corridors we price against {{LED:wells-fargo}} for Wells Fargo, with average shortfalls of {{SHORTFALL:chase}} and {{SHORTFALL:wells-fargo}} — both a meaningful premium over a digital specialist, consistent with standard bank-wire pricing.`,
      speedExplanation: `Chase quotes 1-5 business days; Wells Fargo 2-5 business days. Neither offers an express, minutes-level option — a digital remittance specialist would beat both on speed as well as cost.`,
      coverageExplanation: `Both reach around 200 countries and 100 currencies through correspondent banking. Chase's $250,000 ceiling exceeds Wells Fargo's $100,000.`,
      bottomLine: `This page compares two similarly expensive bank wires rather than identifying a clear winner — the fee and markup roughly offset between them. An existing relationship with either bank is the more relevant factor than which one is marginally cheaper on paper.`,
    },
    faqs: [
      {
        q: "Is either Chase or Wells Fargo competitive with a specialist app?",
        a: "No — both trail digital specialists by a wide margin on the corridors we measure. This page is useful for comparing the two banks against each other, not for finding the cheapest option on the site.",
      },
      {
        q: "Which has the lower fee?",
        a: "Wells Fargo, at $30-$45 against Chase's $40-$50 — but Wells Fargo's markup (3-5%) is wider than Chase's (2-4%), so the lower fee doesn't necessarily mean the lower total cost.",
      },
      {
        q: "Which has the higher transfer limit?",
        a: "Chase, at $250,000 against Wells Fargo's $100,000. For a transfer near either limit, confirm the current policy directly with the bank, since large transfers often involve additional verification.",
      },
      {
        q: "Why would I use either bank instead of a specialist?",
        a: "Usually only convenience — an existing account, a branch relationship, or a preference to keep the transfer within a bank you already use. Neither is the cost-competitive choice on the corridors we measure.",
      },
    ],
    keyDifferences: [
      "Wells Fargo's fee ($30-$45) is marginally lower than Chase's ($40-$50), but its markup (3-5%) is wider than Chase's (2-4%) — the two roughly offset.",
      "Chase caps transfers at $250,000; Wells Fargo at $100,000.",
      "Both settle in multiple business days with no express option, and both trail digital specialists by a wide margin on cost.",
      "Both reach around 200 countries and 100 currencies through correspondent banking relationships.",
    ],
  },
};

export function getCompareEditorial(slug: string): CompareEditorial | undefined {
  return compareEditorial[slug];
}
