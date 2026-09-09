"use client";

import { useEffect, useRef } from "react";

/**
 * Fires once when the inline quote widget actually reaches the viewport.
 *
 * Guides had NO impression signal at all: trackQuotesViewed is called only by
 * SendMoneyClient, so for every /guides page we could see provider clicks but not
 * whether anyone ever scrolled to the widget. Those are opposite problems with
 * opposite fixes — swift-codes-explained converts ~1 in 244, and without this we
 * cannot tell a reach failure from an intent failure.
 *
 * Deliberately NOT `quotes_viewed`: that is a GA4 Key Event, and firing it on
 * every guide scroll would inflate reported conversions and break comparability
 * with history. `inline_quotes_viewed` is the denominator, nothing more.
 *
 * WHAT WAS WRONG WITH THE FIRST VERSION (fixed 2026-09-09)
 * It observed `<div ref={ref} aria-hidden="true" />` — an EMPTY div rendered
 * AFTER the widget. A zero-height target has no meaningful intersection ratio,
 * so the `threshold: 0.5` that the comment described as "half the widget on
 * screen" did nothing, and the point being observed sat below the widget: the
 * event fired when a reader scrolled clean PAST it, not when they saw it.
 * Anyone who reached the widget and stopped — or clicked — was never counted.
 * On /guides/swift-codes-explained that read as 7 impressions against 277 page
 * views and 257 scroll events, which would have been diagnosed as "nobody
 * reaches the widget" when the denominator itself was wrong.
 *
 * It now wraps the widget and observes it directly, so the number means what
 * the name says.
 */
export default function InlineQuotesImpression({
  slug,
  from,
  to,
  providerCount,
  children,
}: {
  slug: string;
  from: string;
  to: string;
  providerCount: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (fired.current || !entry.isIntersecting) continue;
          // "Half the widget, or half a screenful, whichever is smaller."
          //
          // A plain threshold of 0.5 is unreachable when the element is taller
          // than twice the viewport — the ratio caps at viewport/element, so on
          // a phone a tall quote table could never satisfy it however long the
          // reader looked at it. Comparing visible HEIGHT instead is stable
          // across viewport sizes.
          const needed = Math.min(el.offsetHeight, window.innerHeight) * 0.5;
          if (entry.intersectionRect.height < needed) continue;
          fired.current = true;
          io.disconnect();
          import("@/lib/analytics").then((m) =>
            m.trackInlineQuotesViewed(slug, from, to, providerCount),
          );
        }
      },
      // Many thresholds so the callback runs as the widget scrolls through,
      // rather than only at the moment its first pixel appears.
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [slug, from, to, providerCount]);

  return <div ref={ref}>{children}</div>;
}
