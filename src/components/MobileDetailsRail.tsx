import type { ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

// Wraps non-conversion content (FAQ, link rails, how-to) so it stays in the DOM
// once — preserving internal link equity, FAQPage schema, and AI-citable copy —
// but collapses on mobile so it doesn't push affiliate Send CTAs below the fold.
//
// Uses native <details> for the mobile disclosure pattern (no hydration cost).
// On sm+ the summary is hidden and the content div is forced visible regardless
// of the [open] attribute via the `sm:!block` override.
export default function MobileDetailsRail({ label, children, defaultOpen = false }: Props) {
  return (
    <details
      open={defaultOpen}
      className="group sm:open border-y border-[var(--color-outline)] bg-[var(--color-surface)] sm:border-0 sm:bg-transparent"
    >
      <summary className="sm:hidden flex items-center justify-between cursor-pointer list-none px-4 py-4 min-h-[48px] text-sm font-semibold text-[var(--color-on-surface)]">
        {label}
        <svg
          className="w-5 h-5 shrink-0 ml-4 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="hidden group-open:block sm:!block pb-4 sm:pb-0">{children}</div>
    </details>
  );
}
