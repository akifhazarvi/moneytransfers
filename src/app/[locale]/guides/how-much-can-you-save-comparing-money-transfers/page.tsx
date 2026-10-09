import type { Metadata } from "next";
import Link from "@/components/EligibleLink";
import { ArrowDown } from "lucide-react";
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
const latest = lead?.window?.latest ?? null;

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
// The lowest-to-top payout gap on one route and day, median per route, as a
// range across the routes we report.
const spreads = corridors.map((c) => c.window!.medianBestVsWorstPct);
const spreadMin = Math.min(...spreads);
const spreadMax = Math.max(...spreads);
// $1,000 a month through a bank, at the median gap readers' picks opened over it.
const bankYear = (T.medianVsBankPer1000 ?? 0) * 12;
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

const METHOD_STEPS: [string, string][] = [
  [
    "A reader picks a provider",
    "Clicking through to a provider from our comparison records the provider, the route and the day in Google Analytics.",
  ],
  [
    "We price that choice",
    `Against the comparison we archived for that route on that day, at the send amount nearest US$1,000 that at least ${rs.method.minProviders} providers quote.`,
  ],
  [
    "We measure the gap",
    "Recipient payout after fees: the reader’s pick against the median provider, the day’s top payer and, where we quote one, the median bank.",
  ],
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
  distribution: [{ "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: `${SITE_URL}/api/data/reader-savings` }],
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

/**
 * One archived comparison on a number line from the lowest payout to the top
 * one, the median marked. Positions, not bar lengths: a bar of payouts would
 * have to start far above zero to show any difference, and that misleads.
 */
function PayoutSpread({ row }: { row: CorridorRow }) {
  const q = row.window!.latest!;
  const { from, to } = splitCorridor(row.corridor);
  const span = q.best.receive - q.worst.receive;
  const medianAt = span > 0 ? ((q.median - q.worst.receive) / span) * 100 : 100;
  const gapPct = (a: number, b: number) => (((a - b) / b) * 100).toFixed(1);
  const href = corridorHref(row.corridor);
  const points = [
    { key: "lowest", label: `Lowest of ${q.providers}`, value: q.worst.receive, at: 0, dot: "bg-[var(--color-on-surface-variant)]" },
    { key: "median", label: "Median provider", value: q.median, at: medianAt, dot: "bg-[var(--color-on-surface)]" },
    { key: "top", label: `Top payer: ${providerLabel(q.best.slug)}`, value: q.best.receive, at: 100, dot: "bg-[var(--color-success)]" },
  ];
  return (
    <figure className="mt-5 rounded-3xl border border-[var(--color-outline)] bg-[var(--color-surface)] p-5 sm:p-7">
      <div className="grid gap-3 sm:grid-cols-3">
        {points.map((pt) => (
          <div
            key={pt.key}
            className={`rounded-2xl p-4 ${pt.key === "top" ? "bg-[var(--color-success-surface)]" : "bg-[var(--color-surface-dim)]"}`}
          >
            <p className="flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]">
              <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${pt.dot}`} />
              {pt.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums text-[var(--color-on-surface)]">
              {nf(Math.round(pt.value))} <span className="text-sm font-normal text-[var(--color-on-surface-variant)]">{to}</span>
            </p>
          </div>
        ))}
      </div>
      <div
        role="img"
        aria-label={`From the lowest payout to the top one, the median provider sits ${Math.round(medianAt)}% of the way up.`}
        className="relative mx-2 mt-8 h-1.5 rounded-full bg-gradient-to-r from-[var(--color-outline)] to-[var(--color-success)]"
      >
        {points.map((pt) => (
          <span
            key={pt.key}
            className={`absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-[var(--color-surface)] ${pt.dot}`}
            style={{ left: `${pt.at}%` }}
          />
        ))}
      </div>
      <div className="mt-8 grid gap-5 border-t border-[var(--color-outline)] pt-5 sm:grid-cols-2">
        <div>
          <p className="text-3xl font-semibold tracking-tight tabular-nums text-[var(--color-success)]">
            +{nf(Math.round(span))} {to}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
            from the lowest payout to the top one: {gapPct(q.best.receive, q.worst.receive)}% more for the same{" "}
            {sendMoney(q.amount, from, 0)}.
          </p>
        </div>
        <div>
          <p className="text-3xl font-semibold tracking-tight tabular-nums text-[var(--color-on-surface)]">
            +{nf(Math.round(q.best.receive - q.median))} {to}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
            from the median provider to the top one: {gapPct(q.best.receive, q.median)}% more.
          </p>
        </div>
      </div>
      <figcaption className="mt-5 text-xs leading-relaxed text-[var(--color-on-surface-variant)]">
        {corridorLabel(row.corridor)} quotes archived on {longDate(q.date)} for {sendMoney(q.amount, from, 0)}, after
        fees. One day&rsquo;s comparison, not a current offer
        {href ? (
          <>
            :{" "}
            <Link href={href} className="text-[var(--color-primary)] underline underline-offset-4">see today&rsquo;s</Link>.
          </>
        ) : (
          "."
        )}
      </figcaption>
    </figure>
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

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
          <span>SendMoneyCompare research</span>
          <span aria-hidden="true">·</span>
          <span>{period}</span>
        </div>

        <h1 className="text-[var(--color-on-surface)]">
          How much do you <span className="text-[var(--color-success)]">actually save</span> by comparing money transfers?
        </h1>

        <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]">
          By{" "}
          <Link href="/about/ahsan-mukhtar" className="hover:underline">{author?.name ?? "Ahsan Mukhtar"}</Link>, founder · Reader data: {period} · Updated{" "}
          {longDate(rs.generatedAt)}
        </p>

        {/* Direct answer first: the passage assistants lift. Two answers,
            because someone at a bank and someone already on an app are asking
            different questions. A fixed dark green in both themes, so the
            literal colours rather than tokens that flip in dark mode. */}
        <section aria-label="The short answer" className="mt-8 rounded-3xl bg-[#123f2e] p-6 text-white sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#bfe3cf]">The short answer</p>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed sm:text-xl">
            Comparing is worth tens of dollars on every $1,000 you send, and most of it is the gap to your bank.
          </p>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2 sm:gap-8">
            <div className="border-t border-white/20 pt-5">
              <dt className="text-sm font-semibold text-[#bfe3cf]">If you send through a bank</dt>
              <dd className="mt-2">
                <span className="block text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl">
                  {usd(T.medianVsBankPer1000 ?? 0, 2)}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-white/85">
                  more per $1,000 reached the recipient through the provider our readers chose than through the median
                  bank quote: same route, same day, after fees.
                </span>
              </dd>
            </div>
            <div className="border-t border-white/20 pt-5">
              <dt className="text-sm font-semibold text-[#bfe3cf]">Against a mid-table quote</dt>
              <dd className="mt-2">
                <span className="block text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl">
                  {usd(T.medianOpportunityPer1000, 2)}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-white/85">
                  more per $1,000 from the day&rsquo;s top payer than from the median quote on the same route, banks
                  included.
                </span>
              </dd>
            </div>
          </dl>
          <div className="mt-7 flex flex-col gap-4 rounded-2xl bg-white/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <p className="text-sm leading-relaxed text-white/90">
              Sending $1,000 home every month through a bank? At {period}&rsquo;s median gap, about{" "}
              <strong className="text-white">{usd(bankYear)}{" "}a year</strong> more would reach your family.
            </p>
            <a
              href="#price-your-transfer"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-[14px] bg-[#e9f6dc] px-5 text-sm font-semibold text-[#123f2e] hover:opacity-90"
            >
              Price your own transfer <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
        </section>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Stat value={pct(T.shareAboveMedian)} label="of reader choices paid more than the median provider that day" />
          <Stat value={pct(T.shareTop3)} label="of choices landed in the day’s top three providers" />
          <Stat value={`${spreadMin.toFixed(1)}–${spreadMax.toFixed(1)}%`} label="between the lowest and the top payout on the same route and day (median, by route)" />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--color-on-surface-variant)]">
          <span>Original research</span>
          <span aria-hidden="true">·</span>
          <span>Reader choices from {fromLong} to {toLong}</span>
          <span aria-hidden="true">·</span>
          <span>Priced against {days} daily quote archives</span>
          <span aria-hidden="true">·</span>
          <a href="#how-we-measured" className="underline underline-offset-4 hover:text-[var(--color-primary)]">How we measured it</a>
        </div>

        {/* The human reason this site exists. */}
        <aside aria-label="A note from the founder" className="mt-10 rounded-3xl border border-[var(--color-outline)] p-6 sm:p-8">
          <div className="flex items-center gap-4">
            {author?.photo && (
              <Image src={author.photo} alt="" width={56} height={56} className="h-14 w-14 shrink-0 rounded-full object-cover" />
            )}
            <div>
              <p className="font-semibold text-[var(--color-on-surface)]">A note from Ahsan</p>
              <p className="text-sm text-[var(--color-on-surface-variant)]">
                Founder of SendMoneyCompare ·{" "}
                <Link href="/about/ahsan-mukhtar" className="text-[var(--color-primary)] hover:underline">About Ahsan</Link>
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-[var(--color-on-surface)] [font-family:var(--font-reading)]">
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
        </aside>

        {/* Three separate children, not a fragment: GuideResearchLayout finds
            sections (contents list, partner placement) by direct <h2> children. */}
        {latest && (
          <h2 className="mt-12 text-2xl font-normal text-[var(--color-on-surface)]">
            One {sendMoney(latest.amount, splitCorridor(lead.corridor).from, 0)}{" "}transfer, {latest.providers}{" "}different
            payouts
          </h2>
        )}
        {latest && (
          <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
            What the gap looks like on {corridorLabel(lead.corridor)}, the route our readers compared most, on{" "}
            {longDate(latest.date)}. Every provider was quoted the same amount; this is what each one would have
            delivered, after fees.
          </p>
        )}
        {latest && <PayoutSpread row={lead} />}

        <h2 id="price-your-transfer" className="mt-12 text-2xl font-normal text-[var(--color-on-surface)]">
          How much could you have saved? Price your own transfer
        </h2>
        <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
          Pick your route, how much you send and how often, and what you use today. The calculator reads the same quotes
          as our comparison tables, so the figure is what the top of the table delivers against your current option
          today, after fees.
        </p>
        <SavingsCalculator
          corridors={calcCorridors}
          initialCorridor={initialCorridor}
          initialAmount={1000}
          initialQuotes={initialQuotes}
          source={CALC_SOURCE}
        />

        <h2 className="mt-12 text-2xl font-normal text-[var(--color-on-surface)]">
          Which providers readers chose, corridor by corridor
        </h2>
        <p className="mt-2 text-[var(--color-on-surface-variant)] leading-relaxed">
          The routes our readers compared most, where we could price enough choices to report. &ldquo;Comparing
          is worth&rdquo; is the median daily payout gap, restated per 1,000
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

        <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages --
              An /api/data CSV endpoint, not a page: next/link would navigate
              client-side instead of letting the browser download it. */}
          <a href="/api/data/reader-savings" className="font-semibold text-[var(--color-primary)] underline underline-offset-4">
            Download this table as a CSV
          </a>
          , free to reuse under CC BY 4.0 with a link to this page.
        </p>

        {lead?.window && (
          <p className="mt-5 text-[var(--color-on-surface-variant)] leading-relaxed">
            <strong className="text-[var(--color-on-surface)]">{corridorLabel(lead.corridor)}</strong> was the route our
            readers compared most, and the providers they chose most there were{" "}
            {list(lead.chosen.slice(0, 3).map((p) => providerLabel(p.slug)))}. The top payer was not fixed. Over{" "}
            {lead.window.days} days it was{" "}
            {list(lead.window.mostFrequentLeader.map((l) => `${providerLabel(l.slug)} on ${l.days}`))} days.
          </p>
        )}


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

        <h2 className="mt-12 text-2xl font-normal text-[var(--color-on-surface)]">
          Five lessons from {days} days of real choices
        </h2>
        <ol className="mt-3 space-y-4 text-[var(--color-on-surface-variant)] leading-relaxed list-decimal pl-5">
          <li>
            <strong className="text-[var(--color-on-surface)]">The bank is where most of the money goes.</strong> On every
            corridor in the table that quotes a bank, the top payer beat the median bank by {bankMin.toFixed(1)}% to{" "}
            {bankMax.toFixed(1)}%. The gap across all quoted providers was smaller: a median{" "}
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
            median.
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

        <h2 id="how-we-measured" className="mt-12 text-2xl font-normal text-[var(--color-on-surface)]">How we measured reader savings</h2>
        <ol className="mt-5 grid gap-5 sm:grid-cols-3">
          {METHOD_STEPS.map(([title, copy], i) => (
            <li key={title} className="border-t-2 border-[var(--color-success)] pt-4">
              <p className="text-xs font-semibold tabular-nums text-[var(--color-success)]">0{i + 1}</p>
              <p className="mt-1 font-semibold text-[var(--color-on-surface)]">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">{copy}</p>
            </li>
          ))}
        </ol>
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
            who compare, not everyone who sends money abroad. Overall medians are weighted by reader choices; the
            corridor table uses daily medians.
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
