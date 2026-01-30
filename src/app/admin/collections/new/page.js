import { AdminCollectionForm } from "@/components/admin/AdminCollectionForm";

export default function NewCollectionPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--color-primary-dark)] sm:mb-8 sm:text-2xl">Add Collection</h1>
      <AdminCollectionForm />
    </div>
  );
}
