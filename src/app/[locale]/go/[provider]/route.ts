import { NextResponse } from "next/server";
import { getAffiliateUrl, isValidProviderSlug } from "@/lib/affiliate";
import { checkRateLimit } from "@/lib/rate-limit";
import { clientIdFromCookie } from "@/lib/ga4-server";
import { serverTrack } from "@/lib/server-track";
import { classifyTrafficSource } from "@/lib/traffic-source";
import { verifyClickToken } from "@/lib/click-token";
import { decideRedirect, interstitialHtml, providerDisplayName, buildCrossSell } from "@/lib/redirect-decision";

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

  // Classify the referring channel (source label + conservative isBot from the
  // UA/Referer). ?ai_src= wins for source. This is channel attribution only —
  // the additive bot scorer and its Postgres behavioral axis were removed, so
  // `trafficSource.isBot` (self-identifying crawler UAs) is now the sole
  // automated-client signal feeding the redirect decision below.
  const trafficSource = classifyTrafficSource(userAgent, referer, aiSrc);

  // Per-click id from the on-site injector (TapTap-style billing proof + ties
  // the client provider_clicked to this server event). Absent on raw external
  // hits; mint one so every redirect is still individually identifiable.
  //
  // NOTE: `genuine_click` (below) — NOT the presence of click_id — is now the
  // truth of "was this a real on-site click", because we still mint a click_id
  // here for record-keeping even on bare hits. Downstream reports must gate
  // billable clicks on genuine_click / outcome, not on click_id existing.
  const clickId = searchParams.get("click_id") || `smc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  // --- Click binding: is this a genuine on-site click? -------------------
  // The signed token (?t=) is minted by /api/click-token only for a real click
  // on our own pages (AiSourceInjector). A pasted/scraped/AI-cited URL or a bot
  // has no valid token. This is the one certain signal. Tokenless hits now fall
  // back to the UA-based `trafficSource.isBot` only (the bot scorer is gone), so
  // a tokenless human and a tokenless unknown client are treated alike: both get
  // the interstitial and must click Continue.
  const tokenStatus = verifyClickToken(searchParams.get("t"), provider);
  // `?continue=1` is the explicit human confirmation from the interstitial's
  // Continue button — a real click on a real button. Honor it as a redirect
  // ALWAYS, even when the hit was flagged as a bot: otherwise a false-positived real
  // human is trapped on a dead Continue button (infinite loop). The interstitial
  // itself is the gate (a bare fetch that renders nothing never reaches this);
  // once a visitor has actually clicked Continue, we must let them through.
  const continued = searchParams.get("continue") === "1";
  const decision = decideRedirect({ tokenStatus, isBot: trafficSource.isBot });
  // A continued interstitial becomes a real, forwarded redirect. A genuine
  // token is already "redirect". Everything else follows the decision.
  const outcome = continued ? "redirect" : decision.outcome;
  const genuineClick = decision.genuineClick;
  const gated = decision.gated && !continued;

  // Server-side counterpart to the client `provider_clicked` event. Distinct
  // event name so the two sinks measure clean, separate things:
  //   - provider_clicked (client, GA4 + Vercel) = UI button engagement
  //   - provider_clicked_server (server, GA4 only) = the redirect actually ran
  // The gap between the two = adblock + JS-failure rate.
  void serverTrack(
    "provider_clicked_server",
    { provider, corridor, amount: amount ?? 0, source, traffic_source: trafficSource.source, is_bot: trafficSource.isBot, id_source: idSource, click_id: clickId, genuine_click: genuineClick, gated, token_status: tokenStatus, outcome },
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
      click_id: clickId,
      genuine_click: genuineClick,
      gated,
      token_status: tokenStatus,
      outcome,
    },
    clientId,
    geo,
  );

  // --- Route by outcome --------------------------------------------------
  // "interstitial" / "not_forwarded": render an on-site page instead of an
  // instant 302. The provider redirect only fires when the request comes back
  // with ?continue=1 (auto-continue JS for plausible humans; no auto-continue
  // for likely bots). This is what makes our site the last authority: a bare/
  // scraped/bot hit never forwards to the provider on its own.
  if (outcome !== "redirect") {
    const continueUrl = buildContinueUrl(request.url);
    const html = interstitialHtml({
      providerName: providerDisplayName(provider),
      continueUrl,
      corridorLabel: from && to ? `${from.toUpperCase()} → ${to.toUpperCase()}` : undefined,
      receiveCurrency: to?.toUpperCase(),
      crossSell: buildCrossSell({ targetSlug: provider, from, to, amount, src }),
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

/**
 * Build the URL the interstitial's Continue action navigates to: the same
 * request URL with `continue=1` added, so the route re-runs and honors it as a
 * confirmed human redirect. Preserves all existing params (from/to/amount/src/
 * click_id/cid/ai_src) so attribution survives the round-trip. Returns a
 * path+query (same-origin) so it works regardless of host.
 */
function buildContinueUrl(requestUrl: string): string {
  const u = new URL(requestUrl);
  u.searchParams.set("continue", "1");
  return `${u.pathname}${u.search}`;
}
