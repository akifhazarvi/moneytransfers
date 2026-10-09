/**
 * /exchange-rates/[pair] deep-dives: which render, which 301, which are gone.
 *
 * History. 2026-09-20: eighteen pair pages were retired and 301'd to the
 * /exchange-rates hub, on the reasoning that the hub carries every pair's rate.
 * Two (usd-to-brl, gbp-to-eur) were kept on measured demand.
 *
 * 2026-10-08, round-3 freelance brief §3.2: a redirect to the general hub is a
 * soft 404 — "a 301 is acceptable only when the destination addresses the same
 * query (the same corridor or currency pair). If there is no equivalent,
 * return 410." The brief's Bing PageTraffic export also showed these URLs still
 * earning: usd-to-php 14 clicks / 2,397 impressions, aud-to-inr 3 / 2,571,
 * gbp-to-pkr 3 / 722, usd-to-cny 2 / 52, usd-to-mxn 1 / 25 — and the brief's
 * strategy is that Bing keeps indexing everything it earns on. So each pair
 * now gets exactly one answer:
 *
 *   KEPT       renders, Bing-only (BING_DEMAND_ROUTES, googlebot: noindex):
 *              the two kept in September plus the five Bing earners above
 *              that have no history page of their own to go to.
 *   REDIRECTS  301 to the same pair's rate-history page, which answers the same
 *              query ("USD to GBP rate") and renders (KEEP_HISTORY_PAIRS with
 *              ≥2 days of data). scripts/check-redirects.ts asserts each target
 *              is prerendered, so this can never become a chain or a dead end.
 *   GONE       410: no Bing demand on record and no same-pair page.
 *
 * Kept as plain literals: middleware imports this file, so it must not pull in
 * rate-history (28 MB of JSON) to ask which history pages exist.
 */

/** Rate pairs that keep a standalone page. */
export const KEPT_RATE_PAIR_SLUGS: ReadonlySet<string> = new Set([
  "usd-to-brl",
  "gbp-to-eur",
  // 2026-10-08: Bing earners with no history page (round-3 brief §3.2)
  "usd-to-php",
  "aud-to-inr",
  "gbp-to-pkr",
  "usd-to-cny",
  "usd-to-mxn",
]);

/** Retired pair pages that 301 to the same pair's rate history (one hop, 200). */
export const RATE_PAIR_REDIRECTS: ReadonlyMap<string, string> = new Map(
  ["usd-to-gbp", "eur-to-usd", "usd-to-eur", "eur-to-gbp", "gbp-to-usd", "usd-to-cad", "usd-to-aud", "usd-to-jpy"].map(
    (pair) => [pair, `/exchange-rates/history/${pair}`] as const,
  ),
);

/** Retired pair pages with no equivalent: 410. */
export const GONE_RATE_PAIR_SLUGS: ReadonlySet<string> = new Set([
  "usd-to-inr",
  "usd-to-pkr",
  "usd-to-ngn",
  "gbp-to-inr",
  "cad-to-inr",
]);

/**
 * Rate-history URLs with no page of their own that 301 to the same pair's
 * standalone page. /exchange-rates/history/usd-to-php answered 404 with 26 Bing
 * impressions on record (brief §3.3: "replace the 404 with 410 or restore");
 * /exchange-rates/usd-to-php renders again, so it is the equivalent.
 */
export const RATE_HISTORY_REDIRECTS: ReadonlyMap<string, string> = new Map([
  ["usd-to-php", "/exchange-rates/usd-to-php"],
]);
