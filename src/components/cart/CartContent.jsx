"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

async function fetchCart() {
  const res = await fetch("/api/cart");
  if (!res.ok) throw new Error("Failed to fetch cart");
  const data = await res.json();
  return data.data || data;
}

async function updateCartItem(itemIndex, quantity) {
  const res = await fetch(`/api/cart/${itemIndex}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("Failed to update");
  return res.json();
}

async function removeCartItem(itemIndex) {
  const res = await fetch(`/api/cart/${itemIndex}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to remove");
  return res.json();
}

export function CartContent() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const { data: cart, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: status !== "loading",
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemIndex, quantity }) => updateCartItem(itemIndex, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
  const removeMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  if (status === "loading" || isLoading) return <div className="text-[var(--color-primary-dark)]">Loading...</div>;
  if (error) return <div className="text-red-600">Unable to load cart.</div>;

  const items = cart?.items || [];
  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-[var(--color-bg-cream)] p-8 text-center">
        <p className="text-[var(--color-primary-dark)]">Your cart is empty.</p>
        <Link href="/collections" className="mt-4 inline-block rounded-md bg-[var(--color-accent-gold)] px-6 py-2 font-medium text-white hover:opacity-90">
          Continue Shopping
        </Link>
      </div>
    );
  }

  let subtotal = 0;
  items.forEach((i) => {
    const p = i.productId;
    const price = p?.salePrice ?? p?.price ?? 0;
    subtotal += price * (i.quantity || 1);
  });
  const shippingFee = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + shippingFee;

  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
      <div className="lg:col-span-2">
        <ul className="space-y-4">
          {items.map((item, index) => {
            const p = item.productId;
            const price = p?.salePrice ?? p?.price ?? 0;
            const lineTotal = price * (item.quantity || 1);
            return (
              <li key={index} className="flex flex-col gap-3 rounded-lg border border-[var(--color-bg-cream)] bg-white p-4 sm:flex-row sm:gap-4">
                <div className="flex gap-3 sm:flex-shrink-0">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-[var(--color-bg-cream)] sm:h-24 sm:w-24">
                    {p?.images?.[0]?.url ? (
                      <img src={p.images[0].url} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[var(--color-primary-dark)]/50 text-xs">No image</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 sm:flex-initial">
                    <Link href={`/products/${p?.slug}`} className="font-medium text-[var(--color-primary-dark)] hover:text-[var(--color-accent-gold)] line-clamp-2">
                      {p?.name}
                    </Link>
                    <p className="text-sm text-[var(--color-primary-dark)]/70">Rs. {price} × {item.quantity}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={item.quantity}
                        onChange={(e) => updateMutation.mutate({ itemIndex: index, quantity: parseInt(e.target.value, 10) || 1 })}
                        className="w-14 rounded border border-[var(--color-primary-dark)]/20 px-2 py-1 text-sm sm:w-16"
                      />
                      <button
                        type="button"
                        onClick={() => removeMutation.mutate(index)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
                <div className="font-semibold text-[var(--color-primary-dark)] sm:ml-auto">Rs. {lineTotal}</div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="rounded-lg border border-[var(--color-bg-cream)] bg-[var(--color-bg-cream)] p-4 sm:p-6">
        <h2 className="font-semibold text-[var(--color-primary-dark)]">Summary</h2>
        <p className="mt-2 text-[var(--color-primary-dark)]">Subtotal: Rs. {subtotal}</p>
        <p className="text-[var(--color-primary-dark)]">Shipping: Rs. {shippingFee}</p>
        <p className="mt-2 font-semibold text-[var(--color-primary-dark)]">Total: Rs. {total}</p>
        <Link
          href="/checkout"
          className="mt-6 block w-full rounded-md bg-[var(--color-accent-gold)] py-3 text-center font-medium text-white hover:opacity-90"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
