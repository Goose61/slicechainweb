"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminApi } from "@/lib/api";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { useTurnstile } from "@/hooks/useTurnstile";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const { siteKey, token, turnstileRequired, onVerify, onExpire, onError, resetToken } = useTurnstile();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) { toast.error("Please enter username and password."); return; }
    if (turnstileRequired && !token) {
      toast.error("Please complete the security check.");
      return;
    }
    setLoading(true);
    try {
      const data = await adminApi.login(username, password, token || undefined);
      const store = remember ? localStorage : sessionStorage;
      store.setItem("adminToken", data.token);
      toast.success("Admin access granted.");
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      resetToken();
      toast.error(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Platform Admin"
      description="Super admin access — restricted"
      gradient="from-slate-600 to-slate-800"
      backHref="/"
    >
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
          <Shield className="w-6 h-6 text-slate-300" />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-white">Username</Label>
          <Input
            id="username"
            placeholder="admin username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
            autoComplete="username"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 pr-10"
              autoComplete="current-password"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input id="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded" />
          <Label htmlFor="remember" className="text-slate-300 text-sm font-normal cursor-pointer">Remember on this device</Label>
        </div>
        {siteKey ? (
          <TurnstileWidget siteKey={siteKey} onVerify={onVerify} onExpire={onExpire} onError={onError} />
        ) : null}
        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-slate-600 to-slate-800 hover:opacity-90 text-white border-0">
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying…</> : "Sign In"}
        </Button>
      </form>
    </AuthCard>
  );
}
