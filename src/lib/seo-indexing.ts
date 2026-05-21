/**
 * Single source of truth for the "don't noindex this" allowlists.
 *
 * NOTE — these intentionally diverge from src/lib/sitemap-allowlists.ts:
 *
 * - sitemap-allowlists are the strict "we actively bet on these to rank"
 *   set (≥10 GSC impressions in 90d). They drive which URLs are submitted
 *   in sitemap.xml.
 *
 * - The lists below are the looser "don't actively prune" set. A page can
 *   be off the sitemap but still indexable — staying out of sitemap means
 *   "we don't claim this is a recommended set," noindex means "actively
 *   take this out of Google's index." The May 2026 deindex collapse was
 *   caused in part by bulk-noindexing thin pages; we don't want to repeat
 *   that signal by tying noindex to the (strict) sitemap allowlist.
 *
 * Re-export under the SITEMAP_* names so callers in page files keep working
 * after the consolidation refactor — both lists still exist, they just
 * answer different questions.
 */

import { SITEMAP_RATE_HISTORY_SLUGS } from "./sitemap-allowlists";

/** IBAN country pages that should NOT be noindexed (broader than sitemap). */
export const INDEXED_IBAN_SLUGS = new Set<string>([
  "uk", "germany", "france", "netherlands", "spain",
  "italy", "denmark", "belgium", "austria", "ireland",
  "portugal", "sweden", "switzerland", "poland", "norway",
  "pakistan",
  "turkey", "romania", "czechia", "hungary", "croatia",
  "finland", "greece", "cyprus", "luxembourg",
  "united-arab-emirates", "saudi-arabia", "qatar", "kuwait", "bahrain",
  "jordan", "egypt", "israel", "brazil", "ukraine", "georgia",
  // Added 2026-05-20: new GSC-validated sitemap entries that also need
  // to be indexable (otherwise they get submitted but blocked).
  "andorra", "costa-rica", "el-salvador", "lithuania", "monaco", "slovakia",
]);

/** SWIFT country pages that should NOT be noindexed (broader than sitemap). */
export const INDEXED_SWIFT_SLUGS = new Set<string>([
  "united-kingdom", "united-states", "india", "pakistan", "germany",
  "france", "netherlands", "united-arab-emirates", "canada", "australia",
  "hong-kong", "singapore", "south-africa", "ireland", "new-zealand",
  "bangladesh", "philippines", "nigeria", "mexico", "china",
  "japan", "south-korea", "thailand", "indonesia", "malaysia",
  "brazil", "kenya", "ghana", "sri-lanka", "nepal",
  "turkiye", "egypt", "morocco", "colombia", "peru",
  // GSC-validated for sitemap inclusion too:
  "georgia",
]);

/**
 * Rate history pages: noindex set IS the sitemap set (these pages are
 * truly thin without strong signal — 167 of 179 history pages have 0-9
 * impressions at position 65-80 and burn crawl budget).
 */
export const INDEXED_HISTORY_SLUGS = SITEMAP_RATE_HISTORY_SLUGS;

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

  if (top === "iban" && parts[1] && !INDEXED_IBAN_SLUGS.has(parts[1])) {
    return true;
  }

  if (top === "swift-codes" && parts[1] && !INDEXED_SWIFT_SLUGS.has(parts[1])) {
    return true;
  }

  if (
    top === "exchange-rates" &&
    parts[1] === "history" &&
    parts[2] &&
    !INDEXED_HISTORY_SLUGS.has(parts[2])
  ) {
    return true;
  }

  // Tier-3 / single-provider corridor pages can't be detected from the
  // pathname alone (needs scraped quote data). The corridor page metadata
  // handles those; middleware would only short-circuit the easy cases.

  return false;
}
