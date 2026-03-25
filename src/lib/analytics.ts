/**
 * GA4 event tracking for SendMoneyCompare.
 *
 * CONVERSION FUNNEL (on-site, tracked end-to-end):
 *   1. send_money_conversion  — User initiates comparison (enters amount, currencies)
 *   2. quote_confirmed        — User views quotes from providers
 *   3. recipient_selected     — User picks a provider (expands card / clicks review)
 *   4. transaction_summary    — User sees final comparison before redirect
 *   5. transaction_created    — User clicks affiliate CTA (redirect to provider)
 *   6. transaction_completed  — Provider confirms conversion (future: postback)
 *
 * 0-DAY CONVERSION:
 *   - mt_profile_created      — First-time visitor completes full funnel in one session
 *   - transactions_created    — Total affiliate redirects in a session
 *
 * ACCOUNT TYPES: personal | business
 *   Tracked via account_type param on funnel events.
 *   Determined by page context (business/* pages = business, everything else = personal).
 *
 * All events respect cookie consent (analytics_storage starts "denied").
 */

type EventParams = Record<string, string | number | boolean | undefined>;

export function gtagEvent(name: string, params?: EventParams) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

// ── Core Conversion Funnel ────────────────────────────────────

/** Step 1 — User initiates a money transfer comparison */
export function trackSendMoneyConversion(from: string, to: string, amount: number, accountType: string = "personal") {
  gtagEvent("send_money_conversion", { from, to, amount, account_type: accountType });
}

/** Step 2 — Quotes loaded and displayed to user */
export function trackQuoteConfirmed(from: string, to: string, providerCount: number, accountType: string = "personal") {
  gtagEvent("quote_confirmed", { from, to, provider_count: providerCount, account_type: accountType });
}

/** Step 3 — User selects a provider (expands card or clicks review) */
export function trackRecipientSelected(provider: string, rank: number, corridor: string, accountType: string = "personal") {
  gtagEvent("recipient_selected", { provider, rank, corridor, account_type: accountType });
}

/** Step 4 — User views final comparison/summary before redirect */
export function trackTransactionSummary(provider: string, corridor: string, amount: number, accountType: string = "personal") {
  gtagEvent("transaction_summary", { provider, corridor, amount, account_type: accountType });
}

/** Step 5 — User clicks affiliate CTA and is redirected to provider */
export function trackTransactionCreated(provider: string, corridor: string, rank: number, source: string = "results", accountType: string = "personal") {
  gtagEvent("transaction_created", { provider, corridor, rank, source, account_type: accountType });
}

/** Step 6 — Provider confirms conversion (future: postback/webhook) */
export function trackTransactionCompleted(provider: string, corridor: string, amount: number, accountType: string = "personal") {
  gtagEvent("transaction_completed", { provider, corridor, amount, account_type: accountType });
}

// ── 0-Day Conversion Events ──────────────────────────────────

/** First-time visitor completes full funnel in a single session */
export function trackMTProfileCreated(corridor: string, provider: string, accountType: string = "personal") {
  gtagEvent("mt_profile_created", { corridor, provider, account_type: accountType, is_first_visit: true });
}

/** Total affiliate redirects tracked per session */
export function trackTransactionsCreated(count: number, session_corridors: string, accountType: string = "personal") {
  gtagEvent("transactions_created", { count, session_corridors, account_type: accountType });
}

// ── Comparison & Discovery Events ─────────────────────────────

/** User clicks "Full review" link on a provider card */
export function trackReviewClicked(provider: string, corridor: string) {
  gtagEvent("review_clicked", { provider, corridor });
}

/** User applies a filter (speed, fee, rating, deals) */
export function trackFilterApplied(filterType: string, value: string) {
  gtagEvent("filter_applied", { filter_type: filterType, value });
}

/** User changes sort order */
export function trackSortChanged(sortBy: string) {
  gtagEvent("sort_changed", { sort_by: sortBy });
}

/** User selects 2 providers for side-by-side comparison */
export function trackCompareSelected(providerA: string, providerB: string, corridor: string) {
  gtagEvent("compare_selected", { provider_a: providerA, provider_b: providerB, corridor });
}

/** User swaps from/to currencies */
export function trackCurrencySwapped(from: string, to: string) {
  gtagEvent("currency_swapped", { from, to });
}

// ── Content Engagement Events ─────────────────────────────────

/** Page load on guide/review/news/comparison */
export function trackContentView(contentType: string, slug: string) {
  gtagEvent("content_view", { content_type: contentType, slug });
}

/** Scroll depth tracking (25%, 50%, 75%, 100%) */
export function trackScrollDepth(slug: string, depth: number) {
  gtagEvent("scroll_depth", { slug, depth_percent: depth });
}

/** Internal link click within content */
export function trackInternalLinkClick(from: string, to: string) {
  gtagEvent("internal_link_click", { from_page: from, to_page: to });
}

// ── Conversion & Lead Gen Events ──────────────────────────────

/** Affiliate redirect via /go/ or /out/ */
export function trackAffiliateRedirect(provider: string, from?: string, to?: string, amount?: string) {
  gtagEvent("affiliate_redirect", { provider, from: from || "", to: to || "", amount: amount || "" });
}

/** Newsletter signup */
export function trackNewsletterSignup(source: string) {
  gtagEvent("newsletter_signup", { source });
}

/** CTA click on comparison page */
export function trackComparisonCTA(providerA: string, providerB: string, action: string) {
  gtagEvent("comparison_cta", { provider_a: providerA, provider_b: providerB, action });
}

/** User copies IBAN/SWIFT data */
export function trackDataCopied(dataType: string, country: string) {
  gtagEvent("data_copied", { data_type: dataType, country });
}

/** FAQ accordion expanded */
export function trackFAQExpanded(question: string, page: string) {
  gtagEvent("faq_expanded", { question: question.slice(0, 100), page });
}

// ── Legacy aliases (backward compat with existing call sites) ──

/** @deprecated Use trackSendMoneyConversion */
export function trackCompareSearch(from: string, to: string, amount: number) {
  trackSendMoneyConversion(from, to, amount);
}

/** @deprecated Use trackQuoteConfirmed */
export function trackQuotesViewed(from: string, to: string, providerCount: number) {
  trackQuoteConfirmed(from, to, providerCount);
}

/** @deprecated Use trackRecipientSelected */
export function trackProviderExpanded(provider: string, rank: number, corridor: string) {
  trackRecipientSelected(provider, rank, corridor);
}

/** @deprecated Use trackTransactionCreated */
export function trackProviderClicked(provider: string, corridor: string, rank: number, source?: string) {
  trackTransactionCreated(provider, corridor, rank, source || "results");
}
