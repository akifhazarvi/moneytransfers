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

/** First wave, 2026-09-27 (sitemap lastmod BING_DEMAND_DATE). */
const BING_DEMAND_WAVE_1 = [
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
];

/**
 * Second wave, 2026-10-08 — round-3 freelance brief §3.1 (worksheet 02).
 * Every URL that was noindexed for ALL engines while the brief's Bing
 * PageTraffic export shows it earning Bing impressions. Acceptance: "no URL
 * receiving Bing traffic has a general noindex directive". Google sees no
 * change (these stay `googlebot: noindex`; the freelancer's Googlebot crawl
 * already counts them non-indexable), so this is a Bing-only reopening.
 *
 * Owner decision 2026-10-08: this includes the currency twins the first wave
 * kept closed (usa-to-europe, india-to-uk, india-to-canada, swift-codes/
 * ireland) — rule 3's twin exception yields to the brief for pages with Bing
 * demand, because the duplicate measure it protected is a Google concern and
 * Google is unaffected.
 *
 * Plus the five /exchange-rates pair pages restored the same day as Bing
 * earners (gone-rate-pairs.ts).
 * Bing clicks / impressions from the brief's export in the comments.
 */
export const BING_DEMAND_WAVE_2: readonly string[] = [
  "/compare/hsbc-vs-paypal",            // 0 / 3
  // "/compare/moneygram-vs-wise" (0 / 1) — not reopened: 86.6% the same as
  // wise-vs-moneygram (round-3 QA, Oct 9), so it 301s there instead (rule 15).
  "/compare/remitly-vs-moneygram",      // 0 / 15
  "/compare/revolut-vs-hsbc",           // 1 / 6
  "/compare/wise-vs-taptap-send",       // 0 / 2
  "/companies/lemfi",                   // 0 / 27
  "/exchange-rates/aud-to-inr",         // 3 / 2,571 (was a 301 to the hub)
  "/exchange-rates/gbp-to-eur",         // 3 / 772
  "/exchange-rates/gbp-to-pkr",         // 3 / 722 (was a 301 to the hub)
  "/exchange-rates/usd-to-brl",         // 0 / 62
  "/exchange-rates/usd-to-cny",         // 2 / 52 (was a 301 to the hub)
  "/exchange-rates/usd-to-mxn",         // 1 / 25 (was a 301 to the hub)
  "/exchange-rates/usd-to-php",         // 14 / 2,397 (was a 301 to the hub)
  "/send-money/australia-to-uk",        // 0 / 14
  "/send-money/china-to-australia",     // 0 / 2
  "/send-money/china-to-uk",            // 0 / 1
  "/send-money/china-to-usa",           // 0 / 4
  "/send-money/france-to-uk",           // 0 / 1
  "/send-money/india-to-canada",        // 1 / 7
  "/send-money/india-to-uk",            // 2 / 2
  "/send-money/saudi-arabia-to-egypt",  // 0 / 11
  "/send-money/saudi-arabia-to-philippines", // 0 / 11
  "/send-money/send-money-to-colombia", // 0 / 12
  "/send-money/send-money-to-dominican-republic", // 0 / 13
  "/send-money/send-money-to-egypt",    // 0 / 12
  "/send-money/send-money-to-ethiopia", // 0 / 1
  "/send-money/send-money-to-hungary",  // 0 / 12
  "/send-money/send-money-to-indonesia", // 0 / 12
  "/send-money/send-money-to-jamaica",  // 0 / 1
  "/send-money/send-money-to-morocco",  // 0 / 24
  "/send-money/send-money-to-nigeria",  // 0 / 20
  "/send-money/send-money-to-romania",  // 0 / 12
  "/send-money/send-money-to-uk",       // 0 / 2
  "/send-money/uae-to-india",           // 1 / 56
  "/send-money/uae-to-philippines",     // 0 / 15
  "/send-money/uk-to-nigeria",          // 0 / 2
  "/send-money/usa-to-europe",          // 1 / 194
  "/send-money/usa-to-ghana",           // 2 / 1
  "/send-money/usa-to-mexico",          // 0 / 76
  "/swift-codes/ireland",               // 4 / 467
];

export const BING_DEMAND_ROUTES: ReadonlySet<string> = new Set<string>([...BING_DEMAND_WAVE_1, ...BING_DEMAND_WAVE_2]);

/**
 * Google release batches — round-3 brief §3.4 (2026-10-08): pages Bing already
 * sends people to are released to Google "in batches of 10–20 URLs at
 * intervals of 7–10 days, rather than all at once, to observe GSC's response",
 * each only after it passes the QA checklist (worksheet 12).
 *
 * A route listed here is Google-eligible from the deploy that adds it:
 * googleIndexable() admits it ahead of GOOGLE_HIDDEN_*, so it loses
 * `googlebot: noindex` (meta and header), joins sitemap-google.xml, and joins
 * src/data/google-eligible-routes.json — which brings back every internal link
 * to it (rule 14). check:link-eligibility then requires 3+ in-content links to
 * it from other eligible pages, so a release cannot ship as an orphan.
 *
 * One entry per batch, never edited after release (it is the change log GSC is
 * measured against). Withdrawing a page = removing it here, with a note.
 */
export const GOOGLE_RELEASE_BATCHES: readonly { readonly released: string; readonly routes: readonly string[] }[] = [
  {
    // Batch 1 — every Priority-1 page (Bing clicks ≥5, brief worksheet 05) that
    // passed the live QA of 2026-10-09: 200, self-canonical, no placeholder,
    // own data, dated byline, no ≥40% pair with an eligible page. Held back:
    // /banks (no date/author yet), /swift-codes/thailand (fixed a wrong-length
    // code — next batch), /compare/western-union-vs-moneygram (verdict text
    // rewritten — next batch), /compare/paypal-vs-revolut (passes QA but only
    // the /compare hub links to it in content; check:link-eligibility requires
    // 3 — next batch with contextual links). Bing clicks in the comments.
    released: "2026-10-14",
    routes: [
      "/iban/denmark",            // 30
      "/swift-codes/pakistan",    // 27
      "/swift-codes/canada",      // 22
      "/swift-codes/malaysia",    // 21
      "/iban/finland",            // 17
      "/swift-codes/united-states", // 15
      "/swift-codes/indonesia",   // 12
      "/swift-codes/australia",   // 11
      "/iban/greece",             // 11
      "/swift-codes/brazil",      // 10
      "/swift-codes/south-africa", // 9
      "/swift-codes/india",       // 8
      "/iban/norway",             // 8
      "/iban/israel",             // 7
      "/iban/brazil",             // 6
      "/iban/austria",            // 6
      "/iban/kuwait",             // 5
    ],
  },
];

/**
 * A batch takes effect in the first build dated on or after `released` — the
 * site rebuilds on every 6-hourly scrape commit, so a batch committed ahead of
 * its date goes live within hours of it with nobody pushing anything (owner,
 * 2026-10-09: "do as he said" — the brief's day-5 start). SMC_BUILD_DATE is
 * inlined by next.config.ts so middleware, pages and both sitemaps agree on the
 * day; build scripts (prebuild's link manifest) fall back to today, the same day.
 */
const BUILD_DATE: string = process.env.SMC_BUILD_DATE || new Date().toISOString().slice(0, 10);

export const GOOGLE_RELEASED_ROUTES: ReadonlySet<string> = new Set(
  GOOGLE_RELEASE_BATCHES.filter((b) => b.released <= BUILD_DATE).flatMap((b) => b.routes),
);

/** Section prefixes whose child pages are hidden from Googlebot. Hubs are not. */
export const GOOGLE_HIDDEN_PREFIXES: readonly string[] = ["/companies/", "/compare/", "/banks/"];

export const GOOGLE_HIDDEN_ROUTES: ReadonlySet<string> = new Set<string>([
  // guides — 2026-10-08, round-3 brief §3.1: the three guides that were
  // noindexed for every engine get the same Google-only exclusion as the rest
  // (Bing indexes them; guideIsIndexable() admits Google-hidden guides).
  "/guides/business-payments-australia-to-india",
  "/guides/business-payments-canada-to-usa",
  "/guides/large-business-transfers-from-china-cny",
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
