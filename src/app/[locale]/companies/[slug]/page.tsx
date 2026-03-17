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
  const title = review?.title ?? `${provider.name} Review — Fees, Rates & Features`;
  const description = review?.metaDescription ?? provider.description;
  return {
    title,
    description,
    ...(!review && { robots: { index: false, follow: true } }),
    openGraph: {
      title: review?.title ?? `${provider.name} Review — Fees, Rates & Features`,
      description,
      type: "article",
    },
    alternates: {
      canonical: `https://sendmoneycompare.com/companies/${slug}`,
    },
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

/* ─── Detailed editorial review (when review data exists) ─── */

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
  return (
    <>
      <Container className="py-8">
        {/* Breadcrumb */}
        <nav className="text-[13px] text-[var(--color-on-surface-variant)] mb-6">
          <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
          {" / "}
          <Link href="/companies" className="hover:text-[var(--color-primary)]">Companies</Link>
          {" / "}
          <span className="text-[var(--color-on-surface)]">{provider.name}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header with editor rating */}
            <Card>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden shrink-0">
                  <Image src={provider.logo} alt={provider.name} width={80} height={80} className="object-cover" />
                </div>
                <div className="flex-1">
                  <h1 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)]">{review.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <RatingBadge rating={provider.rating} label={provider.ratingLabel} size="md" />
                    <span className="text-[13px] text-[var(--color-on-surface-variant)]">Updated {review.updatedAt}</span>
                    <span className="text-[13px] text-[var(--color-on-surface-variant)]">{review.readTime}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[12px] text-[var(--color-on-surface-variant)]">
                    <span>Reviewed by <Link href={`/about/akif-hazarvi`} className="text-[var(--color-primary)] hover:underline">{review.reviewer}</Link></span>
                    <span>Fact-checked by <Link href={`/about/awais-imran`} className="text-[var(--color-primary)] hover:underline">{review.factChecker}</Link></span>
                    <span>Data verified {review.lastVerified}</span>
                  </div>
                </div>
              </div>

              {/* Editor rating box */}
              <div className="bg-[var(--color-primary-surface)] rounded-xl p-5 mt-2">
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-[36px] font-bold text-[var(--color-primary)]">{review.editorRating}</div>
                  <div>
                    <p className="text-[14px] font-medium text-[var(--color-on-surface)]">Editor&apos;s Rating</p>
                    <p className="text-[12px] text-[var(--color-on-surface-variant)]">out of 10</p>
                  </div>
                </div>
                <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">{review.editorVerdict}</p>
              </div>

              <div className="flex gap-3 mt-5">
                <PrimaryButton href={getGoUrl(provider.slug)} external size="sm">
                  Visit {provider.name}
                </PrimaryButton>
                <Link
                  href="/send-money"
                  className="inline-flex items-center h-9 px-5 border border-[var(--color-outline)] rounded-full text-[13px] font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors"
                >
                  Compare Rates
                </Link>
              </div>
            </Card>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Countries", value: `${provider.supportedCountries}+` },
                { label: "Currencies", value: `${provider.supportedCurrencies}+` },
                { label: "Speed", value: provider.transferSpeed },
                { label: "Fees", value: provider.feeStructure },
                { label: "Founded", value: String(provider.founded) },
                { label: "Regulated", value: provider.regulated ? "Yes" : "No" },
                { label: "Min Transfer", value: `$${provider.minTransfer}` },
                { label: "Editor Rating", value: `${review.editorRating}/10` },
              ].map((stat) => (
                <StatBox key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>

            {/* Table of Contents */}
            <Card>
              <h2 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-3">In this review</h2>
              <div className="grid sm:grid-cols-2 gap-1">
                {review.sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="text-[14px] text-[var(--color-primary)] hover:underline py-1"
                  >
                    {s.heading}
                  </a>
                ))}
                <a href="#pros-cons" className="text-[14px] text-[var(--color-primary)] hover:underline py-1">
                  Pros and Cons
                </a>
                <a href="#who-should-use" className="text-[14px] text-[var(--color-primary)] hover:underline py-1">
                  Who Should Use {provider.name}
                </a>
                <a href="#alternatives" className="text-[14px] text-[var(--color-primary)] hover:underline py-1">
                  Alternatives
                </a>
                <a href="#how-we-tested" className="text-[14px] text-[var(--color-primary)] hover:underline py-1">
                  How We Tested
                </a>
                <a href="#faq" className="text-[14px] text-[var(--color-primary)] hover:underline py-1">
                  FAQ
                </a>
              </div>
            </Card>

            {/* Live corridor performance */}
            <Card>
              <h2 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-4">
                Live {provider.name} rates today
              </h2>
              <BestTransferToday amount={1000} from="USD" to="INR" symbol="₹" />
            </Card>

            {/* Article Sections */}
            {review.sections.map((section) => (
              <Card key={section.id} id={section.id}>
                <h2 className="text-[18px] md:text-[20px] font-medium text-[var(--color-on-surface)] mb-4">
                  {section.heading}
                </h2>
                <div
                  className="prose prose-sm max-w-none text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed [&_table]:w-full [&_table]:text-[13px] [&_table]:border-collapse [&_th]:bg-[var(--color-surface-container)] [&_th]:text-left [&_th]:px-3 [&_th]:py-2 [&_th]:text-[var(--color-on-surface)] [&_th]:font-medium [&_td]:px-3 [&_td]:py-2 [&_td]:border-t [&_td]:border-[var(--color-outline)] [&_strong]:text-[var(--color-on-surface)] [&_ul]:space-y-1.5 [&_li]:text-[14px] [&_em]:text-[var(--color-on-surface)] [&_p]:mb-4"
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
              <h2 className="text-[18px] md:text-[20px] font-medium text-[var(--color-on-surface)] mb-5">
                Who should use {provider.name}?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {review.whoShouldUse.map((group) => (
                  <div key={group.heading}>
                    <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-3">{group.heading}</h3>
                    <ul className="space-y-2">
                      {group.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[14px] text-[var(--color-on-surface-variant)]">
                          <span className={`mt-0.5 shrink-0 ${group.heading.toLowerCase().includes("ideal") ? "text-[var(--color-success-dark)]" : "text-[#c5221f]"}`}>
                            {group.heading.toLowerCase().includes("ideal") ? "✓" : "✗"}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>

            {/* Alternatives */}
            <Card id="alternatives">
              <h2 className="text-[18px] md:text-[20px] font-medium text-[var(--color-on-surface)] mb-5">
                {provider.name} alternatives
              </h2>
              <div className="space-y-3">
                {review.alternatives.map((alt) => {
                  const altProvider = providers.find((p) => p.slug === alt.slug);
                  if (!altProvider) return null;
                  return (
                    <div
                      key={alt.slug}
                      className="flex items-center justify-between p-4 bg-[var(--color-surface-dim)] rounded-xl"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                          <Image src={altProvider.logo} alt={altProvider.name} width={40} height={40} className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-medium text-[var(--color-on-surface)] truncate">{altProvider.name}</p>
                          <p className="text-[13px] text-[var(--color-on-surface-variant)] truncate">{alt.reason}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0 ml-3">
                        <Link
                          href={`/companies/${alt.slug}`}
                          className="text-[12px] font-medium text-[var(--color-primary)] hover:underline"
                        >
                          Review
                        </Link>
                        <Link
                          href={`/compare/${slug}-vs-${alt.slug}`}
                          className="text-[12px] font-medium text-[var(--color-primary)] hover:underline"
                        >
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
              <h2 className="text-[18px] md:text-[20px] font-medium text-[var(--color-on-surface)] mb-4">
                How we tested {provider.name}
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                {review.howWeTested}
              </p>
              <p className="text-[12px] text-[var(--color-on-surface-variant)] mt-4 pt-3 border-t border-[var(--color-outline)]">
                Last verified: {review.lastVerified} &middot; Reviewed by{" "}
                <Link href="/about/akif-hazarvi" className="text-[var(--color-primary)] hover:underline">{review.reviewer}</Link>
                {" "}&middot; Fact-checked by{" "}
                <Link href="/about/awais-imran" className="text-[var(--color-primary)] hover:underline">{review.factChecker}</Link>
              </p>
            </Card>

            {/* FAQ */}
            <Card id="faq">
              <h2 className="text-[18px] md:text-[20px] font-medium text-[var(--color-on-surface)] mb-5">
                Frequently asked questions
              </h2>
              <div className="divide-y divide-[var(--color-outline)]">
                {review.faqs.map((faq, i) => (
                  <details key={i} className="group py-4 first:pt-0">
                    <summary className="flex items-center justify-between cursor-pointer text-[15px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)]">
                      {faq.q}
                      <span className="text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform ml-3 shrink-0">
                        ▾
                      </span>
                    </summary>
                    <p className="mt-3 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary card */}
            <Card className="sticky top-20">
              <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-3">{provider.name} at a glance</h3>
              <div className="space-y-2 text-[13px]">
                {[
                  { label: "Editor Rating", value: `${review.editorRating}/10` },
                  { label: "Trustpilot", value: `${provider.rating}/5 (${provider.ratingLabel})` },
                  { label: "Fees", value: provider.feeStructure },
                  { label: "Speed", value: provider.transferSpeed },
                  { label: "Countries", value: `${provider.supportedCountries}+` },
                  { label: "Rate Markup", value: provider.exchangeRateMarkup },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between py-1.5 border-b border-[var(--color-outline)] last:border-0">
                    <span className="text-[var(--color-on-surface-variant)]">{row.label}</span>
                    <span className="font-medium text-[var(--color-on-surface)]">{row.value}</span>
                  </div>
                ))}
              </div>
              <PrimaryButton href={getGoUrl(provider.slug)} external size="sm" className="w-full mt-4">
                Visit {provider.name}
              </PrimaryButton>
            </Card>

            {/* Compare widget */}
            <Card>
              <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-4">Compare {provider.name}</h3>
              <ComparisonWidget compact />
            </Card>

            {/* Quick compare links */}
            <Card>
              <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-4">Compare With</h3>
              <div className="space-y-3">
                {otherProviders.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/compare/${slug}-vs-${other.slug}`}
                    className="flex items-center justify-between p-3 bg-[var(--color-surface-dim)] rounded-lg hover:bg-[var(--color-primary-surface)] transition-colors"
                  >
                    <span className="text-[13px] font-medium text-[var(--color-on-surface)]">
                      {provider.name} vs {other.name}
                    </span>
                    <span className="text-[12px] text-[var(--color-primary)]">&rarr;</span>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Container>

      {crossLinks}

      {/* JSON-LD: Review */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Review",
            itemReviewed: {
              "@type": "FinancialService",
              name: provider.name,
              description: provider.description,
              url: provider.website,
            },
            reviewRating: {
              "@type": "Rating",
              ratingValue: review.editorRating,
              bestRating: 10,
              worstRating: 1,
            },
            author: { "@type": "Person", name: review.reviewer, url: "https://sendmoneycompare.com/about/akif-hazarvi" },
            datePublished: review.updatedAt,
            reviewBody: review.editorVerdict,
          }),
        }}
      />
      {/* JSON-LD: FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: review.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
              { "@type": "ListItem", position: 2, name: "Companies", item: "https://sendmoneycompare.com/companies" },
              { "@type": "ListItem", position: 3, name: provider.name, item: `https://sendmoneycompare.com/companies/${slug}` },
            ],
          }),
        }}
      />
      {/* JSON-LD: AggregateRating */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialService",
            name: provider.name,
            description: provider.description,
            url: provider.website,
            ...(trustpilotIndex[slug]?.totalReviews && {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: trustpilotIndex[slug].score.toFixed(1),
                bestRating: "5",
                worstRating: "1",
                ratingCount: String(trustpilotIndex[slug].totalReviews),
              },
            }),
          }),
        }}
      />
    </>
  );
}

/* ─── Default auto-generated review (fallback for providers without editorial content) ─── */

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
      <Container className="py-8">
        {/* Breadcrumb */}
        <nav className="text-[13px] text-[var(--color-on-surface-variant)] mb-6">
          <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
          {" / "}
          <Link href="/companies" className="hover:text-[var(--color-primary)]">Companies</Link>
          {" / "}
          <span className="text-[var(--color-on-surface)]">{provider.name}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <Card>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden shrink-0">
                  <Image src={provider.logo} alt={provider.name} width={80} height={80} className="object-cover" />
                </div>
                <div>
                  <h1 className="text-[24px] md:text-[30px] font-normal text-[var(--color-on-surface)]">{provider.name}</h1>
                  <div className="flex items-center gap-3 mt-1">
                    <RatingBadge rating={provider.rating} label={provider.ratingLabel} size="md" />
                    <span className="text-[13px] text-[var(--color-on-surface-variant)]">Est. {provider.founded}</span>
                  </div>
                </div>
              </div>
              <p className="text-[14px] text-[var(--color-on-surface-variant)]">{provider.description}</p>
              <div className="flex gap-3 mt-4">
                <PrimaryButton href={getGoUrl(provider.slug)} external size="sm">
                  Visit {provider.name}
                </PrimaryButton>
                <Link
                  href="/send-money"
                  className="inline-flex items-center h-9 px-5 border border-[var(--color-outline)] rounded-full text-[13px] font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors"
                >
                  Compare Rates
                </Link>
              </div>
            </Card>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <h2 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-4">Key Features</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {provider.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-[14px] bg-[var(--color-surface-dim)] rounded-lg p-3">
                    <span className="text-[var(--color-primary)]">•</span>
                    {feature}
                  </div>
                ))}
              </div>
            </Card>

            {/* Details */}
            <Card>
              <h2 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-4">Transfer Details</h2>
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
                  <div key={row.label} className="flex justify-between py-3 text-[14px]">
                    <span className="text-[var(--color-on-surface-variant)]">{row.label}</span>
                    <span className="font-medium text-[var(--color-on-surface)] text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-20">
              <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-4">Compare {provider.name}</h3>
              <ComparisonWidget compact />
            </Card>

            <Card>
              <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-4">Compare With</h3>
              <div className="space-y-3">
                {otherProviders.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/compare/${provider.slug}-vs-${other.slug}`}
                    className="flex items-center justify-between p-3 bg-[var(--color-surface-dim)] rounded-lg hover:bg-[var(--color-primary-surface)] transition-colors"
                  >
                    <span className="text-[13px] font-medium text-[var(--color-on-surface)]">
                      {provider.name} vs {other.name}
                    </span>
                    <span className="text-[12px] text-[var(--color-primary)]">&rarr;</span>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Container>

      {crossLinks}

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialService",
            name: provider.name,
            description: provider.description,
            url: provider.website,
            ...(trustpilotIndex[slug]?.totalReviews && {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: trustpilotIndex[slug].score.toFixed(1),
                bestRating: "5",
                worstRating: "1",
                ratingCount: String(trustpilotIndex[slug].totalReviews),
              },
            }),
            address: {
              "@type": "PostalAddress",
              addressLocality: provider.headquarters,
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
              { "@type": "ListItem", position: 2, name: "Companies", item: "https://sendmoneycompare.com/companies" },
              { "@type": "ListItem", position: 3, name: provider.name, item: `https://sendmoneycompare.com/companies/${slug}` },
            ],
          }),
        }}
      />
    </>
  );
}
