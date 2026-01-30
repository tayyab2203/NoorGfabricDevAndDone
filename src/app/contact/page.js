"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", text: data.data?.message || "Message sent." });
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus({ type: "error", text: data.error || "Failed to send." });
      }
    } catch {
      setStatus({ type: "error", text: "Failed to send message." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="mb-4 text-2xl font-bold text-[var(--color-primary-dark)] sm:mb-6 sm:text-3xl">Contact</h1>
      <p className="mb-6 text-sm text-[var(--color-primary-dark)]/90 sm:text-base">
        Email: contact@noorgfabrics.example · Phone: +92 XXX XXXXXXX
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-[var(--color-bg-cream)] bg-white p-6">
        {status && (
          <p className={`rounded p-2 text-sm ${status.type === "success" ? "bg-[var(--color-success-sage)]/20 text-[var(--color-success-sage)]" : "bg-red-100 text-red-700"}`}>
            {status.text}
          </p>
        )}
        <div>
          <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Name</label>
          <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Subject</label>
          <input type="text" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Message</label>
          <textarea rows={4} required value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]" />
        </div>
        <button type="submit" disabled={loading} className="rounded-md bg-[var(--color-accent-gold)] px-6 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50">
          {loading ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
  );
}
