"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { employeeApi } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Zap, X, UserCircle2 } from "lucide-react";

const SAVED_EMPLOYEES_KEY = "pp_saved_employees";

interface SavedEmployee {
  employeeId: string;
  fullName: string;
  businessName: string;
  savedAt: number;
}

function getSavedEmployees(): SavedEmployee[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(SAVED_EMPLOYEES_KEY) || "[]"); }
  catch { return []; }
}

function setSavedEmployees(list: SavedEmployee[]) {
  localStorage.setItem(SAVED_EMPLOYEES_KEY, JSON.stringify(list));
}

function saveEmployeeToDevice(employee: { employeeId: string; fullName?: string }, businessName?: string) {
  const list = getSavedEmployees();
  const entry: SavedEmployee = {
    employeeId: employee.employeeId,
    fullName: employee.fullName || "Employee",
    businessName: businessName || "",
    savedAt: Date.now(),
  };
  const existing = list.findIndex((e) => e.employeeId === employee.employeeId);
  if (existing >= 0) list[existing] = entry;
  else list.unshift(entry);
  setSavedEmployees(list.slice(0, 5));
}

function getInitials(name: string) {
  return (name || "?").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function EmployeeLoginPage() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  // Quick login state
  const [savedEmployees, setSavedEmployeesState] = useState<SavedEmployee[]>([]);
  const [selectedQuickId, setSelectedQuickId] = useState<string | null>(null);
  const [quickPw, setQuickPw] = useState("");
  const [showQuickPw, setShowQuickPw] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false);

  useEffect(() => {
    const list = getSavedEmployees();
    setSavedEmployeesState(list);

    // Auto-select the last used employee if token is gone
    const lastId = localStorage.getItem("employeeId");
    const hasToken = !!localStorage.getItem("employeeToken");
    if (!hasToken && lastId && list.find((e) => e.employeeId === lastId)) {
      setTimeout(() => selectQuick(lastId), 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function removeEmployee(id: string) {
    const updated = getSavedEmployees().filter((e) => e.employeeId !== id);
    setSavedEmployees(updated);
    setSavedEmployeesState(updated);
    if (selectedQuickId === id) {
      setSelectedQuickId(null);
      setQuickPw("");
    }
  }

  const selectQuick = useCallback((id: string) => {
    setSelectedQuickId(id);
    setQuickPw("");
    setTimeout(() => {
      document.getElementById("quickPassword")?.focus();
    }, 50);
  }, []);

  async function performLogin(empId: string, pw: string, isQuick: boolean) {
    try {
      const data = await employeeApi.login(empId, pw);
      const store = (isQuick || remember) ? localStorage : sessionStorage;
      store.setItem("employeeToken", data.token);
      if (data.employee) {
        store.setItem("employeeId", data.employee.employeeId);
        store.setItem("employeeFullName", data.employee.fullName || "");
        if (isQuick || remember) {
          saveEmployeeToDevice(data.employee, data.business?.businessName);
        }
      }
      toast.success("Welcome back!");
      router.push("/employee/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed. Check your credentials.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!employeeId || !password) {
      toast.error("Please enter your Employee ID and password.");
      return;
    }
    setLoading(true);
    try {
      await performLogin(employeeId, password, false);
    } finally {
      setLoading(false);
    }
  }

  async function handleQuickLogin() {
    if (!selectedQuickId || !quickPw) {
      toast.error("Select an employee and enter your password.");
      return;
    }
    setQuickLoading(true);
    try {
      await performLogin(selectedQuickId, quickPw, true);
    } finally {
      setQuickLoading(false);
    }
  }

  return (
    <AuthCard
      title="Employee Login"
      description="Sign in to access your dashboard and QR generator"
      gradient="from-orange-500 to-rose-500"
      backHref="/"
    >
      <div className="space-y-5">
        {/* ── Quick Login section (only shown when saved employees exist) ── */}
        {savedEmployees.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              Quick Login
            </p>

            <div className="space-y-2">
              {savedEmployees.map((emp) => (
                <button
                  key={emp.employeeId}
                  type="button"
                  onClick={() => selectQuick(emp.employeeId)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                    selectedQuickId === emp.employeeId
                      ? "border-orange-400 bg-orange-500/10"
                      : "border-white/15 bg-white/5 hover:border-orange-400/50 hover:bg-white/10"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {getInitials(emp.fullName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{emp.fullName}</p>
                    <p className="text-slate-400 text-xs font-mono">
                      {emp.employeeId}{emp.businessName ? ` · ${emp.businessName}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(ev) => { ev.stopPropagation(); removeEmployee(emp.employeeId); }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                    title="Remove from this device"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </button>
              ))}
            </div>

            {/* Quick password field — shown only when an employee is selected */}
            {selectedQuickId && (
              <div className="space-y-2 pt-1">
                <div className="relative">
                  <Input
                    id="quickPassword"
                    type={showQuickPw ? "text" : "password"}
                    placeholder="Enter your password"
                    value={quickPw}
                    onChange={(e) => setQuickPw(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleQuickLogin(); }}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-orange-400 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowQuickPw(!showQuickPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showQuickPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button
                  type="button"
                  onClick={handleQuickLogin}
                  disabled={quickLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-90 text-white border-0"
                >
                  {quickLoading
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</>
                    : <><Zap className="w-4 h-4 mr-2" />Quick Sign In</>
                  }
                </Button>
              </div>
            )}

            <div className="flex items-center gap-3 text-slate-500 text-xs">
              <div className="flex-1 h-px bg-white/10" />
              <span>or sign in with Employee ID</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
          </div>
        )}

        {/* ── Full login form ── */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId" className="text-white flex items-center gap-1.5">
              <UserCircle2 className="w-3.5 h-3.5 text-orange-400" />
              Employee ID
            </Label>
            <Input
              id="employeeId"
              placeholder="EMP-XXXX-YYYY"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-orange-400 font-mono"
              autoComplete="off"
            />
            <p className="text-xs text-slate-400">Your business owner can find this in their dashboard.</p>
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
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-orange-400 pr-10"
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
              Remember me on this device
            </Label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-90 text-white border-0"
          >
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</> : "Sign In"}
          </Button>

          <div className="text-center pt-2">
            <p className="text-slate-400 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/employee/signup" className="text-orange-400 hover:text-orange-300 font-medium">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthCard>
  );
}
