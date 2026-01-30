# Phase 1 – Foundation: Use Cases

**Module:** Project Foundation  
**Requirements ref:** §2 Tech Stack, §3 Architecture

## Actors

- **System:** Next.js app, MongoDB, Redis (optional in dev)
- **Developer:** Configures env, runs app

## Use Cases

### UC-1: Load application with environment configuration

**Description:** Application starts using environment variables for database and optional Redis.

**Preconditions:** `.env.local` (or env) may define `MONGODB_URI`, `REDIS_URL`.

**Main flow:**
1. Application starts.
2. Next.js loads env.
3. Root layout renders with providers (React Query, SessionProvider).
4. Header and Footer render with Noor G Fabrics brand colors.

**Postconditions:** App is runnable; UI shell is visible.

---

### UC-2: Check system health (API)

**Description:** Caller requests health status to verify MongoDB and Redis connectivity.

**Preconditions:** None.

**Main flow:**
1. Client sends `GET /api/health`.
2. Handler checks `MONGODB_URI`; if missing, returns status with `mongodb: "missing_config"`.
3. If `MONGODB_URI` set, handler calls `connectDB()`; on success sets `mongodb: "connected"`.
4. Handler checks Redis client; sets `redis: "connected"` or `"skipped"`.
5. Handler returns JSON `{ success: true, data: { ok, mongodb, redis } }`.

**Alternative flow (DB error):** If `connectDB()` throws, return 503 with `ok: false`, `mongodb: "error"`.

**Postconditions:** Client receives consistent JSON response; no sensitive data in response.

---

### UC-3: Render public layout with brand design

**Description:** User opens any public page and sees Header, main content, Footer with Noor G Fabrics palette.

**Preconditions:** App is running.

**Main flow:**
1. User requests a page (e.g. `/`).
2. Root layout wraps children with Providers, Header, main, Footer.
3. Header shows logo, nav (Home, Collections, About, Contact), Cart CTA in gold.
4. Footer shows links, newsletter placeholder, trust note in sage.
5. Page content renders in main area.

**Postconditions:** Brand colors (#333333, #C4A747, #F5F3EE, #5BA383) applied; layout consistent.
