"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackWebVital } from "@/lib/analytics";

// Core Web Vitals from real visitors, into GA4 as `web_vitals`. Until
// 2026-10-11 nothing on the site reported them: the 5 LCP/FCP/CLS events a
// month in GA4 came from other sites that reuse our measurement id, and the
// PSI/CrUX quota was exhausted, so no one could see real-user performance.
// Next reports each metric once per page load (CLS and INP when the page is
// hidden), and gtag queues them until it loads.
export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    trackWebVital(metric.name, metric.value, metric.rating, metric.id, metric.navigationType);
  });
  return null;
}
