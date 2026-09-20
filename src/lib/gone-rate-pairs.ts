/**
 * Retired /exchange-rates/[pair] deep-dives — HTTP 301 to /exchange-rates.
 *
 * Decision (2026-09-20): the exchange-rates section was always meant to be ONE
 * page showing every pair, not twenty dynamic pages. The hub already renders
 * all twenty with their live mid-market rate; the per-pair routes existed only
 * to hang a deep-dive off each tile.
 *
 * 301, not 410, and this is the difference from gone-corridors.ts: a retired
 * corridor has no equivalent page, so 410 is honest. A retired rate pair has
 * one — the hub carries the same rate, the same chart data and the same
 * provider quotes — so the redirect consolidates rather than discards.
 *
 * Two pages are KEPT because they earn. sitemap-allowlists.ts recorded the
 * Bing/GSC evidence when the set was reconciled on 2026-06-07:
 *
 *   usd-to-brl   232 impressions
 *   gbp-to-eur    69 impressions
 *
 * The other eighteen were noted there as "~0 Bing/GSC at the May-25 prune …
 * re-prune via Bing data if they stay at 0 by next review". This is that
 * review. No fresh Bing pull was available in this session, so the figures
 * above are the ones on record rather than re-measured.
 *
 * Readmit a slug here only if it starts earning on Bing — same policy as the
 * corridor sets.
 */

/** Rate pairs that keep a standalone page, on measured demand. */
export const KEPT_RATE_PAIR_SLUGS: ReadonlySet<string> = new Set([
  "usd-to-brl",
  "gbp-to-eur",
]);

/** Rate pairs whose deep-dive is retired and 301s to the hub. */
export const GONE_RATE_PAIR_SLUGS: ReadonlySet<string> = new Set([
  "usd-to-inr",
  "usd-to-pkr",
  "usd-to-php",
  "usd-to-mxn",
  "usd-to-ngn",
  "gbp-to-inr",
  "gbp-to-usd",
  "gbp-to-pkr",
  "eur-to-usd",
  "eur-to-gbp",
  "cad-to-inr",
  "aud-to-inr",
  "usd-to-gbp",
  "usd-to-eur",
  "usd-to-cad",
  "usd-to-aud",
  "usd-to-jpy",
  "usd-to-cny",
]);
