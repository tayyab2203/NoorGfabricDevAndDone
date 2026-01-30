"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

async function fetchBestsellers() {
  const res = await fetch("/api/products/bestsellers");
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data.data || data;
}

export function Bestsellers() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["bestsellers"],
    queryFn: fetchBestsellers,
  });

  if (isLoading) return <div className="text-[var(--color-primary-dark)]">Loading...</div>;
  if (error) return <div className="text-red-600">Unable to load bestsellers.</div>;
  if (!products?.length) return <div className="text-[var(--color-primary-dark)]">No bestsellers yet.</div>;

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
            <h3 className="font-medium text-[var(--color-heading-gold)] group-hover:text-[var(--color-primary-dark)]">
              {p.name}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-semibold text-[var(--color-primary-dark)]">
                Rs. {p.salePrice ?? p.price}
              </span>
              {p.salePrice && (
                <span className="text-sm text-[var(--color-primary-dark)]/60 line-through">Rs. {p.price}</span>
              )}
            </div>
            <span className="mt-2 inline-block text-sm text-[var(--color-accent-gold)]">View</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
