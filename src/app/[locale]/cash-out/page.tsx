import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import Card from "@/components/Card";
import Breadcrumb from "@/components/Breadcrumb";
import { getAlternates } from "@/lib/i18n-metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import { CASHOUT_COUNTRIES } from "@/data/cashout-countries";
import { getCountryOfframps } from "@/lib/crypto-rails";

export const revalidate = 21600;

const SITE_URL = "https://sendmoneycompare.com";
const TITLE = "Cash Out Crypto by Country — Cheapest USDT/USDC Off-Ramp (2026)";
const DESCRIPTION =
  "Which exchange converts your USDT, USDC or Bitcoin to local currency at the lowest all-in cost — country by country, with live data. Free, no signup.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLE,
    description: DESCRIPTION,
    // noindex 2026-09-01: the cluster is genuinely unique (12.2% intra-family
    // 8-gram similarity — hand-authored, not templated) but thin at ~550 body
    // words, and a live 90-day pull shows 15 GA4 sessions, 1 key event and ZERO
    // Google impressions across all 7 pages. Thin plus no demand is exactly the
    // profile that fed the Mar 20 scaled-content suppression. Pages stay live
    // and internally linked so the existing traffic and AI citations continue —
    // they simply leave the index. Promote back if a page earns real demand.
    robots: { index: false, follow: true },
    alternates: getAlternates("cash-out", locale),
    openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/cash-out`, type: "website" },
  };
}

export default async function CashOutHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cards = CASHOUT_COUNTRIES.map((c) => {
    const offramps = getCountryOfframps(c.currency, 1000);
    return { c, best: offramps[0]?.rail ?? null, exchangeCount: offramps.length };
  }).filter((x) => x.best); // only countries with live data

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Cash out crypto", href: "/cash-out" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <section className="bg-[var(--color-surface)] pt-8 pb-6 border-b border-[var(--color-outline)]">
        <Container>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cash out crypto" }]} />
          <div className="max-w-3xl mt-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-on-surface)] tracking-tight text-balance">
              Cash out crypto by country
            </h1>
            <p className="mt-3 text-lg text-[var(--color-on-surface-variant)]">
              Sending money abroad over stablecoins only pays off if the recipient can convert it cheaply. These
              guides answer one question with live data: <strong>which exchange turns USDT, USDC or Bitcoin into
              local currency at the lowest all-in cost right now</strong> — plus how the cash-out works and the local
              tax reality.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-8">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map(({ c, best, exchangeCount }) => (
              <Card key={c.slug} href={`/cash-out/${c.slug}`} className="h-full">
                <div className="flex items-center gap-2">
                  <span className="text-2xl leading-none">{c.flag}</span>
                  <h2 className="text-lg font-bold text-[var(--color-on-surface)]">{c.country}</h2>
                </div>
                <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
                  Cheapest to {c.currency}:{" "}
                  <strong>{best!.offRamp}</strong> at{" "}
                  <strong className={best!.feePercent <= 0 ? "text-[var(--color-success-dark)]" : ""}>
                    {best!.feePercent <= 0 ? `+${Math.abs(best!.feePercent).toFixed(2)}% (rebate)` : `${best!.feePercent.toFixed(2)}%`}
                  </strong>
                </p>
                <p className="mt-1 text-xs text-[var(--color-on-surface-muted)]">
                  {exchangeCount} exchange{exchangeCount > 1 ? "s" : ""} tracked · via {best!.chainName}
                </p>
                <span className="mt-3 inline-block text-sm font-semibold text-[var(--color-primary)]">
                  See {c.country} off-ramps →
                </span>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-sm text-[var(--color-on-surface-variant)] max-w-3xl">
            Not into crypto? <Link className="underline" href="/send-money">Compare 60+ money-transfer providers →</Link> ·{" "}
            <Link className="underline" href="/remittance-cost-index">See the full crypto-vs-bank cost index →</Link>
          </p>
        </Container>
      </section>
    </>
  );
}
