import type { Metadata } from "next";
import Container from "@/components/Container";
import CurrencyConverterClient from "@/components/CurrencyConverterClient";
import { currencies, exchangeRates } from "@/data/providers";
import { getRate } from "@/lib/rates-util";

export const metadata: Metadata = {
  title: "Currency Converter — Live Exchange Rates for 150+ Currencies | SendMoneyCompare",
  description:
    "Convert between 150+ currencies with live mid-market exchange rates updated every 60 seconds. Compare USD, EUR, GBP, INR, and more with our free currency converter.",
  alternates: { canonical: "https://sendmoneycompare.com/currency-converter" },
  openGraph: {
    title: "Currency Converter — Live Exchange Rates for 150+ Currencies",
    description:
      "Convert between 150+ currencies with live mid-market exchange rates. Free, fast, and accurate currency converter.",
    url: "https://sendmoneycompare.com/currency-converter",
  },
};

const popularPairs = [
  { from: "USD", to: "EUR" },
  { from: "USD", to: "GBP" },
  { from: "USD", to: "INR" },
  { from: "GBP", to: "EUR" },
  { from: "EUR", to: "GBP" },
  { from: "USD", to: "JPY" },
  { from: "USD", to: "CAD" },
  { from: "USD", to: "AUD" },
];

export default function CurrencyConverterPage() {
  // Pre-compute static rates for SEO
  const defaultRate = getRate(exchangeRates, "USD", "EUR");

  return (
    <>
      {/* Server-rendered SEO heading */}
      <Container className="py-8">
        <h1 className="text-[28px] md:text-[36px] font-normal text-[var(--color-on-surface)] mb-2">Currency Converter</h1>
        <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-8">
          Convert between 150+ currencies with live exchange rates, updated every 60 seconds.
        </p>
      </Container>

      {/* Interactive client widget */}
      <CurrencyConverterClient />

      {/* Server-rendered SEO content — visible to crawlers */}
      <Container>
        <div className="sr-only">
          <h2>Live exchange rates</h2>
          <p>1 USD = {defaultRate.toFixed(4)} EUR (mid-market rate)</p>

          <h2>Popular currency pairs</h2>
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Exchange Rate</th>
              </tr>
            </thead>
            <tbody>
              {popularPairs.map((pair) => {
                const pairRate = getRate(exchangeRates, pair.from, pair.to);
                return (
                  <tr key={`${pair.from}-${pair.to}`}>
                    <td>{pair.from}</td>
                    <td>{pair.to}</td>
                    <td>1 {pair.from} = {pairRate.toFixed(4)} {pair.to}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h2>All exchange rates vs USD</h2>
          <table>
            <thead>
              <tr>
                <th>Currency</th>
                <th>Code</th>
                <th>Rate (1 USD =)</th>
              </tr>
            </thead>
            <tbody>
              {currencies.filter((c) => c.code !== "USD").map((c) => (
                <tr key={c.code}>
                  <td>{c.name}</td>
                  <td>{c.code}</td>
                  <td>{c.symbol}{(exchangeRates[c.code] ?? 0).toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>How currency conversion works</h2>
          <p>
            Our currency converter uses the mid-market exchange rate — the midpoint between buy and sell rates
            on the global currency markets. This is the fairest rate available and is the rate banks use when
            trading between themselves. When you send money internationally, providers typically add a markup
            to this rate, which is how they make money on currency conversion.
          </p>

          <h2>About our exchange rates</h2>
          <p>
            Exchange rates are sourced from leading financial data providers and updated every 60 seconds during
            market hours. Rates shown are mid-market rates and may differ from the rates offered by individual
            money transfer providers. Always check the exact rate and total cost with your chosen provider before
            making a transfer.
          </p>
        </div>
      </Container>
    </>
  );
}
