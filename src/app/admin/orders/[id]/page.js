import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/db/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import { AdminOrderDetail } from "@/components/admin/AdminOrderDetail";

async function getOrder(id) {
  await connectDB();
  const order = await Order.findById(id).lean();
  if (!order) return null;
  if (order.userId) {
    const user = await User.findById(order.userId).select("email fullName").lean();
    order.user = user;
  }
  return order;
}

export default async function AdminOrderDetailPage({ params }) {
  const session = await auth();
  if (!session?.user) redirect("/");
  if (!["ADMIN", "MANAGER"].includes(session.user.role)) redirect("/");

  const { id } = await params;
  if (!id) notFound();
  const order = await getOrder(id);
  if (!order) notFound();

  const orderJson = JSON.parse(JSON.stringify(order));

  return (
    <div>
      <Link href="/admin/orders" className="mb-4 inline-block text-sm text-[var(--color-accent-gold)] hover:underline sm:mb-6">
        Back to orders
      </Link>
      <h1 className="mb-6 text-xl font-bold text-[var(--color-primary-dark)] sm:mb-8 sm:text-2xl">Order {order.orderNumber}</h1>
      <AdminOrderDetail order={orderJson} />
    </div>
  );
}
