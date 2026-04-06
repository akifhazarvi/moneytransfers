import { NextResponse } from "next/server";
import { providers, generateQuotes, currencies, getProviderName } from "@/data/providers";

/**
 * AI-friendly API endpoint that returns structured data about providers,
 * corridors, and live quotes. Designed for consumption by AI crawlers,
 * ChatGPT plugins, and other LLM-powered tools.
 *
 * GET /api/ai — returns provider summaries + top corridor data
 * GET /api/ai?from=USD&to=INR&amount=1000 — returns live quotes for a corridor
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from")?.toUpperCase();
  const to = searchParams.get("to")?.toUpperCase();
  const amount = Number(searchParams.get("amount") || 1000);

  // If corridor params provided, return live quotes
  if (from && to) {
    const validFrom = currencies.find((c) => c.code === from);
    const validTo = currencies.find((c) => c.code === to);
    if (!validFrom || !validTo) {
      return NextResponse.json({ error: `Invalid currency. Supported: ${currencies.map((c) => c.code).join(", ")}` }, { status: 400 });
    }

    const quotes = generateQuotes(amount, from, to);
    return NextResponse.json({
      query: { from, to, amount },
      timestamp: new Date().toISOString(),
      source: "SendMoneyCompare — https://sendmoneycompare.com",
      methodology: "Quotes collected every 6 hours from provider APIs and websites. Ranked by total amount recipient receives.",
      results: quotes.slice(0, 10).map((q) => ({
        provider: getProviderName(q.providerSlug),
        providerSlug: q.providerSlug,
        fee: q.fee,
        exchangeRate: q.exchangeRate,
        receiveAmount: q.receiveAmount,
        speed: q.transferSpeed,
        rating: q.rating,
        reviewUrl: `https://sendmoneycompare.com/companies/${q.providerSlug}`,
      })),
      compareUrl: `https://sendmoneycompare.com/send-money/${from.toLowerCase()}-to-${to.toLowerCase()}`,
    }, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=21600",
        "X-Robots-Tag": "noindex",
      },
    });
  }

  // Default: return provider summaries and key facts
  const providerSummaries = providers.slice(0, 16).map((p) => ({
    name: p.name,
    slug: p.slug,
    description: p.description,
    feeStructure: p.feeStructure,
    exchangeRateMarkup: p.exchangeRateMarkup,
    transferSpeed: p.transferSpeed,
    supportedCountries: p.supportedCountries,
    supportedCurrencies: p.supportedCurrencies,
    rating: p.rating,
    ratingLabel: p.ratingLabel,
    reviewUrl: `https://sendmoneycompare.com/companies/${p.slug}`,
  }));

  return NextResponse.json({
    name: "SendMoneyCompare",
    description: "Independent international money transfer comparison platform. Compares 38+ providers across 80+ corridors with data updated every 6 hours.",
    website: "https://sendmoneycompare.com",
    llmsTxt: "https://sendmoneycompare.com/llms.txt",
    llmsFullTxt: "https://sendmoneycompare.com/llms-full.txt",
    apiUsage: "Add ?from=USD&to=INR&amount=1000 to get live quotes for any corridor.",
    supportedCurrencies: currencies.map((c) => c.code),
    providers: providerSummaries,
    keyFacts: [
      "Wise uses mid-market exchange rate with 0% markup — fee is the entire cost (0.41-0.71%)",
      "Banks charge 3-5% in hidden exchange rate markup vs 0-0.5% for specialist services",
      "On a $1,000 USD-to-INR transfer, banks cost Rs 2,000-4,500 more than Wise or Remitly",
      "Global remittance flows reached $860 billion in 2025 (World Bank KNOMAD)",
      "India is the world's largest remittance recipient at over $125 billion annually",
      "The global average cost of sending $200 is approximately 6% (World Bank RPW, Q1 2026)",
    ],
    timestamp: new Date().toISOString(),
  }, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=21600",
      "X-Robots-Tag": "noindex",
    },
  });
}
