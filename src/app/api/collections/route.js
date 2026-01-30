import connectDB from "@/lib/db/mongoose";
import { get, set, TTL } from "@/lib/db/redis";
import { success, error } from "@/lib/apiResponse";
import Collection from "@/models/Collection";
import logger from "@/lib/logger";

const CACHE_KEY = "collections:list";

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return error("Database not configured", 503);
    }
    const cached = await get(CACHE_KEY);
    if (cached) return success(cached);

    await connectDB();
    const items = await Collection.find({ status: "ACTIVE" })
      .sort({ displayOrder: 1, name: 1 })
      .lean();
    await set(CACHE_KEY, items, TTL.COLLECTION);
    return success(items);
  } catch (e) {
    logger.error("GET /api/collections: " + e.message);
    return error("Failed to fetch collections", 500);
  }
}
