"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

async function searchProducts(q, page = 1) {
  const params = new URLSearchParams({ page, limit: 20 });
  if (q) params.set("q", q);
  const res = await fetch(`/api/products/search?${params}`);
  if (!res.ok) throw new Error("Search failed");
  const data = await res.json();
  return data.data || data;
}

export function SearchResults({ query }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchProducts(query),
  });

  if (isLoading) return <div className="text-[var(--color-primary-dark)]">Loading...</div>;
  if (error) return <div className="text-red-600">Search failed.</div>;

  const items = data?.items || [];
  const total = data?.total ?? 0;

  return (
    <>
      <p className="mb-6 text-[var(--color-primary-dark)]/70">{total} result(s)</p>
      {items.length === 0 ? (
        <p className="text-[var(--color-primary-dark)]/70">No products found.</p>
      ) : (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
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
              <div className="p-3">
                <h3 className="font-medium text-[var(--color-primary-dark)] group-hover:text-[var(--color-accent-gold)]">
                  {p.name}
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-semibold text-[var(--color-primary-dark)]">Rs. {p.salePrice ?? p.price}</span>
                  {p.salePrice && <span className="text-sm text-[var(--color-primary-dark)]/60 line-through">Rs. {p.price}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
