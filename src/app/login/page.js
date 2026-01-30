import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

function LoginFallback() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-4 py-8 sm:py-12">
      <div className="h-8 w-48 animate-pulse rounded bg-[var(--color-bg-cream)]" />
      <div className="mt-6 h-4 w-full animate-pulse rounded bg-[var(--color-bg-cream)]" />
      <div className="mt-4 h-10 w-full animate-pulse rounded bg-[var(--color-bg-cream)]" />
      <div className="mt-4 h-10 w-full animate-pulse rounded bg-[var(--color-bg-cream)]" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
