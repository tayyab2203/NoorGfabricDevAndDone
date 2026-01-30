import { notFound } from "next/navigation";
import connectDB from "@/lib/db/mongoose";
import Product from "@/models/Product";
import { AdminProductForm } from "@/components/admin/AdminProductForm";

export default async function EditProductPage({ params }) {
  const { id } = await params;
  if (!id) notFound();
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) notFound();
  product._id = product._id.toString();
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--color-primary-dark)] sm:mb-8 sm:text-2xl">Edit Product</h1>
      <AdminProductForm product={product} />
    </div>
  );
}
