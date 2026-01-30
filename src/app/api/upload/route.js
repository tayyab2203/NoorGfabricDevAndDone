import { put } from "@vercel/blob";
import { success, error } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/auth";
import logger from "@/lib/logger";

const MAX_SIZE = 4 * 1024 * 1024; // 4 MB (under Vercel server limit)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

async function handler(request) {
  if (request.method !== "POST") return error("Method not allowed", 405);
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) return error("No file provided", 400);
    if (file.size > MAX_SIZE) return error("File too large (max 4 MB)", 400);
    if (!ALLOWED_TYPES.includes(file.type)) return error("Invalid type. Use JPEG, PNG, WebP, or GIF.", 400);

    const prefix = formData.get("prefix") || "uploads";
    const name = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${prefix}/${Date.now()}-${name}`;

    const blob = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return success({ url: blob.url });
  } catch (e) {
    logger.error("POST /api/upload: " + e.message);
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return error("Upload not configured. Set BLOB_READ_WRITE_TOKEN.", 503);
    }
    return error("Upload failed", 500);
  }
}

export const POST = requireAdmin(handler);
