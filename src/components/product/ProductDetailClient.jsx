"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function addToCart(productId, variantSKU, quantity) {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, variantSKU, quantity }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to add to cart");
  }
  return res.json();
}

export function ProductDetailClient({ product }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();

  const variant = product.variants?.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  ) || product.variants?.[0];
  const inStock = (variant?.stock ?? 0) > 0;

  const mutation = useMutation({
    mutationFn: () => addToCart(product._id, variant?.variantSKU, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const sizes = [...new Set(product.variants?.map((v) => v.size) || [])];
  const colors = [...new Set(product.variants?.map((v) => v.color) || [])];

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      <div className="aspect-square max-h-[70vh] overflow-hidden rounded-lg bg-[var(--color-bg-cream)] sm:max-h-none">
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].altText || product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-primary-dark)]/50">No image</div>
        )}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-primary-dark)] sm:text-3xl">{product.name}</h1>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xl font-semibold text-[var(--color-primary-dark)]">Rs. {product.salePrice ?? product.price}</span>
          {product.salePrice && (
            <span className="text-sm text-[var(--color-primary-dark)]/60 line-through">Rs. {product.price}</span>
          )}
        </div>
        <p className="mt-2 text-sm text-[var(--color-primary-dark)]/70">SKU: {product.SKU}</p>
        <p className="mt-2 text-sm text-[var(--color-success-sage)]">{inStock ? "In stock" : "Out of stock"}</p>
        {product.material && <p className="mt-2 text-sm text-[var(--color-primary-dark)]/80">Material: {product.material}</p>}
        {product.description && <p className="mt-4 text-[var(--color-primary-dark)]/80">{product.description}</p>}

        {sizes.length > 0 && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Size</label>
            <div className="mt-2 flex gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`rounded border px-3 py-2 text-sm ${selectedSize === s ? "border-[var(--color-accent-gold)] bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]" : "border-[var(--color-primary-dark)]/20 text-[var(--color-primary-dark)]"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {colors.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Color</label>
            <div className="mt-2 flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`rounded border px-3 py-2 text-sm ${selectedColor === c ? "border-[var(--color-accent-gold)] bg-[var(--color-accent-gold)]/10" : "border-[var(--color-primary-dark)]/20"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-4">
          <label className="text-sm font-medium text-[var(--color-primary-dark)]">Quantity</label>
          <input
            type="number"
            min={1}
            max={variant?.stock ?? 1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            className="w-20 rounded border border-[var(--color-primary-dark)]/20 px-2 py-1 text-[var(--color-primary-dark)]"
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
          <button
            type="button"
            disabled={!inStock || mutation.isPending}
            onClick={() => mutation.mutate()}
            className="rounded-md bg-[var(--color-accent-gold)] px-6 py-3 font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {mutation.isPending ? "Adding..." : "Add to Cart"}
          </button>
          <Link
            href="/cart"
            className="rounded-md border-2 border-[var(--color-accent-gold)] px-6 py-3 font-medium text-[var(--color-primary-dark)] hover:bg-[var(--color-accent-gold)]/10"
          >
            Buy Now
          </Link>
        </div>
        {mutation.isError && <p className="mt-2 text-sm text-red-600">{mutation.error.message}</p>}
      </div>
    </div>
  );
}
