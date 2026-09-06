/**
 * SendScore card — the timing answer, shown on pages that already exist.
 *
 * Deliberately a server component with no new route: the score is a reason to
 * come back to a corridor page, not a reason to publish another URL.
 *
 * The headline number and the sentence under it are both taken from the same
 * `SendScore` object, so they cannot disagree. The component never re-derives
 * or re-words anything — if the copy looks wrong, the fix belongs in
 * `computeSendScore`, not here.
 */

import type { SendScore, SendScoreBand } from "@/lib/send-score";
import type { ProviderConsistency } from "@/lib/provider-consistency";

/**
 * Band colours use the semantic tokens, not the chart accent — this is a
 * status readout, and a viewer should be able to read "poor" without reading
 * the number. Each band also carries a distinct word, so the meaning never
 * rests on colour alone.
 */
const BAND_STYLE: Record<SendScoreBand, { fg: string; bg: string; ring: string }> = {
  exceptional: { fg: "var(--color-success)", bg: "var(--color-success-surface)", ring: "var(--color-success)" },
  great: { fg: "var(--color-success)", bg: "var(--color-success-surface)", ring: "var(--color-success)" },
  good: { fg: "var(--color-primary)", bg: "var(--color-primary-surface)", ring: "var(--color-primary)" },
  typical: { fg: "var(--color-on-surface-variant)", bg: "var(--color-surface-dim)", ring: "var(--color-outline)" },
  poor: { fg: "var(--color-danger)", bg: "var(--color-danger-surface)", ring: "var(--color-danger)" },
};

interface Props {
  score: SendScore;
  fromCurrency: string;
  toCurrency: string;
  /** Rendered smaller inside a denser page section. */
  compact?: boolean;
  /**
   * "Who is usually cheapest here". Optional because 800 of 1,012 corridors
   * lack enough contested days to rank anyone honestly.
   */
  consistency?: ProviderConsistency | null;
}

export default function SendScoreCard({ score, fromCurrency, toCurrency, compact, consistency }: Props) {
  const style = BAND_STYLE[score.band];
  // Dial sweep. 0-100 maps onto a 3/4 turn so the ends stay visually distinct.
  const sweep = (score.score / 100) * 270;

  return (
    <section
      className="rounded-2xl border p-5 sm:p-6"
      style={{ borderColor: "var(--color-outline)", background: "var(--color-surface)" }}
      aria-label={`SendScore for ${fromCurrency} to ${toCurrency}`}
    >
      <div className="flex items-start gap-5">
        <div
          className="relative shrink-0 grid place-items-center rounded-full"
          style={{
            width: compact ? 76 : 92,
            height: compact ? 76 : 92,
            background: `conic-gradient(from 225deg, ${style.ring} ${sweep}deg, var(--color-surface-dim) ${sweep}deg 270deg, transparent 270deg)`,
          }}
        >
          <div
            className="grid place-items-center rounded-full"
            style={{
              width: compact ? 62 : 76,
              height: compact ? 62 : 76,
              background: "var(--color-surface)",
            }}
          >
            <span
              className="font-bold leading-none tabular-nums"
              style={{ fontSize: compact ? 22 : 27, color: style.fg }}
            >
              {score.score}
            </span>
            <span className="text-[10px] mt-0.5" style={{ color: "var(--color-on-surface-variant)" }}>
              / 100
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base sm:text-lg font-semibold" style={{ color: "var(--color-on-surface)" }}>
              {score.headline}
            </h3>
            <span
              /* No `uppercase` — it renders the product name as "SENDSCORE". */
              className="text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-full"
              style={{ background: style.bg, color: style.fg }}
            >
              SendScore
            </span>
          </div>

          <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
            {score.explanation}
          </p>

          <ul className="mt-3.5 grid gap-1.5">
            {score.components.map((c) => (
              <li key={c.key} className="flex items-center gap-2.5 text-xs">
                <span className="w-9 shrink-0 tabular-nums text-right" style={{ color: "var(--color-on-surface-variant)" }}>
                  {c.weight}%
                </span>
                <span
                  className="h-1.5 rounded-full overflow-hidden shrink-0"
                  style={{ width: 72, background: "var(--color-surface-dim)" }}
                  aria-hidden="true"
                >
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${c.score}%`, background: style.ring }}
                  />
                </span>
                <span className="min-w-0" style={{ color: "var(--color-on-surface-variant)" }}>
                  <span style={{ color: "var(--color-on-surface)" }}>{c.label}</span>
                  {" — "}
                  {c.detail}
                </span>
              </li>
            ))}
          </ul>

          {consistency && consistency.leaders.length > 1 && (
            <div
              className="mt-4 pt-3.5 border-t"
              style={{ borderColor: "var(--color-outline)" }}
            >
              <h4
                className="text-[11px] font-semibold tracking-wide mb-1.5"
                style={{ color: "var(--color-on-surface)" }}
              >
                Who is usually cheapest here
              </h4>
              <p className="text-[13px] leading-relaxed mb-2.5" style={{ color: "var(--color-on-surface-variant)" }}>
                {consistency.summary}
              </p>
              <ul className="grid gap-1">
                {consistency.leaders.slice(0, 4).map((l) => (
                  <li key={l.providerSlug} className="flex items-center gap-2.5 text-xs">
                    <span
                      className="h-1.5 rounded-full overflow-hidden shrink-0"
                      style={{ width: 72, background: "var(--color-surface-dim)" }}
                      aria-hidden="true"
                    >
                      <span
                        className="block h-full rounded-full"
                        /* Not `style.ring` — that is the SendScore band, so a
                           75% win rate rendered danger-red on a "Poor" corridor.
                           A win rate is neutral information about a provider,
                           not a verdict about today. */
                        style={{ width: `${l.winRate}%`, background: "var(--color-primary)" }}
                      />
                    </span>
                    <span className="tabular-nums w-11 shrink-0" style={{ color: "var(--color-on-surface)" }}>
                      {Math.round(l.winRate)}%
                    </span>
                    <span className="min-w-0 truncate" style={{ color: "var(--color-on-surface-variant)" }}>
                      <span style={{ color: "var(--color-on-surface)" }}>{l.providerName}</span>
                      {" — cheapest on "}
                      {l.wins} of {l.quotedDays} days it quoted
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px]" style={{ color: "var(--color-on-surface-variant)" }}>
                {consistency.contestedDays} days where two or more providers quoted, over {consistency.windowDays} days.
                Days with a single quote are excluded — winning unopposed is not evidence.
              </p>
            </div>
          )}

          <p className="mt-3 text-[11px]" style={{ color: "var(--color-on-surface-variant)" }}>
            Measured from {score.daysObserved} days of our own recorded provider rates for{" "}
            {fromCurrency}→{toCurrency}
            {score.confidence === "low" && " · limited history, treat as indicative"}
          </p>
        </div>
      </div>
    </section>
  );
}
