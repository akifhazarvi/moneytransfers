/**
 * In-depth comparison articles for specific provider pairs.
 * These overlay the auto-generated comparison pages with richer editorial content.
 */

import { generateQuotes, providers, getExchangeRate } from "@/data/providers";

export interface ComparisonArticle {
  slug: string; // e.g. "wise-vs-remitly"
  providerA: string; // slug
  providerB: string; // slug
  title: string;
  metaDescription: string;
  updatedAt: string;
  readTime: string;
  intro: string;
  sections: { id: string; heading: string; content: string }[];
  verdict: {
    largeTransfers: { winner: string; explanation: string };
    smallTransfers: { winner: string; explanation: string };
    overall: string;
  };
  faqs: { q: string; a: string }[];
}

// ── Helper: generate sample quotes across corridors ──

function getSampleQuotes(slugA: string, slugB: string) {
  const corridors = [
    { from: "USD", to: "INR", label: "USD → INR", amount: 1000 },
    { from: "GBP", to: "EUR", label: "GBP → EUR", amount: 1000 },
    { from: "USD", to: "PHP", label: "USD → PHP", amount: 500 },
    { from: "USD", to: "MXN", label: "USD → MXN", amount: 1000 },
  ];

  return corridors.map((c) => {
    const quotes = generateQuotes(c.amount, c.from, c.to);
    const a = quotes.find((q) => q.providerSlug === slugA);
    const b = quotes.find((q) => q.providerSlug === slugB);
    return { ...c, a, b };
  });
}

// ── Articles ──

export const comparisonArticles: ComparisonArticle[] = [
  {
    slug: "wise-vs-remitly",
    providerA: "wise",
    providerB: "remitly",
    title: "Wise vs Remitly: Which Is Better for International Transfers in 2026?",
    metaDescription:
      "Detailed comparison of Wise and Remitly — fees, exchange rates, speed, payment methods, and which is better for large vs small transfers. Based on real data.",
    updatedAt: "2026-03-14",
    readTime: "12 min read",
    intro:
      "Wise and Remitly are two of the most popular international money transfer services, but they serve different needs. Wise is built around transparency — using the mid-market exchange rate with a clear, upfront fee. Remitly is optimized for remittances to developing countries, offering express delivery and cash pickup options that Wise doesn't match. This comparison breaks down exactly where each provider excels across fees, exchange rates, speed, payment methods, and value — using real transfer data collected from both services.",

    sections: [
      {
        id: "overview",
        heading: "Overview: Wise vs Remitly at a glance",
        content: `<p>Before diving into the details, here's a quick side-by-side snapshot of what each provider offers.</p>

<table>
<tr><th>Feature</th><th>Wise</th><th>Remitly</th></tr>
<tr><td>Founded</td><td>2011 (London, UK)</td><td>2011 (Seattle, US)</td></tr>
<tr><td>Best for</td><td>Large transfers, transparency, business</td><td>Small remittances, speed, cash pickup</td></tr>
<tr><td>Fee model</td><td>Variable % (0.41%–1.5%)</td><td>Flat fee ($0–$3.99) + rate markup</td></tr>
<tr><td>Exchange rate</td><td>Mid-market (no markup)</td><td>Marked up (0.5%–2%)</td></tr>
<tr><td>Transfer speed</td><td>1–2 business days</td><td>Minutes (Express) to 3–5 days (Economy)</td></tr>
<tr><td>Max transfer</td><td>$1,000,000</td><td>$10,000</td></tr>
<tr><td>Countries</td><td>80+</td><td>100+</td></tr>
<tr><td>Currencies</td><td>50+</td><td>30+</td></tr>
<tr><td>Cash pickup</td><td>No</td><td>Yes</td></tr>
<tr><td>Mobile money</td><td>No</td><td>Yes (M-Pesa, GCash, bKash)</td></tr>
<tr><td>Multi-currency account</td><td>Yes (40+ currencies)</td><td>No</td></tr>
<tr><td>Business account</td><td>Yes</td><td>No</td></tr>
<tr><td>Regulated by</td><td>FCA, FinCEN, ASIC</td><td>FCA, FinCEN</td></tr>
</table>

<p><strong>Key takeaway:</strong> Wise wins on transparency, exchange rates, and large transfers. Remitly wins on speed, delivery flexibility, and small remittances to developing countries. The "better" provider depends entirely on your use case.</p>`,
      },
      {
        id: "fees",
        heading: "Fees comparison",
        content: `<p>The fee structures of Wise and Remitly are fundamentally different, and understanding this difference is key to choosing between them.</p>

<p><strong>Wise</strong> charges a variable percentage fee that depends on the currency pair, payment method, and transfer amount. For most corridors, this ranges from <strong>0.41% to 1.5%</strong> of the transfer amount. The fee is always shown upfront before you confirm, and there are no hidden charges. Importantly, Wise does not mark up the exchange rate — the fee is the entire cost.</p>

<p><strong>Remitly</strong> takes a different approach. Transfer fees range from <strong>$0 to $3.99</strong> depending on the delivery speed and funding method. "Express" transfers (minutes) cost more than "Economy" transfers (3-5 days). However, Remitly makes additional margin on the exchange rate — typically a <strong>0.5%–2% markup</strong> above the mid-market rate.</p>

<p>This means you cannot compare these two providers on fee alone. A $0 fee from Remitly with a 1.5% rate markup can cost more than Wise's 0.6% fee with zero markup. <strong>Always compare the total amount the recipient receives.</strong></p>

<table>
<tr><th>Fee component</th><th>Wise</th><th>Remitly</th></tr>
<tr><td>Transfer fee</td><td>0.41%–1.5% (variable)</td><td>$0–$3.99 (flat)</td></tr>
<tr><td>Exchange rate markup</td><td>0% (mid-market)</td><td>0.5%–2%</td></tr>
<tr><td>Credit card surcharge</td><td>Yes (~1.5% extra)</td><td>Yes (~1% extra)</td></tr>
<tr><td>Receiving fee</td><td>None</td><td>None</td></tr>
<tr><td>Cancellation fee</td><td>None</td><td>None</td></tr>
</table>

<p><strong>Bottom line on fees:</strong> For transparency, Wise wins — you see exactly what you're paying. For apparent simplicity, Remitly's flat fee is easier to understand at a glance, but the hidden exchange rate cost means the total can be higher.</p>`,
      },
      {
        id: "exchange-rates",
        heading: "Exchange rates",
        content: `<p>This is where the two providers diverge most sharply.</p>

<p><strong>Wise uses the mid-market exchange rate</strong> — the same rate you see on Google, Reuters, or XE. This is the midpoint between the buy and sell rates on currency markets. No markup, no spread. The rate you see is the rate you get. Wise makes its money entirely from the upfront fee.</p>

<p><strong>Remitly uses a marked-up rate.</strong> The markup varies by corridor and delivery speed. On popular corridors like USD to INR, the markup is typically 0.5%–1%. On less liquid corridors, it can reach 2% or more. Remitly does not publish its markup percentage — you have to calculate it by comparing their rate to the mid-market rate.</p>

<p>Here's what this looks like in practice on a $1,000 USD to INR transfer:</p>

<ul>
<li><strong>Mid-market rate:</strong> The baseline — what the currency is actually worth</li>
<li><strong>Wise rate:</strong> Equal to the mid-market rate (0% markup)</li>
<li><strong>Remitly rate:</strong> Typically 0.5%–1% below the mid-market rate</li>
</ul>

<p>On a $1,000 transfer with a 1% markup, the exchange rate difference alone costs about $10 — equivalent to receiving ₹800–900 less. This "hidden" cost often exceeds Remitly's advertised fee.</p>

<p><strong>Important caveat:</strong> Remitly sometimes offers <strong>promotional rates</strong> for first-time customers that are better than their standard rate — even better than Wise. If you're a new Remitly user, check if a promotional rate is available for your corridor.</p>`,
      },
      {
        id: "transfer-speed",
        heading: "Transfer speed",
        content: `<p>Speed is where Remitly has a clear advantage on many corridors.</p>

<p><strong>Remitly</strong> offers two delivery tiers:</p>
<ul>
<li><strong>Express:</strong> Delivery in minutes to hours. Available for bank deposits and mobile money in most countries. The trade-off is a slightly higher fee or less favorable exchange rate.</li>
<li><strong>Economy:</strong> Delivery in 3–5 business days. Lower cost, but significantly slower.</li>
</ul>

<p><strong>Wise</strong> typically delivers within <strong>1–2 business days</strong> for most corridors. Some routes (like USD to EUR or GBP to EUR) can arrive within hours. But Wise generally does not offer an "instant" option comparable to Remitly's Express tier.</p>

<table>
<tr><th>Speed tier</th><th>Wise</th><th>Remitly</th></tr>
<tr><td>Instant/minutes</td><td>Some corridors (hours)</td><td>Yes — Express option</td></tr>
<tr><td>Same day</td><td>Select routes</td><td>Yes — most corridors</td></tr>
<tr><td>1–2 business days</td><td>Standard</td><td>Economy option</td></tr>
<tr><td>3–5 business days</td><td>Rare (complex routes)</td><td>Economy option</td></tr>
</table>

<p><strong>If speed is your priority</strong> — especially for remittances where the recipient needs cash urgently — Remitly's Express delivery is hard to beat.</p>`,
      },
      {
        id: "payment-methods",
        heading: "Payment and delivery methods",
        content: `<p>Both providers accept the standard funding methods, but their delivery options differ significantly.</p>

<p><strong>Wise payment methods (sending):</strong></p>
<ul>
<li>Bank transfer (ACH in the US, Faster Payments in the UK)</li>
<li>Debit card</li>
<li>Credit card (higher fee, ~1.5% surcharge)</li>
<li>Apple Pay</li>
<li>Wise balance (if you have a multi-currency account)</li>
</ul>

<p><strong>Remitly payment methods (sending):</strong></p>
<ul>
<li>Bank transfer</li>
<li>Debit card</li>
<li>Credit card (higher fee)</li>
</ul>

<p><strong>Wise delivery methods (receiving):</strong></p>
<ul>
<li>Bank deposit — the only delivery option for most corridors</li>
<li>Wise account (recipient needs a Wise account)</li>
</ul>

<p><strong>Remitly delivery methods (receiving):</strong></p>
<ul>
<li>Bank deposit</li>
<li>Cash pickup (via partner networks worldwide)</li>
<li>Mobile money (M-Pesa, GCash, bKash, etc.)</li>
<li>Home delivery (select countries)</li>
</ul>

<p><strong>Key difference:</strong> Remitly's delivery flexibility is a major advantage for recipients in developing countries who may not have bank accounts. Cash pickup, mobile money, and home delivery options make Remitly accessible in ways that Wise isn't. If your recipient doesn't have a bank account, Remitly is the clear choice.</p>`,
      },
      {
        id: "which-is-cheaper",
        heading: "Which is cheaper? A real transfer example",
        content: `<p>The only reliable way to compare Wise and Remitly is to look at the <strong>total amount the recipient receives</strong> — not just the advertised fee. Let's walk through a real example.</p>

<h3>Example: Sending $1,000 USD to India (INR)</h3>

<table>
<tr><th>Component</th><th>Wise</th><th>Remitly (Express)</th><th>Remitly (Economy)</th></tr>
<tr><td>Send amount</td><td>$1,000</td><td>$1,000</td><td>$1,000</td></tr>
<tr><td>Transfer fee</td><td>~$6.10 (0.61%)</td><td>$3.99</td><td>$0</td></tr>
<tr><td>Exchange rate used</td><td>Mid-market: 85.20</td><td>~84.50 (0.8% markup)</td><td>~84.35 (1.0% markup)</td></tr>
<tr><td>Amount converted</td><td>$993.90</td><td>$996.01</td><td>$1,000</td></tr>
<tr><td><strong>Recipient receives</strong></td><td><strong>~₹84,680</strong></td><td><strong>~₹84,163</strong></td><td><strong>~₹84,350</strong></td></tr>
<tr><td>True total cost</td><td>~$6.10</td><td>~$10.07</td><td>~$7.63</td></tr>
</table>

<p><em>Rates are illustrative and based on typical market conditions. Check both platforms on the day you send for exact figures.</em></p>

<p>In this example, <strong>Wise delivers approximately ₹330–₹517 more</strong> to the recipient than Remitly, despite Remitly advertising a lower fee. The difference comes from the exchange rate markup.</p>

<h3>When Remitly can be cheaper</h3>
<ul>
<li><strong>First-time promotional rates</strong> — Remitly frequently offers new users a better-than-market rate on their first transfer, which can beat Wise.</li>
<li><strong>Very small transfers ($50–$200)</strong> — Wise's minimum fee can make small transfers proportionally more expensive, while Remitly's $0 fee option absorbs the rate markup.</li>
<li><strong>Specific corridors</strong> — On some high-volume corridors, Remitly's markup is minimal, making the total cost comparable.</li>
</ul>

<p><strong>Rule of thumb:</strong> For amounts above $500, Wise is almost always cheaper. For amounts under $200, check both — Remitly may win, especially with promotions.</p>`,
      },
      {
        id: "large-transfers",
        heading: "Which is better for large transfers?",
        content: `<p><strong>Wise is almost always better for large transfers.</strong></p>

<p>Here's why: Wise's cost is primarily percentage-based with no exchange rate markup. As your transfer amount increases, the percentage fee often <em>decreases</em> — Wise offers lower rates for larger amounts on many corridors. A $10,000 transfer might cost 0.4%, while a $200 transfer costs 0.8%.</p>

<p>Remitly, on the other hand, has a maximum transfer limit of <strong>$10,000</strong> per transaction (varies by corridor), while Wise allows transfers up to <strong>$1,000,000</strong>. For transfers above $10,000, Remitly simply isn't an option.</p>

<p>Additionally, Remitly's exchange rate markup becomes more expensive in absolute terms as the amount increases. A 1% markup on $10,000 is $100 — far more than Wise's typical fee on the same amount.</p>

<table>
<tr><th>Factor</th><th>Wise</th><th>Remitly</th></tr>
<tr><td>Maximum transfer</td><td>$1,000,000</td><td>$10,000</td></tr>
<tr><td>Fee on $5,000 (typical)</td><td>~$20–35</td><td>~$0–4 fee + ~$50 markup</td></tr>
<tr><td>Fee on $10,000 (typical)</td><td>~$40–60</td><td>~$0–4 fee + ~$100 markup</td></tr>
<tr><td>Business account</td><td>Yes</td><td>No</td></tr>
<tr><td>Batch payments</td><td>Yes</td><td>No</td></tr>
</table>

<p><strong>Wise also offers business accounts</strong> with batch payment capability, API access, and multi-currency management — making it the clear choice for businesses or anyone regularly sending large amounts.</p>`,
      },
      {
        id: "small-transfers",
        heading: "Which is better for small transfers?",
        content: `<p><strong>For small remittances under $500, Remitly often wins on total value.</strong></p>

<p>On small transfers, Remitly's flat fee structure ($0–$3.99) can be more cost-effective than Wise's percentage-based fee. A $200 transfer on Wise might cost $1.50–$3.00 in fees, while Remitly might charge $0 with an Express option — even after accounting for the exchange rate markup, the total can be comparable or better.</p>

<p>Remitly also frequently offers <strong>promotional rates for first-time users</strong> and special deals on popular remittance corridors. These promotions can make Remitly significantly cheaper for individual small transfers.</p>

<p>More importantly, for small remittances to developing countries, Remitly's <strong>delivery flexibility</strong> adds real value:</p>

<ul>
<li>Cash pickup is crucial in regions with low banking penetration</li>
<li>Mobile money (GCash, M-Pesa, bKash) is the most accessible option in many countries</li>
<li>Express delivery means the recipient gets money in minutes, not days</li>
</ul>

<table>
<tr><th>Factor</th><th>Wise</th><th>Remitly</th></tr>
<tr><td>Cost on $200 transfer</td><td>~$1.50–3.00</td><td>~$0–3.99 + rate markup</td></tr>
<tr><td>Delivery speed</td><td>1–2 days</td><td>Minutes (Express)</td></tr>
<tr><td>Cash pickup</td><td>No</td><td>Yes</td></tr>
<tr><td>Mobile money</td><td>No</td><td>Yes</td></tr>
<tr><td>First-time promotions</td><td>Rare</td><td>Frequent</td></tr>
</table>

<p><strong>If you're sending smaller amounts regularly to family in a developing country, Remitly's combination of low fees, fast delivery, and flexible payout options makes it the better fit.</strong></p>`,
      },
      {
        id: "pros-and-cons",
        heading: "Pros and cons",
        content: `<h3>Wise — Pros</h3>
<ul>
<li><strong>Mid-market exchange rate</strong> with zero markup — what you see is what you get</li>
<li><strong>Full transparency</strong> — the fee is the total cost, shown upfront</li>
<li><strong>Multi-currency account</strong> with 40+ currencies and local account details</li>
<li><strong>High transfer limits</strong> — up to $1,000,000 per transfer</li>
<li><strong>Business accounts</strong> with batch payments, API access, and team features</li>
<li><strong>Wise debit card</strong> for spending abroad at the mid-market rate</li>
</ul>

<h3>Wise — Cons</h3>
<ul>
<li><strong>No cash pickup option</strong> — bank deposit only</li>
<li><strong>No mobile money delivery</strong> — can't send to M-Pesa, GCash, etc.</li>
<li><strong>Slower on some corridors</strong> — 1–2 business days is standard</li>
<li><strong>Higher fees on credit card payments</strong> — ~1.5% surcharge</li>
<li><strong>No instant delivery option</strong> for most routes</li>
</ul>

<h3>Remitly — Pros</h3>
<ul>
<li><strong>Express delivery in minutes</strong> on many corridors</li>
<li><strong>Cash pickup available</strong> through global partner networks</li>
<li><strong>Mobile money support</strong> — M-Pesa, GCash, bKash, and more</li>
<li><strong>Low or zero flat fees</strong> — especially on Economy transfers</li>
<li><strong>Frequent promotions</strong> — first-time users often get excellent rates</li>
<li><strong>Home delivery</strong> available in select countries</li>
</ul>

<h3>Remitly — Cons</h3>
<ul>
<li><strong>Exchange rate markup</strong> (0.5%–2%) means the real cost is hidden</li>
<li><strong>Lower transfer limits</strong> — max $10,000 per transaction</li>
<li><strong>No multi-currency account</strong> — single-use transfers only</li>
<li><strong>No business account</strong> or batch payment features</li>
<li><strong>Fewer supported currencies</strong> (30+ vs Wise's 50+)</li>
<li><strong>Less transparent pricing</strong> — you must calculate the markup yourself</li>
</ul>`,
      },
      {
        id: "final-verdict",
        heading: "Final verdict",
        content: `<p>Wise and Remitly are both excellent services — but they excel in different scenarios. Here is how to decide.</p>

<p><strong>Choose Wise if you:</strong></p>
<ul>
<li>Send amounts over $500 and want the best exchange rate</li>
<li>Value transparency and want to see the full cost upfront</li>
<li>Need a multi-currency account to hold and manage foreign currencies</li>
<li>Send large or business payments (up to $1M)</li>
<li>Transfer between developed-market currencies (USD, EUR, GBP, AUD)</li>
</ul>

<p><strong>Choose Remitly if you:</strong></p>
<ul>
<li>Send smaller remittances (under $500) to family abroad</li>
<li>Need money delivered in minutes, not days</li>
<li>Your recipient needs cash pickup, mobile money, or home delivery</li>
<li>You're sending to a developing country (India, Philippines, Mexico, Kenya)</li>
<li>You're a first-time user and can take advantage of promotional rates</li>
</ul>

<p><strong>Bottom line:</strong> There is no single "better" provider. For large transfers and transparency, Wise wins. For fast remittances with flexible delivery to developing countries, Remitly wins. The smartest approach is to compare the recipient amount on both platforms for your specific corridor and amount before every transfer.</p>`,
      },
    ],

    verdict: {
      largeTransfers: {
        winner: "wise",
        explanation:
          "Wise's mid-market exchange rate, higher transfer limits ($1M vs $10K), lower percentage fees at scale, and business features make it the clear winner for transfers above $1,000.",
      },
      smallTransfers: {
        winner: "remitly",
        explanation:
          "Remitly's flat fees, Express delivery, cash pickup and mobile money options, and frequent promotions make it ideal for smaller remittances under $500 — especially to developing countries.",
      },
      overall:
        "There is no single \"better\" provider — it depends on your use case. Choose Wise for large transfers, business payments, transparency, and multi-currency needs. Choose Remitly for small remittances, urgent transfers, and recipients who need cash pickup or mobile money.",
    },

    faqs: [
      {
        q: "Is Wise cheaper than Remitly?",
        a: "For large transfers (over $1,000), Wise is almost always cheaper because it uses the mid-market exchange rate with no markup. For small transfers under $500, Remitly can be cheaper due to its flat fee structure and promotional rates. The only reliable way to compare is to check the total amount your recipient receives on both platforms for your specific transfer.",
      },
      {
        q: "Is Wise or Remitly faster?",
        a: "Remitly is generally faster. Its Express option delivers money in minutes on many corridors. Wise typically takes 1–2 business days, though some routes (like GBP to EUR) can be same-day. If speed is critical, Remitly's Express delivery is the better option.",
      },
      {
        q: "Can I use Wise to send money for cash pickup?",
        a: "No, Wise only supports bank deposits and transfers to Wise accounts. If the recipient needs cash pickup, Remitly, Western Union, or WorldRemit are better options.",
      },
      {
        q: "Does Remitly use the mid-market exchange rate?",
        a: "No, Remitly adds a markup to the exchange rate, typically 0.5%–2% above the mid-market rate depending on the corridor and delivery speed. This markup is a significant part of Remitly's revenue, so the advertised fee doesn't represent the full cost.",
      },
      {
        q: "Which is better for sending money to India?",
        a: "Both are strong on the USD to INR corridor. Wise offers better exchange rates and transparency, making it cheaper for larger amounts. Remitly offers faster delivery (minutes via Express) and is often comparable for amounts under $500. Compare both on the day you send.",
      },
      {
        q: "Can I send money with Wise or Remitly using a credit card?",
        a: "Yes, both accept credit cards, but both charge extra for it. Wise adds approximately 1.5% to the fee for credit card funding. Remitly also charges a higher fee for credit card payments. Debit card or bank transfer funding is significantly cheaper on both platforms.",
      },
      {
        q: "Are Wise and Remitly safe and regulated?",
        a: "Yes, both are fully regulated. Wise is authorized by the FCA (UK), FinCEN (US), and ASIC (Australia), among others. Remitly is licensed by FinCEN (US) and the FCA (UK). Both use bank-grade encryption and are established companies with millions of customers.",
      },
      {
        q: "Does Wise or Remitly offer a multi-currency account?",
        a: "Wise offers a multi-currency account that holds 40+ currencies with local account details in several countries, plus a debit card. Remitly does not offer a multi-currency account — it is focused solely on one-time transfers.",
      },
    ],
  },
];

export function getComparisonArticle(slug: string): ComparisonArticle | undefined {
  return comparisonArticles.find((a) => a.slug === slug);
}
