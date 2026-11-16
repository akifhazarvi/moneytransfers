"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Code2, Menu, Moon, Sun, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTheme } from "@/components/ThemeProvider";
import InstallAppButton from "@/components/pwa/InstallAppButton";
import ExtensionDetailsButton from "@/components/ExtensionDetailsButton";
import styles from "./Header.module.css";

const resources = [
  { href: "/exchange-rates", label: "Exchange rates", description: "Follow currencies and rate history" },
  { href: "/guides", label: "Money transfer guides", description: "Understand fees and sending abroad" },
  { href: "/compare", label: "Compare providers", description: "Explore providers side by side" },
  { href: "/business", label: "Business payments", description: "Compare options for your business" },
  { href: "/currency-converter", label: "Currency converter", description: "Calculate what your money is worth" },
  { href: "/methodology", label: "How we compare", description: "Our sources, checks and methodology" },
];

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState<"resources" | "mobile" | null>(null);
  const header = useRef<HTMLElement>(null);
  const resourceButton = useRef<HTMLButtonElement>(null);
  const mobileButton = useRef<HTMLButtonElement>(null);
  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const close = () => setOpen(null);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || document.querySelector("dialog[open]")) return;
      setOpen(null);
      (open === "resources" ? resourceButton : mobileButton).current?.focus();
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <header ref={header} className={`site-header ${styles.header}`}>
      <div className={styles.inner}>
        <div className={styles.bar}>
          <Link href="/" aria-label="SendMoneyCompare — Home" className={styles.brand} onClick={close}>
            <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
              <path d="M3.5 15.8L26.5 4.5L21 27L14.5 19.5Z" fill="var(--color-primary)" />
              <path d="M14.5 19.5L26.5 4.5" stroke="var(--color-surface)" strokeWidth=".8" />
            </svg>
            <span><strong>Send</strong><span className={styles.wordmark}>money</span></span>
          </Link>
          <nav aria-label="Main navigation" className={`pwa-hide-standalone ${styles.desktop}`}>
            <Link href="/send-money" aria-current={active("/send-money") ? "page" : undefined} onClick={close}>Compare transfers</Link>
            <Link href="/companies" aria-current={active("/companies") ? "page" : undefined} onClick={close}>{t("companies")}</Link>
            <div className={styles.resources}>
              <button ref={resourceButton} type="button" aria-expanded={open === "resources"} aria-controls="header-resources" onClick={() => setOpen(open === "resources" ? null : "resources")}>
                Resources <ChevronDown size={15} aria-hidden="true" />
              </button>
              {open === "resources" && (
                <div id="header-resources" className={styles.resourcePanel}>
                  {resources.map((item) => <Link key={item.href} href={item.href} onClick={close} aria-current={active(item.href) ? "page" : undefined}>
                    <span>{item.label}</span><small>{item.description}</small>
                  </Link>)}
                </div>
              )}
            </div>
            <Link href="/developers" aria-current={active("/developers") ? "page" : undefined} onClick={close}><Code2 size={16} aria-hidden="true" /> Developers</Link>
            <ExtensionDetailsButton placement="header_details" className={styles.extensionLink} />
          </nav>
          <div className={styles.actions}>
            <InstallAppButton variant="header" />
            <button type="button" onClick={toggleTheme} className={styles.iconButton} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
              {theme === "dark" ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
            </button>
            <button ref={mobileButton} type="button" className={`${styles.iconButton} ${styles.mobileToggle}`} onClick={() => setOpen(open === "mobile" ? null : "mobile")} aria-label="Toggle menu" aria-expanded={open === "mobile"} aria-controls="header-mobile">
              {open === "mobile" ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>
        {open === "mobile" && (
          <nav id="header-mobile" aria-label="Mobile navigation" className={styles.mobile}>
            <div className={styles.mobileLinks}>
              {[{ href: "/", label: t("home") }, { href: "/send-money", label: "Compare transfers" }, { href: "/companies", label: t("companies") }, ...resources, { href: "/developers", label: "Developers · Data API" }].map((item) => (
                <Link key={item.href} href={item.href} aria-current={pathname === item.href || (item.href !== "/" && active(item.href)) ? "page" : undefined} onClick={close}>{item.label}</Link>
              ))}
            </div>
            <div className={styles.mobileProducts}>
              <ExtensionDetailsButton placement="mobile_details" />
              <InstallAppButton variant="menu" onClick={close} />
            </div>
          </nav>
        )}
        <nav className="pwa-app-nav" aria-label="App navigation">
          {[{ href: "/send-money", label: "Compare" }, { href: "/exchange-rates", label: "Rates" }, { href: "/guides", label: "Guides" }].map(({ href, label }) => (
            <Link key={href} href={href} aria-current={active(href) ? "page" : undefined} onClick={close}>{label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
