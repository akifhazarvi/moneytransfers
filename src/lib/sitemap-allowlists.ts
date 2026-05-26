/**
 * GSC-validated slugs that earned ≥10 impressions in the 90-day window
 * 2026-02-17 – 2026-05-18. These are the URLs the sitemap submits.
 *
 * Regenerate via: npx tsx scripts/regen-sitemap-allowlists.ts
 *
 * The script overwrites this file; diff it before committing so reviewers can
 * see which URLs are joining or leaving the sitemap instead of the change
 * being silent.
 */

export const SITEMAP_CORRIDOR_SLUGS = new Set<string>([
  // aud-to-bdt removed 2026-05-22 — Wave 3 demand failure (0 impr / 90d).
  // See WAVE3_NOINDEX_SLUGS in src/lib/corridor-tiers.ts.
  "aud-to-cad",
  "aud-to-cny",
  "aud-to-cop",
  "aud-to-eur",
  "aud-to-fjd",
  "aud-to-idr",
  "aud-to-lkr",
  "aud-to-usd",
  "aud-to-vnd",
  "australia-to-bangladesh",
  "australia-to-brazil",
  "australia-to-china",
  "australia-to-guatemala",
  "australia-to-indonesia",
  "australia-to-japan",
  "australia-to-kenya",
  "australia-to-mexico",
  "australia-to-morocco",
  "australia-to-nepal",
  "australia-to-pakistan",
  "australia-to-philippines",
  "australia-to-south-africa",
  "australia-to-sri-lanka",
  "australia-to-tanzania",
  "australia-to-thailand",
  "australia-to-turkey",
  "australia-to-uae",
  "australia-to-uganda",
  "austria-to-turkey",
  "belgium-to-australia",
  "belgium-to-morocco",
  "belgium-to-pakistan",
  "cad-to-bdt",
  "cad-to-eur",
  "cad-to-gbp",
  "cad-to-ghs",
  "cad-to-hkd",
  "cad-to-mxn",
  "canada-to-australia",
  "canada-to-bangladesh",
  "canada-to-cameroon",
  "canada-to-china",
  "canada-to-egypt",
  "canada-to-fiji",
  "canada-to-ghana",
  "canada-to-indonesia",
  "canada-to-jamaica",
  "canada-to-malaysia",
  "canada-to-mexico",
  "canada-to-nepal",
  "canada-to-nigeria",
  "canada-to-pakistan",
  "canada-to-philippines",
  "canada-to-poland",
  "canada-to-romania",
  "canada-to-vietnam",
  "denmark-to-bangladesh",
  "denmark-to-brazil",
  "denmark-to-china",
  "denmark-to-colombia",
  "germany-to-ghana",
  "send-money-to-morocco",
  "send-money-to-spain",
  "uk-to-bangladesh",
]); // 65 URLs

export const SITEMAP_GUIDE_SLUGS = new Set<string>([
  // ── Original GSC-validated set (≥10 GSC impr in 90d ending 2026-05-18) ──
  "best-money-transfer-apps",
  "best-money-transfer-rates-eid-holi-2026",
  "best-money-transfer-services",
  "business-international-payments-guide",
  "business-payments-uk-to-europe",
  "cost-of-sending-1000-abroad",
  "crypto-banking-licenses-2026",
  "global-remittance-trends-2026",
  "how-euribor-affects-euro-transfers",
  "how-to-pay-international-suppliers",
  "iban-numbers-explained",
  "money-transfer-promo-codes-referral-programs",
  "money-transfer-safety-guide",
  "multi-currency-accounts-exchange-rates",
  "pakistan-rupee-forecast-2026",
  "send-money-to-bangladesh-guide",
  "send-money-to-india-cash-pickup-ria",
  "send-money-to-india-guide",
  "send-money-to-mexico-guide",
  "send-money-to-nigeria-guide",
  "send-money-to-pakistan-guide",
  "send-money-to-philippines-guide",
  "send-money-to-south-africa-guide",
  "send-money-uk-to-india-guide",
  "swift-codes-explained",
  "us-dollar-forecast-2026",
  "wire-transfer-guide",
  // ── Added 2026-05-25 — Bing-validated (≥5 Bing impr per BWT page report) ──
  // The site is winning on Bing/ChatGPT/DDG but Google is the underperforming
  // channel. These guides are already earning real Bing rankings + clicks,
  // so adding them to the Google sitemap gives Google a chance to discover
  // them properly. Bing already ranks them = they're not thin pages.
  // Comments show: Bing impressions / clicks / avg position (90d).
  "money-transfer-limits-by-provider-country", // 999i 19c pos5.5
  "revolut-foreign-transaction-fees-2026",     // 615i 27c pos3.4
  "revolut-us-banking-license-2026",           // 251i 6c  pos4.6
  "send-money-to-china-guide",                 // 185i 11c pos3.2
  "how-to-send-money-abroad",                  // 83i 3c  pos4.2
  "wise-vs-remitly-comparison",                // 50i 3c  pos4.4
  "euro-forecast-2026",                        // 49i 7c  pos5.0
  "exchange-rate-markup-explained",            // 34i 4c  pos3.0
  "send-money-to-jamaica-guide",               // 20i 1c  pos4.7
  "hidden-fees-international-transfers",       // 17i 2c  pos4.9
  "multi-currency-account-wars-2026",          // 16i 0c  pos8.6
  "cheapest-way-to-send-money-internationally", // 15i 0c pos9.1
  "send-money-to-ethiopia-guide",              // 14i 0c  pos5.9
  "send-money-to-kenya-guide",                 // 12i 0c  pos3.3
  "send-money-uae-to-india-guide",             // 10i 1c  pos2.3
  "send-money-canada-to-india-guide",          // 9i  2c  pos3.6
  "how-to-send-money-from-china",              // 7i  1c  pos4.3
  "send-money-to-sri-lanka-guide",             // 6i  0c  pos6.5
  "send-money-to-poland-guide",                // 6i  1c  pos3.8
  "send-money-uae-to-pakistan-guide",          // 5i  1c  pos2.2
  "xe-tax-season-cross-border-money-2026",     // 5i  0c  pos3.6
  "send-money-to-nepal-guide",                 // 5i  0c  pos7.2
]); // 49 URLs

export const SITEMAP_IBAN_SLUGS = new Set<string>([
  "andorra",
  "austria",
  "belgium",
  "brazil",
  "costa-rica",
  "croatia",
  "cyprus",
  "czechia",
  "denmark",
  "egypt",
  "el-salvador",
  "finland",
  "france",
  "georgia",
  "germany",
  "greece",
  "hungary",
  "ireland",
  "israel",
  "jordan",
  "lithuania",
  "luxembourg",
  "monaco",
  "netherlands",
  "norway",
  "pakistan",
  "poland",
  "portugal",
  "romania",
  "slovakia",
  "spain",
  "sweden",
  "switzerland",
  "turkey",
  "uk",
  "ukraine",
  "united-arab-emirates",
]); // 37 URLs

export const SITEMAP_COMPARISON_SLUGS = new Set<string>([
  "lloyds-vs-nationwide",
  "moneygram-vs-taptap-send",
  "moneygram-vs-xoom",
  "ofx-vs-moneygram",
  "ofx-vs-xe",
  "ofx-vs-xoom",
  "paypal-vs-moneygram",
  "paypal-vs-xoom",
  "remitly-vs-moneygram",
  "remitly-vs-paypal",
  "remitly-vs-revolut",
  "remitly-vs-taptap-send",
  "remitly-vs-worldremit",
  "remitly-vs-xe",
  "remitly-vs-xoom",
  "revolut-vs-chase",
  "revolut-vs-lloyds",
  "revolut-vs-taptap-send",
  "revolut-vs-wells-fargo",
  "western-union-vs-bank-of-america",
  "western-union-vs-moneygram",
  "western-union-vs-paypal",
  "western-union-vs-worldremit",
  "wise-vs-ofx",
  "wise-vs-paypal",
  "wise-vs-revolut",
  "wise-vs-taptap-send",
  "wise-vs-worldremit",
  "wise-vs-xoom",
  "worldremit-vs-revolut",
  "worldremit-vs-taptap-send",
  "xoom-vs-taptap-send",
]); // 32 URLs

export const SITEMAP_PROVIDER_SLUGS = new Set<string>([
  "ace-money-transfer",
  "moneygram",
  "paypal",
  "revolut",
  "xe",
  "xoom",
]); // 6 URLs

export const SITEMAP_NEWS_SLUGS = new Set<string>([
  "central-bank-super-week-march-2026",
  "china-digital-yuan-interest-bearing-cbdc",
  "embedded-finance-regulation-tightening-2026",
  "eu-instant-payments-mandate-2026",
  "revolut-files-us-bank-charter-2026",
  "stablecoins-cross-border-payments-2026",
  "us-remittance-excise-tax-takes-effect-2026",
]); // 7 URLs

export const SITEMAP_RATE_PAIR_SLUGS = new Set<string>([
  "eur-to-gbp",
  "eur-to-usd",
  "gbp-to-eur",
  "gbp-to-inr",
  "gbp-to-pkr",
  "gbp-to-usd",
  "usd-to-aud",
  "usd-to-brl",
  "usd-to-cad",
  "usd-to-gbp",
  "usd-to-jpy",
  "usd-to-php",
]); // 12 URLs

export const SITEMAP_RATE_HISTORY_SLUGS = new Set<string>([
  "aud-to-eur",
  "aud-to-php",
  "aud-to-usd",
  "cad-to-eur",
  "cad-to-gbp",
  "chf-to-eur",
  "eur-to-cop",
  "eur-to-gbp",
  "eur-to-inr",
  "eur-to-try",
  "gbp-to-eur",
  "gbp-to-inr",
  "gbp-to-usd",
  "gbp-to-zar",
  "sgd-to-php",
  "usd-to-brl",
  "usd-to-cad",
  "usd-to-cop",
  "usd-to-eur",
  "usd-to-inr",
  "usd-to-mxn",
  "usd-to-php",
]); // 22 URLs

export const SITEMAP_SWIFT_SLUGS = new Set<string>([
  "georgia",
]); // 1 URLs

export const SITEMAP_BUSINESS_SLUGS = new Set<string>([
  "b2b-transfers",
  "vendor-payments",
]); // 2 URLs
