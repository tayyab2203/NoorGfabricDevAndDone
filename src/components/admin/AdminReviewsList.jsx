"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function fetchReviews(page, limit, status) {
  const p = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) p.set("status", status);
  const res = await fetch(`/api/admin/reviews?${p}`);
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data.data || data;
}

async function updateReviewStatus(id, status) {
  const res = await fetch(`/api/admin/reviews/${id}`, {
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

async function deleteReview(id) {
  const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error ?? "Failed to delete");
  }
}

export function AdminReviewsList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const limit = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-reviews", page, limit, status],
    queryFn: () => fetchReviews(page, limit, status),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => updateReviewStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });

  if (isLoading) return <div className="text-[var(--color-primary-dark)]">Loading...</div>;
  if (error) return <div className="text-red-600">Unable to load reviews.</div>;

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-sm text-[var(--color-primary-dark)]"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
      <div className="-mx-4 overflow-x-auto rounded-lg border border-[var(--color-bg-cream)] bg-white sm:mx-0">
        <table className="min-w-[600px] w-full text-sm text-[var(--color-primary-dark)]">
          <thead>
            <tr className="border-b border-[var(--color-bg-cream)]">
              <th className="p-2 text-left sm:p-3">Product</th>
              <th className="p-2 text-left sm:p-3">User</th>
              <th className="p-2 text-left sm:p-3">Rating</th>
              <th className="p-2 text-left sm:p-3">Comment</th>
              <th className="p-2 text-left sm:p-3">Status</th>
              <th className="p-2 text-left sm:p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r._id} className="border-b border-[var(--color-bg-cream)]">
                <td className="p-2 sm:p-3">
                  {r.productId ? <Link href={`/products/${r.productId?.slug}`} className="text-[var(--color-accent-gold)] hover:underline">{r.productId?.name}</Link> : "—"}
                </td>
                <td className="p-2 sm:p-3">{r.userId?.email ?? "—"}</td>
                <td className="p-2 sm:p-3">{r.rating}/5</td>
                <td className="max-w-[200px] truncate p-2 sm:p-3" title={r.comment}>{r.comment || "—"}</td>
                <td className="p-2 sm:p-3">
                  <span className={r.status === "APPROVED" ? "text-[var(--color-success-sage)]" : r.status === "REJECTED" ? "text-red-600" : "text-amber-600"}>{r.status}</span>
                </td>
                <td className="p-2 sm:p-3">
                  {r.status === "PENDING" && (
                    <>
                      <button type="button" onClick={() => updateMutation.mutate({ id: r._id, status: "APPROVED" })} disabled={updateMutation.isPending} className="text-[var(--color-success-sage)] hover:underline mr-2">Approve</button>
                      <button type="button" onClick={() => updateMutation.mutate({ id: r._id, status: "REJECTED" })} disabled={updateMutation.isPending} className="text-red-600 hover:underline mr-2">Reject</button>
                    </>
                  )}
                  <button type="button" onClick={() => { if (confirm("Delete this review?")) deleteMutation.mutate(r._id); }} disabled={deleteMutation.isPending} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && <p className="mt-4 text-[var(--color-primary-dark)]/70">No reviews yet.</p>}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 text-sm text-[var(--color-primary-dark)]">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded border border-[var(--color-primary-dark)]/20 px-3 py-1 disabled:opacity-50">Previous</button>
          <span>Page {page} of {totalPages} ({total} reviews)</span>
          <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="rounded border border-[var(--color-primary-dark)]/20 px-3 py-1 disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
