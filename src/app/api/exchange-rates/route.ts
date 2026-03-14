import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const revalidate = 3600; // revalidate every hour

interface ExchangeRate {
  currencyCode: string;
  currencyName: string;
  ratePerEur: number;
}

async function scrapeRates(): Promise<ExchangeRate[]> {
  const res = await fetch("https://www.iban.com/exchange-rates", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      Accept: "text/html",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch exchange rates: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const rates: ExchangeRate[] = [];

  $("table tbody tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length >= 3) {
      const code = $(cells[0]).text().trim();
      const name = $(cells[1]).text().trim();
      const rate = parseFloat($(cells[2]).text().trim());
      if (code && !isNaN(rate)) {
        rates.push({ currencyCode: code, currencyName: name, ratePerEur: rate });
      }
    }
  });

  return rates;
}

export async function GET() {
  try {
    const rates = await scrapeRates();

    // Convert EUR-based rates to USD-based for compatibility with existing app
    const eurToUsd = rates.find((r) => r.currencyCode === "USD")?.ratePerEur;
    const usdBasedRates: Record<string, number> = { USD: 1 };

    if (eurToUsd) {
      for (const rate of rates) {
        if (rate.currencyCode !== "USD") {
          usdBasedRates[rate.currencyCode] = rate.ratePerEur / eurToUsd;
        }
      }
    }

    return NextResponse.json({
      baseCurrency: "EUR",
      rates,
      usdBasedRates,
      scrapedAt: new Date().toISOString(),
      source: "https://www.iban.com/exchange-rates",
    });
  } catch (error) {
    // Fallback to cached file if scraping fails
    const fs = await import("fs");
    const path = await import("path");
    try {
      const cached = JSON.parse(
        fs.readFileSync(
          path.join(process.cwd(), "src/data/scraped/exchange-rates.json"),
          "utf-8"
        )
      );
      return NextResponse.json({
        baseCurrency: "EUR",
        rates: cached,
        cached: true,
        source: "https://www.iban.com/exchange-rates",
      });
    } catch {
      return NextResponse.json(
        { error: "Failed to fetch exchange rates" },
        { status: 500 }
      );
    }
  }
}
