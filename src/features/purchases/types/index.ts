export interface PurchaseWithIdea {
  id: string;
  ideaId: string;
  amountInCents: number;
  status: "PENDING" | "COMPLETED" | "REFUNDED" | "FAILED";
  createdAt: Date;
  idea: {
    id: string;
    title: string;
    teaserText: string | null;
    hiddenContent: string;
    creator: {
      name: string | null;
    };
  };
}
