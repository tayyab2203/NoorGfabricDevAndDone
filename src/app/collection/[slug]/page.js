import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionProducts } from "@/components/collection/CollectionProducts";

async function getCollection(slug) {
  try {
    const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/collections/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || data;
  } catch {
    return null;
  }
}

export default async function CollectionDetailPage({ params }) {
  const { slug: rawSlug } = await params;
  const slug = typeof rawSlug === "string" ? rawSlug : rawSlug?.[0];
  if (!slug) notFound();
  const collection = await getCollection(slug);

  if (!collection) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <nav className="mb-6 text-sm text-[var(--color-primary-dark)]/70">
          <Link href="/" className="hover:text-[var(--color-accent-gold)]">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/collections" className="hover:text-[var(--color-accent-gold)]">Collections</Link>
        </nav>
        <div className="rounded-lg border border-[var(--color-bg-cream)] bg-[var(--color-bg-cream)] p-8 text-center sm:p-12">
          <h1 className="text-xl font-semibold text-[var(--color-primary-dark)] sm:text-2xl">Collection not found</h1>
          <p className="mt-2 text-sm text-[var(--color-primary-dark)]/70">
            This collection may not exist yet. Browse all collections to find what you need.
          </p>
          <Link
            href="/collections"
            className="mt-6 inline-block rounded-md bg-[var(--color-primary-dark)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            View all collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <nav className="mb-4 text-xs text-[var(--color-primary-dark)]/70 sm:mb-6 sm:text-sm">
        <Link href="/" className="hover:text-[var(--color-accent-gold)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/collections" className="hover:text-[var(--color-accent-gold)]">Collections</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-primary-dark)]">{collection.name}</span>
      </nav>
      <h1 className="mb-2 text-2xl font-bold text-[var(--color-primary-dark)] sm:text-3xl">{collection.name}</h1>
      {collection.description && (
        <p className="mb-6 text-sm text-[var(--color-primary-dark)]/80 sm:mb-8 sm:text-base">{collection.description}</p>
      )}
      <CollectionProducts slug={slug} />
    </div>
  );
}
