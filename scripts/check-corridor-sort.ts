/**
 * Every corridor page's provider list descends by what the recipient gets.
 *
 * WHY
 * The round-3 brief (worksheet 11, 2026-10-07) checked /send-money/usa-to-india
 * by hand — "the first 12 values descend" — and asked for an automated test
 * across all corridor pages. Writing it found a real break the spot check
 * missed: an indicative quote (a broker's fixed-markup estimate, appended after
 * the ranked rows by generateQuotes) printed as rank #32 on
 * /send-money/uk-to-india with ₹126,866 under Santander's ₹120,602. Those rows
 * now carry no rank and say "Indicative estimate · not ranked".
 *
 * WHAT IS ASSERTED, in the prerendered HTML of every /send-money/<corridor>:
 *   - the page marks its ranked lists (data-ranked-row="main" | "banks" |
 *     "example-<amount>", each row with data-receive) — the run fails if no
 *     page has one, so a markup change cannot blind the check;
 *   - within each list, no ranked row's payout exceeds a row above it by more
 *     than the documented materiality band (MATERIALITY_BAND_PCT, 0.10%):
 *     rankQuotes deliberately orders payouts inside the band by customer rating
 *     (disclosed on the page, marked "Effectively tied"), so "sorted" means
 *     sorted outside that band — strictly descending is not what we publish;
 *   - indicative rows (data-indicative) come after every ranked row.
 * Strict inversions inside the band are counted and printed, not failed.
 *
 * Usage: npx tsx scripts/check-corridor-sort.ts   (needs a build)
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { MATERIALITY_BAND_PCT } from "../src/lib/rank-quotes";

const DIR = process.env.CHECK_SORT_DIR ?? join(__dirname, "..", ".next/server/app/en/send-money");
if (!existsSync(DIR)) {
  console.error("check:corridor-sort needs a build first — run `npm run build`.");
  process.exit(1);
}
const BAND = MATERIALITY_BAND_PCT / 100;
const EPS = 1e-6;

interface Row { receive: number; indicative: boolean }
const failures: string[] = [];
let pages = 0, withoutList = 0, lists = 0, rows = 0, inBandInversions = 0;

for (const f of readdirSync(DIR).filter((n) => n.endsWith(".html"))) {
  const html = readFileSync(join(DIR, f), "utf8").replace(/<script[\s\S]*?<\/script>/g, "");
  const groups = new Map<string, Row[]>();
  for (const m of html.matchAll(/<[a-z]+\b[^>]*\bdata-ranked-row="([^"]+)"[^>]*>/g)) {
    const tag = m[0];
    const receive = Number(tag.match(/\bdata-receive="([^"]+)"/)?.[1]);
    if (!Number.isFinite(receive)) {
      failures.push(`${f} [${m[1]}]: row without a numeric data-receive`);
      continue;
    }
    const list = groups.get(m[1]) ?? [];
    list.push({ receive, indicative: /\bdata-indicative="1"/.test(tag) });
    groups.set(m[1], list);
  }
  // Country hub pages list origins rather than providers; a route with no
  // quote has no list. Counted, and the run fails if NO page has one.
  if (!groups.size) {
    withoutList++;
    continue;
  }
  pages++;
  for (const [key, list] of groups) {
    lists++;
    rows += list.length;
    let seenIndicative = false;
    let floor = Infinity; // lowest ranked payout so far
    let prev = Infinity;
    list.forEach((r, i) => {
      if (r.indicative) { seenIndicative = true; return; }
      if (seenIndicative) failures.push(`${f} [${key}] row ${i + 1}: ranked row after an indicative one`);
      if (r.receive > floor / (1 - BAND) + EPS) {
        failures.push(`${f} [${key}] row ${i + 1}: ${r.receive} ranked below ${floor} — beyond the ${MATERIALITY_BAND_PCT}% band`);
      } else if (r.receive > prev + EPS) {
        inBandInversions++;
      }
      floor = Math.min(floor, r.receive);
      prev = r.receive;
    });
  }
}

if (!pages) failures.push(`no corridor page in ${DIR} marks a ranked list (data-ranked-row) — the check is blind`);
if (failures.length) {
  console.error(`check:corridor-sort — ${failures.length} ordering failure(s):`);
  for (const e of failures.slice(0, 40)) console.error(`  ${e}`);
  if (failures.length > 40) console.error(`  …and ${failures.length - 40} more`);
  process.exit(1);
}
console.log(
  `check:corridor-sort ok — ${pages} corridor pages, ${lists} ranked lists, ${rows} rows descend by payout ` +
    `(${inBandInversions} rating-ordered tie(s) inside the ${MATERIALITY_BAND_PCT}% band; ${withoutList} page(s) without a provider list)`,
);
