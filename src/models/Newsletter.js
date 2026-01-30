import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    consent: { type: Boolean, default: true },
  },
  { timestamps: true }
);

newsletterSchema.index({ email: 1 }, { unique: true });

export default mongoose.models?.Newsletter || mongoose.model("Newsletter", newsletterSchema);
