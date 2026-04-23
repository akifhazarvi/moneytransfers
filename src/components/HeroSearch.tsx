"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { currencies } from "@/data/transfer-currencies";

// Country → currency for autocomplete
const COUNTRY_CURRENCY: Record<string, { code: string; flag: string }> = {
  India: { code: "INR", flag: "🇮🇳" }, Pakistan: { code: "PKR", flag: "🇵🇰" },
  Mexico: { code: "MXN", flag: "🇲🇽" }, Philippines: { code: "PHP", flag: "🇵🇭" },
  Nigeria: { code: "NGN", flag: "🇳🇬" }, Bangladesh: { code: "BDT", flag: "🇧🇩" },
  Brazil: { code: "BRL", flag: "🇧🇷" }, Colombia: { code: "COP", flag: "🇨🇴" },
  UK: { code: "GBP", flag: "🇬🇧" }, Canada: { code: "CAD", flag: "🇨🇦" },
  Australia: { code: "AUD", flag: "🇦🇺" }, Germany: { code: "EUR", flag: "🇩🇪" },
  France: { code: "EUR", flag: "🇫🇷" }, Japan: { code: "JPY", flag: "🇯🇵" },
  China: { code: "CNY", flag: "🇨🇳" }, Kenya: { code: "KES", flag: "🇰🇪" },
  Ghana: { code: "GHS", flag: "🇬🇭" }, "South Africa": { code: "ZAR", flag: "🇿🇦" },
  Egypt: { code: "EGP", flag: "🇪🇬" }, Vietnam: { code: "VND", flag: "🇻🇳" },
  Thailand: { code: "THB", flag: "🇹🇭" }, Indonesia: { code: "IDR", flag: "🇮🇩" },
  Turkey: { code: "TRY", flag: "🇹🇷" }, Nepal: { code: "NPR", flag: "🇳🇵" },
  Peru: { code: "PEN", flag: "🇵🇪" }, UAE: { code: "AED", flag: "🇦🇪" },
  Europe: { code: "EUR", flag: "🇪🇺" },
};

interface Suggestion {
  label: string;
  sublabel: string;
  flag: string;
  href: string;
}

function buildSuggestions(query: string): Suggestion[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: Suggestion[] = [];

  // Match countries
  for (const [country, { code, flag }] of Object.entries(COUNTRY_CURRENCY)) {
    if (country.toLowerCase().startsWith(q) || code.toLowerCase().startsWith(q)) {
      results.push({
        label: `Send money to ${country}`,
        sublabel: `USD → ${code}`,
        flag,
        href: `/send-money?to=${code}`,
      });
    }
  }

  // Match currency codes/names
  for (const c of currencies) {
    if (
      results.length < 7 &&
      !results.some((r) => r.sublabel.includes(c.code)) &&
      (c.code.toLowerCase().startsWith(q) || c.name.toLowerCase().includes(q))
    ) {
      results.push({
        label: `Compare USD to ${c.code} rates`,
        sublabel: `USD → ${c.code} · ${c.name}`,
        flag: c.flag,
        href: `/send-money?from=USD&to=${c.code}`,
      });
    }
  }

  // Match "X to Y" pattern
  const toMatch = q.match(/^(\w+)\s+to\s+(\w+)/);
  if (toMatch) {
    const fromQ = toMatch[1];
    const toQ = toMatch[2];
    const fromCurr = currencies.find(
      (c) => c.code.toLowerCase() === fromQ || c.name.toLowerCase().startsWith(fromQ)
    );
    const toCurr = currencies.find(
      (c) => c.code.toLowerCase() === toQ || c.name.toLowerCase().startsWith(toQ)
    );
    const toCountry = Object.entries(COUNTRY_CURRENCY).find(
      ([name]) => name.toLowerCase().startsWith(toQ)
    );

    if (fromCurr && (toCurr || toCountry)) {
      const toCode = toCurr?.code || toCountry?.[1].code || "";
      const toFlag = toCurr?.flag || toCountry?.[1].flag || "";
      results.unshift({
        label: `Compare ${fromCurr.code} to ${toCode}`,
        sublabel: `${fromCurr.name} → ${toCurr?.name || toCountry?.[0] || toCode}`,
        flag: toFlag,
        href: `/send-money?from=${fromCurr.code}&to=${toCode}`,
      });
    }
  }

  return results.slice(0, 6);
}

export default function HeroSearch({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const suggestions = buildSuggestions(query);
  const showDropdown = focused && suggestions.length > 0;

  const submit = useCallback(
    (href?: string) => {
      if (href) {
        router.push(href);
      } else if (query.trim()) {
        router.push(`/api/search?q=${encodeURIComponent(query.trim())}`);
      }
      setFocused(false);
      inputRef.current?.blur();
    },
    [query, router]
  );

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        submit(suggestions[activeIndex].href);
      } else {
        submit();
      }
    } else if (e.key === "Escape") {
      setFocused(false);
      inputRef.current?.blur();
    }
  }

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  return (
    <div ref={wrapperRef} className={`relative ${compact ? "" : "max-w-xl mx-auto mt-4 sm:mt-6"}`}>
      {/* Search input */}
      <div
        className={`
          flex items-center bg-[var(--color-surface)] border rounded-full
          ${compact ? "px-3 py-1.5 gap-2" : "px-4 sm:px-5 py-2.5 sm:py-3 gap-3"} transition-all
          ${focused
            ? "border-[var(--color-primary)] shadow-[0_1px_6px_rgba(26,115,232,0.2)]"
            : "border-[var(--color-outline)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]"
          }
        `}
      >
        {/* Search icon */}
        <svg
          className={`${compact ? "w-4 h-4" : "w-5 h-5"} shrink-0 transition-colors ${focused ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={compact ? "e.g. USD to INR" : "Try \"USD to INR\" or \"send money to India\""}
          className={`flex-1 bg-transparent ${compact ? "text-xs" : "text-sm sm:text-base"} text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] outline-none`}
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `search-option-${activeIndex}` : undefined}
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className={`${compact ? "w-4 h-4" : "w-5 h-5"} shrink-0 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors`}
            aria-label="Clear search"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Submit button */}
        <button
          onClick={() => submit()}
          className={`shrink-0 ${compact ? "w-6 h-6" : "w-8 h-8 sm:w-9 sm:h-9"} rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white flex items-center justify-center transition-colors`}
          aria-label="Search"
        >
          <svg className={compact ? "w-3 h-3" : "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      {/* Dropdown suggestions */}
      {showDropdown && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl shadow-[var(--shadow-lg)] overflow-hidden z-50"
          role="listbox"
        >
          {suggestions.map((s, i) => (
            <button
              key={s.href}
              id={`search-option-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onClick={() => submit(s.href)}
              className={`
                w-full flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 text-left transition-colors
                ${i === activeIndex
                  ? "bg-[var(--color-primary-surface)]"
                  : "hover:bg-[var(--color-surface-dim)]"
                }
                ${i > 0 ? "border-t border-[var(--color-outline)]/50" : ""}
              `}
            >
              <span className="text-lg shrink-0">{s.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">{s.label}</p>
                <p className="text-xs text-[var(--color-on-surface-variant)] truncate">{s.sublabel}</p>
              </div>
              <svg className="w-4 h-4 text-[var(--color-on-surface-variant)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
