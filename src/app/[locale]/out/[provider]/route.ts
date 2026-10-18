import { requestAnalyticsAllowed } from "@/lib/consent";
import { NextResponse } from "next/server";
import { getAffiliateUrl, isValidProviderSlug } from "@/lib/affiliate";
import { checkRateLimit } from "@/lib/rate-limit";
import { clientIdFromCookie } from "@/lib/ga4-server";
import { serverTrack } from "@/lib/server-track";
import { classifyTrafficSource } from "@/lib/traffic-source";
import { verifyClickToken } from "@/lib/click-token";
import { decideRedirect, reviewPath } from "@/lib/redirect-decision";

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
  // A malformed ?amount= ("1,000", "abc") is NaN: it reached GA4 as null and
  // the partner URL as "NaN". Unparseable or non-positive means no amount.
  const amountParam = Number(searchParams.get("amount"));
  const amount = Number.isFinite(amountParam) && amountParam > 0 ? amountParam : undefined;
  const src = searchParams.get("src") || undefined;
  const aiSrc = searchParams.get("ai_src") || undefined;
  const referer = request.headers.get("referer") || "";
  const userAgent = request.headers.get("user-agent") || "";

  // Identity is available only after explicit analytics permission.
  const canTrack = requestAnalyticsAllowed(request);
  const cookieHeader = request.headers.get("cookie") || "";
  const existingVid = canTrack ? cookieHeader.match(/(?:^|;\s*)smc_vid=([^;]+)/)?.[1] : undefined;
  const cidParam = canTrack ? searchParams.get("cid") : null;
  const vid = canTrack ? existingVid || crypto.randomUUID() : "";
  const mintedVid = canTrack && !existingVid;
  const clientId =
    cidParam || vid || (canTrack ? clientIdFromCookie(cookieHeader.match(/(?:^|;\s*)_ga=([^;]+)/)?.[1]) : undefined);
  const idSource = cidParam ? "cid" : existingVid ? "vid_cookie" : "vid_minted";
  const geo = {
    country: request.headers.get("x-vercel-ip-country") || undefined,
    region: request.headers.get("x-vercel-ip-country-region") || undefined,
    city: decodeURIComponent(request.headers.get("x-vercel-ip-city") || "") || undefined,
  };
  const corridor = from && to ? `${from}-${to}`.toUpperCase() : "";
  const source = src || "out_route";
  const clickId = searchParams.get("click_id") || `smc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  // Classify the referring channel — see /go route. Channel attribution only;
  // the bot scorer and its Postgres behavioral axis were removed, so
  // `trafficSource.isBot` is the sole automated-client signal.
  const trafficSource = classifyTrafficSource(userAgent, referer, aiSrc);

  // --- Click binding: genuine on-site click vs bare/scraped/bot hit --------
  // See the /go route for the full rationale. Signed token (?t=) is the certain
  // signal. Tokenless hits fall back to the UA-based isBot only (the bot scorer
  // is gone). ?continue=1 is the review page's explicit human confirm.
  const tokenStatus = verifyClickToken(searchParams.get("t"), provider);
  // `?continue=1` = explicit Continue-button click; honor it ALWAYS (even if
  // flagged as a bot) so a false-positived human is never trapped. See /go route.
  const continued = searchParams.get("continue") === "1";
  const decision = decideRedirect({ provider, tokenStatus, isBot: trafficSource.isBot });
  const outcome = continued ? "redirect" : decision.outcome;
  const genuineClick = decision.genuineClick;
  const gated = decision.gated && !continued;

  // Server-side counterpart to the client `provider_clicked` event — see /go/
  // for the naming rationale.
  void serverTrack(
    "provider_clicked_server",
    { provider, corridor, amount: amount ?? 0, source, traffic_source: trafficSource.source, is_bot: trafficSource.isBot, id_source: idSource, click_id: clickId, genuine_click: genuineClick, gated, token_status: tokenStatus, outcome },
    clientId,
    geo,
    request,
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
      is_bot: trafficSource.isBot,
      id_source: idSource,
      click_id: clickId,
      genuine_click: genuineClick,
      gated,
      token_status: tokenStatus,
      outcome,
    },
    clientId,
    geo,
    request,
  );

  // Route by outcome — see /go route. Review-bound hits go to the same page as
  // /go, flagged via=out so its Continue comes back here.
  if (outcome !== "redirect") {
    const review = NextResponse.redirect(new URL(reviewPath(provider, request.url, "out"), request.url), {
      status: 302,
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
    });
    if (mintedVid && !trafficSource.isBot) review.cookies.set("smc_vid", vid, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return review;
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
