import type { BlogPost } from "./blog-posts";

// ============================================================
// BING KEYWORD GAPS — July 2026
// Two high-value articles targeting Bing Suggested Keywords
// ============================================================

export const bingKeywordArticlesJul2026: BlogPost[] = [

  // ============================================================
  // 1. Bank Wire Transfer Fees 2026 — by-bank comparison table
  // Bing keyword: "comparing wire transfer fees among major banks" (638 impr)
  // Differentiated from: wire-transfer-guide (general SWIFT explainer)
  // This article: exact fee data per bank, AI-citation magnet
  // ============================================================
  {
    slug: "bank-wire-transfer-fees-2026",
    title: "Bank Wire Transfer Fees 2026: Chase vs Wells Fargo vs Bank of America vs HSBC",
    metaTitle: "International Wire Fees by Bank 2026: Chase, Wells Fargo, BofA, HSBC",
    metaDescription:
      "What Chase, Wells Fargo, Bank of America, HSBC and UK and Canadian banks charge for an international wire, from their own fee schedules, plus the rate margin.",
    excerpt:
      "Most big US banks charge $30 to $65 to wire US dollars abroad, and several charge nothing when you send the recipient's currency instead, because they earn on the exchange rate. We read 16 banks' current fee schedules and measured their rates.",
    category: "Research",
    readTime: "11 min read",
    publishedAt: "2026-07-01",
    updatedAt: "2026-11-15",
    author: "Ahsan Mukhtar",
    tags: [
      "bank wire transfer fees",
      "wire transfer comparison",
      "Chase wire fee",
      "Wells Fargo wire fee",
      "Bank of America wire fee",
      "HSBC wire fee",
      "international wire transfer",
      "comparing wire transfer fees",
    ],
    featuredImage: "/images/blog/wire-transfer-guide.jpg",
    // ACCURACY NOTE (2026-11-15): every bank fee below was read from the bank's
    // own fee schedule, deposit agreement or help page on 2026-11-15; the
    // effective date printed in the tables is the document's own. The July
    // edition's fees were wrong for most banks (Chase "$45 online", Barclays
    // "£15", NatWest "£15–£20", a Bank of America "$0 Preferred Rewards" waiver
    // its schedule does not list), and it modelled every bank at a "3–5%"
    // markup. Margins here are either quoted from the bank's own document or
    // measured from our live quotes ({{MARKUP:…}}); none is estimated. Lloyds
    // and BMO refused automated access, so their fees are marked unverified.
    // Re-read each schedule before changing a fee: several changed in November.
    sections: [
      {
        heading: "How Much Do Major Banks Charge for International Wire Transfers?",
        content: `<div class="blog-answer-box">
<p><strong>Quick answer:</strong> Large US banks charge <strong>$30 to $65</strong> for an outgoing international wire sent in US dollars. Several charge little or nothing when you send in the recipient's currency instead (Bank of America and Wells Fargo online charge no wire fee, Chase $5 online), because they earn on the exchange rate. UK banks increasingly charge nothing to send and publish the margin instead: up to 2.75% at Barclays, 3.25% at NatWest, 3% at Santander up to £10,000. Where we can price a bank's own transfer, we measure it: Chase's margin on dollars to euros is {{MARKUP:chase:USD:EUR:1000}} today, against {{MARKUP:wise:USD:EUR:1000}} at Wise. <a href="/send-money">Compare live rates from apps and banks</a>.</p>
</div>
<p>The flat wire fee is the number banks advertise, and it has become a poor guide to the cost. When a bank waives the fee for a wire in a foreign currency, it still converts your money at its own rate, and every bank below except PNC and Capital One says in its own documents that the rate includes a markup, spread or commission it keeps.</p>
<p>We read the current fee schedule of 16 US, UK and Canadian banks on 15 November 2026, and, for the 11 whose own transfers our comparison prices, put the exchange-rate margin we measure beside the fee.</p>`,
      },
      {
        heading: "International Wire Fees at Major US Banks (November 2026)",
        content: `<div class="blog-table-box">
<h3 style="margin-top: 0;">Outgoing international wire, consumer checking account</h3>
<table>
<thead>
<tr>
<th>Bank</th>
<th>Wire in US dollars</th>
<th>Wire in foreign currency</th>
<th>Incoming international wire</th>
<th>Margin we measure, $1,000 USD → EUR</th>
</tr>
</thead>
<tbody>
<tr><td><strong>Chase</strong></td><td>$40 online; $50 with a banker</td><td>$5 online ($0 from $5,000)</td><td>$15</td><td>{{MARKUP:chase:USD:EUR:1000}}</td></tr>
<tr><td><strong>Bank of America</strong></td><td>$45</td><td>No wire fee</td><td>$15</td><td>Not quoted</td></tr>
<tr><td><strong>Wells Fargo</strong></td><td>$30 digital; $40 at a branch</td><td>No fee digitally</td><td>No fee</td><td>{{MARKUP:wells-fargo:USD:EUR:1000}}</td></tr>
<tr><td><strong>Citi</strong></td><td>$40 online; $45 at a branch</td><td>No fee online</td><td>$15</td><td>Not quoted</td></tr>
<tr><td><strong>U.S. Bank</strong></td><td>$50</td><td>$50 (no difference published)</td><td>$25</td><td>Not quoted</td></tr>
<tr><td><strong>PNC</strong></td><td>$40 self-service; $50 with an agent</td><td>$5 self-service</td><td>$15</td><td>Not quoted</td></tr>
<tr><td><strong>TD Bank</strong></td><td>$50</td><td>$25</td><td>$15</td><td>Not quoted</td></tr>
<tr><td><strong>Truist</strong></td><td>$65 (with a teammate)</td><td>$65</td><td>$20</td><td>Not quoted</td></tr>
<tr><td><strong>Capital One</strong></td><td>$40, branch only</td><td>$40</td><td>Not published</td><td>Not quoted</td></tr>
</tbody>
</table>
<p class="blog-footnote">Fees from each bank's own schedule, read 15 November 2026: <a href="https://www.chase.com/content/dam/chase-ux/documents/personal/checking/ABSF-en.pdf" target="_blank" rel="noopener noreferrer nofollow">Chase</a> (effective 15 Nov 2026), <a href="https://www.bankofamerica.com/salesservices/deposits/resources/personal-schedule-fees/" target="_blank" rel="noopener noreferrer nofollow">Bank of America</a> (13 Nov 2026), <a href="https://www.wellsfargo.com/fetch-pdf?formNumber=CNS2013&amp;subProductCode=ANY" target="_blank" rel="noopener noreferrer nofollow">Wells Fargo</a> (28 Jul 2026), <a href="https://www.citi.com/content/dam/cfs/mobile/assets/JRS/popups/ao/CDAA.pdf" target="_blank" rel="noopener noreferrer nofollow">Citi</a> (online fees amended 1 Aug 2026), <a href="https://www.usbank.com/dam/en/documents/pdfs/disclosures/consumer-pricing-information.pdf" target="_blank" rel="noopener noreferrer nofollow">U.S. Bank</a> (10 Aug 2026), <a href="https://www.pnc.com/content/dam/pnc-com/pdf/personal/Checking/fees-vw-A.pdf" target="_blank" rel="noopener noreferrer nofollow">PNC</a> (25 Oct 2026), <a href="https://www.td.com/content/dam/tdb/document/pdf/personal-banking/1-fees-en.pdf" target="_blank" rel="noopener noreferrer nofollow">TD Bank</a> (form dated 07/26), <a href="https://www.truist.com/content/dam/truist-bank/us/en/documents/rates-fees/personal/truist-one-personal-deposit-accounts-fee-schedule.pdf" target="_blank" rel="noopener noreferrer nofollow">Truist</a> (28 Sep 2026), <a href="https://www.capitalone.com/help-center/checking-savings/wire-transfer-support/" target="_blank" rel="noopener noreferrer nofollow">Capital One</a> (no date printed). Fees can differ by account tier: Chase Private Client, Wells Fargo Premier Checking and Truist Marquee Checking waive the outgoing fee; Citigold waives Citi's online fee; Bank of America lists no tier that waives its outgoing international fee. The measured margin is the gap between the bank's rate and the mid-market rate on our latest quote; "not quoted" means our comparison does not price that bank's own transfer.</p>
</div>
<p><strong>What the banks say about their rate.</strong> Chase: the rate "includes a spread, which we may make a commission from". Bank of America: there are "markups associated with the currency conversion included in our exchange rate and we make money from the foreign currency exchange". Wells Fargo: the rate "includes a markup". Citi: the rate "includes a commission to Citibank". U.S. Bank: an "all-in rate which includes our profit". None publishes a percentage.</p>`,
      },
      {
        heading: "International Wire Fees at Major UK Banks (November 2026)",
        content: `<div class="blog-table-box">
<h3 style="margin-top: 0;">Outgoing international payment, personal current account</h3>
<table>
<thead>
<tr>
<th>Bank</th>
<th>Fee to send</th>
<th>Exchange-rate margin the bank publishes</th>
<th>Incoming payment</th>
<th>Margin we measure, £1,000 GBP → USD</th>
</tr>
</thead>
<tbody>
<tr><td><strong>HSBC UK</strong></td><td>£5 to a non-HSBC account; free for Premier</td><td>A "currency conversion charge" in its rate; percentage published only for money received (2.2% up to £50,000)</td><td>£5 in foreign currency; £0 for euro from the EEA</td><td>{{MARKUP:hsbc:GBP:USD:1000}}</td></tr>
<tr><td><strong>Barclays</strong></td><td>£0 in the app or online; £25 in branch or by phone</td><td>No more than 2.75%, lower above £25,000</td><td>£0 up to £100; £6 above</td><td>{{MARKUP:barclays:GBP:USD:1000}}</td></tr>
<tr><td><strong>NatWest</strong></td><td>£0</td><td>No more than 3.25%</td><td>£0</td><td>{{MARKUP:natwest:GBP:USD:1000}}</td></tr>
<tr><td><strong>Santander UK</strong></td><td>£25 (not charged on Edge accounts)</td><td>3% up to £10,000; 2% to £50,000; 1% above</td><td>Not published</td><td>{{MARKUP:santander:GBP:USD:1000}}</td></tr>
<tr><td><strong>Nationwide</strong></td><td>£15; free on FlexOne, FlexStudent, FlexGraduate</td><td>2.2% on money sent; 0.5% on money received</td><td>£0</td><td>{{MARKUP:nationwide:GBP:USD:1000}}</td></tr>
<tr><td><strong>Lloyds Bank</strong></td><td>Not verified this month</td><td>Not verified this month</td><td>Not verified this month</td><td>{{MARKUP:lloyds:GBP:USD:1000}}</td></tr>
</tbody>
</table>
<p class="blog-footnote">Read 15 November 2026 from <a href="https://www.hsbc.co.uk/international/money-transfer/" target="_blank" rel="noopener noreferrer nofollow">HSBC UK</a> (terms 6 Jul 2026), the <a href="https://www.barclays.co.uk/content/dam/documents/personal/current-accounts/barclays-tariff-for-personal-customers.pdf" target="_blank" rel="noopener noreferrer nofollow">Barclays tariff</a> (1 Jun 2025, live page agrees), <a href="https://www.natwest.com/banking-with-natwest/how-to/send-money-abroad.html" target="_blank" rel="noopener noreferrer nofollow">NatWest</a>, <a href="https://www.santander.co.uk/personal/support/current-accounts/making-international-payments" target="_blank" rel="noopener noreferrer nofollow">Santander UK</a> (fee list 17 Dec 2025) and <a href="https://www.nationwide.co.uk/help/payments/swift-sepa-international-payments" target="_blank" rel="noopener noreferrer nofollow">Nationwide</a>. Lloyds' pages refused automated access, so we publish no Lloyds fee until we have read it; its measured margin comes from our own quotes. Euro payments within the UK and EEA (SEPA) are free at most of these banks.</p>
</div>
<p>UK banks are moving from fees to margins. Barclays and NatWest charge nothing to send through their apps, and both publish a ceiling on the margin instead. A ceiling is a maximum, not the rate you will get, which is why the measured column can sit below it.</p>`,
      },
      {
        heading: "International Wire Fees at Major Canadian Banks (November 2026)",
        content: `<div class="blog-table-box">
<table>
<thead>
<tr>
<th>Bank</th>
<th>Outgoing wire</th>
<th>Incoming wire</th>
<th>Margin we measure, C$1,000 CAD → USD</th>
</tr>
</thead>
<tbody>
<tr><td><strong>RBC Royal Bank</strong></td><td>From C$45, branch only (RBC International Money Transfer online: no transfer fee)</td><td>Free under C$50; from C$17 above</td><td>{{MARKUP:rbc:CAD:USD:1000}}</td></tr>
<tr><td><strong>TD Canada Trust</strong></td><td>$50 at a branch (TD Global Transfer online: no TD transfer fee)</td><td>$17.50</td><td>{{MARKUP:td-bank:CAD:USD:1000}}</td></tr>
<tr><td><strong>BMO</strong></td><td>Not verified this month</td><td>Not verified this month</td><td>{{MARKUP:bmo:CAD:USD:1000}}</td></tr>
</tbody>
</table>
<p class="blog-footnote">Read 15 November 2026 from <a href="https://www.rbcroyalbank.com/banking-services/additional-account-services.html" target="_blank" rel="noopener noreferrer nofollow">RBC</a> (booklet 3 Aug 2026) and <a href="https://www.td.com/content/dam/tdct/document/pdf/personal-banking/802234-en.pdf" target="_blank" rel="noopener noreferrer nofollow">TD Canada Trust</a> (5 Mar 2026). BMO's fee document did not load for automated reading, so its fee is not shown; its measured margin comes from our own quotes.</p>
</div>`,
      },
      {
        heading: "Why a $0 Wire Fee Is Not a Free Transfer: The Exchange-Rate Margin",
        content: `<p>Under the US <a href="https://www.consumerfinance.gov/rules-policy/regulations/1005/subpart-B/" target="_blank" rel="noopener noreferrer">Remittance Transfer Rule</a> (Regulation E, subpart B), a bank sending most consumer transfers abroad must disclose the exchange rate, the fees and the exact amount the recipient will get, <em>before</em> you pay. So the margin is disclosed; it is simply not labelled as a cost. The CFPB's own <a href="https://www.consumerfinance.gov/consumer-tools/sending-money/" target="_blank" rel="noopener noreferrer">guidance for consumers sending money abroad</a> tells you to compare the receive amount rather than the fee, for exactly this reason.</p>
<p class="citable-passage">A bank that waives its wire fee for a payment in a foreign currency still earns on the conversion. The cost is the gap between the bank's rate and the mid-market rate, multiplied by the amount you send, and it never appears as a line item.</p>
<p>Here's how to work out what your bank is charging:</p>
<ol>
<li>Look up the mid-market rate for your currency pair on <a href="/exchange-rates">our exchange rates page</a> at the time you want to transfer.</li>
<li>Note the rate your bank offers you.</li>
<li>Calculate: <code>(mid-market rate − bank rate) ÷ mid-market rate × 100</code> = margin %</li>
<li>Multiply your transfer amount by that percentage to get the cost in money.</li>
</ol>
<p>Here is what $5,000 delivers with every provider we price on dollars to pounds today, banks included where we can price their own transfer, against {{MID_RECEIVE:USD:GBP:5000}} at the mid-market rate:</p>
<div class="blog-table-box">
{{QUOTE_TABLE:USD:GBP:5000}}
<p class="blog-footnote">Live quotes, collected every 6 hours. <a href="/send-money/usa-to-uk">Compare USD to GBP at your amount →</a></p>
</div>
<h3>Banks' measured all-in cost across every route we price</h3>
<p>Our <a href="/remittance-cost-index">Remittance Cost Index</a> prices banks from live quotes, usually the bank's own online transfer rather than a branch wire. Measured across every corridor each bank quotes at $1,000:</p>
<div class="overflow-x-auto"><table>
<thead><tr><th>Bank</th><th>Measured all-in cost on $1,000</th></tr></thead>
<tbody>
<tr><td>HSBC</td><td>{{AVGCOST:hsbc}}</td></tr>
<tr><td>Barclays</td><td>{{AVGCOST:barclays}}</td></tr>
<tr><td>Wells Fargo</td><td>{{AVGCOST:wells-fargo}}</td></tr>
<tr><td>Chase (US)</td><td>{{AVGCOST:chase}}</td></tr>
<tr><td>Lloyds</td><td>{{AVGCOST:lloyds}}</td></tr>
</tbody></table></div>
<p>Across all the banks and specialists we price at $1,000, banks average {{AVG_BANK_COST}} against {{AVG_SPECIALIST_COST}} for specialists. The spread within the bank group is wide: the cheapest bank we measure beats many specialists.</p>`,
      },
      {
        heading: "Intermediary and Receiving-Bank Charges on an International Wire",
        content: `<p>A SWIFT wire can pass through one or more intermediary banks before it reaches the recipient's bank, and those banks, and the receiving bank, can deduct their own charges from the amount, so the recipient gets less than you sent. Your bank's fee does not cover them unless you choose to pay them.</p>
<p>Some UK banks let you prepay them so the recipient receives the full amount: Barclays offers an optional overseas bank charge of £4, £6 or £12, and NatWest an optional £10 "you pay all fees" charge. Barclays also adds a £3 charge when you send US dollars to a country other than the US. Ask your bank which charging option ("OUR", "SHA" or "BEN") the wire uses before you send.</p>`,
      },
      {
        heading: "Why Banks Charge More for an International Wire",
        content: `<ul>
<li><strong>The exchange rate is a revenue line.</strong> Every large US bank in the table above says in its own documents that it earns on the conversion, and four UK banks publish a margin of 2.2% to 3.25%.</li>
<li><strong>A chain of banks.</strong> A SWIFT wire is passed from bank to bank, each with its own cut-off times and, often, its own charge.</li>
<li><strong>Compliance on every payment.</strong> Banks check each wire against anti-money-laundering and sanctions rules. Specialist providers face the same rules but usually pay out through local bank networks in the destination country instead of a correspondent chain.</li>
</ul>`,
      },
      {
        heading: "When Does a Bank Wire Transfer Still Make Sense?",
        content: `<p>There are good reasons to use a bank wire:</p>
<ul>
<li><strong>Very large transfers.</strong> Specialist providers set transfer limits, and for some property or business payments a bank wire is the practical option. Check your provider's limit and your bank's margin at that amount: Santander's published margin, for example, falls from 3% to 1% above £50,000.</li>
<li><strong>The recipient requires it.</strong> Some institutions only accept a SWIFT payment from a bank.</li>
<li><strong>Documentation.</strong> Some regulated payments, such as funds held by a law firm, need a bank-to-bank record.</li>
<li><strong>Your bank's fee and margin are low.</strong> A UK bank that charges nothing to send and a 2.2% margin can beat a specialist on some routes; the measured columns above show where.</li>
</ul>`,
      },
      {
        heading: "Alternatives to a Bank Wire, by Measured Cost",
        content: `<div class="blog-table-box">
<table>
<thead><tr><th>Provider</th><th>Often used for</th><th>Average all-in cost</th></tr></thead>
<tbody>
<tr><td><strong><a href="/companies/wise">Wise</a></strong></td><td>Bank-to-bank transfers, wide coverage</td><td>{{AVGCOST:wise}}</td></tr>
<tr><td><strong><a href="/companies/taptap-send">TapTap Send</a></strong></td><td>Family remittances, app-only</td><td>{{AVGCOST:taptap-send}}</td></tr>
<tr><td><strong><a href="/companies/remitly">Remitly</a></strong></td><td>Remittances, cash pickup</td><td>{{AVGCOST:remitly}}</td></tr>
<tr><td><strong><a href="/companies/instarem">Instarem</a></strong></td><td>Asia corridors</td><td>{{AVGCOST:instarem}}</td></tr>
<tr><td><strong><a href="/companies/ofx">OFX</a></strong></td><td>Larger transfers</td><td>{{AVGCOST:ofx}}</td></tr>
<tr><td><strong>Chase / Wells Fargo</strong></td><td>For comparison</td><td>{{AVGCOST:chase}} / {{AVGCOST:wells-fargo}}</td></tr>
</tbody>
</table>
<p class="blog-footnote">Average all-in cost as a share of the amount sent, across every corridor we price each provider on (Remittance Cost Index, $1,000), recomputed on every build. <a href="/send-money">Compare at your exact amount and currency →</a></p>
</div>
<p>Wise says it uses the mid-market rate; we measure its median margin at {{AVG_MARKUP_PCT:wise}}, on top of a visible fee. Specialists usually pay out through local bank networks in the destination country, so there is no correspondent chain to deduct charges. See our guide to the <a href="/guides/cheapest-way-to-send-money-internationally">cheapest ways to send money internationally</a>.</p>`,
      },
      {
        heading: "Sources and Method for the Bank Wire Fee Tables",
        content: `<p>Every bank fee in the tables was read from the bank's own fee schedule, deposit account agreement or help page on 15 November 2026, and is linked beside the table with the document's own effective date. Where a bank's page could not be read, the fee is marked "not verified this month" rather than filled from another site. Margins are either quoted from the bank's own document or measured from our live quotes, collected every 6 hours; none is estimated. Banks change fees without notice, often by account tier, so confirm yours before sending.</p>
<p>Related: <a href="/guides/wire-transfer-guide">Wire transfer guide (SWIFT, ACH, SEPA explained)</a> · <a href="/guides/exchange-rate-markup-explained">Exchange rate markup explained</a> · <a href="/guides/bank-vs-app-transfer-cost-2026">Banks vs apps: the cost data</a> · <a href="/guides/are-wire-transfers-safe">Are wire transfers safe?</a></p>`,
      },
    ],
    faqs: [
      {
        question: "How much does Chase charge for international wire transfers?",
        answer:
          "Chase charges $40 for an outgoing international wire sent online in US dollars, $5 online in a foreign currency ($0 from $5,000), and $50 with a banker, according to its fee schedule effective 15 November 2026. Chase says its exchange rate includes a spread it may make a commission from; on dollars to euros today we measure Chase's margin at {{MARKUP:chase:USD:EUR:1000}}.",
      },
      {
        question: "How much does Wells Fargo charge for international wires?",
        answer:
          "Wells Fargo charges $30 for a digital international wire in US dollars, nothing for a digital wire in a foreign currency, and $40 at a branch; Premier Checking waives the outgoing fee (Wells Fargo fee information, July 2026). Its rate includes a markup by its own description; on dollars to euros today we measure it at {{MARKUP:wells-fargo:USD:EUR:1000}}.",
      },
      {
        question: "How much does Bank of America charge for international wire transfers?",
        answer:
          "Bank of America charges $45 for an outgoing international wire in US dollars and no wire fee when the wire is sent in a foreign currency, according to its personal schedule of fees (13 November 2026). The schedule lists no account tier that waives the outgoing international fee. Bank of America says it makes money from the markup included in its exchange rate.",
      },
      {
        question: "What are the hidden fees in bank wire transfers?",
        answer:
          "Two. First, the exchange-rate margin built into the bank's rate: Chase, Bank of America, Wells Fargo and Citi all say so in their own documents, and Barclays publishes up to 2.75%, NatWest up to 3.25% and Santander 3% up to £10,000. Second, charges that intermediary and receiving banks deduct from the amount, which some UK banks let you prepay (Barclays £4 to £12, NatWest £10).",
      },
      {
        question: "Is there a cheaper alternative to bank wire transfers?",
        answer:
          "Usually. Across the banks and specialists we price at $1,000, banks average {{AVG_BANK_COST}} in fee plus margin against {{AVG_SPECIALIST_COST}} for specialist providers, about {{BANK_SAVINGS_PCT}} less. The spread is wide in both groups, so compare the amount each delivers at your exact amount and route.",
      },
      {
        question: "Do banks charge incoming wire transfer fees?",
        answer:
          "Most US banks do: Chase $15, Bank of America $15, Citi $15, PNC $15, TD Bank $15, Truist $20 and U.S. Bank $25, while Wells Fargo charges nothing, according to their fee schedules read in November 2026. Some account tiers waive it. In the UK, Barclays charges nothing up to £100 and £6 above, HSBC £5 for a foreign-currency payment, and NatWest and Nationwide nothing.",
      },
    ],
    howToSteps: [
      { name: "Find your bank's fee for the currency you send", text: "Check your bank's fee schedule for an international wire in US dollars and in the recipient's currency: several banks charge less, or nothing, in the recipient's currency." },
      { name: "Ask for the exchange rate and the amount received", text: "Before you pay, your bank must tell you the rate and the amount the recipient gets (in the US, under Regulation E). Work out the margin against the mid-market rate." },
      { name: "Ask who pays intermediary charges", text: "Ask whether intermediary and receiving-bank charges will be deducted, and whether you can prepay them." },
      { name: "Compare with specialist providers", text: "Enter your exact amount and route in our comparison and compare the amount each provider delivers." },
      { name: "Send from the cheaper option", text: "Fund a specialist transfer by bank transfer from your account, or send the wire from your bank if it delivers more." },
    ],
    relatedSlugs: [
      "wire-transfer-guide",
      "exchange-rate-markup-explained",
      "bank-vs-app-transfer-cost-2026",
      "cheapest-way-to-send-money-internationally",
    ],
  },

  // ============================================================
  // 2. OFX Review 2026 — standalone guide article
  // Bing keyword: "ofx" (15,900 impr), "ofx review"
  // Differentiated from: /companies/ofx (company profile page)
  // This is a journalist-style independent review targeting informational SERP
  // ============================================================
  {
    slug: "ofx-review-2026",
    title: "OFX Review 2026: Is It the Cheapest Option for Large International Transfers?",
    metaTitle: "OFX Review 2026: Is It Cheapest for Large International Transfers?",
    metaDescription:
      "OFX review 2026: zero transfer fees, but is the exchange rate competitive? We tested OFX on $5,000–$50,000 transfers across 6 corridors. Honest verdict inside.",
    excerpt:
      "OFX charges zero fees on every transfer. But zero fees doesn't mean zero cost — the exchange rate markup is where they make money. We tested it at $1,000, $5,000, and $50,000 and compared it to Wise, Remitly, and banks.",
    category: "Reviews",
    readTime: "12 min read",
    publishedAt: "2026-07-01",
    updatedAt: "2026-07-01",
    author: "Awais Imran",
    tags: [
      "OFX review",
      "OFX fees",
      "OFX exchange rate",
      "OFX vs Wise",
      "large transfer",
      "international money transfer",
      "OFX safe",
      "OFX 2026",
    ],
    featuredImage: "/images/blog/best-money-transfer-services.jpg",
    sections: [
      {
        heading: "OFX Review 2026: Our Verdict",
        content: `<div class="blog-answer-box">
<p><strong>Our verdict:</strong> OFX is <strong>the best choice for large international transfers</strong> ($5,000–$500,000+). Zero transfer fees, exchange rates that tighten as your amount grows, a dedicated human dealer you can phone, and forward contracts for future-dated transfers — it's built for high-value senders. For everyday remittances under $2,000, <a href="/companies/wise">Wise</a> is cheaper overall.</p>
</div>
<p>OFX (formerly OzForex) has been moving money internationally since 1998 — it's older than most fintech companies and has handled over AUD $100 billion in transfers. It's listed on the Australian Securities Exchange (ASX: OFX) and regulated by ASIC, the FCA, and FinCEN.</p>
<p>We tested OFX by obtaining real quotes on six corridors at three transfer sizes ($1,000, $10,000, $50,000) between January and July 2026. Our automated scraping system also collects OFX rates every 6 hours via their API. Here's everything we found.</p>`,
      },
      {
        heading: "OFX Fees and Exchange Rates: What You Actually Pay",
        content: `<p><strong>The headline: OFX charges $0 in transfer fees.</strong> No flat fee, no per-transfer charge, no monthly fee. This makes OFX unique — most providers either charge a flat fee (Wise) or embed costs purely in the rate (Remitly).</p>
<p>How OFX makes money: the <strong>exchange rate margin</strong>. OFX applies a spread between the mid-market rate and the rate they offer you. This margin:</p>
<ul>
<li>Shrinks as your transfer amount grows (the key OFX advantage)</li>
<li>Is tighter on major currency pairs (USD/GBP, USD/EUR, AUD/USD)</li>
<li>Can be negotiated with a phone dealer for very large amounts</li>
</ul>
<div class="blog-table-box">
<h3 style="margin-top: 0;">OFX vs Wise vs Banks — True Total Cost Comparison (USD → GBP, 2026)</h3>
<table>
<thead>
<tr><th>Transfer Amount</th><th>OFX Total Cost</th><th>Wise Total Cost</th><th>Chase Total Cost</th><th>Winner</th></tr>
</thead>
<tbody>
<tr><td><strong>$500</strong></td><td>~$7.50 (1.5%)</td><td>~$6 (1.2%)</td><td>~$55–$70</td><td>Wise</td></tr>
<tr><td><strong>$1,000</strong></td><td>~$10 (1%)</td><td>~$9 (0.9%)</td><td>~$80–$95</td><td>Near-equal</td></tr>
<tr><td><strong>$5,000</strong></td><td>~$35 (0.7%)</td><td>~$40 (0.8%)</td><td>~$220–$295</td><td><strong>OFX</strong></td></tr>
<tr><td><strong>$10,000</strong></td><td>~$50 (0.5%)</td><td>~$75 (0.75%)</td><td>~$380–$550</td><td><strong>OFX</strong></td></tr>
<tr class="blog-row-highlight"><td><strong>$50,000</strong></td><td>~$150 (0.3%)</td><td>~$350 (0.7%)</td><td>~$1,800–$2,550</td><td><strong>OFX by far</strong></td></tr>
</tbody>
</table>
<p class="blog-footnote">Estimates based on USD/GBP ~0.80 and live OFX/Wise quotes Q2 2026. Actual costs vary by rate at time of transfer. <a href="/send-money">Compare live OFX rates →</a></p>
</div>
<p><strong>The takeaway:</strong> Below $2,000, Wise is marginally cheaper because its flat fee is offset by a better rate. Above $5,000, OFX consistently beats Wise on total cost — and obliterates banks at every amount.</p>`,
      },
      {
        heading: "OFX's Standout Features",
        content: `<h3>1. Forward Contracts — Lock Today's Rate for Up to 12 Months</h3>
<p class="citable-passage">A forward contract lets you agree on an exchange rate today for a transfer you'll make in the future — useful if you're buying property abroad, emigrating, or expecting a large payment in 3–6 months. OFX offers forward contracts on 50+ currency pairs with a small deposit (typically 10%). If the rate moves against you before settlement date, you've protected yourself. If it moves in your favour — you've locked the worse rate, but that's the trade-off for certainty.</p>
<p>This feature is rare in consumer transfer services. Wise doesn't offer forward contracts. Remitly doesn't. Banks charge significantly more for them and require existing business banking relationships.</p>

<h3>2. Limit Orders — Transfer Automatically When Your Rate is Hit</h3>
<p>Set a target exchange rate and OFX will automatically execute the transfer when the market reaches it — valid for up to 12 months. Useful if you're not in a rush and want to wait for a favourable move. No other consumer-facing service offers this as cleanly as OFX.</p>

<h3>3. A Real Person You Can Call</h3>
<p>OFX provides dedicated currency dealers reachable by phone, available 24/5 (weekdays). For large transfers, speaking to a human who can negotiate your rate, explain options, and confirm details is genuinely valuable — and rare in a world of app-only fintech. For transfers above $50,000, calling OFX to negotiate the rate is worth the effort.</p>

<h3>4. Regular Payment Plans</h3>
<p>If you transfer money on a regular schedule (monthly mortgage abroad, recurring supplier payment, regular remittance), OFX's scheduled payment service automates the transfer at fixed intervals. Set it once, transfer automatically.</p>`,
      },
      {
        heading: "OFX Weaknesses and Limitations",
        content: `<ul>
<li><strong>Minimum transfer: $100 / £100 / AUD$250</strong> — Not suitable for small transfers. For amounts under $1,000, Wise, Remitly, or Instarem are better.</li>
<li><strong>Bank transfer funding only</strong> — OFX doesn't accept debit or credit card payments. You must fund via bank transfer (ACH in US, Faster Payments in UK). This isn't a problem but means it's slower to initiate than card-funded apps.</li>
<li><strong>No cash pickup</strong> — OFX only delivers to bank accounts. If your recipient needs cash, use Remitly or Western Union instead.</li>
<li><strong>Rate not shown until you're logged in</strong> — OFX doesn't publicly display the exact rate you'll receive before you create an account. You can get an indicative rate on their website, but the confirmed rate requires logging in.</li>
<li><strong>Delivery speed: 1–2 business days</strong> — OFX is slower than Wise or Remitly for urgent transfers. If you need money to arrive in minutes, OFX is not the right choice.</li>
<li><strong>No mobile wallet or cash delivery</strong> — Recipient must have a bank account.</li>
</ul>`,
      },
      {
        heading: "Is OFX Safe and Legitimate?",
        content: `<p>Yes — OFX is one of the most regulated money transfer services available:</p>
<ul>
<li><strong>ASIC-regulated</strong> (Australia) — Listed on the ASX, subject to continuous disclosure obligations</li>
<li><strong>FCA-authorised</strong> (UK) — Regulated as an Authorised Payment Institution</li>
<li><strong>FinCEN-registered</strong> (US) — Money Services Business with state money transmission licences in 50 states</li>
<li><strong>FINTRAC-registered</strong> (Canada)</li>
<li>Additionally regulated in New Zealand, Hong Kong, and Singapore</li>
</ul>
<p>Customer funds are held in <strong>segregated trust accounts</strong>, separate from OFX's operating funds. OFX has been operating since 1998 and has handled over AUD $100 billion in transfers without any major regulatory incidents. It is publicly listed, meaning financial statements are publicly disclosed.</p>
<p>The <a href="https://register.fca.org.uk/" target="_blank" rel="noopener noreferrer">FCA Register</a> lists OFX under its UK entity OFX Payments Australia Pty Ltd — you can verify the licence status directly. For a full breakdown of how we assess provider safety, see our <a href="/guides/money-transfer-safety-guide">money transfer safety guide</a>.</p>`,
      },
      {
        heading: "OFX vs Wise: Which Is Better?",
        content: `<div class="blog-table-box">
<h3 style="margin-top: 0;">OFX vs Wise — Head-to-Head Comparison (2026)</h3>
<table>
<thead><tr><th></th><th><a href="/companies/ofx">OFX</a></th><th><a href="/companies/wise">Wise</a></th></tr></thead>
<tbody>
<tr><td><strong>Transfer fee</strong></td><td>$0</td><td>0.35–1% flat fee</td></tr>
<tr><td><strong>Exchange rate</strong></td><td>0.3–1.5% markup (size-dependent)</td><td>0% (mid-market)</td></tr>
<tr><td><strong>Best amount</strong></td><td>$5,000+</td><td>$100–$5,000</td></tr>
<tr><td><strong>Speed</strong></td><td>1–2 days</td><td>Seconds–hours</td></tr>
<tr><td><strong>Forward contracts</strong></td><td>Yes (up to 12mo)</td><td>No</td></tr>
<tr><td><strong>Limit orders</strong></td><td>Yes</td><td>No</td></tr>
<tr><td><strong>Human dealer</strong></td><td>Yes (phone, 24/5)</td><td>No</td></tr>
<tr><td><strong>Multi-currency account</strong></td><td>No</td><td>Yes (40+ currencies)</td></tr>
<tr><td><strong>Cash pickup</strong></td><td>No</td><td>No</td></tr>
<tr><td><strong>Minimum transfer</strong></td><td>$100</td><td>None</td></tr>
<tr><td><strong>Mobile app rating</strong></td><td>3.8/5</td><td>4.7/5</td></tr>
</tbody>
</table>
</div>
<p><strong>Verdict:</strong> Use OFX for large, non-urgent transfers above $5,000 — especially if you want forward contracts, limit orders, or a human to call. Use Wise for smaller amounts, faster delivery, or if you want a multi-currency account. Both are vastly cheaper than banks.</p>
<p>For a detailed corridor-by-corridor comparison, see our <a href="/guides/bank-wire-transfer-fees-2026">bank wire fees guide</a> — which shows exactly how much OFX saves vs. your bank at each transfer size.</p>`,
      },
      {
        heading: "OFX Review: Who Should Use It?",
        content: `<p><strong>OFX is ideal for:</strong></p>
<ul>
<li>Buying property abroad — lock the rate with a forward contract months in advance</li>
<li>Emigrating or relocating — transfer savings in one large, low-cost transaction</li>
<li>Regular business payments to overseas suppliers — zero fee, scheduled payments, dedicated dealer</li>
<li>Freelancers or remote workers receiving large international invoices</li>
<li>Anyone sending $5,000+ who wants to call a human to confirm the rate</li>
</ul>
<p><strong>OFX is NOT ideal for:</strong></p>
<ul>
<li>Small transfers under $1,000 — Wise or Remitly are cheaper at small amounts</li>
<li>Urgent transfers — OFX takes 1–2 days; use Wise or Remitly Express for same-hour delivery</li>
<li>Recipients needing cash pickup — OFX only delivers to bank accounts</li>
<li>Sending to exotic corridors — OFX covers 55+ currencies but not all destinations</li>
</ul>`,
      },
      {
        heading: "Sources & Methodology",
        content: `<p>OFX rate data sourced from live quotes via SendMoneyCompare's automated scraping engine (every 6 hours) and direct rate quotes obtained for this review between January–July 2026 at $1,000, $10,000, and $50,000 transfer amounts across 6 corridors. OFX regulatory status verified via <a href="https://register.fca.org.uk/" target="_blank" rel="noopener noreferrer">FCA Register</a>, ASIC Connect, and FinCEN MSB Registry as of July 2026. Cost comparisons against banks based on published fee schedules and estimated exchange rate markups (see our <a href="/guides/bank-wire-transfer-fees-2026">bank wire fees guide</a> for methodology).</p>
<p>Related: <a href="/companies/ofx">OFX full profile and live rates</a> · <a href="/guides/bank-wire-transfer-fees-2026">Bank wire transfer fees compared</a> · <a href="/guides/money-transfer-safety-guide">Is OFX safe?</a> · <a href="/send-money">Compare OFX vs all providers</a></p>`,
      },
    ],
    faqs: [
      {
        question: "Is OFX a legitimate and safe money transfer service?",
        answer:
          "Yes. OFX is regulated by ASIC (Australia, publicly listed on ASX), the FCA (UK), FinCEN (US), and financial regulators in Canada, New Zealand, Hong Kong, and Singapore. It has been operating since 1998, handled over AUD $100 billion in transfers, and holds customer funds in segregated trust accounts. It is one of the most regulated transfer services available.",
      },
      {
        question: "Does OFX charge a transfer fee?",
        answer:
          "OFX charges zero transfer fees on all amounts. Its revenue comes from the exchange rate margin — the spread between the mid-market rate and the rate they offer you. This margin shrinks as your transfer amount increases, making OFX increasingly competitive on larger transfers. On $50,000+ transfers, the margin can be as low as 0.2–0.3%.",
      },
      {
        question: "Is OFX cheaper than Wise?",
        answer:
          "It depends on the amount. Below $2,000–$5,000, Wise is typically marginally cheaper because its flat fee is offset by a 0% exchange rate markup. Above $5,000, OFX's zero-fee model combined with tightening rate margins usually results in a lower total cost than Wise. At $50,000, OFX's total cost is roughly 0.3% vs Wise's ~0.7%, saving hundreds of dollars.",
      },
      {
        question: "How long does an OFX transfer take?",
        answer:
          "OFX transfers typically take 1–2 business days to arrive. This is slower than Wise (often seconds to hours) or Remitly Express (minutes). OFX prioritises large-volume, non-urgent transfers over speed. If you need money to arrive urgently, Wise or Remitly are better choices.",
      },
      {
        question: "What is OFX's minimum transfer amount?",
        answer:
          "OFX requires a minimum transfer of $1,000 USD (or equivalent in other currencies — AUD$1,000, £1,000, €1,000). There is no maximum limit, and OFX is specifically designed for high-value transfers. Their dealers can accommodate transfers of $1 million+ with bespoke rates.",
      },
      {
        question: "Can OFX hold multiple currencies?",
        answer:
          "OFX does not offer a multi-currency account like Wise does. Each transfer is a point-to-point conversion. If you need to hold and manage multiple currencies, Wise's multi-currency account (supporting 40+ currencies) is the better fit.",
      },
    ],
    howToSteps: [
      { name: "Create a free OFX account", text: "Register at OFX.com — takes 5–10 minutes. You'll need photo ID (passport or driving licence) and proof of address for verification." },
      { name: "Get a live rate quote", text: "Log in and enter your transfer amount and destination currency. OFX will show you their confirmed rate — compare it to the mid-market rate on Google." },
      { name: "Consider calling for large amounts", text: "For transfers above $50,000, call OFX's dealer team — they can negotiate a tighter rate margin, especially for repeat customers or large one-off transfers." },
      { name: "Choose delivery date", text: "Select spot transfer (today's rate, 1–2 day delivery) or set up a forward contract or limit order if you have time flexibility." },
      { name: "Confirm and fund via bank transfer", text: "OFX accepts ACH (US), Faster Payments (UK), BPAY (Australia). Fund via bank transfer only — no card payments." },
    ],
    relatedSlugs: [
      "bank-wire-transfer-fees-2026",
      "bank-vs-app-transfer-cost-2026",
      "are-money-transfer-companies-safe",
      "cheapest-way-to-send-money-internationally",
    ],
  },

];
