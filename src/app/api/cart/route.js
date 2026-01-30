import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { auth } from "@/lib/auth";
import { addToCartSchema } from "@/lib/validators/cart";
import logger from "@/lib/logger";

const CART_EXPIRY_DAYS = 30;
const GUEST_CART_COOKIE = "cart_guest_id";
const GUEST_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

function getExpiresAt() {
  const d = new Date();
  d.setDate(d.getDate() + CART_EXPIRY_DAYS);
  return d;
}

/** Get cart owner: userId if logged in, else guestSessionId from cookie (create if needed). */
async function getCartOwner() {
  const session = await auth();
  if (session?.user?.id) return { userId: session.user.id, guestSessionId: null };

  const cookieStore = await cookies();
  let guestId = cookieStore.get(GUEST_CART_COOKIE)?.value;
  if (!guestId) {
    guestId = crypto.randomUUID();
    cookieStore.set(GUEST_CART_COOKIE, guestId, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: GUEST_COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === "production",
    });
  }
  return { userId: null, guestSessionId: guestId };
}

function cartQuery(owner) {
  return owner.userId ? { userId: owner.userId } : { guestSessionId: owner.guestSessionId };
}

/** Merge guest cart into user cart and clear guest cart in DB. Returns merged cart payload or null. */
async function mergeGuestCartIntoUser(userId, guestSessionId) {
  if (!userId || !guestSessionId) return null;
  const guestCart = await Cart.findOne({ guestSessionId }).populate(
    "items.productId",
    "name slug price salePrice images variants"
  );
  if (!guestCart?.items?.length) return null;

  let userCart = await Cart.findOne({ userId }).populate(
    "items.productId",
    "name slug price salePrice images variants"
  );
    if (!userCart) {
    userCart = await Cart.create({
      userId,
      items: [],
      expiresAt: getExpiresAt(),
    });
  }

  for (const guestItem of guestCart.items) {
    const productId = guestItem.productId?._id ?? guestItem.productId;
    const variantSKU = guestItem.variantSKU ?? null;
    const existing = userCart.items.find(
      (i) => i.productId?.toString?.() === productId?.toString?.() && (i.variantSKU || "") === (variantSKU || "")
    );
    if (existing) {
      existing.quantity += guestItem.quantity || 0;
    } else {
      userCart.items.push({
        productId: productId ?? guestItem.productId,
        variantSKU,
        quantity: guestItem.quantity || 1,
      });
    }
  }
  userCart.expiresAt = getExpiresAt();
  await userCart.save();
  await Cart.findOneAndUpdate(
    { guestSessionId },
    { $set: { items: [], expiresAt: getExpiresAt() } }
  );
  await userCart.populate("items.productId", "name slug price salePrice images variants");
  return userCart.items ? { items: userCart.items, _id: userCart._id } : { items: [], _id: userCart._id };
}

export async function GET() {
  try {
    const session = await auth();
    const cookieStore = await cookies();
    const guestIdFromCookie = cookieStore.get(GUEST_CART_COOKIE)?.value;

    await connectDB();

    if (session?.user?.id && guestIdFromCookie) {
      const merged = await mergeGuestCartIntoUser(session.user.id, guestIdFromCookie);
      if (merged) {
        const res = NextResponse.json({ success: true, data: merged });
        res.cookies.set(GUEST_CART_COOKIE, "", { path: "/", maxAge: 0 });
        return res;
      }
    }

    const owner = await getCartOwner();
    let cart = await Cart.findOne(cartQuery(owner)).populate(
      "items.productId",
      "name slug price salePrice images variants"
    );
    if (!cart) {
      return success({ items: [], _id: null });
    }
    return success(cart.items ? { items: cart.items, _id: cart._id } : { items: [], _id: null });
  } catch (e) {
    logger.error("GET /api/cart: " + e.message);
    return error("Failed to fetch cart", 500);
  }
}

export async function POST(request) {
  try {
    const owner = await getCartOwner();

    const body = await request.json();
    const parsed = addToCartSchema.safeParse(body);
    if (!parsed.success) return error(parsed.error.message || "Invalid input", 400);

    const { productId, variantSKU, quantity } = parsed.data;
    await connectDB();

    const product = await Product.findById(productId);
    if (!product) return error("Product not found", 404);
    const variant = product.variants?.find((v) => v.variantSKU === variantSKU) || product.variants?.[0];
    const stock = variant?.stock ?? 0;
    if (stock < quantity) return error("Insufficient stock", 400);

    let cart = await Cart.findOne(cartQuery(owner));
    if (!cart) {
      const createPayload = {
        items: [],
        expiresAt: getExpiresAt(),
      };
      if (owner.userId) createPayload.userId = owner.userId;
      else createPayload.guestSessionId = owner.guestSessionId;
      cart = await Cart.create(createPayload);
    }
    const existing = cart.items.find(
      (i) => i.productId.toString() === productId && (i.variantSKU || "") === (variantSKU || "")
    );
    if (existing) {
      existing.quantity += quantity;
      if (existing.quantity > stock) return error("Insufficient stock", 400);
    } else {
      cart.items.push({ productId, variantSKU: variantSKU || null, quantity });
    }
    cart.expiresAt = getExpiresAt();
    await cart.save();
    await cart.populate("items.productId", "name slug price salePrice images variants");
    return success({ items: cart.items, _id: cart._id });
  } catch (e) {
    logger.error("POST /api/cart: " + e.message);
    return error("Failed to add to cart", 500);
  }
}
