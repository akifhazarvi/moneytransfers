/**
 * Search-engine-specific indexing lists — round-3 freelance plan (2026-09-27).
 *
 * The site earns on Bing and is not indexed by Google (1 of 8,670 known URLs),
 * so the two engines get different answers:
 *
 * - BING_DEMAND_ROUTES: pages our own data shows Bing sends people to, which
 *   the 2026-09-20 duplication gate had noindexed for every engine. That gate
 *   exists to protect Google's view of the site, but a generic `robots:
 *   noindex` also removed them from Bing, which obeys it: Bing clicks fell 33%
 *   and AI-cited pages halved in the week after (Bing Webmaster Tools, Sep
 *   21–25 vs Sep 14–18). These are open to Bing and hidden from Googlebot
 *   (`googlebot: noindex`), so Google sees nothing new.
 *   Source, mechanical — minus pages already indexable, minus anything not
 *   answering 200 (retired 410s and 301s stay retired):
 *     - GA4 Bing landing pages with ≥3 sessions, Jun 29–Sep 27 2026, any family;
 *     - the IBAN and SWIFT Bing-demand allowlists (INDEXED_*_SLUGS and
 *       SITEMAP_*_SLUGS, Bing WMT ≥5 impressions) — the freelancer's priority
 *       families, and templates de-duplicated 2026-09-26;
 *     - /exchange-rates/history/usd-to-hnl, a ranking URL.
 *   Corridor and compare allowlist entries WITHOUT recent GA4 sessions (49
 *   corridors, 17 compare pairs) were measured and left out: many are currency
 *   twins (send-money-to-spain / -germany / usa-to-europe are all USD→EUR, 80%
 *   the same page), and reopening them raised the duplicate share of 102
 *   already-indexable pages while earning next to nothing on Bing.
 *   /compare/moneygram-vs-wise is excluded as a self-canonical twin of
 *   /compare/wise-vs-moneygram.
 *   /send-money/india-to-canada and /send-money/india-to-uk (3 Bing sessions
 *   each) are excluded: as INR-origin twins they pushed india-to-usa over 30%.
 *   /swift-codes/ireland (3 Bing sessions) is excluded: its SEPA answers are
 *   near-identical to /swift-codes/france's and pushed France over 30%.
 *
 * - GOOGLE_HIDDEN_*: pages kept out of Google's index while Bing still sees
 *   them. /companies/, /compare/ and /banks/ children are the freelancer's
 *   named sections (most duplicated, ~2% of Bing clicks). The explicit list is
 *   the freelancer's ≥45%-overlap pages in other families that have no Bing
 *   demand at all — rewriting pages nobody reaches is not the priority.
 *
 * Read by seo-indexing.ts (and through it by middleware), so keep these as
 * plain arrays: no route-map or data imports, which would bloat the edge bundle.
 */

export const BING_DEMAND_ROUTES: ReadonlySet<string> = new Set<string>([
  // banks
  "/banks",
  // compare
  "/compare/remitly-vs-paypal",
  "/compare/remitly-vs-taptap-send",
  "/compare/wise-vs-revolut",
  "/compare/wise-vs-westpac",
  // exchange-rates
  "/exchange-rates/history/usd-to-hnl",
  // iban
  "/iban/andorra",
  "/iban/austria",
  "/iban/brazil",
  "/iban/costa-rica",
  "/iban/croatia",
  "/iban/cyprus",
  "/iban/denmark",
  "/iban/el-salvador",
  "/iban/finland",
  "/iban/georgia",
  "/iban/greece",
  "/iban/israel",
  "/iban/jordan",
  "/iban/kuwait",
  "/iban/lithuania",
  "/iban/monaco",
  "/iban/norway",
  "/iban/qatar",
  "/iban/slovakia",
  "/iban/turkey",
  "/iban/uk",
  "/iban/ukraine",
  // send-money
  "/send-money/canada-to-india",
  "/send-money/saudi-arabia-to-pakistan",
  "/send-money/send-money-to-europe",
  "/send-money/uae-to-pakistan",
  // swift-codes
  "/swift-codes/australia",
  "/swift-codes/brazil",
  "/swift-codes/canada",
  "/swift-codes/egypt",
  "/swift-codes/georgia",
  "/swift-codes/hong-kong",
  "/swift-codes/india",
  "/swift-codes/indonesia",
  "/swift-codes/japan",
  "/swift-codes/malaysia",
  "/swift-codes/morocco",
  "/swift-codes/netherlands",
  "/swift-codes/new-zealand",
  "/swift-codes/nigeria",
  "/swift-codes/pakistan",
  "/swift-codes/singapore",
  "/swift-codes/south-africa",
  "/swift-codes/south-korea",
  "/swift-codes/thailand",
  "/swift-codes/turkiye",
  "/swift-codes/united-arab-emirates",
  "/swift-codes/united-states",
]);

/** Section prefixes whose child pages are hidden from Googlebot. Hubs are not. */
export const GOOGLE_HIDDEN_PREFIXES: readonly string[] = ["/companies/", "/compare/", "/banks/"];

export const GOOGLE_HIDDEN_ROUTES: ReadonlySet<string> = new Set<string>([
  // cash-out
  "/cash-out/brazil",
  "/cash-out/kenya",
  "/cash-out/mexico",
  "/cash-out/nigeria",
  // exchange-rates
  "/exchange-rates/history/usd-to-aud",
  "/exchange-rates/history/usd-to-cad",
  // iban
  "/iban/albania",
  "/iban/azerbaijan",
  "/iban/bosnia-and-herzegovina",
  "/iban/british-virgin-islands",
  "/iban/dominican-republic",
  "/iban/estonia",
  "/iban/faroe-islands",
  "/iban/gibraltar",
  "/iban/greenland",
  "/iban/guatemala",
  "/iban/iceland",
  "/iban/kazakhstan",
  "/iban/lebanon",
  "/iban/liechtenstein",
  "/iban/malta",
  "/iban/mauritania",
  "/iban/moldova",
  "/iban/montenegro",
  "/iban/north-macedonia",
  "/iban/san-marino",
  "/iban/serbia",
  "/iban/slovenia",
  "/iban/timor-leste",
  "/iban/vatican-city",
  // send-money
  "/send-money/austria-to-ethiopia",
  "/send-money/austria-to-senegal",
  "/send-money/austria-to-tanzania",
  "/send-money/austria-to-uganda",
  "/send-money/bahrain-to-bangladesh",
  "/send-money/bahrain-to-pakistan",
  "/send-money/india-to-croatia",
]);
