/**
 * Lightweight GA4 custom event helper.
 * All events respect the cookie consent gate already in place
 * (analytics_storage starts "denied" and only flips to "granted" on accept).
 */

type EventParams = Record<string, string | number | boolean | undefined>;

export function gtagEvent(name: string, params?: EventParams) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

// ── Funnel events ──────────────────────────────────────────────

/** Step 1 — User submits the comparison widget on the homepage */
export function trackCompareSearch(from: string, to: string, amount: number) {
  gtagEvent("compare_search", { from, to, amount });
}

/** Step 2 — Quotes results page loaded with N providers */
export function trackQuotesViewed(from: string, to: string, providerCount: number) {
  gtagEvent("quotes_viewed", { from, to, provider_count: providerCount });
}

/** Step 3 — User expands a provider card to see details */
export function trackProviderExpanded(provider: string, rank: number, corridor: string) {
  gtagEvent("provider_expanded", { provider, rank, corridor });
}

/** Step 4 — User clicks "Send with [Provider]" (affiliate CTA) */
export function trackProviderClicked(provider: string, corridor: string, rank: number, source?: string) {
  gtagEvent("provider_clicked", { provider, corridor, rank, source: source || "results" });
}

/** User clicks "Full review" link on a provider card */
export function trackReviewClicked(provider: string, corridor: string) {
  gtagEvent("review_clicked", { provider, corridor });
}

/** User applies a filter */
export function trackFilterApplied(filterType: string, value: string) {
  gtagEvent("filter_applied", { filter_type: filterType, value });
}

/** User changes sort tab */
export function trackSortChanged(sortBy: string) {
  gtagEvent("sort_changed", { sort_by: sortBy });
}

/** User selects providers for side-by-side comparison */
export function trackCompareSelected(providerA: string, providerB: string, corridor: string) {
  gtagEvent("compare_selected", { provider_a: providerA, provider_b: providerB, corridor });
}

/** User swaps currencies */
export function trackCurrencySwapped(from: string, to: string) {
  gtagEvent("currency_swapped", { from, to });
}

// ── Content engagement events ─────────────────────────────────

/** User visits a guide/review/news article */
export function trackContentView(contentType: string, slug: string) {
  gtagEvent("content_view", { content_type: contentType, slug });
}

/** User scrolls past 50% of a page (meaningful read) */
export function trackScrollDepth(slug: string, depth: number) {
  gtagEvent("scroll_depth", { slug, depth_percent: depth });
}

/** User clicks an internal link within content */
export function trackInternalLinkClick(from: string, to: string) {
  gtagEvent("internal_link_click", { from_page: from, to_page: to });
}

// ── Conversion events ─────────────────────────────────────────

/** Affiliate redirect — fired server-side or via beacon */
export function trackAffiliateRedirect(provider: string, from?: string, to?: string, amount?: string) {
  gtagEvent("affiliate_redirect", { provider, from: from || "", to: to || "", amount: amount || "" });
}

/** Newsletter signup */
export function trackNewsletterSignup(source: string) {
  gtagEvent("newsletter_signup", { source });
}

/** User clicks comparison CTA on a vs page */
export function trackComparisonCTA(providerA: string, providerB: string, action: string) {
  gtagEvent("comparison_cta", { provider_a: providerA, provider_b: providerB, action });
}

/** User copies IBAN/SWIFT data from reference pages */
export function trackDataCopied(dataType: string, country: string) {
  gtagEvent("data_copied", { data_type: dataType, country });
}

// ── FAQ engagement ────────────────────────────────────────────

/** User expands an FAQ item */
export function trackFAQExpanded(question: string, page: string) {
  gtagEvent("faq_expanded", { question: question.slice(0, 100), page });
}
