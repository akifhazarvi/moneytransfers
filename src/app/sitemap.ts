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
import { INDEXED_BANK_SLUGS } from "@/lib/bank-comparisons";
import { GONE_CORRIDOR_SLUGS } from "@/lib/gone-corridors";
import {
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

// Stable content dates for the large TEMPLATED families.
//
// These pages carry live quote data, but the data is not what the page *says*.
// A corridor page's answer is "these are the cheapest providers for USD→INR";
// that answer changes when the ranking changes, not when a rate ticks from
// 94.72 to 94.75. Stamping all 437 with DATA_UPDATED meant 509 of 690 sitemap
// URLs claimed to have changed today — every day, forever.
//
// That is the pattern Google discounts, and it discounts lastmod SITEWIDE,
// so it also throws away the signal on pages where it is genuinely
// informative (a new guide, a news piece, a live converter).
//
// Per-corridor stamping from the quote rows was measured and rejected: every
// scraper file is 1–2 days old, so it produced just two distinct dates across
// 1,096 currency pairs — accurate, but no more informative than a constant.
//
// Each constant is the date that family's template or editorial content last
// actually changed, per git history. Bump one when you change that family —
// the same discipline STATIC_HUB_DATE already follows.
const CORRIDOR_CONTENT_DATE = "2026-08-31";   // corridor template + EUR collapse
const COMPARISON_CONTENT_DATE = "2026-08-19"; // /compare, /banks, review fallback
const RATE_PAGE_CONTENT_DATE = "2026-09-01";  // /exchange-rates/* — inline quotes added

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
    // /compare-money-transfer is deliberately NOT listed: its canonical points
    // at /compare (the two target the same intent and we consolidate signals
    // there). Submitting a URL that canonicalises elsewhere asks the crawler to
    // index a page we have told it not to index — Semrush flagged exactly this
    // on 2026-09-02 ("incorrect page found in sitemap.xml: non-canonical URL").
    // The page still renders and still carries its internal links.
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
    // Free tools hub + the two live calculators (added Jul 3 2026). Live: US
    // remittance tax (new 1% excise, high-intent 2026 query) and the FX markup
    // checker (live mid-market reference). The Fee Impact calculator at
    // /tools/fee-impact is intentionally NOT listed — it ships dark (noindex)
    // until we launch it. STATIC_CONTENT_DATE for the hub; DATA_UPDATED for the
    // tools since their live-quote blocks refresh with each scrape.
    entry("tools", STATIC_HUB_DATE),
    entry("tools/us-remittance-tax", DATA_UPDATED),
    entry("tools/fx-markup-checker", DATA_UPDATED),
    entry("tools/salary-abroad", DATA_UPDATED),
    // Crypto cash-out cluster (added Jul 3 2026, DESITEMAPPED 2026-09-01).
    // The editorial is genuinely unique — 12.2% intra-family 8-gram similarity,
    // hand-authored per country, not templated shells. But the pages are thin
    // (~550 body words) and a live 90-day pull returned 15 GA4 sessions, 1 key
    // event and ZERO Google impressions across all 7. Thin plus no demand is
    // the scaled-content profile, so they are noindexed and off the sitemap.
    // They stay live and internally linked — the traffic and AI citations they
    // do earn are unaffected. Re-add a page once it shows real demand.
    // Flagship data-story (live-computed bank-vs-app cost index). Not a
    // blog-posts.ts guide — it's a dedicated live route, so it's listed here
    // explicitly. DATA_UPDATED because its figures refresh with each scrape.
    entry("guides/bank-vs-app-transfer-cost-2026", DATA_UPDATED),
    entry("guides/best-day-to-send-money-abroad", DATA_UPDATED),
    entry("guides/fx-cost-vs-purchasing-power", DATA_UPDATED),
    // Dedicated guide: best apps to send money from the US — standalone page
    // with 4 schema types, OG image, and full FAQ (added 2026-06-30).
    entry("guides/best-apps-to-send-money-from-us-2026", "2026-06-30"),
    entry("exchange-rates", DATA_UPDATED),
    // Restored Jun 22 2026 — 1,410 Bing impr + 1,389 AI citations were landing
    // on this URL while it 404'd after its Jun 20 retirement. Live-computed
    // rates, statically prerendered (revalidate hourly), so DATA_UPDATED.
    entry("currency-converter", DATA_UPDATED),
    entry("news", STATIC_HUB_DATE),
    entry("business", STATIC_HUB_DATE),
    // Live Business/B2B payment-provider cost comparison tool. Added Jun 22 2026
    // to capture the highest-AI-citation-share B2B query cluster ("lowest fees
    // international business payments providers comparison" — 763 cites/79%
    // share). Live-computed figures, statically prerendered (revalidate hourly).
    entry("business/compare", DATA_UPDATED),
  ];

  // ── Corridors: GSC-allowlisted earners PLUS head-term flagships ──
  // The allowlist gates on ≥10 GSC impressions in 90d. But head-terms (e.g.
  // usa-to-india) were stuck in a chicken-and-egg trap: excluded from the
  // sitemap for never earning impressions, and unable to earn impressions
  // because Google never discovered them ("URL is unknown to Google", 2026-06).
  // HEAD_CORRIDOR_SLUGS breaks that loop by submitting them on demand-merit —
  // same rationale as bank pages below. They're force-Tier-1 so shouldNoindex
  // is false. Also defensively exclude retired (410) slugs.
  // Still filter Tier-3 (zero data → noindex/404) so we never submit a
  // contradictory noindex/404 URL.
  // Submit EVERY indexable corridor, not a subset of them. shouldNoindex is the
  // single authority (Tier 1 indexable; Tier 2 only once allowlisted; Tier 3
  // never), so filtering on it alone guarantees sitemap membership and robots
  // agree in both directions — no page claiming `index, follow` from off the
  // sitemap, and no submitted URL that serves noindex.
  //
  // Previously this AND-ed the allowlist on top, which submitted 44 of 1,176
  // indexable corridors. A sitemap that omits pages you want indexed is a signal
  // you do not want them indexed; listing them is how you ask.
  const corridorPages: MetadataRoute.Sitemap = allCorridors
    .filter((c) => !GONE_CORRIDOR_SLUGS.has(c.slug))
    .filter((c) => !shouldNoindex(c.slug, c.fromCurrency, c.toCurrency, c.isCountryPage))
    .map((c) => entry(`send-money/${c.slug}`, CORRIDOR_CONTENT_DATE));

  // ── Provider reviews ──
  const reviewedSlugs = new Set(providerReviews.map((r) => r.slug));
  const reviewDateMap = new Map(providerReviews.map((r) => [r.slug, r.updatedAt || COMPARISON_CONTENT_DATE]));
  const providerPages: MetadataRoute.Sitemap = providers
    .filter((p) => reviewedSlugs.has(p.slug) && SITEMAP_PROVIDER_SLUGS.has(p.slug))
    .map((p) => entry(`companies/${p.slug}`, reviewDateMap.get(p.slug) || COMPARISON_CONTENT_DATE));

  // ── Head-to-head comparison pages ──
  const comparisonPages: MetadataRoute.Sitemap = [...SITEMAP_COMPARISON_SLUGS].map((slug) =>
    entry(`compare/${slug}`, COMPARISON_CONTENT_DATE),
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
    entry(`exchange-rates/${pair}`, RATE_PAGE_CONTENT_DATE),
  );

  // ── Rate history pages ──
  const rateHistoryHub: MetadataRoute.Sitemap = [entry("exchange-rates/history", RATE_PAGE_CONTENT_DATE)];
  const rateHistoryPages: MetadataRoute.Sitemap = getAllInsights(2)
    .filter((i) => SITEMAP_RATE_HISTORY_SLUGS.has(corridorToSlug(i.corridor)))
    .map((i) => entry(`exchange-rates/history/${corridorToSlug(i.corridor)}`, RATE_PAGE_CONTENT_DATE));

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
    entry("banks", COMPARISON_CONTENT_DATE),
    // Only indexable pilots (hsbc, chase). wells-fargo/lloyds/barclays dropped
    // 2026-06-21 — 0 traction on both engines, now noindexed (see
    // banks/[slug]/page.tsx INDEXED_BANK_SLUGS — single source of truth).
    ...[...INDEXED_BANK_SLUGS].map((slug) => entry(`banks/${slug}`, COMPARISON_CONTENT_DATE)),
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
