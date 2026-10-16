import { seoDescription } from "@/lib/seo-title";
import PolicyLinks from "@/components/PolicyLinks";
import Container from "@/components/Container";
import Card from "@/components/Card";
import Link from "@/components/EligibleLink";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import Breadcrumb from "@/components/Breadcrumb";
import { COVERAGE } from "@/lib/site-stats";
import { PageByline } from "@/components/PageByline";
import { EDITORIAL_AUTHOR_SLUG, pageUpdated } from "@/lib/content-dates";

export const revalidate = 86400;

const SITE_URL = "https://sendmoneycompare.com";
const TITLE = "Free Money Transfer Tools — Tax & FX Markup Calculators";
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
    description: seoDescription(DESCRIPTION),
    alternates: getAlternates("tools", locale),
    openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/tools`, type: "website",
      images: DEFAULT_OG_IMAGES,
    },
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
            <div className="mt-4">
              <PageByline authorSlug={EDITORIAL_AUTHOR_SLUG} updated={pageUpdated("/tools")} cadence={null} />
            </div>
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
            <Link className="underline" href="/send-money">Compare all {COVERAGE.providers} →</Link>
          </p>

          <div className="mt-10 max-w-3xl space-y-8 text-[var(--color-on-surface-variant)]">
            <div>
              <h2 className="text-xl font-bold text-[var(--color-on-surface)]">About these calculators</h2>
              <p className="mt-2 text-sm leading-relaxed">
                International money transfers hide costs in two places: fees shown upfront, and the exchange-rate
                margin added on top of the mid-market rate. Most calculators show one or the other. These tools
                show both, and let you see exactly what arrives at the other end — before you commit to a provider.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[var(--color-on-surface)]">US Remittance Tax Calculator</h3>
              <p className="mt-2 text-sm leading-relaxed">
                The One Big Beautiful Bill Act introduced a 1% excise tax on international money transfers from the
                United States, effective 2026. The calculator takes the amount you plan to send, identifies whether
                the tax applies to your transfer, and shows the exact dollar cost. It also explains which payment
                methods and senders are exempt — including US citizens sending to FATCA-covered accounts — so you
                can plan to reduce the tax to zero if your situation qualifies.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[var(--color-on-surface)]">FX Markup Checker</h3>
              <p className="mt-2 text-sm leading-relaxed">
                When a transfer company quotes you an exchange rate, it is almost always worse than the mid-market
                rate — the rate you see on Google or Reuters. The difference is the FX markup, and it compounds with
                the transfer fee to set the true cost of your transfer. This tool fetches the current mid-market rate
                and calculates exactly how much of your money disappears into the spread, expressed both as a
                percentage and as a currency amount, so you can compare providers on a level footing.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[var(--color-on-surface)]">Salary Abroad Calculator</h3>
              <p className="mt-2 text-sm leading-relaxed">
                Purchasing power varies dramatically across countries, and most cost-of-living tools ignore the
                ongoing FX cost of earning in one currency and spending in another. This calculator combines World
                Bank purchasing-power-parity data for 83 countries with live exchange rates to show what a salary
                is genuinely worth abroad — both in local spending power and after the exchange-rate overhead that
                affects anyone paid in a foreign currency.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[var(--color-on-surface)]">How we keep the data current</h3>
              <p className="mt-2 text-sm leading-relaxed">
                All three tools draw on the same live quote database that powers our provider comparison — refreshed
                automatically so figures reflect today&rsquo;s rates, not yesterday&rsquo;s. Mid-market rates are
                sourced from XE. Tax rules are updated whenever legislation changes. No registration is required to
                use any tool, and no data you enter is stored or shared.
              </p>
            </div>
          </div>

          <PolicyLinks current="/tools" />
        </Container>
      </section>
    </>
  );
}
