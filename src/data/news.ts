export interface NewsItem {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML
  category: "Industry News" | "Provider Update" | "Announcement" | "Regulatory";
  publishedAt: string;
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
      "Central Bank Super-Week: Fed, BoE, and BoJ Rate Decisions Could Swing Your Transfer Rates",
    excerpt:
      "Three of the world's most powerful central banks announce interest rate decisions within 48 hours this week. Here's what it means for exchange rates and the cost of sending money abroad.",
    image: "/images/news/central-bank-super-week.jpg",
    imageAlt:
      "The Federal Reserve building in Washington D.C., one of three central banks announcing rate decisions this week",
    content: `<p>This week is one of the most consequential in the 2026 currency calendar. Between March 18 and 19, the <strong>US Federal Reserve</strong>, <strong>Bank of England</strong>, and <strong>Bank of Japan</strong> all announce interest rate decisions — a convergence that forex markets call a "super-week." For anyone planning an international money transfer, the timing matters.</p>

<h2>What's expected — and what could surprise</h2>
<p>The <strong>Federal Reserve</strong> (March 18) is widely expected to hold rates steady. The real focus is the updated "dot plot" — the Fed's projection of future rate cuts. A shift from one projected cut in 2026 to zero would strengthen the dollar, meaning your recipient gets fewer euros, pounds, or rupees per dollar sent. A shift to two projected cuts would weaken the dollar and improve rates for US senders.</p>

<p>The <strong>Bank of England</strong> (March 19) is also expected to hold. UK inflation has proven sticky, and higher energy prices have complicated the case for easing. Sterling has been relatively strong in 2026, with GBP/USD trading around 1.32 — good news for British senders, but a hold decision that signals delayed cuts could push the pound even higher.</p>

<p>The <strong>Bank of Japan</strong> (March 19) is the wildcard. The BoJ has been gradually normalising policy after decades of ultra-loose monetary settings. Any hint of further rate hikes could strengthen the yen sharply, affecting corridors like USD/JPY and GBP/JPY. Japan-bound transfers could suddenly become more expensive if the yen rallies.</p>

<h2>How rate decisions move your transfer costs</h2>
<p>Interest rate changes affect exchange rates because money flows toward higher-yielding currencies. When the Fed cuts rates, the dollar typically weakens — great if you're sending dollars abroad (your recipient gets more), but bad if you're sending money <em>to</em> the US.</p>

<p>The effect isn't always immediate, either. Markets price in expectations ahead of time, so a "surprise hold" or an unexpected change in guidance can move currencies more than the actual rate decision. On past super-weeks, major pairs have moved 1–2% within hours of announcements — that's a £100–£200 difference on a £10,000 transfer.</p>

<h2>What to do this week</h2>
<p>If you have a transfer planned for this week, you have three options:</p>
<ul>
<li><strong>Send before Tuesday</strong> — Lock in today's rates and avoid the uncertainty entirely. Current rates are relatively favourable for GBP and EUR senders.</li>
<li><strong>Wait until Thursday</strong> — By then, all three decisions will be public and the initial volatility will have settled. You'll know whether rates have moved in your favour.</li>
<li><strong>Set a rate alert</strong> — Use a multi-currency account with <a href="/companies/wise">Wise</a>, <a href="/companies/xe">Xe</a>, or <a href="/companies/revolut">Revolut</a> to set an alert at your target rate. If the post-announcement volatility pushes rates in your direction, you'll be notified instantly and can convert on the spot.</li>
</ul>

<p>Understanding <a href="/guides/exchange-rate-markup-explained">how exchange rate markups work</a> is especially important during volatile weeks like this — providers absorb or pass on currency swings very differently. If you hold multiple currencies, our guide on <a href="/guides/multi-currency-accounts-exchange-rates">multi-currency accounts and exchange rates</a> explains which products give you the most flexibility. Whichever approach you choose, compare rates from multiple providers before committing — our guide to the <a href="/guides/cheapest-way-to-send-money-internationally">cheapest ways to send money internationally</a> explains exactly what to look for. Our <a href="/send-money">comparison tool</a> shows live rates and fees, so you can see exactly how much your recipient will receive — before and after the central banks have their say.</p>`,
    category: "Industry News",
    publishedAt: "2026-03-15",
    source: "Reuters / Bank of England / Federal Reserve",
    sourceUrl: "https://www.bankofengland.co.uk/monetary-policy-summary-and-minutes",
    providerSlugs: ["wise", "xe", "revolut"],
  },
  {
    slug: "us-remittance-excise-tax-takes-effect-2026",
    title: "New 1% US Remittance Tax Shakes Up the Money Transfer Industry",
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
    title: "Revolut Bets Big on America with National Bank Charter Filing",
    excerpt:
      "The London-based fintech giant has filed for a US national bank charter and pledged $500 million in domestic investment, signalling its most aggressive push into American finance yet.",
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
    title: "Western Union's CEO Concedes Ground to Digital Rivals — But Questions Their Staying Power",
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
    title: "EU Mandates Instant Euro Transfers Around the Clock — What Changes for Senders",
    excerpt:
      "New European regulations require all payment providers to process euro transfers in under 10 seconds, 24/7, with mandatory payee verification to combat fraud.",
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
