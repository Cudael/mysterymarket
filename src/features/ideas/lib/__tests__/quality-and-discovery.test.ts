import { describe, expect, it, vi } from "vitest";
import {
  getPublishValidationIssues,
  hasStructuredPreview,
} from "@/features/ideas/lib/quality";
import { scoreRelatedIdea, scoreRisingIdea } from "@/features/ideas/lib/discovery";

describe("idea quality helpers", () => {
  it("requires publish-ready trust and preview details", () => {
    const issues = getPublishValidationIssues({
      title: "Short",
      teaserText: "Too brief",
      hiddenContent: "Not enough detail yet",
      category: "",
      originalityConfirmed: false,
      whatYoullGet: "",
      bestFitFor: "",
      implementationNotes: "",
    });

    expect(issues.map((issue) => issue.path[0])).toEqual([
      "title",
      "teaserText",
      "hiddenContent",
      "category",
      "originalityConfirmed",
      "whatYoullGet",
    ]);
  });

  it("detects when any structured preview field is strong enough", () => {
    expect(
      hasStructuredPreview({
        whatYoullGet: "Detailed execution plan with positioning, channel, and launch steps.",
      })
    ).toBe(true);
    expect(
      hasStructuredPreview({
        whatYoullGet: "Too short",
        bestFitFor: "",
        implementationNotes: "",
      })
    ).toBe(false);
  });
});

describe("idea discovery scoring", () => {
  const now = new Date("2026-03-17T00:00:00.000Z");

  it("prioritizes related ideas with stronger overlap", () => {
    vi.useFakeTimers();
    vi.setSystemTime(now);

    const reference = {
      category: "AI & Automation",
      subcategoryId: "agents",
      tags: ["automation", "agent", "ops"],
      createdAt: now,
    };

    const strongMatch = scoreRelatedIdea(reference, {
      category: "AI & Automation",
      subcategoryId: "agents",
      tags: ["automation", "agent"],
      createdAt: new Date("2026-03-15T00:00:00.000Z"),
      _count: { purchases: 3, reviews: 2 },
    });

    const weakMatch = scoreRelatedIdea(reference, {
      category: "Creative & Content",
      subcategoryId: null,
      tags: ["writing"],
      createdAt: new Date("2026-02-01T00:00:00.000Z"),
      _count: { purchases: 0, reviews: 0 },
    });

    expect(strongMatch).toBeGreaterThan(weakMatch);

    vi.useRealTimers();
  });

  it("gives rising ideas more credit for momentum and freshness", () => {
    vi.useFakeTimers();
    vi.setSystemTime(now);

    const hot = scoreRisingIdea({
      createdAt: new Date("2026-03-16T00:00:00.000Z"),
      originalityConfirmed: true,
      _count: { purchases: 4, reviews: 2 },
    });

    const stale = scoreRisingIdea({
      createdAt: new Date("2026-02-10T00:00:00.000Z"),
      originalityConfirmed: false,
      _count: { purchases: 1, reviews: 0 },
    });

    expect(hot).toBeGreaterThan(stale);

    vi.useRealTimers();
  });
});
