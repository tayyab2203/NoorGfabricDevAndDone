import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { auth } from "@/lib/auth";
import { createOrderSchema } from "@/lib/validators/order";
import logger from "@/lib/logger";
import { sendOrderConfirmationEmail } from "@/lib/email";

const GUEST_CART_COOKIE = "cart_guest_id";

function generateOrderNumber() {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ALN-${t}-${r}`;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return error("Unauthorized", 401);

    await connectDB();
    const orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();
    return success(orders);
  } catch (e) {
    logger.error("GET /api/orders: " + e.message);
    return error("Failed to fetch orders", 500);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) return error(parsed.error.message || "Invalid input", 400);

    const session = await auth();
    const userId = session?.user?.id || null;
    const { items, shippingAddress } = parsed.data;

    await connectDB();

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return error(`Product ${item.productId} not found`, 400);
      const variant = product.variants?.find((v) => v.variantSKU === item.variantSKU) || product.variants?.[0];
      const stock = variant?.stock ?? 0;
      if (stock < item.quantity) return error(`Insufficient stock for ${product.name}`, 400);

      const price = product.salePrice ?? product.price;
      const lineTotal = price * item.quantity;
      subtotal += lineTotal;
      orderItems.push({
        productId: product._id,
        variantSKU: variant?.variantSKU || null,
        nameSnapshot: product.name,
        priceSnapshot: price,
        quantity: item.quantity,
      });
    }

    const shippingFee = subtotal >= 5000 ? 0 : 250;
    const totalAmount = subtotal + shippingFee;
    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      userId,
      items: orderItems,
      shippingAddress,
      paymentMethod: "COD",
      paymentStatus: "PENDING",
      orderStatus: "PLACED",
      subtotal,
      shippingFee,
      totalAmount,
    });

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      const variant = product.variants?.find((v) => v.variantSKU === item.variantSKU) || product.variants?.[0];
      if (variant) {
        variant.stock -= item.quantity;
        await product.save();
      }
    }

    if (userId) {
      await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [], expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } }
      );
    } else {
      const cookieStore = await cookies();
      const guestId = cookieStore.get(GUEST_CART_COOKIE)?.value;
      if (guestId) {
        await Cart.findOneAndUpdate(
          { guestSessionId: guestId },
          { $set: { items: [], expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } }
        );
      }
    }

    const customerEmail = session?.user?.email || order.shippingAddress?.email;
    sendOrderConfirmationEmail(order.toObject(), customerEmail).catch(() => {});

    const payload = { order: order.toObject(), orderNumber };
    const res = NextResponse.json({ success: true, data: payload });
    if (!userId) {
      res.cookies.set(GUEST_CART_COOKIE, "", { path: "/", maxAge: 0 });
    }
    return res;
  } catch (e) {
    logger.error("POST /api/orders: " + e.message);
    return error("Failed to create order", 500);
  }
}
