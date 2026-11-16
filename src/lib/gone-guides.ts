/**
 * Guides merged into a surviving guide — HTTP 301 to the survivor (rule 15:
 * one hop, same intent). src/lib/retired-urls.ts answers with it in
 * middleware, and scripts/check-redirects.ts proves each target renders.
 *
 * Merge a guide here only when two guides answer the same query and search
 * engines split it between them. Retiring one means removing its entry from
 * the guide data (src/data/blog-*.ts) and pointing every relatedSlugs entry
 * and body link at the survivor; the build regenerates both sitemaps and
 * google-eligible-routes.json without it.
 */
export const GUIDE_REDIRECTS: ReadonlyMap<string, string> = new Map<string, string>([
  // 2026-11-16: both answered "how to avoid wire transfer scams" and Bing
  // showed them in turn (BWT, Oct 16 → Nov 13). The survivor held 91 clicks
  // over 536 queries since July, this one 4 over 48. Its scam types, warning
  // signs and provider checks were merged into the survivor.
  ["how-to-avoid-wire-transfer-scams", "are-wire-transfers-safe"],
]);
