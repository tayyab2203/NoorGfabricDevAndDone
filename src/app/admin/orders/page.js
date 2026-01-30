import { AdminOrdersList } from "@/components/admin/AdminOrdersList";

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--color-primary-dark)] sm:mb-8 sm:text-2xl">Orders</h1>
      <AdminOrdersList />
    </div>
  );
}
