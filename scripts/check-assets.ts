/**
 * Asset + SEO invariants that the 2026-09-02 Semrush audit caught by crawling
 * production. Each check here maps to one issue it reported, so a regression is
 * a failed build instead of a finding three weeks later.
 *
 *   1. KNOWN_LOGOS in src/lib/provider-logo.ts matches public/logos.
 *      Drift means providerLogo() silently returns the placeholder for a logo
 *      we actually ship (or worse, points at a file that has been deleted →
 *      HTTP 400 from the image optimizer, which is how 24 bank logos broke
 *      across 500+ pages).
 *   2. Every /logos/... and /flags/... path written literally in src/ exists.
 *   3. No <title> template can exceed MAX_TITLE once rendered — spot-checked
 *      against the message catalogue's fallback patterns.
 *   4. Nothing in the sitemap canonicalises elsewhere or serves noindex
 *      (needs a running site; see check-ranking-urls.ts for the live version).
 *
 * Usage:
 *   npx tsx scripts/check-assets.ts            # verify, exit 1 on drift
 *   npx tsx scripts/check-assets.ts --write     # rewrite KNOWN_LOGOS in place
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { KNOWN_LOGOS } from "../src/lib/provider-logo";
import { MAX_TITLE, MAX_DESCRIPTION, MIN_HEADLINE_SHARE, seoTitle, titleKeepsHeadline } from "../src/lib/seo-title";
import { SITE_STATS } from "../src/lib/site-stats";
import { blogPosts } from "../src/data/blog-posts";
import { renderDataTokens } from "../src/lib/ratings-tokens";
import { corridorDeepBlocks } from "../src/data/corridor-deep-content";
import { corridorEditorialNotes } from "../src/data/corridor-editorial-notes";
import { newsItems } from "../src/data/news";
import { corridors } from "../src/data/corridors";
import { PILOT_BANKS } from "../src/lib/bank-comparisons";

const ROOT = join(__dirname, "..");
const WRITE = process.argv.includes("--write");
const IMAGE_EXT = new Set([".png", ".svg", ".jpg", ".jpeg", ".webp"]);

const failures: string[] = [];

function listLogos(): string[] {
  return readdirSync(join(ROOT, "public/logos"))
    .filter((f) => IMAGE_EXT.has(f.slice(f.lastIndexOf(".")).toLowerCase()))
    .sort();
}

/** Every .ts/.tsx file under src/, recursively. */
function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) sourceFiles(p, out);
    else if (/\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

// ── 1. KNOWN_LOGOS vs disk ────────────────────────────────────────────────
const onDisk = listLogos();
const listed = [...KNOWN_LOGOS].sort();
const missingFromList = onDisk.filter((f) => !listed.includes(f));
const staleInList = listed.filter((f) => !onDisk.includes(f));

if (missingFromList.length || staleInList.length) {
  if (WRITE) {
    const p = join(ROOT, "src/lib/provider-logo.ts");
    const src = readFileSync(p, "utf8");
    const block = onDisk.map((f) => `  "${f}",`).join("\n");
    const next = src.replace(
      /(export const KNOWN_LOGOS: readonly string\[\] = \[\n)[\s\S]*?(\n\];)/,
      `$1${block}$2`,
    );
    if (next === src) {
      failures.push("could not rewrite KNOWN_LOGOS — the generated block moved");
    } else {
      writeFileSync(p, next);
      console.log(`rewrote KNOWN_LOGOS: ${onDisk.length} files`);
    }
  } else {
    if (missingFromList.length) {
      failures.push(
        `public/logos has ${missingFromList.length} file(s) not in KNOWN_LOGOS ` +
          `(${missingFromList.slice(0, 5).join(", ")}${missingFromList.length > 5 ? ", …" : ""}) ` +
          `— run: npx tsx scripts/check-assets.ts --write`,
      );
    }
    if (staleInList.length) {
      failures.push(
        `KNOWN_LOGOS names ${staleInList.length} file(s) that no longer exist ` +
          `(${staleInList.slice(0, 5).join(", ")}${staleInList.length > 5 ? ", …" : ""})`,
      );
    }
  }
}

// ── 2. literal asset paths in source must exist ───────────────────────────
const LITERAL_ASSET = /["'`](\/(?:logos|flags|images)\/[A-Za-z0-9._@/-]+\.(?:png|svg|jpe?g|webp))["'`]/g;
const seen = new Map<string, string>(); // path -> first file that referenced it
for (const file of sourceFiles(join(ROOT, "src"))) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(LITERAL_ASSET)) {
    if (!seen.has(m[1])) seen.set(m[1], file.replace(`${ROOT}/`, ""));
  }
}
for (const [path, where] of seen) {
  if (!existsSync(join(ROOT, "public", path))) {
    failures.push(`missing asset public${path} (referenced in ${where})`);
  }
}

// ── 3. title templates must fit MAX_TITLE ─────────────────────────────────
// Renders each fallback pattern with the longest real values we ship, so a
// template that only overflows for "United Kingdom → Dominican Republic" is
// caught here rather than in a crawl.
const messages = JSON.parse(readFileSync(join(ROOT, "messages/en.json"), "utf8"));
const LONGEST = {
  from: "USD",
  to: "DOP",
  fromCountry: "United Kingdom",
  toCountry: "Dominican Republic",
  toCurrency: "DOP",
  year: "2026",
  name: "Bosnia and Herzegovina",
  length: "22",
  month: "September",
  role: "Head of Research",
};
function render(tpl: string): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k: string) => (LONGEST as Record<string, string>)[k] ?? `{${k}}`);
}
// Only the SHORTEST variant of each family has to fit: generateMetadata walks
// the ladder with fitTitle() and takes the first that does.
const MUST_FIT = [
  "corridor.fallbackTitleCorridorShort",
  "corridor.fallbackTitleCountryShort",
  "corridor.fallbackTitleCurrency",
  "iban.fallbackTitle",
  "swift.fallbackTitle",
];
for (const key of MUST_FIT) {
  const [ns, k] = key.split(".");
  const tpl: string | undefined = messages[ns]?.[k];
  if (!tpl) continue; // namespace renamed — not this script's business
  const rendered = render(tpl);
  if (rendered.length > MAX_TITLE) {
    failures.push(`title template ${key} renders ${rendered.length} chars (> ${MAX_TITLE}): "${rendered}"`);
  }
}

// ── 3b. a derived <title> keeps what the page is about ───────────────────
// seoTitle() cuts a long headline to fit. On 2026-09-02 it cut 44 guides to
// their first clause ("What Is a SWIFT Code? | SendMoneyCompare" lost "Find
// Your Bank's BIC Code"), and those guides lost 41% of their Bing visits in
// two weeks while the untouched ones held level. A page whose derived title
// keeps less than MIN_HEADLINE_SHARE of its headline's words needs a
// hand-written metaTitle.
const titled: [string, string, string | undefined][] = [
  ...blogPosts.map((p) => [`guide ${p.slug}`, p.title, p.metaTitle] as [string, string, string | undefined]),
  ...newsItems.map((n) => [`news ${n.slug}`, n.title, n.metaTitle] as [string, string, string | undefined]),
  ...Object.values(PILOT_BANKS).map((b) => [`bank ${b.slug}`, b.headline, b.metaTitle] as [string, string, string | undefined]),
];
let derivedTitles = 0;
for (const [where, h1, explicit] of titled) {
  if (explicit?.trim() && explicit.trim().length <= MAX_TITLE) continue;
  derivedTitles++;
  const title = seoTitle(h1, explicit);
  const share = titleKeepsHeadline(h1, title);
  if (share < MIN_HEADLINE_SHARE) {
    failures.push(
      `${where}: derived title keeps ${Math.round(share * 100)}% of its headline (< ${Math.round(MIN_HEADLINE_SHARE * 100)}%) — add a metaTitle. "${h1}" → "${title}"`,
    );
  }
}

// ── 4. description templates must fit MAX_DESCRIPTION ────────────────────
// Same idea as the title check: render each fallback with the longest real
// values we ship. Pages that build a description from editorial prose route it
// through seoDescription() instead, which truncates at a sentence boundary.
const DESC_MUST_FIT = [
  "corridor.fallbackDescriptionCurrency",
  "corridor.fallbackDescriptionCountry",
  "corridor.fallbackDescriptionCorridor",
  "iban.fallbackDescription",
  "swift.fallbackDescription",
  "rateHistory.fallbackDescription",
];
for (const key of DESC_MUST_FIT) {
  const [ns, k] = key.split(".");
  const tpl: string | undefined = messages[ns]?.[k];
  if (!tpl) continue;
  const rendered = render(tpl);
  if (rendered.length > MAX_DESCRIPTION) {
    failures.push(
      `description template ${key} renders ${rendered.length} chars (> ${MAX_DESCRIPTION}): "${rendered.slice(0, 90)}…"`,
    );
  }
}

// ── refresh cadence: the cron must match what the copy promises ───────────
// The site said "updated every 6 hours" in 134 places while the scraper ran on
// a single daily cron — true at the median gap (5.4h), false at the tail
// (20.4h overnight). This asserts the schedule still delivers what SITE_STATS
// .refreshHours claims, so the copy cannot drift away from the workflow again.
{
  const wf = readFileSync(join(ROOT, ".github/workflows/scrape.yml"), "utf8");
  const cron = wf.match(/- cron: '([^']+)'/)?.[1] ?? "";
  const hourField = cron.split(/\s+/)[1] ?? "";
  const hours = hourField.startsWith("*/")
    ? (() => { const step = Number(hourField.slice(2)); return Array.from({ length: Math.ceil(24 / step) }, (_, i) => i * step); })()
    : hourField === "*"
      ? Array.from({ length: 24 }, (_, i) => i)
      : hourField.split(",").map(Number).filter((n) => !Number.isNaN(n));

  if (hours.length < 2) {
    failures.push(`scrape.yml cron "${cron}" runs ${hours.length}x/day but copy claims every ${SITE_STATS.refreshHours}h`);
  } else {
    const sorted = [...hours].sort((a, b) => a - b);
    const gaps = sorted.map((h, i) => (i === sorted.length - 1 ? 24 - h + sorted[0] : sorted[i + 1] - h));
    const worst = Math.max(...gaps);
    if (worst > SITE_STATS.refreshHours) {
      failures.push(
        `scrape.yml cron "${cron}" leaves a ${worst}h gap, but SITE_STATS.refreshHours claims ${SITE_STATS.refreshHours}h`,
      );
    }
  }
}

// ── 5. every data token in published copy resolves ────────────────────────
// Guides quote live figures through {{RECEIVE:…}} / {{QUOTE_LIST:…}} tokens
// (src/lib/ratings-tokens.ts) instead of numbers typed into prose. A token the
// renderer cannot resolve — a corridor that lost coverage, a provider slug that
// changed — is left in place, so the failure mode is a literal "{{RECEIVE:" in
// a published sentence. Render every section and FAQ here and refuse to build
// with one unresolved.
for (const post of blogPosts) {
  const fields = [
    ...post.sections.map((sec, i) => [`section ${i + 1} "${sec.heading}"`, sec.content] as const),
    ...(post.faqs ?? []).map((f, i) => [`faq ${i + 1}`, f.answer] as const),
  ];
  for (const [where, text] of fields) {
    if (!text.includes("{{")) continue;
    const rendered = renderDataTokens(text);
    const leftover = rendered.match(/\{\{[A-Z_]+[^}]*\}\}/g);
    if (leftover) {
      failures.push(`guide /guides/${post.slug} ${where}: unresolved token(s) ${[...new Set(leftover)].join(", ")}`);
    }
  }
}

// The sweep above only ever walked `blogPosts`, so the same tokens embedded in
// corridor and news copy went unchecked — and one shipped: /send-money/china-to-uk
// published a literal "{{CORRIDOR_LEADER:CNY:GBP}}" in body prose. These four
// sources feed rendered pages exactly the same way, so they get the same gate.
//
// Only string fields that reach a reader are checked. Doc-comment placeholders
// like a bare {{TOKEN}} live in *-editorial.ts files and are not data, so this
// walks the exported objects rather than the file text.
const tokenFields: Array<readonly [string, string]> = [
  ...Object.entries(corridorDeepBlocks).flatMap(([slug, b]) => [
    [`corridor deep /send-money/${slug} intro`, b.intro] as const,
    ...b.faqs.map((f, i) => [`corridor deep /send-money/${slug} faq ${i + 1}`, f.a] as const),
  ]),
  ...Object.entries(corridorEditorialNotes).flatMap(([slug, n]) => [
    [`corridor note /send-money/${slug} summary`, n.summary] as const,
    [`corridor note /send-money/${slug} warning`, n.warningBody] as const,
    ...n.bullets.map((b, i) => [`corridor note /send-money/${slug} bullet ${i + 1}`, b] as const),
  ]),
  ...corridors.flatMap((c) =>
    (c.faqs ?? []).map((f, i) => [`corridor /send-money/${c.slug} faq ${i + 1}`, f.a] as const),
  ),
  ...newsItems.flatMap((n) => [
    [`news /news/${n.slug} excerpt`, n.excerpt] as const,
    [`news /news/${n.slug} content`, n.content] as const,
  ]),
];

for (const [where, text] of tokenFields) {
  if (!text || !text.includes("{{")) continue;
  const leftover = renderDataTokens(text).match(/\{\{[A-Z_]+[^}]*\}\}/g);
  if (leftover) {
    failures.push(`${where}: unresolved token(s) ${[...new Set(leftover)].join(", ")}`);
  }
}

// ── report ────────────────────────────────────────────────────────────────
if (failures.length) {
  console.error(`\ncheck:assets FAILED (${failures.length})\n`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(
  `check:assets ok — ${onDisk.length} logos in sync, ${seen.size} literal asset paths resolve, ` +
    `${MUST_FIT.length} title templates within ${MAX_TITLE} chars, ` +
    `${derivedTitles} derived titles keep their headline, ` +
    `${DESC_MUST_FIT.length} description templates within ${MAX_DESCRIPTION}`,
);
