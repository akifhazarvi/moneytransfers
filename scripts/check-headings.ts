/**
 * No H2 is shared by 10 or more indexable pages.
 *
 * WHY
 * The 2026-09-27 audit of the built site found sixteen H2s printed identically
 * on 10+ indexable pages: a widget's "Your next transfer starts here." on 197,
 * "Related guides" on 121, "Frequently Asked Questions" on 117, "Sources &
 * Methodology" on 81, "Key Features" on 49 provider profiles. A heading repeated
 * across a template is the template talking, not the page, and duplicate
 * checkers (SiteLiner, Screaming Frog) and search engines weight headings above
 * body text — every one of them pulled the pages it sat on towards each other,
 * on a site whose Google problem is already "these pages look alike".
 *
 * The rule:
 *   - A heading that belongs to the page names the page's subject
 *     (`faqHeading(title)`, "{provider} features", "{a} vs {b}: your
 *     questions") — see src/lib/page-headings.ts.
 *   - A widget, ad or navigation block is not a heading at all. Its title is a
 *     styled <p>; the landmark (<aside aria-label>, <nav>) names it for
 *     assistive technology.
 *
 * What is asserted: across pages a duplicate checker will count (no generic
 * robots noindex, self-canonical), no H2 text appears on THRESHOLD or more.
 * Bing-only pages (googlebot noindex) are counted: Bing and the crawlers read
 * them. A heading that is exactly a provider's name is exempt — the /companies
 * hub and compare pages title each provider's card with its name, which is the
 * subject, not boilerplate.
 *
 * Usage: npx tsx scripts/check-headings.ts [--report]   (needs a build)
 *   --report  also lists headings on 5–9 pages, the ones about to cross.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { providers } from "../src/data/providers";

const ROOT = join(__dirname, "..");
const APP = join(ROOT, ".next/server/app/en");
const SITE = "https://sendmoneycompare.com";
const THRESHOLD = 10;
const REPORT = process.argv.includes("--report");

if (!existsSync(APP)) {
  console.error("check:headings needs a build first — run `npm run build`.");
  process.exit(1);
}

const PROVIDER_NAMES = new Set(providers.map((p) => p.name));

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", mdash: "—", ndash: "–" };
function text(html: string): string {
  return html
    .replace(/<!--.*?-->/gs, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

const byHeading = new Map<string, Set<string>>();
let counted = 0;
for (const f of walk(APP)) {
  const path = f.slice(APP.length).replace(/\.html$/, "").replace(/\/$/, "") || "/";
  const html = readFileSync(f, "utf8");
  const robots = html.match(/<meta[^>]+name="robots"[^>]+content="([^"]+)"/)?.[1] ?? "";
  if (/noindex/i.test(robots)) continue;
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1];
  if (canonical && canonical.replace(/\/$/, "") !== (SITE + (path === "/" ? "" : path))) continue;
  counted++;
  for (const m of html.matchAll(/<h2\b[^>]*>(.*?)<\/h2>/gs)) {
    const t = text(m[1]);
    if (!t || PROVIDER_NAMES.has(t)) continue;
    if (!byHeading.has(t)) byHeading.set(t, new Set());
    byHeading.get(t)!.add(path);
  }
}

const family = (p: string) => (p.split("/").length > 2 ? `/${p.split("/")[1]}/*` : p);
function describe(heading: string, paths: Set<string>): string {
  const fams = new Map<string, number>();
  for (const p of paths) fams.set(family(p), (fams.get(family(p)) ?? 0) + 1);
  const where = [...fams].sort((a, b) => b[1] - a[1]).map(([f, n]) => `${f} ${n}`).join(", ");
  return `${String(paths.size).padStart(4)}  "${heading}"  (${where})`;
}

const sorted = [...byHeading].sort((a, b) => b[1].size - a[1].size);
const failing = sorted.filter(([, s]) => s.size >= THRESHOLD);
if (REPORT) {
  const near = sorted.filter(([, s]) => s.size >= 5 && s.size < THRESHOLD);
  console.log(`check:headings — H2s on 5–${THRESHOLD - 1} of ${counted} indexable pages:`);
  for (const [h, s] of near) console.log(describe(h, s));
}
if (failing.length) {
  console.error(`check:headings — ${failing.length} H2(s) shared by ${THRESHOLD}+ of ${counted} indexable pages:`);
  for (const [h, s] of failing) console.error(describe(h, s));
  console.error(
    "\n  A page's heading names its subject (src/lib/page-headings.ts); a widget, ad or" +
      "\n  navigation title is a styled <p>, not an <h2>. See CLAUDE.md → Strict rules.",
  );
  process.exit(1);
}
console.log(`check:headings ok — no H2 shared by ${THRESHOLD}+ of ${counted} indexable pages`);
