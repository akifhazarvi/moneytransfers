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
function latestCollectedTimestamp(): string | null {
  const scrapedDir = join(process.cwd(), "src/data/scraped");
  // Captures the FULL timestamp ("2026-08-20T00:44:13.231Z"), not just the
  // date. getDataUpdatedDate() slices it back down, so sitemap lastmod and
  // schema dateModified are unaffected — but getDataVersion() needs the
  // sub-day precision, because three scrape workflows land on the same date
  // and the alert evaluator must tell them apart.
  const DATE_RE = /"dateCollected"\s*:\s*"(\d{4}-\d{2}-\d{2}[^"]*)"/g;
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
function collectedTimestamp(): string | null {
  if (cached === undefined) cached = latestCollectedTimestamp();
  return cached;
}

/** Date portion only, for the callers that want YYYY-MM-DD. */
function collectedDate(): string | null {
  return collectedTimestamp()?.slice(0, 10) ?? null;
}

/** Data collection date as YYYY-MM-DD, for schema dateModified and sitemap lastmod. */
export function getDataUpdatedDate(): string {
  return collectedDate() ?? FALLBACK_DATE;
}

/**
 * Precise version stamp for the currently-deployed quote dataset.
 *
 * Exists because quote data is build-time embedded: quotes-engine.ts statically
 * imports the whole dataset, so generateQuotes() only ever sees what shipped
 * with this deployment. Fresh numbers arrive when a deploy completes — the three
 * scrape workflows each fire VERCEL_DEPLOY_HOOK, since vercel-ignore.sh skips
 * the normal build for data-only commits — and never on a schedule we control.
 *
 * So the alert evaluator cannot run on a wall clock without racing the deploy.
 * Instead it stores this value per alert and skips any alert already evaluated
 * at the deployment's current version. That makes an hourly cron harmless (real
 * work happens only on the ~3 runs a day that carry new numbers), a late deploy
 * self-healing, and a half-finished run resumable.
 *
 * Unlike getDataUpdatedDate() this keeps sub-day precision, which is required:
 * all three daily scrapes share a calendar date.
 *
 * Falls back to the build time, then the static fallback date, so the value is
 * never empty — an empty version would make every alert look unevaluated.
 */
export function getDataVersion(): string {
  return (
    collectedTimestamp() ??
    process.env.NEXT_PUBLIC_BUILD_TIME ??
    `${FALLBACK_DATE}T00:00:00.000Z`
  );
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

/**
 * Full ISO instant of the most recent scrape, for anything shown to a reader.
 *
 * Distinct from getDataUpdatedISO(), which truncates to midnight — fine for a
 * schema `dateModified` that only needs a day, wrong for a visible "updated at"
 * stamp, where it renders "00:00 UTC" and implies a scrape that never happened.
 * Falls back to the midnight form only when no timestamp can be recovered.
 */
export function getDataUpdatedInstant(): string {
  return collectedTimestamp() ?? getDataUpdatedISO();
}
