/**
 * Fails the build if any prerendered page links to an internal URL that has no
 * page — or to one that only exists as a redirect.
 *
 * WHY
 * The 2026-09-02 audit found 4,196 internal links pointing at 404s and 410s,
 * and 1,330 more pointing at a URL that 301s to its canonical twin. None of it
 * showed up in the Semrush report, because its crawl stopped at 100 of ~1,300
 * pages. The cause was always the same: an href interpolated from data
 * (`/send-money/${c.slug}`) while the route itself is allowlisted and sets
 * `dynamicParams = false`, so anything outside the allowlist is a hard 404.
 *
 * This script closes the loop by comparing what the build LINKS TO against what
 * the build ACTUALLY RENDERED, which needs no allowlist of its own and cannot
 * drift from the routes. Generators should still ask src/lib/route-map.ts
 * first; this is the net underneath them.
 *
 * Usage:
 *   npx tsx scripts/check-links.ts             # after `next build`
 *   npx tsx scripts/check-links.ts --report    # print, never exit non-zero
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "..");
const APP = join(ROOT, ".next/server/app");
const REPORT_ONLY = process.argv.includes("--report");

if (!existsSync(APP)) {
  console.error("check:links needs a build first — run `npm run build`.");
  process.exit(1);
}

/** Routes that are handlers, not pages: they answer 3xx or JSON by design. */
const HANDLER_PREFIXES = ["/go/", "/out/", "/api/", "/_next/"];

/** Files served from public/ rather than rendered as pages. */
const PUBLIC_FILE = /\.(xml|txt|json|csv|png|jpe?g|svg|webp|ico|pdf|webmanifest)$/i;

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const files = walk(APP);

/** Every path the build produced, normalised to the locale-less form. */
const rendered = new Set<string>();
for (const f of files) {
  let r = f.slice(APP.length).replace(/\.html$/, "");
  if (r.startsWith("/en/")) r = r.slice(3);
  else if (r === "/en") r = "/";
  rendered.add(r.replace(/\/$/, "") || "/");
}

const broken = new Map<string, { count: number; sources: Set<string> }>();
let checked = 0;

for (const f of files) {
  let src = f.slice(APP.length).replace(/\.html$/, "");
  if (src.startsWith("/en/")) src = src.slice(3);
  else if (src === "/en") src = "/";
  // One locale is enough: the others render the same component tree.
  if (!f.includes("/en/") && f !== join(APP, "en.html")) {
    if (!f.slice(APP.length).startsWith("/en")) continue;
  }

  const html = readFileSync(f, "utf8");
  for (const m of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    let href = m[1];
    if (href.startsWith("https://sendmoneycompare.com")) href = href.slice(28) || "/";
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const path = (href.split("#")[0].split("?")[0].replace(/\/$/, "") || "/");
    if (HANDLER_PREFIXES.some((p) => path.startsWith(p))) continue;
    if (PUBLIC_FILE.test(path)) continue;
    if (existsSync(join(ROOT, "public", path))) continue;
    checked++;
    if (rendered.has(path)) continue;
    const e = broken.get(path) ?? { count: 0, sources: new Set<string>() };
    e.count++;
    e.sources.add(src);
    broken.set(path, e);
  }
}

const ranked = [...broken.entries()].sort((a, b) => b[1].count - a[1].count);
const instances = ranked.reduce((n, [, v]) => n + v.count, 0);

console.log(
  `check:links — ${files.length} prerendered pages, ${rendered.size} distinct routes, ` +
    `${checked} internal links checked`,
);

if (!ranked.length) {
  console.log("  ✓ every internal link points at a page this build rendered");
  process.exit(0);
}

console.error(`\n  ✗ ${instances} internal link(s) point at ${ranked.length} URL(s) with no page:\n`);
for (const [path, v] of ranked.slice(0, 25)) {
  const from = [...v.sources].slice(0, 3).join(", ");
  console.error(
    `    ${String(v.count).padStart(5)}×  ${path}\n` +
      `           from ${from}${v.sources.size > 3 ? ` and ${v.sources.size - 3} more` : ""}`,
  );
}
if (ranked.length > 25) console.error(`\n    … ${ranked.length - 25} more URLs`);
console.error(
  "\n  Fix the generator, not the link: ask src/lib/route-map.ts whether the\n" +
    "  target renders and drop the link when it does not. If the target SHOULD\n" +
    "  render, add it to that route's generateStaticParams and its predicate.\n",
);
process.exit(REPORT_ONLY ? 0 : 1);
