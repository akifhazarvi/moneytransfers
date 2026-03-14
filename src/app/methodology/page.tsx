import Container from "@/components/Container";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology — How We Collect Data & Rank Providers",
  description:
    "A detailed explanation of how MoneyTransfers collects exchange rate data, calculates total transfer costs, and ranks providers in our comparison tables.",
  alternates: { canonical: "/methodology" },
};

export default function MethodologyPage() {
  return (
    <>
      <section className="bg-white pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-[32px] md:text-[44px] font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              Methodology
            </h1>
            <p className="text-[15px] md:text-[16px] text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">
              How we collect data, calculate costs, and rank providers — in full
              detail.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            {/* Data Collection */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Data collection
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  We collect exchange rate and fee data from 60+ money transfer
                  providers every 6 hours using a combination of:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Provider APIs:</strong> Where available, we use
                    official APIs to pull live exchange rates and fee schedules
                    programmatically. This is the most reliable and
                    up-to-date source.
                  </li>
                  <li>
                    <strong>Website scraping:</strong> For providers without
                    public APIs, we use automated tools to extract quote data
                    from their pricing pages and transfer calculators. We
                    simulate real transfer requests to capture the rates a
                    customer would actually see.
                  </li>
                  <li>
                    <strong>Mid-market rate baseline:</strong> We source the
                    mid-market exchange rate (the midpoint between buy and sell
                    rates on global currency markets) from established financial
                    data feeds. This serves as our benchmark for calculating
                    each provider&apos;s markup.
                  </li>
                </ul>
                <p>
                  Every data point includes a timestamp so you can see exactly
                  when it was last updated. If a provider&apos;s data is stale
                  or unavailable, we flag it clearly rather than showing
                  potentially outdated figures.
                </p>
              </div>
            </div>

            {/* Cost Calculation */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                How we calculate total cost
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  The cost of an international transfer has two components, and
                  looking at either one in isolation is misleading:
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 my-4">
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                  <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-2">
                    1. Transfer fee
                  </h3>
                  <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">
                    The flat or percentage-based fee a provider charges to
                    process your transfer. This is usually stated upfront —
                    e.g., &quot;$2.99 fee&quot; or &quot;1% of send amount.&quot;
                  </p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                  <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-2">
                    2. Exchange rate markup
                  </h3>
                  <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">
                    The difference between the provider&apos;s exchange rate and
                    the mid-market rate. This is often the larger cost, but many
                    providers don&apos;t disclose it explicitly.
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>Our formula for ranking is straightforward:</p>
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5 font-mono text-[13px] text-[var(--color-on-surface)]">
                  <p>Receive amount = (Send amount − Transfer fee) × Provider exchange rate</p>
                  <p className="mt-2 text-[var(--color-on-surface-variant)]">
                    The provider that produces the highest receive amount ranks #1.
                  </p>
                </div>
                <p>
                  This approach captures the full cost of the transfer in a
                  single, comparable number. A provider with &quot;zero fees&quot;
                  but a poor exchange rate will correctly rank below a provider
                  that charges a small fee but uses the mid-market rate.
                </p>
              </div>
            </div>

            {/* Ranking Logic */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                How providers are ranked
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  In our comparison tables, providers are ranked by{" "}
                  <strong>receive amount</strong> — the total amount your
                  recipient gets in the destination currency after all fees and
                  exchange rate markups.
                </p>
                <p>This ranking is:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Corridor-specific:</strong> A provider that&apos;s
                    cheapest for USD → INR may not be cheapest for GBP → EUR.
                    Rankings change based on the currencies involved.
                  </li>
                  <li>
                    <strong>Amount-specific:</strong> Some providers offer
                    better rates for larger transfers. Rankings can shift based
                    on the send amount.
                  </li>
                  <li>
                    <strong>Time-specific:</strong> Exchange rates fluctuate
                    throughout the day. Our data refreshes every 6 hours to
                    keep rankings current.
                  </li>
                  <li>
                    <strong>Not influenced by affiliate status:</strong>{" "}
                    Whether or not a provider has a commercial relationship
                    with us has zero effect on its ranking position.
                  </li>
                </ul>
              </div>
            </div>

            {/* Comparison Articles */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                How comparisons are made
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Our side-by-side comparison articles (e.g., &quot;Wise vs
                  Remitly&quot;) evaluate two providers across multiple
                  dimensions:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Cost comparison:</strong> We run the same transfer
                    amount through both providers across multiple corridors and
                    compare receive amounts.
                  </li>
                  <li>
                    <strong>Feature comparison:</strong> We compare supported
                    countries, delivery methods, transfer speed, payment
                    options, and app experience.
                  </li>
                  <li>
                    <strong>Regulation:</strong> We verify and compare the
                    regulatory status of both providers.
                  </li>
                  <li>
                    <strong>Best-for verdict:</strong> Rather than declaring a
                    single winner, we identify which provider is better for
                    specific use cases (e.g., &quot;better for small transfers,&quot;
                    &quot;better for cash pickup,&quot; &quot;better for business
                    payments&quot;).
                  </li>
                </ul>
              </div>
            </div>

            {/* Limitations */}
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Limitations
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  We aim for accuracy, but we want to be transparent about the
                  inherent limitations of our data:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Exchange rates change continuously. Our 6-hour refresh cycle
                    means there may be brief windows where the live rate on a
                    provider&apos;s site differs from what we show.
                  </li>
                  <li>
                    Some providers offer promotional rates, first-transfer
                    discounts, or volume-based pricing that may not be reflected
                    in our standard data collection.
                  </li>
                  <li>
                    Delivery times are estimates provided by providers and may
                    vary based on compliance checks, weekends, holidays, and
                    payment methods.
                  </li>
                  <li>
                    We cannot cover every provider in every country. If a
                    provider is missing from our comparison, it may be because
                    we have not yet added it to our data pipeline.
                  </li>
                </ul>
                <p>
                  If you notice a discrepancy between our data and a
                  provider&apos;s current pricing, please{" "}
                  <Link
                    href="/contact"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    let us know
                  </Link>{" "}
                  so we can investigate and correct it.
                </p>
              </div>
            </div>

            <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
              <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <strong className="text-[var(--color-on-surface)]">
                  Related:
                </strong>{" "}
                <Link
                  href="/how-we-review"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  How We Review Providers
                </Link>{" "}
                — our scoring criteria and rating scale.{" "}
                <Link
                  href="/editorial-policy"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Editorial Policy
                </Link>{" "}
                — how we maintain independence.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
