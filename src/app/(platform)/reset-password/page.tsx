"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid or missing reset link. Request a new password reset email.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      toast.success("Password updated. You can sign in now.");
      router.push("/portal");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-slate-300 text-sm">
          This reset link is invalid or has expired.
        </p>
        <Button asChild variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
          <Link href="/portal">Back to portal</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">New password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 pr-10"
            autoComplete="new-password"
            required
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

      <div className="space-y-2">
        <Label htmlFor="confirm" className="text-white">Confirm password</Label>
        <Input
          id="confirm"
          type={showPw ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
          autoComplete="new-password"
          required
        />
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Use at least 8 characters with uppercase, lowercase, a number, and a special character.
      </p>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-violet-600 text-white border-0"
      >
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating…</> : "Update password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Set new password"
      description="Choose a strong password for your account"
      gradient="from-blue-500 to-violet-600"
      backHref="/portal"
      backLabel="← Back to portal"
    >
      <Suspense fallback={<p className="text-slate-400 text-sm text-center">Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
