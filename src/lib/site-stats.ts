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
 * Worse, they were wrong in *both* directions. Measured the same day, 93
 * providers appear in live quotes — so every provider count on the site was
 * understated.
 *
 * The corridor count needs more care than a first pass suggests. 1,122
 * corridors carry a quote, which reads like "80+ corridors" understated things
 * by 10x — but 65% of those carry exactly ONE provider, where no comparison
 * exists at all. Only 391 have two or more. Quoting the raw figure would be
 * true-by-wording and false in substance, i.e. the very thing this module
 * exists to prevent, so copy uses `comparableCorridors`.
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
import midMarket from "@/data/scraped/xe-midmarket-rates.json";

/** Latest `dateCollected` in the broadest scrape, full ISO instant. */
function latestScrapeInstant(): string {
  let newest = "";
  for (const q of wiseComparisonQuotes as { dateCollected?: string }[]) {
    const d = q.dateCollected;
    if (d && d > newest) newest = d;
  }
  return newest;
}

const corridorKeys = Object.keys(quotesByCorridor);

/** Distinct providers quoting each corridor. */
const corridorDepth = corridorKeys.map(
  (k) => new Set(quotesByCorridor[k].map((q) => q.providerSlug)).size,
);

/**
 * Corridor counts split by whether a comparison is actually possible there.
 *
 * The raw corridor count is a trap. 1,122 corridors carry a quote, but **65%
 * of them carry exactly one** — there is nothing to compare, so "we compare
 * 1,000+ corridors" would be true-by-wording and false in substance, which is
 * the same overstatement this module exists to stop. Measured 2026-09-06:
 * 1,122 with any quote · 391 with 2+ · 216 with 5+ · 110 with 10+.
 *
 * Copy claims should use `comparableCorridors`. `corridorsWithData` is for
 * describing the dataset (history, coverage of the scrape), never for "we
 * compare X corridors".
 */
const comparable = corridorDepth.filter((d) => d >= 2).length;

export const SITE_STATS = {
  /** Providers with a `/companies/[slug]` page that renders. */
  curatedProviders: providers.length,
  // `listableProviders` is a function, not an array — calling `.length` on it
  // returns its arity (0), which is why this is invoked.
  /** Curated providers actually offered in listings (excludes hidden ones). */
  listableProviders: listableProviders().length,
  /** Distinct providers appearing in live scraped quotes. */
  liveProviders: allProviderSlugs.size,
  /** Corridors carrying at least one live quote. Describes the dataset —
   *  NOT a comparison claim, since 65% of these hold a single provider. */
  corridorsWithData: corridorKeys.length,
  /** Corridors with 2+ providers, i.e. where a comparison actually exists.
   *  This is the number copy should quote. */
  comparableCorridors: comparable,
  /** Corridors with 5+ providers — a genuinely deep comparison. */
  deepCorridors: corridorDepth.filter((d) => d >= 5).length,
  /** Currencies selectable anywhere in the comparison UI. */
  currencies: currencies.length,
  /** Currencies we can send *from*. */
  sendCurrencies: sendCurrencies.length,
  /** Distinct receive currencies seen across live corridors. */
  receiveCurrencies: new Set(corridorKeys.map((k) => k.split("_")[1])).size,
  /** ISO day of the freshest quote in the broadest scrape. */
  quotesUpdated: latestScrapeInstant().slice(0, 10),
  /**
   * Full ISO instant of the freshest quote. Structured data should use this
   * rather than the day: a rate page claiming intraday freshness with only a
   * date attached gives a crawler no way to tell this morning's rate from one
   * a year old.
   */
  quotesUpdatedAt: latestScrapeInstant(),
  /** Full ISO instant of the mid-market snapshot the markups are priced against. */
  midMarketUpdatedAt: (midMarket as { timestamp?: string }).timestamp ?? latestScrapeInstant(),
  /**
   * Hours between scheduled quote refreshes. Mirrors the cron in
   * .github/workflows/scrape.yml ('0 0,6,12,18 * * *'); copy that states a
   * refresh interval should agree with this rather than hand-typing one.
   */
  refreshHours: 6,
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
  corridors: `${atLeast(SITE_STATS.comparableCorridors)} corridors`,
  currencies: `${atLeast(SITE_STATS.currencies)} currencies`,
  /** The combined phrase used in guide intros and meta descriptions. */
  providersAndCorridors: `${atLeast(SITE_STATS.liveProviders)} providers across ${atLeast(
    SITE_STATS.comparableCorridors,
  )} corridors`,
} as const;
