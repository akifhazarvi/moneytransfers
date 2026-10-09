/**
 * Every 301 the middleware issues lands on a rendered page in one hop.
 *
 * WHY (round-3 freelance brief §3.2, 2026-10-08)
 * Of 106 URLs answering 301, 9 led to a 410 (dead end), 6 to another redirect
 * (chain), 9 to the general /exchange-rates hub (soft 404) and 78 into a
 * different country's corridor. Acceptance: "every 301 has an HTTP 200
 * destination, takes one hop, and preserves the same intent". Intent is
 * decided where the maps are written (gone-*.ts); this asserts the mechanics:
 * the target is prerendered and is not itself retired.
 *
 * Sources checked: every key of every redirect map, the reverse direction of
 * every built /compare page, and the /fr and /es variant of each (retired
 * locale prefixes resolve the English path first — src/middleware.ts).
 *
 * Usage: npx tsx scripts/check-redirects.ts [--report]   (after `next build`)
 */
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { GONE, retiredAnswer } from "../src/lib/retired-urls";
import { DUPLICATE_CORRIDOR_REDIRECTS, corridorPageRenders } from "../src/lib/gone-corridors";
import { RATE_PAIR_REDIRECTS, RATE_HISTORY_REDIRECTS } from "../src/lib/gone-rate-pairs";
import { NEWS_REDIRECTS } from "../src/lib/gone-news";

const APP = join(__dirname, "../.next/server/app");
const REPORT_ONLY = process.argv.includes("--report");
if (!existsSync(APP)) {
  console.error("check:redirects needs a build first — run `npm run build`.");
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

const rendered = new Set<string>();
for (const f of walk(APP)) {
  let r = f.slice(APP.length).replace(/\.html$/, "");
  if (r.startsWith("/en/")) r = r.slice(3);
  else if (r === "/en") r = "/";
  else continue;
  rendered.add(r.replace(/\/$/, "") || "/");
}

const sources = new Set<string>([
  ...[...RATE_PAIR_REDIRECTS.keys()].map((k) => `/exchange-rates/${k}`),
  ...[...RATE_HISTORY_REDIRECTS.keys()].map((k) => `/exchange-rates/history/${k}`),
  ...[...NEWS_REDIRECTS.keys()].map((k) => `/news/${k}`),
  ...[...DUPLICATE_CORRIDOR_REDIRECTS.keys()].map((k) => `/send-money/${k}`),
]);
sources.add("/comparison");
for (const p of rendered) {
  const m = p.match(/^\/compare\/(.+)-vs-(.+)$/);
  if (m) {
    sources.add(`/compare/${m[2]}-vs-${m[1]}`);
    sources.add(`/comparison/${m[1]}-vs-${m[2]}`);
    sources.add(`/comparison/${m[2]}-vs-${m[1]}`);
  }
}
for (const s of [...sources]) {
  sources.add(`/fr${s}`);
  sources.add(`/es${s}`);
}

/** What middleware answers for a path: 410, a 301 location, or pass-through. */
function answerFor(path: string): { status: 410 } | { status: 301; location: string } | { status: 200 } {
  const locale = path.match(/^\/(en|es|fr|pt)(\/|$)/);
  if (locale) {
    const english = path.replace(/^\/(en|es|fr|pt)(\/|$)/, "/");
    const a = retiredAnswer(english);
    const corridor = english.match(/^\/send-money\/([a-z0-9-]+)$/);
    if (a === GONE || (!a && corridor && !corridorPageRenders(corridor[1]))) return { status: 410 };
    return { status: 301, location: a ?? english };
  }
  const a = retiredAnswer(path);
  if (a === GONE) return { status: 410 };
  if (a) return { status: 301, location: a };
  return { status: 200 };
}

const failures: string[] = [];
let redirects = 0;
for (const source of [...sources].sort()) {
  const first = answerFor(source);
  if (first.status !== 301) continue;
  redirects++;
  const target = first.location.replace(/\/$/, "") || "/";
  const second = answerFor(target);
  if (second.status === 301) failures.push(`${source} → ${target} → ${second.location}  (chain)`);
  else if (second.status === 410) failures.push(`${source} → ${target}  (target is 410)`);
  else if (!rendered.has(target)) failures.push(`${source} → ${target}  (target not prerendered)`);
}

console.log(`check:redirects — ${sources.size} sources, ${redirects} redirect(s), ${failures.length} failure(s)`);
for (const f of failures.slice(0, 40)) console.log(`  ✗ ${f}`);
if (failures.length > 40) console.log(`  … ${failures.length - 40} more`);
if (failures.length && !REPORT_ONLY) process.exit(1);
if (!failures.length) console.log("✓ every redirect is one hop to a rendered page");
