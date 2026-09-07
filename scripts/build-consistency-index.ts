#!/usr/bin/env tsx
/**
 * build-consistency-index.ts
 *
 * WHY THIS EXISTS
 * `provider-consistency.ts` answers "who is usually cheapest on THIS corridor"
 * and has done since it shipped — but only ever as a widget inside a corridor
 * page. The site therefore computes, on every build, the one number no
 * competitor can copy ("Ria delivered the most on 68 of the last 91 days on
 * USD->INR") and then publishes it 212 times on pages Google has never
 * crawled, with no URL that states the site-wide finding at all.
 *
 * This script rolls the per-corridor records up into a single site-wide index
 * so `/provider-consistency` can state it once, citably.
 *
 * ONE DATASTORE
 * It reads `rate-insights.json`, which `build-rate-insights.ts` already built
 * by calling `computeProviderConsistency` — the same function the corridor
 * pages render. It does NOT recompute from the raw history. That is deliberate:
 * a second implementation would drift from the first, and this codebase has
 * already paid for that once (see remittance-cost-index.ts, which existed
 * because a page and its own FAQ disagreed about where its numbers came from).
 *
 * WHY THE OUTPUT IS A SEPARATE SMALL FILE
 * rate-insights.json is 24 MB. Commit 5adc949b4 exists solely to stop a file
 * that size being pulled into every edge function. A route may import
 * `consistency-index.json`; it must never import rate-insights.json.
 *
 * Usage: npx tsx scripts/build-consistency-index.ts
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import type { ProviderConsistency } from "../src/lib/provider-consistency";

const INSIGHTS_PATH = path.join("src/data/scraped/rate-insights.json");
const OUTPUT_PATH = path.join("src/data/scraped/consistency-index.json");

/**
 * A provider needs to be a habitual leader somewhere, or to have quoted a
 * meaningful number of contested days, before it earns a row. Without this the
 * table's tail is providers with one contested day and a 100% win rate — the
 * exact false-precision the underlying module was written to avoid.
 */
const MIN_CONTESTED_DAYS = 30;

interface InsightEntry {
  corridor?: string;
  dateRange?: { from?: string; to?: string };
  providerConsistency?: ProviderConsistency | null;
}

export interface ConsistencyIndexRow {
  providerSlug: string;
  providerName: string;
  /** Corridors where this provider is the most frequent winner. */
  corridorsLed: number;
  /** Comparable corridors this provider quotes on at all. */
  corridorsQuoted: number;
  /** Contested provider-days won, summed across corridors. */
  wins: number;
  /** Contested provider-days quoted, summed across corridors. */
  quotedDays: number;
  /** wins / quotedDays as a percentage. */
  winRate: number;
  /**
   * Mean shortfall against the day's winner, weighted by quoted days.
   * The "how much does picking wrong cost" figure — a provider can lead
   * rarely and still be a fine choice if it loses by 0.1%.
   */
  avgShortfallPct: number;
  /** Share of the comparable corridors it quotes on that it leads. */
  leadRate: number;
}

export interface ConsistencyIndex {
  /** Date of the newest observation behind the index. */
  dataAsOf: string;
  /** Corridors with a genuine contested record (2+ providers, 5+ days). */
  comparableCorridors: number;
  /** Currency pairs held in history, comparable or not. */
  pairsTracked: number;
  /**
   * Corridor-days where at least two providers quoted — the days that are
   * evidence. NOT a provider-day count: one such day carries as many
   * observations as there were providers quoting in it.
   */
  contestedCorridorDays: number;
  /**
   * Provider-day observations behind the index: every (corridor, day,
   * provider) triple on a contested day. This is the measurement count.
   */
  providerDayObservations: number;
  /** Longest window any corridor contributed, in days. */
  maxWindowDays: number;
  rows: ConsistencyIndexRow[];
  /** Corridors where today's best is NOT the habitual leader. */
  rotatingCorridors: number;
  /** Corridors where the habitual leader is also winning today. */
  stableCorridors: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

function build(): ConsistencyIndex {
  const insights = JSON.parse(readFileSync(INSIGHTS_PATH, "utf8")) as Record<string, InsightEntry>;

  interface Acc {
    slug: string;
    name: string;
    corridorsLed: number;
    corridorsQuoted: number;
    wins: number;
    quotedDays: number;
    shortfallWeighted: number;
  }
  const acc = new Map<string, Acc>();

  let comparableCorridors = 0;
  let contestedCorridorDays = 0;
  let providerDayObservations = 0;
  let maxWindowDays = 0;
  let rotating = 0;
  let stable = 0;
  let dataAsOf = "";

  for (const entry of Object.values(insights)) {
    const end = entry.dateRange?.to;
    if (end && end > dataAsOf) dataAsOf = end;

    const pc = entry.providerConsistency;
    if (!pc || pc.leaders.length === 0) continue;

    comparableCorridors += 1;
    maxWindowDays = Math.max(maxWindowDays, pc.windowDays);
    if (pc.todayBest) {
      if (pc.todayBestIsUsualLeader) stable += 1;
      else rotating += 1;
    }

    const leaderSlug = pc.leaders[0].providerSlug;

    for (const l of pc.leaders) {
      const a =
        acc.get(l.providerSlug) ??
        {
          slug: l.providerSlug,
          name: l.providerName,
          corridorsLed: 0,
          corridorsQuoted: 0,
          wins: 0,
          quotedDays: 0,
          shortfallWeighted: 0,
        };
      a.corridorsQuoted += 1;
      a.wins += l.wins;
      a.quotedDays += l.quotedDays;
      a.shortfallWeighted += l.avgShortfallPct * l.quotedDays;
      providerDayObservations += l.quotedDays;
      if (l.providerSlug === leaderSlug) a.corridorsLed += 1;
      // A slug's display name is resolved once at insight-build time; keep the
      // first non-slug spelling we see rather than letting a later corridor
      // overwrite it with a raw slug.
      if (a.name === a.slug && l.providerName !== l.providerSlug) a.name = l.providerName;
      acc.set(l.providerSlug, a);
    }

    // Counted once per corridor, not once per provider — summing every
    // provider's quotedDays here would multiply the same day by the size of
    // the field. That product is a real quantity, but it is the observation
    // count (`providerDayObservations`), not a number of days.
    contestedCorridorDays += pc.contestedDays;
  }

  const rows: ConsistencyIndexRow[] = [...acc.values()]
    .filter((a) => a.quotedDays >= MIN_CONTESTED_DAYS)
    .map((a) => ({
      providerSlug: a.slug,
      providerName: a.name,
      corridorsLed: a.corridorsLed,
      corridorsQuoted: a.corridorsQuoted,
      wins: a.wins,
      quotedDays: a.quotedDays,
      winRate: round2((a.wins / a.quotedDays) * 100),
      avgShortfallPct: round2(a.shortfallWeighted / a.quotedDays),
      leadRate: round2((a.corridorsLed / a.corridorsQuoted) * 100),
    }))
    .sort((a, b) => b.corridorsLed - a.corridorsLed || b.winRate - a.winRate);

  return {
    dataAsOf,
    comparableCorridors,
    pairsTracked: Object.keys(insights).length,
    contestedCorridorDays,
    providerDayObservations,
    maxWindowDays,
    rows,
    rotatingCorridors: rotating,
    stableCorridors: stable,
  };
}

const index = build();
writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2));
console.log(
  `consistency-index.json: ${index.rows.length} providers over ${index.comparableCorridors} comparable corridors ` +
    `(${index.providerDayObservations} provider-day observations across ` +
    `${index.contestedCorridorDays} contested corridor-days, as of ${index.dataAsOf})`,
);
