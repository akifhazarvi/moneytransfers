/**
 * Fails the build when the middleware bundle carries a dataset.
 *
 * WHY THIS EXISTS
 * The middleware runs before the CDN cache on every page request, cached pages
 * included, and every new instance parses its whole bundle first. From
 * 2026-09-20 to 2026-10-29 that bundle was 6.9 MB: middleware → retired-urls →
 * gone-corridors → corridor-tiers → unified-quotes pulled in every scraped
 * *-quotes.json, and each new instance merged them (~0.4 s CPU) to answer
 * "does this corridor render?". Fluid Active CPU per invocation rose 42 → 66 ms
 * the day it shipped, and CN/SG bot waves multiplied it. Nothing caught it:
 * check:bundle measures client JS, and a JSON import is invisible in review.
 *
 * Middleware reads src/lib/corridor-render-manifest.ts instead. This check
 * names the modules that must never reach it (via the chunks' source maps) and
 * caps the bundle's size, which catches a dataset the list does not name.
 *
 * Run: npx tsx scripts/check-middleware-bundle.ts   (postbuild)
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const NEXT = join(process.cwd(), ".next");
const MANIFEST = join(NEXT, "server", "middleware-manifest.json");

/** The bundle measured 6.9 MB with the quote files and 0.26 MB without them. */
const LIMIT_MB = 1;

/** Modules whose import chain ends in the scraped quote files. */
const FORBIDDEN = [
  /src\/data\/scraped\/[^/]+-quotes\.json/,
  /src\/data\/scraped\/rate-insights\.json/,
  /src\/lib\/(unified-quotes|quotes-engine|corridor-tiers|gone-corridors|route-map)\.ts/,
  /src\/data\/corridors\.ts/,
];

if (!existsSync(MANIFEST)) {
  console.error("check:middleware — .next/server/middleware-manifest.json not found. Run `npm run build` first.");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8")) as {
  middleware?: Record<string, { files?: string[] }>;
};
const files = [...new Set(Object.values(manifest.middleware ?? {}).flatMap((m) => m.files ?? []))];
if (files.length === 0) {
  console.log("check:middleware — no middleware in this build.");
  process.exit(0);
}

const MB = 1024 * 1024;
let total = 0;
const leaks = new Set<string>();
let mapped = 0;
for (const rel of files) {
  const p = join(NEXT, rel);
  if (!existsSync(p)) continue;
  total += statSync(p).size;
  if (!existsSync(`${p}.map`)) continue;
  mapped++;
  const { sources = [] } = JSON.parse(readFileSync(`${p}.map`, "utf8")) as { sources?: string[] };
  for (const s of sources) if (FORBIDDEN.some((re) => re.test(s))) leaks.add(s.replace(/^.*\[project\]\//, "").replace(/\.\[json\]\.cjs.*$/, ""));
}

const size = `${(total / MB).toFixed(2)} MB in ${files.length} files`;
if (total <= LIMIT_MB * MB && leaks.size === 0) {
  console.log(`check:middleware — OK, ${size} (limit ${LIMIT_MB} MB)${mapped ? "" : ", no source maps to scan"}.`);
  process.exit(0);
}

console.error(`\ncheck:middleware FAILED — middleware bundle is ${size} (limit ${LIMIT_MB} MB)`);
for (const s of [...leaks].sort()) console.error(`  carries ${s}`);
console.error(
  "\n  The middleware runs on every page request and every new instance parses\n" +
    "  this bundle first. Middleware imports may not reach the quote data: read\n" +
    "  corridor answers from src/lib/corridor-render-manifest.ts, never\n" +
    "  gone-corridors.ts, corridor-tiers.ts, route-map.ts or a scraped file.",
);
process.exit(1);
