import mongoose from "mongoose";
import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";
import { updateOrderStatusSchema } from "@/lib/validators/order";
import logger from "@/lib/logger";

async function getHandler(request, context, session) {
  try {
    const params = await context.params;
    const id = params?.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return error("Invalid order id", 400);

    await connectDB();
    const order = await Order.findById(id).lean();
    if (!order) return error("Order not found", 404);
    return success(order);
  } catch (e) {
    logger.error("GET /api/admin/orders/[id]: " + e.message);
    return error("Failed to fetch order", 500);
  }
}

async function putHandler(request, context, session) {
  try {
    const params = await context.params;
    const id = params?.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return error("Invalid order id", 400);

    const body = await request.json();
    const parsed = updateOrderStatusSchema.safeParse(body);
    if (!parsed.success) return error(parsed.error.message || "Invalid input", 400);

    await connectDB();
    const order = await Order.findByIdAndUpdate(
      id,
      { $set: { orderStatus: parsed.data.orderStatus } },
      { new: true }
    ).lean();
    if (!order) return error("Order not found", 404);
    return success(order);
  } catch (e) {
    logger.error("PUT /api/admin/orders/[id]: " + e.message);
    return error("Failed to update order", 500);
  }
}

export const GET = requireAdmin(getHandler);
export const PUT = requireAdmin(putHandler);
