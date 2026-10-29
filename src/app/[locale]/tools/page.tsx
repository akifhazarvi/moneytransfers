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
import { EDITORIAL_AUTHOR_SLUG, longDay, pageUpdated } from "@/lib/content-dates";
import { generateQuotes } from "@/lib/quotes-engine";
import { getMidMarketRate } from "@/lib/unified-quotes";
import { pppIndex } from "@/lib/ppp-index";
import { getProviderName } from "@/data/providers";

export const revalidate = 86400;

const SITE_URL = "https://sendmoneycompare.com";
// 84 chars previously — the brand suffix was truncated away, so it cost us
// characters without ever rendering.
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

/**
 * Round-4 brief §0.3 (worksheet 04): "describe each tool with a worked
 * calculation and methodology". The FX and salary examples are computed from
 * the data the tools themselves read — a real provider quote against the
 * mid-market rate, and the World Bank PPP row for one country — never typed.
 */
const SOURCE_LINK = "text-[var(--color-primary)] underline underline-offset-2 hover:no-underline";
const usd = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function fxWorkedExample() {
  const mid = getMidMarketRate("USD", "INR");
  const ranked = generateQuotes(1000, "USD", "INR")
    .filter((q) => !q.isIndicative && q.exchangeRate > 0 && q.exchangeRate < mid)
    .sort((a, b) => b.exchangeRate - a.exchangeRate);
  if (!mid || ranked.length < 3) return null;
  const q = ranked[Math.floor(ranked.length / 2)]; // the middle of today's list: neither best nor worst
  const markupPct = ((mid - q.exchangeRate) / mid) * 100;
  return { provider: getProviderName(q.providerSlug), rate: q.exchangeRate, mid, markupPct, cost: markupPct * 10, fee: q.fee };
}

function salaryWorkedExample() {
  const c = pppIndex.countries.find((x) => x.iso2 === "IN");
  if (!c) return null;
  const salary = 50000;
  return { name: c.name, currency: c.currency, salary, market: salary * c.rate, ppp: salary * c.ppp, multiplier: c.multiplier, pppYear: c.pppYear, rateDate: pppIndex.rateDate };
}

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const fx = fxWorkedExample();
  const salary = salaryWorkedExample();
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
            {/* Round-3 QA item 7: a named author and the page's content date. */}
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
          <section className="mt-10 max-w-3xl space-y-6" aria-labelledby="tools-how-they-work">
            <h2 id="tools-how-they-work" className="text-xl font-bold text-[var(--color-on-surface)]">How each money transfer tool calculates its answer</h2>

            <div className="space-y-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
              <h3 className="text-md font-semibold text-[var(--color-on-surface)]">US remittance tax: 1% of cash-funded transfers</h3>
              <p>
                Since 1 January 2026 a US sender pays a 1% federal excise tax on a remittance transfer paid for in cash, by money
                order or by cashier&rsquo;s check. A transfer paid from an account at a US bank, or with a US-issued debit or
                credit card, is exempt. Sending $500 in cash at an agent therefore costs $5.00 in tax on top of the provider&rsquo;s
                fee; the same $500 sent from a bank account costs $0. The calculator applies that rule to your amount and funding
                method. The rules are in the{" "}
                <a href="https://www.irs.gov/newsroom/treasury-irs-issue-proposed-regulations-on-the-new-remittance-transfer-tax-established-under-the-one-big-beautiful-bill" target="_blank" rel="noopener" className={SOURCE_LINK}>IRS announcement of the proposed regulations</a>{" "}
                and the{" "}
                <a href="https://www.federalregister.gov/documents/2026/04/13/2026-07085/excise-tax-on-remittance-transfers" target="_blank" rel="noopener" className={SOURCE_LINK}>Federal Register notice</a>.
              </p>
            </div>

            {fx && (
              <div className="space-y-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <h3 className="text-md font-semibold text-[var(--color-on-surface)]">FX markup checker: the rate margin in money</h3>
                <p>
                  {`The checker compares a rate you have been quoted with the mid-market rate and turns the gap into money. A worked case from today's quotes: for $1,000 from US dollars to Indian rupees, ${fx.provider} quotes ${fx.rate.toFixed(2)} rupees per dollar against a mid-market rate of ${fx.mid.toFixed(2)}. The markup is (${fx.mid.toFixed(2)} − ${fx.rate.toFixed(2)}) ÷ ${fx.mid.toFixed(2)} = ${fx.markupPct.toFixed(2)}%, so about ${usd(fx.cost)} of the $1,000 goes on the rate margin${fx.fee > 0 ? `, before its ${usd(fx.fee)} fee` : ", and it charges no separate fee"}.`}
                </p>
                <p>
                  {"The mid-market rate is the midpoint between buying and selling the currency, the rate before any provider adds its margin; we take it from XE's mid-market data. The provider quoted here is the middle of today's list for this route, not the best or the worst."}
                </p>
              </div>
            )}

            {salary && (
              <div className="space-y-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <h3 className="text-md font-semibold text-[var(--color-on-surface)]">Salary abroad: market rate against purchasing power</h3>
                <p>
                  {`The calculator converts a salary twice: at the market exchange rate, which is what a transfer delivers, and at purchasing power parity, which is what the money buys. For ${salary.name}: $${salary.salary.toLocaleString("en-US")} converts to about ${Math.round(salary.market).toLocaleString("en-US")} ${salary.currency} at the market rate, while ${Math.round(salary.ppp).toLocaleString("en-US")} ${salary.currency} buys there what $${salary.salary.toLocaleString("en-US")} buys in the United States. The market amount therefore goes about ${salary.multiplier.toFixed(1)} times as far.`}
                </p>
                <p>
                  {`Purchasing power uses the World Bank's PPP conversion factor for private consumption (${salary.pppYear} figures, `}
                  <a href="https://data.worldbank.org/indicator/PA.NUS.PRVT.PP" target="_blank" rel="noopener" className={SOURCE_LINK}>indicator PA.NUS.PRVT.PP</a>
                  {`), and the market rate is as of ${longDay(salary.rateDate)}. The calculator then takes off what sending the money home costs, from our provider quotes.`}
                </p>
              </div>
            )}
          </section>

          <p className="mt-6 text-sm text-[var(--color-on-surface-variant)] max-w-3xl">
            Looking for the cheapest provider for your corridor?{" "}
            <Link className="underline" href="/send-money">Compare all {COVERAGE.providers} →</Link>
          </p>
          <PolicyLinks current="/tools" />
        </Container>
      </section>
    </>
  );
}
