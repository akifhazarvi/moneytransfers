/**
 * Build the indexable-route allowlist from measured duplication.
 *
 * Policy (owner decision, 2026-09-20): a page is submitted and indexable if
 * and only if its measured duplicate share is under DUP_THRESHOLD. Family no
 * longer decides it — a corridor page that says something of its own is in,
 * and a guide that mostly restates other guides is out.
 *
 * INPUT is duplication-report.json, written by `npm run check:duplication`
 * from the last build's rendered HTML (10-word shingles over main text). That
 * means this list LAGS ONE BUILD: it describes the pages as they rendered
 * last time. That is the same contract as every other derived file in
 * src/data/scraped, and it is why this is committed rather than computed at
 * request time.
 *
 * Order of operations when content changes materially:
 *   npm run build && npm run check:duplication && npm run build:indexable
 * then rebuild so the sitemap and robots pick the new set up.
 *
 * Locale variants are excluded — /es and /fr are noindexed separately and
 * would otherwise double every route.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const REPORT = join(ROOT, "duplication-report.json");
const OUT = join(ROOT, "src/data/scraped/indexable-routes.json");

/** Duplicate share at or above which a page stops being an index candidate. */
export const DUP_THRESHOLD = 30;

/**
 * Routes the duplication rule may never noindex.
 *
 * Guides and the research surfaces are exempt by owner decision: they are
 * written per page rather than rendered from a template, so a high shingle
 * overlap there reflects shared furniture (nav inside main, disclosures,
 * the provider table they all embed) rather than a page with nothing of its
 * own. The measure is a good filter for templated families and a bad one for
 * editorial, and applying it to guides would have noindexed 73 of 124.
 *
 * Also exempt: the homepage, the six navigation hubs, and the legal//about
 * pages, which must stay reachable and indexable whatever they measure.
 */
const ALWAYS_INDEXABLE_TOP = new Set<string>([
  "", // homepage
  "guides",
  "research",
  // original-research data surfaces linked from /research
  "sendscore", "provider-consistency", "remittance-cost-index",
  "transfer-cost-by-amount", "tools",
  // navigation hubs (hub pages only — children still face the rule)
  "send-money", "compare", "companies", "exchange-rates", "business",
  // editorial, legal and trust pages
  "about", "contact", "methodology", "how-we-review", "editorial-policy",
  "privacy-policy", "terms", "cookies", "disclaimer", "corrections", "for-ai",
  "currency-converter", "news",
]);

/** Hubs whose children are NOT automatically exempt. */
const HUB_ONLY = new Set<string>([
  "send-money", "compare", "companies", "exchange-rates", "business",
]);

function alwaysIndexable(route: string): boolean {
  const parts = route.replace(/^\/+/, "").replace(/\/$/, "").split("/").filter(Boolean);
  const top = parts[0] ?? "";
  if (!ALWAYS_INDEXABLE_TOP.has(top)) return false;
  if (parts.length > 1 && HUB_ONLY.has(top)) return false;
  return true;
}

type Row = { route: string; words: number; dup: number; pct: number; unique: number };

if (!existsSync(REPORT)) {
  console.error(
    "build:indexable — duplication-report.json not found.\n" +
      "  Run `npm run build && npm run check:duplication` first; this script\n" +
      "  reads that report rather than re-rendering the site itself.",
  );
  process.exit(1);
}

const report = JSON.parse(readFileSync(REPORT, "utf8")) as { pages: Row[]; generated: string };
const rows = report.pages.filter((r) => !r.route.startsWith("/es") && !r.route.startsWith("/fr"));
const keep = rows
  .filter((r) => alwaysIndexable(r.route) || r.pct < DUP_THRESHOLD)
  .map((r) => r.route)
  .sort();
const exempted = rows.filter((r) => alwaysIndexable(r.route) && r.pct >= DUP_THRESHOLD).length;

const totalWords = rows.filter((r) => keep.includes(r.route)).reduce((a, r) => a + r.words, 0);
const dupWords = rows.filter((r) => keep.includes(r.route)).reduce((a, r) => a + r.dup, 0);

writeFileSync(
  OUT,
  JSON.stringify(
    {
      generated: new Date().toISOString(),
      measuredFrom: report.generated,
      threshold: DUP_THRESHOLD,
      note:
        "Routes whose measured duplicate share is under the threshold. " +
        "Drives sitemap membership and robots via routeIsIndexable() in src/lib/seo-indexing.ts.",
      consideredRoutes: rows.length,
      indexableRoutes: keep.length,
      exemptOverThreshold: exempted,
      indexedSetDuplicatePct: totalWords ? Number(((100 * dupWords) / totalWords).toFixed(1)) : 0,
      routes: keep,
    },
    null,
    1,
  ) + "\n",
);

console.log(
  `build:indexable — ${keep.length} of ${rows.length} routes indexable ` +
    `(under ${DUP_THRESHOLD}% duplication, or exempt)\n` +
    `  ${exempted} exempt page(s) kept despite measuring at or above the threshold\n` +
    `  indexed-set duplicate share: ${totalWords ? ((100 * dupWords) / totalWords).toFixed(1) : 0}%`,
);
