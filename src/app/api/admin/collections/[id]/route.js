import mongoose from "mongoose";
import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import Collection from "@/models/Collection";
import { requireAdmin } from "@/lib/auth";
import { updateCollectionSchema } from "@/lib/validators/collection";
import { del } from "@/lib/db/redis";
import logger from "@/lib/logger";

async function GETHandler(request, context, session) {
  try {
    const params = await context.params;
    const id = params?.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return error("Invalid collection id", 400);

    await connectDB();
    const collection = await Collection.findById(id).lean();
    if (!collection) return error("Collection not found", 404);
    return success(collection);
  } catch (e) {
    logger.error("GET /api/admin/collections/[id]: " + e.message);
    return error("Failed to fetch collection", 500);
  }
}

async function PUTHandler(request, context, session) {
  try {
    const params = await context.params;
    const id = params?.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return error("Invalid collection id", 400);

    const body = await request.json();
    const parsed = updateCollectionSchema.safeParse(body);
    if (!parsed.success) return error(parsed.error.message || "Invalid input", 400);

    await connectDB();
    const existing = await Collection.findById(id);
    if (!existing) return error("Collection not found", 404);

    const data = { ...parsed.data };
    if (Array.isArray(data.products)) {
      data.products = data.products.filter(Boolean);
    }

    const collection = await Collection.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    await del("collections:list");
    await del("collections:" + (existing.slug || ""));
    if (collection.slug !== existing.slug) await del("collections:" + (collection.slug || ""));
    return success(collection);
  } catch (e) {
    logger.error("PUT /api/admin/collections/[id]: " + e.message);
    return error("Failed to update collection", 500);
  }
}

async function DELETEHandler(request, context, session) {
  try {
    const params = await context.params;
    const id = params?.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return error("Invalid collection id", 400);

    await connectDB();
    const collection = await Collection.findByIdAndDelete(id);
    if (!collection) return error("Collection not found", 404);
    await del("collections:list");
    await del("collections:" + (collection.slug || ""));
    return success({ deleted: true });
  } catch (e) {
    logger.error("DELETE /api/admin/collections/[id]: " + e.message);
    return error("Failed to delete collection", 500);
  }
}

export const GET = requireAdmin(GETHandler);
export const PUT = requireAdmin(PUTHandler);
export const DELETE = requireAdmin(DELETEHandler);
