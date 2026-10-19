import { buildExtensionComparison, extJson, parseAmount, parseCurrency } from "@/lib/extension-api";

// Quotes change only when the scrapers run (every 6h) and a deploy bakes them
// in, the same as /api/quotes.
export const revalidate = 3600;

/**
 * GET /api/ext/v1/compare?from=USD&to=INR&amount=1000
 *
 * The browser extension's comparison: every provider row /send-money shows, in
 * its order, with what the extension prints already resolved (names, logos,
 * markups, offers, /go links). See src/lib/extension-api.ts.
 */
export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = parseCurrency(searchParams.get("from"));
  const to = parseCurrency(searchParams.get("to"));
  const amount = parseAmount(searchParams.get("amount"));
  if (!from || !to || from === to || !amount) {
    return extJson({ error: "Invalid 'from', 'to' or 'amount'" }, 60, 400);
  }
  return extJson(buildExtensionComparison(from, to, amount), 3600);
}
