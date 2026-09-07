import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import DataProvenance from "@/components/DataProvenance";
import { seoDescription } from "@/lib/seo-title";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import { companyPageRenders } from "@/lib/route-map";
import { providerLogo, hasProviderLogo } from "@/lib/provider-logo";
import { REMITTANCE_INDEX } from "@/lib/remittance-cost-index";
import { AMOUNT_TIER_INDEX } from "@/lib/amount-tier-index";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "transferCostByAmount" });
  return {
    title: t("metaTitle"),
    description: seoDescription(t("metaDescription")),
    keywords: t("metaKeywords"),
    authors: [{ name: "Akif Hazarvi", url: "https://sendmoneycompare.com/about/akif-hazarvi" }],
    alternates: getAlternates("transfer-cost-by-amount", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/transfer-cost-by-amount",
      images: DEFAULT_OG_IMAGES,
    },
  };
}

const idx = AMOUNT_TIER_INDEX;
const CSV_URL = "/api/data/transfer-cost-by-amount";
const money = (n: number) => `$${n.toLocaleString("en-US")}`;
const pp = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(2)}pp`;
const GRID = "grid-cols-[40px_1fr_84px_84px_96px]";

function ProviderCell({ slug, name }: { slug: string; name: string }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      {hasProviderLogo(slug) && (
        <Image
          src={providerLogo(slug)}
          alt={`${name} logo`}
          width={28}
          height={28}
          className="rounded-full shrink-0 bg-white object-contain p-0.5 border border-[var(--color-outline)]/40"
        />
      )}
      {companyPageRenders(slug) ? (
        <Link
          href={`/companies/${slug}`}
          className="text-sm font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors truncate"
        >
          {name}
        </Link>
      ) : (
        <span className="text-sm font-semibold text-[var(--color-on-surface)] truncate">{name}</span>
      )}
    </div>
  );
}

export default async function TransferCostByAmountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const differentLeader = idx.cheapestSmall && idx.cheapestHeadline && idx.cheapestSmall.slug !== idx.cheapestHeadline.slug;

  return (
    <>
      {/* Direct answer first. */}
      <section className="bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface-dim)] pt-16 pb-14">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-h2-plus md:text-5xl font-bold text-[var(--color-on-surface)] leading-[1.15] tracking-[-0.5px]">
              Does the amount you send change{" "}
              <span className="text-[var(--color-primary)]">who is cheapest</span>?
            </h1>
            <p className="text-base md:text-lg text-[var(--color-on-surface-variant)] mt-5 max-w-2xl mx-auto leading-relaxed">
              Yes, and by more than most rankings admit. Across {idx.providersCompared} providers we can price at both
              amounts, sending {money(idx.smallAmount)} costs{" "}
              <strong className="text-[var(--color-on-surface)]">{idx.meanSmallPct.toFixed(2)}%</strong> of the amount
              on average against{" "}
              <strong className="text-[var(--color-on-surface)]">{idx.meanHeadlinePct.toFixed(2)}%</strong> at{" "}
              {money(idx.headlineAmount)} — a gap of {idx.meanDeltaPp.toFixed(2)} percentage points.
              {differentLeader && (
                <>
                  {" "}
                  The cheapest provider is not the same at both:{" "}
                  <strong className="text-[var(--color-on-surface)]">{idx.cheapestSmall!.name}</strong> at{" "}
                  {money(idx.smallAmount)}, <strong className="text-[var(--color-on-surface)]">{idx.cheapestHeadline!.name}</strong>{" "}
                  at {money(idx.headlineAmount)}.
                </>
              )}
            </p>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="bg-[var(--color-surface)] border-y border-[var(--color-outline)] py-10">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: `Average cost, ${money(idx.smallAmount)}`, value: `${idx.meanSmallPct.toFixed(2)}%`, sub: "fee plus markup" },
              { label: `Average cost, ${money(idx.headlineAmount)}`, value: `${idx.meanHeadlinePct.toFixed(2)}%`, sub: "fee plus markup" },
              { label: "Worst small-transfer penalty", value: pp(idx.worst!.deltaPp), sub: idx.worst!.name },
              { label: "Cheaper on small transfers", value: `${idx.inverted.length}`, sub: `of ${idx.providersCompared} providers` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-h3 md:text-4xl font-bold text-[var(--color-primary)] tabular-nums">{s.value}</div>
                <div className="text-2sm text-[var(--color-on-surface-variant)] mt-1">{s.label}</div>
                <div className="text-2xs text-[var(--color-on-surface-muted)]">{s.sub}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Table */}
      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-on-surface)] mb-2">
              True total cost at {money(idx.smallAmount)} versus {money(idx.headlineAmount)}, by provider
            </h2>
            <p className="text-2sm text-[var(--color-on-surface-variant)] mb-6 leading-relaxed">
              Cost is the fee plus the exchange-rate markup, as a share of the amount sent. Ordered by the size of the
              small-transfer penalty, worst first. A negative figure means the provider is proportionally{" "}
              <em>cheaper</em> on the smaller transfer.
            </p>

            {/* Desktop */}
            <div className="hidden md:block bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl overflow-hidden shadow-[var(--shadow-sm)]">
              <div className={`grid ${GRID} gap-2 px-5 py-3 bg-[var(--color-surface-dim)] text-xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide`}>
                <span>#</span>
                <span>Provider</span>
                <span className="text-right">{money(idx.smallAmount)}</span>
                <span className="text-right">{money(idx.headlineAmount)}</span>
                <span className="text-right">Difference</span>
              </div>
              {idx.rows.map((r, i) => (
                <div
                  key={r.slug}
                  className={`grid ${GRID} gap-2 items-center px-5 py-3 border-t border-[var(--color-outline)] ${
                    r.deltaPp < 0 ? "bg-[var(--color-primary-surface)]/25" : ""
                  }`}
                >
                  <span className="text-sm text-[var(--color-on-surface-variant)] tabular-nums">{i + 1}</span>
                  <ProviderCell slug={r.slug} name={r.name} />
                  <span className="text-sm text-[var(--color-on-surface)] text-right tabular-nums">
                    {r.costSmallPct.toFixed(2)}%
                  </span>
                  <span className="text-sm text-[var(--color-on-surface)] text-right tabular-nums">
                    {r.costHeadlinePct.toFixed(2)}%
                  </span>
                  <span
                    className={`text-sm font-semibold text-right tabular-nums ${
                      r.deltaPp < 0 ? "text-green-600" : "text-[var(--color-on-surface)]"
                    }`}
                  >
                    {pp(r.deltaPp)}
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-3">
              {idx.rows.map((r) => (
                <div
                  key={r.slug}
                  className={`rounded-2xl border border-[var(--color-outline)] p-4 ${
                    r.deltaPp < 0 ? "bg-[var(--color-primary-surface)]/25" : "bg-[var(--color-surface)]"
                  }`}
                >
                  <div className="mb-3">
                    <ProviderCell slug={r.slug} name={r.name} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-2xs text-[var(--color-on-surface-variant)]">{money(idx.smallAmount)}</div>
                      <div className="text-sm font-semibold text-[var(--color-on-surface)] tabular-nums">
                        {r.costSmallPct.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-2xs text-[var(--color-on-surface-variant)]">{money(idx.headlineAmount)}</div>
                      <div className="text-sm font-semibold text-[var(--color-on-surface)] tabular-nums">
                        {r.costHeadlinePct.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-2xs text-[var(--color-on-surface-variant)]">Difference</div>
                      <div
                        className={`text-sm font-semibold tabular-nums ${
                          r.deltaPp < 0 ? "text-green-600" : "text-[var(--color-on-surface)]"
                        }`}
                      >
                        {pp(r.deltaPp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-2xs text-[var(--color-on-surface-muted)] mt-4">
              <a href={CSV_URL} className="text-[var(--color-primary)] hover:underline">
                Download this table as CSV
              </a>
              .
            </p>
          </div>
        </Container>
      </section>

      {/* Why flat fees do this */}
      <section className="py-10 bg-[var(--color-primary-surface)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-on-surface)] mb-3">
              Why a flat fee punishes a small transfer
            </h2>
            <p className="text-md text-[var(--color-on-surface-variant)] leading-relaxed">
              A fixed fee is a much larger share of {money(idx.smallAmount)} than of {money(idx.headlineAmount)}, so a
              provider whose pricing is mostly a flat fee looks excellent on a large transfer and poor on a small one.{" "}
              <strong className="text-[var(--color-on-surface)]">{idx.worst!.name}</strong> is the clearest case:{" "}
              {idx.worst!.costHeadlinePct.toFixed(2)}% at {money(idx.headlineAmount)} — competitive — against{" "}
              {idx.worst!.costSmallPct.toFixed(2)}% at {money(idx.smallAmount)}, which is about{" "}
              ${idx.worst!.penaltyPer100.toFixed(2)} of extra cost on a {money(idx.smallAmount)} send.
              {idx.inverted.length > 0 && (
                <>
                  {" "}
                  The reverse also exists. {idx.inverted.map((r) => r.name).join(", ")}{" "}
                  {idx.inverted.length === 1 ? "is" : "are"} proportionally cheaper on the smaller transfer, which
                  usually means pricing weighted toward a percentage margin rather than a fixed fee.
                </>
              )}
            </p>
          </div>
        </Container>
      </section>

      {/* Methodology, including what we will not publish */}
      <section id="methodology" className="py-12 bg-[var(--color-surface-dim)] border-y border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-on-surface)] mb-4">Methodology</h2>
            <div className="space-y-4 text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
              <p>
                <strong className="text-[var(--color-on-surface)]">Cost definition.</strong> True total cost is the gap
                between what a transfer at the mid-market rate would deliver and what the provider actually delivers,
                as a percentage of the amount sent. It captures the upfront fee and the exchange-rate markup in one
                figure, and it is the same definition used by our{" "}
                <Link href="/remittance-cost-index" className="text-[var(--color-primary)] hover:underline">
                  Remittance Cost Index
                </Link>
                , computed by the same function — the two pages cannot disagree about what a transfer costs.
              </p>
              <p>
                <strong className="text-[var(--color-on-surface)]">Threshold.</strong> A provider appears only with{" "}
                {idx.minQuotesPerTier} or more usable quotes at <em>both</em> amounts, which is why{" "}
                {idx.providersCompared} providers are compared here rather than the larger number that quote at either
                one. Comparing a provider&rsquo;s tiers on a handful of quotes would produce a difference that is
                sampling noise.
              </p>
              <p>
                <strong className="text-[var(--color-on-surface)]">Why there is no {money(10000)} column.</strong>{" "}
                {idx.unsupportedTiers.map((tier) => tier.note).join(" ")} Publishing it would be a column of
                near-singletons presented as a comparison, so it is named here instead of shown.
              </p>
              <p>
                <strong className="text-[var(--color-on-surface)]">Limits.</strong> These are averages across every
                corridor a provider quotes, so a specific corridor can differ from the table — check your own before
                sending. Promotional first-transfer rates are excluded. Delivery speed is not measured. Coverage differs
                between tiers, so a provider dearer on small transfers may simply serve different corridors at each
                amount.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* What to do about it */}
      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-on-surface)] mb-3">
              What this means if you are sending
            </h2>
            <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
              A ranking priced at {money(idx.headlineAmount)} — including ours — is the wrong guide for a{" "}
              {money(idx.smallAmount)} transfer. If you send small amounts regularly, compare at the amount you actually
              send:{" "}
              <Link href="/" className="text-[var(--color-primary)] hover:underline">
                the comparison tool
              </Link>{" "}
              prices every provider at whatever you enter. To see who wins most often on your corridor rather than on
              average, use the{" "}
              <Link href="/provider-consistency" className="text-[var(--color-primary)] hover:underline">
                Provider Consistency Index
              </Link>
              , and for whether today is a good day at all, see{" "}
              <Link href="/sendscore" className="text-[var(--color-primary)] hover:underline">
                SendScore
              </Link>
              . All of our datasets are indexed on{" "}
              <Link href="/research" className="text-[var(--color-primary)] hover:underline">
                the research hub
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>

      <DataProvenance
        dataAsOf={REMITTANCE_INDEX.dataAsOf}
        computedFrom={`Every quote at ${money(idx.smallAmount)} and ${money(idx.headlineAmount)} in the archive is costed with the same function the Remittance Cost Index uses, then averaged per provider per tier. Providers below ${idx.minQuotesPerTier} quotes at either tier are excluded rather than shown with a noisy delta.`}
        csvHref={CSV_URL}
        sources={[
          {
            label: "SendMoneyCompare quote archive — every provider’s live quotes, recorded every six hours",
            href: "/methodology",
          },
          { label: "Remittance Cost Index — the same cost definition, priced at $1,000", href: "/remittance-cost-index" },
          { label: "How we review and rank providers", href: "/how-we-review" },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "SendMoneyCompare transfer cost by amount",
            description: `True total cost of sending ${money(idx.smallAmount)} against ${money(idx.headlineAmount)} internationally, for ${idx.providersCompared} money transfer providers priced at both amounts from live quotes.`,
            url: "https://sendmoneycompare.com/transfer-cost-by-amount",
            license: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
            creator: { "@type": "Organization", name: "SendMoneyCompare", url: "https://sendmoneycompare.com" },
            dateModified: REMITTANCE_INDEX.dataAsOf,
            variableMeasured: [
              `True total cost at ${money(idx.smallAmount)}`,
              `True total cost at ${money(idx.headlineAmount)}`,
              "Small-transfer penalty, percentage points",
            ],
            distribution: {
              "@type": "DataDownload",
              encodingFormat: "text/csv",
              contentUrl: `https://sendmoneycompare.com${CSV_URL}`,
            },
          }),
        }}
      />
    </>
  );
}
