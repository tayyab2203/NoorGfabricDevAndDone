import connectDB from "@/lib/db/mongoose";
import { success, error } from "@/lib/apiResponse";
import ContactMessage from "@/models/ContactMessage";
import { z } from "zod";

const bodySchema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(1, "Message required"),
});

export async function POST(request) {
  const clientId = getClientId(request);
  if (!rateLimitCheck(`contact:${clientId}`, 20, 60000)) {
    return error("Too many requests", 429);
  }
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) return error(parsed.error.errors?.[0]?.message || "Invalid input", 400);
    await connectDB();
    await ContactMessage.create(parsed.data);
    return success({ message: "Message sent. We will get back to you soon." });
  } catch (e) {
    return error("Failed to send message", 500);
  }
}
