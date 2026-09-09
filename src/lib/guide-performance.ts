/**
 * Which guides readers actually reach — measured, not chosen.
 *
 * WHY THIS EXISTS
 * The hub leads with a "most read" block, and the failure mode for one of those
 * is an editor hand-picking five slugs that then go stale the moment anything
 * moves. This site already has an authority on which URLs earn demand, and
 * `sitemap-allowlists.ts` gates submission on it: the Bing Webmaster Tools page
 * export, whose view of the site is ~24x larger than Google's post-deindex. The
 * same export orders the block, so "top performing" means the pages that
 * measurably are, and dropping in a fresher export re-ranks the hub with no
 * edit to the hub.
 *
 * SOURCES
 *  - `bing-pages-may26.csv` — BWT Page Traffic report. 49 of the guides appear
 *    in it; every other guide scores zero and sorts below them.
 *  - `gsc-data-90d.json` — Google page+query rows, summed per page. Currently
 *    one guide row, but Google is the channel being recovered, so a guide that
 *    earns clicks there has them counted rather than discarded.
 *
 * RANKED ON CLICKS, NOT IMPRESSIONS. Impressions rank a guide nobody opens
 * above one readers actually read — `best-money-transfer-apps` carries 6,789
 * impressions for 32 clicks, `send-money-to-philippines-guide` 486 for 36.
 * Clicks are the reader-facing signal a "most read" rail is claiming to show;
 * impressions only break ties.
 *
 * NO FIGURES ARE PUBLISHED FROM HERE. The exports are point-in-time and the
 * hub is not, so the ordering is used and the counts are not — a rank stays
 * true for longer than "6,789 impressions" does. This is the same reason
 * `check:rankings` exists: a number on a page has to be one the data still
 * supports.
 *
 * DEGRADES TO NOTHING. A checkout without the export (or a malformed one) gets
 * an empty index, `rankByDemand` becomes a no-op, and callers fall back to
 * recency — the hub renders either way.
 *
 * Reads from disk at build time. Server-only: do not import into a client
 * component.
 */
import { readFileSync } from "fs";
import { join } from "path";
import gscData from "@/data/scraped/gsc-data-90d.json";

/** BWT Page Traffic export. Replace with a fresher one and the hub re-ranks. */
const BING_PAGE_EXPORT = "bing-pages-may26.csv";

const GUIDE_PATH = "/guides/";

export interface GuideDemand {
  /** Reader visits from search across both engines, over the export windows. */
  clicks: number;
  /** Search appearances. Tie-breaker only — see the note on ranking above. */
  impressions: number;
}

/** `"…/guides/foo"` -> `"foo"`; anything else -> null. */
function guideSlugFromUrl(url: string): string | null {
  const at = url.indexOf(GUIDE_PATH);
  if (at === -1) return null;
  const slug = url.slice(at + GUIDE_PATH.length).split(/[?#]/)[0].replace(/\/$/, "");
  return slug && !slug.includes("/") ? slug : null;
}

function addDemand(index: Map<string, GuideDemand>, slug: string, clicks: number, impressions: number) {
  const current = index.get(slug) ?? { clicks: 0, impressions: 0 };
  current.clicks += Number.isFinite(clicks) ? clicks : 0;
  current.impressions += Number.isFinite(impressions) ? impressions : 0;
  index.set(slug, current);
}

function readBingExport(index: Map<string, GuideDemand>) {
  let csv: string;
  try {
    csv = readFileSync(join(process.cwd(), "src/data/scraped", BING_PAGE_EXPORT), "utf-8");
  } catch {
    return; // no export in this checkout — callers fall back to recency
  }
  // "Page","Impressions","Clicks","CTR","Avg. Position" — every field is quoted
  // and none of them can contain a quote, so pulling the quoted runs out is
  // enough parsing for this file and avoids a CSV dependency.
  for (const line of csv.split(/\r?\n/).slice(1)) {
    const cells = line.match(/"[^"]*"/g);
    if (!cells || cells.length < 3) continue;
    const [page, impressions, clicks] = cells.map((cell) => cell.slice(1, -1));
    const slug = guideSlugFromUrl(page);
    if (slug) addDemand(index, slug, Number(clicks), Number(impressions));
  }
}

function readSearchConsole(index: Map<string, GuideDemand>) {
  // One row per page+query pair, so a page appearing under several queries is
  // summed rather than counted once.
  const rows = (gscData as { "90d_page_query"?: { page?: string; clicks?: number; impressions?: number }[] })["90d_page_query"] ?? [];
  for (const row of rows) {
    const slug = row.page ? guideSlugFromUrl(row.page) : null;
    if (slug) addDemand(index, slug, Number(row.clicks ?? 0), Number(row.impressions ?? 0));
  }
}

let cached: Map<string, GuideDemand> | undefined;

function demandIndex(): Map<string, GuideDemand> {
  if (!cached) {
    const index = new Map<string, GuideDemand>();
    readBingExport(index);
    readSearchConsole(index);
    cached = index;
  }
  return cached;
}

/** Measured search demand for one guide, or undefined if it earned none. */
export function guideDemand(slug: string): GuideDemand | undefined {
  return demandIndex().get(slug);
}

/** How many guides the exports carry any traffic for. */
export function measuredGuideCount(): number {
  return demandIndex().size;
}

/**
 * Most-read first: clicks, then impressions, then whatever order the caller
 * passed in — so pre-sorting by date gives "newest among equally-read", which
 * is what the unmeasured tail should fall back to.
 */
export function rankByDemand<T extends { slug: string }>(items: readonly T[]): T[] {
  const index = demandIndex();
  return items
    .map((item, position) => ({ item, position, demand: index.get(item.slug) }))
    .sort((a, b) =>
      (b.demand?.clicks ?? 0) - (a.demand?.clicks ?? 0) ||
      (b.demand?.impressions ?? 0) - (a.demand?.impressions ?? 0) ||
      a.position - b.position)
    .map((entry) => entry.item);
}
