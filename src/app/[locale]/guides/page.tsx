import Link from "next/link";
import Container from "@/components/Container";
import GuidesClientPage from "@/components/GuidesClientPage";
import { blogPosts, blogCategories } from "@/data/blog-posts";
import { SITEMAP_GUIDE_SLUGS } from "@/lib/sitemap-allowlists";
import { computeBankVsAppIndex } from "@/lib/bank-vs-app-index";
import { weekendMarkup } from "@/lib/weekend-markup";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guides" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: getAlternates("guides", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/guides",
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

  // Project to just the card fields before crossing into the client component.
  // Handing it blogPosts serialised all 115 guides' section HTML and FAQs into
  // the RSC flight payload: 2.49 MB of HTML for 1,251 words of visible text.
  // Submitted guides only — see the "All guides" index below for why.
  const indexableGuides = blogPosts.filter((post) => SITEMAP_GUIDE_SLUGS.has(post.slug));
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
    featuredImage: post.featuredImage,
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
    hasPart: blogPosts.slice(0, 10).map((post) => ({
      "@type": "Article",
      name: post.title,
      url: `${SITE_URL}/guides/${post.slug}`,
      datePublished: post.publishedAt,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <Container className="py-8">
      <nav className="text-2sm text-[var(--color-on-surface-variant)] mb-6">
        <Link href="/" className="hover:text-[var(--color-primary)]">{t("home")}</Link>
        {" / "}
        <span className="text-[var(--color-on-surface)]">{t("title")}</span>
      </nav>

      <h1 className="text-h3 md:text-4xl font-normal text-[var(--color-on-surface)] mb-2">
        {t("title")}
      </h1>
      <p className="text-sm text-[var(--color-on-surface-variant)] mb-8">
        {t("subtitle")}
      </p>

      {/* Featured standalone guides — dedicated live routes, not in blogPosts */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/guides/best-apps-to-send-money-from-us-2026"
          className="group block rounded-2xl border border-[var(--color-primary)] bg-[var(--color-primary-surface)] p-5 sm:p-6 transition hover:shadow-md"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-primary)]">
            Independent rankings · 2026
          </span>
          <h2 className="mt-1.5 text-xl font-normal text-[var(--color-on-surface)] leading-snug">
            Best Apps to Send Money from the US (2026)
          </h2>
          <p className="mt-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
            8 providers ranked by real transfer cost — Wise, Remitly, TorFX, OFX, TapTap Send and more. Live data, no paid placements.
          </p>
          <span className="mt-3 inline-block text-sm font-medium text-[var(--color-primary)] group-hover:underline">
            Read the rankings →
          </span>
        </Link>

        <Link
          href="/guides/bank-vs-app-transfer-cost-2026"
          className="group block rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-container)] p-5 sm:p-6 transition hover:shadow-md"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-on-surface-variant)]">
            Original research · Updated every 6 hours
          </span>
          <h2 className="mt-1.5 text-xl font-normal text-[var(--color-on-surface)] leading-snug">
            Banks cost {bankVsApp.bankVsAppMultiple}× more than apps to send money abroad
          </h2>
          <p className="mt-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
            Live data across {bankVsApp.corridorCount} corridors: banks cost {bankVsApp.bankAvgCostPct}% vs {bankVsApp.appAvgCostPct}% via a specialist app.
          </p>
          <span className="mt-3 inline-block text-sm font-medium text-[var(--color-primary)] group-hover:underline">
            Read the Bank vs App Cost Index →
          </span>
        </Link>

        <Link
          href="/guides/best-day-to-send-money-abroad"
          className="group block rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-container)] p-5 sm:p-6 transition hover:shadow-md"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-on-surface-variant)]">
            Original research · {weekendMarkup.observations.toLocaleString()} quotes analysed
          </span>
          <h2 className="mt-1.5 text-xl font-normal text-[var(--color-on-surface)] leading-snug">
            Is it cheaper to send money on a weekday?
          </h2>
          <p className="mt-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
            Weekends averaged {weekendMarkup.weekendMean}% FX markup vs {weekendMarkup.weekdayMean}% Mon–Fri — cheaper, not dearer. But some banks widen by over 1pp.
          </p>
          <span className="mt-3 inline-block text-sm font-medium text-[var(--color-primary)] group-hover:underline">
            Read the day-of-week analysis →
          </span>
        </Link>

        <Link
          href="/guides/fx-cost-vs-purchasing-power"
          className="group block rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-container)] p-5 sm:p-6 transition hover:shadow-md"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-on-surface-variant)]">
            Original research · World Bank + 2.37M quotes
          </span>
          <h2 className="mt-1.5 text-xl font-normal text-[var(--color-on-surface)] leading-snug">
            The cheaper the move, the less your transfer fee matters
          </h2>
          <p className="mt-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
            Moving US→UK lifts buying power 6% — and the wrong provider eats 84% of it. Moving to Egypt it eats 0.9%.
          </p>
          <span className="mt-3 inline-block text-sm font-medium text-[var(--color-primary)] group-hover:underline">
            See the charts →
          </span>
        </Link>

        <Link
          href="/guides/gbp-forecast-2026"
          className="group block rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-container)] p-5 sm:p-6 transition hover:shadow-md"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-on-surface-variant)]">
            Currency outlook · July 2026
          </span>
          <h2 className="mt-1.5 text-xl font-normal text-[var(--color-on-surface)] leading-snug">
            How much can the pound move before your transfer clears?
          </h2>
          <p className="mt-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
            Sterling swung ~5% in H1 2026, but the best-vs-worst provider gap on £1,000 to USD is bigger than the currency move. Data-led GBP outlook.
          </p>
          <span className="mt-3 inline-block text-sm font-medium text-[var(--color-primary)] group-hover:underline">
            Read the GBP outlook →
          </span>
        </Link>
      </div>

      {/* Category tabs + featured post + grid — interactive, handled client-side */}
      <GuidesClientPage
        posts={guideCards}
        categories={blogCategories}
        translations={{
          featuredGuide: t("featuredGuide"),
          readGuide: t("readGuide"),
          readMore: t("readMore"),
          browseByCategory: t("browseByCategory"),
          browseByCategoryDesc: t("browseByCategoryDesc"),
          guidesCount: t.raw("guidesCount"),
          previous: t("previous"),
          next: t("next"),
          pageOf: t.raw("pageOf"),
        }}
      />

      {/*
        Crawlable index of every submitted guide.

        The grid above paginates client-side, so only the first page of cards
        exists in the server HTML — 8 guides had no incoming internal link
        anywhere on the site and 15 more had exactly one, reachable only via
        sitemap.xml (the "pages have only one incoming internal link" notice in
        the 2026-09-02 audit). A hub that submits 75 URLs has to link them.

        Scoped to SITEMAP_GUIDE_SLUGS on purpose: guides outside the allowlist
        serve noindex, and spending crawl budget on links to noindex pages is
        the mistake the June 2026 pruning was cleaning up.
      */}
      <nav aria-label="All guides" className="mt-12 border-t border-[var(--color-outline)] pt-8">
        <h2 className="text-lg font-medium text-[var(--color-on-surface)] mb-1">
          All guides
        </h2>
        <p className="text-2sm text-[var(--color-on-surface-variant)] mb-6">
          {indexableGuides.length} guides, by topic.
        </p>
        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {guidesByCategory.map(([category, posts]) => (
            <div key={category}>
              <h3 className="text-2sm font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">
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
            </div>
          ))}
        </div>
      </nav>

      {/* Editorial Introduction */}
      <div className="mt-12 pt-8 border-t border-[var(--color-outline)] mb-8 text-sm text-[var(--color-on-surface-variant)] leading-relaxed space-y-3 max-w-3xl">
        <p>
          Sending money internationally can be confusing — exchange rates fluctuate, fee structures vary between providers, and regulations differ by country. Our guides are written by researchers who track the money transfer industry daily, comparing real quotes from 16+ providers across 64+ currency corridors.
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
