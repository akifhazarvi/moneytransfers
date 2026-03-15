"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setVisible(true);
    } else if (consent === "accepted") {
      enableAnalytics();
    }
  }, []);

  function enableAnalytics() {
    // Enable Google Analytics by updating consent
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  }

  function handleAccept() {
    localStorage.setItem("cookie_consent", "accepted");
    enableAnalytics();
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl shadow-lg p-5 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-[14px] font-medium text-[var(--color-on-surface)] mb-1">
              We use cookies
            </p>
            <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">
              We use essential cookies to make our site work and analytics cookies to
              understand how you use it. You can accept or decline non-essential
              cookies.{" "}
              <Link
                href="/cookies"
                className="text-[var(--color-primary)] hover:underline"
              >
                Learn more about our cookie policy
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-[13px] font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] border border-[var(--color-outline)] rounded-full transition-colors cursor-pointer"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-[13px] font-medium text-white bg-[var(--color-primary)] hover:bg-[#1557b0] rounded-full transition-colors cursor-pointer"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
