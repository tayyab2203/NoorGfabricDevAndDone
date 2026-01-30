# Phase 7 – Admin Dashboard Core: Use Cases

**Module:** Admin Dashboard Core  
**Requirements ref:** §6 Dashboard, Products, Orders

## Actors

- **Admin / Manager:** Authenticated staff (role ADMIN or MANAGER).

## Use Cases

### UC-1: View dashboard

**Description:** Admin sees KPIs (revenue, orders, AOV, new customers), date-range selector, recent orders, top sellers, low stock alerts.

**Preconditions:** Session with role ADMIN or MANAGER; middleware allows /admin.

**Main flow:**
1. Open /admin; GET /api/admin/dashboard?range=today|week|month.
2. Display revenue, orders count, AOV, new customers; order status pie; recent orders table; top sellers; low stock with link to edit product.

**Postconditions:** Dashboard reflects business health; no order delete.

---

### UC-2: Manage products

**Description:** Admin lists products (thumbnail, name, SKU, price, stock, status); adds or edits product (basic info, pricing, status).

**Preconditions:** Session with role ADMIN or MANAGER.

**Main flow:**
1. /admin/products — list from GET /api/products; table with Edit link.
2. /admin/products/new — form (name, slug, price, salePrice, SKU, description, status); POST /api/admin/products.
3. /admin/products/[id]/edit — form pre-filled; PUT /api/admin/products/[id]; cache invalidated.

**Postconditions:** Product created/updated; product cache invalidated.

---

### UC-3: Process orders

**Description:** Admin lists orders; views order detail (customer, shipping, items, summary); updates order status (no delete).

**Preconditions:** Session with role ADMIN or MANAGER.

**Main flow:**
1. /admin/orders — GET /api/admin/orders; table with View link.
2. /admin/orders/[id] — order detail; select new status; PUT /api/admin/orders/[id] { orderStatus }; no delete.

**Postconditions:** Order status updated; orders never deleted.
