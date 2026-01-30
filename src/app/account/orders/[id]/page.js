import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/db/mongoose";
import Order from "@/models/Order";

async function getOrder(id, userId) {
  await connectDB();
  const order = await Order.findById(id).lean();
  if (!order) return null;
  if (order.userId && order.userId.toString() !== userId) return null;
  return order;
}

export default async function OrderDetailPage({ params }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id: rawId } = await params;
  const id = typeof rawId === "string" ? rawId : rawId?.[0];
  if (!id) notFound();
  const order = await getOrder(id, session.user.id);
  if (!order) notFound();

  const items = order.items || [];
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <Link href="/account/orders" className="mb-4 inline-block text-sm text-[var(--color-accent-gold)] hover:underline sm:mb-6">
        Back to orders
      </Link>
      <h1 className="mb-4 text-xl font-bold text-[var(--color-primary-dark)] sm:mb-6 sm:text-2xl">Order {order.orderNumber}</h1>
      <p className="text-sm text-[var(--color-success-sage)] sm:text-base">Status: {order.orderStatus}</p>
      <div className="mt-4 rounded-lg border border-[var(--color-bg-cream)] bg-white p-4 sm:mt-6 sm:p-6">
        <h2 className="font-semibold text-[var(--color-primary-dark)]">Shipping</h2>
        <p className="mt-2 text-[var(--color-primary-dark)]">
          {order.shippingAddress?.fullName}, {order.shippingAddress?.phone}
        </p>
        <p className="text-sm text-[var(--color-primary-dark)]/80">
          {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
          {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
        </p>
      </div>
      <div className="mt-4 rounded-lg border border-[var(--color-bg-cream)] bg-white p-4 sm:mt-6 sm:p-6">
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
    </div>
  );
}
