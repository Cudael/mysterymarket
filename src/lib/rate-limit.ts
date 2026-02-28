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

// Periodically purge expired entries to prevent unbounded memory growth
function purgeExpired(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

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

export function checkRateLimit(key: string, config: RateLimitConfig): void {
  if (!rateLimit(key, config)) {
    throw new Error("Too many requests. Please try again later.");
  }
}
