/**
 * Corridor Tier Classification for Crawl Budget Optimization
 *
 * Classifies every corridor page into 3 tiers based on real data quality:
 *   Tier 1: Editorial corridors OR corridors with 5+ providers → always index
 *   Tier 2: 2-4 providers with data OR country pages with ≥1 provider → index (conditional value)
 *   Tier 3: Zero provider data, template only → noindex + remove from sitemap
 *
 * This module drives both sitemap.ts (which corridors to submit) and
 * the corridor page metadata (which corridors get noindex).
 */

import { quotesByCorridor } from "@/lib/unified-quotes";
import { corridors as editorialCorridors } from "@/data/corridors";

export type CorridorTier = 1 | 2 | 3;

/** Slugs with hand-written editorial content (corridors.ts editorial array) */
const EDITORIAL_SLUGS = new Set(editorialCorridors.map((c) => c.slug));

/**
 * Wave 3 noindex override (added 2026-05-22).
 *
 * These corridors are in EDITORIAL_SLUGS (so the tier classifier would mark
 * them Tier 1 = always indexable), but a 90-day GSC pull shows ZERO queries,
 * ZERO impressions, ZERO clicks — pure demand failures. Leaving them indexable
 * wastes crawl budget and adds noise to the brand's perceived topical focus.
 *
 * They stay in EDITORIAL_SLUGS (so the page still renders and the cross-link
 * graph still works) but receive a noindex tag, matching the
 * "kill thin pages, don't add new ones" directive from May 22 2026.
 *
 * Promote OUT of this set if any of them earns ≥5 GSC impressions in a
 * 30-day window — same readmit policy as the auto-generated /compare pages.
 */
const WAVE3_NOINDEX_SLUGS = new Set<string>([
  "denmark-to-philippines",
  "finland-to-philippines",
  "norway-to-philippines",
  "netherlands-to-philippines",
  "greece-to-poland",
  "czech-republic-to-germany",
  "aud-to-bdt",
]);

/**
 * Count unique providers with real scraped data for a currency pair.
 */
function getProviderCount(fromCurrency: string, toCurrency: string): number {
  const key = `${fromCurrency}_${toCurrency}`;
  const quotes = quotesByCorridor[key];
  if (!quotes || quotes.length === 0) return 0;
  const uniqueProviders = new Set(quotes.map((q) => q.providerSlug));
  return uniqueProviders.size;
}

/**
 * Classify a corridor into tiers.
 */
export function getCorridorTier(
  slug: string,
  fromCurrency: string,
  toCurrency: string,
  isCountryPage?: boolean,
): CorridorTier {
  // Tier 1: Editorial corridors always indexed
  if (EDITORIAL_SLUGS.has(slug)) return 1;

  const providerCount = getProviderCount(fromCurrency, toCurrency);

  // Tier 1: Rich comparison data (5+ providers)
  if (providerCount >= 5) return 1;

  // Tier 2: Meaningful data (2-4 providers). Single-provider pages used to
  // qualify here but Google flagged ~400 of them as soft 404 — a one-row
  // comparison table reads as "no real comparison" to the quality classifier.
  // Demote to Tier 3 so they 404 instead of rendering a thin shell.
  if (providerCount >= 2) return 2;

  // Tier 2: Country pages with at least one provider — navigational hubs with
  // real comparison data. Country pages with zero providers are pure shells:
  // no comparison table, no quotes, nothing a user can act on. Demoting them
  // to Tier 3 stops Google from burning crawl budget on 25 empty pages.
  if (isCountryPage && providerCount >= 1) return 2;

  // Tier 3: No data or single-provider — too thin to index.
  return 3;
}

/**
 * Should this corridor appear in the sitemap?
 *
 * After GSC showed 882 sitemap URLs vs 31 indexed pages (May 8), curate
 * harder: editorial corridors only. The auto-generated currency × country
 * pairs stay live and crawlable via internal links — but Google clearly
 * isn't trusting the sitemap when 96% of submitted URLs aren't indexed.
 * Re-add programmatic corridors once the indexed-page count recovers.
 */
export function shouldIncludeInSitemap(
  slug: string,
  fromCurrency: string,
  toCurrency: string,
  isCountryPage?: boolean,
): boolean {
  return EDITORIAL_SLUGS.has(slug);
}

/**
 * Should this corridor page have a noindex meta tag?
 * Tier 3 pages get noindexed as defense in depth.
 * Wave 3 demand-failure overrides also noindex even though they're editorial.
 */
export function shouldNoindex(
  slug: string,
  fromCurrency: string,
  toCurrency: string,
  isCountryPage?: boolean,
): boolean {
  if (WAVE3_NOINDEX_SLUGS.has(slug)) return true;
  return getCorridorTier(slug, fromCurrency, toCurrency, isCountryPage) === 3;
}
