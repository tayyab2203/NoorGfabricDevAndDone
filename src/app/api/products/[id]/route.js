import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongoose";
import { get, set, TTL } from "@/lib/db/redis";
import { success, error } from "@/lib/apiResponse";
import "@/models/Category";
import Product from "@/models/Product";
import logger from "@/lib/logger";

const CACHE_PREFIX = "products:";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const cacheKey = CACHE_PREFIX + id;
    const cached = await get(cacheKey);
    if (cached) return success(cached);

    await connectDB();
    let product;
    if (mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id) {
      product = await Product.findById(id).populate("categoryId", "name slug").lean();
    } else {
      product = await Product.findOne({ slug: id }).populate("categoryId", "name slug").lean();
    }
    if (!product) return error("Product not found", 404);
    await set(cacheKey, product, TTL.PRODUCT);
    return success(product);
  } catch (e) {
    logger.error("GET /api/products/[id]: " + e.message);
    return error("Failed to fetch product", 500);
  }
}
