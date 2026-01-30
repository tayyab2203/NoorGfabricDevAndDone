# Deployment & Phase 10 (Production)

## Health check

- **GET /api/health** – Returns `{ ok, mongodb, redis }`. Use for load balancer health checks. Returns 503 if MongoDB fails.

## Rate limiting

- **Contact & Newsletter** – 20 requests per minute per IP (in-memory). For multi-instance production, replace `src/lib/rateLimit.js` with a Redis-backed limiter.
- **Auth** – Consider rate limiting login attempts (e.g. 100 req/min) at your auth provider or via middleware.

## CORS

- Set **CORS_ORIGIN** in env to allow cross-origin API requests. If unset, no CORS headers are added (same-origin only).

## Order confirmation email

- After placing an order, `sendOrderConfirmationEmail()` in `src/lib/email.js` is called. Configure **RESEND_API_KEY** (or your provider) and implement the send in `src/lib/email.js` to send real emails.

## Environment variables (Vercel)

**Set these in Vercel Dashboard → Project → Settings → Environment Variables** for production. Without **MONGODB_URI**, public APIs (collections, cart, products) return 503.

- **MONGODB_URI** – **Required.** Your MongoDB connection string (e.g. Atlas). If missing, `/api/collections`, `/api/cart`, `/api/products` return 503.
- **NEXTAUTH_SECRET** – Required for auth.
- **GOOGLE_CLIENT_ID** / **GOOGLE_CLIENT_SECRET** – For Google OAuth.
- **CORS_ORIGIN** – Optional; allowed origin for API CORS.
- **RESEND_API_KEY** – Optional; for order confirmation emails.
- **BLOB_READ_WRITE_TOKEN** – Required for image uploads (Collections, Products). Create a Blob store in Vercel Dashboard → Storage → Blob, then add the token to env.

## Troubleshooting 500 / 503 in production

If `/api/collections`, `/api/cart`, or `/api/products` return **500** or **503** on Vercel:

1. **Set MONGODB_URI** in Vercel → Project → Settings → Environment Variables (for Production). Use your MongoDB connection string (e.g. from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).
2. **MongoDB Atlas**: In Atlas → Network Access, add **0.0.0.0/0** (allow from anywhere) so Vercel’s servers can connect. Or add [Vercel’s IP ranges](https://vercel.com/docs/security/ip-addresses) if you prefer to restrict.
3. **Set NEXTAUTH_URL** to your production URL, e.g. `https://noor-gfabric-dev-and-done.vercel.app`, and **NEXTAUTH_SECRET** to any long random string.
4. **Redeploy** after changing env vars (Vercel uses env at build/runtime; a new deployment may be needed).
5. Check **Vercel → Deployments → [latest] → Functions** (or Runtime Logs) for the actual error message (e.g. connection timeout, auth failed).
