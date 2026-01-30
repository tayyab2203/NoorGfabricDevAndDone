"use client";

import { useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !consent) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
        setConsent(false);
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-lg bg-white px-4 py-8 text-center shadow-sm sm:px-6 sm:py-10">
      <h2 className="text-xl font-semibold text-[var(--color-heading-gold)] sm:text-2xl">
        Get 10% off your first order
      </h2>
      <p className="mt-2 text-sm text-[var(--color-primary-dark)]/80 sm:text-base">
        Subscribe to our newsletter. We respect your privacy.
      </p>
      <form onSubmit={handleSubmit} className="mx-auto mt-4 flex max-w-md flex-col gap-3 sm:mt-6 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="flex-1 rounded-md border border-[var(--color-primary-dark)]/20 px-4 py-2 text-[var(--color-primary-dark)]"
          required
        />
        <button
          type="submit"
          disabled={status === "loading" || !consent}
          className="rounded-md bg-[var(--color-accent-gold)] px-6 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      <label className="mt-3 flex items-center justify-center gap-2 text-sm text-[var(--color-primary-dark)]">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="rounded"
        />
        I agree to receive marketing emails (consent required).
      </label>
      {status === "success" && <p className="mt-2 text-[var(--color-success-sage)]">Thank you for subscribing.</p>}
      {status === "error" && <p className="mt-2 text-red-600">Something went wrong. Try again.</p>}
    </div>
  );
}
