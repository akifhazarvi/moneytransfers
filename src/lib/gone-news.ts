/**
 * Retired news items — HTTP 410 Gone.
 *
 * 410 (not 404, not 301): same rationale as gone-companies.ts. A retired story
 * has no equivalent to redirect to, and a crawler should drop it rather than
 * keep retrying.
 *
 * Retiring an item means removing it from `newsItems` in src/data/news.ts as
 * well, which takes it out of the /news hub, both sitemaps and llms.txt. Any
 * route list that names it explicitly (reviewed-indexable-routes.ts) must drop
 * it too, or check:indexing fails on a submitted 410.
 *
 * western-union-ceo-digital-competition-2026 (2026-10-05): presented the
 * Wolfe Research investor conference as March 2026 news, but the coverage it
 * cited is from March 2023 (Payments Dive, 2023-03-20), and neither quote it
 * attributed to Devin McGranahan appears there. Its source URL was a 404.
 * Retired rather than rewritten: an accurate version is a 2023 story.
 */
export const GONE_NEWS_SLUGS = new Set<string>([
  "western-union-ceo-digital-competition-2026",
]);
