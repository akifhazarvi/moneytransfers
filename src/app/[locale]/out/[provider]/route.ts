import { NextResponse } from "next/server";
import { getAffiliateUrl } from "@/lib/affiliate";
import { checkRateLimit } from "@/lib/rate-limit";
import { gaServerEvent, clientIdFromCookie } from "@/lib/ga4-server";
import { track } from "@vercel/analytics/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = checkRateLimit(ip);

  if (!allowed) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  const { provider } = await params;
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  const amount = searchParams.get("amount") ? Number(searchParams.get("amount")) : undefined;
  const src = searchParams.get("src") || undefined;
  const referer = request.headers.get("referer") || "";

  // Server-side GA4 event — always fires regardless of ad blockers / consent.
  // The site runs cookieless (no _ga cookie), so we don't bother parsing one.
  // page_referrer is what GA4 uses to derive Source/Medium for events that
  // arrive without traffic-source dimensions on session_start — passing it
  // here keeps affiliate_redirect events out of "(not set)".
  const clientId = clientIdFromCookie(request.headers.get("cookie")?.match(/_ga=([^;]+)/)?.[1]);
  const geo = {
    country: request.headers.get("x-vercel-ip-country") || undefined,
    region: request.headers.get("x-vercel-ip-country-region") || undefined,
    city: decodeURIComponent(request.headers.get("x-vercel-ip-city") || "") || undefined,
  };
  void track("affiliate_redirect", {
    provider,
    corridor: from && to ? `${from}-${to}`.toUpperCase() : "",
    source: src || "out_route",
  });
  void gaServerEvent(
    "affiliate_redirect",
    {
      provider,
      corridor: from && to ? `${from}-${to}`.toUpperCase() : "",
      amount: amount ?? 0,
      referer_path: new URL(referer, "https://sendmoneycompare.com").pathname.slice(0, 200),
      page_referrer: referer.slice(0, 420),
      page_location: request.url,
      source: src || "out_route",
    },
    clientId,
    geo,
  );

  const url = getAffiliateUrl(provider, {
    sourceCurrency: from,
    targetCurrency: to,
    sourceAmount: amount,
    clickref: src,
  });

  return NextResponse.redirect(url, {
    status: 302,
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}
