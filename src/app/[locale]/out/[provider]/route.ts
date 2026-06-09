import { NextResponse } from "next/server";
import { getAffiliateUrl, isValidProviderSlug } from "@/lib/affiliate";
import { checkRateLimit } from "@/lib/rate-limit";
import { gaServerEvent, clientIdFromCookie } from "@/lib/ga4-server";
import { classifyTrafficSource } from "@/lib/traffic-source";

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

  // Reject bare/garbage paths before firing GA events — see /go/ route.
  // Only empties/malformed slugs are rejected; unknown-but-valid slugs still
  // redirect, so direct /out/<provider> clicks from external sources survive.
  if (!isValidProviderSlug(provider)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  const amount = searchParams.get("amount") ? Number(searchParams.get("amount")) : undefined;
  const src = searchParams.get("src") || undefined;
  const aiSrc = searchParams.get("ai_src") || undefined;
  const referer = request.headers.get("referer") || "";
  const userAgent = request.headers.get("user-agent") || "";
  const trafficSource = classifyTrafficSource(userAgent, referer, aiSrc);

  // Server-side GA4 event — always fires regardless of ad blockers / consent.
  // Prefer the live GA4 client_id forwarded by AiSourceInjector as ?cid= so the
  // event stitches onto the originating session (and its real traffic source)
  // instead of landing in GA4's "Unassigned" channel. Fall back to the _ga
  // cookie (now set first-party), then to a fabricated id inside gaServerEvent.
  // page_referrer (passed below) is the secondary signal GA4 uses to derive
  // Source/Medium when no session matches.
  const clientId =
    searchParams.get("cid") ||
    clientIdFromCookie(request.headers.get("cookie")?.match(/_ga=([^;]+)/)?.[1]);
  const geo = {
    country: request.headers.get("x-vercel-ip-country") || undefined,
    region: request.headers.get("x-vercel-ip-country-region") || undefined,
    city: decodeURIComponent(request.headers.get("x-vercel-ip-city") || "") || undefined,
  };
  const corridor = from && to ? `${from}-${to}`.toUpperCase() : "";
  const source = src || "out_route";

  // Server-side counterpart to the client `provider_clicked` event — see /go/
  // for the naming rationale.
  void gaServerEvent(
    "provider_clicked_server",
    { provider, corridor, amount: amount ?? 0, source, traffic_source: trafficSource.source },
    clientId,
    geo,
  );
  void gaServerEvent(
    "affiliate_redirect",
    {
      provider,
      corridor,
      amount: amount ?? 0,
      referer_path: new URL(referer, "https://sendmoneycompare.com").pathname.slice(0, 200),
      referer_host: trafficSource.refererHost,
      page_referrer: referer.slice(0, 420),
      page_location: request.url,
      source,
      traffic_source: trafficSource.source,
      is_bot: trafficSource.isBot,
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
