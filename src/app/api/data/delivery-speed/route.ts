import { DELIVERY_TESTS, DELIVERY_SPEED } from "@/lib/delivery-speed";

// Both inputs are committed files (delivery-tests.json, hand-entered; and
// delivery-speed.json, built by scripts/build-delivery-speed.ts), so the CSV
// only changes when one of them is edited.
export const dynamic = "force-static";

/**
 * GET /api/data/delivery-speed
 *
 * The timed test transfers behind /guides/fastest-way-to-send-money-internationally,
 * one row per transfer, with what our quote archive recorded for that provider
 * and route within 3 days of the send date. No names, account numbers or card
 * digits: the source file holds none.
 */
export function GET() {
  const header = [
    "id",
    "provider",
    "send_currency",
    "receive_currency",
    "amount_shown",
    "funding",
    "payout",
    "sent_date",
    "sent_date_confirmed",
    "weekday",
    "first_event",
    "first_event_local",
    "last_event",
    "last_event_local",
    "minutes_set_up_to_last_event",
    "outcome",
    "advertised_source",
    "advertised_value",
    "advertised_quotes",
  ];
  const escape = (v: string | number | boolean | null | undefined) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = DELIVERY_TESTS.map((t) => {
    const first = t.timeline[0];
    const last = t.timeline[t.timeline.length - 1];
    const advertised = DELIVERY_SPEED.tests.find((x) => x.id === t.id)?.advertised?.[0];
    const top = advertised?.values[0];
    return [
      t.id,
      t.provider,
      t.from,
      t.to,
      t.amountShown,
      t.funding,
      t.payout,
      t.sentDate,
      t.dateConfirmed,
      t.weekday,
      first.event,
      first.local,
      last.event,
      last.local,
      t.durationMinutes,
      t.outcome,
      advertised?.source,
      top?.value,
      top?.quotes,
    ]
      .map(escape)
      .join(",");
  });
  const lines = [
    "# SendMoneyCompare — international transfers we sent and timed, promised vs paid out",
    "# Times come from each provider's own in-app status timeline, to the minute (device-local). last_event is the provider's own last step, not the recipient bank's credit.",
    `# advertised_* = what our quote archive recorded for that provider and route within 3 days of sent_date (archive starts ${DELIVERY_SPEED.archive.from}); empty = before the archive or nothing published.`,
    "# Licence CC BY 4.0. https://sendmoneycompare.com/guides/fastest-way-to-send-money-internationally",
    header.join(","),
    ...rows,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="smc-delivery-tests-${DELIVERY_SPEED.generatedAt.slice(0, 7)}.csv"`,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
