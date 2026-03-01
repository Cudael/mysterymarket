import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from '../sanitize';

describe('sanitizeHtml', () => {
  it('passes plain text through unchanged', () => {
    expect(sanitizeHtml('Hello, world!')).toBe('Hello, world!');
  });

  it('removes script tags and their content', () => {
    const result = sanitizeHtml('<script>alert("xss")</script>Safe text');
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
    expect(result).toContain('Safe text');
  });

  it('removes onclick handlers', () => {
    const result = sanitizeHtml('<div onclick="evil()">click me</div>');
    expect(result).not.toContain('onclick');
    expect(result).not.toContain('evil()');
  });

  it('strips all HTML tags leaving only text content', () => {
    // The sanitizer is configured with ALLOWED_TAGS: [] so all tags are stripped
    const result = sanitizeHtml('<p>Hello</p><b>world</b>');
    expect(result).not.toContain('<p>');
    expect(result).not.toContain('<b>');
    expect(result).toContain('Hello');
    expect(result).toContain('world');
  });

  it('handles empty string', () => {
    expect(sanitizeHtml('')).toBe('');
  });

  it('handles undefined input gracefully', () => {
    expect(sanitizeHtml(undefined as unknown as string)).toBe('');
  });

  it('handles null input gracefully', () => {
    expect(sanitizeHtml(null as unknown as string)).toBe('');
  });

  it('removes nested script tags', () => {
    const result = sanitizeHtml('<script><script>alert(1)</script></script>');
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
  });
});
