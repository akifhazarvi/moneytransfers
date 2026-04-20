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

/** User clicks "Send with [Provider]" — PRIMARY CONVERSION */
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
// STEP 3 — Bot widget (chat assistant engagement → alert/digest)
// ═════════════════════════════════════════════════════════════════

/** Page-aware preview teaser card appeared */
export function trackBotPreviewShown(pageType: string, corridorStr?: string) {
  gtagEvent("bot_preview_shown", { page_type: pageType, corridor: corridorStr });
}

/** User clicked the X on the preview (dismissed without opening) */
export function trackBotPreviewDismissed(pageType: string) {
  gtagEvent("bot_preview_dismissed", { page_type: pageType });
}

/** User clicked the preview card to open chat */
export function trackBotPreviewClicked(pageType: string, corridorStr?: string) {
  gtagEvent("bot_preview_clicked", { page_type: pageType, corridor: corridorStr });
}

/** Chat widget opened (via preview click OR direct trigger button click) */
export function trackBotOpened(pageType: string, source: "preview" | "trigger", corridorStr?: string) {
  dual("bot_opened", { page_type: pageType, source, corridor: corridorStr });
}

/** Chat widget closed */
export function trackBotClosed(pageType: string) {
  gtagEvent("bot_closed", { page_type: pageType });
}

/** User picked one of the quick-reply actions inside chat */
export function trackBotActionSelected(action: "alert" | "digest" | "question", pageType: string) {
  gtagEvent("bot_action_selected", { action, page_type: pageType });
}

/** User submitted a rate alert from the bot — CONVERSION */
export function trackBotRateAlertSubmitted(corridorStr: string, hasTargetRate: boolean) {
  dual("bot_rate_alert_submitted", {
    corridor: corridorStr,
    has_target_rate: hasTargetRate,
    source: "bot_widget",
  });
}

/** User subscribed to weekly digest from the bot — CONVERSION */
export function trackBotDigestSubmitted(corridorStr: string) {
  dual("bot_digest_submitted", { corridor: corridorStr, source: "bot_widget" });
}

// ═════════════════════════════════════════════════════════════════
// STEP 4 — Exit-intent modal (last-chance email capture)
// ═════════════════════════════════════════════════════════════════

/** Modal appeared (mouse-leave triggered) */
export function trackExitIntentShown(corridorStr: string, pageType: string) {
  gtagEvent("exit_intent_shown", { corridor: corridorStr, page_type: pageType });
}

/** User closed the modal without signing up */
export function trackExitIntentDismissed(pageType: string) {
  gtagEvent("exit_intent_dismissed", { page_type: pageType });
}

/** User submitted email in the modal — CONVERSION */
export function trackExitIntentConverted(corridorStr: string, pageType: string) {
  dual("exit_intent_converted", {
    corridor: corridorStr,
    page_type: pageType,
    source: "exit_intent",
  });
}

// ═════════════════════════════════════════════════════════════════
// STEP 5 — Email capture (non-bot, non-exit-intent surfaces)
// ═════════════════════════════════════════════════════════════════

/** Newsletter signup from any page-embedded form */
export function trackNewsletterSignup(source: string) {
  dual("newsletter_signup", { source });
}

/** Rate alert set from a page-embedded RateAlertForm — CONVERSION */
export function trackRateAlertSet(corridorStr: string, source: string, hasTargetRate: boolean) {
  dual("rate_alert_set", {
    corridor: corridorStr,
    source,
    has_target_rate: hasTargetRate,
  });
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
