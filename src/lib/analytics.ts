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
