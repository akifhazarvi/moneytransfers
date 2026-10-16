/**
 * Banks hub — entry point that links to each per-bank international-transfer
 * cost analysis page. Hub-and-spoke architecture: this page concentrates link
 * equity from corridor and guide pages, then distributes it to the per-bank
 * leaves that earn the long-tail branded queries.
 */
import { seoDescription } from "@/lib/seo-title";
import { COVERAGE } from "@/lib/site-stats";
import { robotsFor } from "@/lib/seo-indexing";
import Image from "next/image";
import Link from "@/components/EligibleLink";
import Container from "@/components/Container";
import Card from "@/components/Card";
import Breadcrumb from "@/components/Breadcrumb";
import { PageByline } from "@/components/PageByline";
import { COMPARISON_CONTENT_DATE, EDITORIAL_AUTHOR_SLUG } from "@/lib/content-dates";
import {
  PILOT_BANKS,
  getBankAggregateStats,
} from "@/lib/bank-comparisons";
import { currencies } from "@/data/providers";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { providerLogo } from "@/lib/provider-logo";

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
    // Was 93 chars, then 67 chars: "International" pushed past the ~60-char
    // SERP display limit and was cut. Removing it keeps keyword relevance.
    title: `Bank Transfer Fees Compared (${year}) | SendMoneyCompare`,
    description: seoDescription(`How much do major banks really charge for international transfers? Live data showing what HSBC, Wells Fargo, Chase, Lloyds and Barclays customers pay vs Wise, Remitly and specialist providers on the same corridor and amount.`),
    alternates: getAlternates("banks", locale),
    // 2026-09-20: indexability is measured — robotsFor() consults the
    // duplication-derived allowlist. See scripts/build-indexable-routes.ts.
    robots: robotsFor("/banks"),
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
              We collect international transfer quotes from major banks and
              compare them against Wise, Remitly, OFX, and the rest of the{" "}{COVERAGE.providers}{" "}we track on the same
              corridor, same amount, same day. Pick your bank to see exactly what it costs you to
              send money abroad — and how much you&rsquo;d save by switching.
            </p>
            {/* Round-3 QA item 7: a dated byline. The date is the family's
                content date, the same one sitemap.ts gives /banks. */}
            <PageByline authorSlug={EDITORIAL_AUTHOR_SLUG} updated={COMPARISON_CONTENT_DATE} cadence={null} />
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
                        src={providerLogo(bank.slug)}
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

      <section className="py-12 bg-[var(--color-surface)]">
        <Container>
          <div className="max-w-3xl space-y-8">
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-3">
                The two-part cost most banks don&rsquo;t advertise
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                Banks typically present international transfer costs as a flat wire fee — but that
                fee is rarely the largest part of what you pay. The exchange rate a bank applies to
                convert your money is almost always set above the mid-market rate (the rate you see
                on Google or XE), and that spread is where most of the cost lives. On a large
                transfer, the FX margin can cost several times more than the wire fee itself — yet
                only the wire fee appears on the bank&rsquo;s pricing page.
              </p>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mt-3">
                This matters because comparing banks solely on their wire fee is misleading. A
                bank that charges no wire fee but applies a wide exchange rate margin can cost
                significantly more than a bank charging a £10 or $30 wire fee at a tighter rate.
                Our comparison shows both components together so the total cost is visible.
              </p>
            </div>

            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-3">
                What the mid-market rate is — and why it matters
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                The mid-market rate is the midpoint between the buy and sell prices on the
                interbank currency market — the rate Reuters, Bloomberg and Google display. It is
                not a retail rate; banks and currency exchanges all add a margin on top of it when
                they convert money for customers. That margin is their profit on the currency
                conversion, and it is typically not itemised on receipts or transfer confirmations.
              </p>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mt-3">
                Specialist providers such as Wise and OFX pass the mid-market rate directly to
                senders and charge a transparent, fixed fee instead. This makes their total cost
                directly comparable in a way that bank rates, which bundle margin into the exchange
                rate, are not. Every comparison on this site restates each quote to a single
                &ldquo;recipient gets&rdquo; figure for a fixed outlay, so that bank and specialist
                quotes stand on the same footing.
              </p>
            </div>

            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-3">
                SWIFT and SEPA: the two networks most bank transfers use
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                Most international bank transfers travel over one of two messaging networks.
                SEPA (Single Euro Payments Area) covers transfers within the Eurozone and the
                wider SEPA zone — typically faster and lower-cost than SWIFT because they move
                directly between participating institutions. SWIFT is used for transfers outside the
                SEPA zone, such as from the UK or US to Asia, Africa or the Americas.
              </p>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mt-3">
                SWIFT payments may pass through one or more correspondent banks before reaching
                the recipient&rsquo;s account. Each correspondent can deduct its own handling charge
                from the transferred amount, which means the recipient can receive less than the
                sender was quoted — a cost that is invisible at the point of sending. Specialist
                providers avoid correspondent chains by routing payments differently, which is one
                reason their all-in quotes often compare favourably even before the exchange rate
                difference is considered.
              </p>
            </div>

            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-3">
                How to read the live comparison on each bank page
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                Each bank page shows live quotes collected from the Wise comparison feed, placed
                alongside quotes from digital providers on the same corridor and send amount. The
                &ldquo;loss vs cheapest provider&rdquo; figure shown above is how much less you
                would receive, in the destination currency, compared to the provider that currently
                quotes the highest payout on that route. It updates whenever the comparison feed
                refreshes — every six hours.
              </p>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mt-3">
                The comparison uses a standard send amount for each corridor so that quotes are
                directly comparable. Exchange rate margins and transfer fees are both included in
                the &ldquo;recipient gets&rdquo; figure — there is no separate column for hidden
                costs. If a provider charges a fee on top of its exchange rate, both are already
                reflected in the payout shown.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-3">
                Frequently asked questions
              </h2>

              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-1">
                    Why do banks charge more for international transfers than specialist providers?
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    Banks built their international payment infrastructure around correspondent
                    banking — a chain of intermediary banks that pass payments between countries.
                    Each link in the chain adds cost and delays. Specialist providers built newer
                    infrastructure that holds local currency balances in the countries they serve,
                    moving value internally rather than sending money across borders each time.
                    The operational cost is lower, and they pass most of that saving to the sender.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-1">
                    Does my bank&rsquo;s wire fee include the exchange rate cost?
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    No. The wire fee your bank quotes is the cost to send the payment instruction.
                    The exchange rate cost — the gap between the rate your bank applies and the
                    mid-market rate — is separate, and is almost never itemised. To find the true
                    total cost of a bank transfer, you need to compare the amount your recipient
                    would receive against what a mid-market-rate provider would deliver for the
                    same outlay. Our comparison does this calculation automatically.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-1">
                    How often does the data update?
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    We refresh quotes from all providers — including banks — every six hours via
                    automated scrapers. Exchange rates move continuously, so the figures on any
                    comparison page are accurate to within a few hours. The comparison always shows
                    the date and time of the most recent data pull so you can judge how current
                    the quote is before acting on it.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-1">
                    My bank is not listed. Can I still compare it?
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    We currently publish detailed cost pages for the banks where we hold enough
                    live data to make the comparison meaningful. If your bank is not listed, you
                    can still use the main{" "}
                    <Link href="/send-money" className="text-[var(--color-primary)] hover:underline">
                      send money comparison
                    </Link>{" "}
                    to see quotes from specialist providers for your corridor — enter the amount
                    and currencies, and the results will show what each provider pays out for your
                    specific transfer.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--color-outline)]">
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-3">
                How we collect this data
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                Bank quotes come from the Wise comparison API — a public price-comparison feed Wise
                publishes alongside its competitors for regulatory transparency. We scrape it every
                6 hours and store the result. Digital-provider quotes come from a combination of
                direct provider APIs (Wise, OFX, TapTap Send, Instarem, Xoom, Remitly, ACE) and the
                same Wise feed for everything else. The &ldquo;loss vs cheapest&rdquo; calculation is a
                like-for-like compare: same corridor, same amount, same day. We do not edit, smooth,
                or selectively present the numbers.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
