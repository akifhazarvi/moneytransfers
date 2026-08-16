import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import { getAlternates } from "@/lib/i18n-metadata";
import { getAuthor } from "@/data/authors";
import { computeBankVsAppIndex, HEADLINE_AMOUNT } from "@/lib/bank-vs-app-index";

const SITE_URL = "https://sendmoneycompare.com";
const PATH = "guides/bank-vs-app-transfer-cost-2026";
const URL = `${SITE_URL}/${PATH}`;

// Computed live at build from the same scrape that refreshes every 6h. The
// page below cites `idx` figures directly so the published numbers never drift
// from the underlying data. See src/lib/bank-vs-app-index.ts for methodology.
const idx = computeBankVsAppIndex(HEADLINE_AMOUNT);
const author = getAuthor("akif-hazarvi");

// Human-readable "21 June 2026" from the YYYY-MM-DD data date.
const asOfLong = new Date(idx.dataAsOf + "T00:00:00Z").toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const amt = `$${idx.amount.toLocaleString()}`;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = `Banks Cost ${idx.bankVsAppMultiple}× More Than Apps to Send Money Abroad (${asOfLong} Data)`;
  const description = `Live data from ${idx.bankQuoteCount + idx.appQuoteCount} quotes across ${idx.corridorCount} corridors: sending ${amt} via a traditional bank costs ${idx.bankAvgCostPct}% on average vs ${idx.appAvgCostPct}% via a specialist app. See the named bank leaderboard and download the dataset.`;
  return {
    title: { absolute: title },
    description,
    alternates: getAlternates(PATH, locale),
    openGraph: {
      title,
      description,
      url: URL,
      type: "article",
      publishedTime: "2026-06-21",
      modifiedTime: idx.dataAsOf,
      authors: ["Akif Hazarvi"],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: `Bank vs App: How Much More Banks Cost to Send Money Abroad (${idx.dataAsOf} data)`,
  description: `Live measurement of the cost gap between traditional banks and specialist money-transfer apps across ${idx.corridorCount} corridors.`,
  datePublished: "2026-06-21",
  dateModified: idx.dataAsOf,
  author: { "@type": "Person", name: "Akif Hazarvi", url: `${SITE_URL}/about/akif-hazarvi` },
  publisher: { "@id": `${SITE_URL}/#organization` },
  mainEntityOfPage: URL,
  isBasedOn: `${SITE_URL}/api/data/bank-vs-app-cost`,
};

const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "SendMoneyCompare Bank vs App Transfer Cost Index",
  description: `Per-corridor true cost (FX markup + fee) of sending ${amt} via traditional banks vs the cheapest specialist provider, across ${idx.corridorCount} currency corridors. Updated from live quotes every 6 hours.`,
  url: URL,
  creator: { "@id": `${SITE_URL}/#organization` },
  dateModified: idx.dataAsOf,
  license: "https://creativecommons.org/licenses/by/4.0/",
  distribution: [
    {
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl: `${SITE_URL}/api/data/bank-vs-app-cost`,
    },
  ],
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-dim)] p-5 text-center">
      <div className="text-[clamp(1.75rem,6vw,2.5rem)] font-semibold text-[var(--color-primary)] leading-none tracking-tight">
        {value}
      </div>
      <div className="mt-2 text-sm text-[var(--color-on-surface-variant)]">{label}</div>
    </div>
  );
}

export default async function BankVsAppCostPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />

      <Container>
        <article className="mx-auto max-w-3xl py-10">
          {/* Header */}
          <nav className="mb-4 text-sm text-[var(--color-on-surface-variant)]">
            <Link href="/guides" className="hover:text-[var(--color-primary)]">Guides</Link>
            <span className="mx-1.5">/</span>
            <span>Bank vs App Cost Index</span>
          </nav>

          <h1 className="text-[clamp(1.6rem,5vw,2.6rem)] font-normal leading-tight tracking-[-0.01em] text-[var(--color-on-surface)]">
            Banks cost {idx.bankVsAppMultiple}× more than apps to send money abroad
          </h1>
          <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]">
            By {author?.name ?? "Akif Hazarvi"} · Data as of {asOfLong} · Updated every 6 hours from live provider quotes
          </p>

          {/* Citable answer box */}
          <div className="mt-6 rounded-2xl border border-[var(--color-primary)] bg-[var(--color-primary-surface)] p-5">
            <p className="citable-passage text-[var(--color-on-surface)] leading-relaxed">
              <strong>The finding:</strong> Across {idx.corridorCount} currency corridors, sending {amt} through a
              traditional bank costs <strong>{idx.bankAvgCostPct}% on average</strong> once the exchange-rate markup and
              fees are counted — versus <strong>{idx.appAvgCostPct}%</strong> through a specialist money-transfer app.
              That makes banks roughly <strong>{idx.bankVsAppMultiple}× more expensive</strong>. On the same corridor,
              a bank delivers <strong>{idx.bankVsCheapestMeanPct}% less money</strong> on average than the cheapest
              specialist available for that exact route.
            </p>
          </div>

          {/* Headline stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat value={`${idx.bankAvgCostPct}%`} label={`Avg bank cost on ${amt}`} />
            <Stat value={`${idx.appAvgCostPct}%`} label={`Avg app cost on ${amt}`} />
            <Stat value={`${idx.bankVsAppMultiple}×`} label="Banks cost this much more" />
            <Stat value={`${idx.bankVsCheapestMeanPct}%`} label="Bank loss vs cheapest app" />
          </div>

          {/* Named leaderboard — the journalist hook */}
          <h2 className="mt-10 text-2xl font-normal text-[var(--color-on-surface)]">
            The worst-value banks right now
          </h2>
          <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
            These banks lose senders the most, measured as the average true cost (FX markup + fees) of sending {amt}
            across every corridor where we hold a live bank quote. Only banks covering 3+ corridors are ranked, for a
            fair average.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-outline)] text-left text-[var(--color-on-surface-variant)]">
                  <th className="py-2 pr-3 font-medium">#</th>
                  <th className="py-2 pr-3 font-medium">Bank</th>
                  <th className="py-2 pr-3 font-medium text-right">Avg true cost</th>
                  <th className="py-2 font-medium text-right">Corridors</th>
                </tr>
              </thead>
              <tbody>
                {idx.worstBanks.slice(0, 10).map((b, i) => (
                  <tr key={b.name} className="border-b border-[var(--color-outline)]">
                    <td className="py-2 pr-3 text-[var(--color-on-surface-variant)]">{i + 1}</td>
                    <td className="py-2 pr-3 text-[var(--color-on-surface)]">{b.name}</td>
                    <td className="py-2 pr-3 text-right font-medium text-[var(--color-on-surface)]">{b.avgCostPct}%</td>
                    <td className="py-2 text-right text-[var(--color-on-surface-variant)]">{b.corridorCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CSV download CTA */}
          <div className="mt-8 rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-dim)] p-5">
            <h2 className="text-lg font-medium text-[var(--color-on-surface)]">Download the data</h2>
            <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
              The full per-corridor table behind these figures — {idx.bankQuoteCount} bank quotes vs the cheapest
              specialist on each route — as a CSV. Free to use with attribution to SendMoneyCompare.
            </p>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages --
                This targets an /api/data CSV endpoint, not a page. next/link would
                client-side navigate instead of letting the browser download it. */}
            <a
              href="/api/data/bank-vs-app-cost"
              className="mt-3 inline-block rounded-full bg-[var(--color-cta)] px-5 py-2.5 text-sm font-semibold text-[var(--color-cta-text)] hover:bg-[var(--color-cta-hover)] transition-colors"
            >
              Download CSV ({idx.dataAsOf})
            </a>
          </div>

          {/* Methodology — the trust layer */}
          <h2 className="mt-10 text-2xl font-normal text-[var(--color-on-surface)]">How we measured this</h2>
          <div className="prose-content mt-3 space-y-3 text-[var(--color-on-surface-variant)] leading-relaxed">
            <p className="citable-passage">
              We collect live quotes for the same send amount on the same corridor from both traditional banks and
              specialist money-transfer apps, every 6 hours. For each quote we compute the <strong>true total
              cost</strong> as the gap between what the recipient <em>would</em> get at the mid-market exchange rate and
              what they <em>actually</em> get after the provider&rsquo;s FX markup and fees:
            </p>
            <p className="rounded-xl bg-[var(--color-surface-dim)] px-4 py-3 font-mono text-sm text-[var(--color-on-surface)]">
              true cost % = (mid-market receive − actual receive) ÷ mid-market receive × 100
            </p>
            <p>
              The mid-market baseline is the latest daily rate in our 365-day rate history. This single figure captures
              both the hidden FX markup and the upfront fee, because the actual receive amount already reflects both.
              Figures on this page are computed from <strong>{idx.bankQuoteCount} bank quotes</strong> and{" "}
              <strong>{idx.appQuoteCount} app quotes</strong> across <strong>{idx.corridorCount} corridors</strong> and{" "}
              <strong>{idx.providerCount} providers</strong>, as of {asOfLong}. We exclude quotes that fall outside a
              sane −2% to 40% band to drop occasional scrape artifacts. The numbers refresh automatically as new quotes
              come in, so this page always reflects current pricing rather than a stale snapshot.
            </p>
            <p>
              For context, the World Bank&rsquo;s Remittance Prices Worldwide pegs the global average cost of sending
              money at around 6.4%, but it is published quarterly and never names individual banks. This index is
              high-frequency and names names.
            </p>
          </div>

          {/* Internal links to winners */}
          <div className="mt-8 rounded-2xl border border-[var(--color-outline)] p-5">
            <h2 className="text-base font-medium text-[var(--color-on-surface)]">Send for less</h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>
                <Link href="/send-money" className="text-[var(--color-primary)] hover:underline">
                  Compare live rates across 50+ providers for your transfer
                </Link>
              </li>
              <li>
                <Link href="/remittance-cost-index" className="text-[var(--color-primary)] hover:underline">
                  See the full Remittance Cost Index (provider leaderboard)
                </Link>
              </li>
              <li>
                <Link href="/guides/best-money-transfer-apps" className="text-[var(--color-primary)] hover:underline">
                  The best money transfer apps, ranked
                </Link>
              </li>
              <li>
                <Link href="/guides/exchange-rate-markup-explained" className="text-[var(--color-primary)] hover:underline">
                  How the hidden exchange-rate markup works
                </Link>
              </li>
            </ul>
          </div>

          <p className="mt-8 text-xs text-[var(--color-on-surface-variant)]">
            Press &amp; citations: this dataset is free to cite with a link to SendMoneyCompare. For a specific corridor
            cut or comment, see our <Link href="/contact" className="underline">contact page</Link>.
          </p>
        </article>
      </Container>
    </>
  );
}
