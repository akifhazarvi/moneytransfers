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
export default function InstallAppButton({ variant, onClick }: { variant: "header" | "menu"; onClick?: () => void }) {
  const platform = useInstallPlatform();
  const available = platform !== null && !NOTHING_TO_INSTALL.has(platform);

  const handle = () => {
    onClick?.();
    requestInstall(variant);
  };

  if (variant === "header") {
    return (
      <button
        type="button"
        onClick={handle}
        aria-label="Install the SendMoneyCompare app"
        title="Install app"
        data-pwa-install-button=""
        className={`pwa-hide-standalone hidden lg:flex w-11 h-11 items-center justify-center rounded-full hover:bg-[color-mix(in_srgb,var(--color-on-surface)_6%,transparent)] transition-all duration-200 ${
          available ? "" : "invisible"
        }`}
      >
        <svg className="w-5 h-5 text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="4" width="18" height="13" rx="2" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 7.5v6m0 0-2.5-2.5M12 13.5l2.5-2.5M8 20h8" />
        </svg>
      </button>
    );
  }

  if (!available) return null;
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
