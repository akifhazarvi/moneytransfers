/**
 * Provider Consistency Index — the site-wide "who is cheapest *most often*".
 *
 * WHY THIS EXISTS
 * `provider-consistency.ts` has computed this per corridor since it shipped,
 * and the answer was only ever rendered as a widget on `/send-money/[corridor]`
 * — 212 separate statements of a finding, on pages Google has not crawled, with
 * no URL that states the site-wide result. This module is the published index.
 *
 * WHY IT MATTERS COMMERCIALLY
 * "Who is cheapest right now" is a snapshot every comparison site has. "Who is
 * cheapest most often, measured over 91 days" needs provider rate history, and
 * a competitor would have to start collecting today to answer it in three
 * months. It is the one figure here that is genuinely ours to publish.
 *
 * DATA PROVENANCE
 * `consistency-index.json` is written by `scripts/build-consistency-index.ts`,
 * which rolls up the per-corridor records in `rate-insights.json` — themselves
 * produced by `computeProviderConsistency`, the same function the corridor
 * pages render. Nothing is recomputed here, so the index and the corridor
 * widgets cannot disagree.
 *
 * Never import `rate-insights.json` from a route: it is 24 MB, and commit
 * 5adc949b4 exists to keep a file that size out of every edge function. This
 * JSON is ~17 KB.
 */
import raw from "@/data/scraped/consistency-index.json";

export interface ConsistencyRow {
  providerSlug: string;
  providerName: string;
  /** Corridors where this provider is the most frequent winner. */
  corridorsLed: number;
  /** Comparable corridors it quotes on at all. */
  corridorsQuoted: number;
  wins: number;
  quotedDays: number;
  /** wins / quotedDays, %. */
  winRate: number;
  /** Mean shortfall against the day's winner, weighted by quoted days, %. */
  avgShortfallPct: number;
  /** Share of the corridors it quotes on that it leads, %. */
  leadRate: number;
}

export interface ConsistencyIndexData {
  dataAsOf: string;
  comparableCorridors: number;
  pairsTracked: number;
  contestedCorridorDays: number;
  providerDayObservations: number;
  maxWindowDays: number;
  rows: ConsistencyRow[];
  rotatingCorridors: number;
  stableCorridors: number;
}

export const CONSISTENCY_INDEX = raw as ConsistencyIndexData;

/**
 * A provider needs this many corridors before "leads X% of what it quotes" is
 * a claim about the provider rather than about a handful of corridors. BNZ
 * leads 60% of its five corridors, which is true and would top any table
 * sorted on lead rate.
 */
export const MIN_CORRIDORS_FOR_RATE_CLAIM = 40;

/** Ranked by corridors led — the headline ordering. */
export const CONSISTENCY_ROWS = CONSISTENCY_INDEX.rows;

/** The provider leading the most corridors. */
export const TOP_LEADER = CONSISTENCY_ROWS[0];

/**
 * Share of corridors where today's cheapest is NOT the habitual leader.
 *
 * This is the index's most useful finding and the one that justifies the whole
 * comparison table: on roughly a quarter of corridors the leader on the day is
 * not the provider that usually wins, so "check today" is not upsell — it is
 * what the data says.
 */
export const ROTATION_RATE = (() => {
  const decided = CONSISTENCY_INDEX.rotatingCorridors + CONSISTENCY_INDEX.stableCorridors;
  return decided > 0 ? Math.round((CONSISTENCY_INDEX.rotatingCorridors / decided) * 100) : 0;
})();

/**
 * No provider leads a majority of corridors, and saying so plainly is worth
 * more than a "best overall" badge the data does not support.
 */
export const TOP_LEADER_SHARE = CONSISTENCY_INDEX.comparableCorridors > 0
  ? Math.round((TOP_LEADER.corridorsLed / CONSISTENCY_INDEX.comparableCorridors) * 100)
  : 0;

/**
 * Providers that win most of the corridors they appear on but appear on few —
 * the finding a table sorted by absolute wins hides. Ria leads 61% of its 66
 * corridors; Wise leads 35% of its 124. A sender on one of Ria's corridors is
 * given the wrong steer by "Wise leads the most corridors".
 */
export const HIGH_HIT_RATE_SPECIALISTS = CONSISTENCY_ROWS
  .filter(
    (r) =>
      r.corridorsQuoted >= MIN_CORRIDORS_FOR_RATE_CLAIM &&
      r.leadRate > TOP_LEADER.leadRate &&
      r.corridorsQuoted < TOP_LEADER.corridorsQuoted,
  )
  .sort((a, b) => b.leadRate - a.leadRate);

/**
 * Widely-quoting providers whose average shortfall against the day's winner is
 * largest — "how much picking this one costs you when it loses".
 */
export const COSTLIEST_WHEN_LOSING = [...CONSISTENCY_ROWS]
  .filter((r) => r.corridorsQuoted >= MIN_CORRIDORS_FOR_RATE_CLAIM)
  .sort((a, b) => b.avgShortfallPct - a.avgShortfallPct)
  .slice(0, 5);
