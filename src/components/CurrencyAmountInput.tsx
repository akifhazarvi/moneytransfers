"use client";

import { useId } from "react";

interface Props {
  /** Current amount as a string (parent owns the state for cross-input sync). */
  value: string;
  /** Called with the raw string on every valid keystroke. */
  onValueChange: (next: string) => void;
  /** Currency symbol shown before the number, e.g. "$" or "₹". */
  symbol: string;
  /** Visible label text (e.g. "You send"). */
  label: string;
  /** Validation/error message; when set, the input renders in the error color. */
  error?: string;
  /**
   * "large"  — desktop pill: inline label above, no border, wider field.
   * "compact" — mobile row: label and field on one line, right-aligned.
   */
  size?: "large" | "compact";
  /** Stable id prefix so label/input/error wire up for a11y. */
  idPrefix?: string;
}

/**
 * The amount field used in the comparison widget. Previously this markup +
 * validation lived inline in both the mobile and desktop layouts of
 * ComparisonWidget, drifting apart over time (different widths, weights, and
 * one missing the error wiring). Centralizing it keeps the conversion-critical
 * input consistent and makes future tweaks one-touch.
 *
 * The parent owns `value`/`onValueChange` so both layouts (only one is visible
 * at a given breakpoint) stay in sync with the same amount state.
 */
export default function CurrencyAmountInput({
  value,
  onValueChange,
  symbol,
  label,
  error,
  size = "large",
  idPrefix,
}: Props) {
  const autoId = useId();
  const id = idPrefix ?? autoId;
  const errorId = `${id}-error`;

  // Accept only well-formed decimal input; ignore anything else mid-type.
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (v === "" || /^\d*\.?\d*$/.test(v)) onValueChange(v);
  }

  // Never leave the field empty or zero — fall back to 1 on blur.
  function handleBlur() {
    if (!value || Number(value) <= 0) onValueChange("1");
  }

  if (size === "compact") {
    return (
      <>
        <div className="border-t border-[var(--color-outline)] px-4 py-3 flex items-center gap-3">
          <label
            htmlFor={id}
            className="text-[10px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider shrink-0"
          >
            {label}
          </label>
          <div className="flex items-baseline gap-1 ml-auto">
            <span className="text-h4 font-medium text-[var(--color-on-surface)]">{symbol}</span>
            <input
              id={id}
              type="text"
              inputMode="decimal"
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`bg-transparent text-h4 font-semibold text-[var(--color-on-surface)] focus:outline-none w-[150px] text-right tabular-nums ${error ? "text-[var(--color-error)]" : ""}`}
              placeholder="1,000"
              aria-describedby={error ? errorId : undefined}
            />
          </div>
        </div>
        {error && (
          <p id={errorId} className="px-4 pb-2 text-2xs text-[var(--color-error)]">
            {error}
          </p>
        )}
      </>
    );
  }

  // "large" — desktop pill half
  return (
    <div className="flex items-baseline gap-1 shrink-0 ml-auto border-l border-[var(--color-outline)] pl-4">
      <span className="text-h4 font-medium text-[var(--color-on-surface)]">{symbol}</span>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`bg-transparent text-h4 font-medium text-[var(--color-on-surface)] focus:outline-none min-w-0 w-[120px] tabular-nums ${error ? "text-[var(--color-error)]" : ""}`}
        placeholder="1,000"
        aria-describedby={error ? errorId : undefined}
      />
    </div>
  );
}
