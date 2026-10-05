"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { trackGoReviewContinue, trackGoReviewShown } from "@/lib/analytics";

/**
 * The review page's way on to the provider the visitor chose: back through the
 * /go (or /out) route with ?continue=1, which forwards.
 *
 * data-pc keeps ProviderClickDelegate from logging a second provider_clicked —
 * the click that brought them here was the choice; this one confirms it. The
 * confirmation is counted twice over instead: `go_review_continue` client-side
 * and `interstitial_continue` (a GA4 key event) via a server beacon, which
 * survives ad blockers and declined consent. The page view is counted the same
 * two ways: `go_review_shown` and the server's `interstitial_impression`.
 */
export default function ReviewContinue({
  href,
  provider,
  corridor,
  partner,
  origin,
  beacon,
  className,
  children,
}: {
  href: string;
  provider: string;
  corridor: string;
  partner: "quote" | "card" | "none";
  origin: "on_site" | "external";
  /** Query for /api/track/continue: provider, corridor, src, ai_src, cid. */
  beacon: string;
  className?: string;
  children: ReactNode;
}) {
  const shown = useRef(false);
  useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    trackGoReviewShown(provider, corridor, partner, origin);
    try {
      navigator.sendBeacon(`/api/track/continue?event=impression&partner=${partner}&origin=${origin}&${beacon}`);
    } catch {
      // Best-effort: go_review_shown still counts it client-side.
    }
  }, [provider, corridor, partner, origin, beacon]);

  return (
    <a
      href={href}
      rel="nofollow sponsored"
      data-pc="1"
      className={className}
      onClick={() => {
        trackGoReviewContinue(provider, corridor, origin);
        try {
          navigator.sendBeacon(`/api/track/continue?${beacon}`);
        } catch {
          // Best-effort: the route still records the forward itself.
        }
      }}
    >
      {children}
    </a>
  );
}
