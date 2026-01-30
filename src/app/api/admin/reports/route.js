import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";
import logger from "@/lib/logger";

function getDateRange(range) {
  const now = new Date();
  let start;
  if (range === "today") start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  else if (range === "week") { start = new Date(now); start.setDate(start.getDate() - 7); }
  else if (range === "month") start = new Date(now.getFullYear(), now.getMonth(), 1);
  else start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return { start, end: now };
}

async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "month";
    const format = searchParams.get("format") || "json";
    await connectDB();
    const { start, end } = getDateRange(range);
    const orderMatch = { createdAt: { $gte: start, $lte: end }, orderStatus: { $ne: "CANCELLED" } };

    const [salesSummary, productPerformance] = await Promise.all([
      Order.aggregate([
        { $match: orderMatch },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" }, totalOrders: { $sum: 1 }, avgOrderValue: { $avg: "$totalAmount" }, totalShipping: { $sum: "$shippingFee" } } },
      ]),
      Order.aggregate([
        { $match: orderMatch },
        { $unwind: "$items" },
        { $group: { _id: "$items.productId", quantitySold: { $sum: "$items.quantity" }, revenue: { $sum: { $multiply: ["$items.priceSnapshot", "$items.quantity"] } } } },
        { $sort: { revenue: -1 } },
        { $limit: 50 },
        { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
        { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
        { $project: { productName: "$product.name", quantitySold: 1, revenue: 1 } },
      ]),
    ]);

    const s = salesSummary[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, totalShipping: 0 };
    const data = { range, start: start.toISOString(), end: end.toISOString(), sales: { totalRevenue: s.totalRevenue, totalOrders: s.totalOrders, avgOrderValue: Math.round(s.avgOrderValue || 0), totalShipping: s.totalShipping }, productPerformance: productPerformance.map((p) => ({ productName: p.productName || "Unknown", quantitySold: p.quantitySold, revenue: p.revenue })) };

    if (format === "csv") {
      const lines = [
        "Metric,Value",
        "Total Revenue (Rs)," + s.totalRevenue,
        "Total Orders," + s.totalOrders,
        "Avg Order Value (Rs)," + Math.round(s.avgOrderValue || 0),
        "",
        "Product,Quantity Sold,Revenue (Rs)",
        ...productPerformance.map((p) => [p.productName || "Unknown", p.quantitySold, p.revenue].join(",")),
      ];
      const csv = lines.join("\n");
      return new Response(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": `attachment; filename="sales-report-${range}.csv"` } });
    }
    return success(data);
  } catch (e) {
    logger.error("GET /api/admin/reports: " + e.message);
    return error("Failed to generate report", 500);
  }
}

export const GET = requireAdmin(handler);
