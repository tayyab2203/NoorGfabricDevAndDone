/**
 * One-time script: drop old Cart sparse unique indexes so the new partial indexes work.
 * Run: node scripts/drop-cart-indexes.js
 */
(async () => {
  const path = await import("path");
  const { pathToFileURL } = await import("url");
  const __dirname = path.dirname(pathToFileURL(import.meta.url).pathname);
  process.env.NODE_ENV = process.env.NODE_ENV || "development";
  const dotenv = await import("dotenv");
  dotenv.config({ path: path.join(process.cwd(), ".env.local") });
  dotenv.config({ path: path.join(process.cwd(), ".env") });

  const mongoose = (await import("mongoose")).default;
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/noorgclothing";

  await mongoose.connect(MONGODB_URI);
  const coll = mongoose.connection.collection("carts");
  for (const name of ["guestSessionId_1", "userId_1"]) {
    try {
      await coll.dropIndex(name);
      console.log("Dropped index:", name);
    } catch (e) {
      if (e.code === 27 || e.codeName === "IndexNotFound") console.log("Index not found (ok):", name);
      else console.warn(name, e.message);
    }
  }
  await mongoose.disconnect();
  console.log("Done. Restart the app so Mongoose can create the new partial indexes.");
})();
