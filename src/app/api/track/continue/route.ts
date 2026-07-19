import { NextResponse } from "next/server";
import { clientIdFromCookie } from "@/lib/ga4-server";
import { serverTrack } from "@/lib/server-track";
import { isValidProviderSlug } from "@/lib/affiliate";

/**
 * Beacon target for the interstitial's Continue click.
 *
 * WHY THIS EXISTS — the tracking gap it closes:
 * The /go + /out routes fire `affiliate_redirect` / `provider_clicked_server`
 * on EVERY hit to the route, BEFORE the interstitial-vs-forward decision. So
 * those counts include bots, gated hits, and interstitial renders that never
 * forwarded — the raw number massively overstates "a real person went to a
 * provider." Now that an on-site interstitial sits in the middle of every
 * redirect, the one unambiguous "genuine human proceeded" signal is a real
 * click on the Continue button. This endpoint records exactly that, and
 * nothing else.
 *
 * The interstitial is standalone server-rendered HTML with no gtag loaded, so
 * it can't fire a GA4 event directly. It `navigator.sendBeacon`s here (fast,
 * fire-and-forget, survives the navigation), and we relay to GA4 via the
 * Measurement Protocol — stitched to the originating session via the same
 * client-id priority the /go route uses (?cid → smc_vid → _ga cookie).
 *
 * Emits `interstitial_continue` — flag this as a Key Event in GA4 and it
 * becomes the clean, low-noise conversion for "human clicked through to a
 * provider," queryable by provider / corridor / channel.
 */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider") || "";

  // Same guard as /go: never record a genuine-click event for a garbage slug.
  if (!isValidProviderSlug(provider)) {
    return new NextResponse(null, { status: 204 });
  }

  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  const src = searchParams.get("src") || "interstitial";
  const aiSrc = searchParams.get("ai_src") || undefined;
  const corridor = from && to ? `${from}-${to}`.toUpperCase() : "";

  // Resolve a stable client id — same priority order as the /go route so this
  // event lands on the same GA4 user/session as the redirect it belongs to.
  const cookieHeader = request.headers.get("cookie") || "";
  const existingVid = cookieHeader.match(/smc_vid=([^;]+)/)?.[1];
  const gaCookie = cookieHeader.match(/_ga=([^;]+)/)?.[1];
  const cidParam = searchParams.get("cid") || undefined;
  const clientId = cidParam || existingVid || clientIdFromCookie(gaCookie);

  const geo = {
    country: request.headers.get("x-vercel-ip-country") || undefined,
    region: request.headers.get("x-vercel-ip-country-region") || undefined,
    city: decodeURIComponent(request.headers.get("x-vercel-ip-city") || "") || undefined,
  };

  void serverTrack(
    "interstitial_continue",
    {
      provider,
      corridor,
      source: src,
      ...(aiSrc ? { traffic_source: aiSrc } : {}),
    },
    clientId,
    geo,
  );

  // 204 — beacon needs no body; keep the response tiny and uncacheable.
  return new NextResponse(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}
