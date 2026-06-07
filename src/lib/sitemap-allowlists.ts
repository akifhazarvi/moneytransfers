/**
 * Sitemap allowlists — gating which URLs are submitted to Google.
 *
 * 2026-05-25 RIGHT-SIZING: cut from ~254 to ~146 URLs based on cross-referencing
 * Bing Webmaster Tools Page Traffic Report against GSC 90d data. Pages with 0
 * Bing impressions AND 0 GSC impressions removed; pages earning ≥5 Bing
 * impressions added regardless of GSC visibility.
 *
 * Why Bing-gated:
 *   - Site is winning on Bing/ChatGPT/DDG/Yahoo; Google is the failing channel
 *     ([[project_google_only_underperformance_may25]]). Gating Google sitemap
 *     submission on GSC impressions creates a doom loop — pages can't be
 *     discovered if they're not on the sitemap, and Google never tries them.
 *   - Bing's view of the site (29k impr) is ~24x larger than Google's (1.2k impr)
 *     post-deindex, so Bing is the better authority on "which URLs deserve to rank".
 *
 * Safety rails applied:
 *   - All 8 deep-content corridors in src/data/corridor-deep-content.ts kept
 *     even if currently 0 traffic (recently shipped editorial work).
 *   - Head-term editorial guides kept even if currently 0 traffic (e.g.
 *     send-money-to-india-guide) — they're authoritative content; their
 *     0-impression status reflects Google's collapsed view, not page quality.
 *
 * Regenerate via: cross-reference fresh Bing CSV + GSC pull, run
 * /tmp/safer_plan.js as the template.
 *
 * Pages outside this allowlist stay live and crawlable via internal links;
 * they just aren't actively submitted. Deadweight corridors are noindex'd
 * via WAVE3_NOINDEX_SLUGS in src/lib/corridor-tiers.ts (defense in depth).
 */

export const SITEMAP_CORRIDOR_SLUGS = new Set<string>([
  // ── Deep-content corridors (corridor-deep-content.ts) — always kept ──
  "china-to-australia",
  "china-to-canada",
  "china-to-uk",
  "china-to-usa",
  "denmark-to-colombia",  // deep content + currently 0 Bing (recently shipped)
  "denmark-to-france",
  "denmark-to-malaysia",
  "ireland-to-bangladesh",
  // ── Head-term remittance corridors (always submitted) ──
  "uk-to-bangladesh",
  // ── Bing-validated (≥5 Bing impr in May 26 BWT export) ──
  "usd-to-egp",              // 30i 2c
  "usa-to-tanzania",         // 18i 0c
  "send-money-to-cameroon",  // 9i 1c
  "send-money-to-egypt",     // 9i 0c
  "bahrain-to-india",        // 5i 1c
  "send-money-to-bangladesh", // 5i 0c
  // ── Existing kept entries with prior GSC signal ──
  "australia-to-china",  // had prior signal; deep China cluster cross-link target
  "canada-to-philippines",
  "send-money-to-morocco",
  "send-money-to-spain",
]); // 19 URLs (was 65)

export const SITEMAP_GUIDE_SLUGS = new Set<string>([
  // ── Authoritative head-term guides (always submitted regardless of current impr) ──
  "best-money-transfer-apps",
  "fastest-way-to-send-money-internationally", // speed/instant cluster — Bing "best send money apps" 5751i pos3, no prior speed-angle page
  "best-money-transfer-services",
  "business-international-payments-guide",
  "iban-numbers-explained",
  "money-transfer-safety-guide",
  "multi-currency-accounts-exchange-rates",
  "swift-codes-explained",
  "us-dollar-forecast-2026",
  "pakistan-rupee-forecast-2026",
  "euro-forecast-2026",
  "send-money-to-india-guide",
  "send-money-to-pakistan-guide",
  "send-money-to-philippines-guide",
  "send-money-to-mexico-guide",
  "send-money-to-bangladesh-guide",
  "send-money-to-nigeria-guide",
  "send-money-to-south-africa-guide",
  "send-money-to-india-cash-pickup-ria",
  "send-money-uk-to-india-guide",
  "wire-transfer-guide",
  "global-remittance-trends-2026",
  // ── Bing-validated (≥5 Bing impr) ──
  "money-transfer-limits-by-provider-country", // 999i 19c
  "revolut-foreign-transaction-fees-2026",     // 615i 27c
  "revolut-us-banking-license-2026",           // 251i 6c
  "send-money-to-china-guide",                 // 185i 11c
  "how-to-send-money-abroad",                  // 83i 3c
  "wise-vs-remitly-comparison",                // 50i 3c
  "exchange-rate-markup-explained",            // 34i 4c
  "send-money-to-jamaica-guide",               // 20i 1c
  "hidden-fees-international-transfers",       // 17i 2c
  "multi-currency-account-wars-2026",          // 16i 0c
  "cheapest-way-to-send-money-internationally", // 15i 0c
  "send-money-to-ethiopia-guide",              // 14i 0c
  "send-money-to-kenya-guide",                 // 12i 0c
  "send-money-uae-to-india-guide",             // 10i 1c
  "send-money-canada-to-india-guide",          // 9i 2c
  "how-to-send-money-from-china",              // 7i 1c
  "send-money-to-sri-lanka-guide",             // 6i 0c
  "send-money-to-poland-guide",                // 6i 1c
  "send-money-uae-to-pakistan-guide",          // 5i 1c
  "xe-tax-season-cross-border-money-2026",     // 5i 0c
  "send-money-to-nepal-guide",                 // 5i 0c
]); // 42 URLs (was 49)

export const SITEMAP_IBAN_SLUGS = new Set<string>([
  // Head-term IBAN destinations (always submitted)
  "germany",
  "france",
  "spain",
  "ireland",
  "portugal",
  "netherlands",
  "belgium",
  "austria",
  "luxembourg",
  "switzerland",
  "italy",          // 723i 22c Bing
  "saudi-arabia",   // 227i 1c Bing
  "qatar",          // 101i 0c Bing
  "united-arab-emirates",
  "kuwait",         // 7i 1c Bing
  "egypt",
  "brazil",
  "pakistan",
  "turkey",
  "poland",
  "romania",
  "norway",
  "denmark",
  "sweden",
  "finland",
  "greece",
  "cyprus",
  "croatia",
  "hungary",
  "israel",
  "georgia",
]); // 31 URLs (was 37)

export const SITEMAP_COMPARISON_SLUGS = new Set<string>([
  // Editorial head-pair comparisons — always submitted
  "wise-vs-remitly",
  "wise-vs-paypal",
  "wise-vs-revolut",
  "lloyds-vs-nationwide",
  "western-union-vs-moneygram",  // canonical target; moneygram-vs-western-union (68i Bing) 301s here via middleware getCompareCanonicalSlug — submit the 200, not the redirect
  "remitly-vs-western-union",    // 10i Bing
  "paypal-vs-revolut",           // 11i Bing
  "moneygram-vs-taptap-send",
  "moneygram-vs-xoom",
  "ofx-vs-moneygram",
  "ofx-vs-xe",
  "ofx-vs-xoom",
  "paypal-vs-moneygram",
  "paypal-vs-xoom",
  "remitly-vs-moneygram",
  "remitly-vs-taptap-send",
  "western-union-vs-bank-of-america",
  "wise-vs-taptap-send",
]); // 17 URLs (was 32)

export const SITEMAP_PROVIDER_SLUGS = new Set<string>([
  // ── Original editorial provider reviews ──
  "ace-money-transfer",
  "moneygram",
  "paypal",
  "revolut",
  "xe",
  "xoom",
  // ── Added 2026-05-25 — major Bing impression earners that were missing ──
  "remitly",       // 6101i 11c Bing — biggest miss
  "taptap-send",   // 382i 5c
  "wise",          // 202i 1c
  "worldremit",    // 169i 0c
  "ofx",           // 71i 1c
  "western-union", // 22i 1c
]); // 12 URLs (was 6)

export const SITEMAP_NEWS_SLUGS = new Set<string>([
  "central-bank-super-week-march-2026",
  "china-digital-yuan-interest-bearing-cbdc",
  "embedded-finance-regulation-tightening-2026",
  "eu-instant-payments-mandate-2026",
  "revolut-files-us-bank-charter-2026",
  "stablecoins-cross-border-payments-2026",
  "us-remittance-excise-tax-takes-effect-2026",
]); // 7 URLs

// All 20 built /exchange-rates/[pair] pages. These render index:follow (en),
// so leaving most OUT of the sitemap created the "sitemap=no / robots=index"
// contradiction that fed the May deindex. Each page is genuinely editorial
// (unique intro + bullets + send-timing tip + FAQ per pair; live quotes where
// a corridor exists), not thin — so the right fix is to make the sitemap match
// robots, not to noindex them. Known impression-earners: usd-to-brl (232i),
// gbp-to-eur (69i). The rest had ~0 Bing/GSC at the May-25 prune but are
// substantive pages; re-prune via Bing data if they stay at 0 by next review.
export const SITEMAP_RATE_PAIR_SLUGS = new Set<string>([
  "usd-to-inr", "usd-to-pkr", "usd-to-php", "usd-to-mxn", "usd-to-ngn",
  "gbp-to-eur", "gbp-to-inr", "gbp-to-usd", "gbp-to-pkr", "eur-to-usd",
  "eur-to-gbp", "cad-to-inr", "aud-to-inr", "usd-to-gbp", "usd-to-eur",
  "usd-to-cad", "usd-to-aud", "usd-to-jpy", "usd-to-brl", "usd-to-cny",
]); // 20 URLs (was 4) — reconciled index:yes/sitemap:no contradiction 2026-06-07

// All 22 rate-history pages had 0 Bing + 0 GSC. Removed from sitemap.
// Page route remains but is no longer actively submitted.
export const SITEMAP_RATE_HISTORY_SLUGS = new Set<string>([]); // 0 URLs (was 22)

export const SITEMAP_SWIFT_SLUGS = new Set<string>([
  "georgia",
  // ── Added 2026-05-25 — major Bing impression earners that were missing ──
  "ghana",          // 273i 0c
  "philippines",    // 262i 0c
  "kenya",          // 238i 2c
  "united-kingdom", // 177i 1c
  "sri-lanka",      // 140i 1c
  "ireland",        // 113i 0c
  "malaysia",       // 24i 1c
  "egypt",          // 19i 0c
  "nigeria",        // 17i 3c
  "new-zealand",    // 12i 0c
  "mexico",         // 8i 0c
  "canada",         // 5i 0c
]); // 13 URLs (was 1)

export const SITEMAP_BUSINESS_SLUGS = new Set<string>([
  "b2b-transfers",
  "vendor-payments",
]); // 2 URLs
