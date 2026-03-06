import { z } from "zod";

export const createIdeaSchema = z.object({
  title: z.string().min(3).max(200),
  teaserText: z.string().max(500).optional(),
  teaserImageUrl: z.string().url().optional().or(z.literal("")),
  hiddenContent: z.string().min(10),
  priceInCents: z.number().int().min(99).max(100000),
  unlockType: z.enum(["EXCLUSIVE", "MULTI"]),
  maxUnlocks: z.number().int().min(1).optional().nullable(),
  category: z.string().max(100).optional(),
  subcategory: z.string().max(100).optional(),
  maturityLevel: z.enum(["SEED", "CONCEPT", "BLUEPRINT", "PROTOTYPE_READY"]).optional(),
  tags: z.array(z.string()).max(10).optional(),
  published: z.boolean().optional(),
});
