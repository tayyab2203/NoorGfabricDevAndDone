import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";
import logger from "@/lib/logger";

async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(10, parseInt(searchParams.get("limit") || "20", 10)));
    const role = searchParams.get("role") || "";
    const statusFilter = searchParams.get("status") || "";
    const search = (searchParams.get("search") || "").trim();

    await connectDB();

    const query = {};
    if (role) query.role = role;
    if (statusFilter) query.status = statusFilter;
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      User.find(query).select("-password").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      User.countDocuments(query),
    ]);

    return success({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e) {
    logger.error("GET /api/admin/users: " + e.message);
    return error("Failed to fetch users", 500);
  }
}

export const GET = requireAdmin(handler);
