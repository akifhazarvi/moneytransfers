import { readdirSync, readFileSync } from "fs";
import { join } from "path";

// Fallback when no scraped data is present (e.g. a fresh checkout or CI
// without scrape artifacts). Matches STATIC_HUB_DATE in sitemap.ts.
const FALLBACK_DATE = "2026-03-28";

/**
 * The date the site's live comparison data was collected.
 *
 * Read from the `dateCollected` values INSIDE the scraped quote files, never
 * from file mtimes. Vercel normalises every mtime to 2018-10-20T00:00:00Z in
 * build containers for reproducibility, and the previous mtime-based version had
 * no guard for that sentinel — so in production this returned "2018-10-20" and
 * stamped it onto `WebSite.dateModified` and every data-driven sitemap `lastmod`,
 * six years before the site existed. Reading the data itself is immune: the value
 * travels with the rows, so it is identical locally, in CI and on Vercel.
 *
 * Scanned with a regex rather than JSON.parse — these files total several MB and
 * we only need one field, so parsing them fully at build time would be wasteful.
 * ISO-8601 dates sort lexicographically, so a string compare finds the newest.
 *
 * Evaluated at build time on the server (uses `fs`). Do not import into a
 * client component.
 */
function latestCollectedDate(): string | null {
  const scrapedDir = join(process.cwd(), "src/data/scraped");
  const DATE_RE = /"dateCollected"\s*:\s*"(\d{4}-\d{2}-\d{2})/g;
  let latest: string | null = null;
  try {
    for (const file of readdirSync(scrapedDir)) {
      if (!file.endsWith("-quotes.json")) continue;
      try {
        const text = readFileSync(join(scrapedDir, file), "utf-8");
        DATE_RE.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = DATE_RE.exec(text)) !== null) {
          if (!latest || match[1] > latest) latest = match[1];
        }
      } catch {
        // file may have been removed mid-read — skip
      }
    }
  } catch {
    // scrapedDir missing — caller falls back
  }
  return latest;
}

let cached: string | null | undefined;
function collectedDate(): string | null {
  if (cached === undefined) cached = latestCollectedDate();
  return cached;
}

/** Data collection date as YYYY-MM-DD, for schema dateModified and sitemap lastmod. */
export function getDataUpdatedDate(): string {
  return collectedDate() ?? FALLBACK_DATE;
}

/**
 * Data collection date as a full ISO timestamp, for schemas that want one.
 * Replaces the duplicated getDataFreshnessISO() helpers that lived in
 * send-money/[corridor] and banks/[slug], each with its own copy of the Vercel
 * mtime workaround — no longer needed now the date comes from the data.
 */
export function getDataUpdatedISO(): string {
  const date = collectedDate();
  if (date) return `${date}T00:00:00.000Z`;
  return process.env.NEXT_PUBLIC_BUILD_TIME ?? `${FALLBACK_DATE}T00:00:00.000Z`;
}
