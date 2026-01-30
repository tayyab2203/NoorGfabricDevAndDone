# Phase 4 – Core APIs: Use Cases

**Module:** Core APIs  
**Requirements ref:** §8 API Endpoints, §3 Caching

## Actors

- **Guest / User:** Caller of public APIs (products, collections, cart, orders).
- **Admin / Manager:** Caller of admin APIs (products, orders).

## Use Cases

### UC-1: List and get products

**Description:** Caller fetches product list with filters (category, status, price range, pagination) or a single product by id/slug; responses are cached in Redis (TTL 24h).

**Preconditions:** None for GET.

**Main flow:**
1. GET /api/products?category=&status=&minPrice=&maxPrice=&page=&limit= → validate query; check Redis cache key; on miss, query MongoDB, return items + total; set cache.
2. GET /api/products/[id] → id is ObjectId or slug; check Redis cache; on miss, find by id or slug, return product; set cache.

**Postconditions:** JSON response; cache hit avoids DB for 24h.

---

### UC-2: Add to cart and manage cart

**Description:** Authenticated user adds items, updates quantity, or removes items; cart stored in MongoDB with 30-day expiry.

**Preconditions:** Session (user logged in).

**Main flow:**
1. POST /api/cart — body: { productId, variantSKU?, quantity }; validate; find/create Cart by userId; add or update line; save; return cart.
2. PUT /api/cart/[itemId] — body: { quantity }; update item at index; save.
3. DELETE /api/cart/[itemId] — remove item at index; save.
4. GET /api/cart — return user cart items.

**Alternative flow (unauthorized):** Return 401.

**Postconditions:** Cart persisted; expires in 30 days (TTL).

---

### UC-3: Create order (including guest)

**Description:** Caller submits items and shipping address; order is created with snapshots, stock decremented, cart cleared if logged in; guest allowed (userId null).

**Preconditions:** Valid body (items, shippingAddress); products exist and have stock.

**Main flow:**
1. POST /api/orders — body: createOrderSchema (items[], shippingAddress); optional session (userId).
2. Resolve each item to product; build nameSnapshot, priceSnapshot; validate stock.
3. Calculate subtotal, shipping fee, total; generate orderNumber; create Order.
4. Decrement variant stock; if userId, clear Cart.
5. Return order + orderNumber.

**Exception flow (insufficient stock):** Return 400 with message.

**Postconditions:** Order persisted; stock updated; no order delete (per §4).

---

### UC-4: Admin update product / order status

**Description:** Admin creates/updates product or updates order status; product/order cache invalidated where applicable.

**Preconditions:** Session with role ADMIN or MANAGER.

**Main flow:**
1. POST /api/admin/products — body: createProductSchema; create product; return 201.
2. PUT /api/admin/products/[id] — body: updateProductSchema (partial); update product; delete Redis keys products:id, products:slug; return product.
3. GET /api/admin/orders — query: page, limit, status; return orders list.
4. PUT /api/admin/orders/[id]/status — body: { orderStatus }; update order; return order.

**Alternative flow (forbidden):** Return 403.

**Postconditions:** Product/order updated; product cache invalidated; orders never deleted.
