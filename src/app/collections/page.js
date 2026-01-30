import Link from "next/link";

async function getData() {
  try {
    const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/collections`, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    const collections = data.data ?? data ?? [];
    if (!res.ok) {
      return { collections: [], error: true, status: res.status };
    }
    return { collections: Array.isArray(collections) ? collections : [], error: false };
  } catch {
    return { collections: [], error: true };
  }
}

export default async function CollectionsPage() {
  const { collections, error } = await getData();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="mb-6 text-2xl font-bold text-[var(--color-primary-dark)] sm:mb-8 sm:text-3xl">Collections</h1>
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {error ? (
          <p className="rounded-lg bg-amber-50 p-4 text-amber-800">
            Collections could not be loaded right now. Please try again later. If the problem continues, the site may be temporarily unable to reach the database.
          </p>
        ) : collections.length === 0 ? (
          <p className="text-[var(--color-primary-dark)]/70">No collections yet.</p>
        ) : (
          collections.map((c) => (
            <Link
              key={c._id}
              href={`/collection/${c.slug}`}
              className="group overflow-hidden rounded-lg border border-[var(--color-bg-cream)] bg-white transition hover:border-[var(--color-accent-gold)]/30"
            >
              <div className="aspect-[4/3] bg-[var(--color-bg-cream)]">
                {c.image ? (
                  <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[var(--color-primary-dark)]/50">No image</div>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-[var(--color-primary-dark)] group-hover:text-[var(--color-accent-gold)]">
                  {c.name}
                </h2>
                <p className="mt-1 text-sm text-[var(--color-primary-dark)]/70">
                  {Array.isArray(c.products) ? c.products.length : 0} products
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
