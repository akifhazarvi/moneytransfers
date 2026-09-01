/**
 * Retired SWIFT country pages — HTTP 410 Gone.
 *
 * Context (2026-09-01): AdSense flagged the site "Low value content". The
 * /swift-codes/* set was 107 pages built from the same template, and the
 * majority carried almost no data to fill it — the page chrome, a stock
 * explainer paragraph and one or two BIC rows.
 *
 * Selection rule — a page is retired only if BOTH hold:
 *   1. it is NOT in INDEXED_SWIFT_SLUGS (already noindexed: no GSC/Bing
 *      demand, so retiring costs no traffic), AND
 *   2. its rendered body is under 600 words.
 *
 * The two groups separate cleanly, which is why the cut is safe:
 *
 *   indexed pages (29)      850 - 4,498 words   (median 1,017)
 *   retired pages (57)        303 -   ~500 words (median 369)
 *   kept, noindexed (21)      619 - 9,863 words
 *
 * No indexed page falls under 850 words, so the rule cannot touch a page
 * that earns traffic. Data-rich pages survive even without demand —
 * luxembourg (9,863 words, 1,051 branches) and bangladesh (7,216 / 993)
 * are real reference material and stay live.
 *
 * Cross-checked against src/data/scraped/gsc-data.json (28d, Apr 22 - May 19
 * 2026): only 7 of the 57 appear in Search Console at all, together earning
 * 29 impressions and 0 clicks, none ranking better than position 8. Nothing
 * in this set is being retired while it earns traffic.
 *
 * Branch count alone was rejected as the criterion: it does not track
 * rendered depth. Russia lists 485 banks but only 1 branch (305 words),
 * while France has 8 branches and 950 words. Word count is measured off
 * the production build, so it reflects what a reader actually gets.
 *
 * 410 (not 404, not 301): tells Google the URL is intentionally retired so
 * it deindexes cleanly. 404 reads as "never existed" and lingers; 301 reads
 * as "content moved", which contradicts scaled-content remediation and
 * there is no equivalent page to point at. Same rationale as
 * src/lib/gone-corridors.ts.
 *
 * Promote OUT of this set if a country's scraped branch data grows enough
 * to carry a real page, or if it starts earning demand on Bing/AI.
 */
export const GONE_SWIFT_SLUGS = new Set<string>([
  "albania",                    // 353w, 3 branches
  "andorra",                    // 425w, 9 branches
  "argentina",                  // 309w, 1 branch
  "armenia",                    // 358w, 4 branches
  "austria",                    // 411w, 15 branches
  "azerbaijan",                 // 304w, 1 branch
  "belgium",                    // 413w, 15 branches
  "benin",                      // 361w, 4 branches
  "burkina-faso",               // 346w, 2 branches
  "cameroon",                   // 361w, 7 branches
  "chile",                      // 346w, 4 branches
  "costa-rica",                 // 341w, 2 branches
  "cote-d-ivoire",              // 389w, 3 branches
  "cyprus",                     // 417w, 9 branches
  "denmark",                    // 339w, 6 branches
  "ecuador",                    // 325w, 2 branches
  "el-salvador",                // 450w, 11 branches
  "equatorial-guinea",          // 392w, 7 branches
  "finland",                    // 356w, 8 branches
  "gabon",                      // 372w, 6 branches
  "gibraltar",                  // 311w, 1 branch
  "greece",                     // 381w, 10 branches
  "guinea-bissau",              // 342w, 3 branches
  "holy-see",                   // 353w, 3 branches
  "hungary",                    // 350w, 5 branches
  "iceland",                    // 334w, 5 branches
  "israel",                     // 331w, 5 branches
  "italy",                      // 404w, 11 branches
  "kiribati",                   // 304w, 1 branch
  "latvia",                     // 370w, 8 branches
  "lithuania",                  // 303w, 1 branch
  "mali",                       // 317w, 2 branches
  "malta",                      // 354w, 3 branches
  "marshall-islands",           // 358w, 4 branches
  "micronesia",                 // 306w, 1 branch
  "mozambique",                 // 369w, 6 branches
  "niger",                      // 321w, 3 branches
  "norway",                     // 344w, 6 branches
  "panama",                     // 305w, 1 branch
  "poland",                     // 327w, 4 branches
  "portugal",                   // 376w, 6 branches
  "romania",                    // 366w, 7 branches
  "russia",                     // 305w, 1 branch
  "san-marino",                 // 390w, 7 branches
  "senegal",                    // 328w, 2 branches
  "serbia",                     // 340w, 3 branches
  "spain",                      // 391w, 11 branches
  "sweden",                     // 344w, 7 branches
  "switzerland",                // 371w, 10 branches
  "tanzania",                   // 332w, 2 branches
  "timor-leste",                // 370w, 5 branches
  "togo",                       // 316w, 2 branches
  "tuvalu",                     // 304w, 1 branch
  "uganda",                     // 361w, 4 branches
  "ukraine",                    // 304w, 1 branch
  "uruguay",                    // 305w, 1 branch
  "viet-nam",                   // 394w, 5 branches
]); // 57 pages retired; 107 -> 50 live
