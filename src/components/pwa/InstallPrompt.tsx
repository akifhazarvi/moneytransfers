"use client";

import type { InstallPlatform } from "@/lib/pwa";
import { extensionLabel, type ExtensionBrowser } from "@/lib/browser-extension";

const COPY: Partial<Record<InstallPlatform, { title: string; action: string }>> = {
  prompt: { title: "Install the SendMoneyCompare app", action: "Install" },
  "ios-safari": { title: "Add SendMoneyCompare to your Home Screen", action: "Show me how" },
  "ios-other": { title: "Add SendMoneyCompare to your Home Screen", action: "Show me how" },
  "mac-safari": { title: "Add SendMoneyCompare to your Dock", action: "Show me how" },
};

const BROWSER_NAME: Record<ExtensionBrowser, string> = { chrome: "Chrome", edge: "Edge", chromium: "your browser" };

function contextFor(placement: string) {
  if (placement.startsWith("business")) return "Business guides and comparisons, one tap away.";
  if (placement.startsWith("guide")) return "Guides and transfer comparisons, one tap away.";
  return "Rates and transfer comparisons, one tap away.";
}

/** What the extension does, said where the reader is. */
function extensionContextFor(placement: string) {
  if (placement === "comparison-end" || placement === "home-after-comparison") return "Next time, see this comparison on the provider’s own site: it checks the amount you type in Wise, Remitly and other calculators.";
  if (placement.startsWith("business")) return "On Wise, OFX and other provider sites, it tells you whether a transfer is a good deal before you pay.";
  return "On Wise, Remitly and other provider sites, it tells you whether a transfer is a good deal before you pay.";
}

/** One in-flow offer, displayed only after the reader reaches its placement. */
export default function InstallPrompt({ platform, extension = null, placement = "inline", onAccept, onDismiss }: {
  platform: InstallPlatform;
  /** Offer the browser extension instead of the app (desktop Chromium, src/lib/browser-extension.ts). */
  extension?: ExtensionBrowser | null;
  placement?: string;
  onAccept: () => void;
  onDismiss: () => void;
}) {
  const copy = extension
    ? { title: `Add SendMoneyCompare to ${BROWSER_NAME[extension]}`, action: extensionLabel(extension) }
    : COPY[platform];
  if (!copy) return null;
  const context = extension ? extensionContextFor(placement) : contextFor(placement);
  return (
    <aside
      aria-label={extension ? "Add the SendMoneyCompare extension" : "Install the SendMoneyCompare app"}
      data-pwa-install-prompt={extension ? "extension" : ""}
      className="pwa-install-banner"
    >
      <div className="pwa-install-brand" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- small static app icon */}
        <img src="/icon-192x192.png" alt="" width={36} height={36} />
      </div>
      <div className="pwa-install-copy">
        <p className="pwa-install-title">{copy.title}</p>
        <p className="pwa-install-description">{context}</p>
      </div>
      <div className="pwa-install-actions">
        <button type="button" onClick={onAccept} className="conversion-button conversion-button--accent">{copy.action}<span aria-hidden="true">→</span></button>
        <button type="button" onClick={onDismiss} className="pwa-install-later">Not now</button>
      </div>
    </aside>
  );
}
