import { seoDescription } from "@/lib/seo-title";
import Link from "next/link";
import Container from "@/components/Container";
import InstallSlot from "@/components/pwa/InstallSlot";
import BusinessBenchmark from "@/components/business/BusinessBenchmark";
import BusinessPartner from "@/components/business/BusinessPartner";
import { BUSINESS_JOURNEYS } from "@/data/business-journeys";
import { BUSINESS_PROVIDERS } from "@/data/business-providers";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { computeBusinessFxIndex, BUSINESS_AMOUNT } from "@/lib/business-fx-index";
const BFX = computeBusinessFxIndex();
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
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    <section className="business-hero"><Container><div className="business-hero-grid">
      <div><p className="business-eyebrow">International business payments</p><h1>Find a better fit<br />for the way you pay.</h1><p className="business-deck">Compare costs, payment tools and account requirements. Build a shortlist around your business.</p>
        <div className="business-actions"><Link href="/business/compare#finder" className="conversion-button conversion-button--accent">Compare business providers <span aria-hidden="true">→</span></Link><a href="#business-guides" className="business-text-link">Explore payment guides</a></div>
        <p className="business-small">Free comparison · {BUSINESS_PROVIDERS.length} provider profiles · No account needed</p>
      </div><BusinessBenchmark index={BFX} />
    </div></Container></section>
    <Container>
      <section id="business-guides" className="business-section">
        <div className="business-section-heading"><p className="business-eyebrow">Start with the job to be done</p><h2>What does your business need to pay?</h2><p>Choose a workflow to find the questions worth asking.</p></div>
        <div className="business-task-grid">{BUSINESS_JOURNEYS.map((j, i) => <Link href={`/business/${j.slug}`} key={j.slug} className="business-task-card"><div><span>0{i + 1}</span><span aria-hidden="true">↗</span></div><h3>{j.title}</h3><p>{j.description}</p><span className="business-card-link">Explore this workflow →</span></Link>)}</div>
      </section>
      <BusinessPartner source="taptap_spotlight:business-hub" />
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
      <div className="business-next-step"><div><p className="business-eyebrow">Your next step</p><h2>Build a shortlist that fits your business.</h2><p>Select your requirements and compare the matching features.</p></div><Link className="conversion-button conversion-button--accent" href="/business/compare#finder">Find my provider shortlist →</Link></div>
    </Container>
  </>;
}
