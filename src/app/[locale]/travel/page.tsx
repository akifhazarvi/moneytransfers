import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import Card from "@/components/Card";
import CircleFlag from "@/components/CircleFlag";
import { travelGuides } from "@/data/travel-guides";
import { getAlternates } from "@/lib/i18n-metadata";

export const revalidate = 86400;

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Travel Guides: Money, eSIM & Culture by Country (2026)",
    description:
      "Country travel guides from SendMoneyCompare — currency basics, the best way to exchange money, eSIM picks, cash vs card norms, culture dos and don'ts, and practical travel info. Built for travelers who care about not overpaying.",
    alternates: getAlternates("travel", locale),
  };
}

export default async function TravelHubPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const guides = Object.values(travelGuides);

  return (
    <>
      <section className="bg-gradient-to-b from-[var(--color-primary-surface)] to-[var(--color-surface)] py-12">
        <Container>
          <nav aria-label="Breadcrumb" className="text-2sm text-[var(--color-on-surface-variant)] mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--color-on-surface)]">Travel</span>
          </nav>
          <h1 className="text-h1 font-semibold text-[var(--color-on-surface)] leading-tight mb-3">
            Travel guides: money, eSIM & culture
          </h1>
          <p className="text-md text-[var(--color-on-surface-variant)] max-w-2xl">
            Plan a smarter trip. For each country we cover the currency (with note images), where to exchange at the best rate, eSIM options with current prices, cultural dos and don'ts, visa rules, and typical daily budgets. Built by the team behind SendMoneyCompare — so the money advice is grounded in real rate data, not travel-guide boilerplate.
          </p>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {guides.map((g) => (
              <Card key={g.slug} href={`/travel/${g.slug}`}>
                <div className="flex items-center gap-3 mb-3">
                  <CircleFlag code={g.countryCode} size={40} />
                  <div>
                    <h2 className="font-semibold text-[var(--color-on-surface)]">{g.countryName}</h2>
                    <p className="text-2xs text-[var(--color-on-surface-variant)]">
                      {g.currencyName} ({g.currencySymbol} {g.currency}) · {g.region}
                    </p>
                  </div>
                </div>
                <p className="text-2sm text-[var(--color-on-surface-variant)] line-clamp-3">{g.tldr}</p>
                <p className="text-2sm text-[var(--color-primary)] mt-3 font-medium">Read guide &rarr;</p>
              </Card>
            ))}
          </div>
          {guides.length < 5 && (
            <p className="text-2sm text-[var(--color-on-surface-variant)] mt-8 text-center italic">
              More countries launching soon — Japan, Turkey, Mexico, UAE, and Vietnam are next.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
