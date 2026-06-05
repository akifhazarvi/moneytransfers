import { readdirSync, statSync } from "fs";
import { join } from "path";

// Fallback when no scraped data is present (e.g. a fresh checkout or CI
// without scrape artifacts). Matches STATIC_HUB_DATE in sitemap.ts.
const FALLBACK_DATE = "2026-03-28";

/**
 * The date the site's live comparison data last changed, derived from the
 * most recently modified scraped-quotes file. This is the site's primary
 * content, so it is the correct source of truth for freshness signals —
 * `WebSite.dateModified` (layout schema) and `lastmod` on data-driven
 * sitemap entries both read from here.
 *
 * Evaluated at build time on the server (uses `fs`). Do not import into a
 * client component.
 */
export function getDataUpdatedDate(): string {
  const scrapedDir = join(process.cwd(), "src/data/scraped");
  let latest = new Date(0);
  try {
    const files = readdirSync(scrapedDir).filter((f) => f.endsWith("-quotes.json"));
    for (const file of files) {
      try {
        const mtime = statSync(join(scrapedDir, file)).mtime;
        if (mtime > latest) latest = mtime;
      } catch {
        // file may have been removed mid-read — skip
      }
    }
  } catch {
    // scrapedDir missing — fall through to FALLBACK_DATE
  }
  return latest.getTime() > 0 ? latest.toISOString().split("T")[0] : FALLBACK_DATE;
}
