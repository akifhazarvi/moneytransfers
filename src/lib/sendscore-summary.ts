/**
 * Published SendScore summary — the payload behind /sendscore.
 *
 * Written by `scripts/build-sendscore-summary.ts`. See that file for why the
 * distribution counts only the 208 corridors with a real comparison and not
 * all 965 that carry a score: the other 757 are single-provider readings that
 * `computeSendScore` clamps to the neutral band, so including them would
 * publish the clamp as though it were a finding about exchange rates.
 *
 * ~2 KB, so a route may import it. `rate-insights.json` (24 MB) may not.
 */
import raw from "@/data/scraped/sendscore-summary.json";
import type { SendScore, SendScoreBand } from "@/lib/send-score";

export interface SendScoreSummary {
  dataAsOf: string;
  corridorsScored: number;
  corridorsWithAnyScore: number;
  singleProviderReadings: number;
  bands: Record<SendScoreBand, number>;
  goodOrBetterPct: number;
  confidence: { high: number; medium: number; low: number };
  medianDaysObserved: number;
  example: { pair: string; score: SendScore } | null;
}

export const SENDSCORE_SUMMARY = raw as SendScoreSummary;

/** Display order, best to worst — the order the bands are defined in. */
export const BAND_ORDER: SendScoreBand[] = ["exceptional", "great", "good", "typical", "poor"];

export const BAND_LABELS: Record<SendScoreBand, string> = {
  exceptional: "Exceptional time to send",
  great: "Great time to send",
  good: "Good time to send",
  typical: "Typical time to send",
  poor: "Poor time to send",
};

/** The weights `computeSendScore` applies, published so the score is checkable. */
export const SENDSCORE_WEIGHTS: { key: string; label: string; weight: number; what: string }[] = [
  {
    key: "range",
    label: "Position in the 90-day range",
    weight: 40,
    what: "Where today's best offer sits between the cheapest and dearest day we have recorded for this corridor.",
  },
  {
    key: "average",
    label: "Versus the 30-day average",
    weight: 25,
    what: "How today compares with the past month. ±3% spans the full scale, because FX corridors rarely move more than that in a month.",
  },
  {
    key: "competitiveness",
    label: "Best provider versus the field",
    weight: 20,
    what: "How far today's leader beats the median provider. The one component about provider choice rather than timing — a wide gap means comparing is worth real money.",
  },
  {
    key: "trend",
    label: "This week versus last",
    weight: 15,
    what: "Which way the corridor has moved. A falling market is flagged rather than silently rewarded.",
  },
];
