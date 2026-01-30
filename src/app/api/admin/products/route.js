import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";
import { createProductSchema } from "@/lib/validators/product";
import { delPattern } from "@/lib/db/redis";
import logger from "@/lib/logger";

async function handler(request, context, session) {
  try {
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) return error(parsed.error.message || "Invalid input", 400);

    await connectDB();
    const product = await Product.create(parsed.data);
    await delPattern("products:list:*");
    return success(product.toObject(), 201);
  } catch (e) {
    logger.error("POST /api/admin/products: " + e.message);
    return error("Failed to create product", 500);
  }
}

export const POST = requireAdmin(handler);
