import connectDB from "@/lib/db/mongoose";
import { get, set, TTL } from "@/lib/db/redis";
import { success, error } from "@/lib/apiResponse";
import Collection from "@/models/Collection";
import logger from "@/lib/logger";

const CACHE_PREFIX = "collections:";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const cacheKey = CACHE_PREFIX + slug;
    const cached = await get(cacheKey);
    if (cached) return success(cached);

    await connectDB();
    const collection = await Collection.findOne({ slug, status: "ACTIVE" })
      .populate("products", "name slug price salePrice images variants status")
      .lean();
    if (!collection) return error("Collection not found", 404);
    await set(cacheKey, collection, TTL.COLLECTION);
    return success(collection);
  } catch (e) {
    logger.error("GET /api/collections/[slug]: " + e.message);
    return error("Failed to fetch collection", 500);
  }
}
