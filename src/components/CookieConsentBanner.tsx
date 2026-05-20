"use client";

import { useEffect, useState } from "react";

const COOKIE_NAME = "smc_consent";
const COOKIE_DAYS = 365;

// Countries where consent banner is legally required (GDPR / UK GDPR)
const CONSENT_REQUIRED = new Set([
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE",
  "IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE",
  "GB", // UK GDPR
  "IS","LI","NO", // EEA
  "CH", // Swiss nFADP
]);

function getGeoCountry(): string {
  if (typeof document === "undefined") return "";
  return (document.cookie.match(/(?:^|; )geo-country=([A-Z]{2})/) || [])[1] || "";
}

function getConsent(): "granted" | "denied" | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`));
  return (m?.[1] as "granted" | "denied") ?? null;
}

function setConsent(value: "granted" | "denied") {
  const expires = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString();
  document.cookie = `${COOKIE_NAME}=${value}; path=/; expires=${expires}; SameSite=Lax`;
}

function applyConsent(value: "granted" | "denied") {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: value,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const country = getGeoCountry();
    const needsConsent = CONSENT_REQUIRED.has(country);

    if (!needsConsent) {
      // Non-EU/UK: auto-grant and never show banner
      if (getConsent() === null) {
        setConsent("granted");
        applyConsent("granted");
      }
      return;
    }

    if (getConsent() === null) {
      // EU/UK user with no stored choice — show the banner
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function accept() {
    setConsent("granted");
    applyConsent("granted");
    setVisible(false);
  }

  function decline() {
    setConsent("denied");
    applyConsent("denied");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[9999] sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm"
    >
      <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] shadow-[0_4px_24px_rgba(0,0,0,0.12)] rounded-none sm:rounded-2xl p-4 sm:p-5">
        <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
          We use cookies to understand how visitors use our site and improve your experience.{" "}
          <a href="/cookies" className="text-[var(--color-primary)] underline underline-offset-2">
            Cookie policy
          </a>
        </p>
        <div className="flex gap-2">
          <button
            onClick={accept}
            className="flex-1 h-9 px-4 text-[13px] font-semibold bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            Accept
          </button>
          <button
            onClick={decline}
            className="flex-1 h-9 px-4 text-[13px] font-medium border border-[var(--color-outline)] text-[var(--color-on-surface-variant)] rounded-full hover:bg-[var(--color-surface-dim)] transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
