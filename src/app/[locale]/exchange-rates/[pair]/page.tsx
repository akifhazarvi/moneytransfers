import { seoDescription } from "@/lib/seo-title";
import { providersComparedPhrase } from "@/lib/provider-counts";
import { robotsFor } from "@/lib/seo-indexing";
import Breadcrumb from "@/components/Breadcrumb";
import type { Metadata } from "next";
import InlineProviderQuotes from "@/components/InlineProviderQuotes";
import Link from "@/components/EligibleLink";
import { notFound } from "next/navigation";
import { fetchExchangeRates } from "@/lib/exchange-rates";

// Revalidate every 6 hours — matches scraper cadence
export const revalidate = 21600;
import { providers, getProviderName } from "@/data/providers";
import { generateQuotes } from "@/lib/quotes-engine";
import { KEPT_RATE_PAIR_SLUGS } from "@/lib/gone-rate-pairs";
import CircleFlag from "@/components/CircleFlag";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import { setRequestLocale } from "next-intl/server";
import { getRateInsight, corridorToSlug } from "@/lib/rate-history";
import { newsItems } from "@/data/news";
import { formatLocalDate } from "@/lib/format-date";
import { corridorPageRenders } from "@/lib/route-map";
import { compareHashHref } from "@/lib/link-eligibility";
import { firstTableAmount } from "@/lib/table-amounts";
import { rateHistoryHref } from "@/lib/route-map-rates";
import { COVERAGE, SITE_STATS, atLeast } from "@/lib/site-stats";

// Pair slug → most relevant news article for context-sensitive callouts
const pairRelatedNews: Record<string, string> = {
  "gbp-to-pkr": "pakistan-record-41-billion-remittance-2026",
  "usd-to-pkr": "pakistan-record-41-billion-remittance-2026",
  // The digital-yuan analysis names no provider, so it never reached a company
  // page, and every other rail that could carry it is labelled "latest". This
  // callout makes no recency claim, and CBDC settlement is squarely about what
  // a USD->CNY transfer costs.
  "usd-to-cny": "china-digital-yuan-interest-bearing-cbdc",
};

/* ── Corridor pair config ─────────────────────────────────── */
interface CurrencyPair {
  slug: string;        // e.g. "usd-to-inr"
  from: string;        // e.g. "USD"
  to: string;          // e.g. "INR"
  fromName: string;
  toName: string;
  fromCountry: string; // for flag
  toCountry: string;
  corridor?: string;   // link to /send-money corridor
}

const CURRENCY_PAIRS: CurrencyPair[] = [
  { slug: "usd-to-inr", from: "USD", to: "INR", fromName: "US Dollar", toName: "Indian Rupee", fromCountry: "US", toCountry: "IN", corridor: "usa-to-india" },
  { slug: "usd-to-pkr", from: "USD", to: "PKR", fromName: "US Dollar", toName: "Pakistani Rupee", fromCountry: "US", toCountry: "PK", corridor: "usa-to-pakistan" },
  { slug: "usd-to-php", from: "USD", to: "PHP", fromName: "US Dollar", toName: "Philippine Peso", fromCountry: "US", toCountry: "PH", corridor: "usa-to-philippines" },
  { slug: "usd-to-mxn", from: "USD", to: "MXN", fromName: "US Dollar", toName: "Mexican Peso", fromCountry: "US", toCountry: "MX", corridor: "usa-to-mexico" },
  { slug: "usd-to-ngn", from: "USD", to: "NGN", fromName: "US Dollar", toName: "Nigerian Naira", fromCountry: "US", toCountry: "NG", corridor: "usa-to-nigeria" },
  { slug: "gbp-to-eur", from: "GBP", to: "EUR", fromName: "British Pound", toName: "Euro", fromCountry: "GB", toCountry: "EU", corridor: "uk-to-europe" },
  { slug: "gbp-to-inr", from: "GBP", to: "INR", fromName: "British Pound", toName: "Indian Rupee", fromCountry: "GB", toCountry: "IN", corridor: "uk-to-india" },
  { slug: "gbp-to-usd", from: "GBP", to: "USD", fromName: "British Pound", toName: "US Dollar", fromCountry: "GB", toCountry: "US" },
  { slug: "gbp-to-pkr", from: "GBP", to: "PKR", fromName: "British Pound", toName: "Pakistani Rupee", fromCountry: "GB", toCountry: "PK", corridor: "uk-to-pakistan" },
  { slug: "eur-to-usd", from: "EUR", to: "USD", fromName: "Euro", toName: "US Dollar", fromCountry: "EU", toCountry: "US" },
  { slug: "eur-to-gbp", from: "EUR", to: "GBP", fromName: "Euro", toName: "British Pound", fromCountry: "EU", toCountry: "GB" },
  { slug: "cad-to-inr", from: "CAD", to: "INR", fromName: "Canadian Dollar", toName: "Indian Rupee", fromCountry: "CA", toCountry: "IN", corridor: "canada-to-india" },
  { slug: "aud-to-inr", from: "AUD", to: "INR", fromName: "Australian Dollar", toName: "Indian Rupee", fromCountry: "AU", toCountry: "IN", corridor: "australia-to-india" },
  { slug: "usd-to-gbp", from: "USD", to: "GBP", fromName: "US Dollar", toName: "British Pound", fromCountry: "US", toCountry: "GB" },
  { slug: "usd-to-eur", from: "USD", to: "EUR", fromName: "US Dollar", toName: "Euro", fromCountry: "US", toCountry: "EU" },
  { slug: "usd-to-cad", from: "USD", to: "CAD", fromName: "US Dollar", toName: "Canadian Dollar", fromCountry: "US", toCountry: "CA" },
  { slug: "usd-to-aud", from: "USD", to: "AUD", fromName: "US Dollar", toName: "Australian Dollar", fromCountry: "US", toCountry: "AU" },
  { slug: "usd-to-jpy", from: "USD", to: "JPY", fromName: "US Dollar", toName: "Japanese Yen", fromCountry: "US", toCountry: "JP" },
  { slug: "usd-to-brl", from: "USD", to: "BRL", fromName: "US Dollar", toName: "Brazilian Real", fromCountry: "US", toCountry: "BR", corridor: "usa-to-brazil" },
  { slug: "usd-to-cny", from: "USD", to: "CNY", fromName: "US Dollar", toName: "Chinese Yuan", fromCountry: "US", toCountry: "CN" },
];

const PAIR_MAP = new Map(CURRENCY_PAIRS.map((p) => [p.slug, p]));

/* ── Editorial content per pair ───────────────────────────── */
interface PairEditorial {
  intro: string;
  bullets: string[];
  tip: string;
}

const editorialContent: Record<string, PairEditorial> = {
  "usd-to-inr": {
    intro: "The USD/INR exchange rate is one of the most watched currency pairs in the remittance world. India receives over $125 billion in annual inbound remittances — the most of any country — with the majority originating from the United States. The rate is influenced by the Reserve Bank of India's monetary policy, US Federal Reserve decisions, oil prices, and India's trade balance.",
    bullets: [
      "The RBI manages INR within a broad band — sudden interventions can move the rate 0.5–1% in a day",
      "UPI and IMPS make bank deposits near-instant once funds arrive in India",
      "Providers like Wise and Remitly typically offer rates 0.3–1% better than banks on this corridor",
      "Sending via ACH bank transfer (rather than debit card) usually gets you a lower fee",
    ],
    tip: "If you send regularly, set a rate alert with Wise or Xe — the USD/INR rate can swing ₹1–2 within a week, which on a $1,000 transfer means ₹1,000–2,000 more or less for your recipient.",
  },
  "usd-to-pkr": {
    intro: "The USD/PKR rate has experienced significant volatility since Pakistan moved to a more market-determined exchange rate in 2023. The Pakistani rupee's value is closely tied to IMF programme compliance, the country's foreign reserves position, and the State Bank of Pakistan's monetary policy. For the large Pakistani diaspora in the US, getting the best rate on this corridor makes a meaningful difference.",
    bullets: [
      "PKR volatility means rates can move 1–3% within days — timing matters on this corridor",
      "Cash pickup through JazzCash and Easypaisa is widely used alongside bank deposits",
      "The formal/informal rate gap has narrowed since 2023 reforms, making regulated providers more competitive",
      "Western Union and MoneyGram dominate cash pickup; Wise and Remitly lead on bank deposits",
    ],
    tip: "Compare the provider's rate against the mid-market rate shown above. On USD to PKR, some providers mark up the rate by 2–4%, which on a $500 transfer could cost you PKR 3,000–6,000.",
  },
  "usd-to-php": {
    intro: "The Bangko Sentral ng Pilipinas (BSP) leaves the peso to market forces: its exchange-rate primer says that under a market-determined framework the BSP does not set the rate, and the peso's value comes from the supply of and demand for foreign exchange. BSP counts money sent home by Filipinos abroad in two ways. Cash remittances sent by land-based and sea-based workers through the banking system reached $35.63 billion in 2025, up 3.3%, while personal remittances, which add informal channels and remittances in kind, came to $39.62 billion. In January to August 2026, cash remittances totalled $23.42 billion, 2.2% more than a year earlier and slower than 2025's growth, with August alone at $3.03 billion.",
    bullets: [
      "BSP's primer says its role in the currency market is limited to tempering sharp fluctuations and keeping order, and BSP publishes a daily Reference Exchange Rate Bulletin that prints the BSP Reference Rate beside the previous day's PDS closing rate",
      "The US sent 39.7% of 2025 cash remittances in BSP's country table, down from 40.9% in 2023, and US flows grew 0.9% against 3.3% overall; BSP notes the US looks like the main source partly because banks attribute funds to the most immediate source, often a US correspondent bank",
      "BSP describes InstaPay as moving pesos almost instantly, 24/7, between BSP-supervised banks and non-bank e-money issuers, up to PHP 50,000 per transaction, with the receiver not charged; PESONet clears in batches with no limit and pays the full amount within the same banking day if sent before the cut-off",
      "GCash, run by BSP-regulated G-Xchange, Inc., says a remittance from one of its official partners either arrives instantly with an SMS confirmation or has to be claimed in the app with a reference number, and it tells recipients to transact only through partners on its official list",
    ],
    tip: "If the pesos are going to a Maya wallet, ask your recipient to finish Maya's free account upgrade and check their account limits before you send: Maya says an account has to be upgraded before it can receive international remittances, so a quote is only useful once the wallet can take the money.",
  },
  "usd-to-mxn": {
    intro: "The peso has floated freely since 22 December 1994, when Mexico's Foreign Exchange Commission dropped the trading band in place since November 1991, and Banco de México (Banxico) says the market has set the rate ever since, with any operations of its own run through pre-announced mechanisms and transparent rules. Banxico still holds international reserves so it can supply dollars if markets turn disorderly, Deputy Governor Gabriel Cuadra said in an October 2025 speech. Remittances are one of the dollar flows feeding that market: Banxico's report of 3 February 2026 counted 61,791 million dollars received in 2025, down 4.6% from 64,746 million in 2024, with December alone bringing 5,322 million. The rate at the top of this page moves through the day with supply and demand, and Mexico's official reference rate is a separate figure.",
    bullets: [
      "Banxico publishes the FIX reference rate from 12:00 on every banking day, as an average of wholesale market quotes for trades settling two banking days later; it appears in the Diario Oficial de la Federación the next banking day and is used to settle dollar debts payable in Mexico",
      "FIX, published since 11 November 1991, is a reference rather than a rate anyone must use: Banxico says private parties may use it in currency deals but are free to agree any other reference, so a provider's quote can differ from both FIX and the mid-market figure above",
      "US tax code section 4475 adds a 1% excise tax to remittance transfers made after 31 December 2025 and paid for with banknotes or paper instruments such as money orders; the sender owes it, the provider collects it, and proposed IRS rules would charge it on the amount the recipient gets, not on fees",
      "Banxico's Comprobante Electrónico de Pago (CEP) backs a completed SPEI payment and carries a digital seal: it is looked up with the tracking key (clave de rastreo) and other payment details, downloads as PDF or XML, can be checked in Banxico's own validator, and cannot be generated until the receiving bank credits the account",
    ],
    tip: "Check how you will fund the transfer before you pay: the IRS explains that section 4475 excludes money drawn from an account at a covered financial institution, or charged to a credit or debit card issued in the United States, from the 1% tax. Ask the provider for the SPEI tracking key and the institution that sent the payment in Mexico, since Banxico's CEP lookup asks for both.",
  },
  "usd-to-ngn": {
    intro: "Nigeria's naira has undergone dramatic reforms since mid-2023, when the Central Bank of Nigeria (CBN) unified its multiple exchange rate windows. The USD/NGN rate is now more market-determined, though it remains volatile. Nigeria receives over $20 billion in annual remittances, primarily from the US, UK, and Gulf states.",
    bullets: [
      "The NGN rate can move 5–10% in a single week — check the mid-market rate before every transfer",
      "Bank deposits to GTBank, Access Bank, and Zenith Bank are the most common delivery method",
      "Mobile money (via providers like OPay and PalmPay) is growing rapidly as an alternative to bank deposits",
      "Some providers lock the rate at the time of initiation; others at the time of payout — a critical difference on this volatile corridor",
    ],
    tip: "On a volatile corridor like USD to NGN, rate lock timing matters enormously. Ask whether the provider locks the rate when you initiate or when they process — on a bad day, that gap could cost you 3–5%.",
  },
  "gbp-to-eur": {
    intro: "GBP/EUR has two policy calendars behind it, one in London and one in Frankfurt, and two central banks that publish a daily rate for it. The European Central Bank posts its euro foreign exchange reference rates, sterling included, at around 16:00 CET every working day except TARGET closing days, based on a concertation between European central banks at about 14:10 CET. The ECB says these rates are published for information purposes only and strongly discourages using them for transactions. The Bank of England's statistical database also shows a daily sterling-euro rate, and the Bank states that its exchange rates are not official and are no more authoritative than those of any commercial bank in the London market. So neither figure is a dealing price; treat each as a yardstick when you check a live quote.",
    bullets: [
      "The Bank of England's Monetary Policy Committee sets Bank Rate for sterling at eight meetings a year, aiming to return inflation to its 2% target; the Bank's decision published on 17 September 2026 held Bank Rate at 3.75%, with UK inflation at 3.1%",
      "The European Central Bank says its Governing Council sets the key interest rates for the euro area, and it decided in March 2024 to keep steering policy through the deposit facility rate, which rose to 2.25% from 17 June 2026 and to 2.50% from 16 September 2026, after a year at 2.00%",
      "The European Payments Council's December 2025 list of SEPA countries keeps the United Kingdom inside SEPA's geographical scope as a non-EEA country; under the EPC's SEPA Credit Transfer rulebook, a euro transfer involving a UK payment provider must carry the payer's address, and the sending provider may ask for the recipient bank's BIC",
      "The ECB's guide to the EU Instant Payments Regulation, which covers euro credit transfers within the EU, says euro-area banks have had to receive instant euro payments since 9 January 2025, and to send them and offer Verification of Payee, a free check of the payee's name against the account, since 9 October 2025",
    ],
    tip: "Before booking a large transfer, look up the next decision date on both calendars: the Bank of England shows its next Bank Rate announcement on its interest-rate page, and the ECB publishes its Governing Council's monetary policy meeting dates well over a year ahead. Compare your quote with the live mid-market rate at the moment you send, not with a rate you saw before an announcement.",
  },
  "gbp-to-inr": {
    intro: "The UK has one of the largest Indian diaspora populations outside India, making GBP to INR one of the busiest remittance corridors globally. The rate is influenced by both BoE and RBI monetary policy, UK-India trade relations, and oil prices (which affect India's current account). Competition on this corridor has driven markups down significantly in recent years.",
    bullets: [
      "Funding via Faster Payments (UK bank transfer) typically saves £2–5 compared to debit card",
      "IMPS delivery in India means recipients can receive funds within minutes of processing",
      "Wise, Remitly, and TapTap Send all compete aggressively on this corridor",
      "The GBP/INR rate is more volatile than USD/INR due to the pound's sensitivity to UK economic data",
    ],
    tip: "Compare at least 3 providers before each transfer — the cheapest option on GBP to INR can vary day to day depending on which provider is running a promotion or has the tightest spread.",
  },
  "gbp-to-usd": {
    intro: "GBP/USD (often called 'Cable' in forex markets) is one of the most traded currency pairs in the world. For UK residents sending money to the US, the rate is highly liquid with tight spreads available from specialist providers. Central bank policy divergence between the BoE and Fed is the primary rate driver.",
    bullets: [
      "This is one of the most competitive corridors — specialist providers offer markups as low as 0.2–0.4%",
      "Bank transfers to US accounts typically arrive same-day or next-day via ACH",
      "Wire transfers (Fedwire) offer same-day settlement for larger amounts",
      "GBP/USD is highly sensitive to UK and US employment data, inflation reports, and central bank statements",
    ],
    tip: "For large transfers (£10,000+), consider a forward contract from a specialist like TorFX or OFX — you can lock in today's rate for delivery up to 12 months ahead.",
  },
  "gbp-to-pkr": {
    intro: "The State Bank of Pakistan (SBP) describes Pakistan's system as a market-based flexible exchange rate, in which the rupee is set by demand and supply and its trend generally reflects the country's balance of payments and other macroeconomic indicators. SBP calls the exchange rate the first line of defence against external shocks, and calls home remittances one of the country's key sources of foreign exchange. SBP's country-wise workers' remittances table records $41.58 billion sent to Pakistan in fiscal 2025-26 (July 2025 to June 2026), of which $6.33 billion, about 15%, came from the UK; only Saudi Arabia and the UAE sent more. UK inflows grew 7.1% on fiscal 2024-25, against 8.6% for remittances from all countries.",
    bullets: [
      "SBP says its interventions in the currency market are limited to avoiding disorderly conditions and building reserves \"without suppressing any underlying trend\", and that authorized dealers in the interbank market are free to quote their own buying and selling rates",
      "In July to September 2026, SBP's table shows $1.63 billion from the UK out of $10.88 billion, again about 15%; it has assigned each transfer to the remitter's original country since July 2019 and has counted Roshan Digital Account conversions since September 2020",
      "The Pakistan Remittance Initiative, set up in 2009 by SBP, the Ministry of Finance and the Ministry of Overseas Pakistanis, runs what SBP calls the PRI Channel: pre-funded, direct arrangements between Pakistani and foreign institutions linked by API connections, plus a call centre for remittance questions and complaints",
      "SBP's Roshan Digital Account lets non-resident Pakistanis bank in Pakistan without visiting a branch and, SBP says, send funds, profit included, back abroad without its prior approval; its investment options include GBP-denominated Naya Pakistan Certificates, and by September 2026 SBP counted 975,602 accounts and $14.16 billion paid in",
    ],
    tip: "If you have points from the Sohni Dharti Remittance Program, the SBP scheme that rewarded remittances sent through banks and exchange companies with free services from public bodies, use them in time: SBP stopped awarding points from 1 July 2026, and points earned until 30 June 2026 stay redeemable with its public-sector partners until 30 June 2027, according to the programme's page at 1LINK.",
  },
  "eur-to-usd": {
    intro: "EUR/USD is the single most traded currency pair in the world, accounting for roughly 23% of all forex volume. For eurozone residents sending money to the US, this means extremely tight spreads and competitive rates from specialist providers. ECB and Fed monetary policy divergence is the dominant rate driver.",
    bullets: [
      "The highest-liquidity pair in the world means markups from good providers are under 0.3%",
      "SEPA-funded transfers from the eurozone are typically free or very low cost",
      "US-bound transfers arrive via ACH (1–2 days) or wire (same day)",
      "ECB rate decisions, US non-farm payrolls, and inflation data are the key rate movers",
    ],
    tip: "On such a liquid pair, even small differences in markup add up. On a €10,000 transfer, the difference between a 0.3% and a 1.0% markup is about $70.",
  },
  "cad-to-inr": {
    intro: "Canada's large Indian community drives significant CAD to INR remittance volume. The rate is influenced by the Bank of Canada's interest rate decisions, commodity prices (especially oil, Canada's key export), and RBI policy. Interac e-Transfer makes funding transfers from Canada quick and convenient.",
    bullets: [
      "Interac e-Transfer is the most popular funding method — fast and usually fee-free",
      "Fewer providers compete on CAD corridors than USD corridors, so comparing rates is especially important",
      "IMPS delivery in India provides near-instant bank deposits once funds are processed",
      "Watch for providers that convert CAD→USD→INR rather than directly — this double conversion costs 0.5–1% extra",
    ],
    tip: "Always check whether a provider converts CAD directly to INR or routes through USD first. Direct conversion avoids the hidden cost of double currency conversion.",
  },
  "aud-to-inr": {
    intro: "Australia's growing Indian community makes AUD to INR an increasingly busy corridor. The Australian dollar is a commodity currency, sensitive to iron ore prices and China's economic health, while the rupee follows RBI policy and India's trade balance. PayID and POLi make funding transfers from Australia straightforward.",
    bullets: [
      "PayID enables instant funding from most Australian banks",
      "Instarem is a strong regional specialist on this corridor, alongside global players like Wise and Remitly",
      "IMPS delivery in India means recipients can access funds within minutes",
      "The AUD/INR rate is more volatile than USD/INR due to Australia's commodity currency dynamics",
    ],
    tip: "Instarem often has the best rates on AUD to INR specifically — it's worth including alongside the global providers when comparing.",
  },
  "usd-to-gbp": {
    intro: "Sending US dollars to the UK is common for expats, businesses, and families with transatlantic ties. The USD/GBP rate (the inverse of the more commonly quoted GBP/USD) benefits from being one of the world's most liquid currency pairs, which keeps provider markups competitive.",
    bullets: [
      "Funds arrive via Faster Payments in the UK — typically within hours of processing",
      "ACH bank transfer from the US is the cheapest funding method (debit card costs $3–5 more)",
      "This corridor benefits from intense competition — compare Wise, OFX, and Revolut",
      "US and UK economic divergence (jobs data, inflation, central bank policy) drives rate movements",
    ],
    tip: "If you're sending regularly, Wise's auto-convert feature lets you set a target rate and convert automatically when it's reached.",
  },
  "usd-to-eur": {
    intro: "USD to EUR is the world's most traded currency conversion. Whether you're paying European invoices, supporting family, or funding a euro account, competition among providers on this corridor keeps costs very low. The ECB's 2026 instant payments mandate means euro deposits now arrive in seconds.",
    bullets: [
      "SEPA instant means euro deposits arrive in under 10 seconds, 24/7, at no extra charge",
      "Markups from the best providers are among the lowest of any corridor — often under 0.3%",
      "ACH funding from the US keeps costs low; wire funding is faster but more expensive",
      "EUR/USD is driven by ECB vs. Fed rate expectations, eurozone GDP, and US employment data",
    ],
    tip: "For eurozone transfers, the rate matters more than the fee. A 0.5% rate markup on a $5,000 transfer costs $25 — more than most providers' flat fees.",
  },
  "usd-to-jpy": {
    intro: "The USD/JPY pair is the second most traded in the world and has seen extraordinary volatility since 2022 as the Bank of Japan gradually normalises decades of ultra-loose monetary policy. For US residents sending to Japan, this creates both opportunities and risks — the rate can move 2–3% in a single week.",
    bullets: [
      "The BoJ's rate normalisation path is the single biggest driver of USD/JPY movements",
      "Japanese bank deposits are reliable but can take 1–2 business days to clear domestically",
      "Wise and Revolut offer the tightest spreads on this corridor",
      "JPY is a 'safe haven' currency — it tends to strengthen during global market stress",
    ],
    tip: "USD/JPY is one of the most volatile major pairs right now. If you have flexibility on timing, waiting for a rate dip can save meaningful amounts on larger transfers.",
  },
  "eur-to-gbp": {
    intro: "EUR/GBP is one of Europe's most closely watched currency pairs, representing the economic relationship between the eurozone and the United Kingdom. Since Brexit, the pair has been driven by trade negotiations, BoE and ECB interest rate differentials, and economic divergence. For eurozone residents sending money to the UK, specialist providers consistently outperform banks on this corridor.",
    bullets: [
      "Post-Brexit trade frictions have kept EUR/GBP more volatile than it was pre-2016",
      "ECB and Bank of England interest rate paths are the dominant near-term rate driver",
      "SEPA transfers fund quickly from the eurozone; Faster Payments delivers instantly in the UK",
      "Specialist providers like Wise and Revolut charge under 0.5% markup on this liquid pair",
    ],
    tip: "For regular transfers to the UK, open a GBP balance with Wise or Revolut and convert opportunistically — EUR/GBP can swing 1–2% in a week around central bank meetings.",
  },
  "usd-to-cad": {
    intro: "USD/CAD (known as the 'Loonie pair' in forex markets) is the most important cross-border currency for North America, reflecting the deep trade ties between the US and Canada. The pair is heavily influenced by oil prices (Canada is a major oil exporter), Bank of Canada decisions, US tariff policy, and broader risk sentiment. For US residents sending money to Canada, competition among providers keeps costs low.",
    bullets: [
      "Oil price movements can shift USD/CAD by 0.5–1% on a single day — watch crude if timing matters",
      "Interac e-Transfer makes receiving funds in Canada fast and convenient",
      "ACH funding from the US is cheapest; same-day wire is available for urgent transfers",
      "Bank of Canada and Fed rate decisions are the primary medium-term drivers",
    ],
    tip: "USD/CAD is very sensitive to oil prices and US trade policy announcements. If you have flexibility on timing, checking rates around major economic data releases can yield better rates.",
  },
  "usd-to-aud": {
    intro: "USD/AUD reflects the relationship between the world's reserve currency and a major commodity currency. The Australian dollar is heavily influenced by iron ore and coal prices, the health of the Chinese economy (Australia's largest trading partner), and Reserve Bank of Australia rate decisions. This makes AUD more volatile than most developed-market currencies, which creates both risk and opportunity for US senders.",
    bullets: [
      "AUD is a 'risk-on' currency — it strengthens when global sentiment is positive and weakens in downturns",
      "China's economic data releases regularly move AUD/USD by 0.5% or more",
      "PayID enables near-instant bank deposits in Australia once funds are processed",
      "Wise and OFX are strong competitors on this corridor; OFX waives fees on larger amounts",
    ],
    tip: "If AUD is near multi-year lows against USD, consider locking in a forward contract for future regular payments — OFX and TorFX offer these for up to 12 months ahead.",
  },
  "usd-to-brl": {
    intro: "The Brazilian real has floated since the Banco Central do Brasil's Communiqué 6,565 of 18 January 1999, and Brazil's foreign-exchange law, Law 14,286 of 2021, says the exchange rate is freely agreed between authorised institutions and their clients. The same law allows foreign-exchange operations only through institutions the central bank has authorised, and the central bank's Resolution BCB 277 of 2022 requires a payment from abroad to arrive through one of them or another channel the law provides. So the rate behind a transfer from the US is set by whoever converts the dollars, not by the central bank. What the central bank does publish each business day is PTAX, a reference rate built from its accredited dealers' quotes in the interbank market.",
    bullets: [
      "Resolution BCB 45 of 2020 builds PTAX from four two-minute dealer polls each business day, starting at random in the ten minutes after 10:00, 11:00, 12:00 and 13:00 Brasília time; each poll drops the two highest and two lowest quotes, and the average of the four is published with the last poll, shortly after 13:00",
      "Each authorised institution prices its own exchange, and Resolution BCB 277 requires it to tell a client the Valor Efetivo Total (VET) before a spot exchange of up to US$100,000: one reais-per-dollar figure that folds in the rate, the taxes on the exchange and any fee",
      "Decree 6,306, Brazil's IOF regulation as amended by Decree 12,499 of 11 June 2025, taxes inbound foreign-exchange operations at 0.38% unless another clause applies, such as the zero rate for export revenue from goods and services; the tax is charged on the reais amount and collected by the authorised institution",
      "Resolution BCB 277 requires the reais to be credited to a deposit or payment account at a central-bank-authorised institution or a payment institution that joined Pix, though up to R$10,000 can be paid by any means, including cash; the central bank says Pix, its instant payment system, is free for individuals and runs 24/7",
    ],
    tip: "If the dollars reach a Brazilian institution as a foreign-currency payment order, Resolution BCB 277 requires it to tell the recipient at once and to say the order can be converted in full or in parts. Before converting, ask for the VET and compare it with the live mid-market rate here or the day's PTAX; the gap is the cost of the exchange, tax included.",
  },
  "usd-to-cny": {
    intro: "The yuan is not a free float against the dollar: each business day the China Foreign Exchange Trade System (CFETS) publishes a central parity rate, and interbank trading prices may move no more than 2 percent either side of it, according to the IMF's 2025 Article IV report on China. That band was widened from 1 percent to 2 percent by a People's Bank of China (PBOC) announcement effective 17 March 2014. The IMF describes the official arrangement as managed floating with reference to a basket of currencies, classifies the regime in practice as crawl-like, and records the PBOC's position that the band will be changed in an orderly manner as markets develop. For a sender in the US, the onshore rate behind a CNY quote is tied to a figure published each morning, and Chinese rules decide what happens to dollars once they land.",
    bullets: [
      "CFETS publishes the yuan's central parity and trading band at 9:15 a.m. Beijing time, and under a CFETS notice of December 2022 they apply to every interbank spot trade agreed that trading day, which runs from 9:30 a.m. until 3:00 a.m. the next morning",
      "Offshore yuan (CNH) and onshore yuan (CNY) trade in separate markets: the Hong Kong Monetary Authority treats them as separate currencies in its banking returns, and a 2015 Bank for International Settlements study found the offshore rate frequently diverges from the onshore one, so check which of the two a quote is priced in",
      "Converting incoming dollars into yuan is a foreign exchange settlement: under 2020 guidelines from the State Administration of Foreign Exchange (SAFE), each person has an annual facilitation quota of USD 50,000 equivalent for it, usable at a bank with valid ID alone, plus a separate quota for purchases, SAFE's Tianjin branch confirmed in July 2026",
      "Larger sums can still be converted: replying to a 2023 National People's Congress proposal on remittances from overseas Chinese, SAFE said genuine current-account funds can be handled with documents showing the transaction behind them, and that it supports banks offering conversion through online and mobile banking",
    ],
    tip: "Inside the daily trading band, Chinese banks may set the rates they give customers against the dollar without any limit on the spread, the IMF notes, citing a 2014 PBOC notice. If the money lands as dollars, the recipient's bank sets the conversion rate on the day, which no US quote shows in advance; a quote that pays out yuan can be compared line by line.",
  },
};

/* ── Static params ────────────────────────────────────────── */
export function generateStaticParams() {
  // Only the pairs that keep a standalone page still build. The rest 301 to
  // the hub in middleware — see src/lib/gone-rate-pairs.ts.
  return CURRENCY_PAIRS.filter((p) => KEPT_RATE_PAIR_SLUGS.has(p.slug)).map((p) => ({ pair: p.slug }));
}

/* ── Metadata ─────────────────────────────────────────────── */
interface Props {
  params: Promise<{ pair: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair, locale } = await params;
  const p = PAIR_MAP.get(pair);
  if (!p) return { title: "Not Found" };

  const year = new Date().getFullYear();

  // CTR-optimized overrides for high-impression pairs.
  //
  // usd-to-brl:    pos 2.7, 232 impressions, 0 clicks (biggest CTR miss on the site).
  //                Brazil country traffic: 257 impr, pos 4.1, 0 clicks total.
  //                Old title was generic and didn't echo the searcher's actual question.
  //                New: lead with "1 USD = X BRL", echo the conversion intent (the most
  //                searched query phrasing is "1 dollar to real" / "dolar hoje").
  // gbp-to-eur:    pos 5.5, 69 impressions, 0 clicks. UK→EU traveller intent dominant —
  //                title now leads with the conversion+pound-amount hook.
  const month = new Date().toLocaleDateString("en-US", { month: "long" });
  const pairOverrides: Record<string, { title: string; description: string; ogTitle?: string; ogDesc?: string }> = {
    // Descriptions front-load the conversion hook into the first ~155 chars
    // (the SERP truncation point) so the highest-CTR phrase stays visible.
    // The richer detail after the cut still feeds AI/Bing snippet selection.
    "usd-to-brl": {
      title: `USD to BRL Today: Live Dollar to Real Rate (${year})`,
      description: `How much is 1 USD in Brazilian Real today? Find the cheapest USD→BRL transfer in seconds — live mid-market rate updated every 60s, plus the reais ${providersComparedPhrase(["USD"], "BRL")} — Wise, Remitly and Xoom among them — deliver after markup.`,
      ogTitle: `1 USD to BRL Today — Live Dollar to Real Rate (${month} ${year})`,
      ogDesc: `Live USD to Brazilian Real rate + what ${providersComparedPhrase(["USD"], "BRL")} actually pay. See who delivers the most reais per dollar today, plus PIX delivery options.`,
    },
    "gbp-to-eur": {
      title: `GBP to EUR Today — How Much Is £1,000 in Euros?`,
      description: `How much is £1,000 in euros today? Compare the cheapest UK→Europe transfers — live GBP/EUR rate updated every 60s, plus what ${providersComparedPhrase(["GBP"], "EUR")} — Wise and Revolut among them — actually deliver after FX markup.`,
      ogTitle: `GBP to EUR Today — Live Pound to Euro Rate + Cheapest UK→EU Providers`,
      ogDesc: `Live GBP/EUR mid-market rate + what UK-to-Europe transfer providers actually offer. See who gives you the most euros per pound today.`,
    },
  };

  const override = pairOverrides[pair];
  const title = override?.title ?? `Live ${p.from} to ${p.to} Exchange Rate Today (${year})`;
  // Trimmed to fit under 160 chars — the previous wording ran ~230, so all 21
  // rate pages were truncated in the SERP before reaching the payoff.
  const description = override?.description ?? `Live ${p.from}/${p.to} rate, updated every 60s. See what ${COVERAGE.providers} really pay after markup — most add 0.5–4%. Who delivers the most ${p.toName}?`;

  return {
    title,
    description: seoDescription(description),
    keywords: `${p.from} to ${p.to} exchange rate, ${p.from} to ${p.to} rate today, ${p.from}/${p.to} ${year}, ${p.fromName} to ${p.toName}, convert ${p.from} to ${p.to}, ${p.from} ${p.to} mid-market rate, cheapest ${p.from} to ${p.to}`,
    alternates: getAlternates(`exchange-rates/${pair}`, locale),
    // Exchange rate content is English-only; noindex locale variants to avoid duplicate content
    ...(locale !== "en" && { robots: { index: false, follow: true } }),
    // 2026-09-20: indexability is measured, not assumed — robotsFor()
    // consults the duplication-derived allowlist. See
    // scripts/build-indexable-routes.ts.
    robots: robotsFor(`/exchange-rates/${pair}`),
    openGraph: {
      title: override?.ogTitle ?? `${p.from}→${p.to}: Real Rate vs. What Providers Offer`,
      description: override?.ogDesc ?? `Live ${p.from}/${p.to} mid-market rate vs. what transfer providers charge. See the markup each provider adds.`,
      url: `https://sendmoneycompare.com/exchange-rates/${pair}`,
      images: DEFAULT_OG_IMAGES,
    },
  };
}

/* ── Helper ───────────────────────────────────────────────── */
function computeCrossRate(rates: Record<string, number>, from: string, to: string): number | null {
  if (from === "USD") return rates[to] ?? null;
  if (to === "USD") return rates[from] ? 1 / rates[from] : null;
  const fromUsd = rates[from];
  const toUsd = rates[to];
  if (!fromUsd || !toUsd) return null;
  return toUsd / fromUsd;
}

function fmtRate(rate: number): string {
  if (rate >= 1000) return rate.toFixed(2);
  if (rate >= 100) return rate.toFixed(3);
  if (rate >= 10) return rate.toFixed(4);
  return rate.toFixed(5);
}

/* ── Page ─────────────────────────────────────────────────── */
export default async function ExchangeRatePairPage({ params }: Props) {
  const { pair, locale } = await params;
  setRequestLocale(locale);
  const p = PAIR_MAP.get(pair);
  if (!p) notFound();

  const rates = await fetchExchangeRates();
  const midRate = computeCrossRate(rates, p.from, p.to);
  const inverseRate = midRate ? 1 / midRate : null;

  // Get provider quotes for this corridor
  // See table-amounts.ts: 1,000 printed the same rows as every corridor page
  // and guide on this route.
  const tableAmount = firstTableAmount("rates");
  const amountLabel = tableAmount.toLocaleString("en-US");
  const quotes = p.corridor ? generateQuotes(tableAmount, p.from, p.to).slice(0, 8) : [];
  const editorial = editorialContent[pair];

  // What today's measured quotes for the table amount say about this pair. Until
  // 2026-10-18 the explainer, the cost FAQ and its schema printed hand-typed
  // ranges ("the best providers typically mark up by 0.2–0.8%, banks 2–5%")
  // that were the same on every pair page and measured nothing.
  const cost = (() => {
    const measured = generateQuotes(tableAmount, p.from, p.to).filter((q) => !q.isIndicative && q.receiveAmount > 0);
    if (measured.length === 0 || !midRate) return null;
    const markups = measured.map((q) => (1 - q.exchangeRate / midRate) * 100).sort((a, b) => a - b);
    const mid = Math.floor(markups.length / 2);
    const median = markups.length % 2 ? markups[mid] : (markups[mid - 1] + markups[mid]) / 2;
    const fees = measured.map((q) => q.fee);
    const payouts = measured.map((q) => q.receiveAmount);
    const fmt = (n: number, d = 2) => n.toLocaleString("en-US", { maximumFractionDigits: d });
    const leader = measured.reduce((a, b) => (b.receiveAmount > a.receiveAmount ? b : a)).providerSlug;
    return {
      leader,
      count: measured.length,
      medianMarkup: `${median.toFixed(2)}%`,
      feeRange: Math.min(...fees) === Math.max(...fees) ? `${fmt(Math.min(...fees))} ${p.from}` : `${fmt(Math.min(...fees))} to ${fmt(Math.max(...fees))} ${p.from}`,
      best: `${fmt(Math.max(...payouts), 0)} ${p.to}`,
      worst: `${fmt(Math.min(...payouts), 0)} ${p.to}`,
      gap: `${fmt(Math.max(...payouts) - Math.min(...payouts), 0)} ${p.to}`,
    };
  })();
  const costSentence = cost
    ? cost.count > 1
      ? `Across today's ${cost.count} quotes for ${amountLabel} ${p.from}, the median provider's rate sits ${cost.medianMarkup} below the mid-market rate and fees run from ${cost.feeRange}, so your recipient gets between ${cost.worst} and ${cost.best}: a ${cost.gap} gap on the same transfer.`
      : `Only one provider quotes ${amountLabel} ${p.from} to ${p.to} in our data today: its rate sits ${cost.medianMarkup} below the mid-market rate, with a fee of ${cost.feeRange}, and your recipient gets ${cost.best}.`
    : `No provider quotes ${p.from} to ${p.to} in our data today, so there is no measured cost to show.`;

  // Related pairs (same base or quote currency, excluding self).
  // This used to take .slice(0, 6) of declaration order, so every USD page
  // linked the same first six siblings and the pairs declared later —
  // usd-to-cad, usd-to-aud, usd-to-jpy, usd-to-cny — were linked from no
  // sibling at all, leaving them on a single inbound link from the hub.
  // Rotating the six-slot window by the pair's own position spreads the slots
  // across the whole sibling set and is deterministic, so a given pair renders
  // the same rail on every build.
  // Only pairs that still have a page — the rest 301 to the hub, and linking
  // a redirect wastes the edge and trips check:links.
  const siblings = CURRENCY_PAIRS.filter(
    (rp) => rp.slug !== pair && KEPT_RATE_PAIR_SLUGS.has(rp.slug) && (rp.from === p.from || rp.to === p.to),
  );
  const offset = CURRENCY_PAIRS.findIndex((cp) => cp.slug === pair);
  const relatedPairs =
    siblings.length <= 6
      ? siblings
      : Array.from({ length: 6 }, (_, i) => siblings[(offset + i) % siblings.length]);

  // JSON-LD
  const rateSchema = midRate ? {
    "@context": "https://schema.org",
    "@type": "ExchangeRateSpecification",
    currency: p.from,
    currentExchangeRate: {
      "@type": "UnitPriceSpecification",
      price: midRate,
      priceCurrency: p.to,
      unitText: `1 ${p.from} = ${fmtRate(midRate)} ${p.to}`,
    },
    validFrom: SITE_STATS.midMarketUpdatedAt,
  } : null;

  return (
    <>
      {rateSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(rateSchema) }} />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
              { "@type": "ListItem", position: 2, name: "Exchange Rates", item: "https://sendmoneycompare.com/exchange-rates" },
              { "@type": "ListItem", position: 3, name: `${p.from} to ${p.to}` },
            ],
          }),
        }}
      />

      <div className="bg-[var(--color-surface)] min-h-screen">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">

          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Exchange Rates", href: "/exchange-rates" }, { label: `${p.from} to ${p.to}` }]} />

          {/* Hero rate card */}
          <div className="bg-[var(--color-surface-dim)] rounded-2xl border border-[var(--color-outline)] p-5 sm:p-6 md:p-10 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CircleFlag code={p.from} size={32} />
              <svg className="w-5 h-5 text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <CircleFlag code={p.to} size={32} />
            </div>

            <h1 className="text-[clamp(1.5rem,5vw,2.75rem)] font-normal text-[var(--color-on-surface)] mb-2 leading-tight tracking-[-0.01em]">
              {p.fromName} to {p.toName} Exchange Rate
            </h1>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
              Mid-market {p.from}/{p.to} rate — the fairest rate, before provider markups.
            </p>

            {midRate ? (
              <div className="space-y-2">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-[clamp(2rem,9vw,3rem)] font-light text-[var(--color-primary)] tabular-nums leading-none">
                    {fmtRate(midRate)}
                  </span>
                  <span className="text-base sm:text-lg text-[var(--color-on-surface-variant)]">{p.to}</span>
                </div>
                <p className="text-sm text-[var(--color-on-surface-variant)]">
                  1 {p.from} = {fmtRate(midRate)} {p.to}
                </p>
                {inverseRate && (
                  <p className="text-2sm text-[var(--color-on-surface-variant)]">
                    1 {p.to} = {fmtRate(inverseRate)} {p.from}
                  </p>
                )}
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-2">
                  Source: XE mid-market rate. For indicative purposes only.
                </p>
              </div>
            ) : (
              <p className="text-[var(--color-on-surface-variant)]">Rate data temporarily unavailable.</p>
            )}
          </div>

          {/* Live provider comparison, directly under the mid-market rate.
              The mid-market number is what nobody actually gets — showing the
              real all-in cost here is the honest next step, and it is the only
              /go/ link on the page. Before 2026-09-01 this family had none at
              all: ~1,170 sessions per 90 days across /exchange-rates/*,
              /iban/* and /swift-codes/* converting under 1%.

              Not gated on p.corridor. A corridor is a /send-money PAGE, which
              is allowlisted; whether one exists says nothing about whether we
              can quote the pair. Gating on it left the nine highest-intent
              pages in the family — usd-to-eur, gbp-to-usd, eur-to-usd,
              usd-to-jpy and the rest — with no /go link at all, while
              generateQuotes returns 6-21 live quotes for every one of them.
              The component already returns null when it has no quotes, so it
              is its own guard. */}
          <InlineProviderQuotes
            from={p.from}
            to={p.to}
            amount={tableAmount}
            source={`rate:${pair}`}
            heading={`Nobody gets the mid-market rate — here is what you actually get`}
            subheading={`Live ${p.from}→${p.to} all-in costs, collected every 6 hours.`}
          />

          {/* In-context news callout — shown when pair has a related article */}
          {(() => {
            const relatedSlug = pairRelatedNews[pair];
            if (!relatedSlug) return null;
            const article = newsItems.find((n) => n.slug === relatedSlug);
            if (!article) return null;
            return (
              <Link
                href={`/news/${article.slug}`}
                className="block bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl p-5 mb-8 hover:border-[var(--color-primary)] hover:shadow-sm transition-all group"
              >
                <p className="text-2xs font-medium text-[var(--color-primary)] uppercase tracking-wider mb-2">
                  In the news
                </p>
                <p className="text-sm font-medium text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] leading-snug mb-1">
                  {article.title}
                </p>
                <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed mb-2">
                  {article.excerpt}
                </p>
                <time
                  className="text-2xs text-[var(--color-on-surface-variant)]"
                  dateTime={article.publishedAt}
                >
                  {formatLocalDate(article.publishedAt, { month: "short", day: "numeric", year: "numeric" })}
                </time>
              </Link>
            );
          })()}

          {/* AI-citable Quick Answer — high-value pairs only */}
          {midRate && (() => {
            const monthYear = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
            const bestQuote = quotes[0];
            const quickAnswers: Record<string, string> = {
              "usd-to-brl": `The USD to BRL exchange rate today is 1 US dollar = ${fmtRate(midRate)} Brazilian reais (mid-market rate, ${monthYear}).${bestQuote ? ` To actually send USD to Brazil, ${getProviderName(bestQuote.providerSlug)} offers the best provider rate right now at ${bestQuote.exchangeRate.toFixed(4)} — delivering ${bestQuote.receiveAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} BRL on a $${amountLabel} transfer (fee ${bestQuote.fee === 0 ? "free" : "$" + bestQuote.fee.toFixed(2)}).` : ""}${cost ? ` ${costSentence}` : ""}`,
            };
            const answer = quickAnswers[pair];
            if (!answer) return null;
            return (
              <div className="bg-[var(--color-primary-surface)] border-y border-[var(--color-primary-light)] -mx-4 sm:mx-0 sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5 mb-8">
                <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">
                  <strong className="text-[var(--color-primary)]">Quick answer:</strong> {answer}
                </p>
              </div>
            );
          })()}

          {/* Quick conversion table */}
          {midRate && (
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8 mb-8">
              <h2 className="text-xl font-medium text-[var(--color-on-surface)] mb-4">
                {p.from} to {p.to} Conversion Table
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[100, 500, 1000, 5000, 10000, 25000, 50000, 100000].map((amount) => (
                  <div key={amount} className="bg-[var(--color-surface-dim)] rounded-xl p-3">
                    <p className="text-xs text-[var(--color-on-surface-variant)]">{amount.toLocaleString()} {p.from}</p>
                    <p className="text-base font-medium text-[var(--color-on-surface)] tabular-nums">
                      {(amount * midRate).toLocaleString(undefined, { maximumFractionDigits: 2 })} {p.to}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-3">
                Based on mid-market rate. Actual provider rates will differ — compare below.
              </p>
            </div>
          )}

          {/* Provider comparison */}
          {quotes.length > 0 && (
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-5 sm:p-6 md:p-8 mb-8">
              <h2 className="text-xl font-medium text-[var(--color-on-surface)] mb-2">
                Compare {p.from} to {p.to} Transfer Rates
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
                What you&apos;d actually receive sending {amountLabel}{" "}{p.from} via each provider today.
              </p>

              {/* Mobile — stacked card per provider */}
              <div className="sm:hidden divide-y divide-[var(--color-outline)] border-y border-[var(--color-outline)]">
                {quotes.map((q, i) => (
                  <div key={q.providerSlug} className={`py-3 ${i === 0 ? "bg-[var(--color-primary-surface)] -mx-5 px-5" : ""}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link href={`/companies/${q.providerSlug}`} className="text-sm font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)]">
                          {getProviderName(q.providerSlug)}
                        </Link>
                        {i === 0 && <span className="ml-2 text-2xs font-medium text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-2 py-0.5 rounded-full">Best rate</span>}
                        <p className="text-2xs text-[var(--color-on-surface-variant)] mt-0.5 tabular-nums">
                          Rate {q.exchangeRate.toFixed(4)} · {q.fee === 0 ? "No fee" : `${q.fee.toFixed(2)} ${p.from} fee`} · {q.transferSpeed}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-[var(--color-primary)] tabular-nums">
                          {q.receiveAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-2xs text-[var(--color-on-surface-variant)]">{p.to} received</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop — full 5-col table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-outline)]">
                      <th className="text-left py-3 pr-4 font-medium text-[var(--color-on-surface)]">Provider</th>
                      <th className="text-right py-3 px-4 font-medium text-[var(--color-on-surface)]">Rate</th>
                      <th className="text-right py-3 px-4 font-medium text-[var(--color-on-surface)]">Fee</th>
                      <th className="text-right py-3 px-4 font-medium text-[var(--color-on-surface)]">You Receive</th>
                      <th className="text-right py-3 pl-4 font-medium text-[var(--color-on-surface)]">Speed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.map((q, i) => (
                      <tr key={q.providerSlug} className={`border-b border-[var(--color-outline)] last:border-b-0 ${i === 0 ? "bg-[var(--color-primary-surface)]" : ""}`}>
                        <td className="py-3 pr-4">
                          <Link href={`/companies/${q.providerSlug}`} className="font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)]">
                            {getProviderName(q.providerSlug)}
                          </Link>
                          {i === 0 && <span className="ml-2 text-2xs font-medium text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-2 py-0.5 rounded-full">Best rate</span>}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[var(--color-on-surface)]">{q.exchangeRate.toFixed(4)}</td>
                        <td className="py-3 px-4 text-right text-[var(--color-on-surface-variant)]">{q.fee === 0 ? "Free" : `${q.fee.toFixed(2)} ${p.from}`}</td>
                        <td className="py-3 px-4 text-right font-medium text-[var(--color-primary)] tabular-nums">{q.receiveAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {p.to}</td>
                        <td className="py-3 pl-4 text-right text-[var(--color-on-surface-variant)]">{q.transferSpeed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Where a corridor page exists: that page when Google may index
                  it, else the same pair and amount on /send-money (rule 14
                  fallback) — until 2026-10-18 it rendered as plain text when
                  the corridor page was Bing-only. Pairs without a corridor page
                  get no line: their live table's "see all" link already
                  continues the route, and showing this line on every pair
                  raised the GBP pairs' shared text by up to 1 point. */}
              {p.corridor && corridorPageRenders(p.corridor) && (
                <div className="mt-4 pt-4 border-t border-[var(--color-outline)]">
                  <Link
                    href={`/send-money/${p.corridor}`}
                    fallbackHref={compareHashHref(p.from, p.to, tableAmount)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:underline"
                  >
                    Compare all providers for {p.fromName} to {p.toName}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Editorial content */}
          {editorial && (
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8 mb-8">
              <h2 className="text-xl font-medium text-[var(--color-on-surface)] mb-4">
                Understanding the {p.from}/{p.to} Exchange Rate
              </h2>
              <div className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed space-y-4">
                <p>{editorial.intro}</p>
                <h3 className="text-md font-medium text-[var(--color-on-surface)] !mt-5">Key things to know</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {editorial.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                <div className="bg-[var(--color-primary-surface)] border border-[var(--color-primary)] border-opacity-20 rounded-xl p-4 !mt-5">
                  <p className="text-2sm font-medium text-[var(--color-primary)] mb-1">Tip</p>
                  <p className="text-sm text-[var(--color-on-surface)]">{editorial.tip}</p>
                </div>
              </div>
            </div>
          )}

          {/* Rate history link */}
          {getRateInsight(p.from, p.to) && (
            <div className="bg-[var(--color-primary-surface)] rounded-2xl border border-[var(--color-primary)] border-opacity-20 p-5 sm:p-6 md:p-8 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium text-[var(--color-on-surface)] mb-1">
                    {p.from}/{p.to} Rate History
                  </h2>
                  <p className="text-sm text-[var(--color-on-surface-variant)]">
                    Track how provider rates have changed over time, and which provider led the {p.from} to {p.to}{" "}route on each day.
                  </p>
                </div>
                <Link
                  href={rateHistoryHref(corridorToSlug(`${p.from}-${p.to}`)) ?? "/exchange-rates/history"}
                  className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 bg-[var(--color-cta)] text-[var(--color-cta-text)] text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[var(--color-cta-hover)] transition-colors"
                >
                  View history
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* How the rate is calculated */}
          <div className="bg-[var(--color-surface-dim)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8 mb-8">
            <h2 className="text-lg font-medium text-[var(--color-on-surface)] mb-3">
              How we calculate the {p.from}/{p.to} mid-market rate
            </h2>
            <div className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed space-y-3">
              <p>
                The {p.from}/{p.to}{" "}figure at the top is XE&apos;s mid-market rate, the midpoint of buy and sell prices, and the benchmark each provider&apos;s markup below is measured against.
              </p>
              <p>{costSentence}</p>
            </div>
          </div>

          {/* Related pairs */}
          {relatedPairs.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-medium text-[var(--color-on-surface)] mb-4">
                Related Exchange Rates
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {relatedPairs.map((rp) => {
                  const rpRate = computeCrossRate(rates, rp.from, rp.to);
                  return (
                    <Link
                      key={rp.slug}
                      href={`/exchange-rates/${rp.slug}`}
                      className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl p-3 hover:border-[var(--color-primary)] hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <CircleFlag code={rp.from} size={16} />
                        <span className="text-xs text-[var(--color-on-surface-variant)]">&rarr;</span>
                        <CircleFlag code={rp.to} size={16} />
                      </div>
                      <p className="text-2sm font-medium text-[var(--color-on-surface)]">{rp.from}/{rp.to}</p>
                      {rpRate && (
                        <p className="text-xs text-[var(--color-primary)] tabular-nums">{fmtRate(rpRate)}</p>
                      )}
                    </Link>
                  );
                })}
              </div>
              {/* /currency-converter had no link outside the footer, so nothing
                  in context pointed at the tool that answers the obvious next
                  question on a rate page. */}
              <p className="mt-4 text-2sm text-[var(--color-on-surface-variant)]">
                Need a specific figure?{" "}
                <Link href="/currency-converter" className="text-[var(--color-primary)] hover:underline">
                  Convert any {p.from} amount to {p.toName}
                </Link>
                .
              </p>
            </div>
          )}

          {/* FAQ */}
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8 mb-8">
            <h2 className="text-lg font-medium text-[var(--color-on-surface)] mb-4">
              Frequently asked questions about {p.from} to {p.to}
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              {[
                {
                  q: `What is the mid-market ${p.from}/${p.to} exchange rate today?`,
                  a: midRate
                    ? `The mid-market rate for ${p.from} to ${p.to} today is ${fmtRate(midRate)}, meaning 1 ${p.fromName} buys ${fmtRate(midRate)} ${p.toName}. The inverse rate is 1 ${p.to} = ${inverseRate ? fmtRate(inverseRate) : "—"} ${p.from}. This is the interbank reference rate — money transfer providers apply a markup above this, so the rate you receive will be slightly lower.`
                    : `The mid-market rate is the midpoint between global buy and sell prices for ${p.from}/${p.to}. It is the fairest reference rate, before any provider markup is applied.`,
                },
                {
                  q: `What moves the ${p.from}/${p.to} exchange rate?`,
                  a: editorial
                    ? `${editorial.bullets[0]}. ${editorial.bullets[1]}. ${editorial.intro.split(".")[0]}.`
                    : `The ${p.from}/${p.to} rate is driven by the monetary policies of the relevant central banks, inflation data, trade balances, and broader market risk sentiment. Major economic data releases — such as employment figures and GDP reports — can move the rate by 0.5% or more in a single session.`,
                },
                {
                  q: `Which provider offers the best ${p.fromName} to ${p.toName} rate?`,
                  a: quotes.length > 0
                    ? `Based on today's quotes, ${getProviderName(quotes[0].providerSlug)} is offering the best ${p.from} to ${p.to} rate — sending ${amountLabel} ${p.from} gives your recipient ${quotes[0].receiveAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${p.to}. Rankings shift daily, so compare the full table above before every transfer.${editorial ? " " + editorial.tip : ""}`
                    : cost
                      ? `Based on today's quotes, ${getProviderName(cost.leader)} delivers the most ${p.to} for ${amountLabel} ${p.from} (${cost.best}). The order moves with the rate, so compare before you send.${editorial ? " " + editorial.tip : ""}`
                      : `No provider quotes ${p.from} to ${p.to} in our data today, so there is no measured leader to name.`,
                },
                {
                  q: `How much does it cost to convert ${p.fromName} to ${p.toName}?`,
                  a: `Two parts: the markup in the provider's exchange rate and any fee. ${costSentence}`,
                },
              ].map((faq, i) => (
                <div key={i} className="py-4">
                  <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-2">{faq.q}</h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Back link */}
          <div className="pt-6 border-t border-[var(--color-outline)]">
            <Link href="/exchange-rates" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
              &larr; View all exchange rates
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `What is the mid-market ${p.from}/${p.to} exchange rate today?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: midRate
                    ? `The mid-market rate for ${p.from} to ${p.to} today is ${fmtRate(midRate)}, meaning 1 ${p.fromName} buys ${fmtRate(midRate)} ${p.toName}. This is the interbank reference rate before provider markups.`
                    : `The mid-market rate is the fairest reference rate for ${p.from}/${p.to}, before any provider markup is applied.`,
                },
              },
              {
                "@type": "Question",
                name: `What moves the ${p.from}/${p.to} exchange rate?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: editorial
                    ? `${editorial.bullets[0]}. ${editorial.bullets[1]}.`
                    : `The ${p.from}/${p.to} rate is driven by central bank monetary policy, inflation data, trade balances, and broader market risk sentiment.`,
                },
              },
              {
                "@type": "Question",
                name: `Which provider offers the best ${p.fromName} to ${p.toName} rate?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: quotes.length > 0
                    ? `Based on today's quotes, ${getProviderName(quotes[0].providerSlug)} is offering the best rate for ${p.from} to ${p.to}. Rankings shift daily — always compare before sending.`
                    : cost
                      ? `Based on today's quotes, ${getProviderName(cost.leader)} delivers the most ${p.to} for ${amountLabel} ${p.from}. The order moves with the rate, so compare before you send.`
                      : `No provider quotes ${p.from} to ${p.to} in our data today.`,
                },
              },
              {
                "@type": "Question",
                name: `How much does it cost to convert ${p.fromName} to ${p.toName}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `Two parts: the markup in the provider's exchange rate and any fee. ${costSentence}`,
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
