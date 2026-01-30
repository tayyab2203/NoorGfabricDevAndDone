"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({ children, userEmail }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-md border border-[var(--color-bg-cream)] bg-white p-2 text-[var(--color-primary-dark)] shadow lg:hidden"
        aria-label="Open menu"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          aria-hidden
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-[var(--color-bg-cream)] bg-white p-4 transition-transform duration-200 ease-out lg:static lg:z-auto lg:translate-x-0 lg:flex-shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/admin" className="font-semibold text-[var(--color-primary-dark)]" onClick={() => setSidebarOpen(false)}>
            Noor G Fabrics Admin
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded p-1 text-[var(--color-primary-dark)] hover:bg-[var(--color-bg-cream)] lg:hidden"
            aria-label="Close menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className="block rounded px-3 py-2 text-sm font-medium text-[var(--color-primary-dark)] hover:bg-[var(--color-bg-cream)] hover:text-[var(--color-accent-gold)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 border-t border-[var(--color-bg-cream)] pt-4">
          <p className="truncate text-sm text-[var(--color-primary-dark)]/70">{userEmail}</p>
          <Link
            href="/api/auth/signout"
            className="mt-2 block text-sm text-[var(--color-accent-gold)] hover:underline"
            onClick={() => setSidebarOpen(false)}
          >
            Logout
          </Link>
        </div>
      </aside>
      <main className="min-w-0 flex-1 overflow-auto bg-[var(--color-bg-cream)] p-4 pt-14 lg:pt-8 lg:p-8">
        {children}
      </main>
    </div>
  );
}
