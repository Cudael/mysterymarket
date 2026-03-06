"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { trackEvent } from "@/lib/analytics";

export type ReportReason =
  | "MISLEADING"
  | "INAPPROPRIATE"
  | "SPAM"
  | "PLAGIARISM"
  | "OTHER";

export async function createReport(
  ideaId: string,
  reason: ReportReason,
  details?: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  const existing = await prisma.report.findUnique({
    where: { reporterId_ideaId: { reporterId: user.id, ideaId } },
  });
  if (existing) throw new Error("You have already reported this idea");

  await prisma.report.create({
    data: {
      reason,
      details: details?.trim() || null,
      reporterId: user.id,
      ideaId,
    },
  });

  trackEvent("report_submitted", {
    userId: user.id,
    ideaId,
    reason,
  });

  revalidatePath(`/ideas/${ideaId}`);
}
