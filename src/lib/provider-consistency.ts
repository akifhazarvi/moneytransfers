/**
 * Provider Consistency — "who is *usually* cheapest here?"
 *
 * WHY THIS EXISTS
 * Every comparison site answers "who is cheapest right now". That number is a
 * snapshot, and on most corridors the leader rotates: a visitor who picks
 * today's winner has no idea whether they picked a habitual leader or a
 * one-day fluke. Answering "usually" needs months of *provider* rate history,
 * which is the asset this site has and a competitor would have to start
 * collecting today to match.
 *
 * It also guards against a real failure of the current UI. Sorting by today's
 * receive amount can hand the top slot to a provider that has led once in
 * ninety days, and nothing on the page says so.
 *
 * DESIGN CONSTRAINTS (shared with send-score.ts)
 * - A "win" only counts on a day where at least two providers quoted. Winning
 *   unopposed is not evidence, and counting it inflated exactly the kind of
 *   claim this codebase has spent its time removing.
 * - Providers below `MIN_OBSERVATIONS` are excluded from the ranking rather
 *   than shown with a percentage computed from a handful of days.
 * - The window and the observation count travel with the result, so copy can
 *   never present a 12-day sample as a 90-day one.
 */

/** One provider's quote on one day. */
export interface ProviderDay {
  date: string;
  providerSlug: string;
  receiveAmount: number;
}

export interface ProviderRecord {
  providerSlug: string;
  /** Resolved at build time — the UI receives slugs and cannot look them up. */
  providerName: string;
  /** Days this provider delivered the most, among contested days it quoted. */
  wins: number;
  /** Contested days this provider actually quoted on. */
  quotedDays: number;
  /** wins / quotedDays, as a percentage. */
  winRate: number;
  /** Mean finishing position among providers quoting that day (1 = best). */
  avgRank: number;
  /** Mean shortfall against the day's best, as a percentage. 0 for a leader. */
  avgShortfallPct: number;
  /**
   * Share of contested days this provider quoted at all.
   *
   * Separating this from `winRate` matters: on GBP->ZAR, Ria wins 86% of the
   * days it appears but only appears on 32% of them, while TapTap Send wins 62%
   * of a corridor it quotes every day. Ranking on wins alone names TapTap Send
   * and hides that Ria beats it whenever present — two genuinely different
   * propositions that a single "usually cheapest" label would flatten.
   */
  coverageRate: number;
}

export interface ProviderConsistency {
  /** Days spanned by the observations actually used. */
  windowDays: number;
  /** Contested days (2+ providers quoting) in the window. */
  contestedDays: number;
  /** Ranked by wins, then by lower average shortfall. */
  leaders: ProviderRecord[];
  /** Today's best provider, for the "is the usual leader also today's?" line. */
  todayBest: string | null;
  /** True when today's best is also the most frequent winner in the window. */
  todayBestIsUsualLeader: boolean;
  /** Ready-made sentence, built from the same numbers as the fields above. */
  summary: string;
}

/** Below this a win rate is noise dressed as a statistic. */
const MIN_OBSERVATIONS = 5;

/** How far back to look. */
const WINDOW_DAYS = 90;

function daysBetween(a: string, b: string): number {
  return Math.abs(Date.parse(b) - Date.parse(a)) / 86_400_000;
}

/**
 * Rank providers by how often they actually deliver the most on this corridor.
 * Returns null when there are too few contested days to say anything.
 */
export function computeProviderConsistency(
  observations: ProviderDay[],
  todayBest: string | null,
  /**
   * Slug -> display name. Injected rather than imported so this module stays
   * pure and testable; without it the summary reads "taptap-send delivered the
   * most", which is a slug leaking into prose.
   */
  displayName: (slug: string) => string = (s) => s,
): ProviderConsistency | null {
  if (observations.length === 0) return null;

  const latest = observations.reduce((m, o) => (o.date > m ? o.date : m), observations[0].date);

  // Group into days, keeping each provider's best figure for that day.
  const byDay = new Map<string, Map<string, number>>();
  for (const o of observations) {
    if (!Number.isFinite(o.receiveAmount) || o.receiveAmount <= 0) continue;
    if (daysBetween(o.date, latest) > WINDOW_DAYS) continue;
    let day = byDay.get(o.date);
    if (!day) byDay.set(o.date, (day = new Map()));
    const prev = day.get(o.providerSlug);
    if (prev === undefined || o.receiveAmount > prev) day.set(o.providerSlug, o.receiveAmount);
  }

  // Only contested days are evidence.
  const contested = [...byDay.entries()].filter(([, m]) => m.size >= 2);
  if (contested.length < MIN_OBSERVATIONS) return null;

  const wins = new Map<string, number>();
  const quoted = new Map<string, number>();
  const rankSum = new Map<string, number>();
  const shortfallSum = new Map<string, number>();

  for (const [, day] of contested) {
    const sorted = [...day.entries()].sort((a, b) => b[1] - a[1]);
    const best = sorted[0][1];
    sorted.forEach(([slug, amount], i) => {
      quoted.set(slug, (quoted.get(slug) ?? 0) + 1);
      rankSum.set(slug, (rankSum.get(slug) ?? 0) + i + 1);
      shortfallSum.set(slug, (shortfallSum.get(slug) ?? 0) + ((best - amount) / best) * 100);
      if (i === 0) wins.set(slug, (wins.get(slug) ?? 0) + 1);
    });
  }

  const leaders: ProviderRecord[] = [...quoted.entries()]
    .filter(([, n]) => n >= MIN_OBSERVATIONS)
    .map(([slug, quotedDays]) => ({
      providerSlug: slug,
      providerName: displayName(slug),
      wins: wins.get(slug) ?? 0,
      quotedDays,
      winRate: ((wins.get(slug) ?? 0) / quotedDays) * 100,
      avgRank: (rankSum.get(slug) ?? 0) / quotedDays,
      avgShortfallPct: (shortfallSum.get(slug) ?? 0) / quotedDays,
      coverageRate: (quotedDays / contested.length) * 100,
    }))
    .sort((a, b) => b.wins - a.wins || a.avgShortfallPct - b.avgShortfallPct);

  if (leaders.length === 0) return null;

  const dates = contested.map(([d]) => d).sort();
  // Inclusive span: 91 dated observations cover 91 days, not the 90 gaps
  // between them. Without the +1 the footnote read "91 days ... over 90 days".
  const windowDays = Math.max(1, Math.round(daysBetween(dates[0], dates[dates.length - 1])) + 1);
  const top = leaders[0];
  const todayBestIsUsualLeader = !!todayBest && top.providerSlug === todayBest;

  return {
    windowDays,
    contestedDays: contested.length,
    leaders,
    todayBest,
    todayBestIsUsualLeader,
    summary: buildSummary(top, leaders, todayBest, todayBestIsUsualLeader, displayName),
  };
}

/**
 * Built from the same records as the ranking, so the sentence cannot claim a
 * leader the table disagrees with. Names the runner-up when the lead is narrow,
 * because "usually cheapest" reads very differently at 62% than at 34%.
 */
function buildSummary(
  top: ProviderRecord,
  leaders: ProviderRecord[],
  todayBest: string | null,
  todayBestIsUsualLeader: boolean,
  name: (slug: string) => string,
): string {
  const pct = Math.round(top.winRate);
  const head = `${name(top.providerSlug)} delivered the most on ${top.wins} of the last ${top.quotedDays} days it quoted here (${pct}%)`;

  const second = leaders[1];
  const close = second && top.wins - second.wins <= Math.max(2, top.wins * 0.2);
  const rival = close ? `, with ${name(second.providerSlug)} close behind on ${Math.round(second.winRate)}%` : "";

  // A provider that quotes rarely but wins most times it does is a real
  // finding, and ranking by absolute wins buries it. Name it explicitly.
  const intermittent = leaders
    .slice(1)
    .find((l) => l.winRate > top.winRate + 10 && l.coverageRate < 60 && l.quotedDays >= MIN_OBSERVATIONS);
  const intermittentNote = intermittent
    ? ` ${name(intermittent.providerSlug)} quotes here less often (${Math.round(intermittent.coverageRate)}% of days) but wins ${Math.round(intermittent.winRate)}% of the days it does — worth checking when it appears.`
    : "";

  if (!todayBest) return `${head}${rival}.${intermittentNote}`;
  if (todayBestIsUsualLeader) {
    return `${head}${rival} — and it is also today's best, so the usual leader is winning today.${intermittentNote}`;
  }
  const todayRecord = leaders.find((l) => l.providerSlug === todayBest);
  const todayNote = todayRecord
    ? `today's best is ${name(todayBest)}, which leads on ${Math.round(todayRecord.winRate)}% of days`
    : `today's best is ${name(todayBest)}, which rarely leads here`;
  return `${head}${rival}. But ${todayNote} — worth comparing rather than assuming.${intermittentNote}`;
}
