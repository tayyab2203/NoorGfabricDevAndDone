import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { get, set, del, TTL } from "@/lib/db/redis";
import { success, error } from "@/lib/apiResponse";
import "@/models/Category";
import Product from "@/models/Product";
import logger from "@/lib/logger";

const CACHE_PREFIX = "products:list:";

export async function GET(request) {
  try {
    if (!process.env.MONGODB_URI) {
      return error("Database not configured", 503);
    }
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status") || "ACTIVE";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
    const skip = (page - 1) * limit;

    const cacheKey = `${CACHE_PREFIX}${category || ""}:${status}:${minPrice || ""}:${maxPrice || ""}:${page}:${limit}`;
    const cached = await get(cacheKey);
    if (cached) return success(cached);

    await connectDB();
    const query = {};
    if (status) query.status = status;
    if (category) query.categoryId = category;
    if (minPrice != null || maxPrice != null) {
      query.price = {};
      if (minPrice != null) query.price.$gte = Number(minPrice);
      if (maxPrice != null) query.price.$lte = Number(maxPrice);
    }
    const [items, total] = await Promise.all([
      Product.find(query).populate("categoryId", "name slug").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);
    const data = { items, total, page, limit };
    await set(cacheKey, data, TTL.PRODUCT);
    return success(data);
  } catch (e) {
    logger.error("GET /api/products: " + e.message);
    return error("Service temporarily unavailable", 503);
  }
}
