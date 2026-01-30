import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import Collection from "@/models/Collection";
import { requireAdmin } from "@/lib/auth";
import { createCollectionSchema } from "@/lib/validators/collection";
import { del, delPattern } from "@/lib/db/redis";
import logger from "@/lib/logger";

async function GETHandler(request, context, session) {
  try {
    await connectDB();
    const items = await Collection.find({})
      .sort({ displayOrder: 1, name: 1 })
      .lean();
    return success(items);
  } catch (e) {
    logger.error("GET /api/admin/collections: " + e.message);
    return error("Failed to fetch collections", 500);
  }
}

async function POSTHandler(request, context, session) {
  try {
    const body = await request.json();
    const parsed = createCollectionSchema.safeParse(body);
    if (!parsed.success) return error(parsed.error.message || "Invalid input", 400);

    const data = { ...parsed.data };
    if (data.products?.length) {
      data.products = data.products.filter(Boolean);
    } else {
      data.products = [];
    }

    await connectDB();
    const collection = await Collection.create(data);
    await del("collections:list");
    await del("collections:" + (collection.slug || ""));
    return success(collection.toObject(), 201);
  } catch (e) {
    logger.error("POST /api/admin/collections: " + e.message);
    return error("Failed to create collection", 500);
  }
}

export const GET = requireAdmin(GETHandler);
export const POST = requireAdmin(POSTHandler);
