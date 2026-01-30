"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function fetchSettings() {
  const res = await fetch("/api/admin/settings");
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data.data || data;
}

async function saveSettings(body) {
  const res = await fetch("/api/admin/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error ?? "Failed to save");
  }
  return res.json();
}

export function AdminSettingsForm() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-settings"], queryFn: fetchSettings });
  const [form, setForm] = useState({
    storeName: "",
    storeEmail: "",
    shippingFee: 250,
    freeShippingThreshold: 5000,
    codEnabled: true,
    currency: "PKR",
  });

  useEffect(() => {
    if (data) setForm((f) => ({ ...f, ...data }));
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: saveSettings,
    onSuccess: (res) => {
      const payload = res?.data ?? res;
      if (payload) queryClient.setQueryData(["admin-settings"], payload);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  if (isLoading) return <div className="text-[var(--color-primary-dark)]">Loading...</div>;
  if (error) return <div className="text-red-600">Unable to load settings.</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-lg border border-[var(--color-bg-cream)] bg-white p-6">
      {saveMutation.isError && <p className="rounded bg-red-100 p-2 text-sm text-red-700">{saveMutation.error.message}</p>}
      {saveMutation.isSuccess && <p className="rounded bg-[var(--color-success-sage)]/20 p-2 text-sm text-[var(--color-success-sage)]">Settings saved.</p>}
      <div>
        <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Store name</label>
        <input type="text" value={form.storeName} onChange={(e) => setForm((f) => ({ ...f, storeName: e.target.value }))} className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Store email</label>
        <input type="email" value={form.storeEmail} onChange={(e) => setForm((f) => ({ ...f, storeEmail: e.target.value }))} className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Shipping fee (Rs)</label>
          <input type="number" min={0} value={form.shippingFee} onChange={(e) => setForm((f) => ({ ...f, shippingFee: Number(e.target.value) }))} className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Free shipping above (Rs)</label>
          <input type="number" min={0} value={form.freeShippingThreshold} onChange={(e) => setForm((f) => ({ ...f, freeShippingThreshold: Number(e.target.value) }))} className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]" />
        </div>
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-primary-dark)]">
          <input type="checkbox" checked={form.codEnabled} onChange={(e) => setForm((f) => ({ ...f, codEnabled: e.target.checked }))} className="rounded" />
          Cash on Delivery (COD) enabled
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-primary-dark)]">Currency</label>
        <input type="text" value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))} className="mt-1 w-full rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]" />
      </div>
      <button type="submit" disabled={saveMutation.isPending} className="rounded-md bg-[var(--color-accent-gold)] px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50">
        {saveMutation.isPending ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}
