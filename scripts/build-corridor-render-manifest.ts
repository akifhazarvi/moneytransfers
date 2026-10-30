/**
 * Writes src/data/corridor-render-manifest.json — the corridor answers the
 * middleware needs (which /send-money/<slug> is 410, which renders, which
 * 301s), computed by gone-corridors.ts at build time.
 *
 * WHY (2026-10-29)
 * gone-corridors.ts decides a currency-pair corridor by its tier, and the tier
 * counts providers in quotesByCorridor — so importing it pulls unified-quotes
 * and every scraped *-quotes.json. From 2026-09-20 (3e3cdf4cae) the middleware
 * imported it, directly and through retired-urls.ts: a 6.9 MB edge bundle,
 * 5.5 MB of it quote JSON, parsed and merged by every new middleware instance
 * (~0.4 s CPU) before it could answer a page request, cached pages included.
 * Fluid Active CPU per invocation rose 42 → 66 ms the next day. The answers
 * only change when a build changes them, so the build writes them down and
 * the middleware reads ~10 KB (src/lib/corridor-render-manifest.ts).
 *
 * Runs in prebuild, after build-corridor-uniqueness.ts (it reads
 * duplicate-corridors.json) and before anything that reads retired-urls.ts.
 * Sorted, no timestamp: it changes only when a corridor's answer changes —
 * commit it with that change. Postbuild runs --check, so a build can never
 * ship a middleware that disagrees with gone-corridors.ts.
 *
 * Usage: npx tsx scripts/build-corridor-render-manifest.ts [--check]
 *   --check  exit 1 if the file differs from what gone-corridors.ts computes
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  GONE_CORRIDOR_SLUGS,
  DUPLICATE_CORRIDOR_REDIRECTS,
  corridorPageRenders,
} from "../src/lib/gone-corridors";
import { CORRIDOR_PAGE_ALLOWLIST } from "../src/data/corridor-page-allowlist";

const OUT = join(__dirname, "../src/data/corridor-render-manifest.json");

// corridorPageRenders() is false outside the allowlist, so the allowlist is
// the whole domain of slugs that can render.
const manifest = {
  gone: [...GONE_CORRIDOR_SLUGS].sort(),
  renders: [...CORRIDOR_PAGE_ALLOWLIST].filter((slug) => corridorPageRenders(slug)).sort(),
  redirects: Object.fromEntries([...DUPLICATE_CORRIDOR_REDIRECTS].sort(([a], [b]) => a.localeCompare(b))),
};

const body = JSON.stringify(manifest, null, 2) + "\n";
const current = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
const summary = `${manifest.gone.length} gone, ${manifest.renders.length} render, ${Object.keys(manifest.redirects).length} redirect`;

if (process.argv.includes("--check")) {
  if (current !== body) {
    console.error(
      "corridor-render-manifest.json disagrees with gone-corridors.ts — the middleware would answer\n" +
        "/send-money URLs differently from the pages. Run `npx tsx scripts/build-corridor-render-manifest.ts`.",
    );
    process.exit(1);
  }
  console.log(`corridor-render-manifest.json is current (${summary}).`);
} else {
  if (current !== body) writeFileSync(OUT, body);
  console.log(`corridor-render-manifest.json: ${summary}${current === body ? " (unchanged)" : " (written)"}`);
}
