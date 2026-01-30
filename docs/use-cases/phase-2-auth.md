# Phase 2 – Authentication: Use Cases

**Module:** Authentication  
**Requirements ref:** §2 NextAuth, §9 Security

## Actors

- **Guest:** Unauthenticated visitor
- **User:** Authenticated customer (role USER)
- **Admin / Manager:** Authenticated staff (role ADMIN or MANAGER)
- **System:** NextAuth (Credentials), MongoDB User collection

## Use Cases

### UC-1: Sign in with email and password

**Description:** User signs in using email and password; credentials are verified against MongoDB and session is established.

**Preconditions:** NEXTAUTH_SECRET and NEXTAUTH_URL set. At least one user exists in DB (e.g. admin from seed).

**Main flow:**
1. User navigates to /login (or /admin and is redirected to /login).
2. User enters email and password and submits.
3. NextAuth Credentials provider authorize(): connect DB, find User by email, select password, verify with bcrypt.
4. If valid: return user object (id, email, name, role). jwt callback stores userId, role, email in token.
5. session callback exposes userId, role, email to client session.
6. User is redirected to callbackUrl (e.g. /admin) with session established.

**Postconditions:** Session contains userId, role, email.

---

### UC-2: Access admin area

**Description:** Only users with role ADMIN or MANAGER can access /admin; others are redirected to /login.

**Preconditions:** Middleware runs on every request matching /admin and /admin/*.

**Main flow:**
1. Request to /admin or /admin/*.
2. Middleware runs; auth() provides session.
3. If no session: redirect to /login?callbackUrl=/admin.
4. If session.user.role not in [ADMIN, MANAGER]: redirect to /login?error=Forbidden.
5. Otherwise: allow request (NextResponse.next()).

**Postconditions:** Admin pages are only reachable by ADMIN/MANAGER; others are sent to login.

---

### UC-3: Use session in API routes

**Description:** API routes can require auth or admin via auth(), requireAuth(), requireAdmin().

**Preconditions:** Handler is wrapped with requireAuth or requireAdmin, or calls auth() directly.

**Main flow:**
1. Request hits API route.
2. auth() returns session (from JWT/cookie).
3. requireAuth: if no session, return 401 Unauthorized.
4. requireAdmin: if no session return 401; if role not ADMIN/MANAGER return 403 Forbidden.
5. Handler runs with session in context.

**Postconditions:** Protected APIs return 401/403 when unauthorized; session available for business logic.
