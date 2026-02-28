import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Lightbulb, ShoppingBag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IdeaCard } from "@/components/idea-card";
import prisma from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { name: true, bio: true },
  });
  if (!user) return { title: "Creator Not Found" };
  return {
    title: `${user.name ?? "Creator"} - MysteryIdea`,
    description: user.bio ?? `Browse ideas by ${user.name ?? "this creator"} on MysteryIdea.`,
  };
}

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      ideas: {
        where: { published: true },
        include: { _count: { select: { purchases: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user || user.ideas.length === 0) notFound();

  const totalSales = user.ideas.reduce(
    (sum, idea) => sum + idea._count.purchases,
    0
  );

  const initials = (user.name ?? "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Creator header */}
      <div className="mb-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
        <Avatar className="h-24 w-24 shrink-0">
          <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name ?? "Creator"} />
          <AvatarFallback className="text-2xl font-bold">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">
            {user.name ?? "Anonymous"}
          </h1>

          {user.bio && (
            <p className="mt-2 max-w-xl text-muted-foreground">{user.bio}</p>
          )}

          <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground sm:justify-start">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Member since{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4" />
              {user.ideas.length} idea{user.ideas.length !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="h-4 w-4" />
              {totalSales} sale{totalSales !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Ideas grid */}
      <div>
        <h2 className="mb-6 text-xl font-semibold text-foreground">Ideas</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {user.ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              id={idea.id}
              title={idea.title}
              teaserText={idea.teaserText}
              teaserImageUrl={idea.teaserImageUrl}
              priceInCents={idea.priceInCents}
              unlockType={idea.unlockType}
              category={idea.category}
              creatorId={user.id}
              creatorName={user.name}
              purchaseCount={idea._count.purchases}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
