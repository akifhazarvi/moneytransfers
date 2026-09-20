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
  // bahrain removed 2026-06-05: 3 GSC impr / 0 clicks in 90d, not a Bing
  // winner — noindexed to concentrate crawl budget (Google: crawled-not-indexed).
  "united-arab-emirates", "saudi-arabia", "qatar", "kuwait",
  "jordan", "egypt", "israel", "brazil", "ukraine", "georgia",
  // Added 2026-05-20: new GSC-validated sitemap entries that also need
  // to be indexable (otherwise they get submitted but blocked).
  "andorra", "costa-rica", "el-salvador", "lithuania", "monaco", "slovakia",
]);

/** SWIFT country pages that should NOT be noindexed (broader than sitemap). */
export const INDEXED_SWIFT_SLUGS = new Set<string>([
  // 2026-06-05: removed 8 SWIFT slugs (france, germany, nepal, colombia, peru,
  // united-arab-emirates, china, bangladesh) — each <10 GSC impr / 0 clicks in
  // 90d and not a Bing winner (not in SITEMAP_SWIFT_SLUGS). Noindexed to
  // concentrate crawl/index budget on pages Google actually serves.
  // NOTE: sri-lanka KEPT — 140 Bing impr/1 click (sitemap winner), Google-dead
  // but valuable on Bing; noindex would kill it everywhere.
  "united-kingdom", "united-states", "india", "pakistan",
  "netherlands", "canada", "australia",
  "hong-kong", "singapore", "south-africa", "ireland", "new-zealand",
  "philippines", "nigeria", "mexico",
  "japan", "south-korea", "thailand", "indonesia", "malaysia",
  "brazil", "kenya", "ghana", "sri-lanka",
  "turkiye", "egypt", "morocco",
  // GSC-validated for sitemap inclusion too:
  "georgia",
  // 2026-06-22: re-added united-arab-emirates — 49 Bing impr/1 click in the
  // Jun 23 BWT Page Traffic export. Removed Jun 5 on GSC-only signal, but it's
  // a live Bing earner; noindexing it would kill it on the channel that
  // actually ranks the site (same rationale as sri-lanka above).
  "united-arab-emirates",
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

/**
 * 2026-09-20 — INDEXABLE SURFACE, narrowed to editorial + hubs.
 *
 * Owner decision after the September audit: the index should contain the
 * homepage, the guides, the news desk and the pages the navigation actually
 * points at. Everything generated per-slug from a template stays live and
 * crawlable for readers and AI assistants, but stops asking to be indexed.
 *
 * The reasoning is that a templated child page cannot carry the site's
 * argument. Measured across the family, a corridor page ran 4,700 words with
 * 43-107 found nowhere else; /companies pages without an editorial review sat
 * at 144. Those pages are useful to somebody who lands on them and weak as
 * index candidates, and the index-quality average is what the March 2026
 * reassessment moved against.
 *
 * COST, recorded because it is real and was accepted: this removes the
 * long-tail entry points that earn on Bing and that AI assistants cite most
 * (corridor pages were the highest-citation surface at 76%). Reversing it is
 * a one-line change to KEEP_INDEXABLE below plus the sitemap blocks.
 *
 * Kept indexable:
 *   ""                      homepage
 *   guides, news            editorial, written per page
 *   the six nav hubs        send-money, compare, companies, exchange-rates,
 *                           business, guides — hub pages only, not children
 *   static/legal/data pages about, methodology, editorial-policy, research, …
 */
import indexableRoutes from "@/data/scraped/indexable-routes.json";

/**
 * Routes measured under the duplication threshold, plus the exempt families.
 * Generated by scripts/build-indexable-routes.ts — see that file for the
 * policy and for why guides and research are exempt from the measure.
 */
const INDEXABLE = new Set<string>(indexableRoutes.routes as string[]);

/**
 * True when this path is an index candidate.
 *
 * Membership is measured, not asserted: a page is in because its duplicate
 * share came in under the threshold on the last build, or because it is in an
 * exempt family. A route absent from the generated list — including any route
 * added since the list was last built — is treated as NOT indexable, which is
 * the safe direction: a new page joins the index on the next regeneration
 * rather than by default.
 */
const ALWAYS_INDEXABLE_TOP = new Set<string>([
  "", "guides", "research", "news",
  "sendscore", "provider-consistency", "remittance-cost-index",
  "transfer-cost-by-amount", "tools",
  "send-money", "compare", "companies", "exchange-rates", "business",
  "about", "contact", "methodology", "how-we-review", "editorial-policy",
  "privacy-policy", "terms", "cookies", "disclaimer", "corrections", "for-ai",
  "currency-converter",
]);
const HUB_ONLY = new Set<string>([
  "send-money", "compare", "companies", "exchange-rates", "business",
]);

/**
 * The exempt families, evaluated at RUNTIME rather than read from the
 * generated list.
 *
 * This matters for pages that did not exist when the list was last built. A
 * guide merged after the last regeneration is absent from
 * indexable-routes.json, and without this check it would publish as noindex
 * and stay that way until someone re-ran the generator — the opposite of what
 * exempting guides was for. Mirrors alwaysIndexable() in
 * scripts/build-indexable-routes.ts; change both together.
 */
function alwaysIndexable(pathname: string): boolean {
  const parts = pathname.replace(/^\/+/, "").replace(/\/$/, "").split("/").filter(Boolean);
  const top = parts[0] ?? "";
  if (!ALWAYS_INDEXABLE_TOP.has(top)) return false;
  if (parts.length > 1 && HUB_ONLY.has(top)) return false;
  return true;
}

export function routeIsIndexable(pathname: string): boolean {
  const clean = "/" + pathname.replace(/^\/+/, "").replace(/\/$/, "");
  const path = clean === "/" ? "/" : clean;
  return alwaysIndexable(path) || INDEXABLE.has(path);
}

/** Metadata `robots` value for a path: undefined when indexable. */
export function robotsFor(pathname: string): { index: false; follow: true } | undefined {
  return routeIsIndexable(pathname) ? undefined : { index: false, follow: true };
}

export function shouldNoindexPath(pathname: string): boolean {
  // Policy first: anything outside the indexable surface gets the header.
  if (!routeIsIndexable(pathname)) return true;

  const parts = pathname.replace(/^\/+/, "").split("/");
  const top = parts[0];
  if (!top) return false;

  // Currency converter: RESTORED Jun 22 2026 after the Bing/AI export showed
  // 1,410 Bing impr + 1,389 AI citations landing on it post-retirement. Now
  // promoted + indexed again, so no noindex rule here.

  // Crypto cash-out cluster — noindexed 2026-09-01 (thin + zero demand).
  // Mirrors the page metadata so crawlers get the signal in the header without
  // rendering the HTML. See src/app/[locale]/cash-out/page.tsx for the data.
  if (top === "cash-out") return true;

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
