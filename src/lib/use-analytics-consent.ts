"use client";

import { useSyncExternalStore } from "react";
import { analyticsAllowed, CONSENT_EVENT } from "@/lib/consent";

function subscribe(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback);
  return () => window.removeEventListener(CONSENT_EVENT, callback);
}

export function useAnalyticsConsent() {
  return useSyncExternalStore(subscribe, analyticsAllowed, () => false);
}
