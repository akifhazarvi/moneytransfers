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

/** /companies/[slug]: a published review carries its own date; a profile is the template's, or its own when rewritten. */
export function companyContentDate(review?: { updatedAt: string; publishSections?: boolean }, slug?: string): string {
  if (review?.publishSections) return review.updatedAt;
  return slug ? familyPageDate(`/companies/${slug}`, COMPARISON_CONTENT_DATE) : COMPARISON_CONTENT_DATE;
}
/**
 * A family page whose own content changed after its family's date. Bumping
 * the family would date every sibling that did not change; leaving it would
 * understate this page. The page and its lastmod both read familyPageDate().
 */
const FAMILY_PAGE_UPDATED: Record<string, string> = {
  "/iban/uk": "2026-10-18",                 // UK in SEPA after Brexit, sources, four FAQs
  "/swift-codes/ireland": "2026-10-18",     // CAT gift tax, Verification of Payee, Ulster Bank and KBC balances
  "/banks/barclays": "2026-10-18",          // Barclays' published charges, four FAQs
  "/banks/lloyds": "2026-10-18",            // Lloyds' published charges, four FAQs
  "/compare/wise-vs-revolut": "2026-10-18", // rewritten from each company's own pages
  "/compare/remitly-vs-paypal": "2026-10-18",     // pair note: where the money goes, refunds, licences
  "/compare/remitly-vs-moneygram": "2026-10-18",  // pair note: collecting and cancelling
  "/compare/remitly-vs-taptap-send": "2026-10-18", // pair note: UK safeguarding; TapTap cash pickup corrected
  "/compare/revolut-vs-hsbc": "2026-10-18",       // pair note: banking licences; Revolut's plan fees corrected
  "/compare/paypal-vs-revolut": "2026-10-18",     // Revolut's plan fees corrected
  "/compare/paypal-vs-western-union": "2026-10-18", // pair note: fraud warnings, FTC order, cancelling; own FAQs
  "/compare/paypal-vs-worldremit": "2026-10-18",  // decision note: send-only PayPal accounts, WorldRemit partner payouts
  "/compare/wise-vs-xoom": "2026-10-18",
  "/compare/western-union-vs-xoom": "2026-10-18",
  "/compare/revolut-vs-xoom": "2026-10-18",
  "/compare/xe-vs-moneygram": "2026-10-18",
  "/compare/xe-vs-paypal": "2026-10-18",
  "/compare/xe-vs-xoom": "2026-10-18",
  "/compare/xe-vs-revolut": "2026-10-18",
  "/compare/worldremit-vs-xoom": "2026-10-18",
  "/compare/remitly-vs-revolut": "2026-10-18",
  "/compare/western-union-vs-worldremit": "2026-10-18",
  "/compare/xe-vs-western-union": "2026-10-18",
  "/compare/xe-vs-worldremit": "2026-10-18",
  "/compare/revolut-vs-western-union": "2026-10-18",
  "/compare/moneygram-vs-revolut": "2026-10-18",
  "/compare/revolut-vs-worldremit": "2026-10-18",
  "/compare/boss-money-vs-remitly": "2026-10-18",
  "/compare/chase-vs-wells-fargo": "2026-10-18", // both banks' published wire fees replace hand-typed fees and markups
  "/compare/wise-vs-westpac": "2026-10-18",      // Westpac's published fee table replaces "$8-$20"
  "/compare/chase-vs-revolut": "2026-10-18",      // decision note: Chase wires vs Revolut's partner banks (OCC, FDIC)
  "/swift-codes/netherlands": "2026-10-18",       // name check, DNB register, instant payments
  "/swift-codes/france": "2026-10-18",            // REGAFI, the payee check and SWIFT wires, overseas BIC letters
  "/companies/natwest": "2026-10-18",
  "/companies/nationwide": "2026-10-18",
  "/companies/westpac": "2026-10-18",
  "/companies/commonwealth-bank": "2026-10-18",
  "/companies/lloyds": "2026-10-18",
  "/companies/anz": "2026-10-18",
  "/companies/santander": "2026-10-18",
  "/companies/profee": "2026-10-18",
  "/companies/moneycorp": "2026-10-18",
  "/companies/wells-fargo": "2026-10-18",
  "/companies/td-bank": "2026-10-18",
  "/companies/barclays": "2026-10-18",
  "/companies/fairfx": "2026-10-18",
  "/companies/transfergo": "2026-10-18",
  "/companies/hsbc": "2026-10-18",
  "/companies/chase": "2026-10-18",
  "/companies/pnb-europe": "2026-10-18",
  "/companies/rbs": "2026-10-18",
  "/companies/revolut": "2026-10-18",            // verdict: Revolut's own rate, plan allowances and weekend fee
  "/iban/greenland": "2026-10-18",
  "/iban/faroe-islands": "2026-10-18",
  "/iban/liechtenstein": "2026-10-18",
  "/iban/monaco": "2026-10-18",
  "/iban/vatican-city": "2026-10-18",
  "/iban/gibraltar": "2026-10-18",
  "/iban/slovenia": "2026-10-18",
  "/iban/san-marino": "2026-10-18",
  "/iban/timor-leste": "2026-10-18",
  "/iban/british-virgin-islands": "2026-10-18",
  "/iban/estonia": "2026-10-18",
  "/iban/azerbaijan": "2026-10-18",
  "/iban/kazakhstan": "2026-10-18",
  "/iban/malta": "2026-10-18",
  "/iban/guatemala": "2026-10-18",
  "/iban/dominican-republic": "2026-10-18",
  "/iban/bosnia-and-herzegovina": "2026-10-18",
  "/iban/iceland": "2026-10-18",
  "/iban/el-salvador": "2026-10-18",
  "/iban/lebanon": "2026-10-18",
  "/iban/costa-rica": "2026-10-18",               // SINPE, Pagos al Exterior, SINPE Móvil
  "/iban/lithuania": "2026-10-18",                // CENTROlink, Verification of Payee, litas
  "/iban/slovakia": "2026-10-18",                 // payment symbols, SIPS and TIPS
  "/iban/serbia": "2026-10-18",                   // in SEPA since May 2026; NBS IPS; dinar accounts
  "/iban/andorra": "2026-10-18",                  // in SEPA (EPC list), was shown as not
  "/iban/albania": "2026-10-18",
  "/iban/montenegro": "2026-10-18",
  "/iban/north-macedonia": "2026-10-18",
  "/iban/moldova": "2026-10-18",
};

/** A family page's date: its own when it changed after the family's. */
export function familyPageDate(path: string, familyDate: string): string {
  const own = FAMILY_PAGE_UPDATED[path];
  return own && own > familyDate ? own : familyDate;
}

/** /exchange-rates/history/[pair] — month-by-month ranges and policy-decision table (brief §4.2). */
export const RATE_HISTORY_CONTENT_DATE = "2026-10-09";
/** /cash-out/[country] — corridor pills follow rule 14; sibling cash-out guides linked. */
export const CASH_OUT_CONTENT_DATE = "2026-10-09";

// ── Single pages ──

const PAGE_UPDATED = {
  "/exchange-rates": "2026-10-18",           // "Exchange Rates Today" headline
  "/exchange-rates/history": "2026-10-18",   // corridor table shown; rate levels and collection described as built
  "/swift-codes": "2026-10-18",              // 8 vs 11 characters, a wrong code, correspondent charges
  "/iban": "2026-10-18",                     // IBAN checker; what an IBAN number is vs an account number
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
  "/remittance-cost-index": "2026-10-17",    // ranking as one table; "Why remittance costs matter" (World Bank, cited)
  "/alternatives": "2026-09-20",             // published
  "/currency-converter": "2026-10-18",       // popular-pair rates shown instead of an sr-only block
  "/methodology": "2026-10-18",              // source tiers, integrity checks, benchmark and tie-break as the code runs them
  "/how-we-review": "2026-10-18",            // referral fees and sponsored placement; quotes shown but not ranked
  "/editorial-policy": "2026-10-15",         // editor byline and WebPage JSON-LD
  "/privacy-policy": "2026-10-18",           // opt-in consent for analytics and session replay; Clarity disclosed; browser extension section
  "/terms": "2026-09-20",
  "/corrections": "2026-10-18",              // log brought up to date: September–October corrections
  "/disclaimer": "2026-10-17",               // what we are and are not; regulator check; data caveats as prose
  "/cookies": "2026-10-18",                  // opt-in consent and cookie settings; Clarity cookies listed
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
  if (path.startsWith("/swift-codes/")) return familyPageDate(path, SWIFT_CONTENT_DATE);
  if (path.startsWith("/iban/")) return familyPageDate(path, IBAN_CONTENT_DATE);
  if (path.startsWith("/compare/") || path.startsWith("/banks/")) return familyPageDate(path, COMPARISON_CONTENT_DATE);
  if (path.startsWith("/companies/")) {
    const slug = path.slice("/companies/".length);
    return companyContentDate(companyReview?.(slug), slug);
  }
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
