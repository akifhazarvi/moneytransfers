"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { NOTHING_TO_INSTALL, detectInstallPlatform, onInstallabilityChange, requestInstall, type InstallPlatform } from "@/lib/pwa";
import { trackPwaPromptShown, trackWhatsappImpression } from "@/lib/analytics";
import WhatsAppFollowLink from "@/components/WhatsAppFollowLink";
import { WhatsAppGlyph, WhatsAppTile } from "@/components/WhatsAppMark";

/**
 * The review page's second row: install the app, follow the WhatsApp channel.
 * Both are ways back to the comparison next time, offered once the visitor is
 * on their way out.
 *
 * The app card is server-rendered in place, so the row does not reflow on
 * hydration in the common case. It leaves only where there is nothing to
 * install (already installed, inside the app, or a browser with no install
 * path); the grid then gives WhatsApp the full width. Install goes through
 * requestInstall, so PwaManager runs the prompt or the Safari steps and
 * records pwa_install_clicked with surface "go_review".
 */
export default function StayConnected({ from, to }: { from?: string; to?: string }) {
  const [platform, setPlatform] = useState<InstallPlatform | null>(null);
  useEffect(() => {
    const update = () => setPlatform(detectInstallPlatform());
    update();
    return onInstallabilityChange(update);
  }, []);
  const installable = platform === null || !NOTHING_TO_INSTALL.has(platform);

  // The app card counts in the install funnel's denominator, like every other
  // install surface: pwa_install_prompt_shown, placement "go_review", once it
  // is half on screen and we know it can install here.
  const appRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = appRef.current;
    if (!el || !platform || NOTHING_TO_INSTALL.has(platform) || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        trackPwaPromptShown(platform, "go_review");
        io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [platform]);

  // Impression = the WhatsApp card reached the viewport, as on every other
  // WhatsApp surface, so follow rate has a denominator.
  const waRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = waRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        trackWhatsappImpression("go_review");
        io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pair = from && to ? `${from} → ${to}` : "GBP → INR";

  return (
    <div className="go-review-stay">
      {installable && (
        <div ref={appRef} className="go-review-card go-review-card--app pwa-hide-standalone">
          <div className="go-review-card-body">
            <div className="go-review-card-brand">
              <Image src="/icon-192x192.png" alt="" width={48} height={48} className="go-review-app-icon" />
              <div>
                <p className="go-review-card-name">SendMoneyCompare</p>
                <p className="go-review-card-sub">App · Free</p>
              </div>
            </div>
            <h3 className="go-review-card-title">Your next comparison, one tap away</h3>
            <p className="go-review-card-text">Install the app and it opens straight on the comparison. No app store, no sign-up.</p>
            <ul className="go-review-chips">
              <li>Opens on the comparison</li>
              <li>Saved pages work offline</li>
              <li>Uninstall any time</li>
            </ul>
            <button type="button" onClick={() => requestInstall("go_review")} className="conversion-button go-review-install">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" />
              </svg>
              Install app
            </button>
          </div>
          {/* A phone showing the comparison: decoration, so hidden from AT. */}
          <div className="go-review-phone" aria-hidden="true">
            <div className="go-review-phone-notch" />
            <p className="go-review-phone-pair">{pair}</p>
            <div className="go-review-phone-row is-top"><span /><b /></div>
            <div className="go-review-phone-row"><span /><b /></div>
            <div className="go-review-phone-row"><span /><b /></div>
            <div className="go-review-phone-row"><span /><b /></div>
          </div>
        </div>
      )}

      <div ref={waRef} className="go-review-card go-review-card--wa">
        <div className="go-review-card-body">
          <div className="go-review-card-brand">
            <WhatsAppTile className="h-12 w-12 rounded-[14px]" glyphClassName="h-7 w-7" />
            <div>
              <p className="go-review-card-name">SendMoneyCompare</p>
              <p className="go-review-card-sub">WhatsApp Channel · Free</p>
            </div>
          </div>
          <h3 className="go-review-card-title">Keep up with better rates</h3>
          <p className="go-review-card-text">Get updates when the top-paying provider changes on major routes. Follow privately, with no group chats.</p>
          <div className="go-review-bubble">
            <p className="go-review-bubble-label">Example alert</p>
            <p className="go-review-bubble-title">{pair} · top payout changed</p>
            <p className="go-review-bubble-text">A different provider pays the most on this route this morning. Same money in, more out.</p>
            <p className="go-review-bubble-time">09:12</p>
          </div>
          <WhatsAppFollowLink source="go_review" className="go-review-wa-button">
            <WhatsAppGlyph className="h-5 w-5" />
            Follow on WhatsApp
          </WhatsAppFollowLink>
        </div>
      </div>
    </div>
  );
}
