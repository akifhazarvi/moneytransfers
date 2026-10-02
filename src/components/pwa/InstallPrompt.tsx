"use client";

import type { InstallPlatform } from "@/lib/pwa";

const COPY: Partial<Record<InstallPlatform, { title: string; action: string }>> = {
  prompt: { title: "Install the SendMoneyCompare app", action: "Install" },
  "ios-safari": { title: "Add SendMoneyCompare to your Home Screen", action: "Show me how" },
  "ios-other": { title: "Add SendMoneyCompare to your Home Screen", action: "Show me how" },
  "mac-safari": { title: "Add SendMoneyCompare to your Dock", action: "Show me how" },
};

function contextFor(placement: string) {
  if (placement.startsWith("business")) return "Business guides and comparisons, one tap away.";
  if (placement.startsWith("guide")) return "Guides and transfer comparisons, one tap away.";
  return "Rates and transfer comparisons, one tap away.";
}

/** One in-flow offer, displayed only after the reader reaches its placement. */
export default function InstallPrompt({ platform, placement = "inline", onAccept, onDismiss }: {
  platform: InstallPlatform;
  placement?: string;
  onAccept: () => void;
  onDismiss: () => void;
}) {
  const copy = COPY[platform];
  if (!copy) return null;
  const context = contextFor(placement);
  return (
    <aside aria-label="Install the SendMoneyCompare app" data-pwa-install-prompt="" className="pwa-install-banner">
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
