// Simple rate limiter for server actions
// Uses in-memory Map (sufficient for development and single-instance deployments)
// NOTE: In serverless environments (e.g. Vercel), multiple concurrent function instances
// each maintain their own memory. For production at scale, swap to Redis (Upstash).

interface RateLimitConfig {
  interval: number; // ms
  maxRequests: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

/** Removes expired entries from the rate-limit map to prevent unbounded memory growth. */
function purgeExpired(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

/**
 * Checks whether the given key is within its rate limit.
 * @param key - A unique identifier for the caller (e.g., userId or IP).
 * @param config - Rate-limit configuration: interval (ms) and maxRequests.
 * @returns `true` if the request is allowed, `false` if the limit has been exceeded.
 */
export function rateLimit(key: string, config: RateLimitConfig): boolean {
  const now = Date.now();

  // Purge stale entries occasionally (every ~100 checks)
  if (Math.random() < 0.01) {
    purgeExpired();
  }

  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + config.interval });
    return true;
  }

  if (entry.count >= config.maxRequests) {
    return false;
  }

  entry.count += 1;
  return true;
}

/**
 * Enforces the rate limit for the given key, throwing an error if exceeded.
 * @param key - A unique identifier for the caller (e.g., userId or IP).
 * @param config - Rate-limit configuration: interval (ms) and maxRequests.
 * @throws {Error} When the rate limit is exceeded.
 */
export function checkRateLimit(key: string, config: RateLimitConfig): void {
  if (!rateLimit(key, config)) {
    throw new Error("Too many requests. Please try again later.");
  }
}
