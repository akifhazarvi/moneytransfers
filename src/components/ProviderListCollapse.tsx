"use client";

import { useState, type ReactNode } from "react";
import { trackComparisonExpanded } from "@/lib/analytics";

type Props = {
  /** Rows hidden until expanded — see collapsedProviders() in src/lib/comparison-cap.ts. */
  hiddenCount: number;
  /** Where the list is, for the expand event: "send_money", "corridor". */
  placement: string;
  corridor: string;
  className?: string;
  /** Classes for the toggle; the list styles differ (bordered table vs cards). */
  buttonClassName?: string;
  children: ReactNode;
};

/**
 * A comparison list showing its top rows, with "Show N more providers" for the
 * rest. The rows are children (server-rendered on corridor pages) and carry
 * data-collapsed-row when they start hidden; globals.css hides those while the
 * list lacks data-expanded, so the first paint is already the short list and
 * every row stays in the HTML.
 */
export default function ProviderListCollapse({ hiddenCount, placement, corridor, className, buttonClassName, children }: Props) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div data-provider-list="" data-expanded={expanded ? "true" : undefined} className={className}>
      {children}
      {hiddenCount > 0 && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => {
            if (!expanded) trackComparisonExpanded(placement, corridor, hiddenCount);
            setExpanded(!expanded);
          }}
          className={
            buttonClassName ??
            "flex w-full items-center justify-center gap-1.5 py-3 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-primary)]"
          }
        >
          {expanded ? "Show fewer providers" : `Show ${hiddenCount} more provider${hiddenCount === 1 ? "" : "s"}`}
          <svg className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}
