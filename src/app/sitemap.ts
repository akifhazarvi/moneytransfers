import type { MetadataRoute } from "next";
import { allCorridors } from "@/data/corridors";
import { providers } from "@/data/providers";
import { blogPosts } from "@/data/blog-posts";
import { newsItems } from "@/data/news";
import { wiseCountries } from "@/data/wise-iban";
import { getSwiftCountries } from "@/data/swift-codes";

const SITE_URL = "https://sendmoneycompare.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/send-money`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/companies`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/currency-converter`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/iban`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/swift-codes`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/editorial-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/how-we-review`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/cookies`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/disclaimer`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const corridorPages: MetadataRoute.Sitemap = allCorridors.map((c) => ({
    url: `${SITE_URL}/send-money/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: c.isCurrencyCorridor ? 0.7 : 0.9,
  }));

  const providerPages: MetadataRoute.Sitemap = providers.map((p) => ({
    url: `${SITE_URL}/companies/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const comparisonPages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < providers.length; i++) {
    for (let j = i + 1; j < providers.length; j++) {
      comparisonPages.push({
        url: `${SITE_URL}/compare/${providers[i].slug}-vs-${providers[j].slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      });
    }
  }

  const guidePages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/guides/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const newsPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/news`, lastModified: now, changeFrequency: "daily" as const, priority: 0.7 },
    ...newsItems.map((item) => ({
      url: `${SITE_URL}/news/${item.slug}`,
      lastModified: item.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  const exchangeRatesPage: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/exchange-rates`, lastModified: now, changeFrequency: "hourly" as const, priority: 0.8 },
  ];

  const ibanPages: MetadataRoute.Sitemap = wiseCountries
    .filter((c) => c.slug)
    .map((c) => ({
      url: `${SITE_URL}/iban/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    }));

  const swiftPages: MetadataRoute.Sitemap = getSwiftCountries().map((c) => ({
    url: `${SITE_URL}/swift-codes/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

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
