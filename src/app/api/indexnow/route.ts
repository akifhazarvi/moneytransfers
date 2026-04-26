import { NextResponse } from "next/server";
import { submitUrls } from "@/lib/indexnow";
import { allCorridors } from "@/data/corridors";

/**
 * POST /api/indexnow — push URLs to IndexNow.
 *
 * Auth: requires Authorization: Bearer ${INDEXNOW_AUTH_TOKEN}.
 * Used by:
 *   - Vercel Deploy Hook (post-deploy notification — submits all canonical URLs)
 *   - GitHub Actions scrape workflow (post-scrape — submits corridor pages
 *     whose data changed in the last 6h)
 *   - Manual triggers when shipping a single new editorial page.
 *
 * Body: { urls?: string[] }
 *   When provided, only those URLs are submitted.
 *   When omitted, submits the canonical set: homepage + all indexed corridors
 *   (uses the Tier 1 editorial set so we don't waste pings on noindex pages).
 */
export const maxDuration = 60; // Allow up to 60s — sequential submission is slow

const SITE = "https://sendmoneycompare.com";

export async function POST(request: Request) {
  const auth = request.headers.get("authorization") || "";
  const expected = process.env.INDEXNOW_AUTH_TOKEN;
  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let urls: string[] = [];
  try {
    const body = (await request.json().catch(() => ({}))) as { urls?: string[] };
    if (Array.isArray(body.urls) && body.urls.length > 0) {
      urls = body.urls.filter((u) => typeof u === "string" && u.startsWith("https://"));
    }
  } catch {
    // Empty body is fine — fall through to canonical set.
  }

  if (urls.length === 0) {
    // Canonical set: homepage, top hubs, and all editorial corridors.
    // We deliberately do NOT submit auto-generated noindex pages.
    urls = [
      `${SITE}/`,
      `${SITE}/send-money`,
      `${SITE}/companies`,
      `${SITE}/compare`,
      `${SITE}/compare-money-transfer`,
      `${SITE}/currency-converter`,
      `${SITE}/guides`,
      `${SITE}/iban`,
      `${SITE}/swift-codes`,
      `${SITE}/exchange-rates`,
      `${SITE}/remittance-cost-index`,
      ...allCorridors.map((c) => `${SITE}/send-money/${c.slug}`),
    ];
  }

  const result = await submitUrls(urls, { delayMs: 250 });

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    ...result,
  });
}

/** GET /api/indexnow — health probe (no auth, returns config but never the key). */
export async function GET() {
  return NextResponse.json({
    ok: true,
    keyConfigured: Boolean(process.env.INDEXNOW_KEY),
    authConfigured: Boolean(process.env.INDEXNOW_AUTH_TOKEN),
    keyLocation: `https://sendmoneycompare.com/${process.env.INDEXNOW_KEY || "504f73e915dcbe38e02c363c31409cad"}.txt`,
  });
}
