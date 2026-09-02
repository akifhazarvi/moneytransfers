import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { providers } from "@/data/providers";

// Revalidate every 6 hours — matches scraper cadence
export const revalidate = 21600;
import { getProviderReview } from "@/data/provider-reviews";
import Container from "@/components/Container";
import Card from "@/components/Card";
import StatBox from "@/components/StatBox";
import ProsConsList from "@/components/ProsConsList";
import ProviderLink from "@/components/ProviderLink";
import RatingBadge from "@/components/RatingBadge";
import ComparisonWidget from "@/components/ComparisonWidget";
import CrossLinks from "@/components/CrossLinks";
import WhatsAppInlineCTA from "@/components/WhatsAppInlineCTA";
import { ScrollTracker } from "@/components/ScrollTracker";
import { getGoUrl } from "@/lib/affiliate";
import { trustpilotIndex } from "@/lib/unified-quotes";
import { getAlternates } from "@/lib/i18n-metadata";
import { getCompareCanonicalSlug } from "@/lib/compare-canonical";
import { generateProviderProfile } from "@/lib/provider-profile";
import { newsItems } from "@/data/news";
import { formatLocalDate } from "@/lib/format-date";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { fitTitle } from "@/lib/seo-title";
import { comparePageHref } from "@/lib/route-map";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  return providers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const provider = providers.find((p) => p.slug === slug);
  if (!provider) return {};
  const review = getProviderReview(slug);
  const year = new Date().getFullYear();
  const tp = trustpilotIndex[slug];
  // Uniform meta formula across the whole /companies category, sized to
  // standard SEO limits (title ≲60 chars, description ≲160 chars). The long
  // per-provider editorial titles/descriptions were retired when the category
  // was unified on the compact profile template.
  // Ladder, not one pattern: "United Overseas Bank (UOB) Review 2026 — Cheaper
  // Options on Your Route?" came to 71 chars, so the question — the part doing
  // the CTR work — was the part search engines cut.
  const title = fitTitle([
    `${provider.name} Review ${year}${tp?.score ? `: ★${tp.score.toFixed(1)}` : ""} — Cheaper Options on Your Route?`,
    `${provider.name} Review ${year} — Cheaper Options on Your Route?`,
    `${provider.name} Review ${year}${tp?.score ? `: ★${tp.score.toFixed(1)}` : ""} — Fees & Rates`,
    `${provider.name} Review ${year}`,
  ]);
  const description = `${provider.name}${tp?.score ? ` rated ★${tp.score.toFixed(1)}/5` : " reviewed"}: real fees and FX markup on a $1,000 transfer — plus the apps that beat it right now for your corridor. Free, no signup.`;
  return {
    title,
    description,
    ...(!review && { robots: { index: false, follow: true } }),
    // Company reviews are English-only; noindex locale variants to avoid diluting the English page
    ...(review && locale !== "en" && { robots: { index: false, follow: true } }),
    openGraph: {
      title,
      description,
      type: "article",
    },
    alternates: getAlternates(`companies/${slug}`, locale),
  };
}

export default async function CompanyPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const provider = providers.find((p) => p.slug === slug);
  if (!provider) notFound();

  // Only pairings whose compare page actually renders. /compare/[slug] sets
  // dynamicParams=false and allows only the editorial + sitemap slugs, so
  // "any four other providers" produced 370 links to 404s across these pages.
  const otherProviders = providers
    .filter((p) => p.slug !== slug)
    .filter((p) => comparePageHref(`${slug}-vs-${p.slug}`))
    .slice(0, 4);

  // News articles mentioning this provider — sorted newest first
  const providerNews = newsItems
    .filter((n) => n.providerSlugs?.includes(slug))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 4);

  const crossLinks = (
    <CrossLinks
      sections={[
        {
          title: "Popular corridors",
          links: [
            { href: "/send-money/usa-to-india", label: "USA to India" },
            { href: "/send-money/usa-to-pakistan", label: "USA to Pakistan" },
            { href: "/send-money/usa-to-europe", label: "USA to Europe" },
            { href: "/send-money/usa-to-philippines", label: "USA to Philippines" },
            { href: "/send-money/usa-to-mexico", label: "USA to Mexico" },
          ],
        },
        {
          title: "Comparisons",
          links: otherProviders.slice(0, 4).map((other) => ({
            href: comparePageHref(`${provider.slug}-vs-${other.slug}`) as string,
            label: `${provider.name} vs ${other.name}`,
          })),
        },
        {
          title: "Guides & tools",
          links: [
            { href: "/compare-money-transfer", label: "Compare money transfer services" },
            { href: "/send-money", label: "Compare all providers" },
            { href: "/guides/how-to-send-money-abroad", label: "How to send money abroad" },
            { href: "/guides/cheapest-way-to-send-money-internationally", label: "Cheapest way to send money" },
            { href: "/guides/money-transfer-safety-guide", label: "Are money transfer companies safe?" },
            { href: "/guides/exchange-rate-markup-explained", label: "Exchange rates explained" },
          ],
        },
      ]}
    />
  );

  // Every provider renders the same compact profile template — the long
  // editorial DetailedReview layout was retired when the category was
  // shortened (its content lives on in src/data/provider-reviews.ts, no
  // longer rendered; review existence still gates indexability above).
  return <DefaultReview slug={slug} provider={provider} otherProviders={otherProviders} crossLinks={crossLinks} providerNews={providerNews} />;
}

/* ─── Compact profile template (all providers) ─── */
function DefaultReview({
  slug,
  provider,
  otherProviders,
  crossLinks,
  providerNews,
}: {
  slug: string;
  provider: (typeof providers)[number];
  otherProviders: (typeof providers)[number][];
  crossLinks: React.ReactNode;
  providerNews: (typeof newsItems)[number][];
}) {
  const tp = trustpilotIndex[slug];
  const profile = generateProviderProfile(provider, {
    score: tp?.score ?? undefined,
    reviews: tp?.totalReviews ?? undefined,
  });
  return (
    <>
      <ScrollTracker slug={slug} contentType="review" />
      {/* Hero */}
      <div className="bg-[var(--color-surface-warm)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 pb-8">
          <div className="ws-hero px-6 sm:px-10 py-10 md:py-12">
            <nav className="flex items-center gap-1.5 text-xs text-white/55 mb-8">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/companies" className="hover:text-white transition-colors">Companies</Link>
              <span>/</span>
              <span className="text-white/80">{provider.name}</span>
            </nav>
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-2xl overflow-hidden shrink-0 shadow-[var(--shadow-md)] bg-white flex items-center justify-center">
                <Image src={provider.logo} alt={provider.name} width={72} height={72} className="object-contain p-1.5" />
              </div>
              <div>
                <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.12] tracking-tight text-white">
                  {provider.name} <span className="font-medium text-white/55">review</span>
                </h1>
                <div className="flex items-center gap-3 mt-3">
                  <RatingBadge rating={provider.rating} label={provider.ratingLabel} size="md" />
                  <span className="text-2sm text-white/70">Est. {provider.founded}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Container className="py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Header card */}
            <Card>
              <p className="text-md text-[var(--color-on-surface)] leading-relaxed mb-5">{profile.summary}</p>
              <div className="flex gap-3">
                <ProviderLink href={getGoUrl(provider.slug)} provider={provider.slug} source="company_review_sidebar" className="inline-flex items-center justify-center font-semibold rounded-full transition-all duration-150 hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)] active:shadow-none active:scale-[0.98] bg-[var(--color-cta)] text-[var(--color-cta-text)] hover:bg-[var(--color-cta-hover)] h-9 px-5 text-2sm">Visit {provider.name}</ProviderLink>
                <Link href="/send-money" className="inline-flex items-center h-9 px-5 border border-[var(--color-outline)] rounded-full text-2sm font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors">
                  Compare Rates
                </Link>
              </div>
            </Card>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Countries", value: `${provider.supportedCountries}+` },
                { label: "Currencies", value: `${provider.supportedCurrencies}+` },
                { label: "Speed", value: provider.transferSpeed },
                { label: "Fees", value: provider.feeStructure },
              ].map((stat) => (
                <StatBox key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>

            {/* Overview — ~300-500 word data-driven profile, kept current from
                the provider's maintained fields (fees, markup, speed, coverage). */}
            <Card>
              <h2 className="text-base font-semibold text-[var(--color-on-surface)] mb-4">
                {provider.name} overview
              </h2>
              <div className="space-y-4">
                {profile.paragraphs.map((para, i) => (
                  <p key={i} className="text-md text-[var(--color-on-surface-variant)] leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </Card>

            {/* Pros and Cons */}
            <div className="grid md:grid-cols-2 gap-4">
              <ProsConsList type="pros" items={provider.pros} />
              <ProsConsList type="cons" items={provider.cons} />
            </div>

            {/* Features */}
            <Card>
              <h2 className="text-base font-semibold text-[var(--color-on-surface)] mb-4">Key Features</h2>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {provider.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 text-sm bg-[var(--color-surface-dim)] rounded-xl p-3">
                    <svg className="w-4 h-4 text-[var(--color-primary)] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[var(--color-on-surface)]">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Details */}
            <Card>
              <h2 className="text-base font-semibold text-[var(--color-on-surface)] mb-4">Transfer Details</h2>
              <div className="divide-y divide-[var(--color-outline)]">
                {[
                  { label: "Headquarters", value: provider.headquarters },
                  { label: "Regulated", value: provider.regulated ? "Yes" : "No" },
                  { label: "Regulators", value: provider.regulators.join(", ") },
                  { label: "Min Transfer", value: `$${provider.minTransfer}` },
                  { label: "Max Transfer", value: provider.maxTransfer ? `$${provider.maxTransfer.toLocaleString()}` : "No limit" },
                  { label: "Payment Methods", value: provider.paymentMethods.join(", ") },
                  { label: "Delivery Methods", value: provider.deliveryMethods.join(", ") },
                  { label: "Exchange Rate Markup", value: provider.exchangeRateMarkup },
                ].map((row) => (
                  <div key={row.label} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 py-3 text-sm">
                    <span className="text-[var(--color-on-surface-variant)] shrink-0">{row.label}</span>
                    <span className="font-medium text-[var(--color-on-surface)] sm:text-right sm:max-w-[60%] break-words">{row.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <Card className="lg:sticky lg:top-20">
              <h3 className="text-sm font-semibold text-[var(--color-on-surface)] mb-4">Compare {provider.name}</h3>
              <ComparisonWidget compact />
            </Card>
            <Card>
              <h3 className="text-sm font-semibold text-[var(--color-on-surface)] mb-3">Compare With</h3>
              <div className="space-y-2">
                {otherProviders.map((other) => (
                  <Link
                    key={other.slug}
                    href={comparePageHref(`${provider.slug}-vs-${other.slug}`) as string}
                    className="flex items-center justify-between p-3 bg-[var(--color-surface-dim)] rounded-xl hover:bg-[var(--color-primary-surface)] transition-colors group"
                  >
                    <span className="text-2sm font-medium text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)]">
                      {provider.name} vs {other.name}
                    </span>
                    <span className="text-xs text-[var(--color-primary)]">→</span>
                  </Link>
                ))}
              </div>
            </Card>
            {providerNews.length > 0 && (
              <Card>
                <h3 className="text-sm font-semibold text-[var(--color-on-surface)] mb-3">
                  Latest on {provider.name}
                </h3>
                <ul className="space-y-3">
                  {providerNews.map((n) => (
                    <li key={n.slug}>
                      <Link href={`/news/${n.slug}`} className="block group">
                        <p className="text-2sm font-medium text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] leading-snug">
                          {n.title}
                        </p>
                        <time
                          className="text-2xs text-[var(--color-on-surface-variant)] mt-1 block"
                          dateTime={n.publishedAt}
                        >
                          {formatLocalDate(n.publishedAt, { month: "short", day: "numeric", year: "numeric" })}
                        </time>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/news"
                  className="text-2xs text-[var(--color-primary)] hover:underline mt-3 block"
                >
                  All news →
                </Link>
              </Card>
            )}
          </div>
        </div>
      </Container>

      {/* WhatsApp channel — placed after the review body and before the
          cross-links. Provider review pages are among the site's strongest
          Bing entry points and previously carried no follow CTA at all, so
          this is reach rather than a new idea. Below the affiliate CTAs in the
          review itself, so it never competes with provider_clicked. */}
      <Container className="pb-8">
        <WhatsAppInlineCTA source="company_review_inline" />
      </Container>

      {crossLinks}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FinancialService",
        name: provider.name, description: provider.description, url: provider.website,
        ...(trustpilotIndex[slug]?.totalReviews && trustpilotIndex[slug]?.score && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(trustpilotIndex[slug].score!.toFixed(1)),
            bestRating: 5, worstRating: 1,
            ratingCount: trustpilotIndex[slug].totalReviews,
          },
        }),
        address: { "@type": "PostalAddress", addressLocality: provider.headquarters },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
          { "@type": "ListItem", position: 2, name: "Companies", item: "https://sendmoneycompare.com/companies" },
          { "@type": "ListItem", position: 3, name: provider.name, item: `https://sendmoneycompare.com/companies/${slug}` },
        ],
      }) }} />
    </>
  );
}
