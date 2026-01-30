import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold text-[var(--color-primary-dark)]">My Account</h1>
      <div className="rounded-lg border border-[var(--color-bg-cream)] bg-white p-6">
        <h2 className="font-semibold text-[var(--color-primary-dark)]">Profile</h2>
        <p className="mt-2 text-[var(--color-primary-dark)]">Name: {session.user.name || "—"}</p>
        <p className="text-[var(--color-primary-dark)]">Email: {session.user.email}</p>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
        <Link
          href="/account/orders"
          className="rounded-md bg-[var(--color-accent-gold)] px-6 py-2 font-medium text-white hover:opacity-90"
        >
          Order History
        </Link>
        <Link
          href="/account/wishlist"
          className="rounded-md border-2 border-[var(--color-accent-gold)] px-6 py-2 font-medium text-[var(--color-primary-dark)] hover:bg-[var(--color-accent-gold)]/10"
        >
          Wishlist
        </Link>
        <Link
          href="/api/auth/signout"
          className="rounded-md border border-[var(--color-primary-dark)]/20 px-6 py-2 font-medium text-[var(--color-primary-dark)] hover:bg-[var(--color-bg-cream)]"
        >
          Logout
        </Link>
      </div>
    </div>
  );
}
