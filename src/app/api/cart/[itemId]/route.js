import { cookies } from "next/headers";
import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import Cart from "@/models/Cart";
import { auth } from "@/lib/auth";
import { updateCartItemSchema } from "@/lib/validators/cart";
import logger from "@/lib/logger";

const GUEST_CART_COOKIE = "cart_guest_id";

async function getCartOwner() {
  const session = await auth();
  if (session?.user?.id) return { userId: session.user.id, guestSessionId: null };
  const guestId = (await cookies()).get(GUEST_CART_COOKIE)?.value;
  return { userId: null, guestSessionId: guestId || null };
}

function cartQuery(owner) {
  return owner.userId ? { userId: owner.userId } : { guestSessionId: owner.guestSessionId };
}

export async function PUT(request, context) {
  try {
    const owner = await getCartOwner();
    if (!owner.userId && !owner.guestSessionId) return error("Unauthorized", 401);

    const params = await context.params;
    const { itemId } = params || {};
    const itemIndex = parseInt(itemId, 10);
    if (isNaN(itemIndex) || itemIndex < 0) return error("Invalid item", 400);

    const body = await request.json();
    const parsed = updateCartItemSchema.safeParse(body);
    if (!parsed.success) return error(parsed.error.message || "Invalid input", 400);

    await connectDB();
    const cart = await Cart.findOne(cartQuery(owner));
    if (!cart || !cart.items[itemIndex]) return error("Cart item not found", 404);

    cart.items[itemIndex].quantity = parsed.data.quantity;
    await cart.save();
    await cart.populate("items.productId", "name slug price salePrice images variants");
    return success({ items: cart.items });
  } catch (e) {
    logger.error("PUT /api/cart/[itemId]: " + e.message);
    return error("Failed to update cart", 500);
  }
}

export async function DELETE(request, context) {
  try {
    const owner = await getCartOwner();
    if (!owner.userId && !owner.guestSessionId) return error("Unauthorized", 401);

    const params = await context.params;
    const { itemId } = params || {};
    const itemIndex = parseInt(itemId, 10);
    if (isNaN(itemIndex) || itemIndex < 0) return error("Invalid item", 400);

    await connectDB();
    const cart = await Cart.findOne(cartQuery(owner));
    if (!cart || !cart.items[itemIndex]) return error("Cart item not found", 404);

    cart.items.splice(itemIndex, 1);
    await cart.save();
    return success({ items: cart.items });
  } catch (e) {
    logger.error("DELETE /api/cart/[itemId]: " + e.message);
    return error("Failed to remove from cart", 500);
  }
}
