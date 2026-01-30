/**
 * Promote a user to ADMIN by email.
 * Usage: node scripts/promote-to-admin.js your-email@gmail.com
 */
(async () => {
  const path = await import("path");
  const { pathToFileURL } = await import("url");
  const __dirname = path.dirname(pathToFileURL(import.meta.url).pathname);
  process.env.NODE_ENV = process.env.NODE_ENV || "development";
  const dotenv = await import("dotenv");
  dotenv.config({ path: path.join(process.cwd(), ".env.local") });
  dotenv.config({ path: path.join(process.cwd(), ".env") });

  const email = process.argv[2];
  if (!email) {
    console.error("Usage: node scripts/promote-to-admin.js <email>");
    console.error("Example: node scripts/promote-to-admin.js you@gmail.com");
    process.exit(1);
  }

  const mongoose = (await import("mongoose")).default;
  const User = (await import("../src/models/User.js")).default;
  const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/noorgclothing";

  await mongoose.connect(MONGODB_URI);
  const user = await User.findOneAndUpdate(
    { email: email.trim() },
    { role: "ADMIN" },
    { new: true }
  );
  if (!user) {
    console.error("No user found with email:", email);
    process.exit(1);
  }
  console.log("Promoted to ADMIN:", user.email);
  await mongoose.disconnect();
})();
