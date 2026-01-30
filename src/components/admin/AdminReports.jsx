"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

async function fetchReport(range) {
  const res = await fetch(`/api/admin/reports?range=${range}`);
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data.data || data;
}

export function AdminReports() {
  const [range, setRange] = useState("month");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-reports", range],
    queryFn: () => fetchReport(range),
  });

  const downloadCsv = () => {
    window.open(`/api/admin/reports?range=${range}&format=csv`, "_blank");
  };

  if (isLoading) return <div className="text-[var(--color-primary-dark)]">Loading...</div>;
  if (error) return <div className="text-red-600">Unable to load report.</div>;

  const sales = data?.sales ?? {};
  const productPerformance = data?.productPerformance ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {["today", "week", "month"].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            className={`rounded px-3 py-1.5 text-sm font-medium ${range === r ? "bg-[var(--color-accent-gold)] text-white" : "border border-[var(--color-bg-cream)] bg-white text-[var(--color-primary-dark)]"}`}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
        <a
          href={`/api/admin/reports?range=${range}&format=csv`}
          download
          className="rounded-md bg-[var(--color-success-sage)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Export CSV
        </a>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[var(--color-bg-cream)] bg-white p-4">
          <p className="text-sm text-[var(--color-primary-dark)]/70">Total Revenue</p>
          <p className="text-xl font-semibold text-[var(--color-primary-dark)]">Rs. {sales.totalRevenue ?? 0}</p>
        </div>
        <div className="rounded-lg border border-[var(--color-bg-cream)] bg-white p-4">
          <p className="text-sm text-[var(--color-primary-dark)]/70">Total Orders</p>
          <p className="text-xl font-semibold text-[var(--color-primary-dark)]">{sales.totalOrders ?? 0}</p>
        </div>
        <div className="rounded-lg border border-[var(--color-bg-cream)] bg-white p-4">
          <p className="text-sm text-[var(--color-primary-dark)]/70">Avg Order Value</p>
          <p className="text-xl font-semibold text-[var(--color-primary-dark)]">Rs. {sales.avgOrderValue ?? 0}</p>
        </div>
        <div className="rounded-lg border border-[var(--color-bg-cream)] bg-white p-4">
          <p className="text-sm text-[var(--color-primary-dark)]/70">Shipping Collected</p>
          <p className="text-xl font-semibold text-[var(--color-primary-dark)]">Rs. {sales.totalShipping ?? 0}</p>
        </div>
      </div>
      <div className="rounded-lg border border-[var(--color-bg-cream)] bg-white p-4 sm:p-6">
        <h2 className="font-semibold text-[var(--color-primary-dark)]">Product Performance (Top 50)</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm text-[var(--color-primary-dark)]">
            <thead>
              <tr className="border-b border-[var(--color-bg-cream)]">
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-right">Qty Sold</th>
                <th className="p-2 text-right">Revenue (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {productPerformance.map((p, i) => (
                <tr key={i} className="border-b border-[var(--color-bg-cream)]">
                  <td className="p-2">{p.productName}</td>
                  <td className="p-2 text-right">{p.quantitySold}</td>
                  <td className="p-2 text-right">{p.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {productPerformance.length === 0 && <p className="mt-4 text-[var(--color-primary-dark)]/70">No orders in this period.</p>}
      </div>
    </div>
  );
}
