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
 *   corridor_page, homepage, etc.
 * - Corridor values are hyphen-joined "USD-INR" so GA4 regex filtering works.
 *
 * Respect cookie consent: analytics_storage starts "denied"; the gtag call
 * is a no-op until the user accepts cookies. Vercel Analytics is cookieless
 * and fires for all users — so dual-sinked events are visible for EU/UK
 * traffic too, not just for consent-granted users.
 */

import { track as vercelTrack } from "@vercel/analytics";

type EventParams = Record<string, string | number | boolean | undefined>;

function gtagEvent(name: string, params?: EventParams) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

/**
 * Fire an event to BOTH GA4 and Vercel Analytics.
 * Use for: primary conversion events + high-signal funnel events.
 * Avoid: very noisy events like scroll_depth (GA4 only).
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
  gtagEvent("review_clicked", { provider, corridor: corridorStr });
}

/** User applies a filter */
export function trackFilterApplied(filterType: string, value: string) {
  gtagEvent("filter_applied", { filter_type: filterType, value });
}

/** User changes the sort order */
export function trackSortChanged(sortBy: string) {
  gtagEvent("sort_changed", { sort_by: sortBy });
}

/** User selects two providers for side-by-side compare */
export function trackCompareSelected(providerA: string, providerB: string, corridorStr: string) {
  gtagEvent("compare_selected", { provider_a: providerA, provider_b: providerB, corridor: corridorStr });
}

/** User swaps from/to currencies */
export function trackCurrencySwapped(from: string, to: string) {
  gtagEvent("currency_swapped", { from, to });
}

// ═════════════════════════════════════════════════════════════════
// STEP 2 — Sticky CTA (corridor page scroll engagement)
// ═════════════════════════════════════════════════════════════════

/** Sticky best-provider bar became visible (user scrolled past threshold) */
export function trackStickyCtaShown(provider: string, corridorStr: string) {
  gtagEvent("sticky_cta_shown", { provider, corridor: corridorStr });
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
  gtagEvent("sticky_cta_dismissed", { corridor: corridorStr });
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
  gtagEvent("faq_expanded", { question: question.slice(0, 100), page });
}

/** User copies IBAN/SWIFT reference data */
export function trackDataCopied(dataType: string, country: string) {
  gtagEvent("data_copied", { data_type: dataType, country });
}

/** Affiliate redirect fired (server-side beacon or client) */
export function trackAffiliateRedirect(provider: string, from?: string, to?: string, amount?: string) {
  dual("affiliate_redirect", { provider, from: from || "", to: to || "", amount: amount || "" });
}

/** User clicks CTA on a head-to-head comparison page */
export function trackComparisonCTA(providerA: string, providerB: string, action: string) {
  gtagEvent("comparison_cta", { provider_a: providerA, provider_b: providerB, action });
}

/** User clicks the sidebar "Compare Rates →" CTA on a guide page */
export function trackGuideSidebarCTA(slug: string) {
  dual("guide_sidebar_cta_clicked", { slug, source: "guide_sidebar" });
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
