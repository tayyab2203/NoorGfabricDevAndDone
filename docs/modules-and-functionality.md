# Noor G Fabrics – Modules & Functionality

This document lists every module and functionality in the Noor G Fabrics e‑commerce project.

---

## 1. Overview

- **Stack:** Next.js (App Router), React, MongoDB (Mongoose), NextAuth, Vercel (Blob for uploads, optional Redis).
- **Audience:** Customers (storefront), Admins/Managers (admin panel).

---

## 2. Public Storefront (Pages & UI)

### 2.1 Home (`/`)
- **Hero section** – Full-bleed video background, overlay, headline and CTA.
- **Featured collections** – Grid of collection cards linking to `/collection/[slug]`.
- **Bestsellers** – Products from `GET /api/products/bestsellers`.
- **Newsletter signup** – Form posting to `POST /api/newsletter`.
- **Testimonials** – Static or placeholder testimonial block.

### 2.2 Collections
- **List** (`/collections`) – All collections from `GET /api/collections`.
- **Collection detail** (`/collection/[slug]`) – Products in a collection via `GET /api/collections/[slug]`; `CollectionProducts` component.

### 2.3 Products
- **All products** (`/products`) – Product listing (uses products API).
- **Product detail** (`/products/[slug]`) – Single product from `GET /api/products` (by slug); `ProductDetailClient` for add-to-cart, variant selection; **reviews** – list (approved only) and submit (signed-in only) via `GET/POST /api/products/[id]/reviews`.

### 2.4 Search (`/search`)
- **Search results** – Query param `q`; `GET /api/products/search?q=...`; `SearchResults` component.

### 2.5 Cart (`/cart`)
- **Cart page** – `CartContent` shows items from `GET /api/cart`; update quantity / remove via `PATCH/DELETE /api/cart/[itemId]`; **guest cart** supported via cookie `cart_guest_id`; **merge** guest cart into user cart on login.

### 2.6 Checkout (`/checkout`)
- **Checkout flow** (steps): **Auth** (sign in with Google or email/password), **Shipping** (address form), **Review** (cart summary, shipping, total), **Confirmation** (order number).
- **Place order** – `POST /api/orders` with items and shipping address; **COD** only; free shipping over threshold (e.g. 5000); order confirmation email stub (`sendOrderConfirmationEmail`); **guest cart cleared** after order.

### 2.7 Account (signed-in only)
- **Account home** (`/account`) – Links to orders and wishlist.
- **Order history** (`/account/orders`) – List from `GET /api/orders`; `OrderHistory` component.
- **Order detail** (`/account/orders/[id]`) – Single order from `GET /api/orders/[id]`.
- **Wishlist** (`/account/wishlist`) – List from `GET /api/wishlist`; add/remove via `POST/DELETE /api/wishlist/[productId]`; `WishlistContent` component.

### 2.8 Other pages
- **About** (`/about`) – Static about page.
- **Contact** (`/contact`) – Contact form; submits to `POST /api/contact` (name, email, subject, message); rate limited (e.g. 20/min per IP).
- **Login** (`/login`) – NextAuth sign-in (Google + credentials); `LoginForm`; supports `callbackUrl` and `error` query params.
- **404** – `not-found.js` for unknown routes.

---

## 3. Layout & Shared UI

- **Header** – Logo, nav (Home, Collections dropdown, Products, About, Contact), cart link, account/login; responsive.
- **Footer** – Links, newsletter signup, styling (e.g. gradient).
- **Logo** – `Logo.jsx` (brand link).
- **ConditionalLayout** – Wraps pages where needed.
- **Providers** – NextAuth `SessionProvider`, React Query `QueryClientProvider`, etc.

---

## 4. Public API Routes

| Method | Route | Functionality |
|--------|-------|----------------|
| GET | `/api/collections` | List all collections (cached for admin when Redis available). |
| GET | `/api/collections/[slug]` | Single collection by slug with products. |
| GET | `/api/products` | List products; optional query (slug, collection, etc.). |
| GET | `/api/products/bestsellers` | Bestseller products. |
| GET | `/api/products/search` | Search products by query `q`. |
| GET | `/api/products/[id]` | Single product by ID. |
| GET | `/api/products/[id]/reviews` | Approved reviews for product. |
| POST | `/api/products/[id]/reviews` | Submit review (rating 1–5, optional comment); requires sign-in; one review per user per product; status PENDING until admin approves. |
| GET | `/api/cart` | Get cart (by session user or guest cookie); merge guest→user on first GET when logged in. |
| POST | `/api/cart` | Add item(s) to cart; create cart if needed (guest or user). |
| PATCH | `/api/cart/[itemId]` | Update quantity of cart line. |
| DELETE | `/api/cart/[itemId]` | Remove line from cart. |
| GET | `/api/orders` | List current user’s orders (auth required). |
| GET | `/api/orders/[id]` | Single order for current user (auth required). |
| POST | `/api/orders` | Create order (items + shippingAddress); auth optional (guest checkout); validates stock; COD; clears guest cart; calls order confirmation email stub. |
| GET | `/api/wishlist` | List wishlist (auth required). |
| POST | `/api/wishlist/[productId]` | Add product to wishlist (auth required). |
| DELETE | `/api/wishlist/[productId]` | Remove from wishlist (auth required). |
| POST | `/api/contact` | Submit contact message; validation; rate limit (e.g. 20/min per IP); stored in `ContactMessage` collection. |
| POST | `/api/newsletter` | Subscribe email; consent required; rate limit; stored in `Newsletter`; idempotent (already subscribed returns success). |
| GET | `/api/health` | Health check: MongoDB (and optional Redis); returns 503 if DB unavailable. |
| All | `/api/auth/[...nextauth]` | NextAuth handlers (sign in, sign out, session, callbacks). |

---

## 5. Admin Panel

**Access:** Middleware restricts `/admin` and `/admin/*` to signed-in users with role `ADMIN` or `MANAGER`; otherwise redirect to login (with `callbackUrl` and optional `error=Forbidden`).

### 5.1 Admin layout & shell
- **Layout** (`/admin/layout.js`) – Wraps all admin pages.
- **Admin shell** – Sidebar/nav: Dashboard, Collections, Products, Orders, Users, Reviews, Reports, Settings.

### 5.2 Dashboard (`/admin`)
- **AdminDashboard** – Summary cards/stats (e.g. from `GET /api/admin/dashboard`).

### 5.3 Collections (`/admin/collections`)
- **List** – `AdminCollectionsList`; `GET /api/admin/collections` (cached); create/edit/delete.
- **New** (`/admin/collections/new`) – `AdminCollectionForm`; `POST /api/admin/collections`.
- **Edit** (`/admin/collections/[id]/edit`) – Same form; `GET/PATCH /api/admin/collections/[id]`; image upload via `POST /api/upload`.

### 5.4 Products (`/admin/products`)
- **List** – `AdminProductsList`; `GET /api/admin/products` (cached); create/edit/delete.
- **New** (`/admin/products/new`) – `AdminProductForm`; `POST /api/admin/products`; upload via `/api/upload`.
- **Edit** (`/admin/products/[id]/edit`) – Same form; `GET/PATCH /api/admin/products/[id]`.

### 5.5 Orders (`/admin/orders`)
- **List** – `AdminOrdersList`; `GET /api/admin/orders` (filter, pagination if applicable).
- **Detail** (`/admin/orders/[id]`) – `AdminOrderDetail`; `GET /api/admin/orders/[id]`; update status via `PATCH /api/admin/orders/[id]`.

### 5.6 Users (`/admin/users`)
- **List** – `AdminUsersList`; `GET /api/admin/users`; filters/search; toggle user status.
- **Detail** (`/admin/users/[id]`) – `AdminUserDetail`; `GET/PATCH /api/admin/users/[id]` (status, role).

### 5.7 Reviews (`/admin/reviews`)
- **List** – `AdminReviewsList`; `GET /api/admin/reviews`; approve/reject/delete; `PATCH /api/admin/reviews/[id]` (status), `DELETE /api/admin/reviews/[id]`.

### 5.8 Reports (`/admin/reports`)
- **AdminReports** – Date range (today/week/month); `GET /api/admin/reports?range=...&format=json|csv`; sales summary (revenue, order count, avg order, shipping); product performance (top by quantity/revenue); **CSV export** (`format=csv`).

### 5.9 Settings (`/admin/settings`)
- **AdminSettingsForm** – Store settings form; `GET /api/admin/settings`, `PUT /api/admin/settings`; persisted in `Settings` model.

---

## 6. Admin API Routes

All require admin (or manager) role via `requireAdmin`.

| Method | Route | Functionality |
|--------|-------|----------------|
| GET | `/api/admin/dashboard` | Dashboard stats. |
| GET | `/api/admin/collections` | List collections (cache invalidation on write). |
| POST | `/api/admin/collections` | Create collection. |
| GET | `/api/admin/collections/[id]` | Single collection. |
| PATCH | `/api/admin/collections/[id]` | Update collection. |
| DELETE | `/api/admin/collections/[id]` | Delete collection. |
| GET | `/api/admin/products` | List products (cache invalidation on write). |
| POST | `/api/admin/products` | Create product. |
| GET | `/api/admin/products/[id]` | Single product. |
| PATCH | `/api/admin/products/[id]` | Update product. |
| DELETE | `/api/admin/products/[id]` | Delete product. |
| GET | `/api/admin/orders` | List orders (admin). |
| GET | `/api/admin/orders/[id]` | Single order. |
| PATCH | `/api/admin/orders/[id]` | Update order (e.g. status). |
| GET | `/api/admin/users` | List users; filters. |
| GET | `/api/admin/users/[id]` | Single user. |
| PATCH | `/api/admin/users/[id]` | Update user (status, role). |
| GET | `/api/admin/reviews` | List all reviews (moderation). |
| PATCH | `/api/admin/reviews/[id]` | Set review status (e.g. APPROVED, REJECTED). |
| DELETE | `/api/admin/reviews/[id]` | Delete review. |
| GET | `/api/admin/reports` | Sales report; range + optional CSV export. |
| GET | `/api/admin/settings` | Get store settings. |
| PUT | `/api/admin/settings` | Update store settings. |
| POST | `/api/upload` | Upload image (admin only); Vercel Blob; max 4 MB; JPEG/PNG/WebP/GIF; returns URL. |

---

## 7. Authentication & Authorization

- **NextAuth** – Providers: **Google OAuth** (with optional email linking), **Credentials** (email + password, bcrypt); JWT + session callbacks; `findOrCreateOAuthUser` for Google (creates USER if new).
- **Roles** – `USER`, `ADMIN`, `MANAGER`; admin routes and `/admin` UI require `ADMIN` or `MANAGER`.
- **Middleware** – Protects `/admin` and `/admin/*`: redirect to `/login` if not signed in; redirect with `error=Forbidden` if role not admin/manager.
- **Session** – `GET /api/auth/session` used by frontend; cart merge (guest→user) on first authenticated cart request.

---

## 8. Data Models (MongoDB / Mongoose)

| Model | Purpose |
|-------|---------|
| **User** | Email, fullName, password (optional for OAuth), role, status (e.g. ACTIVE). |
| **Address** | Reusable address subdoc / model if used. |
| **Collection** | Name, slug, description, image, ordering; products linked by collection ref or slug. |
| **Product** | Name, slug, description, price, salePrice, images, variants (SKU, stock), collection ref, etc. |
| **Cart** | userId (optional), guestSessionId (optional), items (productId, variantSKU, quantity), expiresAt; partial unique indexes for userId and guestSessionId; TTL on expiresAt. |
| **Order** | orderNumber, userId (optional), items (productId, variantSKU, nameSnapshot, priceSnapshot, quantity), shippingAddress, paymentMethod (COD), subtotal, shippingFee, totalAmount, orderStatus; timestamps. |
| **Review** | productId, userId, rating, comment, status (PENDING, APPROVED, REJECTED). |
| **Wishlist** | User wishlist (e.g. userId + productIds or per-item docs). |
| **ContactMessage** | name, email, subject, message; from contact form. |
| **Newsletter** | email, consent; unique email. |
| **Settings** | Store-wide settings (key/value or structured). |
| **Category** | Used if categories are separate from collections. |

---

## 9. Libraries & Utilities

- **`lib/db/mongoose.js`** – `connectDB()`; single cached connection; used by all DB-backed API routes.
- **`lib/db/redis.js`** – Optional Redis client; used for admin collections/products cache and invalidation.
- **`lib/auth.js`** – NextAuth config; `requireAdmin` wrapper for admin API routes; `findOrCreateOAuthUser`.
- **`lib/apiResponse.js`** – `success()` / `error()` helpers for JSON responses.
- **`lib/rateLimit.js`** – In-memory rate limit: `rateLimitCheck(key, limit, windowMs)`, `getClientId(request)`; used by contact and newsletter (e.g. 20 req/min per IP).
- **`lib/email.js`** – `sendOrderConfirmationEmail(order, customerEmail)` stub; logs only unless RESEND (or other) is configured.
- **`lib/logger.js`** – Logger for API errors / info.
- **`lib/validators/*`** – Zod schemas: address, cart (addToCart), collection, order (createOrder), product, review; used in API routes.

---

## 10. Configuration & Environment

- **MONGODB_URI** – Required for all DB features; missing causes 503 on public APIs (cart, collections, products).
- **NEXTAUTH_SECRET**, **NEXTAUTH_URL** – Required for auth.
- **GOOGLE_CLIENT_ID**, **GOOGLE_CLIENT_SECRET** – For Google sign-in.
- **BLOB_READ_WRITE_TOKEN** – Vercel Blob for admin image uploads.
- **CORS_ORIGIN** – Optional; CORS headers for API (see `next.config.mjs`).
- **RESEND_API_KEY** – Optional; for real order confirmation emails.

---

## 11. Security & Production

- **Rate limiting** – Contact and newsletter: 20 requests per minute per IP (in-memory).
- **CORS** – Configurable via `CORS_ORIGIN`.
- **Health check** – `GET /api/health` for monitoring; returns 503 if MongoDB fails.
- **Guest cart** – Cookie-based `cart_guest_id`; HttpOnly, SameSite, Secure in production.

---

## 12. File Structure Summary

- **Pages:** `src/app/**/page.js` (and `layout.js`, `not-found.js`).
- **API routes:** `src/app/api/**/route.js`.
- **Components:** `src/components/**` (account, admin, cart, checkout, collection, home, layout, product, providers, search).
- **Models:** `src/models/*.js`.
- **Lib:** `src/lib/*.js` and `src/lib/validators/*.js`, `src/lib/db/*.js`.
- **Middleware:** `src/middleware.js` (admin protection).

This document reflects the codebase as of the last update; for deployment and env details see `docs/deployment.md`.
