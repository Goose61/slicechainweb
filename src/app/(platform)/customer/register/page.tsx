"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { customerApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";
import { TermsConsentCheckbox } from "@/components/legal/TermsConsentCheckbox";

export default function CustomerRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "", acceptTerms: false });

  function update(f: string, v: string) { setForm((p) => ({ ...p, [f]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.acceptTerms) {
      toast.error("You must confirm that you understand the Terms and Conditions and Privacy Policy.");
      return;
    }
    if (form.password !== form.confirmPassword) { toast.error("Passwords don't match."); return; }
    setLoading(true);
    try {
      await customerApi.register({ fullName: form.fullName, email: form.email, password: form.password });
      setSubmitted(true);
      toast.success("Account created!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <AuthCard title="Account Created!" gradient="from-green-500 to-emerald-600" backHref="/customer/login" backLabel="← Go to login">
        <div className="text-center space-y-4 py-4">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
          <p className="text-slate-300">Your customer account has been created. You can now sign in.</p>
          <Button onClick={() => router.push("/customer/login")} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">Sign In</Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Create Account" description="Join SlicePay" gradient="from-orange-500 to-rose-500" backHref="/customer/login" backLabel="← Already have an account? Sign in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-white">Full Name</Label>
          <Input id="fullName" placeholder="Your name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-slate-400" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-slate-400" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-white">Password</Label>
            <Input type="password" placeholder="••••••••" value={form.password} onChange={(e) => update("password", e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-slate-400" required />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Confirm</Label>
            <Input type="password" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-slate-400" required />
          </div>
        </div>
        <TermsConsentCheckbox
          checked={form.acceptTerms}
          onChange={(checked) => setForm((p) => ({ ...p, acceptTerms: checked }))}
        />
        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white border-0">
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating…</> : "Create Account"}
        </Button>
      </form>
    </AuthCard>
  );
}
