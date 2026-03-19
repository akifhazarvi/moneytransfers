import { NextResponse } from "next/server";

const INDEXNOW_KEY = "504f73e915dcbe38e02c363c31409cad";
const SITE_URL = "https://sendmoneycompare.com";

/**
 * POST /api/indexnow
 *
 * Pings Bing IndexNow to notify about updated URLs.
 * Call after scraper runs to speed up re-crawling of data-driven pages.
 *
 * Body: { urls?: string[] }
 * If no URLs provided, submits a default set of high-priority pages.
 *
 * Example: curl -X POST https://sendmoneycompare.com/api/indexnow
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.INDEXNOW_SECRET || INDEXNOW_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let urls: string[];
  try {
    const body = await request.json().catch(() => ({}));
    urls = body.urls || getDefaultUrls();
  } catch {
    urls = getDefaultUrls();
  }

  // IndexNow batch limit is 10,000 URLs per request
  const batch = urls.slice(0, 10000);

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "sendmoneycompare.com",
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: batch,
      }),
    });

    return NextResponse.json({
      status: res.status,
      submitted: batch.length,
      message: res.ok ? "URLs submitted to IndexNow" : `IndexNow returned ${res.status}`,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to reach IndexNow API" }, { status: 502 });
  }
}

function getDefaultUrls(): string[] {
  // High-priority pages that change with data updates
  return [
    `${SITE_URL}/`,
    `${SITE_URL}/send-money`,
    `${SITE_URL}/send-money/usa-to-india`,
    `${SITE_URL}/send-money/uk-to-india`,
    `${SITE_URL}/send-money/usa-to-pakistan`,
    `${SITE_URL}/send-money/uk-to-pakistan`,
    `${SITE_URL}/send-money/usa-to-mexico`,
    `${SITE_URL}/send-money/usa-to-philippines`,
    `${SITE_URL}/send-money/usa-to-nigeria`,
    `${SITE_URL}/send-money/uk-to-europe`,
    `${SITE_URL}/send-money/uae-to-india`,
    `${SITE_URL}/send-money/uae-to-pakistan`,
    `${SITE_URL}/send-money/canada-to-india`,
    `${SITE_URL}/send-money/australia-to-india`,
    `${SITE_URL}/exchange-rates`,
    `${SITE_URL}/exchange-rates/usd-to-inr`,
    `${SITE_URL}/exchange-rates/gbp-to-eur`,
    `${SITE_URL}/exchange-rates/usd-to-pkr`,
    `${SITE_URL}/remittance-cost-index`,
    `${SITE_URL}/companies/wise`,
    `${SITE_URL}/companies/remitly`,
    `${SITE_URL}/compare/wise-vs-remitly`,
  ];
}
