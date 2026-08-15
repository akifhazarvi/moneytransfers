import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import { getAlternates } from "@/lib/i18n-metadata";
import SalaryAbroadTool from "@/components/SalaryAbroadTool";
import { pppIndex, markupBounds, countriesByName, modelDestination, corridorSlugByPair } from "@/lib/ppp-index";

const SITE_URL = "https://sendmoneycompare.com";
const PATH = "tools/salary-abroad";
const URL = `${SITE_URL}/${PATH}`;

const { best, worst } = markupBounds();
const slugByPair = corridorSlugByPair();
const countries = countriesByName().map((c) => ({
  iso2: c.iso2,
  name: c.name,
  currency: c.currency,
  multiplier: c.multiplier,
}));

// A couple of concrete examples for the copy + FAQ, computed rather than typed.
const usToIndia = modelDestination(60000, "US", "IN");
const usToPortugal = modelDestination(60000, "US", "PT");
const spreadPp = Math.round((worst.pct - best.pct) * 100) / 100;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = "What Is Your Salary Worth Abroad? Including the FX Cost Nobody Counts";
  const description = `Compare purchasing power across ${pppIndex.countryCount} countries using official World Bank data — then see what moving your money actually costs. ${best.name} averages ${best.pct}% FX markup, ${worst.name} ${worst.pct}%. On $60,000 that is a ${usToIndia ? `$${usToIndia.savedPerYear.toLocaleString()}` : "$2,790"} a year difference.`;
  return {
    title: { absolute: title },
    description,
    alternates: getAlternates(PATH, locale),
    openGraph: { title, description, url: URL, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Salary Abroad Calculator",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: `Compares what an income is worth across ${pppIndex.countryCount} countries using World Bank purchasing power parity, and adds the real cost of transferring money abroad.`,
  publisher: { "@type": "Organization", name: "SendMoneyCompare", url: SITE_URL },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much is my salary worth in another country?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Divide the two countries' purchasing power parity figures. On World Bank data, $60,000 earned in the US has the local buying power of about $${Math.round(usToIndia?.feelsLike ?? 288480).toLocaleString()} in India (${usToIndia?.multiplier ?? 4.81}x) and $${Math.round(usToPortugal?.feelsLike ?? 93187).toLocaleString()} in Portugal (${usToPortugal?.multiplier ?? 1.55}x). What most calculators miss is the FX spread on getting the money there, which runs from ${best.pct}% to ${worst.pct}% depending on the provider.`,
      },
    },
    {
      "@type": "Question",
      name: "Do cost of living calculators include currency conversion costs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Almost none do. They convert at the mid-market rate, which no consumer actually receives. The gap between the cheapest and dearest provider is ${spreadPp} percentage points — on a $60,000 income moved abroad each year that is roughly $${(usToIndia?.savedPerYear ?? 2790).toLocaleString()}, recurring every year.`,
      },
    },
    {
      "@type": "Question",
      name: "What data is this based on?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Purchasing power comes from the World Bank's International Comparison Program (indicator ${pppIndex.indicator}, household and NPISH final consumption), covering ${pppIndex.countryCount} countries for ${pppIndex.pppYears.from}-${pppIndex.pppYears.to}. Exchange rates and provider FX markups come from our own archive of 2.37 million quotes. It is official statistical data, not crowdsourced survey responses.`,
      },
    },
  ],
};

export default async function SalaryAbroadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Container>
        <div className="max-w-4xl mx-auto py-8 sm:py-12">
          <nav aria-label="Breadcrumb" className="text-sm text-[var(--color-on-surface-variant)]">
            <Link href="/tools" className="hover:underline">Tools</Link>
            <span className="mx-1.5">/</span>
            <span>Salary abroad</span>
          </nav>

          <h1 className="mt-3 text-3xl sm:text-4xl font-normal text-[var(--color-on-surface)] leading-tight">
            What is your salary actually worth abroad?
          </h1>
          <p className="mt-3 text-[var(--color-on-surface-variant)] leading-relaxed max-w-2xl">
            Purchasing power across {pppIndex.countryCount} countries from official World Bank data —
            plus the part every other calculator leaves out: what it costs to move your money there.
          </p>

          <div className="mt-6">
            <SalaryAbroadTool countries={countries} best={best} worst={worst} slugByPair={slugByPair} defaultHome="US" />
          </div>

          {/* ── Why this differs from other calculators ─────────── */}
          <section className="mt-12">
            <h2 className="text-2xl font-normal text-[var(--color-on-surface)]">
              Why this gives a different answer
            </h2>
            <div className="mt-3 space-y-3 text-[var(--color-on-surface-variant)] leading-relaxed">
              <p>
                Cost-of-living calculators assume you convert money at the mid-market rate — the
                rate you see on Google, which no consumer is ever offered. The difference between
                that rate and what you are actually quoted is the provider&rsquo;s FX markup, and it
                is the largest hidden cost in living on foreign income.
              </p>
              <p>
                We measured it. Across{" "}
                <Link href="/guides/best-day-to-send-money-abroad" className="text-[var(--color-primary)] hover:underline">
                  2.37 million archived quotes
                </Link>
                , {best.name} averages <strong>{best.pct}%</strong> markup and {worst.name} averages{" "}
                <strong>{worst.pct}%</strong>. That {spreadPp}pp gap is not a rounding error — on a
                salary moved abroad every year it compounds into thousands, for identical money and
                identical timing.
              </p>
            </div>
          </section>

          {/* ── Methodology, stated plainly ──────────────────────── */}
          <section className="mt-10">
            <h2 className="text-2xl font-normal text-[var(--color-on-surface)]">Method and limits</h2>
            <div className="mt-3 space-y-3 text-[var(--color-on-surface-variant)] leading-relaxed">
              <p>
                Purchasing power uses the World Bank&rsquo;s International Comparison Program
                figure for household final consumption (<code>{pppIndex.indicator}</code>), covering{" "}
                {pppIndex.countryCount} countries for {pppIndex.pppYears.from}–{pppIndex.pppYears.to}.
                It is official statistical data rather than crowdsourced survey responses, which is
                a deliberate choice — the common criticism of consumer cost-of-living indices is
                that self-reported entries reflect who bothered to fill in the form.
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  <strong>Country-level, not city-level.</strong> Lisbon and rural Portugal share one
                  figure. For anywhere with a wide internal spread, treat this as the national
                  average it is.
                </li>
                <li>
                  <strong>Purchasing power is not quality of life.</strong> This answers what your
                  money buys, not whether you will enjoy living somewhere. Safety, healthcare,
                  climate and visa rules are not in it.
                </li>
                <li>
                  <strong>Markups are provider averages across all corridors</strong>, not a live
                  quote for your pair. Use the corridor links for the real number today.
                </li>
                <li>
                  <strong>Tax is excluded.</strong> Income tax and social contributions vary enormously
                  and often swamp the differences shown here.
                </li>
                <li>
                  <strong>PPP data lags.</strong> The latest ICP figures are {pppIndex.pppYears.from}–
                  {pppIndex.pppYears.to}; exchange rates are from {pppIndex.rateDate}. In
                  high-inflation economies the gap between those two dates matters.
                </li>
              </ul>
              <p className="text-sm">
                Source: {pppIndex.source}. Exchange rates and provider markups: SendMoneyCompare
                quote archive, updated every 6 hours.
              </p>
            </div>
          </section>

          <div className="mt-10 rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-container)] p-5">
            <h2 className="text-lg font-normal text-[var(--color-on-surface)]">
              Found your country? Check what the transfer actually costs.
            </h2>
            <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
              The table links straight through to live provider comparisons for your corridor.
            </p>
            <Link
              href="/send-money"
              className="mt-3 inline-block rounded-full bg-[var(--color-primary)] text-white px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
            >
              Compare live rates
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
