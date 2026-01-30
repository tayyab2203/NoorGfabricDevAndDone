# Phase 5 – User Site Discovery: Use Cases

**Module:** User Site Discovery  
**Requirements ref:** §5 Pages 1–5

## Actors

- **Visitor (Guest / User):** Browses home, collections, product detail, search; can add to cart (user only for cart API).

## Use Cases

### UC-1: View home page

**Description:** Visitor sees hero, featured collections (from API), bestsellers (from order aggregation), testimonials carousel, newsletter signup.

**Preconditions:** None.

**Main flow:**
1. Open /.
2. Hero shows value proposition and CTAs (Shop Now, Explore Collections).
3. Featured Collections: fetch GET /api/collections; display up to 6 cards with image, name, description, "View Collection".
4. Bestsellers: fetch GET /api/products/bestsellers (aggregation from orders); display product grid with image, price, "View".
5. Testimonials: static carousel (name, city, text, rating).
6. Newsletter: form (email, consent); submit POST /api/newsletter.

**Postconditions:** Bestsellers use same aggregation logic as admin Top Sellers (§5).

---

### UC-2: Browse collections

**Description:** Visitor sees grid of collections; clicks to view collection detail.

**Preconditions:** None.

**Main flow:**
1. Open /collections.
2. Fetch GET /api/collections; display grid (image, name, product count).
3. Click collection → /collection/[slug].
4. Collection detail: header, breadcrumb, description; product grid from collection.products (filters optional).

**Postconditions:** Navigation clear; collection products displayed.

---

### UC-3: View product detail and add to cart

**Description:** Visitor opens product by slug; sees gallery, info, variants (size, color), quantity; adds to cart (requires login for API).

**Preconditions:** None for view; session required for Add to Cart.

**Main flow:**
1. Open /products/[slug].
2. Fetch GET /api/products/[slug]; display image, name, price, SKU, availability, material, description.
3. Select size, color, quantity.
4. Add to Cart → POST /api/cart (productId, variantSKU, quantity); on success cart count updates (Phase 6).
5. Buy Now → link to /cart.

**Postconditions:** Product detail removes doubt; add to cart works when logged in.

---

### UC-4: Search products

**Description:** Visitor enters query; sees result count and product grid with same card layout; filters/sort (optional).

**Preconditions:** None.

**Main flow:**
1. Open /search?q=... (or search input in header).
2. Fetch GET /api/products/search?q=...; display result count and product grid.
3. Highlight matching terms (optional).

**Postconditions:** Fast retrieval; result count and list.
