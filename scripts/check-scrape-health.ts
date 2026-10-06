/**
 * Scrape health gate — judges each scraper by its OUTPUT, not its step status.
 *
 * Every scraper step runs with `continue-on-error: true`, so a timed-out or
 * crashed scraper still shows a green check. That is how Remitly (killed at its
 * 5-minute cap) and RemitRoutes (killed at 10) ran "successfully" on nearly
 * every run for days in September 2026 while RemitRoutes committed nothing
 * after Sep 25. This compares each output file with the version in HEAD (the
 * data this run started from) and reports:
 *
 *   error    file not rewritten this run (scraper died before writing)
 *   error    zero rows where HEAD had some
 *   error    row count fell by more than half
 *   warning  row count fell by more than a quarter
 *   error    a provider slug with no destination in src/lib/affiliate.ts — its
 *            /go link would send the reader back to our own /send-money
 *
 * Writes a table to $GITHUB_STEP_SUMMARY, emits ::error/::warning annotations,
 * and exits 1 on any error. Workflows run it with continue-on-error *before*
 * committing (so the data still ships) and fail the run at the very end.
 *
 * Usage: npx tsx scripts/check-scrape-health.ts ofx-quotes.json remitly-quotes.json …
 */
import * as fs from "fs";
import * as path from "path";
import { execFileSync } from "child_process";
import { getAffiliateUrl } from "../src/lib/affiliate";

const SCRAPED = "src/data/scraped";
const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("usage: check-scrape-health.ts <file in src/data/scraped> …");
  process.exit(2);
}

function countRows(json: unknown): number {
  if (Array.isArray(json)) return json.length;
  if (json && typeof json === "object") {
    const rates = (json as Record<string, unknown>).rates;
    if (rates && typeof rates === "object") return Object.keys(rates).length;
    return Object.keys(json).length;
  }
  return 0;
}

function headVersion(rel: string): string | null {
  try {
    return execFileSync("git", ["show", `HEAD:${rel}`], { encoding: "utf-8", maxBuffer: 256 * 1024 * 1024 });
  } catch {
    return null; // new file
  }
}

// A slug with no entry in affiliate.ts falls back to our own /send-money, so
// the review page's "Continue to <provider>" lands back on our comparison.
// Until 2026-10-06, 32 scraped slugs did (LemFi on 90 routes). The data still
// ships; the run fails so someone adds the destination.
function slugsWithoutDestination(json: unknown): string[] {
  const list = Array.isArray(json) ? json : (json as { quotes?: unknown } | null)?.quotes;
  if (!Array.isArray(list)) return [];
  const slugs = new Set<string>();
  for (const r of list) {
    const slug = (r as { providerSlug?: unknown } | null)?.providerSlug;
    if (typeof slug === "string" && slug) slugs.add(slug);
  }
  return [...slugs].filter((s) => getAffiliateUrl(s).startsWith("https://sendmoneycompare.com")).sort();
}

type Level = "ok" | "warning" | "error";
const rows: { file: string; before: number | null; after: number; level: Level; note: string }[] = [];

for (const file of files) {
  const rel = path.posix.join(SCRAPED, file);
  let current: string;
  try {
    current = fs.readFileSync(rel, "utf-8");
  } catch {
    rows.push({ file, before: null, after: 0, level: "error", note: "file missing" });
    continue;
  }
  let after = 0;
  let homeless: string[] = [];
  try {
    const json = JSON.parse(current);
    after = countRows(json);
    homeless = slugsWithoutDestination(json);
  } catch {
    rows.push({ file, before: null, after: 0, level: "error", note: "not valid JSON" });
    continue;
  }
  const previous = headVersion(rel);
  const before = previous == null ? null : (() => { try { return countRows(JSON.parse(previous)); } catch { return null; } })();

  let level: Level = "ok";
  let note = "";
  if (previous != null && previous === current) {
    level = "error";
    note = "not rewritten this run — scraper died or timed out before writing";
  } else if (after === 0 && (before ?? 0) > 0) {
    level = "error";
    note = "wrote zero rows";
  } else if (before && after < before * 0.5) {
    level = "error";
    note = `rows fell ${Math.round((1 - after / before) * 100)}%`;
  } else if (before && after < before * 0.75) {
    level = "warning";
    note = `rows fell ${Math.round((1 - after / before) * 100)}%`;
  }
  if (homeless.length > 0) {
    level = "error";
    note = [note, `no destination in src/lib/affiliate.ts for ${homeless.join(", ")}`].filter(Boolean).join("; ");
  }
  rows.push({ file, before, after, level, note });
}

const icon: Record<Level, string> = { ok: "✅", warning: "⚠️", error: "❌" };
const table = [
  "### Scrape health",
  "",
  "| | File | Rows before | Rows after | Note |",
  "|---|---|---:|---:|---|",
  ...rows.map((r) => `| ${icon[r.level]} | ${r.file} | ${r.before ?? "—"} | ${r.after} | ${r.note} |`),
  "",
].join("\n");

console.log(table);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, table + "\n");
for (const r of rows) {
  if (r.level !== "ok") console.log(`::${r.level}::${r.file}: ${r.note}`);
}
process.exit(rows.some((r) => r.level === "error") ? 1 : 0);
