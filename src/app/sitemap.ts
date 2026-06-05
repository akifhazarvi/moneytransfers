import type { MetadataRoute } from "next";
import { allCorridors } from "@/data/corridors";
import { shouldNoindex } from "@/lib/corridor-tiers";
import { providers } from "@/data/providers";
import { blogPosts } from "@/data/blog-posts";
import { newsItems } from "@/data/news";
import { businessPages } from "@/data/business-pages";
import { wiseCountries } from "@/data/wise-iban";
import { getSwiftCountries } from "@/data/swift-codes";
import { providerReviews } from "@/data/provider-reviews";
import { getAllInsights, corridorToSlug } from "@/lib/rate-history";
import { getDataUpdatedDate } from "@/lib/data-freshness";
import {
  SITEMAP_CORRIDOR_SLUGS,
  SITEMAP_GUIDE_SLUGS,
  SITEMAP_IBAN_SLUGS,
  SITEMAP_COMPARISON_SLUGS,
  SITEMAP_PROVIDER_SLUGS,
  SITEMAP_NEWS_SLUGS,
  SITEMAP_RATE_PAIR_SLUGS,
  SITEMAP_RATE_HISTORY_SLUGS,
  SITEMAP_SWIFT_SLUGS,
  SITEMAP_BUSINESS_SLUGS,
} from "@/lib/sitemap-allowlists";

const SITE_URL = "https://sendmoneycompare.com";

// Stable date for hub/static pages — only update when content actually changes.
// Google's John Mueller: lastmod should reflect actual content changes, not
// deploy timestamps. Using `new Date()` here was inflating lastmod on every
// deploy, eroding Google's trust in the signal sitewide.
const STATIC_HUB_DATE = "2026-03-28";
const STATIC_CONTENT_DATE = "2026-03-01";

// Derived from the most recently modified scraped quotes file (shared with
// the WebSite.dateModified schema in [locale]/layout.tsx — single source of
// truth). Ensures lastmod on data-driven pages reflects when live data
// actually changed, not deploy time.
const DATA_UPDATED = getDataUpdatedDate();

function entry(path: string, lastModified: string): MetadataRoute.Sitemap[number] {
  const url = path ? `${SITE_URL}/${path}` : SITE_URL;
  return { url, lastModified };
}

/**
 * Sitemap composition rule (re-curation May 20, 2026):
 *
 * After the May 8 deindex (420 submitted, 31 indexed = 7% acceptance rate),
 * the sitemap is now gated on real GSC signal: every content URL must have
 * earned ≥10 impressions in the 90-day window Feb 18 – May 19, 2026.
 *
 * The allowlists live in src/lib/sitemap-allowlists.ts and are mechanical —
 * they don't try to predict what should rank, only report what already has.
 * Regenerate them when a fresh GSC pull recalibrates the signal.
 *
 * Pages outside the allowlist stay live and crawlable via internal links;
 * they just aren't actively submitted. The point is to stop telling Google
 * "this is our recommended set" when 93% of the set hasn't earned its slot.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // ── Static pages — always indexable, no GSC gating ──
  const staticPages: MetadataRoute.Sitemap = [
    entry("", DATA_UPDATED),
    entry("send-money", DATA_UPDATED),
    entry("companies", DATA_UPDATED),
    entry("compare", DATA_UPDATED),
    entry("compare-money-transfer", DATA_UPDATED),
    entry("currency-converter", DATA_UPDATED),
    entry("guides", STATIC_HUB_DATE),
    entry("iban", STATIC_HUB_DATE),
    entry("swift-codes", STATIC_HUB_DATE),
    entry("about", STATIC_HUB_DATE),
    entry("contact", STATIC_HUB_DATE),
    entry("editorial-policy", STATIC_CONTENT_DATE),
    entry("how-we-review", STATIC_CONTENT_DATE),
    entry("methodology", STATIC_CONTENT_DATE),
    entry("privacy-policy", STATIC_CONTENT_DATE),
    entry("terms", STATIC_CONTENT_DATE),
    entry("for-ai", DATA_UPDATED),
    entry("remittance-cost-index", DATA_UPDATED),
    entry("exchange-rates", DATA_UPDATED),
    entry("news", STATIC_HUB_DATE),
    entry("business", STATIC_HUB_DATE),
  ];

  // ── Corridors: only those with ≥10 GSC impressions in 90d ──
  // ALSO filter out Tier-3 corridors (zero provider data → page noindexes
  // and 404s). Google's canonical guide: never submit a URL in the sitemap
  // while also serving noindex/404 — it's a contradictory signal. This
  // catches stale allowlist entries where a slug earned GSC impressions
  // before the provider data dried up.
  const corridorPages: MetadataRoute.Sitemap = allCorridors
    .filter((c) => SITEMAP_CORRIDOR_SLUGS.has(c.slug))
    .filter((c) => !shouldNoindex(c.slug, c.fromCurrency, c.toCurrency, c.isCountryPage))
    .map((c) => entry(`send-money/${c.slug}`, DATA_UPDATED));

  // ── Provider reviews ──
  const reviewedSlugs = new Set(providerReviews.map((r) => r.slug));
  const reviewDateMap = new Map(providerReviews.map((r) => [r.slug, r.updatedAt || DATA_UPDATED]));
  const providerPages: MetadataRoute.Sitemap = providers
    .filter((p) => reviewedSlugs.has(p.slug) && SITEMAP_PROVIDER_SLUGS.has(p.slug))
    .map((p) => entry(`companies/${p.slug}`, reviewDateMap.get(p.slug) || DATA_UPDATED));

  // ── Head-to-head comparison pages ──
  const comparisonPages: MetadataRoute.Sitemap = [...SITEMAP_COMPARISON_SLUGS].map((slug) =>
    entry(`compare/${slug}`, DATA_UPDATED),
  );

  // ── Editorial guides ──
  const guidePages: MetadataRoute.Sitemap = blogPosts
    .filter((post) => SITEMAP_GUIDE_SLUGS.has(post.slug))
    .map((post) => entry(`guides/${post.slug}`, post.updatedAt));

  // ── News articles ──
  const newsPages: MetadataRoute.Sitemap = newsItems
    .filter((item) => SITEMAP_NEWS_SLUGS.has(item.slug))
    .map((item) => entry(`news/${item.slug}`, item.publishedAt));

  // ── Exchange-rate pages ──
  const ratePages: MetadataRoute.Sitemap = [...SITEMAP_RATE_PAIR_SLUGS].map((pair) =>
    entry(`exchange-rates/${pair}`, DATA_UPDATED),
  );

  // ── Rate history pages ──
  const rateHistoryHub: MetadataRoute.Sitemap = [entry("exchange-rates/history", DATA_UPDATED)];
  const rateHistoryPages: MetadataRoute.Sitemap = getAllInsights(2)
    .filter((i) => SITEMAP_RATE_HISTORY_SLUGS.has(corridorToSlug(i.corridor)))
    .map((i) => entry(`exchange-rates/history/${corridorToSlug(i.corridor)}`, DATA_UPDATED));

  // ── IBAN country pages ──
  const ibanPages: MetadataRoute.Sitemap = wiseCountries
    .filter((c) => c.slug && SITEMAP_IBAN_SLUGS.has(c.slug))
    .map((c) => entry(`iban/${c.slug}`, STATIC_HUB_DATE));

  // ── SWIFT country pages ──
  const swiftPages: MetadataRoute.Sitemap = getSwiftCountries()
    .filter((c) => SITEMAP_SWIFT_SLUGS.has(c.slug))
    .map((c) => entry(`swift-codes/${c.slug}`, STATIC_HUB_DATE));

  // ── B2B/business landing pages ──
  const businessHubPages: MetadataRoute.Sitemap = businessPages
    .filter((p) => SITEMAP_BUSINESS_SLUGS.has(p.slug))
    .map((p) => entry(`business/${p.slug}`, STATIC_HUB_DATE));

  // ── Bank international-transfer-cost pages (pilot set: 5 banks) ──
  // Marketing surface backed by live Wise-comparison-API data. Submitted to
  // sitemap from day one because each page is hand-curated metadata + live
  // data, not auto-generated thin content; demand justifies inclusion before
  // GSC impressions accumulate.
  const bankPages: MetadataRoute.Sitemap = [
    entry("banks", DATA_UPDATED),
    ...["hsbc", "wells-fargo", "chase", "lloyds", "barclays"].map((slug) =>
      entry(`banks/${slug}`, DATA_UPDATED),
    ),
  ];

  return [
    ...staticPages,
    ...corridorPages,
    ...providerPages,
    ...comparisonPages,
    ...guidePages,
    ...newsPages,
    ...ratePages,
    ...rateHistoryHub,
    ...rateHistoryPages,
    ...ibanPages,
    ...swiftPages,
    ...businessHubPages,
    ...bankPages,
  ];
}
