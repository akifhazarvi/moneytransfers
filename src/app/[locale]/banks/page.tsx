/**
 * Banks hub — entry point that links to each per-bank international-transfer
 * cost analysis page. Hub-and-spoke architecture: this page concentrates link
 * equity from corridor and guide pages, then distributes it to the per-bank
 * leaves that earn the long-tail branded queries.
 */
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import Card from "@/components/Card";
import Breadcrumb from "@/components/Breadcrumb";
import {
  PILOT_BANKS,
  getBankAggregateStats,
} from "@/lib/bank-comparisons";
import { currencies } from "@/data/providers";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";

export const revalidate = 21600;

function getCurrencySymbol(code: string): string {
  return currencies.find((c) => c.code === code)?.symbol || code;
}

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const year = new Date().getFullYear();
  return {
    title: `Bank International Transfer Fees Compared (${year}) — Wells Fargo, HSBC, Chase, Lloyds, Barclays`,
    description: `How much do major banks really charge for international transfers? Live data showing what HSBC, Wells Fargo, Chase, Lloyds and Barclays customers pay vs Wise, Remitly and specialist providers on the same corridor and amount.`,
    alternates: getAlternates("banks", locale),
  };
}

export default async function BanksHubPage() {
  const banks = Object.values(PILOT_BANKS).map((bank) => {
    const stats = getBankAggregateStats(bank.slug);
    return { bank, stats };
  });

  return (
    <>
      <Breadcrumb items={[{ label: "Banks" }]} />

      <section className="py-12 bg-gradient-to-b from-[var(--color-primary-surface)] to-[var(--color-surface)]">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-h2 md:text-h1 font-normal text-[var(--color-on-surface)] leading-tight">
              Bank International Transfer Fees — Live Cost Data ({new Date().getFullYear()})
            </h1>
            <p className="text-lg text-[var(--color-on-surface-variant)] mt-4 leading-relaxed">
              We continuously scrape live international transfer quotes from major banks and
              compare them against Wise, Remitly, OFX, and 30+ specialist providers on the same
              corridor, same amount, same day. Pick your bank to see exactly what it costs you to
              send money abroad — and how much you'd save by switching.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12 bg-[var(--color-surface)]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
            {banks.map(({ bank, stats }) => (
              <Link key={bank.slug} href={`/banks/${bank.slug}`} className="block">
                <Card className="h-full hover:border-[var(--color-primary)] transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="relative w-14 h-14 bg-white rounded-xl border border-[var(--color-outline)] p-1 shrink-0">
                      <Image
                        src={`/logos/${bank.slug}.png`}
                        alt={`${bank.name} logo`}
                        fill
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-md font-medium text-[var(--color-on-surface)]">
                        {bank.name}
                      </h2>
                      <p className="text-2sm text-[var(--color-on-surface-variant)] mb-3">
                        {bank.country} · {stats.corridorCount} live corridors
                      </p>
                      {stats.largestLossExample && (
                        <p className="text-sm">
                          <span className="text-[var(--color-on-surface-variant)]">
                            Largest loss vs cheapest provider:
                          </span>{" "}
                          <span className="font-medium text-red-700">
                            {getCurrencySymbol(stats.largestLossExample.receiveCurrency)}
                            {stats.largestLossExample.lossInReceiveCurrency.toLocaleString(
                              undefined,
                              { maximumFractionDigits: 0 },
                            )}{" "}
                            ({stats.largestLossExample.lossPct.toFixed(1)}%)
                          </span>{" "}
                          <span className="text-[var(--color-on-surface-variant)]">
                            on {getCurrencySymbol(stats.largestLossExample.sendCurrency)}
                            {stats.largestLossExample.sendAmount.toLocaleString()}{" "}
                            {stats.largestLossExample.sendCurrency} →{" "}
                            {stats.largestLossExample.receiveCurrency}
                          </span>
                        </p>
                      )}
                      <p className="text-2sm text-[var(--color-primary)] mt-3">
                        See {bank.name} comparison →
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-3">
              How we collect this data
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
              Bank quotes come from the Wise comparison API — a public price-comparison feed Wise
              publishes alongside its competitors for regulatory transparency. We scrape it every
              6 hours and store the result. Digital-provider quotes come from a combination of
              direct provider APIs (Wise, OFX, TapTap Send, Instarem, Xoom, Remitly, ACE) and the
              same Wise feed for everything else. The "loss vs cheapest" calculation is a
              like-for-like compare: same corridor, same amount, same day. We do not edit, smooth,
              or selectively present the numbers.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
