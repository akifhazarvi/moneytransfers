/**
 * Per-provider figures measured by our own rate collection, for use in the
 * /companies/[slug] profiles.
 *
 * Why this exists: the company pages were composed entirely from hand-maintained
 * fields (fee structure, advertised markup, speed, coverage). Every provider got
 * the same sentence skeletons with different values substituted in, which read as
 * templated because it was — a 44% median 10-gram overlap between any two pages,
 * and the exact "scaled content" shape that AdSense flagged as low value.
 *
 * The fix is not more sentence variants; it is a fact per page that only we have.
 * We scrape live quotes across the corridor set, so the *observed* distance from
 * the mid-market rate is genuinely ours, differs per provider, and cannot be
 * lifted from a provider's own marketing page.
 *
 * Source: src/data/scraped/provider-summary.json (written by the quote scrapers).
 *
 * Units — `avgMarkup` in that file is already a PERCENT, not a fraction. The
 * values sanity-check against how these services are known to price:
 *   wise -0.0015%   (mid-market, no markup)      instarem 0.49%
 *   moneygram 0.84%   remitly 1.17%              banks 2.1-4.0%
 *   paypal 4.58%      rakuten-jp 8.00%
 * Reading it as a fraction would claim PayPal charges a 458% markup.
 *
 * `avgFee` from the same file is deliberately NOT surfaced: it is denominated in
 * each provider's own send currency, so 3500 (smbc-jp, JPY) and 1 (icici-bank)
 * are not comparable and would be nonsense next to each other on a page.
 *
 * Only 28 of the 55 providers appear in the summary; the rest have no scraped
 * coverage yet. Callers must handle undefined — the profile simply omits the
 * measured sentence rather than inventing a number.
 */

import providerSummary from "@/data/scraped/provider-summary.json";

interface SummaryRow {
  slug: string;
  corridors: number;
  avgMarkup: number;
  avgFee: number;
}

export interface MeasuredMarkup {
  /** Mean distance from the mid-market rate, in percent. */
  markupPct: number;
  /** How many corridors that mean is taken over. */
  corridors: number;
}

/**
 * providers.ts slugs that name the same company as a differently-slugged row in
 * the scrape summary. Only unambiguous 1:1 pairs — the multi-entity banks
 * (hsbc-sg / hsbc-hk / hsbc) are resolved by the prefix rule below instead.
 */
const SLUG_ALIASES: Record<string, string> = {
  "commonwealth-bank": "commonwealth-bank-of-australia",
  santander: "santander-uk",
  sbi: "sbi-remit",
};

const normalise = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

const bySlug = new Map<string, SummaryRow>();
for (const row of providerSummary as SummaryRow[]) {
  bySlug.set(normalise(row.slug), row);
}

export function getMeasuredMarkup(slug: string): MeasuredMarkup | undefined {
  const key = normalise(SLUG_ALIASES[slug] ?? slug);
  let row = bySlug.get(key);

  // Regional entities are slugged per market in the summary (hsbc-sg, hsbc-hk)
  // but once in providers.ts. Accept a prefix match only when it is
  // unambiguous, so "hsbc" never silently resolves to whichever came first.
  if (!row) {
    const candidates = (providerSummary as SummaryRow[]).filter((r) =>
      normalise(r.slug).startsWith(key),
    );
    if (candidates.length === 1) row = candidates[0];
  }

  if (!row || typeof row.avgMarkup !== "number" || !Number.isFinite(row.avgMarkup)) {
    return undefined;
  }
  // A single-corridor mean is too thin to publish as a characterisation of how
  // a provider prices.
  if (!row.corridors || row.corridors < 3) return undefined;

  return { markupPct: row.avgMarkup, corridors: row.corridors };
}
