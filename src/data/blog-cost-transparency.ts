import type { BlogPost } from "./blog-posts";

// ============================================================
// COST TRANSPARENCY STUDY — September 2026
//
// Original research. The World Bank's Remittance Prices Worldwide collects the
// transaction fee and the exchange-rate margin as separate components, but
// publishes only their sum. That leaves an unanswered question this archive can
// answer: what SHARE of a transfer's cost is legible to the sender before they
// send it?
//
// The framing borrows Faisal Khan & Co's remittance cost calculator, which
// states the arithmetic a transfer follows — charges come off the send side,
// only the remainder gets converted. Our archive satisfies that identity to the
// cent, which is what makes the decomposition defensible rather than modelled.
//
// Every figure is reproduced by scripts/research/cost-transparency-study.py.
// This is a frozen, dated study, not a live index — figures are deliberately
// literal rather than tokenised, and the dataset window is stated throughout.
// NGN and GHS payouts are excluded; their official mid-market benchmark
// diverges from the rate transfers clear at and produces negative markups.
// ============================================================

export const costTransparencyGuides: BlogPost[] = [
  {
    slug: "remittance-cost-transparency-study",
    title: "How Much of Your Transfer's Cost Can You Actually See?",
    metaTitle: "True Cost of a Money Transfer: 74,044 Quotes Measured",
    metaDescription:
      "How much of your transfer cost can you actually see? We measured 74,044 quotes: 63% on a $100 transfer, only 18% on $1,000. The rest hides in the rate.",
    excerpt:
      "The World Bank collects the fee and the exchange-rate margin separately, then publishes only the total. We measured the split across 74,044 quotes — and found the visible share collapses as the transfer gets bigger.",
    category: "Research",
    readTime: "11 min",
    publishedAt: "2026-09-21",
    updatedAt: "2026-09-21",
    author: "Ahsan Mukhtar",
    // Original research, externally sourced and reproducible from a committed
    // script. Explicit editorial call rather than the demand allowlist, which
    // cannot qualify a page that has never been indexable.
    contentStatus: "published",
    tags: [
      "remittance costs",
      "exchange rate markup",
      "price transparency",
      "SDG 10.c",
      "World Bank",
      "original research",
      "true cost of transfer",
      "small vs large transfers",
    ],
    sections: [
      {
        heading: "The short answer",
        content: `<div class="blog-answer-box"><p><strong>Quick answer:</strong> Across 74,044 quotes we collected between 13 March and 21 September 2026, <strong>66.5% of the true cost of a transfer was visible as a fee</strong>. The other third was an exchange-rate margin — real money, deducted silently, disclosed nowhere a sender would normally look. That headline hides the more useful finding: <strong>the visible share is a function of how much you send</strong>. On the same providers, same corridors and same days, the fee accounted for 63.0% of cost on a $100 transfer and just <strong>17.9% on a $1,000 transfer</strong>. Fees are fixed; margins are proportional. Past a median of about $182 with mainstream providers, the part you cannot see is already the bigger half of what you pay.</p></div>

<p>This matters because almost every consumer protection in this market — comparison tables, fee disclosures, the "no hidden fees" badge — is built around the number that stops being the main number somewhere around the price of a pair of shoes.</p>

<p>If you want the underlying concepts first, read <a href="/guides/exchange-rate-markup-explained">exchange rate markup explained</a> and <a href="/guides/hidden-fees-international-transfers">hidden fees in international transfers</a>. This page is not an explainer. It is a measurement.</p>`,
      },
      {
        heading: "The question nobody publishes an answer to",
        content: `<p class="citable-passage">The World Bank's Remittance Prices Worldwide database defines the total cost of a transfer as the transaction fee plus the margin taken on the exchange rate. It collects both components separately. It publishes their sum. What it does not publish — and what the UN's SDG 10.c target of "less than 3 per cent" is silent on — is the <strong>ratio between them</strong>: how much of what a sender pays was legible to them before they pressed send.</p>

<p>That ratio is the whole ballgame for a consumer. A 4% transfer where 4% is printed on the screen is an expensive product honestly sold. A 4% transfer where 0.2% is printed on the screen is something else. The World Bank's 6.49% global average treats the two identically, because as a development statistic it should — the household loses the same money either way. As a <em>shopping</em> statistic it conceals the only variable the sender can act on.</p>

<p>We hold the archive to answer it: {{PROVIDER_COUNT}} providers, live quotes refreshed every {{REFRESH_HOURS}} hours, retained daily since March. The missing piece was a defensible way to split one number into two.</p>`,
      },
      {
        heading: "Borrowing a model from the people who build the rails",
        content: `<p>The split came from an unlikely place: a tool built for payments operators rather than consumers. <a href="https://faisalkhan.com/resources/interactive-tools/remittance-cost-calculator" target="_blank" rel="noopener noreferrer">Faisal Khan &amp; Co's remittance cost calculator</a> is a modelling instrument for people designing a money transfer business — it asks you to enumerate sending-side charges, correspondent banking deductions on SWIFT routes, and payout partner costs, then tells you what lands.</p>

<p>Its value to us is a single stated rule about the arithmetic:</p>

<blockquote><p>"Charges come off the send side; only what is left gets converted."</p></blockquote>

<p>That is a falsifiable claim about how transfers actually work, and it is the hinge of this study, so we tested it before building anything on it. Taking every provider quoting USD to INR on a single day and predicting the receive amount from the fee and the rate alone:</p>

<div class="blog-table-box">
<h3 style="margin-top: 0;">Testing the model: (send &minus; fee) &times; rate = receive</h3>
<table>
<thead><tr><th>Provider</th><th>Fee</th><th>Rate</th><th>Model predicts</th><th>Actually received</th><th>Error</th></tr></thead>
<tbody>
<tr><td><a href="/companies/wise">Wise</a></td><td>$7.66</td><td>92.5551</td><td>8,546.54</td><td>8,546.54</td><td>$0.00</td></tr>
<tr><td><a href="/companies/remitly">Remitly</a></td><td>$3.99</td><td>92.2800</td><td>8,859.80</td><td>8,859.80</td><td>$0.00</td></tr>
<tr><td><a href="/companies/moneygram">MoneyGram</a></td><td>$1.99</td><td>92.2802</td><td>9,044.38</td><td>9,044.39</td><td>$0.01</td></tr>
<tr><td><a href="/companies/xoom">Xoom</a></td><td>$0.00</td><td>92.1900</td><td>9,219.00</td><td>9,219.00</td><td>$0.00</td></tr>
<tr><td><a href="/companies/instarem">Instarem</a></td><td>$0.00</td><td>92.1400</td><td>9,214.00</td><td>9,214.00</td><td>$0.00</td></tr>
<tr><td><a href="/companies/chase">Chase</a></td><td>$5.00</td><td>89.7117</td><td>8,522.61</td><td>8,522.61</td><td>$0.00</td></tr>
<tr><td><a href="/companies/wells-fargo">Wells Fargo</a></td><td>$0.00</td><td>89.6329</td><td>8,963.29</td><td>8,963.29</td><td>$0.00</td></tr>
</tbody>
</table>
<p class="blog-footnote">Sending $100 USD to INR, 13 March 2026. Rounding to the cent aside, the identity holds exactly — across a neobank, three MTOs, a card processor and two retail banks.</p>
</div>

<p>The model reproduces reality to the cent. So we can run it backwards. If <code>receive = (send &minus; fee) &times; rate</code>, and we independently know the mid-market rate on that day, then every quote splits cleanly into a part the sender was shown and a part they were not:</p>

<ul>
<li><strong>True cost</strong> = 1 &minus; (received &divide; what mid-market would have delivered)</li>
<li><strong>Visible</strong> = the disclosed fee, as a percentage of the send amount</li>
<li><strong>Invisible</strong> = the margin between the provider's rate and mid-market</li>
</ul>

<p>Note what the calculator itself does with the rate: it is an input you type in. The tool models three layers of charges in detail and then asks the operator to supply the exchange rate by hand. That is not an oversight — it is an accurate reflection of the industry. The margin is the one cost component that has no schedule to look it up in.</p>`,
      },
      {
        heading: "Finding 1: a third of the cost is invisible — and that is the optimistic reading",
        content: `<p>Across all 74,044 observations, weighted by cost: <strong>66.5% visible, 33.5% invisible.</strong> The median transfer cost 2.44% in total, of which 0.90 percentage points — about $9 per $1,000 — was margin.</p>

<p>Two-thirds visible sounds tolerable. It is flattered by our measurement point. Our historical archive prices at $100, and $100 is the single most favourable amount at which you could possibly ask this question, because a flat fee looks enormous next to it. A $1.99 fee is 2% of $100 and 0.04% of $5,000. The margin does not move.</p>

<p>So the honest version of the headline is: two-thirds visible <em>on the smallest transfers anyone makes</em>, and falling from there.</p>

<h3>The zero-fee cohort</h3>

<p><strong>31.1% of all quotes we collected advertised no fee at all.</strong> Their median true cost was 1.23% — genuinely cheap, and a real achievement for the category. But the distribution has a tail that the words "no fees" cannot survive:</p>

<div class="blog-table-box">
<h3 style="margin-top: 0;">What a "$0 fee" transfer actually cost (23,006 quotes)</h3>
<table>
<thead><tr><th>Measure</th><th>Value</th></tr></thead>
<tbody>
<tr class="blog-row-highlight"><td>Median true cost</td><td>1.23%</td></tr>
<tr><td>Share costing more than 3% (the SDG target)</td><td>13.8%</td></tr>
<tr><td>Share costing more than 5%</td><td>4.4%</td></tr>
<tr><td>Most expensive zero-fee quote observed</td><td>17.5%</td></tr>
</tbody>
</table>
<p class="blog-footnote">A 17.5% cost on a transfer advertised at no fee. On $1,000 that is $175 the sender was never quoted.</p>
</div>

<p>And the trap works in the other direction too. On the 6,696 corridor-days where a zero-fee option was available, <strong>a fee-charging provider was actually cheaper 20.7% of the time</strong>. One time in five, paying a fee was the right call.</p>`,
      },
      {
        heading: "Finding 2: the visible share collapses as the transfer grows",
        content: `<p>This is the result we did not expect to be so clean.</p>

<figure class="blog-table-box" style="margin:28px 0;"><svg viewBox="0 0 760 252" width="100%" height="auto" role="img" aria-labelledby="t252 d252" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;font-family:system-ui, -apple-system, 'Segoe UI', sans-serif"><title id="t252">Share of transfer cost that is visible, by send amount</title><desc id="d252">On $100 the disclosed fee is 63% of true cost and the exchange-rate margin 37%. On $1,000 the fee is 17.9% and the margin 82.1%.</desc><text x="0" y="20" font-size="15" fill="var(--color-on-surface)" text-anchor="start" font-weight="600">What you can see, and what you cannot</text><text x="0" y="40" font-size="12.5" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">Share of a transfer's true cost, by amount sent</text><text x="84" y="94.0" font-size="14" fill="var(--color-on-surface)" text-anchor="end" font-weight="600">$100</text><rect x="96" y="62" width="370.4" height="54" fill="var(--chart-1)" rx="3"/><rect x="466.4" y="62" width="217.6" height="54" fill="var(--chart-2)" rx="3"/><text x="106" y="94.0" font-size="13.5" fill="#fff" text-anchor="start" font-weight="700">63.0% fee</text><text x="476.44" y="94.0" font-size="13.5" fill="#fff" text-anchor="start" font-weight="700">37.0% exchange-rate margin</text><text x="96" y="133" font-size="12" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">true cost 3.16%</text><text x="84" y="178.0" font-size="14" fill="var(--color-on-surface)" text-anchor="end" font-weight="600">$1,000</text><rect x="96" y="146" width="105.3" height="54" fill="var(--chart-1)" rx="3"/><rect x="201.3" y="146" width="482.7" height="54" fill="var(--chart-2)" rx="3"/><text x="106" y="178.0" font-size="13.5" fill="#fff" text-anchor="start" font-weight="700">17.9% fee</text><text x="211.252" y="178.0" font-size="13.5" fill="#fff" text-anchor="start" font-weight="700">82.1% exchange-rate margin</text><text x="96" y="217" font-size="12" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">true cost 1.11%</text><text x="96" y="246" font-size="11.5" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">Same providers, same corridors, same days — 241 flat-fee quote series.</text></svg><figcaption class="blog-footnote" style="margin-top:12px;">Both bars are the same width because both show 100% of a transfer's cost. What changes is who can see it.</figcaption></figure>

<p>To isolate the effect of amount from everything else, we restricted to 241 quote series where the <em>same provider</em> priced the <em>same corridor</em> from the <em>same source</em> on the <em>same day</em> at more than one send amount, and where the fee was genuinely flat across those amounts. Same product, same moment, only the amount differs:</p>

<div class="blog-table-box">
<h3 style="margin-top: 0;">Same provider, same corridor, same day — only the amount changes</h3>
<table>
<thead><tr><th>Send amount</th><th>Fee as % of send</th><th>True cost</th><th style="white-space:nowrap;">Visible share of cost</th></tr></thead>
<tbody>
<tr><td><strong>$100</strong></td><td>1.99%</td><td>3.16%</td><td><strong>63.0%</strong></td></tr>
<tr class="blog-row-highlight"><td><strong>$1,000</strong></td><td>0.20%</td><td>1.11%</td><td><strong>17.9%</strong></td></tr>
</tbody>
</table>
<p class="blog-footnote">241 flat-fee quote series. Ten times the amount, and the share of cost a sender can see falls by more than two thirds.</p>
</div>

<p class="citable-passage">Multiply the transfer by ten and the share of its cost that is visible to the sender falls from 63% to 18%. Nothing about the product changed. The fee did exactly what a fixed fee does, and the margin did exactly what a proportional charge does. Every disclosure regime built around fees is therefore weakest precisely where the money is largest.</p>

<p>There is good news buried in that table: the total cost fell too, from 3.16% to 1.11%. Larger transfers are cheaper in percentage terms. But the composition of what remains is almost entirely the part nobody shows you.</p>

<h3>Where each provider crosses over</h3>

<p>Because fees are fixed and margins proportional, every provider has a send amount at which the invisible cost overtakes the visible one. Below it, the fee is the main event and a fee-based comparison serves you well. Above it, the fee is a rounding error and the rate is the whole decision.</p>

<figure class="blog-table-box" style="margin:28px 0;"><svg viewBox="0 0 760 558" width="100%" height="auto" role="img" aria-labelledby="t558 d558" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;font-family:system-ui, -apple-system, 'Segoe UI', sans-serif"><title id="t558">Send amount at which hidden cost overtakes the visible fee, by provider</title><desc id="d558">Most mainstream providers cross over between $113 and $260. Wise does not cross until about $21,950 because its median margin is 0.02%.</desc><text x="0" y="20" font-size="15" fill="var(--color-on-surface)" text-anchor="start" font-weight="600">Where the invisible cost takes over</text><text x="0" y="40" font-size="12.5" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">Send amount above which the exchange-rate margin exceeds the flat fee</text><line x1="115.8" y1="62" x2="115.8" y2="524" stroke="var(--color-outline)" stroke-width="1"/><text x="115.81978205970972" y="540" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="middle" font-weight="400">$50</text><line x1="177.4" y1="62" x2="177.4" y2="524" stroke="var(--color-outline)" stroke-width="1"/><text x="177.38564839593104" y="540" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="middle" font-weight="400">$100</text><line x1="320.3" y1="62" x2="320.3" y2="524" stroke="var(--color-outline)" stroke-width="1"/><text x="320.3371631280833" y="540" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="middle" font-weight="400">$500</text><line x1="381.9" y1="62" x2="381.9" y2="524" stroke="var(--color-outline)" stroke-width="1"/><text x="381.90302946430467" y="540" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="middle" font-weight="400">$1,000</text><line x1="524.9" y1="62" x2="524.9" y2="524" stroke="var(--color-outline)" stroke-width="1"/><text x="524.854544196457" y="540" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="middle" font-weight="400">$5,000</text><line x1="648.0" y1="62" x2="648.0" y2="524" stroke="var(--color-outline)" stroke-width="1"/><text x="647.9862768688995" y="540" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="middle" font-weight="400">$20,000</text><line x1="96" y1="74" x2="121.0" y2="74" stroke="var(--chart-1)" stroke-width="2" opacity="0.45"/><circle cx="121.0" cy="74" r="5" fill="var(--chart-1)"/><text x="86" y="78" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">PNB Europe</text><text x="131.99527134932964" y="78" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$53</text><line x1="96" y1="96" x2="133.5" y2="96" stroke="var(--chart-1)" stroke-width="2" opacity="0.45"/><circle cx="133.5" cy="96" r="5" fill="var(--chart-1)"/><text x="86" y="100" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">Mukuru</text><text x="144.48186845881747" y="100" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$61</text><line x1="96" y1="118" x2="188.2" y2="118" stroke="var(--chart-1)" stroke-width="2" opacity="0.45"/><circle cx="188.2" cy="118" r="5" fill="var(--chart-1)"/><text x="86" y="122" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">Sendwave</text><text x="199.24111264834568" y="122" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$113</text><line x1="96" y1="140" x2="202.0" y2="140" stroke="var(--chart-1)" stroke-width="2" opacity="0.45"/><circle cx="202.0" cy="140" r="5" fill="var(--chart-1)"/><text x="86" y="144" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">Paysend</text><text x="213.04511303126975" y="144" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$132</text><line x1="96" y1="162" x2="204.7" y2="162" stroke="var(--chart-1)" stroke-width="2" opacity="0.45"/><circle cx="204.7" cy="162" r="5" fill="var(--chart-1)"/><text x="86" y="166" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">Xoom</text><text x="215.6966762065374" y="166" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$136</text><line x1="96" y1="184" x2="209.2" y2="184" stroke="var(--chart-1)" stroke-width="2" opacity="0.45"/><circle cx="209.2" cy="184" r="5" fill="var(--chart-1)"/><text x="86" y="188" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">WorldRemit</text><text x="220.15456796382426" y="188" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$143</text><line x1="96" y1="206" x2="218.6" y2="206" stroke="var(--chart-1)" stroke-width="2" opacity="0.45"/><circle cx="218.6" cy="206" r="5" fill="var(--chart-1)"/><text x="86" y="210" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">Western Union</text><text x="229.57486081665138" y="210" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$159</text><line x1="96" y1="228" x2="230.1" y2="228" stroke="var(--chart-1)" stroke-width="2" opacity="0.45"/><circle cx="230.1" cy="228" r="5" fill="var(--chart-1)"/><text x="86" y="232" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">MoneyGram</text><text x="241.0853956856075" y="232" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$181</text><line x1="96" y1="250" x2="230.6" y2="250" stroke="var(--chart-1)" stroke-width="2" opacity="0.45"/><circle cx="230.6" cy="250" r="5" fill="var(--chart-1)"/><text x="86" y="254" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">Boss Money</text><text x="241.5747675574554" y="254" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$182</text><line x1="96" y1="272" x2="233.0" y2="272" stroke="var(--chart-1)" stroke-width="2" opacity="0.45"/><circle cx="233.0" cy="272" r="5" fill="var(--chart-1)"/><text x="86" y="276" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">Ria</text><text x="243.98198183019508" y="276" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$187</text><line x1="96" y1="294" x2="240.3" y2="294" stroke="var(--chart-1)" stroke-width="2" opacity="0.45"/><circle cx="240.3" cy="294" r="5" fill="var(--chart-1)"/><text x="86" y="298" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">Dahabshiil</text><text x="251.27393275884268" y="298" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$203</text><line x1="96" y1="316" x2="242.0" y2="316" stroke="var(--chart-1)" stroke-width="2" opacity="0.45"/><circle cx="242.0" cy="316" r="5" fill="var(--chart-1)"/><text x="86" y="320" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">Revolut</text><text x="253.00707594404915" y="320" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$207</text><line x1="96" y1="338" x2="259.1" y2="338" stroke="var(--chart-1)" stroke-width="2" opacity="0.45"/><circle cx="259.1" cy="338" r="5" fill="var(--chart-1)"/><text x="86" y="342" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">CurrencyFair</text><text x="270.1258711950835" y="342" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$251</text><line x1="96" y1="360" x2="262.3" y2="360" stroke="var(--chart-1)" stroke-width="2" opacity="0.45"/><circle cx="262.3" cy="360" r="5" fill="var(--chart-1)"/><text x="86" y="364" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">Profee</text><text x="273.2549107360976" y="364" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$260</text><line x1="96" y1="382" x2="307.6" y2="382" stroke="var(--chart-2)" stroke-width="2" opacity="0.45"/><circle cx="307.6" cy="382" r="5" fill="var(--chart-2)"/><text x="86" y="386" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">Remitly</text><text x="318.55848603983975" y="386" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$433</text><line x1="96" y1="404" x2="312.0" y2="404" stroke="var(--chart-2)" stroke-width="2" opacity="0.45"/><circle cx="312.0" cy="404" r="5" fill="var(--chart-2)"/><text x="86" y="408" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">XE</text><text x="322.9604159533865" y="408" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$455</text><line x1="96" y1="426" x2="331.7" y2="426" stroke="var(--chart-2)" stroke-width="2" opacity="0.45"/><circle cx="331.7" cy="426" r="5" fill="var(--chart-2)"/><text x="86" y="430" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">HSBC</text><text x="342.66299442883485" y="430" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$568</text><line x1="96" y1="448" x2="434.1" y2="448" stroke="var(--chart-2)" stroke-width="2" opacity="0.45"/><circle cx="434.1" cy="448" r="5" fill="var(--chart-2)"/><text x="86" y="452" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">Koho</text><text x="445.11069366679584" y="452" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$1,800</text><line x1="96" y1="470" x2="456.2" y2="470" stroke="var(--chart-2)" stroke-width="2" opacity="0.45"/><circle cx="456.2" cy="470" r="5" fill="var(--chart-2)"/><text x="86" y="474" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">SingX</text><text x="467.1910649075735" y="474" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$2,308</text><line x1="96" y1="492" x2="656.2" y2="492" stroke="var(--chart-2)" stroke-width="2" opacity="0.45"/><circle cx="656.2" cy="492" r="5" fill="var(--chart-2)"/><text x="86" y="496" font-size="11.5" fill="var(--color-on-surface)" text-anchor="end" font-weight="400">Wise</text><text x="667.2497053057248" y="496" font-size="11" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">$21,950</text><text x="96" y="556" font-size="11.5" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">Blue: crosses over below $260 — that is, below almost every real remittance.</text></svg><figcaption class="blog-footnote" style="margin-top:12px;">Log scale. Below a provider's crossover, comparing fees works. Above it, only the rate matters.</figcaption></figure>

<div class="blog-table-box">
<h3 style="margin-top: 0;">The crossover point, by provider</h3>
<table>
<thead><tr><th>Provider</th><th>Median fee</th><th>Median margin</th><th>Margin overtakes fee above</th></tr></thead>
<tbody>
<tr><td><a href="/companies/pnb-europe">PNB Europe</a></td><td>$10.25</td><td>19.18%</td><td>$53</td></tr>
<tr><td><a href="/companies/mukuru">Mukuru</a></td><td>$2.00</td><td>3.30%</td><td>$61</td></tr>
<tr><td><a href="/companies/sendwave">Sendwave</a></td><td>$0.99</td><td>0.88%</td><td>$113</td></tr>
<tr><td><a href="/companies/paysend">Paysend</a></td><td>$1.00</td><td>0.76%</td><td>$132</td></tr>
<tr><td><a href="/companies/xoom">Xoom</a></td><td>$2.99</td><td>2.20%</td><td>$136</td></tr>
<tr><td><a href="/companies/worldremit">WorldRemit</a></td><td>$1.99</td><td>1.39%</td><td>$143</td></tr>
<tr><td><a href="/companies/western-union">Western Union</a></td><td>$1.99</td><td>1.25%</td><td>$159</td></tr>
<tr><td><a href="/companies/moneygram">MoneyGram</a></td><td>$1.99</td><td>1.10%</td><td>$181</td></tr>
<tr><td><a href="/companies/ria">Ria</a></td><td>$1.90</td><td>1.02%</td><td>$187</td></tr>
<tr><td><a href="/companies/revolut">Revolut</a></td><td>$1.20</td><td>0.58%</td><td>$207</td></tr>
<tr><td><a href="/companies/currencyfair">CurrencyFair</a></td><td>$1.78</td><td>0.71%</td><td>$251</td></tr>
<tr><td><a href="/companies/remitly">Remitly</a></td><td>$2.99</td><td>0.69%</td><td>$433</td></tr>
<tr><td><a href="/companies/xe">XE</a></td><td>$4.00</td><td>0.88%</td><td>$455</td></tr>
<tr><td><a href="/companies/hsbc">HSBC</a></td><td>$19.88</td><td>3.50%</td><td>$568</td></tr>
<tr><td><a href="/companies/singx">SingX</a></td><td>$6.00</td><td>0.26%</td><td>$2,308</td></tr>
<tr class="blog-row-highlight"><td><a href="/companies/wise">Wise</a></td><td>$4.39</td><td>0.02%</td><td>$21,950</td></tr>
</tbody>
</table>
<p class="blog-footnote">Median fee measured at a $100 send; margin measured against mid-market. The crossover assumes the fee stays flat as the amount rises, which held for the large majority of series we could test. Providers charging a percentage fee behave differently and are excluded from this table.</p>
</div>

<p>Two things stand out. Most mainstream MTOs cross over between <strong>$113 and $260, at a median of $182</strong> — that is, below almost every real remittance. And <a href="/companies/wise">Wise</a> effectively never crosses over, because at a 0.02% median margin there is almost nothing on the invisible side to overtake the fee. That is the structural meaning of its pricing model, and it is consistent with what we have measured elsewhere: on major corridors, Wise's markup is genuinely ~0%.</p>

<p>Then there is the group with no crossover point at all, because the margin is not the larger part of their cost — it is the <em>entire</em> cost:</p>

<div class="blog-table-box">
<h3 style="margin-top: 0;">Providers where the margin is 100% of the cost</h3>
<table>
<thead><tr><th>Provider</th><th>Median fee</th><th>Median margin</th><th>Visible share of cost</th></tr></thead>
<tbody>
<tr class="blog-row-highlight"><td><a href="/companies/ofx">OFX</a></td><td>$0.00</td><td>6.43%</td><td>0%</td></tr>
<tr><td><a href="/companies/skrill">Skrill</a></td><td>$0.00</td><td>2.61%</td><td>0%</td></tr>
<tr><td><a href="/companies/transfergo">TransferGo</a></td><td>$0.00</td><td>1.78%</td><td>0%</td></tr>
<tr><td><a href="/companies/lemfi">LemFi</a></td><td>$0.00</td><td>0.71%</td><td>0%</td></tr>
<tr><td><a href="/companies/instarem">Instarem</a></td><td>$0.00</td><td>0.49%</td><td>0%</td></tr>
</tbody>
</table>
<p class="blog-footnote">All five are accurately described as fee-free. <a href="/companies/lemfi">LemFi</a> and <a href="/companies/instarem">Instarem</a> are also genuinely inexpensive. <a href="/companies/ofx">OFX</a>'s 6.43% is not a fee we failed to find — we verified separately that OFX charges $0, and the entire cost sits in the rate.</p>
</div>`,
      },
      {
        heading: "Finding 3: one in five transfers passes the UN's cost target only on paper",
        content: `<p><a href="https://sdgs.un.org/goals/goal10" target="_blank" rel="noopener noreferrer">SDG target 10.c</a> commits the world to reducing remittance transaction costs to "less than 3 per cent" by 2030, and to eliminating corridors costing more than 5 per cent. Both limbs are defined on total cost, margin included. But total cost is not what a sender can check, so we scored our archive twice — once on true cost, once on the disclosed fee alone, as a shopper would:</p>

<figure class="blog-table-box" style="margin:28px 0;"><svg viewBox="0 0 760 250" width="100%" height="auto" role="img" aria-labelledby="t250 d250" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;font-family:system-ui, -apple-system, 'Segoe UI', sans-serif"><title id="t250">Share of quotes meeting the UN's 3% remittance cost target</title><desc id="d250">60.8% of quotes are genuinely under 3%. A further 20.4% clear 3% on the disclosed fee but fail once the exchange-rate margin is counted. 18.8% fail on either measure.</desc><text x="0" y="20" font-size="15" fill="var(--color-on-surface)" text-anchor="start" font-weight="600">One in five transfers meets the UN target only on paper</text><text x="0" y="40" font-size="12.5" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">Every quote scored against SDG 10.c's 3% ceiling, twice</text><rect x="96.0" y="92" width="357.5" height="62" fill="var(--chart-1)"/><text x="274.752" y="129.0" font-size="15" fill="#fff" text-anchor="middle" font-weight="700">60.8%</text><line x1="274.8" y1="158" x2="274.8" y2="168" stroke="var(--color-outline)" stroke-width="1"/><text x="96" y="178" font-size="12" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">Genuinely under 3%</text><rect x="453.5" y="92" width="120.0" height="62" fill="var(--chart-2)"/><text x="513.48" y="129.0" font-size="15" fill="#fff" text-anchor="middle" font-weight="700">20.4%</text><line x1="513.5" y1="158" x2="513.5" y2="188" stroke="var(--color-outline)" stroke-width="1"/><text x="513.48" y="198" font-size="12" fill="var(--color-on-surface-variant)" text-anchor="middle" font-weight="400">Passes on the fee, fails on true cost</text><rect x="573.5" y="92" width="110.5" height="62" fill="var(--color-on-surface-muted)"/><text x="628.7280000000001" y="129.0" font-size="15" fill="#fff" text-anchor="middle" font-weight="700">18.8%</text><line x1="628.7" y1="158" x2="628.7" y2="168" stroke="var(--color-outline)" stroke-width="1"/><text x="684.0" y="178" font-size="12" fill="var(--color-on-surface-variant)" text-anchor="end" font-weight="400">Over 3% either way</text><path d="M453.5 78 V70 H573.5 V78" fill="none" stroke="var(--chart-2)" stroke-width="1.5"/><text x="513.48" y="62" font-size="12" fill="var(--chart-2)" text-anchor="middle" font-weight="600">the gap fee disclosure hides</text><text x="96" y="242" font-size="11.5" fill="var(--color-on-surface-variant)" text-anchor="start" font-weight="400">Measured on the fee alone, 80.8% appear to clear the target. Measured on true cost, 60.8% do.</text></svg><figcaption class="blog-footnote" style="margin-top:12px;">Segments sum to 100%. The middle band is the measurement error fee disclosure introduces.</figcaption></figure>

<div class="blog-table-box">
<h3 style="margin-top: 0;">Scoring 74,044 quotes against SDG 10.c's 3% target</h3>
<table>
<thead><tr><th>How you measure</th><th>Share that clears 3%</th></tr></thead>
<tbody>
<tr><td>By disclosed fee alone (what a sender sees)</td><td>80.8%</td></tr>
<tr class="blog-row-highlight"><td>By true cost, margin included (the actual target)</td><td>60.8%</td></tr>
<tr><td><strong>Gap: pass on fee, fail on true cost</strong></td><td><strong>20.4%</strong></td></tr>
</tbody>
</table>
<p class="blog-footnote">One transfer in five looks compliant with the UN's affordability target and is not.</p>
</div>

<p>That 20-point gap is the cost of measuring the wrong thing. It is also a caution for anyone reading provider marketing that cites the 3% target: the claim is usually true of the fee and untested on the total.</p>

<h3>The counterintuitive part: expensive and opaque are different problems</h3>

<p>We expected the corridors failing the 5% limb to be the murkiest. They are the opposite. Of 130 corridors with enough data to judge, 13 had a median cost above 5% — and on almost all of them the cost was <strong>openly charged as a fee</strong>:</p>

<div class="blog-table-box">
<h3 style="margin-top: 0;">The 5% failures are honest about it</h3>
<table>
<thead><tr><th>Corridor</th><th>Median true cost</th><th>Charged as fee</th><th>Hidden in the rate</th></tr></thead>
<tbody>
<tr><td>AED &rarr; PHP</td><td>10.30%</td><td>9.00%</td><td>10%</td></tr>
<tr><td>AED &rarr; LKR</td><td>10.04%</td><td>9.00%</td><td>23%</td></tr>
<tr><td>AED &rarr; PKR</td><td>10.02%</td><td>9.00%</td><td>21%</td></tr>
<tr><td>HKD &rarr; PHP</td><td>9.07%</td><td>8.00%</td><td>7%</td></tr>
<tr><td>MYR &rarr; IDR</td><td>6.64%</td><td>6.61%</td><td>6%</td></tr>
<tr><td>USD &rarr; HTG</td><td>5.50%</td><td>5.49%</td><td>5%</td></tr>
</tbody>
</table>
<p class="blog-footnote">Measured at a $100 send, where a flat fee of a few dirhams or ringgit is a large percentage. These same corridors get proportionally much cheaper at higher amounts — which is exactly the decay described above, working in the sender's favour.</p>
</div>

<p class="citable-passage">High cost and hidden cost are separate failures with separate remedies. The Gulf and intra-Asia corridors that breach the UN's 5% ceiling are largely <em>transparent</em> about it: the money is taken as a stated fee on a small transfer. Meanwhile the providers with the cleanest "no fees" marketing are, by construction, the ones disclosing least. Transparency regulation and affordability regulation are aimed at different targets, and a policy that only mandates fee disclosure will register no improvement on either.</p>`,
      },
      {
        heading: "What this means if you are just trying to send money",
        content: `<p>The practical consequence is measurable, so here it is measured. Across 8,934 corridor-days where at least three providers competed, we asked how often the provider with the lowest advertised fee was also the cheapest transfer:</p>

<div class="blog-table-box">
<h3 style="margin-top: 0;">Does the lowest fee find the cheapest transfer?</h3>
<table>
<thead><tr><th>Outcome</th><th>Frequency</th></tr></thead>
<tbody>
<tr><td>Lowest fee <em>was</em> the cheapest transfer</td><td>75.5%</td></tr>
<tr class="blog-row-highlight"><td>Lowest fee led you to the wrong provider</td><td><strong>24.5%</strong></td></tr>
</tbody>
</table>
<p class="blog-footnote">Median cost of being misled: 0.80% of the transfer — about $8 on $1,000, or <strong>$39.89 on $5,000</strong>. In the worst quarter of cases it exceeded 1.65%.</p>
</div>

<p>Sorting by fee gets you the right answer three times in four. That is good enough to feel reliable and bad enough to cost you real money, which is the most dangerous combination a heuristic can have. So:</p>

<ul>
<li><strong>Under about $110, comparing fees is mostly fine.</strong> That is below the lowest crossover point we measured on any mainstream provider, so the fee genuinely is the dominant cost. Do not over-think a $50 transfer.</li>
<li><strong>Above about $260, ignore the fee and compare the rate.</strong> That is past the highest mainstream crossover we measured, so every provider in the table is taking more from the rate than from the fee. Or better, compare only the number that survives both: the amount that actually arrives. Every provider's fee schedule is a distraction at that size.</li>
<li><strong>Treat "no fees" as a statement about structure, not price.</strong> It tells you where the cost is, not how much it is. Nearly a third of our quotes were fee-free; one in seven of those still cost more than the UN's 3% target.</li>
<li><strong>Re-check per transfer, not per provider.</strong> Across corridors we tracked for 60+ days, the cheapest provider changed a median of 18 times, with 3 different providers taking the lead. There is no provider you can pick once.</li>
</ul>

<p>This is the entire reason our comparison sorts on <a href="/send-money">the amount that arrives</a> rather than on fees. It is not a design preference; it is the only ordering that is correct at every transfer size.</p>`,
      },
      {
        heading: "Limits of this study",
        content: `<p>Stated plainly, because a study that lists no limits has not looked for them.</p>

<ul>
<li><strong>Our panel is not the World Bank's panel.</strong> Our median true cost of 2.44% sits far below the RPW global average of about 6.49%, and that gap is composition, not contradiction. We price digital providers on corridors with competition; RPW mystery-shops over 360 corridors, including cash agents and retail banks where costs are far higher, and surveys $200 and $500 rather than the $100 our archive prices. Three differences in the same direction, all of which should make our figure lower. Where the panels do overlap the results agree — we measure <a href="/companies/hsbc">HSBC</a> at 3.50% margin on top of a $19.88 fee, and RPW has long found banks to be the most expensive channel by a wide margin.</li>
<li><strong>The archive prices at $100.</strong> This is why the visible share of 66.5% is an upper bound, and why the crossover table is the more useful artifact. The $100/$1,000 comparison is measured on real multi-amount quotes, not extrapolated, but it rests on 241 series rather than the full archive.</li>
<li><strong>Crossover assumes a flat fee.</strong> True for most providers we could test, false for those charging a percentage. Those are excluded rather than modelled.</li>
<li><strong>NGN and GHS payouts are excluded entirely</strong> (8,028 observations). Their official mid-market benchmark diverges from the rate transfers actually clear at, producing negative measured markups. Including them would have flattered our cost figures.</li>
<li><strong>Margin is measured against mid-market on the day of collection</strong>, not at the instant of the quote. Intraday movement adds noise to any single observation; it does not bias a median across 74,044.</li>
<li><strong>This is a frozen study, not a live index.</strong> Every figure describes 13 March – 21 September 2026 and will not update. Our <a href="/remittance-cost-index">cost index</a> and <a href="/provider-consistency">consistency index</a> are the live equivalents.</li>
</ul>`,
      },
      {
        heading: "Sources & methodology",
        content: `<p><strong>Dataset.</strong> 74,044 provider-corridor-day observations across 185 corridors and 65 providers, collected 13 March – 21 September 2026 and retained daily. Quotes are gathered from provider APIs and comparison feeds every {{REFRESH_HOURS}} hours. Cost is measured as the shortfall between what arrived and what the mid-market rate would have delivered, so a single figure captures the fee and the margin together; the two are then separated using the send-side identity described above.</p>

<p><strong>Reproducibility.</strong> Every number on this page is produced by a single script in our repository, <code>scripts/research/cost-transparency-study.py</code>, run against the same archive that powers the rest of the site. The exclusions and thresholds it applies are the ones documented here.</p>

<p><strong>External sources.</strong></p>
<ul>
<li><a href="https://faisalkhan.com/resources/interactive-tools/remittance-cost-calculator" target="_blank" rel="noopener noreferrer">Faisal Khan &amp; Co, Remittance Cost Calculator</a> — the send-side cost model this study tests and then inverts, and the source of the three-layer framing (sending side, correspondent banking, payout partner).</li>
<li><a href="https://sdgs.un.org/goals/goal10" target="_blank" rel="noopener noreferrer">United Nations, Sustainable Development Goal 10</a> — target 10.c: reduce remittance transaction costs to less than 3 per cent and eliminate corridors above 5 per cent by 2030.</li>
<li><a href="https://unstats.un.org/sdgs/metadata/files/Metadata-10-0C-01.pdf" target="_blank" rel="noopener noreferrer">UN Statistics Division, SDG indicator 10.c.1 metadata</a> — defines the indicator as the total cost of sending $200, expressed as a percentage of the amount sent.</li>
<li><a href="https://data.worldbank.org/indicator/SI.RMT.COST.IB.ZS" target="_blank" rel="noopener noreferrer">World Bank, average transaction cost of sending remittances</a> — the Remittance Prices Worldwide indicator used for the ~6.49% global benchmark and the provider-category comparison.</li>
</ul>

<p><strong>Related reading.</strong> <a href="/guides/average-remittance-fees-2026">Average remittance fees 2026</a> compares cost <em>levels</em> between World Bank data and live quotes; this study addresses cost <em>composition</em>. <a href="/guides/exchange-rate-markup-explained">Exchange rate markup explained</a> covers the mechanism. Our full method and its limits are documented at <a href="/methodology">how we collect and rank quotes</a>.</p>`,
      },
    ],
    faqs: [
      {
        question: "What share of a money transfer's cost is hidden in the exchange rate?",
        answer:
          "Across 74,044 quotes collected between March and September 2026, 33.5% of the total cost of a transfer was an exchange-rate margin rather than a disclosed fee, measured on a $100 transfer. That share rises sharply with the amount sent: on the same providers and corridors, the margin accounted for 37% of cost at $100 and 82% at $1,000, because fees are fixed while margins are proportional.",
      },
      {
        question: "Is a zero-fee money transfer actually free?",
        answer:
          "No. 31.1% of the quotes we collected advertised no fee, and their median true cost was still 1.23% — taken entirely as an exchange-rate margin. 13.8% of zero-fee quotes cost more than 3%, 4.4% cost more than 5%, and the most expensive we recorded cost 17.5%. On 20.7% of corridor-days where a zero-fee option existed, a provider charging a fee was cheaper overall.",
      },
      {
        question: "At what transfer size does the exchange rate matter more than the fee?",
        answer:
          "For most mainstream providers, between about $113 and $260, at a median of $182. Below that the flat fee is the larger cost and comparing fees works well; above it the exchange-rate margin dominates and the fee is close to irrelevant. The exception is Wise, whose median margin of 0.02% means the fee stays the main cost to about $21,950, and providers like OFX, TransferGo, Skrill, LemFi and Instarem, which charge no fee at all so the margin is 100% of the cost at every amount.",
      },
      {
        question: "Does picking the lowest fee get you the cheapest transfer?",
        answer:
          "About three times in four. Across 8,934 corridor-days with at least three competing providers, the lowest advertised fee identified the genuinely cheapest transfer 75.5% of the time. In the remaining 24.5% it cost a median of 0.80% of the transfer — roughly $8 on $1,000 or $39.89 on $5,000, and more than 1.65% in the worst quarter of cases.",
      },
      {
        question: "How much of my money actually arrives when I send abroad?",
        answer:
          "On the median transfer in our sample, 97.56% of the money arrives — the total cost, fee and exchange-rate margin combined, was 2.44%. But the split matters more than the median. Two thirds of that cost was a disclosed fee and one third an exchange-rate margin at a $100 send, and on a $1,000 send the margin accounted for 82% of it. The only reliable way to know what arrives is to compare the receive amount itself, since it is the one figure that already contains both components.",
      },
      {
        question: "Is it cheaper to send $100 or $1,000 internationally?",
        answer:
          "Proportionally, $1,000 is much cheaper. Measuring the same providers on the same corridors on the same days, a $100 transfer cost 3.16% of the amount sent while a $1,000 transfer cost 1.11% — roughly a third as much in percentage terms. In absolute money the larger transfer still costs more, about $11 against $3.16. What changes is the composition: the fee accounted for 63% of the cost at $100 and only 17.9% at $1,000.",
      },
      {
        question: "Why do small international transfers cost more proportionally?",
        answer:
          "Because most of what you pay on a small transfer is a flat fee, and a flat fee is a larger share of a smaller amount. A $1.99 fee is 2% of $100 but 0.04% of $5,000. The exchange-rate margin behaves the opposite way — it is charged as a percentage, so it stays constant no matter the size. That is why our measured cost fell from 3.16% at $100 to 1.11% at $1,000 on identical quotes, and why the advice to compare fees stops working above roughly $182.",
      },
      {
        question: "Is Wise good for small transfers under $200?",
        answer:
          "Wise is structurally the wrong shape for very small transfers, though not because it is expensive overall. Its cost is almost entirely an upfront fee — a median of $4.39 against a median exchange-rate margin of just 0.02%, which is effectively nothing. A fixed fee of that size is a large percentage of $100 and a trivial one of $5,000, so Wise reads poorly at small amounts and strongly at large ones. Providers charging little or no fee and taking their margin in the rate invert that.",
      },
      {
        question: "What is the cheapest way to send a large amount of money overseas?",
        answer:
          "On large amounts, ignore the fee and compare the exchange rate, because above about $182 with mainstream providers the margin is already the bigger half of the cost, and by $1,000 it is 82% of it. A provider advertising no fee can be the most expensive option at that size — the worst zero-fee quote in our sample cost 17.5%. Compare the amount that actually arrives rather than the fee schedule, and re-check per transfer: on corridors we tracked for 60 days or more, the cheapest provider changed a median of 18 times.",
      },
      {
        question: "Do remittances meet the UN's 3% cost target?",
        answer:
          "Measured on true cost, 60.8% of the quotes in our sample came in under SDG target 10.c's 3% threshold. Measured on the disclosed fee alone — which is what a sender can actually check — 80.8% appear to. The 20.4 percentage point gap is made up of transfers that pass the target on paper and fail it in practice once the exchange-rate margin is counted.",
      },
    ],
    relatedSlugs: [
      "exchange-rate-markup-explained",
      "hidden-fees-international-transfers",
      "average-remittance-fees-2026",
      "cost-of-sending-1000-abroad",
    ],
  },
];
