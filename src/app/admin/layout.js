import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";

const adminRoles = ["ADMIN", "MANAGER"];

export default async function AdminLayout({ children }) {
  const session = await auth();
  if (!session?.user) redirect("/");
  if (!adminRoles.includes(session.user.role)) redirect("/");

  return (
    <AdminShell userEmail={session.user.email}>
      {children}
    </AdminShell>
  );
}
