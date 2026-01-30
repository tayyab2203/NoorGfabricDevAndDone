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

## Environment variables

- **MONGODB_URI** – Required.
- **NEXTAUTH_SECRET** – Required for auth.
- **GOOGLE_CLIENT_ID** / **GOOGLE_CLIENT_SECRET** – For Google OAuth.
- **CORS_ORIGIN** – Optional; allowed origin for API CORS.
- **RESEND_API_KEY** – Optional; for order confirmation emails.
- **BLOB_READ_WRITE_TOKEN** – Required for image uploads (Collections, Products). Create a Blob store in Vercel Dashboard → Storage → Blob, then add the token to env.
