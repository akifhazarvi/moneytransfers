"use client";

import { useEffect, useRef } from "react";
import { trackWhatsappImpression } from "@/lib/analytics";
import { WhatsAppGlyph, WhatsAppTile } from "./WhatsAppMark";
import WhatsAppFollowLink from "./WhatsAppFollowLink";

// Inline "follow the channel" card.
//
// The old version told people they'd get "rate-drop alerts" and asked them to
// take it on trust. The standard play for channel growth — and the one thing
// that reliably moves follow rate — is to SHOW the message they'll receive, in
// the chat UI they already recognise, and to pre-empt the objection that stops
// most people: "am I handing a stranger my phone number?" (On WhatsApp
// Channels, no: follows are one-way and admins never see follower numbers.)
//
// So the card is: real brand mark → sample alert rendered as a chat bubble →
// three concrete reassurances → one green button. Impressions are tracked so
// follow-rate has a denominator.

// Illustrative only — labelled "Example alert" in the UI, and deliberately
// phrased so nothing here reads as a live quote. Two bubbles rather than one:
// it fills the panel and shows the channel isn't one-note, without committing
// the channel to a countable weekly cadence.
type SampleMessage = {
  time: string;
  title: string;
  body: string;
  link: string | null;
};

// When the host page knows the corridor, the first bubble names it. A visitor
// on the UK-to-India page seeing "GBP -> INR" is being shown the alert they
// would actually receive; the same person seeing a hardcoded foreign corridor
// is being shown someone else's. Amounts stay relative rather than absolute so
// no illustrative figure is ever implausible for the corridor it's shown on.
function buildSamples(from?: string, to?: string, slug?: string): SampleMessage[] {
  const headline =
    from && to
      ? {
          time: "09:12",
          title: `${from} \u2192 ${to} \u00b7 cheapest just changed`,
          body: `Sending 1,000 ${from} today? The cheapest provider on this corridor changed overnight \u2014 same money in, more ${to} out. A bank wire is still the most expensive way to send it.`,
          link: slug ? `sendmoneycompare.com/send-money/${slug}` : null,
        }
      : {
          time: "09:12",
          title: "GBP \u2192 INR \u00b7 cheapest just changed",
          body: "Sending \u00a31,000 today? The cheapest provider on this corridor changed overnight \u2014 same money in, more rupees out. A bank wire is still the most expensive way to send it.",
          link: "sendmoneycompare.com/send-money/uk-to-india",
        };

  return [
    headline,
    {
      time: "Thu 16:40",
      title: "Watch the card-funding fee",
      body: "Two providers added a card-funding fee this morning. Paying by bank transfer is the cheaper route today.",
      link: null,
    },
  ];
}

const CHECKS = [
  {
    title: "Only when it matters",
    body: "A message when the cheapest provider on a major corridor actually changes — not a daily rate dump.",
  },
  {
    title: "Your number stays private",
    body: "Channels are one-way. We can't see your number, message you directly, or add you to a group.",
  },
  {
    title: "No signup, no email",
    body: "One tap to follow inside WhatsApp, one tap to unfollow. Nothing to fill in.",
  },
];

export default function WhatsAppInlineCTA({
  source = "results_inline",
  className = "",
  from,
  to,
  corridorSlug,
}: {
  source?: string;
  className?: string;
  /** Currency codes of the corridor being viewed, e.g. "GBP" / "INR". */
  from?: string;
  to?: string;
  /** Corridor slug, e.g. "uk-to-india", used for the link in the sample alert. */
  corridorSlug?: string;
}) {
  const samples = buildSamples(from, to, corridorSlug);
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  // Impression = the card genuinely reached the viewport. Without this we can't
  // tell a copy problem from a reach problem.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired.current) {
            fired.current = true;
            trackWhatsappImpression(source);
            io.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [source]);

  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] ${className}`}
    >
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
        {/* ── Left: the pitch ───────────────────────────────────────────── */}
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <WhatsAppTile className="h-11 w-11 rounded-[13px]" glyphClassName="h-6 w-6" />
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold leading-tight text-[var(--color-on-surface)]">
                SendMoneyCompare
              </p>
              <p className="text-xs font-medium text-[var(--color-on-surface-muted)]">
                WhatsApp Channel · Free
              </p>
            </div>
          </div>

          <h3 className="mt-4 text-xl font-bold leading-snug tracking-[-0.01em] text-[var(--color-on-surface)] sm:text-[22px]">
            {from && to
              ? `Get ${from} \u2192 ${to} alerts on WhatsApp`
              : "Know who\u2019s cheapest before you send"}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
            We track 60+ providers across 64 corridors every few hours. When the
            cheapest way to send changes, you get one short message — not a
            newsletter.
          </p>

          <ul className="mt-4 space-y-2.5">
            {CHECKS.map((item) => (
              <li key={item.title} className="flex gap-2.5">
                <svg
                  className="mt-[3px] h-4 w-4 shrink-0 text-[var(--wa-teal)]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm leading-snug text-[var(--color-on-surface-variant)]">
                  <span className="font-semibold text-[var(--color-on-surface)]">
                    {item.title}.
                  </span>{" "}
                  {item.body}
                </p>
              </li>
            ))}
          </ul>

          <WhatsAppFollowLink
            source={source}
            className="mt-5 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[var(--wa-green)] px-6 py-3.5 text-[15px] font-bold text-[var(--wa-on-green)] transition-colors hover:bg-[var(--wa-green-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wa-teal)] sm:w-auto"
          >
            <WhatsAppGlyph className="h-5 w-5" />
            Follow on WhatsApp
          </WhatsAppFollowLink>
          {/* Deliberately no "N messages a week" number here: the frequency
              expectation is set qualitatively in the first bullet, and a
              countable promise is one the channel would have to keep. */}
          <p className="mt-2.5 text-xs text-[var(--color-on-surface-muted)]">
            Free · one tap to follow · unfollow any time
          </p>
        </div>

        {/* ── Right: the actual message they'll receive ─────────────────── */}
        <div className="min-w-0">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-on-surface-muted)]">
            Example alert
          </p>
          <div className="flex flex-col gap-2 rounded-xl border border-[var(--color-outline)] bg-[var(--wa-chat-canvas)] p-3.5">
            {samples.map((msg) => (
              <div
                key={msg.time}
                className="ml-auto max-w-[19rem] rounded-xl rounded-tr-sm bg-[var(--wa-bubble)] px-3 py-2 text-[13px] leading-relaxed text-[var(--wa-bubble-ink)] shadow-sm"
              >
                <p className="font-bold">{msg.title}</p>
                <p className="mt-1.5">{msg.body}</p>
                {msg.link && (
                  <p className="mt-1.5 break-words text-[var(--wa-link)] underline decoration-[var(--wa-link)]/40">
                    {msg.link}
                  </p>
                )}
                <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-[var(--wa-bubble-ink)] opacity-70">
                  {msg.time}
                  <svg className="h-3.5 w-3.5 text-[var(--wa-tick)]" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path
                      d="M1.5 9.5 4.6 12.6 10.7 5.4M7 9.5l3.1 3.1L16.5 5.4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
