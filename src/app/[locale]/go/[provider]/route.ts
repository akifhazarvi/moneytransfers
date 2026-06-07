import { NextResponse } from "next/server";
import { getAffiliateUrl } from "@/lib/affiliate";
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
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  const amount = searchParams.get("amount") ? Number(searchParams.get("amount")) : undefined;
  const src = searchParams.get("src") || undefined; // source surface → Partnerize clickref
  const aiSrc = searchParams.get("ai_src") || undefined; // AI platform that referred the session
  const referer = request.headers.get("referer") || "";
  const userAgent = request.headers.get("user-agent") || "";

  // Resolve where this redirect actually came from. Server-side /go hits carry
  // no GA session, so GA files them under "Unassigned" with no source. Most are
  // AI assistants / AI-search engines fetching a cited link (real referrals) or
  // crawlers — only the UA + referer host can tell them apart. ?ai_src= wins
  // when present (set by the on-site injector for human AI-referred sessions).
  const trafficSource = classifyTrafficSource(userAgent, referer, aiSrc);

  // Server-side tracking — fires even when the user has an ad blocker or
  // declined cookies, so we never miss an affiliate conversion.
  //
  // AiSourceInjector forwards the live GA4 client_id as ?cid= — prefer it so
  // the server event stitches onto the originating session (and its real
  // traffic source) instead of GA4's "Unassigned" bucket. Fall back to the
  // first-party _ga cookie for any non-injector caller, then to a fabricated id.
  const gaCookie = request.headers.get("cookie")?.match(/_ga=([^;]+)/)?.[1];
  const clientId = searchParams.get("cid") || clientIdFromCookie(gaCookie);
  const geo = {
    country: request.headers.get("x-vercel-ip-country") || undefined,
    region: request.headers.get("x-vercel-ip-country-region") || undefined,
    city: decodeURIComponent(request.headers.get("x-vercel-ip-city") || "") || undefined,
  };

  const corridor = from && to ? `${from}-${to}`.toUpperCase() : "";
  const source = src || "go_route";

  // Server-side counterpart to the client `provider_clicked` event. Distinct
  // event name so the two sinks measure clean, separate things:
  //   - provider_clicked (client, GA4 + Vercel) = UI button engagement
  //   - provider_clicked_server (server, GA4 only) = the redirect actually ran
  // The gap between the two = adblock + JS-failure rate.
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
