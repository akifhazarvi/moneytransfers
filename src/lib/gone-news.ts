/**
 * Retired news items — HTTP 410 Gone, or 301 where an equivalent item exists.
 *
 * 410 (not 404, not 301): same rationale as gone-companies.ts. A retired story
 * has no equivalent to redirect to, and a crawler should drop it rather than
 * keep retrying. 301 beats 410 whenever an equivalent page exists, so a
 * duplicate consolidates into its surviving twin (NEWS_REDIRECTS).
 *
 * Retiring an item means removing it from `newsItems` in src/data/news.ts as
 * well, which takes it out of the /news hub, both sitemaps and llms.txt. Any
 * route list that names it explicitly (reviewed-indexable-routes.ts,
 * sitemap-allowlists.ts, the corridor and rate pages' related-news maps) must
 * drop it too, or check:indexing / check:links fail.
 *
 * Every item below was retired after a 2026-10-05 audit that checked each news
 * item's quotes, dates and figures against its sources.
 *
 * western-union-ceo-digital-competition-2026: presented the March 2023 Wolfe
 * Research conference as March 2026 news; neither quote attributed to Devin
 * McGranahan appears in the coverage it cited, and its source URL was a 404.
 *
 * april-2026-central-bank-calendar: the April 2025 calendar re-dated — none of
 * its four dates (RBA, Fed minutes, BoC, ECB) was right for 2026, and its
 * commentary had the RBA cutting when it raised.
 *
 * world-bank-remittance-costs-q1-2026: its headline 6.0% global average appears
 * in no World Bank release; dated before any Q1 2026 data could exist.
 *
 * us-remittance-tax-3-months-behavioral-shift-2026: its thesis (cash senders
 * switching fast) is contradicted by its own source ("remains 47 percent
 * cash"), it quoted MoneyGram from an article that never mentions MoneyGram,
 * and it gave Remitly's Q4 2022 customer figures as current.
 *
 * revolut-africa-14-corridors-airtel-mtn-orange-money-2026: Revolut's May 2024
 * announcement re-dated to April 2026, with an invented country list.
 *
 * global-currency-outlook-may-2026: USD/INR given as ~83.5 when it was ~95.5,
 * other emerging-market rates years stale, end-April figures labelled
 * mid-May; its corridor advice rested on those numbers.
 *
 * inr-weakest-year-send-money-india-april-2026: its premise was false — the
 * rupee was near the strong end of the month on the date given — and its
 * 9.18% fall (really ~7.7%) and foreign-buying claim (they sold $6.5bn) were
 * wrong.
 */
export const GONE_NEWS_SLUGS = new Set<string>([
  "western-union-ceo-digital-competition-2026",
  "april-2026-central-bank-calendar",
  "world-bank-remittance-costs-q1-2026",
  "us-remittance-tax-3-months-behavioral-shift-2026",
  "revolut-africa-14-corridors-airtel-mtn-orange-money-2026",
  "global-currency-outlook-may-2026",
  "inr-weakest-year-send-money-india-april-2026",
]);

/**
 * Duplicates consolidated into a surviving item (301).
 *
 * eu-instant-payments-mandate-2026 covered the same regulation as
 * eu-instant-payments-mandatory-2026 but presented the euro-area 2025
 * deadlines as new in 2026 and called instant transfers free; the surviving
 * item's timeline matches the ECB.
 */
export const NEWS_REDIRECTS = new Map<string, string>([
  ["eu-instant-payments-mandate-2026", "eu-instant-payments-mandatory-2026"],
]);
