import Container from "@/components/Container";
import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getAlternates } from "@/lib/i18n-metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/structured-data";
import { getMidMarketRate } from "@/lib/unified-quotes";
import Breadcrumb from "@/components/Breadcrumb";
import InlineProviderQuotes from "@/components/InlineProviderQuotes";
import FxMarkupChecker from "@/components/FxMarkupChecker";

export const revalidate = 21600; // 6h — tracks the scrape cadence

const SITE_URL = "https://sendmoneycompare.com";
const PATH = "tools/fx-markup-checker";
const TITLE = "FX Markup Checker — See the Hidden Exchange Rate Markup on Any Transfer";
const DESCRIPTION =
  "Paste the exchange rate your bank or provider quoted and instantly see the hidden FX markup — in % and in real money. Compare against the live mid-market rate, free.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLE,
    description: DESCRIPTION,
    keywords: [
      "fx markup checker",
      "exchange rate markup calculator",
      "hidden fx fee",
      "mid-market rate comparison",
      "currency markup calculator",
      "how much is my bank charging exchange rate",
    ],
    alternates: getAlternates(PATH, locale),
    openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/${PATH}`, type: "website" },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  };
}

const FAQS = [
  {
    question: "What is an FX markup?",
    answer:
      "The FX markup is the gap between the real mid-market exchange rate (the one you see on Google or Reuters) and the weaker rate a provider actually gives you. It's a hidden margin baked into the rate — often larger than the advertised transfer fee, and easy to miss because it isn't itemised.",
  },
  {
    question: "How do I calculate the exchange rate markup?",
    answer:
      "Markup % = (mid-market rate − quoted rate) ÷ mid-market rate × 100. For example, if the mid-market rate is 1 USD = 83.00 INR and you were quoted 82.00, the markup is (83−82)/83 = 1.2%. On a $1,000 transfer that's about $12 lost to the rate. This tool does the math against the live mid-market for you.",
  },
  {
    question: "What counts as a good FX markup?",
    answer:
      "Under 0.5% is excellent and close to mid-market — providers like Wise usually sit here. 0.5%–1.5% is fair but usually beatable. Above 1.5% (and banks are often 2–4%) means you're overpaying and should compare alternatives before sending.",
  },
  {
    question: "Is a zero-fee transfer actually free?",
    answer:
      "Often not. Many 'no fee' or 'zero commission' transfers make their money entirely on the exchange-rate markup instead. That's exactly why checking the markup matters — a free transfer at a 3% markup can cost far more than a $5 fee at mid-market.",
  },
];

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "FX Markup Checker",
  url: `${SITE_URL}/${PATH}`,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: DESCRIPTION,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export default async function FxMarkupCheckerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const initialMidMarket = getMidMarketRate("USD", "INR");

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Tools", href: "/tools" },
    { name: "FX Markup Checker", href: `/${PATH}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />

      <section className="bg-[var(--color-surface)] pt-8 pb-6 border-b border-[var(--color-outline)]">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "FX Markup Checker" },
            ]}
          />
          <div className="max-w-3xl mt-4">
            <span className="inline-block text-2xs font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-2.5 py-1 rounded-full">
              Free tool · Live mid-market rates
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-[var(--color-on-surface)] tracking-tight text-balance">
              FX Markup Checker
            </h1>
            <p className="mt-3 text-lg text-[var(--color-on-surface-variant)]">
              Paste the exchange rate your bank or transfer provider quoted you. We compare it to the{" "}
              <strong>live mid-market rate</strong> and show the hidden markup — in % and in real money.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-8">
        <Container>
          <div className="max-w-3xl">
            <FxMarkupChecker source="tool:fx-markup-checker" initialFrom="USD" initialTo="INR" initialMidMarket={initialMidMarket} />
            <p className="mt-3 text-xs text-[var(--color-on-surface-muted)]">
              The mid-market reference updates live from our provider quote data (refreshed every 6 hours). Estimate
              only — confirm the exact rate with your provider before sending.
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-4">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-[var(--color-on-surface)]">Beat the markup — best-value providers now</h2>
            <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
              These providers give the closest-to-mid-market rate on USD → India today. Switch the corridor in the
              checker above to compare yours.
            </p>
            <InlineProviderQuotes from="USD" to="INR" amount={1000} source="tool:fx-markup-checker" />
          </div>
        </Container>
      </section>

      <section className="pb-12">
        <Container>
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--color-on-surface)]">Why the exchange rate is where transfers get expensive</h2>
              <p className="mt-2 text-[var(--color-on-surface-variant)]">
                Most people compare transfer fees and stop there. But the exchange-rate markup — the difference
                between the true mid-market rate and the rate you&apos;re actually given — is invisible and frequently
                larger than the fee. A &quot;zero-fee&quot; transfer at a 3% markup on $2,000 quietly costs $60. This tool
                surfaces that hidden cost so you can compare providers on the number that really matters: the all-in
                rate.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[var(--color-on-surface)]">Frequently asked questions</h2>
              <div className="mt-3 divide-y divide-[var(--color-outline)]/70 rounded-2xl ring-1 ring-[var(--color-outline)]/60 overflow-hidden">
                {FAQS.map((f) => (
                  <details key={f.question} className="group bg-[var(--color-surface)]">
                    <summary className="flex items-center justify-between gap-3 cursor-pointer px-4 sm:px-5 py-4 text-sm font-semibold text-[var(--color-on-surface)] list-none">
                      {f.question}
                      <span className="text-[var(--color-on-surface-muted)] transition-transform group-open:rotate-45 text-lg leading-none">+</span>
                    </summary>
                    <p className="px-4 sm:px-5 pb-4 text-sm text-[var(--color-on-surface-variant)]">{f.answer}</p>
                  </details>
                ))}
              </div>
            </div>

            <p className="text-sm text-[var(--color-on-surface-variant)]">
              Related:{" "}
              <Link className="underline" href="/tools/us-remittance-tax">US Remittance Tax Calculator</Link> ·{" "}
              <Link className="underline" href="/send-money">Compare all providers</Link>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
