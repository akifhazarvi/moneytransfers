import { notFound } from "next/navigation";
import { guideIsIndexable } from "@/lib/guide-status";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import GuideContents from "@/components/GuideContents";
import GuideReadingProgress from "@/components/GuideReadingProgress";
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
import PartnerFeatureBlock from "@/components/PartnerFeatureBlock";
import FreelancerCostCalculator from "@/components/FreelancerCostCalculator";
import SettlementRace from "@/components/SettlementRace";
import { BUSINESS_FX_SLUGS } from "@/lib/business-fx-index";
import { generateQuotes } from "@/lib/quotes-engine";
import { guideQuoteCorridor } from "@/lib/guide-quote-corridor";
import { corridorPageRenders } from "@/lib/route-map";

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

// No bare "usd" / "gbp" / "uk" keys (removed 2026-09-25): a tag like
// "USD to VND" matched "usd" and linked a Vietnam guide to USA → India.
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
  iban: { href: "/iban", label: "IBAN lookup tool" },
  swift: { href: "/swift-codes", label: "SWIFT code finder" },
  business: { href: "/business", label: "Business transfers" },
};

function getExploreLinks(tags: string[], category: string): { href: string; label: string }[] {
  // No fixed links and no default-corridor padding (2026-09-25): both put the
  // same five or seven links on every guide without a matching tag, a block
  // the round-2 audit counted on 76 guides. The hubs are in the site nav.
  const fixed: { href: string; label: string }[] = [];

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


  // The generation threshold retires corridor pages whose currency pair is
  // already covered by a stronger page. The content brief's rule for those:
  // "do not generate them at all (404/410); remove from internal links and the
  // sitemap." Both maps above are hand-written hrefs, so they cannot know that
  // — ask route-map, which is the only thing that does.
  const renders = (l: { href: string }) =>
    !l.href.startsWith("/send-money/") || corridorPageRenders(l.href.replace("/send-money/", ""));

  return [...fixed.filter(renders), ...dynamic.filter(renders).slice(0, 5)];
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
  const exploreLinks = getExploreLinks(post.tags, post.category);

  const sectionIds = post.sections.map((s) => slugifyHeading(s.heading));
  // The contents list leaves out the generic tail — "Sources & Methodology",
  // "Step-by-step guide", "Frequently asked questions" — which read the same
  // on every guide (2026-09-25); the sections themselves still render.
  const contents = post.sections
    .map((section, i) => ({ id: sectionIds[i], title: section.heading }))
    .filter((c) => !/^sources\b/i.test(c.title));
  const inlineQuoteCorridor = guideQuoteCorridor(post);
  // Real count, so the denominator can separate "widget was thin" from "widget
  // was ignored". It was hard-coded to 0, which made the parameter useless.
  const inlineQuoteScoped = (() => {
    const all = generateQuotes(inlineQuoteCorridor.amount, inlineQuoteCorridor.from, inlineQuoteCorridor.to);
    return inlineQuoteCorridor.business
      ? all.filter((q) => (BUSINESS_FX_SLUGS as readonly string[]).includes(q.providerSlug))
      : all;
  })();
  const inlineQuoteProviderCount = Math.min(inlineQuoteScoped.length, 5);
  /**
   * The partner's own live quote for whatever corridor this guide's widget
   * sells, so the spotlight at the end of the article can show a real rate and
   * payout rather than adjectives. Same array the inline table ranks, so the
   * two cannot disagree. Undefined on guides we hold no TapTap quote for —
   * the block then shows the site-wide facts and no numbers.
   */
  const partnerQuote = (() => {
    const tt = inlineQuoteScoped.find((q) => q.providerSlug === "taptap-send");
    if (!tt) return undefined;
    const worstQuote = inlineQuoteScoped[inlineQuoteScoped.length - 1];
    return {
      fromCurrency: inlineQuoteCorridor.from,
      toCurrency: inlineQuoteCorridor.to,
      sendAmount: tt.sendAmount,
      receiveAmount: tt.receiveAmount,
      exchangeRate: tt.exchangeRate,
      fee: tt.fee,
      transferSpeed: tt.transferSpeed,
      worstReceiveAmount: worstQuote?.receiveAmount,
      providerCount: inlineQuoteScoped.length,
      isBest: inlineQuoteScoped[0]?.providerSlug === "taptap-send",
    };
  })();
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
              <Link href={`/about/${getAuthorByName(post.author)?.slug || "awais-imran"}`} className="flex items-center gap-2 text-2sm font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                {getAuthorByName(post.author)?.photo ? (
                  <Image src={getAuthorByName(post.author)!.photo!} alt={post.author} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-semibold text-xs">{getAuthorByName(post.author)?.initials || "AI"}</span>
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
            {/* The "Key takeaway" box repeated the excerpt the hero already
                shows, word for word (removed 2026-09-25). */}
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
                  /* Denominator for guide conversion. Without it, a guide with
                     1 click in 244 views is unreadable: nobody scrolled to the
                     widget, or everybody did and ignored it. It WRAPS the widget
                     so the observer measures the widget itself. */
                  <InlineQuotesImpression
                    slug={slug}
                    from={inlineQuoteCorridor.from}
                    to={inlineQuoteCorridor.to}
                    providerCount={inlineQuoteProviderCount}
                  >
                    <InlineProviderQuotes
                      from={inlineQuoteCorridor.from}
                      to={inlineQuoteCorridor.to}
                      amount={inlineQuoteCorridor.amount}
                      heading={inlineQuoteCorridor.heading}
                      source={`guide:${slug}`}
                      only={inlineQuoteCorridor.business ? BUSINESS_FX_SLUGS : undefined}
                      crossSell={false}
                    />
                  </InlineQuotesImpression>
                )}
                {/* Partner spotlight sits AFTER the price comparison, not above
                    it: the comparison is what readers come for, and the round-2
                    SEO brief (2026-09-24) asked for it to lead. */}
                {i === Math.min(1, post.sections.length - 1) && (
                  <PartnerFeatureBlock
                    source={`taptap_spotlight:guide:${slug}`}
                    variant="inline"
                    quote={partnerQuote}
                    linkContext={{ from: inlineQuoteCorridor.from, to: inlineQuoteCorridor.to, amount: inlineQuoteCorridor.amount }}
                  />
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
                    {/* Byline omitted here: one sentence, identical on 83 guides.
                        It is on the author's profile, one click away. */}
                    {/* Credentials chips live on the author's profile, not here:
                        the same three lines on every guide were shared text
                        in each near-duplicate pair of the round-2 audit. */}
                    <div className="mt-3 flex items-center gap-4 text-2sm">
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



          </article>

          {/* ── Sidebar ── */}
          <aside className="guide-article-sidebar" aria-label="Guide navigation and tools">
            {/* Sticky container is capped to the viewport height and scrolls
                internally when its content (TOC + CTA + related + explore) is
                taller than one screen — otherwise the lower items only became
                visible after scrolling the entire article. */}
            <div className="guide-sidebar-sticky">

              {/* Partner cross-sell card removed 2026-09-19: it was the third
                  TapTap unit on every guide, after the inline card and
                  PartnerFeatureBlock's ad. The ad carries a live rate and
                  payout; this carried neither. */}

              <GuideContents sections={contents} />

              {/* Explore more — only when a tag matched something */}
              {exploreLinks.length > 0 && (
              <div>
                <p className="text-overline text-[var(--color-on-surface-muted)] mb-3">Explore</p>
                <ul className="space-y-1">
                  {exploreLinks.map((link) => (
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
              )}
            </div>
          </aside>
        </div>
      </Container>
      {relatedPosts.length > 0 && (
        <Container className="guide-related">
          {/* Titles only: the cards' category, read time and "Read guide"
              labels were the same furniture on every guide (2026-09-25). */}
          <div className="guide-related-heading"><div><h2>Related guides</h2></div><Link href="/guides"><ArrowLeft size={15} aria-hidden="true" />All guides</Link></div>
          <ul className="grid sm:grid-cols-3 gap-3">
            {relatedPosts.map((related) => (
              <li key={related.slug}>
                <Link href={`/guides/${related.slug}`} className="block h-full rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] p-4 text-md font-medium text-[var(--color-on-surface)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
                  {related.title.replace(/\s*\((?:in\s+)?20\d\d\)\s*$/i, "").replace(/\s+(?:in\s+)?20\d\d\s*$/i, "")}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      )}
      {/* Sticky nudge removed 2026-09-12. Measured over 30 days: 1,000
          impressions, 15 clicks, 90 dismissals — six people closed it for every
          one who used it, and every impression came from a /guides/ page.
          Interrupting a reader six times per click is a bad trade for the 1.5%
          it converted. The in-page partner block and the comparison table carry
          the CTAs instead. Component kept for reuse; re-adding it needs better
          evidence than "more surface is more clicks". */}
    </>
  );
}
