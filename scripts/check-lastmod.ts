/**
 * A submitted URL's <lastmod> equals the "Updated" date its page shows.
 *
 * WHY
 * The round-3 freelance QA (2026-10-09, checklist item 7) read the visible
 * date on every URL in sitemap-google.xml against its lastmod and found two
 * families that disagreed: 16 /swift-codes pages printed the build date
 * ("Updated October 9, 2026") over a lastmod of 2026-03-28, and 11 /travel
 * pages printed "Updated 2026-06-11" over the 2026-09-24 they were reopened.
 * Either the page or the sitemap is then wrong about when the content
 * changed, and a lastmod that disagrees with the page is the signal Google
 * learns to ignore (brief §6.1). Each page family now reads its date from one
 * constant shared with sitemap.ts (src/lib/content-dates.ts); this keeps them
 * from drifting apart again.
 *
 * What is asserted: for every URL in the built sitemap-google.xml whose
 * prerendered HTML shows "Updated <date>" or "Last updated: <date>" ("Month D, YYYY",
 * "YYYY-MM-DD", "D Month YYYY", or month-only "Month YYYY"), every such date
 * equals the lastmod day (month-only: the same month). Pages that show no
 * "Updated" date are listed, not failed — not every submitted page carries a
 * byline (legal pages, for one). A data timestamp must not say "Updated":
 * write "collected" or "as of", so the only "Updated" on a page is the date
 * its content last changed. A lowercase "updated" inside a sentence is not a
 * page date — "(Taptap Send, updated 16 September 2026)" cites a source's.
 *
 * Usage: npx tsx scripts/check-lastmod.ts [--report]   (needs a build; postbuild)
 *        CHECK_APP_DIR=<path to .next/server/app> to read another build.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const APP = process.env.CHECK_APP_DIR || join(__dirname, "..", ".next/server/app");
const REPORT_ONLY = process.argv.includes("--report");
const SITE = "https://sendmoneycompare.com";

const smBody = join(APP, "sitemap-google.xml.body");
if (!existsSync(smBody)) {
  console.error("check:lastmod needs a build first — run `npm run build`.");
  process.exit(1);
}

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const MONTH_RE = MONTHS.map((m) => m[0].toUpperCase() + m.slice(1)).join("|");
const pad = (n: number) => String(n).padStart(2, "0");

/** Every date printed after the word "updated", as yyyy-mm-dd or yyyy-mm (month-only). */
function updatedDates(text: string): string[] {
  const out: string[] = [];
  const re = new RegExp(
    String.raw`(?:\bUpdated|\b[Ll]ast updated):?\s+(?:on\s+)?(?:(\d{4})-(\d{2})-(\d{2})|(${MONTH_RE})\s+(\d{1,2}),?\s+(\d{4})|(\d{1,2})\s+(${MONTH_RE})\s+(\d{4})|(${MONTH_RE})\s+(\d{4}))`,
    "g",
  );
  for (const m of text.matchAll(re)) {
    if (m[1]) out.push(`${m[1]}-${m[2]}-${m[3]}`);
    else if (m[4]) out.push(`${m[6]}-${pad(MONTHS.indexOf(m[4].toLowerCase()) + 1)}-${pad(+m[5])}`);
    else if (m[7]) out.push(`${m[9]}-${pad(MONTHS.indexOf(m[8].toLowerCase()) + 1)}-${pad(+m[7])}`);
    else if (m[10]) out.push(`${m[11]}-${pad(MONTHS.indexOf(m[10].toLowerCase()) + 1)}`);
  }
  return [...new Set(out)];
}

function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<!-- -->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

const entries = [...readFileSync(smBody, "utf8").matchAll(/<loc>(.*?)<\/loc>\s*(?:<lastmod>(.*?)<\/lastmod>)?/g)].map((m) => ({
  path: m[1].slice(SITE.length) || "/",
  lastmod: (m[2] ?? "").slice(0, 10),
}));

const mismatches: string[] = [];
const undated: string[] = [];
const unrendered: string[] = [];
let matched = 0;
for (const { path, lastmod } of entries) {
  const file = join(APP, path === "/" ? "en.html" : `en${path}.html`);
  if (!existsSync(file)) {
    unrendered.push(path);
    continue;
  }
  const dates = updatedDates(visibleText(readFileSync(file, "utf8")));
  if (dates.length === 0) {
    undated.push(path);
    continue;
  }
  const wrong = dates.filter((d) => (d.length === 7 ? lastmod.slice(0, 7) !== d : lastmod !== d));
  if (wrong.length) mismatches.push(`${path}: lastmod ${lastmod || "(none)"}, page says Updated ${wrong.join(", ")}`);
  else matched++;
}

console.log(
  `check:lastmod — ${entries.length} URLs in sitemap-google.xml: ${matched} match their visible "Updated" date, ` +
    `${mismatches.length} disagree, ${undated.length} show none, ${unrendered.length} not prerendered.`,
);
if (undated.length) console.log(`  no visible "Updated" date (${undated.length}): ${undated.join(" ")}`);
if (unrendered.length) console.log(`  not prerendered (${unrendered.length}): ${unrendered.join(" ")}`);
if (mismatches.length) {
  console.error(`\n✗ lastmod ≠ visible "Updated" date (${mismatches.length}):`);
  for (const m of mismatches) console.error(`  ${m}`);
  console.error(
    "\nRead the page's date and the sitemap's from the same constant (src/lib/content-dates.ts), " +
      "and keep data timestamps off the word \"Updated\" (\"collected\", \"as of\").",
  );
  if (!REPORT_ONLY) process.exit(1);
}
