import { seoDescription } from "@/lib/seo-title";
import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import { getAuthor } from "@/data/authors";
import {
  weekendMarkup as wm,
  widensAtWeekend,
  narrowsAtWeekend,
  costExtremes,
  providerLabel,
  longDate,
} from "@/lib/weekend-markup";

const SITE_URL = "https://sendmoneycompare.com";
const PATH = "guides/best-day-to-send-money-abroad";
const URL = `${SITE_URL}/${PATH}`;

const author = getAuthor("akif-hazarvi");

// Every figure below is read from weekend-markup.json (built by
// scripts/build-weekend-markup.ts) rather than typed into the copy, so the
// published numbers can never drift from the underlying data.
const obs = wm.observations.toLocaleString();
const fromLong = longDate(wm.dataRange.from);
const toLong = longDate(wm.dataRange.to);
const widens = widensAtWeekend(8);
const narrows = narrowsAtWeekend(6);
const { cheapest, dearest } = costExtremes(5);

// The spread between the cheapest and dearest well-sampled providers — the
// number that puts the day-of-week effect in perspective.
const cheapTop = cheapest[0];
const dearTop = dearest[0];
const spreadMultiple = cheapTop.weekday > 0 ? Math.round(dearTop.weekday / cheapTop.weekday) : 0;

// Weekend is cheaper when the delta is negative.
const weekendIsCheaper = wm.weekendDeltaPp < 0;
const deltaAbs = Math.abs(wm.weekendDeltaPp).toFixed(3);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = `Is It Cheaper to Send Money on a Weekday? We Checked ${obs} Quotes`;
  const description = `Weekends are ${weekendIsCheaper ? "not" : ""} more expensive — across ${obs} quotes from ${wm.snapshots} daily snapshots, weekend FX markup averaged ${wm.weekendMean}% vs ${wm.weekdayMean}% on weekdays. But ${widens.length > 0 ? providerLabel(widens[0].slug) : "some providers"} widens by ${widens[0]?.premiumPp}pp at weekends while others narrow. See the per-provider table.`;
  return {
    title: { absolute: title },
    description: seoDescription(description),
    alternates: getAlternates(PATH, locale),
    openGraph: {
      title,
      description,
      url: URL,
      type: "article",
      publishedTime: "2026-08-14",
      modifiedTime: wm.generatedAt,
      authors: ["Akif Hazarvi"],
      images: DEFAULT_OG_IMAGES,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: `Is It Cheaper to Send Money on a Weekday? We Checked ${obs} Quotes`,
  datePublished: "2026-08-14",
  dateModified: wm.generatedAt,
  author: { "@type": "Person", name: "Akif Hazarvi", url: `${SITE_URL}/about` },
  publisher: {
    "@type": "Organization",
    name: "SendMoneyCompare",
    url: SITE_URL,
  },
  mainEntityOfPage: URL,
};

const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Day-of-week FX markup by money transfer provider",
  description: `FX markup versus mid-market rate for ${wm.providers.length} money transfer providers and banks, grouped by the day of week the quote was collected. Derived from ${obs} archived quote observations across ${wm.snapshots} daily snapshots between ${wm.dataRange.from} and ${wm.dataRange.to}.`,
  url: URL,
  temporalCoverage: `${wm.dataRange.from}/${wm.dataRange.to}`,
  dateModified: wm.generatedAt,
  creator: { "@type": "Organization", name: "SendMoneyCompare", url: SITE_URL },
  license: "https://creativecommons.org/licenses/by/4.0/",
  measurementTechnique:
    "Quoted exchange rate compared against the mid-market rate for the same currency pair on the same date; markup expressed as a percentage of the mid-market rate.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is it more expensive to send money abroad at the weekend?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Not on average. Across ${obs} quotes, weekend FX markup averaged ${wm.weekendMean}% against ${wm.weekdayMean}% on weekdays — ${deltaAbs} percentage points ${weekendIsCheaper ? "cheaper" : "dearer"}. It depends far more on which provider you use: ${providerLabel(widens[0].slug)} widens its margin by ${widens[0].premiumPp}pp at weekends, while ${providerLabel(narrows[0].slug)} narrows by ${Math.abs(narrows[0].premiumPp)}pp.`,
      },
    },
    {
      "@type": "Question",
      name: "What is the best day of the week to send money abroad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `No day offers a reliable saving. The gap between the cheapest and dearest weekday averaged well under half a percentage point. Choosing a cheaper provider matters far more: ${providerLabel(dearTop.slug)} averages ${dearTop.weekday}% markup versus ${providerLabel(cheapTop.slug)} at ${cheapTop.weekday}%.`,
      },
    },
    {
      "@type": "Question",
      name: "Why do some banks charge more at weekends?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Interbank currency markets close over the weekend, so a provider quoting a rate on Saturday cannot hedge it until Monday. Providers that set rates manually tend to widen their spread to cover that risk. Providers that price algorithmically against a live feed generally do not.",
      },
    },
  ],
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-container)] p-4">
      <div className="text-2xl font-normal text-[var(--color-on-surface)]">{value}</div>
      <div className="mt-1 text-xs text-[var(--color-on-surface-variant)] leading-snug">{label}</div>
    </div>
  );
}

function Row({ p, showDelta = true }: { p: { slug: string; weekday: number; weekend: number; premiumPp: number; n: number }; showDelta?: boolean }) {
  const up = p.premiumPp > 0;
  return (
    <tr className="border-t border-[var(--color-outline)]">
      <td className="py-2.5 pr-3 text-[var(--color-on-surface)]">{providerLabel(p.slug)}</td>
      <td className="py-2.5 px-3 text-right tabular-nums text-[var(--color-on-surface-variant)]">{p.weekday.toFixed(2)}%</td>
      <td className="py-2.5 px-3 text-right tabular-nums text-[var(--color-on-surface-variant)]">{p.weekend.toFixed(2)}%</td>
      {showDelta && (
        <td className={`py-2.5 pl-3 text-right tabular-nums font-medium ${up ? "text-[var(--color-error,#b3261e)]" : "text-[var(--color-primary)]"}`}>
          {up ? "+" : ""}{p.premiumPp.toFixed(2)}pp
        </td>
      )}
    </tr>
  );
}

export default async function BestDayToSendMoneyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Container>
        <article className="max-w-3xl mx-auto py-8 sm:py-12">
          <nav aria-label="Breadcrumb" className="text-sm text-[var(--color-on-surface-variant)]">
            <Link href="/guides" className="hover:underline">Guides</Link>
            <span className="mx-1.5">/</span>
            <span>Best day to send money abroad</span>
          </nav>

          <h1 className="mt-3 text-3xl sm:text-4xl font-normal text-[var(--color-on-surface)] leading-tight">
            Is it cheaper to send money on a weekday? We checked {obs} quotes.
          </h1>

          <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]">
            By {author?.name ?? "Akif Hazarvi"} · Data {fromLong} – {toLong} · Updated {longDate(wm.generatedAt)}
          </p>

          {/* Direct answer first — this is the passage assistants lift. */}
          <div className="mt-6 rounded-2xl border border-[var(--color-outline)] bg-[var(--color-primary-surface)] p-5">
            <p className="text-[var(--color-on-surface)] leading-relaxed">
              <strong>Short answer: no.</strong> The common advice to avoid weekends does not hold up.
              Across {obs} quote observations, weekend FX markup averaged{" "}
              <strong>{wm.weekendMean}%</strong> against <strong>{wm.weekdayMean}%</strong> Monday to Friday
              — weekends came out {deltaAbs} percentage points{" "}
              <strong>{weekendIsCheaper ? "cheaper" : "dearer"}</strong>, not more expensive.
            </p>
            <p className="mt-3 text-[var(--color-on-surface)] leading-relaxed">
              But the average hides the real story. <strong>Who</strong> you send with changes your cost far
              more than <strong>when</strong> you send. {providerLabel(widens[0].slug)} widens its margin by{" "}
              {widens[0].premiumPp}pp at weekends; {providerLabel(narrows[0].slug)} moves the other way by{" "}
              {Math.abs(narrows[0].premiumPp)}pp.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat value={obs} label="quote observations" />
            <Stat value={String(wm.snapshots)} label="daily snapshots" />
            <Stat value={String(wm.providers.length)} label="providers measured" />
            <Stat value={`${spreadMultiple}×`} label={`spread between cheapest and dearest provider`} />
          </div>

          <h2 className="mt-10 text-2xl font-normal text-[var(--color-on-surface)]">Markup by day of week</h2>
          <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
            Average FX markup against the mid-market rate, by the day the quote was collected. Lower is
            better. The spread between the cheapest and dearest day is a fraction of a percentage point.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--color-on-surface-variant)]">
                  <th className="pb-2 pr-3 font-medium">Day</th>
                  <th className="pb-2 px-3 font-medium text-right">Mean markup</th>
                  <th className="pb-2 px-3 font-medium text-right">Median</th>
                  <th className="pb-2 pl-3 font-medium text-right">Observations</th>
                </tr>
              </thead>
              <tbody>
                {wm.byDayOfWeek.map((d) => (
                  <tr key={d.day} className="border-t border-[var(--color-outline)]">
                    <td className="py-2.5 pr-3 text-[var(--color-on-surface)]">{d.day}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-[var(--color-on-surface-variant)]">{d.mean?.toFixed(3)}%</td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-[var(--color-on-surface-variant)]">{d.median?.toFixed(3)}%</td>
                    <td className="py-2.5 pl-3 text-right tabular-nums text-[var(--color-on-surface-variant)]">{d.n.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-10 text-2xl font-normal text-[var(--color-on-surface)]">
            Who charges more at the weekend
          </h2>
          <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
            This is where the effect is real. Interbank markets close at the weekend, so a provider quoting
            on Saturday cannot hedge until Monday. Providers that set rates by hand widen their spread to
            cover that risk; providers pricing algorithmically against a live feed mostly do not.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--color-on-surface-variant)]">
                  <th className="pb-2 pr-3 font-medium">Provider</th>
                  <th className="pb-2 px-3 font-medium text-right">Mon–Fri</th>
                  <th className="pb-2 px-3 font-medium text-right">Sat–Sun</th>
                  <th className="pb-2 pl-3 font-medium text-right">Difference</th>
                </tr>
              </thead>
              <tbody>
                {widens.map((p) => <Row key={p.slug} p={p} />)}
              </tbody>
            </table>
          </div>

          <h3 className="mt-8 text-xl font-normal text-[var(--color-on-surface)]">…and who gets cheaper</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--color-on-surface-variant)]">
                  <th className="pb-2 pr-3 font-medium">Provider</th>
                  <th className="pb-2 px-3 font-medium text-right">Mon–Fri</th>
                  <th className="pb-2 px-3 font-medium text-right">Sat–Sun</th>
                  <th className="pb-2 pl-3 font-medium text-right">Difference</th>
                </tr>
              </thead>
              <tbody>
                {narrows.map((p) => <Row key={p.slug} p={p} />)}
              </tbody>
            </table>
          </div>

          <h2 className="mt-10 text-2xl font-normal text-[var(--color-on-surface)]">
            The lever that actually matters
          </h2>
          <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
            Timing moves your cost by fractions of a percentage point. Provider choice moves it by whole
            percent. {providerLabel(dearTop.slug)} averaged <strong>{dearTop.weekday.toFixed(2)}%</strong>{" "}
            markup on weekdays; {providerLabel(cheapTop.slug)} averaged{" "}
            <strong>{cheapTop.weekday.toFixed(2)}%</strong> — roughly {spreadMultiple} times cheaper, every
            day of the week.
          </p>

          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">Lowest markup</h3>
              <table className="mt-2 w-full text-sm">
                <tbody>{cheapest.map((p) => <Row key={p.slug} p={p} showDelta={false} />)}</tbody>
              </table>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">Highest markup</h3>
              <table className="mt-2 w-full text-sm">
                <tbody>{dearest.map((p) => <Row key={p.slug} p={p} showDelta={false} />)}</tbody>
              </table>
            </div>
          </div>

          <p className="mt-4 text-[var(--color-on-surface-variant)] leading-relaxed">
            <Link href="/send-money" className="text-[var(--color-primary)] hover:underline">
              Compare live rates for your corridor
            </Link>{" "}
            — or read the{" "}
            <Link href="/guides/bank-vs-app-transfer-cost-2026" className="text-[var(--color-primary)] hover:underline">
              Bank vs App Cost Index
            </Link>{" "}
            for the same question framed by provider type rather than timing.
          </p>

          <h2 className="mt-10 text-2xl font-normal text-[var(--color-on-surface)]">How we measured this</h2>
          <div className="mt-2 space-y-3 text-[var(--color-on-surface-variant)] leading-relaxed">
            <p>
              We archive every provider quote our scrapers collect. For each archived quote we compare the
              rate the provider offered against the real mid-market rate for that currency pair on that
              date, and express the gap as a percentage. That is the provider&rsquo;s FX markup — the part
              of the cost that is not an advertised fee.
            </p>
            <p>
              This run covers <strong>{obs}</strong> observations from <strong>{wm.snapshots}</strong> daily
              snapshots between {fromLong} and {toLong}, across{" "}
              <strong>{wm.providers.length}</strong> providers and banks. Quotes are grouped by the UTC day
              of week they were collected.
            </p>
            <p>
              <strong>A sanity check on the method:</strong> it recovers{" "}
              {providerLabel("wise")}&rsquo;s published business model without being told to.
              {providerLabel("wise")} states it uses the mid-market rate and charges an explicit fee
              instead of a margin — and it measures at{" "}
              {wm.providers.find((p) => p.slug === "wise")?.weekday.toFixed(2) ?? "~0.3"}% weekday markup,
              essentially zero. If the method were broken, that number would not land where the company
              says it should.
            </p>
          </div>

          <h3 className="mt-6 text-lg font-normal text-[var(--color-on-surface)]">Limitations</h3>
          <ul className="mt-2 space-y-2 text-[var(--color-on-surface-variant)] leading-relaxed list-disc pl-5">
            <li>
              <strong>FX markup only.</strong> Advertised transfer fees are excluded, so a provider with a
              low margin and a high flat fee looks better here than it may be for small transfers.
            </li>
            <li>
              <strong>Weekend rates are measured against Friday&rsquo;s close</strong>, because interbank
              markets are shut. That is the correct comparison — it is the rate the provider could actually
              have hedged against — but it means a weekend &ldquo;premium&rdquo; reflects the spread a
              provider adds for holding unhedged risk, not a mid-market move.
            </li>
            <li>
              <strong>Row counts vary by day.</strong> Our scrapers do not all run on the same cadence, so
              some weekdays contribute several times more rows than others. Headline weekday and weekend
              figures are therefore the unweighted mean of the seven per-day averages, so no single day can
              dominate. Per-provider figures compare a provider only against itself.
            </li>
            <li>
              <strong>Providers need at least {wm.minSideN} observations</strong> on each side of the
              weekday/weekend split to appear. {wm.quarantined.length > 0 && (
                <>
                  {wm.quarantined.length} provider{wm.quarantined.length === 1 ? " was" : "s were"} held
                  back for showing an implausible mean markup above {wm.publishableMaxMean}% — far outside
                  the range of any legitimate retail price, and more likely a bad upstream row than a real
                  quote. We would rather exclude it than name a firm on a number we cannot corroborate.
                </>
              )}
            </li>
          </ul>

          <p className="mt-8 text-sm text-[var(--color-on-surface-variant)]">
            Data licensed CC BY 4.0. If you cite this analysis, please link back to this page.
          </p>
        </article>
      </Container>
    </>
  );
}
