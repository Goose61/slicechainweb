"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pizza } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  backHref?: string;
  backLabel?: string;
}

export function AuthCard({
  title,
  description,
  children,
  className,
  gradient = "from-orange-500 to-rose-500",
  backHref = "/",
  backLabel = "← Back to portal selection",
}: AuthCardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} shadow-xl mb-2`}>
            <Pizza className="w-7 h-7 text-white" />
          </div>
          <h1 className={cn("text-2xl font-bold text-white", className)}>{title}</h1>
          {description && <p className="text-slate-400 text-sm">{description}</p>}
        </div>

        <Card className="bg-white/10 border-white/10 backdrop-blur-sm">
          <CardContent className="pt-6">{children}</CardContent>
        </Card>

        {backHref && (
          <p className="text-center text-sm">
            <Link href={backHref} className="text-slate-400 hover:text-white transition-colors">
              {backLabel}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
