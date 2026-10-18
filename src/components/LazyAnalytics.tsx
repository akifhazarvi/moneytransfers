"use client";

// Mount immediately once permission is available; never load before opt-in.
import { Analytics } from "@vercel/analytics/react";
import { useAnalyticsConsent } from "@/lib/use-analytics-consent";
import { analyticsAllowed } from "@/lib/consent";

export default function LazyAnalytics() {
  const allowed = useAnalyticsConsent();
  return allowed ? <Analytics beforeSend={event => analyticsAllowed() ? event : null} /> : null;
}
