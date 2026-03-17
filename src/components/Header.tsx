"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { routing } from "@/i18n/routing";

const navLinks = [
  {
    href: "/" as const,
    labelKey: "home" as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/send-money" as const,
    labelKey: "sendMoney" as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/compare" as const,
    labelKey: "compareProviders" as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: "/companies" as const,
    labelKey: "companies" as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    href: "/guides" as const,
    labelKey: "guides" as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href: "/business" as const,
    labelKey: "business" as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    href: "/methodology" as const,
    labelKey: "methodology" as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
];

const localeLabels: Record<string, string> = {
  en: "EN",
  es: "ES",
  fr: "FR",
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
    setLangOpen(false);
  }

  return (
    <header className="bg-[var(--color-surface)] sticky top-0 z-50 border-b border-[var(--color-outline)]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Top bar — logo + actions */}
        <div className="flex items-center justify-between h-16">
          <Link href="/" aria-label="Send Money — Home" className="flex items-center gap-2 shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
              <circle cx="16" cy="16" r="16" fill="#2D3A8C" />
              <circle cx="16" cy="16" r="10" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />
              <text x="16" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">$</text>
              <path d="M6 12h5" stroke="#81D4FA" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M8 12l2-2" stroke="#81D4FA" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M8 12l2 2" stroke="#81D4FA" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M26 20h-5" stroke="#A5D6A7" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M24 20l-2-2" stroke="#A5D6A7" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M24 20l-2 2" stroke="#A5D6A7" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="text-[20px] font-semibold tracking-[-0.3px] text-[var(--color-on-surface)]">
              Send Money
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                    active
                      ? "text-[var(--color-primary)] bg-[var(--color-primary-surface)]"
                      : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]"
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 h-12 px-2.5 rounded-full hover:bg-[var(--color-surface-container)] transition-colors text-[13px] font-medium text-[var(--color-on-surface-variant)]"
                aria-label="Switch language"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                {localeLabels[locale]}
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl shadow-lg py-1 min-w-[120px]">
                    {routing.locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => switchLocale(loc)}
                        lang={loc}
                        aria-label={`Switch to ${loc === "en" ? "English" : loc === "es" ? "Español" : "Français"}`}
                        className={`w-full text-left px-4 py-2 text-[13px] transition-colors ${
                          loc === locale
                            ? "text-[var(--color-primary)] bg-[var(--color-primary-surface)] font-medium"
                            : "text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)]"
                        }`}
                      >
                        {loc === "en" ? "English" : loc === "es" ? "Español" : "Français"}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-[var(--color-surface-container)] transition-colors"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5 text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="lg:hidden w-12 h-12 flex items-center justify-center rounded-full hover:bg-[var(--color-surface-container)] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav aria-label="Mobile navigation" className="lg:hidden py-3 border-t border-[var(--color-outline)]">
            {navLinks.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 py-3 px-3 text-[14px] rounded-lg transition-colors ${
                    active
                      ? "text-[var(--color-primary)] bg-[var(--color-primary-surface)]"
                      : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.icon}
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
