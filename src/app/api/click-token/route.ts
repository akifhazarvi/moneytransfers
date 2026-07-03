import { NextResponse } from "next/server";
import { mintClickToken } from "@/lib/click-token";
import { isValidProviderSlug } from "@/lib/affiliate";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * Mints a short-lived signed click-token for a genuine on-site click.
 *
 * Called by AiSourceInjector at the moment a user clicks a /go or /out link
 * (see src/components/AiSourceInjector.tsx). Minting at click time — rather than
 * embedding a token in the server-rendered page — means the TTL starts when the
 * human actually clicks, so a token can't be harvested from a cached/scraped
 * page and replayed later. Only our own origin can call this and get a valid
 * token (the redirect route verifies the HMAC signature).
 *
 * Returns { token: "" } when CLICK_TOKEN_SECRET is unprovisioned (fail-open) —
 * the caller still proceeds; the click just isn't tokenized yet.
 *
 * GET (not POST) so the injector can fire it with a keepalive fetch without a
 * preflight; no body, no state mutation, provider is the only input.
 */
export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  const provider = new URL(request.url).searchParams.get("provider") || "";
  if (!isValidProviderSlug(provider)) {
    return NextResponse.json({ token: "" }, { status: 400 });
  }

  const token = mintClickToken(provider);

  // no-store: a token is single-use-ish and short-lived; it must never be
  // cached by a CDN/browser and handed to a different click.
  return NextResponse.json(
    { token },
    { headers: { "Cache-Control": "no-store" } },
  );
}
