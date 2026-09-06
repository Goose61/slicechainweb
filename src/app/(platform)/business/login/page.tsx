"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { businessApi } from "@/lib/api";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { useTurnstile } from "@/hooks/useTurnstile";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { businessSignupPath } from "@/content/landing-content";

export default function BusinessLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const { siteKey, loading: turnstileLoading, loadError, turnstileRequired, widgetRef, getToken, onVerify, onExpire, onError, resetToken } = useTurnstile();

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your business email.");
      return;
    }
    setForgotLoading(true);
    try {
      const data = await businessApi.forgotPassword(email);
      toast.success(data.message || "If an account exists, a reset email has been sent.");
      setForgotMode(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send reset email.");
    } finally {
      setForgotLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    const turnstileToken = getToken();
    if (turnstileRequired && !turnstileToken) {
      toast.error("Please complete the security check.");
      return;
    }
    setLoading(true);
    try {
      const data = await businessApi.login(email, password, turnstileToken || undefined);
      const store = remember ? localStorage : sessionStorage;
      store.setItem("businessToken", data.token);
      if (data.business) {
        store.setItem("businessId", data.business._id);
        store.setItem("businessType", data.business.businessType);
        store.setItem("businessEmail", email);
      }
      toast.success("Welcome back!");
      router.push("/business/dashboard");
    } catch (err: unknown) {
      resetToken();
      toast.error(err instanceof Error ? err.message : "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title={forgotMode ? "Reset Password" : "Business Login"}
      description={forgotMode ? "Enter your business email to receive a reset link" : "Sign in to your CN business dashboard"}
      gradient="from-blue-500 to-violet-600"
      backHref="/portal"
      backLabel="← Back to portal"
    >
      {forgotMode ? (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-forgot" className="text-white">Business email</Label>
            <Input
              id="email-forgot"
              type="email"
              placeholder="business@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={forgotLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-violet-600 text-white border-0"
          >
            {forgotLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending…</> : "Send reset email"}
          </Button>
          <button
            type="button"
            onClick={() => setForgotMode(false)}
            className="w-full text-slate-400 hover:text-white text-sm"
          >
            ← Back to login
          </button>
        </form>
      ) : (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Business Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="business@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400"
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-white">Password</Label>
            <button
              type="button"
              onClick={() => setForgotMode(true)}
              className="text-sm font-medium text-blue-400 hover:text-blue-300 underline underline-offset-2"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 pr-10"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="remember" className="text-slate-300 text-sm font-normal cursor-pointer">
            Remember me
          </Label>
        </div>

        {turnstileLoading ? (
          <p className="text-slate-400 text-sm text-center">Loading security check…</p>
        ) : siteKey ? (
          <TurnstileWidget ref={widgetRef} siteKey={siteKey} onVerify={onVerify} onExpire={onExpire} onError={onError} />
        ) : loadError ? (
          <p className="text-rose-400 text-sm text-center">Security check unavailable. Please refresh and try again.</p>
        ) : null}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:opacity-90 text-white border-0"
        >
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</> : "Sign In"}
        </Button>

        <button
          type="button"
          onClick={() => setForgotMode(true)}
          className="w-full text-center text-sm font-medium text-blue-400 hover:text-blue-300 py-1"
        >
          Forgot your password?
        </button>

        <div className="text-center space-y-2 pt-2">
          <p className="text-slate-400 text-sm">
            Don&apos;t have an account?{" "}
            <Link href={businessSignupPath} className="text-blue-400 hover:text-blue-300 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </form>
      )}
    </AuthCard>
  );
}
