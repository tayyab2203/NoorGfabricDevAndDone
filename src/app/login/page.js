"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(errorParam || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    if (res?.ok) router.push(callbackUrl);
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-4 py-8 sm:py-12">
      <h1 className="mb-2 text-xl font-bold text-[var(--color-primary-dark)] sm:text-2xl">
        Admin login
      </h1>
      <p className="mb-6 text-sm text-[var(--color-primary-dark)]/70">
        Sign in with your admin account.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-[var(--color-primary-dark)]"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded border border-[var(--color-bg-cream)] bg-white px-3 py-2 text-[var(--color-primary-dark)] focus:border-[var(--color-accent-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-gold)]"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-[var(--color-primary-dark)]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded border border-[var(--color-bg-cream)] bg-white px-3 py-2 text-[var(--color-primary-dark)] focus:border-[var(--color-accent-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-gold)]"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-[var(--color-accent-gold)] px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--color-primary-dark)]/70">
        <Link href="/" className="text-[var(--color-accent-gold)] hover:underline">
          ← Back to store
        </Link>
      </p>
    </div>
  );
}
