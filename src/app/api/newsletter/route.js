import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import Newsletter from "@/models/Newsletter";
import { z } from "zod";

const bodySchema = z.object({ email: z.string().email(), consent: z.boolean().refine((v) => v === true) });

export async function POST(request) {
  const clientId = getClientId(request);
  if (!rateLimitCheck(`newsletter:${clientId}`, 20, 60000)) {
    return error("Too many requests", 429);
  }
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) return error("Invalid input", 400);
    const { email, consent } = parsed.data;
    await connectDB();
    const existing = await Newsletter.findOne({ email });
    if (existing) return success({ message: "Already subscribed" });
    await Newsletter.create({ email, consent });
    return success({ message: "Subscribed. Get 10% off your first order." });
  } catch (e) {
    if (e.code === 11000) return success({ message: "Already subscribed" });
    return error("Failed to subscribe", 500);
  }
}
