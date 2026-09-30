"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MIN_VIEWS_BEFORE_PROMPT,
  OPEN_INSTALL_EVENT,
  PROMPTABLE,
  claimFirstAppLaunch,
  claimLaunch,
  consentSettled,
  countPageView,
  detectInstallPlatform,
  displayMode,
  isStandalone,
  onInstallabilityChange,
  promptAlreadyShownThisSession,
  promptInstall,
  promptSnoozed,
  recordPromptShown,
  requestInstall,
  snoozePrompt,
  type InstallPlatform,
} from "@/lib/pwa";
import {
  trackPwaInstallClicked,
  trackPwaInstallOutcome,
  trackPwaInstalled,
  trackPwaLaunched,
  trackPwaPromptDismissed,
  trackPwaPromptShown,
} from "@/lib/analytics";
import InstallPrompt from "./InstallPrompt";

// Only needed after a click, so it stays out of every page's first load.
const InstallDialog = dynamic(() => import("./InstallDialog"), { ssr: false });

/** Wait this long into a page view before offering, so the offer never competes with LCP. */
const PROMPT_DELAY_MS = 4000;

/**
 * The service worker is production-only. `next dev` serves unhashed chunk
 * URLs, which a cache-first worker would pin to stale code, and localhost:3000
 * is shared by `next dev` and `next start` — so dev actively removes a worker
 * a local production run left behind. NEXT_PUBLIC_DISABLE_SW=1 is the kill
 * switch for production: it unregisters the worker and drops its caches on the
 * next page view.
 */
function manageServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  const disabled = process.env.NEXT_PUBLIC_DISABLE_SW === "1";
  const devWithoutOptIn = process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_ENABLE_SW !== "1";
  if (disabled || devWithoutOptIn) {
    navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
    if (disabled && "caches" in window) {
      caches.keys().then((keys) => keys.filter((k) => k.startsWith("smc-")).forEach((k) => caches.delete(k)));
    }
    return;
  }
  const firstInstall = !navigator.serviceWorker.controller;
  const register = () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then(() => {
        // This page loaded before the worker existed, so neither the page nor
        // its scripts and styles went through the cache. Hand both over once,
        // so the first page read also opens (styled and working) offline.
        if (!firstInstall) return;
        const assets = performance
          .getEntriesByType("resource")
          .map((entry) => entry.name)
          .filter((name) => name.includes("/_next/static/"));
        return navigator.serviceWorker.ready.then((reg) =>
          reg.active?.postMessage({ type: "smc:save-pages", urls: [window.location.href], assets }),
        );
      })
      .catch(() => {
        // Registration failure only costs offline support; the site is unaffected.
      });
  };
  // After load and on idle: the worker's install step fetches the offline
  // page, and that must not queue in front of the page's own requests.
  const idle = () => ("requestIdleCallback" in window ? window.requestIdleCallback(register) : setTimeout(register, 1));
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}

export default function PwaManager() {
  const pathname = usePathname();
  const [platform, setPlatform] = useState<InstallPlatform | null>(null);
  // The pathname the prompt was offered on. Navigating away hides it (and the
  // once-per-session rule keeps it from coming back until the next session).
  const [promptPath, setPromptPath] = useState<string | null>(null);
  const [promptSlot, setPromptSlot] = useState<HTMLElement | null>(null);
  const [dialogSurface, setDialogSurface] = useState<string | null>(null);
  const platformRef = useRef<InstallPlatform | null>(null);

  // One-time setup: worker, installability tracking, launch attribution.
  useEffect(() => {
    manageServiceWorker();

    const update = () => {
      platformRef.current = detectInstallPlatform();
      setPlatform(platformRef.current);
      document.documentElement.dataset.appMode = isStandalone() ? "true" : "false";
    };
    update();
    const unsubscribe = onInstallabilityChange(update);

    const onInstalled = () => {
      window.__smcInstalled = 0;
      setPromptPath(null);
      setDialogSurface(null);
      trackPwaInstalled(platformRef.current ?? "unknown");
    };
    window.addEventListener("smc:installed", onInstalled);
    // Installed while the page was still hydrating: the event came and went
    // before this listener existed, so count it now.
    if (window.__smcInstalled) onInstalled();

    if (isStandalone()) {
      // Safari never fires appinstalled; the app's first launch is its install.
      if (claimFirstAppLaunch()) trackPwaInstalled(platformRef.current ?? "standalone", "first_launch");
      if (claimLaunch()) trackPwaLaunched(displayMode());
    }

    return () => {
      unsubscribe();
      window.removeEventListener("smc:installed", onInstalled);
    };
  }, []);

  // Every surface (header, menu, prompt) asks through one event.
  useEffect(() => {
    const onRequest = async (e: Event) => {
      const surface = (e as CustomEvent<{ surface?: string }>).detail?.surface ?? "unknown";
      const current = detectInstallPlatform();
      if (current === "standalone" || current === "installed" || current === "unsupported") return;
      trackPwaInstallClicked(surface, current);
      setPromptPath(null);
      if (current === "prompt") {
        const outcome = await promptInstall();
        if (outcome === "unavailable") return;
        trackPwaInstallOutcome(outcome, surface);
        // Declining the browser's own dialog is as clear an answer as ours.
        if (outcome === "dismissed") snoozePrompt();
        return;
      }
      setDialogSurface(surface);
    };
    window.addEventListener(OPEN_INSTALL_EVENT, onRequest);
    return () => window.removeEventListener(OPEN_INSTALL_EVENT, onRequest);
  }, []);

  // Views establish engagement; seeing the in-flow slot establishes placement.
  // A second page view alone must never interrupt someone entering a transfer.
  useEffect(() => {
    const views = countPageView();
    const eligible = views >= MIN_VIEWS_BEFORE_PROMPT && !promptAlreadyShownThisSession() && !promptSnoozed()
      && !/^\/(?:en\/)?(?:go|out|privacy|terms)(?:\/|$)/.test(pathname);
    let observer: IntersectionObserver | undefined;
    const timer = eligible
      ? setTimeout(() => {
          const slot = document.querySelector<HTMLElement>("[data-pwa-install-slot]");
          if (!slot) return;
          observer = new IntersectionObserver(([entry]) => {
            const current = detectInstallPlatform();
            if (!entry.isIntersecting || !PROMPTABLE.has(current) || !navigator.onLine || !consentSettled()) return;
            if (document.activeElement?.matches("input, textarea, select, [contenteditable=true]") || document.querySelector("dialog[open]")) return;
            recordPromptShown();
            trackPwaPromptShown(current, slot.dataset.pwaInstallSlot ?? "inline");
            setPromptSlot(slot);
            setPromptPath(pathname);
            observer?.disconnect();
          });
          observer.observe(slot);
        }, PROMPT_DELAY_MS)
      : undefined;
    return () => {
      clearTimeout(timer);
      observer?.disconnect();
      // Leaving the page withdraws the offer, so coming back does not revive it.
      setPromptPath(null);
      setPromptSlot(null);
    };
  }, [pathname]);

  return (
    <>
      {promptPath === pathname && platform && promptSlot && createPortal(
        <InstallPrompt
          platform={platform}
          placement={promptSlot.dataset.pwaInstallSlot}
          onAccept={() => requestInstall(promptSlot.dataset.pwaInstallSlot ?? "inline")}
          onDismiss={() => {
            snoozePrompt();
            trackPwaPromptDismissed(platform);
            setPromptPath(null);
          }}
        />, promptSlot
      )}
      {dialogSurface && platform && (
        <InstallDialog
          platform={platform}
          onInstall={
            platform === "prompt"
              ? () => {
                  setDialogSurface(null);
                  requestInstall("dialog");
                }
              : undefined
          }
          onClose={() => setDialogSurface(null)}
        />
      )}
    </>
  );
}
