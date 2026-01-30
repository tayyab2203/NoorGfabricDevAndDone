import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["ACTIVE", "HIDDEN"], default: "ACTIVE" },
  },
  { timestamps: true }
);

export default mongoose.models?.Collection ||
  mongoose.model("Collection", collectionSchema);
