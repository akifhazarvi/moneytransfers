"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { NOTHING_TO_INSTALL, detectInstallPlatform, onInstallabilityChange, requestInstall, type InstallPlatform } from "@/lib/pwa";
import { trackPwaPromptShown, trackWhatsappImpression } from "@/lib/analytics";
import {
  extensionBrowser,
  extensionLabel,
  extensionOfferShown,
  openExtensionStore,
  prefersExtension,
  priceCheckSite,
  type ExtensionBrowser,
} from "@/lib/browser-extension";
import WhatsAppFollowLink from "@/components/WhatsAppFollowLink";
import { WhatsAppGlyph, WhatsAppTile } from "@/components/WhatsAppMark";
import { HUMAN_SIGNALS } from "./ReviewContinue";

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
 *
 * On desktop Chrome and Edge the card offers the browser extension instead
 * (src/lib/browser-extension.ts): the visitor is on the way to the provider's
 * site, which is where its price check works. Where the extension checks this
 * provider's own calculator, the card says so by name.
 */
export default function StayConnected({ from, to, provider, providerName }: { from?: string; to?: string; provider?: string; providerName?: string }) {
  const [platform, setPlatform] = useState<InstallPlatform | null>(null);
  const [extension, setExtension] = useState<ExtensionBrowser | null>(null);
  useEffect(() => {
    const update = () => {
      setPlatform(detectInstallPlatform());
      setExtension(prefersExtension() ? extensionBrowser() : null);
    };
    update();
    return onInstallabilityChange(update);
  }, []);
  const installable = platform === null || extension !== null || !NOTHING_TO_INSTALL.has(platform);

  // The card counts in the install funnel's denominator, like every other
  // install surface (placement "go_review"): extension_offer_shown or
  // pwa_install_prompt_shown, once it is half on screen AND the visitor has
  // given a human signal, as the page's own view does (ReviewContinue). On
  // 2026-10-20, 10 of the first 11 extension_offer_shown counted on render
  // here came from the Singapore / China bots that hit /go directly.
  const appRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = appRef.current;
    if (!el || !platform || (!extension && NOTHING_TO_INSTALL.has(platform)) || typeof IntersectionObserver === "undefined") return;
    let onScreen = false;
    let human = false;
    const count = () => {
      if (!onScreen || !human) return;
      stop();
      if (extension) extensionOfferShown("go_review", extension);
      else trackPwaPromptShown(platform, "go_review");
    };
    const onSignal = () => {
      human = true;
      count();
    };
    const io = new IntersectionObserver((entries) => {
      onScreen = entries.some((e) => e.isIntersecting);
      count();
    }, { threshold: 0.5 });
    function stop() {
      io.disconnect();
      HUMAN_SIGNALS.forEach((e) => removeEventListener(e, onSignal, true));
    }
    HUMAN_SIGNALS.forEach((e) => addEventListener(e, onSignal, { capture: true, passive: true }));
    io.observe(el);
    return stop;
  }, [platform, extension]);

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
  const site = provider ? priceCheckSite(provider) : null;
  const siteName = providerName ?? site?.name;

  return (
    <div className="go-review-stay">
      {installable && extension && (
        <div ref={appRef} className="go-review-card go-review-card--app go-review-card--extension pwa-hide-standalone">
          <div className="go-review-card-body">
            <div className="go-review-card-brand">
              <Image src="/icon-192x192.png" alt="" width={48} height={48} className="go-review-app-icon" />
              <div>
                <p className="go-review-card-name">SendMoneyCompare</p>
                <p className="go-review-card-sub">{extension === "edge" ? "Edge" : extension === "chrome" ? "Chrome" : "Browser"} extension · Free</p>
              </div>
            </div>
            <h3 className="go-review-card-title">
              {site && siteName ? `A price check on ${siteName}’s own site` : "A price check on provider sites"}
            </h3>
            <p className="go-review-card-text">
              {site && siteName
                ? `Type an amount in ${siteName}’s calculator and the extension tells you whether it’s a good deal, or who pays more for the same transfer.`
                : "Type an amount in a provider’s calculator and the extension tells you whether it’s a good deal, or who pays more for the same transfer."}
            </p>
            <ul className="go-review-chips">
              <li>Price check on provider sites</li>
              <li>Mid-market converter</li>
              <li>Rate alerts</li>
            </ul>
            <button type="button" onClick={() => openExtensionStore("go_review")} className="conversion-button go-review-install">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinejoin="round" strokeWidth={2} d="M9.5 4.5a2 2 0 0 1 4 0V6H17a1 1 0 0 1 1 1v3.5h-1.5a2 2 0 0 0 0 4H18V18a1 1 0 0 1-1 1h-3.5v-1.5a2 2 0 0 0-4 0V19H6a1 1 0 0 1-1-1v-3.5h1.5a2 2 0 0 0 0-4H5V7a1 1 0 0 1 1-1h3.5z" />
              </svg>
              {extensionLabel(extension)}
            </button>
          </div>
          {/* A provider page with the price-check panel: decoration, so hidden from AT. */}
          <div className="go-review-browser" aria-hidden="true">
            <div className="go-review-browser-bar"><i /><i /><i /><span>{site?.domain ?? "provider.com"}</span></div>
            <div className="go-review-browser-page">
              <div className="go-review-phone-row"><span /><b /></div>
              <div className="go-review-phone-row"><span /><b /></div>
            </div>
            <div className="go-review-browser-panel">
              <p className="go-review-phone-pair">{pair}</p>
              <div className="go-review-phone-row is-top"><span /><b /></div>
              <div className="go-review-phone-row"><span /><b /></div>
            </div>
          </div>
        </div>
      )}

      {installable && !extension && (
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
