import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import "@/models/Category";
import Product from "@/models/Product";
import logger from "@/lib/logger";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
    const skip = (page - 1) * limit;

    await connectDB();
    const query = { status: "ACTIVE" };
    if (q.trim()) {
      query.$or = [
        { name: new RegExp(q.trim(), "i") },
        { description: new RegExp(q.trim(), "i") },
        { SKU: new RegExp(q.trim(), "i") },
      ];
    }
    const [items, total] = await Promise.all([
      Product.find(query).populate("categoryId", "name slug").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);
    return success({ items, total, page, limit });
  } catch (e) {
    logger.error("GET /api/products/search: " + e.message);
    return error("Search failed", 500);
  }
}
