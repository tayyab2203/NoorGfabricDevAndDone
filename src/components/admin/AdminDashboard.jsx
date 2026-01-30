"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

async function fetchDashboard(range) {
  const res = await fetch(`/api/admin/dashboard?range=${range || "month"}`);
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data.data || data;
}

export function AdminDashboard() {
  const [range, setRange] = useState("month");
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard", range],
    queryFn: () => fetchDashboard(range),
  });

  if (isLoading) return <div className="text-[var(--color-primary-dark)]">Loading...</div>;
  if (error) return <div className="text-red-600">Unable to load dashboard.</div>;

  const kpis = [
    { label: "Revenue", value: `Rs. ${data?.revenue ?? 0}` },
    { label: "Orders", value: data?.ordersCount ?? 0 },
    { label: "AOV", value: `Rs. ${data?.aov ?? 0}` },
    { label: "New Customers", value: data?.newCustomers ?? 0 },
  ];
  const recentOrders = data?.recentOrders || [];
  const topSellers = data?.topSellers || [];
  const lowStock = data?.lowStock || [];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-wrap gap-2">
        {["today", "week", "month"].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            className={`rounded px-3 py-1 text-sm font-medium ${range === r ? "bg-[var(--color-accent-gold)] text-white" : "bg-white text-[var(--color-primary-dark)] border border-[var(--color-bg-cream)]"}`}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-lg border border-[var(--color-bg-cream)] bg-white p-3 sm:p-4">
            <p className="text-sm text-[var(--color-primary-dark)]/70">{k.label}</p>
            <p className="text-xl font-semibold text-[var(--color-primary-dark)]">{k.value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="rounded-lg border border-[var(--color-bg-cream)] bg-white p-4 sm:p-6">
          <h2 className="font-semibold text-[var(--color-primary-dark)]">Recent Orders</h2>
          <ul className="mt-4 space-y-2">
            {recentOrders.slice(0, 5).map((o) => (
              <li key={o._id} className="flex justify-between text-sm text-[var(--color-primary-dark)]">
                <span>{o.orderNumber}</span>
                <span>Rs. {o.totalAmount}</span>
                <Link href={`/admin/orders/${o._id}`} className="text-[var(--color-accent-gold)] hover:underline">
                  View
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-[var(--color-bg-cream)] bg-white p-4 sm:p-6">
          <h2 className="font-semibold text-[var(--color-primary-dark)]">Top Sellers</h2>
          <ul className="mt-4 space-y-2">
            {topSellers.slice(0, 5).map((t, i) => (
              <li key={i} className="text-sm text-[var(--color-primary-dark)]">
                {t.name} — {t.totalQty} sold, Rs. {t.totalRev}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rounded-lg border border-[var(--color-bg-cream)] bg-white p-4 sm:p-6">
        <h2 className="font-semibold text-[var(--color-primary-dark)]">Low Stock Alerts</h2>
        <ul className="mt-4 space-y-2">
          {lowStock.length === 0 ? (
            <li className="text-sm text-[var(--color-primary-dark)]/70">No low stock items.</li>
          ) : (
            lowStock.map((p) => (
              <li key={p._id} className="flex justify-between text-sm text-[var(--color-primary-dark)]">
                <span>{p.name}</span>
                <span>Stock: {p.variants?.map((v) => v.stock).join(", ")}</span>
                <Link href={`/admin/products/${p._id}/edit`} className="text-[var(--color-accent-gold)] hover:underline">
                  Edit
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
