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
 * Source: MEASURED_MARKUPS in remittance-cost-index.ts, computed from the live
 * quote set at build time. This used to read provider-summary.json, a file no
 * scraper regenerated after 2026-03-17, so every company page quoted a
 * six-month-old "measured" figure while the tables beside it were same-day.
 *
 * `markupPct` is a PERCENT, not a fraction (wise ≈ 0.5%, paypal ≈ 4.6%).
 * Reading it as a fraction would claim PayPal charges a 460% markup.
 *
 * Fees are deliberately NOT surfaced here: they are denominated in each
 * provider's own send currency, so ¥3,500 and $1 are not comparable and would
 * be nonsense next to each other on a page.
 *
 * Not every provider has scraped coverage. Callers must handle undefined — the
 * profile simply omits the measured sentence rather than inventing a number.
 */

import { MEASURED_MARKUPS, type MeasuredMarkup } from "@/lib/remittance-cost-index";

export type { MeasuredMarkup };

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

const bySlug = new Map<string, MeasuredMarkup>();
for (const [slug, row] of MEASURED_MARKUPS) {
  bySlug.set(normalise(slug), row);
}

export function getMeasuredMarkup(slug: string): MeasuredMarkup | undefined {
  const key = normalise(SLUG_ALIASES[slug] ?? slug);
  let row = bySlug.get(key);

  // Regional entities are slugged per market in the summary (hsbc-sg, hsbc-hk)
  // but once in providers.ts. Accept a prefix match only when it is
  // unambiguous, so "hsbc" never silently resolves to whichever came first.
  if (!row) {
    const candidates = [...MEASURED_MARKUPS.entries()].filter(([slug]) =>
      normalise(slug).startsWith(key),
    );
    if (candidates.length === 1) row = candidates[0][1];
  }

  if (!row || !Number.isFinite(row.markupPct)) return undefined;
  // A single-corridor mean is too thin to publish as a characterisation of how
  // a provider prices.
  if (row.corridors < 3) return undefined;

  return row;
}
