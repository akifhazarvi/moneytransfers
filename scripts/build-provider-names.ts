/**
 * Emits src/data/provider-names.json — a small slug -> display-name map derived
 * from the scraped quote dataset.
 *
 * Why this exists: getProviderName() in src/data/providers.ts needs the
 * slug->name map for providers discovered only in scraped data (not in the
 * hardcoded providers array). That map (`providerNames`) was previously built
 * at runtime by iterating the full multi-megabyte scraped dataset in
 * unified-quotes.ts — which meant any client component importing
 * getProviderName statically bundled ~5 MB of quote JSON into the browser.
 *
 * Pre-generating the map (a few KB) lets getProviderName read a static file,
 * severing that import chain. Run as part of the scrape pipeline so the map
 * stays in sync with newly discovered providers:
 *
 *   npx tsx scripts/build-provider-names.ts
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { providerNames } from "../src/lib/unified-quotes";

// providerNames is populated as a side effect of importing unified-quotes
// (it builds the index at module load). Sort keys for a stable diff.
const sorted: Record<string, string> = {};
for (const slug of Object.keys(providerNames).sort()) {
  sorted[slug] = providerNames[slug];
}

const outPath = join(process.cwd(), "src/data/provider-names.json");
writeFileSync(outPath, JSON.stringify(sorted, null, 2) + "\n");
console.log(`Wrote ${Object.keys(sorted).length} provider names to ${outPath}`);
