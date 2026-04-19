"use client";

// Loaded eagerly (not dynamic) so Vercel Analytics tracks page views from the
// very first render. Dynamic import with ssr:false was causing bounced users
// (<2s on page) to be missed entirely — the analytics script hadn't finished
// loading before they left.
import { Analytics } from "@vercel/analytics/react";

export default function LazyAnalytics() {
  return <Analytics />;
}
