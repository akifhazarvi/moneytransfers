/**
 * Time-budget and partial-run helpers shared by scrapers that make hundreds of
 * sequential requests (Remitly, RemitRoutes).
 *
 * Why this exists: CI wraps each scraper in a hard `timeout`. A scraper that is
 * killed writes nothing, so a run that got 88% of the way through throws the
 * whole 88% away. Before 2026-09-26 the kill never actually landed — GitHub's
 * step timeout left the node process running as an orphan, and one of those
 * orphans rewrote its output file mid-`git pull`, aborting the commit step.
 * The fix is to stop *before* the hard kill and write what we have.
 *
 * No playwright import here: RemitRoutes and other API scrapers load this.
 */
import * as fs from "fs";

/**
 * A soft deadline read from `envVar` (seconds), falling back to `defaultSec`.
 * Set the CI hard timeout comfortably above it so the write always happens.
 */
export function createDeadline(envVar: string, defaultSec: number) {
  const raw = Number(process.env[envVar]);
  const budgetSec = Number.isFinite(raw) && raw > 0 ? raw : defaultSec;
  const startedAt = Date.now();
  return {
    budgetSec,
    elapsedSec: () => Math.round((Date.now() - startedAt) / 1000),
    expired: () => Date.now() - startedAt >= budgetSec * 1000,
  };
}

interface Dated {
  dateCollected?: string;
}

/**
 * Keep rows from the previous output whose key this run did not refresh, as
 * long as they are younger than `maxAgeHours`. Rows keep their ORIGINAL
 * `dateCollected`, so nothing downstream mistakes a carried row for a fresh
 * one — the merge layer prefers a fresher source when a carried row is old.
 */
export function carryForward<T extends Dated>(
  outputPath: string,
  fresh: T[],
  keyOf: (row: T) => string,
  maxAgeHours: number
): { rows: T[]; carried: number } {
  let previous: T[] = [];
  try {
    const parsed = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
    if (Array.isArray(parsed)) previous = parsed as T[];
  } catch {
    return { rows: fresh, carried: 0 };
  }
  const refreshed = new Set(fresh.map(keyOf));
  const cutoff = Date.now() - maxAgeHours * 3600_000;
  const kept = previous.filter((row) => {
    if (refreshed.has(keyOf(row))) return false;
    const t = row.dateCollected ? Date.parse(row.dateCollected) : NaN;
    return Number.isFinite(t) && t >= cutoff;
  });
  return { rows: [...fresh, ...kept], carried: kept.length };
}

/**
 * Round an exchange rate to 8 significant digits. A fixed 4 decimal places
 * (the old `Math.round(rate * 10000) / 10000`) keeps only 2–3 significant
 * digits on weak→strong pairs such as JPY→CNY (0.0424) or KRW→PHP (0.046).
 */
export function roundRate(rate: number): number {
  return Number.isFinite(rate) && rate !== 0 ? Number(rate.toPrecision(8)) : rate;
}
