"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IdCard, Building2, ArrowRight, Wallet, TrendingUp, Users, Zap, Shield } from "lucide-react";

const LOGO = "/landing-assets/images/pizza/pizzaimages/main_logo.png";

export default function PortalIndex() {
  const router = useRouter();

  const portals = [
    {
      id: "employee",
      icon: IdCard,
      title: "Employee Portal",
      description: "Log in as a business employee to generate Solana Pay QR codes and track your USDC commission.",
      features: [
        "One-tap QR code generator",
        "0.3% commission on each payment",
        "Instant USDC payout to your wallet",
      ],
      gradient: "from-sky-500 to-blue-700",
      badgeText: "For Staff",
      action: () => router.push("/employee/login"),
      buttonText: "Enter Employee Portal",
    },
    {
      id: "business",
      icon: Building2,
      title: "Business Dashboard",
      description: "Crypto-native businesses accepting Solana Pay USDC payments with automated employee commissions and analytics.",
      features: [
        "USDC payment acceptance via Solana Pay",
        "1.9% business fee (0.3% employee commission)",
        "Analytics & employee commission management",
      ],
      gradient: "from-blue-600 to-indigo-800",
      badgeText: "CN Business",
      action: () => router.push("/business/login"),
      buttonText: "Enter Business Dashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1428] via-[#101d3d] to-[#0b1428] flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-[#0f2247]/80 border border-sky-500/20 shadow-2xl shadow-sky-900/40 mb-4 p-2">
          <Image src={LOGO} alt="SlicePay" width={80} height={80} className="w-full h-auto object-contain" priority />
        </div>
        <h1 className="text-5xl font-bold text-white tracking-tight">SlicePay</h1>
        <p className="text-xl text-sky-200/90 font-medium">Crypto payments for small business</p>
        <p className="text-slate-400 text-sm">Choose your portal to continue</p>
        <a
          href="/"
          className="text-sky-300/80 hover:text-white text-sm underline-offset-4 hover:underline transition-colors"
        >
          ← Back to SlicePay home
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {portals.map((portal) => {
          const Icon = portal.icon;
          return (
            <Card
              key={portal.id}
              className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${portal.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                    {portal.badgeText}
                  </Badge>
                </div>
                <CardTitle className="text-white text-xl">{portal.title}</CardTitle>
                <CardDescription className="text-slate-300 text-sm leading-relaxed">{portal.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <ul className="space-y-2">
                  {portal.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full bg-gradient-to-r ${portal.gradient} hover:opacity-90 text-white border-0 shadow-lg group-hover:shadow-xl transition-all`}
                  onClick={portal.action}
                >
                  {portal.buttonText}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 flex items-center gap-6 text-sm">
        <button
          onClick={() => router.push("/admin/login")}
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <Shield className="w-3.5 h-3.5" />
          Platform Admin
        </button>
        <span className="text-slate-600">·</span>
        <button
          onClick={() => router.push("/customer/login")}
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <Wallet className="w-3.5 h-3.5" />
          Customer Portal
        </button>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-4 max-w-sm text-center">
        {[
          { icon: TrendingUp, value: "1.9%", label: "CN Fee" },
          { icon: Users, value: "∞", label: "Partners" },
          { icon: Wallet, value: "USDC", label: "Settlement" },
        ].map(({ icon: StatIcon, value, label }) => (
          <div key={label} className="space-y-1">
            <div className="flex justify-center">
              <StatIcon className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-white font-bold text-lg">{value}</div>
            <div className="text-slate-500 text-xs">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
