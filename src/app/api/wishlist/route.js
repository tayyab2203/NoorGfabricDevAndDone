import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product";
import { auth } from "@/lib/auth";
import logger from "@/lib/logger";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return error("Unauthorized", 401);

    await connectDB();
    let wishlist = await Wishlist.findOne({ userId: session.user.id })
      .populate("products", "name slug price salePrice images variants status")
      .lean();
    if (!wishlist) wishlist = { products: [] };
    const products = wishlist.products?.filter((p) => p && p.status === "ACTIVE") || [];
    return success(products);
  } catch (e) {
    logger.error("GET /api/wishlist: " + e.message);
    return error("Failed to fetch wishlist", 500);
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return error("Unauthorized", 401);

    const body = await request.json();
    const productId = body.productId;
    if (!productId) return error("productId required", 400);

    await connectDB();
    let wishlist = await Wishlist.findOne({ userId: session.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: session.user.id, products: [] });
    }
    if (!wishlist.products.some((p) => p.toString() === productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
    await wishlist.populate("products", "name slug price salePrice images");
    return success(wishlist.products);
  } catch (e) {
    logger.error("POST /api/wishlist: " + e.message);
    return error("Failed to add to wishlist", 500);
  }
}
