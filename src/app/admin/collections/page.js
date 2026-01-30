import { AdminCollectionsList } from "@/components/admin/AdminCollectionsList";

export default function AdminCollectionsPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--color-primary-dark)] sm:mb-8 sm:text-2xl">Collections</h1>
      <p className="mb-4 text-sm text-[var(--color-primary-dark)]/70">Collections appear on the home page and at /collection/[slug]. Add products to each collection to show them on the collection page.</p>
      <AdminCollectionsList />
    </div>
  );
}
