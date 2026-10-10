/**
 * When each page's content last changed — the "Updated" date a page shows AND
 * the <lastmod> sitemap.ts submits for it. One constant, read by both, so the
 * two cannot disagree (check:lastmod asserts it on the built output).
 *
 * WHY
 * Round-3 freelance QA (2026-10-09), checklist item 7 "Facts verified; update
 * date and author provided": 40 eligible pages showed no date or no author,
 * 16 /swift-codes pages printed the BUILD date as "Updated" over a lastmod of
 * 2026-03-28, and 11 /travel pages printed their guide date over the day they
 * were reopened. The brief (§4.4D) also flagged a date that changes every day
 * as automated, so none of these is derived from the build, from "today" or
 * from the six-hourly quote data. Pages that show live figures say when those
 * were collected on a separate line ("Rates collected …", "as of …"), never
 * with the word "Updated".
 *
 * RULE
 * Bump a page's date when what it says changes — copy, figures it states,
 * structured data, links added in the content. Not for a redeploy, a data
 * refresh, a link-plumbing change (EligibleLink) or a byline. Each value below
 * is the date of the last such commit to that page or its content data.
 */

/** The author named on hub, reference and tool pages (editor-in-chief). */
export const EDITORIAL_AUTHOR_SLUG = "awais-imran";
/** The author named on methodology and research pages (owns the ranking methodology). */
export const METHODOLOGY_AUTHOR_SLUG = "ahsan-mukhtar";

// ── Families: one date for every page of the template ──

/** /swift-codes/[country] — country corridor links in the content (brief §5.3). */
export const SWIFT_CONTENT_DATE = "2026-10-09";
/** /iban/[country] — bank names readable, defunct banks dropped, country payment facts (brief §4.2/§4.3). */
export const IBAN_CONTENT_DATE = "2026-10-09";
/**
 * /compare/[slug], /banks/[slug] and every /companies/[slug] profile without a
 * published review — round-3: lead-share figures, measured company figures,
 * provider counts (brief §4.3).
 */
export const COMPARISON_CONTENT_DATE = "2026-10-09";

/** /companies/[slug]: a published review carries its own date; a profile is the template's. */
export function companyContentDate(review?: { updatedAt: string; publishSections?: boolean }): string {
  return review?.publishSections ? review.updatedAt : COMPARISON_CONTENT_DATE;
}
/** /exchange-rates/history/[pair] — month-by-month ranges and policy-decision table (brief §4.2). */
export const RATE_HISTORY_CONTENT_DATE = "2026-10-09";
/** /cash-out/[country] — corridor pills follow rule 14; sibling cash-out guides linked. */
export const CASH_OUT_CONTENT_DATE = "2026-10-09";

// ── Single pages ──

const PAGE_UPDATED = {
  "/exchange-rates": "2026-10-07",           // names the real rate source (no "median of 0 sources")
  "/exchange-rates/history": "2026-09-20",   // rate pages collapsed to one hub; a false claim dropped
  "/swift-codes": "2026-09-20",              // editorial byline separated from the commercial role
  "/iban": "2026-05-31",                     // last edit to the hub's text (was IBAN_HUB_UPDATED)
  "/cash-out": "2026-09-25",                 // round-2 technical SEO brief
  "/tools": "2026-10-09",                    // per-page see-also line (brief §5.3)
  "/tools/us-remittance-tax": "2026-10-09",  // per-page see-also line (brief §5.3)
  "/tools/fx-markup-checker": "2026-10-09",  // per-page see-also line (brief §5.3)
  "/tools/salary-abroad": "2026-10-09",      // per-page see-also line (brief §5.3)
  "/guides": "2026-10-03",                   // reader-savings study added to the listing
  "/companies": "2026-10-09",                // per-page see-also line (brief §5.3)
  "/news": "2026-10-09",                     // archive became a section (brief §5.3)
  "/compare": "2026-10-09",                  // per-page see-also line (brief §5.3)
  "/travel": "2026-09-26",                   // destination summaries no longer repeated
  "/remittance-cost-index": "2026-09-29",    // Dataset licence CC BY 4.0
  "/alternatives": "2026-09-20",             // published
  "/currency-converter": "2026-09-21",       // TapTap spotlight
  "/methodology": "2026-10-09",              // three named provider counts (brief §4.3)
  "/privacy-policy": "2026-09-20",
  "/terms": "2026-09-20",
  "/cookies": "2026-04-24",
  "/guides/best-apps-to-send-money-from-us-2026": "2026-09-29",
} as const;

export type DatedPage = keyof typeof PAGE_UPDATED;

/** The content date of one page (yyyy-mm-dd). */
export function pageUpdated(path: DatedPage): string {
  return PAGE_UPDATED[path];
}

/**
 * The date a submitted URL's page shows, when it shows one — sitemap.ts uses
 * it as that URL's lastmod. Travel guides and company reviews carry their own
 * date in the data, which the caller looks up (this file imports no dataset).
 */
export function shownContentDate(
  path: string,
  travelDate?: (slug: string) => string | undefined,
  companyReview?: (slug: string) => { updatedAt: string; publishSections?: boolean } | undefined,
): string | undefined {
  if (path in PAGE_UPDATED) return PAGE_UPDATED[path as DatedPage];
  if (path.startsWith("/swift-codes/")) return SWIFT_CONTENT_DATE;
  if (path.startsWith("/iban/")) return IBAN_CONTENT_DATE;
  if (path.startsWith("/compare/") || path.startsWith("/banks/")) return COMPARISON_CONTENT_DATE;
  if (path.startsWith("/companies/")) return companyContentDate(companyReview?.(path.slice("/companies/".length)));
  if (path.startsWith("/exchange-rates/history/")) return RATE_HISTORY_CONTENT_DATE;
  if (path.startsWith("/cash-out/")) return CASH_OUT_CONTENT_DATE;
  if (path.startsWith("/travel/")) return travelDate?.(path.slice("/travel/".length));
  return undefined;
}

/** "October 9, 2026" for a yyyy-mm-dd day, the same on server and client. */
export function longDay(isoDay: string): string {
  return new Date(`${isoDay.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
