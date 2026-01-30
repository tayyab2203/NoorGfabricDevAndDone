import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

async function getProduct(slug) {
  try {
    const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/products/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || data;
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug: rawSlug } = await params;
  const slug = typeof rawSlug === "string" ? rawSlug : rawSlug?.[0];
  if (!slug) notFound();
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <nav className="mb-4 text-xs text-[var(--color-primary-dark)]/70 sm:mb-6 sm:text-sm">
        <Link href="/" className="hover:text-[var(--color-accent-gold)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/collections" className="hover:text-[var(--color-accent-gold)]">Collections</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-primary-dark)]">{product.name}</span>
      </nav>
      <ProductDetailClient product={product} />
    </div>
  );
}
