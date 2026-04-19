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

export default function LiveTimestamp({ iso, prefix, className }: Props) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    // Skip rendering anything until mounted to avoid SSR hydration mismatch
    setLabel(formatRelative(iso, Date.now()));
    const t = setInterval(() => setLabel(formatRelative(iso, Date.now())), 60000);
    return () => clearInterval(t);
  }, [iso]);

  if (!label) {
    // Render a placeholder so layout doesn't shift
    return <span className={className}>{prefix ?? "Updated"} recently</span>;
  }

  return (
    <span className={className}>
      {prefix ?? "Updated"} <time dateTime={iso}>{label}</time>
    </span>
  );
}
