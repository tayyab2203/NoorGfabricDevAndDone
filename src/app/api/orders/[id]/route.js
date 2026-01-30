import mongoose from "mongoose";
import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import Order from "@/models/Order";
import { auth } from "@/lib/auth";
import logger from "@/lib/logger";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return error("Unauthorized", 401);

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return error("Invalid order id", 400);

    await connectDB();
    const order = await Order.findById(id).lean();
    if (!order) return error("Order not found", 404);
    if (order.userId && order.userId.toString() !== session.user.id)
      return error("Forbidden", 403);

    return success(order);
  } catch (e) {
    logger.error("GET /api/orders/[id]: " + e.message);
    return error("Failed to fetch order", 500);
  }
}
