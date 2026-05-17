/**
 * Single source of truth for SEO indexing rules.
 *
 * Exposes a path-matcher used by middleware to send X-Robots-Tag headers so
 * Googlebot can skip rendering noindex'd pages and recover crawl budget for
 * the indexable set.
 *
 * The allowlists here MUST stay in sync with:
 *   - src/app/[locale]/iban/[slug]/page.tsx (indexedIbanCountries)
 *   - src/app/[locale]/swift-codes/[country]/page.tsx (indexedSwiftCountries)
 *   - src/app/sitemap.ts (INDEXED_IBAN_SLUGS / INDEXED_SWIFT_SLUGS)
 *
 * Note: non-English locale variants (/es/, /fr/, /pt/) are no longer handled
 * here — middleware returns 410 Gone for them before this helper runs.
 */

export const INDEXED_IBAN_SLUGS = new Set<string>([
  "uk", "germany", "france", "netherlands", "spain",
  "italy", "denmark", "belgium", "austria", "ireland",
  "portugal", "sweden", "switzerland", "poland", "norway",
  "pakistan",
  "turkey", "romania", "czechia", "hungary", "croatia",
  "finland", "greece", "cyprus", "luxembourg",
  "united-arab-emirates", "saudi-arabia", "qatar", "kuwait", "bahrain",
  "jordan", "egypt", "israel", "brazil", "ukraine", "georgia",
]);

export const INDEXED_SWIFT_SLUGS = new Set<string>([
  "united-kingdom", "united-states", "india", "pakistan", "germany",
  "france", "netherlands", "united-arab-emirates", "canada", "australia",
  "hong-kong", "singapore", "south-africa", "ireland", "new-zealand",
  "bangladesh", "philippines", "nigeria", "mexico", "china",
  "japan", "south-korea", "thailand", "indonesia", "malaysia",
  "brazil", "kenya", "ghana", "sri-lanka", "nepal",
  "turkiye", "egypt", "morocco", "colombia", "peru",
]);

/**
 * Rate history pages with ≥10 GSC impressions in the 28-day window ending 2026-04-28.
 * Everything outside this set is noindexed — 179 history pages existed; only ~12 had
 * meaningful signal. The rest burn crawl budget at position 65–80 with 0 clicks.
 *
 * Derived from GSC page report (sc-domain:sendmoneycompare.com, Apr 2–28 2026):
 *   eur-to-gbp 110, gbp-to-usd 109, usd-to-cad 72, usd-to-php 56,
 *   gbp-to-eur 43, usd-to-inr 25, gbp-to-zar 23, aud-to-usd 20,
 *   gbp-to-inr 18, aud-to-php 18, usd-to-mxn 15, aud-to-eur 13.
 *
 * Update this set when a slug crosses 10 impressions in a fresh GSC pull.
 */
export const INDEXED_HISTORY_SLUGS = new Set<string>([
  "eur-to-gbp",
  "gbp-to-usd",
  "usd-to-cad",
  "usd-to-php",
  "gbp-to-eur",
  "usd-to-inr",
  "gbp-to-zar",
  "aud-to-usd",
  "gbp-to-inr",
  "aud-to-php",
  "usd-to-mxn",
  "aud-to-eur",
]);

/**
 * Decide whether a request path should receive an X-Robots-Tag: noindex header.
 *
 * Recall matters more than precision here — missing a noindex case means
 * Googlebot keeps wasting renders, while over-flagging a route is harmless
 * (the page metadata already determines real index/noindex).
 */
export function shouldNoindexPath(pathname: string): boolean {
  const parts = pathname.replace(/^\/+/, "").split("/");
  const top = parts[0];
  if (!top) return false;

  // IBAN slug pages outside the priority allowlist → noindex.
  if (top === "iban" && parts[1] && !INDEXED_IBAN_SLUGS.has(parts[1])) {
    return true;
  }

  // SWIFT country pages outside the priority allowlist → noindex.
  if (top === "swift-codes" && parts[1] && !INDEXED_SWIFT_SLUGS.has(parts[1])) {
    return true;
  }

  // Rate history pages outside the GSC-validated allowlist → noindex.
  // 167 of 179 history pages have 0–9 impressions at position 65–80 and
  // burn crawl budget without any ranking benefit.
  if (top === "exchange-rates" && parts[1] === "history" && parts[2] && !INDEXED_HISTORY_SLUGS.has(parts[2])) {
    return true;
  }

  // Tier-3 / single-provider corridor pages can't be detected from the
  // pathname alone (needs scraped quote data). The corridor page metadata
  // handles those; middleware would only short-circuit the easy cases.

  return false;
}
