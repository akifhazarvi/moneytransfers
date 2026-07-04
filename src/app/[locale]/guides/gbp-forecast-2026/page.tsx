import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import { getAlternates } from "@/lib/i18n-metadata";
import { getAuthor } from "@/data/authors";
import { computeGbpOutlookIndex } from "@/lib/gbp-outlook-index";
import { FluctuationChart, ProviderSpreadChart } from "@/components/GbpOutlookCharts";

const SITE_URL = "https://sendmoneycompare.com";
const PATH = "guides/gbp-forecast-2026";
const URL = `${SITE_URL}/${PATH}`;

// Provider spread computed live from the same wise-comparison scrape that
// refreshes every 6h, so the headline "5.4% gap" never drifts from the data.
const idx = computeGbpOutlookIndex();
const author = getAuthor("akif-hazarvi");

const PUBLISHED = "2026-07-03";
const MODIFIED = "2026-07-03";
const asOfLong = "3 July 2026";

const amt = `£${idx.amount.toLocaleString()}`;
const spreadPct = idx.spreadPct.toFixed(1);
const spreadAbs = `$${idx.spreadAbs.toFixed(2)}`;

// The monthly currency move we contrast the provider spread against.
const MONTHLY_MOVE_PCT = 1.7;

const FAQS = [
  {
    q: "How much can the pound realistically move before my transfer clears?",
    a: `Over the first half of 2026, GBP/USD moved about 5% peak-to-trough (from 1.3826 in late January down to 1.3164 in late June). But over a typical week, or the few days a transfer takes to clear, moves are far smaller — often 0.3% to 0.7% a day. For most transfers the currency will not move enough to outweigh the difference between a cheap and an expensive provider, which on a ${amt} GBP to USD transfer today is about ${spreadPct}%.`,
  },
  {
    q: "Will the pound crash during the Labour leadership contest?",
    a: "A crash is the low-probability tail scenario, not the base case. Sterling had already fallen around 1.7% before the contest began, speculative short positions are the largest since 2015 (meaning pessimism is already crowded), and the frontrunner Andy Burnham has committed to the existing fiscal rules that reassure bond markets. The realistic outlook is a range-bound, headline-sensitive currency rather than a collapse.",
  },
  {
    q: "Should I send my pounds now or wait for a better rate?",
    a: `A leadership contest can shake sterling, so if you have a large transfer coming up there is a reasonable case for not sitting fully exposed through the uncertainty. But the biggest saving you fully control is which provider you use: the gap between the best and worst provider on a ${amt} GBP to USD transfer today is about ${spreadPct}% (${spreadAbs}), which is more than triple the pound's typical monthly move of around 1.7%. This is general information, not financial advice.`,
  },
  {
    q: "When will sterling settle down?",
    a: "Watch 16 July 2026. If Andy Burnham stands unopposed when nominations close, he becomes Labour leader without a members' ballot and the uncertainty window collapses early. A contested race runs into late August, with a leader expected by around 29 August and Parliament returning on 1 September.",
  },
  {
    q: "Does the Bank of England decision matter for the pound here?",
    a: "Yes. The 30 July 2026 rate decision lands mid-contest. Markets currently expect a hold at 3.75%, which is broadly supportive for the pound because the UK's base rate is the highest in the G7 after the Fed. A surprise cut or a hawkish shift would amplify the political volatility rather than replace it.",
  },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = "GBP Forecast July 2026: How Much Can the Pound Move Before Your Transfer?";
  const description = `Sterling swung ~5% in H1 2026, but the best-vs-worst money-transfer provider gap on ${amt} to USD is ${spreadPct}% — bigger than the currency move. Data-led GBP outlook plus the dates that matter for your pound transfer.`;
  return {
    title: { absolute: title },
    description,
    alternates: getAlternates(PATH, locale),
    openGraph: {
      title,
      description,
      url: URL,
      type: "article",
      publishedTime: PUBLISHED,
      modifiedTime: MODIFIED,
      authors: ["Akif Hazarvi"],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "GBP Forecast July 2026: How Much Can the Pound Move Before Your Transfer?",
  description:
    "A data-led GBP outlook covering sterling's 2026 fluctuation range, the Labour leadership contest, and why provider choice beats market timing for money transfers.",
  datePublished: PUBLISHED,
  dateModified: MODIFIED,
  author: { "@type": "Person", name: "Akif Hazarvi", url: `${SITE_URL}/about/akif-hazarvi` },
  publisher: { "@id": `${SITE_URL}/#organization` },
  mainEntityOfPage: URL,
  about: [
    { "@type": "Thing", name: "Pound sterling" },
    { "@type": "Thing", name: "Foreign exchange" },
    { "@type": "Thing", name: "International money transfer" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
    { "@type": "ListItem", position: 3, name: "GBP Forecast 2026", item: URL },
  ],
};

function Stat({ value, label, big }: { value: string; label: string; big?: boolean }) {
  return (
    <div className="rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-dim)] p-5 text-center">
      <div
        className={`${big ? "text-[clamp(2rem,7vw,2.75rem)]" : "text-[clamp(1.5rem,5vw,2.25rem)]"} font-semibold text-[var(--color-primary)] leading-none tracking-tight`}
      >
        {value}
      </div>
      <div className="mt-2 text-sm text-[var(--color-on-surface-variant)]">{label}</div>
    </div>
  );
}

function ChartCard({
  eyebrow,
  title,
  sub,
  children,
  caption,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  children: React.ReactNode;
  caption: React.ReactNode;
}) {
  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)]">
      <div className="px-5 pt-5">
        <div className="font-mono text-[0.7rem] uppercase tracking-wider text-[var(--color-primary)]">{eyebrow}</div>
        <h3 className="mt-1.5 text-lg font-medium text-[var(--color-on-surface)]">{title}</h3>
        <p className="mt-0.5 text-sm text-[var(--color-on-surface-variant)]">{sub}</p>
      </div>
      <div className="px-3 py-3">{children}</div>
      <figcaption className="border-t border-[var(--color-outline)] px-5 py-3 text-xs text-[var(--color-on-surface-variant)]">
        {caption}
      </figcaption>
    </figure>
  );
}

export default async function GbpForecastPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const chartRows = idx.rows.map((r) => ({ provider: r.provider, receiveAmount: r.receiveAmount }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Container>
        <article className="mx-auto max-w-3xl py-10">
          <nav className="mb-4 text-sm text-[var(--color-on-surface-variant)]">
            <Link href="/guides" className="hover:text-[var(--color-primary)]">
              Guides
            </Link>
            <span className="mx-1.5">/</span>
            <span>GBP Forecast 2026</span>
          </nav>

          <h1 className="text-[clamp(1.6rem,5vw,2.6rem)] font-normal leading-tight tracking-[-0.01em] text-[var(--color-on-surface)]">
            How much can the pound move before your transfer clears?
          </h1>
          <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]">
            By {author?.name ?? "Akif Hazarvi"} · Published {asOfLong} · Provider figures update every 6 hours from live
            quotes
          </p>

          {/* Live rate strip */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat value="1.3347" label="GBP / USD (2 Jul)" />
            <Stat value="1.1676" label="GBP / EUR (2 Jul)" />
            <Stat value="3.75%" label="BoE base rate" />
            <Stat value="4.80%" label="10-yr gilt yield" />
          </div>

          {/* Citable answer box */}
          <div className="mt-6 rounded-2xl border border-[var(--color-primary)] bg-[var(--color-primary-surface)] p-5">
            <p className="citable-passage leading-relaxed text-[var(--color-on-surface)]">
              <strong>The short answer:</strong> Over the first half of 2026 the pound moved about{" "}
              <strong>5% peak-to-trough</strong> against the dollar (1.3826 down to 1.3164), and the Labour leadership
              contest keeps it headline-sensitive into late August. But the pound&rsquo;s <em>typical monthly</em> move
              is only around {MONTHLY_MOVE_PCT}%. On a {amt} transfer to US dollars, the gap between the best and worst
              money-transfer provider right now is <strong>{spreadPct}%</strong> ({spreadAbs}) — more than triple the
              currency swing. For most people, <strong>which provider you use matters more than which day you send.</strong>
            </p>
          </div>

          <p className="mt-6 leading-relaxed text-[var(--color-on-surface-variant)]">
            The pound is one of the most-traded currencies on earth, and 2026 has been a bumpy year for it. With Labour
            choosing a new leader after Keir Starmer&rsquo;s resignation and the Bank of England on hold, sterling is
            sitting mid-range and unusually reactive to headlines. This outlook shows, with real numbers, how much the
            pound actually moves — and the one factor that reliably beats the currency swing.
          </p>

          {/* Figure 1 — fluctuation */}
          <ChartCard
            eyebrow="Figure 1 · The fluctuation timeline"
            title="GBP/USD, January–July 2026"
            sub="How far the pound has travelled month to month — the band you're timing against."
            caption={
              <>
                Monthly reference points, GBP/USD 2026. Peak 1.3826 (28 Jan) &rarr; trough 1.3164 (25 Jun). Source:
                Federal Reserve H.10, exchangerates.org.uk.
              </>
            }
          >
            <FluctuationChart />
          </ChartCard>

          <p className="leading-relaxed text-[var(--color-on-surface-variant)]">
            That is a <strong>~5% peak-to-trough range in six months</strong>. It sounds dramatic — but zoom into any
            single week and the moves are small: the pound&rsquo;s monthly move into the leadership contest was about
            1.7%, and a normal single day is 0.3–0.7%. That scale matters when you compare it to the cost of choosing the
            wrong provider.
          </p>

          <h2 className="mt-10 text-2xl font-normal text-[var(--color-on-surface)]">What&rsquo;s actually driving the pound</h2>
          <div className="prose-content mt-3 space-y-3 leading-relaxed text-[var(--color-on-surface-variant)]">
            <p className="citable-passage">
              Sterling in mid-2026 is a &ldquo;good yield, uncertain growth&rdquo; story. The{" "}
              <strong>UK&rsquo;s 3.75% base rate is the highest in the G7 after the Fed</strong>, and 10-year gilts yield
              35–45 basis points more than US Treasuries. That yield gap pays investors to hold pounds and is the main
              thing stopping sterling falling further — most of GBP/USD&rsquo;s move is really about the dollar, not the
              pound.
            </p>
            <p>
              <strong>UK politics is the swing factor right now.</strong> The Labour leadership contest is a defined 6–8
              week window of uncertainty. And <strong>positioning is the accelerant:</strong> speculators built the
              largest short bet against the pound since 2015 — roughly $8.7 billion — so any good news can force a sharp
              bounce as those bets unwind.
            </p>
          </div>

          <h2 className="mt-10 text-2xl font-normal text-[var(--color-on-surface)]">Why the politics didn&rsquo;t sink the pound</h2>
          <p className="mt-2 leading-relaxed text-[var(--color-on-surface-variant)]">
            Andy Burnham, the only declared candidate and clear frontrunner to replace Keir Starmer, had previously
            unsettled bond markets. Then he explicitly tied himself to the existing fiscal rules — the framework built to
            reassure markets after the 2022 Truss crisis:
          </p>
          <blockquote className="my-6 border-l-4 border-[var(--color-primary)] pl-5 text-xl leading-relaxed text-[var(--color-on-surface)]">
            &ldquo;I will stick to the fiscal rules that have delivered this country stability for the first time in over
            15 years.&rdquo;
            <cite className="mt-3 block text-sm not-italic text-[var(--color-on-surface-variant)]">
              Andy Burnham, Labour leadership frontrunner
            </cite>
          </blockquote>
          <p className="leading-relaxed text-[var(--color-on-surface-variant)]">
            The reaction: <strong>gilt yields dipped and the pound rose</strong>, closing that day up over a third of a
            cent at around $1.3240. The &ldquo;Truss-style fiscal shock&rdquo; — the one scenario that genuinely hammers
            sterling — was talked down by the person most likely to win.
          </p>

          <h2 className="mt-10 text-2xl font-normal text-[var(--color-on-surface)]">The dates that will move sterling</h2>
          <ul className="mt-4 space-y-0">
            {[
              ["22 Jun", "Starmer resigns", "Contest triggered; he stays as caretaker PM. Initial GBP weakness."],
              ["9 Jul", "Nominations open", "Watch whether anyone credible challenges Burnham."],
              ["16 Jul", "Nominations close — the key tell", "If Burnham is unopposed, he becomes leader and the uncertainty window collapses six weeks early."],
              ["30 Jul", "BoE rate decision", "A live macro event mid-contest. A hold at 3.75% is expected."],
              ["~29 Aug", "Leader elected", "Latest date for a contested ballot; removes the biggest political unknown."],
              ["1 Sep", "Parliament returns", "Focus shifts to fundamentals and the autumn Budget."],
            ].map(([date, title, body], i) => (
              <li
                key={i}
                className="grid grid-cols-[80px_1fr] gap-4 border-t border-[var(--color-outline)] py-3.5 last:border-b"
              >
                <span className="font-mono text-sm font-semibold text-[var(--color-primary)]">{date}</span>
                <span className="text-sm">
                  <strong className="block text-[var(--color-on-surface)]">{title}</strong>
                  <span className="text-[var(--color-on-surface-variant)]">{body}</span>
                </span>
              </li>
            ))}
          </ul>

          {/* The money shot */}
          <h2 className="mt-10 text-2xl font-normal text-[var(--color-on-surface)]">
            The number that changes how you should think about this
          </h2>
          <p className="mt-2 leading-relaxed text-[var(--color-on-surface-variant)]">
            Here is the point all the charts build to. On a <strong>{amt} transfer to US dollars</strong>, we compared
            what {idx.providerCount} real providers actually pay out right now. The gap between the best and worst is not
            small.
          </p>

          <ChartCard
            eyebrow="Figure 2 · The cost that dwarfs the swing"
            title={`What you receive on ${amt} → USD, by provider`}
            sub="Same amount, same moment, very different payouts."
            caption={
              <>
                Live SendMoneyCompare quotes, {amt} GBP&rarr;USD, {asOfLong}. Best ({idx.best?.provider},{" "}
                ${idx.best?.receiveAmount.toFixed(2)}) vs worst ({idx.worst?.provider},{" "}
                ${idx.worst?.receiveAmount.toFixed(2)}) = <strong>{spreadAbs} difference — {spreadPct}% of the transfer.</strong>
              </>
            }
          >
            <ProviderSpreadChart rows={chartRows} />
          </ChartCard>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat value={spreadAbs.replace(".00", "")} label={`Lost to picking the wrong provider on just ${amt}`} big />
            <Stat value={`${spreadPct}%`} label="Best-vs-worst provider gap, right now" />
            <Stat value={`${MONTHLY_MOVE_PCT}%`} label="The whole monthly currency move, for comparison" />
          </div>

          <p className="mt-6 leading-relaxed text-[var(--color-on-surface-variant)]">
            Read those three numbers together. The pound&rsquo;s <em>entire monthly move</em> was {MONTHLY_MOVE_PCT}%.
            The gap between the best and worst provider on the same transfer, at the same second, is{" "}
            <strong>{spreadPct}%</strong> — more than three times larger. You could nail the perfect exchange-rate moment
            and still lose far more by sending through a high-street bank than a specialist provider.
          </p>

          {/* Soft market-timing nudge */}
          <div className="mt-6 rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-dim)] p-5">
            <p className="leading-relaxed text-[var(--color-on-surface)]">
              <strong>The practical takeaway.</strong> A leadership contest can shake sterling — headlines between now
              and late August may nudge the rate a fraction of a percent at a time, and if you have a large transfer
              coming up there is a reasonable case for acting sooner rather than sitting fully exposed through the
              uncertainty. But whenever you move, the biggest saving you fully control is <em>which provider you use</em>:
              the best-vs-worst gap ({spreadPct}%) is more than triple the pound&rsquo;s whole monthly move
              ({MONTHLY_MOVE_PCT}%). So the smart play is both — don&rsquo;t leave a big sum hostage to the politics, and
              don&rsquo;t hand a chunk of it to an expensive provider on the way out.{" "}
              <span className="text-[var(--color-on-surface-variant)]">(This is general information, not financial advice.)</span>
            </p>
          </div>

          <div className="mt-6">
            <Link
              href="/send-money"
              className="inline-block rounded-full bg-[var(--color-cta)] px-6 py-3 text-sm font-semibold text-[var(--color-cta-text)] transition-colors hover:bg-[var(--color-cta-hover)]"
            >
              Compare live GBP transfer rates across 60+ providers
            </Link>
          </div>

          {/* FAQ */}
          <h2 className="mt-12 text-2xl font-normal text-[var(--color-on-surface)]">Common questions</h2>
          <div className="mt-4 divide-y divide-[var(--color-outline)]">
            {FAQS.map((faq, i) => (
              <details key={i} className="group py-1" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3.5 font-medium text-[var(--color-on-surface)] [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="font-mono text-xl text-[var(--color-primary)] group-open:hidden">+</span>
                  <span className="hidden font-mono text-xl text-[var(--color-primary)] group-open:inline">&minus;</span>
                </summary>
                <p className="citable-passage pb-4 leading-relaxed text-[var(--color-on-surface-variant)]">{faq.a}</p>
              </details>
            ))}
          </div>

          {/* Internal links */}
          <div className="mt-8 rounded-2xl border border-[var(--color-outline)] p-5">
            <h2 className="text-base font-medium text-[var(--color-on-surface)]">Send for less</h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>
                <Link href="/send-money" className="text-[var(--color-primary)] hover:underline">
                  Compare live rates across 60+ providers for your transfer
                </Link>
              </li>
              <li>
                <Link href="/guides/bank-vs-app-transfer-cost-2026" className="text-[var(--color-primary)] hover:underline">
                  Why banks cost more than apps to send money abroad (live data)
                </Link>
              </li>
              <li>
                <Link href="/remittance-cost-index" className="text-[var(--color-primary)] hover:underline">
                  See the full Remittance Cost Index (provider leaderboard)
                </Link>
              </li>
            </ul>
          </div>

          <p className="mt-8 text-xs text-[var(--color-on-surface-variant)]">
            Market levels are indicative snapshots as of 2–3 July 2026 and move constantly; check a live quote before
            transacting. SendMoneyCompare is a comparison service, not a currency broker or financial adviser. Currency
            values can fall as well as rise. Sources: Bank of England; Federal Reserve H.10; European Central Bank;
            Reuters; CNBC; Bloomberg; Institute for Government.
          </p>
        </article>
      </Container>
    </>
  );
}
