"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function fetchCollections() {
  const res = await fetch("/api/admin/collections");
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data.data ?? data;
}

async function deleteCollection(id) {
  const res = await fetch(`/api/admin/collections/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error ?? "Failed to delete");
  }
}

export function AdminCollectionsList() {
  const queryClient = useQueryClient();
  const { data: collections, isLoading, error } = useQuery({
    queryKey: ["admin-collections"],
    queryFn: fetchCollections,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteCollection,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-collections"] }),
  });

  if (isLoading) return <div className="text-[var(--color-primary-dark)]">Loading...</div>;
  if (error) return <div className="text-red-600">Unable to load collections.</div>;

  const items = Array.isArray(collections) ? collections : [];

  return (
    <div>
      <Link href="/admin/collections/new" className="mb-4 inline-block rounded-md bg-[var(--color-accent-gold)] px-4 py-2 font-medium text-white hover:opacity-90">
        Add Collection
      </Link>
      <div className="-mx-4 overflow-x-auto rounded-lg border border-[var(--color-bg-cream)] bg-white sm:mx-0">
        <table className="min-w-[500px] text-sm text-[var(--color-primary-dark)] sm:min-w-full">
          <thead>
            <tr className="border-b border-[var(--color-bg-cream)]">
              <th className="p-2 text-left sm:p-3">Image</th>
              <th className="p-2 text-left sm:p-3">Name</th>
              <th className="p-2 text-left sm:p-3">Slug</th>
              <th className="p-2 text-left sm:p-3">Order</th>
              <th className="p-2 text-left sm:p-3">Status</th>
              <th className="p-2 text-left sm:p-3">Products</th>
              <th className="p-2 text-left sm:p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c._id} className="border-b border-[var(--color-bg-cream)]">
                <td className="p-2 sm:p-3">
                  {c.image ? <img src={c.image} alt="" className="h-12 w-16 rounded object-cover" /> : <span className="text-[var(--color-primary-dark)]/50">—</span>}
                </td>
                <td className="p-2 font-medium sm:p-3">{c.name}</td>
                <td className="p-2 sm:p-3">{c.slug}</td>
                <td className="p-2 sm:p-3">{c.displayOrder ?? 0}</td>
                <td className="p-2 sm:p-3">{c.status ?? "ACTIVE"}</td>
                <td className="p-2 sm:p-3">{Array.isArray(c.products) ? c.products.length : 0}</td>
                <td className="p-2 sm:p-3">
                  <Link href={"/admin/collections/" + c._id + "/edit"} className="text-[var(--color-accent-gold)] hover:underline">Edit</Link>
                  {" · "}
                  <button type="button" onClick={() => { if (confirm("Delete this collection?")) deleteMutation.mutate(c._id); }} className="text-red-600 hover:underline disabled:opacity-50" disabled={deleteMutation.isPending}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && <p className="mt-4 text-[var(--color-primary-dark)]/70">No collections yet. Add one to show on the home page.</p>}
    </div>
  );
}
