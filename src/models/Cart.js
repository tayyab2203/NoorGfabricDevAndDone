import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  variantSKU: String,
  quantity: { type: Number, required: true, min: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    guestSessionId: { type: String, required: false },
    items: [cartItemSchema],
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Partial indexes: only one cart per userId / guestSessionId when the field is set; allow many docs with null/missing
cartSchema.index(
  { userId: 1 },
  { unique: true, partialFilterExpression: { userId: { $exists: true, $ne: null } } }
);
cartSchema.index(
  { guestSessionId: 1 },
  { unique: true, partialFilterExpression: { guestSessionId: { $exists: true, $ne: null, $type: "string" } } }
);
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models?.Cart || mongoose.model("Cart", cartSchema);
