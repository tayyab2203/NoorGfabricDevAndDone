"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

async function fetchOrders() {
  const res = await fetch("/api/orders");
  if (!res.ok) throw new Error("Failed to fetch orders");
  const data = await res.json();
  return data.data || data;
}

export function OrderHistory() {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  if (isLoading) return <div className="text-[var(--color-primary-dark)]">Loading...</div>;
  if (error) return <div className="text-red-600">Unable to load orders.</div>;
  if (!orders?.length) return <p className="text-[var(--color-primary-dark)]/70">No orders yet.</p>;

  return (
    <ul className="space-y-4">
      {orders.map((order) => (
        <li
          key={order._id}
          className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[var(--color-bg-cream)] bg-white p-4"
        >
          <div>
            <p className="font-medium text-[var(--color-primary-dark)]">{order.orderNumber}</p>
            <p className="text-sm text-[var(--color-primary-dark)]/70">
              {new Date(order.createdAt).toLocaleDateString()} - Rs. {order.totalAmount}
            </p>
            <p className="text-sm text-[var(--color-success-sage)]">{order.orderStatus}</p>
          </div>
          <Link
            href={"/account/orders/" + order._id}
            className="rounded-md bg-[var(--color-accent-gold)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            View
          </Link>
        </li>
      ))}
    </ul>
  );
}
