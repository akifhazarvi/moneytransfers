import { seoDescription } from "@/lib/seo-title";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, ShieldCheck } from "lucide-react";
import Container from "@/components/Container";
import GuidesClientPage from "@/components/GuidesClientPage";
import { blogPosts, blogCategories } from "@/data/blog-posts";
import { guideIsIndexable } from "@/lib/guide-status";
import { computeBankVsAppIndex } from "@/lib/bank-vs-app-index";
import { pppIndex } from "@/lib/ppp-index";
import { weekendMarkup } from "@/lib/weekend-markup";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { COVERAGE } from "@/lib/site-stats";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guides" });
  return {
    title: t("metaTitle"),
    description: seoDescription(t("metaDescription")),
    alternates: getAlternates("guides", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/guides",
      images: DEFAULT_OG_IMAGES,
    },
    keywords: t("metaKeywords"),
  };
}

const SITE_URL = "https://sendmoneycompare.com";

export default async function GuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "guides" });

  // Live figures for the featured data-story banner below.
  const bankVsApp = computeBankVsAppIndex();

  const researchCards = [
    { slug: "best-apps-to-send-money-from-us-2026", title: "Best Apps to Send Money Internationally from the US (2026)", excerpt: "Independent rankings of money transfer apps by real transfer cost, with provider comparisons for different routes and use cases.", category: "Guides", readTime: "", publishedAt: "2026-06-30", updatedAt: "2026-06-30" },
    { slug: "bank-vs-app-transfer-cost-2026", title: "Banks vs Apps: International Transfer Costs Compared", excerpt: "Compare what banks and specialist apps charge across our tracked corridors. Explore the data, methodology, and full cost breakdown.", category: "Research", readTime: "", publishedAt: "2026-06-21", updatedAt: bankVsApp.dataAsOf.slice(0, 10) },
    { slug: "best-day-to-send-money-abroad", title: "Is It Cheaper to Send Money on a Weekday?", excerpt: "We analysed millions of quotes to see how exchange rate markups change through the week, and which providers charge more at weekends.", category: "Research", readTime: "", publishedAt: "2026-08-14", updatedAt: weekendMarkup.generatedAt.slice(0, 10) },
    { slug: "fx-cost-vs-purchasing-power", title: "Transfer Fees vs Purchasing Power: What Moving Abroad Really Costs", excerpt: "How far your money goes abroad depends on more than an exchange rate. Explore the relationship between transfer costs and local buying power.", category: "Research", readTime: "", publishedAt: "2026-08-15", updatedAt: pppIndex.generatedAt.slice(0, 10) },
    { slug: "gbp-forecast-2026", title: "GBP Forecast 2026: What’s Next for the Pound?", excerpt: "A data-led look at sterling, the forces moving it, and what exchange rate changes mean for your next international transfer.", category: "Education", readTime: "", publishedAt: "2026-07-03", updatedAt: "2026-07-03" },
  ];

  // Project to just the card fields before crossing into the client component.
  // Handing it blogPosts serialised all 115 guides' section HTML and FAQs into
  // the RSC flight payload: 2.49 MB of HTML for 1,251 words of visible text.
  // Submitted guides only — see the "All guides" index below for why.
  const indexableGuides = blogPosts.filter(guideIsIndexable);
  const guidesByCategory = blogCategories
    .map((category) => [category, indexableGuides.filter((p) => p.category === category)] as const)
    .filter(([, posts]) => posts.length > 0);

  const guideCards = blogPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    readTime: post.readTime,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
  }));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "International Money Transfer Guides",
    description: "Expert guides on sending money internationally — compare providers, understand fees, and find the cheapest transfer route.",
    url: `${SITE_URL}/guides`,
    publisher: {
      "@type": "Organization",
      name: "SendMoneyCompare",
      url: SITE_URL,
    },
    // Article requires headline + author; `name` alone left ten items failing
    // validation on this page (2026-09-02 audit).
    hasPart: blogPosts.slice(0, 10).map((post) => ({
      "@type": "Article",
      headline: post.title,
      name: post.title,
      url: `${SITE_URL}/guides/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: { "@type": "Person", name: post.author },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <Container className="guides-hub">
        <nav aria-label="Breadcrumb" className="guide-breadcrumb">
          <Link href="/">{t("home")}</Link><span aria-hidden="true">/</span><span aria-current="page">Guides & resources</span>
        </nav>
        <header className="guides-hub-header">
          <div>
            <p className="guide-eyebrow"><BookOpen size={15} aria-hidden="true" />Money transfer guides</p>
            <h1>Know more.<br /><span>Send smarter.</span></h1>
          </div>
          <div className="guides-hub-intro">
            <p>Clear, practical guides to moving money across borders. Understand the fees, explore your options, and make your next transfer with confidence.</p>
            <Link href="/editorial-policy"><ShieldCheck size={17} aria-hidden="true" />Independent research. Real transfer data.<ArrowUpRight size={15} aria-hidden="true" /></Link>
          </div>
        </header>

        <GuidesClientPage posts={[...guideCards.filter((post) => !researchCards.some((research) => research.slug === post.slug)), ...researchCards]} categories={blogCategories} featured={
          <section className="guide-featured-grid" aria-label="Featured guides and research">
            <Link href="/guides/best-apps-to-send-money-from-us-2026" className="guide-featured-story">
              <div className="guide-featured-topline"><span className="guide-eyebrow">The starting point</span><span>2026 edition</span></div>
              <div className="guide-featured-symbol" aria-hidden="true"><ArrowUpRight strokeWidth={1} /></div>
              <div className="guide-featured-copy">
                <span className="guide-featured-label">Independent provider rankings</span>
                <h2>A better way to<br />send money abroad.</h2>
                <p>Explore the best money transfer apps from the US, ranked by what your recipient actually receives.</p>
                <span className="guide-featured-link">Find the right app for you <ArrowRight size={18} aria-hidden="true" /></span>
              </div>
            </Link>
            <div className="guide-research-desk">
              <div className="guide-research-heading"><span className="guide-eyebrow">From the research desk</span><span className="guide-live-dot" aria-hidden="true" /></div>
              <Link href="/guides/bank-vs-app-transfer-cost-2026">
                <span className="guide-research-number">01</span><div><h3>Banks vs apps: what does a transfer really cost?</h3><p>Live data across {bankVsApp.corridorCount} corridors</p></div><ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/guides/best-day-to-send-money-abroad">
                <span className="guide-research-number">02</span><div><h3>Is there a best day to send money?</h3><p>{weekendMarkup.observations.toLocaleString()} quotes analysed</p></div><ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/guides/fx-cost-vs-purchasing-power">
                <span className="guide-research-number">03</span><div><h3>Transfer fees meet the cost of living</h3><p>Exchange rates & purchasing power</p></div><ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/guides/gbp-forecast-2026">
                <span className="guide-research-number">04</span><div><h3>What’s next for the pound?</h3><p>A data-led GBP outlook for 2026</p></div><ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </section>
        } />

        <section className="guide-compare-banner">
          <div><p className="guide-eyebrow">Put it into practice</p><h2>Your next transfer could cost less.</h2><p>Compare fees, exchange rates and delivery times in one place.</p></div>
          <Link href="/send-money">Compare live rates <ArrowRight size={18} aria-hidden="true" /></Link>
        </section>

      {/*
        Crawlable index of every submitted guide.

        The grid above paginates client-side, so only the first page of cards
        exists in the server HTML — 8 guides had no incoming internal link
        anywhere on the site and 15 more had exactly one, reachable only via
        sitemap.xml (the "pages have only one incoming internal link" notice in
        the 2026-09-02 audit). A hub that submits 75 URLs has to link them.

        Scoped by guideIsIndexable() on purpose — the same predicate the guide
        route uses for robots and sitemap.ts uses for submission, so a guide
        that becomes submitted becomes linked here in the same change. Guides
        outside it serve noindex, and spending crawl budget on links to noindex
        pages is the mistake the June 2026 pruning was cleaning up.
      */}
      <nav aria-label="All guides" className="guide-directory">
        <h2 className="text-lg font-medium text-[var(--color-on-surface)] mb-1">
          All guides
        </h2>
        <p className="text-2sm text-[var(--color-on-surface-variant)] mb-6">
          {indexableGuides.length} guides, by topic.
        </p>
        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {guidesByCategory.map(([category, posts]) => (
            <details key={category}>
              <summary className="guide-directory-summary">{category}<span>{posts.length}</span></summary>
              <h3 className="sr-only">
                {category}
              </h3>
              <ul className="space-y-2">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/guides/${post.slug}`}
                      className="text-sm text-[var(--color-primary)] hover:underline"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </nav>

      {/* Editorial Introduction */}
      <div className="mt-12 pt-8 border-t border-[var(--color-outline)] mb-8 text-sm text-[var(--color-on-surface-variant)] leading-relaxed space-y-3 max-w-3xl">
        <p>
          Sending money internationally can be confusing — exchange rates fluctuate, fee structures vary between providers, and regulations differ by country. Our guides are written by researchers who track the money transfer industry daily, comparing real quotes from {COVERAGE.providers} across {COVERAGE.corridors}.
        </p>
        <p>
          Whether you are sending a one-time payment or making regular transfers to family abroad, these guides cover everything from finding the cheapest provider for your specific route, to understanding hidden costs like exchange rate markups, to navigating compliance requirements for large transfers. Each guide includes up-to-date pricing data from our comparison engine.
        </p>
      </div>

      {/* Cross-links */}
      <div className="mt-12 pt-8">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2sm font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">{t("crossLinkTools")}</h3>
            <ul className="space-y-2">
              <li><Link href="/send-money" className="text-sm text-[var(--color-primary)] hover:underline">{t("compareRatesCalculator")}</Link></li>
              <li><Link href="/compare" className="text-sm text-[var(--color-primary)] hover:underline">{t("headToHeadComparisons")}</Link></li>
              <li><Link href="/guides/bank-vs-app-transfer-cost-2026" className="text-sm text-[var(--color-primary)] hover:underline">Bank vs App Cost Index</Link></li>
              <li><Link href="/remittance-cost-index" className="text-sm text-[var(--color-primary)] hover:underline">Remittance Cost Index</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-2sm font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">{t("crossLinkTopProviders")}</h3>
            <ul className="space-y-2">
              <li><Link href="/companies/wise" className="text-sm text-[var(--color-primary)] hover:underline">{t("wiseReview")}</Link></li>
              <li><Link href="/companies/remitly" className="text-sm text-[var(--color-primary)] hover:underline">{t("remitlyReview")}</Link></li>
              <li><Link href="/companies" className="text-sm text-[var(--color-primary)] hover:underline">{t("allProviderReviews")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-2sm font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">{t("crossLinkPopularCorridors")}</h3>
            <ul className="space-y-2">
              <li><Link href="/send-money/usa-to-india" className="text-sm text-[var(--color-primary)] hover:underline">{t("usaToIndia")}</Link></li>
              <li><Link href="/send-money/usa-to-pakistan" className="text-sm text-[var(--color-primary)] hover:underline">{t("usaToPakistan")}</Link></li>
              <li><Link href="/send-money/usa-to-philippines" className="text-sm text-[var(--color-primary)] hover:underline">{t("usaToPhilippines")}</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
    </>
  );
}
