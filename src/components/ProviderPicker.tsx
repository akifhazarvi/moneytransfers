"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { providers, type Provider } from "@/data/providers";

/* ─── Floating Dropdown (Portal) — mirrors CurrencyPicker so the tool feels native ─── */
function FloatingDropdown({
  anchorRef,
  open,
  onClose,
  children,
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setCoords({ top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX, width: rect.width });
  }, [open, anchorRef]);

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

  if (!open) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      role="dialog"
      aria-modal="true"
      aria-label="Select provider"
      style={{ position: "absolute", top: coords.top, left: coords.left, minWidth: Math.max(coords.width, 280) }}
      className="z-[9999]"
    >
      {children}
    </div>,
    document.body
  );
}

/* ─── Provider Picker ─── */
export default function ProviderPicker({
  value,
  onChange,
  excludeSlug,
  accent = "primary",
}: {
  value: string;
  onChange: (slug: string) => void;
  /** The other side's slug — kept out of the list so you can't compare a provider to itself */
  excludeSlug?: string;
  accent?: "primary" | "neutral";
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const portalId = `provider-portal-${value}`;

  const selected = providers.find((p) => p.slug === value);

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

  const filtered = providers.filter(
    (p: Provider) =>
      p.slug !== excludeSlug &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase()))
  );

  const ring =
    accent === "primary"
      ? "focus-within:border-[var(--color-primary)]"
      : "focus-within:border-[var(--color-on-surface)]";

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 text-left bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl px-4 py-3.5 hover:border-[var(--color-on-surface)]/40 transition-colors ${ring}`}
        aria-label={selected ? `Provider: ${selected.name}. Change selection.` : "Select a provider"}
        aria-expanded={open}
      >
        {selected ? (
          <>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-[var(--color-outline)]/60 shrink-0">
              <Image src={selected.logo} alt="" width={40} height={40} className="w-full h-full object-contain p-1" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-md font-semibold text-[var(--color-on-surface)] truncate">{selected.name}</span>
              <span className="block text-2xs text-[var(--color-on-surface-variant)] tabular-nums">
                {selected.rating.toFixed(1)} ★ · {selected.ratingLabel}
              </span>
            </div>
          </>
        ) : (
          <span className="flex-1 text-md text-[var(--color-on-surface-variant)]">Choose a provider…</span>
        )}
        <svg className="w-4 h-4 text-[var(--color-on-surface-variant)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <FloatingDropdown anchorRef={btnRef} open={open} onClose={() => setOpen(false)}>
        <div
          id={portalId}
          className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] shadow-[0_8px_28px_rgba(32,33,36,0.22)] max-h-[360px] flex flex-col overflow-hidden"
        >
          <div className="p-2 border-b border-[var(--color-outline)]">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search providers…"
              aria-label="Search providers"
              className="w-full text-sm px-3 py-2 rounded-lg border border-[var(--color-outline)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div className="overflow-y-auto overscroll-contain">
            {filtered.map((p) => (
              <button
                key={p.slug}
                onClick={() => {
                  onChange(p.slug);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-[var(--color-surface-dim)] transition-colors ${p.slug === value ? "bg-[var(--color-primary-surface)]" : ""}`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-[var(--color-outline)]/60 shrink-0">
                  <Image src={p.logo} alt="" width={32} height={32} className="w-full h-full object-contain p-1" />
                </div>
                <span className="text-sm font-medium text-[var(--color-on-surface)] flex-1 truncate">{p.name}</span>
                <span className="text-2xs text-[var(--color-on-surface-variant)] tabular-nums shrink-0">{p.rating.toFixed(1)} ★</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-2sm text-[var(--color-on-surface-variant)]">No providers found</p>
            )}
          </div>
        </div>
      </FloatingDropdown>
    </div>
  );
}
