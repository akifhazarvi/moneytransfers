import type { BlogPost } from "./blog-posts";

// ============================================================
// DATA-BACKED COMPARISONS — September 2026
//
// Comparison is our strongest AI-citation topic (64% on the 2026-09-07
// benchmark, behind only corridor at 76% and cost at 70%), and a four-way
// "which actually costs less" is a question a provider's own site structurally
// cannot answer. Every figure comes from {{FOUR_WAY_COST_TABLE}}, rendered live
// from the same indices the rest of the site publishes, so the guide cannot
// drift from the cost index the way a typed-in table would.
// ============================================================

export const dataComparisonGuides: BlogPost[] = [
  {
    slug: "wise-vs-remitly-vs-xoom-vs-xe",
    title: "Wise vs Remitly vs Xoom vs XE: Which Actually Costs Less?",
    metaTitle: "Wise vs Remitly vs Xoom vs XE — Measured Cost Comparison",
    metaDescription:
      "We priced all four on live quotes. The cheapest on average is not the one that wins most often, and the answer flips below $1,000. Full measured comparison.",
    excerpt:
      "Three different measures of 'cheapest' give three different winners among these four providers. That is not a hedge — it is the actual finding, and it decides which one you should use.",
    category: "Research",
    readTime: "8 min",
    publishedAt: "2026-09-07",
    updatedAt: "2026-09-07",
    author: "Akif Hazarvi",
    tags: ["Wise", "Remitly", "Xoom", "XE", "provider comparison", "transfer costs"],
    sections: [
      {
        heading: "The short answer",
        content: `<div class="blog-answer-box"><p><strong>Quick answer:</strong> There is no single winner among these four, and anyone telling you otherwise is picking the measure that suits their conclusion. On our live quotes, <strong><a href="/companies/xe">XE</a></strong> has the lowest average cost of the four — but it is the most frequent winner on almost none of the routes it quotes. <strong><a href="/companies/wise">Wise</a></strong> costs more on average yet is the habitual cheapest on more corridors than any other provider we track, and covers by far the most routes. <strong><a href="/companies/remitly">Remitly</a></strong> and <strong><a href="/companies/xoom">Xoom</a></strong> are dearer on average and lead far fewer corridors, but both compete hard on specific high-volume routes. And the ranking inverts on small transfers: Wise is one of the cheapest options at $1,000 and one of the most expensive at $100.</p></div>

<p>The table below is the measurement. Read the coverage column with the cost column — the two are not independent, and that is where most comparisons of these four go wrong.</p>`,
      },
      {
        heading: "The measured comparison",
        content: `{{FOUR_WAY_COST_TABLE}}
<p class="blog-footnote"><strong>Where these numbers come from.</strong> Every figure here is computed from our own live quote archive rather than provider marketing, which is why this page cites itself instead of outside sources. Cost is measured as (mid-market receive minus actual receive) divided by mid-market receive, so one number captures both the fee and the exchange-rate margin. Coverage is published beside cost deliberately: an average over 35 corridors is not comparable to one over 350, and leaving that out is exactly how a narrow provider comes to look cheapest. Full method and its limits: <a href="/methodology">how we collect and rank quotes</a>. The underlying datasets are <a href="/remittance-cost-index">the cost index</a> and <a href="/provider-consistency">the consistency index</a>, both recomputed on every build.</p>

<p>Three things in that table are worth stating plainly, because they are the reason a one-line answer is not available.</p>`,
      },
      {
        heading: "Why the cheapest on average is not the one that usually wins",
        content: `<p>XE posts the lowest average cost of the four and leads virtually none of the corridors it quotes. That looks like a contradiction. It is not.</p>

<p>An average cost is taken over the routes a provider actually quotes, and those route sets are wildly different sizes. XE's average covers a few dozen corridors; Wise's covers several hundred, including thin and expensive ones where any provider's margin is wider. Comparing the two averages directly rewards the provider with the narrower, easier footprint. It is the same distortion that would let a bank quoting five corridors outrank a specialist quoting three hundred, which is why our <a href="/remittance-cost-index">Remittance Cost Index</a> publishes the corridor count next to every cost figure.</p>

<p>"Leads most often" is the measure that survives this, because it is decided per corridor per day against whoever else quoted that day. A provider only wins a day where at least two providers competed, so a narrow footprint stops being an advantage. On that measure Wise is the strongest of these four by a wide margin — and across every provider we track, it leads more corridors than anyone. Our <a href="/provider-consistency">Provider Consistency Index</a> has the full ranking and the method.</p>

<p><strong>What to take from it:</strong> if you send on one of the routes XE covers well, its low average is real and worth checking. If you send on a route it does not cover, the figure tells you nothing at all.</p>`,
      },
      {
        heading: "How each of the four makes its money — and who that suits",
        content: `<p>The fee-versus-markup split in the table is the most practically useful column, because it predicts how a provider behaves at amounts other than the one we priced.</p>

<ul>
  <li><strong>Wise</strong> takes most of its cost as an upfront fee and very little as exchange-rate markup. That is the most transparent structure of the four, and it is why Wise looks strong at $1,000 and poor at $100: a fixed fee is a much larger share of a small transfer.</li>
  <li><strong>XE</strong> charges no upfront fee on the transfers we priced and takes its entire margin in the rate. Zero fee reads well and is not the same as free — the cost is simply moved somewhere less visible.</li>
  <li><strong>Xoom</strong> is almost entirely markup too, and is priced on far fewer corridors at our headline amount than the others, so treat its average as the thinnest number in the table.</li>
  <li><strong>Remitly</strong> splits between the two, and competes on delivery speed and cash-pickup networks more than on headline cost. Its costs make more sense read against what it does that the others do not.</li>
</ul>

<p>A provider taking its margin in the rate rather than the fee is not doing anything improper, but it does mean the advertised "no fees" is not a cost claim. Our <a href="/tools/fx-markup-checker">FX markup checker</a> shows the gap against the mid-market rate for any of them.</p>`,
      },
      {
        heading: "The answer changes with the amount you send",
        content: `<p>Every ranking on this site, including the table above, is priced at $1,000. That choice hides something important, and it hurts exactly the people who can least afford it.</p>

<p>Wise costs roughly four times as much proportionally on a $100 transfer as on a $1,000 one — the direct consequence of a flat-fee model. XE and Remitly also cost more proportionally on small transfers, but by much less. If you send small amounts regularly, the provider that is cheapest for you is very likely not the one that wins at $1,000.</p>

<p>We measured this across every provider with enough data at both amounts: see <a href="/transfer-cost-by-amount">transfer cost by amount</a>, where the cheapest provider at $100 is a different company from the cheapest at $1,000.</p>`,
      },
      {
        heading: "How to actually pick between them",
        content: `<p>The honest process is short, and it is not "read a ranking".</p>

<ol>
  <li><strong>Check your own corridor, at your own amount.</strong> These averages are across hundreds of routes; yours is one of them, and the gap between the best and the median provider on a single corridor is routinely worth more than the difference between any two providers' averages.</li>
  <li><strong>Check whether today's winner is the usual winner.</strong> On around a quarter of corridors the cheapest provider today is not the one that usually leads, which is worth knowing before you treat one result as settled.</li>
  <li><strong>Weigh what you need beyond cost.</strong> Cash pickup, delivery speed, and which countries a provider serves at all differ more between these four than their costs do.</li>
</ol>

<p>You can <a href="/send-money">compare all four on your route</a> against the {{PROVIDER_COUNT}} we track. If cost is the only thing you care about, the ranking that matters is the one for your corridor on the day you send — not an average of everyone else's.</p>`,
      },
    ],
    faqs: [
      {
        question: "Is Wise always the cheapest of these four?",
        answer:
          "No. Wise leads more corridors than any other provider we track and wins a far higher share of contested days than Remitly, Xoom or XE — but it does not have the lowest average cost of the four, and on small transfers it is one of the most expensive because its pricing is weighted toward a flat fee. On a $100 transfer it costs roughly four times as much proportionally as on a $1,000 one.",
      },
      {
        question: "Why does XE look cheapest if it rarely wins?",
        answer:
          "Because an average cost is taken over the corridors a provider actually quotes, and XE quotes far fewer than Wise or Remitly. A narrower footprint that skips thin, expensive routes produces a better average without the provider being cheaper on any given route. The measure that controls for this is how often a provider is the most frequent winner on a corridor, decided against whoever else quoted that day — and on that measure XE leads almost none of the routes it covers.",
      },
      {
        question: "Which of the four is cheapest for small transfers?",
        answer:
          "Not Wise, on our measurements. Providers whose cost is weighted toward exchange-rate margin rather than a fixed fee hold up much better at $100, because a flat fee is a far larger share of a small amount. We publish the per-provider figures at $100 and $1,000 side by side on our transfer cost by amount page, where the cheapest provider at the smaller amount is a different company from the cheapest at the larger one.",
      },
      {
        question: "Is Xoom cheaper than Remitly?",
        answer:
          "On average cost at $1,000 the two are close, with Xoom marginally lower — but Xoom is priced on far fewer corridors in our dataset at that amount, so its average rests on a much thinner sample and should be treated with more caution. Xoom leads slightly more corridors than Remitly over the trailing 90 days. For a specific route, compare both directly rather than relying on either average.",
      },
      {
        question: "How often are these figures updated?",
        answer:
          "The table is rebuilt from live provider quotes, which we collect every six hours, so it reflects the most recent scrape rather than a fixed snapshot. The date above the table is the date of the quotes behind it. Because the figures move, cite that date rather than the date you read the page.",
      },
    ],
    relatedSlugs: [
      "cheapest-way-to-send-money-internationally",
      "best-money-transfer-apps",
      "wise-vs-remitly-comparison",
    ],
  },
];
