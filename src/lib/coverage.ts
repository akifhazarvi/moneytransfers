/**
 * Client-safe COVERAGE phrases.
 *
 * Import this from "use client" components instead of @/lib/site-stats.
 * site-stats computes its numbers from unified-quotes, which statically
 * imports every scraped quote file, so importing it from a client component
 * ships ~8 MB of quote JSON to the browser — /currency-converter was shipping
 * 7.71 MB of client JS for one phrase.
 *
 * The values are baked by scripts/build-site-coverage.ts from COVERAGE itself,
 * so site-stats stays the source of truth and the two cannot drift.
 *
 * SERVER components should keep importing @/lib/site-stats directly — it is
 * the live computation, and on the server the quote corpus is free.
 */
import coverage from "@/data/scraped/site-coverage.json";

export const COVERAGE_TEXT: Readonly<Record<keyof typeof coverage, string>> = coverage;
