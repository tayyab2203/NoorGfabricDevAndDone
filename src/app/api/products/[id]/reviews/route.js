import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { auth } from "@/lib/auth";
import { z } from "zod";
import logger from "@/lib/logger";

const bodySchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().max(2000).optional(),
});

export async function GET(request, { params }) {
  try {
    const { id: productId } = await params;
    await connectDB();
    const reviews = await Review.find({ productId, status: "APPROVED" })
      .populate("userId", "fullName")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return success(reviews);
  } catch (e) {
    logger.error("GET /api/products/[id]/reviews: " + e.message);
    return error("Failed to fetch reviews", 500);
  }
}

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return error("Sign in to leave a review", 401);
    const { id: productId } = await params;
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) return error(parsed.error.errors?.[0]?.message || "Invalid input", 400);
    const { rating, comment } = parsed.data;
    await connectDB();
    const product = await Product.findById(productId);
    if (!product) return error("Product not found", 404);
    const existing = await Review.findOne({ productId, userId: session.user.id });
    if (existing) return error("You already reviewed this product", 400);
    const review = await Review.create({
      productId,
      userId: session.user.id,
      rating,
      comment: comment || "",
      status: "PENDING",
    });
    await review.populate("userId", "fullName");
    return success(review);
  } catch (e) {
    logger.error("POST /api/products/[id]/reviews: " + e.message);
    return error("Failed to submit review", 500);
  }
}
