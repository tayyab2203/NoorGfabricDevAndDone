# Phase 3 – Data Layer: Use Cases

**Module:** Data Layer  
**Requirements ref:** §4 Database Schema

## Actors

- **System:** Next.js app, MongoDB
- **Developer:** Runs seed script; uses models in API

## Use Cases

### UC-1: Create and read entities

**Description:** Application uses Mongoose models (User, Category, Product, Collection, Order, Cart, Review, Address) to persist and query data per §4 schema.

**Preconditions:** MongoDB connected; models imported.

**Main flow:**
1. API or seed creates/updates documents via Model.create(), Model.findByIdAndUpdate(), etc.
2. Queries use indexes (email, slug, userId, orderNumber, productId, etc.).
3. Cart documents use expiresAt; TTL index (expireAfterSeconds: 0) removes expired carts.
4. Orders are never deleted; only status updated.

**Postconditions:** Data conforms to §4; indexes support queries; Cart TTL 30 days; Order no-delete.

---

### UC-2: Run seed script

**Description:** Developer runs seed to create initial admin user, categories, collections, and products.

**Preconditions:** MONGODB_URI set (or default localhost); dotenv loads .env.local/.env.

**Main flow:**
1. Run `npm run seed` (node scripts/seed.js).
2. Script connects to MongoDB; deletes existing User, Category, Product, Collection (for seed idempotency).
3. Creates one ADMIN user (admin@noorgfabrics.example).
4. Creates 3 categories (Lawn, Cotton, Linen).
5. Creates 4 products with variants and images.
6. Creates 2 collections with product references.
7. Disconnects.

**Postconditions:** MongoDB contains seed data; models export and run without schema errors.
