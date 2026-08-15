import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import { getAlternates } from "@/lib/i18n-metadata";
import { getAuthor } from "@/data/authors";
import FxBiteCharts, { type BiteRow } from "@/components/FxBiteCharts";
import CostIncomeScatter from "@/components/CostIncomeScatter";
import { rankDestinations, markupBounds, pppIndex, longDateFromIso, scatterData } from "@/lib/ppp-index";

const SITE_URL = "https://sendmoneycompare.com";
const PATH = "guides/fx-cost-vs-purchasing-power";
const URL = `${SITE_URL}/${PATH}`;
const SALARY = 60000;
const HOME = "US";
const CURRENCY = "USD";

const author = getAuthor("akif-hazarvi");
const { best, worst } = markupBounds();

// Every number below is derived here and passed down — nothing is typed into
// the prose, so the charts and the copy cannot drift apart.
const all = rankDestinations(SALARY, HOME).filter((r) => r.multiplier > 1);

function toRow(r: (typeof all)[number]): BiteRow {
  const gainPct = (r.multiplier - 1) * 100;
  return {
    name: r.country.name.replace(", Arab Rep.", "").replace(", Rep.", "").replace(" SAR, China", ""),
    multiplier: r.multiplier,
    gainPct,
    eatenWorst: (worst.pct / gainPct) * 100,
    eatenBest: (best.pct / gainPct) * 100,
    costBest: r.costBest,
    costWorst: r.costWorst,
  };
}

// The story is the inversion, so lead with the countries where the bite is
// biggest — these are the rich-world moves people assume are "safe".
const chartRows = all.map(toRow).sort((a, b) => b.eatenWorst - a.eatenWorst).slice(0, 12);
const deepArb = all.map(toRow).sort((a, b) => a.eatenWorst - b.eatenWorst).slice(0, 4);

const topBite = chartRows[0];
const cheapest = deepArb[0];
const spreadPp = Math.round((worst.pct - best.pct) * 100) / 100;
const asOf = longDateFromIso(pppIndex.generatedAt);

const scatter = scatterData();
// How many countries beat the diagonal — cheaper than median AND earning above it.
const cheapRich = scatter.points.filter(
  (p) => p.priceLevel < scatter.medPrice && p.gni >= scatter.medGni,
).length;
// Direct-label only these; everything else is hover-only. The source chart's
// author had to drop cities purely because labels collided — an interactive
// chart has no such excuse, but a labelled dot per country is still unreadable.
const LABELLED = ["US", "GB", "CH", "NO", "SG", "DE", "PT", "PL", "IN", "EG", "TR", "MX", "ZA", "JP", "AE"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = `The Cheaper the Move, the More Your Transfer Fee Costs You`;
  const description = `Moving from the US to ${topBite.name} lifts your buying power ${Math.round(topBite.gainPct)}% — but the wrong transfer provider eats ${Math.round(topBite.eatenWorst)}% of that gain. Moving to ${cheapest.name} it eats ${cheapest.eatenWorst.toFixed(1)}%. Charted across ${all.length} countries on World Bank data.`;
  return {
    title: { absolute: title },
    description,
    alternates: getAlternates(PATH, locale),
    openGraph: {
      title, description, url: URL, type: "article",
      publishedTime: "2026-08-15", modifiedTime: pppIndex.generatedAt,
      authors: ["Akif Hazarvi"],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The Cheaper the Move, the More Your Transfer Fee Costs You",
  datePublished: "2026-08-15",
  dateModified: pppIndex.generatedAt,
  author: { "@type": "Person", name: "Akif Hazarvi", url: `${SITE_URL}/about` },
  publisher: { "@type": "Organization", name: "SendMoneyCompare", url: SITE_URL },
  mainEntityOfPage: URL,
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does the money transfer provider matter if I am moving somewhere much cheaper?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Much less than you would think. Moving from the US to ${cheapest.name}, the gap between the cheapest and dearest provider costs ${cheapest.eatenWorst.toFixed(1)}% of your purchasing-power gain — a rounding error against a ${Math.round(cheapest.gainPct)}% uplift. It matters most on moves between similarly priced countries: US to ${topBite.name} lifts buying power only ${Math.round(topBite.gainPct)}%, so the same fee eats ${Math.round(topBite.eatenWorst)}% of the benefit.`,
      },
    },
    {
      "@type": "Question",
      name: "How much does FX markup cost on a salary moved abroad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `On ${SALARY.toLocaleString()} USD moved abroad each year, ${best.name} averages ${best.pct}% FX markup and ${worst.name} averages ${worst.pct}% — about $${Math.round(SALARY * best.pct / 100).toLocaleString()} versus $${Math.round(SALARY * worst.pct / 100).toLocaleString()} a year, on identical money. The ${spreadPp} percentage point spread is measured across 2.37 million archived quotes.`,
      },
    },
  ],
};

export default async function FxCostVsPurchasingPowerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Container>
        <article className="max-w-3xl mx-auto py-8 sm:py-12">
          <nav aria-label="Breadcrumb" className="text-sm text-[var(--color-on-surface-variant)]">
            <Link href="/guides" className="hover:underline">Guides</Link>
            <span className="mx-1.5">/</span>
            <span>FX cost vs purchasing power</span>
          </nav>

          <h1 className="mt-3 text-3xl sm:text-4xl font-normal text-[var(--color-on-surface)] leading-tight">
            The cheaper the move, the less your transfer fee matters
          </h1>
          <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]">
            By {author?.name ?? "Akif Hazarvi"} · World Bank PPP {pppIndex.pppYears.from}–{pppIndex.pppYears.to} ·
            Updated {asOf}
          </p>

          <div className="mt-6 rounded-2xl border border-[var(--color-outline)] bg-[var(--color-primary-surface)] p-5">
            <p className="text-[var(--color-on-surface)] leading-relaxed">
              Everyone worries about transfer fees when sending money to a cheap country. That is
              exactly backwards. If you move from the US to {cheapest.name}, your buying power rises{" "}
              {Math.round(cheapest.gainPct)}% — and the difference between the best and worst
              provider costs you <strong>{cheapest.eatenWorst.toFixed(1)}%</strong> of that. Irrelevant.
            </p>
            <p className="mt-3 text-[var(--color-on-surface)] leading-relaxed">
              Move to {topBite.name} instead, where buying power rises just{" "}
              {Math.round(topBite.gainPct)}%, and the same fee eats{" "}
              <strong>{Math.round(topBite.eatenWorst)}% of your entire gain</strong>. The fee did not
              change. The thing it is measured against did.
            </p>
          </div>

          <p className="mt-6 text-[var(--color-on-surface-variant)] leading-relaxed">
            The logic is simple once stated. An FX spread is a fixed percentage of the money you
            move; your purchasing-power gain is whatever the price gap between two countries happens
            to be. When that gap is enormous, a few percent is noise. When it is slim — most
            rich-country-to-rich-country moves — a few percent is a serious share of the whole point
            of moving.
          </p>

          <h2 className="mt-10 text-2xl font-normal text-[var(--color-on-surface)]">
            Where the fee does real damage
          </h2>
          <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
            Twelve destinations, ranked by how much of your gain disappears. These are not
            struggling economies — they are the comfortable, obvious places people move to.
          </p>

          <div className="mt-5">
            <FxBiteCharts
              rows={chartRows}
              bestName={best.name}
              worstName={worst.name}
              bestPct={best.pct}
              worstPct={worst.pct}
              salary={SALARY}
              currency={CURRENCY}
            />
          </div>

          <h2 className="mt-12 text-2xl font-normal text-[var(--color-on-surface)]">
            The map behind it: cost against what locals earn
          </h2>
          <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
            All {scatter.points.length} countries, cost of living against income per person. This is
            the familiar cost-versus-quality picture rebuilt on official World Bank statistics
            instead of crowdsourced ratings — and it shows why the fee effect above happens.
          </p>
          <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
            Note how tightly the dots hug a diagonal. Cost and income rise together almost
            everywhere, which is exactly why <strong>&ldquo;cheap and high-earning&rdquo; is rare</strong>:
            only {cheapRich} of {scatter.points.length} countries manage it. The genuinely
            interesting places are the ones sitting off that diagonal.
          </p>

          <div className="mt-5">
            <CostIncomeScatter
              points={scatter.points}
              medPrice={scatter.medPrice}
              medGni={scatter.medGni}
              labelled={LABELLED}
            />
          </div>

          <h2 className="mt-12 text-2xl font-normal text-[var(--color-on-surface)]">
            What this means in practice
          </h2>
          <div className="mt-2 space-y-3 text-[var(--color-on-surface-variant)] leading-relaxed">
            <p>
              If you are moving somewhere dramatically cheaper — {deepArb.map((d) => d.name).slice(0, 3).join(", ")} —
              pick a provider on reliability and delivery speed. The FX difference is real money
              ({new Intl.NumberFormat("en-GB", { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 }).format(topBite.costWorst - topBite.costBest)} a
              year on {new Intl.NumberFormat("en-GB", { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 }).format(SALARY)}) but
              it is a rounding error next to the move itself.
            </p>
            <p>
              If you are moving between comparable economies, the provider is a material part of
              the decision. On a US-to-{topBite.name} move the wrong choice claws back{" "}
              {Math.round(topBite.eatenWorst)}% of your benefit — and unlike rent or tax, it is a
              cost you can eliminate in about ten minutes.
            </p>
            <p>
              The one thing that is never true is the intuition most people carry: that fees matter
              most when you are sending money somewhere poor.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-container)] p-5">
            <h2 className="text-lg font-normal text-[var(--color-on-surface)]">
              Run this for your own salary
            </h2>
            <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
              The numbers above assume {new Intl.NumberFormat("en-GB", { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 }).format(SALARY)} earned
              in the US. The calculator does it for any income, from any of {pppIndex.countryCount} countries.
            </p>
            <Link
              href="/tools/salary-abroad"
              className="mt-3 inline-block rounded-full bg-[var(--color-cta)] text-[var(--color-cta-text)] px-5 py-2.5 text-sm font-medium hover:bg-[var(--color-cta-hover)] transition"
            >
              Open the salary abroad calculator
            </Link>
          </div>

          <h2 className="mt-12 text-2xl font-normal text-[var(--color-on-surface)]">Method</h2>
          <div className="mt-2 space-y-3 text-[var(--color-on-surface-variant)] leading-relaxed">
            <p>
              Purchasing power is the World Bank&rsquo;s International Comparison Program figure for
              household final consumption (<code>{pppIndex.indicator}</code>), {pppIndex.pppYears.from}–
              {pppIndex.pppYears.to}, across {pppIndex.countryCount} countries. Official statistics,
              not crowdsourced survey entries. FX markups come from our archive of 2.37 million
              quotes — the same dataset behind the{" "}
              <Link href="/guides/best-day-to-send-money-abroad" className="text-[var(--color-primary)] hover:underline">
                day-of-week study
              </Link>.
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                <strong>The relationship here is arithmetic, not a discovered correlation.</strong>{" "}
                Share eaten = markup ÷ (multiplier − 1). What is measured is the two inputs: the
                price gaps and the provider spread. The point of charting it is that the consequence
                is counterintuitive, not that the ratio is surprising.
              </li>
              <li>
                <strong>Country-level, not city-level.</strong> Lisbon and rural Portugal share one
                figure.
              </li>
              <li>
                <strong>Markups are provider averages across all corridors</strong>, not a live quote
                for your pair, and exclude fixed fees — which hurt small transfers more.
              </li>
              <li>
                <strong>Tax is excluded</strong>, and it frequently swamps everything here.
              </li>
            </ul>
          </div>
        </article>
      </Container>
    </>
  );
}
