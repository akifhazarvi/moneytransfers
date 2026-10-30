/**
 * The middleware's copy of the corridor answers in gone-corridors.ts, read from
 * src/data/corridor-render-manifest.json, which prebuild writes from that file
 * (scripts/build-corridor-render-manifest.ts) and postbuild re-checks.
 *
 * Edge code imports this, never gone-corridors.ts: deciding a corridor there
 * counts providers in every scraped quote file, and importing it put 5.5 MB of
 * quote JSON into the middleware bundle, merged again by every new middleware
 * instance (2026-09-20 → 2026-10-29). Server pages, route-map and build scripts
 * keep using gone-corridors.ts, where the decisions are made and explained.
 */
import manifest from "@/data/corridor-render-manifest.json";

/** /send-money/<slug> answers 410 (gone-corridors.ts GONE_CORRIDOR_SLUGS). */
export const GONE_CORRIDOR_SLUGS: ReadonlySet<string> = new Set(manifest.gone);

/** Same-intent 301s (gone-corridors.ts DUPLICATE_CORRIDOR_REDIRECTS; empty since 2026-10-08). */
export const DUPLICATE_CORRIDOR_REDIRECTS: ReadonlyMap<string, string> = new Map(
  Object.entries(manifest.redirects as Record<string, string>),
);

const RENDERS: ReadonlySet<string> = new Set(manifest.renders);

/** Does /send-money/<slug> render? gone-corridors.ts corridorPageRenders(), as built. */
export function corridorPageRenders(slug: string | undefined | null): boolean {
  return !!slug && RENDERS.has(slug);
}
