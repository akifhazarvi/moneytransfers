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
import { ScrollTracker } from "@/components/ScrollTracker";
import { getGoUrl } from "@/lib/affiliate";
import { trustpilotIndex } from "@/lib/unified-quotes";
import { getAlternates } from "@/lib/i18n-metadata";
import { getCompareCanonicalSlug } from "@/lib/compare-canonical";
import { newsItems } from "@/data/news";
import { formatLocalDate } from "@/lib/format-date";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

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
  const title = `${provider.name} Review ${year}${tp?.score ? `: ★${tp.score.toFixed(1)}` : ""} — Fees, Pros & Cons`;
  const description = `${provider.name} review ${year}: fees, exchange rates, speed and safety tested${tp?.score ? `. Rated ${tp.score.toFixed(1)}/5 on Trustpilot` : ""}. See if it's the cheapest way to send money.`;
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

  const otherProviders = providers.filter((p) => p.slug !== slug).slice(0, 4);

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
            { href: "/send-money/uk-to-europe", label: "UK to Europe" },
            { href: "/send-money/usa-to-philippines", label: "USA to Philippines" },
            { href: "/send-money/usa-to-mexico", label: "USA to Mexico" },
          ],
        },
        {
          title: "Comparisons",
          links: otherProviders.slice(0, 4).map((other) => ({
            href: `/compare/${getCompareCanonicalSlug(`${provider.slug}-vs-${other.slug}`)}`,
            label: `${provider.name} vs ${other.name}`,
          })),
        },
        {
          title: "Guides & tools",
          links: [
            { href: "/compare-money-transfer", label: "Compare money transfer services" },
            { href: "/send-money", label: "Compare all providers" },
            { href: "/currency-converter", label: "Currency converter" },
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
  return (
    <>
      <ScrollTracker slug={slug} contentType="review" />
      {/* Hero */}
      <div className="border-b border-[var(--color-outline)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
          <nav className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-muted)] mb-6">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/companies" className="hover:text-[var(--color-primary)] transition-colors">Companies</Link>
            <span>/</span>
            <span className="text-[var(--color-on-surface-variant)]">{provider.name}</span>
          </nav>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-[var(--color-outline)] shadow-[var(--shadow-xs)] bg-white flex items-center justify-center">
              <Image src={provider.logo} alt={provider.name} width={64} height={64} className="object-contain p-1" />
            </div>
            <div>
              <h1 className="font-display text-[clamp(1.5rem,3.5vw,2rem)] font-normal leading-[1.2] tracking-[-0.015em] text-[var(--color-on-surface)]">
                {provider.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <RatingBadge rating={provider.rating} label={provider.ratingLabel} size="md" />
                <span className="text-2sm text-[var(--color-on-surface-variant)]">Est. {provider.founded}</span>
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
              <p className="text-md text-[var(--color-on-surface-variant)] leading-relaxed mb-5">{provider.description}</p>
              <div className="flex gap-3">
                <ProviderLink href={getGoUrl(provider.slug)} provider={provider.slug} source="company_review_sidebar" className="inline-flex items-center justify-center font-semibold rounded-full transition-all duration-150 hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)] active:shadow-none active:scale-[0.98] bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] h-9 px-5 text-2sm">Visit {provider.name}</ProviderLink>
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
                    href={`/compare/${getCompareCanonicalSlug(`${provider.slug}-vs-${other.slug}`)}`}
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
