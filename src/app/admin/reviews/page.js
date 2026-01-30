import { AdminReviewsList } from "@/components/admin/AdminReviewsList";

export default function AdminReviewsPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--color-primary-dark)] sm:mb-8 sm:text-2xl">Reviews</h1>
      <p className="mb-4 text-sm text-[var(--color-primary-dark)]/70">Moderate product reviews. Approve, reject, or delete.</p>
      <AdminReviewsList />
    </div>
  );
}
