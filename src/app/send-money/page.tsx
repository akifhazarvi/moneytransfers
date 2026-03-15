import type { Metadata } from "next";
import Container from "@/components/Container";
import SendMoneyClient from "@/components/SendMoneyClient";
import CircleFlag from "@/components/CircleFlag";
import { generateQuotes, providers, currencies, getProviderName } from "@/data/providers";

export const metadata: Metadata = {
  title: "Compare Money Transfer Services — Best Rates & Lowest Fees | SendMoneyCompare",
  description:
    "Compare 14+ money transfer providers side by side. Find the best exchange rates, lowest fees, and fastest delivery for sending money abroad. Updated daily with live rates from Wise, Remitly, OFX, Western Union, and more.",
  alternates: { canonical: "https://sendmoneycompare.com/send-money" },
  openGraph: {
    title: "Compare Money Transfer Services — Best Rates & Lowest Fees",
    description:
      "Compare 14+ money transfer providers side by side. Find the best exchange rates, lowest fees, and fastest delivery for sending money abroad.",
    url: "https://sendmoneycompare.com/send-money",
  },
};

export default function SendMoneyPage() {
  // Generate default quotes server-side so Google can see them
  const defaultQuotes = generateQuotes(1000, "USD", "INR");
  const usdInfo = currencies.find((c) => c.code === "USD")!;
  const inrInfo = currencies.find((c) => c.code === "INR")!;

  return (
    <div className="bg-[var(--color-surface-dim)] min-h-screen pt-2">
      {/* Server-rendered SEO content — visible to crawlers */}
      <Container>
        <h1 className="text-[28px] md:text-[36px] font-normal text-[var(--color-on-surface)] pt-6 mb-2">
          Compare Money Transfer Services
        </h1>
        <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6 max-w-2xl">
          Find the cheapest way to send money abroad. We compare exchange rates, fees, and transfer speeds
          from {providers.length}+ providers including Wise, Remitly, OFX, Revolut, and Western Union — updated daily with live rates.
        </p>
      </Container>

      {/* Interactive client widget — replaces static table once JS loads */}
      <SendMoneyClient />

      {/* Server-rendered default quotes table — always in the HTML for SEO */}
      <Container>
        <noscript>
          <div className="mb-12">
            <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
              Top providers for <CircleFlag code="USD" size={20} className="mx-0.5" /> USD to <CircleFlag code="INR" size={20} className="mx-0.5" /> INR
            </h2>
            <p className="text-[13px] text-[var(--color-on-surface-variant)] mb-4">
              Showing rates for a $1,000 USD transfer to Indian Rupees. Enable JavaScript for live rates and interactive comparison.
            </p>
            <table className="w-full bg-[var(--color-surface)] rounded-xl border border-[var(--color-outline)] overflow-hidden text-[14px]">
              <thead>
                <tr className="bg-[var(--color-surface-dim)] border-b border-[var(--color-outline)]">
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-on-surface)]">Provider</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--color-on-surface)]">You Receive</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--color-on-surface)]">Fee</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--color-on-surface)]">Rate</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--color-on-surface)]">Speed</th>
                </tr>
              </thead>
              <tbody>
                {defaultQuotes.slice(0, 10).map((q) => (
                  <tr key={q.providerSlug} className="border-b border-[var(--color-outline)] last:border-b-0">
                    <td className="px-4 py-3 font-medium text-[var(--color-on-surface)]">{getProviderName(q.providerSlug)}</td>
                    <td className="px-4 py-3 text-right text-[var(--color-primary)] font-medium">{inrInfo.symbol}{q.receiveAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right text-[var(--color-on-surface-variant)]">{q.fee === 0 ? "Free" : `$${q.fee.toFixed(2)}`}</td>
                    <td className="px-4 py-3 text-right font-mono text-[var(--color-on-surface)]">{q.exchangeRate.toFixed(4)}</td>
                    <td className="px-4 py-3 text-right text-[var(--color-on-surface-variant)]">{q.transferSpeed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </noscript>

        {/* Hidden SSR content for crawlers — rendered server-side, hidden visually once JS activates */}
        <div className="sr-only">
          <h2>Best money transfer providers for USD to INR — $1,000 comparison</h2>
          <table>
            <thead>
              <tr>
                <th>Provider</th>
                <th>You Receive (INR)</th>
                <th>Transfer Fee</th>
                <th>Exchange Rate</th>
                <th>Transfer Speed</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {defaultQuotes.map((q) => (
                <tr key={q.providerSlug}>
                  <td>{getProviderName(q.providerSlug)}</td>
                  <td>{inrInfo.symbol}{q.receiveAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  <td>{q.fee === 0 ? "Free" : `$${q.fee.toFixed(2)}`}</td>
                  <td>1 USD = {q.exchangeRate.toFixed(4)} INR</td>
                  <td>{q.transferSpeed}</td>
                  <td>{q.rating}/5 — {q.ratingLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>How to compare money transfer services</h2>
          <p>
            When comparing international money transfer services, consider the total cost of your transfer — not just the fee.
            Exchange rate markups can cost more than the advertised fee. The best provider depends on your corridor (the countries
            you are sending between), transfer amount, speed requirements, and preferred payment method.
          </p>
          <h3>What we compare</h3>
          <ul>
            <li>Exchange rates — how close each provider is to the mid-market rate</li>
            <li>Transfer fees — fixed fees and percentage-based charges</li>
            <li>Transfer speed — from instant to 3-5 business days</li>
            <li>Payment methods — bank transfer, debit card, credit card, Apple Pay</li>
            <li>Delivery methods — bank deposit, cash pickup, mobile money</li>
            <li>Trustpilot ratings and regulatory status</li>
          </ul>

          <h2>Providers we compare</h2>
          <ul>
            {providers.map((p) => (
              <li key={p.slug}>
                {p.name} — {p.description} Rating: {p.rating}/5 ({p.ratingLabel}). Founded {p.founded}, headquartered in {p.headquarters}.
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}
