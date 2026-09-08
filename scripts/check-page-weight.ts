/**
 * Reports the heaviest prerendered pages and fails on a blowup.
 *
 * WHY THIS EXISTS
 * Passing `blogPosts` to the guides grid once put 2.38 MB of article HTML into
 * /guides — 1,251 words of visible text delivered as megabytes of RSC flight
 * payload. Nothing caught it; it was found by reading the built output by hand.
 * Client components serialise every prop into the page, so a single careless
 * prop at a client boundary can multiply a page's weight without changing a
 * line of visible content.
 *
 * WHAT IT DOES NOT DO
 * It does not enforce the CURRENT sizes. Measured 2026-09-07 the corridor
 * family runs 0.16-1.35 MB (median 0.54 MB), and the heaviest page is 56% flight
 * payload against 41 KB of visible text. That is worth fixing, but it is an
 * architectural change to the highest-traffic template and there is no field
 * Core Web Vitals data to say it currently hurts. Pinning the threshold at
 * today's maximum would fail the build on any ordinary addition and get the
 * guard disabled.
 *
 * So the limit is set well above today's worst page: it catches a regression of
 * the /guides kind (a 2 MB+ page) while leaving normal work alone. Tighten it
 * when the flight payload is actually reduced.
 *
 * Run: npm run check:weight       (--top N to list more)
 */
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(process.cwd(), ".next", "server", "app");
/** Fail above this. Chosen to catch a blowup, not to freeze current sizes. */
const HARD_LIMIT_MB = 2.0;
/** Flag for review above this, without failing. */
const WARN_MB = 1.5;

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

const files = walk(ROOT);
if (files.length === 0) {
  console.error("check:weight — no prerendered HTML found. Run `npm run build` first.");
  process.exit(1);
}

const pages = files
  .map((f) => ({ path: f.replace(ROOT, "").replace(/\.html$/, "") || "/", bytes: statSync(f).size, file: f }))
  .sort((a, b) => b.bytes - a.bytes);

const mb = (n: number) => n / 1024 / 1024;
const topN = Number(process.argv[process.argv.indexOf("--top") + 1]) || 10;

console.log(`check:weight — ${pages.length} prerendered pages\n`);
console.log("heaviest:");
for (const p of pages.slice(0, topN)) {
  console.log(`  ${mb(p.bytes).toFixed(2)} MB  ${p.path}`);
}

// How much of the worst page is serialised React payload rather than content?
const worst = pages[0];
const html = readFileSync(worst.file, "utf8");
const flight = (html.match(/<script[^>]*>[\s\S]*?<\/script>/g) ?? [])
  .filter((s) => s.includes("self.__next_f"))
  .reduce((n, s) => n + s.length, 0);
const visible = html
  .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "")
  .replace(/<[^>]+>/g, "").length;
console.log(
  `\nworst page ${worst.path}: ${(flight / worst.bytes * 100).toFixed(0)}% RSC flight payload, ` +
  `${(visible / 1024).toFixed(0)} KB visible text`,
);

const total = pages.reduce((n, p) => n + p.bytes, 0);
console.log(`median ${mb(pages[Math.floor(pages.length / 2)].bytes).toFixed(2)} MB · total ${mb(total).toFixed(0)} MB`);

const over = pages.filter((p) => mb(p.bytes) > HARD_LIMIT_MB);
const warn = pages.filter((p) => mb(p.bytes) > WARN_MB && mb(p.bytes) <= HARD_LIMIT_MB);

if (warn.length) {
  console.log(`\n${warn.length} page(s) above ${WARN_MB} MB — worth a look, not failing:`);
  for (const p of warn.slice(0, 10)) console.log(`  ${mb(p.bytes).toFixed(2)} MB  ${p.path}`);
}

if (over.length) {
  console.error(`\ncheck:weight — ${over.length} page(s) over the ${HARD_LIMIT_MB} MB limit:\n`);
  for (const p of over) console.error(`  ${mb(p.bytes).toFixed(2)} MB  ${p.path}`);
  console.error(
    `\nAlmost always a prop crossing a client-component boundary: a server component\n` +
    `handed a large object to a "use client" child, which serialises all of it into\n` +
    `the HTML. Project the data to the fields actually rendered before passing it.`,
  );
  process.exit(1);
}

console.log(`\ncheck:weight ok — no page over ${HARD_LIMIT_MB} MB`);
