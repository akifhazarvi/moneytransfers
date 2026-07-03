import Container from "@/components/Container";
import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getAlternates } from "@/lib/i18n-metadata";
import Breadcrumb from "@/components/Breadcrumb";
import InlineProviderQuotes from "@/components/InlineProviderQuotes";
import FeeImpactCalculator from "@/components/FeeImpactCalculator";

export const revalidate = 86400;

const PATH = "tools/fee-impact";
const TITLE = "Remittance Fee Impact Calculator — What Overpaying Costs Your Family";
const DESCRIPTION =
  "See how much you lose to transfer fees and FX markup each year — and what that money could buy back home. Free calculator.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: getAlternates(PATH, locale),
    // DARK: built and reachable, but not indexed and not in the sitemap yet.
    // Flip `index` to true and add to sitemap.ts when we're ready to launch it.
    robots: { index: false, follow: true },
  };
}

export default async function FeeImpactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <section className="bg-[var(--color-surface)] pt-8 pb-6 border-b border-[var(--color-outline)]">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Fee Impact Calculator" },
            ]}
          />
          <div className="max-w-3xl mt-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-on-surface)] tracking-tight text-balance">
              Remittance Fee Impact Calculator
            </h1>
            <p className="mt-3 text-lg text-[var(--color-on-surface-variant)]">
              Small fees add up. See what a year of overpaying on transfer fees and exchange-rate markup really
              costs — and what that money could buy for the people you&apos;re sending it to.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-8">
        <Container>
          <div className="max-w-3xl">
            <FeeImpactCalculator source="tool:fee-impact" />
            <p className="mt-3 text-xs text-[var(--color-on-surface-muted)]">
              Illustrative estimate. Savings depend on your provider, corridor, and amount. Compare live quotes
              below for your exact transfer.
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-12">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-[var(--color-on-surface)]">Keep more of it — compare live</h2>
            <InlineProviderQuotes from="USD" to="INR" amount={1000} source="tool:fee-impact" />
            <p className="mt-4 text-sm text-[var(--color-on-surface-variant)]">
              Related:{" "}
              <Link className="underline" href="/tools/fx-markup-checker">FX Markup Checker</Link> ·{" "}
              <Link className="underline" href="/tools/us-remittance-tax">US Remittance Tax Calculator</Link>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
