import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Lightbulb, ShoppingBag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IdeaCard } from "@/features/ideas/components/idea-card";
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
    title: `${user.name ?? "Creator"} - MysteryMarket`,
    description: user.bio ?? `Browse high-value ideas by ${user.name ?? "this creator"} on MysteryMarket.`,
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
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Creator Profile Header Card */}
      <div className="mb-12 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
          <Avatar className="h-24 w-24 shrink-0 border-2 border-[#F8F9FC] shadow-sm">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name ?? "Creator"} />
            <AvatarFallback className="bg-[#F8F9FC] text-[#3A5FCD] text-2xl font-bold border border-[#D9DCE3]">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-[32px] font-bold tracking-tight text-[#1A1A1A]">
              {user.name ?? "Anonymous"}
            </h1>

            {user.bio && (
              <p className="mt-3 max-w-2xl text-[16px] leading-[1.6] text-[#1A1A1A]/70">
                {user.bio}
              </p>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-4 sm:justify-start">
              <span className="flex items-center gap-2 rounded-[6px] bg-[#F8F9FC] border border-[#D9DCE3] px-3 py-1.5 text-[13px] font-medium text-[#1A1A1A]">
                <Calendar className="h-4 w-4 text-[#1A1A1A]/50" />
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-2 rounded-[6px] bg-[#F8F9FC] border border-[#D9DCE3] px-3 py-1.5 text-[13px] font-medium text-[#1A1A1A]">
                <Lightbulb className="h-4 w-4 text-[#3A5FCD]" />
                {user.ideas.length} idea{user.ideas.length !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-2 rounded-[6px] bg-[#F8F9FC] border border-[#D9DCE3] px-3 py-1.5 text-[13px] font-medium text-[#1A1A1A]">
                <ShoppingBag className="h-4 w-4 text-[#054F31]" />
                {totalSales} sale{totalSales !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ideas grid */}
      <div>
        <h2 className="mb-6 text-[22px] font-bold tracking-tight text-[#1A1A1A]">
          Ideas by {user.name?.split(" ")[0] ?? "this creator"}
        </h2>
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
