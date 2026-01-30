import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    fullName: { type: String, default: "" },
    phone: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "MANAGER"],
      default: "USER",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "BLOCKED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export default mongoose.models?.User || mongoose.model("User", userSchema);
