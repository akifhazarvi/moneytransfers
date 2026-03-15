import { NextResponse } from "next/server";
import { getAffiliateUrl } from "@/lib/affiliate";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const url = getAffiliateUrl(provider);

  const referer = request.headers.get("referer") || "";
  const ua = request.headers.get("user-agent") || "";
  console.log(
    JSON.stringify({
      event: "affiliate_click",
      provider,
      destination: url,
      referer,
      userAgent: ua,
      timestamp: new Date().toISOString(),
    })
  );

  return NextResponse.redirect(url, { status: 302 });
}
