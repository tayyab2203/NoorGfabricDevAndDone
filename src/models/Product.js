import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: String,
  altText: String,
  order: Number,
});

const variantSchema = new mongoose.Schema({
  size: String,
  color: String,
  stock: { type: Number, default: 0 },
  variantSKU: String,
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    price: { type: Number, required: true },
    salePrice: { type: Number, default: null },
    material: { type: String, default: "" },
    description: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    SKU: { type: String, required: true, unique: true },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    images: [imageSchema],
    variants: [variantSchema],
  },
  { timestamps: true }
);

productSchema.index({ categoryId: 1 });
productSchema.index({ status: 1 });

export default mongoose.models?.Product ||
  mongoose.model("Product", productSchema);
