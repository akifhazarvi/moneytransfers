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
    // Scrape failed — fall back to our own mid-market history rather than the old
    // exchange-rates.json snapshot, which was last written in March and would have
    // served five-month-old FX rates to anyone hitting this route on a bad day.
    // midmarket-history.json is refreshed daily by the scrape workflow, so the
    // worst case here is roughly a day stale instead of a season.
    //
    // It is USD-based, so EUR-based rates are derived as USD_X / USD_EUR to match
    // the success path's shape. usdBasedRates is returned too — the previous
    // fallback omitted it entirely, so any caller depending on it got undefined
    // whenever the scrape was down.
    const fs = await import("fs");
    const path = await import("path");
    try {
      const history = JSON.parse(
        fs.readFileSync(
          path.join(process.cwd(), "src/data/scraped/midmarket-history.json"),
          "utf-8"
        )
      ) as { days: { date: string; rates: Record<string, number> }[] };

      const latest = history.days?.[history.days.length - 1];
      const usdRates = latest?.rates;
      const usdToEur = usdRates?.EUR;
      if (!usdRates || !usdToEur) throw new Error("no usable mid-market history");

      const rates: ExchangeRate[] = Object.entries(usdRates)
        .filter(([code]) => code !== "EUR")
        .map(([code, perUsd]) => ({
          currencyCode: code,
          currencyName: code,
          ratePerEur: perUsd / usdToEur,
        }));
      rates.unshift({ currencyCode: "USD", currencyName: "US dollar", ratePerEur: 1 / usdToEur });

      return NextResponse.json({
        baseCurrency: "EUR",
        rates,
        usdBasedRates: { USD: 1, ...usdRates },
        cached: true,
        dataDate: latest.date,
        source: "sendmoneycompare mid-market history",
      });
    } catch {
      return NextResponse.json(
        { error: "Failed to fetch exchange rates" },
        { status: 500 }
      );
    }
  }
}
