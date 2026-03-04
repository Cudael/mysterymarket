import { describe, it, expect, vi, afterEach } from 'vitest';
import { trackEvent } from '../analytics';

describe('trackEvent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs analytics events with payload', () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

    trackEvent('idea_viewed', { ideaId: 'idea_123', viewerId: 'user_456' });

    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy.mock.calls[0][0]).toContain('analytics.event');
    expect(infoSpy.mock.calls[0][0]).toContain('idea_viewed');
    expect(infoSpy.mock.calls[0][0]).toContain('idea_123');
  });
});
