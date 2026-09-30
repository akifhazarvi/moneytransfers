import BusinessProviderLogo from "@/components/business/BusinessProviderLogo";
import BusinessPartner from "@/components/business/BusinessPartner";
import InstallSlot from "@/components/pwa/InstallSlot";
import { seoDescription } from "@/lib/seo-title";
import { robotsFor } from "@/lib/seo-indexing";
import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
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
const author = getAuthor("ahsan-mukhtar");

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
const PROVIDER_COUNT = BUSINESS_PROVIDERS.length;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = `Best Business Payment Providers Compared (${asOfLong})`;
  const description = `In-depth comparison of ${PROVIDER_COUNT} business payment providers — Wise Business, OFX, Airwallex, Mercury, XE, Currencies Direct — on bulk payments, approval workflows, multi-currency accounts, API, KYC, limits and live FX cost. Banks cost ${idx.bankVsSpecialistMultiple}× more than specialists.`;
  return {
    title: { absolute: title },
    description: seoDescription(description),
    alternates: getAlternates(PATH, locale),
    // 2026-09-20: indexability is measured — robotsFor() consults the
    // duplication-derived allowlist. See scripts/build-indexable-routes.ts.
    robots: robotsFor("/business/compare"),
    ...(locale !== "en" && { robots: { index: false, follow: true } }),
    openGraph: { title, description, url: URL, type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: `Best international business payment providers compared (${idx.dataAsOf})`,
  description: `Feature-by-feature comparison of ${PROVIDER_COUNT} business payment providers across bulk payments, approvals, multi-currency accounts, API, KYC and live FX cost.`,
  // datePublished is required alongside dateModified; the page shipped only
  // the latter, so the Article item failed validation.
  datePublished: "2026-06-22",
  dateModified: idx.dataAsOf,
  author: { "@type": "Person", name: "Ahsan Mukhtar", url: `${SITE_URL}/about/ahsan-mukhtar` },
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
    a: `Start with the features your business needs, then compare eligible providers and request a quote. Our ${amt} benchmark averages ${idx.specialistAvgCostPct}% for specialists and ${idx.bankAvgCostPct}% for banks across tracked corridors. Those averages do not establish the best provider for your particular business.`,
  },
  {
    q: "Which providers support bulk payments and approval workflows?",
    a: `Wise, OFX, Airwallex, Mercury, XE and Currencies Direct list bulk/batch payments; Regency FX batch capability is not verified. Wise Business handles up to 1,000 payments per BatchTransfer, Airwallex up to 1,000 recipients per batch, XE up to 250 per mass-pay request, and OFX, Mercury and Currencies Direct via file upload or API. For approval controls, Mercury and Wise offer the most granular self-serve rules (Mercury enforces separation of duties so a creator can't approve their own payment); OFX and Airwallex support multi-layer approvals; XE and Currencies Direct are lighter or account-manager-led.`,
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
  unknown: { mark: "?", cls: "text-[var(--color-on-surface-muted)]" },
  full: { mark: "●", cls: "text-[var(--color-success,green)]" },
  partial: { mark: "◐", cls: "text-[var(--color-on-surface-variant)]" },
  none: { mark: "—", cls: "text-[var(--color-on-surface-muted)]" },
};

// ?workflow= is read by BusinessCompareTool after mount. Awaiting searchParams
// here made the page dynamic: it left the prerendered set, so check:links
// failed every link to it, and it lost the static render revalidate relies on.
export default async function BusinessComparePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="business-hero business-compare-hero"><Container>
        <p className="business-eyebrow">Business provider comparison</p>
        <h1>Find the right tools <br />for the way you pay.</h1>
        <p className="business-deck">Choose your payment needs. Compare {PROVIDER_COUNT} providers by feature match and measured cost.</p>
        <p className="business-small">By {author?.name ?? "Ahsan Mukhtar"} · cost data {asOfLong} · original feature inventory reviewed June 2026 · Regency FX checked 30 September 2026</p>
      </Container></section>

      {/* ─── Sticky in-page nav ─── */}
      <nav aria-label="Comparison sections" className="business-compare-nav">
        <Container>
          <div className="mx-auto flex max-w-5xl gap-5 overflow-x-auto py-3 text-2sm">
            {[
              ["#finder", "Find your match"],
              ["#matrix", "Feature matrix"],
              ["#profiles", "Provider profiles"],
              ["#cost", "Cost data"],
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
          <div id="finder" className="mt-2 scroll-mt-28">
            <BusinessCompareTool
              liveCosts={idx.specialistLeaderboard.map((p) => ({ slug: p.slug, avgCostPct: p.avgCostPct, corridorCount: p.corridorCount }))}
              amountLabel={amt}
            />
          </div>

          <BusinessPartner source="taptap_spotlight:business-compare" />
          <InstallSlot placement="business-after-finder" />

          {/* ── 02 · FEATURE MATRIX (static, for SEO + AI crawlers) ── */}
          <h2 id="matrix" className="mt-16 scroll-mt-28 text-2xl font-normal text-[var(--color-on-surface)]">
            <span className="mr-2 text-sm font-semibold text-[var(--color-primary)]">02</span>Feature comparison matrix</h2>
          <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
            ● = full support · ◐ = partial / plan-gated · — = not listed · ? = not verified. Open a cell for feature details and plan limits.
          </p>
          <div className="business-table-region" tabIndex={0} role="region" aria-label="Business feature comparison, scroll horizontally">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-[var(--color-outline)] text-left text-[var(--color-on-surface-variant)]">
                  <th className="py-2 pr-3 font-medium">Feature</th>
                  {BUSINESS_PROVIDERS.map((p) => (
                    <th key={p.slug} className="py-2 px-2 font-medium text-center whitespace-nowrap"><span className="business-matrix-brand"><BusinessProviderLogo slug={p.slug} compact />{p.name}</span></th>
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
                          <details className="business-matrix-detail"><summary aria-label={`${p.name}: ${f.label} — ${cell?.level === "full" ? "supported" : cell?.level === "partial" ? "limited support" : cell?.level === "unknown" ? "not verified" : "not listed"}`}><span className={`text-base ${s.cls}`} aria-hidden="true">{s.mark}</span></summary><p>{cell?.note || "Confirm availability with the provider."}</p></details>
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
                  <div className="business-profile-brand"><BusinessProviderLogo slug={p.slug} /><h3 className="text-xl font-medium text-[var(--color-on-surface)]">{p.name}</h3></div>
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

                {p.sources && <p className="mt-4 text-sm text-[var(--color-on-surface-variant)]">Sources checked {p.reviewedAt}: {p.sources.map((source, index) => <span key={source.url}>{index > 0 && " · "}<a href={source.url} target="_blank" rel="noopener noreferrer" className="underline">{source.label}</a></span>)}</p>}
                <div className="mt-4">
                  <Link
                    href={`/go/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="conversion-button conversion-button--accent"
                  >
                    Visit {p.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* LIVE COST — supporting evidence */}
          <h2 id="cost" className="mt-16 scroll-mt-28 text-2xl font-normal text-[var(--color-on-surface)]">
            <span className="mr-2 text-sm font-semibold text-[var(--color-primary)]">04</span>Measured FX costs: specialists vs banks</h2>
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
                      <Link href={`/companies/${p.slug}`} className="business-cost-brand text-sm text-[var(--color-on-surface)] hover:text-[var(--color-primary)]">
                        <BusinessProviderLogo slug={p.slug} compact /><span className="truncate">{p.name}</span>
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
                  Bar length shows average total cost (FX markup + fee) to send {amt}. The first row has the lowest measured average in this dataset.
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
          <h2 id="methodology" className="mt-12 text-2xl font-normal text-[var(--color-on-surface)]">How we compared these</h2>
          <div className="prose-content mt-3 space-y-3 text-[var(--color-on-surface-variant)] leading-relaxed">
            <p className="citable-passage">
              <strong>Features</strong> were verified against each provider&rsquo;s own business and pricing pages plus
              2026 third-party reviews (June 2026). We scoped the set to genuine business-FX / B2B-payment providers —
              Wise Business, OFX, Airwallex, Mercury, XE and Currencies Direct — because the question here is business
              payments, not consumer remittance. Regency FX was added on 30 September 2026 using its business, forward-contract and safeguarding pages plus company-supplied information. Unverified capabilities are labelled separately and receive no feature-match credit.
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
          <h2 id="faq" className="mt-16 scroll-mt-28 text-2xl font-normal text-[var(--color-on-surface)]">Business payment providers: questions answered</h2>
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
