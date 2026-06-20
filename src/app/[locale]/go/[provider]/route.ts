import { NextResponse } from "next/server";
import { getAffiliateUrl, isValidProviderSlug } from "@/lib/affiliate";
import { checkRateLimit } from "@/lib/rate-limit";
import { clientIdFromCookie } from "@/lib/ga4-server";
import { serverTrack } from "@/lib/server-track";
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

  // Reject bare/garbage paths (e.g. crawlers hitting `/go/` with no provider)
  // BEFORE firing any GA event — an empty provider otherwise pollutes the
  // affiliate_redirect report with provider="" rows at the top of the list.
  // NOTE: only empties/malformed slugs are rejected — unknown-but-valid slugs
  // still redirect (via getAffiliateUrl's fallback), so real clicks survive.
  if (!isValidProviderSlug(provider)) {
    return new NextResponse("Not Found", { status: 404 });
  }

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
  // Resolve a STABLE id for this person, in priority order:
  //  1. ?cid= — the live GA4 client_id forwarded by AiSourceInjector (best:
  //     stitches the redirect onto the exact originating GA session).
  //  2. smc_vid — our first-party stable visitor id (set in middleware for
  //     ~everyone). This is what kills the fabricated-id leak: even when the
  //     user blocks GA or hasn't accepted cookies, this id is present, so the
  //     redirect attaches to a real person instead of GA4 "Unassigned".
  //  3. _ga cookie — for any caller without the above.
  //  4. fabricated id (inside gaServerEvent) — now a near-never last resort.
  const cookieHeader = request.headers.get("cookie") || "";
  const existingVid = cookieHeader.match(/smc_vid=([^;]+)/)?.[1];
  const gaCookie = cookieHeader.match(/_ga=([^;]+)/)?.[1];
  const cidParam = searchParams.get("cid");

  // CRITICAL for external/direct clicks: many /go hits come straight from an
  // AI assistant or a cited link — the person never loaded a page on our site,
  // so middleware never set smc_vid, and there's no consent banner to accept.
  // Previously these all got a fabricated throwaway id (the bulk of the 5,504
  // "Unassigned" leak). Here we MINT a stable smc_vid when it's missing and set
  // it on the redirect response below — so even a first-touch external clicker
  // becomes a real, trackable person, and is recognized if they ever return.
  // First-party, opaque, non-PII, functional to the redirect itself — no
  // consent gate needed (same legitimate basis as running the redirect).
  const vid = existingVid || crypto.randomUUID();
  const mintedVid = !existingVid; // set the cookie on the response only if new
  const clientId = cidParam || vid || clientIdFromCookie(gaCookie);

  // How we identified this click — lets us MEASURE that the leak is closed
  // (share of "fabricated" should approach zero).
  const idSource = cidParam ? "cid" : existingVid ? "vid_cookie" : "vid_minted";
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
  void serverTrack(
    "provider_clicked_server",
    { provider, corridor, amount: amount ?? 0, source, traffic_source: trafficSource.source, is_bot: trafficSource.isBot, id_source: idSource },
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
      source,
      traffic_source: trafficSource.source,
      is_bot: trafficSource.isBot,
      id_source: idSource,
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

  const redirect = NextResponse.redirect(url, {
    status: 302,
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });

  // Persist a freshly-minted visitor id so this external/direct clicker is
  // recognized on any future visit. Safe to Set-Cookie here: /go is a noindex
  // 302 redirect, never an indexed/cacheable HTML page, so the May-2026
  // cache-poisoning concern (Set-Cookie -> private,max-age=0 on crawled HTML)
  // does not apply. Only set when minted, to avoid rewriting an existing id.
  if (mintedVid && !trafficSource.isBot) {
    redirect.cookies.set("smc_vid", vid, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return redirect;
}
