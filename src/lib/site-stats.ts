/**
 * Canonical site-scale numbers — the single source for "how many providers /
 * corridors / currencies do we cover".
 *
 * WHY THIS EXISTS
 * A 2026-09-05 census found the same site describing itself with mutually
 * exclusive numbers: "50+ providers" (38 places), "60+ providers" (13),
 * "15+ providers" (24), "10+ providers" (127), against "80+ corridors" (10).
 * Every one of those was hand-typed into prose at some point and then went
 * stale independently. A reader who lands on two pages sees two different
 * companies, and on YMYL finance content an unverifiable self-description is
 * the cheapest possible trust leak.
 *
 * Worse, they were wrong in *both* directions. Measured the same day: 93
 * providers appear in live quotes and 1,119 corridors carry them. "80+
 * corridors" understated the real figure by more than 10x.
 *
 * The fix is to derive the numbers rather than type them, and to publish them
 * through `atLeast()` so a claim degrades to a rounder, still-true number
 * instead of decaying into a false one when the scrape shifts.
 *
 * USAGE
 *   import { SITE_STATS, atLeast } from "@/lib/site-stats";
 *   `Compare ${atLeast(SITE_STATS.liveProviders)} providers`  // "90+ providers"
 *
 * Never hand-type a coverage number into copy again — import it.
 */

import { quotesByCorridor, allProviderSlugs } from "./unified-quotes";
import { providers, listableProviders, currencies, sendCurrencies } from "@/data/providers";
import wiseComparisonQuotes from "@/data/scraped/wise-comparison-quotes.json";

/** Latest `dateCollected` in the broadest scrape, as an ISO day. */
function latestScrapeDay(): string {
  let newest = "";
  for (const q of wiseComparisonQuotes as { dateCollected?: string }[]) {
    const d = q.dateCollected;
    if (d && d > newest) newest = d;
  }
  return newest.slice(0, 10);
}

const corridorKeys = Object.keys(quotesByCorridor);

export const SITE_STATS = {
  /** Providers with a `/companies/[slug]` page that renders. */
  curatedProviders: providers.length,
  // `listableProviders` is a function, not an array — calling `.length` on it
  // returns its arity (0), which is why this is invoked.
  /** Curated providers actually offered in listings (excludes hidden ones). */
  listableProviders: listableProviders().length,
  /** Distinct providers appearing in live scraped quotes. */
  liveProviders: allProviderSlugs.size,
  /** Distinct send→receive currency pairs carrying live quotes. */
  liveCorridors: corridorKeys.length,
  /** Currencies selectable anywhere in the comparison UI. */
  currencies: currencies.length,
  /** Currencies we can send *from*. */
  sendCurrencies: sendCurrencies.length,
  /** Distinct receive currencies seen across live corridors. */
  receiveCurrencies: new Set(corridorKeys.map((k) => k.split("_")[1])).size,
  /** ISO day of the freshest quote in the broadest scrape. */
  quotesUpdated: latestScrapeDay(),
} as const;

/**
 * Floor `n` to a round number at or below it, for use in prose.
 *
 * Copy says "90+ providers" while the real figure is 93, so the sentence stays
 * true if a scraper drops a provider overnight — the failure mode of a
 * hand-typed "93 providers" is a false claim, and the failure mode of this is a
 * slightly modest one. Steps widen as numbers grow so the claim reads naturally
 * ("1,000+" rather than "1,119+").
 */
export function atLeast(n: number): string {
  if (n < 10) return String(n);
  const step = n >= 1000 ? 500 : n >= 200 ? 100 : n >= 50 ? 10 : 5;
  return `${Math.floor(n / step) * step}+`;
}

/** Pre-formatted phrases for the claims that appear most often in copy. */
export const COVERAGE = {
  providers: `${atLeast(SITE_STATS.liveProviders)} providers`,
  corridors: `${atLeast(SITE_STATS.liveCorridors)} corridors`,
  currencies: `${atLeast(SITE_STATS.currencies)} currencies`,
  /** The combined phrase used in guide intros and meta descriptions. */
  providersAndCorridors: `${atLeast(SITE_STATS.liveProviders)} providers across ${atLeast(
    SITE_STATS.liveCorridors,
  )} corridors`,
} as const;
