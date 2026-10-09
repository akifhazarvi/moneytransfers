/**
 * No impossible SWIFT/BIC code in hand-written content.
 *
 * WHY
 * On 2026-09-27 the round-3 duplication pass found ~120 SWIFT codes on live
 * pages that could not be real: four letters spliced into the middle of the
 * code (Bancolombia's COLOCOBM printed as "CO" + "ABOR" + "BB"), another
 * country's letters (a Mexican bank carrying India's "IN"), and 10- or
 * 12-character "BICs" where the standard allows 8 or 11. They came from the
 * content generation of 2026-03-16 and sat live for six months. People copy
 * these into payment forms, so they are checked rather than trusted.
 *
 * What is asserted:
 *   1. No token anywhere in src/ (scraped data excluded) contains the spliced
 *      "ABOR" pattern of that generation.
 *   2. Every non-empty `swiftCode` in corridor-details.ts is 8 or 11
 *      characters with its section's country letters in positions 5–6. The
 *      multi-country "europe" block is exempt from the country check.
 *   3. No 12-character BIC-shaped token appears in the SWIFT or IBAN content,
 *      and no 9- or 10-character one is quoted after a bank name ("— CODE").
 *
 * This checks structure, not existence. A code can pass and still be wrong;
 * where src/data/scraped/swift-codes.json holds the bank, prefer its code.
 *
 * Usage: npx tsx scripts/check-swift-codes.ts
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "src");
const errors: string[] = [];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (p.includes(join("data", "scraped"))) continue;
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

// 1. The spliced pattern, anywhere.
for (const file of walk(SRC)) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/\b[A-Z0-9]{2,6}ABOR[A-Z0-9]{2,7}\b/g)) {
    errors.push(`${file.slice(ROOT.length + 1)}: impossible SWIFT code ${m[0]}`);
  }
}

// 2. corridor-details popularBanks: length and country letters.
{
  const file = join(SRC, "data", "corridor-details.ts");
  const text = readFileSync(file, "utf8");
  const europeStart = text.indexOf("\n  europe: {");
  const europeEnd = europeStart >= 0 ? text.indexOf("\n  },\n", europeStart) : -1;
  const sections = [...text.matchAll(/countryCode:\s*"([A-Z]{2})"/g)].map((m) => ({ at: m.index ?? 0, cc: m[1] }));
  for (const m of text.matchAll(/\{\s*name:\s*"([^"]+)",\s*swiftCode:\s*"([^"]*)"/g)) {
    const [, name, code] = m;
    if (!code) continue; // blank = unverified, rendered as "—"
    const at = m.index ?? 0;
    const cc = sections.filter((s) => s.at < at).at(-1)?.cc;
    const inEurope = europeStart >= 0 && at > europeStart && at < europeEnd;
    if (code.length !== 8 && code.length !== 11) {
      errors.push(`corridor-details.ts: ${name} has a ${code.length}-character SWIFT code ${code}`);
    } else if (!inEurope && cc && code.slice(4, 6) !== cc) {
      errors.push(`corridor-details.ts: ${name} (${cc}) has SWIFT code ${code} with country letters ${code.slice(4, 6)}`);
    }
  }
}

// 3. Wrong-length BIC-shaped tokens in the SWIFT/IBAN content: 12 characters
// anywhere, and 9 or 10 where a code is quoted after a bank name ("Bank — CODE").
// The round-3 QA (2026-10-09) found CITITHTHX (9) and QNBAEGCXXX (10) on live
// SWIFT pages; the 12-only rule let them through. The 9/10 rule is scoped to the
// "— CODE" form so ordinary capitalised words (PAKISTANI) never trip it.
for (const name of ["swift-content-en.ts", "iban-content-en.ts"]) {
  const text = readFileSync(join(SRC, "data", name), "utf8");
  for (const m of text.matchAll(/\b[A-Z]{6}[A-Z0-9]{6}\b/g)) {
    errors.push(`${name}: 12-character SWIFT code ${m[0]} (a BIC has 8 or 11)`);
  }
  for (const m of text.matchAll(/—\s*([A-Z]{6}[A-Z0-9]{3,4})\b/g)) {
    errors.push(`${name}: ${m[1].length}-character SWIFT code ${m[1]} (a BIC has 8 or 11)`);
  }
}

if (errors.length) {
  console.error(`check:swift-codes — ${errors.length} impossible code(s):`);
  for (const e of errors.slice(0, 40)) console.error(`  ${e}`);
  console.error("\n  Replace with the bank's code from src/data/scraped/swift-codes.json, or remove it.");
  process.exit(1);
}
console.log("check:swift-codes ok — no spliced, mis-countried or wrong-length SWIFT codes in content");
