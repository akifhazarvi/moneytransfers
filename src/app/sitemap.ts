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
]);

const INDEXED_SWIFT_SLUGS = new Set([
  "united-kingdom", "united-states", "india", "pakistan", "germany",
  "france", "netherlands", "united-arab-emirates", "canada", "australia",
  "hong-kong", "singapore", "south-africa", "ireland", "new-zealand",
]);

function withAlternates(
  path: string,
  options: { lastModified: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }
): MetadataRoute.Sitemap[number] {
  const url = path ? `${SITE_URL}/${path}` : SITE_URL;
  return {
    url,
    lastModified: options.lastModified,
    changeFrequency: options.changeFrequency,
    priority: options.priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    withAlternates("", { lastModified: now, changeFrequency: "daily", priority: 1.0 }),
    withAlternates("send-money", { lastModified: now, changeFrequency: "daily", priority: 0.9 }),
    withAlternates("companies", { lastModified: now, changeFrequency: "weekly", priority: 0.8 }),
    withAlternates("compare", { lastModified: now, changeFrequency: "weekly", priority: 0.8 }),
    withAlternates("currency-converter", { lastModified: now, changeFrequency: "daily", priority: 0.7 }),
    withAlternates("guides", { lastModified: now, changeFrequency: "weekly", priority: 0.7 }),
    withAlternates("iban", { lastModified: now, changeFrequency: "monthly", priority: 0.5 }),
    withAlternates("swift-codes", { lastModified: now, changeFrequency: "monthly", priority: 0.5 }),
    withAlternates("about", { lastModified: now, changeFrequency: "monthly", priority: 0.3 }),
    withAlternates("contact", { lastModified: now, changeFrequency: "monthly", priority: 0.3 }),
    withAlternates("editorial-policy", { lastModified: now, changeFrequency: "monthly", priority: 0.3 }),
    withAlternates("how-we-review", { lastModified: now, changeFrequency: "monthly", priority: 0.3 }),
    withAlternates("methodology", { lastModified: now, changeFrequency: "monthly", priority: 0.3 }),
    withAlternates("privacy-policy", { lastModified: now, changeFrequency: "monthly", priority: 0.3 }),
    withAlternates("terms", { lastModified: now, changeFrequency: "monthly", priority: 0.3 }),
    withAlternates("cookies", { lastModified: now, changeFrequency: "monthly", priority: 0.3 }),
    withAlternates("disclaimer", { lastModified: now, changeFrequency: "monthly", priority: 0.3 }),
  ];

  const corridorPages: MetadataRoute.Sitemap = allCorridors
    .filter((c) => !EXCLUDED_CORRIDOR_SLUGS.has(c.slug))
    .map((c) =>
    withAlternates(`send-money/${c.slug}`, {
      lastModified: now,
      changeFrequency: "daily",
      priority: c.isCurrencyCorridor ? 0.7 : 0.9,
    })
  );

  const providerPages: MetadataRoute.Sitemap = providers.map((p) =>
    withAlternates(`companies/${p.slug}`, {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  const comparisonPages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < providers.length; i++) {
    for (let j = i + 1; j < providers.length; j++) {
      comparisonPages.push(
        withAlternates(`compare/${providers[i].slug}-vs-${providers[j].slug}`, {
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.6,
        })
      );
    }
  }

  const guidePages: MetadataRoute.Sitemap = blogPosts.map((post) =>
    withAlternates(`guides/${post.slug}`, {
      lastModified: post.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

  const newsPages: MetadataRoute.Sitemap = [
    withAlternates("news", { lastModified: now, changeFrequency: "daily", priority: 0.7 }),
    ...newsItems.map((item) =>
      withAlternates(`news/${item.slug}`, {
        lastModified: item.publishedAt,
        changeFrequency: "monthly",
        priority: 0.5,
      })
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

  const exchangeRatesPage: MetadataRoute.Sitemap = [
    withAlternates("exchange-rates", { lastModified: now, changeFrequency: "hourly", priority: 0.8 }),
    withAlternates("remittance-cost-index", { lastModified: now, changeFrequency: "weekly", priority: 0.9 }),
    ...EXCHANGE_RATE_PAIRS.map((pair) =>
      withAlternates(`exchange-rates/${pair}`, {
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.7,
      })
    ),
  ];

  const ibanPages: MetadataRoute.Sitemap = wiseCountries
    .filter((c) => c.slug && INDEXED_IBAN_SLUGS.has(c.slug))
    .map((c) =>
      withAlternates(`iban/${c.slug}`, {
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.4,
      })
    );

  const swiftPages: MetadataRoute.Sitemap = getSwiftCountries()
    .filter((c) => INDEXED_SWIFT_SLUGS.has(c.slug))
    .map((c) =>
    withAlternates(`swift-codes/${c.slug}`, {
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    })
  );

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
