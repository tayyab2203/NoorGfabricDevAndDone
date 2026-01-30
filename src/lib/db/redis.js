const TTL = {
  PRODUCT: 24 * 60 * 60,
  COLLECTION: 48 * 60 * 60,
  CART: 30 * 24 * 60 * 60,
  SESSION: 7 * 24 * 60 * 60,
};

import Redis from "ioredis";

let client = null;

function getRedisClient() {
  if (!process.env.REDIS_URL) {
    return null;
  }
  if (client) {
    return client;
  }
  try {
    client = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
    return client;
  } catch (e) {
    return null;
  }
}

async function get(key) {
  const redis = getRedisClient();
  if (!redis) return null;
  try {
    const val = await redis.get(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

async function set(key, value, ttlSeconds) {
  const redis = getRedisClient();
  if (!redis) return false;
  try {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await redis.setex(key, ttlSeconds, serialized);
    } else {
      await redis.set(key, serialized);
    }
    return true;
  } catch {
    return false;
  }
}

async function del(key) {
  const redis = getRedisClient();
  if (!redis) return false;
  try {
    await redis.del(key);
    return true;
  } catch {
    return false;
  }
}

/** Delete all keys matching pattern (e.g. "products:list:*"). Use for cache invalidation. */
async function delPattern(pattern) {
  const redis = getRedisClient();
  if (!redis) return false;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
    return true;
  } catch {
    return false;
  }
}

export { getRedisClient, get, set, del, delPattern, TTL };
