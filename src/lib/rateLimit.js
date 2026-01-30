/**
 * In-memory rate limiter. For production with multiple instances, use Redis.
 * Usage: if (!rateLimitCheck(key, limit, windowMs)) return 429.
 */
const store = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute

function cleanup() {
  const now = Date.now();
  for (const [key, data] of store.entries()) {
    if (now - data.start > data.windowMs) store.delete(key);
  }
}

export function rateLimitCheck(key, limit = 20, windowMs = WINDOW_MS) {
  if (store.size > 10000) cleanup();
  const now = Date.now();
  const entry = store.get(key);
  if (!entry) {
    store.set(key, { count: 1, start: now, windowMs });
    return true;
  }
  if (now - entry.start > entry.windowMs) {
    entry.count = 1;
    entry.start = now;
    return true;
  }
  entry.count++;
  return entry.count <= limit;
}

export function getClientId(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}
