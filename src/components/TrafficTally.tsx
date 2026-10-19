"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Counts each page a person engages with into a daily per-country total
 * (/api/tally → src/lib/traffic-tally.ts). It sends one flag — whether this is
 * the visit's landing page — and nothing else: no cookie, id, page or referrer
 * leaves the browser, so it needs no analytics consent.
 *
 * A page counts on the reader's first pointer, touch, key or scroll (on /go
 * and /out: pointer, touch, key or wheel, never scroll), not on render — the
 * browser-spoofing bots render and leave. Automation never counts.
 */
export default function TrafficTally() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (navigator.webdriver) return;
    let landing = false;
    if (first.current) {
      first.current = false;
      try { landing = !document.referrer || new URL(document.referrer).host !== location.host; } catch { landing = true; }
    }
    const review = /\/(?:go|out)\//.test(pathname);
    const events = review ? ["pointerdown", "pointermove", "keydown", "touchstart", "wheel"] : ["pointerdown", "keydown", "scroll", "touchstart"];
    const opts = { passive: true, capture: true } as const;
    const remove = () => events.forEach(e => window.removeEventListener(e, send, opts));
    function send() {
      remove();
      void fetch("/api/tally", { method: "POST", credentials: "omit", referrerPolicy: "no-referrer",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify({ landing }), keepalive: true }).catch(() => {});
    }
    events.forEach(e => window.addEventListener(e, send, opts));
    return remove;
  }, [pathname]);

  return null;
}
