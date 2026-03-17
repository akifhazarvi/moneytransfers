"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { currencies } from "@/data/transfer-currencies";
import CircleFlag from "@/components/CircleFlag";

/* ─── Floating Dropdown (Portal) ─── */
function FloatingDropdown({
  anchorRef,
  open,
  onClose,
  children,
  position = "below",
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: "below" | "above";
}) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use useLayoutEffect to position before paint (prevents flash)
  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    if (position === "above") {
      setCoords({ top: rect.top + window.scrollY - 4, left: rect.left + window.scrollX });
    } else {
      setCoords({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX });
    }
  }, [open, anchorRef, position]);

  // Escape key handler
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        anchorRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, anchorRef]);

  // Focus trap: keep Tab within dropdown
  useEffect(() => {
    if (!open || !dropdownRef.current) return;
    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab" || !dropdownRef.current) return;
      const focusable = dropdownRef.current.querySelectorAll<HTMLElement>(
        'button, input, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      role="dialog"
      aria-modal="true"
      aria-label="Select currency"
      style={{
        position: "absolute",
        top: coords.top,
        left: coords.left,
        ...(position === "above" ? { transform: "translateY(-100%)" } : {}),
      }}
      className="z-[9999]"
    >
      {children}
    </div>,
    document.body
  );
}

/* ─── Currency Picker ─── */
export default function CurrencyPicker({
  value,
  onChange,
  excludeCodes = [],
  label,
  size = "default",
  position = "below",
}: {
  value: string;
  onChange: (code: string) => void;
  excludeCodes?: string[];
  label?: string;
  /** "default" = flag + code + name + chevron. "compact" = flag + code + chevron (no name). "inline" = fits inside search bars. "large" = big flag + code + name for prominent display. */
  size?: "default" | "compact" | "inline" | "large";
  position?: "below" | "above";
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const portalId = `picker-portal-${value}-${size}`;

  const info = currencies.find((c) => c.code === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        const portal = document.getElementById(portalId);
        if (portal && portal.contains(e.target as Node)) return;
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [portalId]);

  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const filtered = currencies.filter(
    (c) =>
      !excludeCodes.includes(c.code) &&
      (c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase()))
  );

  const buttonContent = (() => {
    switch (size) {
      case "compact":
        return (
          <>
            {info && <CircleFlag code={info.code} size={18} />}
            <span className="text-[14px] font-medium text-[var(--color-on-surface)]">{info?.code}</span>
            <svg className="w-3.5 h-3.5 text-[var(--color-on-surface-variant)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        );
      case "inline":
        return (
          <>
            {info && <CircleFlag code={info.code} size={16} />}
            <span className="text-[14px] text-[var(--color-on-surface)]">{info?.name}</span>
            <span className="text-[14px] text-[var(--color-on-surface-variant)]">{info?.code}</span>
            <svg className="w-3.5 h-3.5 text-[var(--color-on-surface-variant)] shrink-0 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        );
      case "large":
        return (
          <>
            {info && <CircleFlag code={info.code} size={32} />}
            <span className="text-[22px] font-medium text-[var(--color-on-surface)] whitespace-nowrap">{info?.code}</span>
            <span className="text-[14px] text-[var(--color-on-surface-variant)] whitespace-nowrap hidden sm:inline">{info?.name}</span>
            <svg className="w-4 h-4 text-[var(--color-on-surface-variant)] shrink-0 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        );
      default:
        return (
          <>
            {info && <CircleFlag code={info.code} size={22} />}
            <span className="text-[15px] font-medium text-[var(--color-on-surface)]">{info?.code}</span>
            <span className="text-[14px] text-[var(--color-on-surface-variant)] hidden sm:inline">— {info?.name}</span>
            <svg className="w-4 h-4 text-[var(--color-on-surface-variant)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        );
    }
  })();

  const btnClass = (() => {
    switch (size) {
      case "compact":
        return "flex items-center gap-1.5 hover:bg-[var(--color-surface-container)] rounded-lg px-2 py-1 transition-colors";
      case "inline":
        return "flex items-center gap-2 w-full text-left hover:bg-[var(--color-surface-dim)] rounded-lg px-1 py-0.5 -mx-1 transition-colors";
      case "large":
        return "flex items-center gap-3 w-full text-left hover:bg-[var(--color-surface-dim)] rounded-xl px-2 py-1.5 -mx-2 transition-colors";
      default:
        return "flex items-center gap-2 hover:bg-[var(--color-surface-container)] rounded-lg px-2 py-1.5 -ml-2 transition-colors";
    }
  })();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className={btnClass}
        aria-label={label || `Select currency, current: ${value}`}
      >
        {buttonContent}
      </button>

      <FloatingDropdown anchorRef={btnRef} open={open} onClose={() => setOpen(false)} position={position}>
        <div
          id={portalId}
          className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-outline)] shadow-[0_4px_16px_rgba(32,33,36,0.18)] w-[280px] max-h-[320px] flex flex-col overflow-hidden"
        >
          <div className="p-2 border-b border-[var(--color-outline)]">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search currencies..."
              aria-label="Search currencies"
              className="w-full text-[14px] px-3 py-2 rounded-lg border border-[var(--color-outline)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div className="overflow-y-auto overscroll-contain">
            {filtered.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  onChange(c.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--color-surface-dim)] transition-colors ${c.code === value ? "bg-[var(--color-primary-surface)]" : ""}`}
              >
                <CircleFlag code={c.code} size={18} />
                <div>
                  <span className="text-[14px] font-medium text-[var(--color-on-surface)]">{c.code}</span>
                  <span className="text-[13px] text-[var(--color-on-surface-variant)] ml-2">{c.name}</span>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-[13px] text-[var(--color-on-surface-variant)]">No currencies found</p>
            )}
          </div>
        </div>
      </FloatingDropdown>
    </div>
  );
}

/* ─── Add Currency Picker (for converter page) ─── */
export function AddCurrencyPicker({
  excludeCodes,
  onAdd,
  disabled,
}: {
  excludeCodes: string[];
  onAdd: (code: string) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        const portal = document.getElementById("add-currency-portal");
        if (portal && portal.contains(e.target as Node)) return;
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const filtered = currencies.filter(
    (c) =>
      !excludeCodes.includes(c.code) &&
      (c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className="flex items-center gap-2 text-[14px] font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add currency
      </button>

      <FloatingDropdown anchorRef={btnRef} open={open} onClose={() => setOpen(false)} position="above">
        <div
          id="add-currency-portal"
          className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-outline)] shadow-[0_4px_16px_rgba(32,33,36,0.18)] w-[280px] max-h-[320px] flex flex-col overflow-hidden"
        >
          <div className="p-2 border-b border-[var(--color-outline)]">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search currencies to add..."
              aria-label="Search currencies to add"
              className="w-full text-[14px] px-3 py-2 rounded-lg border border-[var(--color-outline)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div className="overflow-y-auto overscroll-contain">
            {filtered.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  onAdd(c.code);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--color-surface-dim)] transition-colors"
              >
                <CircleFlag code={c.code} size={18} />
                <div>
                  <span className="text-[14px] font-medium text-[var(--color-on-surface)]">{c.code}</span>
                  <span className="text-[13px] text-[var(--color-on-surface-variant)] ml-2">{c.name}</span>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-[13px] text-[var(--color-on-surface-variant)]">No currencies available</p>
            )}
          </div>
        </div>
      </FloatingDropdown>
    </div>
  );
}
