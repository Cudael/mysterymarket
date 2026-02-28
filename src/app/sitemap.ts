import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://mysteryidea.com";

  const ideas = await prisma.idea.findMany({
    where: { published: true },
    select: { id: true, updatedAt: true },
  });

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/ideas`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    ...ideas.map((idea) => ({
      url: `${baseUrl}/ideas/${idea.id}`,
      lastModified: idea.updatedAt,
    })),
  ];
}
