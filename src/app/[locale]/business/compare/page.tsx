import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import { getAlternates } from "@/lib/i18n-metadata";
import { getAuthor } from "@/data/authors";
import { computeBusinessFxIndex, BUSINESS_AMOUNT } from "@/lib/business-fx-index";
import {
  BUSINESS_PROVIDERS,
  BUSINESS_FEATURES,
  type Support,
} from "@/data/business-providers";
import BusinessCompareTool from "@/components/BusinessCompareTool";

const SITE_URL = "https://sendmoneycompare.com";
const PATH = "business/compare";
const URL = `${SITE_URL}/${PATH}`;

// Live cost figures, computed at build from the same scrape that refreshes every
// 6h. Cited directly so published numbers never drift from the data. See
// src/lib/business-fx-index.ts for methodology.
const idx = computeBusinessFxIndex(BUSINESS_AMOUNT);
const author = getAuthor("akif-hazarvi");

// Revalidate hourly so figures stay fresh while the page stays fully prerendered
// (no per-request no-store — the May 2026 deindex root cause).
export const revalidate = 3600;

const asOfLong = new Date(idx.dataAsOf + "T00:00:00Z").toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const amt = `$${idx.amount.toLocaleString()}`;
const cheapest = idx.specialistLeaderboard[0];
const PROVIDER_COUNT = BUSINESS_PROVIDERS.length;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = `Best Business Payment Providers Compared (${asOfLong})`;
  const description = `In-depth comparison of ${PROVIDER_COUNT} business payment providers — Wise Business, OFX, Airwallex, Mercury, XE, Currencies Direct — on bulk payments, approval workflows, multi-currency accounts, API, KYC, limits and live FX cost. Banks cost ${idx.bankVsSpecialistMultiple}× more than specialists.`;
  return {
    title: { absolute: title },
    description,
    alternates: getAlternates(PATH, locale),
    ...(locale !== "en" && { robots: { index: false, follow: true } }),
    openGraph: { title, description, url: URL, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: `Best international business payment providers compared (${idx.dataAsOf})`,
  description: `Feature-by-feature comparison of ${PROVIDER_COUNT} business payment providers across bulk payments, approvals, multi-currency accounts, API, KYC and live FX cost.`,
  dateModified: idx.dataAsOf,
  author: { "@type": "Person", name: "Akif Hazarvi", url: `${SITE_URL}/about/akif-hazarvi` },
  publisher: { "@id": `${SITE_URL}/#organization` },
  mainEntityOfPage: URL,
  isBasedOn: `${SITE_URL}/api/data/business-fx-cost`,
};

const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "SendMoneyCompare Business Payment Provider Comparison",
  description: `Per-corridor true cost (FX markup + fee) of sending ${amt} for business across ${idx.corridorCount} corridors, plus a feature matrix for ${PROVIDER_COUNT} providers. Updated from live quotes every 6 hours.`,
  url: URL,
  creator: { "@id": `${SITE_URL}/#organization` },
  dateModified: idx.dataAsOf,
  license: "https://creativecommons.org/licenses/by/4.0/",
  distribution: [
    { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: `${SITE_URL}/api/data/business-fx-cost` },
  ],
};

const faqs = [
  {
    q: "What is the best provider for international business payments?",
    a: `It depends on your priority. For the lowest visible FX cost and clean self-serve batch + approvals, ${cheapest?.name ?? "Wise Business"} leads — our live data shows specialists average ${idx.specialistAvgCostPct}% on a ${amt} transfer versus ${idx.bankAvgCostPct}% for banks. For large or recurring transfers with hedging and a dedicated dealer, OFX, XE or Currencies Direct fit better. For a US startup wanting banking plus bill-pay approvals, Mercury; for an eCommerce/SaaS business wanting global accounts plus cards plus API, Airwallex.`,
  },
  {
    q: "Which providers support bulk payments and approval workflows?",
    a: `All six support bulk/batch payments. Wise Business handles up to 1,000 payments per BatchTransfer, Airwallex up to 1,000 recipients per batch, XE up to 250 per mass-pay request, and OFX, Mercury and Currencies Direct via file upload or API. For approval controls, Mercury and Wise offer the most granular self-serve rules (Mercury enforces separation of duties so a creator can't approve their own payment); OFX and Airwallex support multi-layer approvals; XE and Currencies Direct are lighter or account-manager-led.`,
  },
  {
    q: "Are these providers safe and regulated for business money?",
    a: `Yes — each is regulated and safeguards client funds. OFX is overseen by ~50 regulators (FCA, FINTRAC, AUSTRAC) and registered with FinCEN; XE is triple-regulated (FCA, ASIC, FinCEN); Currencies Direct is FCA-authorised; Wise and Airwallex hold multiple local licences and safeguard funds in segregated Tier-1 accounts. Mercury is a fintech, not a bank — deposits sit with partner banks (Members FDIC) with up to $5M coverage via a sweep network. None of the FX specialists offer bank deposit insurance; they ringfence client money instead.`,
  },
  {
    q: "How much cheaper are specialists than banks for business FX?",
    a: `On the corridors we measure live, sending ${amt} costs ${idx.specialistAvgCostPct}% on average through a business-FX specialist versus ${idx.bankAvgCostPct}% through a high-street bank — making banks roughly ${idx.bankVsSpecialistMultiple}× more expensive. The gap is almost entirely the exchange-rate markup banks build into the rate, which stays hidden behind "no fee" wording.`,
  },
];
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const SUPPORT_MARK: Record<Support, { mark: string; cls: string }> = {
  full: { mark: "●", cls: "text-[var(--color-success,green)]" },
  partial: { mark: "◐", cls: "text-[var(--color-on-surface-variant)]" },
  none: { mark: "—", cls: "text-[var(--color-on-surface-muted)]" },
};

export default async function BusinessComparePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ─── HERO BAND: the tool IS the thesis ─── */}
      <section className="border-b border-[var(--color-outline)] bg-[var(--color-primary-surface)]">
        <Container>
          <div className="mx-auto max-w-5xl py-8">
            <nav className="text-2sm text-[var(--color-on-surface-variant)]">
              <Link href="/business" className="hover:text-[var(--color-primary)]">Business</Link>
              <span className="mx-1.5">›</span>
              <span>Provider comparison</span>
            </nav>

            <div className="mt-4 grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:items-end">
              <div>
                <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                  Live B2B payments tool
                </p>
                <h1 className="mt-2 text-[clamp(1.7rem,4.5vw,2.8rem)] font-normal leading-[1.08] tracking-[-0.015em] text-[var(--color-on-surface)]">
                  Pick the right business<br className="hidden sm:block" /> payment provider in 30 seconds
                </h1>
                <p className="mt-3 max-w-xl text-md text-[var(--color-on-surface-variant)] leading-relaxed">
                  Tell us what your business needs — bulk payouts, approvals, hedging, an API — and we rank{" "}
                  {PROVIDER_COUNT} providers live by fit and current FX cost. Verified features, real quotes.
                </p>
                <p className="mt-3 text-2sm text-[var(--color-on-surface-muted)]">
                  By {author?.name ?? "Akif Hazarvi"} · cost data {asOfLong} · features verified June 2026
                </p>
              </div>

              {/* Proof stat — banks vs specialists, the one number that frames everything */}
              <div className="rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] p-5">
                <p className="text-2xs font-medium uppercase tracking-wide text-[var(--color-on-surface-variant)]">
                  On a {amt} transfer, today
                </p>
                <div className="mt-3 flex items-end gap-4">
                  <div>
                    <div className="text-3xl font-semibold leading-none text-[var(--color-success)]">{idx.specialistAvgCostPct}%</div>
                    <div className="mt-1 text-2xs text-[var(--color-on-surface-variant)]">specialist avg</div>
                  </div>
                  <div className="pb-1 text-[var(--color-on-surface-muted)]">vs</div>
                  <div>
                    <div className="text-3xl font-semibold leading-none text-[var(--color-on-surface)]">{idx.bankAvgCostPct}%</div>
                    <div className="mt-1 text-2xs text-[var(--color-on-surface-variant)]">bank avg</div>
                  </div>
                </div>
                <p className="mt-3 border-t border-[var(--color-outline)] pt-3 text-2sm text-[var(--color-on-surface)]">
                  Banks cost <strong className="text-[var(--color-primary)]">{idx.bankVsSpecialistMultiple}× more</strong>. Cheapest live:{" "}
                  <strong>{cheapest?.name}</strong>.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Sticky in-page nav ─── */}
      <nav className="sticky top-[var(--header-height,56px)] z-10 border-b border-[var(--color-outline)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] backdrop-blur">
        <Container>
          <div className="mx-auto flex max-w-5xl gap-5 overflow-x-auto py-3 text-2sm">
            {[
              ["#finder", "Find your match"],
              ["#matrix", "Feature matrix"],
              ["#profiles", "Provider profiles"],
              ["#cost", "Live FX cost"],
              ["#faq", "FAQ"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="whitespace-nowrap text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]">
                {label}
              </a>
            ))}
          </div>
        </Container>
      </nav>

      <Container>
        <article className="mx-auto max-w-5xl py-10">
          {/* ── 01 · INTERACTIVE FINDER ── */}
          <p className="text-sm font-semibold text-[var(--color-primary)]">01</p>
          <div id="finder" className="mt-2 scroll-mt-28">
            <BusinessCompareTool
              liveCosts={idx.specialistLeaderboard.map((p) => ({ slug: p.slug, avgCostPct: p.avgCostPct, corridorCount: p.corridorCount }))}
              amountLabel={amt}
            />
          </div>

          {/* ── 02 · FEATURE MATRIX (static, for SEO + AI crawlers) ── */}
          <h2 id="matrix" className="mt-16 scroll-mt-28 text-2xl font-normal text-[var(--color-on-surface)]">
            <span className="mr-2 text-sm font-semibold text-[var(--color-primary)]">02</span>Feature comparison matrix</h2>
          <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
            ● = full support · ◐ = partial / plan-gated · — = not offered. Hover a row label for why it matters.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-[var(--color-outline)] text-left text-[var(--color-on-surface-variant)]">
                  <th className="py-2 pr-3 font-medium">Feature</th>
                  {BUSINESS_PROVIDERS.map((p) => (
                    <th key={p.slug} className="py-2 px-2 font-medium text-center whitespace-nowrap">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BUSINESS_FEATURES.map((f) => (
                  <tr key={f.key} className="border-b border-[var(--color-outline)]">
                    <td className="py-2.5 pr-3 text-[var(--color-on-surface)]" title={f.why}>
                      <span className="border-b border-dotted border-[var(--color-outline)] cursor-help">{f.label}</span>
                    </td>
                    {BUSINESS_PROVIDERS.map((p) => {
                      const cell = p.features[f.key];
                      const s = SUPPORT_MARK[cell?.level ?? "none"];
                      return (
                        <td key={p.slug} className="py-2.5 px-2 text-center" title={cell?.note || ""}>
                          <span className={`text-base ${s.cls}`}>{s.mark}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DEEP PROVIDER PROFILES */}
          <h2 id="profiles" className="mt-16 scroll-mt-28 text-2xl font-normal text-[var(--color-on-surface)]">
            <span className="mr-2 text-sm font-semibold text-[var(--color-primary)]">03</span>Provider profiles</h2>
          <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
            The detail behind the matrix — pricing, speed, reach, limits, KYC and the use cases each provider is genuinely built for.
          </p>
          <div className="mt-5 space-y-6">
            {BUSINESS_PROVIDERS.map((p) => (
              <div key={p.slug} id={p.slug} className="rounded-2xl border border-[var(--color-outline)] p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-xl font-medium text-[var(--color-on-surface)]">{p.name}</h3>
                  {p.hasReview && (
                    <Link href={`/companies/${p.slug}`} className="text-sm text-[var(--color-primary)] hover:underline">
                      Read full review →
                    </Link>
                  )}
                </div>
                <p className="mt-1 text-[var(--color-on-surface-variant)]">{p.tagline}</p>
                <p className="mt-2 text-sm text-[var(--color-on-surface)]"><strong>Best for:</strong> {p.bestFor}</p>

                {/* Quick spec grid */}
                <dl className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2 text-sm">
                  <div><dt className="inline font-medium text-[var(--color-on-surface)]">Pricing: </dt><dd className="inline text-[var(--color-on-surface-variant)]">{p.facts.pricing}</dd></div>
                  <div><dt className="inline font-medium text-[var(--color-on-surface)]">Speed: </dt><dd className="inline text-[var(--color-on-surface-variant)]">{p.facts.speed}</dd></div>
                  <div><dt className="inline font-medium text-[var(--color-on-surface)]">Reach: </dt><dd className="inline text-[var(--color-on-surface-variant)]">{p.facts.reach}</dd></div>
                  <div><dt className="inline font-medium text-[var(--color-on-surface)]">Minimum: </dt><dd className="inline text-[var(--color-on-surface-variant)]">{p.facts.minimum}</dd></div>
                  <div><dt className="inline font-medium text-[var(--color-on-surface)]">Batch limit: </dt><dd className="inline text-[var(--color-on-surface-variant)]">{p.facts.batchLimit}</dd></div>
                  <div><dt className="inline font-medium text-[var(--color-on-surface)]">Eligibility: </dt><dd className="inline text-[var(--color-on-surface-variant)]">{p.facts.eligibility}</dd></div>
                </dl>

                {/* Use cases + industries */}
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-on-surface)]">Common use cases</p>
                    <ul className="mt-1 list-disc pl-5 text-sm text-[var(--color-on-surface-variant)] space-y-0.5">
                      {p.useCases.map((u) => <li key={u}>{u}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-on-surface)]">Used most by</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {p.industries.map((ind) => (
                        <span key={ind} className="rounded-full bg-[var(--color-surface-dim)] border border-[var(--color-outline)] px-2.5 py-1 text-xs text-[var(--color-on-surface-variant)]">{ind}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pros / cons */}
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-on-surface)]">Strengths</p>
                    <ul className="mt-1 space-y-0.5 text-sm text-[var(--color-on-surface-variant)]">
                      {p.pros.map((pro) => <li key={pro}>+ {pro}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-on-surface)]">Watch-outs</p>
                    <ul className="mt-1 space-y-0.5 text-sm text-[var(--color-on-surface-variant)]">
                      {p.cons.map((con) => <li key={con}>− {con}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Trust / KYC / limits / fraud */}
                <details className="mt-4 group">
                  <summary className="cursor-pointer text-sm font-medium text-[var(--color-primary)]">
                    Compliance, KYC, limits &amp; security
                  </summary>
                  <dl className="mt-2 space-y-1.5 text-sm">
                    <div><dt className="inline font-medium text-[var(--color-on-surface)]">Regulation: </dt><dd className="inline text-[var(--color-on-surface-variant)]">{p.trust.regulators}</dd></div>
                    <div><dt className="inline font-medium text-[var(--color-on-surface)]">KYC / onboarding: </dt><dd className="inline text-[var(--color-on-surface-variant)]">{p.trust.kyc}</dd></div>
                    <div><dt className="inline font-medium text-[var(--color-on-surface)]">Limits: </dt><dd className="inline text-[var(--color-on-surface-variant)]">{p.trust.limits}</dd></div>
                    <div><dt className="inline font-medium text-[var(--color-on-surface)]">Fraud &amp; security: </dt><dd className="inline text-[var(--color-on-surface-variant)]">{p.trust.fraud}</dd></div>
                    <div><dt className="inline font-medium text-[var(--color-on-surface)]">Funds protection: </dt><dd className="inline text-[var(--color-on-surface-variant)]">{p.trust.fundsProtection}</dd></div>
                  </dl>
                </details>

                <div className="mt-4">
                  <Link
                    href={`/go/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-block rounded-full bg-[var(--color-cta)] px-5 py-2 text-sm font-semibold text-[var(--color-cta-text)] shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-primary-lg)] transition-all"
                  >
                    Visit {p.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* LIVE COST — supporting evidence */}
          <h2 id="cost" className="mt-16 scroll-mt-28 text-2xl font-normal text-[var(--color-on-surface)]">
            <span className="mr-2 text-sm font-semibold text-[var(--color-primary)]">04</span>Live FX cost: specialists vs banks</h2>
          <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
            Ranked by average true cost (FX markup + fees) of sending {amt} across {idx.corridorCount} corridors where we
            hold a live quote, as of {asOfLong}. Lower is cheaper. This is computed, not editorial — it refreshes every 6 hours.
          </p>
          {/* Cost spectrum — each provider's cost as a position on a shared track,
              with the bank average as the reference line they all beat. */}
          {(() => {
            const scaleMax = Math.max(idx.bankAvgCostPct, ...idx.specialistLeaderboard.map((p) => p.avgCostPct)) * 1.1;
            const pct = (v: number) => `${Math.max(2, (v / scaleMax) * 100)}%`;
            return (
              <div className="mt-5 rounded-2xl border border-[var(--color-outline)] p-5">
                <div className="relative space-y-2.5">
                  {idx.specialistLeaderboard.map((p, i) => (
                    <div key={p.slug} className="grid grid-cols-[8.5rem_1fr_3rem] items-center gap-3">
                      <Link href={`/companies/${p.slug}`} className="truncate text-sm text-[var(--color-on-surface)] hover:text-[var(--color-primary)]">
                        <span className="mr-1.5 text-[var(--color-on-surface-muted)]">{i + 1}</span>{p.name}
                      </Link>
                      <div className="h-6 rounded-full bg-[var(--color-surface-dim)]">
                        <div
                          className="flex h-6 items-center rounded-full bg-[var(--color-success)] transition-all"
                          style={{ width: pct(p.avgCostPct), opacity: 0.55 + (i === 0 ? 0.45 : 0.25 - Math.min(0.2, i * 0.03)) }}
                        />
                      </div>
                      <span className="text-right text-sm font-medium tabular-nums text-[var(--color-on-surface)]">{p.avgCostPct}%</span>
                    </div>
                  ))}
                </div>
                {/* Bank reference line */}
                <div className="mt-4 grid grid-cols-[8.5rem_1fr_3rem] items-center gap-3 border-t border-dashed border-[var(--color-outline)] pt-4">
                  <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">Bank average</span>
                  <div className="h-6 rounded-full bg-[var(--color-surface-dim)]">
                    <div className="h-6 rounded-full bg-[var(--color-on-surface-variant)]" style={{ width: pct(idx.bankAvgCostPct), opacity: 0.45 }} />
                  </div>
                  <span className="text-right text-sm font-medium tabular-nums text-[var(--color-on-surface-variant)]">{idx.bankAvgCostPct}%</span>
                </div>
                <p className="mt-3 text-2xs text-[var(--color-on-surface-muted)]">
                  Bar length = average true cost (FX markup + fee) to send {amt}. Each specialist beats the bank benchmark; cheapest is highlighted.
                </p>
              </div>
            );
          })()}

          {/* CSV download */}
          <div className="mt-8 rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-dim)] p-5">
            <h2 className="text-lg font-medium text-[var(--color-on-surface)]">Download the cost data</h2>
            <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
              The full per-corridor cost table behind these figures, as a CSV. Free to use with attribution to SendMoneyCompare.
            </p>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages --
                This targets an /api/data CSV endpoint, not a page. next/link would
                client-side navigate instead of letting the browser download it. */}
            <a
              href="/api/data/business-fx-cost"
              className="mt-3 inline-block rounded-full bg-[var(--color-surface)] ring-1 ring-[var(--color-outline)] px-5 py-2.5 text-sm font-semibold text-[var(--color-on-surface)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all"
            >
              Download CSV ({idx.dataAsOf})
            </a>
          </div>

          {/* Methodology */}
          <h2 className="mt-12 text-2xl font-normal text-[var(--color-on-surface)]">How we compared these</h2>
          <div className="prose-content mt-3 space-y-3 text-[var(--color-on-surface-variant)] leading-relaxed">
            <p className="citable-passage">
              <strong>Features</strong> were verified against each provider&rsquo;s own business and pricing pages plus
              2026 third-party reviews (June 2026). We scoped the set to genuine business-FX / B2B-payment providers —
              Wise Business, OFX, Airwallex, Mercury, XE and Currencies Direct — because the question here is business
              payments, not consumer remittance.
            </p>
            <p className="citable-passage">
              <strong>Cost</strong> is computed live: we collect quotes for the same {amt} payment on the same corridor
              every 6 hours and measure the true total cost as the gap between the mid-market receive amount and the
              actual receive amount after FX markup and fees —
            </p>
            <p className="rounded-xl bg-[var(--color-surface-dim)] px-4 py-3 font-mono text-sm text-[var(--color-on-surface)]">
              true cost % = (mid-market receive − actual receive) ÷ mid-market receive × 100
            </p>
            <p>
              Cost varies by amount: above ~$10,000, account-managed brokers (OFX, XE, Currencies Direct) can beat the
              headline figures through negotiated rates and waived fees. Compliance and KYC details reflect published
              requirements and can change — always confirm onboarding requirements with the provider for your jurisdiction.
              Always pull a live quote for your exact amount and corridor before committing.
            </p>
          </div>

          {/* FAQ */}
          <h2 id="faq" className="mt-16 scroll-mt-28 text-2xl font-normal text-[var(--color-on-surface)]">Frequently asked questions</h2>
          <div className="mt-4 space-y-5">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="text-base font-medium text-[var(--color-on-surface)]">{f.q}</h3>
                <p className="mt-1.5 text-[var(--color-on-surface-variant)] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>

          {/* Internal links */}
          <div className="mt-8 rounded-2xl border border-[var(--color-outline)] p-5">
            <h2 className="text-base font-medium text-[var(--color-on-surface)]">Go deeper</h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li><Link href="/guides/business-international-payments-guide" className="text-[var(--color-primary)] hover:underline">The complete guide to international business payments</Link></li>
              <li><Link href="/guides/how-to-pay-international-suppliers" className="text-[var(--color-primary)] hover:underline">How to pay international suppliers (step by step)</Link></li>
              <li><Link href="/guides/bank-vs-app-transfer-cost-2026" className="text-[var(--color-primary)] hover:underline">Bank vs App: the full cost index</Link></li>
              <li><Link href="/send-money" className="text-[var(--color-primary)] hover:underline">Compare live rates for your exact business transfer</Link></li>
            </ul>
          </div>
        </article>
      </Container>
    </>
  );
}
