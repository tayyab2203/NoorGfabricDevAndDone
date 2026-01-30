import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  variantSKU: String,
  nameSnapshot: String,
  priceSnapshot: Number,
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    items: [orderItemSchema],
    shippingAddress: { type: mongoose.Schema.Types.Mixed, required: true },
    paymentMethod: { type: String, enum: ["COD"], default: "COD" },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
    orderStatus: {
      type: String,
      enum: ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.models?.Order || mongoose.model("Order", orderSchema);
