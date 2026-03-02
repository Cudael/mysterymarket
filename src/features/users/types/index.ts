export interface UserProfile {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: "USER" | "CREATOR" | "ADMIN";
  stripeOnboarded: boolean;
}
