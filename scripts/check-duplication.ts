/**
 * Measures near-duplicate content across every prerendered page, and fails the
 * build when a page's duplicate share exceeds the threshold the content brief
 * sets.
 *
 * WHY
 * The Sep 2026 content brief ("Content_Links_Brief_sendmoneycompare_EN.docx")
 * diagnosed scaled-content abuse from a SiteLiner scan: 23% site-wide
 * duplication, 167 pages with matches, 37 above the 30% action threshold. Its
 * §10-A step 7 requires re-scanning after each rewrite so that "each processed
 * page's match % must drop below 30%".
 *
 * SiteLiner's free crawl stops at 250 URLs, so those figures are a sample of
 * 167 of our 1,326 pages — and they sampled the good ones. Measured across the
 * whole build the same way, site-wide duplication was 79.5%, with 1,237 pages
 * above 30% and a median corridor page at 98.3% duplicate / 39 unique words.
 * A third-party sampler cannot be the acceptance test for a fix it cannot see
 * most of, so this reimplements the measurement over what we actually ship.
 *
 * METHOD
 * Word-level 10-gram shingling over <main> text, which is what SiteLiner
 * approximates. A word counts as duplicate when any shingle covering it also
 * occurs on another page. Reported as: duplicate share (SiteLiner's "match %")
 * and unique words (what the page contributes that no other page does).
 *
 * The build HTML streams Suspense content into <div hidden> and splices it over
 * a <template> via $RC(). Without replaying that splice, <main> looks nearly
 * empty and every page scores as unique — the same trap documented in
 * scripts/check-crawl-paths.mjs.
 *
 * Usage:
 *   npx tsx scripts/check-duplication.ts            # after `next build`
 *   npx tsx scripts/check-duplication.ts --report   # print, never exit non-zero
 *   npx tsx scripts/check-duplication.ts --section /send-money
 *   npx tsx scripts/check-duplication.ts --blocks   # show the repeated passages
 */
import { readFileSync, readdirSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "..");
const APP = join(ROOT, ".next/server/app");
const REPORT_ONLY = process.argv.includes("--report");
const SHOW_BLOCKS = process.argv.includes("--blocks");
const SECTION = (() => {
  const i = process.argv.indexOf("--section");
  return i >= 0 ? process.argv[i + 1] : null;
})();

/** Shingle width. 10 words is long enough that ordinary phrasing collides rarely. */
const N = 10;

/** The brief's action threshold: a page above this is "to rewrite". */
const MATCH_THRESHOLD = 30;

/**
 * Minimum words a page must contribute that appear on no other page. The brief
 * §10-A: "For pages with no unique data available, do not generate them at all".
 * This is that rule made measurable.
 */
const MIN_UNIQUE_WORDS = 50;

if (!existsSync(APP)) {
  console.error("check:duplication needs a build first — run `npm run build`.");
  process.exit(1);
}

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

/** Replay React's streaming splice so <main> holds the content users see. */
function resolveStreamed(html: string): string {
  for (const [, b, s] of html.matchAll(/\$RC\("([^"]+)","([^"]+)"\)/g)) {
    const src = new RegExp(`<div hidden id="${s}">([\\s\\S]*?)</div><script`, "i").exec(html);
    if (!src) continue;
    html = html.replace(new RegExp(`<template id="${b}"></template>`, "i"), src[1]);
  }
  return html;
}

function mainText(html: string): string {
  html = resolveStreamed(html);
  const m = /<main[^>]*>([\s\S]*)<\/main>/i.exec(html);
  return (m ? m[1] : html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type Page = { route: string; words: string[] };

const pages: Page[] = [];
for (const f of walk(APP)) {
  const rel = f.slice(APP.length);
  // One locale only: the others are translations of the same text and would
  // register as duplicates of each other for reasons no rewrite can fix.
  if (!rel.startsWith("/en/") && rel !== "/en.html") continue;
  const route = rel === "/en.html" ? "/" : rel.replace(/\.html$/, "").slice(3);
  const words = mainText(readFileSync(f, "utf8"))
    .toLowerCase()
    .replace(/[^a-z0-9$€£₹%.\-\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length < 50) continue;
  pages.push({ route, words });
}

/** shingle -> indices of the pages carrying it */
const index = new Map<string, Set<number>>();
pages.forEach((p, i) => {
  const seen = new Set<string>();
  for (let k = 0; k + N <= p.words.length; k++) {
    const sh = p.words.slice(k, k + N).join(" ");
    if (seen.has(sh)) continue;
    seen.add(sh);
    let s = index.get(sh);
    if (!s) index.set(sh, (s = new Set()));
    s.add(i);
  }
});

type Result = { route: string; words: number; dup: number; pct: number; unique: number };

const results: Result[] = pages.map((p) => {
  const dup = new Uint8Array(p.words.length);
  for (let k = 0; k + N <= p.words.length; k++) {
    if (index.get(p.words.slice(k, k + N).join(" "))!.size > 1) {
      for (let j = k; j < k + N; j++) dup[j] = 1;
    }
  }
  const d = dup.reduce((a: number, b) => a + b, 0);
  return {
    route: p.route,
    words: p.words.length,
    dup: d,
    pct: +((d / p.words.length) * 100).toFixed(1),
    unique: p.words.length - d,
  };
});

const scoped = SECTION ? results.filter((r) => r.route.startsWith(SECTION)) : results;
scoped.sort((a, b) => a.unique - b.unique);

const totalW = scoped.reduce((a, r) => a + r.words, 0);
const totalD = scoped.reduce((a, r) => a + r.dup, 0);
const sitewide = +((totalD / totalW) * 100).toFixed(1);

const overThreshold = scoped.filter((r) => r.pct >= MATCH_THRESHOLD);
const underUnique = scoped.filter((r) => r.unique < MIN_UNIQUE_WORDS);

console.log(`\nDuplicate content — ${scoped.length} pages${SECTION ? ` under ${SECTION}` : ""}`);
console.log(`  site-wide duplicate share : ${sitewide}%   (brief's SiteLiner sample: 23%)`);
console.log(`  pages >= ${MATCH_THRESHOLD}% match         : ${overThreshold.length}`);
console.log(`  pages < ${MIN_UNIQUE_WORDS} unique words    : ${underUnique.length}`);

const bySection = new Map<string, Result[]>();
for (const r of scoped) {
  const key = r.route.startsWith("/send-money/") ? "/send-money" : "/" + (r.route.split("/")[1] || "");
  (bySection.get(key) ?? bySection.set(key, []).get(key)!).push(r);
}
console.log(`\n  ${"section".padEnd(18)}${"pages".padStart(6)}${"med uniq".padStart(10)}${"med dup%".padStart(10)}${" <50uw".padStart(8)}`);
for (const [s, a] of [...bySection].sort((x, y) => y[1].length - x[1].length)) {
  const u = a.map((x) => x.unique).sort((x, y) => x - y);
  const d = a.map((x) => x.pct).sort((x, y) => x - y);
  console.log(
    `  ${s.padEnd(18)}${String(a.length).padStart(6)}${String(u[u.length >> 1]).padStart(10)}` +
      `${String(d[d.length >> 1]).padStart(10)}${String(a.filter((x) => x.unique < MIN_UNIQUE_WORDS).length).padStart(8)}`,
  );
}

if (underUnique.length) {
  console.log(`\n  Least unique pages (brief §10-A: "do not generate them at all"):`);
  for (const r of underUnique.slice(0, 25)) {
    console.log(`    ${String(r.unique).padStart(4)} unique words  ${String(r.pct).padStart(5)}% dup  ${r.route}`);
  }
  if (underUnique.length > 25) console.log(`    … and ${underUnique.length - 25} more`);
}

if (SHOW_BLOCKS) {
  const heavy = [...index.entries()].filter(([, s]) => s.size >= 5).sort((a, b) => b[1].size - a[1].size);
  const printed = new Set<string>();
  console.log(`\n  Most-repeated passages:`);
  for (const [sh, s] of heavy) {
    const head = sh.split(" ").slice(0, 5).join(" ");
    if (printed.has(head)) continue;
    printed.add(head);
    console.log(`    ${String(s.size).padStart(4)} pages | ${sh}`);
    if (printed.size >= 40) break;
  }
}

writeFileSync(
  join(ROOT, "duplication-report.json"),
  JSON.stringify({ generated: new Date().toISOString(), sitewide, pages: scoped }, null, 1),
);
console.log(`\n  wrote duplication-report.json`);

if (REPORT_ONLY) process.exit(0);

if (underUnique.length) {
  console.error(
    `\n✗ ${underUnique.length} page(s) contribute fewer than ${MIN_UNIQUE_WORDS} words found nowhere else.\n` +
      `  The content brief's generation threshold: only build a page when unique data exists for it.\n` +
      `  Either give these pages their own data, or stop generating them (src/lib/gone-corridors.ts).\n`,
  );
  process.exit(1);
}

console.log(`\n✓ every page clears ${MIN_UNIQUE_WORDS} unique words\n`);
