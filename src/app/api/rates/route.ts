import { NextResponse } from "next/server";
import { fetchExchangeRates } from "@/lib/exchange-rates";

export async function GET() {
  const rates = await fetchExchangeRates();
  return NextResponse.json({
    rates,
    timestamp: Date.now(),
  });
}
