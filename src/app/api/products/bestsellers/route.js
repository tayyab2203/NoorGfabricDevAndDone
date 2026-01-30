import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import "@/models/Category";
import Order from "@/models/Order";
import Product from "@/models/Product";
import logger from "@/lib/logger";

export async function GET() {
  try {
    await connectDB();
    const aggregated = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.productId", totalQty: { $sum: "$items.quantity" } } },
      { $sort: { totalQty: -1 } },
      { $limit: 12 },
    ]);
    const productIds = aggregated.map((a) => a._id).filter(Boolean);
    if (productIds.length === 0) return success([]);
    const products = await Product.find({ _id: { $in: productIds }, status: "ACTIVE" })
      .populate("categoryId", "name slug")
      .lean();
    const orderMap = new Map(productIds.map((id, i) => [id.toString(), i]));
    products.sort((a, b) => orderMap.get(a._id.toString()) - orderMap.get(b._id.toString()));
    return success(products);
  } catch (e) {
    logger.error("GET /api/products/bestsellers: " + e.message);
    return error("Failed to fetch bestsellers", 500);
  }
}
