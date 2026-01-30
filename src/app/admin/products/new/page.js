import { AdminProductForm } from "@/components/admin/AdminProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--color-primary-dark)] sm:mb-8 sm:text-2xl">Add Product</h1>
      <AdminProductForm />
    </div>
  );
}
