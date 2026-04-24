"use client";

export default function CookiePreferencesLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-cookie-consent"))}
      className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors text-left cursor-pointer"
    >
      {label}
    </button>
  );
}
