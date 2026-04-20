"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("cookieConsent");

  function enableAnalytics() {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
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
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl shadow-lg p-5 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
              {t("message")}{" "}
              <Link
                href="/cookies"
                className="text-[var(--color-primary)] hover:underline"
              >
                {t("learnMore")}
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={handleDecline}
              className="px-3 py-2 text-2sm font-normal text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] border border-[var(--color-outline)] rounded-full transition-colors cursor-pointer"
            >
              {t("decline")}
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2.5 text-2sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[#1557b0] rounded-full shadow-sm transition-colors cursor-pointer"
            >
              {t("accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
