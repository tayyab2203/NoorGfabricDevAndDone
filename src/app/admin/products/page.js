import { AdminProductsList } from "@/components/admin/AdminProductsList";

export default function AdminProductsPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--color-primary-dark)] sm:mb-8 sm:text-2xl">Products</h1>
      <AdminProductsList />
    </div>
  );
}
