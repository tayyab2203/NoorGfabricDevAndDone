import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import Review from "@/models/Review";
import { requireAdmin } from "@/lib/auth";
import logger from "@/lib/logger";

async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return error("Invalid status. Use PENDING, APPROVED, or REJECTED", 400);
    }

    await connectDB();
    const review = await Review.findByIdAndUpdate(id, { status }, { new: true })
      .populate("productId", "name slug")
      .populate("userId", "email fullName")
      .lean();
    if (!review) return error("Review not found", 404);
    return success(review);
  } catch (e) {
    logger.error("PATCH /api/admin/reviews/[id]: " + e.message);
    return error("Failed to update review", 500);
  }
}

async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const review = await Review.findByIdAndDelete(id);
    if (!review) return error("Review not found", 404);
    return success({ deleted: true });
  } catch (e) {
    logger.error("DELETE /api/admin/reviews/[id]: " + e.message);
    return error("Failed to delete review", 500);
  }
}

export const PATCH = requireAdmin((req, ctx) => PATCH(req, ctx));
export const DELETE = requireAdmin((req, ctx) => DELETE(req, ctx));
