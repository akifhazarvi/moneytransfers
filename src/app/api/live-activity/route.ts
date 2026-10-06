import { NextResponse } from "next/server";
import { activityStoreEnabled, recordEvent, recordPresence, visitorId } from "@/lib/activity-store";
import { getLiveActivity } from "@/lib/live-activity";
import { checkRateLimit } from "@/lib/rate-limit";
import { classifyTrafficSource } from "@/lib/traffic-source";
import { currencies, getProviderName, HIDDEN_PROVIDER_SLUGS, providers } from "@/data/providers";
import providerNames from "@/data/provider-names.json";

/**
 * The live activity strip's feed (GET) and its recorder (POST).
 *
 * GET: real reader events, newest first, and the "here now" / "last 6 hours"
 * counts (src/lib/live-activity.ts). Cached at the edge for 15 seconds, so
 * traffic never multiplies store reads.
 *
 * POST: a beacon from src/lib/live-activity-beacon.ts — "seen" (the reader is
 * on the site) or a comparison / choice. Whatever arrives here can appear on
 * every page, so it is checked before it is kept: same-origin only, crawlers
 * dropped, routes must be currencies we list, amounts 1–1,000,000 of the
 * route's currency, providers must be ones we know
 * and do not hide (a choice without one is dropped), the country is Vercel's
 * (never the client's), one event
 * per reader, action and route per 30 minutes, 20 per IP an hour.
 */
export const dynamic = "force-dynamic";

const CURRENCY_CODES = new Set(currencies.map((c) => c.code));
const KNOWN_PROVIDERS = new Set([...providers.map((p) => p.slug), ...Object.keys(providerNames)]);

export async function GET() {
  const activity = await getLiveActivity();
  return NextResponse.json(activity, {
    headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30" },
  });
}

const accepted = () => new NextResponse(null, { status: 204 });

export async function POST(request: Request) {
  if (!activityStoreEnabled) return accepted();
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return accepted();
  const userAgent = request.headers.get("user-agent") || "";
  if (classifyTrafficSource(userAgent, request.headers.get("referer")).isBot) return accepted();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
  if (!ip || !checkRateLimit(`la:${ip}`).allowed) return accepted();

  let body: { t?: unknown; from?: unknown; to?: unknown; amount?: unknown; provider?: unknown };
  try {
    body = JSON.parse((await request.text()).slice(0, 500));
  } catch {
    return accepted();
  }
  const now = Date.now();
  const visitor = visitorId(ip, userAgent, now);

  try {
    if (body.t === "seen") {
      await recordPresence(visitor, now);
    } else if (body.t === "compared" || body.t === "chose") {
      const country = request.headers.get("x-vercel-ip-country") || "";
      if (!/^[A-Z]{2}$/.test(country)) return accepted();
      const from = typeof body.from === "string" && CURRENCY_CODES.has(body.from) ? body.from : undefined;
      const to = typeof body.to === "string" && CURRENCY_CODES.has(body.to) ? body.to : undefined;
      const route = from && to && from !== to ? { from, to } : {};
      const slug = typeof body.provider === "string" ? body.provider : "";
      const provider = body.t === "chose" && KNOWN_PROVIDERS.has(slug) && !HIDDEN_PROVIDER_SLUGS.has(slug) ? getProviderName(slug) : undefined;
      // A comparison names its route; a choice names a provider we know.
      if (body.t === "compared" ? !("from" in route) : !provider) return accepted();
      // An amount only with its currency, and only one a person might send.
      const amount = "from" in route && typeof body.amount === "number" && body.amount >= 1 && body.amount <= 1_000_000
        ? Math.round(body.amount * 100) / 100
        : undefined;
      await recordPresence(visitor, now);
      await recordEvent(
        { at: now, country, kind: body.t, ...route, ...(amount ? { amount } : {}), ...(provider ? { provider, providerSlug: slug } : {}) },
        visitor,
        ip,
      );
    }
  } catch {
    // A beacon never fails the page; a store hiccup loses one event.
  }
  return accepted();
}
