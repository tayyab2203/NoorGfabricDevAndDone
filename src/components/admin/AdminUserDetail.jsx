"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function updateUser(id, body) {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error ?? "Failed to update");
  }
  return res.json();
}

export function AdminUserDetail({ user }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: (body) => updateUser(user._id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      router.refresh();
    },
  });

  const toggleStatus = () => {
    updateMutation.mutate({ status: user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE" });
  };

  const setRole = (role) => {
    updateMutation.mutate({ role });
  };

  return (
    <div className="max-w-2xl space-y-4 rounded-lg border border-[var(--color-bg-cream)] bg-white p-6">
      <div className="grid gap-2 text-sm">
        <p><span className="text-[var(--color-primary-dark)]/70">Email:</span> <span className="font-medium text-[var(--color-primary-dark)]">{user.email}</span></p>
        <p><span className="text-[var(--color-primary-dark)]/70">Name:</span> {user.fullName || "—"}</p>
        <p><span className="text-[var(--color-primary-dark)]/70">Phone:</span> {user.phone || "—"}</p>
        <p><span className="text-[var(--color-primary-dark)]/70">Role:</span> {user.role}</p>
        <p><span className="text-[var(--color-primary-dark)]/70">Status:</span> <span className={user.status === "ACTIVE" ? "text-[var(--color-success-sage)]" : "text-red-600"}>{user.status}</span></p>
        <p><span className="text-[var(--color-primary-dark)]/70">Created:</span> {user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}</p>
      </div>
      <div className="flex flex-wrap gap-3 border-t border-[var(--color-bg-cream)] pt-4">
        <button
          type="button"
          onClick={toggleStatus}
          disabled={updateMutation.isPending}
          className={`rounded-md px-4 py-2 text-sm font-medium text-white ${user.status === "ACTIVE" ? "bg-red-600 hover:bg-red-700" : "bg-[var(--color-success-sage)] hover:opacity-90"} disabled:opacity-50`}
        >
          {user.status === "ACTIVE" ? "Block user" : "Unblock user"}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--color-primary-dark)]/70">Role:</span>
          {["USER", "MANAGER", "ADMIN"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              disabled={updateMutation.isPending || user.role === r}
              className={`rounded border px-3 py-1 text-sm ${user.role === r ? "border-[var(--color-accent-gold)] bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]" : "border-[var(--color-primary-dark)]/20 text-[var(--color-primary-dark)] hover:bg-[var(--color-bg-cream)]"} disabled:opacity-50`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      {updateMutation.isError && <p className="text-sm text-red-600">{updateMutation.error.message}</p>}
    </div>
  );
}
