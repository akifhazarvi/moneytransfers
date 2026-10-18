"use client";

import { CONSENT_OPEN_EVENT } from "@/lib/consent";

export default function CookieSettingsButton({ className = "" }: { className?: string }) {
  return <button type="button" onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
    className={`underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 ${className}`}>
    Cookie settings
  </button>;
}
