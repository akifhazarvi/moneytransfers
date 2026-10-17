/**
 * How many providers a comparison list shows before "Show N more".
 *
 * Owner decision 2026-10-17: a comparison shows the top 10 providers so the
 * leaders get the attention; the rest are one tap away. Top routes list 18–31
 * providers (USD→INR 22, GBP→INR 31), most of them far below the leader.
 *
 * Nothing is dropped: every row is still rendered — in the HTML on corridor
 * pages, so search engines and scripts/check-corridor-sort.ts read the whole
 * list — and the rows past the cap are hidden by CSS until the reader expands
 * the list ([data-provider-list] in globals.css). Order is unchanged.
 *
 * TapTap Send (partner) stays visible when it ranks below the cap, at its real
 * rank, right after the top 10 — owner decision the same day, and
 * [[feedback-taptap-visibility-over-dedup]]: never gate TapTap to cut clutter.
 *
 * Safe in client components (no data imports).
 */
export const COMPARISON_VISIBLE_ROWS = 10;

/** Providers shown even when they rank below the cap. */
const ALWAYS_VISIBLE = new Set(["taptap-send"]);

/**
 * The providers hidden until the list is expanded, for a list in display
 * order. Empty when the list fits under the cap.
 */
export function collapsedProviders(slugsInOrder: readonly string[], cap = COMPARISON_VISIBLE_ROWS): Set<string> {
  const hidden = new Set<string>();
  slugsInOrder.forEach((slug, i) => {
    if (i >= cap && !ALWAYS_VISIBLE.has(slug)) hidden.add(slug);
  });
  return hidden;
}
