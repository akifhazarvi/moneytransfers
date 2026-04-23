/**
 * /compare-money-transfer — Hub landing page targeting generic comparison queries.
 *
 * Built Apr 20 from GSC data showing:
 * - "compare money transfer" (30 UK + 35 US impr, pos 90+)
 * - "compare money transfer rates" (21 UK + 24 US impr, pos 95+)
 * - "compare remit" (16 UK + 4 US impr)
 * - "currency transfer comparison" + "international money transfers comparison" (+3 each)
 *
 * Total: ~130 impr/month going to the homepage at pos 90+, where the homepage
 * isn't targeting the intent. This hub page is explicitly built to match that
 * intent: users want a comprehensive provider comparison, not a lead-gen widget.
 */

import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import Card from "@/components/Card";
import RatingBadge from "@/components/RatingBadge";
import PrimaryButton from "@/components/PrimaryButton";
import ComparisonWidget from "@/components/ComparisonWidget";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import { providers } from "@/data/providers";
import { trustpilotIndex } from "@/lib/unified-quotes";
import { getAlternates } from "@/lib/i18n-metadata";
import { getGoUrl } from "@/lib/affiliate";

export const revalidate = 21600;

const SITE_URL = "https://sendmoneycompare.com";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const year = new Date().getFullYear();
  const month = new Date().toLocaleDateString("en-US", { month: "long" });

  const title = `Compare Money Transfer Services ${year} — Live Rates from 35+ Providers`;
  const description = `Compare Wise, Remitly, Western Union, OFX, Revolut & 30+ more money transfer services side by side. Live exchange rates, real fees, Trustpilot ratings — updated every 6 hours. Find who's actually cheapest for your corridor in ${month} ${year}.`;

  return {
    title,
    description,
    keywords:
      "compare money transfer, compare money transfer rates, compare remit, compare money transfer services, best money transfer service, cheapest money transfer, international money transfers comparison, currency transfer comparison, best online money transfer",
    alternates: getAlternates("compare-money-transfer", locale),
    openGraph: {
      title: `Compare ${providers.length}+ Money Transfer Services — Live Rates (${month} ${year})`,
      description,
      url: `${SITE_URL}${locale === "en" ? "" : `/${locale}`}/compare-money-transfer`,
      type: "website",
    },
    // English-only content; noindex locale variants to avoid duplicate-content dilution
    ...(locale !== "en" && { robots: { index: false, follow: true } }),
  };
}

function getScore(slug: string): number {
  return trustpilotIndex[slug]?.score ?? 0;
}

export default async function CompareMoneyTransferPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const year = new Date().getFullYear();
  const month = new Date().toLocaleDateString("en-US", { month: "long" });

  // Top 15 providers ranked by a blended score (editorial rating * Trustpilot score)
  const ranked = [...providers]
    .filter((p) => p.rating >= 3.5)
    .sort((a, b) => {
      const aScore = a.rating * 10 + getScore(a.slug);
      const bScore = b.rating * 10 + getScore(b.slug);
      return bScore - aScore;
    })
    .slice(0, 15);

  // "Best for…" editorial picks — each hand-picked based on real corridor data
  const bestFor: { category: string; blurb: string; providerSlug: string; why: string }[] = [
    {
      category: "Biggest savings (total cost)",
      blurb: "The mid-market exchange rate with a small transparent fee — almost always the cheapest for transfers above $500.",
      providerSlug: "wise",
      why: "Uses the real mid-market rate with 0.33–0.7% fee. No hidden FX markup.",
    },
    {
      category: "First-time sender promos",
      blurb: "Promotional zero-fee first transfers and enhanced exchange rates for new users.",
      providerSlug: "remitly",
      why: "Typically saves $5–$15 on your first send with zero-fee welcome promos.",
    },
    {
      category: "Cash pickup worldwide",
      blurb: "Over 550,000 agent locations in 200+ countries — the world's largest cash network.",
      providerSlug: "western-union",
      why: "Unmatched global coverage in Latin America, Africa, and Asia. Useful when the recipient has no bank account.",
    },
    {
      category: "Large transfers ($10,000+)",
      blurb: "Fee-free for amounts above roughly $7,000, with dedicated support and better bulk FX rates.",
      providerSlug: "ofx",
      why: "Zero transfer fees on large amounts, bank-grade FX infrastructure, FCA and ASIC regulated.",
    },
    {
      category: "African corridors (cheapest)",
      blurb: "Consistently ranks as the cheapest provider on 93% of Monito's African corridor searches.",
      providerSlug: "worldremit",
      why: "Strong agent network across Nigeria, Ghana, Kenya, South Africa, and wider sub-Saharan Africa.",
    },
    {
      category: "Asia to Asia (Instarem network)",
      blurb: "Deep coverage for Singapore, Malaysia, Hong Kong, Indian Ocean corridors with local rails like DuitNow and FPS.",
      providerSlug: "instarem",
      why: "Singapore-based, integrated with regional real-time payment rails. Strong on SGD/MYR/INR.",
    },
  ];

  // Popular corridors as internal-link surface
  const popularCorridors = [
    { from: "USD", to: "INR", label: "USA → India", slug: "usa-to-india" },
    { from: "USD", to: "MXN", label: "USA → Mexico", slug: "usa-to-mexico" },
    { from: "USD", to: "PHP", label: "USA → Philippines", slug: "usa-to-philippines" },
    { from: "USD", to: "PKR", label: "USA → Pakistan", slug: "usa-to-pakistan" },
    { from: "USD", to: "NGN", label: "USA → Nigeria", slug: "usa-to-nigeria" },
    { from: "GBP", to: "INR", label: "UK → India", slug: "uk-to-india" },
    { from: "GBP", to: "EUR", label: "UK → Europe", slug: "uk-to-europe" },
    { from: "GBP", to: "ZAR", label: "UK → South Africa", slug: "uk-to-south-africa" },
    { from: "CAD", to: "INR", label: "Canada → India", slug: "canada-to-india" },
    { from: "AUD", to: "INR", label: "Australia → India", slug: "australia-to-india" },
    { from: "AED", to: "INR", label: "UAE → India", slug: "uae-to-india" },
    { from: "AED", to: "PKR", label: "UAE → Pakistan", slug: "uae-to-pakistan" },
  ];

  const faqs = [
    {
      q: "What is the cheapest way to compare money transfer services?",
      a: `The cheapest way to compare money transfer services in ${month} ${year} is to look at the total amount your recipient receives — not just the advertised fee. Compare the mid-market rate (what you see on Google or Reuters) against each provider's quoted rate, then add the fee. Wise consistently delivers the most money per dollar sent because it uses the real mid-market exchange rate with a transparent 0.33–0.7% fee. Remitly and WorldRemit often offer promotional first-transfer rates that beat Wise temporarily. Banks typically cost 3–5% more than specialist providers due to hidden FX markup.`,
    },
    {
      q: "How do you compare money transfer rates accurately?",
      a: `Always compare the total amount delivered in the recipient's currency, not the transfer fee alone. The "fee" is only part of the cost — providers often make more money from a marked-up exchange rate than from the upfront fee. For a fair comparison: (1) look up the mid-market rate for your currency pair, (2) check each provider's quoted rate at the exact amount you plan to send, (3) subtract the fee from the total sent, (4) multiply by the quoted rate to calculate the amount the recipient receives. The provider that delivers the most in target currency wins. Our live comparison does this automatically and refreshes every 6 hours from real provider APIs.`,
    },
    {
      q: "Which money transfer service has the best exchange rate?",
      a: `Wise consistently offers the best exchange rate on most corridors because it uses the real mid-market rate (the same rate shown on Google and Reuters) with no hidden markup. Remitly, WorldRemit, and Instarem are typically within 0.5–1.5% of the mid-market rate, depending on the corridor and promotional status. Western Union and MoneyGram typically apply 1.5–3% exchange rate markups in exchange for their cash pickup networks. Banks (Chase, Wells Fargo, Barclays, HSBC, NatWest) typically apply 3–5% markups and are almost never the cheapest option for specialist international transfers.`,
    },
    {
      q: "How long does a money transfer take?",
      a: `Transfer speed depends on the corridor and delivery method. Near-instant options (seconds to minutes) include: mobile wallet delivery like GCash (Philippines), JazzCash/Easypaisa (Pakistan), UPI (India), PIX (Brazil), and M-Pesa (Kenya). Same-day delivery is typical for cash pickup at Western Union, MoneyGram, Cebuana Lhuillier, or partner bank branches. 1–3 business days is standard for bank deposit via specialist providers like Wise, Remitly, and OFX. Traditional SWIFT bank wires are the slowest, often 3–5 business days because of correspondent banking intermediaries.`,
    },
    {
      q: "Is it safe to use online money transfer services?",
      a: `Yes, as long as you use providers regulated by a reputable financial authority. In the US, look for FinCEN-registered Money Services Businesses (MSBs). In the UK, look for FCA-authorised Payment Institutions or Electronic Money Institutions. In the EU, providers must be licensed under PSD2. All mainstream specialist providers (Wise, Remitly, WorldRemit, OFX, Western Union, MoneyGram, Xoom, Revolut, Instarem) meet these regulatory standards and hold customer funds in safeguarded accounts separate from their operational funds. Avoid using unregulated peer-to-peer services or informal hawala networks where protections are weaker.`,
    },
    {
      q: "How often do exchange rates change?",
      a: `Mid-market exchange rates change continuously — every few seconds — throughout global trading hours (roughly 24/5, Monday to Friday UTC). Provider rates are usually updated every 5–60 minutes depending on the provider's pricing engine. For currency pairs with lower liquidity (emerging-market pairs like USD/NGN, EUR/MAD), rates may shift 1–3% within a single day. For major pairs (USD/EUR, GBP/USD, USD/JPY), daily movement is usually under 1%. Our comparison data refreshes every 6 hours from live provider APIs and mid-market sources — setting a rate alert lets you catch favourable rates without checking repeatedly.`,
    },
    {
      q: "Are there hidden fees I should watch for?",
      a: `Yes. The biggest hidden cost is the exchange rate markup — the difference between the mid-market rate and the rate your provider quotes. This can add 0.3–5% to your effective cost and is often larger than the upfront fee. Other potentially hidden costs include: credit card cash-advance fees (your card issuer's fee, not the transfer provider's), receiving bank fees (some recipient banks charge $7–25 for inbound international wires), weekend/holiday spreads (providers often widen rates outside market hours), and SWIFT correspondent bank fees (banks routing via intermediaries may skim $10–25 per hop). Specialist providers like Wise disclose all fees upfront; banks are the worst offenders for opaque pricing.`,
    },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Compare Money Transfer", item: `${SITE_URL}/compare-money-transfer` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Top Money Transfer Services (${year})`,
    description: "Ranked comparison of 15 leading international money transfer providers",
    itemListElement: ranked.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "FinancialService",
        name: p.name,
        url: `${SITE_URL}/companies/${p.slug}`,
        aggregateRating: trustpilotIndex[p.slug]?.score
          ? {
              "@type": "AggregateRating",
              ratingValue: trustpilotIndex[p.slug].score,
              reviewCount: trustpilotIndex[p.slug].totalReviews || 100,
              bestRating: 5,
            }
          : undefined,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface-dim)] pt-8 pb-10">
        <Container>
          <nav className="text-2sm text-[var(--color-on-surface-variant)] mb-5">
            <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--color-on-surface)]">Compare Money Transfer Services</span>
          </nav>

          <div className="max-w-4xl">
            <h1 className="text-[clamp(1.75rem,5vw,2.75rem)] font-bold text-[var(--color-on-surface)] leading-[1.15] tracking-[-0.02em] mb-4">
              Compare money transfer services — live rates from <span className="text-[var(--color-primary)]">{providers.length}+ providers</span>
            </h1>
            <p className="text-base sm:text-lg text-[var(--color-on-surface-variant)] leading-relaxed max-w-3xl">
              Real exchange rates, real fees, refreshed every 6 hours from live provider APIs.
              See who delivers the most money to your recipient across 80+ currency corridors — not just who shouts loudest in ads.
            </p>
          </div>

          <div className="mt-8 max-w-[860px]">
            <ComparisonWidget />
          </div>

          <p className="text-xs text-[var(--color-on-surface-variant)] mt-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-70" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              Rates updated every 6 hours · Compared across {providers.length} providers · Independent editorial reviews
            </span>
          </p>
        </Container>
      </section>

      {/* ── AI-citable Quick Answer ── */}
      <section className="bg-[var(--color-primary-surface)] border-y border-[var(--color-primary-light)]">
        <Container className="py-5">
          <div className="max-w-4xl text-sm text-[var(--color-on-surface)] leading-relaxed">
            <p>
              <strong className="text-[var(--color-primary)]">Quick answer:</strong>{" "}
              To compare money transfer services accurately, look at the total amount your recipient receives — not the advertised fee.
              For most corridors in {month} {year}, <strong>Wise</strong> offers the cheapest rate for transfers above $500 (mid-market rate + ~0.5% fee),{" "}
              <strong>Remitly</strong> wins on first-transfer promos and fast emerging-market delivery,{" "}
              <strong>WorldRemit</strong> is cheapest on 93% of African corridor searches, and{" "}
              <strong>OFX</strong> is best for large transfers above $10,000 (fee-free at that size).
              Banks like Chase, Barclays, HSBC, and NatWest typically cost 3–5% more due to hidden exchange-rate markup.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Affiliate disclosure ── */}
      <section className="py-6">
        <Container>
          <div className="max-w-3xl">
            <AffiliateDisclosure />
          </div>
        </Container>
      </section>

      {/* ── Top Provider Ranked Table ── */}
      <section className="py-6">
        <Container>
          <div className="max-w-4xl mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-on-surface)] mb-3">
              Top {ranked.length} money transfer services ranked ({month} {year})
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-on-surface-variant)] leading-relaxed">
              Our ranking combines editorial rating (fees, rates, speed, coverage) with real Trustpilot data from hundreds of thousands of users.
              Click any provider for a full independent review or use the comparison tool above for live rates on your exact corridor.
            </p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] overflow-hidden">
            {/* Desktop header */}
            <div className="hidden sm:grid grid-cols-[40px_1fr_150px_140px_130px] gap-4 px-6 py-3 bg-[var(--color-surface-container)] text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide">
              <span>#</span>
              <span>Provider</span>
              <span>Coverage</span>
              <span>Trust rating</span>
              <span className="text-right">Action</span>
            </div>

            {ranked.map((p, i) => {
              const tp = trustpilotIndex[p.slug];
              return (
                <div key={p.slug} className="border-t border-[var(--color-outline)] first:border-t-0">
                  {/* Mobile stacked */}
                  <div className="sm:hidden p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-sm font-bold tabular-nums text-[var(--color-on-surface-variant)] w-5 text-center mt-1.5 shrink-0">{i + 1}</span>
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--color-surface-dim)] border border-[var(--color-outline)]/40 shrink-0 flex items-center justify-center">
                        <Image src={p.logo} alt={`${p.name} logo`} width={48} height={48} className="w-full h-full object-cover" unoptimized={p.logo.endsWith(".svg")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/companies/${p.slug}`} className="text-base font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)]">
                          {p.name}
                        </Link>
                        <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                          {p.supportedCountries}+ countries · {p.supportedCurrencies}+ currencies
                        </p>
                        <div className="mt-2">
                          <RatingBadge rating={p.rating} label={p.ratingLabel} size="sm" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link
                        href={`/companies/${p.slug}`}
                        className="flex-1 text-center text-2sm font-medium text-[var(--color-primary)] border border-[var(--color-outline)] rounded-full py-2 hover:bg-[var(--color-surface-dim)]"
                      >
                        Read review
                      </Link>
                      <a
                        href={getGoUrl(p.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center text-2sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] rounded-full py-2 shadow-sm"
                      >
                        Visit {p.name}
                      </a>
                    </div>
                  </div>

                  {/* Desktop row */}
                  <div className="hidden sm:grid grid-cols-[40px_1fr_150px_140px_130px] gap-4 items-center px-6 py-4">
                    <span className="text-sm font-bold tabular-nums text-[var(--color-on-surface-variant)]">{i + 1}</span>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-[var(--color-surface-dim)] border border-[var(--color-outline)]/40 shrink-0">
                        <Image src={p.logo} alt={`${p.name} logo`} width={44} height={44} className="w-full h-full object-cover" unoptimized={p.logo.endsWith(".svg")} />
                      </div>
                      <div className="min-w-0">
                        <Link href={`/companies/${p.slug}`} className="text-sm font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] block truncate">
                          {p.name}
                        </Link>
                        <p className="text-xs text-[var(--color-on-surface-variant)] truncate">{p.description.slice(0, 60)}{p.description.length > 60 ? "…" : ""}</p>
                      </div>
                    </div>
                    <div className="text-xs text-[var(--color-on-surface-variant)] tabular-nums">
                      <p>{p.supportedCountries}+ countries</p>
                      <p>{p.supportedCurrencies}+ currencies</p>
                    </div>
                    <div>
                      <RatingBadge rating={p.rating} label={p.ratingLabel} size="sm" />
                      {tp?.score && (
                        <p className="text-2xs text-[var(--color-on-surface-variant)] mt-0.5 tabular-nums">
                          Trustpilot ★ {tp.score.toFixed(1)}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <a
                        href={getGoUrl(p.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center text-xs font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] rounded-full py-1.5 px-3"
                      >
                        Visit
                      </a>
                      <Link
                        href={`/companies/${p.slug}`}
                        className="text-center text-xs font-medium text-[var(--color-primary)] border border-[var(--color-outline)] rounded-full py-1.5 px-3 hover:bg-[var(--color-surface-dim)]"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Best For… editorial picks ── */}
      <section className="py-10 bg-[var(--color-surface-dim)] border-y border-[var(--color-outline)]">
        <Container>
          <div className="max-w-4xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-on-surface)] mb-3">
              Best money transfer service for your situation
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-on-surface-variant)] leading-relaxed">
              One provider almost never wins on every axis. Here&apos;s who we recommend depending on what matters most to you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {bestFor.map((item) => {
              const provider = providers.find((p) => p.slug === item.providerSlug);
              if (!provider) return null;
              return (
                <Card key={item.category} className="h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--color-surface-dim)] border border-[var(--color-outline)]/40 shrink-0">
                      <Image src={provider.logo} alt={provider.name} width={48} height={48} className="w-full h-full object-cover" unoptimized={provider.logo.endsWith(".svg")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-2xs font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-0.5">
                        Best for {item.category}
                      </p>
                      <h3 className="text-lg font-bold text-[var(--color-on-surface)] leading-tight">{provider.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-3">{item.blurb}</p>
                  <p className="text-sm text-[var(--color-on-surface)] leading-relaxed mb-4">
                    <strong>Why:</strong> {item.why}
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/companies/${provider.slug}`} className="text-2sm font-medium text-[var(--color-primary)] hover:underline">
                      Read {provider.name} review →
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Popular corridors ── */}
      <section className="py-10">
        <Container>
          <div className="max-w-4xl mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-on-surface)] mb-3">
              Compare rates for the most-searched corridors
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-on-surface-variant)] leading-relaxed">
              Each corridor page shows live rates from every provider serving that currency pair, a deep editorial guide, and FAQs specific to that route.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {popularCorridors.map((c) => (
              <Link
                key={c.slug}
                href={`/send-money/${c.slug}`}
                className="p-4 rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] hover:shadow-md transition-all group"
              >
                <p className="text-2xs uppercase tracking-wide font-semibold text-[var(--color-on-surface-variant)] mb-1">
                  {c.from} → {c.to}
                </p>
                <p className="text-sm font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)]">
                  {c.label}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Methodology ── */}
      <section className="py-10 bg-[var(--color-surface-dim)] border-y border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-on-surface)] mb-3">
              How we compare money transfer services
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
              SendMoneyCompare is an independent comparison platform. We don&apos;t receive payment to feature providers higher in rankings. Our methodology:
            </p>
            <ul className="space-y-3 text-sm text-[var(--color-on-surface-variant)]">
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-2xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span><strong className="text-[var(--color-on-surface)]">Live provider data:</strong> Quotes are scraped from each provider&apos;s public API or calculator every 6 hours, then cross-checked against mid-market rates from three independent sources.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-2xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span><strong className="text-[var(--color-on-surface)]">Trustpilot ratings:</strong> Independent review scores are overlaid from Trustpilot&apos;s public API, weighted by volume.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-2xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span><strong className="text-[var(--color-on-surface)]">Editorial reviews:</strong> Our team tests providers with real transfers on real corridors, documents fees and delivery speeds, and updates reviews quarterly.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-2xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                <span><strong className="text-[var(--color-on-surface)]">Affiliate disclosure:</strong> Some links on this page pay us a small commission at no cost to you. These links never influence rankings — we feature providers based on value to senders.</span>
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3 text-2sm">
              <Link href="/methodology" className="text-[var(--color-primary)] hover:underline font-medium">Full methodology →</Link>
              <Link href="/how-we-review" className="text-[var(--color-primary)] hover:underline font-medium">How we review →</Link>
              <Link href="/editorial-policy" className="text-[var(--color-primary)] hover:underline font-medium">Editorial policy →</Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── FAQ ── */}
      <section className="py-10">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-on-surface)] mb-6">
              Frequently asked questions
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              {faqs.map((f, i) => (
                <details key={i} className="group py-4" open={i === 0}>
                  <summary className="flex items-start justify-between cursor-pointer list-none text-base font-medium text-[var(--color-on-surface)] gap-4">
                    <span>{f.q}</span>
                    <svg className="w-5 h-5 shrink-0 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="py-10 bg-gradient-to-b from-[var(--color-primary-surface)] to-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-on-surface)] mb-3">
              Ready to compare rates for your transfer?
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-on-surface-variant)] leading-relaxed mb-5">
              Get live quotes from {providers.length}+ providers in 10 seconds. No signup. No spam.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <PrimaryButton href="/send-money">Compare live rates →</PrimaryButton>
              <Link href="/companies" className="inline-flex items-center h-11 px-5 text-2sm font-medium text-[var(--color-primary)] border border-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary-surface)] transition-colors">
                Browse all providers
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
