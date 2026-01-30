import { success } from "@/lib/apiResponse";
import connectDB from "@/lib/db/mongoose";
import { getRedisClient } from "@/lib/db/redis";

/** Return a safe hint for debugging (no credentials or stack traces). */
function getMongoHint(err) {
  if (!err?.message) return "connection_failed";
  const msg = err.message.toLowerCase();
  if (msg.includes("whitelist") || msg.includes("could not connect to any servers")) return "ip_blocked";
  if (msg.includes("auth") || msg.includes("unauthorized") || msg.includes("credentials")) return "auth_failed";
  if (msg.includes("timeout") || msg.includes("etimedout") || msg.includes("enotfound")) return "timeout_or_dns";
  return "connection_failed";
}

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
    status.mongodbHint = getMongoHint(e);
    status.ok = false;
    return success(status, 503);
  }

  status.redis = getRedisClient() ? "connected" : "skipped";
  return success(status);
}
