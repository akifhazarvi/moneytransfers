import { extJson, parseAmount, parseCurrency } from "@/lib/extension-api";
import { API_DOCS_URL, buildPublicQuotes, rateLimitResponse } from "@/lib/public-api";

// Quotes change only when the scrapers run (every 6h) and a deploy bakes them
// in, the same as /api/ext/v1/compare. The CDN serves repeats of one URL.
export const revalidate = 3600;

/**
 * GET /api/v1/quotes?from=USD&to=INR&amount=1000
 *
 * The public Data API: the rows /send-money ranks for a route and amount, as
 * clean JSON (src/lib/public-api.ts). Free, no key, CC BY 4.0.
 */
export function GET(req: Request) {
  const limited = rateLimitResponse(req);
  if (limited) return limited;
  const { searchParams } = new URL(req.url);
  const from = parseCurrency(searchParams.get("from"));
  const to = parseCurrency(searchParams.get("to"));
  const amount = parseAmount(searchParams.get("amount") ?? "1000");
  if (!from || !to || from === to || !amount) {
    return extJson(
      { error: "Give 'from' and 'to' as different three-letter currency codes and 'amount' between 0 and 1,000,000.", docs: API_DOCS_URL },
      60,
      400,
    );
  }
  return extJson(buildPublicQuotes(from, to, amount), 3600);
}
