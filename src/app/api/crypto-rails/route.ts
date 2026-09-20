import { NextResponse } from "next/server";
import { getCryptoRailSectionData } from "@/lib/crypto-rail-section";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const from = (params.get("from") || "").toUpperCase();
  const to = (params.get("to") || "").toUpperCase();
  const amount = Number(params.get("amount"));
  if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to) ||
      !Number.isFinite(amount) || amount <= 0 || amount > 1_000_000) {
    return NextResponse.json({ error: "Invalid currency or amount" }, { status: 400 });
  }
  return NextResponse.json(getCryptoRailSectionData(from, to, amount), {
    headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" },
  });
}
