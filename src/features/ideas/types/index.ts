export interface IdeaCardProps {
  // — Idea data —
  id: string;
  title: string;
  teaserText?: string | null;
  teaserImageUrl?: string | null;
  priceInCents: number;
  unlockType: "EXCLUSIVE" | "MULTI";
  category?: string | null;
  subcategoryName?: string | null;
  maturityLevel?: "SEED" | "CONCEPT" | "BLUEPRINT" | "PROTOTYPE_READY";
  purchaseCount?: number;
  reviewCount?: number;
  averageRating?: number | null;
  tags?: string[];
  isTrending?: boolean;

  // — Creator info —
  creatorId?: string | null;
  creatorName?: string | null;
  creatorAvatarUrl?: string | null;

  // — Viewer state —
  isOwner?: boolean;
  isPurchased?: boolean;
  initialBookmarked?: boolean;
  isAuthenticated?: boolean;
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
