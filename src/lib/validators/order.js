import { z } from "zod";

const shippingAddressSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1),
});

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      variantSKU: z.string().optional(),
      quantity: z.number().int().min(1),
    })
  ).min(1),
  shippingAddress: shippingAddressSchema,
});

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum(["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
});
