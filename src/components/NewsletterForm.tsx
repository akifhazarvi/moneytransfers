"use client";

import { useState, type FormEvent } from "react";

interface Props {
  placeholder: string;
  buttonLabel: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm({ placeholder, buttonLabel }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm text-[var(--color-success-dark)] font-medium py-3">
        You&apos;re subscribed! We&apos;ll send you the latest guides and the weekly digest.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        disabled={status === "loading"}
        className="flex-1 border border-[var(--color-outline)] rounded-full px-4 py-3 text-sm bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-full text-2sm font-medium hover:bg-[var(--color-primary-dark)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Subscribing..." : buttonLabel}
      </button>
      {status === "error" && (
        <p className="w-full text-xs text-[var(--color-error)] mt-1 text-center sm:text-left">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
