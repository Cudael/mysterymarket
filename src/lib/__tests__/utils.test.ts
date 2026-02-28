import { describe, it, expect } from 'vitest';
import { cn, formatPrice, absoluteUrl } from '../utils';

describe('cn', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });
  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });
  it('handles tailwind conflicts', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });
});

describe('formatPrice', () => {
  it('formats cents to dollar string', () => {
    expect(formatPrice(999)).toBe('$9.99');
  });
  it('formats zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });
  it('formats large amounts', () => {
    expect(formatPrice(100000)).toBe('$1,000.00');
  });
});

describe('absoluteUrl', () => {
  it('constructs absolute URL from path', () => {
    const url = absoluteUrl('/test');
    expect(url).toContain('/test');
    expect(url).toMatch(/^https?:\/\//);
  });
});
