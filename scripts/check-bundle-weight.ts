/**
 * Reports the heaviest CLIENT JS payload per prerendered page and fails on a blowup.
 *
 * WHY THIS EXISTS
 * check:weight measures prerendered HTML and was completely blind to the worst
 * performance defect this site has shipped. On 2026-09-18 /send-money served a
 * single `<script async>` chunk of 3.85 MB brotli / 33.5 MB parsed — 145x the
 * page's own 30.7 KB of HTML — and check:weight passed, because the HTML was
 * fine. The chunk was rate-insights.json (27 MB), pulled in because ProviderCard
 * ("use client") imported @/lib/route-map for one Set.has(), and route-map
 * imported @/lib/rate-history.
 *
 * A static JSON import is invisible in the HTML and invisible in source review.
 * It shows up only when you map a built page's chunk references to their file
 * sizes on disk, which is what this does.
 *
 * WHAT IT DOES NOT DO
 * It does not enforce current sizes. It is a blowup detector: the limit sits
 * well above today's heaviest page so ordinary work does not trip it, the same
 * philosophy as check:weight. Tighten it when bundles actually shrink.
 *
 * Run: npm run check:bundle       (--top N to list more)
 */
import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const APP_ROOT = join(process.cwd(), ".next", "server", "app");
const STATIC_ROOT = join(process.cwd(), ".next", "static");

/** Fail above this (parsed/uncompressed JS per page). Catches a blowup, not growth. */
const HARD_LIMIT_MB = 6.0;
/** Flag for review above this, without failing. */
const WARN_MB = 3.5;
/** A single chunk this large is a bundled dataset, whatever the page total says. */
const SINGLE_CHUNK_LIMIT_MB = 2.5;

const topArg = process.argv.indexOf("--top");
const TOP = topArg > -1 ? Number(process.argv[topArg + 1]) || 15 : 15;

function walk(dir: string, out: string[] = []): string[] {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const files = walk(APP_ROOT);
if (files.length === 0) {
  console.error("check:bundle — no prerendered HTML found. Run `npm run build` first.");
  process.exit(1);
}

const sizeCache = new Map<string, number>();
function chunkSize(rel: string): number {
  if (sizeCache.has(rel)) return sizeCache.get(rel) as number;
  // rel looks like /_next/static/chunks/abc.js[?dpl=...]
  const clean = rel.split("?")[0].replace(/^\/_next\/static\//, "");
  const p = join(STATIC_ROOT, clean);
  let size = 0;
  try {
    if (existsSync(p)) size = statSync(p).size;
  } catch {
    size = 0;
  }
  sizeCache.set(rel, size);
  return size;
}

const MB = 1024 * 1024;
type Row = { page: string; total: number; chunks: number; worst: [string, number] };
const rows: Row[] = [];

for (const f of files) {
  const html = readFileSync(f, "utf8");
  const refs = new Set(html.match(/\/_next\/static\/chunks\/[^"'?]+\.js/g) ?? []);
  let total = 0;
  let worst: [string, number] = ["", 0];
  for (const r of refs) {
    const s = chunkSize(r);
    total += s;
    if (s > worst[1]) worst = [r.split("/").pop() as string, s];
  }
  rows.push({
    page: "/" + f.slice(APP_ROOT.length + 1).replace(/\.html$/, ""),
    total,
    chunks: refs.size,
    worst,
  });
}

rows.sort((a, b) => b.total - a.total);

console.log(`check:bundle — client JS per prerendered page (${rows.length} pages)\n`);
console.log("      parsed JS   chunks   largest chunk            page");
for (const r of rows.slice(0, TOP)) {
  const flag = r.total > HARD_LIMIT_MB * MB ? "FAIL" : r.total > WARN_MB * MB ? "warn" : "    ";
  console.log(
    `${flag}  ${(r.total / MB).toFixed(2).padStart(7)} MB   ${String(r.chunks).padStart(4)}   ` +
      `${(r.worst[1] / MB).toFixed(2).padStart(6)} MB ${r.worst[0].slice(0, 22).padEnd(22)} ${r.page}`,
  );
}

const overPage = rows.filter((r) => r.total > HARD_LIMIT_MB * MB);
const overChunk = rows.filter((r) => r.worst[1] > SINGLE_CHUNK_LIMIT_MB * MB);

if (overPage.length === 0 && overChunk.length === 0) {
  const heaviest = rows[0];
  console.log(
    `\nOK — heaviest page ${(heaviest.total / MB).toFixed(2)} MB (limit ${HARD_LIMIT_MB} MB), ` +
      `largest single chunk ${(heaviest.worst[1] / MB).toFixed(2)} MB (limit ${SINGLE_CHUNK_LIMIT_MB} MB).`,
  );
  process.exit(0);
}

console.error("\ncheck:bundle FAILED\n");
for (const r of overPage) {
  console.error(`  ${r.page} ships ${(r.total / MB).toFixed(2)} MB of client JS (limit ${HARD_LIMIT_MB} MB)`);
}
for (const r of overChunk) {
  console.error(
    `  ${r.page} loads a single ${(r.worst[1] / MB).toFixed(2)} MB chunk (${r.worst[0]}) — ` +
      `limit ${SINGLE_CHUNK_LIMIT_MB} MB`,
  );
}
console.error(
  "\n  A chunk this size is almost always a static JSON import that reached a\n" +
    '  "use client" module. Find it with:\n' +
    "    grep -o 'JSON.parse' .next/static/chunks/<chunk>.js | head\n" +
    "  then trace which client component imports the module that reads it.\n" +
    "  No client file may import @/lib/route-map, @/lib/rate-history or\n" +
    "  @/data/swift-codes — see src/lib/company-route.ts for the split pattern.",
);
process.exit(1);
