export interface IdeaCardProps {
  id: string;
  title: string;
  teaserText?: string | null;
  teaserImageUrl?: string | null;
  priceInCents: number;
  unlockType: "EXCLUSIVE" | "MULTI";
  category?: string | null;
  creatorId?: string | null;
  creatorName?: string | null;
  creatorAvatarUrl?: string | null;
  purchaseCount?: number;
  isOwner?: boolean;
  isPurchased?: boolean;
  initialBookmarked?: boolean;
  isAuthenticated?: boolean;
  isTrending?: boolean;
}

export interface IdeaWithCreator {
  id: string;
  title: string;
  teaserText: string | null;
  teaserImageUrl: string | null;
  hiddenContent: string;
  priceInCents: number;
  currency: string;
  unlockType: "EXCLUSIVE" | "MULTI";
  maxUnlocks: number | null;
  category: string | null;
  tags: string[];
  published: boolean;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  creator: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
  _count?: {
    purchases: number;
  };
}
