"use client";

import { useEffect, useState } from "react";
import {
  NOTHING_TO_INSTALL,
  detectInstallPlatform,
  onInstallabilityChange,
  requestInstall,
  type InstallPlatform,
} from "@/lib/pwa";
import { extensionBrowser, extensionLabel, openExtensionStore, prefersExtension, type ExtensionBrowser } from "@/lib/browser-extension";

type Offer = { platform: InstallPlatform; extension: ExtensionBrowser | null };

/** What this browser can install now: the extension first on desktop Chromium, else the app. */
function useInstallOffer(): Offer | null {
  const [offer, setOffer] = useState<Offer | null>(null);
  useEffect(() => {
    // The extension's detection fires the same event as installability changes.
    const update = () => setOffer({ platform: detectInstallPlatform(), extension: prefersExtension() ? extensionBrowser() : null });
    update();
    return onInstallabilityChange(update);
  }, []);
  return offer;
}

/** A puzzle piece: the extension, where the app has a download arrow. */
function PuzzleIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinejoin="round" strokeWidth={1.7} d="M9.5 4.5a2 2 0 0 1 4 0V6H17a1 1 0 0 1 1 1v3.5h-1.5a2 2 0 0 0 0 4H18V18a1 1 0 0 1-1 1h-3.5v-1.5a2 2 0 0 0-4 0V19H6a1 1 0 0 1-1-1v-3.5h1.5a2 2 0 0 0 0-4H5V7a1 1 0 0 1 1-1h3.5z" />
    </svg>
  );
}

/**
 * "Install app" entry points in the header.
 *
 * `header` (desktop) is server-rendered and kept `invisible` until the client
 * knows there is something to install, so its slot never appears or vanishes
 * after paint (no layout shift in the header). `.pwa-hide-standalone` removes
 * it with CSS inside the installed app, before any JS runs.
 *
 * `menu` lives in the mobile menu, which only renders once opened, so it can
 * simply be absent where installing is not possible.
 *
 * On desktop Chrome, Edge and other Chromium browsers each of them offers the
 * browser extension instead ("Add to Chrome", owner decision 2026-10-20; the
 * rule is prefersExtension() in src/lib/browser-extension.ts), and offers the
 * app again once the extension is installed.
 */
export default function InstallAppButton({ variant, onClick }: { variant: "header" | "menu" | "footer"; onClick?: () => void }) {
  const offer = useInstallOffer();
  const ext = offer?.extension ?? null;
  const available = ext !== null || (offer !== null && !NOTHING_TO_INSTALL.has(offer.platform));
  const label = ext ? extensionLabel(ext) : null;

  const handle = () => {
    onClick?.();
    if (ext) openExtensionStore(variant);
    else requestInstall(variant);
  };

  if (variant === "header") {
    // A labelled pill, not a bare glyph: an unlabelled icon between the
    // language and theme toggles read as another setting. Outlined, not
    // filled, so it never competes with the Send buttons (provider_clicked).
    return (
      <button
        type="button"
        onClick={handle}
        data-pwa-install-button=""
        // The label shows from xl; at lg (1024–1279) it would wrap the nav's
        // "Send Money" / "Compare Apps" onto two lines, so the pill keeps
        // only its glyph there. aria-label keeps the name the same at both.
        aria-label={label ?? "Install app"}
        className={`pwa-hide-standalone hidden lg:inline-flex items-center gap-1.5 min-h-12 px-2.5 xl:pl-3 xl:pr-3.5 mr-1 rounded-full border border-[var(--color-outline)] text-2sm font-medium text-[var(--color-on-surface)] hover:bg-[color-mix(in_srgb,var(--color-on-surface)_6%,transparent)] transition-all duration-200 whitespace-nowrap ${
          available ? "" : "invisible"
        }`}
      >
        {ext ? (
          <PuzzleIcon className="w-4 h-4" />
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" />
          </svg>
        )}
        <span className="hidden xl:inline">{label ?? "Install app"}</span>
      </button>
    );
  }

  if (!available) return null;
  if (variant === "footer") return (
    <button type="button" onClick={handle} data-pwa-install-button="footer"
      className="pwa-hide-standalone inline-flex min-h-11 items-center text-sm text-white/80 underline underline-offset-4 hover:text-white">
      {label ? `${label}: price checks on provider sites` : "Add to your device"}
    </button>
  );
  return (
    <button
      type="button"
      onClick={handle}
      data-pwa-install-button=""
      className="pwa-hide-standalone w-full flex items-center gap-3 py-3 px-3.5 text-sm rounded-2xl text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[color-mix(in_srgb,var(--color-on-surface)_6%,transparent)] transition-all duration-200"
    >
      {ext ? (
        <PuzzleIcon className="w-5 h-5" />
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 7v7m0 0-2.5-2.5M12 14l2.5-2.5M10.5 18.5h3" />
        </svg>
      )}
      {label ? `${label} (extension)` : "Install the app"}
    </button>
  );
}
