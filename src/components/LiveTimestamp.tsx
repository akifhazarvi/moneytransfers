"use client";

import { useEffect, useState } from "react";

interface Props {
  /** ISO timestamp when the data was last updated */
  iso: string;
  /** Optional prefix text (e.g. "Rates updated") */
  prefix?: string;
  /** Tailwind class overrides */
  className?: string;
}

function formatRelative(iso: string, now: number): string {
  const then = Date.parse(iso);
  if (!then || Number.isNaN(then)) return "just now";
  const diffMs = Math.max(0, now - then);
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.round(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Absolute UTC stamp, e.g. "02:10 UTC, 6 Sep".
 *
 * Deliberately hand-formatted in UTC rather than via toLocaleString: this
 * string is rendered on the server and again on the client's first paint, so
 * it has to be byte-identical in both. Anything locale- or timezone-aware
 * would differ between a Vercel box and the reader's browser and trip a
 * hydration mismatch.
 */
function formatAbsolute(iso: string): string | null {
  const t = Date.parse(iso);
  if (!t || Number.isNaN(t)) return null;
  const d = new Date(t);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm} UTC, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

/**
 * Freshness stamp that degrades to something true rather than something vague.
 *
 * The relative label ("4 hours ago") can only be computed in the browser — a
 * value baked at build time would be wrong by the time anyone read it, since
 * these pages are prerendered and served for hours. So the server renders an
 * absolute UTC timestamp and the effect upgrades it to relative after mount.
 *
 * This used to fall back to "Updated recently", which meant a crawler — and
 * every reader's first paint — got an unverifiable claim while the real
 * timestamp sat one hydration away. "02:10 UTC, 6 Sep" is checkable; "recently"
 * is a promise. Measured against our own archive, 89% of provider-corridor-days
 * show no intraday change at all, so the honest timestamp is also a stronger
 * claim than implying constant motion.
 */
export default function LiveTimestamp({ iso, prefix, className }: Props) {
  const absolute = formatAbsolute(iso);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(formatRelative(iso, Date.now()));
    const t = setInterval(() => setLabel(formatRelative(iso, Date.now())), 60000);
    return () => clearInterval(t);
  }, [iso]);

  // No parseable timestamp: say nothing rather than assert freshness.
  if (!absolute) return null;

  return (
    <span className={className}>
      {prefix ?? "Updated"}{" "}
      <time dateTime={iso}>{label ?? absolute}</time>
    </span>
  );
}
