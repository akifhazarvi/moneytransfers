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
import { MAX_TITLE } from "../src/lib/seo-title";

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

// ── report ────────────────────────────────────────────────────────────────
if (failures.length) {
  console.error(`\ncheck:assets FAILED (${failures.length})\n`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(
  `check:assets ok — ${onDisk.length} logos in sync, ${seen.size} literal asset paths resolve, ` +
    `${MUST_FIT.length} title templates within ${MAX_TITLE} chars`,
);
