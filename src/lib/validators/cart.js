import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string(),
  variantSKU: z.string().optional(),
  quantity: z.number().int().min(1),
});

export const addToCartSchema = cartItemSchema;

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1),
});
