"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { beginPageView, isOfferable, markActive, readLastSearch, type LastSearch } from "@/lib/last-search";
import { consentSettled } from "@/lib/pwa";

// Only a returning visitor with a saved search ever loads the card.
const WelcomeBackCard = dynamic(() => import("./WelcomeBackCard"), { ssr: false });

/** Let the page paint and settle before offering anything over it. */
const DWELL_MS = 1500;
/** Interactions refresh the visit at most this often. */
const ACTIVITY_THROTTLE_MS = 60_000;

const EXCLUDED = /^\/(?:en\/)?(?:go|out|privacy-policy|cookies|terms)(?:\/|$)/;
const SEND_MONEY = /^\/(?:en\/)?send-money\/?$/;

/** Any part of the element is inside the viewport. */
function onScreen(el: Element): boolean {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
}

/**
 * The page already shows this comparison: /send-money's form or the homepage
 * converter on the same pair (`data-smc-corridor`), or a corridor page for it
 * (`*-PKR` on a country page, which ranks every route into the country).
 */
function pageShows(s: LastSearch): boolean {
  return !!document.querySelector(`[data-smc-corridor="${s.from}-${s.to}"], [data-smc-corridor="*-${s.to}"]`);
}

/**
 * Offers a returning visitor their last comparison ("Welcome back — still
 * sending money to Pakistan?"), on the first page of a return visit only.
 * What counts as a search and when it expires: src/lib/last-search.ts.
 *
 * It waits its turn like the install prompt does: never over the cookie banner
 * or an open dialog, never while someone is typing in a field on screen, and
 * not when the install offer is already on the page (PwaManager holds back
 * while this one is up). Navigating away withdraws it.
 */
export default function WelcomeBackManager() {
  const pathname = usePathname();
  const [offer, setOffer] = useState<{ search: LastSearch; path: string } | null>(null);
  // Decided once per page view; a ref survives StrictMode's effect replay,
  // which would otherwise count the same view twice and see no gap.
  const pageView = useRef<{ path: string; returning: boolean } | null>(null);

  // A long read on one page is still the same visit.
  useEffect(() => {
    let last = 0;
    const touch = () => {
      const now = Date.now();
      if (now - last < ACTIVITY_THROTTLE_MS) return;
      last = now;
      markActive(now);
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") markActive();
    };
    window.addEventListener("pointerdown", touch, { passive: true });
    window.addEventListener("keydown", touch);
    window.addEventListener("scroll", touch, { passive: true });
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("pointerdown", touch);
      window.removeEventListener("keydown", touch);
      window.removeEventListener("scroll", touch);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  useEffect(() => {
    if (pageView.current?.path !== pathname) pageView.current = { path: pathname, returning: beginPageView() };
    if (!pageView.current.returning || EXCLUDED.test(pathname)) return;
    const saved = readLastSearch();
    if (!saved || !isOfferable(saved)) return;
    const search: LastSearch = saved;

    let dwelled = false;
    let stopped = false;
    function check() {
      if (stopped || !dwelled) return;
      if (!navigator.onLine || !consentSettled()) return;
      if (document.querySelector("dialog[open], [data-pwa-install-prompt]")) return;
      const field = document.activeElement?.closest("input, textarea, select, [contenteditable=true]");
      if (field && onScreen(field)) return;
      stop();
      if (!pageShows(search)) setOffer({ search, path: pathname });
    }
    function stop() {
      stopped = true;
      clearTimeout(timer);
      window.removeEventListener("online", check);
      window.removeEventListener("smc:consent-changed", check);
      document.removeEventListener("focusout", check);
      document.removeEventListener("close", check, true);
    }

    const timer = setTimeout(() => {
      dwelled = true;
      check();
    }, DWELL_MS);
    window.addEventListener("online", check);
    window.addEventListener("smc:consent-changed", check);
    document.addEventListener("focusout", check);
    // A <dialog> closing: `close` does not bubble, so listen in the capture phase.
    document.addEventListener("close", check, true);
    return () => {
      stop();
      setOffer(null);
    };
  }, [pathname]);

  const done = useCallback(() => setOffer(null), []);

  if (!offer || offer.path !== pathname) return null;
  return <WelcomeBackCard search={offer.search} onSendMoney={SEND_MONEY.test(pathname)} onDone={done} />;
}
