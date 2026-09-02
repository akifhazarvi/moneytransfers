/**
 * Event taxonomy for SendMoneyCompare.
 *
 * Dual-sink: every event fires to (1) GA4 via gtag for funnels/audiences,
 * and (2) Vercel Analytics via `track()` for the ops dashboard.
 *
 * Conventions:
 * - Event names are snake_case, lowercase, verb-noun order.
 * - Every property is lowercase snake_case.
 * - Conversion events ALWAYS include `source` (which surface drove it) so
 *   we can attribute back to: results, sticky_cta, bot, exit_intent, form,
 *   corridor_page, homepage, etc. It reaches GA4 as `cta_source` — `source` is
 *   reserved there for traffic attribution (see GA4_ATTRIBUTION_PARAMS below);
 *   Vercel Analytics still receives it as `source`.
 * - Corridor values are hyphen-joined "USD-INR" so GA4 regex filtering works.
 *
 * Respect cookie consent: analytics_storage starts "denied"; the gtag call
 * is a no-op until the user accepts cookies. Vercel Analytics is cookieless
 * and fires for all users — so dual-sinked events are visible for EU/UK
 * traffic too, not just for consent-granted users.
 */

import { track as vercelTrack } from "@vercel/analytics";

type EventParams = Record<string, string | number | boolean | undefined>;

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
function forGa4(params?: EventParams): EventParams | undefined {
  if (!params) return params;
  let safe: EventParams | undefined;
  for (const key of Object.keys(params)) {
    if (!GA4_ATTRIBUTION_PARAMS.has(key)) continue;
    safe ??= { ...params };
    safe[`cta_${key}`] = safe[key];
    delete safe[key];
  }
  return safe ?? params;
}

function gtagEvent(name: string, params?: EventParams) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, forGa4(params));
  }
}

/**
 * Fire an event to BOTH GA4 and Vercel Analytics. This is the default for
 * every meaningful interaction so the two tools stay at parity.
 *
 * The ONLY events kept GA4-only (via gtagEvent) are the genuinely high-volume
 * ones — scroll_depth and internal_link_click — where mirroring to Vercel
 * adds cost/noise on the Pro event quota without analytical value. Everything
 * a person deliberately does goes dual.
 */
function dual(name: string, params?: EventParams) {
  gtagEvent(name, params);
  // Vercel Analytics doesn't accept undefined values — strip them.
  const cleaned: Record<string, string | number | boolean | null> = {};
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) cleaned[k] = v;
    }
  }
  try {
    vercelTrack(name, cleaned);
  } catch {
    // vercelTrack can throw if called SSR — safe to swallow
  }
}

const corridor = (from: string, to: string) => `${from}-${to}`.toUpperCase();

// ═════════════════════════════════════════════════════════════════
// STEP 1 — Comparison funnel (acquisition → intent → affiliate click)
// ═════════════════════════════════════════════════════════════════

/** User submits the comparison widget */
export function trackCompareSearch(from: string, to: string, amount: number) {
  dual("compare_search", { from, to, amount, corridor: corridor(from, to) });
}

/** Quote results rendered with N providers */
export function trackQuotesViewed(from: string, to: string, providerCount: number) {
  dual("quotes_viewed", { from, to, provider_count: providerCount, corridor: corridor(from, to) });
}

/** User expands a provider card */
export function trackProviderExpanded(provider: string, rank: number, corridorStr: string) {
  dual("provider_expanded", { provider, rank, corridor: corridorStr });
}

/** User clicks "Send with [Provider]" — PRIMARY CONVERSION
 *
 * Fires the client-side engagement event. The /go/ redirect that follows also
 * fires `provider_clicked_server` (different event name) so the two sinks
 * don't conflate. Dedup unique-session counts in GA4 Explorations / BigQuery,
 * not at emit time — keeps the raw signal recoverable. */
export function trackProviderClicked(provider: string, corridorStr: string, rank: number, source?: string) {
  dual("provider_clicked", { provider, corridor: corridorStr, rank, source: source || "results" });
}

/** User clicks "Full review" on a provider */
export function trackReviewClicked(provider: string, corridorStr: string) {
  dual("review_clicked", { provider, corridor: corridorStr });
}

/** User applies a filter */
export function trackFilterApplied(filterType: string, value: string) {
  dual("filter_applied", { filter_type: filterType, value });
}

/** User changes the sort order */
export function trackSortChanged(sortBy: string) {
  dual("sort_changed", { sort_by: sortBy });
}

/** User selects two providers for side-by-side compare */
export function trackCompareSelected(providerA: string, providerB: string, corridorStr: string) {
  dual("compare_selected", { provider_a: providerA, provider_b: providerB, corridor: corridorStr });
}

/** User swaps from/to currencies */
export function trackCurrencySwapped(from: string, to: string) {
  dual("currency_swapped", { from, to });
}

// ═════════════════════════════════════════════════════════════════
// STEP 2 — Sticky CTA (corridor page scroll engagement)
// ═════════════════════════════════════════════════════════════════

/** Sticky best-provider bar became visible (user scrolled past threshold) */
export function trackStickyCtaShown(provider: string, corridorStr: string) {
  dual("sticky_cta_shown", { provider, corridor: corridorStr });
}

/** User clicked the sticky CTA (conversion via sticky surface) */
export function trackStickyCtaClicked(provider: string, corridorStr: string, savingsAmount?: number) {
  dual("sticky_cta_clicked", {
    provider,
    corridor: corridorStr,
    source: "sticky_cta",
    savings_amount: savingsAmount,
  });
}

/** User dismissed the sticky bar */
export function trackStickyCtaDismissed(corridorStr: string) {
  dual("sticky_cta_dismissed", { corridor: corridorStr });
}

// ═════════════════════════════════════════════════════════════════
// Content engagement (informational — GA4 only)
// ═════════════════════════════════════════════════════════════════

/** User visits a guide/review/news article */
export function trackContentView(contentType: string, slug: string) {
  dual("content_view", { content_type: contentType, slug });
}

/** User scrolls past depth threshold on content */
export function trackScrollDepth(slug: string, depth: number) {
  gtagEvent("scroll_depth", { slug, depth_percent: depth });
}

/** User clicks an internal cross-link */
export function trackInternalLinkClick(from: string, to: string) {
  gtagEvent("internal_link_click", { from_page: from, to_page: to });
}

/** User expands an FAQ accordion */
export function trackFAQExpanded(question: string, page: string) {
  dual("faq_expanded", { question: question.slice(0, 100), page });
}

/** User copies IBAN/SWIFT reference data */
export function trackDataCopied(dataType: string, country: string) {
  dual("data_copied", { data_type: dataType, country });
}

/** Affiliate redirect fired (server-side beacon or client) */
export function trackAffiliateRedirect(provider: string, from?: string, to?: string, amount?: string) {
  dual("affiliate_redirect", { provider, from: from || "", to: to || "", amount: amount || "" });
}

/** User clicks CTA on a head-to-head comparison page */
export function trackComparisonCTA(providerA: string, providerB: string, action: string) {
  dual("comparison_cta", { provider_a: providerA, provider_b: providerB, action });
}

/** User clicks the sidebar "Compare Rates →" CTA on a guide page */
export function trackGuideSidebarCTA(slug: string) {
  dual("guide_sidebar_cta_clicked", { slug, source: "guide_sidebar" });
}

/** User interacts with the freelancer-cost calculator (debounced once per settle) */
export function trackFreelancerCalcUsed(corridor: string, teamSize: number, avgUsd: number, annualLoss: number) {
  dual("freelancer_calc_used", { corridor, team_size: teamSize, avg_usd: avgUsd, annual_loss: Math.round(annualLoss), source: "freelancer_guide" });
}

/** User clicks the "Compare live rates" CTA from the freelancer calculator */
export function trackFreelancerCalcCTA(corridor: string, annualLoss: number) {
  dual("freelancer_calc_cta_clicked", { corridor, annual_loss: Math.round(annualLoss), source: "freelancer_calc" });
}

/** User clicks "Send with [Provider]" from the converter page */
export function trackConverterProviderClicked(provider: string, corridor: string, rank: number) {
  dual("provider_clicked", { provider, corridor, rank, source: "converter" });
}

/** User clicks "Compare providers" CTA row in the converter */
export function trackConverterCTAClicked(corridor: string, amount: number) {
  dual("converter_cta_clicked", { corridor, amount, source: "converter" });
}

/** User clicks "All 50+ providers →" link in the InlineProviderQuotes widget */
export function trackSeeAllProviders(slug: string, corridor: string) {
  dual("see_all_providers_clicked", { slug, corridor, source: "inline_quotes_footer" });
}

/** User clicks "All 50+ providers →" header link in the InlineProviderQuotes widget */
export function trackSeeAllProvidersHeader(slug: string, corridor: string) {
  dual("see_all_providers_clicked", { slug, corridor, source: "inline_quotes_header" });
}

// ═════════════════════════════════════════════════════════════════
// Free tools (/tools/*) — calculators. `tool` names which calculator.
// ═════════════════════════════════════════════════════════════════

/** User interacts with a tool calculator (changes an input). */
export function trackToolUsed(tool: string, params?: EventParams) {
  dual("tool_used", { tool, ...params });
}

/** User clicks the tool's CTA into a live comparison. */
export function trackToolCTA(tool: string, params?: EventParams) {
  dual("tool_cta_clicked", { tool, ...params });
}

// ═════════════════════════════════════════════════════════════════
// WhatsApp channel — follow/subscribe funnel. `source` names the surface
// the click came from (float button, footer, inline CTA) so we can see
// which placement drives the most channel follows.
// ═════════════════════════════════════════════════════════════════

/**
 * User clicks through to follow the WhatsApp channel. `method` records how they
 * were sent there, because the two paths convert very differently: on a phone
 * the link opens the WhatsApp app on the channel's Follow button, whereas on
 * desktop whatsapp.com/channel/* is largely a "Download WhatsApp" page, so
 * desktop visitors get a QR to scan instead.
 */
export function trackWhatsappFollow(
  source: string,
  method: "direct" | "qr_scan_prompt" | "desktop_web" = "direct",
) {
  dual("whatsapp_follow_clicked", { source, method });
}

/** Desktop visitor was shown the scan-to-follow QR instead of a dead link. */
export function trackWhatsappQrShown(source: string) {
  dual("whatsapp_qr_shown", { source });
}

/**
 * A WhatsApp CTA actually entered the viewport. Without this the follow rate
 * is unknowable — 4 follows out of an unknown denominator tells us nothing
 * about whether the problem is reach or copy. Fires at most once per surface
 * per page view.
 */
export function trackWhatsappImpression(source: string) {
  dual("whatsapp_cta_viewed", { source });
}

/** User dismissed the floating follow pill. High dismiss rate = wrong moment. */
export function trackWhatsappDismiss(source: string) {
  dual("whatsapp_cta_dismissed", { source });
}
