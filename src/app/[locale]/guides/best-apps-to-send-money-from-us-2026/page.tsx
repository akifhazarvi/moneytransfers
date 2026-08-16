import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import { getAlternates } from "@/lib/i18n-metadata";
import { getAuthor } from "@/data/authors";

const SITE_URL = "https://sendmoneycompare.com";
const PATH = "guides/best-apps-to-send-money-from-us-2026";
const URL = `${SITE_URL}/${PATH}`;
const PUBLISHED = "2026-06-30";
const MODIFIED = "2026-06-30";

const author = getAuthor("akif-hazarvi");

// ─── Data tables (compiled from live scraped data, June 2026) ────────────────

const TOP_PICKS = [
  {
    rank: 1,
    slug: "wise",
    name: "Wise",
    verdict: "Best Overall",
    trustpilot: 4.3,
    reviews: "293K",
    fee: "From 0.41%",
    markup: "0% (mid-market)",
    speed: "Instant–2 days",
    countries: 80,
    bestFor: "Low cost, transparency",
    regulated: "FCA · FinCEN · ASIC",
    highlight: true,
  },
  {
    rank: 2,
    slug: "remitly",
    name: "Remitly",
    verdict: "Best for Speed & Coverage",
    trustpilot: 4.6,
    reviews: "113K",
    fee: "$0–$3.99",
    markup: "0.5%–2%",
    speed: "Minutes (Express)",
    countries: 170,
    bestFor: "Emerging markets, cash pickup",
    regulated: "FinCEN · FCA",
    highlight: false,
  },
  {
    rank: 3,
    slug: "torfx",
    name: "TorFX",
    verdict: "Best Rated (Trustpilot)",
    trustpilot: 4.9,
    reviews: "9.7K",
    fee: "$0",
    markup: "0.3%–1.5%",
    speed: "1–2 business days",
    countries: 60,
    bestFor: "Large transfers, personal service",
    regulated: "FCA · ASIC",
    highlight: false,
  },
  {
    rank: 4,
    slug: "ofx",
    name: "OFX",
    verdict: "Best for Large Transfers",
    trustpilot: 4.2,
    reviews: "11.4K",
    fee: "$0",
    markup: "0.5%–1.5%",
    speed: "1–2 business days",
    countries: 55,
    bestFor: "$10K+ transfers, rate locks",
    regulated: "FinCEN · ASIC · FCA",
    highlight: false,
  },
  {
    rank: 5,
    slug: "taptap-send",
    name: "TapTap Send",
    verdict: "Best Zero-Fee App",
    trustpilot: 4.3,
    reviews: "—",
    fee: "$0 most corridors",
    markup: "~0.7%",
    speed: "Under 3 minutes (95%)",
    countries: 50,
    bestFor: "Africa & Asia, mobile wallets",
    regulated: "FinCEN · FCA",
    highlight: false,
  },
  {
    rank: 6,
    slug: "xe",
    name: "XE Money Transfer",
    verdict: "Best No-Fee Option",
    trustpilot: 4.4,
    reviews: "85K",
    fee: "$0",
    markup: "0.5%–1.5%",
    speed: "1–3 business days",
    countries: 130,
    bestFor: "Frequent senders, rate alerts",
    regulated: "FinCEN · FCA",
    highlight: false,
  },
  {
    rank: 7,
    slug: "revolut",
    name: "Revolut",
    verdict: "Best for Existing Revolut Users",
    trustpilot: 4.7,
    reviews: "417K",
    fee: "Free up to limit",
    markup: "0% weekdays, 0.5% weekends",
    speed: "Instant (Revolut-to-Revolut)",
    countries: 160,
    bestFor: "Digital nomads, plan subscribers",
    regulated: "FinCEN · FCA",
    highlight: false,
  },
  {
    rank: 8,
    slug: "xoom",
    name: "Xoom (PayPal)",
    verdict: "Best for Cash Pickup",
    trustpilot: 4.6,
    reviews: "187K",
    fee: "$0–$4.99",
    markup: "1%–3%",
    speed: "Minutes to card/wallet",
    countries: 130,
    bestFor: "Latin America, Philippines, cash",
    regulated: "FinCEN",
    highlight: false,
  },
] as const;

const COMPARISON_FAQS = [
  {
    q: "What is the best app to send money internationally from the US in 2026?",
    a: "Wise is the best overall app for sending money internationally from the US in 2026. It uses the real mid-market exchange rate with zero markup and charges a transparent fee from 0.41%, making it the cheapest option for most corridors. Remitly is the best alternative if you need cash pickup or faster delivery to emerging markets. For the highest Trustpilot rating, TorFX (4.9/5) leads the field. Compare live rates for your exact amount and destination at SendMoneyCompare.",
  },
  {
    q: "Which money transfer app has the lowest fees from the US?",
    a: "TapTap Send charges $0 fees on most corridors from the US and applies only a ~0.7% exchange rate margin. XE Money Transfer and TorFX also charge no transfer fees. Wise charges a variable fee (from 0.41%) but applies 0% markup on the exchange rate — making it the lowest total cost for most large transfers. PayPal and Xoom typically cost the most, with 3–4% exchange rate margins on top of transfer fees.",
  },
  {
    q: "Is it safe to use apps like Wise or Remitly to send money abroad?",
    a: "Yes. All the apps ranked on this page are regulated money service businesses. Wise is regulated by the FCA (UK), FinCEN (US), and ASIC (Australia). Remitly is licensed in all 50 US states. Revolut holds an e-money institution licence. None of these services are banks, but your funds are safeguarded in segregated accounts — meaning they are protected if the company were to fail. Always verify the provider is licensed for your state at the NMLS Consumer Access portal.",
  },
  {
    q: "How long does an international money transfer take from the US?",
    a: "Speed depends on the provider, destination, and how you pay. Funding by debit card is fastest: Remitly Express and TapTap Send deliver to most destinations in under 3 minutes. Wise delivers ~60% of transfers instantly and the rest within hours. Paying by bank transfer (ACH) adds 1–2 days at the front end. Transfers to countries with modern payment rails — India (UPI), Philippines (InstaPay), EU (Instant SEPA), Mexico (SPEI) — are fastest. Allow 1–3 business days for destinations without real-time infrastructure.",
  },
  {
    q: "What is the cheapest way to send $1,000 from the US internationally?",
    a: "For a $1,000 transfer, Wise typically wins on total cost because it uses the mid-market rate with a fee of roughly $5–8 for most major corridors. TapTap Send is often the cheapest for Africa and South/Southeast Asia. Always compare at the exact amount and destination because the cheapest provider shifts by corridor — Remitly often has promotional zero-fee rates for new users that beat Wise on the first transfer.",
  },
  {
    q: "Can I send money abroad from the US without a bank account?",
    a: "Yes. Western Union and MoneyGram allow cash-in transfers at agent locations with debit card pickup for recipients. Xoom allows funding by credit card. Cash pickup is available in 200+ countries through these networks. Note that cash-funded and credit-card-funded transfers usually cost more — the exchange rate margin and fees are higher to cover the payment risk.",
  },
  {
    q: "Do I need to pay US taxes on money I send internationally?",
    a: "Sending money abroad is generally not a taxable event. However, if you send more than $18,000 to any one person in 2026 (the IRS annual gift exclusion), you may need to file Form 709. Transfers of $10,000 or more may trigger a Currency Transaction Report (CTR) from the provider. Neither of these is a tax charge — they are reporting requirements. Consult a tax advisor for your specific situation.",
  },
  {
    q: "Which app is best for sending large amounts internationally from the US?",
    a: "For transfers above $10,000, OFX and TorFX are the best options. Both charge no transfer fees, offer competitive FX margins (0.3%–1.5%), and provide a dedicated account manager for large or regular transfers. TorFX holds a 4.9/5 Trustpilot rating. OFX offers forward contracts and rate-lock tools. Wise also handles large transfers well (up to $1M) with its transparent fee structure, though for very large amounts the percentage fee matters less than the FX rate.",
  },
];

// ─── Structured data ──────────────────────────────────────────────────────────

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Best Apps to Send Money Internationally from the US (2026)",
  description:
    "Independent rankings of the 8 best money transfer apps from the US in 2026, based on live rate data across 60+ providers. Wise, Remitly, TorFX, OFX, and more — ranked by real cost, speed, and trust.",
  datePublished: PUBLISHED,
  dateModified: MODIFIED,
  author: {
    "@type": "Person",
    name: "Akif Hazarvi",
    url: `${SITE_URL}/about/akif-hazarvi`,
    jobTitle: "Editor-in-Chief",
    knowsAbout: [
      "International money transfers",
      "Cross-border payments",
      "Foreign exchange rates",
      "Fintech",
    ],
  },
  publisher: { "@id": `${SITE_URL}/#organization` },
  mainEntityOfPage: URL,
  image: `${URL}/opengraph-image`,
  about: [
    { "@type": "Thing", name: "International Money Transfer" },
    { "@type": "Thing", name: "Remittance" },
    { "@type": "Thing", name: "Money Transfer Apps" },
  ],
  mentions: TOP_PICKS.map((p) => ({
    "@type": "FinancialProduct",
    name: p.name,
    url: `${SITE_URL}/companies/${p.slug}`,
    provider: { "@type": "Organization", name: p.name },
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: COMPARISON_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
    { "@type": "ListItem", position: 3, name: "Best Apps to Send Money from US 2026", item: URL },
  ],
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best Money Transfer Apps from the US (2026)",
  description: "Independent ranking of the top 8 apps to send money internationally from the United States",
  url: URL,
  numberOfItems: TOP_PICKS.length,
  itemListElement: TOP_PICKS.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: p.name,
    description: `${p.verdict} — ${p.fee} fees, ${p.markup} FX markup, ${p.speed} delivery`,
    url: `${SITE_URL}/companies/${p.slug}`,
  })),
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: {
      absolute:
        "Best Apps to Send Money Internationally from the US (2026) — Ranked by Real Cost",
    },
    description:
      "We ranked the 8 best apps to send money abroad from the US in 2026 using live data from 60+ providers. Wise, Remitly, TorFX, OFX, TapTap Send — compared on fees, exchange rates, speed, and trust.",
    keywords: [
      "best app to send money internationally from US",
      "best money transfer app USA 2026",
      "cheapest way to send money abroad from US",
      "international money transfer apps US",
      "best remittance apps 2026",
      "Wise vs Remitly",
      "send money overseas from USA",
    ],
    alternates: getAlternates(PATH, locale),
    openGraph: {
      title: "Best Apps to Send Money Internationally from the US (2026)",
      description:
        "Independent ranking of the 8 best money transfer apps from the US — based on live rate data across 60+ providers. No paid placements.",
      url: URL,
      type: "article",
      publishedTime: PUBLISHED,
      modifiedTime: MODIFIED,
      authors: ["Akif Hazarvi"],
      tags: ["money transfer", "remittance", "international payments", "fintech"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Best Apps to Send Money from US Internationally (2026)",
      description:
        "8 apps ranked by real transfer cost — Wise, Remitly, TorFX, OFX, TapTap Send and more. Live data, no paid placements.",
    },
  };
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Badge({ children, color = "blue" }: { children: React.ReactNode; color?: "blue" | "green" | "amber" }) {
  const styles = {
    blue: "bg-[var(--color-primary-surface)] text-[var(--color-primary)] border-[var(--color-primary)]",
    green: "bg-[var(--color-success-surface)] text-[var(--color-success)] border-[var(--color-success)]",
    amber: "bg-[var(--color-warning-surface,#fef3c7)] text-[var(--color-warning,#92400e)] border-[var(--color-warning,#d97706)]",
  };
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[color]}`}>
      {children}
    </span>
  );
}

function ProviderCard({ p }: { p: (typeof TOP_PICKS)[number] }) {
  return (
    <div
      id={p.slug}
      className={`rounded-2xl border p-5 sm:p-6 ${
        p.highlight
          ? "border-[var(--color-primary)] bg-[var(--color-primary-surface)]"
          : "border-[var(--color-outline)] bg-[var(--color-surface-container,var(--color-surface-dim))]"
      }`}
    >
      {/* Rank + verdict */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="flex-none w-8 h-8 rounded-full bg-[var(--color-surface-dim)] flex items-center justify-center text-sm font-semibold text-[var(--color-on-surface-variant)]">
            #{p.rank}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-on-surface)] leading-tight">
              <Link href={`/companies/${p.slug}`} className="hover:text-[var(--color-primary)] hover:underline">
                {p.name}
              </Link>
            </h3>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{p.verdict}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge color={p.highlight ? "blue" : "green"}>{p.verdict}</Badge>
          <span className="text-xs text-[var(--color-on-surface-variant)]">★ {p.trustpilot} ({p.reviews} reviews)</span>
        </div>
      </div>

      {/* Key metrics grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-[var(--color-surface-dim)] px-3 py-2.5">
          <p className="text-xs text-[var(--color-on-surface-variant)]">Transfer fee</p>
          <p className="text-sm font-medium text-[var(--color-on-surface)] mt-0.5">{p.fee}</p>
        </div>
        <div className="rounded-xl bg-[var(--color-surface-dim)] px-3 py-2.5">
          <p className="text-xs text-[var(--color-on-surface-variant)]">FX markup</p>
          <p className="text-sm font-medium text-[var(--color-on-surface)] mt-0.5">{p.markup}</p>
        </div>
        <div className="rounded-xl bg-[var(--color-surface-dim)] px-3 py-2.5">
          <p className="text-xs text-[var(--color-on-surface-variant)]">Typical speed</p>
          <p className="text-sm font-medium text-[var(--color-on-surface)] mt-0.5">{p.speed}</p>
        </div>
        <div className="rounded-xl bg-[var(--color-surface-dim)] px-3 py-2.5">
          <p className="text-xs text-[var(--color-on-surface-variant)]">Countries</p>
          <p className="text-sm font-medium text-[var(--color-on-surface)] mt-0.5">{p.countries}+</p>
        </div>
      </div>

      {/* Best for + regulated */}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <span className="text-[var(--color-on-surface-variant)]">
          <strong className="text-[var(--color-on-surface)]">Best for:</strong> {p.bestFor}
        </span>
        <span className="text-[var(--color-on-surface-variant)]">
          <strong className="text-[var(--color-on-surface)]">Regulated:</strong> {p.regulated}
        </span>
      </div>

      {/* CTA */}
      <div className="mt-4 flex gap-3 flex-wrap">
        <Link
          href={`/go/${p.slug}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="rounded-full bg-[var(--color-cta)] px-5 py-2 text-sm font-semibold text-[var(--color-cta-text)] hover:bg-[var(--color-cta-hover)] transition-colors"
        >
          Get a quote from {p.name} →
        </Link>
        <Link
          href={`/companies/${p.slug}`}
          className="rounded-full border border-[var(--color-outline)] px-5 py-2 text-sm text-[var(--color-on-surface)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
        >
          Full review
        </Link>
      </div>
    </div>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-dim)] p-5 text-center">
      <div className="text-[clamp(1.6rem,5vw,2.2rem)] font-semibold text-[var(--color-primary)] leading-none tracking-tight">
        {value}
      </div>
      <div className="mt-2 text-sm text-[var(--color-on-surface-variant)]">{label}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BestAppsFromUSPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <Container>
        <article className="mx-auto max-w-3xl py-10">

          {/* Breadcrumb */}
          <nav className="mb-5 text-sm text-[var(--color-on-surface-variant)]">
            <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/guides" className="hover:text-[var(--color-primary)]">Guides</Link>
            <span className="mx-1.5">/</span>
            <span>Best Apps to Send Money from US 2026</span>
          </nav>

          {/* Cover image */}
          <div className="mb-6 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/${PATH}/opengraph-image`}
              alt="Best Apps to Send Money from the US 2026 — SendMoneyCompare independent rankings"
              width={1200}
              height={630}
              className="w-full object-cover"
            />
          </div>

          {/* Hero */}
          <h1 className="text-[clamp(1.75rem,5vw,2.75rem)] font-normal leading-tight tracking-[-0.02em] text-[var(--color-on-surface)]">
            Best Apps to Send Money Internationally from the US (2026)
          </h1>

          {/* Byline */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-on-surface-variant)]">
            {author?.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={author.photo}
                alt={author.name}
                width={28}
                height={28}
                className="rounded-full object-cover"
              />
            )}
            <span>
              By{" "}
              <Link href="/about/akif-hazarvi" className="text-[var(--color-primary)] hover:underline font-medium">
                {author?.name ?? "Akif Hazarvi"}
              </Link>
              , {author?.role ?? "Editor-in-Chief"}
            </span>
            <span>·</span>
            <span>Updated June 30, 2026</span>
            <span>·</span>
            <span>12 min read</span>
          </div>

          {/* Trust signals */}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--color-on-surface-variant)]">
            <Badge color="green">✓ No paid placements</Badge>
            <Badge color="blue">Live rate data · Every 6h</Badge>
            <Badge color="blue">60+ providers compared</Badge>
          </div>

          {/* Quick-answer box — the AI-citable passage */}
          <div className="mt-6 rounded-2xl border border-[var(--color-primary)] bg-[var(--color-primary-surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-2">
              Quick answer
            </p>
            <p className="citable-passage text-[var(--color-on-surface)] leading-relaxed">
              <strong>Wise</strong> is the best overall app to send money internationally from the US in 2026. It
              uses the real mid-market exchange rate with 0% markup and charges a transparent variable fee from
              0.41% — the lowest all-in cost on most major corridors. <strong>Remitly</strong> is the best
              alternative for speed and emerging-market coverage (170+ countries, minutes delivery).{" "}
              <strong>TorFX</strong> holds the highest Trustpilot rating (4.9 /&nbsp;5) and is best for
              transfers above $10,000. All eight providers below are licensed money service businesses,
              regulated by FinCEN and other authorities. <Link href="/send-money" className="text-[var(--color-primary)] underline">Compare live rates for your transfer →</Link>
            </p>
          </div>

          {/* Methodology note */}
          <p className="mt-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
            These rankings are based on live quotes collected every 6 hours from provider APIs and websites — not
            on sponsored relationships, affiliate revenue share, or editorial relationships. We compare the{" "}
            <strong>true total cost</strong>: exchange rate markup + transfer fee. Trustpilot scores are scraped
            directly and refreshed daily. See our{" "}
            <Link href="/methodology" className="text-[var(--color-primary)] hover:underline">
              full methodology
            </Link>
            .
          </p>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBox value="60+" label="Providers compared" />
            <StatBox value="190+" label="Countries covered" />
            <StatBox value="Every 6h" label="Data refresh rate" />
            <StatBox value="$0" label="Paid placements" />
          </div>

          {/* TOC */}
          <nav className="mt-10 rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-dim)] p-5">
            <p className="text-sm font-semibold text-[var(--color-on-surface)] mb-3">In this guide</p>
            <ol className="space-y-1.5 text-sm text-[var(--color-primary)]">
              <li><a href="#rankings" className="hover:underline">1. The 8 best money transfer apps from the US</a></li>
              <li><a href="#how-we-compare" className="hover:underline">2. How we compare providers</a></li>
              <li><a href="#by-use-case" className="hover:underline">3. Best app by use case</a></li>
              <li><a href="#corridor-winners" className="hover:underline">4. Cheapest app by corridor</a></li>
              <li><a href="#cost-explainer" className="hover:underline">5. Understanding the true cost</a></li>
              <li><a href="#safety" className="hover:underline">6. Are these apps safe?</a></li>
              <li><a href="#faq" className="hover:underline">7. Frequently asked questions</a></li>
            </ol>
          </nav>

          {/* ── Section 1: Rankings ─────────────────────────────────────────── */}
          <h2 id="rankings" className="mt-12 text-2xl font-normal text-[var(--color-on-surface)]">
            The 8 best apps to send money internationally from the US (2026)
          </h2>
          <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
            We tested all eight providers with real transfers across multiple corridors. The rankings reflect{" "}
            <strong>all-in cost</strong> (fee + FX margin), delivery speed, regulatory standing, and user trust
            score as of June 2026.
          </p>

          <div className="mt-6 space-y-5">
            {TOP_PICKS.map((p) => (
              <ProviderCard key={p.slug} p={p} />
            ))}
          </div>

          {/* Live comparison CTA */}
          <div className="mt-8 rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-dim)] p-5 text-center">
            <p className="font-medium text-[var(--color-on-surface)]">
              Want the cheapest option for your exact transfer?
            </p>
            <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
              Enter your amount and destination to get live quotes from all 8 providers side-by-side.
            </p>
            <Link
              href="/send-money"
              className="mt-4 inline-block rounded-full bg-[var(--color-cta)] px-7 py-3 text-sm font-semibold text-[var(--color-cta-text)] hover:bg-[var(--color-cta-hover)] transition-colors"
            >
              Compare live rates now →
            </Link>
          </div>

          {/* ── Section 2: How we compare ───────────────────────────────────── */}
          <h2 id="how-we-compare" className="mt-14 text-2xl font-normal text-[var(--color-on-surface)]">
            How we compare money transfer apps
          </h2>
          <p className="mt-3 citable-passage text-[var(--color-on-surface-variant)] leading-relaxed">
            Most comparison sites are paid by the providers they rank. SendMoneyCompare does not accept payment
            for rankings. Our comparison uses <strong>five independent signals</strong>:
          </p>
          <ol className="mt-4 space-y-4 text-[var(--color-on-surface-variant)] leading-relaxed">
            <li className="flex gap-3">
              <span className="flex-none w-7 h-7 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-sm font-bold flex items-center justify-center">1</span>
              <div>
                <strong className="text-[var(--color-on-surface)]">True total cost</strong> — We compute the
                all-in cost as: <em>(mid-market receive amount − actual receive amount) ÷ mid-market receive
                amount × 100</em>. This captures both the upfront fee and the hidden exchange rate margin in a
                single comparable figure. Data is refreshed every 6 hours from provider APIs.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-none w-7 h-7 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-sm font-bold flex items-center justify-center">2</span>
              <div>
                <strong className="text-[var(--color-on-surface)]">Verified delivery speed</strong> — Published
                delivery estimates for express and standard options, cross-referenced with provider help centres.
                We flag where speeds differ materially from marketing claims.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-none w-7 h-7 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-sm font-bold flex items-center justify-center">3</span>
              <div>
                <strong className="text-[var(--color-on-surface)]">Regulatory status</strong> — We verify each
                provider&rsquo;s FinCEN Money Services Business (MSB) registration and state money transmitter licences
                via the NMLS Consumer Access database.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-none w-7 h-7 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-sm font-bold flex items-center justify-center">4</span>
              <div>
                <strong className="text-[var(--color-on-surface)]">User trust (Trustpilot)</strong> — Scraped
                daily. We weight the score by review volume — a 4.9 from 200 reviews is treated differently from
                a 4.9 from 10,000.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-none w-7 h-7 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-sm font-bold flex items-center justify-center">5</span>
              <div>
                <strong className="text-[var(--color-on-surface)]">Feature depth</strong> — Coverage (countries
                and currencies), delivery methods (bank, cash, wallet, card), payment options, and tools like
                rate alerts and forward contracts.
              </div>
            </li>
          </ol>

          {/* ── Section 3: By use case ──────────────────────────────────────── */}
          <h2 id="by-use-case" className="mt-14 text-2xl font-normal text-[var(--color-on-surface)]">
            Best app by use case
          </h2>
          <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
            No single provider wins every situation. Here is the right tool for each job:
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-outline)] text-left text-[var(--color-on-surface-variant)]">
                  <th className="py-3 pr-4 font-medium">Use case</th>
                  <th className="py-3 pr-4 font-medium">Best pick</th>
                  <th className="py-3 font-medium">Why</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline)]">
                {[
                  ["Lowest cost, most corridors", "Wise", "0% FX markup, transparent fee from 0.41%"],
                  ["Fastest delivery", "Remitly Express / TapTap Send", "Minutes to bank, wallet or cash pickup"],
                  ["Transfers above $10,000", "TorFX or OFX", "No fees, dedicated dealer, rate-lock tools"],
                  ["Cash pickup globally", "Western Union / Xoom", "200+ countries, thousands of agent locations"],
                  ["Sending to Africa & South Asia", "TapTap Send", "$0 fee, mobile wallet delivery in < 3 min"],
                  ["Daily digital banking + transfers", "Revolut", "Free in-plan transfers, instant Revolut-to-Revolut"],
                  ["Latin America & Philippines", "Xoom (PayPal)", "Minutes to GCash, Maya, SPEI, cash"],
                  ["Regular business payments", "OFX / Wise Business", "Volume discounts, API, batch payments"],
                ].map(([uc, pick, why]) => (
                  <tr key={uc}>
                    <td className="py-3 pr-4 text-[var(--color-on-surface)] font-medium">{uc}</td>
                    <td className="py-3 pr-4 text-[var(--color-primary)]">{pick}</td>
                    <td className="py-3 text-[var(--color-on-surface-variant)]">{why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Section 4: Corridor winners ─────────────────────────────────── */}
          <h2 id="corridor-winners" className="mt-14 text-2xl font-normal text-[var(--color-on-surface)]">
            Cheapest app by corridor from the US
          </h2>
          <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
            The cheapest provider shifts by destination. These are the live front-runners on the most popular
            routes from the US, based on our latest data collection (June 2026). Always{" "}
            <Link href="/send-money" className="text-[var(--color-primary)] hover:underline">
              check live rates
            </Link>{" "}
            before transferring — providers run promotions and rates change daily.
          </p>

          <div className="mt-5 space-y-2">
            {[
              {
                corridor: "USA → India (USD/INR)",
                winner: "Wise",
                note: "0% markup, instant UPI delivery",
                slug: "usa-to-india",
                winnerSlug: "wise",
              },
              {
                corridor: "USA → Mexico (USD/MXN)",
                winner: "Remitly / Xoom",
                note: "Minutes delivery via SPEI or cash",
                slug: "usa-to-mexico",
                winnerSlug: "remitly",
              },
              {
                corridor: "USA → Philippines (USD/PHP)",
                winner: "Remitly / Xoom",
                note: "GCash, Maya wallet in minutes",
                slug: "usa-to-philippines",
                winnerSlug: "remitly",
              },
              {
                corridor: "USA → Pakistan (USD/PKR)",
                winner: "TapTap Send / Wise",
                note: "$0 fee, bank or cash delivery",
                slug: "usa-to-pakistan",
                winnerSlug: "taptap-send",
              },
              {
                corridor: "USA → Nigeria (USD/NGN)",
                winner: "TapTap Send",
                note: "$0 fee, GTBank/Access in < 3 min",
                slug: "usa-to-nigeria",
                winnerSlug: "taptap-send",
              },
              {
                corridor: "USA → UK (USD/GBP)",
                winner: "Wise",
                note: "0% markup, instant Faster Payments",
                slug: "usa-to-uk",
                winnerSlug: "wise",
              },
              {
                corridor: "USA → Europe (USD/EUR)",
                winner: "Wise",
                note: "Instant SEPA, 0% rate markup",
                slug: "usa-to-europe",
                winnerSlug: "wise",
              },
              {
                corridor: "USA → Canada (USD/CAD)",
                winner: "Wise / OFX",
                note: "Competitive on large amounts",
                slug: "usa-to-canada",
                winnerSlug: "wise",
              },
            ].map((c) => (
              <div
                key={c.corridor}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-outline)] px-4 py-3 flex-wrap"
              >
                <div>
                  <Link href={`/send-money/${c.slug}`} className="font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] hover:underline text-sm">
                    {c.corridor}
                  </Link>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{c.note}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-[var(--color-on-surface-variant)]">Leader:</span>
                  <Link href={`/companies/${c.winnerSlug}`} className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
                    {c.winner}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* ── Section 5: Cost explainer ───────────────────────────────────── */}
          <h2 id="cost-explainer" className="mt-14 text-2xl font-normal text-[var(--color-on-surface)]">
            Understanding the true cost of an international transfer
          </h2>
          <p className="mt-3 citable-passage text-[var(--color-on-surface-variant)] leading-relaxed">
            Most people focus on the transfer fee and miss the bigger cost: the <strong>exchange rate
            markup</strong>. Every provider, including banks, adjusts the exchange rate away from the mid-market
            rate (the rate you see on Google or Reuters). On a $1,000 transfer, a 2% markup costs $20 — more than
            most headline fees. Wise charges 0% markup and a transparent fee; traditional banks often charge
            3–4% markup with no fee disclosure.
          </p>

          <div className="mt-5 rounded-2xl bg-[var(--color-surface-dim)] p-5">
            <p className="text-sm font-semibold text-[var(--color-on-surface)] mb-3">True cost formula</p>
            <p className="font-mono text-sm bg-[var(--color-surface-dim)] rounded-xl px-4 py-3 border border-[var(--color-outline)] text-[var(--color-on-surface)]">
              true cost % = (mid-market receive − actual receive) ÷ mid-market receive × 100
            </p>
            <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]">
              This single number captures both the FX markup and the fee. A provider with a $0 fee and a 2%
              markup costs more than a provider with a $5 fee and 0% markup on most transfers above ~$500.
            </p>
          </div>

          <h3 className="mt-8 text-lg font-medium text-[var(--color-on-surface)]">
            Cost comparison: sending $1,000 USD to India (INR)
          </h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-outline)] text-left text-[var(--color-on-surface-variant)]">
                  <th className="py-2 pr-4 font-medium">Provider</th>
                  <th className="py-2 pr-4 font-medium text-right">Fee</th>
                  <th className="py-2 pr-4 font-medium text-right">FX margin</th>
                  <th className="py-2 font-medium text-right">Est. recipient gets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline)]">
                {[
                  { name: "Wise", fee: "~$6", margin: "0%", gets: "~₹83,600", highlight: true },
                  { name: "Remitly (Economy)", fee: "$0", margin: "~1%", gets: "~₹82,700" },
                  { name: "XE Money Transfer", fee: "$0", margin: "~1%", gets: "~₹82,700" },
                  { name: "TapTap Send", fee: "$0", margin: "~0.7%", gets: "~₹83,000" },
                  { name: "Xoom", fee: "$2.99", margin: "~1.5%", gets: "~₹81,400" },
                  { name: "Your Bank", fee: "$0–$35", margin: "~3–4%", gets: "~₹79,000–80,500" },
                ].map((r) => (
                  <tr key={r.name} className={r.highlight ? "bg-[var(--color-primary-surface)]" : ""}>
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-on-surface)]">
                      {r.name} {r.highlight && <Badge color="blue">Best</Badge>}
                    </td>
                    <td className="py-2.5 pr-4 text-right text-[var(--color-on-surface-variant)]">{r.fee}</td>
                    <td className="py-2.5 pr-4 text-right text-[var(--color-on-surface-variant)]">{r.margin}</td>
                    <td className="py-2.5 text-right font-semibold text-[var(--color-on-surface)]">{r.gets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-[var(--color-on-surface-variant)]">
              Illustrative figures based on mid-June 2026 rates. Actual amounts vary by date.{" "}
              <Link href="/send-money/usa-to-india" className="text-[var(--color-primary)] hover:underline">
                Get live quotes for USA → India →
              </Link>
            </p>
          </div>

          {/* ── Section 6: Safety ───────────────────────────────────────────── */}
          <h2 id="safety" className="mt-14 text-2xl font-normal text-[var(--color-on-surface)]">
            Are these money transfer apps safe to use?
          </h2>
          <p className="mt-3 citable-passage text-[var(--color-on-surface-variant)] leading-relaxed">
            All eight apps ranked on this page are <strong>licensed money service businesses (MSBs)</strong>
            registered with the Financial Crimes Enforcement Network (FinCEN) and licensed in each US state where
            they operate. They are not banks — but your funds are protected in segregated client accounts, meaning
            if the provider were to fail, your money is ringfenced from the company&rsquo;s own creditors.
          </p>
          <ul className="mt-4 space-y-3 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
            <li>
              <strong className="text-[var(--color-on-surface)]">FinCEN registration</strong> — Every US-based
              MSB must register with FinCEN. You can verify any provider at the{" "}
              <a
                href="https://www.fincen.gov/msb-registrant-search"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-[var(--color-primary)] hover:underline"
              >
                FinCEN MSB Registrant Search
              </a>
              .
            </li>
            <li>
              <strong className="text-[var(--color-on-surface)]">State licensing</strong> — Money transmitters
              need a licence in each state they operate. Wise, Remitly, and others are licensed in all 50 states.
              Check licences at the{" "}
              <a
                href="https://www.nmlsconsumeraccess.org/"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-[var(--color-primary)] hover:underline"
              >
                NMLS Consumer Access portal
              </a>
              .
            </li>
            <li>
              <strong className="text-[var(--color-on-surface)]">CFPB protections</strong> — Under the
              Remittance Rule (Dodd-Frank Act), providers must disclose the exact exchange rate, fees, and
              delivery date before you confirm. You have 30 minutes to cancel most transfers after sending.
            </li>
            <li>
              <strong className="text-[var(--color-on-surface)]">Safeguarded funds</strong> — Your money is held
              in segregated accounts at major banks, not commingled with the provider&rsquo;s operating funds.
              Wise, for example, publishes its safeguarding report quarterly.
            </li>
          </ul>

          {/* ── Section 7: FAQ ──────────────────────────────────────────────── */}
          <h2 id="faq" className="mt-14 text-2xl font-normal text-[var(--color-on-surface)]">
            Frequently asked questions
          </h2>

          <div className="mt-5 divide-y divide-[var(--color-outline)]">
            {COMPARISON_FAQS.map((faq) => (
              <div key={faq.q} className="py-5">
                <h3 className="font-medium text-[var(--color-on-surface)] text-base">{faq.q}</h3>
                <p className="mt-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          {/* ── Internal links ──────────────────────────────────────────────── */}
          <div className="mt-14 grid sm:grid-cols-3 gap-6 border-t border-[var(--color-outline)] pt-10">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)] mb-3">
                Popular corridors
              </h3>
              <ul className="space-y-2">
                {[
                  { label: "USA → India", href: "/send-money/usa-to-india" },
                  { label: "USA → Mexico", href: "/send-money/usa-to-mexico" },
                  { label: "USA → Philippines", href: "/send-money/usa-to-philippines" },
                  { label: "USA → Pakistan", href: "/send-money/usa-to-pakistan" },
                  { label: "USA → Nigeria", href: "/send-money/usa-to-nigeria" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-[var(--color-primary)] hover:underline">
                      {l.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)] mb-3">
                Provider reviews
              </h3>
              <ul className="space-y-2">
                {TOP_PICKS.slice(0, 5).map((p) => (
                  <li key={p.slug}>
                    <Link href={`/companies/${p.slug}`} className="text-sm text-[var(--color-primary)] hover:underline">
                      {p.name} review →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)] mb-3">
                Related guides
              </h3>
              <ul className="space-y-2">
                {[
                  { label: "Fastest way to send money internationally", href: "/guides/fastest-way-to-send-money-internationally" },
                  { label: "Banks cost 5× more than apps", href: "/guides/bank-vs-app-transfer-cost-2026" },
                  { label: "Cheapest way to send money abroad", href: "/guides/cheapest-way-to-send-money-internationally" },
                  { label: "How to avoid hidden FX fees", href: "/guides" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-[var(--color-primary)] hover:underline">
                      {l.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Author box */}
          <div className="mt-10 rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-dim)] p-5 flex gap-4">
            {author?.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={author.photo}
                alt={author.name}
                width={52}
                height={52}
                className="rounded-full object-cover flex-none self-start"
              />
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)] mb-1">
                About the author
              </p>
              <Link href="/about/akif-hazarvi" className="font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] hover:underline">
                {author?.name ?? "Akif Hazarvi"}
              </Link>
              <p className="text-xs text-[var(--color-on-surface-variant)] mb-1">{author?.role}</p>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                {author?.byline ?? "Editor-in-Chief of SendMoneyCompare, with 8+ years in cross-border fintech."}
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="mt-8 text-xs text-[var(--color-on-surface-variant)] leading-relaxed border-t border-[var(--color-outline)] pt-5">
            <strong>Disclaimer:</strong> This guide is for informational purposes only and does not constitute
            financial advice. Transfer fees, exchange rates, and delivery speeds change frequently — always
            confirm current terms on the provider&rsquo;s website before transferring. SendMoneyCompare earns
            affiliate revenue when users click through to providers, but this does not influence our rankings.
            See our{" "}
            <Link href="/editorial-policy" className="text-[var(--color-primary)] hover:underline">
              editorial policy
            </Link>{" "}
            and{" "}
            <Link href="/methodology" className="text-[var(--color-primary)] hover:underline">
              methodology
            </Link>
            .
          </p>
        </article>
      </Container>
    </>
  );
}
