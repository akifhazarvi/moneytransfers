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
 *   best-most       "the best EUR rates for most corridors", "best value for
 *                   most transfers" — cheapest-most without the word.
 *   consistently-best "consistently offer the best rates", "consistently ranks
 *                   highest", "consistently rated #1". Use {{CORRIDOR_LEADER:…}}.
 *   cheapest-label  a table row labelled "Cheapest …" beside a named provider.
 *   uk-sepa         "the UK is no longer part of SEPA" — false: the EPC kept the UK in
 *                   SEPA after Brexit, as a non-EEA member (BIC + payer address needed).
 *   trustpilot      "4.6/5 Trustpilot", "Trustpilot 4.6". Use {{TRUSTPILOT:slug}}.
 *   avg-markup      "0.42% avg markup". Use {{AVG_MARKUP_PCT:slug}} (a median).
 *   licence         any NC / SA / ND Creative Commons licence. Everything we
 *                   publish is CC BY 4.0, so a citation's terms are never in doubt.
 *   winrate-unlabelled  {{WINRATE:slug}} not worded as days. It is the share of
 *                   contested days won, not the share of {{LED}}'s corridors —
 *                   "led 23 of 97 … a 21.7% win rate" (23/97 = 23.7%). Beside a
 *                   corridor count use {{LEADRATE:slug}}.
 *
 * RATCHET — legacy debt that may shrink but never grow (scripts/claims-baseline.json):
 *   markup-figure   hand-typed markup figures in prose: "within 0.5–1% of the
 *                   mid-market rate", "a 2–4% markup". Hundreds sit in the
 *                   March corridor descriptions; rewriting them in bulk is
 *                   the duplication risk the corridor rules forbid. New
 *                   content must use {{MARKUP:…}}, {{AVG_MARKUP_PCT:…}} or
 *                   {{BANK_MEDIAN}}. Lower the baseline when you fix some:
 *                   `npx tsx scripts/check-claims.ts --update-baseline`.
 *   invented-example table cells marked "(example)" holding made-up payouts.
 *   provider-best-rate "Wise offers the best KRW rates", "Instarem often has the
 *                   most competitive SGD/BDT rates" — a provider crowned on a
 *                   route by hand. Use {{CORRIDOR_LEADER:FROM:TO}}.
 *
 * Scope: src/**\/*.ts(x) except scraped data, comment lines, and
 * ai-prompt-benchmark.ts (prompts we send to AI assistants, not page copy);
 * and messages/*.json — the i18n catalogue holds the homepage FAQ, and went
 * unscanned until 2026-09-29, when "Wise consistently ranks highest" was
 * found in it by an outside audit rather than by this check.
 *
 * BUILT PASS (--built, postbuild): a corridor page that holds ONE estimate
 * ("…is the only estimate we hold…") must not be titled "Cheapest" or "Best" —
 * one quote cannot be the cheapest of anything (round-2 brief item 2.1). Nor
 * may one pricing fewer than MIN_PROVIDERS_FOR_SUPERLATIVE_TITLE (3) providers,
 * read from the page's data-compared-providers (round-3 brief §4.3).
 *
 * Usage: npx tsx scripts/check-claims.ts [--list] [--update-baseline] [--built]
 */
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { MIN_PROVIDERS_FOR_SUPERLATIVE_TITLE, SUPERLATIVE_TITLE } from "../src/lib/corridor-title-claims";

const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "src");
const MESSAGES = join(ROOT, "messages");
const BASELINE = join(__dirname, "claims-baseline.json");
const SKIP_FILES = new Set(["ai-prompt-benchmark.ts"]);

interface Rule {
  id: string;
  re: RegExp;
  /** Return true to ignore a match, given the text before it on the line. */
  allow?: (before: string, match: string, after: string) => boolean;
}

const NEGATED = /\b(?:not|never|isn['’]t|aren['’]t|don['’]t|doesn['’]t|assuming (?:any )?(?:one )?(?:provider )?(?:is )?)\s*(?:\w+\s+){0,2}$/i;
// "No single provider has the best rate on most corridors" denies the claim.
const NO_SINGLE = /\bno (?:single )?(?:provider|app|service)\b[^.]*$/i;

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
  // The same claim without the word "cheapest". Six country FAQs said "Wise
  // offers the best EUR/AUD/CAD/NZD rates for most corridors" while their own
  // route's leader was someone else — USD→EUR: InstaReM, 89 of 91 days
  // (2026-09-29). "No single provider has the best rate on most corridors" is fine.
  {
    id: "best-most",
    re: /\bbest\s+(?:[A-Z]{3}\s+)?(?:exchange\s+|FX\s+)?(?:rates?|value|choice|option|deal)\s+(?:for|on|in|across)\s+(?:most|the majority)\b/gi,
    allow: (before) => NEGATED.test(before) || NO_SINGLE.test(before),
  },
  // "consistently offer the best rates", "consistently ranks highest",
  // "consistently rated #1": a standing lead nothing measured — the homepage
  // FAQ said it of Wise, a Sri Lanka FAQ of three providers that led none of it.
  {
    id: "consistently-best",
    re: /\b(?:consistently|always|reliably|invariably)\s+(?:(?:offers?|gives?|has|have|gets?|provides?)\s+)?(?:the\s+)?(?:best|highest|top|tightest|lowest|most\s+competitive)\s+(?:[A-Z]{3}(?:\/[A-Z]{3})?\s+)?(?:rates?|exchange\s+rates?|value|deal|payouts?|spreads?|(?:exchange\s+rate\s+)?margins?)\b|\b(?:consistently|always|reliably|invariably)\s+(?:ranks?|rated|scores?)\s+(?:the\s+|as\s+)?(?:highest|top|first|best|#1|among)\b/gi,
    // "compare who consistently gives the best deal" asks; it does not claim.
    allow: (before) => NEGATED.test(before) || /\b(?:who|which(?:\s+\w+)?)\s*$/i.test(before),
  },
  // A quick-pick table row that crowns a provider "Cheapest …" by hand. Wise
  // was labelled "Cheapest (US → UK)" where InstaReM led USD→GBP on 91 of 91
  // days. Live tokens ({{BEST_PROVIDER:…}}) are fine — they are not typed.
  { id: "cheapest-label", re: /<td>\s*<strong>\s*Cheapest\b[^<]*<\/strong>\s*<\/td>\s*<td>\s*<a href="\/companies\/|<td>\s*Cheapest total cost\s*<\/td>/gi },
  // The UK stayed in SEPA's geographical scope after Brexit (EPC Board
  // decision, 7 March 2019); it counts as non-EEA, so euro payments need the
  // BIC and the payer's address. ~30 passages said it had left (2026-09-29).
  {
    id: "uk-sepa",
    re: /\b(?:UK|United Kingdom|British)\b[^.]{0,40}\b(?:no longer (?:a member of |part of |in )(?:the )?SEPA|left SEPA|lost (?:direct )?SEPA)|\bnot eligible for SEPA\b/gi,
    allow: (before) => /incorrectly/i.test(before),
  },
  { id: "trustpilot", re: /\b\d\.\d\s*\/\s*5\s*(?:\(|on\s+)?Trustpilot|Trustpilot(?:\s+(?:rating|score))?[^.<\d{]{0,40}\d\.\d\b/gi , allow: (_b, m) => /\b(?:below|above|under|over)\b/i.test(m) },
  { id: "avg-markup", re: /\d+(?:\.\d+)?%\s*(?:avg|average)\.?\s+mark-?up|\b(?:avg|average)\s+mark-?up\s+(?:of\s+)?(?:about\s+|~)?\d/gi },
  // One licence for everything we publish — content, datasets, API output:
  // CC BY 4.0 (owner decision, 2026-09-29). /for-ai, llms.txt and /api/ai said
  // CC BY while /research and six Dataset schemas said CC BY-NC-SA, a Mar 19
  // fix for a GSC "missing license" warning that later pages copied. NC deters
  // the commercial newsrooms and AI companies we want citing the data.
  { id: "licence", re: /creativecommons\.org\/licenses\/by-(?:nc|sa|nd)\b|\bCC[- ]BY[- ](?:NC|SA|ND)\b/gi },
  // {{WINRATE}} is the share of contested DAYS won, not the share of the
  // corridors {{LED}} prints. "Wise led 23 of 97 … a 21.7% win rate" read as
  // 23/97 (= 23.7%) on /companies/wise until 2026-10-08 (round-3 brief §4.3).
  // Beside a corridor count use {{LEADRATE}}; WINRATE must name its days.
  {
    id: "winrate-unlabelled",
    re: /\{\{WINRATE:[a-z0-9-]+\}\}/g,
    allow: (before, _m, after) => /\bdays?\b/i.test(after.slice(0, 50)) || /\bdays?\b[^.]{0,40}$/i.test(before),
  },
];

const RATCHET: Rule[] = [
  // "₦2,050,000 (example)": invented figures in a table dressed as a comparison.
  // Replace with {{QUOTE_TABLE:…}} or {{BEST_PROVIDER:…}}/{{BEST_RECEIVE:…}}.
  { id: "invented-example", re: /\(example\)<\/td>/g },
  // "Wise offers the best KRW rates", "Instarem often has the most competitive
  // SGD/BDT rates": a named provider crowned on a route, unmeasured. ~30 sit in
  // the March country and corridor copy; the absolute forms ("consistently …")
  // are HARD above. Replace with {{CORRIDOR_LEADER:…}} as you touch them.
  // Questions ("Which provider has the best rate?") and generic subjects
  // ("a platform that offers the best rate for GBP-to-INR") are not claims.
  {
    id: "provider-best-rate",
    re: /\b(?:offers?|provides?|gives?|has|have)\s+(?:the\s+)?(?:best|tightest|most\s+competitive)\s+(?:[A-Z]{3}(?:\/[A-Z]{3})?\s+)?(?:exchange\s+rates?|rates?|spreads?|(?:exchange\s+rate\s+)?margins?)\b/gi,
    allow: (before, _m, after) =>
      /^[^.!]*\?/.test(after) ||
      NEGATED.test(before) ||
      NO_SINGLE.test(before) ||
      /\b(?:which|who|whichever|what|that|some|any)\s+(?:\w+\s+){0,2}(?:(?:often|usually|typically|tends? to)\s+)?$/i.test(before),
  },
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
const files = [
  ...walk(SRC),
  ...readdirSync(MESSAGES).filter((n) => n.endsWith(".json")).map((n) => join(MESSAGES, n)),
];
for (const file of files) {
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
    if (html.includes("only estimate we hold") && SUPERLATIVE_TITLE.test(title)) {
      hits.push({ rule: "single-estimate-title", file: `send-money/${f}`, line: 0, text: title });
    }
    // Round-3 brief §4.3: /send-money/aud-to-bdt kept "Cheapest Way…" with two
    // providers. The page stamps the count its title was resolved against.
    const compared = html.match(/data-compared-providers="(\d+)"/)?.[1];
    if (compared !== undefined && Number(compared) < MIN_PROVIDERS_FOR_SUPERLATIVE_TITLE && SUPERLATIVE_TITLE.test(title)) {
      hits.push({ rule: "few-providers-title", file: `send-money/${f}`, line: 0, text: `${compared} provider(s): ${title}` });
    }
  }
  HARD.push({ id: "single-estimate-title", re: /$^/ }, { id: "few-providers-title", re: /$^/ });
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
