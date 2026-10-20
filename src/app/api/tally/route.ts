import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { EXTENSION_TALLIES, tallyExtension, tallyPageView } from "@/lib/traffic-tally";
import { classifyTrafficSource } from "@/lib/traffic-source";

/**
 * TrafficTally's beacon: one engaged page view, kept only as a daily total per
 * country (src/lib/traffic-tally.ts). Same-origin only, crawlers dropped, the
 * country is Vercel's (never the client's), 20 per IP a minute. Also the
 * browser extension's offer funnel ({ ext, p }), a daily total per surface.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const done = () => new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  if (request.headers.get("origin") !== new URL(request.url).origin) return done();
  if (request.headers.get("sec-fetch-site") !== "same-origin") return done();
  if (classifyTrafficSource(request.headers.get("user-agent"), null).isBot) return done();
  // IP only used for a short-lived, in-memory abuse limit; never sent to the store.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip && !checkRateLimit(`tally:${ip}`).allowed) return done();
  let body: { landing?: unknown; ext?: unknown; p?: unknown };
  try {
    const text = await request.text();
    if (text.length > 96) return done();
    body = JSON.parse(text);
  } catch { return done(); }
  // The browser extension's funnel (src/lib/browser-extension.ts): no country, no id.
  if (typeof body.ext === "string") {
    const kind = EXTENSION_TALLIES.find((k) => k === body.ext);
    if (kind && typeof body.p === "string") await tallyExtension(kind, body.p);
    return done();
  }
  await tallyPageView(request.headers.get("x-vercel-ip-country"), body.landing === true);
  return done();
}
