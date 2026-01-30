"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const defaultImages = (product) =>
  (product?.images ?? []).map((img) => ({
    url: typeof img === "string" ? img : img?.url ?? "",
    altText: typeof img === "object" ? (img?.altText ?? "") : "",
    order: typeof img === "object" ? (img?.order ?? 0) : 0,
  }));

export function AdminProductForm({ product }) {
  const router = useRouter();
  const isEdit = !!product;
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [salePrice, setSalePrice] = useState(product?.salePrice ?? "");
  const [SKU, setSKU] = useState(product?.SKU || "");
  const [description, setDescription] = useState(product?.description || "");
  const [status, setStatus] = useState(product?.status || "ACTIVE");
  const [images, setImages] = useState(() => defaultImages(product));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  async function handleImageUpload(e) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploadError(null);
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("prefix", "products");
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        const url = data.data?.url ?? data.url;
        if (url) setImages((prev) => [...prev, { url, altText: "", order: prev.length }]);
      }
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function setImageAlt(index, altText) {
    setImages((prev) => prev.map((img, i) => (i === index ? { ...img, altText } : img)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const body = {
        name,
        slug,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        SKU,
        description,
        status,
        images: images.filter((img) => img.url).map((img, i) => ({ url: img.url, altText: img.altText || "", order: i })),
      };
      const apiUrl = isEdit ? `/api/admin/products/${product._id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-lg border border-[var(--color-bg-cream)] bg-white p-6">
      <div>
        <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Slug</label>
        <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Price</label>
          <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} required className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Sale Price</label>
          <input type="number" min={0} value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-primary-dark)]">SKU</label>
        <input type="text" value={SKU} onChange={(e) => setSKU(e.target.value)} required className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Images</label>
        <p className="mt-1 text-xs text-[var(--color-primary-dark)]/60">Upload from your device (JPEG, PNG, WebP, GIF, max 4 MB each)</p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleImageUpload}
          disabled={uploading}
          className="mt-2 block w-full max-w-xs text-sm text-[var(--color-primary-dark)] file:mr-2 file:rounded file:border-0 file:bg-[var(--color-accent-gold)] file:px-3 file:py-1.5 file:text-white file:hover:opacity-90"
        />
        {uploading && <span className="ml-2 text-sm text-[var(--color-primary-dark)]/70">Uploading…</span>}
        {uploadError && <p className="mt-1 text-sm text-red-600">{uploadError}</p>}
        <div className="mt-3 flex flex-wrap gap-4">
          {images.map((img, index) => (
            img.url ? (
              <div key={index} className="flex flex-col gap-1">
                <img src={img.url} alt="" className="h-24 w-24 rounded object-cover border border-[var(--color-bg-cream)]" />
                <input
                  type="text"
                  placeholder="Alt text"
                  value={img.altText}
                  onChange={(e) => setImageAlt(index, e.target.value)}
                  className="w-24 rounded border border-[var(--color-primary-dark)]/20 px-2 py-1 text-xs text-[var(--color-primary-dark)]"
                />
                <button type="button" onClick={() => removeImage(index)} className="text-xs text-red-600 hover:underline">Remove</button>
              </div>
            ) : null
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]">
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-4">
        <button type="submit" disabled={saving} className="rounded-md bg-[var(--color-accent-gold)] px-6 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50">
          {saving ? "Saving..." : isEdit ? "Update" : "Create"}
        </button>
        <Link href="/admin/products" className="rounded-md border border-[var(--color-primary-dark)]/20 px-6 py-2 font-medium text-[var(--color-primary-dark)] hover:bg-[var(--color-bg-cream)]">
          Cancel
        </Link>
      </div>
    </form>
  );
}
