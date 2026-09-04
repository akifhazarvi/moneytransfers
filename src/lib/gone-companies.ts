/**
 * Retired provider review pages — HTTP 410 Gone.
 *
 * 410 (not 404, not 301): tells a crawler the URL is intentionally retired and
 * should be dropped from the index, rather than "we lost it, keep trying" (404)
 * or "the content moved here" (301). There is no equivalent page to redirect a
 * retired provider to — the reader wanted THAT provider — so 410 is correct.
 * Same rationale and placement as gone-corridors.ts and gone-swift.ts.
 *
 * Retiring a page here means three edits must move together, or the build fails
 * on its own guards, which is the point:
 *   1. this set (middleware serves the 410),
 *   2. SITEMAP_PROVIDER_SLUGS in sitemap-allowlists.ts — a submitted URL that
 *      returns 410 is exactly the sitemap/status contradiction check:indexing
 *      exists to catch,
 *   3. companyPageRenders() in route-map.ts, so every internal-link generator
 *      stops emitting a link into it and check:links stays green.
 *
 * unplex (2026-09-04): withdrawn from all provider listings at the owner's
 * request. The affiliate link and /go/unplex are intentionally still live — the
 * decision was to stop surfacing the provider, not to break an outbound link
 * someone may already hold.
 */
export const GONE_COMPANY_SLUGS = new Set<string>(["unplex"]);
