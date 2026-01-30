"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

async function fetchCollection(slug) {
  const res = await fetch(`/api/collections/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data.data || data;
}

export function CollectionProducts({ slug }) {
  const { data: collection, isLoading, error } = useQuery({
    queryKey: ["collection", slug],
    queryFn: () => fetchCollection(slug),
  });

  if (isLoading) return <div className="text-[var(--color-primary-dark)]">Loading...</div>;
  if (error) return <div className="text-red-600">Unable to load collection.</div>;

  const products = collection?.products || [];
  if (!products.length) return <p className="text-[var(--color-primary-dark)]/70">No products in this collection.</p>;

  return (
    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
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
  );
}
