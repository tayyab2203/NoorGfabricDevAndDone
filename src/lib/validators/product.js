import { z } from "zod";

const imageSchema = z.object({
  url: z.string(),
  altText: z.string().optional(),
  order: z.number().optional(),
});

const variantSchema = z.object({
  size: z.string(),
  color: z.string(),
  stock: z.number().min(0),
  variantSKU: z.string(),
});

export const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  categoryId: z.string().optional(),
  price: z.number().min(0),
  salePrice: z.number().min(0).optional().nullable(),
  material: z.string().optional(),
  description: z.string().optional(),
  SKU: z.string().min(1),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  images: z.array(imageSchema).optional(),
  variants: z.array(variantSchema).optional(),
});

export const updateProductSchema = createProductSchema.partial();
