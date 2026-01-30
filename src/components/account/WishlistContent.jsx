"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function fetchWishlist() {
  const res = await fetch("/api/wishlist");
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data.data || data;
}

async function removeFromWishlist(productId) {
  const res = await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to remove");
  return res.json();
}

export function WishlistContent() {
  const queryClient = useQueryClient();
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
  });

  const removeMutation = useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  if (isLoading) return <div className="text-[var(--color-primary-dark)]">Loading...</div>;
  if (error) return <div className="text-red-600">Unable to load wishlist.</div>;
  if (!products?.length) return <p className="text-[var(--color-primary-dark)]/70">Your wishlist is empty.</p>;

  return (
    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <div
          key={p._id}
          className="overflow-hidden rounded-lg border border-[var(--color-bg-cream)] bg-white transition hover:border-[var(--color-accent-gold)]/30"
        >
          <Link href={`/products/${p.slug}`}>
            <div className="aspect-[3/4] bg-[var(--color-bg-cream)]">
              {p.images?.[0]?.url ? (
                <img src={p.images[0].url} alt={p.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-[var(--color-primary-dark)]/50">No image</div>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-medium text-[var(--color-primary-dark)] hover:text-[var(--color-accent-gold)]">{p.name}</h3>
              <p className="font-semibold text-[var(--color-primary-dark)]">Rs. {p.salePrice ?? p.price}</p>
            </div>
          </Link>
          <div className="flex gap-2 p-3">
            <Link
              href={`/products/${p.slug}`}
              className="flex-1 rounded-md bg-[var(--color-accent-gold)] py-2 text-center text-sm font-medium text-white hover:opacity-90"
            >
              Add to Cart
            </Link>
            <button
              type="button"
              onClick={() => removeMutation.mutate(p._id)}
              disabled={removeMutation.isPending}
              className="rounded-md border border-[var(--color-primary-dark)]/20 px-3 py-2 text-sm text-[var(--color-primary-dark)] hover:bg-[var(--color-bg-cream)] disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
