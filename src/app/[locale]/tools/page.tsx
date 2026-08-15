import Container from "@/components/Container";
import Card from "@/components/Card";
import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getAlternates } from "@/lib/i18n-metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import Breadcrumb from "@/components/Breadcrumb";

export const revalidate = 86400;

const SITE_URL = "https://sendmoneycompare.com";
const TITLE = "Free Money Transfer Tools — Tax, FX Markup & Cost Calculators | SendMoneyCompare";
const DESCRIPTION =
  "Free calculators for international transfers: work out the 2026 US remittance tax, reveal the hidden FX markup on any quote, and find the cheapest way to send. No signup.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: getAlternates("tools", locale),
    openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/tools`, type: "website" },
  };
}

// Only LIVE (indexed) tools are listed here. Dark tools (fee-impact) are
// intentionally omitted until we flip them on.
const TOOLS = [
  {
    href: "/tools/us-remittance-tax",
    name: "US Remittance Tax Calculator",
    tag: "New for 2026",
    desc: "Work out the new 1% federal tax on money sent abroad — and how to pay $0.",
  },
  {
    href: "/tools/fx-markup-checker",
    name: "FX Markup Checker",
    tag: "Live rates",
    desc: "Paste any quoted rate and see the hidden exchange-rate markup in real money.",
  },
  {
    href: "/tools/salary-abroad",
    name: "Salary Abroad Calculator",
    tag: "World Bank data",
    desc: "What your income is really worth in 83 countries — including the FX cost every other calculator ignores.",
  },
];

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Tools", href: "/tools" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <section className="bg-[var(--color-surface)] pt-8 pb-6 border-b border-[var(--color-outline)]">
        <Container>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Tools" }]} />
          <div className="max-w-3xl mt-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-on-surface)] tracking-tight text-balance">
              Free money transfer tools
            </h1>
            <p className="mt-3 text-lg text-[var(--color-on-surface-variant)]">
              Quick calculators to check what a transfer really costs — tax, hidden FX markup, and the cheapest way
              to send. Every tool runs on our live provider data. No signup, no email.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-8">
        <Container>
          <div className="grid sm:grid-cols-2 gap-4 max-w-4xl">
            {TOOLS.map((t) => (
              <Card key={t.href} href={t.href} className="h-full">
                <span className="inline-block text-2xs font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-2 py-0.5 rounded-full">
                  {t.tag}
                </span>
                <h2 className="mt-3 text-lg font-bold text-[var(--color-on-surface)]">{t.name}</h2>
                <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">{t.desc}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-[var(--color-primary)]">Open tool →</span>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-sm text-[var(--color-on-surface-variant)] max-w-3xl">
            Looking for the cheapest provider for your corridor?{" "}
            <Link className="underline" href="/send-money">Compare all 60+ providers →</Link>
          </p>
        </Container>
      </section>
    </>
  );
}
