import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";
import logger from "@/lib/logger";

async function handler(request, context, session) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    await connectDB();
    const query = {};
    if (status) query.orderStatus = status;
    const [items, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(query),
    ]);
    return success({ items, total, page, limit });
  } catch (e) {
    logger.error("GET /api/admin/orders: " + e.message);
    return error("Failed to fetch orders", 500);
  }
}

export const GET = requireAdmin(handler);
