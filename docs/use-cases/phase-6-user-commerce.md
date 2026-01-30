# Phase 6 – User Site Commerce: Use Cases

**Module:** User Site Commerce  
**Requirements ref:** §5 Pages 6–10, §7 Order Journey

## Actors

- **User:** Logged-in customer (cart, orders, account, wishlist).
- **Guest:** Unauthenticated (checkout with shipping only; order has nullable userId).

## Use Cases

### UC-1: View and manage cart

**Description:** User views cart; updates quantity or removes items; proceeds to checkout.

**Preconditions:** Session (for cart API).

**Main flow:**
1. Open /cart; GET /api/cart returns items (with productId populated).
2. Display list: image, name, variant, quantity, remove; summary: subtotal, shipping estimate, total.
3. Update quantity: PUT /api/cart/[itemIndex] { quantity }; remove: DELETE /api/cart/[itemIndex].
4. Proceed to Checkout → /checkout.

**Postconditions:** Cart persisted; header cart count updated.

---

### UC-2: Checkout (guest or user)

**Description:** Step-based checkout: Auth (optional sign-in or guest), Shipping address, Review order, Place order (COD only).

**Preconditions:** Cart has items (or order built from session cart).

**Main flow:**
1. Step 1: Auth — sign in with Google or continue as guest.
2. Step 2: Shipping — form (fullName, phone, street, city, state, postalCode, country); validate.
3. Step 3: Review — show items, address, subtotal, shipping, total; payment COD.
4. Step 4: Place order — POST /api/orders { items, shippingAddress }; order created; stock decremented; cart cleared if user; redirect to confirmation.
5. Confirmation: show order number and message.

**Alternative flow (guest):** userId null in order; contact in shippingAddress.

**Postconditions:** Order in MongoDB; order in "My Orders" for user; no order delete.

---

### UC-3: View order history and detail

**Description:** User sees list of orders; opens order detail; optional reorder or invoice download (placeholder).

**Preconditions:** Session.

**Main flow:**
1. Open /account/orders; GET /api/orders returns list (orderNumber, date, total, orderStatus).
2. Click View → /account/orders/[id]; fetch order detail (items snapshot, shipping, summary).
3. Reorder / Invoice: placeholder or link (Phase 9).

**Postconditions:** User can track orders; no password change from this UI.

---

### UC-4: Manage account and wishlist

**Description:** User views profile (name, email); accesses order shortcuts; manages wishlist (add, remove, move to cart).

**Preconditions:** Session.

**Main flow:**
1. /account — profile from session; links to Order History, Wishlist, Logout.
2. /account/wishlist — GET /api/wishlist; grid of products; Remove → DELETE /api/wishlist/[productId]; Add to Cart → /products/[slug] or cart API.

**Postconditions:** No admin password edit from user UI.
