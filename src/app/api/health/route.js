import { success } from "@/lib/apiResponse";
import connectDB from "@/lib/db/mongoose";
import { getRedisClient } from "@/lib/db/redis";

export async function GET() {
  const status = { ok: true, mongodb: "unknown", redis: "optional" };

  if (!process.env.MONGODB_URI) {
    status.mongodb = "missing_config";
    status.redis = getRedisClient() ? "connected" : "skipped";
    return success(status);
  }

  try {
    await connectDB();
    status.mongodb = "connected";
  } catch (e) {
    status.mongodb = "error";
    status.ok = false;
    return success(status, 503);
  }

  status.redis = getRedisClient() ? "connected" : "skipped";
  return success(status);
}
