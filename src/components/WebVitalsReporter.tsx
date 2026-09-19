"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Reports Core Web Vitals to GA4.
 *
 * The site had no Web Vitals instrumentation at all. Over the 28 days to
 * 2026-09-15, across 4,952 sessions, GA4 received 5 LCP, 5 FCP, 5 CLS events
 * and zero INP or TTFB — stray hits, not a sample. With CrUX and PageSpeed both
 * refusing (API quota exhausted, no key configured), that left no way to see
 * what real users experience on this site.
 *
 * Uses Next's own hook rather than the web-vitals package: it is already part of
 * the framework, needs no dependency, and reports the same attributed metrics.
 *
 * Values are rounded and sent as `value`, with the metric in `metric_name`, so
 * GA4 can average them per page. CLS is multiplied by 1000 because GA4 metric
 * values are integers and an unrounded CLS of 0.08 would floor to 0.
 */
export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;

    // GA4 integer metric values: CLS is a unitless ratio well below 1, so it is
    // scaled. Everything else is already in milliseconds.
    const value = metric.name === "CLS" ? Math.round(metric.value * 1000) : Math.round(metric.value);

    window.gtag("event", metric.name, {
      value,
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: metric.rating, // "good" | "needs-improvement" | "poor"
      metric_id: metric.id, // dedupes multiple reports of the same metric
      metric_navigation_type: metric.navigationType,
      page_path: window.location.pathname,
      // Not a conversion and not worth sampling into session metrics.
      non_interaction: true,
    });
  });

  return null;
}
