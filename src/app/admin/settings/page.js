import { AdminSettingsForm } from "@/components/admin/AdminSettingsForm";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--color-primary-dark)] sm:mb-8 sm:text-2xl">Settings</h1>
      <p className="mb-4 text-sm text-[var(--color-primary-dark)]/70">Store, shipping, payment (COD), and basic config. RBAC is managed via user roles in Users.</p>
      <AdminSettingsForm />
    </div>
  );
}
