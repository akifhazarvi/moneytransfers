/**
 * GA4 reads these event parameters as *manual traffic-source* signals. Sending
 * one re-attributes the session to its value, so our `source` — which names the
 * on-page surface that drove an interaction — was overwriting how the visitor
 * actually arrived. A WhatsApp pill scrolling into view fired
 * `whatsapp_cta_viewed {source:"float_pill"}` and GA4 recorded a *new session*
 * from a source called "float_pill"; the Aug 2026 numbers carried 104 such
 * sessions plus "results", "home_inline", "guide_article_end" and
 * "company_review_sidebar", each one a real visitor whose true channel had been
 * erased. Rename on the way into GA4 only: Vercel Analytics has no reserved
 * names and its existing dashboards key off the original spelling.
 *
 * Shared by the browser sink (analytics.ts) and the Measurement Protocol sink
 * (ga4-server.ts), so `customEvent:cta_source` reports both. Until 2026-10-05
 * the server events (/go, /out, the review-page beacons) sent `source` raw.
 */
const GA4_ATTRIBUTION_PARAMS = new Set([
  "source",
  "medium",
  "campaign",
  "term",
  "content",
  "campaign_id",
  "source_platform",
  "creative_format",
  "marketing_tactic",
]);

/** Re-key any GA4-reserved attribution param to a `cta_`-prefixed twin. */
export function forGa4<T extends Record<string, unknown>>(params: T): T;
export function forGa4<T extends Record<string, unknown>>(params: T | undefined): T | undefined;
export function forGa4<T extends Record<string, unknown>>(params: T | undefined): T | undefined {
  if (!params) return params;
  let safe: Record<string, unknown> | undefined;
  for (const key of Object.keys(params)) {
    if (!GA4_ATTRIBUTION_PARAMS.has(key)) continue;
    safe ??= { ...params };
    safe[`cta_${key}`] = safe[key];
    delete safe[key];
  }
  return (safe as T | undefined) ?? params;
}
