"use client";

import { useState, useEffect, useCallback } from "react";
import { businessApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  TrendingUp, TrendingDown, Users, DollarSign, Loader2,
  AlertTriangle, RefreshCw, Star, Clock,
} from "lucide-react";

interface AnalyticsPanelProps {
  businessId?: string;
  token: string;
  demoMode?: boolean;
}

interface MetricsData {
  metrics?: {
    totalRevenue?: number;
    totalTransactions?: number;
    uniqueCustomers?: number;
    averageTransactionValue?: number;
    dailyVolume?: { date: string; revenue: number; transactions: number }[];
    peakHours?: { hour: number; transactions: number }[];
  };
  trends?: {
    revenueGrowth?: number;
    transactionGrowth?: number;
    customerGrowth?: number;
  };
}

interface ReportData {
  recommendations?: { type: string; priority: string; title: string; description: string }[];
  customerInsights?: {
    totalCustomers?: number;
    retentionMetrics?: { retentionRate?: number; churnRate?: number };
    lifetimeValues?: { averageCLV?: number };
    segments?: {
      highValue?: { count: number };
      mediumValue?: { count: number };
      lowValue?: { count: number };
    };
  };
}

function TrendBadge({ value }: { value?: number }) {
  if (value === undefined || value === null || Number.isNaN(value)) return null;
  const isPositive = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isPositive ? "text-green-600" : "text-red-500"}`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

export function AnalyticsPanel({ token, demoMode }: AnalyticsPanelProps) {
  const [timeRange, setTimeRange] = useState("30d");
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [metricsData, reportData] = await Promise.all([
        businessApi.getAnalyticsMetrics(token, timeRange),
        businessApi.getAnalyticsReport(token, timeRange, { includeCustomerInsights: "true" }),
      ]);

      const metricsFailed = metricsData?.error || metricsData?.metrics === undefined;
      const reportFailed = reportData?.error && !reportData?.customerInsights && !reportData?.summary;

      if (metricsFailed && reportFailed) {
        setError(metricsData?.error || reportData?.error || "Failed to load analytics data");
        setMetrics(null);
        setReport(null);
        return;
      }

      if (!metricsFailed) setMetrics(metricsData);
      else setMetrics(null);

      if (!reportData?.error) setReport(reportData);
      else setReport(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error loading analytics");
      setMetrics(null);
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [token, timeRange]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  const fmt = (n?: number) =>
    n !== undefined && n !== null
      ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : "—";

  const txCount = metrics?.metrics?.totalTransactions ?? 0;
  const dailyVolume = Array.isArray(metrics?.metrics?.dailyVolume) ? metrics!.metrics!.dailyVolume! : [];
  const peakHours = Array.isArray(metrics?.metrics?.peakHours) ? metrics!.metrics!.peakHours! : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Business Analytics</h2>
          <p className="text-sm text-muted-foreground">
            {demoMode
              ? "Live metrics from this demo business account"
              : "Detailed performance insights for your business"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-28 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={loading}>
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-4 flex items-center gap-2 text-sm text-red-600">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </CardContent>
        </Card>
      )}

      {loading && !metrics && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {metrics && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Revenue", value: fmt(metrics.metrics?.totalRevenue), trend: metrics.trends?.revenueGrowth, icon: DollarSign, gradient: "from-green-500 to-emerald-600" },
              { label: "Transactions", value: metrics.metrics?.totalTransactions?.toLocaleString() ?? "—", trend: metrics.trends?.transactionGrowth, icon: TrendingUp, gradient: "from-blue-500 to-cyan-500" },
              { label: "Unique Customers", value: metrics.metrics?.uniqueCustomers?.toLocaleString() ?? "—", trend: metrics.trends?.customerGrowth, icon: Users, gradient: "from-violet-500 to-purple-600" },
              { label: "Avg Order Value", value: fmt(metrics.metrics?.averageTransactionValue), trend: undefined, icon: Star, gradient: "from-orange-500 to-amber-500" },
            ].map(({ label, value, trend, icon: Icon, gradient }) => (
              <Card key={label} className="relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full`} />
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-xl font-bold mt-0.5">{value}</p>
                      {trend !== undefined && <div className="mt-1"><TrendBadge value={trend} /></div>}
                    </div>
                    <Icon className="w-5 h-5 opacity-70" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {txCount === 0 && !loading && (
            <Card>
              <CardContent className="pt-6 text-center text-sm text-muted-foreground">
                No confirmed payments in this period. Try a wider time range, or check the Transactions tab.
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {dailyVolume.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={dailyVolume}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={(v) => String(v).slice(5)} />
                      <YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => `$${v}`} />
                      <Tooltip formatter={(v: number) => [`$${Number(v).toFixed(2)}`, "Revenue"]} />
                      <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {peakHours.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Peak Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={peakHours}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="hour" tick={{ fontSize: 9 }} tickFormatter={(h) => `${h}:00`} />
                      <YAxis tick={{ fontSize: 9 }} />
                      <Tooltip labelFormatter={(h) => `${h}:00`} />
                      <Bar dataKey="transactions" radius={[3, 3, 0, 0]}>
                        {peakHours.map((_, i) => (
                          <Cell key={i} fill={i % 2 === 0 ? "#6366f1" : "#8b5cf6"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {report?.customerInsights && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Customer Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Total Customers</p>
                <p className="font-semibold text-base">{report.customerInsights.totalCustomers?.toLocaleString() ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Retention Rate</p>
                <p className="font-semibold text-base">
                  {report.customerInsights.retentionMetrics?.retentionRate !== undefined
                    ? `${(report.customerInsights.retentionMetrics.retentionRate * 100).toFixed(1)}%`
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg. Customer LTV</p>
                <p className="font-semibold text-base">{fmt(report.customerInsights.lifetimeValues?.averageCLV)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Churn Rate</p>
                <p className="font-semibold text-base">
                  {report.customerInsights.retentionMetrics?.churnRate !== undefined
                    ? `${(report.customerInsights.retentionMetrics.churnRate * 100).toFixed(1)}%`
                    : "—"}
                </p>
              </div>
            </div>

            {report.customerInsights.segments && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">Customer Segments</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: "High Value", count: report.customerInsights.segments.highValue?.count, color: "bg-green-500" },
                    { label: "Mid Value", count: report.customerInsights.segments.mediumValue?.count, color: "bg-blue-500" },
                    { label: "Low Value", count: report.customerInsights.segments.lowValue?.count, color: "bg-slate-400" },
                  ].map(({ label, count, color }) => (
                    <div key={label} className="flex items-center gap-1.5 text-xs bg-muted rounded px-2 py-1">
                      <span className={`w-2 h-2 rounded-full ${color}`} />
                      {label}: <span className="font-medium">{count ?? 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {report?.recommendations && report.recommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.recommendations.slice(0, 4).map((rec, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${rec.priority === "high" ? "bg-red-500" : rec.priority === "medium" ? "bg-amber-500" : "bg-blue-500"}`} />
                <div>
                  <p className="font-medium">{rec.title}</p>
                  <p className="text-xs text-muted-foreground">{rec.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
