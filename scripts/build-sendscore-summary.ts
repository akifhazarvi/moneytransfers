#!/usr/bin/env tsx
/**
 * build-sendscore-summary.ts
 *
 * WHY THIS EXISTS
 * SendScore is a metric this site invented, and as of 2026-09-06 it was defined
 * nowhere a reader could point at: `grep` found it only inside
 * /send-money/[corridor]. /methodology never mentioned it. A named metric with
 * no definition URL cannot be cited as an entity — anyone wanting to reference
 * "SendScore" has nothing to reference.
 *
 * This emits the small payload behind /sendscore: how the score is distributed
 * across corridors today, and one worked example showing all four components.
 *
 * THE INTEGRITY POINT — READ BEFORE CHANGING THE FILTER
 * 965 of 1,012 tracked pairs carry a SendScore, but 757 of those are
 * single-provider corridors, which `computeSendScore` deliberately clamps to
 * the neutral band. Publishing the raw distribution would report "794 of 965
 * corridors are a typical time to send", which is not a finding about FX — it
 * is a restatement of the clamp. Only corridors with a real comparison are
 * summarised here, which is 208 of them.
 *
 * Reads rate-insights.json (24 MB, script-side only — never import it from a
 * route) and writes a ~2 KB summary.
 *
 * Usage: npx tsx scripts/build-sendscore-summary.ts
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import type { SendScore, SendScoreBand } from "../src/lib/send-score";

const INSIGHTS_PATH = path.join("src/data/scraped/rate-insights.json");
const OUTPUT_PATH = path.join("src/data/scraped/sendscore-summary.json");

/**
 * The clamp's headline. A single-provider corridor produces a reading, not a
 * comparison, and `computeSendScore` says so in the headline rather than the
 * band — so this is the honest way to detect one from the outside.
 */
const SINGLE_PROVIDER_HEADLINE = "Only one provider here";

/**
 * Preferred worked examples, in order. Picking the corridor closest to a
 * mid-range score would change the example on most builds, so a definition
 * page would churn its own copy daily. These are head corridors likely to
 * qualify; the closest-to-60 fallback only applies if none do.
 */
const PREFERRED_EXAMPLES = ["USD-INR", "USD-PHP", "USD-MXN", "GBP-INR", "USD-NGN", "EUR-INR", "GBP-NGN"];

interface InsightEntry {
  dateRange?: { from?: string; to?: string };
  sendScore?: SendScore | null;
}

export interface SendScoreSummary {
  dataAsOf: string;
  /** Corridors with a real comparison behind the score. */
  corridorsScored: number;
  /** Corridors carrying a score of any kind, including single-provider readings. */
  corridorsWithAnyScore: number;
  /** Excluded from the distribution — a reading, not a comparison. */
  singleProviderReadings: number;
  bands: Record<SendScoreBand, number>;
  /** "good" or better, as a share of `corridorsScored`. */
  goodOrBetterPct: number;
  confidence: { high: number; medium: number; low: number };
  /** Median days of history behind the scored corridors. */
  medianDaysObserved: number;
  example: { pair: string; score: SendScore } | null;
}

const EMPTY_BANDS: Record<SendScoreBand, number> = {
  exceptional: 0,
  great: 0,
  good: 0,
  typical: 0,
  poor: 0,
};

function build(): SendScoreSummary {
  const insights = JSON.parse(readFileSync(INSIGHTS_PATH, "utf8")) as Record<string, InsightEntry>;

  const bands = { ...EMPTY_BANDS };
  const confidence = { high: 0, medium: 0, low: 0 };
  const days: number[] = [];
  const candidates = new Map<string, SendScore>();
  let dataAsOf = "";
  let corridorsWithAnyScore = 0;
  let singleProviderReadings = 0;

  for (const [pair, entry] of Object.entries(insights)) {
    const to = entry.dateRange?.to;
    if (to && to > dataAsOf) dataAsOf = to;

    const ss = entry.sendScore;
    if (!ss) continue;
    corridorsWithAnyScore += 1;
    if (ss.headline.includes(SINGLE_PROVIDER_HEADLINE)) {
      singleProviderReadings += 1;
      continue;
    }

    bands[ss.band] += 1;
    confidence[ss.confidence] += 1;
    days.push(ss.daysObserved);
    // A worked example is only useful if it shows every component.
    if (ss.components.length === 4 && ss.confidence === "high") candidates.set(pair, ss);
  }

  const corridorsScored = days.length;
  const goodOrBetter = bands.good + bands.great + bands.exceptional;
  const sortedDays = [...days].sort((a, b) => a - b);

  let example: SendScoreSummary["example"] = null;
  const preferred = PREFERRED_EXAMPLES.find((p) => candidates.has(p));
  if (preferred) {
    example = { pair: preferred, score: candidates.get(preferred)! };
  } else if (candidates.size > 0) {
    const [pair, score] = [...candidates.entries()].sort(
      (a, b) => Math.abs(a[1].score - 60) - Math.abs(b[1].score - 60),
    )[0];
    example = { pair, score };
  }

  return {
    dataAsOf,
    corridorsScored,
    corridorsWithAnyScore,
    singleProviderReadings,
    bands,
    goodOrBetterPct: corridorsScored > 0 ? Math.round((goodOrBetter / corridorsScored) * 100) : 0,
    confidence,
    medianDaysObserved: sortedDays.length ? sortedDays[Math.floor(sortedDays.length / 2)] : 0,
    example,
  };
}

const summary = build();
writeFileSync(OUTPUT_PATH, JSON.stringify(summary, null, 2));
console.log(
  `sendscore-summary.json: ${summary.corridorsScored} scored corridors ` +
    `(${summary.goodOrBetterPct}% good or better), ${summary.singleProviderReadings} single-provider readings excluded, ` +
    `example ${summary.example?.pair ?? "none"}, as of ${summary.dataAsOf}`,
);
