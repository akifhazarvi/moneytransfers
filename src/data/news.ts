import { COVERAGE } from "@/lib/site-stats";
export interface NewsItem {
  slug: string;
  /** Headline as published, rendered as the article <h1>. */
  title: string;
  /**
   * Optional SERP title. News headlines routinely run past the 70 characters
   * search engines render, so `seoTitle()` derives a shorter <title> from the
   * headline unless one is set here explicitly.
   */
  metaTitle?: string;
  excerpt: string;
  content: string; // HTML
  category: "Industry News" | "Provider Update" | "Announcement" | "Regulatory";
  publishedAt: string;
  updatedAt?: string; // ISO date — if content was revised after publication
  image?: string; // path to hero image
  imageAlt?: string;
  source?: string;
  sourceUrl?: string;
  providerSlugs?: string[]; // related providers
}

export const newsItems: NewsItem[] = [
  {
    slug: "central-bank-super-week-march-2026",
    title:
      "How Central Bank Rate Decisions Affect Your Money Transfers (2026)",
    excerpt:
      "Fed held at 3.50–3.75%, Bank of Japan held at 0.75%, Bank of England held at 3.75%, RBA raised to 4.10%. How central bank interest rate decisions move exchange rates — and what to do before, during, and after rate announcements to protect your transfer.",
    image: "/images/news/central-bank-super-week.jpg",
    imageAlt:
      "The Federal Reserve building in Washington D.C., one of four central banks announcing rate decisions this week",
    content: `<p>Central bank interest rate decisions are the single biggest driver of exchange rate movements. When the Federal Reserve, Bank of England, Bank of Japan, or European Central Bank announce rate changes, currency pairs can move 1–2% within hours — that's a <strong>£100–£200 difference on a £10,000 transfer</strong>. If you send money internationally, understanding rate decisions helps you time transfers and avoid losing money to volatility.</p>

<h2>How central bank rates affect your transfer</h2>
<p>Interest rate changes affect exchange rates because money flows toward higher-yielding currencies. When the Fed cuts rates, the dollar typically weakens — great if you're sending dollars abroad (your recipient gets more), bad if you're sending money <em>to</em> the US. The same logic applies to every major currency pair.</p>

<p>The effect isn't always immediate. Markets price in expectations ahead of time, so a "surprise hold" or an unexpected change in guidance can move currencies more than the actual decision. This is why the <strong>central bank statement and press conference</strong> often matter more than the rate itself.</p>

<h2>Key central banks that move transfer rates</h2>
<ul>
<li><strong>Federal Reserve (Fed)</strong> — Controls the USD. Rate cuts weaken the dollar (good for US senders to India, Mexico, Philippines). Rate hikes strengthen it.</li>
<li><strong>Bank of England (BoE)</strong> — Controls GBP. UK senders to India, Pakistan, Bangladesh, Nigeria should watch BoE decisions closely.</li>
<li><strong>European Central Bank (ECB)</strong> — Controls the EUR. Affects Europe-to-India, Europe-to-Morocco, and EUR/GBP corridors.</li>
<li><strong>Bank of Japan (BoJ)</strong> — Controls JPY. BoJ is the wildcard — decades of ultra-low rates mean any hint of normalisation moves USD/JPY sharply.</li>
<li><strong>Reserve Bank of Australia (RBA)</strong> — Controls AUD. Important for Australia-to-India, Australia-to-Philippines, AUD/NZD corridors.</li>
</ul>

<h2>Case study: March 17–19, 2026 — four decisions in three days</h2>
<p>One of the most consequential weeks in the 2026 currency calendar saw four major central banks all announce within 72 hours:</p>
<ul>
<li><strong>RBA (March 17)</strong> — Raised the cash rate target 25 basis points to 4.10% on a 5–4 vote, its second increase of 2026 after February's.</li>
<li><strong>Fed (March 17–18)</strong> — Held at 3.50–3.75% on an 11–1 vote. The "dot plot" projections were the real driver — showing one projected cut in 2026, keeping the dollar stable.</li>
<li><strong>BoJ (March 18–19)</strong> — Held the policy rate at around 0.75% on an 8–1 vote, with one member preferring a rise.</li>
<li><strong>BoE (March 19)</strong> — Held Bank Rate at 3.75%, unanimously, while flagging that higher energy prices will lift inflation in the near term. GBP/USD traded around 1.33.</li>
</ul>

<h2>How to protect your transfer around rate decisions</h2>
<p>Three strategies to manage central bank volatility:</p>
<ol>
<li><strong>Send before the announcement</strong> — Lock in current rates and avoid volatility. Most central bank decisions are published at a set time (e.g., Fed at 14:00 ET, BoE at 12:00 GMT).</li>
<li><strong>Wait 24–48 hours after</strong> — Initial volatility settles within 1–2 days. You'll know whether rates moved in your favour.</li>
<li><strong>Set a rate alert</strong> — Use <a href="/companies/wise">Wise</a>, <a href="/companies/xe">Xe</a>, or <a href="/companies/revolut">Revolut</a> to set an alert at your target rate. If post-announcement volatility pushes rates in your direction, you'll be notified instantly.</li>
</ol>

<p>Understanding <a href="/guides/exchange-rate-markup-explained">how exchange rate markups work</a> is especially important during volatile weeks — providers absorb or pass on currency swings very differently. If you hold multiple currencies, our guide on <a href="/guides/multi-currency-accounts-exchange-rates">multi-currency accounts</a> explains which products give you the most flexibility. Our <a href="/send-money">comparison tool</a> shows live rates and fees, so you can see exactly how much your recipient receives — before and after central banks have their say. For broader context, see our <a href="/guides/global-remittance-trends-2026">2026 global remittance trends report</a>.</p>`,
    category: "Industry News",
    publishedAt: "2026-03-17",
    updatedAt: "2026-03-31",
    source: "Reuters / Bank of England / Federal Reserve",
    sourceUrl: "https://www.bankofengland.co.uk/monetary-policy-summary-and-minutes/2026/march-2026",
    providerSlugs: ["wise", "xe", "revolut"],
  },
  {
    slug: "us-remittance-excise-tax-takes-effect-2026",
    title: "New 1% US Remittance Tax — What It Means for You",
    excerpt:
      "A federal excise tax on cash-funded international transfers went live in January 2026. Here's what it means for senders, providers, and the broader remittance market.",
    image: "/images/news/us-remittance-tax.jpg",
    imageAlt: "The US Capitol building in Washington D.C., where the remittance excise tax legislation was passed",
    content: `<p>The money transfer landscape in the United States shifted on January 1, 2026, when a 1% federal excise tax on certain international remittances took effect. Bundled into the broader "One Big Beautiful Bill Act" passed by Congress, the levy applies to outbound transfers funded with cash, a money order, a cashier's check or a similar physical instrument.</p>

<h2>Who pays, and who doesn't?</h2>
<p>The tax targets transfers funded with physical cash at agent locations and retail counters. If you walk into a <a href="/companies/western-union">Western Union</a> or <a href="/companies/moneygram">MoneyGram</a> branch and pay with banknotes, the provider is required to collect the 1% levy on top of existing fees. Transfers funded digitally — through a linked bank account, debit card, or credit card — remain exempt.</p>

<p>That distinction matters for cash senders. For a $500 cash transfer to Mexico, the additional cost is $5 — not enormous on its own, but enough to erode thin margins for frequent senders.</p>

<h2>Industry pushback and IRS relief</h2>
<p>Trade groups representing remittance providers lobbied hard against the provision, arguing it disproportionately affects low-income immigrant communities who rely on cash. Separately, the IRS (Notice 2025-55) gave providers limited relief from deposit penalties for the first three quarters of 2026, citing the challenges of implementing the new law.</p>

<p><a href="/companies/remitly">Remitly</a> published a detailed breakdown for customers on its blog, walking through which transaction types are affected and how to avoid the tax by switching to digital funding methods. <a href="/companies/wise">Wise</a> noted that its entirely digital model means none of its customers are impacted.</p>

<h2>The bigger picture</h2>
<p>For a broader view of where global remittances are heading, see our <a href="/guides/global-remittance-trends-2026">2026 global remittance trends report</a>.</p>

<p>For consumers, the takeaway is straightforward: funding transfers digitally avoids the tax entirely. Read our <a href="/guides/us-remittance-tax-2026">complete guide to the US remittance tax</a> for a provider-by-provider breakdown of who charges it and how to avoid it. Our guide to the <a href="/guides/cheapest-way-to-send-money-internationally">cheapest ways to send money internationally</a> covers how to reduce costs further, and our <a href="/guides/best-money-transfer-apps">best money transfer apps</a> roundup highlights the digital-first providers that are entirely unaffected by the tax. Our <a href="/send-money">comparison tool</a> shows real-time costs across providers, making it easy to find the cheapest option regardless of how you fund the transfer.</p>`,
    category: "Regulatory",
    publishedAt: "2026-03-14",
    source: "IRS / Treasury (Notice 2025-55)",
    sourceUrl: "https://www.irs.gov/newsroom/treasury-irs-provide-penalty-relief-for-remittance-transfer-providers-who-fail-to-deposit-excise-tax-under-the-one-big-beautiful-bill",
    providerSlugs: ["western-union", "moneygram", "remitly", "wise"],
  },
  {
    slug: "revolut-files-us-bank-charter-2026",
    title: "Revolut News March 2026: Files for US National Bank Charter, Pledges $500M",
    excerpt:
      "Revolut files for a US national bank charter with the OCC and FDIC in March 2026, with about $500M of US investment planned. What this means for Revolut's 70M+ customers and US money transfers.",
    image: "/images/news/revolut-us-charter.jpg",
    imageAlt: "The US Capitol building illuminated at night, representing Revolut's push into American finance",
    content: `<p>Revolut, the UK-headquartered fintech with more than 70 million customers worldwide, is making its boldest move yet in the American market. In early March the company filed applications with both the Office of the Comptroller of the Currency (OCC) and the Federal Deposit Insurance Corporation (FDIC) to establish "Revolut Bank US, N.A." — a full national bank charter.</p>

<h2>What a charter would unlock</h2>
<p>A national bank charter isn't just a regulatory badge — it fundamentally changes what Revolut can offer US customers. Direct access to Fedwire and ACH would slash the company's reliance on partner banks for domestic transfers. FDIC-insured deposits would let Revolut compete head-on with traditional banks, not just other fintechs. And operating under a single federal charter eliminates the patchwork of state-by-state money transmitter licences the company currently maintains.</p>

<p>For international money transfers specifically, cutting out intermediary banks should reduce both costs and settlement times on US-originated corridors. That's good news for anyone sending dollars abroad.</p>

<h2>The $500 million commitment</h2>
<p>Alongside the charter filing, <a href="/companies/revolut">Revolut</a> appointed fintech veteran Cetin Duransoy as US CEO, and said it expects to invest about $500 million in the US over the next three to five years. The funds will go toward hiring, infrastructure build-out, and customer acquisition — areas where Revolut has lagged behind US-native competitors like Cash App and Venmo.</p>

<h2>September update: conditional approval, further steps pending</h2>
<p>In its <a href="https://www.revolut.com/en-AU/news/revolut_receives_conditional_approval_from_u_s_office_of_the_comptroller_of_the_currency_to_form_a_national_bank/" target="_blank" rel="noopener noreferrer">3 September announcement</a>, Revolut reported conditional OCC approval. The company said it still needed to complete FDIC and Federal Reserve processes and obtain final OCC approval, with a proposed bank launch planned for 2027. This updates the March application covered here; it is not an announcement that the proposed US bank has opened.</p>

<h2>Separate the bank launch from the transfer quote</h2>
<p>A sender evaluating Revolut has two decisions to make: whether a future banking product fits their needs, and whether the transfer offered today delivers the required amount abroad. An approval milestone answers neither question on its own. For the payment, record the dollars debited, the destination-currency payout and the promised arrival date on the confirmation screen.</p>
<p>Revisit the banking decision when Revolut publishes the new account terms and migration instructions. Revisit the transfer decision whenever the fee, conversion rate or receiving method changes. Keeping those decisions separate avoids treating a corporate expansion announcement as evidence of a cheaper remittance.</p>

<p>Still, if approved, a chartered Revolut would become one of the largest digital-only banks in the US — and a formidable competitor in cross-border payments. Revolut is part of a broader wave — see our analysis of <a href="/guides/crypto-banking-licenses-2026">crypto banking licenses and what they mean for money transfers</a>. Our <a href="/guides/best-money-transfer-apps">best money transfer apps</a> guide already covers Revolut's current offering, and our explainer on <a href="/guides/multi-currency-accounts-exchange-rates">multi-currency accounts and exchange rates</a> is worth reading if you're considering switching. We'll be tracking the application's progress and updating our <a href="/companies/revolut">Revolut review</a> as details emerge.</p>`,
    category: "Regulatory",
    publishedAt: "2026-03-13",
    updatedAt: "2026-09-26",
    source: "Revolut announcements and US customer help",
    sourceUrl: "https://www.revolut.com/en-AU/news/revolut_files_u_s_bank_charter_application_names_new_u_s_ceo/",
    providerSlugs: ["revolut"],
  },
  {
    slug: "stripe-paypal-acquisition-talks-2026",
    title: "Stripe Reportedly Exploring PayPal Acquisition in Landmark Fintech Deal",
    excerpt:
      "Sources say the $159 billion payments giant is in early-stage conversations about acquiring all or part of PayPal, which would reshape the global payments landscape.",
    image: "/images/news/stripe-paypal-deal.jpg",
    imageAlt: "Two businessmen sealing a deal with a handshake, representing the reported Stripe-PayPal acquisition talks",
    content: `<p>Payments infrastructure giant Stripe is reportedly exploring an acquisition of PayPal. Bloomberg reported on February 24, citing people familiar with the matter, that deliberations are in early stages, with no certainty of a deal.</p>

<p><strong>Update, July 2026:</strong> Stripe and Advent International offered $60.50 a share for PayPal, a deal that would value it at more than $53 billion, <a href="https://www.cnbc.com/2026/07/15/stripe-advent-offer-to-buy-paypal-for-more-than-53-billion-reuters.html" target="_blank" rel="noopener noreferrer">CNBC reported</a>, citing Reuters.</p>

<h2>The numbers behind the rumour</h2>
<p>Stripe, valued at $159 billion in a February 2026 tender offer, dwarfs PayPal's current public market capitalisation of roughly $43 billion. That valuation gap — PayPal traded above $300 billion as recently as 2021 — reflects a dramatic reversal of fortunes. PayPal has struggled with slowing growth, increased competition from Apple Pay and Google Pay, and an identity crisis about whether it's a consumer app or a merchant platform.</p>

<p>For Stripe, which has built its empire on developer tools and merchant-side payments infrastructure, acquiring <a href="/companies/paypal">PayPal</a> would add a massive consumer-facing brand, the Venmo peer-to-peer network, and <a href="/companies/xoom">Xoom</a> — PayPal's international money transfer service that competes directly with <a href="/companies/wise">Wise</a> and <a href="/companies/remitly">Remitly</a>.</p>

<h2>What it could mean for money transfers</h2>
<p>Xoom, which PayPal acquired in 2015 for $890 million, is PayPal's cross-border remittance service. Under PayPal's ownership, the service has operated somewhat independently. A Stripe acquisition could bring Xoom's remittance capabilities into Stripe's infrastructure, potentially creating a vertically integrated cross-border payments stack that serves both merchants and consumers.</p>

<p>Whether any deal materialises remains unclear. Regulatory hurdles would be significant — antitrust authorities in the US, EU, and UK would all need to approve a combination of this scale. But the conversation itself signals how rapidly the payments industry is consolidating — a trend well documented in our <a href="/guides/global-remittance-trends-2026">2026 global remittance trends</a> report. For a consumer-level breakdown of which services deliver the best value today, see our <a href="/guides/best-money-transfer-services">best money transfer services</a> guide. In the meantime, use <a href="/send-money">our comparison tool</a> to find the best rates across all active providers.</p>`,
    category: "Industry News",
    publishedAt: "2026-03-12",
    source: "Bloomberg, via CoinDesk",
    sourceUrl: "https://www.coindesk.com/business/2026/02/24/payments-giant-stripe-reportedly-mulling-paypal-acquisition",
    providerSlugs: ["paypal", "xoom"],
  },
  {
    slug: "china-digital-yuan-interest-bearing-cbdc",
    title: "Analysis: What Interest-Bearing Digital Yuan Wallets Could Mean for Cross-Border Payments",
    excerpt:
      "China now lets banks pay interest on digital yuan wallets, the first central bank digital currency to bear interest. What this could mean for the future of cross-border payments.",
    image: "/images/news/digital-yuan-interest.jpg",
    imageAlt: "Chinese yuan banknotes spread out, representing China's digital currency developments",
    content: `<p>China's digital yuan (e-CNY) has crossed a threshold that no other central bank digital currency has reached: interest-bearing wallets. Under an overhaul announced on December 29, 2025 and in force from January 1, 2026, banks may pay interest on balances in real-name e-CNY wallets, which are now covered by deposit insurance and managed as part of the banks' assets and liabilities.</p>

<h2>Why this matters beyond China</h2>
<p>Central banks around the world have debated whether CBDCs should bear interest. The argument against is straightforward — an interest-bearing CBDC could pull deposits away from commercial banks, destabilising the financial system. China's decision to go ahead anyway is the biggest real-world test of that theory.</p>

<p>The scale is significant. By the end of November 2025 the digital yuan had processed 3.48 billion transactions worth 16.7 trillion yuan (roughly $2.3 trillion) since its 2019 pilot. Because wallet balances now sit on the operating banks' books, it is those banks, not the central bank, that pay the interest — which makes e-CNY behave more like a deposit than like cash.</p>

<h2>What it could mean for cross-border payments</h2>
<p>China has been piloting cross-border e-CNY transactions through the mBridge project, a collaboration with central banks in Hong Kong, Thailand and the UAE. An interest-bearing digital yuan could accelerate adoption in these corridors, particularly for trade settlement and potentially for person-to-person remittances.</p>

<p>For now, the direct impact on Western consumers sending money to China is minimal — inbound remittances to China still flow through traditional channels. Our <a href="/guides/how-to-send-money-abroad">guide to sending money abroad</a> covers the best approaches for reaching Asian corridors today. The digital yuan's evolution is worth watching as a bellwether for how CBDCs might reshape the landscape described in our <a href="/guides/global-remittance-trends-2026">2026 global remittance trends</a> report — where digital payment infrastructure in emerging markets is among the biggest stories.</p>`,
    category: "Industry News",
    publishedAt: "2026-03-10",
    source: "Caixin Global",
    sourceUrl: "https://www.caixinglobal.com/2025-12-29/china-to-allow-interest-on-digital-yuan-in-major-overhaul-102398302.html",
  },
  {
    slug: "absa-thunes-global-pay-africa-remittances",
    title: "South Africa's Absa and Thunes Launch Digital Remittance Service Targeting 18 Countries",
    excerpt:
      "Absa Global Pay offers instant transfers to bank accounts, mobile wallets, and cash pickup points across Africa, Asia, and the UK — backed by Thunes' payments network.",
    image: "/images/news/absa-global-pay.jpg",
    imageAlt: "Downtown Johannesburg skyline, home to Absa's headquarters and the launch of Absa Global Pay",
    content: `<p>A new contender has entered the cross-border remittance space. Absa, one of South Africa's largest banks, partnered with global payments network Thunes to launch Absa Global Pay on March 3 — a digital-first service that lets customers send money to 18 countries from their Absa banking app.</p>

<h2>How it works</h2>
<p>Absa Global Pay supports three delivery methods: direct bank deposits, mobile wallet credits, and cash pickup. Recipients in markets like Kenya, India, Pakistan, Malawi, and Zimbabwe can choose whichever method suits them best. Absa and Thunes describe it as offering "instant settlement", with real-time notifications and full visibility of each transfer.</p>

<p>Six of the 18 markets are in the first release: the UK, Kenya, India, Malawi, Pakistan and Zimbabwe.</p>

<h2>The Thunes connection</h2>
<p>Thunes, a Singapore-based payments network, connects over 130 countries through direct integrations with mobile wallets, banks, and cash-out networks. The company has quietly become a key infrastructure player in emerging-market payments, powering the backend for several well-known remittance brands. Its partnership with Absa gives the bank instant access to payout infrastructure that would have taken years to build independently.</p>

<h2>Competitive implications</h2>
<p>Sub-Saharan Africa remains the most expensive region to send money to, according to the World Bank's Remittance Prices Worldwide data. New entrants like Absa Global Pay inject competition into corridors that have traditionally been dominated by <a href="/companies/western-union">Western Union</a>, <a href="/companies/moneygram">MoneyGram</a>, and a handful of regional operators. More competition typically means lower prices — a pattern we've seen play out in mature digital corridors like <a href="/send-money/usa-to-nigeria">USA to Nigeria</a> and UK-to-Philippines. For a deeper look at these trends, see our <a href="/guides/global-remittance-trends-2026">2026 global remittance trends</a> report, or compare costs right now using our guide to the <a href="/guides/cheapest-way-to-send-money-internationally">cheapest ways to send money internationally</a>.</p>`,
    category: "Announcement",
    publishedAt: "2026-03-09",
    source: "FinTech Global / Thunes",
    sourceUrl: "https://fintech.global/2026/03/09/absa-and-thunes-launch-absa-global-pay-for-africa/",
  },
  {
    slug: "stablecoins-cross-border-payments-2026",
    title: "Stablecoins Are Quietly Becoming the Backbone of Cross-Border B2B Payments",
    excerpt:
      "PayPal, Stripe, and major banks are racing to build stablecoin infrastructure for international business payments, with enterprise corridors emerging as the breakout use case.",
    image: "/images/news/stablecoin-payments.jpg",
    imageAlt: "A gold Bitcoin coin, representing the growing role of digital currencies in cross-border payments",
    content: `<p>While retail crypto adoption has been a rollercoaster, a quieter revolution is unfolding in cross-border business payments. Stablecoins — digital currencies pegged to traditional assets like the US dollar — are gaining serious traction as settlement rails for international B2B transactions, and some of the biggest names in payments are driving the push.</p>

<h2>The corporate heavyweights moving in</h2>
<p><a href="/companies/paypal">PayPal</a> has been expanding the reach of PYUSD, its dollar-pegged stablecoin, beyond consumer wallets into merchant settlement. Stripe's Bridge subsidiary, acquired in late 2024, recently received conditional OCC approval to operate a federally chartered trust bank focused on stablecoin products. And Societe Generale's digital-assets arm, SG-FORGE, already issues its own euro and dollar stablecoins.</p>

<p>The appeal for businesses is practical: a correspondent-banking payment can pass through several intermediary banks before it arrives, each adding time and cost, while a stablecoin transfer settles on-chain in minutes.</p>

<h2>What about consumer remittances?</h2>
<p>The technology hasn't meaningfully reached everyday senders yet, but the building blocks are falling into place. <a href="/companies/moneygram">MoneyGram</a>'s existing crypto-to-cash service via the Stellar network demonstrates one bridge between stablecoin rails and cash economies. As regulatory frameworks mature — particularly around stablecoin issuance and reserve requirements — expect more providers to offer stablecoin-powered corridors, especially to markets where traditional banking infrastructure is sparse. For a deep dive into the companies driving this shift, read our guide on <a href="/guides/crypto-banking-licenses-2026">crypto banking licenses and what they mean for transfers</a>.</p>

<h2>Regulatory tailwinds</h2>
<p>The rules are arriving. The US GENIUS Act became law in July 2025 and is now in rule-making, the EU's MiCA stablecoin rules have applied since June 2024, and the UK is building its own regime. Clear rules around reserve backing, redemption rights, and operational resilience could transform stablecoins from a niche fintech tool into mainstream financial infrastructure. Businesses handling cross-border payments should read our <a href="/guides/business-international-payments-guide">guide to international business payments</a> to understand how emerging rails compare to traditional options today. For the macro view of where these changes fit, see our <a href="/guides/global-remittance-trends-2026">2026 global remittance trends</a> report. For cross-border payments, that transformation can't come soon enough.</p>`,
    category: "Industry News",
    publishedAt: "2026-03-08",
    source: "Banking Dive / SG-FORGE",
    sourceUrl: "https://www.bankingdive.com/news/stripe-bridge-occ-conditional-approval-national-trust-bank-charter/812417/",
    providerSlugs: ["paypal", "moneygram"],
  },
  {
    slug: "embedded-finance-regulation-tightening-2026",
    title: "Embedded Finance Payouts: Who Holds the Money When a Withdrawal Fails",
    excerpt:
      "Embedded finance puts an app between customers and financial institutions. A marketplace payout example explains why regulation focuses on who holds funds and handles failures.",
    image: "/images/news/embedded-finance-regulation.jpg",
    imageAlt: "A statue beside a flag, symbolising regulatory oversight of embedded finance",
    content: `<p>A marketplace can show one balance while several businesses handle the underlying money. That separation is the central issue in embedded finance: the customer sees the platform, but the deposit relationship and payment processing may sit elsewhere.</p>

<h2>The supervisory issue is not new</h2>
<p>On 25 July 2024, the FDIC, Federal Reserve and OCC issued a <a href="https://www.fdic.gov/news/financial-institution-letters/2024/agencies-issue-statement-bank-arrangements-third-parties" target="_blank" rel="noopener noreferrer">joint statement about banks using third parties to deliver deposit products</a>. It describes potential risks and risk-management practices. The statement itself says it does not create new requirements or supervisory expectations. It should not be described as a new 2026 rule simply because embedded finance remains in the news.</p>

<h2>A marketplace payout shows why the division of responsibility matters</h2>
<p>Consider a hypothetical contractor who sees a $1,200 balance in a marketplace app and requests payment to an overseas bank account. That screen alone does not tell the contractor whether the amount is available for withdrawal, whether a currency conversion has been booked, or whether the bank has received a payment instruction.</p>
<p>Our practical reading is to ask three separate questions. Which legal entity owes the displayed balance? Which company supplies the exchange-rate quote? Which support team can trace or reverse the payout instruction? A single app can present all three steps while different organisations perform them behind the scenes.</p>
<p>If the withdrawal fails, save the marketplace balance entry, the conversion confirmation and the payout reference. Ask support which step failed and whether the money returned in the original currency. The point of this example is responsibility and reconciliation, not an allegation about any named platform or a claim that every app uses the same structure.</p>

<h2>Keep the sale, conversion and payout records separate</h2>
<p>In the contractor example, a completed job, a booked currency exchange and a delivered bank payment are three different events. A marketplace marking the job paid does not, by itself, identify which of the later events has occurred. Reconcile the job or invoice identifier to the withdrawal request, then use the payout reference when asking about the receiving account.</p>
<p>For a business choosing a platform, this suggests a practical demonstration to request: show how a failed overseas withdrawal appears in the transaction history and which support team owns the case. That is a more useful operational question than whether the platform advertises an all-in-one experience. Our <a href="/guides/business-international-payments-guide">business payments guide</a> covers the separate task of choosing how to fund a supplier payment.</p>`,
    category: "Regulatory",
    publishedAt: "2026-03-07",
    updatedAt: "2026-09-26",
    source: "FDIC, Federal Reserve and OCC joint statement; industry context",
    sourceUrl: "https://www.fdic.gov/news/financial-institution-letters/2024/agencies-issue-statement-bank-arrangements-third-parties",
    providerSlugs: ["wise", "paypal"],
  },
  {
    slug: "rwanda-launches-national-fintech-centre-2026",
    title: "Analysis: Rwanda's Ambitions as Africa's Fintech Hub and What It Means for Remittances",
    excerpt:
      "What Rwanda's documented fintech innovation work could mean for receiving remittances—and what evidence would demonstrate a better RWF payout.",
    image: "/images/news/rwanda-fintech-centre.jpg",
    imageAlt: "Aerial view of Kigali's skyline in Rwanda",
    content: `<p><em>Updated 26 September: earlier versions repeated unverified details about a FinTech Centre launch. This analysis now uses the National Bank of Rwanda's published account of its innovation work; it does not treat those launch details as established facts.</em></p>
<p>Rwanda's fintech ambitions matter to remittance users when they improve the actual path between an overseas sender and a local recipient. A new organisation, event or startup programme is an input to that process. Its existence alone does not show that a family receives more francs or can resolve a failed payment faster.</p>
<h2>What the central bank has documented</h2>
<p>The National Bank of Rwanda's <a href="https://www.bnr.rw/documents/MPFSS_Report_March_2025.pdf" target="_blank" rel="noopener noreferrer">March 2025 monetary policy and financial stability report</a> describes a regulatory sandbox and an open-finance framework. It discusses support for innovative financial services, including payment and reconciliation tools. This provides a documented basis for discussing Rwanda's fintech ecosystem without assuming that every experimental product is a widely available remittance service.</p>
<h2>Measure the receiving experience</h2>
<p>Consider a hypothetical family in Kigali expecting RWF for a household bill. A useful new service would make the amount due, the wallet or account receiving it and the time of availability clear. If the payment fails, the sender and recipient also need to know which institution can investigate it. A lower advertised fee addresses only one part of that experience.</p>
<p>For a meaningful comparison, hold the sending amount and receiving method constant. Record the francs credited, any extra charge to access those francs and whether the recipient could actually use them by the required date. A cash collection and a wallet credit may have different final costs even when their quoted exchange rates match.</p>
<h2>What would support a claim of progress?</h2>
<p>Our analysis would look for an available product with published eligibility, a supported receiving partner, transparent pricing and a clear complaint route. Testing or investment announcements can be followed as developments, but they should not be counted as evidence that remittance prices have already fallen.</p>
<p>A recipient trial should reconcile the sending receipt with the final RWF credit and distinguish provider processing from a subsequent withdrawal. We have not performed that trial for the initiatives discussed here. Until such evidence is available, the useful question for a sender is which supported payment meets today's obligation—not which announcement sounds most ambitious.</p>
<p>For the current payment, compare the receiving options offered on your route and retain the confirmation. For broader context, our <a href="/guides/global-remittance-trends-2026">remittance trends guide</a> explains how market-level developments differ from the price of an individual transfer.</p>`,
    category: "Industry News",
    publishedAt: "2026-03-14",
    updatedAt: "2026-09-26",
    source: "National Bank of Rwanda: March 2025 report; SendMoneyCompare analysis",
    sourceUrl: "https://www.bnr.rw/documents/MPFSS_Report_March_2025.pdf",
    providerSlugs: ["worldremit", "taptap-send"],
  },
  {
    slug: "moneyremitter-launches-deals-comparison",
    title: "SendMoneyCompare Now Shows Promo Codes & Referral Bonuses Alongside Rates",
    excerpt:
      "Our comparison platform now displays sign-up offers, referral rewards, and active promo codes for 15 providers — so you can factor in bonuses when choosing where to send.",
    image: "/images/news/moneyremitter-deals.jpg",
    imageAlt: "A person making a mobile payment using a smartphone, representing new deal comparison features",
    content: `<p><strong>Update, October 2026:</strong> the deal badges and expanded referral details on provider cards described below were removed in September 2026. The "Best deals" sort and "Deals" filter remain, and our <a href="/guides/money-transfer-promo-codes-referral-programs">promo codes guide</a> lists current offers.</p>

<p>We've shipped a new feature: you can now see <strong>promo codes</strong>, <strong>sign-up bonuses</strong>, and <strong>refer-a-friend rewards</strong> directly on the SendMoneyCompare comparison page, right alongside the exchange rates and fees you already rely on.</p>

<h2>What's new</h2>
<p>Every provider card on the <a href="/send-money">Send Money</a> page now shows deal badges where applicable. You'll see badges like "Earn $25" for <a href="/companies/remitly">Remitly</a>'s referral programme, "3 free transfers" for <a href="/companies/worldremit">WorldRemit</a>'s promo code, and "Earn £50" for <a href="/companies/torfx">TorFX</a>'s generous refer-a-friend scheme. Expanding any provider card reveals the full details — what you earn, what your friend gets, and any conditions attached.</p>

<h2>New sorting and filtering</h2>
<p>We've added a <strong>"Best deals"</strong> sort option that ranks providers by the overall value of their promotions and loyalty programmes. There's also a new <strong>"Deals" filter</strong> that lets you narrow results to only providers offering referral bonuses, sign-up incentives, or active promo codes.</p>

<h2>Highlights worth knowing (as listed in March 2026)</h2>
<ul>
<li><strong>TorFX:</strong> £50 for both you and your friend on transfers over £2,000</li>
<li><strong>WorldRemit:</strong> Use code <strong>3FREE</strong> to get three fee-free transfers</li>
<li><strong><a href="/companies/wise">Wise</a>:</strong> Earn up to $115 for every three friends who transfer $300 or more</li>
<li><strong><a href="/companies/western-union">Western Union</a>:</strong> $15 Amazon gift card per referral</li>
</ul>

<p>Offers change often, so check the provider's own terms before you rely on one. When bonuses aren't the deciding factor, our guide to the <a href="/guides/cheapest-way-to-send-money-internationally">cheapest ways to send money internationally</a> and our <a href="/guides/best-money-transfer-services">best money transfer services</a> roundup help you pick the right provider on fundamentals alone. For the full breakdown of every provider's current offers, check out our comprehensive guide: <a href="/guides/money-transfer-promo-codes-referral-programs">Money Transfer Promo Codes & Referral Programs (2026)</a>.</p>`,
    category: "Announcement",
    publishedAt: "2026-03-14",
    source: "SendMoneyCompare",
    sourceUrl: "https://sendmoneycompare.com/guides/money-transfer-promo-codes-referral-programs",
    providerSlugs: ["remitly", "worldremit", "wise", "western-union", "torfx"],
  },

  // ── March 18, 2026 stories ──

  {
    slug: "fed-holds-rates-march-2026-one-cut-dot-plot",
    title: "Fed Holds Rates Steady, Signals Just One Cut in 2026 — What It Means for Your Transfers",
    excerpt:
      "The Federal Reserve kept rates at 3.5–3.75% and the dot plot projects only one cut this year. Here's how the stronger dollar affects remittance costs across key corridors.",
    image: "/images/news/fed-holds-rates-march-2026.svg",
    imageAlt: "Chart showing the Federal Reserve's median projection of one rate cut in 2026, unchanged from December 2025 to March 2026",
    content: `<div class="blog-answer-box">
<p><strong>Key takeaway:</strong> The Fed held rates at 3.5–3.75% and projects just one cut in 2026, the same median as in December. A stronger dollar means Americans sending money abroad get more local currency per dollar — but the window may narrow if oil prices push inflation higher. Compare rates from multiple providers before your next transfer.</p>
</div>

<p>The Federal Reserve held interest rates steady at <strong>3.5–3.75%</strong> at its March 17–18 meeting, as widely expected. But the real story is in the updated "dot plot" — the Fed still projects <strong>just one rate cut in 2026</strong>, the same median as in December, though Powell said "four or five people went from two to one". Rising oil prices and sticky inflation readings narrowed the window for easing.</p>

<h2>How the Fed rate path shifted</h2>
<div class="blog-table-box">
<h3 style="margin-top: 0;">Fed Rate Cut Projections: How the Dot Plot Changed</h3>
<table>
<thead><tr><th>Meeting</th><th>Rate Range</th><th>Projected Cuts in 2026</th><th>Signal</th></tr></thead>
<tbody>
<tr><td>Dec 2025</td><td>3.50–3.75% (cut)</td><td>1 cut</td><td>Cut, then signalled a slower pace</td></tr>
<tr><td>Jan 2026</td><td>3.50–3.75% (hold)</td><td>No projection that month</td><td>Wait and see</td></tr>
<tr class="blog-row-highlight"><td><strong>Mar 2026 (today)</strong></td><td><strong>3.50–3.75% (hold)</strong></td><td><strong>1 cut</strong></td><td><strong>Median unchanged; several officials moved from two cuts to one</strong></td></tr>
</tbody>
</table>
</div>

<h2>What this means for money transfers</h2>
<p>Fewer rate cuts means the US dollar stays <strong>stronger for longer</strong>. For Americans sending money abroad, this is actually good news — a stronger dollar means your recipient gets more local currency per dollar sent.</p>

<div class="blog-table-box">
<h3 style="margin-top: 0;">Corridor Impact: How a Stronger Dollar Affects Your Transfer</h3>
<table>
<thead><tr><th>Corridor</th><th>Direction</th><th>Impact for Senders</th><th>Compare Now</th></tr></thead>
<tbody>
<tr class="blog-row-highlight"><td><strong>USD → INR</strong></td><td>Rupee weakening</td><td>More rupees per dollar — good time to send</td><td><a href="/send-money/usa-to-india">Live rates →</a></td></tr>
<tr><td><strong>USD → MXN</strong></td><td>Peso resilient</td><td>Slight improvement possible</td><td><a href="/send-money/usa-to-mexico">Live rates →</a></td></tr>
<tr><td><strong>USD → PHP</strong></td><td>Peso sensitive to USD</td><td>OFW families may benefit short-term</td><td><a href="/send-money/usa-to-philippines">Live rates →</a></td></tr>
<tr><td><strong>USD → PKR</strong></td><td>PKR under pressure</td><td>More rupees per dollar</td><td><a href="/send-money/usa-to-pakistan">Live rates →</a></td></tr>
<tr><td><strong>USD → NGN</strong></td><td>Naira volatile</td><td>Dollar strength amplifies naira weakness</td><td><a href="/send-money/usa-to-nigeria">Live rates →</a></td></tr>
<tr><td><strong>GBP → INR</strong></td><td>Sterling stable vs USD</td><td>Minimal change for UK senders</td><td><a href="/send-money/uk-to-india">Live rates →</a></td></tr>
</tbody>
</table>
</div>

<h2>The bigger picture: oil prices and inflation</h2>
<p>Fed Chair Jerome Powell pointed to <strong>Middle East oil supply disruptions</strong> as a key inflation risk. Higher oil prices flow through to shipping costs, energy bills, and ultimately to the currencies of oil-importing nations like India, Pakistan, and the Philippines. If oil prices stay elevated, currencies in these countries may weaken further — which paradoxically benefits senders from the US (more local currency per dollar) but hurts local purchasing power.</p>

<div class="blog-answer-box-warning">
<p style="margin:0"><strong>Market speculation:</strong> If oil stays above $90/barrel through Q2, emerging market currencies (INR, PKR, PHP, NGN) could weaken a further 2–5% against the dollar. This would make Q2 an unusually favourable window for US senders — but a painful period for recipients' purchasing power. The <a href="/guides/how-euribor-affects-euro-transfers">Euribor guide</a> explains how European rate dynamics add another layer.</p>
</div>

<h2>What to do now</h2>
<p>If you have a transfer planned:</p>
<ol>
<li><strong>Compare rates now</strong> — the post-Fed dollar strength may not last if economic data softens. Use our <a href="/send-money">comparison tool</a> to lock in today's rates.</li>
<li><strong>Set rate alerts</strong> — <a href="/companies/wise">Wise</a> and <a href="/companies/xe">Xe</a> let you set alerts when your target rate hits. If you're not in a rush, wait for the optimal moment.</li>
<li><strong>Avoid banks during volatile weeks</strong> — Banks widen their exchange rate markup when currencies move. Specialist providers price closer to the mid-market rate: <a href="/companies/wise">Wise</a>'s median markup across the corridors we quote is {{AVG_MARKUP_PCT:wise}}. See our <a href="/guides/exchange-rate-markup-explained">exchange rate markup guide</a>.</li>
<li><strong>Consider splitting large transfers</strong> — If you're sending $5,000+, consider splitting into two transfers a week apart to average out the rate. <a href="/companies/ofx">OFX</a> offers forward contracts to lock rates for up to 12 months.</li>
</ol>

<p>The next major catalyst is the <strong>April 28–29 Fed meeting</strong> and the April jobs report. We'll cover both as they happen. For the full breakdown of how central bank decisions affect your transfers, read our <a href="/news/central-bank-super-week-march-2026">central bank super week analysis</a>. For background on how different providers handle volatility, read the <a href="/guides/cheapest-way-to-send-money-internationally">cheapest international transfers guide</a> and our <a href="/guides/best-money-transfer-services">best money transfer services</a> ranking.</p>`,
    category: "Industry News",
    publishedAt: "2026-03-18",
    source: "CNBC / Federal Reserve",
    sourceUrl: "https://www.cnbc.com/2026/03/18/fed-interest-rate-decision-march-2026.html",
    providerSlugs: ["wise", "remitly", "xe"],
  },
  {
    slug: "gcash-free-middle-east-transfers-philippines-ofw-2026",
    title: "GCash Drops All Fees for Filipino Transfers to the Middle East — Philippine Congress Pushes for Sector-Wide Waiver",
    excerpt:
      "GCash is waiving fees for Filipinos in the Gulf sending money home, and separately making transfers from the Philippines to the UAE, Saudi Arabia, Qatar and Oman free through March 31. Meanwhile, the Philippine House adopted a resolution urging all providers to waive OFW remittance fees.",
    image: "/images/news/gcash-ofw-fee-waiver-2026.svg",
    imageAlt: "Infographic showing GCash's zero-fee transfers from the Philippines to the UAE, Saudi Arabia, Qatar and Oman, with key statistics: about 2.2M OFWs, about $40B annual remittances",
    content: `<div class="blog-answer-box">
<p><strong>Quick summary:</strong> GCash is running two offers. GCash Overseas users in the Gulf pay no fees on bank transfers home, mobile load and bills, refunded as cashback. And from March 12–31, 2026, transfers sent from the Philippines to the UAE, Saudi Arabia, Qatar and Oman are free, with no minimum amount. Separately, the Philippine House of Representatives adopted Resolution 905 urging all banks and remittance providers to waive or reduce OFW fees amid the Middle East crisis.</p>
</div>

<p>Two developments in the Philippines this week could change how the country's roughly <strong>2.2 million overseas Filipino workers (OFWs)</strong> send money home:</p>

<h2>GCash: two fee waivers for the Middle East</h2>
<p><strong>GCash</strong>, the Philippines' largest mobile wallet, is running two separate offers. <strong>For Filipinos in the Gulf</strong>, GCash Overseas users pay no fees on bank transfers to the Philippines, mobile load and bill payments, refunded as cashback. <strong>For senders in the Philippines</strong>, GCash International Transfer to the UAE, Saudi Arabia, Qatar and Oman is free from March 12–31, 2026, with no minimum amount.</p>

<p>The timing is significant — rising oil prices driven by <strong>Middle East supply disruptions</strong> are increasing the cost of living for Filipino workers in the Gulf. GCash is positioning the fee waiver as relief for OFWs who need every dirham and riyal to stretch further.</p>

<div class="blog-table-box">
<h3 style="margin-top: 0;">GCash Fee Waivers: What's Covered</h3>
<table>
<thead><tr><th>Offer</th><th>Who it's for</th><th>What's free</th><th>Dates</th></tr></thead>
<tbody>
<tr class="blog-row-highlight"><td><strong>GCash Overseas fee waiver</strong></td><td>GCash Overseas users in the UAE, Saudi Arabia, Qatar, Bahrain, Kuwait and Oman (later also Israel, Lebanon and Jordan)</td><td>Bank transfers to the Philippines, mobile load and bill payments, refunded as cashback</td><td>From March 4; cashback for March 4–10 credited March 20, for March 11–14 on March 27; later extended to April 30</td></tr>
<tr><td><strong>GCash International Transfer</strong></td><td>Senders in the Philippines</td><td>Transfers to the UAE, Saudi Arabia, Qatar and Oman, no minimum amount</td><td>March 12–31, 2026</td></tr>
</tbody>
</table>
</div>

<h2>Philippine Congress: Waive ALL OFW remittance fees</h2>
<p>On March 18, the Philippine House of Representatives passed <strong>House Resolution 905</strong>, authored by Majority Leader Ferdinand Alexander Marcos, urging banks, remittance centres, and money transfer providers to <strong>temporarily waive or reduce fees</strong> for all OFW remittances — not just through GCash.</p>

<p>The resolution is non-binding (it cannot force providers to comply), but it sends a strong signal. If major players like <a href="/companies/western-union">Western Union</a>, <a href="/companies/remitly">Remitly</a>, and <a href="/companies/worldremit">WorldRemit</a> follow GCash's lead, Filipino workers could save billions of pesos collectively.</p>

<div class="blog-answer-box-warning">
<p style="margin:0"><strong>Our prediction:</strong> GCash's zero-fee promotion is a land-grab for OFW market share, not charity. Expect <a href="/companies/remitly">Remitly</a> and <a href="/companies/worldremit">WorldRemit</a> to respond within weeks with competing offers. The congressional resolution gives them political cover to do so. Watch our <a href="/guides/money-transfer-promo-codes-referral-programs">promo codes page</a> — we'll track every new offer as it launches.</p>
</div>

<h2>The numbers: why this matters</h2>
<div class="blog-table-box">
<h3 style="margin-top: 0;">Philippines Remittance Facts</h3>
<table>
<thead><tr><th>Metric</th><th>Value</th></tr></thead>
<tbody>
<tr><td>Overseas Filipino workers</td><td><strong>About 2.2 million</strong> (PSA, 2024)</td></tr>
<tr><td>Annual remittances</td><td><strong>About $40 billion</strong> (4th largest globally)</td></tr>
<tr><td>From Saudi Arabia, UAE, Qatar</td><td><strong>6.6%, 4.6% and 2.9%</strong> of 2025 cash remittances (BSP)</td></tr>
</tbody>
</table>
</div>

<h2>What OFWs should do right now</h2>
<ol>
<li><strong>If you use GCash Overseas in the Gulf, use the waiver while it runs</strong> — bank transfers home are refunded as cashback.</li>
<li><strong>Compare the total PHP received, not just fees</strong> — a waived fee does not mean a better exchange rate. Our <a href="/send-money/uae-to-philippines">UAE to Philippines comparison</a> shows what the providers we track deliver on the route.</li>
<li><strong>Check <a href="/send-money/saudi-arabia-to-philippines">Saudi Arabia to Philippines</a> rates too</strong> — different providers win on different Gulf corridors.</li>
<li><strong>Watch for competing offers</strong> — The congressional resolution may pressure other providers to match. We'll update our <a href="/guides/money-transfer-promo-codes-referral-programs">promo codes page</a> as new offers appear.</li>
<li><strong>For USA-based Filipinos</strong> — This promo doesn't apply to you, but our <a href="/send-money/usa-to-philippines">USA to Philippines comparison</a> and <a href="/guides/send-money-to-philippines-guide">Philippines transfer guide</a> show the cheapest options from the US.</li>
</ol>

<p>Every percentage point in fee reduction translates to hundreds of millions of pesos back in Filipino families' pockets. For the cheapest ways to send money to the Philippines from any country, see our <a href="/guides/send-money-to-philippines-guide">complete Philippines guide</a>, <a href="/guides/best-money-transfer-apps">best transfer apps</a>, and <a href="/guides/cheapest-way-to-send-money-internationally">cheapest international transfers</a> guide.</p>`,
    category: "Provider Update",
    publishedAt: "2026-03-18",
    source: "PhilNews / FintechNews.ph / Manila Bulletin",
    sourceUrl: "https://fintechnews.ph/70421/remittance/gcash-waives-transaction-fees-overseas-filipinos-middle-east-march/",
    providerSlugs: ["western-union", "remitly", "worldremit", "wise"],
  },
  {
    slug: "swift-75-percent-payments-ten-minutes-fsb-stablecoins-thunes-2026",
    title: "75% of Cross-Border Payments Now Arrive in 10 Minutes — But Stablecoins Are Coming for the Rest",
    excerpt:
      "SWIFT says three-quarters of international payments reach banks in under 10 minutes. Meanwhile, Thunes just connected 500 million stablecoin wallets to the SWIFT network. The race to eliminate slow, expensive transfers is accelerating.",
    image: "/images/news/swift-stablecoins-payments-2026.svg",
    imageAlt: "Chart comparing cross-border payment speeds from 2020 to 2026: bank wires went from 3-5 days to 10 minutes, while stablecoins settle in seconds",
    content: `<div class="blog-answer-box">
<p><strong>Key facts:</strong> SWIFT announced that 75% of cross-border payments now reach banks within 10 minutes (up from days just a few years ago). Separately, Thunes connected 500 million stablecoin wallets to the SWIFT network via USDC/USDT. And Wizz Financial completed the first US stablecoin remittance into 80 countries. The race to make international transfers instant and near-free is accelerating — but for consumers, specialist providers like <a href="/companies/wise">Wise</a> and <a href="/companies/remitly">Remitly</a> remain the best option today.</p>
</div>

<p>Two announcements in the past week paint a picture of an industry in rapid transformation.</p>

<h2>SWIFT: 75% of payments in 10 minutes</h2>
<p>At the <strong>Financial Stability Board's Cross-Border Payments Summit</strong> in London (March 12), SWIFT revealed that <strong>75% of cross-border payments now reach the beneficiary bank within 10 minutes</strong>, with some settling in seconds.</p>

<p>SWIFT also announced plans for a <strong>new retail payments framework by June 2026</strong>, ensuring consumer payments benefit from the fastest possible speeds, cost certainty, and end-to-end transparency. And in a nod to the blockchain competition, SWIFT is integrating a <strong>shared blockchain-based ledger</strong> for 24/7 real-time settlement.</p>

<p>For consumers, this means the traditional bank wire is getting faster — but it's still not cheap. Banks still charge a wire fee and set their own exchange rate, even as the underlying infrastructure improves. The speed gains benefit banks' bottom lines more than their customers' wallets. For a full breakdown of wire transfer costs, see our <a href="/guides/wire-transfer-guide">wire transfer guide</a>.</p>

<h2>Thunes + SWIFT: 500 million stablecoin wallets connected</h2>
<p>On March 17, <strong>Thunes</strong> (a major payments infrastructure provider) announced it can now route stablecoin payouts — in <strong>USDC and USDT</strong> — to over <strong>500 million crypto wallets</strong> worldwide, all connected via SWIFT. The 11,500 banks already on the SWIFT network can now send payments to stablecoin addresses with zero additional integration.</p>

<p>This is a quiet revolution. It means a corporate treasurer in New York could soon initiate a "wire transfer" through their normal banking portal and have the funds arrive in a vendor's stablecoin wallet in Lagos or Manila in <strong>seconds, at a fraction of the cost</strong>.</p>

<h2>Wizz Financial: First US stablecoin remittance completed</h2>
<p>Separately, <strong>Wizz Financial</strong> completed its first stablecoin-powered cross-border remittance from the United States on March 12, with capabilities into 80 countries. Using <strong>BitGo's digital trust bank infrastructure</strong>, Wizz converts fiat to stablecoins on the back end for near-real-time settlement.</p>

<h2>What this means for people sending money abroad</h2>
<p>The convergence of faster SWIFT rails, stablecoin infrastructure, and fintech competition is compressing both cost and time:</p>

<p>For most people sending money today, <strong>specialist providers remain the best option</strong>. They're already fast (minutes via <a href="/send-money/usa-to-india">IMPS</a>, <a href="/send-money/usa-to-kenya">M-Pesa</a>, <a href="/send-money/usa-to-mexico">SPEI</a>) and dramatically cheaper than banks. Stablecoins are the future, but most recipients still need local currency in a bank account or mobile wallet — and that "last mile" conversion is where fintechs like <a href="/companies/wise">Wise</a> and <a href="/companies/remitly">Remitly</a> excel today.</p>

<h2>Stablecoin adoption: where we are now</h2>
<div class="blog-table-box">
<h3 style="margin-top: 0;">Stablecoin Usage for Cross-Border Payments</h3>
<table>
<thead><tr><th>Metric</th><th>Value</th><th>Source</th></tr></thead>
<tbody>
<tr><td>US remittance users who have used stablecoins</td><td><strong>26%</strong></td><td><a href="https://www.blockchainresearchlab.org/2025/04/27/new-research-26-of-u-s-based-remittance-users-have-already-adopted-stablecoins-for-their-transactions/" target="_blank" rel="noopener noreferrer">Blockchain Research Lab</a> (Apr 2025)</td></tr>
<tr><td>Stablecoin wallets connected to SWIFT</td><td><strong>500M+</strong></td><td>Thunes (Mar 2026)</td></tr>
<tr><td>Banks on SWIFT network</td><td><strong>11,500</strong></td><td>SWIFT</td></tr>
</tbody>
</table>
</div>

<h2>Our take</h2>
<p>The market is bifurcating. SWIFT is getting faster, but banks aren't passing the savings through to consumers. Stablecoins offer near-zero cost, but require both parties to be comfortable with crypto infrastructure. <strong>Specialist transfer providers sit in the sweet spot</strong> — fast, cheap, and no crypto knowledge required. We expect this to remain true through at least 2027, with stablecoins gradually eating into B2B corridors first and consumer remittances later.</p>

<div class="blog-callout-green-sm">
<p style="margin:0"><strong>Bottom line for senders:</strong> You don't need to wait for stablecoins to save money today. Providers like <a href="/companies/wise">Wise</a> (0% markup), <a href="/companies/remitly">Remitly</a> (minutes delivery), and <a href="/companies/instarem">Instarem</a> (zero fees) already cost about half what banks do on our $1,000 index, and far less than that against the most expensive wire transfers — with no crypto involved. Use our <a href="/send-money">live comparison tool</a> to find the best rate right now.</p>
</div>

<h2>Related reading</h2>
<ul>
<li><a href="/guides/wire-transfer-guide">Wire Transfers Explained: Fees, Speed & Cheaper Alternatives</a></li>
<li><a href="/guides/cheapest-way-to-send-money-internationally">Cheapest Way to Send Money Internationally in 2026</a></li>
<li><a href="/guides/exchange-rate-markup-explained">Exchange Rate Markup Explained</a></li>
<li><a href="/guides/best-money-transfer-services">8 Best Money Transfer Services in 2026</a></li>
<li><a href="/business">International Business Payments — Compare Providers</a></li>
<li><a href="/news/stablecoins-cross-border-payments-2026">Stablecoins in Cross-Border Payments (previous analysis)</a></li>
</ul>`,
    category: "Industry News",
    publishedAt: "2026-03-18",
    source: "FSB / Thunes / PYMNTS.com",
    sourceUrl: "https://www.fsb.org/2026/03/fsb-kicks-off-new-implementation-phase-to-enhance-cross-border-payments-through-public-private-partnership/",
    providerSlugs: ["wise", "remitly", "western-union"],
  },
  {
    slug: "mexico-62b-remittance-corridor-goes-digital-2026",
    title:
      "Mexico's $62B Remittance Corridor Goes Digital — What It Means for Senders in 2026",
    excerpt:
      "Cash remittances to Mexico are declining rapidly as digital transfers surge. Bloomberg reports the world's largest corridor is going cashless — here's how it affects your costs.",
    image: "/images/news/mexico-remittance-digital.svg",
    imageAlt:
      "A smartphone showing a money transfer app with US and Mexican flags, representing the digital shift in US-Mexico remittances",
    content: `<p>The world's largest remittance corridor is moving from cash to digital.</p>

<p>Bloomberg <a href="https://www.bloomberg.com/news/articles/2026-03-17/mexico-s-62-billion-in-us-remittances-shifts-away-from-cash" target="_blank" rel="noopener noreferrer">reported on March 17</a> that Mexico's US remittance corridor — worth roughly <strong>$62 billion a year</strong> — is shifting from cash to digital. According to Mexico's central bank, digital transfers overtook cash in the corridor for the first time in 2025.</p>

<h2>Why the shift is accelerating in 2026</h2>
<p>Three forces are converging to push the US-Mexico corridor digital:</p>
<ul>
<li><strong>The 1% US remittance tax</strong> — The <a href="/news/us-remittance-excise-tax-takes-effect-2026">federal excise tax</a> that took effect in January 2026 applies only to cash-funded transfers. Digital transfers are exempt, giving millions of senders a direct financial incentive to switch from agent counters to apps.</li>
<li><strong>Mexico's expanding digital infrastructure</strong> — Bank of Mexico's SPEI instant payment system now processes over 300 million transactions per month. Recipients who once needed cash pickup now have bank accounts or digital wallets that can receive instant deposits.</li>
<li><strong>Provider competition on USD-MXN</strong> — <a href="/companies/remitly">Remitly</a>, <a href="/companies/wise">Wise</a> and newer apps such as Felix Pago and Bitso compete for digital USD-MXN transfers. Our <a href="/send-money/usa-to-mexico">USA to Mexico comparison page</a> shows fees starting at $0 with exchange rate markups under 1%.</li>
</ul>

<h2>What this means for your transfers</h2>
<p>The shift is unambiguously good for senders. As digital volume grows, providers compete harder on the corridor, pushing down both fees and exchange rate markups.</p>

<p>Cash-funded transfers now also carry the 1% US remittance tax, which funding from a bank account or card avoids.</p>

<h2>Winners and losers</h2>
<p>The clear winners are digital-first providers. <a href="/companies/wise">Wise</a> prices off the mid-market exchange rate — a real advantage, though the measured total-cost leader here is someone else: {{CORRIDOR_LEADER:USD:MXN}}.</p>

<p>The losers are traditional agent networks. <a href="/companies/western-union">Western Union</a> still operates thousands of agent locations across Mexico, but 39% of its transactions were digital at the end of 2025, up from 32% a year earlier, Bloomberg reported. <a href="/companies/moneygram">MoneyGram</a> faces similar pressure.</p>

<p>That said, cash isn't dead yet. Bloomberg notes that over 70% of Mexicans still use cash for daily transactions, and cash pickup remains essential for remittances to rural areas. But the trajectory is clear: digital is becoming the default.</p>

<h2>How to get the best rate on USD to MXN</h2>
<p>If you send money to Mexico regularly, here's how to maximise what your recipient receives:</p>
<ul>
<li><strong>Switch to digital</strong> — If you still send cash at an agent, switching to an app saves 3–5% per transfer plus avoids the 1% tax.</li>
<li><strong>Compare at your exact amount</strong> — Provider rankings change at different amounts. Our <a href="/send-money/usa-to-mexico">USA to Mexico comparison tool</a> shows live rates from 10+ providers.</li>
</ul>

<p>The $62 billion corridor going digital isn't just a story about Mexico — it's a preview of where every major remittance route is heading. For a broader view, see our <a href="/guides/global-remittance-trends-2026">2026 global remittance trends</a> report and our guide to the <a href="/guides/cheapest-way-to-send-money-internationally">cheapest ways to send money internationally</a>.</p>`,
    category: "Industry News",
    publishedAt: "2026-03-20",
    source: "Bloomberg",
    sourceUrl:
      "https://www.bloomberg.com/news/articles/2026-03-17/mexico-s-62-billion-in-us-remittances-shifts-away-from-cash",
    providerSlugs: ["remitly", "wise", "western-union", "moneygram", "taptap-send"],
  },
  {
    slug: "nigeria-cbn-naira-only-remittance-rule-2026",
    title:
      "Send Money to Nigeria: New CBN Naira-Only Rule Changes Everything (March 2026)",
    excerpt:
      "From May 1, money transfer operators must settle remittances to Nigeria through naira accounts, which the Nigerian press reads as the end of dollar payouts. What it means for senders, and what to do before the deadline.",
    image: "/images/news/nigeria-cbn-naira-remittance.svg",
    imageAlt:
      "Nigerian naira banknotes alongside a smartphone showing an international money transfer, representing the CBN's new remittance settlement rules",
    content: `<p>On March 24, 2026, the Central Bank of Nigeria dropped a directive that will reshape how millions of diaspora Nigerians send money home: all International Money Transfer Operators (IMTOs) must open naira settlement accounts with authorised dealer banks by <strong>May 1, 2026</strong>. From that date, recipients will receive naira — not dollars — when money arrives from abroad.</p>

<p>This is a seismic shift. For decades, many Nigerians receiving remittances from the US, UK, Canada, and Europe have received dollars (or pounds, or euros), often converting them at parallel market rates that were significantly more favourable than the official CBN rate. That era is ending.</p>

<h2>Our take: bold reform with real risks</h2>
<p>The CBN's stated goals are reasonable: channel more foreign exchange through the formal banking system, improve transparency, and stabilise the naira. Nigeria received an estimated <strong>$20 billion in remittances in 2024</strong>, the most in sub-Saharan Africa. Capturing even a fraction more of that through official channels would boost FX reserves and support the naira.</p>

<p>But the execution carries real risks for ordinary senders and recipients:</p>

<ul>
<li><strong>Conversion rate uncertainty</strong> — The circular prices conversions at market rates benchmarked to Bloomberg's BMatch, and CBN Governor Olayemi Cardoso says reforms have narrowed the parallel-market premium to under 2%. The bigger change is that recipients lose the option of holding the dollars themselves.</li>
<li><strong>Compliance costs passed to senders</strong> — IMTOs face new banking requirements, reporting obligations, and settlement infrastructure costs. As <a href="https://technext24.com/2026/03/25/cost-of-cbns-new-remittance-rules/" target="_blank" rel="noopener noreferrer">TechNext24 reported</a>, if operators absorb these costs, margins shrink and some smaller players may exit the market. If they pass costs downstream, fees go up.</li>
<li><strong>Informal channels could grow</strong> — When formal remittance costs rise, some senders shift to informal hawala-style networks or crypto. That undermines the very transparency the CBN is trying to achieve.</li>
</ul>

<h2>Which providers are affected?</h2>
<p>Every provider that operates in Nigeria will need to comply. <a href="/companies/worldremit">WorldRemit</a>, <a href="/companies/remitly">Remitly</a>, <a href="/companies/western-union">Western Union</a>, and <a href="/companies/wise">Wise</a> all serve Nigerian corridors and will need to adapt their settlement infrastructure by May 1.</p>

<p>Providers that already settle primarily in naira — like some of the newer fintech operators — may have a smoother transition. Those that offered dollar payouts as a competitive advantage will need to rethink their value proposition for the Nigeria corridor.</p>

<h2>What senders should do now</h2>
<p>If you regularly send money to Nigeria, here's our advice:</p>
<ul>
<li><strong>Send before May 1 if you want dollar payout</strong> — The deadline is tight. If your recipient prefers to receive USD, the window is closing.</li>
<li><strong>Compare rates aggressively after May 1</strong> — Once all providers settle in naira, the differentiator will be which provider offers the best NGN conversion rate. Use our <a href="/send-money/usa-to-nigeria">USA to Nigeria</a>, <a href="/send-money/uk-to-nigeria">UK to Nigeria</a>, or <a href="/send-money/canada-to-nigeria">Canada to Nigeria</a> comparison tools to see real-time rates.</li>
<li><strong>Watch for fee increases</strong> — If compliance costs hit providers, they'll pass them on. Monitor your usual provider's pricing over the next 2–3 months.</li>
<li><strong>Consider multi-currency accounts</strong> — If your recipient has access to a domiciliary account or a service like <a href="/companies/wise">Wise</a> that holds multiple currencies, they may be able to receive and convert on their own terms.</li>
</ul>

<h2>UK to Nigeria: what changes for British senders</h2>
<p>The UK-to-Nigeria corridor is one of the largest in Africa, with British Nigerians sending an estimated <strong>£3 billion a year</strong>, by a 2022 estimate from the digital bank Kuda. The new CBN rule hits this corridor especially hard because many UK senders specifically chose providers offering GBP-to-USD or direct dollar payout — giving recipients a hedge against naira depreciation.</p>

<p>Under the new framework, that hedge disappears. Every GBP transfer will be converted to naira, at market rates benchmarked to Bloomberg BMatch, before reaching the recipient. For UK senders comparing the <a href="/send-money/uk-to-nigeria">best way to send money from the UK to Nigeria</a>, the key metric shifts from "which provider gives the best dollar rate" to "which provider gives the best naira rate" — and those rankings may look very different after May 1.</p>

<p>Providers like <a href="/companies/wise">Wise</a> that already use the mid-market rate with transparent markups may fare better than those whose pricing relied on opaque FX spreads. <a href="/companies/worldremit">WorldRemit</a> and <a href="/companies/remitly">Remitly</a>, which both serve the UK-Nigeria corridor with competitive GBP/NGN rates, will need to renegotiate their settlement arrangements with Nigerian banks.</p>

<h2>The bigger picture</h2>
<p>The CBN says it's targeting <strong>$1 billion in monthly diaspora remittances by end of 2026</strong>, as reported by <a href="https://web.archive.org/web/20260327073856/https://www.zawya.com/en/economy/africa/nigeria-cbn-targets-1bln-monthly-diaspora-remittance-by-the-end-of-2026-x0cgrkm5" target="_blank" rel="noopener noreferrer">Zawya</a>; the CBN publishes its own directives in its <a href="https://www.cbn.gov.ng/Documents/circulars.html" target="_blank" rel="noopener noreferrer">circulars</a>. That's ambitious — and whether it happens depends entirely on whether the new rules make formal channels more attractive or simply more expensive. For a broader perspective on how African remittance corridors are evolving, see our guide to <a href="/guides/send-money-to-nigeria-guide">sending money to Nigeria</a> and our <a href="/guides/global-remittance-trends-2026">2026 global remittance trends</a> report.</p>

<h2>Questions about the CBN naira-only rule</h2>
<h3>Will I still receive dollars in Nigeria after May 2026?</h3>
<p>No. From May 1, 2026, all IMTO inflows must be converted to naira through authorised dealer banks before reaching recipients. Dollar, pound, and euro payouts through formal remittance channels are ending.</p>

<h3>How does the CBN naira-only rule affect Wise and Western Union?</h3>
<p>Both must open naira settlement accounts with Nigerian banks by the May 1 deadline. <a href="/companies/wise">Wise</a> already uses the mid-market rate, so its conversion may be more transparent. <a href="/companies/western-union">Western Union</a> has cash pickup networks across Nigeria that will now pay out in naira only.</p>

<h3>What is the cheapest way to send money to Nigeria from the UK after May 2026?</h3>
<p>Once all providers settle in naira, compare the total received amount (after fees and FX conversion) rather than the exchange rate alone. Use our <a href="/send-money/uk-to-nigeria">UK to Nigeria comparison tool</a> for live rates across 10+ providers.</p>`,
    category: "Regulatory",
    publishedAt: "2026-03-27",
    source: "Central Bank of Nigeria / Nairametrics / TechNext24 / Zawya",
    sourceUrl:
      "https://nairametrics.com/2026/03/27/diaspora-remittances-cbn-reforms-to-end-forex-monopoly-boost-inflows/",
    providerSlugs: ["worldremit", "remitly", "western-union", "wise"],
  },
  {
    slug: "paypal-venmo-goes-global-remittances-2026",
    title:
      "Venmo Goes Global: PayPal vs Wise vs Remitly — Who Wins on Price? (March 2026)",
    excerpt:
      "PayPal just opened Venmo to 200M PayPal users in 90 countries with no transfer fee through August 24. But Venmo's 4% currency conversion spread applies throughout. Can it compete with Wise and Remitly? Our analysis.",
    image: "/images/news/venmo-global-expansion.svg",
    imageAlt:
      "The Venmo app on a smartphone with a world map in the background, representing PayPal's global expansion of Venmo",
    content: `<p>On March 23, 2026, PayPal announced what it calls the biggest expansion of Venmo's addressable market since the app launched: <strong>Venmo users can now send and receive money with 200 million PayPal users across 90 countries</strong>. For the first time, an app millions of Americans already use for splitting restaurant bills can be used for international remittances.</p>

<p>The pitch is simple — send money abroad using just a phone number. And through August 24, PayPal is waiving all international fees on Venmo transfers. That's a bold play into a market worth over <strong>$40 trillion annually</strong> in cross-border retail payments.</p>

<h2>Our take: big brand, but can it compete on price?</h2>
<p>Venmo's global expansion is strategically significant but tactically questionable — at least for cost-conscious remittance senders. Here's why:</p>

<p><strong>The distribution advantage is real.</strong> Venmo has something that <a href="/companies/wise">Wise</a>, <a href="/companies/remitly">Remitly</a>, and <a href="/companies/worldremit">WorldRemit</a> don't: a huge US user base that already has the app installed and payment methods linked. There's zero onboarding friction. For someone who's never sent money internationally before, opening Venmo and tapping "send to PayPal user" is dramatically easier than downloading a dedicated remittance app, completing KYC, and linking a bank account.</p>

<p><strong>But the exchange rate is the problem.</strong> Venmo publishes a 4.00% currency conversion spread on transfers the recipient receives in another currency, and the fee waiver does not remove it. Once the waiver ends on August 24, a 5% transfer fee (minimum $0.99, maximum $4.99) applies on top. For comparison, <a href="/companies/paypal">PayPal</a>'s median markup across the corridors we quote is {{AVG_MARKUP_PCT:paypal}}, against {{AVG_MARKUP_PCT:wise}} for Wise.</p>

<p><strong>The recipient needs PayPal.</strong> Unlike <a href="/companies/remitly">Remitly</a> or <a href="/companies/western-union">Western Union</a>, which offer bank deposit, mobile money, and cash pickup, Venmo-to-PayPal transfers require the recipient to have an active PayPal account. In major remittance corridors like the US to India, Philippines, Mexico, and Nigeria, PayPal penetration among recipients is far lower than in developed markets. That limits Venmo's usefulness precisely where remittance demand is highest.</p>

<h2>Who should care — and who shouldn't</h2>
<p>If you send money to family or friends in <strong>Europe, Canada, Australia, or other developed markets</strong> where PayPal is widely used, Venmo's global expansion is genuinely useful — especially during the fee-free promotional period. For casual, one-off international transfers, the convenience is hard to beat.</p>

<p>If you send money regularly to <strong>India, Philippines, Nigeria, Mexico, or Pakistan</strong> — the world's top remittance corridors — you're almost certainly better off with a dedicated provider such as <a href="/companies/wise">Wise</a>, <a href="/companies/remitly">Remitly</a> or a corridor specialist like <a href="/companies/taptap-send">TapTap Send</a>. Our <a href="/send-money">comparison tool</a> shows what each actually delivers on your route.</p>

<h2>The competitive picture</h2>
<p>Venmo's entry doesn't fundamentally change the economics of cross-border payments — it changes the <em>awareness</em>. Millions of Americans who never thought about using an app for international transfers will now see the option in their Venmo feed. Some will use it. Some will then discover that dedicated providers are cheaper and switch.</p>

<p>For <a href="/companies/wise">Wise</a> and <a href="/companies/remitly">Remitly</a>, the threat isn't that Venmo will undercut them on price. It's that Venmo will intercept users who might have otherwise found a specialist provider first. The race for the casual sender's first international transfer just got more competitive.</p>

<h2>Venmo vs Xoom: PayPal now has two international options</h2>
<p>Here's what <a href="https://www.paymentsdive.com/news/paypal-takes-venmo-global/815473/" target="_blank" rel="noopener noreferrer">Payments Dive</a> didn't explore in its coverage: PayPal now has <em>two</em> cross-border products — <a href="/companies/xoom">Xoom</a> and Venmo. They serve different needs:</p>
<ul>
<li><strong><a href="/companies/xoom">Xoom</a></strong> — PayPal's dedicated remittance service. Offers bank deposit, cash pickup, and mobile reload, with a focus on high-volume corridors (US to Mexico, India, Philippines). Recipient doesn't need a PayPal account.</li>
<li><strong>Venmo international</strong> — P2P transfers to PayPal users only. Simpler interface, but limited delivery options and recipient must have PayPal. Better suited for casual transfers to developed markets.</li>
</ul>
<p>For regular remittance senders, <a href="/compare/paypal-vs-xoom">Xoom remains the better PayPal product</a>. For one-off transfers to friends in Europe or Australia, Venmo's convenience wins — especially during the fee-free period.</p>

<h2>How Venmo compares on price</h2>
<table>
<thead><tr><th>Provider</th><th>Exchange-rate cost</th><th>Transfer fee</th><th>Recipient needs account?</th><th>Delivery options</th></tr></thead>
<tbody>
<tr><td><strong>Venmo (to Aug 24)</strong></td><td>4.00% spread</td><td>$0</td><td>Yes (PayPal)</td><td>PayPal balance only</td></tr>
<tr><td><strong>Venmo (after Aug 24)</strong></td><td>4.00% spread</td><td>5% (min $0.99, max $4.99)</td><td>Yes (PayPal)</td><td>PayPal balance only</td></tr>
<tr><td><strong><a href="/companies/wise">Wise</a></strong></td><td>{{AVG_MARKUP_PCT:wise}} median markup</td><td>Varies by route</td><td>No</td><td>Bank deposit</td></tr>
<tr><td><strong><a href="/companies/remitly">Remitly</a></strong></td><td>{{AVG_MARKUP_PCT:remitly}} median markup</td><td>Varies by route</td><td>No</td><td>Bank, cash pickup, mobile</td></tr>
<tr><td><strong><a href="/companies/xoom">Xoom</a></strong></td><td>{{AVG_MARKUP_PCT:xoom}} median markup</td><td>Varies by route</td><td>No</td><td>Bank, cash pickup, mobile reload</td></tr>
</tbody>
</table>
<p><em>Venmo: published fees (<a href="https://venmo.com/resources/our-fees/" target="_blank" rel="noopener noreferrer nofollow">venmo.com</a>). Wise, Remitly, Xoom: median markup across the corridors we quote, from our live data. <a href="https://newsroom.paypal-corp.com/2026-03-23-200-Million-More-Friends-on-Venmo-Send-Money-to-PayPal-Users-Around-the-World" target="_blank" rel="noopener noreferrer nofollow">PayPal announcement</a>.</em></p>

<p>Compare what you'd actually receive using our <a href="/send-money">comparison tool</a> — we show live rates and fees from PayPal alongside dedicated providers so you can see the real difference. For more on how PayPal's pricing compares, see our <a href="/companies/paypal">PayPal review</a> and <a href="/compare/wise-vs-paypal">Wise vs PayPal</a> comparison. And for an overview of the best options available, check our <a href="/guides/best-money-transfer-apps">best money transfer apps</a> guide.</p>

<h2>Questions about Venmo's international transfers</h2>
<h3>Can I use Venmo to send money internationally?</h3>
<p>Yes, as of March 23, 2026, Venmo users can send money to PayPal users in 90 countries. The recipient must have an active PayPal account. International fees are waived through August 24, 2026, but Venmo's 4.00% currency conversion spread still applies.</p>

<h3>Is Venmo cheaper than Wise for international transfers?</h3>
<p>No. Even during the fee-free period, Venmo's 4.00% conversion spread costs $40 on a $1,000 transfer, while <a href="/companies/wise">Wise</a>'s median markup across the corridors we quote is {{AVG_MARKUP_PCT:wise}}.</p>

<h3>What is the difference between Venmo international and Xoom?</h3>
<p><a href="/companies/xoom">Xoom</a> is PayPal's dedicated remittance service offering bank deposit, cash pickup, and mobile reload — recipients don't need PayPal. Venmo international only sends to PayPal account holders. For regular remittances, <a href="/compare/paypal-vs-xoom">Xoom is the better choice</a>.</p>`,
    category: "Provider Update",
    publishedAt: "2026-03-27",
    source: "PayPal Newsroom / American Banker / Payments Dive",
    sourceUrl:
      "https://newsroom.paypal-corp.com/2026-03-23-200-Million-More-Friends-on-Venmo-Send-Money-to-PayPal-Users-Around-the-World",
    providerSlugs: ["paypal", "xoom", "wise", "remitly", "worldremit"],
  },
  {
    slug: "liberation-day-tariffs-remittance-impact-2026",
    title: "One Year After Liberation Day: How Trump's Tariffs Changed the Cost of Sending Money Abroad",
    excerpt:
      "The DXY dollar index fell to 99.9, the Indian rupee hit record lows, and the Supreme Court struck down IEEPA tariffs. Here's what one year of trade war means for your international transfers.",
    image: "/images/news/central-bank-super-week.jpg",
    imageAlt: "US Dollar bills representing the weakening currency affecting international money transfer costs",
    content: `<p>April 2, 2026, marked exactly one year since "Liberation Day" — when the Trump administration announced sweeping tariffs with country-specific rates up to 50% and a 10% baseline. For anyone sending money internationally, the consequences have been significant and largely negative.</p>

<h2>What happened to the dollar?</h2>
<p>The <strong>DXY dollar index fell to 99.9</strong> on April 7, 2026 — down nearly 3% over 12 months. Harvard economist Kenneth Rogoff has said historians may look back at Liberation Day as marking "the beginning of the end of the dollar's absolute dominance."</p>
<p>Against the euro and other major currencies, a weaker dollar means <strong>fewer units of foreign currency for each dollar transferred</strong>. Many emerging-market currencies fell further than the dollar did, though: the rupee went from around ₹85–86 per dollar in April 2025 to ₹93.28 on April 7, 2026, so $1,000 sent to India now buys more rupees, not fewer.</p>

<h2>How tariffs affect exchange rates</h2>
<p>Tariffs create a chain reaction that weakens the dollar:</p>
<ol>
<li><strong>Higher import costs</strong> → US inflation increased by 0.76 percentage points → the Fed delays rate cuts → but trade uncertainty still weakens the dollar</li>
<li><strong>Retaliatory tariffs</strong> → reduced US exports → weaker trade balance → the US goods deficit hit an all-time high in 2025 despite tariffs</li>
<li><strong>Capital flight</strong> → international investors rethinking US assets → reduced dollar demand</li>
</ol>

<h2>Emerging market currencies hit hardest</h2>
<p>The tariff shock didn't just weaken the dollar — it destabilised emerging market currencies that millions of diaspora senders depend on:</p>
<table>
<thead><tr><th>Currency</th><th>Impact</th><th>What It Means for Senders</th><th>Compare</th></tr></thead>
<tbody>
<tr class="blog-row-highlight"><td><strong>Indian Rupee (INR)</strong></td><td>Record low ₹95.21 per USD (March 30)</td><td>More rupees per dollar — good time to send</td><td><a href="/send-money/usa-to-india">Rates →</a></td></tr>
<tr><td><strong>Pakistani Rupee (PKR)</strong></td><td>Under pressure</td><td>Volatile — use rate alerts</td><td><a href="/send-money/usa-to-pakistan">Rates →</a></td></tr>
<tr><td><strong>Mexican Peso (MXN)</strong></td><td>Resilient</td><td>MXN held up better than most — trade integration</td><td><a href="/send-money/usa-to-mexico">Rates →</a></td></tr>
</tbody>
</table>

<h2>The double hit: weaker dollar + remittance tax</h2>
<p>US-based senders now face two simultaneous cost pressures:</p>
<ol>
<li><strong>The weakening dollar</strong> reduces how much your recipient gets wherever their currency has gained on it, such as the euro</li>
<li><strong>The <a href="/guides/us-remittance-tax-2026">1% US remittance tax</a></strong> (effective January 1, 2026) adds an extra cost on cash-funded transfers</li>
</ol>
<p>Together, these make it more important than ever to <strong>compare providers</strong> before every transfer. The difference between the cheapest and most expensive provider can be 3-5% — which now matters even more when the base rate is moving against you.</p>

<h2>What to do now</h2>
<ol>
<li><strong>Set rate alerts.</strong> Use <a href="/companies/wise">Wise</a> or <a href="/companies/xe">Xe</a> to get notified when your target rate hits. In volatile tariff periods, rates can swing 1-2% in a day.</li>
<li><strong>Watch the direction of your own pair.</strong> The dollar's broad fall has not been uniform — against the rupee it has risen — so check the rate history for your corridor before deciding when to send.</li>
<li><strong>For large transfers, use forward contracts.</strong> <a href="/companies/ofx">OFX</a> lets you lock in today's rate for up to 12 months — protecting you from further dollar weakness.</li>
<li><strong>Switch from cash to digital.</strong> Avoid the 1% remittance tax entirely by funding via bank transfer or debit card instead of cash. Read our <a href="/guides/us-remittance-tax-2026">remittance tax guide</a>.</li>
<li><strong>Compare every time.</strong> Our <a href="/send-money">comparison tool</a> shows real-time rates from ${COVERAGE.providers}. In a volatile market, the cheapest provider can change daily.</li>
</ol>
<p>For broader context on how central bank decisions move exchange rates, read our <a href="/news/central-bank-super-week-march-2026">guide to central bank rate decisions and transfers</a>. For corridor-specific advice, see our <a href="/guides/send-money-to-india-guide">India</a>, <a href="/guides/send-money-to-pakistan-guide">Pakistan</a>, <a href="/guides/send-money-to-philippines-guide">Philippines</a>, and <a href="/guides/send-money-to-mexico-guide">Mexico</a> guides.</p>`,
    category: "Industry News",
    publishedAt: "2026-04-07",
    source: "NPR / Tax Foundation / CFR",
    sourceUrl: "https://www.npr.org/2026/04/02/nx-s1-5766424/trump-tariffs-inflation-economy",
    providerSlugs: ["wise", "xe", "ofx", "remitly"],
  },
  {
    slug: "mastercard-bvnk-stablecoin-remittance-2026",
    title: "Mastercard's $1.8B Bet on Stablecoins: What It Means for Your Remittance Fees",
    excerpt:
      "Mastercard is acquiring stablecoin infrastructure firm BVNK for $1.8 billion — Mastercard's biggest crypto deal to date. Here's what it could change for regular senders.",
    image: "/images/news/central-bank-super-week.jpg",
    imageAlt: "Digital payment network representing Mastercard's stablecoin infrastructure for cheaper international transfers",
    content: `<p>On March 17, 2026, <a href="https://www.mastercard.com/us/en/news-and-trends/press/2026/march/Mastercard-to-acquire-BVNK-to-connect-on-chain-payments-and-fiat-rails.html" target="_blank" rel="noopener noreferrer nofollow">Mastercard announced</a> a definitive agreement to acquire <strong>BVNK</strong> — a UK-based stablecoin infrastructure company — for up to <strong>$1.8 billion</strong> ($1.5B upfront plus $300M contingent on performance). It's the largest stablecoin infrastructure deal in history, surpassing Stripe's $1.1B acquisition of Bridge.</p>
<p>For anyone sending money internationally, this matters. Here's why.</p>

<h2>What are stablecoins and why do they matter for remittances?</h2>
<p>Stablecoins are digital tokens pegged to a real currency (usually USD). Unlike Bitcoin, their value doesn't swing wildly — 1 USDC is always worth approximately $1. The innovation isn't the token itself, but the <strong>payment rails underneath</strong>.</p>
<p>Traditional international transfers can pass through several correspondent banks via SWIFT, each adding fees and time. Stablecoin rails can settle in seconds with fewer intermediaries.</p>

<h2>Why Mastercard paid $1.8 billion</h2>
<p>BVNK operates stablecoin payment infrastructure across <strong>130+ countries</strong>. The acquisition gives Mastercard:</p>
<ul>
<li><strong>Stablecoin-to-fiat conversion rails</strong> — convert USDC to local currency at the point of delivery</li>
<li><strong>Enterprise-grade compliance</strong> — BVNK handles KYC/AML across jurisdictions</li>
<li><strong>Integration with Mastercard Move</strong> — Mastercard's remittance platform that posted 35%+ transaction growth in Q4 2025</li>
</ul>
<p>Mastercard isn't alone. PayPal already offers <strong>zero-fee Xoom transfers funded with PYUSD</strong> (their stablecoin). Visa supports USDC settlement on-chain. Wells Fargo has filed for a WFUSD stablecoin trademark. The <a href="https://www.congress.gov/bill/119th-congress/senate-bill/1582" target="_blank" rel="noopener noreferrer">US GENIUS Act</a> and Europe's MiCA framework are providing regulatory clarity.</p>

<h2>What this means for you (the sender)</h2>
<p>The key thing: <strong>you won't need to understand crypto.</strong> Mastercard will abstract the blockchain layer entirely. From your perspective, you'll send money through a normal app — the stablecoin settlement happens invisibly in the background, resulting in lower fees and faster delivery.</p>
<p>Realistically, consumer-facing products from this acquisition won't launch until <strong>late 2026 or 2027</strong>. But the competitive pressure is already being felt. Providers like <a href="/companies/western-union">Western Union</a> and <a href="/companies/moneygram">MoneyGram</a> will need to match lower fees or lose market share.</p>

<h2>Who benefits most?</h2>
<ul>
<li><strong>Senders to Africa</strong> — The most expensive region to send money to, per the World Bank, and so the one with the most to gain if stablecoin rails cut intermediary costs.</li>
<li><strong>Senders to Southeast Asia</strong> — Philippines, Vietnam, Cambodia corridors currently at 3-5% could drop to 1%.</li>
<li><strong>Unbanked recipients</strong> — BVNK's infrastructure supports mobile wallet delivery without requiring a bank account. Could benefit 1.3 billion unbanked adults globally.</li>
</ul>

<h2>What to do now</h2>
<p>Stablecoin-powered transfers are coming but aren't mainstream yet. In the meantime:</p>
<ol>
<li><strong>Use specialist providers today.</strong> <a href="/companies/wise">Wise</a> (0% markup) and <a href="/companies/remitly">Remitly</a> (minutes delivery) already capture most of the saving that stablecoins promise — without any crypto complexity.</li>
<li><strong>Watch for PayPal/Xoom PYUSD offers.</strong> <a href="/companies/xoom">Xoom</a> already offers zero transfer fees when funded with PYUSD. If your corridor is supported, this is the closest thing to stablecoin remittances available today.</li>
<li><strong>Compare before every transfer.</strong> Our <a href="/send-money">comparison tool</a> shows real-time costs from ${COVERAGE.providers}. As stablecoin competition heats up, fees are falling across the board.</li>
</ol>
<p>For more on how payment technology is evolving, read our <a href="/guides/wire-transfer-guide">wire transfer guide</a> (SWIFT vs SEPA vs local rails), <a href="/guides/business-international-payments-guide">business payments guide</a>, and <a href="/compare/remitly-vs-xoom">Remitly vs Xoom comparison</a> (covers PYUSD).</p>`,
    category: "Industry News",
    publishedAt: "2026-04-07",
    source: "Mastercard / CoinDesk / CNBC",
    sourceUrl: "https://www.mastercard.com/us/en/news-and-trends/press/2026/march/Mastercard-to-acquire-BVNK-to-connect-on-chain-payments-and-fiat-rails.html",
    providerSlugs: ["wise", "remitly", "western-union", "xoom", "moneygram"],
  },
  // ========================================
  // FedNow Cross-Border Payments
  // ========================================
  {
    slug: "fednow-cross-border-payments-2026",
    title: "Fed Proposes Opening FedNow to Cross-Border Payments: What It Means for International Transfers",
    excerpt:
      "The Federal Reserve Board voted unanimously to propose allowing intermediaries on FedNow for international payments, which would let the instant payment system carry the US leg of cross-border transfers. Here's what it could change for senders.",
    content: `<h2>What did the Fed propose?</h2>
<p>On <strong>April 8, 2026</strong>, the Federal Reserve Board unanimously voted to propose allowing U.S. banks and credit unions to use intermediaries to transfer funds through the FedNow Service. The proposal was published in the Federal Register on April 10, 2026, with a <strong>60-day comment period</strong> closing approximately June 9, 2026.</p>
<p>Currently, FedNow can only process domestic transfers between two U.S. banks. Under the proposal, either the sending or receiving U.S. bank could act as a correspondent bank for non-U.S. institutions — enabling the domestic leg of a cross-border payment to settle in seconds on FedNow.</p>

<h2>How would cross-border FedNow payments work?</h2>
<p>The proposed model uses a hybrid approach with separate legs:</p>
<ol>
<li><strong>International leg:</strong> Handled by intermediaries (including non-U.S. correspondent banks) outside of FedNow — similar to how SWIFT operates today</li>
<li><strong>Domestic leg:</strong> Settles <strong>within seconds</strong> on FedNow between eligible U.S. participants, 24/7/365</li>
</ol>
<p>This mirrors how the existing Fedwire Funds Service has operated for decades — FedNow is simply catching up. The key difference: FedNow runs 24/7/365, while Fedwire operates 22 hours a day on business days.</p>

<h2>FedNow vs SWIFT vs Fedwire</h2>
<div class="table-wrapper"><table>
<thead><tr><th>Feature</th><th>FedNow (Proposed)</th><th>SWIFT</th><th>Fedwire</th></tr></thead>
<tbody>
<tr><td><strong>Settlement speed</strong></td><td>Within seconds</td><td>Varies by route</td><td>Same day</td></tr>
<tr><td><strong>Availability</strong></td><td>24/7/365</td><td>Varies by bank</td><td>22 hours on business days</td></tr>
<tr><td><strong>Per-transfer cost</strong></td><td>$0.045</td><td>Set by each bank</td><td>$0.195–$0.97 (by volume tier)</td></tr>
<tr><td><strong>Cross-border</strong></td><td>Proposed via intermediaries</td><td>Native</td><td>Via intermediaries</td></tr>
<tr><td><strong>Participants</strong></td><td>1,700+ institutions</td><td>11,000+ institutions</td><td>~5,000 institutions</td></tr>
</tbody></table></div>

<h2>What this means for remittance senders</h2>
<p>If adopted, FedNow cross-border capability could significantly reduce the cost of the <strong>domestic settlement leg</strong> of international transfers. Currently, the average cost of sending a $200 remittance is <strong>6.4%</strong> globally. Much of this cost sits in correspondent banking fees and slow settlement — exactly what FedNow addresses.</p>
<p>For providers like <a href="/companies/wise">Wise</a>, <a href="/companies/remitly">Remitly</a>, and <a href="/companies/western-union">Western Union</a> that already use U.S. bank partners, FedNow integration could mean:</p>
<ul>
<li><strong>Faster funding:</strong> Sender's money reaches the provider's account in seconds rather than hours</li>
<li><strong>Lower processing costs:</strong> $0.045 per transfer vs $0.195–$0.97 on Fedwire, depending on volume tier</li>
<li><strong>24/7 settlement:</strong> No more waiting for business hours to process the U.S. leg</li>
</ul>
<p>The international leg (the part that crosses borders) would still use existing rails — SWIFT, local payment systems, or direct integrations. But removing the domestic bottleneck is significant.</p>

<h2>Timeline and what happens next</h2>
<ul>
<li><strong>Now – June 9, 2026:</strong> 60-day public comment period</li>
<li><strong>H2 2026 (estimated):</strong> Final rule published after reviewing comments</li>
<li><strong>2027 (estimated):</strong> First cross-border FedNow transactions go live</li>
</ul>
<p>The G20 has set targets of <strong>1% cost for retail payments and 3% for remittances</strong> — both still exceeded. FedNow's entry into cross-border payments brings the U.S. closer to these targets, joining the <a href="/news/eu-instant-payments-mandatory-2026">EU's instant payments mandate</a> and India's UPI international expansion as part of a global push toward faster, cheaper cross-border settlement.</p>
<p>For the latest rates from providers already offering instant transfers, <a href="/send-money">compare live quotes</a> from ${COVERAGE.providers}.</p>`,
    category: "Regulatory",
    publishedAt: "2026-04-11",
    source: "Federal Reserve Board / PYMNTS / ABA Banking Journal",
    sourceUrl: "https://www.federalreserve.gov/newsevents/pressreleases/other20260408a.htm",
    providerSlugs: ["wise", "remitly", "western-union", "moneygram", "ofx"],
  },
  // ========================================
  // IRS Remittance Tax Proposed Regulations
  // ========================================
  {
    slug: "irs-remittance-tax-proposed-regulations-2026",
    title: "IRS Publishes Remittance Tax Rules: What Senders Need to Know (April 2026)",
    excerpt:
      "The IRS published proposed regulations for the 1% remittance transfer tax on April 10, 2026. Key clarification: digital transfers are exempt — the tax only applies to cash, money orders, and cashier's checks. Here's the full breakdown.",
    content: `<h2>What did the IRS publish?</h2>
<p>On <strong>April 10, 2026</strong>, the Treasury Department and IRS issued proposed regulations for the <strong>1% excise tax on certain remittance transfers</strong>, established under the One, Big, Beautiful Bill Act (signed July 4, 2025). The regulations clarify which transfers are taxed, which are exempt, and how providers must collect and report the tax.</p>
<p>The comment period closes <strong>June 12, 2026</strong>. The tax has been in effect since January 1, 2026.</p>

<h2>Which transfers are taxed?</h2>
<p>The 1% tax applies <strong>only</strong> to remittance transfers where the sender provides a <strong>physical instrument</strong> to the provider:</p>
<ul>
<li><strong>Cash</strong> (paying at an agent location like Western Union or MoneyGram)</li>
<li><strong>Money orders</strong></li>
<li><strong>Cashier's checks</strong></li>
<li><strong>Other similar physical instruments</strong> (as determined by the Secretary) — the proposed rules name <strong>traveler's checks</strong></li>
</ul>
<p>On a $1,000 cash transfer, the tax is <strong>$10</strong>.</p>

<h2>Which transfers are exempt?</h2>
<p>The following are <strong>not subject</strong> to the 1% tax:</p>
<ul>
<li>✅ <strong>Bank account transfers</strong> (ACH, wire transfers from checking/savings accounts)</li>
<li>✅ <strong>Debit and credit card</strong> payments, regardless of the country where the card was issued</li>
<li>✅ <strong>SWIFT bank-to-bank</strong> transfers</li>
<li>✅ <strong>Personal or business checks and general-use prepaid cards</strong> (subject to an anti-avoidance rule)</li>
</ul>
<p><strong>Bottom line:</strong> If you send money online through <a href="/companies/wise">Wise</a>, <a href="/companies/remitly">Remitly</a>, <a href="/companies/revolut">Revolut</a>, or any digital provider funded from your bank account or card — <strong>you pay zero tax</strong>. The tax specifically targets cash-based agent transfers.</p>

<h2>Who collects the tax?</h2>
<ul>
<li>The <strong>sender is liable</strong> for the tax</li>
<li><strong>Remittance transfer providers must collect</strong> it at the time of the transaction</li>
<li>If providers fail to collect, they become <strong>secondarily liable</strong></li>
<li>Providers report quarterly on <strong>Form 720</strong> with semimonthly deposits required</li>
<li>The IRS has granted <strong>penalty relief</strong> (Notice 2025-55) for deposit errors during the first three quarters of 2026</li>
</ul>

<h2>Revenue and economic impact</h2>
<p>The Joint Committee on Taxation estimates the tax will generate approximately <strong>$10 billion over 10 years</strong>. The tax applies regardless of citizenship, immigration status, or income level.</p>
<p>Key impact projections, from a <a href="https://www.cgdev.org/blog/even-1-percent-us-remittance-tax-hits-poor-countries-hard" target="_blank" rel="noopener noreferrer">Center for Global Development</a> analysis that applied 1% to all remittances (so it overstates the tax as enacted, which reaches only cash-type funding):</p>
<ul>
<li><strong>Mexico</strong> (largest remittance recipient from the US) projected to lose exceeding <strong>$1.5 billion annually</strong></li>
<li><strong>El Salvador</strong> projected to lose <strong>0.6% of gross national income</strong></li>
<li>Central American countries face the greatest relative impact</li>
</ul>

<h2>What should you do?</h2>
<ol>
<li><strong>Switch from cash to digital:</strong> If you're still paying cash at an agent location, switching to a digital provider eliminates the tax, and digital providers are often cheaper on fees and exchange rates too. See our <a href="/send-money">comparison tool</a> for the cheapest digital option.</li>
<li><strong>Fund via bank account or debit card:</strong> ACH-funded transfers through Wise, Remitly, or WorldRemit are tax-exempt and typically cheapest.</li>
<li><strong>Keep records:</strong> If a cash-funded transfer is canceled or expires and the provider refunds it, you may file a claim with the IRS for a refund of the tax.</li>
</ol>
<p>For corridor-specific advice, see our <a href="/guides/send-money-to-mexico-guide">Mexico guide</a>, <a href="/guides/send-money-to-india-guide">India guide</a>, and <a href="/guides/send-money-to-philippines-guide">Philippines guide</a>.</p>`,
    category: "Regulatory",
    publishedAt: "2026-04-11",
    source: "IRS / Treasury Department",
    sourceUrl: "https://www.irs.gov/newsroom/treasury-irs-issue-proposed-regulations-on-the-new-remittance-transfer-tax-established-under-the-one-big-beautiful-bill",
    providerSlugs: ["western-union", "moneygram", "ria", "wise", "remitly"],
  },
  // ========================================
  // UK FCA Safeguarding Rules
  // ========================================
  {
    slug: "fca-safeguarding-rules-money-transfer-2026",
    title: "Is Your Money Safe with Wise and Revolut? New FCA Safeguarding Rules Explained (May 2026)",
    excerpt:
      "New FCA rules taking effect May 7, 2026 require Wise, Revolut, and all UK payment firms to ring-fence customer money with daily reconciliation, annual audits, and wind-down plans. Here's what it means for your transfers.",
    content: `<h2>What's changing on May 7, 2026?</h2>
<p>The UK Financial Conduct Authority (FCA) published <strong>Policy Statement PS25/12</strong> on August 7, 2025, introducing the most significant overhaul of safeguarding rules for payment institutions and e-money institutions since their inception. The new rules take effect on <strong>May 7, 2026</strong>.</p>
<p>These rules affect every FCA-regulated money transfer company, including <a href="/companies/wise">Wise</a>, <a href="/companies/revolut">Revolut</a>, <a href="/companies/remitly">Remitly</a>, <a href="/companies/worldremit">WorldRemit</a>, and dozens of smaller providers.</p>

<h2>What the new rules require</h2>
<div class="table-wrapper"><table>
<thead><tr><th>Requirement</th><th>Before May 2026</th><th>After May 2026</th></tr></thead>
<tbody>
<tr><td><strong>Fund reconciliation</strong></td><td>At least once each business day (FCA guidance)</td><td>Daily reconciliation of safeguarded funds</td></tr>
<tr><td><strong>Audits</strong></td><td>Annual audit expected (guidance) for firms that need a statutory audit</td><td>Annual reasonable-assurance audits by qualified auditors</td></tr>
<tr><td><strong>Reporting</strong></td><td>Annual reporting only</td><td>Monthly regulatory returns to the FCA</td></tr>
<tr><td><strong>Wind-down planning</strong></td><td>No requirement</td><td>Mandatory resolution pack enabling timely fund recovery</td></tr>
<tr><td><strong>Third-party review</strong></td><td>No specific requirement</td><td>Contingency plan at least 3 months before a safeguarding insurance policy or guarantee expires</td></tr>
</tbody></table></div>

<h2>Why this matters: the insolvency problem</h2>
<p>Unlike banks, payment firms like Wise and Revolut are <strong>not covered by the Financial Services Compensation Scheme (FSCS)</strong>. If a payment firm fails, your money is not automatically protected up to £120,000 like it would be with a bank.</p>
<p>The FCA found alarming data from <strong>12 payment firms that became insolvent between 2018 and 2023</strong>:</p>
<ul>
<li>Average shortfall was <strong>65%</strong> between funds owed to customers and funds actually safeguarded</li>
<li>For e-money institutions alone, the shortfall averaged <strong>80%</strong></li>
<li>In 8 of 12 cases, shortfalls exceeded <strong>£1 million</strong></li>
<li>Where funds were returned, it took an average of <strong>2.3 years</strong></li>
</ul>
<p>The new rules aim to prevent this by requiring daily checks, annual audits, and pre-built wind-down plans.</p>

<h2>Which providers are affected?</h2>
<p>All FCA-regulated payment institutions (PIs) and e-money institutions (EMIs). This includes:</p>
<ul>
<li><strong>Wise</strong> (EMI, authorized by FCA)</li>
<li><strong>Revolut</strong> (full UK banking licence since March 2026)</li>
<li><strong>Remitly</strong> (FCA-authorised in the UK)</li>
<li><strong>WorldRemit</strong> (EMI, authorized by FCA)</li>
<li><strong>PayPal</strong> (FCA-authorised in the UK through PayPal UK Ltd)</li>
</ul>
<p>Firms safeguarding less than <strong>£100,000</strong> over a 53-week period are exempt from the audit requirement — but this covers only ~23% of firms and just £3.2 million of the £27 billion+ in customer funds held sector-wide.</p>

<h2>Is your money safe right now?</h2>
<p>Yes — with reputable, FCA-regulated providers. The key protections:</p>
<ol>
<li><strong>Safeguarding:</strong> All regulated providers already ring-fence customer funds in separate accounts. The new rules strengthen <em>how</em> this is done, not whether it's done.</li>
<li><strong>Regulation:</strong> Wise, Revolut, and Remitly are all authorized by the FCA, which can intervene if rules are breached.</li>
<li><strong>Speed:</strong> Money transfer transactions typically complete within minutes to days — your funds aren't held for long periods.</li>
</ol>
<p>For a full guide on verifying any provider, see our <a href="/guides/money-transfer-safety-guide">money transfer safety guide</a>. To compare regulated providers, use our <a href="/send-money">live comparison tool</a>.</p>`,
    category: "Regulatory",
    publishedAt: "2026-04-11",
    source: "FCA / Norton Rose Fulbright",
    sourceUrl: "https://www.fca.org.uk/news/press-releases/payment-safeguarding-rules-changes",
    providerSlugs: ["wise", "revolut", "remitly", "worldremit", "paypal"],
  },
  // ========================================
  // EU Instant Payments Mandatory
  // ========================================
  {
    slug: "eu-instant-payments-mandatory-2026",
    title: "EU Instant Payments Now Mandatory: Eurozone Banks Must Offer 10-Second Euro Transfers",
    excerpt:
      "The EU Instant Payments Regulation (EU 2024/886) is now in full force for eurozone banks. Eurozone banks must now offer euro transfers that settle within 10 seconds, 24/7, at no extra charge. Here's what it means for sending money to Europe.",
    content: `<h2>What's the EU Instant Payments Regulation?</h2>
<p><strong>Regulation (EU) 2024/886</strong>, adopted March 13, 2024 and in force since April 8, 2024, mandates that all payment service providers in the eurozone must offer instant euro transfers. The regulation amends the original SEPA Regulation (260/2012).</p>
<p>Key requirements:</p>
<ul>
<li><strong>10-second settlement:</strong> The recipient's account must be credited within 10 seconds. If confirmation isn't received in time, the transaction automatically reverses.</li>
<li><strong>24/7/365 availability:</strong> Instant payments must be available at all times — no business-hours restrictions.</li>
<li><strong>No premium pricing:</strong> Charges for instant transfers <strong>cannot exceed</strong> charges for standard SEPA transfers. Banks can no longer charge extra for speed.</li>
<li><strong>Mandatory offering:</strong> Any bank that offers standard SEPA transfers must also offer instant.</li>
<li><strong>Verification of Payee (VoP):</strong> Free service confirming the recipient's name matches the account before execution.</li>
</ul>

<h2>Implementation timeline</h2>
<div class="table-wrapper"><table>
<thead><tr><th>Requirement</th><th>Eurozone banks</th><th>Non-eurozone EU banks</th></tr></thead>
<tbody>
<tr><td><strong>Receive instant (EUR)</strong></td><td>January 9, 2025 ✅</td><td>January 9, 2027</td></tr>
<tr><td><strong>Send instant (EUR)</strong></td><td>October 9, 2025 ✅</td><td>July 9, 2027</td></tr>
<tr><td><strong>Equal charges</strong></td><td>January 9, 2025 ✅</td><td>January 9, 2027</td></tr>
<tr><td><strong>Verification of Payee</strong></td><td>October 9, 2025 ✅</td><td>July 9, 2027</td></tr>
</tbody></table></div>
<p>Eurozone banks have had to send instant payments since October 2025. Non-eurozone EU members (Romania, Poland, Sweden, Hungary, Czech Republic, Denmark) have until 2027 for euro payments; Bulgaria joined the euro on January 1, 2026.</p>

<h2>What this means for sending money to Europe</h2>
<p><strong>If you're sending EUR to a eurozone country</strong> (Germany, France, Spain, Italy, Netherlands, Austria, etc.), your transfer should now arrive within 10 seconds via SEPA Instant — at no extra charge over standard SEPA.</p>
<p>Providers like <a href="/companies/wise">Wise</a> and <a href="/companies/revolut">Revolut</a> already route through SEPA Instant when available. The regulation ensures <strong>every eurozone bank</strong> now supports it.</p>
<p><strong>Transaction limits:</strong> the scheme's former EUR 100,000 cap was removed in October 2025; providers may set their own limits. In non-euro states, providers may limit euro instant transfers sent from national-currency accounts outside business hours, but to no less than EUR 25,000 per transfer.</p>

<h2>Non-eurozone EU countries: Romania, Poland, Sweden</h2>
<p>These countries use their own currencies (RON, PLN, SEK) but are SEPA members for euro payments. The regulation only applies to <strong>euro-denominated payments</strong>:</p>
<ul>
<li>Euro transfers to/from Romanian, Polish, or Swedish EUR accounts will be instant by 2027</li>
<li>Local currency transfers (RON, PLN, SEK) continue using national payment systems and are not covered by this regulation</li>
<li>For the cheapest way to send to these countries, see our <a href="/guides/send-money-to-romania-guide">Romania guide</a> and <a href="/guides/send-money-to-poland-guide">Poland guide</a></li>
</ul>

<h2>UK senders: what changes?</h2>
<p>The UK remains in the SEPA geographic scope (grandfathered post-Brexit) but is <strong>not bound by this regulation</strong>. UK banks can choose to adopt SEPA Instant voluntarily, but there is no legal deadline.</p>
<p>For live rates from the UK to Europe, use our <a href="/send-money">comparison tool</a> and choose GBP to EUR.</p>`,
    category: "Regulatory",
    publishedAt: "2026-04-11",
    source: "European Central Bank / European Commission",
    sourceUrl: "https://www.ecb.europa.eu/paym/retail/instant_payments/html/instant_payments_regulation.en.html",
    providerSlugs: ["wise", "revolut", "remitly", "ofx"],
  },
  // ========================================
  // Wise Nasdaq dual-listing — May 11, 2026
  // ========================================
  {
    slug: "wise-nasdaq-dual-listing-may-2026",
    title:
      "Wise Nasdaq Dual-Listing (May 2026): What It Means",
    excerpt:
      "Wise confirms primary listing switch to Nasdaq on May 11, 2026 after moving £181.7B in FY26 for 18.9M customers. What changes for senders, and how it reshapes the Wise vs Revolut race.",
    image: "/images/news/wise-nasdaq-listing.svg",
    imageAlt:
      "Data card showing Wise's May 11, 2026 primary listing switch from LSE to Nasdaq with £181.7B FY26 volume, 18.9M customers, and £49.4B Q4 cross-border volume",
    content: `<p><strong>TL;DR —</strong> <a href="/companies/wise">Wise</a> switches its primary listing from the London Stock Exchange to the Nasdaq on <strong>May 11, 2026</strong>, with the UK keeping a secondary listing. The move follows a year in which Wise moved <strong>£181.7 billion</strong> across borders for <strong>18.9 million active customers</strong> — cross-border volume up 26% year-on-year in Q4 FY26. Nothing changes for senders today: the same platform, the same <a href="/guides/us-remittance-tax-2026">tax-exempt digital funding</a>, the same <a href="/guides/exchange-rate-markup-explained">mid-market rate pricing</a>. But the US capital base is the clearest signal yet that Wise intends to win the American corridor market at scale.</p>

<h2>The numbers behind the move</h2>
<p>Wise disclosed its full-year FY26 trading update alongside the listing date. The Q4 highlights are striking for a company that only IPO'd in 2021:</p>
<div class="table-wrapper"><table>
<thead><tr><th>Metric</th><th>Q4 FY26</th><th>YoY change</th></tr></thead>
<tbody>
<tr><td>Cross-border volume</td><td>£49.4 billion</td><td>+26%</td></tr>
<tr><td>Active customers</td><td>11.3 million (quarter)</td><td>+22%</td></tr>
<tr><td>Underlying income</td><td>£435.3 million</td><td>+24%</td></tr>
<tr><td>FY26 total volume</td><td>£181.7 billion</td><td>+25%</td></tr>
<tr><td>Customer balances</td><td>£22.6 billion</td><td>+33%</td></tr>
</tbody>
</table></div>

<h2>Why list on the Nasdaq — and why now?</h2>
<p>Three reasons dominate the case for Wise's move.</p>
<p><strong>1. Valuation multiples.</strong> Fintech peers trading on the Nasdaq — including SoFi and PayPal — have tended to command higher revenue multiples than UK-listed fintech. For a company growing cross-border volume at 25%+ a year, the re-rating alone could add several billion pounds of market capitalisation.</p>
<p><strong>2. Dollar-denominated capital.</strong> A US listing gives the company a deeper pool of dollar capital to fund US bank partnerships, compliance infrastructure, and FedNow / CHIPS integration — the plumbing that makes <a href="/send-money/usa-to-india">USA-to-India</a>, <a href="/send-money/usa-to-mexico">USA-to-Mexico</a>, and <a href="/send-money/usa-to-philippines">USA-to-Philippines</a> transfers settle in minutes rather than days.</p>
<p><strong>3. Competitive pressure from Revolut.</strong> <a href="/companies/revolut">Revolut</a> reported <a href="https://www.euronews.com/business/2026/03/24/revolut-reported-record-financial-results-with-revenue-rising-by-46-to-52bn-in-2025" target="_blank" rel="noopener noreferrer">record 2025 revenue of £4.5 billion (€5.2 billion)</a> and a full UK banking licence, and analysts at Citi have cited Revolut's accelerating cross-border expansion as a direct threat to Wise's UK base — which still generates roughly 20–25% of revenue. A Nasdaq platform gives Wise the balance sheet to defend and extend.</p>

<h2>What changes for you as a sender?</h2>
<p>Short answer: <strong>nothing, immediately</strong>. The Wise app, rates, fees, and product surface are unaffected by where the holding company trades its shares.</p>
<p>What changes over 12–24 months is where Wise invests. Three areas to watch:</p>
<ul>
<li><strong>USD rails</strong> — Expect deeper integration with FedNow and US bank-held accounts, which will tighten USD-funded corridor settlement from hours to seconds. See our coverage of <a href="/news/fednow-cross-border-payments-2026">FedNow's cross-border push</a>.</li>
<li><strong>New currencies</strong> — Watch Latin America and Africa, where routes such as <a href="/send-money/uk-to-nigeria">GBP-to-NGN</a> have high diaspora demand.</li>
<li><strong>Business banking</strong> — Wise Business is the fastest-growing segment. A US listing signals a push to compete directly with <a href="/business/b2b-transfers">B2B platforms</a> such as Airwallex and Payoneer.</li>
</ul>

<h2>Wise vs Revolut: the Nasdaq race</h2>
<p>With Wise on the Nasdaq and Revolut holding a full UK banking licence and reporting £1.7 billion profit before tax on £4.5 billion revenue in 2025, the duopoly at the top of the retail FX market is tightening. For senders, this is good news — both firms compete almost entirely on price and speed.</p>
<p>If you're deciding between them, our <a href="/compare/wise-vs-revolut">Wise vs Revolut</a> head-to-head compares fees, rates, corridor coverage, and speed for the most common routes. For USD-heavy senders, <a href="/compare/wise-vs-paypal">Wise vs PayPal</a> and <a href="/compare/wise-vs-xoom">Wise vs Xoom</a> are the comparisons that typically matter more.</p>

<h2>Is Wise safe? Regulatory protection holds either way</h2>
<p>A listing switch does not change Wise's regulatory status. Wise remains authorised by the FCA in the UK as an Electronic Money Institution, by FinCEN in the US as a Money Services Business, and by the ASIC, MAS, and RBI equivalents in its other regions. Customer balances are <strong>safeguarded</strong> — held separately from Wise's corporate funds in partner banks and government bonds, not deposited with Wise itself.</p>
<p>The UK's new <a href="/news/fca-safeguarding-rules-money-transfer-2026">FCA safeguarding rules taking effect May 7, 2026</a> strengthen this further: daily reconciliation, annual audits, and formal wind-down plans become mandatory for every FCA-regulated provider — including Wise and Revolut.</p>

<h2>What to watch on and after May 11</h2>
<ol>
<li><strong>May 11, 2026</strong> — Primary listing moves to Nasdaq under ticker WSE (WISE remains the LSE ticker). LSE keeps a secondary listing.</li>
<li><strong>Full-year FY2026 results (June 25, 2026)</strong> — First results as a Nasdaq-primary company.</li>
<li><strong>Q1 FY27 trading update (July 2026)</strong> — First quarterly update after the listing; watch for US volume growth as the headline metric.</li>
<li><strong>Half-year results (November 2026)</strong> — Expect a sharpened US corridor roadmap and likely new product announcements.</li>
</ol>

<h2>Questions about Wise's Nasdaq listing</h2>
<h3>Is Wise safe after the Nasdaq listing in 2026?</h3>
<p>Yes. Wise's safeguarding and regulatory status is unchanged by the listing switch. Customer funds remain ring-fenced from corporate funds under FCA and FinCEN rules. The Nasdaq move is a corporate-governance change, not an operational one. See our full <a href="/companies/wise">Wise review</a> for the latest safety breakdown.</p>

<h3>Will Wise fees or exchange rates change after May 11, 2026?</h3>
<p>No. Wise's pricing is driven by its cost base and competition, not by where its shares are listed. The company's stated aim of continuing to lower its prices is unchanged.</p>

<h3>Can I buy Wise shares if I'm a customer?</h3>
<p>Yes. Wise has announced that existing shareholders will receive equivalent Nasdaq-listed shares on the listing date, and retail investors will be able to buy through any broker with Nasdaq access. This article is not investment advice.</p>

<h3>Does Wise still serve UK customers after the move?</h3>
<p>Yes. Wise retains a secondary LSE listing and its UK entity (Wise Payments Limited) remains FCA-regulated. UK senders see no change. Compare UK corridors: <a href="/send-money/uk-to-india">UK to India</a>, <a href="/send-money/uk-to-pakistan">UK to Pakistan</a>, <a href="/send-money/uk-to-philippines">UK to Philippines</a>.</p>

<p>For the broader competitive picture, see our <a href="/guides/global-remittance-trends-2026">2026 global remittance trends report</a> and the live <a href="/send-money">comparison tool</a> that shows exactly how Wise's rate stacks up against Remitly, Xoom, OFX and the rest on your specific corridor.</p>`,
    category: "Industry News",
    publishedAt: "2026-04-20",
    source: "Wise plc / Finance Magnates / FXC Intelligence",
    sourceUrl:
      "https://www.fxcintel.com/research/analysis/wise-q4-26-earnings",
    providerSlugs: ["wise", "revolut", "remitly", "xoom"],
  },
  // ========================================
  // Pakistan record $41B remittance year — April 2026
  // ========================================
  {
    slug: "pakistan-record-41-billion-remittance-2026",
    title:
      "Pakistan Remittances on Track for Record $41 Billion: Cheapest Way to Send GBP to PKR",
    excerpt:
      "Pakistan is on track for a record $41 billion in remittances in fiscal 2025-26, up from $38.3B in FY25. UK→Pakistan alone hit $532M in February. Here's how the top providers compare on GBP to PKR right now.",
    image: "/images/news/pakistan-record-remittance-2026.svg",
    imageAlt:
      "Editorial chart showing Pakistan's projected $41B remittance year for 2026, with UK-to-Pakistan February inflow of $532M and GBP/PKR at 377",
    content: `<p><strong>TL;DR —</strong> Pakistan is projected to receive a record <strong>$41 billion</strong> in remittances in fiscal year 2025-26 (July to June), up from $38.3 billion in FY25, with the UK alone contributing <strong>$532 million in February 2026</strong>. On <a href="/send-money/uk-to-pakistan">GBP to PKR</a>, rate differences between providers can move <strong>5,000–15,000 rupees on a £1,000 transfer</strong> — enough to justify comparing every time. Below: the data, the corridors driving the record, and the cheapest providers as of April 20, 2026.</p>

<h2>Why 2026 is a record year</h2>
<p>The surge has three underlying drivers, none of which look temporary:</p>
<ol>
<li><strong>A wider legal–parallel rate gap has narrowed.</strong> After the State Bank of Pakistan's 2023–24 exchange-rate reforms, formal channels now clear closer to market — meaning diaspora senders who previously used informal hawala routes are migrating back to regulated providers.</li>
<li><strong>Mobile wallet adoption.</strong> JazzCash and Easypaisa together cover over 100 million registered accounts. Minute-level delivery from the UK, US, and Gulf is now the norm, not the exception.</li>
<li><strong>Gulf demand is steady, Western demand is rising.</strong> Saudi Arabia and the UAE remain the largest sending markets, but <strong>UK remittances are up notably year-on-year</strong> despite a 7% February dip ($532M vs $575M in January).</li>
</ol>

<h2>Top remittance sources into Pakistan (SBP data)</h2>
<div class="table-wrapper"><table>
<thead><tr><th>Source country</th><th>Feb 2026 inflow</th><th>Typical fastest rail</th></tr></thead>
<tbody>
<tr><td><strong>United Arab Emirates</strong></td><td>$696M</td><td>AED → PKR wallet delivery in minutes</td></tr>
<tr><td><strong>Saudi Arabia</strong></td><td>$685M</td><td>SAR → PKR via specialist providers</td></tr>
<tr><td><strong>United Kingdom</strong></td><td>$532M</td><td>GBP → PKR Faster Payments + wallet</td></tr>
<tr><td><strong>EU (combined)</strong></td><td>$395M</td><td>SEPA → PKR via Wise, Remitly, ACE</td></tr>
<tr><td><strong>United States</strong></td><td>$319M</td><td><a href="/guides/us-remittance-tax-2026">Digital (tax-exempt)</a> to bank or wallet</td></tr>
</tbody>
</table></div>

<h2>UK to Pakistan: who's cheapest right now?</h2>
<p>The GBP to PKR corridor is one of the most price-competitive in the world because diaspora demand is high and every specialist provider operates here. For a typical <strong>£1,000 transfer</strong> on April 20, 2026, the live rate landscape is:</p>
<ul>
<li><strong><a href="/companies/ace-money-transfer">ACE Money Transfer</a></strong> — Strong Pakistani banking partnerships, frequent zero-fee promos for new customers.</li>
<li><strong><a href="/companies/wise">Wise</a></strong> — Mid-market rate with a transparent 0.5–0.8% fee. Not always the highest PKR delivered, but always the most predictable.</li>
<li><strong><a href="/companies/remitly">Remitly</a></strong> — Express delivery in minutes to JazzCash, Easypaisa, HBL, UBL, Meezan. Economy tier is often the cheapest of the app-based providers.</li>
<li><strong><a href="/companies/worldremit">WorldRemit</a></strong> — Broadest wallet and bank coverage; competitive on occasional promotional rates.</li>
<li><strong><a href="/companies/ria">Ria</a></strong> — Strongest cash-pickup network via the Omni channel; worth checking when the recipient is outside urban centres.</li>
</ul>
<p>For live provider-by-provider comparison on this corridor, see <a href="/send-money/uk-to-pakistan">UK to Pakistan live rates</a> or try the <a href="/send-money">full comparison tool</a> with your exact amount.</p>

<h2>How much you're losing by using a UK high-street bank</h2>
<p>UK high-street banks (Barclays, HSBC, Lloyds, NatWest, Santander) typically charge <strong>£15–£30 per transfer plus a 3–5% markup on the GBP/PKR rate</strong>. On a £1,000 transfer:</p>
<div class="table-wrapper"><table>
<thead><tr><th>Route</th><th>Typical total cost</th><th>PKR delivered (vs specialist)</th></tr></thead>
<tbody>
<tr><td>UK high-street bank</td><td>£45–£75</td><td>~15,000–30,000 PKR less</td></tr>
<tr><td>Specialist (Wise, ACE, Remitly)</td><td>£0–£7</td><td>Benchmark</td></tr>
</tbody>
</table></div>
<p>Over 12 transfers a year, the difference is £500–£800 — money that stays with the bank instead of reaching your family. Our guide on <a href="/guides/exchange-rate-markup-explained">exchange rate markups</a> walks through exactly how this hidden cost works.</p>

<h2>Watch the GBP/PKR rate</h2>
<p>The pound traded in a <strong>£1 = 369–379 PKR</strong> range during April 2026. On £1,000, a 2% rate swing is worth ~7,700 rupees — meaningful for any regular sender. Rate alerts from <a href="/companies/wise">Wise</a> or <a href="/companies/xe">Xe</a> let you lock in when the rate hits your target.</p>
<p>For the broader macro picture, our <a href="/news/central-bank-super-week-march-2026">guide to how central bank decisions move exchange rates</a> explains what to watch before a big GBP transfer. And for a historical view, the <a href="/exchange-rates/history">exchange rate history tool</a> shows how GBP/PKR has moved over the past year.</p>

<h2>US senders to Pakistan: digital is tax-free</h2>
<p>If you're sending to Pakistan from the US, fund your transfer <strong>digitally</strong> — bank account, debit card, or credit card — and the <a href="/guides/us-remittance-tax-2026">1% federal remittance excise tax</a> does not apply. The tax is triggered only by cash, money orders, or cashier's checks handed over in person. That makes <a href="/companies/wise">Wise</a>, <a href="/companies/remitly">Remitly</a>, and <a href="/companies/worldremit">WorldRemit</a> 100% tax-exempt on the <a href="/send-money/usa-to-pakistan">USA to Pakistan corridor</a>. See our dedicated <a href="/news/irs-remittance-tax-proposed-regulations-2026">IRS regulations analysis</a> for the full exemption list.</p>

<h2>The corridor pages to bookmark</h2>
<ul>
<li><a href="/send-money/uk-to-pakistan">UK → Pakistan</a> — GBP to PKR live rates and provider matrix</li>
<li><a href="/send-money/usa-to-pakistan">USA → Pakistan</a> — USD to PKR, tax-exempt digital options</li>
<li><a href="/send-money/send-money-to-pakistan">Send money to Pakistan</a> — all sending countries, one page</li>
<li><a href="/guides/send-money-to-pakistan-guide">Complete Pakistan guide</a> — banks, wallets, cash pickup, KYC, regulations</li>
<li><a href="/iban/pakistan">Pakistan IBAN lookup</a> — verify recipient bank codes before sending</li>
<li><a href="/swift-codes/pakistan">Pakistan SWIFT codes</a> — for bank-to-bank wires</li>
</ul>

<h2>Questions about sending GBP to Pakistan</h2>
<h3>What is the cheapest way to send money from the UK to Pakistan in 2026?</h3>
<p>ACE Money Transfer, Wise, and Remitly are among the more visible app-based names on the GBP to PKR corridor, but they are not the measured leader: {{CORRIDOR_LEADER:GBP:PKR}}. Differences of 5,000–15,000 PKR per £1,000 are common between the best and worst providers on any given day — compare before every transfer at our <a href="/send-money/uk-to-pakistan">UK to Pakistan comparison page</a>.</p>

<h3>How much did Pakistan receive in remittances in February 2026?</h3>
<p>Pakistan received <strong>$3.3 billion in remittances in February 2026</strong>, with the UK contributing $532 million (down 7% from January's $575M). Inflows for fiscal 2025-26 are projected to reach a record $41 billion, up from $38.3 billion in FY25.</p>

<h3>Is JazzCash or Easypaisa better for receiving money from the UK?</h3>
<p>Both are supported by every major UK-to-Pakistan provider. Choose JazzCash if your recipient uses Jazz mobile service; choose Easypaisa if they use Telenor. Both deliver in minutes and charge the recipient nothing to receive. See our <a href="/send-money/uk-to-pakistan">UK to Pakistan page</a> for provider-by-provider wallet support.</p>

<h3>Do I pay tax on remittances to Pakistan?</h3>
<p>In the UK, no — HMRC does not tax outgoing personal remittances. In the US, the <a href="/guides/us-remittance-tax-2026">1% federal excise tax</a> applies only to cash-funded transfers; digital transfers from bank account, debit card, or credit card are exempt. Pakistan does not tax inward personal remittances.</p>

<p>For the macro view, read our <a href="/guides/global-remittance-trends-2026">2026 global remittance trends report</a>. To compare providers live, use the <a href="/send-money">comparison tool</a>.</p>`,
    category: "Industry News",
    publishedAt: "2026-04-20",
    source: "State Bank of Pakistan / Business Recorder / TechJuice",
    sourceUrl: "https://www.brecorder.com/news/40410967",
    providerSlugs: ["wise", "remitly", "worldremit", "ria", "ace-money-transfer"],
  },
];

export function getNewsItem(slug: string): NewsItem | undefined {
  return newsItems.find((n) => n.slug === slug);
}

export function getLatestNews(count: number = 10): NewsItem[] {
  return [...newsItems]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, count);
}

export const newsCategories = [
  "All",
  "Industry News",
  "Provider Update",
  "Announcement",
  "Regulatory",
] as const;
