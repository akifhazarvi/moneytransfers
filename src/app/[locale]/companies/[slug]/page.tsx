import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { providers, getProviderName } from "@/data/providers";
import { getProviderReview } from "@/data/provider-reviews";
import Container from "@/components/Container";
import Card from "@/components/Card";
import StatBox from "@/components/StatBox";
import ProsConsList from "@/components/ProsConsList";
import PrimaryButton from "@/components/PrimaryButton";
import RatingBadge from "@/components/RatingBadge";
import ComparisonWidget from "@/components/ComparisonWidget";
import CrossLinks from "@/components/CrossLinks";
import BestTransferToday from "@/components/BestTransferToday";
import { getGoUrl } from "@/lib/affiliate";
import { sanitizeHtml } from "@/lib/sanitize";
import { trustpilotIndex } from "@/lib/unified-quotes";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  return providers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "companiesSlug" });
  const provider = providers.find((p) => p.slug === slug);
  if (!provider) return {};
  const review = getProviderReview(slug);
  const year = new Date().getFullYear();
  const tp = trustpilotIndex[slug];
  const ratingStr = tp?.score ? ` ★${tp.score.toFixed(1)}` : "";
  const title = review?.title ?? `${provider.name} Review ${year}:${ratingStr} — Fees, Pros & Cons`;
  const fallbackDesc = `${provider.name} review for ${year}${tp?.score ? ` — rated ${tp.score.toFixed(1)}/5 on Trustpilot` : ""}. We analyzed fees, exchange rates, speed, and coverage across real corridors. See if ${provider.name} is the cheapest for your transfer.`;
  const description = review?.metaDescription ?? fallbackDesc;
  return {
    title,
    description,
    ...(!review && { robots: { index: false, follow: true } }),
    openGraph: {
      title: `${provider.name} Review (${year}) — Is It the Cheapest? Real Data Inside`,
      description,
      type: "article",
    },
    alternates: getAlternates(`companies/${slug}`, locale),
  };
}

export default async function CompanyPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("companiesSlug");
  const provider = providers.find((p) => p.slug === slug);
  if (!provider) notFound();

  const review = getProviderReview(slug);
  const otherProviders = providers.filter((p) => p.slug !== slug).slice(0, 4);

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
            href: `/compare/${provider.slug}-vs-${other.slug}`,
            label: `${provider.name} vs ${other.name}`,
          })),
        },
        {
          title: "Guides & tools",
          links: [
            { href: "/send-money", label: "Compare all providers" },
            { href: "/guides/how-to-send-money-abroad", label: "How to send money abroad" },
            { href: "/guides/cheapest-way-to-send-money-internationally", label: "Cheapest way to send money" },
            { href: "/guides/exchange-rate-markup-explained", label: "Exchange rates explained" },
          ],
        },
      ]}
    />
  );

  if (review) {
    return <DetailedReview slug={slug} provider={provider} review={review} otherProviders={otherProviders} crossLinks={crossLinks} />;
  }

  return <DefaultReview slug={slug} provider={provider} otherProviders={otherProviders} crossLinks={crossLinks} />;
}

/* ─── Score color helper ─── */
function getScoreStyle(rating: number) {
  if (rating >= 8) return { color: "var(--color-success-dark)", bg: "var(--color-success-surface)", label: "Excellent" };
  if (rating >= 6) return { color: "var(--color-accent-dark)", bg: "var(--color-accent-surface)", label: "Good" };
  return { color: "var(--color-danger)", bg: "var(--color-danger-surface)", label: "Average" };
}

/* ─── Detailed editorial review ─── */
function DetailedReview({
  slug,
  provider,
  review,
  otherProviders,
  crossLinks,
}: {
  slug: string;
  provider: (typeof providers)[number];
  review: NonNullable<ReturnType<typeof getProviderReview>>;
  otherProviders: (typeof providers)[number][];
  crossLinks: React.ReactNode;
}) {
  const score = getScoreStyle(review.editorRating);

  return (
    <>
      {/* ── Review Hero ── */}
      <div className="border-b border-[var(--color-outline)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-10">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Companies", href: "/companies" }, { label: provider.name }]} />

          {/* Provider identity — full width, title is the hero */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden shrink-0 border border-[var(--color-outline)] shadow-[var(--shadow-xs)] bg-white flex items-center justify-center">
              <Image src={provider.logo} alt={provider.name} width={64} height={64} className="object-contain p-1" />
            </div>
            <div className="min-w-0">
              <div className="text-overline text-[var(--color-primary)] mb-1.5">Review</div>
              <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--color-on-surface)]" style={{ fontFamily: "var(--font-reading)" }}>
                {review.title}
              </h1>
            </div>
          </div>

          {/* Meta row — rating, date, credits */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--color-outline)]">
            <RatingBadge rating={provider.rating} label={provider.ratingLabel} size="md" />
            <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
            <span className="text-2sm text-[var(--color-on-surface-variant)]">Updated {review.updatedAt}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
            <span className="text-2sm text-[var(--color-on-surface-variant)]">{review.readTime}</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-2sm text-[var(--color-on-surface-muted)]">
            <span>By <Link href="/about/daniel-rowe" className="text-[var(--color-primary)] hover:underline font-medium">{review.reviewer}</Link></span>
            <span>Fact-checked by <Link href="/about/awais-imran" className="text-[var(--color-primary)] hover:underline font-medium">{review.factChecker}</Link></span>
            <span>Verified {review.lastVerified}</span>
          </div>
        </div>
      </div>

      <Container className="py-8">
        {/* ── Verdict banner + Quick Stats ── */}
        <div className="mb-8 space-y-4">
          {/* Verdict — moved from hero, now full-width and readable */}
          <div className="rounded-2xl border border-[var(--color-outline)] overflow-hidden">
            <div className="flex items-center gap-4 px-5 py-4" style={{ background: score.bg }}>
              <div className="shrink-0 text-center">
                <span className="text-[2.5rem] font-bold leading-none tabular-nums" style={{ color: score.color }}>
                  {review.editorRating}
                </span>
                <span className="text-[var(--color-on-surface-muted)] text-xs">/10</span>
                <div className="text-xs font-bold mt-0.5" style={{ color: score.color }}>{score.label}</div>
              </div>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed line-clamp-4">
                &ldquo;{review.editorVerdict}&rdquo;
              </p>
            </div>
            <div className="flex gap-2 px-5 py-3 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
              <PrimaryButton href={getGoUrl(provider.slug)} external size="sm" className="flex-1">
                Visit {provider.name} ↗
              </PrimaryButton>
              <Link
                href="/send-money"
                className="flex items-center justify-center flex-1 h-9 border border-[var(--color-outline)] rounded-full text-2sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-colors"
              >
                Compare Rates
              </Link>
            </div>
          </div>

          {/* Stats grid — wraps instead of scrolling */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-px bg-[var(--color-outline)] border border-[var(--color-outline)] rounded-2xl overflow-hidden">
            {[
              { label: "Countries", value: `${provider.supportedCountries}+` },
              { label: "Currencies", value: `${provider.supportedCurrencies}+` },
              { label: "Speed", value: provider.transferSpeed },
              { label: "Fees", value: provider.feeStructure },
              { label: "Founded", value: String(provider.founded) },
              { label: "Markup", value: provider.exchangeRateMarkup },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center px-3 py-3 bg-[var(--color-surface)] text-center"
              >
                <span className="text-overline text-[var(--color-on-surface-muted)] mb-1">{stat.label}</span>
                <span className="text-2sm font-semibold text-[var(--color-on-surface)] leading-snug">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Table of Contents */}
            <Card>
              <p className="text-overline text-[var(--color-on-surface-muted)] mb-4">In this review</p>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-0.5">
                {review.sections.map((s, i) => (
                  <a key={s.id} href={`#${s.id}`} className="flex items-center gap-2.5 text-2sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] py-1.5 transition-colors leading-snug">
                    <span className="w-5 h-5 rounded-md bg-[var(--color-surface-container)] text-[10px] font-bold text-[var(--color-on-surface-muted)] flex items-center justify-center shrink-0">{i + 1}</span>
                    {s.heading}
                  </a>
                ))}
                {[
                  { id: "pros-cons", label: "Pros and Cons" },
                  { id: "who-should-use", label: `Who Should Use ${provider.name}` },
                  { id: "alternatives", label: "Alternatives" },
                  { id: "how-we-tested", label: "How We Tested" },
                  { id: "faq", label: "FAQ" },
                ].map((item, i) => (
                  <a key={item.id} href={`#${item.id}`} className="flex items-center gap-2.5 text-2sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] py-1.5 transition-colors leading-snug">
                    <span className="w-5 h-5 rounded-md bg-[var(--color-surface-container)] text-[10px] font-bold text-[var(--color-on-surface-muted)] flex items-center justify-center shrink-0">{review.sections.length + i + 1}</span>
                    {item.label}
                  </a>
                ))}
              </div>
            </Card>

            {/* Live corridor performance */}
            <Card>
              <h2 className="text-base font-semibold text-[var(--color-on-surface)] mb-4">
                Live {provider.name} rates today
              </h2>
              <BestTransferToday amount={1000} from="USD" to="INR" symbol="₹" />
            </Card>

            {/* Article Sections */}
            {review.sections.map((section) => (
              <Card key={section.id} id={section.id}>
                <h2 className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-bold leading-[1.3] tracking-[-0.01em] text-[var(--color-on-surface)] mb-4" style={{ fontFamily: "var(--font-reading)" }}>
                  {section.heading}
                </h2>
                <div
                  className="prose-content prose-custom"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.content) }}
                />
              </Card>
            ))}

            {/* Pros and Cons */}
            <div id="pros-cons" className="grid md:grid-cols-2 gap-4">
              <ProsConsList type="pros" items={provider.pros} />
              <ProsConsList type="cons" items={provider.cons} />
            </div>

            {/* Who should use */}
            <Card id="who-should-use">
              <h2 className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-bold leading-[1.3] tracking-[-0.01em] text-[var(--color-on-surface)] mb-5" style={{ fontFamily: "var(--font-reading)" }}>
                Who should use {provider.name}?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {review.whoShouldUse.map((group) => {
                  const isIdeal = group.heading.toLowerCase().includes("ideal");
                  return (
                    <div key={group.heading}>
                      <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isIdeal ? "text-[var(--color-success-dark)]" : "text-[#B91C1C]"}`}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-2xs font-bold text-white ${isIdeal ? "bg-[var(--color-success)]" : "bg-[var(--color-danger)]"}`}>
                          {isIdeal ? "✓" : "✗"}
                        </span>
                        {group.heading}
                      </h3>
                      <ul className="space-y-2">
                        {group.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-on-surface-variant)]">
                            <span className={`mt-0.5 shrink-0 text-2sm font-bold ${isIdeal ? "text-[var(--color-success-dark)]" : "text-[#C53030]"}`}>
                              {isIdeal ? "✓" : "✗"}
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Alternatives */}
            <Card id="alternatives">
              <h2 className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-bold leading-[1.3] tracking-[-0.01em] text-[var(--color-on-surface)] mb-5" style={{ fontFamily: "var(--font-reading)" }}>
                {provider.name} alternatives
              </h2>
              <div className="space-y-3">
                {review.alternatives.map((alt) => {
                  const altProvider = providers.find((p) => p.slug === alt.slug);
                  if (!altProvider) return null;
                  return (
                    <div
                      key={alt.slug}
                      className="flex items-center justify-between p-4 bg-[var(--color-surface-dim)] hover:bg-[var(--color-primary-surface)] rounded-xl border border-transparent hover:border-[var(--color-primary-light)] transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-white border border-[var(--color-outline)] flex items-center justify-center">
                          <Image src={altProvider.logo} alt={altProvider.name} width={40} height={40} className="object-contain p-0.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--color-on-surface)] truncate">{altProvider.name}</p>
                          <p className="text-xs text-[var(--color-on-surface-variant)] truncate">{alt.reason}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 shrink-0 ml-3">
                        <Link href={`/companies/${alt.slug}`} className="text-xs font-semibold text-[var(--color-primary)] hover:underline">
                          Review
                        </Link>
                        <Link href={`/compare/${slug}-vs-${alt.slug}`} className="text-xs font-semibold text-[var(--color-primary)] hover:underline">
                          Compare
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* How we tested */}
            <Card id="how-we-tested">
              <h2 className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-bold leading-[1.3] tracking-[-0.01em] text-[var(--color-on-surface)] mb-4" style={{ fontFamily: "var(--font-reading)" }}>
                How we tested {provider.name}
              </h2>
              <p className="text-md text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
                {review.howWeTested}
              </p>
              <p className="text-xs text-[var(--color-on-surface-muted)] pt-3 border-t border-[var(--color-outline)]">
                Last verified: {review.lastVerified} · Reviewed by{" "}
                <Link href="/about/daniel-rowe" className="text-[var(--color-primary)] hover:underline">{review.reviewer}</Link>
                {" "}· Fact-checked by{" "}
                <Link href="/about/awais-imran" className="text-[var(--color-primary)] hover:underline">{review.factChecker}</Link>
              </p>
            </Card>

            {/* FAQ */}
            <Card id="faq">
              <h2 className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-bold leading-[1.3] tracking-[-0.01em] text-[var(--color-on-surface)] mb-5" style={{ fontFamily: "var(--font-reading)" }}>
                Frequently asked questions
              </h2>
              <div className="space-y-0 divide-y divide-[var(--color-outline)]">
                {review.faqs.map((faq, i) => (
                  <details key={i} className="group py-4 first:pt-0">
                    <summary className="flex items-center justify-between cursor-pointer text-md font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors select-none">
                      {faq.q}
                      <svg className="w-4 h-4 text-[var(--color-on-surface-muted)] group-open:rotate-180 transition-transform ml-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="mt-3 text-sm text-[var(--color-on-surface-variant)] leading-relaxed pr-6">{faq.a}</p>
                  </details>
                ))}
              </div>
            </Card>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">
            {/* At a glance — sticky summary */}
            <div className="lg:sticky lg:top-20 space-y-5">
              <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] shadow-[var(--shadow-sm)] overflow-hidden">
                <div className="px-5 py-4 border-b border-[var(--color-outline)] bg-[var(--color-surface-dim)]">
                  <h3 className="text-sm font-semibold text-[var(--color-on-surface)]">{provider.name} at a glance</h3>
                </div>
                <div className="divide-y divide-[var(--color-outline)]">
                  {[
                    { label: "Editor Rating", value: `${review.editorRating}/10` },
                    { label: "Trustpilot", value: `${provider.rating}/5 (${provider.ratingLabel})` },
                    { label: "Fees", value: provider.feeStructure },
                    { label: "Speed", value: provider.transferSpeed },
                    { label: "Countries", value: `${provider.supportedCountries}+` },
                    { label: "Rate Markup", value: provider.exchangeRateMarkup },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center px-5 py-2.5 text-2sm">
                      <span className="text-[var(--color-on-surface-variant)]">{row.label}</span>
                      <span className="font-semibold text-[var(--color-on-surface)]">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <PrimaryButton href={getGoUrl(provider.slug)} external size="sm" className="w-full">
                    Visit {provider.name}
                  </PrimaryButton>
                </div>
              </div>

              {/* Compare widget */}
              <Card>
                <h3 className="text-sm font-semibold text-[var(--color-on-surface)] mb-4">Compare {provider.name}</h3>
                <ComparisonWidget compact />
              </Card>

              {/* Compare with */}
              <Card>
                <h3 className="text-sm font-semibold text-[var(--color-on-surface)] mb-3">Compare With</h3>
                <div className="space-y-2">
                  {otherProviders.map((other) => (
                    <Link
                      key={other.slug}
                      href={`/compare/${slug}-vs-${other.slug}`}
                      className="flex items-center justify-between p-3 bg-[var(--color-surface-dim)] rounded-xl hover:bg-[var(--color-primary-surface)] hover:text-[var(--color-primary)] transition-colors group"
                    >
                      <span className="text-2sm font-medium text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)]">
                        {provider.name} vs {other.name}
                      </span>
                      <span className="text-xs text-[var(--color-primary)]">→</span>
                    </Link>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Container>

      {crossLinks}

      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Review",
        itemReviewed: { "@type": "FinancialService", name: provider.name, description: provider.description, url: provider.website },
        reviewRating: { "@type": "Rating", ratingValue: review.editorRating, bestRating: 10, worstRating: 1 },
        author: { "@type": "Person", name: review.reviewer, url: `https://sendmoneycompare.com/about/${review.reviewer.toLowerCase().replace(/\s+/g, "-")}` },
        publisher: {
          "@type": "Organization",
          name: "SendMoneyCompare",
          "@id": "https://sendmoneycompare.com/#organization",
          logo: { "@type": "ImageObject", url: "https://sendmoneycompare.com/logos/sendmoneycompare-logo.png", width: 512, height: 512 },
        },
        datePublished: review.updatedAt,
        dateModified: review.updatedAt,
        reviewBody: review.editorVerdict,
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
          { "@type": "ListItem", position: 2, name: "Companies", item: "https://sendmoneycompare.com/companies" },
          { "@type": "ListItem", position: 3, name: provider.name, item: `https://sendmoneycompare.com/companies/${slug}` },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FinancialService",
        name: provider.name, description: provider.description, url: provider.website,
        ...(trustpilotIndex[slug]?.totalReviews && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(trustpilotIndex[slug].score.toFixed(1)),
            bestRating: 5, worstRating: 1,
            ratingCount: trustpilotIndex[slug].totalReviews,
          },
        }),
      }) }} />
      {review.faqs && review.faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: review.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }) }} />
      )}
    </>
  );
}

/* ─── Default auto-generated review (fallback) ─── */
function DefaultReview({
  slug,
  provider,
  otherProviders,
  crossLinks,
}: {
  slug: string;
  provider: (typeof providers)[number];
  otherProviders: (typeof providers)[number][];
  crossLinks: React.ReactNode;
}) {
  return (
    <>
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
                <PrimaryButton href={getGoUrl(provider.slug)} external size="sm">Visit {provider.name}</PrimaryButton>
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
                  <div key={row.label} className="flex justify-between py-3 text-sm">
                    <span className="text-[var(--color-on-surface-variant)]">{row.label}</span>
                    <span className="font-medium text-[var(--color-on-surface)] text-right max-w-[60%]">{row.value}</span>
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
                    href={`/compare/${provider.slug}-vs-${other.slug}`}
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
          </div>
        </div>
      </Container>

      {crossLinks}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FinancialService",
        name: provider.name, description: provider.description, url: provider.website,
        ...(trustpilotIndex[slug]?.totalReviews && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(trustpilotIndex[slug].score.toFixed(1)),
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
