import mongoose from "mongoose";
import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import Product from "@/models/Product";
import { del, delPattern } from "@/lib/db/redis";
import { requireAdmin } from "@/lib/auth";
import { updateProductSchema } from "@/lib/validators/product";
import logger from "@/lib/logger";

async function handler(request, context, session) {
  try {
    const params = await context.params;
    const id = params?.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return error("Invalid product id", 400);

    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) return error(parsed.error.message || "Invalid input", 400);

    await connectDB();
    const product = await Product.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
    if (!product) return error("Product not found", 404);

    await del("products:" + id);
    await del("products:" + (product.slug || ""));
    await delPattern("products:list:*");
    return success(product);
  } catch (e) {
    logger.error("PUT /api/admin/products/[id]: " + e.message);
    return error("Failed to update product", 500);
  }
}

export const PUT = requireAdmin(handler);
