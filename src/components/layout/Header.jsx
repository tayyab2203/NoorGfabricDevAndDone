"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Logo from "./Logo";
import { useQuery } from "@tanstack/react-query";

async function fetchCartCount() {
  const res = await fetch("/api/cart");
  if (res.status === 401) return 0;
  if (!res.ok) return 0;
  const data = await res.json();
  const payload = data?.data ?? data;
  const items = Array.isArray(payload?.items) ? payload.items : [];
  return items.reduce((sum, i) => sum + (i.quantity || 0), 0);
}

const winterSubCollections = [
  { label: "Winter Unstitched", slug: "winter-unstitched" },
  { label: "Winter Stoles", slug: "winter-stoles" },
  { label: "Winter Pret", slug: "winter-pret" },
  { label: "Winter Shawls", slug: "winter-shawls" },
];

const collectionMenuItems = [
  { label: "Dynasty", slug: "dynasty" },
  { label: "Pasha", slug: "pasha" },
  { label: "Gul Ahmad", slug: "gul-ahmad" },
  { label: "Alkaram", slug: "alkaram" },
  { label: "JNG", slug: "jng" },
  { label: "Sapphire", slug: "sapphire" },
  { label: "Khaddi", slug: "khaddi" },
  { label: "Shabir", slug: "shabir" },
  { label: "Asco", slug: "asco" },
  { label: "Grace", slug: "grace" },
  { label: "Shefer", slug: "shefer" },
  { label: "ADMANI", slug: "admani" },
  { label: "J.", slug: "j" },
  { label: "Narkin", slug: "narkin" },
  { label: "Lawn", slug: "lawn" },
  { label: "Winter", slug: "winter-collection", sub: winterSubCollections },
  { label: "Shawl", slug: "shawl-collection" },
  { label: "Cotton", slug: "cotton-collection" },
];

const navLinksBeforeCollections = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];
const navLinksAfterCollections = [
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

function CollectionLink({ label, slug, onClick }) {
  return (
    <Link
      href={`/collection/${slug}`}
      onClick={onClick}
                className="block rounded px-3 py-2 text-sm text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)]/5"
    >
      {label}
    </Link>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [winterOpen, setWinterOpen] = useState(false);
  const [desktopCollectionsOpen, setDesktopCollectionsOpen] = useState(false);
  const [desktopWinterOpen, setDesktopWinterOpen] = useState(false);
  const { data: session, status } = useSession();
  const { data: cartCount } = useQuery({
    queryKey: ["cart", "count"],
    queryFn: fetchCartCount,
  });
  const count = typeof cartCount === "number" ? cartCount : 0;

  const closeMobile = () => {
    setMobileOpen(false);
    setCollectionsOpen(false);
    setWinterOpen(false);
  };

  return (
    <header className="border-b border-[var(--color-bg-cream)] bg-white">
      <div className="mx-auto flex h-16 min-h-[4rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-4 md:flex md:gap-6">
          {navLinksBeforeCollections.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--color-primary-dark)] hover:text-[var(--color-accent-gold)]"
            >
              {link.label}
            </Link>
          ))}
          {/* Desktop Collections dropdown - after About */}
          <div
            className="relative"
            onMouseEnter={() => setDesktopCollectionsOpen(true)}
            onMouseLeave={() => {
              setDesktopCollectionsOpen(false);
              setDesktopWinterOpen(false);
            }}
          >
            <button
              type="button"
              className="flex items-center gap-0.5 text-sm font-medium text-[var(--color-primary-dark)] hover:text-[var(--color-accent-gold)]"
              aria-expanded={desktopCollectionsOpen}
              aria-haspopup="true"
            >
              Collections
              <svg className="ml-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {desktopCollectionsOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 min-w-[380px] max-w-[420px] max-h-[80vh] overflow-y-auto overflow-x-hidden rounded-xl border border-[var(--color-primary-dark)]/8 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
                <div className="px-4 pt-4 pb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-dark)]/50">
                    Shop by collection
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-0 pb-2">
                  {collectionMenuItems.map((item) => (
                    <div key={item.slug} className="relative col-span-2 sm:col-span-1">
                      {item.sub ? (
                        <div
                          className="group relative"
                          onMouseEnter={() => setDesktopWinterOpen(true)}
                          onMouseLeave={() => setDesktopWinterOpen(false)}
                        >
                          <div className="flex items-center gap-2 px-4 py-2.5 text-[15px] text-[var(--color-primary-dark)] transition-colors hover:bg-[var(--color-accent-gold)]/10">
                            <Link href={`/collection/${item.slug}`} className="flex-1 min-w-0 font-medium">
                              {item.label}
                            </Link>
                            <svg className="h-4 w-4 shrink-0 text-[var(--color-primary-dark)]/50 group-hover:text-[var(--color-accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                          {desktopWinterOpen && (
                            <div className="absolute left-0 top-full z-50 mt-0.5 w-full min-w-[200px] rounded-lg border border-[var(--color-primary-dark)]/8 bg-white py-2 shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
                              <p className="border-b border-[var(--color-primary-dark)]/8 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-dark)]/50">
                                Winter Collection
                              </p>
                              {item.sub.map((sub) => (
                                <Link
                                  key={sub.slug}
                                  href={`/collection/${sub.slug}`}
                                  className="block px-4 py-2.5 text-sm text-[var(--color-primary-dark)] transition-colors hover:bg-[var(--color-accent-gold)]/10 hover:text-[var(--color-primary-dark)]"
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={`/collection/${item.slug}`}
                          className="block px-4 py-2.5 text-[15px] text-[var(--color-primary-dark)] transition-colors hover:bg-[var(--color-accent-gold)]/10"
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                <div className="border-t border-[var(--color-primary-dark)]/10 bg-[var(--color-bg-cream)]/50 px-4 py-3 rounded-b-xl">
                  <Link
                    href="/collections"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary-dark)] transition-colors hover:text-[var(--color-accent-gold)]"
                  >
                    View all collections
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
          {navLinksAfterCollections.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--color-primary-dark)] hover:text-[var(--color-accent-gold)]"
            >
              {link.label}
            </Link>
          ))}
          {session && (
            <Link
              href="/account"
              className="text-sm font-medium text-[var(--color-primary-dark)] hover:text-[var(--color-accent-gold)]"
            >
              Account
            </Link>
          )}
          <Link
            href="/cart"
            className="flex items-center gap-1 rounded-md bg-[var(--color-accent-gold)] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Cart ({count})
          </Link>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/cart"
            className="flex items-center gap-1 rounded-md bg-[var(--color-accent-gold)] px-2.5 py-1.5 text-xs font-medium text-white hover:opacity-90 sm:text-sm sm:px-3 sm:py-2"
          >
            Cart ({count})
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded p-2 text-[var(--color-primary-dark)] hover:bg-[var(--color-bg-cream)]"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-[var(--color-bg-cream)] bg-white md:hidden">
          <nav className="mx-auto max-w-7xl flex flex-col gap-0 px-4 py-4 sm:px-6">
            <Link
              href="/"
              onClick={closeMobile}
              className="rounded px-3 py-2.5 text-sm font-medium text-[var(--color-primary-dark)] hover:bg-[var(--color-bg-cream)] hover:text-[var(--color-accent-gold)]"
            >
              Home
            </Link>
            {/* Mobile Collections expandable */}
            <div>
              <button
                type="button"
                onClick={() => setCollectionsOpen((o) => !o)}
                className="flex w-full items-center justify-between rounded px-3 py-2.5 text-left text-sm font-medium text-[var(--color-primary-dark)] hover:bg-[var(--color-bg-cream)] hover:text-[var(--color-accent-gold)]"
                aria-expanded={collectionsOpen}
              >
                Collections
                <svg
                  className={`h-4 w-4 shrink-0 transition-transform ${collectionsOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {collectionsOpen && (
                <div className="border-l-2 border-[var(--color-bg-cream)] pl-3">
                  {collectionMenuItems.map((item) => (
                    <div key={item.slug}>
                      {item.sub ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setWinterOpen((o) => !o)}
                            className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)]/5"
                            aria-expanded={winterOpen}
                          >
                            {item.label}
                            <svg
                              className={`h-4 w-4 shrink-0 transition-transform ${winterOpen ? "rotate-180" : ""}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {winterOpen && (
                            <div className="border-l-2 border-[var(--color-bg-cream)] pl-3">
                              {item.sub.map((sub) => (
                                <CollectionLink
                                  key={sub.slug}
                                  label={sub.label}
                                  slug={sub.slug}
                                  onClick={closeMobile}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <CollectionLink label={item.label} slug={item.slug} onClick={closeMobile} />
                      )}
                    </div>
                  ))}
                  <Link
                    href="/collections"
                    onClick={closeMobile}
                    className="mt-2 block rounded px-3 py-2 text-sm font-medium text-[var(--color-primary-dark)]/70 hover:text-[var(--color-primary-dark)]"
                  >
                    View all collections →
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="/about"
              onClick={closeMobile}
              className="rounded px-3 py-2.5 text-sm font-medium text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)]/5"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={closeMobile}
              className="rounded px-3 py-2.5 text-sm font-medium text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)]/5"
            >
              Contact
            </Link>
            <Link
              href="/admin"
              onClick={closeMobile}
              className="rounded px-3 py-2.5 text-sm font-medium text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)]/5"
            >
              Admin
            </Link>
            {session && (
              <Link
                href="/account"
                onClick={closeMobile}
                className="rounded px-3 py-2.5 text-sm font-medium text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)]/5"
              >
                Account
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
