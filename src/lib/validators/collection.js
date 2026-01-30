import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  products: z.array(z.string()).optional(),
  displayOrder: z.number().optional(),
  status: z.enum(["ACTIVE", "HIDDEN"]).optional(),
});

export const updateCollectionSchema = createCollectionSchema.partial();
