/**
 * Round-2 appendix diagnostic over saved, rendered HTML (not SiteLiner).
 *
 * Usage: node scripts/check-round2-duplication.mjs --html-dir /tmp/round2-html
 * Files are named encodeURIComponent(path) + '.html'. Include every appendix
 * URL and every listed match. This checks the 39 priority URLs and four named
 * original URLs (42 distinct), against the full appendix corpus. It does not
 * replace the original 37-page check or the consultant's production re-crawl.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';

const root = fileURLToPath(new URL('../', import.meta.url));
const option = (name) => {
  const i = process.argv.indexOf(name);
  return i < 0 ? undefined : process.argv[i + 1];
};
const directory = option('--html-dir');
if (!directory || directory.startsWith('--')) {
  console.error('Required: --html-dir DIRECTORY containing saved rendered HTML.');
  process.exit(1);
}
const inventory = JSON.parse(readFileSync(resolve(root, 'seo/content-brief-2026-09-round2/duplication-targets.json'), 'utf8'));
const originalFour = new Set([
  '/guides/exchange-rate-markup-explained',
  '/guides/swift-codes-explained',
  '/news/revolut-africa-14-corridors-airtel-mtn-orange-money-2026',
  '/compare/wise-vs-remitly',
]);
const paths = [...new Set(inventory.flatMap((row) => [row.path, row.matches]))];
const failures = [];
const pages = [];
for (const path of paths) {
  try {
    const $ = load(readFileSync(resolve(directory, encodeURIComponent(path) + '.html'), 'utf8'));
    $('script, style, svg').remove();
    if ($('h1').length !== 1 || !$('main').length) throw new Error('expected one H1 and a main element');
    const words = $('main').text().toLowerCase().match(/[a-z0-9]+/g) ?? [];
    if (words.length < 50) throw new Error('too little main text to measure');
    pages.push({ path, words, shingles: new Set(words.slice(9).map((_, i) => words.slice(i, i + 10).join(' '))) });
  } catch (error) {
    failures.push({ path, error: error.message });
  }
}
const targets = new Set(inventory.filter((row) => row.priority || originalFour.has(row.path)).map((row) => row.path));
const results = [];
for (const page of pages.filter((page) => targets.has(page.path))) {
  let max = 0;
  let match = null;
  for (const other of pages) {
    if (other === page) continue;
    const duplicate = new Uint8Array(page.words.length);
    for (let i = 0; i + 10 <= page.words.length; i++) {
      if (other.shingles.has(page.words.slice(i, i + 10).join(' '))) duplicate.fill(1, i, i + 10);
    }
    const share = duplicate.reduce((sum, value) => sum + value, 0) / page.words.length * 100;
    if (share > max) { max = share; match = other.path; }
  }
  results.push({ path: page.path, words: page.words.length, localMaxPairwiseOverlap: +max.toFixed(1), match, passes: max < 30 });
}
results.sort((a, b) => b.localMaxPairwiseOverlap - a.localMaxPairwiseOverlap);
const report = {
  generatedAt: new Date().toISOString(),
  method: 'Maximum pairwise share of main-text words covered by shared 10-word shingles; not SiteLiner and not the sitewide union-overlap checker',
  expectedCorpusPages: paths.length,
  measuredCorpusPages: pages.length,
  expectedTargets: targets.size,
  passingTargets: results.filter((row) => row.passes).length,
  failures,
  results,
};
const output = option('--output');
if (output) writeFileSync(resolve(output), JSON.stringify(report, null, 2) + '\n');
console.log(`${report.passingTargets}/${targets.size} targets below 30%; ${pages.length}/${paths.length} corpus pages measured.`);
for (const row of results) console.log(`${row.localMaxPairwiseOverlap.toFixed(1).padStart(5)}% ${row.path}`);
for (const failure of failures) console.error(`Missing/invalid: ${failure.path}: ${failure.error}`);
if (failures.length || results.length !== targets.size || results.some((row) => !row.passes)) process.exitCode = 1;
