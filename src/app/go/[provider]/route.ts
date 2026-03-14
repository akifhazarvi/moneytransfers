import { NextResponse } from "next/server";
import { getAffiliateUrl } from "@/lib/affiliate";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const url = getAffiliateUrl(provider);

  // In production, log this click to analytics
  // e.g. await logAffiliateClick(provider, request.headers)

  return NextResponse.redirect(url, { status: 302 });
}
