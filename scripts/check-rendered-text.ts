/**
 * No word glued to the value before it in rendered text.
 *
 * WHY
 * The source said `{guide.countryName} etiquette: dos and don&rsquo;ts`; the
 * page said "Franceetiquette". When a JSX text run spans several lines and
 * carries an HTML entity, this build drops the space that follows an
 * expression — and an expression at the end of a line drops the line break,
 * which is plain JSX. Nothing in the source looks wrong, so it shipped: the
 * 2026-09-29 scan found "216corridors" on /methodology, "198corridors" on
 * /sendscore, "17providers" on /transfer-cost-by-amount, "89less reaching the
 * recipient" on /provider-consistency, "$1,000across" on a guide, and three
 * on every /travel page. Write `{value}{" "}word` where a space must survive.
 *
 * What is asserted: in the prerendered HTML (scripts removed), no React text
 * boundary `<!-- -->` sits between a word or number and a lowercase word —
 * "France<!-- -->etiquette". Units written straight after a number (27pp,
 * 17th, 3x) are allowed.
 *
 * Usage: npx tsx scripts/check-rendered-text.ts   (needs a build; postbuild)
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const APP = join(__dirname, "..", ".next/server/app/en");
if (!existsSync(APP)) {
  console.error("check:rendered-text needs a build first — run `npm run build`.");
  process.exit(1);
}

/** Suffixes that belong on the number: 27pp, 17th, 2nd, 3x, 5bps, and the rate board's "4src". */
const UNITS = /^(?:pp|th|st|nd|rd|x|bps?|k|m|bn|src)\b/;

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const byText = new Map<string, { pages: number; example: string }>();
for (const file of walk(APP)) {
  const html = readFileSync(file, "utf8").replace(/<script[\s\S]*?<\/script>/g, "");
  for (const m of html.matchAll(/([A-Za-z]{2,}|\d)<!-- -->([a-z]{2,}[^<]{0,30})/g)) {
    if (/^\d$/.test(m[1]) && UNITS.test(m[2])) continue;
    const key = m[2].slice(0, 24);
    const hit = byText.get(key) ?? { pages: 0, example: `${file.slice(APP.length)}: …${m[1]}${m[2]}…` };
    hit.pages++;
    byText.set(key, hit);
  }
}

if (byText.size) {
  console.error(`check:rendered-text — ${byText.size} word(s) glued to the value before them:`);
  for (const [, { pages, example }] of [...byText].sort((a, b) => b[1].pages - a[1].pages).slice(0, 30)) {
    console.error(`  ${String(pages).padStart(4)} page(s)  ${example}`);
  }
  console.error('\n  Write `{value}{" "}word` in the JSX — see the note at the top of this script.');
  process.exit(1);
}
console.log("check:rendered-text ok — no word glued to the value before it");
