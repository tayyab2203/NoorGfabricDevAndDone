(async () => {
  const path = await import("path");
  const { pathToFileURL } = await import("url");
  const __dirname = path.dirname(pathToFileURL(import.meta.url).pathname);
  process.env.NODE_ENV = process.env.NODE_ENV || "development";
  const dotenv = await import("dotenv");
  dotenv.config({ path: path.join(process.cwd(), ".env.local") });
  dotenv.config({ path: path.join(process.cwd(), ".env") });

  const mongoose = (await import("mongoose")).default;
  const bcrypt = (await import("bcryptjs")).default;
  const User = (await import("../src/models/User.js")).default;
  const Category = (await import("../src/models/Category.js")).default;
  const Product = (await import("../src/models/Product.js")).default;
  const Collection = (await import("../src/models/Collection.js")).default;

  const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/noorgclothing";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Collection.deleteMany({});

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const adminUser = await User.create({
    email: "admin@noorgfabrics.example",
    password: hashedPassword,
    fullName: "Admin User",
    role: "ADMIN",
    status: "ACTIVE",
  });
  console.log("Created admin user:", adminUser.email, "(password: use ADMIN_PASSWORD env or default admin123)");

  const cat1 = await Category.create({
    name: "Lawn",
    slug: "lawn",
    description: "Premium lawn fabric",
    displayOrder: 1,
    status: "ACTIVE",
  });
  const cat2 = await Category.create({
    name: "Cotton",
    slug: "cotton",
    description: "Pure cotton",
    displayOrder: 2,
    status: "ACTIVE",
  });
  const cat3 = await Category.create({
    name: "Linen",
    slug: "linen",
    description: "Linen collection",
    displayOrder: 3,
    status: "ACTIVE",
  });
  console.log("Created categories");

  const productData = [
    {
      name: "Classic Lawn Shirt",
      slug: "classic-lawn-shirt",
      categoryId: cat1._id,
      price: 4500,
      salePrice: 4000,
      material: "Lawn",
      description: "Elegant lawn shirt.",
      SKU: "LAWN-001",
      status: "ACTIVE",
      images: [{ url: "", altText: "Lawn shirt", order: 0 }],
      variants: [
        { size: "S", color: "White", stock: 10, variantSKU: "LAWN-001-S-W" },
        { size: "M", color: "White", stock: 15, variantSKU: "LAWN-001-M-W" },
        { size: "L", color: "White", stock: 12, variantSKU: "LAWN-001-L-W" },
      ],
    },
    {
      name: "Cotton Kurta",
      slug: "cotton-kurta",
      categoryId: cat2._id,
      price: 3500,
      material: "Cotton",
      description: "Comfortable cotton kurta.",
      SKU: "COT-001",
      status: "ACTIVE",
      images: [{ url: "", altText: "Cotton kurta", order: 0 }],
      variants: [
        { size: "S", color: "Navy", stock: 8, variantSKU: "COT-001-S-N" },
        { size: "M", color: "Navy", stock: 10, variantSKU: "COT-001-M-N" },
      ],
    },
    {
      name: "Linen Suit",
      slug: "linen-suit",
      categoryId: cat3._id,
      price: 12000,
      salePrice: 10000,
      material: "Linen",
      description: "Premium linen suit.",
      SKU: "LIN-001",
      status: "ACTIVE",
      images: [{ url: "", altText: "Linen suit", order: 0 }],
      variants: [
        { size: "M", color: "Beige", stock: 5, variantSKU: "LIN-001-M-B" },
        { size: "L", color: "Beige", stock: 5, variantSKU: "LIN-001-L-B" },
      ],
    },
    {
      name: "Festive Lawn",
      slug: "festive-lawn",
      categoryId: cat1._id,
      price: 5500,
      material: "Lawn",
      description: "Festive collection lawn.",
      SKU: "LAWN-002",
      status: "ACTIVE",
      images: [{ url: "", altText: "Festive lawn", order: 0 }],
      variants: [
        { size: "S", color: "Green", stock: 7, variantSKU: "LAWN-002-S-G" },
        { size: "M", color: "Green", stock: 9, variantSKU: "LAWN-002-M-G" },
      ],
    },
  ];

  const products = [];
  for (const p of productData) {
    products.push(await Product.create(p));
  }
  console.log("Created products:", products.length);

  const collectionData = [
    { name: "Lawn Collection", slug: "lawn-collection", description: "Best lawn pieces", products: [products[0]._id, products[3]._id], displayOrder: 1 },
    { name: "Cotton & Linen", slug: "cotton-linen", description: "Cotton and linen essentials", products: [products[1]._id, products[2]._id], displayOrder: 2 },
    { name: "Winter Collection", slug: "winter-collection", description: "Winter fabrics and stoles", products: [], displayOrder: 3 },
    { name: "Winter Unstitched", slug: "winter-unstitched", description: "Winter unstitched fabric", products: [], displayOrder: 4 },
    { name: "Winter Stoles", slug: "winter-stoles", description: "Winter stoles collection", products: [], displayOrder: 5 },
    { name: "Winter Pret", slug: "winter-pret", description: "Winter pret wear", products: [], displayOrder: 6 },
    { name: "Winter Shawls", slug: "winter-shawls", description: "Winter shawls", products: [], displayOrder: 7 },
    { name: "Shawls Collection", slug: "shawls-collection", description: "Shawls and dupattas", products: [], displayOrder: 8 },
    { name: "Boski Collection", slug: "boski-collection", description: "Boski fabric collection", products: [], displayOrder: 9 },
    { name: "Latha Collection", slug: "latha-collection", description: "Latha fabric collection", products: [], displayOrder: 10 },
    { name: "Current Collection", slug: "current-collection", description: "Current season collection", products: [], displayOrder: 11 },
    { name: "Cotton Collection", slug: "cotton-collection", description: "Pure cotton collection", products: [products[1]._id], displayOrder: 12 },
    { name: "Wash n Wear Collection", slug: "wash-n-ware-collection", description: "Wash and wear fabrics", products: [], displayOrder: 13 },
  ];
  for (const c of collectionData) {
    await Collection.create({
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: "",
      products: c.products || [],
      displayOrder: c.displayOrder,
      status: "ACTIVE",
    });
  }
  console.log("Created collections:", collectionData.length);

  await mongoose.disconnect();
  console.log("Seed complete.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
