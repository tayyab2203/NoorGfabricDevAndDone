import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[var(--color-bg-cream)] px-4">
      <p className="text-6xl font-semibold text-[var(--color-primary-dark)]">404</p>
      <p className="mt-2 text-lg text-[var(--color-primary-dark)]/80">This page could not be found.</p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-[var(--color-primary-dark)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}
