#!/usr/bin/env tsx
/**
 * build-corridor-leaders.ts
 *
 * WHY THIS EXISTS
 * The site computes, per corridor, the one number no competitor can copy —
 * "Ria delivered the most on 73 of the last 91 days on USD->INR" — and then
 * publishes it only on corridor pages, which Google last crawled in March 2026.
 * Meanwhile /guides/*, the one family Google still crawls weekly, carries 60
 * hand-written claims that CONTRADICT that record ("Wise almost always delivers
 * the most rupees"; Ria won 73 of 91).
 *
 * This emits a compact per-pair leader record so {{CORRIDOR_LEADER:USD:INR}} can
 * state the measured finding in a guide instead of an author's recollection.
 * Same argument as {{LEADS:wise}}, which exists because guides carried
 * unqualified "X is consistently cheapest" lines the consistency index
 * contradicted — this is that fix at corridor resolution.
 *
 * WHY A SEPARATE SMALL FILE
 * rate-insights.json is 25 MB and rate-history.ts imports it statically. Pulling
 * that into ratings-tokens.ts would drag it into every guide, business page and
 * build script that renders a token. build-consistency-index.ts already
 * established the pattern: read the big file here, ship a small one.
 *
 * Usage: npx tsx scripts/build-corridor-leaders.ts
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const INSIGHTS = path.join("src/data/scraped/rate-insights.json");
const OUTPUT = path.join("src/data/scraped/corridor-leaders.json");

/** Below this the "usual leader" is a coin toss dressed as a finding. */
const MIN_CONTESTED_DAYS = 30;

type Leader = { providerSlug: string; providerName?: string; wins: number };
type Insight = {
  providerConsistency?: {
    windowDays: number;
    contestedDays: number;
    leaders: Leader[];
  };
};

const raw = JSON.parse(readFileSync(INSIGHTS, "utf8")) as Record<string, Insight>;
const out: Record<string, { name: string; slug: string; wins: number; contestedDays: number; windowDays: number }> = {};

let skippedThin = 0;
for (const [pair, insight] of Object.entries(raw)) {
  const pc = insight?.providerConsistency;
  if (!pc?.leaders?.length) continue;
  if (pc.contestedDays < MIN_CONTESTED_DAYS) { skippedThin++; continue; }
  const top = pc.leaders[0];
  if (!top || top.wins <= 0) continue;
  out[pair] = {
    name: String(top.providerName ?? top.providerSlug),
    slug: top.providerSlug,
    wins: top.wins,
    contestedDays: pc.contestedDays,
    windowDays: pc.windowDays,
  };
}

writeFileSync(OUTPUT, JSON.stringify(out, null, 0));
const bytes = readFileSync(OUTPUT).length;
console.log(
  `build:corridor-leaders — ${Object.keys(out).length} pairs with a usual leader ` +
  `(${skippedThin} skipped under ${MIN_CONTESTED_DAYS} contested days), ${(bytes / 1024).toFixed(0)} KB`,
);
