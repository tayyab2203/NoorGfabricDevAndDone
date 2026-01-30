"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminOrderDetail({ order }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.orderStatus);
  const [saving, setSaving] = useState(false);

  async function handleUpdateStatus() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: status }),
      });
      if (res.ok) router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const items = order.items || [];
  const addr = order.shippingAddress || {};

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[var(--color-bg-cream)] bg-white p-6">
        <h2 className="font-semibold text-[var(--color-primary-dark)]">Customer</h2>
        <p className="mt-2 text-[var(--color-primary-dark)]">
          {order.user ? `${order.user.fullName} (${order.user.email})` : "Guest"}
        </p>
        <p className="text-sm text-[var(--color-primary-dark)]/80">
          {addr.fullName}, {addr.phone}
        </p>
        <p className="text-sm text-[var(--color-primary-dark)]/80">
          {addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
        </p>
      </div>
      <div className="rounded-lg border border-[var(--color-bg-cream)] bg-white p-6">
        <h2 className="font-semibold text-[var(--color-primary-dark)]">Items</h2>
        <ul className="mt-4 space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex justify-between text-[var(--color-primary-dark)]">
              <span>{item.nameSnapshot} x {item.quantity}</span>
              <span>Rs. {(item.priceSnapshot || 0) * item.quantity}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-[var(--color-bg-cream)] pt-4">
          <p className="flex justify-between text-[var(--color-primary-dark)]">Subtotal: Rs. {order.subtotal}</p>
          <p className="flex justify-between text-[var(--color-primary-dark)]">Shipping: Rs. {order.shippingFee}</p>
          <p className="flex justify-between font-semibold text-[var(--color-primary-dark)]">Total: Rs. {order.totalAmount}</p>
        </div>
      </div>
      <div className="rounded-lg border border-[var(--color-bg-cream)] bg-white p-6">
        <h2 className="font-semibold text-[var(--color-primary-dark)]">Update Status</h2>
        <div className="mt-4 flex gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]"
          >
            <option value="PLACED">Placed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button
            type="button"
            onClick={handleUpdateStatus}
            disabled={saving}
            className="rounded-md bg-[var(--color-accent-gold)] px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
