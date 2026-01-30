"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function fetchUsers(page, limit, role, status, search) {
  const p = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (role) p.set("role", role);
  if (status) p.set("status", status);
  if (search) p.set("search", search);
  const res = await fetch(`/api/admin/users?${p}`);
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data.data || data;
}

async function updateUserStatus(id, status) {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error ?? "Failed to update");
  }
  return res.json();
}

export function AdminUsersList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const limit = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users", page, limit, role, status, search],
    queryFn: () => fetchUsers(page, limit, role, status, search),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => updateUserStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  if (isLoading) return <div className="text-[var(--color-primary-dark)]">Loading...</div>;
  if (error) return <div className="text-red-600">Unable to load users.</div>;

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search email or name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-sm text-[var(--color-primary-dark)] w-48"
        />
        <select
          value={role}
          onChange={(e) => { setRole(e.target.value); setPage(1); }}
          className="rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-sm text-[var(--color-primary-dark)]"
        >
          <option value="">All roles</option>
          <option value="USER">User</option>
          <option value="MANAGER">Manager</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-sm text-[var(--color-primary-dark)]"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>
      <div className="-mx-4 overflow-x-auto rounded-lg border border-[var(--color-bg-cream)] bg-white sm:mx-0">
        <table className="min-w-[500px] w-full text-sm text-[var(--color-primary-dark)]">
          <thead>
            <tr className="border-b border-[var(--color-bg-cream)]">
              <th className="p-2 text-left sm:p-3">Email</th>
              <th className="p-2 text-left sm:p-3">Name</th>
              <th className="p-2 text-left sm:p-3">Role</th>
              <th className="p-2 text-left sm:p-3">Status</th>
              <th className="p-2 text-left sm:p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u._id} className="border-b border-[var(--color-bg-cream)]">
                <td className="p-2 sm:p-3">{u.email}</td>
                <td className="p-2 sm:p-3">{u.fullName || "—"}</td>
                <td className="p-2 sm:p-3">{u.role}</td>
                <td className="p-2 sm:p-3">
                  <span className={u.status === "ACTIVE" ? "text-[var(--color-success-sage)]" : "text-red-600"}>{u.status}</span>
                </td>
                <td className="p-2 sm:p-3">
                  <Link href={`/admin/users/${u._id}`} className="text-[var(--color-accent-gold)] hover:underline mr-2">View</Link>
                  {u.status === "ACTIVE" ? (
                    <button type="button" onClick={() => updateMutation.mutate({ id: u._id, status: "BLOCKED" })} disabled={updateMutation.isPending} className="text-red-600 hover:underline disabled:opacity-50">Block</button>
                  ) : (
                    <button type="button" onClick={() => updateMutation.mutate({ id: u._id, status: "ACTIVE" })} disabled={updateMutation.isPending} className="text-[var(--color-success-sage)] hover:underline disabled:opacity-50">Unblock</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center gap-2 text-sm text-[var(--color-primary-dark)]">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded border border-[var(--color-primary-dark)]/20 px-3 py-1 disabled:opacity-50">Previous</button>
          <span>Page {page} of {totalPages} ({total} users)</span>
          <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="rounded border border-[var(--color-primary-dark)]/20 px-3 py-1 disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
