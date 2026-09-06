/**
 * SendScore — "is today a good day to send?" as one explainable number.
 *
 * WHY THIS EXISTS
 * The site already answers "who is cheapest right now". Nobody else answers
 * "is now a good time", because it needs months of *provider* rate history
 * rather than mid-market history, which is the one asset we have and
 * competitors would need to start collecting today to match.
 *
 * The existing `levelPct` is a single factor — where today's best receive
 * amount sits between the cheapest and dearest day ever tracked. That is a
 * reasonable signal and a poor score: it ignores how far back the range goes,
 * treats a 3-day-old range the same as a 90-day one, and says nothing about
 * whether the market moved this week.
 *
 * DESIGN CONSTRAINT: explainable beats clever.
 * Every score carries the sentence that produced it, built from the same
 * numbers, so the headline and the explanation cannot drift apart. If a
 * component cannot be computed honestly it is dropped and the remaining
 * weights are renormalised — the score never invents a factor to look precise.
 *
 * Weights (40/25/20/15) are deliberately round. They are a judgement about
 * what a sender cares about, not a fitted model, and pretending otherwise
 * would be the false precision this module is meant to avoid.
 */

/** One day of the best offer available across all providers on that day. */
export interface DailyBest {
  date: string;
  rate: number;
  receiveAmount: number;
  provider: string;
}

export interface SendScoreComponent {
  key: "range" | "average" | "competitiveness" | "trend";
  label: string;
  weight: number;
  /** 0–100, before weighting. */
  score: number;
  /** The measured quantity, for the explanation. */
  detail: string;
}

export type SendScoreBand = "exceptional" | "great" | "good" | "typical" | "poor";

export interface SendScore {
  score: number;
  band: SendScoreBand;
  /** e.g. "Great time to send" */
  headline: string;
  /** One plain sentence, generated from the same numbers as `score`. */
  explanation: string;
  components: SendScoreComponent[];
  /** Days of history the score actually saw. */
  daysObserved: number;
  /** Window the range component used, in days. */
  rangeWindowDays: number;
  /**
   * "high" at 60+ days, "medium" at 30–59, "low" below 30. A low-confidence
   * score is still shown — with the window named — because hiding it would be
   * worse than showing a hedged one.
   */
  confidence: "high" | "medium" | "low";
}

const BANDS: { min: number; band: SendScoreBand; headline: string }[] = [
  { min: 90, band: "exceptional", headline: "Exceptional time to send" },
  { min: 75, band: "great", headline: "Great time to send" },
  { min: 55, band: "good", headline: "Good time to send" },
  { min: 40, band: "typical", headline: "Typical time to send" },
  { min: 0, band: "poor", headline: "Poor time to send" },
];

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const pct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

/** Days between two ISO dates. */
function daysBetween(a: string, b: string): number {
  return Math.abs(Date.parse(b) - Date.parse(a)) / 86_400_000;
}

export interface SendScoreInput {
  /** Daily best offers, any order; deduplicated and sorted internally. */
  history: DailyBest[];
  /** Today's best receive amount across providers. */
  todayReceive: number;
  /**
   * Median receive amount across providers quoting today. Omit when fewer
   * than 3 providers quote — the competitiveness component is then dropped
   * rather than computed from a pair.
   */
  todayMedianReceive?: number | null;
}

/**
 * Compute the score. Returns null when there is too little history to say
 * anything at all (fewer than 7 distinct days).
 */
export function computeSendScore(input: SendScoreInput): SendScore | null {
  const { todayReceive, todayMedianReceive } = input;
  if (!Number.isFinite(todayReceive) || todayReceive <= 0) return null;

  // One entry per day, newest last.
  const byDate = new Map<string, DailyBest>();
  for (const d of input.history) {
    if (Number.isFinite(d.receiveAmount) && d.receiveAmount > 0) byDate.set(d.date, d);
  }
  const days = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  if (days.length < 7) return null;

  const latest = days[days.length - 1].date;
  const within = (n: number) => days.filter((d) => daysBetween(d.date, latest) <= n);

  const comps: SendScoreComponent[] = [];

  // 1. Position in the trailing 90-day range (40%).
  // Uses whatever window exists when history is shorter, and reports it, so a
  // 40-day range is never presented as a 90-day one.
  const rangeDays = within(90);
  const rangeWindowDays = Math.min(90, Math.round(daysBetween(rangeDays[0].date, latest)) || 1);
  const lo = Math.min(...rangeDays.map((d) => d.receiveAmount));
  const hi = Math.max(...rangeDays.map((d) => d.receiveAmount));
  if (hi > lo) {
    const posn = ((todayReceive - lo) / (hi - lo)) * 100;
    comps.push({
      key: "range",
      label: `Position in the ${rangeWindowDays}-day range`,
      weight: 40,
      score: clamp(posn),
      detail:
        posn >= 90
          ? `near the ${rangeWindowDays}-day high`
          : posn <= 10
            ? `near the ${rangeWindowDays}-day low`
            : `${Math.round(posn)}% of the way up the ${rangeWindowDays}-day range`,
    });
  }

  // 2. Today versus the 30-day average (25%).
  // ±3% spans the full scale: FX corridors rarely move more than that in a
  // month, so a wider scale would flatten every real difference to "average".
  const recent = within(30);
  if (recent.length >= 5) {
    const avg = recent.reduce((s, d) => s + d.receiveAmount, 0) / recent.length;
    const diff = ((todayReceive - avg) / avg) * 100;
    comps.push({
      key: "average",
      label: "Versus the 30-day average",
      weight: 25,
      score: clamp(50 + (diff / 3) * 50),
      detail: `${pct(diff)} vs the 30-day average`,
    });
  }

  // 3. How far today's leader beats the rest of the field (20%).
  // This is the one component about provider choice rather than timing: a wide
  // gap means comparing today is worth real money. 0% -> 30, 2%+ -> 100.
  if (todayMedianReceive && todayMedianReceive > 0) {
    const edge = ((todayReceive - todayMedianReceive) / todayMedianReceive) * 100;
    comps.push({
      key: "competitiveness",
      label: "Best provider versus the field",
      weight: 20,
      score: clamp(30 + (edge / 2) * 70),
      detail: `today's best beats the median provider by ${pct(edge)}`,
    });
  }

  // 4. Which way the market has moved this week (15%).
  // Last 7 days against the 7 before. Improving reads as a better moment; a
  // falling market is flagged rather than silently rewarded.
  const last7 = within(7);
  const prev7 = days.filter((d) => {
    const age = daysBetween(d.date, latest);
    return age > 7 && age <= 14;
  });
  if (last7.length >= 3 && prev7.length >= 3) {
    const a = last7.reduce((s, d) => s + d.receiveAmount, 0) / last7.length;
    const b = prev7.reduce((s, d) => s + d.receiveAmount, 0) / prev7.length;
    const move = ((a - b) / b) * 100;
    comps.push({
      key: "trend",
      label: "This week versus last",
      weight: 15,
      score: clamp(50 + (move / 2) * 50),
      detail:
        Math.abs(move) < 0.1
          ? "flat over the past week"
          : `${move > 0 ? "improving" : "falling"} — ${pct(move)} week on week`,
    });
  }

  if (comps.length === 0) return null;

  // Renormalise over the components we could actually compute, so dropping one
  // shifts the score's basis rather than silently scoring it zero.
  const totalWeight = comps.reduce((s, c) => s + c.weight, 0);
  const score = Math.round(comps.reduce((s, c) => s + c.score * c.weight, 0) / totalWeight);

  const { band, headline } = BANDS.find((b) => score >= b.min)!;
  const daysObserved = days.length;
  const confidence = daysObserved >= 60 ? "high" : daysObserved >= 30 ? "medium" : "low";

  return {
    score,
    band,
    headline,
    explanation: buildExplanation(comps, rangeWindowDays, daysObserved, confidence),
    components: comps,
    daysObserved,
    rangeWindowDays,
    confidence,
  };
}

/**
 * The sentence is assembled from the component details rather than written
 * separately, which is what stops a "Great time to send" headline sitting above
 * a falling market. Leads with the two heaviest components, then flags a weak
 * evidence base explicitly instead of hiding it in a tooltip.
 */
function buildExplanation(
  comps: SendScoreComponent[],
  rangeWindowDays: number,
  daysObserved: number,
  confidence: SendScore["confidence"],
): string {
  const get = (k: SendScoreComponent["key"]) => comps.find((c) => c.key === k);
  const parts: string[] = [];

  const avg = get("average");
  const range = get("range");
  if (avg && range) parts.push(`Today's best rate is ${avg.detail}, ${range.detail}`);
  else if (avg) parts.push(`Today's best rate is ${avg.detail}`);
  else if (range) parts.push(`Today's best rate is ${range.detail}`);

  const trend = get("trend");
  if (trend) parts.push(`Rates are ${trend.detail}`);

  const edge = get("competitiveness");
  if (edge) parts.push(edge.detail.charAt(0).toUpperCase() + edge.detail.slice(1));

  let out = parts.join(". ") + ".";
  if (confidence === "low") {
    out += ` Based on only ${daysObserved} days of history, so treat it as indicative.`;
  } else if (rangeWindowDays < 90) {
    out += ` Range measured over ${rangeWindowDays} days — the full history we hold for this corridor.`;
  }
  return out;
}
