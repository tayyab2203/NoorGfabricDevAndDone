"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

async function fetchProducts() {
  const res = await fetch("/api/products?limit=200&status=ACTIVE");
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return (data.data ?? data)?.items ?? [];
}

export function AdminCollectionForm({ collection }) {
  const router = useRouter();
  const isEdit = !!collection;
  const [name, setName] = useState(collection?.name ?? "");
  const [slug, setSlug] = useState(collection?.slug ?? "");
  const [description, setDescription] = useState(collection?.description ?? "");
  const [image, setImage] = useState(collection?.image ?? "");
  const [displayOrder, setDisplayOrder] = useState(collection?.displayOrder ?? 0);
  const [status, setStatus] = useState(collection?.status ?? "ACTIVE");
  const [productIds, setProductIds] = useState(() => (collection?.products ?? []).map((p) => (typeof p === "string" ? p : p._id ?? p)));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products-for-collection"],
    queryFn: fetchProducts,
  });

  useEffect(() => {
    if (isEdit && collection?.products?.length) {
      setProductIds(collection.products.map((p) => (typeof p === "string" ? p : p._id ?? p)));
    }
  }, [isEdit, collection?.products]);

  function toggleProduct(id) {
    setProductIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prefix", "collections");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setImage(data.data?.url ?? data.url ?? "");
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const body = {
        name,
        slug: slug.trim(),
        description: description.trim(),
        image: image.trim() || undefined,
        displayOrder: Number(displayOrder) || 0,
        status,
        products: productIds,
      };
      const url = isEdit ? `/api/admin/collections/${collection._id}` : "/api/admin/collections";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save");
      }
      router.push("/admin/collections");
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-lg border border-[var(--color-bg-cream)] bg-white p-6">
      {error && <p className="rounded bg-red-100 p-2 text-sm text-red-700">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Slug (URL)</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          placeholder="e.g. winter-collection"
          className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Image</label>
        <p className="mt-1 text-xs text-[var(--color-primary-dark)]/60">Upload from your device (JPEG, PNG, WebP, GIF, max 4 MB)</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageUpload}
            disabled={uploading}
            className="block w-full max-w-xs text-sm text-[var(--color-primary-dark)] file:mr-2 file:rounded file:border-0 file:bg-[var(--color-accent-gold)] file:px-3 file:py-1.5 file:text-white file:hover:opacity-90"
          />
          {uploading && <span className="text-sm text-[var(--color-primary-dark)]/70">Uploading…</span>}
        </div>
        {uploadError && <p className="mt-1 text-sm text-red-600">{uploadError}</p>}
        {image && (
          <div className="mt-2 flex items-center gap-3">
            <img src={image} alt="" className="h-20 w-20 rounded object-cover border border-[var(--color-bg-cream)]" />
            <button type="button" onClick={() => setImage("")} className="text-sm text-red-600 hover:underline">Remove</button>
          </div>
        )}
        <p className="mt-1 text-xs text-[var(--color-primary-dark)]/50">Or paste URL:</p>
        <input
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://..."
          className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Display order</label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]"
          >
            <option value="ACTIVE">Active (visible on site)</option>
            <option value="HIDDEN">Hidden</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Products in this collection</label>
        <p className="mt-1 text-xs text-[var(--color-primary-dark)]/60">Select products to show on the collection page.</p>
        <div className="mt-2 max-h-48 overflow-y-auto rounded border border-[var(--color-primary-dark)]/20 p-2">
          {products.length === 0 ? (
            <p className="text-sm text-[var(--color-primary-dark)]/60">No products yet. Add products first.</p>
          ) : (
            products.map((p) => (
              <label key={p._id} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
                <input
                  type="checkbox"
                  checked={productIds.includes(p._id)}
                  onChange={() => toggleProduct(p._id)}
                  className="rounded"
                />
                <span className="text-[var(--color-primary-dark)]">{p.name}</span>
                <span className="text-[var(--color-primary-dark)]/60">(Rs. {p.salePrice ?? p.price})</span>
              </label>
            ))
          )}
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-[var(--color-accent-gold)] px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Update" : "Create"}
        </button>
        <Link
          href="/admin/collections"
          className="rounded-md border border-[var(--color-primary-dark)]/20 px-4 py-2 font-medium text-[var(--color-primary-dark)] hover:bg-[var(--color-bg-cream)]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
