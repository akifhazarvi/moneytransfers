/**
 * Every internal link points at a Google-eligible page; every affiliate link
 * is `nofollow sponsored`. Checked against the built HTML.
 *
 * WHY (round-3 freelance brief, 2026-10-08)
 * §5.1/5.2: the October 8 link crawl found 5,389 in-content links and 103 menu
 * targets pointing at pages that serve Googlebot `noindex`, redirect or 410.
 * Acceptance: "page content contains no links to pages with noindex,
 * redirects, or 404/410 responses" and "the menu and footer contain no links
 * to noindex pages". Owner decision: strict, with links coming back on their
 * own when a page is released to Google (see src/lib/link-eligibility.ts).
 * §5.4: 293 /go/ links lacked `nofollow`/`sponsored`.
 *
 * Eligible = src/data/google-eligible-routes.json (= sitemap-google.xml).
 * Self-links are ignored (a page may name itself in its breadcrumb).
 * §5.3: also fails when an eligible page has in-content links from fewer than
 * three other eligible pages (see MIN_SUPPORT).
 * Only the canonical (unprefixed English) pages are read.
 *
 * Usage:
 *   npx tsx scripts/check-link-eligibility.ts            # after `next build`
 *   npx tsx scripts/check-link-eligibility.ts --report   # print, never fail
 *   npx tsx scripts/check-link-eligibility.ts --hubs     # also print unique-link counts
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { internalPagePath, isLinkEligible } from "../src/lib/link-eligibility";
import eligibleJson from "../src/data/google-eligible-routes.json";

const ROOT = join(__dirname, "..");
const APP = join(ROOT, ".next/server/app");
const REPORT_ONLY = process.argv.includes("--report");
const SHOW_HUBS = process.argv.includes("--hubs");

if (!existsSync(APP)) {
  console.error("check:link-eligibility needs a build first — run `npm run build`.");
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

const byTarget = new Map<string, { count: number; sources: Set<string> }>();
const affiliate = new Map<string, { count: number; sources: Set<string> }>();
const hubCounts: Array<[string, number]> = [];
let pages = 0;
let violations = 0;

for (const f of walk(APP)) {
  let r = f.slice(APP.length).replace(/\.html$/, "");
  if (r.startsWith("/en/")) r = r.slice(3);
  else if (r === "/en") r = "/";
  else continue;
  const source = r.replace(/\/$/, "") || "/";
  if (source === "/_not-found" || source.startsWith("/go/")) continue;
  pages++;
  const html = readFileSync(f, "utf8");
  const unique = new Set<string>();

  for (const m of html.matchAll(/<a\b([^>]*)>/g)) {
    const attrs = m[1];
    const href = attrs.match(/\bhref="([^"]+)"/)?.[1];
    if (!href) continue;
    const decoded = href.replace(/&amp;/g, "&");

    if (/^(https:\/\/sendmoneycompare\.com)?\/(go|out)\//.test(decoded)) {
      const rel = (attrs.match(/\brel="([^"]*)"/)?.[1] ?? "").split(/\s+/);
      if (!rel.includes("nofollow") || !rel.includes("sponsored")) {
        const key = rel.join(" ") || "(no rel)";
        const entry = affiliate.get(key) ?? { count: 0, sources: new Set() };
        entry.count++;
        entry.sources.add(source);
        affiliate.set(key, entry);
        violations++;
      }
      continue;
    }

    const path = internalPagePath(decoded);
    if (path === null) continue;
    unique.add(path);
    if (path === source || isLinkEligible(path)) continue;
    const entry = byTarget.get(path) ?? { count: 0, sources: new Set() };
    entry.count++;
    entry.sources.add(source);
    byTarget.set(path, entry);
    violations++;
  }
  hubCounts.push([source, unique.size]);
}

/**
 * §5.3: every Google-eligible page receives in-content links from at least
 * MIN_SUPPORT other eligible pages. In-content = an anchor inside <main>,
 * outside any <nav> or <aside> there (menus, breadcrumbs and widget rails are
 * not content). No page streams hidden segments any more, so <main> is what a
 * crawler reads.
 */
const MIN_SUPPORT = 3;
const support = new Map<string, Set<string>>();
for (const f of walk(APP)) {
  let r = f.slice(APP.length).replace(/\.html$/, "");
  if (r.startsWith("/en/")) r = r.slice(3);
  else if (r === "/en") r = "/";
  else continue;
  const source = r.replace(/\/$/, "") || "/";
  if (!isLinkEligible(source)) continue;
  const html = readFileSync(f, "utf8");
  const main = html.slice(html.indexOf("<main"), html.lastIndexOf("</main>"));
  const content = main.replace(/<nav\b[\s\S]*?<\/nav>/g, "").replace(/<aside\b[\s\S]*?<\/aside>/g, "");
  for (const m of content.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const path = internalPagePath(m[1].replace(/&amp;/g, "&"));
    if (path === null || path === source || !isLinkEligible(path)) continue;
    const set = support.get(path) ?? new Set<string>();
    set.add(source);
    support.set(path, set);
  }
}
const eligibleRoutes = eligibleJson.routes as string[];
const weak = eligibleRoutes
  .filter((p) => p !== "/")
  .map((p) => [p, support.get(p)?.size ?? 0] as const)
  .filter(([, n]) => n < MIN_SUPPORT)
  .sort((a, b) => a[1] - b[1]);
violations += weak.length;

const targets = [...byTarget.entries()].sort((a, b) => b[1].sources.size - a[1].sources.size);
const linkViolations = targets.reduce((n, [, v]) => n + v.count, 0);

console.log(`check:link-eligibility — ${pages} pages read`);
console.log(`  internal links to non-eligible pages: ${linkViolations} links, ${targets.length} targets`);
for (const [path, v] of targets.slice(0, REPORT_ONLY ? 60 : 25)) {
  const sample = [...v.sources].slice(0, 3).join(", ");
  console.log(`    ${path}  ← ${v.sources.size} pages (${v.count} links), e.g. ${sample}`);
}
if (targets.length > (REPORT_ONLY ? 60 : 25)) console.log(`    … ${targets.length - (REPORT_ONLY ? 60 : 25)} more targets`);

const affTotal = [...affiliate.values()].reduce((n, v) => n + v.count, 0);
console.log(`  /go and /out links missing nofollow sponsored: ${affTotal}`);
for (const [rel, v] of affiliate) {
  console.log(`    rel="${rel}"  ${v.count} links on ${v.sources.size} pages, e.g. ${[...v.sources].slice(0, 3).join(", ")}`);
}

console.log(`  eligible pages with in-content links from fewer than ${MIN_SUPPORT} other eligible pages: ${weak.length}`);
for (const [p, n] of weak.slice(0, 40)) console.log(`    ${n}  ${p}`);

if (SHOW_HUBS) {
  console.log("  unique internal links per page (top 15):");
  for (const [p, n] of hubCounts.sort((a, b) => b[1] - a[1]).slice(0, 15)) console.log(`    ${String(n).padStart(4)}  ${p}`);
  for (const hub of ["/send-money", "/guides"]) {
    const n = hubCounts.find(([p]) => p === hub)?.[1];
    console.log(`  ${hub}: ${n ?? "not prerendered"} unique internal links (brief: ≤60–80)`);
  }
}

if (violations > 0 && !REPORT_ONLY) {
  console.error(`\n✗ ${violations} link(s) break the link-eligibility rule (CLAUDE.md strict rule 14).`);
  process.exit(1);
}
console.log(violations > 0 ? `\n${violations} violation(s) (report only).` : "\n✓ every internal link is Google-eligible; every affiliate link is nofollow sponsored.");
