import { NextResponse } from "next/server";
import {
  getRateInsight,
  getProviderInsight,
  type ProviderInsight,
} from "@/lib/rate-history";

// Insights only change when scrapers run (every 6h) and the build embeds a
// fresh dataset, so this is safe to cache aggressively at the CDN. The static
// import of rate-insights.json stays server-side only — this route is the
// single client-facing door to it, replacing the per-page 7 MB bundle leak.
export const revalidate = 3600;

/**
 * GET /api/rate-insight?from=USD&to=INR
 *
 * Returns the corridor's rate insight plus a per-provider insight map, so the
 * client gets exactly the slice it renders (a few KB) instead of importing the
 * whole multi-megabyte dataset into the JS bundle.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = (searchParams.get("from") || "").toUpperCase();
  const to = (searchParams.get("to") || "").toUpperCase();

  if (!from || !to) {
    return NextResponse.json(
      { error: "Missing 'from' or 'to' query parameter" },
      { status: 400 }
    );
  }

  const insight = getRateInsight(from, to);
  if (!insight) {
    // No history for this corridor — return an empty payload, not a 404, so the
    // client can render cards without insights rather than treating it as error.
    return NextResponse.json({ insight: null, providerInsights: {} });
  }

  // Pre-compute the per-provider insight for every provider that has a
  // sparkline in this corridor. Keeps all the math server-side.
  const providerInsights: Record<string, ProviderInsight> = {};
  for (const slug of Object.keys(insight.sparklines)) {
    if (slug === "__mid-market__") continue;
    const pi = getProviderInsight(from, to, slug);
    if (pi) providerInsights[slug] = pi;
  }

  return NextResponse.json({ insight, providerInsights });
}
