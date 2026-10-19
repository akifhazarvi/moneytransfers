import { buildExtensionHistory, extJson, parseCurrency } from "@/lib/extension-api";

export const revalidate = 3600;

/**
 * GET /api/ext/v1/history?from=USD&to=INR
 *
 * A year of daily mid-market rates for the pair (the /exchange-rates history
 * series), plus the corridor's timing score and its usual leader when we hold
 * enough history to state them.
 */
export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = parseCurrency(searchParams.get("from"));
  const to = parseCurrency(searchParams.get("to"));
  if (!from || !to || from === to) {
    return extJson({ error: "Invalid 'from' or 'to'" }, 60, 400);
  }
  return extJson(buildExtensionHistory(from, to), 3600);
}
