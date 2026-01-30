import Link from "next/link";

async function getData() {
  try {
    const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/products?limit=100&status=ACTIVE`, { cache: "no-store" });
    if (!res.ok) return { items: [], total: 0 };
    const data = await res.json();
    const payload = data.data || data;
    return { items: payload.items || [], total: payload.total ?? 0 };
  } catch {
    return { items: [], total: 0 };
  }
}

export default async function ProductsPage() {
  const { items, total } = await getData();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="mb-6 text-2xl font-bold text-[var(--color-primary-dark)] sm:mb-8 sm:text-3xl">All Products</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.length === 0 ? (
          <p className="text-[var(--color-primary-dark)]/70 sm:col-span-2 lg:col-span-4">No products yet.</p>
        ) : (
          items.map((p) => (
            <Link
              key={p._id}
              href={`/products/${p.slug}`}
              className="group overflow-hidden rounded-lg border border-[var(--color-bg-cream)] bg-white transition hover:border-[var(--color-accent-gold)]/30"
            >
              <div className="aspect-[3/4] bg-[var(--color-bg-cream)]">
                {p.images?.[0]?.url ? (
                  <img src={p.images[0].url} alt={p.images[0].altText || p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[var(--color-primary-dark)]/50">No image</div>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-[var(--color-primary-dark)] group-hover:text-[var(--color-accent-gold)]">{p.name}</h2>
                <p className="mt-1 text-sm text-[var(--color-primary-dark)]/70">
                  Rs. {p.salePrice ?? p.price}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
