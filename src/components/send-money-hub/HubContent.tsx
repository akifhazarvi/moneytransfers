import type { ReactNode } from "react";
import EligibleLink from "@/components/EligibleLink";
import { getAuthor } from "@/data/authors";
import {
  EXAMPLE, HUB_AUTHOR_SLUG, HUB_COPY_REVIEWED, HUB_REVIEWER_SLUG, longDate, money,
  type HubData, type HubFaq,
} from "@/lib/send-money-hub";

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
  const author = getAuthor(HUB_AUTHOR_SLUG);
  const reviewer = getAuthor(HUB_REVIEWER_SLUG);
  return (
    <div className="space-y-6">
      <section className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8">
        <h2 className={H2}>Choosing a transfer service for the country you send to</h2>
        <div className={`${PROSE} max-w-3xl`}>
          <h3 className={H3}>Start with the destination</h3>
          <p>
            Prices are set route by route. A provider near the top from the United States to India can sit lower from the
            United Kingdom to India, and payout options differ by country: bank deposit, mobile wallet, cash pickup or a
            card. Decide how your recipient will collect the money, then compare only providers that pay out that way.
          </p>
          <h3 className={H3}>Exchange rate or fee: count both</h3>
          <p>
            A provider earns on two lines: the fee it shows you and the margin inside its exchange rate, which it rarely
            states. Convert the fee into the recipient&rsquo;s currency, add the gap between the provider&rsquo;s rate and
            the mid-market rate multiplied by your amount, and you have the real price. Our{" "}
            <A href="/tools/fx-markup-checker">FX markup checker</A>{" "}
            does that arithmetic for a quote you already hold.
          </p>
          <h3 className={H3}>Speed or price</h3>
          <p>
            Many providers charge more when you pay by card or choose instant delivery than when you fund by bank transfer
            and accept a slower payout. If the money is not needed today, check whether the slower option pays more on your
            route. If it is urgent, compare only providers that deliver in minutes.
          </p>
          <h3 className={H3}>Limits and documents</h3>
          <p>
            Providers cap what you can send per transfer, per day and per month, and the cap usually depends on the country
            you send from and how far you have verified your identity. Large sums can bring requests for proof of where the
            money came from. Check{" "}
            <A href="/guides/money-transfer-limits-by-provider-country">limits by provider and country</A>{" "}
            before comparing a large amount: splitting a transfer means paying a fee on each part.
          </p>
          <h3 className={H3}>Security and licensing</h3>
          <p>
            Use a provider licensed where you send from: in the UK an FCA-authorised payment or e-money institution, in the
            US a money transmitter licensed by your state and registered with FinCEN, elsewhere the local equivalent. Our{" "}
            <A href="/guides/money-transfer-safety-guide">transfer safety guide</A>{" "}
            shows how to look a provider up on the regulator&rsquo;s register before your first transfer.
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8">
        <h2 className={H2}>Mistakes that make a transfer abroad cost more</h2>
        <ul className={`${PROSE} max-w-3xl list-disc pl-5`}>
          <li>
            <strong className="text-[var(--color-on-surface)]">Judging by the fee alone.</strong> A transfer with no fee and
            a wide rate margin can deliver less than one with a fee and a tight rate, as the example above shows.
          </li>
          <li>
            <strong className="text-[var(--color-on-surface)]">Borrowing a quote from another route.</strong> A good rate
            from the UK to India says nothing about the US to India; compare the pair you are actually sending.
          </li>
          <li>
            <strong className="text-[var(--color-on-surface)]">Comparing at the wrong amount.</strong> Flat fees weigh most
            on small transfers and percentage fees on large ones, so the order changes with the amount. Enter your real one.
          </li>
          <li>
            <strong className="text-[var(--color-on-surface)]">Counting on a first-transfer rate.</strong> Promotional rates
            usually apply once and up to a cap. Our tables show the standard rate, the one you pay from the second transfer.
          </li>
          <li>
            <strong className="text-[var(--color-on-surface)]">Typing recipient details in a hurry.</strong> A wrong account
            number, IFSC code, IBAN or wallet number can delay the payout or send it to someone else, and recovering it is
            slow and not guaranteed.
          </li>
        </ul>
      </section>

      <section className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-6 md:p-8">
        <h2 className={H2}>How this country-by-country comparison is built</h2>
        <div className={`${PROSE} max-w-3xl`}>
          <p>
            Quotes come first from providers&rsquo; own price APIs and transfer calculators; where a provider publishes
            neither, gaps are filled from comparison aggregators, and the more direct source wins unless the other is more
            than a day fresher. Every quote is restated as what the recipient gets for the amount you send, and markups are
            measured against XE&rsquo;s mid-market rate. Quotes more than three days behind the freshest, or that cannot be
            true, such as a rate better than mid-market on a freely traded currency, are left out.{" "}
            <A href="/how-we-review">How we review providers</A>{" "}
            covers the editorial side, and{" "}
            <A href="/methodology">our methodology</A>{" "}
            the data pipeline.
          </p>
          <p>
            <strong className="text-[var(--color-on-surface)]">How we make money.</strong> Some providers pay us a
            commission when you click Send and then open an account or make a transfer. The order is computed from payouts
            and is the same whether a provider pays us or not, and the price the provider charges you does not change.
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
