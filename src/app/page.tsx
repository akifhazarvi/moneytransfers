import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import Card from "@/components/Card";
import PrimaryButton from "@/components/PrimaryButton";
import ComparisonWidget from "@/components/ComparisonWidget";
import RatingBadge from "@/components/RatingBadge";
import BestTransferToday from "@/components/BestTransferToday";
import { providers } from "@/data/providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Money Transfer Services — Best Exchange Rates & Lowest Fees | MoneyTransfers",
  description:
    "Compare exchange rates and fees from Wise, Remitly, Western Union, MoneyGram, Revolut and 60+ more providers. Find the cheapest way to send money internationally with real-time rates updated every 6 hours.",
  keywords:
    "money transfer comparison, best exchange rates, international money transfer, send money abroad, cheapest way to send money, remittance comparison",
  openGraph: {
    title: "Compare Money Transfer Services — Best Exchange Rates & Lowest Fees",
    description:
      "Compare 60+ money transfer providers side by side. Real exchange rates and fees from Wise, Remitly, Western Union and more — updated every 6 hours.",
    type: "website",
  },
  alternates: {
    canonical: "https://moneytransfers.com",
  },
};

const featuredProviderSlugs = ["wise", "remitly", "western-union", "moneygram", "revolut"];
const featuredProviders = featuredProviderSlugs
  .map((slug) => providers.find((p) => p.slug === slug)!)
  .filter(Boolean);

const faqs = [
  {
    q: "What is the cheapest way to send money internationally?",
    a: "The cheapest way depends on your corridor and amount. Specialist providers like Wise and Remitly typically beat banks by using near-mid-market exchange rates and charging low, transparent fees. Banks often add a 3–5% markup on top of the exchange rate plus a flat wire fee of $25–$50. For most personal transfers under $10,000, digital-first providers offer the best value.",
  },
  {
    q: "How long does an international money transfer take?",
    a: "Most transfers take between a few minutes and 3 business days depending on the provider, corridor, and delivery method. Express options from Remitly or Western Union can arrive in minutes via cash pickup. Bank-to-bank transfers through Wise or OFX typically take 1–2 business days. Weekends, holidays, and compliance checks can add extra time.",
  },
  {
    q: "Are online money transfer services safe?",
    a: "Yes — reputable providers like Wise, Remitly, and Revolut are regulated by financial authorities such as the FCA (UK), FinCEN (US), and ASIC (Australia). They use bank-grade encryption (256-bit SSL), two-factor authentication, and anti-fraud monitoring. Always verify that a provider is licensed in your country before sending money.",
  },
  {
    q: "What fees do money transfer companies charge?",
    a: "Money transfer companies charge two types of fees: a transfer fee (flat or percentage-based, typically $0–$5 for digital providers) and an exchange rate markup (the difference between their rate and the mid-market rate, usually 0.3%–4%). The total cost varies by provider and corridor. Our comparison tool factors in both to show the true amount your recipient receives.",
  },
  {
    q: "How do I compare money transfer providers?",
    a: "The best way to compare is by looking at the total amount your recipient will receive — not just the exchange rate or fee in isolation. Enter your send amount, origin, and destination in our comparison tool. We calculate the net receive amount across 60+ providers so you can see which service delivers the most money for your specific transfer.",
  },
];

export default function Home() {
  return (
    <>
      {/* ─── 1. HERO ─── */}
      <section className="bg-white pt-14 pb-10">
        <Container>
          <div className="text-center mb-10">
            <h1 className="text-[28px] sm:text-[36px] md:text-[44px] font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px] max-w-3xl mx-auto">
              Find the Cheapest Way to{" "}
              <span className="text-[var(--color-primary)]">Send Money Internationally</span>
            </h1>
            <p className="text-[15px] md:text-[16px] text-[var(--color-on-surface-variant)] mt-4 max-w-xl mx-auto leading-relaxed">
              Compare real-time exchange rates and fees from 60+ providers — updated every 6 hours so you never overpay.
            </p>
          </div>
          <div className="max-w-[860px] mx-auto">
            <ComparisonWidget />
          </div>
          <p className="text-center text-[11px] text-[var(--color-on-surface-variant)] mt-5 max-w-md mx-auto opacity-70">
            We may earn a referral fee when you visit a provider through our links. This never affects our rankings.
          </p>
        </Container>
      </section>

      {/* ─── 2. TRUST SIGNALS ─── */}
      <section className="bg-[var(--color-surface-dim)] border-y border-[var(--color-outline)] py-8">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
            {[
              { value: "60+", label: "Providers compared", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { value: "64", label: "Currency corridors", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { value: "6 hrs", label: "Data refresh cycle", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
              { value: "100%", label: "Independent & unbiased", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  </svg>
                </div>
                <p className="text-[24px] md:text-[28px] font-semibold text-[var(--color-on-surface)] tracking-tight">{stat.value}</p>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 3. HOW IT WORKS ─── */}
      <section className="py-12 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)]">
              How it works
            </h2>
            <p className="text-[14px] text-[var(--color-on-surface-variant)] mt-2 max-w-xl mx-auto">
              Three steps to find the cheapest transfer for any corridor.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Enter your transfer details",
                desc: "Tell us how much you're sending, the origin country, and where the money is going. We support 64 currency corridors.",
              },
              {
                step: "2",
                title: "Compare providers side by side",
                desc: "We show you the exchange rate, fee, and total amount your recipient will receive from every provider — ranked by best value.",
              },
              {
                step: "3",
                title: "Send with the best provider",
                desc: "Click through to the provider that gives your recipient the most money. It takes minutes to set up your first transfer.",
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl border border-[var(--color-outline)] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-[14px] font-semibold flex items-center justify-center mb-4">
                  {item.step}
                </div>
                <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-2">{item.title}</h3>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 4. BEST PROVIDERS ─── */}
      <section className="py-12">
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)]">
              Best money transfer providers
            </h2>
            <p className="text-[14px] text-[var(--color-on-surface-variant)] mt-2 max-w-xl mx-auto">
              Trusted by millions of people worldwide. Regulated, transparent, and independently rated.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
            {featuredProviders.map((provider) => (
              <Card key={provider.slug} href={`/companies/${provider.slug}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--color-surface-dim)] flex items-center justify-center shrink-0 relative">
                    <Image
                      src={provider.logo}
                      alt={`${provider.name} logo`}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-[var(--color-on-surface)]">{provider.name}</h3>
                    <RatingBadge rating={provider.rating} label={provider.ratingLabel} />
                  </div>
                </div>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] line-clamp-2 mb-3">{provider.description}</p>
                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  <div className="bg-[var(--color-surface-dim)] rounded-lg px-2.5 py-1.5">
                    <span className="text-[var(--color-on-surface-variant)]">Countries </span>
                    <span className="font-medium text-[var(--color-on-surface)]">{provider.supportedCountries}+</span>
                  </div>
                  <div className="bg-[var(--color-surface-dim)] rounded-lg px-2.5 py-1.5">
                    <span className="text-[var(--color-on-surface-variant)]">Speed </span>
                    <span className="font-medium text-[var(--color-on-surface)]">{provider.transferSpeed}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/companies" className="text-[14px] font-medium text-[var(--color-primary)] hover:underline">
              See all provider reviews &rarr;
            </Link>
          </div>
        </Container>
      </section>

      {/* ─── 5. LIVE EXAMPLE: $1,000 USD → PKR ─── */}
      <section className="py-12 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="text-center mb-2">
            <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)]">
              Live example: $1,000 USD to PKR
            </h2>
            <p className="text-[14px] text-[var(--color-on-surface-variant)] mt-2 mb-6">
              Sending $1,000 from the United States to Pakistan — here&apos;s what each provider delivers today.
            </p>
          </div>
          <BestTransferToday amount={1000} from="USD" to="PKR" symbol="Rs" />
          <div className="text-center mt-6">
            <PrimaryButton href="/send-money?from=USD&to=PKR&amount=1000">
              See full USD → PKR comparison
            </PrimaryButton>
          </div>
        </Container>
      </section>

      {/* ─── 6. WHY TRUST US ─── */}
      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)]">
                Why trust MoneyTransfers?
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] mt-2 max-w-xl mx-auto">
                We built the comparison tool we wished existed when we were overpaying on transfers ourselves.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-2">Independent rankings</h3>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">
                  Providers are always ranked by who delivers the most money to your recipient. No provider can pay for a higher position. Period.
                </p>
              </div>
              <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-2">Real data, not estimates</h3>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">
                  We collect live quotes from provider APIs and websites every 6 hours. You see the same rates and fees you&apos;d get if you went to the provider directly.
                </p>
              </div>
              <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-2">Regulated providers only</h3>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">
                  Every provider we list is licensed and regulated by at least one major financial authority (FCA, FinCEN, ASIC, or equivalent). We don&apos;t list unregulated services.
                </p>
              </div>
              <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-2">Transparent methodology</h3>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">
                  We factor in both the exchange rate markup and the transfer fee to calculate the total cost. The provider that puts the most money in your recipient&apos;s pocket wins.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 7. FAQ ─── */}
      <section className="py-12 bg-white border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] text-center mb-8">
              Frequently asked questions
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex items-center justify-between cursor-pointer list-none text-[15px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                    {faq.q}
                    <svg
                      className="w-5 h-5 shrink-0 ml-4 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed pr-8">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── EXPLORE MORE ─── */}
      <section className="py-12 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div>
              <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Popular corridors</h3>
              <ul className="space-y-2">
                <li><Link href="/send-money/usa-to-india" className="text-[14px] text-[var(--color-primary)] hover:underline">USA to India</Link></li>
                <li><Link href="/send-money/usa-to-pakistan" className="text-[14px] text-[var(--color-primary)] hover:underline">USA to Pakistan</Link></li>
                <li><Link href="/send-money/uk-to-europe" className="text-[14px] text-[var(--color-primary)] hover:underline">UK to Europe</Link></li>
                <li><Link href="/send-money/usa-to-philippines" className="text-[14px] text-[var(--color-primary)] hover:underline">USA to Philippines</Link></li>
                <li><Link href="/send-money/usa-to-mexico" className="text-[14px] text-[var(--color-primary)] hover:underline">USA to Mexico</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Comparisons</h3>
              <ul className="space-y-2">
                <li><Link href="/compare/wise-vs-remitly" className="text-[14px] text-[var(--color-primary)] hover:underline">Wise vs Remitly</Link></li>
                <li><Link href="/compare/wise-vs-western-union" className="text-[14px] text-[var(--color-primary)] hover:underline">Wise vs Western Union</Link></li>
                <li><Link href="/compare/remitly-vs-western-union" className="text-[14px] text-[var(--color-primary)] hover:underline">Remitly vs Western Union</Link></li>
                <li><Link href="/compare" className="text-[14px] text-[var(--color-primary)] hover:underline">All comparisons &rarr;</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Guides</h3>
              <ul className="space-y-2">
                <li><Link href="/guides/how-to-send-money-abroad" className="text-[14px] text-[var(--color-primary)] hover:underline">How to send money abroad</Link></li>
                <li><Link href="/guides/cheapest-way-to-send-money-internationally" className="text-[14px] text-[var(--color-primary)] hover:underline">Cheapest way to send money</Link></li>
                <li><Link href="/guides/exchange-rate-markup-explained" className="text-[14px] text-[var(--color-primary)] hover:underline">Exchange rates explained</Link></li>
                <li><Link href="/guides" className="text-[14px] text-[var(--color-primary)] hover:underline">All guides &rarr;</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Tools</h3>
              <ul className="space-y-2">
                <li><Link href="/send-money" className="text-[14px] text-[var(--color-primary)] hover:underline">Rate calculator</Link></li>
                <li><Link href="/currency-converter" className="text-[14px] text-[var(--color-primary)] hover:underline">Currency converter</Link></li>
                <li><Link href="/iban" className="text-[14px] text-[var(--color-primary)] hover:underline">IBAN lookup</Link></li>
                <li><Link href="/swift-codes" className="text-[14px] text-[var(--color-primary)] hover:underline">SWIFT/BIC codes</Link></li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* JSON-LD structured data for FAQ (SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />
    </>
  );
}
