import type { MetadataRoute } from "next";
import { allCorridors } from "@/data/corridors";
import { getAllTravelGuideSlugs } from "@/data/travel-guides";
import { providers } from "@/data/providers";
import { blogPosts } from "@/data/blog-posts";
import { newsItems } from "@/data/news";
import { businessPages } from "@/data/business-pages";
import { wiseCountries } from "@/data/wise-iban";
import { getSwiftCountries } from "@/data/swift-codes";
import { authors } from "@/data/authors";
import { providerReviews } from "@/data/provider-reviews";
import { getAllInsights, corridorToSlug } from "@/lib/rate-history";
import { statSync } from "fs";
import { join } from "path";

const SITE_URL = "https://sendmoneycompare.com";
import { shouldIncludeInSitemap } from "@/lib/corridor-tiers";
import { INDEXED_HISTORY_SLUGS } from "@/lib/seo-indexing";

// ── Issue 5 fix: Use stable dates for truly static content ──
// Google's John Mueller recommends lastmod should reflect actual content changes,
// not deploy timestamps. Using a fixed date for pages that rarely change prevents
// Google from losing trust in the lastmod signal across the entire sitemap.
// See: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
// Stable date for hub/static pages — only update when content actually changes.
// Using new Date() here was inflating lastmod on every deploy, eroding Google's trust in the signal.
const STATIC_HUB_DATE = "2026-03-28";
const STATIC_CONTENT_DATE = "2026-03-01"; // Hardcoded for legal/policy pages that rarely change

// Dynamically derived from the most recently modified scraped quotes file.
// This ensures lastmod reflects when live data actually changed, not the deploy date.
function getDataUpdatedDate(): string {
  const scrapedDir = join(process.cwd(), "src/data/scraped");
  const quoteFiles = [
    "provider-quotes.json",
    "mid-market-rates.json",
    "exchange-rates.json",
  ];
  let latest = new Date(0);
  for (const file of quoteFiles) {
    try {
      const mtime = statSync(join(scrapedDir, file)).mtime;
      if (mtime > latest) latest = mtime;
    } catch {
      // file may not exist — skip
    }
  }
  return latest.getTime() > 0
    ? latest.toISOString().split("T")[0]
    : STATIC_HUB_DATE;
}

const DATA_UPDATED = getDataUpdatedDate();

// Non-English locales (es/fr/pt) were retired on 2026-04-27 — middleware
// returns 410 Gone for those prefixes. The helpers below previously fanned
// every URL out across 3 locales; they now no-op so we ship a 4× smaller
// sitemap and stop submitting URLs that no longer resolve.
const LOCALES: readonly string[] = [];

const INDEXED_IBAN_SLUGS = new Set([
  "united-kingdom", "germany", "france", "netherlands", "spain",
  "italy", "denmark", "belgium", "austria", "ireland",
  "portugal", "sweden", "switzerland", "poland", "norway",
  "pakistan",
  "turkey", "romania", "czechia", "hungary", "croatia",
  "finland", "greece", "cyprus", "luxembourg",
  "united-arab-emirates", "saudi-arabia", "qatar", "kuwait", "bahrain",
  "jordan", "egypt", "israel", "brazil", "ukraine", "georgia",
]);

const INDEXED_SWIFT_SLUGS = new Set([
  "united-kingdom", "united-states", "india", "pakistan", "germany",
  "france", "netherlands", "united-arab-emirates", "canada", "australia",
  "hong-kong", "singapore", "south-africa", "ireland", "new-zealand",
  "bangladesh", "philippines", "nigeria", "mexico", "china",
  "japan", "south-korea", "thailand", "indonesia", "malaysia",
  "brazil", "kenya", "ghana", "sri-lanka", "nepal",
  "turkiye", "egypt", "morocco", "colombia", "peru",
]);

// Note: changeFrequency and priority are ignored by Google and have been removed.
// See: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
function entry(path: string, lastModified: string): MetadataRoute.Sitemap[number] {
  const url = path ? `${SITE_URL}/${path}` : SITE_URL;
  return { url, lastModified };
}

/** Generate locale variant entries for a given path */
function withLocales(path: string, lastModified: string): MetadataRoute.Sitemap {
  return LOCALES.map((locale) =>
    entry(path ? `${locale}/${path}` : locale, lastModified)
  );
}

/**
 * Generate both EN + locale entries for a given path.
 * Consolidates the common pattern of entry() + withLocales() into one call.
 */
function entryWithLocales(path: string, lastModified: string): MetadataRoute.Sitemap {
  return [entry(path, lastModified), ...withLocales(path, lastModified)];
}

export default function sitemap(): MetadataRoute.Sitemap {
  // ── Static pages (EN) ──
  const staticPages: MetadataRoute.Sitemap = [
    entry("", DATA_UPDATED), // Homepage has live comparison data
    entry("send-money", DATA_UPDATED),
    entry("companies", DATA_UPDATED),
    entry("compare", DATA_UPDATED),
    entry("compare-money-transfer", DATA_UPDATED),
    entry("currency-converter", DATA_UPDATED),
    entry("guides", STATIC_HUB_DATE),
    entry("travel", STATIC_HUB_DATE),
    entry("iban", STATIC_HUB_DATE),
    entry("swift-codes", STATIC_HUB_DATE),
    entry("about", STATIC_HUB_DATE),  // No live data — static content
    entry("contact", STATIC_HUB_DATE),
    // Issue 5 fix: Legal/policy pages use stable date — content rarely changes
    entry("editorial-policy", STATIC_CONTENT_DATE),
    entry("how-we-review", STATIC_CONTENT_DATE),
    entry("methodology", STATIC_CONTENT_DATE),
    entry("privacy-policy", STATIC_CONTENT_DATE),
    entry("terms", STATIC_CONTENT_DATE),
    entry("cookies", STATIC_CONTENT_DATE),
    entry("disclaimer", STATIC_CONTENT_DATE),
    entry("for-ai", DATA_UPDATED),
  ];

  // Corridor pages are English-only — locale variants were retired
  // (middleware returns 410 Gone for /es/, /fr/, /pt/).
  const indexedCorridors = allCorridors
    .filter((c) => shouldIncludeInSitemap(c.slug, c.fromCurrency, c.toCurrency, c.isCountryPage));
  const corridorPages: MetadataRoute.Sitemap = indexedCorridors.map((c) =>
    entry(`send-money/${c.slug}`, DATA_UPDATED),
  );

  // Travel guides are English-only editorial content. Locale variants are
  // not currently translated; including them in the sitemap submits empty
  // shells, so we emit English only.
  const travelSlugs = getAllTravelGuideSlugs();
  const travelPages: MetadataRoute.Sitemap = travelSlugs.map((slug) =>
    entry(`travel/${slug}`, STATIC_HUB_DATE),
  );

  // Only include providers that have editorial reviews (others are noindexed).
  // Company pages are English-only (locales are noindex'd in [locale]/companies/[slug])
  // so we no longer emit locale variants here.
  const reviewedSlugs = new Set(providerReviews.map((r) => r.slug));
  const reviewDateMap = new Map(providerReviews.map((r) => [r.slug, r.updatedAt || DATA_UPDATED]));
  const providerPages: MetadataRoute.Sitemap = providers
    .filter((p) => reviewedSlugs.has(p.slug))
    .map((p) => entry(`companies/${p.slug}`, reviewDateMap.get(p.slug) || DATA_UPDATED));

  // Only include comparison pages where both providers have editorial reviews.
  // Combinations involving unreviewed providers lack editorial depth (thin content).
  // Locale variants of comparison pages are noindexed, so exclude from sitemap.
  const reviewedProviders = providers.filter((p) => reviewedSlugs.has(p.slug));
  const comparisonPages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < reviewedProviders.length; i++) {
    for (let j = i + 1; j < reviewedProviders.length; j++) {
      const slug = `compare/${reviewedProviders[i].slug}-vs-${reviewedProviders[j].slug}`;
      comparisonPages.push(entry(slug, DATA_UPDATED));
    }
  }

  // Guide content is English-only — locale variants are noindexed, so exclude from sitemap
  const guidePages: MetadataRoute.Sitemap = blogPosts.map((post) =>
    entry(`guides/${post.slug}`, post.updatedAt),
  );

  // News content is English-only — locale variants are noindexed, so exclude from sitemap
  const newsPages: MetadataRoute.Sitemap = [
    entry("news", STATIC_HUB_DATE),
    ...newsItems.map((item) =>
      entry(`news/${item.slug}`, item.publishedAt),
    ),
  ];

  const EXCHANGE_RATE_PAIRS = [
    "usd-to-inr", "usd-to-pkr", "usd-to-php", "usd-to-mxn", "usd-to-ngn",
    "gbp-to-eur", "gbp-to-inr", "gbp-to-usd", "gbp-to-pkr",
    "eur-to-usd", "eur-to-gbp",
    "cad-to-inr", "aud-to-inr",
    "usd-to-gbp", "usd-to-eur", "usd-to-cad", "usd-to-aud", "usd-to-jpy",
    "usd-to-brl", "usd-to-cny",
  ];

  // Exchange rate index/hub pages keep locale variants (translated UI).
  // Individual pair pages are English-only content — locale variants are noindexed.
  const exchangeRatesPage: MetadataRoute.Sitemap = [
    ...entryWithLocales("exchange-rates", DATA_UPDATED),
    ...entryWithLocales("remittance-cost-index", DATA_UPDATED),
    ...EXCHANGE_RATE_PAIRS.map((pair) => entry(`exchange-rates/${pair}`, DATA_UPDATED)),
    // History hub + only the 12 GSC-validated history pages (≥10 impressions).
    // The other 167 history pages are noindexed via middleware — submitting them
    // wastes crawl budget and dilutes sitemap quality signals.
    ...entryWithLocales("exchange-rates/history", DATA_UPDATED),
    ...getAllInsights(2)
      .filter((i) => INDEXED_HISTORY_SLUGS.has(corridorToSlug(i.corridor)))
      .map((i) => entry(`exchange-rates/history/${corridorToSlug(i.corridor)}`, DATA_UPDATED)),
  ];

  const ibanPages: MetadataRoute.Sitemap = wiseCountries
    .filter((c) => c.slug && INDEXED_IBAN_SLUGS.has(c.slug))
    .map((c) => entry(`iban/${c.slug}`, STATIC_HUB_DATE));

  const swiftPages: MetadataRoute.Sitemap = getSwiftCountries()
    .filter((c) => INDEXED_SWIFT_SLUGS.has(c.slug))
    .map((c) => entry(`swift-codes/${c.slug}`, STATIC_HUB_DATE));

  // Business content is English-only — locale variants are noindexed
  const businessHubPages: MetadataRoute.Sitemap = [
    entry("business", STATIC_HUB_DATE),
    ...businessPages.map((p) => entry(`business/${p.slug}`, STATIC_HUB_DATE)),
  ];

  // ── Issue 3 fix: Author pages now include locale variants ──
  const authorPages: MetadataRoute.Sitemap = authors.flatMap((author) =>
    entryWithLocales(`about/${author.slug}`, STATIC_HUB_DATE)
  );

  // ── Issue 4 fix: Corrections page now includes locale variants ──
  const correctionsPage: MetadataRoute.Sitemap = entryWithLocales("corrections", STATIC_HUB_DATE);

  return [
    ...staticPages,
    ...corridorPages,
    ...travelPages,
    ...providerPages,
    ...comparisonPages,
    ...guidePages,
    ...newsPages,
    ...exchangeRatesPage,
    ...businessHubPages,
    ...ibanPages,
    ...swiftPages,
    ...authorPages,
    ...correctionsPage,
  ];
}
