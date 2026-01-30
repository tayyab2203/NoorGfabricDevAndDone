import mongoose from "mongoose";
import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import Wishlist from "@/models/Wishlist";
import { auth } from "@/lib/auth";
import logger from "@/lib/logger";

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return error("Unauthorized", 401);

    const { productId } = await params;
    if (!mongoose.Types.ObjectId.isValid(productId)) return error("Invalid product id", 400);

    await connectDB();
    const wishlist = await Wishlist.findOne({ userId: session.user.id });
    if (!wishlist) return success({ products: [] });
    wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
    await wishlist.save();
    await wishlist.populate("products", "name slug price salePrice images");
    return success(wishlist.products);
  } catch (e) {
    logger.error("DELETE /api/wishlist/[productId]: " + e.message);
    return error("Failed to remove from wishlist", 500);
  }
}
