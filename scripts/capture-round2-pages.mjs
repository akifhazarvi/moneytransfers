/** Save raw rendered HTML for the appendix corpus. Use a local preview for
 * before/after work; this is not a SiteLiner crawl or deployment verification.
 * node scripts/capture-round2-pages.mjs --origin http://localhost:3102 --html-dir /tmp/round2-html
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const option = (name) => {
  const i = process.argv.indexOf(name);
  return i < 0 ? undefined : process.argv[i + 1];
};
const origin = option('--origin');
const directory = option('--html-dir');
if (!origin || !directory || origin.startsWith('--') || directory.startsWith('--')) {
  console.error('Required: --origin URL --html-dir DIRECTORY');
  process.exit(1);
}
const base = new URL(origin);
if (!['http:', 'https:'].includes(base.protocol)) throw new Error('Origin must use HTTP(S)');
const root = fileURLToPath(new URL('../', import.meta.url));
const inventory = JSON.parse(readFileSync(resolve(root, 'seo/content-brief-2026-09-round2/duplication-targets.json'), 'utf8'));
const paths = [...new Set(inventory.flatMap((row) => [row.path, row.matches]))];
mkdirSync(directory, { recursive: true });
const results = [];
for (const path of paths) {
  const file = resolve(directory, encodeURIComponent(path) + '.html');
  // Overwrite any previous capture before requesting, so failures cannot leave
  // a stale successful page that would let the checker report a false pass.
  writeFileSync(file, '');
  try {
    const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(90000), redirect: 'manual' });
    if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
    writeFileSync(file, await response.text());
    results.push({ path, status: 200 });
  } catch (error) {
    results.push({ path, error: error.message });
    console.error(`${path}: ${error.message}`);
  }
  if (results.length % 10 === 0) console.log(`${results.length}/${paths.length} checked`);
}
writeFileSync(resolve(directory, 'capture.json'), JSON.stringify({ origin: base.origin, capturedAt: new Date().toISOString(), results }, null, 2) + '\n');
if (results.some((row) => row.error)) process.exitCode = 1;
