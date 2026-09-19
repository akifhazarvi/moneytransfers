/**
 * Bakes COVERAGE's display strings into a small JSON so CLIENT components can
 * read them without dragging the quote corpus into the browser.
 *
 * COVERAGE lives in src/lib/site-stats.ts, which computes liveProviders from
 * unified-quotes — and unified-quotes statically imports every scraped quote
 * file. So a "use client" component importing COVERAGE for one string pulled
 * ~8 MB of JSON into its bundle. /currency-converter shipped 7.71 MB of client
 * JS, 6.81 MB of it a single chunk holding ~19,589 quote records, for the sake
 * of the phrase "90+ providers".
 *
 * site-stats.ts remains the single source of truth: this script imports it and
 * writes what it computed, so the two cannot drift. Server components should
 * keep importing site-stats directly — only client components need the lean
 * module (src/lib/coverage.ts).
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { COVERAGE } from "../src/lib/site-stats";

const OUT = join(process.cwd(), "src/data/scraped/site-coverage.json");

const payload = { ...COVERAGE };

for (const [k, v] of Object.entries(payload)) {
  if (typeof v !== "string" || !v.trim() || /undefined|NaN/.test(v)) {
    throw new Error(`build-site-coverage: COVERAGE.${k} is not usable copy: ${JSON.stringify(v)}`);
  }
}

writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
console.log(`build-site-coverage: wrote ${Object.keys(payload).length} phrases to src/data/scraped/site-coverage.json`);
