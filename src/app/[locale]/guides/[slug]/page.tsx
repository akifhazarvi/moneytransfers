import { notFound } from "next/navigation";
import { guideIsIndexable } from "@/lib/guide-status";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import GuideContents from "@/components/GuideContents";
import GuideReadingProgress from "@/components/GuideReadingProgress";
import GuidePreview from "@/components/GuidePreview";
import { ArrowLeft, BookOpen, Clock3 } from "lucide-react";
import { blogPosts, getBlogPost, getRelatedPosts } from "@/data/blog-posts";
import { getAuthorByName } from "@/data/authors";

// Revalidate every 24 hours — editorial content changes infrequently
export const revalidate = 86400;
import Breadcrumb from "@/components/Breadcrumb";
import { formatLocalDate } from "@/lib/format-date";
import { sanitizeHtml } from "@/lib/sanitize";
import { renderDataTokens } from "@/lib/ratings-tokens";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { seoTitle, seoDescription } from "@/lib/seo-title";
import { setRequestLocale } from "next-intl/server";
import { ScrollTracker } from "@/components/ScrollTracker";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import InlineProviderQuotes from "@/components/InlineProviderQuotes";
import InlineQuotesImpression from "@/components/InlineQuotesImpression";
import GuideSidebarCTA from "@/components/GuideSidebarCTA";
import GuidePageNudge from "@/components/GuidePageNudge";
import WhatsAppInlineCTA from "@/components/WhatsAppInlineCTA";
import FreelancerCostCalculator from "@/components/FreelancerCostCalculator";
import SettlementRace from "@/components/SettlementRace";

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
  // Top Bing entry point. Readers arrive mid-wire, so match the guide to the
  // classic SWIFT corridor rather than falling through to the USD→INR default.
  "swift-codes-explained": { from: "USD", to: "EUR", amount: 1000, heading: "Skip the SWIFT wire fee — top USD → EUR providers" },
  "how-to-send-money-abroad": { from: "USD", to: "INR", amount: 1000, heading: "Live USD → INR rates — top providers today" },
  "cheapest-way-to-send-money-internationally": { from: "USD", to: "INR", amount: 1000, heading: "Today's cheapest USD → INR providers" },
  "money-transfer-safety-guide": { from: "USD", to: "INR", amount: 1000, heading: "Top regulated USD → INR providers" },
  "pakistan-remittance-loss-2026": { from: "AED", to: "PKR", amount: 5000, heading: "Live AED → PKR rates — close your loss now" },
  "taptap-send-vs-wise-remitly-usd-to-pkr": { from: "USD", to: "PKR", amount: 1000, heading: "Live USD → PKR rates right now — see where TapTap ranks today" },
  "how-to-buy-spacex-nvidia-stock-using-revolut": { from: "USD", to: "GBP", amount: 1000, heading: "Fund your Revolut account — top USD → GBP providers" },
  "how-to-pay-international-freelancers-contractors": { from: "USD", to: "PHP", amount: 1000, heading: "Live cost of a $1,000 freelancer payment (USD → PHP)" },
  "top-money-transfer-apps-usa-to-india-2026": { from: "USD", to: "INR", amount: 1000, heading: "Live USD → INR rates — which app sends the most rupees today?" },
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
  europe: { href: "/send-money/usa-to-europe", label: "USA to Europe transfers" },
  eur: { href: "/send-money/usa-to-europe", label: "USA to Europe transfers" },
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
  { href: "/send-money/usa-to-europe", label: "USA to Europe transfers" },
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

// SOFT-404 FIX. With ISR (`revalidate` above) and dynamicParams defaulting to
// true, an unknown slug was rendered on demand and the notFound() result got
// cached and served as HTTP **200** carrying the "Not Found" body — a soft 404,
// on the one path we are actively building authority in. Verified live:
// /guides/this-page-does-not-exist-xyz returned 200 while /tools/nonexistent
// and other unmatched paths correctly returned 404.
//
// Guides are a fixed editorial set, so there is no case for on-demand slugs.
// dynamicParams = false makes anything outside generateStaticParams a real 404
// without invoking the component — the same allowlist pattern already used for
// corridor and compare routes. Coverage is complete: the [locale] layout
// generates every routing.locale and this generates every blogPosts slug.
export const dynamicParams = false;

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Not Found" };

  // <title> is written for the SERP; post.title stays the reader-facing <h1>.
  // They used to be the same string on all 74 indexable guides ("duplicate H1
  // and title tags"), and 8 of them ran past the 70-char render limit.
  const pageTitle = seoTitle(post.title, post.metaTitle);

  return {
    title: pageTitle,
    description: seoDescription(post.metaDescription),
    other: {
      "citation_title": post.title,
      "citation_author": post.author,
      "citation_date": post.updatedAt,
      "citation_publication_date": post.publishedAt,
      "citation_journal_title": "SendMoneyCompare Guides",
      "citation_public_url": `https://sendmoneycompare.com/guides/${slug}`,
      "ai-content-declaration": post.reviewedBy && post.reviewedAt
        ? "human-written, data-verified, fact-checked"
        : "human-written, data-verified",
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      images: post.featuredImage ? [{ url: post.featuredImage }] : DEFAULT_OG_IMAGES,
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
    // Thin-page guard, matching /compare and /send-money. guideIsIndexable() is
    // the single predicate sitemap.ts also uses, so robots and the sitemap
    // cannot disagree — the contradictory signal implicated in the May 8
    // deindex. Pages stay built and internally linked either way; set
    // contentStatus: "published" on the post to make one indexable.
    ...(locale === "en" && !guideIsIndexable(post) && { robots: { index: false, follow: true } }),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const post = getBlogPost(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug);

  const sectionIds = post.sections.map((s) => slugifyHeading(s.heading));
  const contents = [
    ...post.sections.map((section, i) => ({ id: sectionIds[i], title: section.heading })),
    ...(post.howToSteps?.length ? [{ id: "how-to-steps", title: "Step-by-step guide" }] : []),
    ...(post.faqs?.length ? [{ id: "faqs", title: "Frequently asked questions" }] : []),
  ];
  const inlineQuoteCorridor = getInlineQuoteCorridor(slug, post.tags);
  const author = getAuthorByName(post.author);
  const reviewer = post.reviewedBy ? getAuthorByName(post.reviewedBy) : undefined;

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
      "@id": `https://sendmoneycompare.com/about/${author?.slug ?? post.author.toLowerCase().replace(/\s+/g, "-")}#person`,
      name: post.author,
      url: `https://sendmoneycompare.com/about/${author?.slug ?? post.author.toLowerCase().replace(/\s+/g, "-")}`,
      ...(author?.role && { jobTitle: author.role }),
      ...(author?.byline && { description: author.byline }),
      ...(author?.expertise?.length && { knowsAbout: author.expertise }),
      ...(author?.linkedin && { sameAs: [author.linkedin] }),
    },
    ...(reviewer && post.reviewedAt && {
      reviewedBy: {
        "@type": "Person",
        "@id": `https://sendmoneycompare.com/about/${reviewer.slug}#person`,
        name: reviewer.name,
        url: `https://sendmoneycompare.com/about/${reviewer.slug}`,
        ...(reviewer.role && { jobTitle: reviewer.role }),
      },
    }),
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
                acceptedAnswer: { "@type": "Answer", text: renderDataTokens(f.answer) },
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
      <GuideReadingProgress />

      {/* ── Article Hero ── */}
      <header id="guide-top" className="guide-article-hero">
        <Container className="guide-article-hero-inner">

          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: post.title }]} />

          <div className="guide-article-heading">
            <div className="guide-article-kicker">
              <span className="guide-category" data-category={post.category}><BookOpen size={15} aria-hidden="true" />{post.category}</span>
              <span><Clock3 size={14} aria-hidden="true" />{post.readTime}</span>
            </div>
            <h1>{post.title}</h1>

            {/* Excerpt */}
            <p className="guide-article-deck">
              {post.excerpt}
            </p>

            {/* Author row */}
            <div className="guide-article-byline">
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
              {/* Fact-checked badge — shown only where BlogPost records a real
                  reviewer and review date. See the reviewedBy/reviewedAt note on
                  the BlogPost interface for why this is no longer unconditional. */}
              {reviewer && post.reviewedAt && (
                <div className="ml-auto flex items-center gap-1.5 text-xs font-medium text-[var(--color-success-dark)] bg-[var(--color-success-surface)] px-3 py-1 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Fact-checked by{" "}
                  <Link href={`/about/${reviewer.slug}`} className="hover:underline">{reviewer.name}</Link>{" "}
                  on <time dateTime={post.reviewedAt}>{formatLocalDate(post.reviewedAt)}</time>
                </div>
              )}
            </div>
          </div>
        </Container>
      </header>

      <Container className="guide-article-layout">
        <div className="guide-reading-grid">
          <article id="guide-article" className="guide-article-body">
            <GuideContents sections={contents} mobile />
            <div className="guide-disclosure"><AffiliateDisclosure /></div>
            {post.excerpt && (
              <section className="guide-key-takeaway" aria-label="Key takeaway">
                <p className="guide-eyebrow">Key Takeaway</p>
                <p>{post.excerpt}</p>
              </section>
            )}
            {post.featuredImage && (
              <div className="guide-article-image">
                <Image src={post.featuredImage} alt={post.title} fill sizes="(max-width: 1023px) 100vw, 760px" className="object-cover" priority />
              </div>
            )}

            {/* Article Sections */}
            {post.sections.map((section, i) => (
              <section key={i} id={sectionIds[i]} className="guide-article-section">
                <h2 className="text-[clamp(1.375rem,3vw,1.625rem)] font-bold leading-[1.28] tracking-tight text-[var(--color-on-surface)] mb-5">
                  {section.heading}
                </h2>
                <div
                  className="prose-content prose-custom"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(renderDataTokens(section.content)) }}
                />

                {/* Freelancer-cost calculator — only on the freelancer guide, after the "what it costs" section */}
                {i === 1 && slug === "how-to-pay-international-freelancers-contractors" && (
                  <FreelancerCostCalculator source={`guide:${slug}`} />
                )}

                {/* Settlement race — only on the authorization-vs-settlement guide, after the intro */}
                {i === 0 && slug === "authorization-vs-settlement-stablecoins" && (
                  <SettlementRace />
                )}

                {/* Inline live-quote widget after 2nd section — converts editorial readers */}
                {i === 1 && (
                  <>
                    <InlineProviderQuotes
                      from={inlineQuoteCorridor.from}
                      to={inlineQuoteCorridor.to}
                      amount={inlineQuoteCorridor.amount}
                      heading={inlineQuoteCorridor.heading}
                      source={`guide:${slug}`}
                    />
                    {/* Denominator for guide conversion. Without it, a guide with
                        1 click in 244 views is unreadable: nobody scrolled to the
                        widget, or everybody did and ignored it. */}
                    <InlineQuotesImpression
                      slug={slug}
                      from={inlineQuoteCorridor.from}
                      to={inlineQuoteCorridor.to}
                      providerCount={0}
                    />
                  </>
                )}
              </section>
            ))}

            {/* HowTo Steps — visual rendering */}
            {post.howToSteps && post.howToSteps.length > 0 && (
              <section id="how-to-steps" className="guide-article-section">
                <h2 className="text-[clamp(1.375rem,3vw,1.625rem)] font-bold leading-[1.28] tracking-tight text-[var(--color-on-surface)] mb-5">
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
              <section id="faqs" className="guide-article-section">
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
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(renderDataTokens(faq.answer)) }}
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

            {/* About the author — E-E-A-T credential box */}
            {author && (
              <section className="mt-10 bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-2xl p-6">
                <p className="text-overline text-[var(--color-on-surface-muted)] mb-4">About the author</p>
                <div className="flex items-start gap-4">
                  {author.photo ? (
                    <Image src={author.photo} alt={author.name} width={56} height={56} className="w-14 h-14 rounded-full object-cover shrink-0" />
                  ) : (
                    <span className="w-14 h-14 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-semibold text-base shrink-0">{author.initials}</span>
                  )}
                  <div className="min-w-0">
                    <Link href={`/about/${author.slug}`} className="text-md font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                      {author.name}
                    </Link>
                    <p className="text-2sm text-[var(--color-on-surface-variant)]">{author.role}</p>
                    <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed mt-2">{author.byline}</p>
                    {author.credentials?.length ? (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {author.credentials.slice(0, 3).map((cred) => (
                          <li key={cred} className="text-2xs font-medium text-[var(--color-on-surface-variant)] bg-[var(--color-surface)] border border-[var(--color-outline)] px-2.5 py-1 rounded-full">
                            {cred}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <div className="mt-3 flex items-center gap-4 text-2sm">
                      <Link href={`/about/${author.slug}`} className="text-[var(--color-primary)] font-medium hover:underline">
                        Full profile ›
                      </Link>
                      {author.linkedin && (
                        <a href={author.linkedin} target="_blank" rel="noopener noreferrer nofollow" className="text-[var(--color-primary)] font-medium hover:underline">
                          LinkedIn ›
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* WhatsApp channel — end-of-article, high dwell-time reader */}
            <div className="mt-10">
              <WhatsAppInlineCTA source="guide_article_end" />
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="guide-article-sidebar" aria-label="Guide navigation and tools">
            {/* Sticky container is capped to the viewport height and scrolls
                internally when its content (TOC + CTA + related + explore) is
                taller than one screen — otherwise the lower items only became
                visible after scrolling the entire article. */}
            <div className="guide-sidebar-sticky">

              <GuideContents sections={contents} />

              {/* Comparison CTA — tracked */}
              <GuideSidebarCTA
                slug={slug}
                from={inlineQuoteCorridor.from}
                to={inlineQuoteCorridor.to}
                amount={inlineQuoteCorridor.amount}
              />

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
      {relatedPosts.length > 0 && (
        <Container className="guide-related">
          <div className="guide-related-heading"><div><p className="guide-eyebrow">Keep learning</p><h2>Your next good read</h2></div><Link href="/guides"><ArrowLeft size={15} aria-hidden="true" />All guides</Link></div>
          <div className="guide-preview-grid">{relatedPosts.map((related) => <GuidePreview key={related.slug} post={related} />)}</div>
        </Container>
      )}
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
