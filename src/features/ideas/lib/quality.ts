export const IDEA_TITLE_QUALITY_MIN = 10;
export const IDEA_TEASER_PUBLISH_MIN = 60;
export const IDEA_HIDDEN_CONTENT_PUBLISH_MIN = 150;
export const IDEA_STRUCTURED_PREVIEW_MIN = 24;

export interface IdeaQualityInput {
  title?: string | null;
  teaserText?: string | null;
  teaserImageUrl?: string | null;
  hiddenContent?: string | null;
  hiddenContentType?: string | null;
  hiddenFileUrl?: string | null;
  hiddenLinkUrl?: string | null;
  category?: string | null;
  priceInCents?: number | null;
  originalityConfirmed?: boolean | null;
  whatYoullGet?: string | null;
  bestFitFor?: string | null;
  implementationNotes?: string | null;
}

export interface IdeaValidationIssue {
  path: Array<
    | "title"
    | "teaserText"
    | "hiddenContent"
    | "hiddenFileUrl"
    | "hiddenLinkUrl"
    | "category"
    | "originalityConfirmed"
    | "whatYoullGet"
    | "bestFitFor"
    | "implementationNotes"
  >;
  message: string;
}

export function hasStructuredPreview(input: IdeaQualityInput) {
  return [input.whatYoullGet, input.bestFitFor, input.implementationNotes].some(
    (value) => (value?.trim().length ?? 0) >= IDEA_STRUCTURED_PREVIEW_MIN
  );
}

function hasHiddenContent(input: IdeaQualityInput): boolean {
  const type = input.hiddenContentType ?? "TEXT";
  if (type === "FILE") return !!input.hiddenFileUrl;
  if (type === "LINK") return !!input.hiddenLinkUrl;
  return (input.hiddenContent?.trim().length ?? 0) >= IDEA_HIDDEN_CONTENT_PUBLISH_MIN;
}

export function getIdeaQualityItems(input: IdeaQualityInput) {
  const price = input.priceInCents ?? 0;

  return [
    {
      label: "Compelling title",
      met: (input.title?.trim().length ?? 0) >= IDEA_TITLE_QUALITY_MIN,
      hint: `Aim for ${IDEA_TITLE_QUALITY_MIN}+ characters with a clear outcome`,
    },
    {
      label: "Teaser builds curiosity",
      met: (input.teaserText?.trim().length ?? 0) >= IDEA_TEASER_PUBLISH_MIN,
      hint: `${IDEA_TEASER_PUBLISH_MIN}+ characters usually converts better`,
    },
    {
      label: "Teaser image added",
      met: Boolean(input.teaserImageUrl),
      hint: "Optional, but a strong visual can lift click-through",
    },
    {
      label: "Buyer gets enough detail",
      met: hasHiddenContent(input),
      hint: `Add text (${IDEA_HIDDEN_CONTENT_PUBLISH_MIN}+ chars), upload a file, or provide a link`,
    },
    {
      label: "Category selected",
      met: Boolean(input.category?.trim()),
      hint: "Helps discovery and recommendation quality",
    },
    {
      label: "Structured preview added",
      met: hasStructuredPreview(input),
      hint: "Add What you'll get, Best fit for, or Notes",
    },
    {
      label: "Originality attested",
      met: Boolean(input.originalityConfirmed),
      hint: "Required before buyers can see a public trust signal",
    },
    {
      label: "Price is clear",
      met: price >= 99 && price <= 100000,
      hint: "Set a price between $0.99 and $1,000",
    },
  ];
}

export function getPublishValidationIssues(
  input: IdeaQualityInput
): IdeaValidationIssue[] {
  const issues: IdeaValidationIssue[] = [];

  if ((input.title?.trim().length ?? 0) < IDEA_TITLE_QUALITY_MIN) {
    issues.push({
      path: ["title"],
      message: `Use a clearer title with at least ${IDEA_TITLE_QUALITY_MIN} characters before publishing.`,
    });
  }

  if ((input.teaserText?.trim().length ?? 0) < IDEA_TEASER_PUBLISH_MIN) {
    issues.push({
      path: ["teaserText"],
      message: `Add a stronger teaser with at least ${IDEA_TEASER_PUBLISH_MIN} characters before publishing.`,
    });
  }

  const type = input.hiddenContentType ?? "TEXT";
  if (type === "FILE") {
    if (!input.hiddenFileUrl) {
      issues.push({
        path: ["hiddenFileUrl"],
        message: "Upload a file for the hidden content before publishing.",
      });
    }
  } else if (type === "LINK") {
    if (!input.hiddenLinkUrl) {
      issues.push({
        path: ["hiddenLinkUrl"],
        message: "Provide a valid URL for the hidden content before publishing.",
      });
    }
  } else {
    if ((input.hiddenContent?.trim().length ?? 0) < IDEA_HIDDEN_CONTENT_PUBLISH_MIN) {
      issues.push({
        path: ["hiddenContent"],
        message: `Add more substance to the hidden content before publishing (${IDEA_HIDDEN_CONTENT_PUBLISH_MIN}+ characters).`,
      });
    }
  }

  if (!input.category?.trim()) {
    issues.push({
      path: ["category"],
      message: "Choose a category before publishing so buyers can discover this idea.",
    });
  }

  if (!input.originalityConfirmed) {
    issues.push({
      path: ["originalityConfirmed"],
      message: "Confirm this listing is original before publishing.",
    });
  }

  if (!hasStructuredPreview(input)) {
    issues.push({
      path: ["whatYoullGet"],
      message: "Add at least one structured preview section before publishing.",
    });
  }

  return issues;
}
