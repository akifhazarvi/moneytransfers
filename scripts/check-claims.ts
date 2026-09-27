/**
 * No unmeasured superlative, score or hand-typed rating in content.
 *
 * WHY
 * The site's claim to be worth reading is that its comparisons are measured.
 * The content generated in March 2026 was written as if they were not: 38
 * "Best Overall" labels, "consistently the cheapest" on routes where the
 * provider named led a minority of days, an "editor rating: 8.5/10" nothing
 * computes, Trustpilot scores typed by hand that drift from the scrape beside
 * them, and "0.42% avg markup" for a provider we measure at a 0.74% median.
 * Every existing guard passed them — check:assets only fails an unresolved
 * `{{`, check:rankings is not a gate. This one is (prebuild).
 *
 * HARD RULES — zero tolerance, the build fails on any hit:
 *   score           "8.5/10". No code on this site computes a /10 score.
 *   best-overall    "Best Overall". Nothing measures "overall"; say what the
 *                   provider is measured on, or label the pick "Editor's pick".
 *   always-cheapest "consistently / always / almost always the cheapest".
 *                   Negations ("not always the cheapest") are fine. Use
 *                   {{CORRIDOR_LEADER:FROM:TO}} or {{LEADS_SHORT:slug}}.
 *   cheapest-most   "cheapest for most corridors / people / currencies".
 *   cheapest-label  a table row labelled "Cheapest …" beside a named provider.
 *   trustpilot      "4.6/5 Trustpilot", "Trustpilot 4.6". Use {{TRUSTPILOT:slug}}.
 *   avg-markup      "0.42% avg markup". Use {{AVG_MARKUP_PCT:slug}} (a median).
 *
 * RATCHET — legacy debt that may shrink but never grow (scripts/claims-baseline.json):
 *   markup-figure   hand-typed markup figures in prose: "within 0.5–1% of the
 *                   mid-market rate", "a 2–4% markup". Hundreds sit in the
 *                   March corridor descriptions; rewriting them in bulk is
 *                   the duplication risk the corridor rules forbid. New
 *                   content must use {{MARKUP:…}}, {{AVG_MARKUP_PCT:…}} or
 *                   {{BANK_MEDIAN}}. Lower the baseline when you fix some:
 *                   `npx tsx scripts/check-claims.ts --update-baseline`.
 *
 * Scope: src/**\/*.ts(x) except scraped data, comment lines, and
 * ai-prompt-benchmark.ts (prompts we send to AI assistants, not page copy).
 *
 * BUILT PASS (--built, postbuild): a corridor page that holds ONE estimate
 * ("…is the only estimate we hold…") must not be titled "Cheapest" or "Best" —
 * one quote cannot be the cheapest of anything (round-2 brief item 2.1).
 *
 * Usage: npx tsx scripts/check-claims.ts [--list] [--update-baseline] [--built]
 */
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "src");
const BASELINE = join(__dirname, "claims-baseline.json");
const SKIP_FILES = new Set(["ai-prompt-benchmark.ts"]);

interface Rule {
  id: string;
  re: RegExp;
  /** Return true to ignore a match, given the text before it on the line. */
  allow?: (before: string, match: string, after: string) => boolean;
}

const NEGATED = /\b(?:not|never|isn['’]t|aren['’]t|assuming (?:any )?(?:one )?(?:provider )?(?:is )?)\s*(?:\w+\s+){0,2}$/i;

const HARD: Rule[] = [
  { id: "score", re: /(?<![\d.$£€/-])\b\d{1,2}(?:\.\d)?\s?\/\s?10\b(?![\d/])/g },
  { id: "best-overall", re: /\bbest[- ]overall\b/gi },
  {
    id: "always-cheapest",
    re: /\b(?:almost\s+always|consistently|always|reliably|invariably)\s+(?:the\s+)?(?:cheapest|lowest[- ]cost)\b/gi,
    // "not always the cheapest", "Is Wise always the cheapest of these four?"
    allow: (before, _m, after) => NEGATED.test(before) || /^\s*[^.!]*\?/.test(after) && /\b(?:is|are)\s+\w+\s*$/i.test(before),
  },
  { id: "cheapest-most", re: /\bcheapest\s+(?:option\s+|provider\s+|choice\s+)?(?:for|on|in|across)\s+(?:most|the majority)\b/gi },
  // A quick-pick table row that crowns a provider "Cheapest …" by hand. Wise
  // was labelled "Cheapest (US → UK)" where InstaReM led USD→GBP on 91 of 91
  // days. Live tokens ({{BEST_PROVIDER:…}}) are fine — they are not typed.
  { id: "cheapest-label", re: /<td>\s*<strong>\s*Cheapest\b[^<]*<\/strong>\s*<\/td>\s*<td>\s*<a href="\/companies\/|<td>\s*Cheapest total cost\s*<\/td>/gi },
  { id: "trustpilot", re: /\b\d\.\d\s*\/\s*5\s*(?:\(|on\s+)?Trustpilot|Trustpilot(?:\s+rating)?[:\s]+\d\.\d\b/gi },
  { id: "avg-markup", re: /\d+(?:\.\d+)?%\s*(?:avg|average)\.?\s+mark-?up|\b(?:avg|average)\s+mark-?up\s+(?:of\s+)?(?:about\s+|~)?\d/gi },
];

const RATCHET: Rule[] = [
  {
    id: "markup-figure",
    re: /within\s+(?:about\s+|roughly\s+|~)?\d+(?:\.\d+)?\s*%?(?:\s*[–-]\s*\d+(?:\.\d+)?\s*)?%\s+of\s+(?:the\s+)?(?:mid-market|interbank|real)|\b\d+(?:\.\d+)?\s*%?\s*[–-]\s*\d+(?:\.\d+)?\s*%\s*(?:exchange[- ]rate\s+|FX\s+)?mark-?ups?\b/gi,
  },
];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (p.includes(join("data", "scraped"))) continue;
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name) && !SKIP_FILES.has(name)) out.push(p);
  }
  return out;
}

interface Hit { rule: string; file: string; line: number; text: string }
const hits: Hit[] = [];
for (const file of walk(SRC)) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    const t = line.trimStart();
    if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("{/*")) return;
    for (const rule of [...HARD, ...RATCHET]) {
      for (const m of line.matchAll(rule.re)) {
        const at = m.index ?? 0;
        const before = line.slice(Math.max(0, at - 60), at);
        const after = line.slice(at + m[0].length, at + m[0].length + 80);
        if (rule.allow?.(before, m[0], after)) continue;
        hits.push({ rule: rule.id, file: file.slice(ROOT.length + 1), line: i + 1, text: `${before}[${m[0]}]${after}`.replace(/\s+/g, " ") });
      }
    }
  });
}

// Built pass: single-estimate corridor pages titled as a ranking.
if (process.argv.includes("--built")) {
  const DIR = join(ROOT, ".next/server/app/en/send-money");
  if (!existsSync(DIR)) {
    console.error("check:claims --built needs a build first — run `npm run build`.");
    process.exit(1);
  }
  for (const f of readdirSync(DIR).filter((n) => n.endsWith(".html"))) {
    const html = readFileSync(join(DIR, f), "utf8");
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    if (html.includes("only estimate we hold") && /\b(?:cheapest|best)\b/i.test(title)) {
      hits.push({ rule: "single-estimate-title", file: `send-money/${f}`, line: 0, text: title });
    }
  }
  HARD.push({ id: "single-estimate-title", re: /$^/ });
}

const hard = hits.filter((h) => HARD.some((r) => r.id === h.rule));
const counts = Object.fromEntries(RATCHET.map((r) => [r.id, hits.filter((h) => h.rule === r.id).length]));

if (process.argv.includes("--update-baseline")) {
  writeFileSync(BASELINE, JSON.stringify(counts, null, 2) + "\n");
  console.log("check:claims — baseline written:", counts);
  process.exit(0);
}
const baseline: Record<string, number> = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : {};

if (process.argv.includes("--list")) {
  for (const h of hits) console.log(`${h.rule.padEnd(15)} ${h.file}:${h.line}  ${h.text}`);
}

const errors: string[] = [];
for (const h of hard) errors.push(`${h.rule}: ${h.file}:${h.line}  …${h.text}…`);
for (const [id, n] of Object.entries(counts)) {
  const max = baseline[id] ?? 0;
  if (n > max) errors.push(`${id}: ${n} hand-typed figures, baseline ${max} — new content must use a data token`);
  else if (n < max) console.log(`check:claims — ${id} fell ${max} → ${n}; lower the baseline with --update-baseline`);
}

if (errors.length) {
  console.error(`check:claims — ${errors.length} unmeasured claim(s):`);
  for (const e of errors.slice(0, 60)) console.error(`  ${e}`);
  if (errors.length > 60) console.error(`  …and ${errors.length - 60} more (run with --list)`);
  console.error("\n  Say what we measured ({{TOKENS}} in src/lib/ratings-tokens.ts), or label an editorial pick as one. See CLAUDE.md → Strict rules.");
  process.exit(1);
}
console.log(`check:claims ok — no scores, "best overall", unmeasured "cheapest" or hand-typed ratings; ${Object.entries(counts).map(([k, v]) => `${k} ${v}/${baseline[k] ?? 0}`).join(", ")}`);
