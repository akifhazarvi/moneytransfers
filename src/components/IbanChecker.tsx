"use client";

import { useMemo, useState } from "react";
import Link from "@/components/EligibleLink";
import { trackToolUsed, trackToolCTA } from "@/lib/analytics";

/**
 * IBAN checker: country code, length and the ISO 13616 mod-97 check digits,
 * computed in the browser. The guides and the header had promised an "IBAN
 * checker" for months while /iban only listed formats (2026-10-18), and
 * "iban number" is a Bing AI query where other sites are cited and we are not.
 *
 * It checks structure only. A valid result says nothing about whether the
 * account exists or who holds it, and the copy says so. The IBAN itself never
 * leaves the page: analytics get the country and the outcome, not the number.
 */

export interface IbanCheckerCountry {
  /** ISO 3166 alpha-2, the IBAN's first two letters */
  code: string;
  name: string;
  length: number;
  /** The country's IBAN page when Google may index it */
  pageHref: string | null;
  /** The comparison that page's live table prices (route + amount) */
  compareHref: string | null;
}

type Outcome =
  | { kind: "empty" }
  | { kind: "malformed" }
  | { kind: "unknown-country"; code: string }
  | { kind: "wrong-length"; country: IbanCheckerCountry; got: number }
  | { kind: "bad-check-digits"; country: IbanCheckerCountry }
  | { kind: "valid"; country: IbanCheckerCountry };

/** ISO 7064 MOD 97-10 over the rearranged IBAN, in chunks (no BigInt needed). */
function mod97(iban: string): number {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let digits = "";
  for (const ch of rearranged) digits += /[A-Z]/.test(ch) ? String(ch.charCodeAt(0) - 55) : ch;
  let rem = 0;
  for (let i = 0; i < digits.length; i += 7) rem = Number(String(rem) + digits.slice(i, i + 7)) % 97;
  return rem;
}

function check(raw: string, byCode: Map<string, IbanCheckerCountry>): Outcome {
  const iban = raw.replace(/[\s-]/g, "").toUpperCase();
  if (!iban) return { kind: "empty" };
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(iban)) return { kind: "malformed" };
  const country = byCode.get(iban.slice(0, 2));
  if (!country) return { kind: "unknown-country", code: iban.slice(0, 2) };
  if (iban.length !== country.length) return { kind: "wrong-length", country, got: iban.length };
  if (mod97(iban) !== 1) return { kind: "bad-check-digits", country };
  return { kind: "valid", country };
}

export default function IbanChecker({ countries, source }: { countries: IbanCheckerCountry[]; source: string }) {
  const byCode = useMemo(() => new Map(countries.map((c) => [c.code, c])), [countries]);
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const outcome = check(value, byCode);
  const shown = submitted ? outcome : { kind: "empty" as const };

  const report = () => {
    setSubmitted(true);
    if (outcome.kind === "empty") return;
    trackToolUsed("iban-checker", {
      outcome: outcome.kind,
      country: "country" in outcome ? outcome.country.code : outcome.kind === "unknown-country" ? outcome.code : "",
      source,
    });
  };

  return (
    <section
      id="iban-checker"
      aria-label="IBAN checker"
      className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl p-5 sm:p-6 shadow-sm scroll-mt-24"
    >
      <p className="text-base font-medium text-[var(--color-on-surface)]">Check an IBAN number</p>
      <p className="text-2sm text-[var(--color-on-surface-variant)] mt-1">
        Checks the country code, the length and the two check digits. It runs in your browser: the IBAN is not sent anywhere.
      </p>
      <form
        className="mt-4 flex flex-col sm:flex-row gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          report();
        }}
      >
        <label htmlFor="iban-checker-input" className="sr-only">
          IBAN
        </label>
        <input
          id="iban-checker-input"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSubmitted(false);
          }}
          onBlur={() => value.trim() && report()}
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="e.g. DE89 3704 0044 0532 0130 00"
          className="flex-1 min-w-0 rounded-full border border-[var(--color-outline)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-mono text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <button
          type="submit"
          className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Check IBAN
        </button>
      </form>

      <div aria-live="polite" className="mt-4 text-sm">
        {shown.kind === "malformed" && (
          <p className="text-[var(--color-danger)]">
            An IBAN starts with a two-letter country code and two check digits, followed by letters and numbers only.
          </p>
        )}
        {shown.kind === "unknown-country" && (
          <p className="text-[var(--color-danger)]">
            &ldquo;{shown.code}&rdquo; is not the country code of any of the {countries.length} countries in our IBAN format list.
          </p>
        )}
        {shown.kind === "wrong-length" && (
          <p className="text-[var(--color-danger)]">
            A {shown.country.name} IBAN has {shown.country.length} characters; this one has {shown.got}. A character is
            missing or extra.
          </p>
        )}
        {shown.kind === "bad-check-digits" && (
          <p className="text-[var(--color-danger)]">
            The check digits do not match: a character is probably mistyped, or two are swapped. Ask the recipient to
            copy it again from their banking app or statement.
          </p>
        )}
        {shown.kind === "valid" && (
          <div className="space-y-2">
            <p className="text-[var(--color-success-dark)] font-medium">
              Valid {shown.country.name} IBAN format ({shown.country.length} characters, check digits correct).
            </p>
            <p className="text-2sm text-[var(--color-on-surface-variant)]">
              This confirms the number is well formed. It cannot confirm that the account exists or who holds it, so check
              the account name with the recipient before you send.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
              {shown.country.compareHref && (
                <Link
                  href={shown.country.compareHref}
                  onClick={() => trackToolCTA("iban-checker", { country: shown.country.code, source })}
                  className="text-2sm font-medium text-[var(--color-primary)] hover:underline"
                  unlinked="hide"
                >
                  Compare transfers to {shown.country.name} →
                </Link>
              )}
              {shown.country.pageHref && (
                <Link
                  href={shown.country.pageHref}
                  className="text-2sm text-[var(--color-primary)] hover:underline"
                  unlinked="hide"
                >
                  {shown.country.name} IBAN format and bank codes
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
