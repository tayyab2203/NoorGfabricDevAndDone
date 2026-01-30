"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

async function fetchOrders() {
  const res = await fetch("/api/admin/orders");
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data.data || data;
}

export function AdminOrdersList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchOrders,
  });

  if (isLoading) return <div className="text-[var(--color-primary-dark)]">Loading...</div>;
  if (error) return <div className="text-red-600">Unable to load orders.</div>;

  const items = data?.items || [];
  return (
    <div className="-mx-4 overflow-x-auto rounded-lg border border-[var(--color-bg-cream)] bg-white sm:mx-0">
      <table className="min-w-[500px] text-sm text-[var(--color-primary-dark)] sm:min-w-full">
        <thead>
          <tr className="border-b border-[var(--color-bg-cream)]">
            <th className="p-2 text-left sm:p-3">Order #</th>
            <th className="p-2 text-left sm:p-3">Total</th>
            <th className="p-2 text-left sm:p-3">Status</th>
            <th className="p-2 text-left sm:p-3">Date</th>
            <th className="p-2 text-left sm:p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((o) => (
            <tr key={o._id} className="border-b border-[var(--color-bg-cream)]">
              <td className="p-2 font-medium sm:p-3">{o.orderNumber}</td>
              <td className="p-2 sm:p-3">Rs. {o.totalAmount}</td>
              <td className="p-2 sm:p-3">{o.orderStatus}</td>
              <td className="p-2 sm:p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
              <td className="p-2 sm:p-3">
                <Link href={"/admin/orders/" + o._id} className="text-[var(--color-accent-gold)] hover:underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
