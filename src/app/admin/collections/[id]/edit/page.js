import { notFound } from "next/navigation";
import connectDB from "@/lib/db/mongoose";
import Collection from "@/models/Collection";
import { AdminCollectionForm } from "@/components/admin/AdminCollectionForm";

export default async function EditCollectionPage({ params }) {
  const { id } = await params;
  if (!id) notFound();
  await connectDB();
  const collection = await Collection.findById(id).lean();
  if (!collection) notFound();
  collection._id = collection._id.toString();
  if (collection.products?.length) {
    collection.products = collection.products.map((p) => (p && p._id ? p._id.toString() : p));
  }
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--color-primary-dark)] sm:mb-8 sm:text-2xl">Edit Collection</h1>
      <AdminCollectionForm collection={collection} />
    </div>
  );
}
