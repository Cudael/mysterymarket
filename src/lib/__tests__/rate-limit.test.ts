import { describe, it, expect } from 'vitest';
import { rateLimit, checkRateLimit } from '../rate-limit';

describe('rateLimit', () => {
  it('allows requests within the limit', () => {
    const key = `test-allow-${Date.now()}`;
    const config = { interval: 60000, maxRequests: 3 };

    expect(rateLimit(key, config)).toBe(true);
    expect(rateLimit(key, config)).toBe(true);
    expect(rateLimit(key, config)).toBe(true);
  });

  it('blocks the request exceeding the limit', () => {
    const key = `test-block-${Date.now()}`;
    const config = { interval: 60000, maxRequests: 2 };

    expect(rateLimit(key, config)).toBe(true);
    expect(rateLimit(key, config)).toBe(true);
    expect(rateLimit(key, config)).toBe(false);
  });

  it('resets after the interval expires', async () => {
    const key = `test-reset-${Date.now()}`;
    const config = { interval: 50, maxRequests: 1 };

    expect(rateLimit(key, config)).toBe(true);
    expect(rateLimit(key, config)).toBe(false);

    // Wait for the interval to expire
    await new Promise((resolve) => setTimeout(resolve, 60));

    expect(rateLimit(key, config)).toBe(true);
  });

  it('isolates different keys', () => {
    const ts = Date.now();
    const config = { interval: 60000, maxRequests: 1 };

    expect(rateLimit(`key-a-${ts}`, config)).toBe(true);
    expect(rateLimit(`key-b-${ts}`, config)).toBe(true);
    expect(rateLimit(`key-a-${ts}`, config)).toBe(false);
    expect(rateLimit(`key-b-${ts}`, config)).toBe(false);
  });
});

describe('checkRateLimit', () => {
  it('does not throw when under the limit', () => {
    const key = `check-ok-${Date.now()}`;
    const config = { interval: 60000, maxRequests: 5 };

    expect(() => checkRateLimit(key, config)).not.toThrow();
  });

  it('throws when the limit is exceeded', () => {
    const key = `check-fail-${Date.now()}`;
    const config = { interval: 60000, maxRequests: 1 };

    checkRateLimit(key, config); // first call succeeds
    expect(() => checkRateLimit(key, config)).toThrow('Too many requests');
  });
});
