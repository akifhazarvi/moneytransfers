import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { tallyPageView } from "@/lib/traffic-tally";
import { classifyTrafficSource } from "@/lib/traffic-source";

/**
 * TrafficTally's beacon: one engaged page view, kept only as a daily total per
 * country (src/lib/traffic-tally.ts). Same-origin only, crawlers dropped, the
 * country is Vercel's (never the client's), 20 per IP a minute.
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
  let landing = false;
  try {
    const text = await request.text();
    if (text.length > 64) return done();
    landing = JSON.parse(text).landing === true;
  } catch { return done(); }
  await tallyPageView(request.headers.get("x-vercel-ip-country"), landing);
  return done();
}
