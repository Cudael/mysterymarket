"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const inputClass =
  "h-11 rounded-[8px] border border-[#D9DCE3] bg-[#F8F9FC] text-[15px] text-[#1A1A1A] focus:border-[#3A5FCD] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#3A5FCD]/20 placeholder:text-[#1A1A1A]/40 transition-colors";

const labelClass = "text-[13px] font-semibold text-[#1A1A1A]/70 mb-1.5";

export function SignInForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(
        clerkError.errors?.[0]?.message ?? "Sign in failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleOAuth() {
    if (!isLoaded) return;
    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/dashboard",
    });
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center px-4 py-12">
      <div className="bg-[#FFFFFF] border border-[#D9DCE3] rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] w-full max-w-[420px] p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#3A5FCD]/10 border border-[#3A5FCD]/20">
              <Sparkles className="h-5 w-5 text-[#E8C26A]" />
            </div>
            <span className="text-[18px] font-bold text-[#1A1A1A] tracking-tight">
              MysteryMarket
            </span>
          </Link>
        </div>

        {/* Title & subtitle */}
        <h1 className="text-[22px] font-bold tracking-tight text-[#1A1A1A] text-center">
          Welcome back
        </h1>
        <p className="text-[14px] text-[#1A1A1A]/60 text-center mt-1">
          Sign in to your account to continue
        </p>

        {/* Google OAuth */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleGoogleOAuth}
            disabled={!isLoaded}
            className="w-full h-11 flex items-center justify-center gap-3 rounded-[8px] border border-[#D9DCE3] bg-[#FFFFFF] hover:bg-[#F8F9FC] text-[#1A1A1A] text-[15px] font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#D9DCE3]" />
          <span className="text-[13px] text-[#1A1A1A]/50 font-medium">or</span>
          <div className="flex-1 h-px bg-[#D9DCE3]" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className={labelClass}>
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="password" className={labelClass}>
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-[13px] text-[#3A5FCD] hover:text-[#6D7BE0]"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-[13px] text-[#D32F2F]">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isLoading || !isLoaded}
            className="w-full h-11 rounded-[8px] bg-[#3A5FCD] hover:bg-[#6D7BE0] text-white text-[15px] font-medium shadow-[0_2px_8px_rgba(58,95,205,0.25)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-[14px] text-[#1A1A1A]/60 text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-[#3A5FCD] hover:text-[#6D7BE0] font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
