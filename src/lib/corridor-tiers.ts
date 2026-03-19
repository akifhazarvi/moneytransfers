/**
 * Corridor Tier Classification for Crawl Budget Optimization
 *
 * Classifies every corridor page into 3 tiers based on real data quality:
 *   Tier 1: Editorial corridors OR corridors with 5+ providers → always index
 *   Tier 2: 1-4 providers with data OR country pages → index (conditional value)
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

  // Tier 2: Some data (1-4 providers)
  if (providerCount >= 1) return 2;

  // Tier 2: Country pages (navigational hubs, even without corridor-specific data)
  if (isCountryPage) return 2;

  // Tier 3: No data, template only
  return 3;
}

/**
 * Should this corridor appear in the sitemap?
 * Only Tier 1 and Tier 2.
 */
export function shouldIncludeInSitemap(
  slug: string,
  fromCurrency: string,
  toCurrency: string,
  isCountryPage?: boolean,
): boolean {
  return getCorridorTier(slug, fromCurrency, toCurrency, isCountryPage) <= 2;
}

/**
 * Should this corridor page have a noindex meta tag?
 * Tier 3 pages get noindexed as defense in depth.
 */
export function shouldNoindex(
  slug: string,
  fromCurrency: string,
  toCurrency: string,
  isCountryPage?: boolean,
): boolean {
  return getCorridorTier(slug, fromCurrency, toCurrency, isCountryPage) === 3;
}
