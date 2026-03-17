/**
 * Business payments hub content.
 *
 * Each entry drives a page under /business/[slug].
 * The hub page (/business) aggregates all subpages.
 */

export interface BusinessPage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heading: string;
  intro: string;
  sections: { heading: string; content: string }[];
  faqs: { question: string; answer: string }[];
  relatedGuides: string[];
}

export const businessPages: BusinessPage[] = [
  // ── Small Business / SME ──
  {
    slug: "small-business",
    title: "International Payments for Small Business",
    metaTitle:
      "Small Business International Payments — Compare Providers (2026)",
    metaDescription:
      "Find the cheapest way for small businesses to make international payments in 2026. Compare Wise Business, OFX, and Revolut for SME cross-border transfers, batch payments, and FX.",
    heading: "International Payments for Small Business & SMEs",
    intro:
      "Small businesses overpay on international transfers by an average of 3–5% through traditional banks. Specialist providers like Wise Business, OFX, and Revolut Business cut that to under 1% — saving thousands per year on supplier payments, contractor payroll, and invoice settlements.",
    sections: [
      {
        heading: "Why SMEs Overpay on International Transfers",
        content: `<p>Most small businesses default to their bank for international payments. That's expensive:</p>
<ul>
<li><strong>Wire fees</strong>: Banks charge $25–$50 per outgoing international wire</li>
<li><strong>FX markup</strong>: 2–5% above the mid-market exchange rate, hidden in the "bank rate"</li>
<li><strong>Intermediary fees</strong>: Correspondent banks in the SWIFT network each deduct $10–$25</li>
<li><strong>Slow processing</strong>: 3–5 business days vs. same-day with specialists</li>
</ul>
<p>On a $10,000 monthly payment to a foreign supplier, switching from a bank to <a href="/companies/wise">Wise Business</a> can save $200–$500 per month — $2,400–$6,000 per year.</p>`,
      },
      {
        heading: "Best Providers for Small Business Payments",
        content: `<div style="background: #f8f9fa; border-radius: 16px; padding: 24px; margin: 24px 0;">
<h3 style="margin-top: 0;">Quick Comparison: Best for SME International Payments</h3>
<table>
<thead><tr><th>Provider</th><th>Best For</th><th>FX Markup</th><th>Fees</th></tr></thead>
<tbody>
<tr style="background: #e8f5e9;"><td><strong><a href="/companies/wise">Wise Business</a></strong></td><td>Most SMBs (1–50 employees)</td><td>0% (mid-market rate)</td><td>0.41–0.71%</td></tr>
<tr><td><strong><a href="/companies/revolut">Revolut Business</a></strong></td><td>Startups & tech companies</td><td>0% (market hours)</td><td>Free tier available</td></tr>
<tr><td><strong><a href="/companies/ofx">OFX Business</a></strong></td><td>Larger transfers ($10K+)</td><td>0.3–1.5%</td><td>$0 fees</td></tr>
</tbody>
</table>
<p style="font-size: 14px; color: #5f6368; margin-bottom: 0;">Rates verified March 2026. <a href="/send-money">Compare live rates →</a></p>
</div>

<h3>Wise Business — Best Overall for SMEs</h3>
<p>Wise Business uses the real mid-market exchange rate (0% markup) with a transparent percentage fee. It offers multi-currency accounts in 10+ currencies, batch payments via CSV upload (up to 1,000 payments), API access, and direct integration with Xero and QuickBooks. Free to open — you only pay when you transfer.</p>

<h3>Revolut Business — Best for Startups</h3>
<p>Revolut Business offers interbank exchange rates during market hours with a generous free transfer allowance. Multi-currency accounts, expense management, corporate cards, and team access make it ideal for fast-growing companies. Free plan available with upgrades for higher volumes.</p>

<h3>OFX Business — Best for Large Transfers</h3>
<p>OFX charges zero transfer fees and assigns dedicated FX dealers for transfers over $10,000. Forward contracts let you lock in exchange rates for up to 12 months — essential for businesses managing FX risk on recurring supplier payments. Minimum transfer: $1,000.</p>`,
      },
      {
        heading: "Key Features SMEs Need",
        content: `<ul>
<li><strong>Multi-currency accounts</strong>: Hold, receive, and pay in foreign currencies without converting. Reduces the number of conversions and the FX cost.</li>
<li><strong>Batch payments</strong>: Upload a CSV of multiple payments (contractor payroll, supplier invoices) and process in one go. Wise and Revolut support this.</li>
<li><strong>Accounting integration</strong>: Direct sync with Xero, QuickBooks, and other accounting platforms. Wise Business has the deepest integrations.</li>
<li><strong>API access</strong>: Automate payments from your ERP or invoicing system. Wise's API is free and well-documented.</li>
<li><strong>Forward contracts</strong>: Lock in today's rate for a payment you'll make in the future. Available from OFX, TorFX, and XE. Essential for managing FX risk on large recurring payments.</li>
</ul>`,
      },
      {
        heading: "Sources & Methodology",
        content: `<p>Provider data verified from official business product pages as of March 2026. Fee comparisons based on real quotes from our comparison engine. See our <a href="/methodology">methodology page</a> for full details on how we collect and verify data.</p>`,
      },
    ],
    faqs: [
      {
        question:
          "What is the cheapest way for small businesses to send international payments?",
        answer:
          "For most SMBs, Wise Business offers the best combination of low costs (0% exchange rate markup), automation features (API, batch payments via CSV), and accounting integration (Xero, QuickBooks). The total cost is typically 0.41–0.71% per transfer — compared to 3–5% at most banks. For very large transfers ($50,000+), OFX may offer better rates through their dedicated dealing desk.",
      },
      {
        question:
          "How do SMEs reduce international payment costs?",
        answer:
          "Five strategies: (1) Switch from bank wires to specialist providers like Wise Business or OFX — saves 2–4% per transfer. (2) Use multi-currency accounts to hold foreign currencies and convert when rates are favorable. (3) Batch your payments to reduce per-transaction costs. (4) Use forward contracts to lock in rates for recurring payments. (5) Fund transfers via bank transfer rather than card to avoid card processing surcharges.",
      },
      {
        question:
          "Which business payment provider integrates with accounting software?",
        answer:
          "Wise Business offers direct integration with Xero and QuickBooks, automatically syncing transactions and exchange rate details. Revolut Business also connects with Xero, FreeAgent, and other accounting tools. OFX provides downloadable transaction reports compatible with most accounting software. For fully automated workflows, Wise's API allows programmatic payment initiation from any ERP or invoicing system.",
      },
    ],
    relatedGuides: [
      "business-international-payments-guide",
      "exchange-rate-markup-explained",
      "multi-currency-accounts-exchange-rates",
    ],
  },

  // ── Bulk & Batch Payments ──
  {
    slug: "bulk-payments",
    title: "Bulk International Payments",
    metaTitle:
      "Bulk & Batch International Payments — Compare Solutions (2026)",
    metaDescription:
      "Compare the best solutions for bulk and batch international payments in 2026. CSV upload, API integration, and mass payout tools from Wise, OFX, and Revolut Business.",
    heading: "Bulk & Batch International Payments for Business",
    intro:
      "Businesses making multiple international payments — contractor payroll, supplier invoices, affiliate payouts — need batch processing. Uploading a CSV file or using an API is dramatically faster and cheaper than sending individual wire transfers.",
    sections: [
      {
        heading: "How Batch International Payments Work",
        content: `<p>Instead of initiating each transfer individually (logging in, entering details, confirming), batch payment tools let you:</p>
<ol>
<li><strong>Prepare a spreadsheet</strong> with recipient names, bank details, amounts, and currencies</li>
<li><strong>Upload the CSV</strong> to your provider's platform</li>
<li><strong>Review and approve</strong> all payments in one screen</li>
<li><strong>Process all payments</strong> at once — the provider handles conversion and routing</li>
</ol>
<p>This saves hours of manual work and reduces errors. Most providers charge the same per-payment rate for batch transfers as individual ones.</p>`,
      },
      {
        heading: "Best Providers for Bulk Payments",
        content: `<div style="background: #f8f9fa; border-radius: 16px; padding: 24px; margin: 24px 0;">
<h3 style="margin-top: 0;">Batch Payment Provider Comparison</h3>
<table>
<thead><tr><th>Provider</th><th>Batch Method</th><th>Max per Batch</th><th>Currencies</th></tr></thead>
<tbody>
<tr style="background: #e8f5e9;"><td><strong><a href="/companies/wise">Wise Business</a></strong></td><td>CSV upload + API</td><td>1,000 payments</td><td>50+</td></tr>
<tr><td><strong><a href="/companies/revolut">Revolut Business</a></strong></td><td>CSV upload + API</td><td>1,000 payments</td><td>30+</td></tr>
<tr><td><strong><a href="/companies/ofx">OFX Business</a></strong></td><td>Dealing desk + CSV</td><td>Unlimited</td><td>50+</td></tr>
</tbody>
</table>
<p style="font-size: 14px; color: #5f6368; margin-bottom: 0;">Based on provider documentation. <a href="/send-money">Compare live rates →</a></p>
</div>

<h3>Wise Business — Best Self-Service Batch Payments</h3>
<p>Upload a CSV with up to 1,000 recipients, review all payments on one screen, and process them at the mid-market exchange rate. Wise's batch tool supports multi-currency payments in a single upload — pay contractors in INR, suppliers in EUR, and freelancers in PHP all at once. API access available for automated payouts.</p>

<h3>Revolut Business — Best for Regular Payroll</h3>
<p>Revolut's batch payment feature supports CSV upload and API integration. Particularly strong for regular monthly payroll to the same recipients — set up templates and reuse them. Interbank rates during market hours keep costs low.</p>

<h3>OFX Business — Best for High-Value Batches</h3>
<p>For businesses processing large total values ($100K+), OFX's dedicated dealing desk can negotiate better rates on the entire batch. Forward contracts available to lock in rates ahead of payment dates.</p>`,
      },
      {
        heading: "API Integration for Automated Payments",
        content: `<p>For businesses that need fully automated international payouts — marketplaces paying sellers, SaaS platforms paying affiliates, or companies processing regular payroll — API integration eliminates manual work entirely.</p>
<ul>
<li><strong>Wise API</strong>: Free, well-documented RESTful API. Create recipients, initiate transfers, track status, and receive webhooks. Supports all 50+ currencies. Most popular choice for developers.</li>
<li><strong>Revolut Business API</strong>: Similar capabilities to Wise with additional features for expense management and corporate card controls.</li>
<li><strong>Payoneer API</strong>: Specialized for marketplace and e-commerce payouts to sellers in 190+ countries.</li>
</ul>`,
      },
      {
        heading: "Sources & Methodology",
        content: `<p>Provider capabilities verified from official API documentation and business product pages as of March 2026. See our <a href="/methodology">methodology page</a> for details.</p>`,
      },
    ],
    faqs: [
      {
        question: "How do I make a bulk international payment?",
        answer:
          "The easiest method is CSV upload: prepare a spreadsheet with recipient names, bank details (IBAN or account number), amounts, and currencies, then upload it to a provider like Wise Business or Revolut Business. Review all payments on one screen and process them at once. For automated recurring batch payments, use the provider's API to initiate transfers programmatically from your ERP or invoicing system.",
      },
      {
        question:
          "What is the cheapest way to make batch international payments?",
        answer:
          "Wise Business offers the lowest all-in cost for most batch payments: 0% exchange rate markup (mid-market rate) plus a transparent fee of 0.41–0.71% per payment. For large total batch values ($100K+), OFX's dealing desk may negotiate better rates. Traditional bank batch wire transfers typically cost $25–$50 per payment plus 2–5% FX markup, making specialist providers 80–95% cheaper.",
      },
      {
        question:
          "Can I pay multiple currencies in one batch?",
        answer:
          "Yes. Wise Business and Revolut Business both support multi-currency batch uploads — you can include payments in USD, EUR, INR, PHP, and other currencies in a single CSV file. The provider converts each payment at the relevant exchange rate. OFX also supports multi-currency batches through their dealing desk.",
      },
    ],
    relatedGuides: [
      "business-international-payments-guide",
      "cheapest-way-to-send-money-internationally",
    ],
  },

  // ── Vendor Payments ──
  {
    slug: "vendor-payments",
    title: "International Vendor Payments",
    metaTitle:
      "International Vendor & Supplier Payments — Compare Solutions (2026)",
    metaDescription:
      "Compare the cheapest ways to pay international vendors and suppliers in 2026. FX management, forward contracts, invoice matching, and compliance for cross-border vendor payouts.",
    heading: "Paying International Vendors & Suppliers",
    intro:
      "Paying overseas suppliers and vendors is one of the most common — and most expensive — cross-border payment needs for businesses. Traditional bank wires cost $25–$50 per transfer with 2–5% FX markup. Specialist providers cut both, saving thousands annually.",
    sections: [
      {
        heading: "The Hidden Cost of Bank Vendor Payments",
        content: `<p>When you pay an international vendor through your bank, the total cost includes:</p>
<ul>
<li><strong>Outgoing wire fee</strong>: $25–$50 from your bank</li>
<li><strong>FX markup</strong>: 2–5% above mid-market rate (often the largest cost)</li>
<li><strong>Intermediary bank fees</strong>: $10–$25 deducted by correspondent banks</li>
<li><strong>Receiving bank fee</strong>: Some vendor banks charge an incoming wire fee</li>
</ul>
<p>On a $20,000 supplier payment, total costs can reach $500–$1,200 through traditional banking. The same payment through <a href="/companies/wise">Wise Business</a> costs $80–$140 — an 80%+ saving.</p>`,
      },
      {
        heading: "Best Solutions for Vendor Payments",
        content: `<h3>For Regular Supplier Payments ($1,000–$50,000)</h3>
<p><a href="/companies/wise">Wise Business</a> is typically the best option: 0% exchange rate markup, transparent fees, and the ability to set up recurring payments or use batch upload for multiple vendors. Integration with Xero and QuickBooks means payments sync automatically with your accounting records.</p>

<h3>For Large Vendor Payments ($50,000+)</h3>
<p><a href="/companies/ofx">OFX</a> assigns dedicated FX dealers for high-value transfers. Zero transfer fees and the ability to negotiate rates on large amounts can save significantly. Forward contracts let you lock in today's rate for future invoice payments — essential for managing FX risk on long-term supplier contracts.</p>

<h3>For Managing FX Risk on Recurring Payments</h3>
<p>If you pay the same vendor monthly in a foreign currency, exchange rate fluctuations directly affect your costs. Use forward contracts (OFX, TorFX, XE) to lock in rates, or hold foreign currency in a multi-currency account (Wise, Revolut) and convert when rates are favorable.</p>`,
      },
      {
        heading: "Compliance for International Vendor Payments",
        content: `<p>Business vendor payments have specific compliance requirements:</p>
<ul>
<li><strong>Invoice documentation</strong>: Keep invoices and contracts that justify each payment for tax deduction purposes</li>
<li><strong>Transfer records</strong>: Maintain records of exchange rates used, fees paid, and amounts converted</li>
<li><strong>Withholding tax</strong>: Some countries require withholding tax on payments to foreign suppliers</li>
<li><strong>Large transaction reporting</strong>: US transfers over $10,000 require a Currency Transaction Report (CTR) per <a href="https://www.fincen.gov/" target="_blank" rel="noopener noreferrer nofollow">FinCEN</a> requirements</li>
</ul>
<p>Specialist business providers generate reports compatible with accounting software, making compliance easier than bank wire transfers. For more on staying compliant, see our <a href="/guides/business-international-payments-guide">complete business payments guide</a>.</p>`,
      },
      {
        heading: "Sources & Methodology",
        content: `<p>Cost comparisons based on real provider quotes for business accounts as of March 2026. See our <a href="/methodology">methodology page</a> for details.</p>`,
      },
    ],
    faqs: [
      {
        question:
          "What is the cheapest way to pay international vendors?",
        answer:
          "For most businesses, Wise Business offers the lowest all-in cost for vendor payments: 0% exchange rate markup plus a fee of 0.41–0.71%. For payments over $50,000, OFX may offer better negotiated rates through their dealing desk. Both are 80–95% cheaper than traditional bank wire transfers, which charge $25–$50 plus 2–5% FX markup.",
      },
      {
        question:
          "How can I manage exchange rate risk on recurring vendor payments?",
        answer:
          "Three strategies: (1) Forward contracts — lock in today's rate for future payments (available from OFX, TorFX, XE). (2) Multi-currency accounts — hold foreign currency and convert when rates are favorable (Wise, Revolut). (3) Natural hedging — if you earn revenue in the same currency as your vendor payments, pay from that balance without converting.",
      },
      {
        question:
          "How do I schedule regular payments to international suppliers?",
        answer:
          "Wise Business and Revolut Business both support recurring payment templates. Set up your vendor's bank details once, define the amount and frequency, and the provider processes the payment automatically. For more complex workflows, Wise's API lets you automate payments from your invoicing or ERP system. OFX's dealing desk can also set up standing orders for regular large payments.",
      },
    ],
    relatedGuides: [
      "business-international-payments-guide",
      "exchange-rate-markup-explained",
    ],
  },

  // ── B2B Transfers ──
  {
    slug: "b2b-transfers",
    title: "B2B International Money Transfers",
    metaTitle:
      "B2B International Money Transfers — Compare Business Providers (2026)",
    metaDescription:
      "Compare the best providers for B2B international money transfers in 2026. Business-to-business cross-border payments with the lowest FX fees, batch processing, and compliance tools.",
    heading: "B2B International Money Transfers Compared",
    intro:
      "Business-to-business cross-border payments are projected to exceed $35 trillion by 2028. Yet most businesses still overpay through bank wires. Specialist B2B payment providers offer 80–95% lower costs with faster delivery and better compliance tools.",
    sections: [
      {
        heading: "B2B vs Consumer International Transfers",
        content: `<p>Business-to-business transfers differ from consumer remittances in several important ways:</p>
<ul>
<li><strong>Transaction size</strong>: Average B2B transfer is $5,000–$50,000+ vs. $200–$1,000 for consumer</li>
<li><strong>Frequency</strong>: Regular, recurring payments (monthly invoices, payroll) vs. occasional sends</li>
<li><strong>Compliance</strong>: Stricter documentation requirements (invoices, contracts, tax records)</li>
<li><strong>FX management</strong>: Need for forward contracts, rate alerts, and multi-currency accounts</li>
<li><strong>Integration</strong>: Must connect with accounting software, ERP systems, and procurement platforms</li>
</ul>
<p>Because B2B transfers are larger, the exchange rate markup matters far more than the flat fee. A 1% rate difference on a $50,000 transfer costs $500 — versus $10 on a $1,000 consumer send. This is why comparing the total cost (fee + FX markup) is critical for businesses.</p>`,
      },
      {
        heading: "Best Providers for B2B International Transfers",
        content: `<div style="background: #f8f9fa; border-radius: 16px; padding: 24px; margin: 24px 0;">
<h3 style="margin-top: 0;">B2B Provider Comparison</h3>
<table>
<thead><tr><th>Provider</th><th>Best For</th><th>Min Transfer</th><th>Key Feature</th></tr></thead>
<tbody>
<tr style="background: #e8f5e9;"><td><strong><a href="/companies/wise">Wise Business</a></strong></td><td>SMBs, tech companies</td><td>No minimum</td><td>0% markup, API, batch payments</td></tr>
<tr><td><strong><a href="/companies/ofx">OFX</a></strong></td><td>Mid-market companies</td><td>$1,000</td><td>$0 fees, dedicated FX dealer</td></tr>
<tr><td><strong><a href="/companies/revolut">Revolut Business</a></strong></td><td>Startups, scale-ups</td><td>No minimum</td><td>Multi-currency accounts, team access</td></tr>
</tbody>
</table>
<p style="font-size: 14px; color: #5f6368; margin-bottom: 0;">Based on business account pricing. <a href="/send-money">Compare live rates →</a></p>
</div>`,
      },
      {
        heading: "Stablecoins for B2B Cross-Border Payments",
        content: `<p>Stablecoin-based B2B payments are a growing alternative for certain corridors. A B2B payment from the US to Southeast Asia using USDC can settle in minutes at a fraction of the cost of a SWIFT wire. However, stablecoins still represent a small share of total B2B volume and require both parties to be comfortable with the technology. For more on this trend, read our <a href="/news/stablecoins-cross-border-payments-2026">analysis of stablecoins in cross-border payments</a>.</p>`,
      },
      {
        heading: "Sources & Methodology",
        content: `<p>B2B pricing verified from official business product pages as of March 2026. Cross-border B2B volume projections per <a href="https://www.juniperresearch.com/" target="_blank" rel="noopener noreferrer nofollow">Juniper Research</a>. See our <a href="/methodology">methodology page</a> for data collection details.</p>`,
      },
    ],
    faqs: [
      {
        question:
          "What is the cheapest way for businesses to transfer money internationally?",
        answer:
          "For B2B transfers under $50,000, Wise Business typically offers the lowest total cost: 0% exchange rate markup plus a transparent fee of 0.41–0.71%. For larger transfers, OFX's dealing desk can negotiate better rates. Both are dramatically cheaper than bank wires, which charge $25–$50 plus 2–5% FX markup per transfer.",
      },
      {
        question:
          "How do B2B international money transfers work?",
        answer:
          "B2B transfers work similarly to consumer transfers but with additional features for businesses: you set up a business account with a provider like Wise Business or OFX, verify your company details, add recipient bank accounts, and initiate transfers. Business accounts add batch payments, multi-currency accounts, accounting integrations, forward contracts for FX risk management, and compliance reporting.",
      },
    ],
    relatedGuides: [
      "business-international-payments-guide",
      "global-remittance-trends-2026",
    ],
  },
];

export function getBusinessPage(slug: string): BusinessPage | undefined {
  return businessPages.find((p) => p.slug === slug);
}
