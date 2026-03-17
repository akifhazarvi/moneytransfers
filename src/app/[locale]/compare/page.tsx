import Link from "next/link";
import Image from "next/image";
import { providers } from "@/data/providers";
import Container from "@/components/Container";
import Card from "@/components/Card";
import ComparisonTable from "@/components/ComparisonTable";
import RatingBadge from "@/components/RatingBadge";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "compare" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: getAlternates("compare", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/compare",
    },
    keywords: t("metaKeywords"),
  };
}

function generateComparisons() {
  const comparisons: { slugA: string; slugB: string; nameA: string; nameB: string; logoA: string; logoB: string }[] = [];
  const top = providers.slice(0, 8);
  for (let i = 0; i < top.length; i++) {
    for (let j = i + 1; j < top.length; j++) {
      comparisons.push({
        slugA: top[i].slug,
        slugB: top[j].slug,
        nameA: top[i].name,
        nameB: top[j].name,
        logoA: top[i].logo,
        logoB: top[j].logo,
      });
    }
  }
  return comparisons;
}

export default async function ComparisonIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("compare");
  const comparisons = generateComparisons();

  return (
    <Container className="py-8">
      <nav className="text-[13px] text-[var(--color-on-surface-variant)] mb-6">
        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
        {" / "}
        <span className="text-[var(--color-on-surface)]">Compare</span>
      </nav>

      <h1 className="text-[28px] md:text-[36px] font-normal text-[var(--color-on-surface)] mb-2">{t("heading")}</h1>
      <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-8">
        {t("subheading")}
      </p>

      {/* Editorial Introduction */}
      <Card className="mb-8">
        <h2 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-3">
          Why compare money transfer providers?
        </h2>
        <div className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed space-y-3">
          <p>
            International money transfers can vary dramatically in cost depending on which provider you choose. The difference between the cheapest and most expensive option on the same corridor can be 5-8% of the transfer amount — on a $1,000 transfer, that means $50-$80 more or less reaching your recipient.
          </p>
          <p>
            The two main cost components are the <strong>transfer fee</strong> (a flat or percentage charge) and the <strong>exchange rate markup</strong> (the difference between what the provider charges and the real mid-market rate). Many providers advertise &quot;zero fees&quot; but compensate with a wider exchange rate markup. Our head-to-head comparisons break down both components so you can see the true total cost.
          </p>
          <p>
            Speed and delivery options also matter. Some providers deliver to bank accounts in minutes via local payment rails (like UPI in India or SPEI in Mexico), while others take 2-3 business days through SWIFT. Cash pickup, mobile wallets, and airtime top-up are available on select corridors. Use our provider comparisons below to find the best match for your specific needs — whether that is the lowest cost, fastest delivery, or widest country coverage.
          </p>
        </div>
      </Card>

      {/* Featured Comparison Table */}
      <div className="mb-12">
        <ComparisonTable headers={["Provider", "Rating", "Fees", "Speed", "Countries", "Rate Markup", ""]}>
          {providers.slice(0, 8).map((p) => (
            <tr key={p.slug} className="hover:bg-[var(--color-surface-dim)]">
              <td className="px-4 py-3 text-[14px] font-medium text-[var(--color-on-surface)]">{p.name}</td>
              <td className="px-4 py-3">
                <RatingBadge rating={p.rating} label={p.ratingLabel} />
              </td>
              <td className="px-4 py-3 text-[14px] text-[var(--color-on-surface-variant)]">{p.feeStructure}</td>
              <td className="px-4 py-3 text-[14px] text-[var(--color-on-surface-variant)]">{p.transferSpeed}</td>
              <td className="px-4 py-3 text-[14px] text-[var(--color-on-surface-variant)]">{p.supportedCountries}+</td>
              <td className="px-4 py-3 text-[14px] text-[var(--color-on-surface-variant)]">{p.exchangeRateMarkup}</td>
              <td className="px-4 py-3">
                <Link href={`/companies/${p.slug}`} className="text-[13px] text-[var(--color-primary)] font-medium hover:underline">
                  Review
                </Link>
              </td>
            </tr>
          ))}
        </ComparisonTable>
      </div>

      {/* Head-to-Head Links */}
      <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-6">{t("headToHeadHeading")}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {comparisons.slice(0, 21).map((c) => (
          <Card
            key={`${c.slugA}-${c.slugB}`}
            href={`/compare/${c.slugA}-vs-${c.slugB}`}
            className="!p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white">
                  <Image src={c.logoA} alt={c.nameA} width={40} height={40} className="object-cover" />
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white">
                  <Image src={c.logoB} alt={c.nameB} width={40} height={40} className="object-cover" />
                </div>
              </div>
              <span className="text-[13px] font-medium text-[var(--color-on-surface)]">{c.nameA} vs {c.nameB}</span>
            </div>
            <span className="text-[var(--color-primary)] text-[12px]">&rarr;</span>
          </Card>
        ))}
      </div>

      {/* Cross-links */}
      <div className="mt-12 pt-8 border-t border-[var(--color-outline)]">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Tools</h3>
            <ul className="space-y-2">
              <li><Link href="/send-money" className="text-[14px] text-[var(--color-primary)] hover:underline">Compare rates calculator</Link></li>
              <li><Link href="/currency-converter" className="text-[14px] text-[var(--color-primary)] hover:underline">Currency converter</Link></li>
              <li><Link href="/companies" className="text-[14px] text-[var(--color-primary)] hover:underline">All provider reviews</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Popular corridors</h3>
            <ul className="space-y-2">
              <li><Link href="/send-money/usa-to-india" className="text-[14px] text-[var(--color-primary)] hover:underline">USA to India</Link></li>
              <li><Link href="/send-money/usa-to-pakistan" className="text-[14px] text-[var(--color-primary)] hover:underline">USA to Pakistan</Link></li>
              <li><Link href="/send-money/usa-to-philippines" className="text-[14px] text-[var(--color-primary)] hover:underline">USA to Philippines</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Guides</h3>
            <ul className="space-y-2">
              <li><Link href="/guides/cheapest-way-to-send-money-internationally" className="text-[14px] text-[var(--color-primary)] hover:underline">Cheapest way to send money</Link></li>
              <li><Link href="/guides/exchange-rate-markup-explained" className="text-[14px] text-[var(--color-primary)] hover:underline">Exchange rates explained</Link></li>
              <li><Link href="/guides" className="text-[14px] text-[var(--color-primary)] hover:underline">All guides</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
}
