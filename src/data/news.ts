export interface NewsItem {
  slug: string;
  title: string;
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
      "Fed held at 3.5%, Bank of Japan hiked, Bank of England held, RBA signalled caution. How central bank interest rate decisions move exchange rates — and what to do before, during, and after rate announcements to protect your transfer.",
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
<li><strong>RBA (March 17)</strong> — Held rates after cutting in February 2026 for the first time in years. Dovish tone weakened AUD, benefiting AUD/INR and AUD/PHP senders.</li>
<li><strong>Fed (March 17–18)</strong> — Held at 3.5%. The "dot plot" projections were the real driver — showing one projected cut in 2026, keeping the dollar stable.</li>
<li><strong>BoJ (March 18–19)</strong> — Continued normalising policy after decades of ultra-loose settings. Yen strengthened, making Japan-bound transfers more expensive.</li>
<li><strong>BoE (March 19)</strong> — Held steady. Sticky UK inflation complicated the case for easing. Sterling stayed strong at GBP/USD ~1.32 — good for British senders.</li>
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
    sourceUrl: "https://www.bankofengland.co.uk/monetary-policy-summary-and-minutes",
    providerSlugs: ["wise", "xe", "revolut"],
  },
  {
    slug: "us-remittance-excise-tax-takes-effect-2026",
    title: "New 1% US Remittance Tax — What It Means for You",
    excerpt:
      "A federal excise tax on cash-funded international transfers went live in January 2026. Here's what it means for senders, providers, and the broader remittance market.",
    image: "/images/news/us-remittance-tax.jpg",
    imageAlt: "The US Capitol building in Washington D.C., where the remittance excise tax legislation was passed",
    content: `<p>The money transfer landscape in the United States shifted on January 1, 2026, when a 1% federal excise tax on certain international remittances took effect. Bundled into the broader "One Big Beautiful Bill Act" passed by Congress, the levy applies specifically to cash-funded outbound transfers — a move that caught parts of the industry off guard.</p>

<h2>Who pays, and who doesn't?</h2>
<p>The tax targets transfers funded with physical cash at agent locations and retail counters. If you walk into a <a href="/companies/western-union">Western Union</a> or <a href="/companies/moneygram">MoneyGram</a> branch and pay with banknotes, the provider is required to collect the 1% levy on top of existing fees. Transfers funded digitally — through a linked bank account, debit card, or credit card — remain exempt.</p>

<p>That distinction matters. According to World Bank data, roughly 38% of US outbound remittances still originate as cash transactions, particularly in corridors to Latin America, Sub-Saharan Africa, and parts of South Asia. For a $500 cash transfer to Mexico, the additional cost is $5 — not enormous on its own, but enough to erode thin margins for frequent senders.</p>

<h2>Industry pushback and IRS relief</h2>
<p>Trade groups representing remittance providers lobbied hard against the provision, arguing it disproportionately affects low-income immigrant communities who rely on cash. In response, the IRS issued penalty relief for providers during the first three quarters of 2026, giving the industry time to update point-of-sale systems and customer-facing disclosures.</p>

<p><a href="/companies/remitly">Remitly</a> published a detailed breakdown for customers on its blog, walking through which transaction types are affected and how to avoid the tax by switching to digital funding methods. <a href="/companies/wise">Wise</a> noted that its entirely digital model means none of its customers are impacted.</p>

<h2>The bigger picture</h2>
<p>Industry analysts see this as an accelerant for an already-underway shift from cash to digital remittances. "The tax essentially puts a price on staying analogue," said one payments consultant. "Providers that haven't invested in digital onboarding will feel the squeeze." For a broader view of where global remittances are heading, see our <a href="/guides/global-remittance-trends-2026">2026 global remittance trends report</a>.</p>

<p>For consumers, the takeaway is straightforward: funding transfers digitally avoids the tax entirely. Read our <a href="/guides/us-remittance-tax-2026">complete guide to the US remittance tax</a> for a provider-by-provider breakdown of who charges it and how to avoid it. Our guide to the <a href="/guides/cheapest-way-to-send-money-internationally">cheapest ways to send money internationally</a> covers how to reduce costs further, and our <a href="/guides/best-money-transfer-apps">best money transfer apps</a> roundup highlights the digital-first providers that are entirely unaffected by the tax. Our <a href="/send-money">comparison tool</a> shows real-time costs across providers, making it easy to find the cheapest option regardless of how you fund the transfer.</p>`,
    category: "Regulatory",
    publishedAt: "2026-03-14",
    source: "IRS / RSM US",
    sourceUrl: "https://www.irs.gov/newsroom",
    providerSlugs: ["western-union", "moneygram", "remitly", "wise"],
  },
  {
    slug: "revolut-files-us-bank-charter-2026",
    title: "Revolut News March 2026: Files for US National Bank Charter, Pledges $500M",
    excerpt:
      "Revolut files for a US national bank charter with the OCC and FDIC in March 2026, pledging $500M in domestic investment. What this means for Revolut's 50M+ customers and US money transfers.",
    image: "/images/news/revolut-us-charter.jpg",
    imageAlt: "The US Capitol building illuminated at night, representing Revolut's push into American finance",
    content: `<p>Revolut, the UK-headquartered fintech with over 50 million global customers, is making its boldest move yet in the American market. In early March the company filed applications with both the Office of the Comptroller of the Currency (OCC) and the Federal Deposit Insurance Corporation (FDIC) to establish "Revolut Bank US, N.A." — a full national bank charter.</p>

<h2>What a charter would unlock</h2>
<p>A national bank charter isn't just a regulatory badge — it fundamentally changes what Revolut can offer US customers. Direct access to Fedwire and ACH would slash the company's reliance on partner banks for domestic transfers. FDIC-insured deposits would let Revolut compete head-on with traditional banks, not just other fintechs. And operating under a single federal charter eliminates the patchwork of state-by-state money transmitter licences the company currently maintains.</p>

<p>For international money transfers specifically, cutting out intermediary banks should reduce both costs and settlement times on US-originated corridors. That's good news for anyone sending dollars abroad.</p>

<h2>The $500 million commitment</h2>
<p>Alongside the charter filing, <a href="/companies/revolut">Revolut</a> appointed fintech veteran Cetin Duransoy as US CEO and pledged half a billion dollars in US investment. The funds will go toward hiring, infrastructure build-out, and customer acquisition — areas where Revolut has lagged behind US-native competitors like Cash App and Venmo.</p>

<h2>A long road ahead</h2>
<p>Securing a de novo bank charter is notoriously slow. The OCC approval process alone typically takes 12–18 months, and Revolut's application will face scrutiny given the size and complexity of its global operations. The company's UK banking licence, finally granted in mid-2024 after a three-year wait, offers both precedent and a cautionary tale about regulatory timelines.</p>

<h2>Why this matters for cross-border pricing</h2>
<p>If Revolut succeeds, the strategic prize is not just prestige. A charter could improve unit economics on US-originated transfers by reducing dependence on partner banks for payment initiation, settlement, and account infrastructure. That would not automatically make Revolut the cheapest provider on every corridor, but it could narrow one of the operational gaps between Revolut and domestic US incumbents.</p>

<p>For consumers, the important distinction is between a product story and a pricing story. A bank charter may improve reliability, funding options, and deposit features long before it translates into materially cheaper international transfers. The real question is whether Revolut uses that regulatory leverage to lower spreads and fees, or to broaden its banking relationship with US customers first.</p>

<p>Still, if approved, a chartered Revolut would become one of the largest digital-only banks in the US — and a formidable competitor in cross-border payments. Revolut is part of a broader wave — see our analysis of <a href="/guides/crypto-banking-licenses-2026">crypto banking licenses and what they mean for money transfers</a>. Our <a href="/guides/best-money-transfer-apps">best money transfer apps</a> guide already covers Revolut's current offering, and our explainer on <a href="/guides/multi-currency-accounts-exchange-rates">multi-currency accounts and exchange rates</a> is worth reading if you're considering switching. We'll be tracking the application's progress and updating our <a href="/companies/revolut">Revolut review</a> as details emerge.</p>`,
    category: "Regulatory",
    publishedAt: "2026-03-13",
    source: "American Banker",
    sourceUrl: "https://www.americanbanker.com/",
    providerSlugs: ["revolut"],
  },
  {
    slug: "western-union-ceo-digital-competition-2026",
    title: "Western Union CEO Concedes Ground to Digital Rivals",
    excerpt:
      "At an investor conference this week, Devin McGranahan acknowledged that Wise and Remitly are winning on customer growth, while defending Western Union's profitability and agent network.",
    image: "/images/news/western-union-competition.jpg",
    imageAlt: "Business professionals shaking hands over a contract, representing competitive dynamics in the money transfer industry",
    content: `<p>It's rare for the CEO of a 170-year-old financial institution to publicly concede competitive ground. But that's exactly what <a href="/companies/western-union">Western Union</a>'s Devin McGranahan did at the Wolfe Research investor conference on March 14, offering a candid assessment of where the money transfer giant stands against a new generation of digital-first rivals.</p>

<h2>The candid admission</h2>
<p>"Are they growing customer counts faster than us in certain digital corridors? Yes," McGranahan told analysts, referencing <a href="/companies/wise">Wise</a> and <a href="/companies/remitly">Remitly</a> by name. "But customer count growth and sustainable, profitable growth are different conversations." If you're weighing the two, our <a href="/compare/wise-vs-remitly">Wise vs Remitly comparison</a> breaks down the real differences.</p>

<p>His argument centres on unit economics. Western Union, despite losing digital market share, remains enormously profitable: the company generated over $4 billion in revenue in 2025 with operating margins above 20%. Digital-first competitors, by contrast, have been spending heavily on customer acquisition — Remitly's sales and marketing costs topped $350 million last year — and several are still working toward consistent profitability.</p>

<h2>The agent network advantage</h2>
<p>McGranahan also emphasised Western Union's physical infrastructure: over 500,000 agent locations worldwide. "There are corridors and customer segments where cash-in and cash-out aren't going away anytime soon," he said. In sub-Saharan Africa, for instance, cash pickup remains the dominant delivery method for remittances, and Western Union's agent density in the region is unmatched.</p>

<h2>What this means for consumers</h2>
<p>The competitive tension between legacy operators and digital challengers is driving better outcomes for customers across the board. Western Union has been steadily lowering digital fees, Wise continues to compress margins, and Remitly's promotional offers (currently <a href="/companies/remitly">$25 off your first transfer</a>) reflect the intensity of the battle for market share.</p>

<p>Our advice? Let the providers compete for your business. Our guide to the <a href="/guides/best-money-transfer-services">best money transfer services</a> ranks the top options side by side, and the <a href="/guides/global-remittance-trends-2026">2026 global remittance trends</a> report shows where the industry is heading. Use our <a href="/send-money">comparison tool</a> to check real-time rates and fees before every transfer — the cheapest option varies by corridor, amount, and delivery method.</p>`,
    category: "Industry News",
    publishedAt: "2026-03-14",
    source: "Payments Dive / Wolfe Research conference coverage",
    sourceUrl: "https://www.paymentsdive.com/news/western-union-digital-competition/",
    providerSlugs: ["western-union", "wise", "remitly"],
  },
  {
    slug: "stripe-paypal-acquisition-talks-2026",
    title: "Stripe Reportedly Exploring PayPal Acquisition in Landmark Fintech Deal",
    excerpt:
      "Sources say the $159 billion payments giant is in early-stage conversations about acquiring all or part of PayPal, which would reshape the global payments landscape.",
    image: "/images/news/stripe-paypal-deal.jpg",
    imageAlt: "Two businessmen sealing a deal with a handshake, representing the reported Stripe-PayPal acquisition talks",
    content: `<p>In what would be the largest fintech deal in history, payments infrastructure giant Stripe is reportedly exploring an acquisition of PayPal. Multiple sources familiar with the discussions told CoinDesk that talks are in early stages, with no certainty of a deal — but the mere possibility has sent shockwaves through the industry.</p>

<h2>The numbers behind the rumour</h2>
<p>Stripe, last valued at $159 billion in its most recent private funding round, dwarfs PayPal's current public market capitalisation of roughly $43 billion. That valuation gap — PayPal traded above $300 billion as recently as 2021 — reflects a dramatic reversal of fortunes. PayPal has struggled with slowing growth, increased competition from Apple Pay and Google Pay, and an identity crisis about whether it's a consumer app or a merchant platform.</p>

<p>For Stripe, which has built its empire on developer tools and merchant-side payments infrastructure, acquiring <a href="/companies/paypal">PayPal</a> would add a massive consumer-facing brand, the Venmo peer-to-peer network, and <a href="/companies/xoom">Xoom</a> — PayPal's international money transfer service that competes directly with <a href="/companies/wise">Wise</a> and <a href="/companies/remitly">Remitly</a>.</p>

<h2>What it could mean for money transfers</h2>
<p>Xoom, which PayPal acquired in 2015 for $890 million, handles cross-border remittances to over 130 countries. Under PayPal's ownership, the service has operated somewhat independently. A Stripe acquisition could bring Xoom's remittance capabilities into Stripe's infrastructure, potentially creating a vertically integrated cross-border payments stack that serves both merchants and consumers.</p>

<p>Whether any deal materialises remains unclear. Regulatory hurdles would be significant — antitrust authorities in the US, EU, and UK would all need to approve a combination of this scale. But the conversation itself signals how rapidly the payments industry is consolidating — a trend well documented in our <a href="/guides/global-remittance-trends-2026">2026 global remittance trends</a> report. For a consumer-level breakdown of which services deliver the best value today, see our <a href="/guides/best-money-transfer-services">best money transfer services</a> guide. In the meantime, use <a href="/send-money">our comparison tool</a> to find the best rates across all active providers.</p>`,
    category: "Industry News",
    publishedAt: "2026-03-12",
    source: "CoinDesk",
    sourceUrl: "https://www.coindesk.com/",
    providerSlugs: ["paypal", "xoom"],
  },
  {
    slug: "eu-instant-payments-mandate-2026",
    title: "SEPA Instant Payments 2026: Free 10-Second Transfers Now Mandatory — What Changes for You",
    excerpt:
      "EU banks must now process SEPA instant euro transfers in under 10 seconds, 24/7, with no extra fee. No more €100K limits in Germany. Here's what changed, which banks comply, and how it affects your international transfers.",
    image: "/images/news/eu-instant-payments.jpg",
    imageAlt: "The European Parliament building in Strasbourg, France, where EU instant payment regulations were shaped",
    content: `<p>A sweeping set of regulations taking effect across the European Union in 2026 is fundamentally changing how euro-denominated transfers work. Under the new Instant Payments Regulation, every bank and payment service provider in the EU must support real-time euro credit transfers — available 24 hours a day, 365 days a year, with funds arriving in the recipient's account within 10 seconds.</p>

<h2>The end of "business hours" banking</h2>
<p>Until now, instant payments in the euro area were optional. Many banks offered the service for a premium or limited it to certain hours. The new mandate eliminates those restrictions. Whether you're sending money at 3 PM on a Tuesday or 2 AM on Christmas Day, the transfer must process immediately and at no additional charge compared to a standard credit transfer.</p>

<p>For cross-border transfers within the eurozone — say, Germany to Spain or France to Italy — this removes one of the last friction points. Previously, even SEPA transfers could take up to one business day. Now they'll be effectively instantaneous. If you're unfamiliar with the codes and account numbers involved, our guide to <a href="/guides/iban-numbers-explained">IBAN numbers explained</a> covers everything you need.</p>

<h2>Verification of Payee: a fraud safeguard</h2>
<p>Alongside the speed mandate, providers must implement "Verification of Payee" (VoP) checks. Before processing a transfer, the sending bank will verify that the recipient's name matches the account details provided. If there's a mismatch, the sender receives a warning — a measure designed to combat authorised push payment fraud, which has surged across Europe in recent years.</p>

<h2>Impact on international remittances</h2>
<p>While the regulation directly covers euro-to-euro transfers within the EU, the ripple effects extend to international remittances. Providers like <a href="/companies/wise">Wise</a>, <a href="/companies/revolut">Revolut</a>, and <a href="/companies/worldremit">WorldRemit</a> that hold European licences will benefit from faster settlement on the euro leg of cross-border corridors. A transfer from Germany to India, for example, could see faster processing on the European side even if the Indian payout timing remains unchanged. For a full breakdown of how international bank payments work end-to-end, see our <a href="/guides/wire-transfer-guide">wire transfer guide</a> and our explainer on <a href="/guides/swift-codes-explained">SWIFT codes</a>. To understand how interbank rates affect the cost of euro transfers, read our guide on <a href="/guides/how-euribor-affects-euro-transfers">how Euribor affects euro transfers</a>.</p>

<p>The regulation also sets a precedent. The UK, Australia, and several Asian regulators are studying similar mandates for their domestic payment systems. Compare providers for <a href="/send-money/uk-to-europe">UK to Europe transfers</a> to see how these changes affect real costs.</p>`,
    category: "Regulatory",
    publishedAt: "2026-03-11",
    source: "Sidley Austin / The Paypers",
    sourceUrl: "https://www.sidley.com/en/insights",
    providerSlugs: ["wise", "revolut", "worldremit"],
  },
  {
    slug: "china-digital-yuan-interest-bearing-cbdc",
    title: "Analysis: What Interest-Bearing Digital Yuan Wallets Could Mean for Cross-Border Payments",
    excerpt:
      "China's e-CNY programme continues to evolve. We look at reports of interest-bearing CBDC wallets and what this could mean for the future of cross-border payments.",
    image: "/images/news/digital-yuan-interest.jpg",
    imageAlt: "Chinese yuan banknotes spread out, representing China's digital currency developments",
    content: `<p><em>Editor's note: This article is analysis based on limited public reporting. Some claims could not be independently verified from primary sources at the time of publication.</em></p>

<p>China's digital yuan (e-CNY) programme has reportedly crossed a threshold that no other central bank digital currency has reached: interest-bearing wallets. Reports suggest that holders of category 1–3 e-CNY wallets may now receive interest at prevailing demand deposit rates, with quarterly settlement directly into their wallets.</p>

<h2>Why this matters beyond China</h2>
<p>Central banks around the world have debated whether CBDCs should bear interest. The argument against is straightforward — an interest-bearing CBDC could pull deposits away from commercial banks, destabilising the financial system. China's decision to go ahead anyway, with wallets also now covered by deposit insurance, is the biggest real-world test of that theory.</p>

<p>The scale is significant. The People's Bank of China reports over 230 million active e-CNY wallets and cumulative transaction volume exceeding 16.7 trillion yuan (roughly $2.3 trillion). Interest payments on that base, even at low demand-deposit rates, represent a meaningful transfer of value from the central bank to consumers.</p>

<h2>What it could mean for cross-border payments</h2>
<p>China has been piloting cross-border e-CNY transactions through the mBridge project, a collaboration with central banks in Hong Kong, Thailand, the UAE, and Saudi Arabia. An interest-bearing digital yuan could accelerate adoption in these corridors, particularly for trade settlement and potentially for person-to-person remittances.</p>

<p>For now, the direct impact on Western consumers sending money to China is minimal — inbound remittances to China still flow through traditional channels. Our <a href="/guides/how-to-send-money-abroad">guide to sending money abroad</a> covers the best approaches for reaching Asian corridors today. The digital yuan's evolution is worth watching as a bellwether for how CBDCs might reshape the landscape described in our <a href="/guides/global-remittance-trends-2026">2026 global remittance trends</a> report — where digital payment infrastructure in emerging markets is among the biggest stories.</p>`,
    category: "Industry News",
    publishedAt: "2026-03-10",
    source: "BeInCrypto / People's Bank of China reports",
    sourceUrl: "https://beincrypto.com/china-digital-yuan/",
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
<p>Absa Global Pay supports three delivery methods: direct bank deposits, mobile wallet credits, and cash pickup. Recipients in markets like Kenya, India, Pakistan, Malawi, and Zimbabwe can choose whichever method suits them best. The service processes transfers in what Absa describes as "near real-time" for most corridors, with cash pickup available within hours.</p>

<p>The initial corridor list targets some of the largest remittance flows in and out of Southern Africa. Notably, the service also supports transfers to the UK — a corridor that typically moves in the opposite direction (UK to Africa), suggesting Absa sees demand from South Africa's professional diaspora sending money northward.</p>

<h2>The Thunes connection</h2>
<p>Thunes, a Singapore-based payments network, connects over 130 countries through direct integrations with mobile wallets, banks, and cash-out networks. The company has quietly become a key infrastructure player in emerging-market payments, powering the backend for several well-known remittance brands. Its partnership with Absa gives the bank instant access to payout infrastructure that would have taken years to build independently.</p>

<h2>Competitive implications</h2>
<p>Sub-Saharan Africa remains the most expensive region to send money to, with average costs of 7.4% for a $200 transfer according to the World Bank. New entrants like Absa Global Pay inject competition into corridors that have traditionally been dominated by <a href="/companies/western-union">Western Union</a>, <a href="/companies/moneygram">MoneyGram</a>, and a handful of regional operators. More competition typically means lower prices — a pattern we've seen play out in mature digital corridors like <a href="/send-money/usa-to-nigeria">USA to Nigeria</a> and UK-to-Philippines. For a deeper look at these trends, see our <a href="/guides/global-remittance-trends-2026">2026 global remittance trends</a> report, or compare costs right now using our guide to the <a href="/guides/cheapest-way-to-send-money-internationally">cheapest ways to send money internationally</a>.</p>`,
    category: "Announcement",
    publishedAt: "2026-03-09",
    source: "Fintech Global",
    sourceUrl: "https://www.fintechglobal.com/",
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
<p><a href="/companies/paypal">PayPal</a> has been expanding the reach of PYUSD, its dollar-pegged stablecoin, beyond consumer wallets into merchant settlement. Stripe's Bridge subsidiary, acquired in late 2024, recently received conditional OCC approval to operate a federally chartered trust bank focused on stablecoin products. And traditional banks like Santander and Societe Generale are exploring their own institutional stablecoins for trade finance.</p>

<p>The appeal for businesses is practical: a B2B payment from the US to Southeast Asia using traditional correspondent banking can take 3–5 days, involve 2–4 intermediary banks, and carry fees of 2–5%. A stablecoin-settled transaction can clear in minutes at a fraction of the cost.</p>

<h2>What about consumer remittances?</h2>
<p>The technology hasn't meaningfully reached everyday senders yet, but the building blocks are falling into place. <a href="/companies/moneygram">MoneyGram</a>'s existing crypto-to-cash service via the Stellar network demonstrates one bridge between stablecoin rails and cash economies. As regulatory frameworks mature — particularly around stablecoin issuance and reserve requirements — expect more providers to offer stablecoin-powered corridors, especially to markets where traditional banking infrastructure is sparse. For a deep dive into the companies driving this shift, read our guide on <a href="/guides/crypto-banking-licenses-2026">crypto banking licenses and what they mean for transfers</a>.</p>

<h2>Regulatory tailwinds</h2>
<p>The US, EU, and UK are all advancing stablecoin-specific legislation in 2026. Clear rules around reserve backing, redemption rights, and operational resilience could transform stablecoins from a niche fintech tool into mainstream financial infrastructure. Businesses handling cross-border payments should read our <a href="/guides/business-international-payments-guide">guide to international business payments</a> to understand how emerging rails compare to traditional options today. For the macro view of where these changes fit, see our <a href="/guides/global-remittance-trends-2026">2026 global remittance trends</a> report. For cross-border payments, that transformation can't come soon enough.</p>`,
    category: "Industry News",
    publishedAt: "2026-03-08",
    source: "American Banker / DL News",
    sourceUrl: "https://www.americanbanker.com/payments",
    providerSlugs: ["paypal", "moneygram"],
  },
  {
    slug: "embedded-finance-regulation-tightening-2026",
    title: "US Regulators Turn Their Attention to Embedded Finance as Transaction Volumes Soar",
    excerpt:
      "With embedded finance transactions projected to exceed $7 trillion in 2026, regulators are scrutinising the sector — but most firms say tighter rules will actually help.",
    image: "/images/news/embedded-finance-regulation.jpg",
    imageAlt: "A statue beside the European Union flag, symbolising regulatory oversight of embedded finance",
    content: `<p>The embedded finance sector — companies that weave financial services like payments, lending, and insurance into non-financial apps and platforms — is bracing for increased regulatory oversight in the United States. And somewhat counterintuitively, most players in the space say they welcome it.</p>

<h2>The scale demands attention</h2>
<p>Transaction volumes flowing through embedded finance platforms are projected to exceed $7 trillion in 2026, according to industry estimates. That's roughly the GDP of Japan passing through technology layers that sit between consumers and regulated financial institutions. For regulators accustomed to direct oversight of banks and licensed money transmitters, the intermediary layer presents novel challenges around consumer protection, data privacy, and operational resilience.</p>

<h2>Why the industry isn't fighting it</h2>
<p>A survey of embedded finance firms published by PYMNTS found that a majority view additional regulation positively. The reasoning is pragmatic: clearer rules reduce uncertainty, make it easier to form partnerships with banks, and create barriers to entry that benefit established players. "We'd rather have rules we can plan around than ambiguity that makes banks nervous about working with us," one fintech executive noted.</p>

<h2>Connections to cross-border payments</h2>
<p>Embedded finance intersects directly with international money transfers. Services like <a href="/companies/wise">Wise</a> Platform and <a href="/companies/paypal">PayPal</a>'s Braintree allow non-financial companies to embed cross-border payment capabilities into their own products — think freelance marketplaces paying contractors abroad, or e-commerce platforms handling cross-border seller payouts. Regulatory clarity in this space could accelerate adoption of embedded remittance solutions, bringing competition and lower costs to corridors that traditional providers have long dominated. Our <a href="/guides/business-international-payments-guide">guide to international business payments</a> explains the practical options available to companies today, while our <a href="/guides/money-transfer-safety-guide">money transfer safety guide</a> covers what regulatory protections to look for when choosing a provider.</p>`,
    category: "Regulatory",
    publishedAt: "2026-03-07",
    source: "PYMNTS",
    sourceUrl: "https://www.pymnts.com/",
    providerSlugs: ["wise", "paypal"],
  },
  {
    slug: "rwanda-launches-national-fintech-centre-2026",
    title: "Analysis: Rwanda's Ambitions as Africa's Fintech Hub and What It Means for Remittances",
    excerpt:
      "Rwanda is reportedly building a national FinTech Centre and digital innovation platform. We analyse what a growing East African fintech ecosystem could mean for remittance costs.",
    image: "/images/news/rwanda-fintech-centre.jpg",
    imageAlt: "Aerial view of Kigali's modern skyline, where Rwanda launched its new national FinTech Centre",
    content: `<p><em>Editor's note: This article is analysis based on limited public reporting. Specific launch details could not be fully verified from primary sources at the time of publication.</em></p>

<p>Rwanda, already one of Africa's most digitally connected economies, is reportedly making an explicit bid to become the continent's fintech capital. At the Inclusive FinTech Forum 2026, held in Kigali during the week of March 10–14, the government is said to have launched a national FinTech Centre alongside "Innovate Rwanda" — a digital platform connecting startups with funding, mentorship, and incubation programmes.</p>

<h2>Why Rwanda?</h2>
<p>The East African nation punches above its weight in digital infrastructure. Mobile money penetration exceeds 80% of the adult population, the government has invested heavily in 4G coverage (reaching 96% of the population), and Rwanda's regulatory sandbox — which allows fintechs to test products under lighter-touch supervision — has attracted dozens of early-stage companies since launching in 2021.</p>

<p>The new FinTech Centre will serve as a physical and institutional hub, offering co-working space, regulatory guidance, and connections to regional and international investors. I&M Bank, one of East Africa's largest banking groups, was a headline sponsor and has committed to partnering with Centre graduates on product launches.</p>

<h2>Implications for remittances</h2>
<p>Inbound remittances are a lifeline for Rwanda's economy, accounting for roughly 3% of GDP. The country has been a pioneer in mobile money-based remittance delivery — services like <a href="/companies/taptap-send">TapTap Send</a> and <a href="/companies/worldremit">WorldRemit</a> already support mobile wallet payouts to Rwanda's major networks. A thriving local fintech ecosystem could produce homegrown competitors that further drive down costs on corridors like UK-to-Rwanda and US-to-Rwanda, which currently average 6–8% in total transfer costs.</p>

<p>More broadly, Rwanda's initiative reflects a continent-wide trend documented in our <a href="/guides/global-remittance-trends-2026">2026 global remittance trends</a> report. Nigeria, Kenya, and South Africa have all launched or expanded fintech regulatory sandboxes in the past two years, creating a competitive landscape for African fintech talent and investment. If you're already sending to Africa, our <a href="/guides/best-money-transfer-apps">best money transfer apps</a> guide highlights which providers offer the widest mobile wallet coverage across the continent. See our <a href="/guides/how-to-send-money-abroad">guide to sending money abroad</a> for tips on finding the cheapest options.</p>`,
    category: "Industry News",
    publishedAt: "2026-03-14",
    source: "The New Times (Rwanda) / Inclusive FinTech Forum",
    sourceUrl: "https://www.newtimes.co.rw/article/22683/news/technology/",
    providerSlugs: ["worldremit", "taptap-send"],
  },
  {
    slug: "moneyremitter-launches-deals-comparison",
    title: "SendMoneyCompare Now Shows Promo Codes & Referral Bonuses Alongside Rates",
    excerpt:
      "Our comparison platform now displays sign-up offers, referral rewards, and active promo codes for all 14 providers — so you can factor in bonuses when choosing where to send.",
    image: "/images/news/moneyremitter-deals.jpg",
    imageAlt: "A person making a mobile payment using a smartphone, representing new deal comparison features",
    content: `<p>We've shipped a feature that our users have been asking about for months: you can now see <strong>promo codes</strong>, <strong>sign-up bonuses</strong>, and <strong>refer-a-friend rewards</strong> directly on the SendMoneyCompare comparison page, right alongside the exchange rates and fees you already rely on.</p>

<h2>What's new</h2>
<p>Every provider card on the <a href="/send-money">Send Money</a> page now shows deal badges where applicable. You'll see badges like "Earn $25" for <a href="/companies/remitly">Remitly</a>'s referral programme, "3 free transfers" for <a href="/companies/worldremit">WorldRemit</a>'s promo code, and "Earn £50" for <a href="/companies/torfx">TorFX</a>'s generous refer-a-friend scheme. Expanding any provider card reveals the full details — what you earn, what your friend gets, and any conditions attached.</p>

<h2>New sorting and filtering</h2>
<p>We've added a <strong>"Best deals"</strong> sort option that ranks providers by the overall value of their promotions and loyalty programmes. There's also a new <strong>"Deals" filter</strong> that lets you narrow results to only providers offering referral bonuses, sign-up incentives, or active promo codes.</p>

<h2>Highlights worth knowing</h2>
<ul>
<li><strong>Remitly:</strong> $25 per referral with no cap on the number of friends you can invite</li>
<li><strong>TorFX:</strong> £50 for both you and your friend on transfers over £2,000</li>
<li><strong>WorldRemit:</strong> Use code <strong>3FREE</strong> to get three fee-free transfers</li>
<li><strong><a href="/companies/wise">Wise</a>:</strong> Earn up to $115 for every three friends who transfer $300 or more</li>
<li><strong><a href="/companies/western-union">Western Union</a>:</strong> $15 Amazon gift card per referral (up to 20 friends)</li>
</ul>

<p>Promo details are verified monthly and shown with a "last verified" date. When bonuses aren't the deciding factor, our guide to the <a href="/guides/cheapest-way-to-send-money-internationally">cheapest ways to send money internationally</a> and our <a href="/guides/best-money-transfer-services">best money transfer services</a> roundup help you pick the right provider on fundamentals alone. For the full breakdown of every provider's current offers, check out our comprehensive guide: <a href="/guides/money-transfer-promo-codes-referral-programs">Money Transfer Promo Codes & Referral Programs (2026)</a>.</p>`,
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
    imageAlt: "Chart showing Federal Reserve rate cut projections declining from 2 cuts to 1 cut between December 2025 and March 2026",
    content: `<div class="blog-answer-box" style="background:#e8f0fe;border-radius:12px;padding:16px 20px;margin-bottom:20px;border-left:4px solid #1a73e8">
<p><strong>Key takeaway:</strong> The Fed held rates at 3.5–3.75% and projects just one cut in 2026 (down from two in January). A stronger dollar means Americans sending money abroad get more local currency per dollar — but the window may narrow if oil prices push inflation higher. Compare rates from multiple providers before your next transfer.</p>
</div>

<p>The Federal Reserve held interest rates steady at <strong>3.5–3.75%</strong> at its March 18–19 meeting, as widely expected. But the real story is in the updated "dot plot" — the Fed now projects <strong>just one rate cut in 2026</strong>, down from two projected in January. Rising oil prices and sticky inflation readings narrowed the window for easing.</p>

<h2>How the Fed rate path shifted</h2>
<div class="blog-table-box">
<h3 style="margin-top: 0;">Fed Rate Cut Projections: How the Dot Plot Changed</h3>
<table>
<thead><tr><th>Meeting</th><th>Rate Range</th><th>Projected Cuts in 2026</th><th>Signal</th></tr></thead>
<tbody>
<tr><td>Dec 2025</td><td>3.50–3.75%</td><td>2 cuts</td><td>Moderately dovish</td></tr>
<tr><td>Jan 2026</td><td>3.50–3.75% (hold)</td><td>2 cuts</td><td>Wait and see</td></tr>
<tr class="blog-row-highlight"><td><strong>Mar 2026 (today)</strong></td><td><strong>3.50–3.75% (hold)</strong></td><td><strong>1 cut</strong></td><td><strong>Hawkish shift</strong></td></tr>
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

<div style="background:#fff3e0;border-radius:12px;padding:16px 20px;margin:20px 0;border-left:4px solid #ff9800">
<p style="margin:0"><strong>Market speculation:</strong> If oil stays above $90/barrel through Q2, emerging market currencies (INR, PKR, PHP, NGN) could weaken a further 2–5% against the dollar. This would make Q2 an unusually favourable window for US senders — but a painful period for recipients' purchasing power. The <a href="/guides/how-euribor-affects-euro-transfers">Euribor guide</a> explains how European rate dynamics add another layer.</p>
</div>

<h2>What to do now</h2>
<p>If you have a transfer planned:</p>
<ol>
<li><strong>Compare rates now</strong> — the post-Fed dollar strength may not last if economic data softens. Use our <a href="/send-money">comparison tool</a> to lock in today's rates.</li>
<li><strong>Set rate alerts</strong> — <a href="/companies/wise">Wise</a> and <a href="/companies/xe">Xe</a> let you set alerts when your target rate hits. If you're not in a rush, wait for the optimal moment.</li>
<li><strong>Avoid banks during volatile weeks</strong> — Banks widen their exchange rate markup when currencies move. Specialist providers like <a href="/companies/wise">Wise</a> (0% markup) and <a href="/companies/remitly">Remitly</a> pass through the real rate. See our <a href="/guides/exchange-rate-markup-explained">exchange rate markup guide</a>.</li>
<li><strong>Consider splitting large transfers</strong> — If you're sending $5,000+, consider splitting into two transfers a week apart to average out the rate. <a href="/companies/ofx">OFX</a> offers forward contracts to lock rates for up to 12 months.</li>
</ol>

<p>The next major catalyst is the <strong>May 6–7 Fed meeting</strong> and the April jobs report. We'll cover both as they happen. For the full breakdown of how central bank decisions affect your transfers, read our <a href="/news/central-bank-super-week-march-2026">central bank super week analysis</a>. For background on how different providers handle volatility, read the <a href="/guides/cheapest-way-to-send-money-internationally">cheapest international transfers guide</a> and our <a href="/guides/best-money-transfer-services">best money transfer services</a> ranking.</p>`,
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
      "GCash is offering zero-fee transfers to the UAE, Saudi Arabia, Qatar, and Oman through March 31. Meanwhile, the Philippine House passed a resolution urging all providers to waive OFW remittance fees.",
    image: "/images/news/gcash-ofw-fee-waiver-2026.svg",
    imageAlt: "Infographic showing GCash zero-fee transfer promotion to UAE, Saudi Arabia, Qatar and Oman for overseas Filipino workers, with key statistics: 10M+ OFWs, $40B+ annual remittances",
    content: `<div class="blog-answer-box" style="background:#e8f0fe;border-radius:12px;padding:16px 20px;margin-bottom:20px;border-left:4px solid #1a73e8">
<p><strong>Quick summary:</strong> GCash is offering zero-fee international transfers to the UAE, Saudi Arabia, Qatar, and Oman through March 31, 2026 — no minimum amount. Separately, the Philippine House of Representatives passed Resolution 905 urging all banks and remittance providers to waive OFW fees amid the Middle East crisis. If you're an OFW in the Gulf, act before March 31.</p>
</div>

<p>Two developments in the Philippines this week could reshape how over <strong>10 million overseas Filipino workers (OFWs)</strong> send money home:</p>

<h2>GCash: Zero fees to the Middle East through March 31</h2>
<p><strong>GCash</strong>, the Philippines' largest mobile wallet with over 90 million users, launched a <strong>zero-fee international transfer promotion</strong> covering the UAE, Saudi Arabia, Qatar, and Oman from March 12–31, 2026. No minimum amount. Most transfers credited same-day.</p>

<p>The timing is significant — rising oil prices driven by <strong>Middle East supply disruptions</strong> are increasing the cost of living for Filipino workers in the Gulf. GCash is positioning the fee waiver as relief for OFWs who need every dirham and riyal to stretch further.</p>

<div class="blog-table-box">
<h3 style="margin-top: 0;">GCash Fee Waiver: What's Covered</h3>
<table>
<thead><tr><th>Feature</th><th>Details</th></tr></thead>
<tbody>
<tr><td><strong>Promo period</strong></td><td>March 12–31, 2026</td></tr>
<tr><td><strong>Countries covered</strong></td><td>UAE, Saudi Arabia, Qatar, Oman</td></tr>
<tr><td><strong>GCash Overseas accounts</strong></td><td>UAE, Saudi Arabia, Qatar, Bahrain, Kuwait, Oman</td></tr>
<tr><td><strong>Minimum amount</strong></td><td>None</td></tr>
<tr><td><strong>Fees waived</strong></td><td>Bank transfers, mobile load, bill payments</td></tr>
<tr><td><strong>Delivery speed</strong></td><td>Same-day (most transfers)</td></tr>
<tr class="blog-row-highlight"><td><strong>Retroactive cashback</strong></td><td>Transactions from March 4–10 credited on March 20</td></tr>
</tbody>
</table>
</div>

<h2>Philippine Congress: Waive ALL OFW remittance fees</h2>
<p>On March 18, the Philippine House of Representatives passed <strong>House Resolution 905</strong>, authored by Majority Leader Ferdinand Alexander Marcos, urging banks, remittance centres, and money transfer providers to <strong>temporarily waive or reduce fees</strong> for all OFW remittances — not just through GCash.</p>

<p>The resolution is non-binding (it cannot force providers to comply), but it sends a strong signal. If major players like <a href="/companies/western-union">Western Union</a>, <a href="/companies/remitly">Remitly</a>, and <a href="/companies/worldremit">WorldRemit</a> follow GCash's lead, Filipino workers could save billions of pesos collectively.</p>

<div style="background:#fff3e0;border-radius:12px;padding:16px 20px;margin:20px 0;border-left:4px solid #ff9800">
<p style="margin:0"><strong>Our prediction:</strong> GCash's zero-fee promotion is a land-grab for OFW market share, not charity. Expect <a href="/companies/remitly">Remitly</a> and <a href="/companies/worldremit">WorldRemit</a> to respond within weeks with competing offers. The congressional resolution gives them political cover to do so. Watch our <a href="/guides/money-transfer-promo-codes-referral-programs">promo codes page</a> — we'll track every new offer as it launches.</p>
</div>

<h2>The numbers: why this matters</h2>
<div class="blog-table-box">
<h3 style="margin-top: 0;">Philippines Remittance Facts</h3>
<table>
<thead><tr><th>Metric</th><th>Value</th></tr></thead>
<tbody>
<tr><td>OFWs worldwide</td><td><strong>10+ million</strong></td></tr>
<tr><td>Annual remittances</td><td><strong>$40+ billion</strong> (4th largest globally)</td></tr>
<tr><td>From Gulf states</td><td><strong>~30%</strong> of total ($12B+)</td></tr>
<tr><td>Average remittance cost to PH</td><td><strong>4.9%</strong> (<a href="https://remittanceprices.worldbank.org/" target="_blank" rel="noopener noreferrer nofollow">World Bank</a>)</td></tr>
<tr class="blog-row-highlight"><td>Potential annual savings at 0% fees</td><td><strong>$600M+</strong> back to Filipino families</td></tr>
</tbody>
</table>
</div>

<h2>What OFWs should do right now</h2>
<ol>
<li><strong>Use GCash for zero-fee transfers through March 31</strong> — this is the cheapest it will get. No minimum amount, covers the key Gulf countries.</li>
<li><strong>Compare the total PHP received, not just fees</strong> — GCash waives fees but still applies an exchange rate markup. Our <a href="/send-money/uae-to-philippines">UAE to Philippines comparison</a> shows whether GCash's zero-fee offer beats <a href="/companies/remitly">Remitly</a> and <a href="/companies/wise">Wise</a> on total value received.</li>
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
    content: `<div class="blog-answer-box" style="background:#e8f0fe;border-radius:12px;padding:16px 20px;margin-bottom:20px;border-left:4px solid #1a73e8">
<p><strong>Key facts:</strong> SWIFT announced that 75% of cross-border payments now reach banks within 10 minutes (up from days just a few years ago). Separately, Thunes connected 500 million stablecoin wallets to the SWIFT network via USDC/USDT. And Wizz Financial completed the first US stablecoin remittance into 80 countries. The race to make international transfers instant and near-free is accelerating — but for consumers, specialist providers like <a href="/companies/wise">Wise</a> and <a href="/companies/remitly">Remitly</a> remain the best option today.</p>
</div>

<p>Two announcements this week paint a picture of an industry in rapid transformation — and suggest that the days of 3–5 day international bank wires are numbered.</p>

<h2>SWIFT: 75% of payments in 10 minutes</h2>
<p>At the <strong>Financial Stability Board's Cross-Border Payments Summit</strong> in London (March 16), SWIFT revealed that <strong>75% of cross-border payments now reach the beneficiary bank within 10 minutes</strong>, with some settling in seconds. This is a dramatic improvement from just a few years ago, when 3–5 business days was the norm for international bank wires.</p>

<p>SWIFT also announced plans for a <strong>new retail payments framework by June 2026</strong>, ensuring consumer payments benefit from the fastest possible speeds, cost certainty, and end-to-end transparency. And in a nod to the blockchain competition, SWIFT is integrating a <strong>shared blockchain-based ledger</strong> for 24/7 real-time settlement.</p>

<p>For consumers, this means the traditional bank wire is getting faster — but it's still not cheap. Banks continue to charge <strong>$25–$50 per wire plus 2–5% exchange rate markup</strong>, even as the underlying infrastructure improves. The speed gains benefit banks' bottom lines more than their customers' wallets. For a full breakdown of wire transfer costs, see our <a href="/guides/wire-transfer-guide">wire transfer guide</a>.</p>

<h2>Thunes + SWIFT: 500 million stablecoin wallets connected</h2>
<p>On March 17, <strong>Thunes</strong> (a major payments infrastructure provider) announced it can now route stablecoin payouts — in <strong>USDC and USDT</strong> — to over <strong>500 million crypto wallets</strong> worldwide, all connected via SWIFT. The 11,500 banks already on the SWIFT network can now send payments to stablecoin addresses with zero additional integration.</p>

<p>This is a quiet revolution. It means a corporate treasurer in New York could soon initiate a "wire transfer" through their normal banking portal and have the funds arrive in a vendor's stablecoin wallet in Lagos or Manila in <strong>seconds, at a fraction of the cost</strong>.</p>

<h2>Wizz Financial: First US stablecoin remittance completed</h2>
<p>Separately, <strong>Wizz Financial</strong> completed its first stablecoin-powered cross-border remittance from the United States on March 12, with capabilities into 80 countries. Using <strong>BitGo's digital trust bank infrastructure</strong>, Wizz converts fiat to stablecoins on the back end, settles instantly, and delivers in local currency — the sender and recipient never touch crypto.</p>

<h2>What this means for people sending money abroad</h2>
<p>The convergence of faster SWIFT rails, stablecoin infrastructure, and fintech competition is compressing both cost and time:</p>

<div class="blog-table-box">
<h3 style="margin-top: 0;">How the Landscape Is Changing</h3>
<table>
<thead><tr><th>Channel</th><th>Speed (2023)</th><th>Speed (2026)</th><th>Cost (2026)</th></tr></thead>
<tbody>
<tr><td>Bank wire (SWIFT)</td><td>3–5 days</td><td>Minutes–hours</td><td>$25–$50 + 2–5% markup</td></tr>
<tr class="blog-row-highlight"><td><strong>Specialist provider (Wise, Remitly)</strong></td><td>Hours–1 day</td><td><strong>Minutes</strong></td><td><strong>$0–$7 + 0–0.5% markup</strong></td></tr>
<tr><td>Stablecoin rail</td><td>Not available</td><td>Seconds</td><td>$0.01–$1 network fee</td></tr>
</tbody>
</table>
</div>

<p>For most people sending money today, <strong>specialist providers remain the best option</strong>. They're already fast (minutes via <a href="/send-money/usa-to-india">IMPS</a>, <a href="/send-money/usa-to-kenya">M-Pesa</a>, <a href="/send-money/usa-to-mexico">SPEI</a>) and dramatically cheaper than banks. Stablecoins are the future, but most recipients still need local currency in a bank account or mobile wallet — and that "last mile" conversion is where fintechs like <a href="/companies/wise">Wise</a> and <a href="/companies/remitly">Remitly</a> excel today.</p>

<h2>Stablecoin adoption: where we are now</h2>
<div class="blog-table-box">
<h3 style="margin-top: 0;">Stablecoin Usage for Cross-Border Payments (2026)</h3>
<table>
<thead><tr><th>Metric</th><th>Value</th><th>Source</th></tr></thead>
<tbody>
<tr><td>US remittance users using stablecoins</td><td><strong>26%</strong></td><td>FXC Intelligence</td></tr>
<tr><td>Nigerian users</td><td><strong>28%</strong></td><td>FXC Intelligence</td></tr>
<tr><td>Argentine users</td><td><strong>12%</strong></td><td>FXC Intelligence</td></tr>
<tr><td>Stablecoin wallets connected to SWIFT</td><td><strong>500M+</strong></td><td>Thunes (Mar 2026)</td></tr>
<tr><td>Banks on SWIFT network</td><td><strong>11,500</strong></td><td>SWIFT</td></tr>
<tr class="blog-row-highlight"><td>Avg stablecoin transfer fee</td><td><strong>$0.01–$1</strong></td><td>vs $25–$50 bank wire</td></tr>
</tbody>
</table>
</div>

<h2>Our take</h2>
<p>The market is bifurcating. SWIFT is getting faster, but banks aren't passing the savings through to consumers. Stablecoins offer near-zero cost, but require both parties to be comfortable with crypto infrastructure. <strong>Specialist transfer providers sit in the sweet spot</strong> — fast, cheap, and no crypto knowledge required. We expect this to remain true through at least 2027, with stablecoins gradually eating into B2B corridors first and consumer remittances later.</p>

<div style="background:#e8f5e9;border-radius:12px;padding:16px 20px;margin:20px 0;border-left:4px solid #4caf50">
<p style="margin:0"><strong>Bottom line for senders:</strong> You don't need to wait for stablecoins to save money today. Providers like <a href="/companies/wise">Wise</a> (0% markup), <a href="/companies/remitly">Remitly</a> (minutes delivery), and <a href="/companies/instarem">Instarem</a> (zero fees) already deliver 80–95% savings vs banks — with no crypto involved. Use our <a href="/send-money">live comparison tool</a> to find the best rate right now.</p>
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
    content: `<p>The world's largest remittance corridor is going cashless — and it's happening faster than anyone predicted.</p>

<p>Bloomberg <a href="https://www.bloomberg.com/news/articles/2026-03-17/mexico-s-62-billion-in-us-remittances-shifts-away-from-cash" target="_blank" rel="noopener noreferrer nofollow">reported on March 17</a> that Mexico's US remittance corridor — worth over <strong>$62 billion annually</strong> — is experiencing a rapid shift from cash-based transfers to digital. Cash's share of inbound remittances has fallen from over 60% a decade ago to under 35% in early 2026, with app-based transfers now accounting for the majority of volume for the first time.</p>

<h2>Why the shift is accelerating in 2026</h2>
<p>Three forces are converging to push the US-Mexico corridor digital:</p>
<ul>
<li><strong>The 1% US remittance tax</strong> — The <a href="/news/us-remittance-excise-tax-takes-effect-2026">federal excise tax</a> that took effect in January 2026 applies only to cash-funded transfers. Digital transfers are exempt, giving millions of senders a direct financial incentive to switch from agent counters to apps.</li>
<li><strong>Mexico's expanding digital infrastructure</strong> — Bank of Mexico's SPEI instant payment system now processes over 300 million transactions per month, and mobile banking penetration has doubled since 2022. Recipients who once needed cash pickup now have bank accounts or digital wallets that can receive instant deposits.</li>
<li><strong>Provider competition on USD-MXN</strong> — <a href="/companies/remitly">Remitly</a>, <a href="/companies/wise">Wise</a>, and <a href="/companies/taptap-send">TapTap Send</a> have all expanded their Mexico offerings, driving fees down to near-zero on digital transfers. Our <a href="/send-money/usa-to-mexico">USA to Mexico comparison page</a> shows fees starting at $0 with exchange rate markups under 1%.</li>
</ul>

<h2>What this means for your transfers</h2>
<p>The shift is unambiguously good for senders. As digital volume grows, providers compete harder on the corridor, pushing down both fees and exchange rate markups. Our data shows the average total cost of sending $500 digitally from the US to Mexico has fallen from 3.2% in 2024 to under 1.5% in March 2026.</p>

<p>Cash transfers remain significantly more expensive — averaging 5–7% total cost at agent locations — and now carry the additional 1% tax burden. For a $1,000 transfer, switching from a cash agent to a digital app saves <strong>$40–$70</strong>.</p>

<h2>Winners and losers</h2>
<p>The clear winners are digital-first providers. <a href="/companies/remitly">Remitly</a> reports that Mexico is now its fastest-growing corridor by transaction count. <a href="/companies/wise">Wise</a> offers the mid-market exchange rate with 0% markup — consistently the cheapest option for bank-to-bank transfers to Mexico.</p>

<p>The losers are traditional agent networks. <a href="/companies/western-union">Western Union</a>, whose CEO recently <a href="/news/western-union-ceo-digital-competition-2026">acknowledged losing ground to digital rivals</a>, still operates thousands of agent locations across Mexico but is seeing digital transactions grow 3x faster than in-person visits. <a href="/companies/moneygram">MoneyGram</a> faces similar pressure.</p>

<p>That said, cash isn't dead yet. Roughly 10 million Mexican households still lack reliable banking access, and cash pickup remains essential for remittances to rural areas. But the trajectory is clear: digital is becoming the default.</p>

<h2>How to get the best rate on USD to MXN</h2>
<p>If you send money to Mexico regularly, here's how to maximise what your recipient receives:</p>
<ul>
<li><strong>Switch to digital</strong> — If you still send cash at an agent, switching to an app saves 3–5% per transfer plus avoids the 1% tax.</li>
<li><strong>Compare at your exact amount</strong> — Provider rankings change at different amounts. Our <a href="/send-money/usa-to-mexico">USA to Mexico comparison tool</a> shows live rates from 10+ providers.</li>
<li><strong>Check Ramadan promotions</strong> — Several providers are running <a href="/guides/ramadan-2026-money-transfer-deals-promotions">Ramadan 2026 deals</a> with fee waivers and enhanced rates through Eid al-Fitr.</li>
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
      "From May 1, all remittances to Nigeria must settle in naira — no more dollar payouts. Compare how Wise, Remitly, WorldRemit and Western Union are adapting, and what diaspora senders should do before the deadline.",
    image: "/images/news/nigeria-cbn-naira-remittance.svg",
    imageAlt:
      "Nigerian naira banknotes alongside a smartphone showing an international money transfer, representing the CBN's new remittance settlement rules",
    content: `<p>On March 24, 2026, the Central Bank of Nigeria dropped a directive that will reshape how millions of diaspora Nigerians send money home: all International Money Transfer Operators (IMTOs) must open naira settlement accounts with authorised dealer banks by <strong>May 1, 2026</strong>. From that date, recipients will receive naira — not dollars — when money arrives from abroad.</p>

<p>This is a seismic shift. For decades, many Nigerians receiving remittances from the US, UK, Canada, and Europe have received dollars (or pounds, or euros), often converting them at parallel market rates that were significantly more favourable than the official CBN rate. That era is ending.</p>

<h2>Our take: bold reform with real risks</h2>
<p>The CBN's stated goals are reasonable: channel more foreign exchange through the formal banking system, improve transparency, and stabilise the naira. Nigeria received an estimated <strong>$20 billion in remittances in 2025</strong>, making it Africa's largest remittance market. Capturing even a fraction more of that through official channels would boost FX reserves and support the naira.</p>

<p>But the execution carries real risks for ordinary senders and recipients:</p>

<ul>
<li><strong>Conversion rate uncertainty</strong> — If IMTOs are forced to convert at the official CBN rate rather than the market rate, recipients could receive 10–15% less naira per dollar. The gap between official and parallel rates has narrowed under recent reforms, but it hasn't closed entirely.</li>
<li><strong>Compliance costs passed to senders</strong> — IMTOs face new banking requirements, reporting obligations, and settlement infrastructure costs. As <a href="https://technext24.com/2026/03/25/cost-of-cbns-new-remittance-rules/" target="_blank" rel="noopener noreferrer nofollow">TechNext24 reported</a>, if operators absorb these costs, margins shrink and some smaller players may exit the market. If they pass costs downstream, fees go up.</li>
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
<p>The UK-to-Nigeria corridor is one of the largest in Africa, with British Nigerians sending an estimated <strong>£3–4 billion annually</strong> according to <a href="https://www.worldbank.org/en/topic/migrationremittancesdiasporaissues/brief/migration-remittances-data" target="_blank" rel="noopener noreferrer nofollow">World Bank remittance data</a>. The new CBN rule hits this corridor especially hard because many UK senders specifically chose providers offering GBP-to-USD or direct dollar payout — giving recipients a hedge against naira depreciation.</p>

<p>Under the new framework, that hedge disappears. Every GBP transfer will be converted to naira at the official rate before reaching the recipient. For UK senders comparing the <a href="/send-money/uk-to-nigeria">best way to send money from the UK to Nigeria</a>, the key metric shifts from "which provider gives the best dollar rate" to "which provider gives the best naira rate" — and those rankings may look very different after May 1.</p>

<p>Providers like <a href="/companies/wise">Wise</a> that already use the mid-market rate with transparent markups may fare better than those whose pricing relied on opaque FX spreads. <a href="/companies/worldremit">WorldRemit</a> and <a href="/companies/remitly">Remitly</a>, which both serve the UK-Nigeria corridor with competitive GBP/NGN rates, will need to renegotiate their settlement arrangements with Nigerian banks.</p>

<h2>The bigger picture</h2>
<p>The CBN says it's targeting <strong>$1 billion in monthly diaspora remittances by end of 2026</strong>, according to <a href="https://www.zawya.com/en/economy/africa/nigeria-cbn-targets-1bln-monthly-diaspora-remittance-by-the-end-of-2026-x0cgrkm5" target="_blank" rel="noopener noreferrer nofollow">Zawya</a>. That's ambitious — and whether it happens depends entirely on whether the new rules make formal channels more attractive or simply more expensive. For a broader perspective on how African remittance corridors are evolving, see our guide to <a href="/guides/send-money-to-nigeria-guide">sending money to Nigeria</a> and our <a href="/guides/global-remittance-trends-2026">2026 global remittance trends</a> report.</p>

<h2>Frequently asked questions</h2>
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
      "PayPal just opened Venmo to 200M users in 90 countries with $0 fees through August. But with 3-4% FX markups after the promo, can Venmo compete with Wise (0.4%) and Remitly on international transfers? Our analysis.",
    image: "/images/news/venmo-global-expansion.svg",
    imageAlt:
      "The Venmo app on a smartphone with a world map in the background, representing PayPal's global expansion of Venmo",
    content: `<p>On March 23, 2026, PayPal announced what it calls the biggest expansion of Venmo's addressable market since the app launched: <strong>Venmo users can now send and receive money with 200 million PayPal users across 90 countries</strong>. For the first time, an app that 90 million Americans already use for splitting restaurant bills can be used for international remittances.</p>

<p>The pitch is simple — send money abroad using just a phone number. And through August 24, PayPal is waiving all international fees on Venmo transfers. That's a bold play into a market worth over <strong>$40 trillion annually</strong> in cross-border retail payments.</p>

<h2>Our take: big brand, but can it compete on price?</h2>
<p>Venmo's global expansion is strategically significant but tactically questionable — at least for cost-conscious remittance senders. Here's why:</p>

<p><strong>The distribution advantage is real.</strong> Venmo has something that <a href="/companies/wise">Wise</a>, <a href="/companies/remitly">Remitly</a>, and <a href="/companies/worldremit">WorldRemit</a> don't: 90 million US users who already have the app installed and their payment methods linked. There's zero onboarding friction. For someone who's never sent money internationally before, opening Venmo and tapping "send to PayPal user" is dramatically easier than downloading a dedicated remittance app, completing KYC, and linking a bank account.</p>

<p><strong>But PayPal's FX margins have always been the problem.</strong> Historically, <a href="/companies/paypal">PayPal</a> has charged exchange rate markups of 3–4% on international transfers — roughly 4–8x what Wise charges. The fee waiver through August is a customer acquisition tool, not a permanent pricing strategy. Once the waiver ends, Venmo international transfers will likely carry the same premium pricing that has made PayPal one of the most expensive ways to send money abroad.</p>

<p><strong>The recipient needs PayPal.</strong> Unlike <a href="/companies/remitly">Remitly</a> or <a href="/companies/western-union">Western Union</a>, which offer bank deposit, mobile money, and cash pickup, Venmo-to-PayPal transfers require the recipient to have an active PayPal account. In major remittance corridors like the US to India, Philippines, Mexico, and Nigeria, PayPal penetration among recipients is far lower than in developed markets. That limits Venmo's usefulness precisely where remittance demand is highest.</p>

<h2>Who should care — and who shouldn't</h2>
<p>If you send money to family or friends in <strong>Europe, Canada, Australia, or other developed markets</strong> where PayPal is widely used, Venmo's global expansion is genuinely useful — especially during the fee-free promotional period. For casual, one-off international transfers, the convenience is hard to beat.</p>

<p>If you send money regularly to <strong>India, Philippines, Nigeria, Mexico, or Pakistan</strong> — the world's top remittance corridors — you're almost certainly better off with a dedicated provider. Our data consistently shows that <a href="/companies/wise">Wise</a>, <a href="/companies/remitly">Remitly</a>, and corridor specialists like <a href="/companies/taptap-send">TapTap Send</a> deliver 3–5% more to recipients than PayPal on these routes.</p>

<h2>The competitive picture</h2>
<p>Venmo's entry doesn't fundamentally change the economics of cross-border payments — it changes the <em>awareness</em>. Millions of Americans who never thought about using an app for international transfers will now see the option in their Venmo feed. Some will use it. Some will then discover that dedicated providers are cheaper and switch.</p>

<p>For <a href="/companies/wise">Wise</a> and <a href="/companies/remitly">Remitly</a>, the threat isn't that Venmo will undercut them on price. It's that Venmo will intercept users who might have otherwise found a specialist provider first. The race for the casual sender's first international transfer just got more competitive.</p>

<h2>Venmo vs Xoom: PayPal now has two international options</h2>
<p>Here's what <a href="https://www.paymentsdive.com/news/paypal-takes-venmo-global/815473/" target="_blank" rel="noopener noreferrer nofollow">Payments Dive</a> didn't explore in its coverage: PayPal now has <em>two</em> cross-border products — <a href="/companies/xoom">Xoom</a> and Venmo. They serve different needs:</p>
<ul>
<li><strong><a href="/companies/xoom">Xoom</a></strong> — PayPal's dedicated remittance service. Offers bank deposit, cash pickup, and mobile reload to 130+ countries. Competitive fees on high-volume corridors (US to Mexico, India, Philippines). Recipient doesn't need a PayPal account.</li>
<li><strong>Venmo international</strong> — P2P transfers to PayPal users only. Simpler interface, but limited delivery options and recipient must have PayPal. Better suited for casual transfers to developed markets.</li>
</ul>
<p>For regular remittance senders, <a href="/compare/paypal-vs-xoom">Xoom remains the better PayPal product</a>. For one-off transfers to friends in Europe or Australia, Venmo's convenience wins — especially during the fee-free period.</p>

<h2>How Venmo compares on price</h2>
<table>
<thead><tr><th>Provider</th><th>FX markup</th><th>Fees ($500 send)</th><th>Recipient needs account?</th><th>Delivery options</th></tr></thead>
<tbody>
<tr><td><strong>Venmo (promo)</strong></td><td>~3-4%</td><td>$0 through Aug 24</td><td>Yes (PayPal)</td><td>PayPal balance only</td></tr>
<tr><td><strong>Venmo (post-promo)</strong></td><td>~3-4%</td><td>TBD</td><td>Yes (PayPal)</td><td>PayPal balance only</td></tr>
<tr><td><strong><a href="/companies/wise">Wise</a></strong></td><td>0.4-0.6%</td><td>$5-7</td><td>No</td><td>Bank deposit</td></tr>
<tr><td><strong><a href="/companies/remitly">Remitly</a></strong></td><td>1-2%</td><td>$0-4</td><td>No</td><td>Bank, cash pickup, mobile</td></tr>
<tr><td><strong><a href="/companies/xoom">Xoom</a></strong></td><td>2-3%</td><td>$0-5</td><td>No</td><td>Bank, cash pickup, mobile reload</td></tr>
</tbody>
</table>
<p><em>Source: sendmoneycompare.com analysis, March 2026. Rates vary by corridor. <a href="https://newsroom.paypal-corp.com/2026-03-23-200-Million-More-Friends-on-Venmo-Send-Money-to-PayPal-Users-Around-the-World" target="_blank" rel="noopener noreferrer nofollow">PayPal announcement</a>.</em></p>

<h2>The competitive picture</h2>
<p>Venmo's entry doesn't fundamentally change the economics of cross-border payments — it changes the <em>awareness</em>. Millions of Americans who never thought about using an app for international transfers will now see the option in their Venmo feed. Some will use it. Some will then discover that dedicated providers are cheaper and switch.</p>

<p>For <a href="/companies/wise">Wise</a> and <a href="/companies/remitly">Remitly</a>, the threat isn't that Venmo will undercut them on price. It's that Venmo will intercept users who might have otherwise found a specialist provider first. The race for the casual sender's first international transfer just got more competitive.</p>

<p>Compare what you'd actually receive using our <a href="/send-money">comparison tool</a> — we show live rates and fees from PayPal alongside dedicated providers so you can see the real difference. For more on how PayPal's pricing compares, see our <a href="/companies/paypal">PayPal review</a> and <a href="/compare/wise-vs-paypal">Wise vs PayPal</a> comparison. And for an overview of the best options available, check our <a href="/guides/best-money-transfer-apps">best money transfer apps</a> guide.</p>

<h2>Frequently asked questions</h2>
<h3>Can I use Venmo to send money internationally?</h3>
<p>Yes, as of March 23, 2026, Venmo users can send money to PayPal users in 90 countries. The recipient must have an active PayPal account. International fees are waived through August 24, 2026, but PayPal's standard FX markup of 3-4% still applies to currency conversions.</p>

<h3>Is Venmo cheaper than Wise for international transfers?</h3>
<p>No. Even during the fee-free promotional period, Venmo's 3-4% exchange rate markup makes it significantly more expensive than <a href="/companies/wise">Wise</a> (0.4-0.6% markup) for most corridors. On a $1,000 transfer, you'd lose $30-40 to Venmo's FX spread vs $4-6 with Wise.</p>

<h3>What is the difference between Venmo international and Xoom?</h3>
<p><a href="/companies/xoom">Xoom</a> is PayPal's dedicated remittance service offering bank deposit, cash pickup, and mobile reload to 130+ countries — recipients don't need PayPal. Venmo international only sends to PayPal account holders. For regular remittances, <a href="/compare/paypal-vs-xoom">Xoom is the better choice</a>.</p>`,
    category: "Provider Update",
    publishedAt: "2026-03-27",
    source: "PayPal Newsroom / American Banker / Payments Dive",
    sourceUrl:
      "https://newsroom.paypal-corp.com/2026-03-23-200-Million-More-Friends-on-Venmo-Send-Money-to-PayPal-Users-Around-the-World",
    providerSlugs: ["paypal", "xoom", "wise", "remitly", "worldremit"],
  },
  {
    slug: "us-remittance-tax-3-months-behavioral-shift-2026",
    title:
      "1% US Remittance Tax Update: Cash Senders Switching to Digital Faster Than Expected (March 2026)",
    excerpt:
      "New survey data 3 months after the US excise tax: transactions rose from 14 to 18/year, cash is declining fast, and digital providers like Wise and Remitly are surging. Save $500-1,000/year by switching — here's how.",
    image: "/images/news/remittance-tax-behavioral-shift.svg",
    imageAlt:
      "A split image showing cash at a money transfer counter on one side and a smartphone money transfer app on the other, representing the shift from cash to digital",
    content: `<p>When the 1% federal excise tax on cash-funded international remittances <a href="/news/us-remittance-excise-tax-takes-effect-2026">took effect on January 1, 2026</a>, the remittance industry braced for a painful adjustment period. Three months later, the data tells a more nuanced story — and a surprising one.</p>

<p>According to the <a href="https://thedialogue.org/blogs/2026/03/change-and-continuity-in-money-transfers-in-2026" target="_blank" rel="noopener noreferrer nofollow">Inter-American Dialogue</a>, a survey of 200 migrants in February 2026 found that transaction frequency actually <strong>increased from 14 to 18 transactions per year</strong>. And <a href="https://www.marketplace.org/story/2026/03/26/why-a-1-remittance-tax-could-cost-more-than-it-seems" target="_blank" rel="noopener noreferrer nofollow">Marketplace reported</a> that while some senders switched from cash to digital to avoid the tax, others simply absorbed the cost — suggesting the tax is functioning less as a deterrent and more as a revenue tool that disproportionately taxes the unbanked.</p>

<h2>Our take: the tax is accelerating an inevitable shift</h2>
<p>We wrote in January that the remittance tax would act as an "accelerant for an already-underway shift from cash to digital." Three months of data confirms this — but with caveats that matter for everyday senders.</p>

<p><strong>The good news:</strong> Revenue increased across almost all money-transmitting companies. More transactions, not fewer, are flowing through formal channels. Digital-first providers like <a href="/companies/wise">Wise</a>, <a href="/companies/remitly">Remitly</a>, and <a href="/companies/worldremit">WorldRemit</a> — none of whose customers pay the tax — are seeing accelerated growth. <a href="/companies/remitly">Remitly</a> reported 4.2 million active customers in Q4, up 48% year-over-year.</p>

<p><strong>The bad news:</strong> The people who can least afford additional costs are the ones paying. <a href="https://www.marketplace.org/story/2026/03/26/why-a-1-remittance-tax-could-cost-more-than-it-seems" target="_blank" rel="noopener noreferrer nofollow">Marketplace's analysis</a> highlights that for many cash senders, the issue isn't awareness of digital alternatives — it's access. Unbanked immigrants who rely on cash may not have the bank account or debit card needed to fund a digital transfer. For them, the 1% tax isn't a nudge toward digital; it's simply an additional cost on an essential financial service.</p>

<h2>The numbers in context</h2>
<p>On a $500 transfer, the 1% tax adds $5. That's on top of typical cash transfer fees of $8–$15 and exchange rate markups of 3–5%. Over 18 annual transactions, a frequent cash sender pays roughly <strong>$90 in tax alone</strong> — or $270+ when you include the higher fees and worse rates that cash transfers carry compared to digital.</p>

<p>By contrast, sending the same $500 digitally through <a href="/companies/wise">Wise</a> costs around $5–$7 total with the mid-market exchange rate. Through <a href="/companies/remitly">Remitly</a>, it's often $0 in fees with a small exchange rate markup. No tax. The annual savings from switching to digital: <strong>$500–$1,000+</strong> depending on the corridor.</p>

<h2>Provider-by-provider impact</h2>
<p>Here's how the major providers are handling the tax three months in:</p>
<ul>
<li><strong><a href="/companies/western-union">Western Union</a></strong> — Most exposed. A significant share of WU's US volume still comes from in-person cash transactions at agent locations. The company has added tax disclosures at point of sale but hasn't absorbed the cost. Cash senders pay the 1% on top of existing fees.</li>
<li><strong><a href="/companies/moneygram">MoneyGram</a></strong> — Similar position to WU, though MoneyGram has been pushing its app-based transfers harder. The company <a href="https://www.borderreport.com/hot-topics/trade/1-percent-tax-on-remittances-from-us-takes-effect-in-2026/" target="_blank" rel="noopener noreferrer nofollow">told Border Report</a> it has seen "meaningful migration" from cash to digital since January.</li>
<li><strong><a href="/companies/wise">Wise</a></strong> — Entirely unaffected. Wise is 100% digital with no cash funding option. None of its customers pay the tax. This is increasingly becoming a selling point in Wise's marketing.</li>
<li><strong><a href="/companies/remitly">Remitly</a></strong> — Also unaffected, as all transfers are funded digitally. Remitly published a <a href="https://www.remitly.com/blog/money-transfer/federal-remittance-tax-guide/" target="_blank" rel="noopener noreferrer nofollow">detailed guide</a> explaining why its transfers are exempt — and saw 48% user growth in Q4.</li>
<li><strong><a href="/companies/worldremit">WorldRemit</a></strong> — Digital-only funding, so no tax applies. Cash pickup remains available as a delivery method (which is not taxed — the tax applies to how you <em>fund</em> the transfer, not how the recipient receives it).</li>
</ul>

<h2>Cash vs digital: the annual cost comparison</h2>
<p>For a sender transferring $500 per month (18 times per year):</p>
<ul>
<li><strong>Cash at agent:</strong> $8-15 fee + 3-5% FX markup ($15-25) + 1% tax ($5) = <strong>$28-45 per transfer / $504-810 per year</strong></li>
<li><strong>Digital via Wise:</strong> $5-7 fee + 0.4% FX markup ($2) + $0 tax = <strong>$7-9 per transfer / $126-162 per year</strong></li>
<li><strong>Digital via Remitly:</strong> $0-4 fee + 1-2% FX markup ($5-10) + $0 tax = <strong>$5-14 per transfer / $90-252 per year</strong></li>
</ul>
<p><strong>Annual saving from switching cash to digital: $250–$720</strong>, depending on provider and corridor.</p>

<h2>What this means for you</h2>
<p>If you've already switched to digital transfers, you're on the right side of this trend. If you haven't, here's the case in one sentence: <strong>digital transfers are tax-free, cheaper, faster, and trackable</strong>.</p>

<p>For those who still need cash pickup at the receiving end, providers like <a href="/companies/remitly">Remitly</a> and <a href="/companies/worldremit">WorldRemit</a> offer a hybrid model — you fund digitally (no tax) and your recipient collects cash locally. That's the best of both worlds.</p>

<p>Note: the <a href="https://www.irs.gov/newsroom/treasury-irs-provide-penalty-relief-for-remittance-transfer-providers-who-fail-to-deposit-excise-tax-under-the-one-big-beautiful-bill" target="_blank" rel="noopener noreferrer nofollow">IRS is providing penalty relief</a> for providers through Q3 2026, giving the industry time to update systems. After that, enforcement tightens — another reason cash costs will only increase.</p>

<p>Use our <a href="/send-money">comparison tool</a> to see real-time costs across providers for your specific corridor. For a complete breakdown of which providers charge the tax and how to avoid it, see our <a href="/guides/us-remittance-tax-2026">US remittance tax guide</a>. And for the broader picture of where costs are heading, our <a href="/guides/global-remittance-trends-2026">2026 global remittance trends</a> report covers the full landscape.</p>

<h2>Frequently asked questions</h2>
<h3>How much is the US remittance tax?</h3>
<p>The federal excise tax is 1% of the transfer amount, applied only to cash-funded international remittances. A $500 cash transfer incurs a $5 tax. Digital transfers funded by bank account, debit card, or credit card are exempt.</p>

<h3>How do I avoid the 1% remittance tax?</h3>
<p>Fund your transfer digitally instead of with cash. Use a bank account, debit card, or credit card through any provider's app or website. Providers like <a href="/companies/wise">Wise</a>, <a href="/companies/remitly">Remitly</a>, and <a href="/companies/worldremit">WorldRemit</a> are 100% digital and entirely unaffected by the tax.</p>

<h3>Which money transfer providers charge the remittance tax?</h3>
<p>The tax applies at providers that accept cash funding — primarily <a href="/companies/western-union">Western Union</a> and <a href="/companies/moneygram">MoneyGram</a> agent locations. Digital-only providers like Wise, Remitly, and WorldRemit don't charge it because their transfers are funded electronically.</p>`,
    category: "Industry News",
    publishedAt: "2026-03-27",
    source: "Inter-American Dialogue / Marketplace / Remitly / IRS",
    sourceUrl:
      "https://www.marketplace.org/story/2026/03/26/why-a-1-remittance-tax-could-cost-more-than-it-seems",
    providerSlugs: ["wise", "remitly", "worldremit", "western-union", "moneygram"],
  },
  {
    slug: "april-2026-central-bank-calendar",
    title: "April 2026 Central Bank Calendar: ECB, Fed Minutes, RBA & BoC Rate Decisions",
    excerpt:
      "Four major central bank events in April 2026 could move GBP, EUR, USD, AUD, and CAD exchange rates. Here's when decisions land and how they affect your international transfers.",
    image: "/images/news/central-bank-super-week.jpg",
    imageAlt: "Central bank buildings representing April 2026 rate decisions that will affect international money transfer costs",
    content: `<p>April 2026 brings several central bank decisions that could move the exchange rates on your international transfers. After a busy March (see our <a href="/news/central-bank-super-week-march-2026">guide to how central bank decisions affect your transfers</a>), April continues with the ECB, Fed minutes, RBA, and Bank of Canada all on the calendar.</p>

<h2>April 2026 Central Bank Schedule</h2>
<table>
<thead><tr><th>Date</th><th>Central Bank</th><th>Event</th><th>Currencies Affected</th></tr></thead>
<tbody>
<tr><td><strong>April 2</strong></td><td>Reserve Bank of Australia (RBA)</td><td>Rate decision + statement</td><td>AUD — affects AUD/INR, AUD/PHP, AUD/NZD</td></tr>
<tr><td><strong>April 9</strong></td><td>US Federal Reserve</td><td>March meeting minutes release</td><td>USD — affects all USD pairs</td></tr>
<tr><td><strong>April 16</strong></td><td>Bank of Canada (BoC)</td><td>Rate decision + Monetary Policy Report</td><td>CAD — affects CAD/INR, CAD/PHP, CAD/PKR</td></tr>
<tr class="blog-row-highlight"><td><strong>April 17</strong></td><td>European Central Bank (ECB)</td><td>Rate decision + press conference</td><td>EUR — affects EUR/GBP, EUR/INR, EUR/USD</td></tr>
</tbody>
</table>

<h2>What to watch for each decision</h2>

<h3>RBA (April 2) — AUD Senders</h3>
<p>The RBA cut rates in February 2026 and held in March. Markets are pricing in a ~40% chance of another cut in April. If the RBA cuts, the Australian dollar will likely weaken — meaning Australian senders to India, Philippines, and the UK will get fewer rupees/pesos/pounds per dollar. If you're planning a large AUD transfer, consider sending before April 2.</p>
<p><strong>Corridors to watch:</strong> <a href="/send-money/australia-to-india">AUD to INR</a>, <a href="/send-money/australia-to-philippines">AUD to PHP</a></p>

<h3>Fed Minutes (April 9) — USD Senders</h3>
<p>The Fed held rates at 3.5% in March. The April 9 minutes release will reveal the internal debate — how many members favoured cuts, and what economic conditions they see as triggers. Hawkish minutes (fewer members wanting cuts) would strengthen the dollar; dovish minutes would weaken it.</p>
<p><strong>Corridors to watch:</strong> <a href="/send-money/usa-to-india">USD to INR</a>, <a href="/send-money/usa-to-mexico">USD to MXN</a>, <a href="/send-money/usa-to-philippines">USD to PHP</a></p>

<h3>Bank of Canada (April 16) — CAD Senders</h3>
<p>The BoC has been cutting rates through late 2025 and early 2026. The April meeting comes with the quarterly Monetary Policy Report, which includes updated GDP and inflation forecasts. A pause would strengthen CAD; another cut would weaken it.</p>
<p><strong>Corridors to watch:</strong> <a href="/send-money/canada-to-india">CAD to INR</a>, <a href="/send-money/canada-to-philippines">CAD to PHP</a></p>

<h3>ECB (April 17) — EUR Senders</h3>
<p>The ECB is the most likely to cut rates in April, with markets pricing in a ~65% probability. European inflation has been falling faster than expected. A cut would weaken the euro against GBP and USD — bad for European senders but good for anyone sending <em>to</em> Europe. The press conference language matters as much as the decision itself.</p>
<p><strong>Corridors to watch:</strong> <a href="/send-money/uk-to-europe">GBP to EUR</a>, <a href="/send-money/europe-to-india">EUR to INR</a>, <a href="/exchange-rates/eur-to-usd">EUR to USD rate</a></p>

<h2>How to protect your transfer</h2>
<p>The same strategies apply every time central banks meet:</p>
<ol>
<li><strong>Send before the decision</strong> if you want certainty. Lock in today's rate.</li>
<li><strong>Wait 24–48 hours after</strong> if you can be flexible. Initial volatility settles quickly.</li>
<li><strong>Set a rate alert</strong> with <a href="/companies/wise">Wise</a>, <a href="/companies/xe">Xe</a>, or <a href="/companies/revolut">Revolut</a> at your target rate. If post-decision volatility pushes rates in your favour, you'll be notified instantly.</li>
<li><strong>For large transfers ($5,000+)</strong>, consider <a href="/companies/ofx">OFX</a> forward contracts to lock in rates for up to 12 months.</li>
</ol>
<p>For a deeper explanation of how interest rates move currencies, read our <a href="/news/central-bank-super-week-march-2026">guide to central bank decisions and transfer costs</a>. Understanding <a href="/guides/exchange-rate-markup-explained">how exchange rate markups work</a> helps you spot providers widening spreads during volatile periods. Our <a href="/send-money">comparison tool</a> shows live rates from 35+ providers.</p>`,
    category: "Industry News",
    publishedAt: "2026-03-29",
    source: "ECB / Federal Reserve / Bank of Canada / RBA",
    sourceUrl: "https://www.ecb.europa.eu/press/govcdec/mopo/html/index.en.html",
    providerSlugs: ["wise", "xe", "revolut", "ofx"],
  },
  {
    slug: "world-bank-remittance-costs-q1-2026",
    title: "Global Remittance Costs Drop to 6.0% in Q1 2026 — But Your Corridor May Be Higher",
    excerpt:
      "The World Bank's latest Remittance Prices Worldwide data shows the global average cost of sending $200 fell to 6.0% in early 2026. But costs vary wildly by corridor — from 2% (India) to 15%+ (Sub-Saharan Africa). Here's what it means for senders.",
    image: "/images/news/central-bank-super-week.jpg",
    imageAlt: "A globe illustrating international remittance flows and costs across different corridors",
    content: `<p>The <a href="https://remittanceprices.worldbank.org/" target="_blank" rel="noopener noreferrer">World Bank Remittance Prices Worldwide database</a> — the most comprehensive tracker of international transfer costs — shows the global average cost of sending $200 fell to approximately <strong>6.0% in Q1 2026</strong>, down from 6.2% a year ago. While this represents progress toward the <strong>UN Sustainable Development Goal of under 3% by 2030</strong>, the global average masks enormous corridor-by-corridor differences.</p>

<h2>The cheapest and most expensive corridors</h2>
<table>
<thead><tr><th>Corridor</th><th>Average Cost</th><th>Cheapest Provider</th><th>Compare</th></tr></thead>
<tbody>
<tr class="blog-row-highlight"><td><strong>USA → India</strong></td><td>~2.5%</td><td>Wise (0.5%)</td><td><a href="/send-money/usa-to-india">Live rates →</a></td></tr>
<tr><td><strong>UAE → India</strong></td><td>~2.8%</td><td>Wise / Remitly</td><td><a href="/send-money/uae-to-india">Live rates →</a></td></tr>
<tr><td><strong>USA → Mexico</strong></td><td>~3.5%</td><td>Wise / Remitly</td><td><a href="/send-money/usa-to-mexico">Live rates →</a></td></tr>
<tr><td><strong>UK → Nigeria</strong></td><td>~5.5%</td><td>Wise / LemFi</td><td><a href="/send-money/uk-to-nigeria">Live rates →</a></td></tr>
<tr><td><strong>USA → Philippines</strong></td><td>~4.0%</td><td>Remitly</td><td><a href="/send-money/usa-to-philippines">Live rates →</a></td></tr>
<tr class="blog-row-danger"><td><strong>South Africa → Mozambique</strong></td><td>~15%</td><td>Limited providers</td><td>—</td></tr>
<tr class="blog-row-danger"><td><strong>Sub-Saharan Africa (intra)</strong></td><td>~8–12%</td><td>WorldRemit / Wise</td><td>—</td></tr>
</tbody>
</table>

<h2>Why your corridor cost matters more than the global average</h2>
<p>The "6.0% global average" is misleading because it's weighted by corridor volume. High-volume corridors like USA→India and UAE→India pull the average down (they're under 3%). But if you send money to Sub-Saharan Africa, the Caribbean, or Pacific Islands, you may be paying <strong>2–3x the global average</strong>.</p>
<p>The World Bank identifies three cost drivers:</p>
<ol>
<li><strong>Competition:</strong> Corridors with 10+ providers (India, Mexico, Philippines) have the lowest costs. Corridors with 2–3 providers are most expensive.</li>
<li><strong>Regulation:</strong> De-risking by correspondent banks has reduced access to formal channels in some African and Caribbean corridors, pushing costs up.</li>
<li><strong>Digital adoption:</strong> Corridors where most transfers are digital (app-to-bank, app-to-mobile-wallet) are 30–50% cheaper than those still relying on cash-based in-store services.</li>
</ol>

<h2>How to ensure you're below the average</h2>
<p>The global average of 6.0% means <strong>most people are still overpaying</strong>. Banks and legacy providers are far above the average, while specialist digital providers are far below it. Here's how to stay on the cheap side:</p>
<ul>
<li><strong>Compare before every transfer.</strong> Our <a href="/send-money">comparison tool</a> shows the exact total cost across 35+ providers for your specific corridor and amount.</li>
<li><strong>Use digital providers.</strong> <a href="/companies/wise">Wise</a>, <a href="/companies/remitly">Remitly</a>, and <a href="/companies/worldremit">WorldRemit</a> are consistently below the global average on most corridors.</li>
<li><strong>Avoid bank wires.</strong> The World Bank data confirms banks charge 2–3x more than specialist providers. Our <a href="/guides/exchange-rate-markup-explained">exchange rate markup guide</a> explains why.</li>
<li><strong>Fund digitally.</strong> Since the <a href="/guides/us-remittance-tax-2026">US 1% remittance tax</a> on cash transfers, digital funding is both cheaper AND tax-exempt.</li>
</ul>
<p>For corridor-specific guidance, see our <a href="/guides/send-money-to-india-guide">India</a>, <a href="/guides/send-money-to-pakistan-guide">Pakistan</a>, <a href="/guides/send-money-to-philippines-guide">Philippines</a>, <a href="/guides/send-money-to-nigeria-guide">Nigeria</a>, <a href="/guides/send-money-to-kenya-guide">Kenya</a>, and <a href="/guides/send-money-to-south-africa-guide">South Africa</a> corridor guides. For the full methodology behind the World Bank data, visit the <a href="https://remittanceprices.worldbank.org/methodology" target="_blank" rel="noopener noreferrer">RPW methodology page</a>.</p>`,
    category: "Industry News",
    publishedAt: "2026-03-31",
    source: "World Bank Remittance Prices Worldwide",
    sourceUrl: "https://remittanceprices.worldbank.org/",
    providerSlugs: ["wise", "remitly", "worldremit", "western-union"],
  },
  {
    slug: "liberation-day-tariffs-remittance-impact-2026",
    title: "One Year After Liberation Day: How Trump's Tariffs Changed the Cost of Sending Money Abroad",
    excerpt:
      "The DXY dollar index fell to 99.9, the Indian rupee hit a record low of 88.8, and the Supreme Court struck down IEEPA tariffs. Here's what one year of trade war means for your international transfers.",
    image: "/images/news/central-bank-super-week.jpg",
    imageAlt: "US Dollar bills representing the weakening currency affecting international money transfer costs",
    content: `<p>April 2, 2026, marked exactly one year since "Liberation Day" — when the Trump administration announced sweeping tariffs with country-specific rates up to 50% and a 10% baseline. For anyone sending money internationally, the consequences have been significant and largely negative.</p>

<h2>What happened to the dollar?</h2>
<p>The <strong>DXY dollar index fell to 99.9</strong> on April 7, 2026 — down nearly 3% over 12 months. Most forecasts place the dollar in the low-to-mid 90s by December 2026. Harvard economist Kenneth Rogoff has said historians may look back at Liberation Day as marking "the beginning of the end of the dollar's absolute dominance."</p>
<p>For US-based senders, a weaker dollar means <strong>fewer units of foreign currency for each dollar transferred</strong>. If you sent $1,000 to India a year ago and got ₹84,000, the same amount today might only get you ₹80,000 — a ₹4,000 loss purely from currency depreciation.</p>

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
<tr class="blog-row-highlight"><td><strong>Indian Rupee (INR)</strong></td><td>Record low 88.8 vs USD</td><td>More rupees per dollar — good time to send</td><td><a href="/send-money/usa-to-india">Rates →</a></td></tr>
<tr><td><strong>Pakistani Rupee (PKR)</strong></td><td>Under pressure</td><td>Volatile — use rate alerts</td><td><a href="/send-money/usa-to-pakistan">Rates →</a></td></tr>
<tr><td><strong>South African Rand (ZAR)</strong></td><td>Fell 0.5-1%</td><td>Slightly more ZAR per dollar</td><td><a href="/send-money/usa-to-south-africa">Rates →</a></td></tr>
<tr><td><strong>Thai Baht (THB)</strong></td><td>Fell 0.5-1%</td><td>Better rates for senders to Thailand</td><td>—</td></tr>
<tr><td><strong>Mexican Peso (MXN)</strong></td><td>Resilient</td><td>MXN held up better than most — trade integration</td><td><a href="/send-money/usa-to-mexico">Rates →</a></td></tr>
</tbody>
</table>

<h2>The double hit: weaker dollar + remittance tax</h2>
<p>US-based senders now face two simultaneous cost pressures:</p>
<ol>
<li><strong>The weakening dollar</strong> reduces how much your recipient gets in local currency</li>
<li><strong>The <a href="/guides/us-remittance-tax-2026">1% US remittance tax</a></strong> (effective January 1, 2026) adds an extra cost on cash-funded transfers</li>
</ol>
<p>Together, these make it more important than ever to <strong>compare providers</strong> before every transfer. The difference between the cheapest and most expensive provider can be 3-5% — which now matters even more when the base rate is moving against you.</p>

<h2>What to do now</h2>
<ol>
<li><strong>Set rate alerts.</strong> Use <a href="/companies/wise">Wise</a> or <a href="/companies/xe">Xe</a> to get notified when your target rate hits. In volatile tariff periods, rates can swing 1-2% in a day.</li>
<li><strong>Consider sending sooner rather than later.</strong> If the dollar continues weakening through 2026 as forecasters expect, today's rate may be better than next month's.</li>
<li><strong>For large transfers, use forward contracts.</strong> <a href="/companies/ofx">OFX</a> lets you lock in today's rate for up to 12 months — protecting you from further dollar weakness.</li>
<li><strong>Switch from cash to digital.</strong> Avoid the 1% remittance tax entirely by funding via bank transfer or debit card instead of cash. Read our <a href="/guides/us-remittance-tax-2026">remittance tax guide</a>.</li>
<li><strong>Compare every time.</strong> Our <a href="/send-money">comparison tool</a> shows real-time rates from 35+ providers. In a volatile market, the cheapest provider can change daily.</li>
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
      "Mastercard is acquiring stablecoin infrastructure firm BVNK for $1.8 billion — the largest crypto deal in payments history. It could slash corridor fees from 6-8% to 1-2%. Here's what changes for regular senders.",
    image: "/images/news/central-bank-super-week.jpg",
    imageAlt: "Digital payment network representing Mastercard's stablecoin infrastructure for cheaper international transfers",
    content: `<p>On March 17, 2026, <a href="https://www.mastercard.com/us/en/news-and-trends/press/2026/march/Mastercard-to-acquire-BVNK-to-connect-on-chain-payments-and-fiat-rails.html" target="_blank" rel="noopener noreferrer nofollow">Mastercard announced</a> a definitive agreement to acquire <strong>BVNK</strong> — a UK-based stablecoin infrastructure company — for up to <strong>$1.8 billion</strong> ($1.5B upfront plus $300M contingent on performance). It's the largest stablecoin infrastructure deal in history, surpassing Stripe's $1.1B acquisition of Bridge.</p>
<p>For anyone sending money internationally, this matters. Here's why.</p>

<h2>What are stablecoins and why do they matter for remittances?</h2>
<p>Stablecoins are digital tokens pegged to a real currency (usually USD). Unlike Bitcoin, their value doesn't swing wildly — 1 USDC is always worth approximately $1. The innovation isn't the token itself, but the <strong>payment rails underneath</strong>.</p>
<p>Traditional international transfers pass through 2-4 correspondent banks via SWIFT, each adding fees and time. Stablecoin rails can settle in seconds with minimal intermediary costs. The potential impact:</p>
<table>
<thead><tr><th>Corridor Type</th><th>Current Avg Cost</th><th>Potential Stablecoin Cost</th><th>Savings</th></tr></thead>
<tbody>
<tr class="blog-row-highlight"><td><strong>USA → India</strong></td><td>~2.5%</td><td>~1%</td><td>60% cheaper</td></tr>
<tr><td><strong>USA → Philippines</strong></td><td>~4%</td><td>~1-2%</td><td>50-75% cheaper</td></tr>
<tr class="blog-row-danger"><td><strong>Sub-Saharan Africa</strong></td><td>~8-12%</td><td>~1-2%</td><td>80-90% cheaper</td></tr>
<tr class="blog-row-danger"><td><strong>South Africa → Mozambique</strong></td><td>~15%</td><td>~2-3%</td><td>80% cheaper</td></tr>
</tbody>
</table>

<h2>Why Mastercard paid $1.8 billion</h2>
<p>BVNK operates stablecoin payment infrastructure across <strong>130+ countries</strong>. The acquisition gives Mastercard:</p>
<ul>
<li><strong>Stablecoin-to-fiat conversion rails</strong> — convert USDC to local currency at the point of delivery</li>
<li><strong>Enterprise-grade compliance</strong> — BVNK handles KYC/AML across jurisdictions</li>
<li><strong>Integration with Mastercard Move</strong> — Mastercard's remittance platform that posted 35%+ transaction growth in Q4 2025</li>
</ul>
<p>Mastercard isn't alone. PayPal already offers <strong>zero-fee Xoom transfers funded with PYUSD</strong> (their stablecoin). Visa supports USDC settlement on-chain. Wells Fargo has filed for a WFUSD stablecoin trademark. The <a href="https://www.congress.gov/bill/119th-congress/senate-bill/394" target="_blank" rel="noopener noreferrer nofollow">US GENIUS Act</a> and Europe's MiCA framework are providing regulatory clarity.</p>

<h2>What this means for you (the sender)</h2>
<p>The key thing: <strong>you won't need to understand crypto.</strong> Mastercard will abstract the blockchain layer entirely. From your perspective, you'll send money through a normal app — the stablecoin settlement happens invisibly in the background, resulting in lower fees and faster delivery.</p>
<p>Realistically, consumer-facing products from this acquisition won't launch until <strong>late 2026 or 2027</strong>. But the competitive pressure is already being felt. Providers like <a href="/companies/western-union">Western Union</a> and <a href="/companies/moneygram">MoneyGram</a> will need to match lower fees or lose market share.</p>

<h2>Who benefits most?</h2>
<ul>
<li><strong>Senders to Africa</strong> — Currently paying 8-15% in fees. Stablecoin rails could cut this to 1-2%, saving $40-$75 on every $500 transfer.</li>
<li><strong>Senders to Southeast Asia</strong> — Philippines, Vietnam, Cambodia corridors currently at 3-5% could drop to 1%.</li>
<li><strong>Unbanked recipients</strong> — BVNK's infrastructure supports mobile wallet delivery without requiring a bank account. Could benefit 1.3 billion unbanked adults globally.</li>
</ul>

<h2>What to do now</h2>
<p>Stablecoin-powered transfers are coming but aren't mainstream yet. In the meantime:</p>
<ol>
<li><strong>Use specialist providers today.</strong> <a href="/companies/wise">Wise</a> (0% markup) and <a href="/companies/remitly">Remitly</a> (minutes delivery) already achieve 80-95% of the savings that stablecoins promise — without any crypto complexity.</li>
<li><strong>Watch for PayPal/Xoom PYUSD offers.</strong> <a href="/companies/xoom">Xoom</a> already offers zero transfer fees when funded with PYUSD. If your corridor is supported, this is the closest thing to stablecoin remittances available today.</li>
<li><strong>Compare before every transfer.</strong> Our <a href="/send-money">comparison tool</a> shows real-time costs from 35+ providers. As stablecoin competition heats up, fees are falling across the board.</li>
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
    title: "FedNow Opens to Cross-Border Payments: What It Means for International Transfers",
    excerpt:
      "The Federal Reserve unanimously voted to allow intermediaries on FedNow for international payments — the first time the instant payment system can be used for cross-border transfers. Here's what changes for senders.",
    content: `<h2>What did the Fed propose?</h2>
<p>On <strong>April 8, 2026</strong>, the Federal Reserve Board unanimously voted to propose allowing U.S. banks and credit unions to use intermediaries to transfer funds through the FedNow Service. The proposal was published in the Federal Register on April 10, 2026, with a <strong>60-day comment period</strong> closing approximately June 9, 2026.</p>
<p>Currently, FedNow can only process domestic transfers between two U.S. banks. Under the proposal, either the sending or receiving U.S. bank could act as a correspondent bank for non-U.S. institutions — enabling the domestic leg of a cross-border payment to settle in seconds on FedNow.</p>

<h2>How would cross-border FedNow payments work?</h2>
<p>The proposed model uses a hybrid approach with separate legs:</p>
<ol>
<li><strong>International leg:</strong> Handled by intermediaries (including non-U.S. correspondent banks) outside of FedNow — similar to how SWIFT operates today</li>
<li><strong>Domestic leg:</strong> Settles in <strong>under 10 seconds</strong> on FedNow between eligible U.S. participants, 24/7/365</li>
</ol>
<p>This mirrors how the existing Fedwire Funds Service has operated for decades — FedNow is simply catching up. The key difference: FedNow settles instantly while Fedwire is limited to business hours.</p>

<h2>FedNow vs SWIFT vs Fedwire</h2>
<div class="table-wrapper"><table>
<thead><tr><th>Feature</th><th>FedNow (Proposed)</th><th>SWIFT</th><th>Fedwire</th></tr></thead>
<tbody>
<tr><td><strong>Settlement speed</strong></td><td>Under 10 seconds</td><td>1–5 business days</td><td>Same day (business hours)</td></tr>
<tr><td><strong>Availability</strong></td><td>24/7/365</td><td>Limited hours</td><td>Business hours only</td></tr>
<tr><td><strong>Per-transfer cost</strong></td><td>$0.045</td><td>$15–50+</td><td>$0.50–1.00</td></tr>
<tr><td><strong>Cross-border</strong></td><td>Proposed via intermediaries</td><td>Native</td><td>Via intermediaries</td></tr>
<tr><td><strong>Participants</strong></td><td>1,700+ institutions</td><td>11,000+ institutions</td><td>~5,000 institutions</td></tr>
</tbody></table></div>

<h2>What this means for remittance senders</h2>
<p>If adopted, FedNow cross-border capability could significantly reduce the cost of the <strong>domestic settlement leg</strong> of international transfers. Currently, the average cost of sending a $200 remittance is <strong>6.4%</strong> globally. Much of this cost sits in correspondent banking fees and slow settlement — exactly what FedNow addresses.</p>
<p>For providers like <a href="/companies/wise">Wise</a>, <a href="/companies/remitly">Remitly</a>, and <a href="/companies/western-union">Western Union</a> that already use U.S. bank partners, FedNow integration could mean:</p>
<ul>
<li><strong>Faster funding:</strong> Sender's money reaches the provider's account in seconds rather than hours</li>
<li><strong>Lower processing costs:</strong> $0.045 per transfer vs $0.50–1.00 on Fedwire</li>
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
<p>For the latest rates from providers already offering instant transfers, <a href="/send-money">compare live quotes</a> from 35+ providers.</p>`,
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
<li><strong>Other similar physical instruments</strong> (as determined by the Secretary)</li>
</ul>
<p>On a $1,000 cash transfer, the tax is <strong>$10</strong>.</p>

<h2>Which transfers are exempt?</h2>
<p>The following are <strong>not subject</strong> to the 1% tax:</p>
<ul>
<li>✅ <strong>Bank account transfers</strong> (ACH, wire transfers from checking/savings accounts)</li>
<li>✅ <strong>U.S.-issued debit card</strong> payments</li>
<li>✅ <strong>U.S.-issued credit card</strong> payments</li>
<li>✅ <strong>SWIFT bank-to-bank</strong> transfers</li>
<li>✅ <strong>Digital/online transfers</strong> from any regulated provider</li>
<li>✅ <strong>Cryptocurrency and stablecoin</strong> transfers</li>
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
<p>Key impact projections:</p>
<ul>
<li><strong>Mexico</strong> (largest remittance recipient from the US) projected to lose exceeding <strong>$1.5 billion annually</strong></li>
<li><strong>El Salvador</strong> projected to lose <strong>0.6% of gross national income</strong></li>
<li>Central American countries face the greatest relative impact</li>
</ul>

<h2>What should you do?</h2>
<ol>
<li><strong>Switch from cash to digital:</strong> If you're still paying cash at an agent location, switching to a digital provider eliminates the tax <em>and</em> saves you $20–$80 per $1,000 in fees and exchange rate markup. See our <a href="/send-money">comparison tool</a> for the cheapest digital option.</li>
<li><strong>Fund via bank account or debit card:</strong> ACH-funded transfers through Wise, Remitly, or WorldRemit are tax-exempt and typically cheapest.</li>
<li><strong>Keep receipts:</strong> If you do send cash, the provider must give you a receipt showing the tax amount. You can reclaim taxes if the transfer is canceled or refunded.</li>
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
<tr><td><strong>Fund reconciliation</strong></td><td>No specific frequency required</td><td>Daily reconciliation of safeguarded funds</td></tr>
<tr><td><strong>Audits</strong></td><td>No mandatory safeguarding audits</td><td>Annual reasonable-assurance audits by qualified auditors</td></tr>
<tr><td><strong>Reporting</strong></td><td>Annual reporting only</td><td>Monthly regulatory returns to the FCA</td></tr>
<tr><td><strong>Wind-down planning</strong></td><td>No requirement</td><td>Mandatory resolution pack enabling timely fund recovery</td></tr>
<tr><td><strong>Third-party review</strong></td><td>No specific requirement</td><td>Review all third-party safeguarding arrangements within 3 months</td></tr>
</tbody></table></div>

<h2>Why this matters: the insolvency problem</h2>
<p>Unlike banks, payment firms like Wise and Revolut are <strong>not covered by the Financial Services Compensation Scheme (FSCS)</strong>. If a payment firm fails, your money is not automatically protected up to £85,000 like it would be with a bank.</p>
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
<li><strong>Revolut</strong> (EMI, authorized by FCA — also pursuing UK banking license)</li>
<li><strong>Remitly</strong> (regulated as a payment institution in the UK)</li>
<li><strong>WorldRemit</strong> (EMI, authorized by FCA)</li>
<li><strong>PayPal/Xoom</strong> (Luxembourg-licensed, passported into UK)</li>
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
    title: "EU Instant Payments Now Mandatory: Every Euro Transfer Must Settle in 10 Seconds",
    excerpt:
      "The EU Instant Payments Regulation (EU 2024/886) is now in full force for eurozone banks. Every euro transfer must settle within 10 seconds, 24/7, at no extra charge. Here's what it means for sending money to Europe.",
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
<p>Eurozone banks are now fully compliant. Non-eurozone EU members (Romania, Poland, Sweden, Hungary, Czech Republic, Bulgaria) have until 2027 for euro payments.</p>

<h2>What this means for sending money to Europe</h2>
<p><strong>If you're sending EUR to a eurozone country</strong> (Germany, France, Spain, Italy, Netherlands, Austria, etc.), your transfer should now arrive within 10 seconds via SEPA Instant — at no extra charge over standard SEPA.</p>
<p>Providers like <a href="/companies/wise">Wise</a> and <a href="/companies/revolut">Revolut</a> already route through SEPA Instant when available. The regulation ensures <strong>every eurozone bank</strong> now supports it.</p>
<p><strong>Maximum per transaction:</strong> EUR 100,000. Non-eurozone countries can set a minimum cap of EUR 25,000 during off-hours.</p>

<h2>Non-eurozone EU countries: Romania, Poland, Sweden</h2>
<p>These countries use their own currencies (RON, PLN, SEK) but are SEPA members for euro payments. The regulation only applies to <strong>euro-denominated payments</strong>:</p>
<ul>
<li>Euro transfers to/from Romanian, Polish, or Swedish EUR accounts will be instant by 2027</li>
<li>Local currency transfers (RON, PLN, SEK) continue using national payment systems and are not covered by this regulation</li>
<li>For the cheapest way to send to these countries, see our <a href="/guides/send-money-to-romania-guide">Romania guide</a> and <a href="/guides/send-money-to-poland-guide">Poland guide</a></li>
</ul>

<h2>UK senders: what changes?</h2>
<p>The UK remains in the SEPA geographic scope (grandfathered post-Brexit) but is <strong>not bound by this regulation</strong>. UK banks can choose to adopt SEPA Instant voluntarily, but there is no legal deadline.</p>
<p>However, UK-based providers like Wise and Revolut route transfers through their EU entities, meaning <strong>UK senders to Europe already benefit</strong> from SEPA Instant pricing and speed.</p>
<p>For live rates from the UK to Europe, <a href="/send-money/uk-to-europe">compare GBP to EUR providers</a>.</p>`,
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
      "Wise Nasdaq Listing May 11, 2026: What the Dual-Listing Means for Your Transfers",
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
<p><strong>1. Valuation multiples.</strong> Fintech peers trading on the Nasdaq — including Nubank, SoFi, and PayPal — consistently command higher revenue multiples than UK-listed fintech. For a company growing cross-border volume at 25%+ a year, the re-rating alone could add several billion pounds of market capitalisation.</p>
<p><strong>2. Dollar-denominated capital.</strong> Roughly 45% of Wise's customer base is in the Americas or sends to USD-denominated corridors. A US listing gives the company a deeper pool of dollar capital to fund US bank partnerships, compliance infrastructure, and FedNow / CHIPS integration — the plumbing that makes <a href="/send-money/usa-to-india">USA-to-India</a>, <a href="/send-money/usa-to-mexico">USA-to-Mexico</a>, and <a href="/send-money/usa-to-philippines">USA-to-Philippines</a> transfers settle in minutes rather than days.</p>
<p><strong>3. Competitive pressure from Revolut.</strong> <a href="/companies/revolut">Revolut</a> reported <a href="/news/revolut-africa-14-corridors-airtel-mtn-orange-money-2026">record 2025 revenues of €5.2 billion</a> and a full UK banking licence, and analysts at Citi have cited Revolut's accelerating cross-border expansion as a direct threat to Wise's UK base — which still generates roughly 20–25% of revenue. A Nasdaq platform gives Wise the balance sheet to defend and extend.</p>

<h2>What changes for you as a sender?</h2>
<p>Short answer: <strong>nothing, immediately</strong>. The Wise app, rates, fees, and product surface are unaffected by where the holding company trades its shares.</p>
<p>What changes over 12–24 months is where Wise invests. Three areas to watch:</p>
<ul>
<li><strong>USD rails</strong> — Expect deeper integration with FedNow and US bank-held accounts, which will tighten USD-funded corridor settlement from hours to seconds. See our coverage of <a href="/news/fednow-cross-border-payments-2026">FedNow's cross-border push</a>.</li>
<li><strong>New currencies</strong> — Wise has historically added 4–6 currencies a year. Expect acceleration, particularly in Latin America and Africa where <a href="/send-money/uk-to-nigeria">GBP-to-NGN</a> and <a href="/send-money/uk-to-ghana">GBP-to-GHS</a> routes have high diaspora demand.</li>
<li><strong>Business banking</strong> — Wise Business is the fastest-growing segment. A US listing signals a push to compete directly with <a href="/business/b2b-transfers">B2B platforms</a> such as Airwallex and Payoneer.</li>
</ul>

<h2>Wise vs Revolut: the Nasdaq race</h2>
<p>With Wise on the Nasdaq and Revolut holding a full UK banking licence and reporting $2.3 billion profit on $6 billion revenue in 2025, the duopoly at the top of the retail FX market is tightening. For senders, this is good news — both firms compete almost entirely on price and speed.</p>
<p>If you're deciding between them, our <a href="/compare/wise-vs-revolut">Wise vs Revolut</a> head-to-head compares fees, rates, corridor coverage, and speed for the most common routes. For USD-heavy senders, <a href="/compare/wise-vs-paypal">Wise vs PayPal</a> and <a href="/compare/wise-vs-xoom">Wise vs Xoom</a> are the comparisons that typically matter more.</p>

<h2>Is Wise safe? Regulatory protection holds either way</h2>
<p>A listing switch does not change Wise's regulatory status. Wise remains authorised by the FCA in the UK as an Electronic Money Institution, by FinCEN in the US as a Money Services Business, and by the ASIC, MAS, and RBI equivalents in its other regions. Customer balances are <strong>safeguarded</strong> — held separately from Wise's corporate funds in partner banks and government bonds, not deposited with Wise itself.</p>
<p>The UK's new <a href="/news/fca-safeguarding-rules-money-transfer-2026">FCA safeguarding rules taking effect May 7, 2026</a> strengthen this further: daily reconciliation, annual audits, and formal wind-down plans become mandatory for every FCA-regulated provider — including Wise and Revolut.</p>

<h2>What to watch on and after May 11</h2>
<ol>
<li><strong>May 11, 2026</strong> — Primary listing moves to Nasdaq under ticker WISE. LSE keeps a secondary listing.</li>
<li><strong>Q1 FY27 trading update (July 2026)</strong> — First quarterly disclosure as a Nasdaq-primary company; watch for US volume growth as the headline metric.</li>
<li><strong>Full-year results (November 2026)</strong> — First post-listing earnings; expect a sharpened US corridor roadmap and likely new product announcements.</li>
</ol>

<h2>Frequently asked questions</h2>
<h3>Is Wise safe after the Nasdaq listing in 2026?</h3>
<p>Yes. Wise's safeguarding and regulatory status is unchanged by the listing switch. Customer funds remain ring-fenced from corporate funds under FCA and FinCEN rules. The Nasdaq move is a corporate-governance change, not an operational one. See our full <a href="/companies/wise">Wise review</a> for the latest safety breakdown.</p>

<h3>Will Wise fees or exchange rates change after May 11, 2026?</h3>
<p>No. Wise's pricing is driven by its cost base and competition, not by where its shares are listed. The company's stated long-term objective — pushing the average price of a cross-border transfer below 0.5% — is unchanged.</p>

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
      "Pakistan Remittances Hit Record $41 Billion in 2026: Cheapest Way to Send GBP to PKR",
    excerpt:
      "Pakistan is on track for a record $41 billion remittance year in 2026, up from $38B last year. UK→Pakistan alone hit $532M in February. Here's how the top providers compare on GBP to PKR right now.",
    image: "/images/news/pakistan-record-remittance-2026.svg",
    imageAlt:
      "Editorial chart showing Pakistan's projected $41B remittance year for 2026, with UK-to-Pakistan February inflow of $532M and GBP/PKR at 377",
    content: `<p><strong>TL;DR —</strong> Pakistan is projected to receive a record <strong>$41 billion</strong> in remittances this year, up from $38 billion in 2025, with the UK alone contributing <strong>$532 million in February 2026</strong>. On <a href="/send-money/uk-to-pakistan">GBP to PKR</a>, rate differences between providers can move <strong>5,000–15,000 rupees on a £1,000 transfer</strong> — enough to justify comparing every time. Below: the data, the corridors driving the record, and the cheapest providers as of April 20, 2026.</p>

<h2>Why 2026 is a record year</h2>
<p>The surge has three underlying drivers, none of which look temporary:</p>
<ol>
<li><strong>A wider legal–parallel rate gap has narrowed.</strong> After the State Bank of Pakistan's 2023–24 exchange-rate reforms, formal channels now clear closer to market — meaning diaspora senders who previously used informal hawala routes are migrating back to regulated providers.</li>
<li><strong>Mobile wallet adoption.</strong> JazzCash and Easypaisa together cover over 100 million registered accounts. Minute-level delivery from the UK, US, and Gulf is now the norm, not the exception.</li>
<li><strong>Gulf demand is steady, Western demand is rising.</strong> Saudi Arabia and the UAE remain the largest sending markets, but <strong>UK remittances are up notably year-on-year</strong> despite a 7% February dip ($532M vs $575M in January) driven largely by base effects.</li>
</ol>

<h2>Top remittance sources into Pakistan (SBP data)</h2>
<div class="table-wrapper"><table>
<thead><tr><th>Source country</th><th>Feb 2026 inflow</th><th>Typical fastest rail</th></tr></thead>
<tbody>
<tr><td><strong>Saudi Arabia</strong></td><td>~$800M</td><td>SAR → PKR via specialist providers</td></tr>
<tr><td><strong>United Arab Emirates</strong></td><td>~$700M</td><td>AED → PKR wallet delivery in minutes</td></tr>
<tr><td><strong>United Kingdom</strong></td><td>$532M</td><td>GBP → PKR Faster Payments + wallet</td></tr>
<tr><td><strong>United States</strong></td><td>~$330M</td><td><a href="/guides/us-remittance-tax-2026">Digital (tax-exempt)</a> to bank or wallet</td></tr>
<tr><td><strong>EU (combined)</strong></td><td>~$280M</td><td>SEPA → PKR via Wise, Remitly, ACE</td></tr>
</tbody>
</table></div>

<h2>UK to Pakistan: who's cheapest right now?</h2>
<p>The GBP to PKR corridor is one of the most price-competitive in the world because diaspora demand is high and every specialist provider operates here. For a typical <strong>£1,000 transfer</strong> on April 20, 2026, the live rate landscape is:</p>
<ul>
<li><strong><a href="/companies/ace-money-transfer">ACE Money Transfer</a></strong> — Strong Pakistani banking partnerships, frequent zero-fee promos for new customers. Consistently among the top 2 for PKR delivered.</li>
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
<p>The pound has been trading in the <strong>£1 = 369–395 PKR</strong> band through April 2026, with April forecasts pointing to a month-end rate near <strong>385</strong>. On £1,000, a 2% rate swing is worth ~7,700 rupees — meaningful for any regular sender. Rate alerts from <a href="/companies/wise">Wise</a> or <a href="/companies/xe">Xe</a> let you lock in when the rate hits your target.</p>
<p>For the broader macro picture, our <a href="/news/april-2026-central-bank-calendar">April 2026 central bank calendar</a> lists every rate decision likely to move GBP in the coming weeks. And for a historical view, the <a href="/exchange-rates/history">exchange rate history tool</a> shows how GBP/PKR has moved over the past year.</p>

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

<h2>Frequently asked questions</h2>
<h3>What is the cheapest way to send money from the UK to Pakistan in 2026?</h3>
<p>As of April 2026, ACE Money Transfer, Wise, and Remitly consistently deliver the most rupees per pound on the GBP to PKR corridor. Differences of 5,000–15,000 PKR per £1,000 are common between the best and worst providers on any given day — compare before every transfer at our <a href="/send-money/uk-to-pakistan">UK to Pakistan comparison page</a>.</p>

<h3>How much did Pakistan receive in remittances in February 2026?</h3>
<p>Pakistan received <strong>$3.3 billion in remittances in February 2026</strong>, with the UK contributing $532 million (down 7% from January's $575M). Full-year inflows are projected to reach a record $41 billion, up from $38B in 2025.</p>

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
  // ========================================
  // INR weakest in a year — decision framework
  // ========================================
  {
    slug: "inr-weakest-year-send-money-india-april-2026",
    title:
      "INR at 92.98/USD (April 2026): Should You Send Money to India Now or Wait?",
    excerpt:
      "The rupee is 9.18% weaker than a year ago at ₹92.98/USD, with the RBI actively intervening in FX markets. Here's a decision framework for when to send USD/INR and GBP/INR transfers — and how much timing really matters.",
    image: "/images/news/inr-weakest-usd-april-2026.svg",
    imageAlt:
      "Editorial card showing the Indian rupee at 92.98 per USD on April 20, 2026, down 9.18% year-on-year, with a downward trend line and GBP/INR at 126.04",
    content: `<p><strong>TL;DR —</strong> The Indian rupee is trading at <strong>₹92.98 per USD</strong> on April 20, 2026 — its weakest level in a year and <strong>down 9.18% year-on-year</strong>. GBP/INR sits near <strong>126</strong>. The Reserve Bank of India (RBI) is actively intervening to cap volatility, and Western senders are arguably in the strongest position of 2026 so far. Below: whether to send now or wait, how big the provider spread is, and why "waiting for a better rate" usually costs more than it saves.</p>

<h2>Where the rate is today</h2>
<div class="table-wrapper"><table>
<thead><tr><th>Pair</th><th>Rate (Apr 20, 2026)</th><th>1-month range</th><th>12-month change</th></tr></thead>
<tbody>
<tr><td><strong>USD / INR</strong></td><td>92.98</td><td>92.41 – 94.62</td><td>INR down 9.18%</td></tr>
<tr><td><strong>GBP / INR</strong></td><td>126.04</td><td>123.60 – 130.24</td><td>GBP up ~8%</td></tr>
<tr><td><strong>EUR / INR</strong></td><td>~101</td><td>~99 – 103</td><td>EUR up ~6%</td></tr>
</tbody>
</table></div>
<p>In plain English: <strong>if you're sending USD, GBP, or EUR to India, your recipient is getting substantially more rupees than they would have a year ago</strong>. On a $1,000 transfer, that's roughly ₹7,800 more than April 2025 — enough to cover a month of groceries for a middle-class Indian household.</p>

<h2>What's driving the weakness</h2>
<p>Three forces are pushing the rupee down, each with different longevity:</p>
<ul>
<li><strong>Dollar strength</strong> — The Fed's <a href="/news/fed-holds-rates-march-2026-one-cut-dot-plot">hold at 3.5% with one cut projected for 2026</a> keeps real US yields elevated. Every emerging-market currency has felt this.</li>
<li><strong>Oil imports</strong> — India imports ~85% of its crude. Every spike in Brent tightens INR further as state oil companies buy dollars. The RBI is now routing state-run oil importer demand through a <strong>special credit facility</strong> to reduce open-market pressure — a sign the weakness was getting structural.</li>
<li><strong>Offshore hedging pressure</strong> — The RBI has tightened FX position limits for banks and restricted offshore-linked hedging activity. This has helped: foreign investors turned net buyers of Indian equities (~₹3.8 billion inflow) in April, and the rupee has stabilised from its 94.62 low on April 13 to 92.98 today.</li>
</ul>
<p>For the underlying macro calendar, see our <a href="/news/april-2026-central-bank-calendar">April 2026 central bank calendar</a> (Fed minutes April 9, ECB April 17 — both already priced in).</p>

<h2>Send now or wait? The decision framework</h2>
<p>There's a simple way to think about this. Your total transfer cost is:</p>
<blockquote>
<p><strong>Provider fee + provider FX markup + (timing risk × transfer size)</strong></p>
</blockquote>
<p>Fees and markup are knowable today. Timing risk is what you're guessing at.</p>

<h3>Rule 1 — Pick the provider first, the timing second</h3>
<p>The gap between the cheapest and most expensive provider on USD/INR is typically <strong>0.5% to 3%</strong> of your transfer amount. The gap between today's rate and next week's rate is typically <strong>0.3% to 1%</strong>. Switching from your bank to <a href="/companies/wise">Wise</a>, <a href="/companies/remitly">Remitly</a>, or <a href="/companies/instarem">Instarem</a> saves you more on almost any given day than waiting would.</p>
<p>See <a href="/send-money/usa-to-india">USA to India live rates</a> or <a href="/send-money/uk-to-india">UK to India live rates</a> for the provider-by-provider picture right now.</p>

<h3>Rule 2 — If you <em>must</em> time it, watch the RBI</h3>
<p>The RBI is clearly targeting stability, not direction. That means:</p>
<ul>
<li><strong>Spikes above 94</strong> have been met with intervention → likely to retrace toward 92–93 within days.</li>
<li><strong>Dips below 92</strong> are possible but short-lived — the RBI's defensive posture is against weakness, not strength.</li>
<li>Big-event days (Fed meetings, RBI meetings, Budget announcements) see wider intraday ranges — <strong>avoid transferring during the announcement, send 24–48 hours after</strong>.</li>
</ul>

<h3>Rule 3 — Use rate alerts instead of checking manually</h3>
<p>Every major provider now offers rate alerts. Set a target that's 0.5–1% above today's rate, and you'll either hit it or learn that you overestimated the upside. <a href="/companies/wise">Wise</a>, <a href="/companies/xe">Xe</a>, and <a href="/companies/revolut">Revolut</a> all have free alert features; <a href="/currency-converter">our currency converter</a> also shows the 30-day historical range so you can calibrate your target.</p>

<h2>How much does a 1% rate move actually matter?</h2>
<p>Put numbers on it. On a <strong>$5,000 transfer</strong> via Wise:</p>
<div class="table-wrapper"><table>
<thead><tr><th>Scenario</th><th>USD/INR rate</th><th>INR delivered</th><th>Difference</th></tr></thead>
<tbody>
<tr><td>Today (Apr 20)</td><td>92.98</td><td>₹464,900</td><td>—</td></tr>
<tr><td>+1% rupee weakening</td><td>93.91</td><td>₹469,550</td><td>+₹4,650</td></tr>
<tr><td>+1% rupee strengthening</td><td>92.05</td><td>₹460,250</td><td>−₹4,650</td></tr>
</tbody>
</table></div>
<p>₹4,650 is meaningful, but it's also smaller than the typical <strong>₹8,000–15,000 gap</strong> between the cheapest and most expensive provider on the same day. Provider choice > timing.</p>

<h2>When timing really does matter — large transfers</h2>
<p>If you're sending <strong>more than £25,000 / $30,000</strong> — a down payment, NRI remittance, property purchase, or business payment — the calculus flips. A 1% rate move is $300+, and specialist FX brokers with forward contracts start to beat app-based providers.</p>
<p>For transfers that size, see our guides on <a href="/business/b2b-transfers">B2B international payments</a> and <a href="/companies/ofx">OFX</a> / <a href="/companies/currencies-direct">Currencies Direct</a> — both offer <strong>forward contracts</strong> that let you lock today's rate for up to 12 months.</p>

<h2>Live rates and tools</h2>
<ul>
<li><a href="/exchange-rates/usd-to-inr">USD to INR — live rate + history</a></li>
<li><a href="/exchange-rates/gbp-to-inr">GBP to INR — live rate + history</a></li>
<li><a href="/send-money/usa-to-india">USA → India provider comparison</a></li>
<li><a href="/send-money/uk-to-india">UK → India provider comparison</a></li>
<li><a href="/send-money/send-money-to-india">All corridors into India</a></li>
<li><a href="/guides/send-money-to-india-guide">Complete India guide</a> — UPI, IMPS, NEFT, banks, KYC</li>
<li><a href="/iban/india">India IBAN / IFSC lookup</a></li>
</ul>

<h2>Frequently asked questions</h2>
<h3>Why is the Indian rupee so weak in April 2026?</h3>
<p>Three forces: sustained US dollar strength after the Fed's March hold, persistent oil import demand, and offshore hedging pressure. The RBI is intervening to stabilise — not reverse — the move, which is why the rate has stayed in a 92.4–94.6 range through the month.</p>

<h3>Should I send money to India now or wait for a better rate?</h3>
<p>For most senders, now is fine. Provider choice saves more than timing: the cheapest USD/INR provider typically delivers 1–3% more rupees than the most expensive on the same day, versus a 0.3–1% typical weekly rate swing. If you're sending over $30,000, consider a forward contract via <a href="/companies/ofx">OFX</a> or <a href="/companies/currencies-direct">Currencies Direct</a>.</p>

<h3>What's the best app to send USD to INR in 2026?</h3>
<p>On the <a href="/send-money/usa-to-india">USA→India corridor</a>, Wise, Remitly, and Instarem consistently lead on total INR delivered. Wise uses the mid-market rate with a fee of ~0.4–0.6%. Remitly's Economy tier is often the cheapest; Express is fastest. Instarem offers competitive rates with zero fees for first transfers.</p>

<h3>How much has the rupee fallen against the dollar in the past year?</h3>
<p>INR is <strong>down 9.18%</strong> against USD in the 12 months to April 20, 2026, trading at ₹92.98 versus roughly ₹85 a year ago. For a $1,000 transfer, that's ~₹7,800 more rupees delivered than last April.</p>

<p>For broader context on how currency moves interact with fees, see our guide on <a href="/guides/exchange-rate-markup-explained">exchange rate markups</a>. For the global picture, the <a href="/guides/global-remittance-trends-2026">2026 global remittance trends report</a> has the long-term data.</p>`,
    category: "Industry News",
    publishedAt: "2026-04-20",
    source: "Trading Economics / Reserve Bank of India / Reuters",
    sourceUrl: "https://tradingeconomics.com/india/currency",
    providerSlugs: ["wise", "remitly", "instarem", "xe", "ofx"],
  },
  // ========================================
  // Revolut Africa 14 corridors — April 2026
  // ========================================
  {
    slug: "revolut-africa-14-corridors-airtel-mtn-orange-money-2026",
    title:
      "Revolut Adds 14 Africa Corridors (April 2026): Airtel Money, MTN, Orange Money Integration",
    excerpt:
      "Revolut expanded international transfers with 14 new payment corridors across 9 African countries, plugging into Airtel Money, MTN, and Orange Money. Here's what it means for UK→Africa senders and how it compares to Wise and WorldRemit.",
    image: "/images/news/revolut-africa-corridors.svg",
    imageAlt:
      "Editorial card showing Revolut's 14 new African corridors across 9 countries, with MTN Mobile Money, Airtel Money, and Orange Money integration pills and Revolut's €5.2B 2025 revenue",
    content: `<p><strong>TL;DR —</strong> <a href="/companies/revolut">Revolut</a> has gone live with <strong>14 new international transfer corridors into 9 African countries</strong>, plugging its Money product directly into <strong>Airtel Money, MTN Mobile Money, and Orange Money</strong>. For UK, EU, and US senders, this is the most material expansion of app-based remittance access to Africa since WorldRemit did the same in 2019. Below: the full corridor list, how Revolut compares to <a href="/companies/wise">Wise</a> and <a href="/companies/worldremit">WorldRemit</a>, and whether this moves the needle for your next <a href="/send-money/uk-to-nigeria">UK→Nigeria</a>, <a href="/send-money/uk-to-kenya">UK→Kenya</a>, or <a href="/send-money/uk-to-ghana">UK→Ghana</a> transfer.</p>

<h2>Which countries and wallets are live</h2>
<div class="table-wrapper"><table>
<thead><tr><th>Country</th><th>Mobile money services supported</th><th>Typical delivery</th></tr></thead>
<tbody>
<tr><td>Nigeria</td><td>MTN MoMo, Airtel Money</td><td>Minutes</td></tr>
<tr><td>Kenya</td><td>Airtel Money (M-PESA via bank only)</td><td>Minutes</td></tr>
<tr><td>Ghana</td><td>MTN MoMo, Airtel Money</td><td>Minutes</td></tr>
<tr><td>Uganda</td><td>MTN MoMo, Airtel Money</td><td>Minutes</td></tr>
<tr><td>Tanzania</td><td>Airtel Money, MTN MoMo</td><td>Minutes</td></tr>
<tr><td>Rwanda</td><td>MTN MoMo, Airtel Money</td><td>Minutes</td></tr>
<tr><td>DRC</td><td>Airtel Money, Orange Money</td><td>Minutes</td></tr>
<tr><td>Cameroon</td><td>Orange Money, MTN MoMo</td><td>Minutes</td></tr>
<tr><td>Senegal</td><td>Orange Money</td><td>Minutes</td></tr>
</tbody>
</table></div>
<p>Under the hood, Revolut is routing these through <a href="/news/absa-thunes-global-pay-africa-remittances">Thunes and Absa's Global Pay network</a> — the same rails <a href="/news/mastercard-bvnk-stablecoin-remittance-2026">Mastercard and BVNK are using for stablecoin-settled cross-border payments</a>. The infrastructure story across African remittances in 2026 is effectively one story: legacy correspondent banking replaced by API-addressable wallet networks.</p>

<h2>How Revolut compares on UK→Africa right now</h2>
<p>For a typical <strong>£500 transfer</strong> on the <a href="/send-money/uk-to-nigeria">GBP→NGN</a> corridor (April 20, 2026):</p>
<div class="table-wrapper"><table>
<thead><tr><th>Provider</th><th>Typical fee</th><th>FX markup</th><th>Delivery</th></tr></thead>
<tbody>
<tr><td><a href="/companies/lemfi">Lemfi</a></td><td>£0</td><td>~1.5%</td><td>Minutes (wallet)</td></tr>
<tr><td><a href="/companies/revolut">Revolut</a> (new)</td><td>£0 (Plus/Premium tiers)</td><td>~1.8–2.5%</td><td>Minutes (wallet)</td></tr>
<tr><td><a href="/companies/wise">Wise</a></td><td>£1–£3</td><td>~0.5%</td><td>1–2 business days (bank)</td></tr>
<tr><td><a href="/companies/worldremit">WorldRemit</a></td><td>£1–£4</td><td>~2–3%</td><td>Minutes (wallet)</td></tr>
<tr><td>UK high-street bank</td><td>£15–£30</td><td>~4–6%</td><td>1–3 business days</td></tr>
</tbody>
</table></div>
<p>For Nigeria specifically, <a href="/companies/lemfi">Lemfi</a> remains the sharpest rate in the diaspora community. Revolut's advantage is that senders who already hold GBP/EUR/USD in a Revolut account can now transfer instantly without opening a new service — a friction saving, not necessarily a cost saving.</p>

<h2>Why this matters beyond Revolut</h2>
<p>Three implications worth tracking:</p>
<ol>
<li><strong>Price pressure on Wise.</strong> Wise has historically been slower to add African corridors, relying on bank-rail delivery. A credible mobile-money competitor inside the Revolut app — already used by 45M+ European customers — changes the <a href="/compare/wise-vs-revolut">Wise vs Revolut</a> calculus on Africa routes specifically.</li>
<li><strong>M-PESA remains the white space.</strong> Revolut's Kenya corridor supports Airtel Money but routes M-PESA via bank, which adds a step. Whoever cracks direct M-PESA API access (Safaricom partnerships are scarce) wins East Africa's largest wallet base.</li>
<li><strong>Africa corridor competition is accelerating.</strong> In 12 months, <a href="/news/paypal-venmo-goes-global-remittances-2026">PayPal/Venmo launched cross-border</a>, <a href="/news/gcash-free-middle-east-transfers-philippines-ofw-2026">GCash went free for Middle East corridors</a>, and <a href="/news/absa-thunes-global-pay-africa-remittances">Absa/Thunes unified pan-African mobile money rails</a>. Expect prices on <a href="/send-money/uk-to-nigeria">UK→Nigeria</a>, <a href="/send-money/uk-to-ghana">UK→Ghana</a>, and <a href="/send-money/uk-to-kenya">UK→Kenya</a> to keep compressing.</li>
</ol>

<h2>Which corridor guide to read next</h2>
<ul>
<li><a href="/send-money/uk-to-nigeria">UK → Nigeria (GBP/NGN)</a> — highest-volume UK-to-Africa corridor</li>
<li><a href="/send-money/uk-to-kenya">UK → Kenya (GBP/KES)</a> — M-PESA and Airtel Money delivery</li>
<li><a href="/send-money/uk-to-ghana">UK → Ghana (GBP/GHS)</a> — MTN MoMo dominant</li>
<li><a href="/send-money/send-money-to-nigeria">All corridors → Nigeria</a></li>
<li><a href="/guides/send-money-to-nigeria-guide">Complete Nigeria guide</a> — banks, wallets, CBN rules</li>
<li><a href="/companies/revolut">Full Revolut review</a> — fees, tiers, transfer limits</li>
<li><a href="/compare/wise-vs-revolut">Wise vs Revolut head-to-head</a></li>
</ul>

<h2>Frequently asked questions</h2>
<h3>Can I send money from the UK to Nigeria via Revolut in 2026?</h3>
<p>Yes. As of April 2026, Revolut supports direct transfers from GBP balances to MTN MoMo and Airtel Money wallets in Nigeria, delivered in minutes. Compare live rates on our <a href="/send-money/uk-to-nigeria">UK to Nigeria comparison page</a> — Lemfi and Wise remain cost-competitive on this route.</p>

<h3>Does Revolut support M-PESA transfers to Kenya?</h3>
<p>Indirectly. Revolut's Kenya corridor routes to Airtel Money directly, but M-PESA transfers currently go via the recipient's linked bank account rather than the wallet API. For direct M-PESA delivery, <a href="/companies/worldremit">WorldRemit</a> and <a href="/companies/sendwave">Sendwave</a> remain the faster options.</p>

<h3>Is Revolut cheaper than Wise for Africa transfers?</h3>
<p>It depends on the corridor. Revolut Plus/Premium tier subscribers get fee-free transfers up to a monthly limit but pay a 1.8–2.5% FX markup on exotic currencies. Wise charges a small fee (~£1–£3) but uses a 0.5% mid-market markup — cheaper on larger transfers. Delivery speed favours Revolut (wallet, minutes) over Wise (bank, days) on Africa routes.</p>

<h3>Are transfers from the UK to Africa regulated and safe?</h3>
<p>Yes. Revolut holds a full UK banking licence as of 2025, and Wise/WorldRemit/Lemfi are all FCA-authorised as Electronic Money Institutions. Customer funds are safeguarded under the FCA's new rules coming into force on <a href="/news/fca-safeguarding-rules-money-transfer-2026">May 7, 2026</a>.</p>

<p>For the macro picture on African remittance infrastructure, see our deep-dive on <a href="/news/absa-thunes-global-pay-africa-remittances">Absa–Thunes Global Pay</a> and the <a href="/guides/global-remittance-trends-2026">2026 global remittance trends report</a>.</p>`,
    category: "Provider Update",
    publishedAt: "2026-04-20",
    source: "Revolut press release / Euronews / FXC Intelligence",
    sourceUrl:
      "https://www.euronews.com/business/2026/03/24/revolut-reported-record-financial-results-with-revenue-rising-by-46-to-52bn-in-2025",
    providerSlugs: ["revolut", "wise", "worldremit", "lemfi"],
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
