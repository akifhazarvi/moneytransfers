import Image from "next/image";
import EligibleLink from "@/components/EligibleLink";
import ProviderLink from "@/components/ProviderLink";
import TiedNote from "@/components/TiedNote";
import { providers } from "@/data/providers";
import { getGoUrl } from "@/lib/affiliate";
import { providerLogo } from "@/lib/provider-logo";
import { EXAMPLE, money, utcShort, type HubData } from "@/lib/send-money-hub";

/** Click source for provider_clicked and the /go clickref. */
const SOURCE = "send_money_example_table";

/**
 * The /send-money hub's server-rendered comparison: the top five providers for
 * one fixed example route, in the static HTML.
 *
 * WHY (round-3 brief §4.4): crawlers that do not run JavaScript saw the hub's
 * comparison as "Loading…". The interactive form above still answers the
 * reader's own route; this table guarantees the page's core content exists
 * without it. It is labelled as an example route with its collection times so
 * it is never read as the visitor's search.
 *
 * One DOM per row — a real <table> that restacks on phones with CSS — rather
 * than separate mobile and desktop copies: duplicated layouts doubled every
 * link on the corridor pages. Every row keeps its own Send button.
 */
export default function ExampleRouteTable({ data }: { data: HubData }) {
  const { rows, sendSymbol, recvSymbol, mid, priced, oldest, latest } = data;
  if (rows.length === 0) return null;
  const corridor = `${EXAMPLE.from}-${EXAMPLE.to}`;

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl overflow-hidden">
      <table className="w-full text-sm border-collapse">
        <caption className="text-left px-4 sm:px-6 pt-4 pb-3 text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
          Top {rows.length} of {priced}{" "}
          providers we price for {sendSymbol}
          {money(EXAMPLE.amount, 0)}{" "}
          {EXAMPLE.from} → {EXAMPLE.to}, ranked by what the recipient gets.
          {oldest && latest && (
            <>
              {" "}Quotes collected{" "}
              <time dateTime={oldest}>{utcShort(oldest)}</time>
              {oldest !== latest && (
                <>
                  {" "}to{" "}
                  <time dateTime={latest}>{utcShort(latest)}</time>
                </>
              )}
              .
            </>
          )}
          {mid > 0 && (
            <>
              {" "}Mid-market reference (XE): {mid.toFixed(4)}{" "}
              {EXAMPLE.to} per {EXAMPLE.from}.
            </>
          )}
        </caption>
        <thead className="hidden md:table-header-group bg-[var(--color-surface-container)] text-xs font-medium text-[var(--color-on-surface-variant)]">
          <tr>
            <th scope="col" className="text-left font-medium px-6 py-3">Provider</th>
            <th scope="col" className="text-right font-medium px-3 py-3">Recipient gets</th>
            <th scope="col" className="text-right font-medium px-3 py-3">Exchange rate</th>
            <th scope="col" className="text-right font-medium px-3 py-3">Fee</th>
            <th scope="col" className="text-left font-medium px-3 py-3">Delivery</th>
            <th scope="col" className="text-left font-medium px-3 py-3">Quote collected</th>
            <th scope="col" className="px-6 py-3"><span className="sr-only">Send</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ quote: q, name, rank, markupPct, tiedAhead }) => {
            const provider = providers.find((p) => p.slug === q.providerSlug);
            const logo = providerLogo(q.providerSlug, provider?.logo);
            const markup = Math.abs(markupPct) < 0.005
              ? "at mid-market"
              : markupPct > 0
                ? `${markupPct.toFixed(2)}% below mid`
                : `${Math.abs(markupPct).toFixed(2)}% above mid`;
            return (
              <tr
                key={q.providerSlug}
                className="grid grid-cols-2 gap-x-4 gap-y-1.5 px-4 py-4 border-t border-[var(--color-outline)] md:table-row md:p-0"
              >
                <th scope="row" className="col-span-1 text-left font-normal md:table-cell md:px-6 md:py-3 md:align-middle">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2sm tabular-nums text-[var(--color-on-surface-variant)] w-4 shrink-0">{rank}</span>
                    <Image src={logo} alt="" width={32} height={32} className="conversion-logo w-8 h-8 p-0.5 border border-[var(--color-outline)]/40" unoptimized={logo.endsWith(".svg")} />
                    <div className="min-w-0">
                      <EligibleLink href={`/companies/${q.providerSlug}`} className="block text-sm font-medium text-[var(--color-on-surface)] truncate hover:text-[var(--color-primary)]">
                        {name}
                      </EligibleLink>
                      {tiedAhead && <TiedNote rating={q.rating} />}
                    </div>
                  </div>
                </th>
                <td className="text-right md:table-cell md:px-3 md:py-3 md:align-middle">
                  <span className="block text-sm font-semibold tabular-nums text-[var(--color-on-surface)]">
                    {recvSymbol}
                    {money(q.receiveAmount)}
                  </span>
                  <span className="block md:hidden text-2xs text-[var(--color-on-surface-variant)]">recipient gets</span>
                </td>
                <td className="text-2sm tabular-nums md:text-right md:table-cell md:px-3 md:py-3 md:align-middle">
                  <span className="md:hidden text-[var(--color-on-surface-variant)]">Rate{" "}</span>
                  {q.exchangeRate.toFixed(4)}
                  <span className="block text-2xs text-[var(--color-on-surface-variant)]">{markup}</span>
                </td>
                <td className="text-right text-2sm tabular-nums md:table-cell md:px-3 md:py-3 md:align-middle">
                  <span className="md:hidden text-[var(--color-on-surface-variant)]">Fee{" "}</span>
                  {q.fee === 0 ? "No fee" : `${sendSymbol}${money(q.fee)}`}
                </td>
                <td className="text-2sm md:table-cell md:px-3 md:py-3 md:align-middle">
                  <span className="md:hidden text-[var(--color-on-surface-variant)]">Delivery{" "}</span>
                  {q.transferSpeed}
                </td>
                <td className="text-right md:text-left text-2xs text-[var(--color-on-surface-variant)] md:table-cell md:px-3 md:py-3 md:align-middle">
                  {q.dateCollected ? (
                    <>
                      <span className="md:hidden">Collected{" "}</span>
                      <time dateTime={q.dateCollected}>{utcShort(q.dateCollected)}</time>
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="col-span-2 pt-1.5 md:table-cell md:px-6 md:py-3 md:align-middle md:text-right">
                  <ProviderLink
                    href={getGoUrl(q.providerSlug, {
                      sourceCurrency: EXAMPLE.from,
                      targetCurrency: EXAMPLE.to,
                      sourceAmount: EXAMPLE.amount,
                      clickref: SOURCE,
                    })}
                    provider={q.providerSlug}
                    corridor={corridor}
                    rank={rank}
                    source={SOURCE}
                    ariaLabel={`Send with ${name} (opens in a new tab)`}
                    className={`conversion-button w-full md:w-auto whitespace-nowrap${rank === 1 ? " conversion-button--accent" : ""}`}
                  >
                    Send
                    <svg aria-hidden="true" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </ProviderLink>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
