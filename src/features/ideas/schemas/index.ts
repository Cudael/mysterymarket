import { z } from "zod";
import { getPublishValidationIssues } from "@/features/ideas/lib/quality";

export const baseIdeaObjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  teaserText: z.string().max(500).optional(),
  teaserImageUrl: z.string().url().optional().or(z.literal("")),
  hiddenContentType: z.enum(["TEXT", "FILE", "LINK"]).default("TEXT"),
  hiddenContent: z.string().optional().default(""),
  hiddenFileUrl: z.string().url().optional().or(z.literal("")),
  hiddenLinkUrl: z.string().url().optional().or(z.literal("")),
  originalityConfirmed: z
    .boolean()
    .refine((value) => value, "Please confirm this listing is your original work."),
  whatYoullGet: z.string().max(400).optional(),
  bestFitFor: z.string().max(280).optional(),
  implementationNotes: z.string().max(400).optional(),
  priceInCents: z.number().int().min(99, "Minimum price is $0.99").max(100000),
  unlockType: z.enum(["EXCLUSIVE", "MULTI"]),
  maxUnlocks: z.number().int().min(1).optional().nullable(),
  category: z.string().max(100).optional(),
  subcategory: z.string().max(100).optional(),
  maturityLevel: z.enum(["SEED", "CONCEPT", "BLUEPRINT", "PROTOTYPE_READY"]).optional(),
  tags: z.array(z.string()).max(10).optional(),
  published: z.boolean().optional(),
});

function validateHiddenContentType(
  input: { hiddenContentType?: string | null; hiddenContent?: string | null; hiddenFileUrl?: string | null; hiddenLinkUrl?: string | null },
  ctx: z.RefinementCtx
) {
  const type = input.hiddenContentType ?? "TEXT";
  if (type === "TEXT") {
    if ((input.hiddenContent?.length ?? 0) < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["hiddenContent"],
        message: "Hidden content must be at least 10 characters",
      });
    }
  } else if (type === "FILE") {
    if (!input.hiddenFileUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["hiddenFileUrl"],
        message: "Please upload a file for the hidden content.",
      });
    }
  } else if (type === "LINK") {
    if (!input.hiddenLinkUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["hiddenLinkUrl"],
        message: "Please provide a URL for the hidden content.",
      });
    }
  }
}

export const baseIdeaSchema = baseIdeaObjectSchema;

export const createIdeaSchema = baseIdeaObjectSchema.superRefine((input, ctx) => {
  validateHiddenContentType(input, ctx);

  if (!input.published) return;

  for (const issue of getPublishValidationIssues(input)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: issue.path,
      message: issue.message,
    });
  }
});
