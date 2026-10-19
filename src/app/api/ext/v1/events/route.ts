import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { classifyTrafficSource } from "@/lib/traffic-source";
import { forwardExtensionEvents, parseExtensionBatch } from "@/lib/extension-events";

export const dynamic = "force-dynamic";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Max-Age": "86400",
  "Cache-Control": "no-store",
};

const done = () => new NextResponse(null, { status: 204, headers: CORS });

export function OPTIONS() {
  return done();
}

/**
 * POST /api/ext/v1/events
 *
 * Opt-in usage events from the browser extension, forwarded to GA4
 * (src/lib/extension-events.ts). Always answers 204, so a rejected batch looks
 * the same as an accepted one.
 */
export async function POST(request: Request) {
  // Only extension pages and workers post here.
  const origin = request.headers.get("origin") || "";
  if (!/^(chrome-extension|extension):\/\//.test(origin)) return done();
  // Global Privacy Control / Do Not Track override an opt-in, as on the site.
  if (request.headers.get("sec-gpc") === "1" || request.headers.get("dnt") === "1") return done();
  if (classifyTrafficSource(request.headers.get("user-agent") || "", null).isBot) return done();
  if (Number(request.headers.get("content-length")) > 8192) return done();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip && !checkRateLimit(`ext-events:${ip}`).allowed) return done();

  const text = (await request.text()).slice(0, 8192);
  const batch = parseExtensionBatch(text);
  if (!batch) return done();

  await forwardExtensionEvents(batch, {
    country: request.headers.get("x-vercel-ip-country") || undefined,
    region: request.headers.get("x-vercel-ip-country-region") || undefined,
    city: decodeURIComponent(request.headers.get("x-vercel-ip-city") || "") || undefined,
  });
  return done();
}
