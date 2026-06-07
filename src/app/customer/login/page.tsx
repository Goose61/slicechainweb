"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { customerApi } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { toast.error("Please enter your email and password."); return; }
    setLoading(true);
    try {
      const data = await customerApi.login(email, password);
      const store = remember ? localStorage : sessionStorage;
      store.setItem("customerToken", data.token);
      if (remember) store.setItem("customerRemember", "true");
      toast.success("Welcome back!");
      router.push("/customer/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email."); return; }
    setForgotLoading(true);
    try {
      await customerApi.forgotPassword(email);
      toast.success("Password reset email sent! Check your inbox.");
      setForgotMode(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send reset email.");
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <AuthCard
      title={forgotMode ? "Reset Password" : "Customer Login"}
      description={forgotMode ? "Enter your email to receive a reset link" : "Sign in to your account"}
      gradient="from-orange-500 to-rose-500"
      backHref="/"
    >
      {forgotMode ? (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-forgot" className="text-white">Email</Label>
            <Input id="email-forgot" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-slate-400" required />
          </div>
          <Button type="submit" disabled={forgotLoading} className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white border-0">
            {forgotLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending…</> : "Send Reset Email"}
          </Button>
          <button type="button" onClick={() => setForgotMode(false)} className="w-full text-slate-400 hover:text-white text-sm">← Back to login</button>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-orange-400" autoComplete="email" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-white">Password</Label>
              <button type="button" onClick={() => setForgotMode(true)} className="text-xs text-slate-400 hover:text-orange-400 transition-colors">Forgot password?</button>
            </div>
            <div className="relative">
              <Input id="password" type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 pr-10 focus:border-orange-400" autoComplete="current-password" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input id="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded" />
            <Label htmlFor="remember" className="text-slate-300 text-sm font-normal cursor-pointer">Remember me</Label>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-90 text-white border-0">
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in…</> : "Sign In"}
          </Button>
          <div className="text-center pt-2">
            <p className="text-slate-400 text-sm">
              New customer?{" "}
              <Link href="/customer/register" className="text-orange-400 hover:text-orange-300 font-medium">Create account</Link>
            </p>
          </div>
        </form>
      )}
    </AuthCard>
  );
}
