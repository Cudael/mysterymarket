import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In — MysteryMarket",
  description: "Sign in to your MysteryMarket account",
};

export default function SignInPage() {
  return <SignInForm />;
}
