import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--color-primary-dark)] sm:mb-8 sm:text-2xl">Dashboard</h1>
      <AdminDashboard />
    </div>
  );
}
