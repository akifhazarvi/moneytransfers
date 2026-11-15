import type { Metadata } from "next";
import Link from "@/components/EligibleLink";
import Container from "@/components/Container";
import ApiPlayground from "@/components/ApiPlayground";
import ApiWaitlistForm from "@/components/ApiWaitlistForm";
import { PageByline } from "@/components/PageByline";
import { API_PLANS, API_USE_CASES } from "@/data/api-plans";
import { currencies, sendCurrencies } from "@/data/providers";
import { EDITORIAL_AUTHOR_SLUG, pageUpdated } from "@/lib/content-dates";
import { DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import { setLinkSource } from "@/lib/link-eligibility";
import { API_LICENCE, API_REQUESTS_PER_MINUTE, buildPublicQuotes } from "@/lib/public-api";
import { robotsFor } from "@/lib/seo-indexing";
import { seoDescription } from "@/lib/seo-title";
import { COVERAGE } from "@/lib/site-stats";

const SITE_URL = "https://sendmoneycompare.com";
const PATH = "/developers";
const DESCRIPTION = `Money transfer quotes and mid-market rate history as clean JSON: ${COVERAGE.providers} across ${COVERAGE.corridors}. Free endpoints today; paid plans on a waitlist.`;

export const metadata: Metadata = {
  title: "Money Transfer Data API: Quotes and Rate History",
  description: seoDescription(DESCRIPTION),
  alternates: { canonical: `${SITE_URL}${PATH}` },
  // Bing-only from launch (rule 3 as amended 2026-11-11); Google only through a
  // release batch (rule 17). See BING_NEW_PAGES in search-engine-routes.ts.
  robots: robotsFor(PATH),
  openGraph: {
    title: "SendMoneyCompare Data API",
    description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    type: "website",
    images: DEFAULT_OG_IMAGES,
  },
};

const DATASETS = [
  { name: "Remittance Cost Index", csv: "/data/remittance-cost-index.csv" },
  { name: "Bank vs app transfer cost", csv: "/data/bank-vs-app-cost.csv" },
  { name: "Transfer cost by amount", csv: "/data/transfer-cost-by-amount.csv" },
  { name: "Provider Consistency Index", csv: "/data/provider-consistency.csv" },
  { name: "SendScore by corridor", csv: "/data/sendscore.csv" },
  { name: "Delivery speed, promised vs paid out", csv: "/data/delivery-speed.csv" },
  { name: "Day-of-week markup", csv: "/data/weekend-markup.csv" },
  { name: "Business FX cost", csv: "/data/business-fx-cost.csv" },
  { name: "Reader savings", csv: "/data/reader-savings.csv" },
  { name: "Daily mid-market rates", csv: "/data/midmarket-rates.csv" },
];

const CLEAN_STEPS = [
  "A provider's own API or calculator outranks comparison feeds: a feed's row is used only when the provider's own is missing or more than a day older.",
  "Rows more than 72 hours behind the newest are set aside as stale, and rows that cannot be true (better than the interbank rate, impossible fees) are quarantined.",
  "Every row is restated to one convention: what the recipient gets for a total outlay of the amount you ask for, fee included.",
  "Promotional first-transfer rates are kept apart from the standard rate, in their own field.",
  "Markups are measured against the mid-market rate we price with, and speed is null when a provider publishes none: we never fill in a delivery time.",
];

const FAQ = [
  {
    q: "Is the Data API free?",
    a: `The two v1 endpoints and the CSV datasets are free, with no key and no signup, under ${API_LICENCE.name}: use them commercially or not, as long as you credit SendMoneyCompare with a link. The paid plans add API keys, higher volume, longer history, bulk exports and support.`,
  },
  {
    q: "How fresh is the data?",
    a: "Quotes are collected every 6 hours and published to the site and the API at most once a day. Each response says when its quotes were collected (collectedAt) and which mid-market rate it used (midMarket.asOf), so you never have to guess.",
  },
  {
    q: "Where do the quotes come from?",
    a: "From providers' own APIs and calculators first, then from comparison feeds where a provider has no public calculator, merged by source tier and checked as described above. Our methodology page describes the sources and the checks.",
  },
  {
    q: "Are there limits on the free endpoints?",
    a: `Yes: ${API_REQUESTS_PER_MINUTE} requests a minute per IP address. Past that the API answers 429 with a Retry-After header until the minute is up. Responses are cached for up to an hour, so cache on your side too; sustained heavy use needs a key, which the paid plans add.`,
  },
  {
    q: "When do the paid plans launch, and can the prices change?",
    a: "The prices shown are planned and may change before launch. The waitlist hears first: we email it when keys open, before the public launch. Tell us the routes, amounts and fields you need in the form; that is what decides what ships first.",
  },
];

export default function DevelopersPage() {
  setLinkSource(PATH); // Bing-only pages may link each other (link-eligibility.ts)

  const sample = buildPublicQuotes("USD", "INR", 1000);
  const sampleBody = JSON.stringify(sample, null, 2);
  const toPicker = (list: readonly { code: string; name: string }[]) => list.map((c) => ({ code: c.code, name: c.name }));

  const webApiSchema = {
    "@context": "https://schema.org",
    "@type": "WebAPI",
    name: "SendMoneyCompare Data API",
    description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    documentation: `${SITE_URL}${PATH}`,
    termsOfService: `${SITE_URL}/terms`,
    license: API_LICENCE.url,
    provider: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApiSchema) }} />

      <section className="bg-[var(--color-surface-dim)] border-b border-[var(--color-outline)]">
        <Container>
          <div className="py-10 sm:py-14 max-w-3xl">
            <p className="text-sm font-medium text-[var(--color-primary)]">SendMoneyCompare Data API</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-[var(--color-on-surface)]">
              Money transfer prices, as clean JSON
            </h1>
            <p className="mt-4 text-lg text-[var(--color-on-surface-variant)]">
              The quotes our comparison ranks, from {COVERAGE.providers} across {COVERAGE.corridors}, and daily
              mid-market history for every pair. Free to call today, no key needed. Paid plans with keys, history and
              exports are coming: join the waitlist to hear first.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#demo" className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">
                Try the live demo
              </a>
              <a
                href="#waitlist"
                className="rounded-full border border-[var(--color-outline)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)]"
              >
                Join the waitlist
              </a>
            </div>
            <div className="mt-6">
              <PageByline authorSlug={EDITORIAL_AUTHOR_SLUG} updated={pageUpdated(PATH)} cadence="Quotes collected every 6 hours" />
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <div className="py-10 space-y-14 max-w-4xl">
          <section id="demo" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-[var(--color-on-surface)] mb-2">Try the Data API live</h2>
            <p className="text-[var(--color-on-surface-variant)] mb-5">
              Pick a route and an amount and send a real request to the public endpoint. What you see is exactly what
              your code would get back.
            </p>
            <ApiPlayground
              sendCurrencies={toPicker(sendCurrencies)}
              receiveCurrencies={toPicker(currencies)}
              initial={{ from: "USD", to: "INR", amount: 1000, body: sampleBody }}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-on-surface)] mb-4">Free endpoints you can call today</h2>
            <div className="overflow-x-auto rounded-2xl border border-[var(--color-outline)]">
              <table className="w-full text-sm">
                <thead className="bg-[var(--color-surface-dim)] text-left text-[var(--color-on-surface-variant)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Request</th>
                    <th className="px-4 py-3 font-medium">Returns</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-outline)]">
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs align-top whitespace-nowrap">GET /api/v1/quotes?from=USD&amp;to=INR&amp;amount=1000</td>
                    <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">
                      Every provider the comparison shows for the route, in its order (by payout; payouts within 0.1%
                      count as tied and are ordered by rating): fee, exchange rate, amount received, markup over
                      mid-market, published speed, and any first-transfer rate.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs align-top whitespace-nowrap">GET /api/v1/history?from=USD&amp;to=INR</td>
                    <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">
                      Daily mid-market rates for the pair, oldest first.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs align-top whitespace-nowrap">GET /data/&lt;dataset&gt;.csv</td>
                    <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">
                      The datasets behind our{" "}
                      <Link href="/research" className="text-[var(--color-primary)] hover:underline">
                        research
                      </Link>
                      , listed below.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-[var(--color-on-surface-variant)]">
              {`JSON, CORS open, no cookies, ${API_REQUESTS_PER_MINUTE} requests a minute per IP. Licence ${API_LICENCE.name}: credit “${API_LICENCE.attribution}” with a link. Machine-readable description:`}{" "}
              <a href="/openapi.json" className="text-[var(--color-primary)] hover:underline">
                openapi.json
              </a>
              .
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm">
              {DATASETS.map((d) => (
                <li key={d.csv}>
                  <a href={d.csv} className="text-[var(--color-primary)] hover:underline">
                    {d.name}
                  </a>{" "}
                  <span className="text-[var(--color-on-surface-variant)]">(CSV)</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-on-surface)] mb-4">What clean means in our quotes</h2>
            <p className="text-[var(--color-on-surface-variant)] mb-4">
              Raw quotes from many sources disagree on what a fee includes and when a rate was taken. Before a quote
              reaches the comparison or the API:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-[var(--color-on-surface-variant)]">
              {CLEAN_STEPS.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-[var(--color-on-surface-variant)]">
              The full rules are in our{" "}
              <Link href="/methodology" className="text-[var(--color-primary)] hover:underline">
                methodology
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-on-surface)] mb-2">Data API plans and planned pricing</h2>
            <p className="text-[var(--color-on-surface-variant)] mb-6">
              Free works today. Paid plans are planned and their prices may change before launch.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {API_PLANS.map((p) => (
                <div
                  key={p.id}
                  className={`flex flex-col rounded-2xl border p-5 ${
                    p.id === "developer" ? "border-[var(--color-primary)] shadow-md" : "border-[var(--color-outline)]"
                  } bg-[var(--color-surface)]`}
                >
                  <p className="text-sm font-semibold text-[var(--color-on-surface)]">{p.name}</p>
                  <p className="mt-2 text-3xl font-bold text-[var(--color-on-surface)]">
                    {p.monthlyUsd === null ? "Custom" : `$${p.monthlyUsd}`}
                    {p.monthlyUsd ? <span className="text-sm font-normal text-[var(--color-on-surface-variant)]">{" "}/ month</span> : null}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
                    {p.available ? p.tagline : `${p.tagline} · planned`}
                  </p>
                  <ul className="mt-4 flex-1 space-y-2 text-sm text-[var(--color-on-surface-variant)]">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <span aria-hidden="true" className="text-[var(--color-primary)]">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={p.available ? "#demo" : `#join-${p.id}`}
                    className={`mt-5 rounded-full px-4 py-2 text-center text-sm font-medium ${
                      p.id === "developer"
                        ? "bg-[var(--color-primary)] text-white hover:opacity-90"
                        : "border border-[var(--color-outline)] text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)]"
                    }`}
                  >
                    {p.available ? "Start now" : p.monthlyUsd === null ? "Talk to us" : "Join the waitlist"}
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section id="waitlist" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-[var(--color-on-surface)] mb-2">Join the Data API waitlist</h2>
            <p className="text-[var(--color-on-surface-variant)] mb-5">
              Tell us what you would build. We read every answer, and the routes and fields people ask for decide what
              ships first.
            </p>
            <ApiWaitlistForm
              plans={API_PLANS.map((p) => ({
                id: p.id,
                label: p.monthlyUsd === null ? `${p.name} (custom)` : p.monthlyUsd === 0 ? `${p.name} (keep me posted)` : `${p.name} ($${p.monthlyUsd}/month)`,
              }))}
              useCases={API_USE_CASES.map((u) => ({ id: u.id, label: u.label }))}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-on-surface)] mb-4">Data API: questions before you build</h2>
            <div className="divide-y divide-[var(--color-outline)] rounded-2xl border border-[var(--color-outline)]">
              {FAQ.map((f) => (
                <details key={f.q} className="group p-4">
                  <summary className="cursor-pointer font-medium text-[var(--color-on-surface)]">{f.q}</summary>
                  <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
