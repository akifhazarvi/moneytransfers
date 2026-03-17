import { NextResponse } from "next/server";
import { getAffiliateUrl } from "@/lib/affiliate";
import { checkRateLimit } from "@/lib/rate-limit";

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
  const url = getAffiliateUrl(provider);

  return NextResponse.redirect(url, {
    status: 302,
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}
