import { NextResponse } from "next/server";
import { getAffiliateUrl, isValidProviderSlug } from "@/lib/affiliate";
import { checkRateLimit } from "@/lib/rate-limit";
import { clientIdFromCookie } from "@/lib/ga4-server";
import { serverTrack } from "@/lib/server-track";
import { storeEvent, behavioralBotScore, distributedBotScore } from "@/lib/event-store";
import { classifyTrafficSource } from "@/lib/traffic-source";
import { scoreBotRequest } from "@/lib/bot-score";
import { classifyIp } from "@/lib/ip-intel";
import { verifyClickToken } from "@/lib/click-token";
import { decideRedirect, interstitialHtml, providerDisplayName } from "@/lib/redirect-decision";
import { createHash } from "crypto";

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

  // Server-side GA4 event — always fires regardless of ad blockers / consent.
  // Prefer the live GA4 client_id forwarded by AiSourceInjector as ?cid= so the
  // event stitches onto the originating session (and its real traffic source)
  // instead of landing in GA4's "Unassigned" channel. Fall back to the _ga
  // cookie (now set first-party), then to a fabricated id inside gaServerEvent.
  // page_referrer (passed below) is the secondary signal GA4 uses to derive
  // Source/Medium when no session matches.
  // Stable-id resolution + mint-if-missing for external/direct clicks — see
  // the /go route for the full rationale. Minting here means a first-touch
  // external clicker (e.g. from an AI assistant) becomes a real, trackable
  // person instead of a fabricated throwaway id.
  const cookieHeader = request.headers.get("cookie") || "";
  const existingVid = cookieHeader.match(/smc_vid=([^;]+)/)?.[1];
  const cidParam = searchParams.get("cid");
  const vid = existingVid || crypto.randomUUID();
  const mintedVid = !existingVid;
  const clientId =
    cidParam || vid || clientIdFromCookie(cookieHeader.match(/_ga=([^;]+)/)?.[1]);
  const idSource = cidParam ? "cid" : existingVid ? "vid_cookie" : "vid_minted";
  const geo = {
    country: request.headers.get("x-vercel-ip-country") || undefined,
    region: request.headers.get("x-vercel-ip-country-region") || undefined,
    city: decodeURIComponent(request.headers.get("x-vercel-ip-city") || "") || undefined,
  };
  const corridor = from && to ? `${from}-${to}`.toUpperCase() : "";
  const source = src || "out_route";
  const clickId = searchParams.get("click_id") || `smc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  // Classify (source/isBot label) + extensive bot score — see /go route.
  const trafficSource = classifyTrafficSource(userAgent, referer, aiSrc, geo.country, corridor, {
    hadCid: !!cidParam,
    hadAiSrc: !!aiSrc,
    hadVidCookie: !!existingVid,
    accept: request.headers.get("accept"),
    acceptLanguage: request.headers.get("accept-language"),
  });
  const ipHash = ip && ip !== "unknown"
    ? createHash("sha256").update(ip).digest("hex").slice(0, 32)
    : undefined;
  // Offline IP→ASN lookup (datacenter vs residential) — see /go route.
  const ipIntel = classifyIp(ip);
  const aiUserTraffic = !!aiSrc || (!trafficSource.isBot && /^(chatgpt|perplexity|claude|duckduckgo)$/.test(trafficSource.source));
  const [behavioral, distributed] = await Promise.all([
    behavioralBotScore(ipHash),
    distributedBotScore(geo.country),
  ]);
  const botResult = scoreBotRequest({
    ua: userAgent,
    refererHost: trafficSource.refererHost,
    country: geo.country,
    corridor,
    hadCid: !!cidParam,
    hadVidCookie: !!existingVid,
    accept: request.headers.get("accept"),
    acceptLanguage: request.headers.get("accept-language"),
    acceptEncoding: request.headers.get("accept-encoding"),
    secFetchMode: request.headers.get("sec-fetch-mode"),
    secFetchDest: request.headers.get("sec-fetch-dest"),
    secFetchSite: request.headers.get("sec-fetch-site"),
    secChUa: request.headers.get("sec-ch-ua"),
    secChUaMobile: request.headers.get("sec-ch-ua-mobile"),
    secChUaPlatform: request.headers.get("sec-ch-ua-platform"),
    priority: request.headers.get("priority"),
    ipClass: ipIntel.class,
    cloudEgress: ipIntel.cloudEgress,
    asnOrg: ipIntel.asnOrg,
    aiUserTraffic,
    behavioralScore: behavioral.score + distributed.score,
    behavioralReasons: [...behavioral.reasons, ...distributed.reasons],
  });

  // --- Click binding: genuine on-site click vs bare/scraped/bot hit --------
  // See the /go route for the full rationale. Signed token (?t=) is the certain
  // signal; bot score splits the tokenless into human (interstitial) vs bot
  // (not forwarded). ?continue=1 is the interstitial's explicit human confirm.
  const tokenStatus = verifyClickToken(searchParams.get("t"), provider);
  const continued = searchParams.get("continue") === "1";
  const decision = decideRedirect({ tokenStatus, isBot: botResult.isBot });
  const outcome = continued && decision.outcome !== "not_forwarded"
    ? "redirect"
    : decision.outcome;
  const genuineClick = decision.genuineClick;
  const gated = decision.gated && !continued;

  // Server-side counterpart to the client `provider_clicked` event — see /go/
  // for the naming rationale.
  void serverTrack(
    "provider_clicked_server",
    { provider, corridor, amount: amount ?? 0, source, traffic_source: trafficSource.source, is_bot: botResult.isBot, id_source: idSource, click_id: clickId, bot_score: botResult.score, genuine_click: genuineClick, gated, token_status: tokenStatus, outcome },
    clientId,
    geo,
  );
  void serverTrack(
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
      is_bot: botResult.isBot,
      id_source: idSource,
      click_id: clickId,
      bot_score: botResult.score,
      genuine_click: genuineClick,
      gated,
      token_status: tokenStatus,
      outcome,
    },
    clientId,
    geo,
  );

  // First-party auditable record — see /go route. No-ops until provisioned.
  void storeEvent({
    event: "affiliate_redirect",
    vid,
    clientId,
    clickId,
    provider,
    corridor,
    amount: amount ?? 0,
    source,
    trafficSource: trafficSource.source,
    idSource,
    isBot: botResult.isBot,
    botScore: botResult.score,
    botReasons: botResult.reasons.join("; "),
    ipHash,
    ipClass: ipIntel.class,
    asn: ipIntel.asn ?? undefined,
    asnOrg: ipIntel.asnOrg ?? undefined,
    refererHost: trafficSource.refererHost,
    country: geo.country,
    region: geo.region,
    city: geo.city,
    genuineClick,
    gated,
    tokenStatus,
    outcome,
  });

  // Route by outcome — see /go route. Bare/scraped/bot hits get the on-site
  // interstitial and never forward to the provider on their own.
  if (outcome !== "redirect") {
    const continueUrl = buildContinueUrl(request.url);
    const html = interstitialHtml({
      providerName: providerDisplayName(provider),
      continueUrl,
    });
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  const url = getAffiliateUrl(provider, {
    sourceCurrency: from,
    targetCurrency: to,
    sourceAmount: amount,
    clickref: src,
    clickId,
    corridor,
    source,
  });

  const redirect = NextResponse.redirect(url, {
    status: 302,
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });

  // Persist a freshly-minted visitor id so a first-touch external clicker is
  // recognized on return. Safe on /out: noindex 302 redirect, never cacheable
  // HTML (see /go route for the full rationale).
  if (mintedVid && !trafficSource.isBot) {
    redirect.cookies.set("smc_vid", vid, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return redirect;
}

// Same-origin continue URL for the interstitial — see /go route.
function buildContinueUrl(requestUrl: string): string {
  const u = new URL(requestUrl);
  u.searchParams.set("continue", "1");
  return `${u.pathname}${u.search}`;
}
