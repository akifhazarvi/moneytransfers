import Link from "next/link";
import Container from "@/components/Container";
import GuidesClientPage from "@/components/GuidesClientPage";
import { blogPosts, blogCategories } from "@/data/blog-posts";
import { computeBankVsAppIndex } from "@/lib/bank-vs-app-index";
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
      </div>

      {/* Category tabs + featured post + grid — interactive, handled client-side */}
      <GuidesClientPage
        posts={blogPosts}
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
