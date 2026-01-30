import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";
import logger from "@/lib/logger";

async function handler(request, context, session) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "month";
    await connectDB();

    const now = new Date();
    let start;
    if (range === "today") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (range === "week") {
      start = new Date(now);
      start.setDate(start.getDate() - 7);
    } else {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const orderMatch = { createdAt: { $gte: start }, orderStatus: { $ne: "CANCELLED" } };
    const [revenueResult, ordersCount, orderStatusCounts, recentOrders, topSellers, lowStock] = await Promise.all([
      Order.aggregate([{ $match: orderMatch }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
      Order.countDocuments(orderMatch),
      Order.aggregate([{ $match: orderMatch }, { $group: { _id: "$orderStatus", count: { $sum: 1 } } }]),
      Order.find(orderMatch).sort({ createdAt: -1 }).limit(10).lean(),
      Order.aggregate([
        { $match: orderMatch },
        { $unwind: "$items" },
        { $group: { _id: "$items.productId", totalQty: { $sum: "$items.quantity" }, totalRev: { $sum: { $multiply: ["$items.priceSnapshot", "$items.quantity"] } } } },
        { $sort: { totalQty: -1 } },
        { $limit: 10 },
        { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
        { $unwind: "$product" },
        { $project: { name: "$product.name", totalQty: 1, totalRev: 1 } },
      ]),
      Product.find({ status: "ACTIVE", "variants.stock": { $lte: 10 } }).select("name variants").limit(10).lean(),
    ]);

    const totalRevenue = revenueResult[0]?.total ?? 0;
    const aov = ordersCount > 0 ? totalRevenue / ordersCount : 0;
    const newCustomers = await User.countDocuments({ createdAt: { $gte: start }, role: "USER" });

    const statusPie = orderStatusCounts.reduce((acc, s) => {
      acc[s._id] = s.count;
      return acc;
    }, {});

    return success({
      revenue: totalRevenue,
      ordersCount,
      aov: Math.round(aov),
      newCustomers,
      orderStatusPie: statusPie,
      recentOrders,
      topSellers,
      lowStock,
    });
  } catch (e) {
    logger.error("GET /api/admin/dashboard: " + e.message);
    return error("Failed to fetch dashboard", 500);
  }
}

export const GET = requireAdmin(handler);
