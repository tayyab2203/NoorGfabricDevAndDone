import { AdminReports } from "@/components/admin/AdminReports";

export default function AdminReportsPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--color-primary-dark)] sm:mb-8 sm:text-2xl">Reports</h1>
      <p className="mb-4 text-sm text-[var(--color-primary-dark)]/70">Sales and product performance. Export to CSV.</p>
      <AdminReports />
    </div>
  );
}
