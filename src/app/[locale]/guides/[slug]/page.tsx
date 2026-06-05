import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import Card from "@/components/Card";
import { blogPosts, getBlogPost, getRelatedPosts } from "@/data/blog-posts";
import { getAuthorByName } from "@/data/authors";

// Revalidate every 24 hours — editorial content changes infrequently
export const revalidate = 86400;
import Breadcrumb from "@/components/Breadcrumb";
import { formatLocalDate } from "@/lib/format-date";
import { sanitizeHtml } from "@/lib/sanitize";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ScrollTracker } from "@/components/ScrollTracker";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import InlineProviderQuotes from "@/components/InlineProviderQuotes";
import GuideSidebarCTA from "@/components/GuideSidebarCTA";
import GuidePageNudge from "@/components/GuidePageNudge";

interface InlineQuoteCorridor {
  from: string;
  to: string;
  amount: number;
  heading?: string;
}

const SLUG_CORRIDOR_OVERRIDES: Record<string, InlineQuoteCorridor> = {
  "send-money-to-philippines-guide": { from: "USD", to: "PHP", amount: 1000, heading: "Top USD → PHP providers right now" },
  "send-money-to-china-guide": { from: "USD", to: "CNY", amount: 1000, heading: "Top USD → CNY providers right now" },
  "how-to-send-money-from-china": { from: "CNY", to: "AUD", amount: 10000, heading: "Live CNY → AUD rates — compare outbound providers" },
  "best-money-transfer-apps-china-yuan": { from: "CNY", to: "GBP", amount: 10000, heading: "Live CNY → GBP rates from licensed operators" },
  "large-business-transfers-from-china-cny": { from: "CNY", to: "USD", amount: 50000, heading: "Live CNY → USD rates for large transfers" },
  "send-money-to-colombia-guide": { from: "USD", to: "COP", amount: 1000, heading: "Top USD → COP providers right now" },
  "send-money-to-jamaica-guide": { from: "USD", to: "JMD", amount: 500, heading: "Top USD → JMD providers right now" },
  "send-money-to-ethiopia-guide": { from: "USD", to: "ETB", amount: 500, heading: "Top USD → ETB providers right now" },
  "send-money-to-mexico-guide": { from: "USD", to: "MXN", amount: 1000, heading: "Top USD → MXN providers right now" },
  "send-money-to-kenya-from-usa-guide": { from: "USD", to: "KES", amount: 500, heading: "Top USD → KES providers right now" },
  "send-money-uae-to-india-guide": { from: "AED", to: "INR", amount: 5000, heading: "Top AED → INR providers right now" },
  "send-money-uae-to-pakistan-guide": { from: "AED", to: "PKR", amount: 5000, heading: "Top AED → PKR providers right now" },
  "best-money-transfer-apps": { from: "USD", to: "INR", amount: 1000, heading: "Live USD → INR rates from top-ranked apps" },
  "best-money-transfer-services": { from: "USD", to: "INR", amount: 1000, heading: "Live USD → INR rates from top-ranked services" },
  "best-money-transfer-apps-expats-2026": { from: "USD", to: "EUR", amount: 1000, heading: "Live USD → EUR rates for expats" },
  "us-dollar-forecast-2026": { from: "USD", to: "INR", amount: 1000, heading: "Lock in today's USD rate — top providers" },
  "money-transfer-limits-by-provider-country": { from: "USD", to: "INR", amount: 5000, heading: "Live USD → INR rates by provider" },
  "wise-vs-remitly-comparison": { from: "USD", to: "INR", amount: 1000, heading: "Wise vs Remitly — live USD → INR rates" },
  "exchange-rate-markup-explained": { from: "USD", to: "EUR", amount: 1000, heading: "See markup-free rates — top USD → EUR providers" },
  "multi-currency-accounts-exchange-rates": { from: "USD", to: "EUR", amount: 1000, heading: "Top USD → EUR providers (multi-currency ready)" },
  "stablecoin-international-transfers-guide": { from: "USD", to: "EUR", amount: 1000, heading: "Compare USD → EUR fiat rates" },
  "revolut-foreign-transaction-fees-2026": { from: "USD", to: "EUR", amount: 1000, heading: "Top USD → EUR providers vs Revolut" },
  "wire-transfer-guide": { from: "USD", to: "EUR", amount: 1000, heading: "Skip the wire — top USD → EUR providers" },
  "how-to-send-money-abroad": { from: "USD", to: "INR", amount: 1000, heading: "Live USD → INR rates — top providers today" },
  "cheapest-way-to-send-money-internationally": { from: "USD", to: "INR", amount: 1000, heading: "Today's cheapest USD → INR providers" },
  "money-transfer-safety-guide": { from: "USD", to: "INR", amount: 1000, heading: "Top regulated USD → INR providers" },
  "pakistan-remittance-loss-2026": { from: "AED", to: "PKR", amount: 5000, heading: "Live AED → PKR rates — close your loss now" },
  "taptap-send-vs-wise-remitly-usd-to-pkr": { from: "USD", to: "PKR", amount: 1000, heading: "Live USD → PKR rates right now — see where TapTap ranks today" },
};

const TAG_TO_CORRIDOR: Record<string, InlineQuoteCorridor> = {
  india: { from: "USD", to: "INR", amount: 1000 },
  inr: { from: "USD", to: "INR", amount: 1000 },
  pakistan: { from: "USD", to: "PKR", amount: 1000 },
  pkr: { from: "USD", to: "PKR", amount: 1000 },
  philippines: { from: "USD", to: "PHP", amount: 1000 },
  php: { from: "USD", to: "PHP", amount: 1000 },
  mexico: { from: "USD", to: "MXN", amount: 1000 },
  mxn: { from: "USD", to: "MXN", amount: 1000 },
  nigeria: { from: "USD", to: "NGN", amount: 500 },
  ngn: { from: "USD", to: "NGN", amount: 500 },
  bangladesh: { from: "GBP", to: "BDT", amount: 500 },
  bdt: { from: "GBP", to: "BDT", amount: 500 },
  europe: { from: "GBP", to: "EUR", amount: 1000 },
  eur: { from: "USD", to: "EUR", amount: 1000 },
  morocco: { from: "EUR", to: "MAD", amount: 500 },
  vietnam: { from: "USD", to: "VND", amount: 1000 },
  brazil: { from: "USD", to: "BRL", amount: 1000 },
  colombia: { from: "USD", to: "COP", amount: 1000 },
  china: { from: "USD", to: "CNY", amount: 1000 },
};

function getInlineQuoteCorridor(slug: string, tags: string[]): InlineQuoteCorridor {
  if (SLUG_CORRIDOR_OVERRIDES[slug]) return SLUG_CORRIDOR_OVERRIDES[slug];
  for (const tag of tags) {
    const words = tag.toLowerCase().split(/[\s,/-]+/);
    for (const word of words) {
      if (TAG_TO_CORRIDOR[word]) return TAG_TO_CORRIDOR[word];
    }
  }
  return { from: "USD", to: "INR", amount: 1000 };
}

/** Slugify a heading string into a URL-friendly ID */
function slugifyHeading(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

const TAG_CORRIDOR_MAP: Record<string, { href: string; label: string }> = {
  india: { href: "/send-money/usa-to-india", label: "USA to India transfers" },
  inr: { href: "/send-money/usa-to-india", label: "USA to India transfers" },
  pakistan: { href: "/send-money/usa-to-pakistan", label: "USA to Pakistan transfers" },
  pkr: { href: "/send-money/usa-to-pakistan", label: "USA to Pakistan transfers" },
  mexico: { href: "/send-money/usa-to-mexico", label: "USA to Mexico transfers" },
  mxn: { href: "/send-money/usa-to-mexico", label: "USA to Mexico transfers" },
  philippines: { href: "/send-money/usa-to-philippines", label: "USA to Philippines transfers" },
  php: { href: "/send-money/usa-to-philippines", label: "USA to Philippines transfers" },
  europe: { href: "/send-money/uk-to-europe", label: "UK to Europe transfers" },
  eur: { href: "/send-money/uk-to-europe", label: "UK to Europe transfers" },
  nigeria: { href: "/send-money/usa-to-nigeria", label: "USA to Nigeria transfers" },
  ngn: { href: "/send-money/usa-to-nigeria", label: "USA to Nigeria transfers" },
  bangladesh: { href: "/send-money/uk-to-bangladesh", label: "UK to Bangladesh transfers" },
  bdt: { href: "/send-money/uk-to-bangladesh", label: "UK to Bangladesh transfers" },
  uk: { href: "/send-money/uk-to-india", label: "UK to India transfers" },
  gbp: { href: "/send-money/uk-to-india", label: "UK to India transfers" },
  usd: { href: "/send-money/usa-to-india", label: "USA to India transfers" },
  iban: { href: "/iban", label: "IBAN lookup tool" },
  swift: { href: "/swift-codes", label: "SWIFT code finder" },
  business: { href: "/business", label: "Business transfers" },
};

const DEFAULT_CORRIDORS = [
  { href: "/send-money/uk-to-india", label: "UK to India transfers" },
  { href: "/send-money/usa-to-india", label: "USA to India transfers" },
  { href: "/send-money/usa-to-pakistan", label: "USA to Pakistan transfers" },
  { href: "/send-money/usa-to-mexico", label: "USA to Mexico transfers" },
  { href: "/send-money/uk-to-europe", label: "UK to Europe transfers" },
];

function getExploreLinks(tags: string[], category: string): { href: string; label: string }[] {
  const fixed = [
    { href: "/companies", label: "Provider reviews" },
    { href: "/compare", label: "Head-to-head comparisons" },
  ];

  const seen = new Set(fixed.map((l) => l.href));
  const dynamic: { href: string; label: string }[] = [];

  // Add business link for Business category
  if (category === "Business" && !seen.has("/business")) {
    dynamic.push({ href: "/business", label: "Business transfers" });
    seen.add("/business");
  }

  // Scan tags for corridor matches
  for (const tag of tags) {
    const words = tag.toLowerCase().split(/[\s,/-]+/);
    for (const word of words) {
      const match = TAG_CORRIDOR_MAP[word];
      if (match && !seen.has(match.href)) {
        dynamic.push(match);
        seen.add(match.href);
      }
      if (dynamic.length >= 5) break;
    }
    if (dynamic.length >= 5) break;
  }

  // Fall back to default corridors if fewer than 3 tag matches
  if (dynamic.length < 3) {
    for (const fallback of DEFAULT_CORRIDORS) {
      if (!seen.has(fallback.href)) {
        dynamic.push(fallback);
        seen.add(fallback.href);
      }
      if (dynamic.length >= 5) break;
    }
  }

  return [...fixed, ...dynamic.slice(0, 5)];
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "guidesSlug" });
  const post = getBlogPost(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.title,
    description: post.metaDescription,
    other: {
      "citation_title": post.title,
      "citation_author": post.author,
      "citation_date": post.updatedAt,
      "citation_publication_date": post.publishedAt,
      "citation_journal_title": "SendMoneyCompare Guides",
      "citation_public_url": `https://sendmoneycompare.com/guides/${slug}`,
      "ai-content-declaration": "human-written, data-verified, fact-checked",
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      ...(post.featuredImage && { images: [{ url: post.featuredImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
      ...(post.featuredImage && { images: [post.featuredImage] }),
    },
    alternates: getAlternates(`guides/${slug}`, locale),
    // Guide content is English-only; noindex locale variants to avoid duplicate content
    ...(locale !== "en" && { robots: { index: false, follow: true } }),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "guidesSlug" });
  const post = getBlogPost(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug);

  const sectionIds = post.sections.map((s) => slugifyHeading(s.heading));
  const inlineQuoteCorridor = getInlineQuoteCorridor(slug, post.tags);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    ...(post.featuredImage && { image: `https://sendmoneycompare.com${post.featuredImage}` }),
    author: {
      "@type": "Person",
      "@id": `https://sendmoneycompare.com/about/${post.author.toLowerCase().replace(/\s+/g, "-")}#person`,
      name: post.author,
      url: `https://sendmoneycompare.com/about/${post.author.toLowerCase().replace(/\s+/g, "-")}`,
    },
    reviewedBy: {
      "@type": "Person",
      "@id": "https://sendmoneycompare.com/about/awais-imran#person",
      name: "Awais Imran",
      url: "https://sendmoneycompare.com/about/awais-imran",
    },
    mainEntityOfPage: `https://sendmoneycompare.com/guides/${slug}`,
    isPartOf: { "@type": "WebPage", "@id": "https://sendmoneycompare.com/guides" },
    about: [
      { "@type": "Thing", name: "International Money Transfer" },
      ...(post.category === "Corridors" ? [{ "@type": "Thing", name: post.title.split(":")[0] }] : []),
    ],
    publisher: {
      "@type": "Organization",
      name: "SendMoneyCompare",
      "@id": "https://sendmoneycompare.com/#organization",
      logo: { "@type": "ImageObject", url: "https://sendmoneycompare.com/logos/sendmoneycompare-logo.png", width: 512, height: 512 },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://sendmoneycompare.com/guides" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://sendmoneycompare.com/guides/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {post.faqs && post.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: post.faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            }),
          }}
        />
      )}
      {/* HowTo JSON-LD removed: Google deprecated HowTo rich results in
          September 2023, so it produced no SERP feature while adding
          structured-data weight. The visual step-by-step render below
          (driven by the same post.howToSteps) is unaffected. */}

      <ScrollTracker slug={slug} contentType="guide" />

      {/* ── Article Hero ── */}
      <div className="border-b border-[var(--color-outline)] bg-[var(--color-surface-warm)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 md:py-14">

          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: post.title }]} />

          <div className="max-w-[720px]">
            {/* Category badge */}
            <div className="inline-flex items-center gap-1.5 text-overline text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-3 py-1.5 rounded-full mb-5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              {post.category}
            </div>

            {/* H1 — Instrument Serif for editorial authority */}
            <h1 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.18] tracking-[-0.02em] text-[var(--color-on-surface)] mb-4">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-md md:text-lg text-[var(--color-on-surface-variant)] leading-[1.7] mb-7 max-w-[620px]">
              {post.excerpt}
            </p>

            {/* Author row */}
            <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-[var(--color-outline)]">
              <Link href={`/about/${getAuthorByName(post.author)?.slug || "akif-hazarvi"}`} className="flex items-center gap-2 text-2sm font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                {getAuthorByName(post.author)?.photo ? (
                  <Image src={getAuthorByName(post.author)!.photo!} alt={post.author} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-semibold text-xs">{getAuthorByName(post.author)?.initials || "AH"}</span>
                )}
                {post.author}
              </Link>
              <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
              <time dateTime={post.publishedAt} className="text-2sm text-[var(--color-on-surface-variant)]">
                Published {formatLocalDate(post.publishedAt)}
              </time>
              {post.updatedAt !== post.publishedAt && (
                <>
                  <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
                  <time dateTime={post.updatedAt} className="text-2sm text-[var(--color-on-surface-variant)]">
                    Updated {formatLocalDate(post.updatedAt)}
                  </time>
                </>
              )}
              <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
              <span className="text-2sm text-[var(--color-on-surface-variant)]">{post.readTime}</span>
              {/* Fact-checked badge */}
              <div className="ml-auto flex items-center gap-1.5 text-xs font-medium text-[var(--color-success-dark)] bg-[var(--color-success-surface)] px-3 py-1 rounded-full">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Fact-checked by{" "}
                <Link href="/about/awais-imran" className="hover:underline">Awais Imran</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Featured Image ── */}
      {post.featuredImage && (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 -mt-1">
          <div className="relative w-full h-[220px] md:h-[380px] rounded-b-2xl overflow-hidden">
            <Image src={post.featuredImage} alt={post.title} fill className="object-cover" priority />
          </div>
        </div>
      )}

      {/* ── Main Layout ── */}
      <Container className="py-10">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* ── Article ── */}
          <article className="flex-1 min-w-0">

            <div className="mb-6">
              <AffiliateDisclosure />
            </div>

            {/* Key Takeaway */}
            {post.excerpt && (
              <div className="callout-key-takeaway mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-overline text-[var(--color-primary)] mb-1">Key Takeaway</p>
                    <p className="text-md text-[var(--color-on-surface)] leading-relaxed font-medium">{post.excerpt}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile TOC — collapsible */}
            {post.sections.length > 0 && (
              <details className="lg:hidden mb-8 border border-[var(--color-outline)] rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer px-5 py-4 bg-[var(--color-surface-dim)] text-sm font-semibold text-[var(--color-on-surface)] select-none">
                  <span>In this guide ({post.sections.length + (post.faqs?.length ? 1 : 0)} sections)</span>
                  <svg className="w-4 h-4 text-[var(--color-on-surface-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <ol className="divide-y divide-[var(--color-outline)]">
                  {post.sections.map((section, i) => (
                    <li key={i}>
                      <a href={`#${sectionIds[i]}`} className="block px-5 py-3 text-sm text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-colors">
                        {section.heading}
                      </a>
                    </li>
                  ))}
                  {post.faqs?.length ? (
                    <li>
                      <a href="#faqs" className="block px-5 py-3 text-sm text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-colors">
                        Frequently Asked Questions
                      </a>
                    </li>
                  ) : null}
                </ol>
              </details>
            )}

            {/* Desktop TOC — inside article on small-medium screens, hidden when sidebar TOC shows */}
            {post.sections.length > 0 && (
              <div className="hidden lg:block xl:hidden bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-2xl p-5 mb-8">
                <p className="text-overline text-[var(--color-on-surface-muted)] mb-3">In this guide</p>
                <ol className="space-y-1.5">
                  {post.sections.map((section, i) => (
                    <li key={i}>
                      <a href={`#${sectionIds[i]}`} className="text-2sm text-[var(--color-primary)] hover:underline leading-snug block">
                        {section.heading}
                      </a>
                    </li>
                  ))}
                  {post.faqs?.length ? (
                    <li>
                      <a href="#faqs" className="text-2sm text-[var(--color-primary)] hover:underline">Frequently Asked Questions</a>
                    </li>
                  ) : null}
                </ol>
              </div>
            )}

            {/* Article Sections */}
            {post.sections.map((section, i) => (
              <section key={i} id={sectionIds[i]} className="mb-12">
                <h2 className="font-display text-[clamp(1.375rem,3vw,1.625rem)] font-normal leading-[1.28] tracking-[-0.01em] text-[var(--color-on-surface)] mb-5">
                  {section.heading}
                </h2>
                <div
                  className="prose-content prose-custom"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.content) }}
                />

                {/* Inline live-quote widget after 2nd section — converts editorial readers */}
                {i === 1 && (
                  <InlineProviderQuotes
                    from={inlineQuoteCorridor.from}
                    to={inlineQuoteCorridor.to}
                    amount={inlineQuoteCorridor.amount}
                    heading={inlineQuoteCorridor.heading}
                    source={`guide:${slug}`}
                  />
                )}
              </section>
            ))}

            {/* Live quotes — at the end of all sections, before FAQs */}
            {post.sections.length > 0 && (
              <InlineProviderQuotes
                from={inlineQuoteCorridor.from}
                to={inlineQuoteCorridor.to}
                amount={inlineQuoteCorridor.amount}
                heading={`Don't overpay — here's the cheapest ${inlineQuoteCorridor.from} → ${inlineQuoteCorridor.to} provider right now`}
                subheading={`Live rates for ${inlineQuoteCorridor.from} ${inlineQuoteCorridor.amount.toLocaleString()} — updated every 6 hours from 50+ apps`}
                source={`guide:${slug}:end`}
              />
            )}

            {/* HowTo Steps — visual rendering */}
            {post.howToSteps && post.howToSteps.length > 0 && (
              <section id="how-to-steps" className="mb-12">
                <h2 className="font-display text-[clamp(1.375rem,3vw,1.625rem)] font-normal leading-[1.28] tracking-[-0.01em] text-[var(--color-on-surface)] mb-5">
                  Step-by-Step Guide
                </h2>
                <ol className="space-y-4">
                  {post.howToSteps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-semibold">
                        {i + 1}
                      </span>
                      <div className="flex-1 pt-0.5">
                        <p className="text-md font-semibold text-[var(--color-on-surface)] mb-1">{step.name}</p>
                        <p className="text-md text-[var(--color-on-surface-variant)] leading-relaxed">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* FAQs */}
            {post.faqs?.length ? (
              <section id="faqs" className="mb-12">
                <h2 className="text-h3 font-semibold text-[var(--color-on-surface)] mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {post.faqs.map((faq, i) => (
                    <details
                      key={i}
                      className="group border border-[var(--color-outline)] rounded-xl overflow-hidden"
                      {...(i < 3 ? { open: true } : {})}
                    >
                      <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-md font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors select-none">
                        {faq.question}
                        <svg
                          className="w-4 h-4 text-[var(--color-on-surface-muted)] transition-transform group-open:rotate-180 shrink-0 ml-4"
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div
                        className="px-5 pb-5 pt-1 text-md text-[var(--color-on-surface-variant)] leading-relaxed border-t border-[var(--color-outline)] prose-custom"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.answer) }}
                      />
                    </details>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-[var(--color-outline)]">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-[var(--color-on-surface-variant)] bg-[var(--color-surface-dim)] border border-[var(--color-outline)] px-3 py-1 rounded-full hover:border-[var(--color-primary-light)] transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="lg:w-[300px] xl:w-[320px] shrink-0">
            {/* Sticky container is capped to the viewport height and scrolls
                internally when its content (TOC + CTA + related + explore) is
                taller than one screen — otherwise the lower items only became
                visible after scrolling the entire article. */}
            <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto space-y-6">

              {/* Desktop TOC — sticky in sidebar */}
              {post.sections.length > 0 && (
                <div className="hidden xl:block bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl shadow-[var(--shadow-xs)] p-5">
                  <p className="text-overline text-[var(--color-on-surface-muted)] mb-3">In this guide</p>
                  <ol className="space-y-0.5">
                    {post.sections.map((section, i) => (
                      <li key={i}>
                        <a
                          href={`#${sectionIds[i]}`}
                          className="block text-2sm text-[var(--color-on-surface-variant)] py-1.5 px-3 rounded-lg hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-all leading-snug"
                        >
                          {section.heading}
                        </a>
                      </li>
                    ))}
                    {post.faqs?.length ? (
                      <li>
                        <a href="#faqs" className="block text-2sm text-[var(--color-on-surface-variant)] py-1.5 px-3 rounded-lg hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-all">
                          Frequently Asked Questions
                        </a>
                      </li>
                    ) : null}
                  </ol>
                </div>
              )}

              {/* Comparison CTA — tracked */}
              <GuideSidebarCTA slug={slug} />

              {/* Related Guides */}
              {relatedPosts.length > 0 && (
                <div>
                  <p className="text-overline text-[var(--color-on-surface-muted)] mb-3">Related Guides</p>
                  <div className="space-y-2.5">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/guides/${related.slug}`}
                        className="group block bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl p-4 hover:shadow-[var(--shadow-sm)] hover:border-[var(--color-primary-light)] transition-all"
                      >
                        <span className="text-overline text-[var(--color-primary)] mb-2 block">
                          {related.category}
                        </span>
                        <h4 className="text-2sm font-semibold text-[var(--color-on-surface)] leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                          {related.title}
                        </h4>
                        <span className="text-2xs text-[var(--color-on-surface-muted)] mt-1.5 block">{related.readTime}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Explore more */}
              <div>
                <p className="text-overline text-[var(--color-on-surface-muted)] mb-3">Explore</p>
                <ul className="space-y-1">
                  {getExploreLinks(post.tags, post.category).map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-1.5 text-2sm text-[var(--color-primary)] py-1 hover:underline"
                      >
                        <span className="text-[var(--color-primary-light)]">›</span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </Container>
      {/* Sticky nudge — slides up after 30s or 50% scroll with live best quote */}
      <GuidePageNudge
        from={inlineQuoteCorridor.from}
        to={inlineQuoteCorridor.to}
        amount={inlineQuoteCorridor.amount}
        slug={slug}
      />
    </>
  );
}
