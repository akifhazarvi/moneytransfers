import { NextRequest, NextResponse } from "next/server";
import { currencies } from "@/data/transfer-currencies";

// Map country names → default currency code
const COUNTRY_CURRENCY: Record<string, string> = {
  india: "INR", pakistan: "PKR", bangladesh: "BDT", nepal: "NPR",
  "sri lanka": "LKR", philippines: "PHP", vietnam: "VND", indonesia: "IDR",
  thailand: "THB", malaysia: "MYR", china: "CNY", japan: "JPY",
  taiwan: "TWD", mexico: "MXN", brazil: "BRL", colombia: "COP",
  peru: "PEN", guatemala: "GTQ", "dominican republic": "DOP", jamaica: "JMD",
  nigeria: "NGN", kenya: "KES", ghana: "GHS", "south africa": "ZAR",
  egypt: "EGP", morocco: "MAD", ethiopia: "ETB", uganda: "UGX",
  tanzania: "TZS", senegal: "XOF", rwanda: "RWF", zambia: "ZMW",
  cameroon: "XAF", europe: "EUR", germany: "EUR", france: "EUR",
  spain: "EUR", turkey: "TRY", poland: "PLN", romania: "RON",
  "czech republic": "CZK", hungary: "HUF", israel: "ILS",
  uae: "AED", "united arab emirates": "AED", uk: "GBP",
  "united kingdom": "GBP", england: "GBP", australia: "AUD",
  canada: "CAD", "new zealand": "NZD", fiji: "FJD",
  usa: "USD", "united states": "USD", america: "USD",
};

// Currency name → code lookup (lowercase)
const NAME_TO_CODE: Record<string, string> = {};
for (const c of currencies) {
  NAME_TO_CODE[c.name.toLowerCase()] = c.code;
  // Also index partial names: "dollar" won't match but "us dollar" will
  NAME_TO_CODE[c.code.toLowerCase()] = c.code;
}

function parseCurrency(token: string): string | null {
  const t = token.toLowerCase().trim();
  // Exact currency code (3 letters)
  if (/^[a-z]{3}$/.test(t)) {
    const match = currencies.find((c) => c.code.toLowerCase() === t);
    if (match) return match.code;
  }
  // Currency name
  if (NAME_TO_CODE[t]) return NAME_TO_CODE[t];
  // Country name
  if (COUNTRY_CURRENCY[t]) return COUNTRY_CURRENCY[t];
  return null;
}

/**
 * Parse freetext search queries into from/to/amount parameters.
 *
 * Supported patterns:
 *   "USD to INR"
 *   "1000 USD to INR"
 *   "dollars to euros"
 *   "send money to India"
 *   "send 500 to Mexico"
 *   "India"
 */
function parseQuery(q: string): { from?: string; to?: string; amount?: number } {
  const cleaned = q.trim().toLowerCase();

  // Extract amount if present (e.g., "1000", "$1,000", "500.50")
  let amount: number | undefined;
  const amountMatch = cleaned.match(/[\$£€]?\s*([\d,]+(?:\.\d+)?)/);
  if (amountMatch) {
    const parsed = parseFloat(amountMatch[1].replace(/,/g, ""));
    if (parsed > 0 && parsed <= 1_000_000) amount = parsed;
  }

  // Remove amount, currency symbols, and filler words for token parsing
  const stripped = cleaned
    .replace(/[\$£€]/g, "")
    .replace(/[\d,]+(?:\.\d+)?/g, "")
    .replace(/\b(send|money|transfer|convert|from|compare|rates?|how\s+much|is|the)\b/g, "")
    .trim();

  // Pattern: "X to Y" or just "to Y"
  const toPattern = stripped.match(/^(.+?)\s+to\s+(.+)/) || stripped.match(/^to\s+(.+)/);
  if (toPattern) {
    // If 2 groups: "X to Y". If 1 group: "to Y" (destination only).
    const hasFrom = toPattern.length === 3;
    const from = hasFrom ? parseCurrency(toPattern[1].trim()) : null;
    const to = parseCurrency(toPattern[hasFrom ? 2 : 1].trim());
    if (from || to) {
      return { from: from || undefined, to: to || undefined, amount };
    }
  }

  // Pattern: "X vs Y" or "X and Y"
  const vsPattern = stripped.match(/(.+?)\s+(?:vs\.?|and|&)\s+(.+)/);
  if (vsPattern) {
    const from = parseCurrency(vsPattern[1].trim());
    const to = parseCurrency(vsPattern[2].trim());
    return { from: from || undefined, to: to || undefined, amount };
  }

  // Single token — treat as destination
  const single = parseCurrency(stripped);
  if (single) {
    return { to: single, amount };
  }

  return { amount };
}

export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.redirect(new URL("/send-money", request.url));
  }

  const { from, to, amount } = parseQuery(q);

  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (amount) params.set("amount", String(amount));

  const query = params.toString();
  const destination = `/send-money${query ? `?${query}` : ""}`;

  return NextResponse.redirect(new URL(destination, request.url));
}
