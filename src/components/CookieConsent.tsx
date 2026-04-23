"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Shield } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("cookieConsent");

  function enableAnalytics() {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
      // Consent Mode v2 already un-queues the landing page_view that was held
      // under the initial "denied" default once consent flips to granted.
      // We used to fire a manual backfill here, but it double-counted for EU
      // users — Google's redelivery queue + our manual event = two pageviews.
    }
  }

  function denyAnalytics() {
    // Redundant with the gtag-init default (which is already "denied" for EU),
    // but sending an explicit update on click gives Google a clear consent
    // state transition — helps Consent Mode signal detection.
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }
  }

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (consent === "accepted") {
      enableAnalytics();
      return;
    }
    // "declined:<unix_ms>" — re-prompt after 6 months (CNIL-recommended cadence).
    // Legacy "declined" without timestamp is treated as indefinite decline until
    // cleared (keeps existing users from being unexpectedly re-asked).
    if (consent?.startsWith("declined:")) {
      const ts = parseInt(consent.slice(9), 10);
      const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 180;
      if (Number.isFinite(ts) && Date.now() - ts < SIX_MONTHS_MS) return;
    } else if (consent === "declined") {
      return;
    }

    // No stored consent — check if EU user (needs explicit consent)
    const EU = "AT,BE,BG,HR,CY,CZ,DK,EE,FI,FR,DE,GR,HU,IE,IT,LV,LT,LU,MT,NL,PL,PT,RO,SK,SI,ES,SE,IS,LI,NO,GB,CH";
    const cc = (document.cookie.match(/geo-country=([A-Z]{2})/)?.[1]) || "";
    const isEU = EU.includes(cc);

    if (isEU) {
      // EU users: show consent banner fast (analytics stays denied until they accept).
      // Short delay (300ms) prevents FOUC on hydration but still lets bouncers see the banner.
      const id = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(id);
    }
    // Non-EU users: analytics already granted by gtag init, no banner needed
  }, []);

  function handleAccept() {
    localStorage.setItem("cookie_consent", "accepted");
    enableAnalytics();
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem("cookie_consent", `declined:${Date.now()}`);
    denyAnalytics();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:px-4 sm:pb-5 animate-cookie-slide-up"
    >
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-[var(--color-surface)] border border-[var(--color-primary)]/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
          {/* Brand accent stripe */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-primary-dark)]" />

          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-5 p-5 md:p-6 md:pr-5">
            {/* Icon badge */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[var(--color-primary-surface)] grid place-items-center shadow-inner" aria-hidden="true">
                <Shield className="w-5 h-5 text-[var(--color-primary)]" strokeWidth={2} />
              </div>
              <p className="md:hidden text-[0.95rem] font-semibold text-[var(--color-on-surface)]">
                Privacy
              </p>
            </div>

            {/* Copy */}
            <div className="flex-1 min-w-0">
              <p className="text-[0.9rem] md:text-[0.95rem] text-[var(--color-on-surface)] leading-relaxed">
                {t("message")}{" "}
                <Link
                  href="/cookies"
                  className="text-[var(--color-primary)] hover:underline font-medium whitespace-nowrap"
                >
                  {t("learnMore")}
                </Link>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={handleDecline}
                className="flex-1 md:flex-initial px-4 py-2.5 text-2sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-full transition-colors cursor-pointer"
              >
                {t("decline")}
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 md:flex-initial px-6 py-2.5 text-2sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[#1557b0] rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer animate-cookie-glow"
              >
                {t("accept")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
