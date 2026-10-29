import BusinessProviderLogo from "@/components/business/BusinessProviderLogo";
import { seoDescription } from "@/lib/seo-title";
import Link from "@/components/EligibleLink";
import Container from "@/components/Container";
import InstallSlot from "@/components/pwa/InstallSlot";
import BusinessBenchmark from "@/components/business/BusinessBenchmark";
import BusinessPartner from "@/components/business/BusinessPartner";
import { BUSINESS_JOURNEYS } from "@/data/business-journeys";
import { BUSINESS_FEATURES, BUSINESS_PROVIDERS } from "@/data/business-providers";
import { PageByline } from "@/components/PageByline";
import { pageUpdated } from "@/lib/content-dates";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { computeBusinessFxIndex, BUSINESS_AMOUNT } from "@/lib/business-fx-index";
const BFX = computeBusinessFxIndex();
const H1 = "International business payments: compare providers, costs and features";

/**
 * Round-4 brief §0.3 (worksheet 04): a summary of the /business/compare matrix
 * in this page's own HTML — features fully supported per provider and the
 * measured benchmark cost where we hold one. Read from the same data the
 * matrix renders, so the two cannot disagree.
 */
const MATRIX_SUMMARY = BUSINESS_PROVIDERS.map((p) => {
  const full = BUSINESS_FEATURES.filter((f) => p.features[f.key]?.level === "full").length;
  const partial = BUSINESS_FEATURES.filter((f) => p.features[f.key]?.level === "partial").length;
  const cost = BFX.specialistLeaderboard.find((r) => r.slug === p.slug && !r.isIndicative);
  const quoteOnly = BFX.indicativeProviders.some((r) => r.slug === p.slug);
  return { slug: p.slug, name: p.name, full, partial, cost: cost ? `${cost.avgCostPct.toFixed(2)}%` : quoteOnly ? "Quote on request" : "Not measured" };
});
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const year = new Date().getFullYear();
  return {
    // Was 77 chars: "Providers (2026)" — the qualifier that matters — fell
    // outside the rendered length.
    title:
      `B2B International Payments — Compare Providers (${year})`,
    description:
      seoDescription("Compare business payment providers by features, eligibility and observed FX costs. Explore supplier payments, batch payouts and business transfer guides."),
    keywords:
      `b2b international payments, business international payments, business money transfer international, business fx payments, bulk international payments, international business payments ${year}, b2b money transfer, business bank transfer abroad`,
    alternates: getAlternates("business", locale),
    openGraph: {
      title:
        `International Business Payments — Compare Providers & Fees (${year})`,
      description:
        `Compare the cheapest ways to make international business payments. We measure banks at ${BFX.bankAvgCostPct.toFixed(2)}% against specialists at ${BFX.specialistAvgCostPct.toFixed(2)}% on a $${BUSINESS_AMOUNT.toLocaleString()} payment.`,
      url: "https://sendmoneycompare.com/business",
      images: DEFAULT_OG_IMAGES,
    },
  };
}

export default async function BusinessHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
    { "@type": "ListItem", position: 2, name: "Business payments", item: "https://sendmoneycompare.com/business" },
  ] };
  // The visible "By Ahsan Mukhtar" byline, machine-readable. A hub is a
  // WebPage, not an Article, and it has no content date of its own (none in
  // content-dates.ts), so none is claimed here. The Person and Organization are
  // declared on /about and in the layout; referenced by @id, not re-typed.
  const webPage = { "@context": "https://schema.org", "@type": "WebPage", name: H1, url: "https://sendmoneycompare.com/business", dateModified: pageUpdated("/business"),
    author: { "@type": "Person", "@id": "https://sendmoneycompare.com/about/ahsan-mukhtar#person", name: "Ahsan Mukhtar", url: "https://sendmoneycompare.com/about/ahsan-mukhtar" },
    publisher: { "@id": "https://sendmoneycompare.com/#organization" } };
  return <>
    <link rel="author" href="/about/ahsan-mukhtar" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />
    <section className="business-hero"><Container><div className="business-hero-grid">
      <div><p className="business-eyebrow">International business payments</p><h1>{H1}</h1><p className="business-deck">Compare costs, payment tools and account requirements. Build a shortlist around your business.</p>
        <div className="business-actions"><Link href="/business/compare#finder" className="conversion-button conversion-button--accent">Compare business providers <span aria-hidden="true">→</span></Link><a href="#business-guides" className="business-text-link">Explore payment guides</a></div>
        <p className="business-small">Free comparison · {BUSINESS_PROVIDERS.length} provider profiles · No account needed</p>
        <div className="mt-3"><PageByline authorSlug="ahsan-mukhtar" updated={pageUpdated("/business")} cadence={null} /></div>
      </div><BusinessBenchmark index={BFX} />
    </div></Container></section>
    <Container>
      <section className="business-provider-directory" aria-labelledby="business-providers-title"><h2 id="business-providers-title">Explore business payment providers</h2><p>Compare features and account requirements, including Regency FX for assisted business transfers.</p><div>{BUSINESS_PROVIDERS.map(p => <Link href={`/business/compare#${p.slug}`} key={p.slug}><BusinessProviderLogo slug={p.slug} /><span>{p.name}</span></Link>)}</div></section>
      <section className="business-section" aria-labelledby="business-how-compare">
        <div className="business-section-heading"><p className="business-eyebrow">How to compare</p><h2 id="business-how-compare">Comparing business payment providers on cost, tools and eligibility</h2></div>
        <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
          <p>
            {`A business pays for an international payment in three places: the margin a provider adds to the exchange rate, the transfer fee, and any plan or account fee for the tools a finance team needs. The first is the largest and the least visible. On our benchmark of a $${BUSINESS_AMOUNT.toLocaleString("en-US")} payment across ${BFX.corridorCount} business corridors, banks cost ${BFX.bankAvgCostPct.toFixed(2)}% of the amount on average and the specialists we measure ${BFX.specialistAvgCostPct.toFixed(2)}%, before plan fees.`}
          </p>
          <p>
            Price is only the first filter. A company paying many suppliers needs batch uploads and an approval step, an
            exporter invoicing in several currencies needs a multi-currency account with local details, and a team running
            payments from its own software needs an API and an accounting sync. Account managers and forward contracts matter
            once single payments run into tens of thousands. Eligibility comes last but rules providers out: most require a
            registered company, verify its owners and directors, and limit which countries they serve.
          </p>
          <p>
            {`The table below summarises how many of the ${BUSINESS_FEATURES.length} features in our matrix each provider supports in full, from each provider's own published terms, with the measured cost where we hold one. The full matrix, with a note and source for every cell, is on the `}
            <Link href="/business/compare#matrix">comparison page</Link>.
          </p>
        </div>
        <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--color-outline)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-surface-dim)] text-left text-[var(--color-on-surface-variant)]">
                <th scope="col" className="px-4 py-2.5 font-medium">Provider</th>
                <th scope="col" className="px-4 py-2.5 font-medium text-right">{`Features in full (of ${BUSINESS_FEATURES.length})`}</th>
                <th scope="col" className="px-4 py-2.5 font-medium text-right">Limited</th>
                <th scope="col" className="px-4 py-2.5 font-medium text-right">{`Measured cost on $${BUSINESS_AMOUNT.toLocaleString("en-US")}`}</th>
              </tr>
            </thead>
            <tbody>
              {MATRIX_SUMMARY.map((row) => (
                <tr key={row.slug} className="border-t border-[var(--color-outline)]">
                  <th scope="row" className="px-4 py-2.5 text-left font-normal"><Link href={`/business/compare#${row.slug}`}>{row.name}</Link></th>
                  <td className="px-4 py-2.5 text-right tabular-nums">{row.full}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{row.partial}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section id="business-guides" className="business-section">
        <div className="business-section-heading"><p className="business-eyebrow">Start with the job to be done</p><h2>What does your business need to pay?</h2><p>Choose a workflow to find the questions worth asking.</p></div>
        <div className="business-task-grid">{BUSINESS_JOURNEYS.map((j, i) => <Link href={`/business/${j.slug}`} key={j.slug} className="business-task-card"><div><span>0{i + 1}</span><span aria-hidden="true">↗</span></div><h3>{j.title}</h3><p>{j.description}</p><span className="business-card-link">Explore this workflow →</span></Link>)}</div>
      </section>
      <InstallSlot placement="business-after-benchmark" />
      <section className="business-section business-decisions" aria-labelledby="business-decisions-title">
        <div className="business-section-heading"><p className="business-eyebrow">Cost is one part of the decision</p><h2 id="business-decisions-title">Compare the whole payment workflow.</h2></div>
        <div className="business-decision-grid">{[
          ["01", "What arrives", "Compare the recipient amount after fees and exchange rate markup. Request a quote for your actual currencies and amount."],
          ["02", "How your team pays", "Check batch uploads, approval roles, accounting connections and API access against your process."],
          ["03", "Whether you can use it", "Confirm company eligibility, supported destinations, verification documents and payment limits directly with the provider."],
        ].map(([n, title, text]) => <div key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></div>)}</div>
      </section>
      <section className="business-section business-trust" aria-labelledby="business-research-title"><div><p className="business-eyebrow">Research you can inspect</p><h2 id="business-research-title">See what sits behind the shortlist.</h2><p>Our cost benchmark uses observed quotes. Feature profiles are a separate editorial comparison; their review date and provider details are shown in the tool.</p><p className="business-small">By <Link href="/about/ahsan-mukhtar">Ahsan Mukhtar</Link> · <Link href="/editorial-policy">Editorial policy</Link></p></div><div className="business-evidence-links"><Link href="/business/compare#matrix">Compare payment features <span>→</span></Link><Link href="/business/compare#cost">Inspect the cost benchmark <span>→</span></Link><Link href="/methodology">Read our methodology <span>→</span></Link></div></section>
      <section className="business-section business-faq" aria-labelledby="business-faq-title"><h2 id="business-faq-title">Before you choose a provider</h2>{[
        ["Is the lowest benchmark cost the best choice for my business?", "Not necessarily. The benchmark averages observed costs across routes at a fixed amount. Your currencies, volume, eligibility and required payment tools may lead to a different shortlist."],
        ["Can I complete a payment on this website?", "No. Use this site to compare and research. Account opening, verification and payment take place with your chosen provider."],
        ["What should I prepare before asking for a quote?", "Have your sending and receiving currencies, amount, payment deadline and recipient type ready. Check the provider’s business verification requirements before committing to a time-sensitive payment."],
      ].map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
      {/* Sponsored, below the hub's own content (round-4 brief §0.3). */}
      <BusinessPartner source="taptap_spotlight:business-hub" />
      <details className="business-more-research"><summary>More business payment research and routes</summary><div className="business-research-links">{[
        ["business-international-payments-guide", "International business payments guide"], ["exchange-rate-markup-explained", "Exchange rate markup explained"], ["multi-currency-accounts-exchange-rates", "Multi-currency accounts"], ["lowest-fx-fees-business-payments-2026", "Business FX fee research"], ["how-to-pay-international-suppliers", "Paying international suppliers"], ["international-payroll-pay-remote-teams", "International payroll"], ["wire-transfer-guide", "Wire transfer guide"],
        ["business-payments-usa-to-uk", "US to UK business payments"], ["business-payments-usa-to-india", "US to India business payments"], ["business-payments-usa-to-europe", "US to Europe business payments"], ["business-payments-usa-to-mexico", "US to Mexico business payments"], ["business-payments-usa-to-canada", "US to Canada business payments"], ["business-payments-uk-to-europe", "UK to Europe business payments"], ["business-payments-uk-to-india", "UK to India business payments"], ["business-payments-usa-to-philippines", "US to Philippines business payments"], ["business-payments-usa-to-china", "US to China business payments"],
      ].map(([slug, title]) => <Link href={`/guides/${slug}`} key={slug}>{title} →</Link>)}</div></details>
      <div className="business-next-step"><div><p className="business-eyebrow">Your next step</p><h2>Build a shortlist that fits your business.</h2><p>Select your requirements and compare the matching features.</p></div><Link className="conversion-button conversion-button--accent" href="/business/compare#finder">Find my provider shortlist →</Link></div>
    </Container>
  </>;
}
