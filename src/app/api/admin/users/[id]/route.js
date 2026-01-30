import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";
import logger from "@/lib/logger";

async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const user = await User.findById(id).select("-password").lean();
    if (!user) return error("User not found", 404);
    return success(user);
  } catch (e) {
    logger.error("GET /api/admin/users/[id]: " + e.message);
    return error("Failed to fetch user", 500);
  }
}

async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, role } = body;

    await connectDB();
    const user = await User.findById(id);
    if (!user) return error("User not found", 404);

    if (status !== undefined) {
      if (!["ACTIVE", "BLOCKED"].includes(status)) return error("Invalid status", 400);
      user.status = status;
    }
    if (role !== undefined) {
      if (!["USER", "ADMIN", "MANAGER"].includes(role)) return error("Invalid role", 400);
      user.role = role;
    }

    await user.save();
    const out = user.toObject();
    delete out.password;
    return success(out);
  } catch (e) {
    logger.error("PATCH /api/admin/users/[id]: " + e.message);
    return error("Failed to update user", 500);
  }
}

const getHandler = (req, ctx) => GET(req, ctx);
const patchHandler = (req, ctx) => PATCH(req, ctx);

export const GET = requireAdmin(getHandler);
export const PATCH = requireAdmin(patchHandler);
