import type { ReactNode } from "react";
import EligibleLink from "@/components/EligibleLink";
import { getAuthor } from "@/data/authors";
import {
  EXAMPLE, HUB_AUTHOR_SLUG, HUB_COPY_REVIEWED, HUB_REVIEWER_SLUG, longDate, money,
  type HubData, type HubFaq,
} from "@/lib/send-money-hub";
import { DELIVERY_TESTS, fmtMinutes } from "@/lib/delivery-speed";

/**
 * The /send-money hub's own text (round-3 brief §4.4: 600–900 words of
 * original copy below the comparison). Written for choosing a route and a
 * provider by country — the homepage covers the site and how to use it, so none
 * of its sentences are repeated here (duplicate share, CLAUDE.md rule 3).
 *
 * Every figure is computed from getHubData() — the same generateQuotes() rows
 * as the table above — or from a data token; none is typed (rules 5 and 7).
 * Sentences that carry a figure are single template strings so no JSX value
 * boundary can swallow a space (rule 10). Headings name this page (rule 4).
 */

const LINK = "text-[var(--color-primary)] underline underline-offset-2 hover:no-underline";
const H2 = "text-xl font-medium text-[var(--color-on-surface)] mb-3";
const H3 = "text-md font-medium text-[var(--color-on-surface)] mt-5 mb-1.5";
const PROSE = "text-sm text-[var(--color-on-surface-variant)] leading-relaxed space-y-3";

function A({ href, children }: { href: string; children: ReactNode }) {
  return <EligibleLink href={href} className={LINK}>{children}</EligibleLink>;
}

/** A primary source: followed (regulators and multilateral bodies, CLAUDE.md SEO conventions). */
function Source({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noopener" className={LINK}>{children}</a>;
}

const PROVIDER_NAME: Record<string, string> = { taptapsend: "TapTap Send", wise: "Wise" };
const monthYear = (isoDay: string) =>
  new Date(`${isoDay}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

/**
 * Round-4 brief §0.3 ("How we tested" with real transfers): what our own test
 * transfers show, every figure computed from delivery-tests.json. The full
 * log, with what each provider advertised at the time, is the fastest-way
 * guide's table — linked, not repeated here (duplicate share, rule 3).
 */
function testedSummary() {
  const tests = DELIVERY_TESTS;
  const days = tests.map((t) => t.sentDate).sort();
  const byProvider = Object.entries(
    tests.reduce<Record<string, number>>((n, t) => ({ ...n, [t.provider]: (n[t.provider] ?? 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1]);
  const delivered = tests.filter((t) => t.outcome === "delivered");
  const slowest = Math.max(...delivered.map((t) => t.durationMinutes));
  const withinTwo = delivered.filter((t) => t.durationMinutes <= 1).length;
  const returned = tests.find((t) => t.outcome === "returned") as (typeof tests)[number] & { retryAfterMinutes?: number } | undefined;
  return {
    count: tests.length,
    first: monthYear(days[0]),
    last: monthYear(days[days.length - 1]),
    providers: byProvider.map(([slug, n]) => `${n} with ${PROVIDER_NAME[slug] ?? slug}`).join(" and "),
    delivered: delivered.length,
    slowest: fmtMinutes(slowest),
    withinTwo,
    returned: returned && {
      provider: PROVIDER_NAME[returned.provider] ?? returned.provider,
      route: `${returned.from} to ${returned.to}`,
      retry: fmtMinutes(returned.retryAfterMinutes ?? 0),
    },
  };
}

/** Worked example under the table: what the five rows and the whole route say. */
export function WorkedExample({ data }: { data: HubData }) {
  const w = data.worked;
  if (!w) return null;
  const r = data.recvSymbol;
  const s = data.sendSymbol;
  const tied = data.rows.some((row) => row.tiedAhead);
  const fv = w.feeVsRate;
  return (
    <div className={`${PROSE} mt-5 max-w-3xl`}>
      <p>
        {`On these quotes the highest payout was ${r}${money(w.best.receive, 0)} from ${w.best.name}, and the fifth row, ${w.fifth.name}, paid ${r}${money(w.fifth.receive, 0)}. Across all ${data.priced} providers we priced on the route, the lowest was ${r}${money(w.lowest.receive, 0)} from ${w.lowest.name}: ${r}${money(w.spread, 0)} less than the highest, about ${s}${money(w.spreadSend, 0)} on a ${s}${money(EXAMPLE.amount, 0)} transfer. That gap is the reason to compare before sending.`}
      </p>
      {tied && (
        <p>
          {`Payouts within ${data.bandPct}% of each other are treated as tied, because rates move more than that between our updates; the higher-rated provider is then listed first, which is why a row can sit above a slightly larger number.`}
        </p>
      )}
      {fv && (
        <p>
          {`Fee against rate, on real quotes: ${fv.feeName} charges a ${s}${money(fv.fee)} fee, which takes about ${r}${money(fv.feeCost, 0)} off the payout. ${fv.freeName} charges no fee, but ${fv.feeName}'s exchange rate is worth ${r}${money(Math.abs(fv.rateEffect), 0)} ${fv.rateEffect >= 0 ? "more" : "less"} on ${s}${money(EXAMPLE.amount, 0)}, so ${fv.net >= 0 ? fv.feeName : fv.freeName} delivers ${r}${money(Math.abs(fv.net), 0)} more. A zero fee tells you where the margin sits, not how large it is.`}
        </p>
      )}
      <p>
        {data.leader
          ? `One day's table is a snapshot. Over a longer window the most frequent leader on this route is ${data.leader}. `
          : "One day's table is a snapshot, and the order moves from day to day. "}
        Every provider we price on it is in the{" "}
        <A href="/send-money/usa-to-india">full United States to India comparison</A>.
      </p>
    </div>
  );
}

/** How to choose, common mistakes, how the comparison is built, FAQ. */
export default function HubContent({ faqs }: { faqs: HubFaq[] }) {
  const tested = testedSummary();
  const author = getAuthor(HUB_AUTHOR_SLUG);
  const reviewer = getAuthor(HUB_REVIEWER_SLUG);
  return (
    <div className="space-y-6">
      <section className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8">
        <h2 className={H2}>Choosing a transfer service for the country you send to</h2>
        <div className={`${PROSE} max-w-3xl`}>
          <h3 className={H3}>Start with the destination</h3>
          <p>
            Prices are set route by route: a provider near the top from the United States to India can sit lower from the
            United Kingdom. Payout options differ by country too, so decide how your recipient will collect the money (bank
            deposit, mobile wallet or cash pickup) and compare only providers that pay out that way.
          </p>
          <h3 className={H3}>Exchange rate or fee: count both</h3>
          <p>
            A provider earns on the fee it shows you and on the margin inside its exchange rate, which it rarely states. The
            fee plus the gap between its rate and the mid-market rate, times your amount, is the real price. Our{" "}
            <A href="/tools/fx-markup-checker">FX markup checker</A>{" "}
            does that arithmetic for a quote you already hold.
          </p>
          <h3 className={H3}>Speed or price</h3>
          <p>
            Many providers charge more for card payment or instant delivery than for a bank-funded, slower payout. If the
            money is not needed today, check whether the slower option pays more on your route.
          </p>
          <h3 className={H3}>Limits and documents</h3>
          <p>
            Providers cap what you can send per transfer and per day, depending on the country you send from and how far you
            have verified your identity. Check{" "}
            <A href="/guides/money-transfer-limits-by-provider-country">limits by provider and country</A>{" "}
            before comparing a large amount: splitting a transfer means paying a fee on each part.
          </p>
          <h3 className={H3}>Security and licensing</h3>
          <p>
            Use a provider licensed where you send from: an FCA-authorised payment or e-money institution in the UK, a
            state-licensed money transmitter registered with FinCEN in the US, or the local equivalent. Our{" "}
            <A href="/guides/money-transfer-safety-guide">transfer safety guide</A>{" "}
            shows how to check the regulator&rsquo;s register.
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8">
        <h2 className={H2}>Mistakes that make a transfer abroad cost more</h2>
        <ul className={`${PROSE} max-w-3xl list-disc pl-5`}>
          <li>
            <strong className="text-[var(--color-on-surface)]">Judging by the fee alone.</strong> No fee and a wide rate
            margin can deliver less than a fee and a tight rate, as the example above shows.
          </li>
          <li>
            <strong className="text-[var(--color-on-surface)]">Borrowing a quote from another route.</strong> A good rate
            from the UK to India says nothing about the US to India; compare the pair you are actually sending.
          </li>
          <li>
            <strong className="text-[var(--color-on-surface)]">Comparing at the wrong amount.</strong> Flat fees weigh most
            on small transfers and percentage fees on large ones, so the order changes with the amount.
          </li>
          <li>
            <strong className="text-[var(--color-on-surface)]">Counting on a first-transfer rate.</strong> Promotional rates
            usually apply once and up to a cap. Our tables show the standard rate, the one you pay from the second transfer.
          </li>
          <li>
            <strong className="text-[var(--color-on-surface)]">Typing recipient details in a hurry.</strong> A wrong account
            number, IFSC code, IBAN or wallet number can send the money to someone else, and recovery is not guaranteed.
          </li>
        </ul>
      </section>

      <section className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8">
        <h2 className={H2}>Transfers we sent to test the providers we compare</h2>
        <div className={`${PROSE} max-w-3xl`}>
          <p>
            {`We also send money ourselves. ${tested.count} transfers between ${tested.first} and ${tested.last}, ${tested.providers}, were timed from each app's own status timeline: from setting the transfer up to the provider's last step, such as "Transfer was successful" or "We paid out".`}
          </p>
          <p>
            {`${tested.delivered} of the ${tested.count} were paid out within ${tested.slowest}, ${tested.withinTwo} of them within two minutes.`}
            {tested.returned && ` One, a ${tested.returned.provider} transfer from ${tested.returned.route}, was returned on its first attempt and paid out again ${tested.returned.retry} later.`}
          </p>
          <p>
            These times stop at the provider&rsquo;s last step: when the recipient&rsquo;s bank or wallet showed the money
            is not something an app&rsquo;s timeline records. A few transfers are a spot check, not a speed ranking, and the
            delivery times in the comparison above are what each provider publishes. The full log, with what each provider
            advertised for the route at the time, is in our{" "}
            <A href="/guides/fastest-way-to-send-money-internationally">guide to the fastest ways to send money</A>.
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8">
        <h2 className={H2}>The rules and benchmarks behind these comparisons</h2>
        <div className={`${PROSE} max-w-3xl`}>
          <p>
            In the United States, the Consumer Financial Protection Bureau&rsquo;s Remittance Transfer Rule requires a
            provider to show the exchange rate, its fees and taxes, and the amount the recipient will receive before you
            pay (<Source href="https://www.consumerfinance.gov/rules-policy/regulations/1005/31/">12 CFR 1005.31</Source>),
            and lets you cancel for a full refund within 30 minutes of paying, unless the money has already been collected
            or deposited (<Source href="https://www.consumerfinance.gov/rules-policy/regulations/1005/34/">12 CFR 1005.34</Source>).
            That disclosed amount the recipient receives is the number our comparison ranks providers on.
          </p>
          <p>
            In the United Kingdom, a firm that sends money abroad must be authorised or registered by the Financial Conduct
            Authority as a payment or e-money institution. The{" "}
            <Source href="https://register.fca.org.uk/s/">FCA&rsquo;s Financial Services Register</Source>{" "}
            shows a firm&rsquo;s status and the names it trades under.
          </p>
          <p>
            For what sending money costs in general, the reference is the World Bank&rsquo;s{" "}
            <Source href="https://remittanceprices.worldbank.org/">Remittance Prices Worldwide</Source>{" "}
            database, which surveys the cost of sending the equivalent of $200 and $500 between hundreds of country pairs
            every quarter. The United Nations&rsquo;{" "}
            <Source href="https://sdgs.un.org/goals/goal10">Sustainable Development Goal 10</Source>{" "}
            (target 10.c) aims to bring that cost below 3% by 2030 and to close routes that cost more than 5%. Our figures
            differ in one way: they are priced at the amount you enter, from each provider&rsquo;s own quote, so they move
            with your amount and with the day&rsquo;s rate.
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8">
        <h2 className={H2}>How this country-by-country comparison is built</h2>
        <div className={`${PROSE} max-w-3xl`}>
          <p>
            Quotes come first from providers&rsquo; own price APIs and calculators, with gaps filled from comparison
            aggregators. Each is restated as what the recipient gets for the amount you send, and markups are measured
            against XE&rsquo;s mid-market rate. Quotes more than three days behind the newest, or that cannot be true, are left out.{" "}
            <A href="/how-we-review">How we review providers</A>{" "}
            covers the editorial side, and{" "}
            <A href="/methodology">our methodology</A>{" "}
            the data pipeline.
          </p>
          <p>
            <strong className="text-[var(--color-on-surface)]">How we make money.</strong> Some providers pay us a
            commission when you click Send and then open an account or make a transfer. The order is computed from payouts,
            the same whether a provider pays us or not, and the price you pay does not change.
          </p>
          {author && reviewer && (
            <p>
              {`${author.name}, our ${author.role.toLowerCase()}, wrote this page; ${reviewer.name}, ${reviewer.role === "Founder & CEO" ? "the founder" : reviewer.role.toLowerCase()}, checked its figures against the quote data on ${longDate(HUB_COPY_REVIEWED)}. The table and the worked example are recalculated whenever new quotes arrive.`}
            </p>
          )}
        </div>
      </section>

      <section className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8">
        <h2 className={H2}>Sending money abroad by country: your questions</h2>
        <div className="max-w-3xl divide-y divide-[var(--color-outline)]">
          {faqs.map((f) => (
            <div key={f.question} className="py-4 first:pt-0 last:pb-0">
              <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-1.5">{f.question}</h3>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
