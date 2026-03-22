import Breadcrumb from "@/components/Breadcrumb";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchExchangeRates } from "@/lib/exchange-rates";
import { providers, generateQuotes, getProviderName } from "@/data/providers";
import CircleFlag from "@/components/CircleFlag";
import { getAlternates } from "@/lib/i18n-metadata";
import { setRequestLocale } from "next-intl/server";

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
  { slug: "usd-to-brl", from: "USD", to: "BRL", fromName: "US Dollar", toName: "Brazilian Real", fromCountry: "US", toCountry: "BR" },
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
    intro: "The Philippines receives over $35 billion in remittances annually, making the USD/PHP corridor one of the busiest in the world. The Bangko Sentral ng Pilipinas (BSP) allows the peso to float relatively freely, though it intervenes to smooth excessive volatility. GCash and Maya (formerly PayMaya) have transformed the receiving side, letting recipients access funds instantly via mobile wallet.",
    bullets: [
      "GCash and Maya wallet payouts are near-instant and increasingly preferred over bank deposits",
      "Cash pickup remains important — Cebuana Lhuillier and M Lhuillier have thousands of locations nationwide",
      "Competition on this corridor is fierce, keeping markups lower than many Asian routes",
      "BSP interest rate decisions and US Fed policy are the main rate drivers",
    ],
    tip: "If your recipient has GCash, prioritise providers that support wallet payout — it's faster than bank deposit and avoids any inter-bank delays.",
  },
  "usd-to-mxn": {
    intro: "Mexico is the largest recipient of remittances from the United States, receiving over $63 billion in 2025. The USD/MXN rate is highly liquid and influenced by US-Mexico trade flows, Banxico (Bank of Mexico) interest rate decisions, oil prices, and broader risk sentiment. Mexico's SPEI instant payment system means bank deposits arrive within seconds once processed.",
    bullets: [
      "SPEI enables near-instant bank deposits — most providers deliver within minutes during business hours",
      "Oxxo cash pickup is popular for recipients without bank accounts (available via Western Union, Remitly)",
      "The peso has strengthened significantly since 2023, making it a more expensive corridor for USD senders",
      "Funding via ACH typically saves $3–5 compared to debit card funding",
    ],
    tip: "Mexico's SPEI system makes this one of the fastest corridors in the world. If speed is your priority, choose a provider that supports SPEI payout — your recipient could have the money in minutes.",
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
    intro: "The GBP/EUR exchange rate is the most important currency pair for UK residents sending money to Europe. Since Brexit, the rate has traded in a relatively stable range, though Bank of England and ECB interest rate decisions continue to drive medium-term moves. The EU's 2026 instant payments mandate means euro transfers now settle in under 10 seconds.",
    bullets: [
      "SEPA instant payments mean euro-denominated transfers arrive in seconds, 24/7",
      "Post-Brexit, UK banks no longer offer fee-free euro transfers — specialist providers are almost always cheaper",
      "Wise and Revolut dominate this corridor with markups as low as 0.3–0.5%",
      "The ECB and BoE's relative interest rate paths are the main rate driver — watch for policy divergence",
    ],
    tip: "For regular transfers to Europe (rent, mortgage, family support), consider a multi-currency account with Wise or Revolut — you can convert when the rate is favourable and hold euros until needed.",
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
    intro: "The UK is home to over 1.5 million people of Pakistani heritage, making GBP to PKR one of the highest-volume remittance corridors from Britain. The rate combines sterling's sensitivity to UK economic data with the PKR's ongoing volatility as Pakistan's economy restructures under IMF programmes.",
    bullets: [
      "Cash pickup through JazzCash, Easypaisa, and UBL Omni is widely used alongside bank deposits",
      "Funding via UK Faster Payments is free with most providers and processes within seconds",
      "FCA-regulated providers offer better consumer protection than informal hawala channels",
      "PKR volatility means checking the rate on the day of transfer can save significant amounts",
    ],
    tip: "Avoid converting through a third currency (GBP→USD→PKR). Use a provider that offers direct GBP to PKR conversion to avoid double conversion fees.",
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
    intro: "The USD/BRL rate is among the most volatile of any major emerging market currency pair. Brazil's real is sensitive to fiscal policy, commodity prices (especially iron ore and soybeans), political risk, and Banco Central do Brasil's Selic rate decisions. For US residents sending money to Brazil, the wide rate swings mean timing can make a significant difference — but Brazil's PIX instant payment system makes the receiving experience seamless once funds arrive.",
    bullets: [
      "BRL can move 3–5% in a single week during periods of political or fiscal uncertainty",
      "PIX instant payments mean Brazilian bank deposits arrive in seconds, 24/7",
      "Some providers charge higher fees on emerging market corridors — compare the total cost carefully",
      "The Selic rate (Brazil's benchmark) and US Fed policy divergence are key medium-term drivers",
    ],
    tip: "On volatile corridors like USD to BRL, always compare the all-in cost — some providers offer a 'good' rate but add a hidden fee that makes them expensive overall. Check both the rate and the fee before sending.",
  },
  "usd-to-cny": {
    intro: "USD/CNY (US Dollar to Chinese Yuan Renminbi) is one of the most politically sensitive currency pairs in the world. The People's Bank of China manages the yuan within a daily trading band around a centrally-set fixing rate, meaning the rate does not move freely like most major currencies. For US residents sending money to China, this managed float means less volatility than other corridors, but also fewer provider options due to China's strict capital controls.",
    bullets: [
      "The PBoC sets a daily fixing rate and allows CNY to trade within a ±2% band around it",
      "Capital controls limit the routes available — not all providers support USD to CNY",
      "WeChat Pay and Alipay are widely used for receiving funds, but require Chinese residency to use fully",
      "Bank-to-bank SWIFT transfers are the most common delivery method for international CNY transfers",
    ],
    tip: "Check that your provider explicitly supports CNY delivery to mainland China (not just CNH — the offshore yuan). The two rates can differ, and not all providers offer onshore CNY transfers.",
  },
};

/* ── Static params ────────────────────────────────────────── */
export function generateStaticParams() {
  return CURRENCY_PAIRS.map((p) => ({ pair: p.slug }));
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
  const title = `${p.from} to ${p.to} Exchange Rate Today — Live ${p.fromName} to ${p.toName} (${year})`;
  const description = `Live ${p.from}/${p.to} exchange rate updated every 60 seconds. Compare what ${providers.length}+ transfer providers actually offer vs. the mid-market rate — most add a 0.5–4% hidden markup. Find who gives you the most ${p.toName}.`;

  return {
    title,
    description,
    keywords: `${p.from} to ${p.to} exchange rate, ${p.from} to ${p.to} rate today, ${p.from}/${p.to} ${year}, ${p.fromName} to ${p.toName}, convert ${p.from} to ${p.to}, ${p.from} ${p.to} mid-market rate, cheapest ${p.from} to ${p.to}`,
    alternates: getAlternates(`exchange-rates/${pair}`, locale),
    openGraph: {
      title: `${p.from}→${p.to}: Real Rate vs. What Providers Offer`,
      description: `Live ${p.from}/${p.to} mid-market rate vs. what transfer providers charge. See the markup each provider adds.`,
      url: `https://sendmoneycompare.com/exchange-rates/${pair}`,
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
  const quotes = p.corridor ? generateQuotes(1000, p.from, p.to).slice(0, 8) : [];
  const editorial = editorialContent[pair];

  // Related pairs (same base currency, excluding self)
  const relatedPairs = CURRENCY_PAIRS.filter((rp) => rp.slug !== pair && (rp.from === p.from || rp.to === p.to)).slice(0, 6);

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
          <div className="bg-[var(--color-surface-dim)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-10 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CircleFlag code={p.from} size={36} />
              <svg className="w-5 h-5 text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <CircleFlag code={p.to} size={36} />
            </div>

            <h1 className="text-h3 md:text-h1-plus font-normal text-[var(--color-on-surface)] mb-2 leading-tight">
              {p.fromName} to {p.toName} Exchange Rate
            </h1>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
              Mid-market {p.from}/{p.to} rate — the fairest rate, before provider markups.
            </p>

            {midRate ? (
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl md:text-5xl font-light text-[var(--color-primary)] tabular-nums leading-none">
                    {fmtRate(midRate)}
                  </span>
                  <span className="text-lg text-[var(--color-on-surface-variant)]">{p.to}</span>
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
                  Source: median of multiple independent feeds. For indicative purposes only.
                </p>
              </div>
            ) : (
              <p className="text-[var(--color-on-surface-variant)]">Rate data temporarily unavailable.</p>
            )}
          </div>

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
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8 mb-8">
              <h2 className="text-xl font-medium text-[var(--color-on-surface)] mb-2">
                Compare {p.from} to {p.to} Transfer Rates
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
                What you&apos;d actually receive sending 1,000 {p.from} via each provider today.
              </p>
              <div className="overflow-x-auto">
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
              {p.corridor && (
                <div className="mt-4 pt-4 border-t border-[var(--color-outline)]">
                  <Link
                    href={`/send-money/${p.corridor}`}
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

          {/* How the rate is calculated */}
          <div className="bg-[var(--color-surface-dim)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8 mb-8">
            <h2 className="text-lg font-medium text-[var(--color-on-surface)] mb-3">
              How we calculate the {p.from}/{p.to} mid-market rate
            </h2>
            <div className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed space-y-3">
              <p>
                The mid-market rate is the midpoint between the buy and sell prices on global currency markets — it&apos;s the fairest exchange rate available. We aggregate data from 4 independent sources and take the median value, which eliminates outliers and provides a more reliable rate than any single source.
              </p>
              <p>
                When a money transfer provider quotes you a rate, compare it against the mid-market rate shown on this page. The difference is the provider&apos;s markup — their profit on the currency conversion. On the {p.from}/{p.to} pair, the best providers typically mark up by {midRate && midRate > 100 ? "0.3–1.5%" : "0.2–0.8%"}, while banks can mark up by 2–5%.
              </p>
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
                    ? `Based on today's quotes, ${getProviderName(quotes[0].providerSlug)} is offering the best ${p.from} to ${p.to} rate — sending 1,000 ${p.from} gives your recipient ${quotes[0].receiveAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${p.to}. Rankings shift daily, so compare the full table above before every transfer.${editorial ? " " + editorial.tip : ""}`
                    : `The best ${p.from} to ${p.to} provider varies day to day. Specialist providers like Wise, Revolut, and OFX consistently beat banks on rate — compare above before every transfer.${editorial ? " " + editorial.tip : ""}`,
                },
                {
                  q: `How much does it cost to convert ${p.fromName} to ${p.toName}?`,
                  a: `The total cost of a ${p.from} to ${p.to} transfer has two parts: the exchange rate markup (the gap between the mid-market rate and the provider's rate) and any flat fee. The best specialist providers on this corridor typically charge a markup of ${midRate && midRate > 100 ? "0.3–1.5%" : "0.2–0.8%"} plus a small flat fee, while banks can add 2–5% in markup. The table above shows you exactly how much ${p.to} your recipient would receive from each provider on a 1,000 ${p.from} transfer.`,
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
                    : `Specialist providers like Wise, Revolut, and OFX consistently beat banks on ${p.from} to ${p.to}. Always compare before sending.`,
                },
              },
              {
                "@type": "Question",
                name: `How much does it cost to convert ${p.fromName} to ${p.toName}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `The total cost has two parts: the exchange rate markup and any flat fee. The best providers on ${p.from}/${p.to} typically charge ${midRate && midRate > 100 ? "0.3–1.5%" : "0.2–0.8%"} in markup plus a small flat fee, while banks can add 2–5%.`,
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
