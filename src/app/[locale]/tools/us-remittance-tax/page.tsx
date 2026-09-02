import { seoDescription } from "@/lib/seo-title";
import Container from "@/components/Container";
import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/structured-data";
import Breadcrumb from "@/components/Breadcrumb";
import InlineProviderQuotes from "@/components/InlineProviderQuotes";
import UsRemittanceTaxCalculator from "@/components/UsRemittanceTaxCalculator";

// Tax rules change rarely; rate/quotes underneath refresh via the calculator.
export const revalidate = 86400;

const SITE_URL = "https://sendmoneycompare.com";
const PATH = "tools/us-remittance-tax";
const TITLE = "US Remittance Tax Calculator (2026) — 1% Excise on Money Sent Abroad";
const DESCRIPTION =
  "Calculate the new 1% US remittance transfer tax on money sent abroad from Jan 1, 2026. See exactly when it applies, how to pay $0, and the cheapest way to send after tax.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLE,
    description: seoDescription(DESCRIPTION),
    keywords: [
      "us remittance tax calculator",
      "1% remittance tax",
      "remittance transfer tax 2026",
      "money transfer tax usa",
      "one big beautiful bill remittance tax",
      "how much is the remittance tax",
    ],
    alternates: getAlternates(PATH, locale),
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}/${PATH}`,
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  };
}

const FAQS = [
  {
    question: "How much is the US remittance tax in 2026?",
    answer:
      "The remittance transfer tax is 1% of the amount sent. It applies to transfers made after December 31, 2025 (i.e. from January 1, 2026) that are funded with cash, a money order, a cashier's check, or a similar physical instrument. On a $1,000 transfer that's $10.",
  },
  {
    question: "Which transfers are exempt from the remittance tax?",
    answer:
      "Transfers funded from an account held at a US financial institution, and transfers funded with a debit or credit card issued in the US, are exempt. In practice, if you pay from your bank account or a US-issued card, you owe $0 remittance tax — the 1% only bites cash-funded transfers.",
  },
  {
    question: "Who pays and who collects the remittance tax?",
    answer:
      "The sender is legally liable for the tax, but the remittance transfer provider collects it at the point of sale, makes semi-monthly deposits, and files quarterly returns with the IRS on Form 720. You'll see it added at checkout on a taxable transfer.",
  },
  {
    question: "Is there a minimum amount before the remittance tax applies?",
    answer:
      "The statute and proposed regulations set the tax at 1% of the transfer amount with no published de-minimis threshold, so it can apply to small cash-funded transfers too. Always confirm the exact amount with your provider before sending.",
  },
  {
    question: "How do I avoid the 1% remittance tax legally?",
    answer:
      "Fund your transfer from a US bank account or with a US-issued debit/credit card instead of cash — those funding methods are exempt. After that, the biggest remaining cost is the provider's exchange-rate markup, so compare providers on the after-tax, all-in cost.",
  },
];

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "US Remittance Tax Calculator",
  url: `${SITE_URL}/${PATH}`,
  isAccessibleForFree: true,
  description: DESCRIPTION,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export default async function UsRemittanceTaxPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Tools", href: "/tools" },
    { name: "US Remittance Tax Calculator", href: `/${PATH}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />

      {/* ─── HERO ─── */}
      <section className="bg-[var(--color-surface)] pt-8 pb-6 border-b border-[var(--color-outline)]">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "US Remittance Tax Calculator" },
            ]}
          />
          <div className="max-w-3xl mt-4">
            <span className="inline-block text-2xs font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-2.5 py-1 rounded-full">
              Free tool · Updated for 2026
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-[var(--color-on-surface)] tracking-tight text-balance">
              US Remittance Tax Calculator
            </h1>
            <p className="mt-3 text-lg text-[var(--color-on-surface-variant)]">
              A new <strong>1% federal excise tax</strong> hits money sent abroad from the US starting{" "}
              <strong>January 1, 2026</strong> — but only on cash-funded transfers. See what you&apos;d owe, how to
              pay <strong>$0</strong>, and the cheapest way to send after tax.
            </p>
          </div>
        </Container>
      </section>

      {/* ─── CALCULATOR ─── */}
      <section className="py-8">
        <Container>
          <div className="max-w-3xl">
            <UsRemittanceTaxCalculator source="tool:us-remittance-tax" />
            <p className="mt-3 text-xs text-[var(--color-on-surface-muted)]">
              Estimate only, not tax advice. The tax is 1% of the amount sent on cash-funded transfers. Confirm the
              exact charge with your provider at checkout.
            </p>
          </div>
        </Container>
      </section>

      {/* ─── LIVE COMPARISON (our unique angle: real providers, real CTA) ─── */}
      <section className="pb-4">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-[var(--color-on-surface)]">
              Cheapest way to send after the tax
            </h2>
            <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
              Whether or not the 1% applies, the exchange-rate markup usually costs more than the tax. Here are the
              best-value providers on USD → India right now — pick another corridor to compare yours.
            </p>
            <InlineProviderQuotes from="USD" to="INR" amount={1000} source="tool:us-remittance-tax" />
          </div>
        </Container>
      </section>

      {/* ─── EXPLAINER (E-E-A-T + sourcing) ─── */}
      <section className="pb-12">
        <Container>
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--color-on-surface)]">What is the US remittance transfer tax?</h2>
              <p className="mt-2 text-[var(--color-on-surface-variant)]">
                The One Big Beautiful Bill Act, signed into law on July 4, 2025, created a{" "}
                <strong>1% excise tax on remittance transfers</strong> sent from the United States to recipients
                abroad. It applies to transfers made <strong>after December 31, 2025</strong>. The sender is liable,
                but the remittance transfer provider collects the tax at checkout and remits it to the IRS.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[var(--color-on-surface)]">When does the 1% actually apply?</h2>
              <ul className="mt-2 space-y-2 text-[var(--color-on-surface-variant)]">
                <li>
                  <strong className="text-[var(--color-error)]">Taxable:</strong> transfers funded with cash, a money
                  order, a cashier&apos;s check, or a similar physical instrument.
                </li>
                <li>
                  <strong className="text-[var(--color-success-dark)]">Exempt:</strong> transfers funded from an
                  account at a US financial institution, or with a debit/credit card issued in the US.
                </li>
              </ul>
              <p className="mt-2 text-[var(--color-on-surface-variant)]">
                In plain terms: if you pay from your bank account or a US card, you owe nothing. The tax is aimed
                squarely at cash-funded transfers.
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

            <div className="rounded-xl bg-[var(--color-surface-dim)] p-4 text-xs text-[var(--color-on-surface-muted)]">
              <p className="font-semibold text-[var(--color-on-surface-variant)]">Sources &amp; last updated</p>
              <p className="mt-1">
                Based on the One Big Beautiful Bill Act and IRS/Treasury guidance. Primary sources:{" "}
                <a className="underline" href="https://www.irs.gov/newsroom/treasury-irs-issue-proposed-regulations-on-the-new-remittance-transfer-tax-established-under-the-one-big-beautiful-bill" target="_blank" rel="noopener noreferrer">
                  IRS proposed regulations
                </a>{" "}
                and the{" "}
                <a className="underline" href="https://www.federalregister.gov/documents/2026/04/13/2026-07085/excise-tax-on-remittance-transfers" target="_blank" rel="noopener noreferrer">
                  Federal Register rule
                </a>
                . This tool is for information only and is not tax advice. Reviewed July 2026.
              </p>
            </div>

            <p className="text-sm text-[var(--color-on-surface-variant)]">
              Related:{" "}
              <Link className="underline" href="/tools/fx-markup-checker">FX Markup Checker</Link> ·{" "}
              <Link className="underline" href="/send-money">Compare all providers</Link>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
