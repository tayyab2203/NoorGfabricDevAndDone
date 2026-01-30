import { AdminUsersList } from "@/components/admin/AdminUsersList";

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--color-primary-dark)] sm:mb-8 sm:text-2xl">Users</h1>
      <p className="mb-4 text-sm text-[var(--color-primary-dark)]/70">List and manage user accounts. Block or unblock; change role.</p>
      <AdminUsersList />
    </div>
  );
}
