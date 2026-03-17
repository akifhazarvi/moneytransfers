import type { MetadataRoute } from "next";
import { allCorridors } from "@/data/corridors";
import { providers } from "@/data/providers";
import { blogPosts } from "@/data/blog-posts";
import { newsItems } from "@/data/news";
import { wiseCountries } from "@/data/wise-iban";
import { getSwiftCountries } from "@/data/swift-codes";

const SITE_URL = "https://sendmoneycompare.com";
const EXCLUDED_CORRIDOR_SLUGS = new Set(["gbp-to-fjd"]);

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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    entry("", now),
    entry("send-money", now),
    entry("companies", now),
    entry("compare", now),
    entry("currency-converter", now),
    entry("guides", now),
    entry("iban", now),
    entry("swift-codes", now),
    entry("about", now),
    entry("contact", now),
    entry("editorial-policy", now),
    entry("how-we-review", now),
    entry("methodology", now),
    entry("privacy-policy", now),
    entry("terms", now),
    entry("cookies", now),
    entry("disclaimer", now),
  ];

  const corridorPages: MetadataRoute.Sitemap = allCorridors
    .filter((c) => !EXCLUDED_CORRIDOR_SLUGS.has(c.slug))
    .map((c) => entry(`send-money/${c.slug}`, now));

  const providerPages: MetadataRoute.Sitemap = providers.map((p) =>
    entry(`companies/${p.slug}`, now)
  );

  const comparisonPages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < providers.length; i++) {
    for (let j = i + 1; j < providers.length; j++) {
      comparisonPages.push(
        entry(`compare/${providers[i].slug}-vs-${providers[j].slug}`, now)
      );
    }
  }

  const guidePages: MetadataRoute.Sitemap = blogPosts.map((post) =>
    entry(`guides/${post.slug}`, post.updatedAt)
  );

  const newsPages: MetadataRoute.Sitemap = [
    entry("news", now),
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
    entry("exchange-rates", now),
    entry("remittance-cost-index", now),
    ...EXCHANGE_RATE_PAIRS.map((pair) => entry(`exchange-rates/${pair}`, now)),
  ];

  const ibanPages: MetadataRoute.Sitemap = wiseCountries
    .filter((c) => c.slug && INDEXED_IBAN_SLUGS.has(c.slug))
    .map((c) => entry(`iban/${c.slug}`, now));

  const swiftPages: MetadataRoute.Sitemap = getSwiftCountries()
    .filter((c) => INDEXED_SWIFT_SLUGS.has(c.slug))
    .map((c) => entry(`swift-codes/${c.slug}`, now));

  return [
    ...staticPages,
    ...corridorPages,
    ...providerPages,
    ...comparisonPages,
    ...guidePages,
    ...newsPages,
    ...exchangeRatesPage,
    ...ibanPages,
    ...swiftPages,
  ];
}
