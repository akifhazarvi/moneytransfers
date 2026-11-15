import { extJson, parseCurrency } from "@/lib/extension-api";
import { API_DOCS_URL, buildPublicHistory, rateLimitResponse } from "@/lib/public-api";

// The history gains one day per published day of rates.
export const revalidate = 3600;

/**
 * GET /api/v1/history?from=USD&to=INR
 *
 * Daily mid-market rates for a currency pair, oldest first — the series behind
 * /exchange-rates history and the midmarket-rates CSV. Free, no key, CC BY 4.0.
 */
export function GET(req: Request) {
  const limited = rateLimitResponse(req);
  if (limited) return limited;
  const { searchParams } = new URL(req.url);
  const from = parseCurrency(searchParams.get("from"));
  const to = parseCurrency(searchParams.get("to"));
  if (!from || !to || from === to) {
    return extJson({ error: "Give 'from' and 'to' as different three-letter currency codes.", docs: API_DOCS_URL }, 60, 400);
  }
  return extJson(buildPublicHistory(from, to), 3600);
}
