import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import Review from "@/models/Review";
import { requireAdmin } from "@/lib/auth";
import logger from "@/lib/logger";

async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(10, parseInt(searchParams.get("limit") || "20", 10)));
    const statusFilter = searchParams.get("status") || "";

    await connectDB();

    const query = {};
    if (statusFilter) query.status = statusFilter;

    const [items, total] = await Promise.all([
      Review.find(query)
        .populate("productId", "name slug")
        .populate("userId", "email fullName")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Review.countDocuments(query),
    ]);

    return success({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e) {
    logger.error("GET /api/admin/reviews: " + e.message);
    return error("Failed to fetch reviews", 500);
  }
}

export const GET = requireAdmin(handler);
