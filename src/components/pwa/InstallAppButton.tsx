"use client";

import { useEffect, useState } from "react";
import {
  NOTHING_TO_INSTALL,
  detectInstallPlatform,
  onInstallabilityChange,
  requestInstall,
  type InstallPlatform,
} from "@/lib/pwa";

function useInstallPlatform(): InstallPlatform | null {
  const [platform, setPlatform] = useState<InstallPlatform | null>(null);
  useEffect(() => {
    const update = () => setPlatform(detectInstallPlatform());
    update();
    return onInstallabilityChange(update);
  }, []);
  return platform;
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
 */
export default function InstallAppButton({ variant, onClick }: { variant: "header" | "menu" | "footer"; onClick?: () => void }) {
  const platform = useInstallPlatform();
  const available = platform !== null && !NOTHING_TO_INSTALL.has(platform);

  const handle = () => {
    onClick?.();
    requestInstall(variant);
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
        aria-label="Install app"
        className={`pwa-hide-standalone hidden lg:inline-flex items-center gap-1.5 min-h-12 px-2.5 xl:pl-3 xl:pr-3.5 mr-1 rounded-full border border-[var(--color-outline)] text-2sm font-medium text-[var(--color-on-surface)] hover:bg-[color-mix(in_srgb,var(--color-on-surface)_6%,transparent)] transition-all duration-200 whitespace-nowrap ${
          available ? "" : "invisible"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" />
        </svg>
        <span className="hidden xl:inline">Install app</span>
      </button>
    );
  }

  if (!available) return null;
  if (variant === "footer") return (
    <button type="button" onClick={handle} data-pwa-install-button="footer"
      className="pwa-hide-standalone inline-flex min-h-11 items-center text-sm text-white/80 underline underline-offset-4 hover:text-white">
      Add to your device
    </button>
  );
  return (
    <button
      type="button"
      onClick={handle}
      data-pwa-install-button=""
      className="pwa-hide-standalone w-full flex items-center gap-3 py-3 px-3.5 text-sm rounded-2xl text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[color-mix(in_srgb,var(--color-on-surface)_6%,transparent)] transition-all duration-200"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" strokeWidth={1.5} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 7v7m0 0-2.5-2.5M12 14l2.5-2.5M10.5 18.5h3" />
      </svg>
      Install the app
    </button>
  );
}
