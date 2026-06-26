/**
 * Head-term corridors — high-demand routes deliberately kept and re-submitted.
 *
 * These earn ~zero traffic in analytics RIGHT NOW, but that reflects Google
 * suppression (post the 2026-03-20 algorithmic scaled-content reassessment),
 * NOT low demand — they are the highest-intent diaspora corridors on the site
 * (featured on the homepage rail and as the canonical example on /for-ai).
 *
 * They are therefore exempt from the zero-traffic deletion sweep AND added to
 * the sitemap so Google can rediscover them (several were "URL is unknown to
 * Google" — a discovery failure caused by the impression-gated sitemap they
 * couldn't enter without first earning impressions). Breaking that chicken-and-
 * egg loop is the point of this set.
 */
export const HEAD_CORRIDOR_SLUGS = new Set<string>([
  "usa-to-india",
  "usa-to-philippines",
  "usa-to-pakistan",
  "usa-to-mexico",
  "usa-to-uk",
  "usa-to-canada",
  "uk-to-india",
  "uk-to-pakistan",
  "uk-to-nigeria",
  "uk-to-philippines",
  "uae-to-india",
  "uae-to-pakistan",
  "uae-to-philippines",
  "uae-to-bangladesh",
  "saudi-arabia-to-india",
  "saudi-arabia-to-philippines",
  "saudi-arabia-to-pakistan",
  "canada-to-india",
  "india-to-uk",
  "india-to-usa",
  "india-to-canada",
  "australia-to-india",
  "singapore-to-india",
  "singapore-to-philippines",
  "uk-to-bangladesh",
  "usa-to-bangladesh",
]);
