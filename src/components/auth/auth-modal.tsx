"use client";

import { useEffect, useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const inputClass =
  "h-11 rounded-[8px] border border-border bg-muted text-[15px] text-foreground focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground transition-colors";

const labelClass = "text-[13px] font-semibold text-muted-foreground mb-1.5";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "sign-in" | "sign-up";
}

export function AuthModal({ open, onOpenChange, defaultTab = "sign-in" }: AuthModalProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"sign-in" | "sign-up">(defaultTab);

  // Sign-in state
  const { signIn, setActive: setSignInActive, isLoaded: signInLoaded } = useSignIn();
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siLoading, setSiLoading] = useState(false);
  const [siError, setSiError] = useState<string | null>(null);

  // Sign-up state
  const { signUp, setActive: setSignUpActive, isLoaded: signUpLoaded } = useSignUp();
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");
  const [suLoading, setSuLoading] = useState(false);
  const [suError, setSuError] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  // Reset to defaultTab and clear form state when modal opens
  useEffect(() => {
    if (open) {
      setTab(defaultTab);
      setSiEmail("");
      setSiPassword("");
      setSiLoading(false);
      setSiError(null);
      setSuEmail("");
      setSuPassword("");
      setSuConfirm("");
      setSuLoading(false);
      setSuError(null);
      setPendingVerification(false);
      setCode("");
    }
  }, [open, defaultTab]);

  function switchTab(newTab: "sign-in" | "sign-up") {
    setTab(newTab);
    setSiEmail("");
    setSiPassword("");
    setSiError(null);
    setSuEmail("");
    setSuPassword("");
    setSuConfirm("");
    setSuError(null);
    setPendingVerification(false);
    setCode("");
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!signInLoaded) return;
    setSiLoading(true);
    setSiError(null);
    try {
      const result = await signIn.create({ identifier: siEmail, password: siPassword });
      if (result.status === "complete") {
        await setSignInActive({ session: result.createdSessionId });
        onOpenChange(false);
        router.push("/my");
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setSiError(clerkError.errors?.[0]?.message ?? "Sign in failed. Please try again.");
    } finally {
      setSiLoading(false);
    }
  }

  async function handleSignInGoogle() {
    if (!signInLoaded) return;
    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/my",
    });
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!signUpLoaded) return;
    if (suPassword !== suConfirm) {
      setSuError("Passwords do not match.");
      return;
    }
    setSuLoading(true);
    setSuError(null);
    try {
      await signUp.create({ emailAddress: suEmail, password: suPassword });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setSuError(clerkError.errors?.[0]?.message ?? "Sign up failed. Please try again.");
    } finally {
      setSuLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!signUpLoaded) return;
    setSuLoading(true);
    setSuError(null);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setSignUpActive({ session: result.createdSessionId });
        onOpenChange(false);
        router.push("/my");
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setSuError(clerkError.errors?.[0]?.message ?? "Verification failed. Please try again.");
    } finally {
      setSuLoading(false);
    }
  }

  async function handleSignUpGoogle() {
    if (!signUpLoaded) return;
    await signUp.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/my",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] w-full p-0 border-0 bg-transparent shadow-none overflow-y-auto max-h-[90vh] [&>button]:hidden">
        <div className="bg-card border border-border rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] w-full p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2" onClick={() => onOpenChange(false)}>
              <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-primary/10 border border-primary/20">
                <Sparkles className="h-5 w-5 text-[hsl(var(--gold))]" />
              </div>
              <span className="text-[18px] font-bold text-foreground tracking-tight">
                MysteryMarket
              </span>
            </Link>
          </div>

          {tab === "sign-in" ? (
            <>
              <h2 className="text-[22px] font-bold tracking-tight text-foreground text-center">
                Welcome back
              </h2>
              <p className="text-[14px] text-muted-foreground text-center mt-1">
                Sign in to your account to continue
              </p>

              {/* Google OAuth */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleSignInGoogle}
                  disabled={!signInLoaded}
                  className="w-full h-11 flex items-center justify-center gap-3 rounded-[8px] border border-border bg-card hover:bg-muted text-foreground text-[15px] font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[13px] text-muted-foreground font-medium">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Form */}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="si-email" className={labelClass}>
                    Email address
                  </Label>
                  <Input
                    id="si-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={siEmail}
                    onChange={(e) => setSiEmail(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label htmlFor="si-password" className={labelClass}>
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-[13px] text-primary hover:text-primary/80"
                      onClick={() => onOpenChange(false)}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="si-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={siPassword}
                    onChange={(e) => setSiPassword(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

                {siError && (
                  <p className="text-[13px] text-destructive">{siError}</p>
                )}

                <Button
                  type="submit"
                  disabled={siLoading || !signInLoaded}
                  className="w-full h-11 rounded-[8px] bg-primary hover:bg-primary/90 text-white text-[15px] font-medium shadow-[var(--shadow-primary-glow)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {siLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <p className="text-[14px] text-muted-foreground text-center mt-6">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("sign-up")}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Sign up
                </button>
              </p>

              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="text-[13px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                >
                  ✕ Close
                </button>
              </div>
            </>
          ) : (
            <>
              {pendingVerification ? (
                <>
                  <h2 className="text-[22px] font-bold tracking-tight text-foreground text-center">
                    Check your email
                  </h2>
                  <p className="text-[14px] text-muted-foreground text-center mt-1">
                    We sent a 6-digit code to{" "}
                    <span className="font-medium text-foreground">{suEmail}</span>
                  </p>

                  <form onSubmit={handleVerify} className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="su-code" className={labelClass}>
                        Verification code
                      </Label>
                      <Input
                        id="su-code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder="000000"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        className="h-14 rounded-[8px] border border-border bg-muted text-center text-[20px] tracking-[0.3em] font-mono text-foreground focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground transition-colors"
                      />
                    </div>

                    {suError && (
                      <p className="text-[13px] text-destructive">{suError}</p>
                    )}

                    <Button
                      type="submit"
                      disabled={suLoading || !signUpLoaded}
                      className="w-full h-11 rounded-[8px] bg-primary hover:bg-primary/90 text-white text-[15px] font-medium shadow-[var(--shadow-primary-glow)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {suLoading ? "Verifying..." : "Verify email"}
                    </Button>
                  </form>

                  <button
                    type="button"
                    onClick={() => {
                      setPendingVerification(false);
                      setSuError(null);
                    }}
                    className="mt-4 flex items-center gap-1 text-[13px] text-primary hover:text-primary/80 font-medium"
                  >
                    ← Back to sign up
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-[22px] font-bold tracking-tight text-foreground text-center">
                    Create your account
                  </h2>
                  <p className="text-[14px] text-muted-foreground text-center mt-1">
                    Join MysteryMarket and start exploring ideas
                  </p>

                  {/* Google OAuth */}
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={handleSignUpGoogle}
                      disabled={!signUpLoaded}
                      className="w-full h-11 flex items-center justify-center gap-3 rounded-[8px] border border-border bg-card hover:bg-muted text-foreground text-[15px] font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <GoogleIcon />
                      Continue with Google
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[13px] text-muted-foreground font-medium">or</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <Label htmlFor="su-email" className={labelClass}>
                        Email address
                      </Label>
                      <Input
                        id="su-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={suEmail}
                        onChange={(e) => setSuEmail(e.target.value)}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <Label htmlFor="su-password" className={labelClass}>
                        Password
                      </Label>
                      <Input
                        id="su-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={suPassword}
                        onChange={(e) => setSuPassword(e.target.value)}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <Label htmlFor="su-confirm" className={labelClass}>
                        Confirm password
                      </Label>
                      <Input
                        id="su-confirm"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={suConfirm}
                        onChange={(e) => setSuConfirm(e.target.value)}
                        required
                        className={inputClass}
                      />
                    </div>

                    {suError && (
                      <p className="text-[13px] text-destructive">{suError}</p>
                    )}

                    <Button
                      type="submit"
                      disabled={suLoading || !signUpLoaded}
                      className="w-full h-11 rounded-[8px] bg-primary hover:bg-primary/90 text-white text-[15px] font-medium shadow-[var(--shadow-primary-glow)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {suLoading ? "Creating account..." : "Create account"}
                    </Button>
                  </form>

                  <p className="text-[14px] text-muted-foreground text-center mt-6">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchTab("sign-in")}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Sign in
                    </button>
                  </p>

                  <div className="flex justify-center mt-4">
                    <button
                      type="button"
                      onClick={() => onOpenChange(false)}
                      className="text-[13px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                    >
                      ✕ Close
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
