"use client";

import { useEffect, useRef } from "react";

/**
 * Fires once when the inline quote widget actually reaches the viewport.
 *
 * Guides had NO impression signal at all: trackQuotesViewed is called only by
 * SendMoneyClient, so for every /guides page we could see provider clicks but not
 * whether anyone ever scrolled to the widget. Those are opposite problems with
 * opposite fixes — swift-codes-explained converts 1 in 244, and without this we
 * cannot tell a reach failure from an intent failure.
 *
 * Deliberately NOT `quotes_viewed`: that is a GA4 Key Event, and firing it on
 * every guide scroll would inflate reported conversions and break comparability
 * with history. `inline_quotes_viewed` is the denominator, nothing more.
 */
export default function InlineQuotesImpression({
  slug,
  from,
  to,
  providerCount,
}: {
  slug: string;
  from: string;
  to: string;
  providerCount: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || fired.current) continue;
          fired.current = true;
          io.disconnect();
          import("@/lib/analytics").then((m) =>
            m.trackInlineQuotesViewed(slug, from, to, providerCount),
          );
        }
      },
      // Half the widget on screen — enough that the rates were legible, rather
      // than a single pixel clipping the viewport on a fast scroll past.
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [slug, from, to, providerCount]);

  return <div ref={ref} aria-hidden="true" />;
}
