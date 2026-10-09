/**
 * Writes src/data/google-eligible-routes.json — every path Google may index,
 * which is also the only set an internal link may point at.
 *
 * WHY (round-3 freelance brief, 2026-10-08, §5.1–5.2)
 * The October 8 link crawl found 5,389 in-content links and 103 menu targets
 * pointing at pages that serve `noindex` to Googlebot — PageRank sent to pages
 * the site itself asks Google to drop, on a site whose Google problem is
 * authority. Owner decision: a link renders only when its target is
 * Google-eligible; otherwise the anchor text stays as plain text. When a page
 * is released to Google (a §3.4 batch), it joins this list on the next build
 * and every link to it comes back on its own.
 *
 * The list is exactly sitemap-google.xml: sitemap() filtered by
 * googleIndexable(), the same two calls src/app/sitemap-google.xml/route.ts
 * makes, so "eligible to link" and "submitted to Google" cannot disagree.
 *
 * Runs in prebuild. The output is sorted and carries no timestamp, so it only
 * changes when an indexing decision changes — commit it with that change.
 * check:link-eligibility (postbuild) enforces it against the built HTML.
 *
 * Usage: npx tsx scripts/build-google-eligible-routes.ts [--check]
 *   --check  exit 1 if the committed file is stale instead of rewriting it
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import sitemap from "../src/app/sitemap";
import { googleIndexable } from "../src/lib/seo-indexing";

const OUT = join(__dirname, "../src/data/google-eligible-routes.json");

const routes = [
  ...new Set(
    sitemap()
      .map((e) => new URL(e.url).pathname.replace(/\/$/, "") || "/")
      .filter((path) => googleIndexable(path)),
  ),
].sort();

const body = JSON.stringify({ routes }, null, 2) + "\n";
const current = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";

if (process.argv.includes("--check")) {
  if (current !== body) {
    console.error("google-eligible-routes.json is stale — run `npx tsx scripts/build-google-eligible-routes.ts`.");
    process.exit(1);
  }
  console.log(`google-eligible-routes.json is current (${routes.length} routes).`);
} else {
  if (current !== body) writeFileSync(OUT, body);
  console.log(`google-eligible-routes.json: ${routes.length} routes${current === body ? " (unchanged)" : " (written)"}`);
}
