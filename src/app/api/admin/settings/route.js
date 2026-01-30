import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import Settings from "@/models/Settings";
import { requireAdmin } from "@/lib/auth";
import logger from "@/lib/logger";

const DEFAULTS = {
  storeName: "Noor G Fabrics",
  storeEmail: "info@noorgfabrics.com",
  shippingFee: 250,
  freeShippingThreshold: 5000,
  codEnabled: true,
  currency: "PKR",
};

async function getSettings() {
  try {
    await connectDB();
    const docs = await Settings.find({}).lean();
    const map = docs.reduce((acc, d) => { acc[d.key] = d.value; return acc; }, {});
    const data = { ...DEFAULTS, ...map };
    return success(data);
  } catch (e) {
    logger.error("GET /api/admin/settings: " + e.message);
    return error("Failed to fetch settings", 500);
  }
}

async function putSettings(request) {
  try {
    const body = await request.json();
    await connectDB();
    for (const [key, value] of Object.entries(body)) {
      if (DEFAULTS.hasOwnProperty(key) || ["storeName", "storeEmail", "shippingFee", "freeShippingThreshold", "codEnabled", "currency"].includes(key)) {
        await Settings.findOneAndUpdate(
          { key },
          { $set: { value } },
          { upsert: true, new: true }
        );
      }
    }
    const docs = await Settings.find({}).lean();
    const map = docs.reduce((acc, d) => { acc[d.key] = d.value; return acc; }, {});
    return success({ ...DEFAULTS, ...map });
  } catch (e) {
    logger.error("PUT /api/admin/settings: " + e.message);
    return error("Failed to update settings", 500);
  }
}

export const GET = requireAdmin((req) => getSettings(req));
export const PUT = requireAdmin((req) => putSettings(req));
