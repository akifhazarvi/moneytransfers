"use client";

import { useMemo, useState } from "react";

/**
 * "What was the USD to EUR rate on 12 November 2026?" — a date lookup over the
 * daily mid-market series the rate-history page already charts. Bing sends us
 * exactly these queries ("eur usd exchange rate november 12 2026"); the page
 * also server-renders the last 14 closes as text, and this answers any other day.
 * Receives only [date, rate] pairs, so the page carries a few KB, not the dataset.
 */
export default function RateOnDate({ from, to, points }: { from: string; to: string; points: [string, number][] }) {
  const first = points[0]?.[0] ?? "";
  const last = points.at(-1)?.[0] ?? "";
  const [date, setDate] = useState(last);

  const hit = useMemo(() => {
    if (!date) return null;
    // The close for that day, or the nearest earlier one (a day with no published close).
    let found: [string, number] | null = null;
    for (const p of points) {
      if (p[0] > date) break;
      found = p;
    }
    return found;
  }, [date, points]);

  const long = (d: string) =>
    new Date(`${d}T00:00:00Z`).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const fmt = (n: number) => (n >= 100 ? n.toFixed(2) : n >= 1 ? n.toFixed(4) : n.toFixed(6));
  // The series has a reading for most days, weekends included (they differ from
  // Friday's, so they are not labelled as Friday's close). A date with no fresh
  // reading, e.g. inside a stalled-feed run fresh() dropped, falls back to the
  // nearest earlier one and says so.
  const label = (shown: string) =>
    shown !== date ? `no reading for that day; nearest earlier, ${long(shown)}` : `daily close, ${long(shown)}`;

  if (!points.length) return null;
  return (
    <div className="rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] p-4 sm:p-5">
      <label htmlFor="rate-on-date" className="block text-sm font-medium text-[var(--color-on-surface)] mb-2">
        Look up the rate on a date
      </label>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <input
          id="rate-on-date"
          type="date"
          min={first}
          max={last}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <p aria-live="polite" className="text-sm text-[var(--color-on-surface)]">
          {hit ? (
            <>
              <strong className="tabular-nums">{`1 ${from} = ${fmt(hit[1])} ${to}`}</strong>
              <span className="text-[var(--color-on-surface-variant)]">
                {` · 1 ${to} = ${fmt(1 / hit[1])} ${from} · ${label(hit[0])}`}
              </span>
            </>
          ) : (
            <span className="text-[var(--color-on-surface-variant)]">{`Choose a date between ${long(first)} and ${long(last)}.`}</span>
          )}
        </p>
      </div>
    </div>
  );
}
