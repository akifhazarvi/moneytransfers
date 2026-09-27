/**
 * Indexing invariants, checked against the built output.
 *
 * WHY
 * The May 8 2026 deindex (500 indexed → 31) was traced to contradictory
 * signals: URLs submitted in sitemap.xml that served `noindex`, and URLs
 * submitted that canonicalised somewhere else. Every cleanup since has fixed
 * instances of it by hand — /compare in May, corridors in June, three ranking
 * corridors and the rate-history family on 2026-09-02 — because nothing
 * asserted the rule. These are the assertions.
 *
 * A sitemap entry is a recommendation to index. So for every submitted URL:
 *   1. the page exists (it was prerendered)
 *   2. it does not serve `noindex`
 *   3. its canonical points at itself
 *
 * The reverse — indexable but not submitted — is NOT an error here. It is a
 * deliberate strategy for the IBAN and SWIFT families, where seo-indexing.ts
 * keeps a set that is "broader than sitemap" on purpose. Those are reported,
 * not failed, so a new one gets noticed and classified rather than ignored.
 *
 * Usage:
 *   npx tsx scripts/check-indexing.ts          # after `next build`
 *   npx tsx scripts/check-indexing.ts --report # print, never exit non-zero
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { xRobotsTagFor } from "../src/lib/seo-indexing";

const ROOT = join(__dirname, "..");
const APP = join(ROOT, ".next/server/app");
const REPORT_ONLY = process.argv.includes("--report");
const SITE = "https://sendmoneycompare.com";

if (!existsSync(APP)) {
  console.error("check:indexing needs a build first — run `npm run build`.");
  process.exit(1);
}

/**
 * Families where "indexable but unsubmitted" is the documented strategy.
 * See INDEXED_IBAN_SLUGS / INDEXED_SWIFT_SLUGS in src/lib/seo-indexing.ts.
 */
const BROADER_THAN_SITEMAP = ["/iban/", "/swift-codes/"];

/** URLs that canonicalise elsewhere on purpose and are therefore not submitted. */
const INTENTIONAL_NON_CANONICAL = new Set(["/compare-money-transfer"]);

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

interface Page {
  path: string;
  robots: string;
  /** The `googlebot`-specific tag (2026-09-27: Bing-only pages carry `noindex`). */
  googlebot: string;
  canonical: string;
}

const pages = new Map<string, Page>();
for (const f of walk(APP)) {
  let r = f.slice(APP.length).replace(/\.html$/, "");
  if (r.startsWith("/en/")) r = r.slice(3);
  else if (r === "/en") r = "/";
  else continue; // only the canonical locale carries indexing decisions
  const path = r.replace(/\/$/, "") || "/";
  const html = readFileSync(f, "utf8");
  pages.set(path, {
    path,
    robots: html.match(/<meta[^>]+name="robots"[^>]+content="([^"]+)"/)?.[1] ?? "",
    googlebot: html.match(/<meta[^>]+name="googlebot"[^>]+content="([^"]+)"/)?.[1] ?? "",
    canonical: html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1] ?? "",
  });
}

const smBody = join(APP, "sitemap.xml.body");
if (!existsSync(smBody)) {
  console.error("check:indexing could not find the rendered sitemap in .next — did the build finish?");
  process.exit(1);
}
const submitted = [...readFileSync(smBody, "utf8").matchAll(/<loc>(.*?)<\/loc>/g)]
  .map((m) => (m[1].replace(SITE, "").replace(/\/$/, "") || "/"));

const errors: string[] = [];
const notes: string[] = [];

// No URL twice. sitemap.ts is a hand-maintained list of ~700 entries assembled
// from a dozen blocks, and on 2026-09-07 it carried SIX duplicates — an entire
// trust-and-authorship block (three author pages, /corrections, /cookies,
// /disclaimer) pasted in twice with near-identical comments. Nothing caught it:
// this script counted 711 submitted URLs where only 705 were distinct, and the
// discrepancy only surfaced because ping-indexnow.ts deduplicates and reported
// a different total. Crawlers tolerate it, but a sitemap that cannot count is
// a sitemap that cannot be trusted to say what we submit.
{
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const url of submitted) {
    if (seen.has(url)) dupes.add(url);
    seen.add(url);
  }
  if (dupes.size > 0) {
    errors.push(
      `sitemap lists ${dupes.size} URL(s) more than once — ${[...dupes].slice(0, 8).join(", ")}` +
        `${dupes.size > 8 ? ", …" : ""}. Remove the duplicate entry in src/app/sitemap.ts.`,
    );
  }
}

for (const url of submitted) {
  const page = pages.get(url);
  if (!page) {
    errors.push(`submitted but not prerendered: ${url}`);
    continue;
  }
  if (/noindex/i.test(page.robots)) {
    errors.push(`submitted but serves robots "${page.robots}": ${url}`);
  }
  if (!page.canonical) {
    errors.push(`submitted with no canonical: ${url}`);
  } else {
    const self = (SITE + (url === "/" ? "" : url)).replace(/\/$/, "");
    if (page.canonical.replace(/\/$/, "") !== self) {
      errors.push(`submitted but canonicalises to ${page.canonical}: ${url}`);
    }
  }
}

// ── sitemap-google.xml (2026-09-27, round-3 plan) ──
// The Google sitemap must be a subset of sitemap.xml and may only list pages
// Googlebot is allowed to index: no generic noindex AND no googlebot noindex.
// sitemap.xml may carry Bing-only pages (googlebot noindex); this one may not.
{
  const gBody = join(APP, "sitemap-google.xml.body");
  if (!existsSync(gBody)) {
    errors.push("sitemap-google.xml was not rendered — src/app/sitemap-google.xml/route.ts");
  } else {
    const main = new Set(submitted);
    const google = [...readFileSync(gBody, "utf8").matchAll(/<loc>(.*?)<\/loc>/g)]
      .map((m) => (m[1].replace(SITE, "").replace(/\/$/, "") || "/"));
    for (const url of google) {
      if (!main.has(url)) errors.push(`in sitemap-google.xml but not sitemap.xml: ${url}`);
      const page = pages.get(url);
      if (page && (/noindex/i.test(page.robots) || /noindex/i.test(page.googlebot))) {
        errors.push(`in sitemap-google.xml but noindex for Googlebot: ${url}`);
      }
    }
    console.log(`check:indexing — sitemap-google.xml: ${google.length} URLs (Google), sitemap.xml: ${submitted.length} (Bing)`);
  }
}

// ── X-Robots-Tag may never be stricter than the page's own meta ──
// Google treats a header noindex as binding, so a header saying more than the
// meta silently noindexes the page (three /swift-codes pages, 2026-09-24).
// The header comes from xRobotsTagFor(); check it against what each page renders.
for (const [path, page] of pages) {
  const header = xRobotsTagFor(path);
  if (header === "noindex, follow" && !/noindex/i.test(page.robots)) {
    errors.push(`X-Robots-Tag noindex but page meta allows indexing: ${path}`);
  }
  if (header === "googlebot: noindex, follow" && !/noindex/i.test(page.googlebot) && !/noindex/i.test(page.robots)) {
    errors.push(`X-Robots-Tag googlebot noindex but page has no googlebot noindex: ${path}`);
  }
}

const submittedSet = new Set(submitted);
for (const [path, page] of pages) {
  if (submittedSet.has(path)) continue;
  if (/noindex/i.test(page.robots)) continue; // consistent: not indexed, not submitted
  if (INTENTIONAL_NON_CANONICAL.has(path)) continue;
  if (BROADER_THAN_SITEMAP.some((p) => path.startsWith(p))) continue;
  notes.push(path);
}

console.log(
  `check:indexing — ${pages.size} prerendered pages, ${submitted.length} submitted URLs`,
);

if (notes.length) {
  console.log(`\n  ${notes.length} page(s) indexable but not submitted (review, not a failure):`);
  for (const n of notes.slice(0, 20)) console.log(`    ${n}`);
  if (notes.length > 20) console.log(`    … ${notes.length - 20} more`);
  console.log(
    "    Either submit them in src/app/sitemap.ts or noindex them, so the two\n" +
      "    signals agree. Whole families that are deliberately broader than the\n" +
      "    sitemap belong in BROADER_THAN_SITEMAP at the top of this file.",
  );
}

if (!errors.length) {
  console.log("\n  ✓ every submitted URL exists, is indexable, and is self-canonical");
  process.exit(0);
}

console.error(`\n  ✗ ${errors.length} contradictory indexing signal(s):\n`);
for (const e of errors.slice(0, 30)) console.error(`    ${e}`);
if (errors.length > 30) console.error(`\n    … ${errors.length - 30} more`);
console.error(
  "\n  A sitemap entry tells the crawler to index that URL. Submitting one that\n" +
    "  404s, serves noindex, or canonicalises elsewhere is the contradiction the\n" +
    "  May 8 2026 deindex was traced to. Fix the page or drop it from the sitemap.\n",
);
process.exit(REPORT_ONLY ? 0 : 1);
