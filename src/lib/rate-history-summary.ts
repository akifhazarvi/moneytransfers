/**
 * Per-pair summaries of a recorded mid-market series, for the
 * /exchange-rates/history/[pair] pages.
 *
 * WHY (round-3 freelance brief §4.2, 2026-10-08): the near-duplicate crawl
 * paired history pages whose rates sit in the same numeric band — AUD/USD and
 * CAD/USD both trade around 0.70, EUR/USD and GBP/EUR around 1.15 — so ~1,000
 * four-decimal cells in a 200-row daily table were most of what the two pages
 * "shared". The brief asks for "page-specific data: ranges, events, and
 * explanations of exchange-rate movements". These helpers compute the ranges
 * (month by month), the largest one-day moves, and what the pair did around
 * each dated policy decision, from the same series the chart draws.
 *
 * Pure functions over SparklinePoint[]; no dataset import.
 */
import type { SparklinePoint } from "./rate-history-types";

export interface MonthSummary {
  /** YYYY-MM */
  month: string;
  /** Fresh daily observations in the month (stale carried-forward repeats excluded). */
  days: number;
  low: number;
  lowDate: string;
  high: number;
  highDate: string;
  close: number;
  closeDate: string;
  /** % change of `close` against the previous month's close (first month: against the first observation). */
  changePct: number;
}

export interface DayMove {
  date: string;
  from: number;
  to: number;
  pct: number;
}

export interface SeriesSummary {
  first: SparklinePoint;
  last: SparklinePoint;
  changePct: number;
  months: MonthSummary[];
  biggestRise: DayMove | null;
  biggestFall: DayMove | null;
}

const DAY_MS = 86_400_000;

function pct(from: number, to: number): number {
  return from === 0 ? 0 : ((to - from) / from) * 100;
}

/**
 * Sorted observations with stale repeats removed. A weekend legitimately
 * repeats Friday's rate twice; a longer run of one identical value is a feed
 * that stopped updating and was carried forward (AUD/USD sat at 0.6929 from
 * mid-July to 12 August 2026, GBP/EUR at 1.1549 through April), and must not
 * read as a month's range or as the day a rate "moved" when the feed resumed.
 */
function fresh(series: SparklinePoint[]): SparklinePoint[] {
  const points = [...series].filter((p) => p.rate > 0).sort((a, b) => a.date.localeCompare(b.date));
  const out: SparklinePoint[] = [];
  let run = 0;
  for (let i = 0; i < points.length; i++) {
    run = i > 0 && points[i].rate === points[i - 1].rate ? run + 1 : 0;
    if (run < 3) out.push(points[i]);
  }
  return out;
}

/** Months with fewer fresh observations than this are left out of the table. */
const MIN_MONTH_DAYS = 5;

export function summariseSeries(series: SparklinePoint[] | undefined): SeriesSummary | null {
  if (!series) return null;
  const points = fresh(series);
  if (points.length < 2) return null;

  const byMonth = new Map<string, SparklinePoint[]>();
  for (const p of points) {
    const key = p.date.slice(0, 7);
    (byMonth.get(key) ?? byMonth.set(key, []).get(key)!).push(p);
  }
  const months: MonthSummary[] = [];
  let prevClose = points[0].rate;
  for (const [month, ps] of byMonth) {
    if (ps.length < MIN_MONTH_DAYS) continue;
    const m: MonthSummary = { month, days: ps.length, low: ps[0].rate, lowDate: ps[0].date, high: ps[0].rate, highDate: ps[0].date, close: ps[ps.length - 1].rate, closeDate: ps[ps.length - 1].date, changePct: 0 };
    for (const p of ps) {
      if (p.rate < m.low) { m.low = p.rate; m.lowDate = p.date; }
      if (p.rate > m.high) { m.high = p.rate; m.highDate = p.date; }
    }
    m.changePct = pct(prevClose, m.close);
    prevClose = m.close;
    months.push(m);
  }

  // One-day moves only between consecutive calendar days: the series has gaps
  // (no rows 19–27 March 2026), and a move across a gap is not a day's move.
  let biggestRise: DayMove | null = null;
  let biggestFall: DayMove | null = null;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    if (Date.parse(b.date) - Date.parse(a.date) !== DAY_MS) continue;
    const move = { date: b.date, from: a.rate, to: b.rate, pct: pct(a.rate, b.rate) };
    if (move.pct > 0 && (!biggestRise || move.pct > biggestRise.pct)) biggestRise = move;
    if (move.pct < 0 && (!biggestFall || move.pct < biggestFall.pct)) biggestFall = move;
  }

  const first = points[0];
  const last = points[points.length - 1];
  return { first, last, changePct: pct(first.rate, last.rate), months, biggestRise, biggestFall };
}

export interface Reaction {
  before: SparklinePoint;
  after: SparklinePoint;
  pct: number;
}

/**
 * What the series did around a dated event: the last observation before the
 * event day against the first observation at least `days` later. Descriptive
 * only — a move in the following week is not attributed to the event.
 */
export function reactionAround(series: SparklinePoint[] | undefined, date: string, days = 7): Reaction | null {
  if (!series) return null;
  const points = fresh(series);
  const t = Date.parse(date);
  let before: SparklinePoint | null = null;
  for (const p of points) if (Date.parse(p.date) < t) before = p;
  const after = points.find((p) => Date.parse(p.date) >= t + days * DAY_MS) ?? null;
  if (!before || !after) return null;
  // A stale stretch (the same value for the whole window) is not a reaction.
  if (Date.parse(after.date) - Date.parse(before.date) > (days + 5) * DAY_MS) return null;
  return { before, after, pct: pct(before.rate, after.rate) };
}

/** Decimal places a rate needs to be readable: JPY-sized rates need fewer. */
export function rateDecimals(sample: number): number {
  return sample >= 20 ? 2 : 4;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-05" → "May 2026" */
export function monthLabel(month: string): string {
  const [y, m] = month.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

/** "2026-05-06" → "6 May" (year omitted: every series sits inside one year's window). */
export function dayLabel(date: string, withYear = false): string {
  const [y, m, d] = date.split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1]}${withYear ? ` ${y}` : ""}`;
}

export function signedPct(value: number, digits = 2): string {
  const s = value.toFixed(digits);
  return value > 0 ? `+${s}%` : `${s.startsWith("-") ? "−" + s.slice(1) : s}%`;
}
