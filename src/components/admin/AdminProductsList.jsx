"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

async function fetchProducts() {
  const res = await fetch("/api/products?limit=50");
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data.data || data;
}

export function AdminProductsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchProducts,
  });

  if (isLoading) return <div className="text-[var(--color-primary-dark)]">Loading...</div>;
  if (error) return <div className="text-red-600">Unable to load products.</div>;

  const items = data?.items || [];
  return (
    <div>
      <Link href="/admin/products/new" className="mb-4 inline-block rounded-md bg-[var(--color-accent-gold)] px-4 py-2 font-medium text-white hover:opacity-90">
        Add Product
      </Link>
      <div className="-mx-4 overflow-x-auto rounded-lg border border-[var(--color-bg-cream)] bg-white sm:mx-0">
        <table className="min-w-[600px] text-sm text-[var(--color-primary-dark)] sm:min-w-full">
          <thead>
            <tr className="border-b border-[var(--color-bg-cream)]">
              <th className="p-2 text-left sm:p-3">Image</th>
              <th className="p-2 text-left sm:p-3">Name</th>
              <th className="p-2 text-left sm:p-3">SKU</th>
              <th className="p-2 text-left sm:p-3">Price</th>
              <th className="p-2 text-left sm:p-3">Stock</th>
              <th className="p-2 text-left sm:p-3">Status</th>
              <th className="p-2 text-left sm:p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => {
              const totalStock = p.variants?.reduce((s, v) => s + (v.stock || 0), 0) ?? 0;
              return (
                <tr key={p._id} className="border-b border-[var(--color-bg-cream)]">
                  <td className="p-2 sm:p-3">
                    {p.images?.[0]?.url ? (
                      <img src={p.images[0].url} alt="" className="h-12 w-12 rounded object-cover" />
                    ) : (
                      <span className="text-[var(--color-primary-dark)]/50">—</span>
                    )}
                  </td>
                  <td className="p-2 font-medium sm:p-3">{p.name}</td>
                  <td className="p-2 sm:p-3">{p.SKU}</td>
                  <td className="p-2 sm:p-3">Rs. {p.salePrice ?? p.price}</td>
                  <td className="p-2 sm:p-3">{totalStock}</td>
                  <td className="p-2 sm:p-3">{p.status}</td>
                  <td className="p-2 sm:p-3">
                    <Link href={"/admin/products/" + p._id + "/edit"} className="text-[var(--color-accent-gold)] hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
