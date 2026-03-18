import type { MetadataRoute } from "next";
import { allCorridors } from "@/data/corridors";
import { providers } from "@/data/providers";
import { blogPosts } from "@/data/blog-posts";
import { newsItems } from "@/data/news";
import { businessPages } from "@/data/business-pages";
import { wiseCountries } from "@/data/wise-iban";
import { getSwiftCountries } from "@/data/swift-codes";
import { statSync } from "fs";
import { join } from "path";

const SITE_URL = "https://sendmoneycompare.com";
const EXCLUDED_CORRIDOR_SLUGS = new Set(["gbp-to-fjd"]);

// Fixed deploy date — update manually when static content changes
const LAST_DEPLOY = "2026-03-17";

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
    : LAST_DEPLOY;
}

const DATA_UPDATED = getDataUpdatedDate();

const LOCALES = ["es", "fr"] as const;

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

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    entry("", LAST_DEPLOY),
    entry("send-money", DATA_UPDATED),
    entry("companies", DATA_UPDATED),
    entry("compare", DATA_UPDATED),
    entry("currency-converter", DATA_UPDATED),
    entry("guides", LAST_DEPLOY),
    entry("iban", LAST_DEPLOY),
    entry("swift-codes", LAST_DEPLOY),
    entry("about", LAST_DEPLOY),
    entry("contact", LAST_DEPLOY),
    entry("editorial-policy", LAST_DEPLOY),
    entry("how-we-review", LAST_DEPLOY),
    entry("methodology", LAST_DEPLOY),
    entry("privacy-policy", LAST_DEPLOY),
    entry("terms", LAST_DEPLOY),
    entry("cookies", LAST_DEPLOY),
    entry("disclaimer", LAST_DEPLOY),
  ];

  // Locale variants for key static pages
  const staticLocalePages: MetadataRoute.Sitemap = [
    ...withLocales("", LAST_DEPLOY),
    ...withLocales("send-money", DATA_UPDATED),
    ...withLocales("companies", DATA_UPDATED),
    ...withLocales("compare", DATA_UPDATED),
    ...withLocales("currency-converter", DATA_UPDATED),
    ...withLocales("guides", LAST_DEPLOY),
    ...withLocales("about", LAST_DEPLOY),
    ...withLocales("contact", LAST_DEPLOY),
  ];

  const corridorPages: MetadataRoute.Sitemap = allCorridors
    .filter((c) => !EXCLUDED_CORRIDOR_SLUGS.has(c.slug))
    .map((c) => entry(`send-money/${c.slug}`, DATA_UPDATED));

  const providerPages: MetadataRoute.Sitemap = providers.map((p) =>
    entry(`companies/${p.slug}`, DATA_UPDATED)
  );

  const comparisonPages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < providers.length; i++) {
    for (let j = i + 1; j < providers.length; j++) {
      comparisonPages.push(
        entry(`compare/${providers[i].slug}-vs-${providers[j].slug}`, DATA_UPDATED)
      );
    }
  }

  const guidePages: MetadataRoute.Sitemap = blogPosts.map((post) =>
    entry(`guides/${post.slug}`, post.updatedAt)
  );

  const newsPages: MetadataRoute.Sitemap = [
    entry("news", LAST_DEPLOY),
    ...newsItems.map((item) => entry(`news/${item.slug}`, item.publishedAt)),
  ];

  const EXCHANGE_RATE_PAIRS = [
    "usd-to-inr", "usd-to-pkr", "usd-to-php", "usd-to-mxn", "usd-to-ngn",
    "gbp-to-eur", "gbp-to-inr", "gbp-to-usd", "gbp-to-pkr",
    "eur-to-usd", "eur-to-gbp",
    "cad-to-inr", "aud-to-inr",
    "usd-to-gbp", "usd-to-eur", "usd-to-cad", "usd-to-aud", "usd-to-jpy",
    "usd-to-brl", "usd-to-cny",
  ];

  const exchangeRatesPage: MetadataRoute.Sitemap = [
    entry("exchange-rates", DATA_UPDATED),
    entry("remittance-cost-index", DATA_UPDATED),
    ...EXCHANGE_RATE_PAIRS.map((pair) => entry(`exchange-rates/${pair}`, DATA_UPDATED)),
  ];

  const ibanPages: MetadataRoute.Sitemap = wiseCountries
    .filter((c) => c.slug && INDEXED_IBAN_SLUGS.has(c.slug))
    .map((c) => entry(`iban/${c.slug}`, LAST_DEPLOY));

  const swiftPages: MetadataRoute.Sitemap = getSwiftCountries()
    .filter((c) => INDEXED_SWIFT_SLUGS.has(c.slug))
    .map((c) => entry(`swift-codes/${c.slug}`, LAST_DEPLOY));

  const businessHubPages: MetadataRoute.Sitemap = [
    entry("business", LAST_DEPLOY),
    ...businessPages.map((p) => entry(`business/${p.slug}`, LAST_DEPLOY)),
  ];

  return [
    ...staticPages,
    ...staticLocalePages,
    ...corridorPages,
    ...providerPages,
    ...comparisonPages,
    ...guidePages,
    ...newsPages,
    ...exchangeRatesPage,
    ...businessHubPages,
    ...ibanPages,
    ...swiftPages,
  ];
}
