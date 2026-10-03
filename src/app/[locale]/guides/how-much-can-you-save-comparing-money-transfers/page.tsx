import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import GuideResearchLayout from "@/components/GuideResearchLayout";
import DataProvenance from "@/components/DataProvenance";
import SavingsCalculator, { type CalcCorridor, type CalcQuote } from "@/components/SavingsCalculator";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import { seoDescription } from "@/lib/seo-title";
import { getAuthor } from "@/data/authors";
import { generateQuotes } from "@/lib/quotes-engine";
import { companyPageRenders } from "@/lib/route-map";
import { hasProviderLogo, providerLogo } from "@/lib/provider-logo";
import {
  readerSavings as rs,
  publishableCorridors,
  publishableProviders,
  corridorHref,
  corridorLabel,
  splitCorridor,
  providerLabel,
  pct,
  usd,
  longDate,
  periodLabel,
  type CorridorRow,
} from "@/lib/reader-savings";

const SITE_URL = "https://sendmoneycompare.com";
const SLUG = "how-much-can-you-save-comparing-money-transfers";
const PATH = `guides/${SLUG}`;
const URL = `${SITE_URL}/${PATH}`;
const PUBLISHED = "2026-10-03";
const CALC_SOURCE = "savings_calculator:guide";

const author = getAuthor("ahsan-mukhtar");

// Every figure below is read from reader-savings.json (scripts/build-reader-
// savings.ts), never typed into the copy, so the article cannot drift from
// the data it describes.
const T = rs.totals;
const nf = (n: number) => n.toLocaleString("en-US");
// Raw counts (choices, people) stay out of the copy: a month of one site's
// readers is a small absolute number that says nothing about what comparing
// is worth. Findings are shares, medians and gaps per $1,000; the sample is
// described, not counted.
/** "A, B and C" */
const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
const fromLong = longDate(rs.clicksMeta.window.from);
const toLong = longDate(rs.clicksMeta.window.to);
const period = periodLabel();
const days = rs.method.snapshotsUsed;
const corridors = publishableCorridors();
const MIN_PROVIDER_CHOICES = 5;
const providers = publishableProviders(MIN_PROVIDER_CHOICES);
const taptap = rs.providers.find((p) => p.slug === "taptap-send");
const taptapShare = taptap ? taptap.decisions / T.decisions : 0;
const taptapLeads = corridors.filter((c) => c.window?.mostFrequentLeader[0]?.slug === "taptap-send");
const lead = corridors[0];

/** An amount in the corridor's sending currency: "$9.90", "£10.70". */
function sendMoney(n: number, currency: string, dp = 2) {
  try {
    return n.toLocaleString("en-US", { style: "currency", currency, minimumFractionDigits: dp, maximumFractionDigits: dp });
  } catch {
    return `${n.toFixed(dp)} ${currency}`;
  }
}
/** A window percentage restated per 1,000 units of the sending currency. */
const per1000 = (row: CorridorRow, p: number | null | undefined) =>
  p == null ? "—" : sendMoney((p / 100) * 1000, splitCorridor(row.corridor).from);

const bankRows = corridors.filter((c) => c.window?.medianBestVsBankPct != null);
const bankMin = Math.min(...bankRows.map((c) => c.window!.medianBestVsBankPct!));
const bankMax = Math.max(...bankRows.map((c) => c.window!.medianBestVsBankPct!));
// One scale for both bar columns, so a bar's length compares across them.
const barMax = Math.max(bankMax, ...corridors.map((c) => c.window!.medianBestVsMedianPct));

// Leads with the site's top non-brand Google query ("compare money transfer rates").
const TITLE = `Compare Money Transfer Rates: How Much You Save (${period} Data)`;
const DESCRIPTION = `In ${period} our readers' picks paid a median ${usd(T.medianVsBankPer1000 ?? 0, 2)} more per $1,000 than a bank. ${providerLabel("taptap-send")} was the most chosen provider. Data by corridor, plus a calculator.`;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: { absolute: TITLE },
    description: seoDescription(DESCRIPTION),
    authors: [{ name: "Ahsan Mukhtar", url: `${SITE_URL}/about/ahsan-mukhtar` }],
    alternates: getAlternates(PATH, locale),
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: URL,
      type: "article",
      publishedTime: PUBLISHED,
      modifiedTime: rs.generatedAt,
      authors: ["Ahsan Mukhtar"],
      images: DEFAULT_OG_IMAGES,
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  };
}

const FAQ = [
  {
    q: "How much can you save by comparing money transfer providers?",
    a: `On the corridors our readers used in ${period}, the provider at the top of our comparison paid a median ${usd(T.medianOpportunityPer1000, 2)} more per $1,000 than the median provider on the same route that day, and the top payer beat the median bank quote by ${bankMin.toFixed(1)}% to ${bankMax.toFixed(1)}% depending on the corridor. On a $1,000 transfer that is roughly $${Math.round(bankMin * 10)} to $${Math.round(bankMax * 10)} more reaching your recipient than through a typical bank.`,
  },
  {
    q: "Is a bank or a money transfer app cheaper for sending money abroad?",
    a: `In our data, specialist providers. On routes where we also quote banks, the provider our readers picked paid a median ${usd(T.medianVsBankPer1000 ?? 0, 2)} more per $1,000 than the median bank quote that day. Most of a bank's cost is in the exchange rate, not the fee on the screen.`,
  },
  {
    q: "Which money transfer provider did readers choose most often?",
    a: taptap?.priced
      ? `${providerLabel("taptap-send")}, with ${pct(taptapShare)} of all choices. Of those we could price against that day's quotes, ${pct(taptap.priced.shareAboveMedian)} paid more than the median provider and ${pct(taptap.priced.shareTopPayer)} were the day's top payer. ${providerLabel("taptap-send")} is a paid partner of SendMoneyCompare; payment never changes the order of our comparison.`
      : "Readers chose a wide spread of providers; see the provider table on this page.",
  },
  {
    q: "Is the top-paying provider the same every day?",
    a: lead?.window
      ? `Often not. On ${corridorLabel(lead.corridor)}, the corridor our readers compared most, the top payer at ${nf(lead.window.referenceAmount)} ${splitCorridor(lead.corridor).from} was ${list(lead.window.mostFrequentLeader.map((l) => `${providerLabel(l.slug)} on ${l.days} days`))} of the ${lead.window.days} we archived. Check the comparison on the day you send rather than relying on last month's winner.`
      : "Often not; check the comparison on the day you send.",
  },
  {
    q: "How did you calculate these savings?",
    a: `Each time a reader clicked through to a provider from our comparison (recorded in Google Analytics, China and Singapore excluded as bot traffic), we priced that provider against the quotes we archived for the same corridor on the same day, at the send amount nearest $1,000 that at least ${rs.method.minProviders} providers quote. We do not know whether a reader completed a transfer or how much they sent, so each gap is stated per $1,000 sent, not as money saved.`,
  },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  datePublished: PUBLISHED,
  dateModified: rs.generatedAt,
  author: { "@type": "Person", name: "Ahsan Mukhtar", url: `${SITE_URL}/about/ahsan-mukhtar` },
  publisher: { "@type": "Organization", name: "SendMoneyCompare", url: SITE_URL },
  mainEntityOfPage: URL,
  about: ["International money transfers", "Remittance costs", "Money transfer comparison"],
};

const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Money transfer provider choices on SendMoneyCompare, priced against same-day quotes",
  description: `Every money transfer provider SendMoneyCompare readers chose from our comparison, across ${T.corridors} corridors (${rs.clicksMeta.window.from} to ${rs.clicksMeta.window.to}), priced against the comparison archived that day: the chosen provider's payout against the median provider, the top payer and the median bank quote.`,
  url: URL,
  temporalCoverage: `${rs.clicksMeta.window.from}/${rs.clicksMeta.window.to}`,
  dateModified: rs.generatedAt,
  creator: { "@type": "Organization", name: "SendMoneyCompare", url: SITE_URL },
  license: "https://creativecommons.org/licenses/by/4.0/",
  variableMeasured: [
    "Chosen provider payout versus median provider, percent",
    "Top payer versus median provider, percent",
    "Chosen provider payout versus median bank quote, percent",
    "Share of choices above the median provider",
  ],
  measurementTechnique:
    "Google Analytics provider_clicked events (day × corridor × provider, distinct users) joined to the archived quote snapshot for the same corridor and day, priced at the send amount nearest USD 1,000.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] p-4">
      <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-on-surface)] tabular-nums">{value}</div>
      <div className="mt-1 text-xs text-[var(--color-on-surface-variant)] leading-snug">{label}</div>
    </div>
  );
}

/** A thin single-series bar; the number beside it carries the value. */
function Bar({ value, max, label }: { value: number; max: number; label: string }) {
  const w = max > 0 ? Math.max(2, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-2 min-w-0" title={label}>
      <div className="h-2 flex-1 rounded-full bg-[var(--color-surface-dim)] overflow-hidden" aria-hidden="true">
        <div className="h-full rounded-full bg-[var(--color-primary)]" style={{ width: `${w}%` }} />
      </div>
    </div>
  );
}

function ProviderName({ slug }: { slug: string }) {
  const name = providerLabel(slug);
  return (
    <span className="inline-flex items-center gap-2 min-w-0">
      {hasProviderLogo(slug) && (
        <Image src={providerLogo(slug)} alt="" width={22} height={22} className="rounded-full bg-white border border-[var(--color-outline)] object-contain p-0.5 shrink-0" />
      )}
      {companyPageRenders(slug) ? (
        <Link href={`/companies/${slug}`} className="truncate hover:text-[var(--color-primary)] hover:underline">{name}</Link>
      ) : (
        <span className="truncate">{name}</span>
      )}
    </span>
  );
}

function CorridorName({ corridor }: { corridor: string }) {
  const href = corridorHref(corridor);
  const label = corridorLabel(corridor);
  return href ? (
    <Link href={href} className="font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] hover:underline">{label}</Link>
  ) : (
    <span className="font-semibold text-[var(--color-on-surface)]">{label}</span>
  );
}

export default async function HowMuchCanYouSavePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // The calculator opens on the corridor readers compared most, priced by the
  // same generateQuotes() rows the comparison tables render, projected to the
  // five fields it shows so no dataset crosses into the client bundle.
  const initialCorridor = lead?.corridor ?? "USD-INR";
  const { from: iFrom, to: iTo } = splitCorridor(initialCorridor);
  const initialQuotes: CalcQuote[] = generateQuotes(1000, iFrom, iTo)
    .filter((q) => !q.isIndicative && q.receiveAmount > 0)
    .map(({ providerSlug, receiveAmount, fee, exchangeRate, transferSpeed }) => ({ providerSlug, receiveAmount, fee, exchangeRate, transferSpeed }));
  const calcCorridors: CalcCorridor[] = corridors.map((c) => ({ corridor: c.corridor, label: corridorLabel(c.corridor) }));

  const maxShare = Math.max(...providers.map((p) => p.priced!.shareAboveMedian));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <GuideResearchLayout slug={SLUG}>
        <nav aria-label="Breadcrumb" className="text-sm text-[var(--color-on-surface-variant)]">
          <Link href="/guides" className="hover:underline">Guides</Link>
          <span className="mx-1.5">/</span>
          <span>How much comparing saves</span>
        </nav>

        <h1 className="mt-3 text-3xl sm:text-4xl font-normal text-[var(--color-on-surface)] leading-tight">
          How much do you save by comparing money transfers? Our {period} data
        </h1>

        <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]">
          By{" "}
          <Link href="/about/ahsan-mukhtar" className="hover:underline">{author?.name ?? "Ahsan Mukhtar"}</Link>, founder · Reader data: {period} · Updated{" "}
          {longDate(rs.generatedAt)}
        </p>

        {/* Direct answer first: the passage assistants lift. */}
        <div className="mt-6 rounded-2xl border border-[var(--color-outline)] bg-[var(--color-primary-surface)] p-5">
          <p className="text-[var(--color-on-surface)] leading-relaxed">
            <strong>Short answer:</strong> comparing is worth tens of dollars on every $1,000 you send, and most of it is
            the gap to your bank. Across the provider choices our readers made in {period}, priced against the
            quotes we archived that same day, the provider they picked paid a median{" "}
            <strong>{usd(T.medianVsBankPer1000 ?? 0, 2)} more per $1,000</strong> than the median bank quote, and{" "}
            <strong>{usd(T.medianGainVsMedianPer1000, 2)} more</strong> than the median provider on the route.
          </p>
          <p className="mt-3 text-[var(--color-on-surface)] leading-relaxed">
            {pct(T.shareAboveMedian)}{" "}of those choices beat the median provider, and {pct(T.shareTopPayer)}{" "}landed on the
            day&rsquo;s top payer. Had every reader picked the top payer, the median gain over a typical provider would
            have been {usd(T.medianOpportunityPer1000, 2)} per $1,000. The calculator below prices your own transfer.
          </p>
          {taptap && (
            <p className="mt-3 text-[var(--color-on-surface)] leading-relaxed">
              The provider readers chose most was <strong>{providerLabel("taptap-send")}</strong>, with{" "}
              {pct(taptapShare)}{" "}of all choices.
              {taptapLeads.length > 0 && (
                <>
                  {" "}It was also the most frequent top payer on{" "}
                  {list(taptapLeads.map((c) => `${corridorLabel(c.corridor)} (${c.window!.mostFrequentLeader[0].days} of ${c.window!.days} days)`))}.
                </>
              )}
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat value={pct(T.shareTop3)} label="landed in the day&rsquo;s top three providers" />
          <Stat value={pct(T.shareAboveMedian)} label="chose a provider paying above the median" />
          <Stat value={usd(T.medianVsBankPer1000 ?? 0, 0)} label="more per $1,000 than a bank (median)" />
          <Stat value={String(days)} label="days of archived quotes behind the figures" />
        </div>

        {/* The human reason this site exists. */}
        <aside aria-label="A note from the founder" className="mt-8 rounded-2xl border-l-4 border-[var(--color-primary)] bg-[var(--color-surface-dim)] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)]">A note from Ahsan</p>
          <div className="mt-3 space-y-3 text-[var(--color-on-surface)] leading-relaxed">
            <p>
              I&rsquo;m an expat. I know what it means to work far from home and send part of every pay cheque back,
              and I know the moment afterwards when you check what actually arrived. The fee is printed on the screen.
              The exchange-rate margin usually isn&rsquo;t, and on a bank transfer it is often the bigger cost.
            </p>
            <p>
              That is why SendMoneyCompare exists: to put the whole price, fee and rate together, side by side, so more
              of the money you worked for reaches the people you sent it to, and less of it stays in a margin.
            </p>
            <p>
              This page is the first time we have checked whether that works, using what readers actually did rather
              than a survey or a testimonial: which provider each person chose on our comparison, priced against the
              quotes we archived that same day. Where we could not price a choice fairly, we say so and say why.
            </p>
          </div>
          <p className="mt-4 text-sm text-[var(--color-on-surface-variant)]">
            Ahsan Mukhtar, founder of SendMoneyCompare.{" "}
            <Link href="/about/ahsan-mukhtar" className="text-[var(--color-primary)] hover:underline">About Ahsan</Link>
          </p>
        </aside>

        <h2 className="mt-12 text-2xl font-normal text-[var(--color-on-surface)]">
          Which providers readers chose, corridor by corridor
        </h2>
        <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
          The routes our readers compared most, where we could price enough choices to report. &ldquo;Comparing
          is worth&rdquo; is the median gap, over {days}{" "}days, between the top payer and the median provider at 1,000
          units of the sending currency; &ldquo;versus a bank&rdquo; is the top payer against the median bank quote on
          the same day.
        </p>

        <div className="mt-5 rounded-2xl border border-[var(--color-outline)] overflow-hidden">
          <div className="hidden md:grid grid-cols-[minmax(0,1.3fr)_minmax(0,1.5fr)_minmax(0,1.1fr)_minmax(0,1.1fr)] gap-3 px-4 py-2.5 bg-[var(--color-surface-dim)] text-xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
            <span>Corridor</span>
            <span>Most chosen</span>
            <span>Comparing is worth</span>
            <span>Versus a bank</span>
          </div>
          {corridors.map((c) => {
            const w = c.window!;
            return (
              <div
                key={c.corridor}
                className="grid grid-cols-2 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.5fr)_minmax(0,1.1fr)_minmax(0,1.1fr)] gap-x-3 gap-y-2 px-4 py-3 border-t border-[var(--color-outline)] first:border-t-0 md:first:border-t text-sm items-center"
              >
                <span className="col-span-2 md:col-span-1"><CorridorName corridor={c.corridor} /></span>
                <span className="col-span-2 md:col-span-1 text-[var(--color-on-surface-variant)] truncate">
                  <span className="md:hidden">Most chosen: </span>
                  {c.chosen.slice(0, 2).map((p) => providerLabel(p.slug)).join(", ")}
                </span>
                <span className="col-span-2 md:col-span-1">
                  <span className="block text-[var(--color-on-surface)] tabular-nums">
                    {per1000(c, w.medianBestVsMedianPct)}<span className="text-[var(--color-on-surface-variant)]"> per {nf(1000)} {splitCorridor(c.corridor).from}</span>
                  </span>
                  <Bar value={w.medianBestVsMedianPct} max={barMax} label={`${w.medianBestVsMedianPct}% top payer over median provider`} />
                </span>
                <span className="col-span-2 md:col-span-1">
                  {w.medianBestVsBankPct != null ? (
                    <>
                      <span className="block text-[var(--color-on-surface)] tabular-nums">
                        {per1000(c, w.medianBestVsBankPct)}<span className="text-[var(--color-on-surface-variant)]"> ({w.medianBestVsBankPct.toFixed(1)}%)</span>
                      </span>
                      <Bar value={w.medianBestVsBankPct} max={barMax} label={`${w.medianBestVsBankPct}% top payer over median bank`} />
                    </>
                  ) : (
                    <span className="text-[var(--color-on-surface-variant)]">No bank quoted</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {lead?.window && (
          <p className="mt-5 text-[var(--color-on-surface-variant)] leading-relaxed">
            <strong className="text-[var(--color-on-surface)]">{corridorLabel(lead.corridor)}</strong> was the route our
            readers compared most, and the providers they chose most there were{" "}
            {list(lead.chosen.slice(0, 3).map((p) => providerLabel(p.slug)))}. The top payer was not fixed. Over{" "}
            {lead.window.days} days it was{" "}
            {list(lead.window.mostFrequentLeader.map((l) => `${providerLabel(l.slug)} on ${l.days}`))} days.
            {lead.window.latest && (
              <>
                {" "}On {longDate(lead.window.latest.date)}, {nf(lead.window.latest.amount)} {splitCorridor(lead.corridor).from}{" "}
                delivered {nf(Math.round(lead.window.latest.best.receive))} {splitCorridor(lead.corridor).to} through{" "}
                {providerLabel(lead.window.latest.best.slug)}, against{" "}
                {nf(Math.round(lead.window.latest.worst.receive))} through the lowest of the{" "}
                {lead.window.latest.providers} options we compared.
              </>
            )}
          </p>
        )}

        <h2 className="mt-12 text-2xl font-normal text-[var(--color-on-surface)]">
          How much could you have saved? Price your own transfer
        </h2>
        <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
          Pick your route, how much you send and how often, and what you use today. The calculator reads the same quotes
          as our comparison tables, so the figure is what the top of the table would have delivered against your current
          option, after fees.
        </p>
        <SavingsCalculator
          corridors={calcCorridors}
          initialCorridor={initialCorridor}
          initialAmount={1000}
          initialQuotes={initialQuotes}
          source={CALC_SOURCE}
        />

        <h2 className="mt-12 text-2xl font-normal text-[var(--color-on-surface)]">
          How readers&rsquo; picks priced, provider by provider
        </h2>
        <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
          Providers our readers chose often enough to report. &ldquo;Above the median&rdquo; is the share of choices
          where that provider paid more than the median provider on the same corridor and day.
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="text-left text-[var(--color-on-surface-variant)]">
                <th className="pb-2 pr-3 font-medium">Provider</th>
                <th className="pb-2 px-3 font-medium">Above the median</th>
                <th className="pb-2 px-3 font-medium text-right">Top payer</th>
                <th className="pb-2 pl-3 font-medium text-right">Median gain per $1,000</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.slug} className="border-t border-[var(--color-outline)]">
                  <td className="py-2.5 pr-3 text-[var(--color-on-surface)]"><ProviderName slug={p.slug} /></td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="w-10 tabular-nums text-[var(--color-on-surface)]">{pct(p.priced!.shareAboveMedian)}</span>
                      <Bar value={p.priced!.shareAboveMedian} max={maxShare} label={`${pct(p.priced!.shareAboveMedian)} above the median provider`} />
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[var(--color-on-surface-variant)]">{pct(p.priced!.shareTopPayer)}</td>
                  <td className="py-2.5 pl-3 text-right tabular-nums text-[var(--color-on-surface)]">{usd(p.priced!.medianGainVsMedianPer1000, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {taptap?.priced && (
          <p className="mt-5 text-[var(--color-on-surface-variant)] leading-relaxed">
            <strong className="text-[var(--color-on-surface)]">{providerLabel("taptap-send")}</strong> was the provider
            readers picked most often, with {pct(taptapShare)}{" "}of all choices. Of those we could price,{" "}
            {pct(taptap.priced.shareAboveMedian)}{" "}paid more than the
            median provider that day and {pct(taptap.priced.shareTopPayer)}{" "}were the day&rsquo;s top payer.
            {taptapLeads.length > 0 && (
              <>
                {" "}In the corridor table it was the most frequent top payer on{" "}
                {list(taptapLeads.map((c) => `${corridorLabel(c.corridor)} (${c.window!.mostFrequentLeader[0].days} of ${c.window!.days} days)`))}.
              </>
            )}{" "}
            It is a paid partner of SendMoneyCompare; payment never moves a provider up our comparison.
          </p>
        )}
        <p className="mt-3 text-[var(--color-on-surface-variant)] leading-relaxed">
          Not every choice chases the top payout: {pct(T.shareAboveMedian - T.shareTopPayer)}{" "}of choices beat the median
          provider without being the day&rsquo;s top payer. Readers weigh more than the payout, such as delivery speed or
          an app they already use and trust.
        </p>

        <p className="mt-4 text-[var(--color-on-surface-variant)] leading-relaxed">
          Spread over a year, the per-transfer gap compounds: someone sending $1,000 home every month through a bank
          rather than the top payer gives up roughly {usd(((bankMin + bankMax) / 2) * 10 * 12)} a year at the midpoint of
          the bank gaps in the corridor table.
        </p>

        <h2 className="mt-12 text-2xl font-normal text-[var(--color-on-surface)]">
          Five lessons from {days} days of real choices
        </h2>
        <ol className="mt-3 space-y-4 text-[var(--color-on-surface-variant)] leading-relaxed list-decimal pl-5">
          <li>
            <strong className="text-[var(--color-on-surface)]">The bank is where most of the money goes.</strong> On every
            corridor in the table that quotes a bank, the top payer beat the median bank by {bankMin.toFixed(1)}% to{" "}
            {bankMax.toFixed(1)}%. The gap between specialist providers is real but smaller: a median{" "}
            {usd(T.medianOpportunityPer1000, 2)} per $1,000 between the top payer and the median one.
          </li>
          <li>
            <strong className="text-[var(--color-on-surface)]">Last month&rsquo;s winner is not today&rsquo;s.</strong>{" "}
            The top payer rotates on busy routes, so check on the day you send.{" "}
            <Link href="/provider-consistency" className="text-[var(--color-primary)] hover:underline">The Provider Consistency Index</Link>{" "}
            shows how often each provider leads your corridor.
          </li>
          <li>
            <strong className="text-[var(--color-on-surface)]">You do not need the very top to win.</strong>{" "}
            {pct(T.shareTop3)} of choices landed in the top three for the day and {pct(T.shareAboveMedian)} above the
            median. Looking at a comparison at all does most of the work.
          </li>
          <li>
            <strong className="text-[var(--color-on-surface)]">Small transfers behave differently.</strong> A flat fee is
            a bigger share of $200 than of $1,000, so the order can change with the amount.{" "}
            <Link href="/transfer-cost-by-amount" className="text-[var(--color-primary)] hover:underline">See how cost changes by amount</Link>.
          </li>
          <li>
            <strong className="text-[var(--color-on-surface)]">Timing matters far less than choice.</strong> Weekday versus
            weekend moves your cost by a fraction of a percentage point;{" "}
            <Link href="/guides/best-day-to-send-money-abroad" className="text-[var(--color-primary)] hover:underline">our day-of-week study</Link>{" "}
            measured it. Provider choice moves it by whole percent.
          </li>
        </ol>
        <p className="mt-5 text-[var(--color-on-surface-variant)] leading-relaxed">
          Ready to check your own route?{" "}
          <Link href="/send-money" className="text-[var(--color-primary)] font-semibold hover:underline">Compare money transfer rates now</Link>
          , or read the{" "}
          <Link href="/guides/bank-vs-app-transfer-cost-2026" className="text-[var(--color-primary)] hover:underline">Bank vs App Cost Index</Link>{" "}
          for the same question asked of every bank we price.
        </p>

        <h2 className="mt-12 text-2xl font-normal text-[var(--color-on-surface)]">How we measured reader savings</h2>
        <div className="mt-2 space-y-3 text-[var(--color-on-surface-variant)] leading-relaxed">
          <p>
            <strong className="text-[var(--color-on-surface)]">The choices.</strong> When a reader clicks through to a
            provider from any comparison on this site, Google Analytics records the provider and the corridor. We counted
            distinct people per day, corridor and provider from {fromLong} to {toLong}, on {T.corridors}{" "}corridors.
            Choices made from provider review pages carry no corridor and are left out. Visits from {rs.clicksMeta.excludedCountries.join(" and ")} are excluded after the bot waves we
            recorded in September 2026.
          </p>
          <p>
            <strong className="text-[var(--color-on-surface)]">The prices.</strong> We archive every quote our scrapers
            collect. Each choice was priced against the archived comparison for its corridor on the same day, at the send
            amount nearest $1,000 that at least {rs.method.minProviders} providers quote, using the same source priority
            and integrity checks as our live tables. Payouts within {rs.method.tieBandPct}% of each other count as a tie
            for the top spot, as they do in our tables.
          </p>
          <p>
            <strong className="text-[var(--color-on-surface)]">What we could not price, and why.</strong> These choices
            are left out of the figures:
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              {providerLabel("wise")} on routes from the Gulf. Until 3 October 2026 our
              tables showed a placeholder Wise row there when Wise returned no quote; Wise does not accept Saudi riyals
              as a sending currency. We removed those rows, and these choices cannot count as savings.
            </li>
            <li>
              Providers whose stored rate turned out to include a first-transfer
              promotion, which a repeat sender would not get. Those providers are now hidden from our comparison.
            </li>
            <li>
              Choices on a corridor where fewer than {rs.method.minProviders}{" "}providers quoted near $1,000 that day,
              and providers with no quote at that amount, such as brokers who quote by phone.
            </li>
          </ul>
          <p>
            <strong className="text-[var(--color-on-surface)]">Limits.</strong> A click is not a transfer: we do not know
            who went on to send, or how much. Analytics undercounts people who block tracking or decline cookies. A
            figure per $1,000 restates a percentage gap on a $1,000 basis; it is not a recorded transfer, and not an FX
            conversion of the extra the recipient gets. The reference quote can be anywhere from US$
            {rs.method.referenceRangeUsd[0]}{" "}to US${nf(rs.method.referenceRangeUsd[1])}{" "}equivalent, where a flat
            fee weighs differently than at exactly $1,000. Our readers chose to compare, so the sample describes people
            who compare, not everyone who sends money abroad.
          </p>
        </div>

        <h2 className="mt-12 text-2xl font-normal text-[var(--color-on-surface)]">
          Questions about saving when you send money abroad
        </h2>
        <div className="mt-3 divide-y divide-[var(--color-outline)] border-y border-[var(--color-outline)]">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-3">
              <summary className="cursor-pointer list-none font-medium text-[var(--color-on-surface)] flex justify-between gap-4 min-h-11 items-center">
                {f.q}
                <span aria-hidden="true" className="text-[var(--color-on-surface-variant)] group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-sm text-[var(--color-on-surface-variant)]">
          Data licensed CC BY 4.0. If you cite this analysis, please link back to this page.
        </p>
      </GuideResearchLayout>

      <DataProvenance
        dataAsOf={rs.generatedAt}
        computedFrom={`Every provider choice readers made from our comparison in ${period} (Google Analytics), each priced against the quote snapshot archived for its corridor and day (${days} daily snapshots), at the send amount nearest $1,000 that ${rs.method.minProviders}+ providers quote.`}
        sources={[
          { label: "SendMoneyCompare quote archive: every provider’s quotes, recorded every six hours", href: "/methodology" },
          { label: "Provider Consistency Index: who leads each corridor, and how often", href: "/provider-consistency" },
          { label: "How we review and rank providers", href: "/how-we-review" },
        ]}
      />
    </>
  );
}
