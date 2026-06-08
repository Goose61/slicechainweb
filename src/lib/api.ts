/**
 * API client — resolves backend URL from hostname.
 * Static hosts (slicechain.io on GitHub Pages) have no /api rewrite; call api.slicechain.io directly.
 */

const PRODUCTION_API = "https://api.slicechain.io";

export function getApiBase(): string {
  if (typeof window === "undefined") {
    return "/api";
  }

  const hostname = window.location.hostname;

  if (
    hostname === "slicechain.io" ||
    hostname === "www.slicechain.io" ||
    hostname === "app.slicechain.io" ||
    hostname === "qr.slicechain.io" ||
    (hostname.endsWith(".slicechain.io") && hostname !== "api.slicechain.io")
  ) {
    return `${PRODUCTION_API}/api`;
  }

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:7000/api";
  }

  return "/api";
}

/** @deprecated Use getApiBase() — kept for any legacy imports */
export const API_BASE = "/api";

type TokenKey = "businessToken" | "employeeToken" | "adminToken" | "customerToken";

function getToken(keys: TokenKey[]): string | null {
  if (typeof window === "undefined") return null;
  for (const key of keys) {
    const t = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (t) return t;
  }
  return null;
}

export function getBusinessToken() {
  return getToken(["businessToken"]);
}
export function getEmployeeToken() {
  return getToken(["employeeToken"]);
}
export function getAdminToken() {
  return getToken(["adminToken"]);
}
export function getCustomerToken() {
  return getToken(["customerToken"]);
}

interface FetchOptions extends RequestInit {
  token?: string | null;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${getApiBase()}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || err.error || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// --- Typed API calls ---

export const configApi = {
  getTurnstileKey: () =>
    apiFetch<{ siteKey: string }>("/config/turnstile"),
};

// Business
export const businessApi = {
  login: (email: string, password: string, turnstileToken?: string) =>
    apiFetch<{ token: string; business: BusinessProfile }>("/business/login", {
      method: "POST",
      body: JSON.stringify({ email, password, turnstileToken }),
    }),

  signupRequest: (data: Record<string, unknown>, turnstileToken?: string) =>
    apiFetch("/business/signup-request", {
      method: "POST",
      body: JSON.stringify({ ...data, turnstileToken }),
    }),

  getProfile: (token: string) =>
    apiFetch<{ business: BusinessProfile }>("/business/profile", { token }),

  getTransactions: (token: string) =>
    apiFetch<{ transactions: Transaction[] }>("/business/transactions", { token }),

  getVaultStats: (token: string) =>
    apiFetch<{ vaultStats: VaultStats }>("/business/vault-stats", { token }),

  getVaultTotal: (token: string) =>
    apiFetch<VaultTotal>("/business/vault-total", { token }),

  mintGiftCards: (token: string, data: { quantity: number; customMessage: string; mintCost: number }) =>
    apiFetch("/business/gift-cards/mint-batch", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  requestSettlement: (token: string, data: { settlementType: string; amount: number }) =>
    apiFetch("/business/request-settlement", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  updateSettings: (token: string, data: Record<string, unknown>) =>
    apiFetch<{ business: BusinessProfile }>("/business/update-settings", {
      method: "PUT",
      token,
      body: JSON.stringify(data),
    }),

  updateWallet: (token: string, walletAddress: string | null) =>
    apiFetch("/business/update-wallet", {
      method: "POST",
      token,
      body: JSON.stringify({ walletAddress }),
    }),

  getLoyaltyProgram: (token: string) =>
    apiFetch<LoyaltyData>("/business/loyalty-program", { token }),

  saveLoyaltyProgram: (token: string, data: Record<string, unknown>) =>
    apiFetch("/business/loyalty-program", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  getEmployeeCommissions: (token: string) =>
    apiFetch<{ employees: EmployeeCommission[] }>("/employee/business-commissions", { token }),
};

// Employee
export const employeeApi = {
  login: (employeeId: string, password: string) =>
    apiFetch<{ token: string; employee: Employee; business?: { businessName: string } }>("/employee/login", {
      method: "POST",
      body: JSON.stringify({ employeeId, password }),
    }),

  register: (data: Record<string, unknown>) =>
    apiFetch("/employee/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: (token: string) =>
    apiFetch<{ employee: Employee; business: BusinessProfile; weeklyCommission: WeeklyCommission }>("/employee/me", { token }),

  getBusinessForQR: (token: string) =>
    apiFetch<{ success: boolean; businessId: string; businessName: string; businessWallet: string }>("/employee/business-for-qr", { token }),
};

// Admin
export const adminApi = {
  login: (username: string, password: string, turnstileToken?: string) =>
    apiFetch<{ token: string }>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password, turnstileToken }),
    }),

  getTransactionStats: (token: string) =>
    apiFetch<TransactionStats>("/admin/transactions/stats", { token }),

  getTransactions: (token: string, params?: Record<string, string>) =>
    apiFetch<{ transactions: Transaction[]; total: number }>(`/admin/transactions?${new URLSearchParams(params)}`, { token }),
};

// Customer
export const customerApi = {
  login: (email: string, password: string, turnstileToken?: string) =>
    apiFetch<{ token: string; user: Customer }>("/customer/login", {
      method: "POST",
      body: JSON.stringify({ email, password, turnstileToken }),
    }),

  forgotPassword: (email: string) =>
    apiFetch("/customer/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  register: (data: Record<string, unknown>, turnstileToken?: string) =>
    apiFetch("/customer/register", {
      method: "POST",
      body: JSON.stringify({ ...data, turnstileToken }),
    }),

  getTurnstileKey: () => configApi.getTurnstileKey(),
};

// Blockchain / Payments
export const blockchainApi = {
  getPaymentQuote: (token: string, amountUsd: number, currency: string) =>
    apiFetch<PaymentQuote>("/blockchain/get-payment-quote", {
      method: "POST",
      token,
      body: JSON.stringify({ amountUsd, currency }),
    }),

  generateQRWithCurrency: (token: string, data: Record<string, unknown>) =>
    apiFetch<QRResult>("/blockchain/generate-qr-with-currency", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  checkPizzarBalance: (walletAddress: string) =>
    apiFetch<PizzarBalance>(`/blockchain/check-pizzar-balance/${walletAddress}`),
};

// Solana Pay Transaction QR
export const solanaPayApi = {
  generateQR: (data: { reference: string; amount: number; businessId: string; baseUrl: string }) =>
    fetch("/api/solana-pay-transaction/generate-qr", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
};

// Ads
export const adsApi = {
  getPlaylist: () => apiFetch("/ads/playlist"),
};

// --- Types ---
export interface BusinessProfile {
  _id: string;
  businessName: string;
  businessType: "CN" | "NCN";
  walletAddress?: string;
  businessWallet?: { publicKey: string };
  contact?: { email?: string; phone?: string };
  settings?: { emailNotifications?: boolean };
}

export interface Transaction {
  _id: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  createdAt: string;
  walletAddress?: string;
  inputToken?: { symbol: string };
  fees?: { platformFee: number; vaultContribution: number };
  rewards?: { pizzaTokensDistributed?: number; pizzarRewardsDistributed?: number };
}

export interface VaultStats {
  totalContributedUsd: number;
  transactionCount: number;
  firstContributionAt?: string;
  lastContributionAt?: string;
}

export interface VaultTotal {
  totalBalanceUsd: number;
  estimatedYieldApy: number;
  participatingBusinesses: number;
}

export interface Employee {
  _id: string;
  employeeId: string;
  fullName: string;
  email: string;
  wallet?: { usdcAddress?: string; solanaAddress?: string };
}

export interface EmployeeCommission {
  employeeId: string;
  fullName: string;
  wallet?: { usdcAddress?: string; solanaAddress?: string };
  stats?: { totalTransactionsFacilitated?: number };
  commission?: { totalEarned?: number; pending?: number; lastPayoutAt?: string };
}

export interface WeeklyCommission {
  totalTransactions: number;
  totalVolume: number;
  commissionAmount: number;
}

export interface Customer {
  _id: string;
  email: string;
  fullName?: string;
}

export interface TransactionStats {
  total: number;
  totalVolume: number;
  completed: number;
  pending: number;
  failed: number;
}

export interface LoyaltyData {
  enabled: boolean;
  members: number;
  totalPizzaHeld: number;
  avgDiscount: number;
  monthlySavings: number;
  discountRules?: Array<{ tokens: number; discount: number; description: string }>;
  creditConversion?: { tokens: number; value: number };
  nftRequirement?: { tokens: number; description: string };
}

export interface PaymentQuote {
  success: boolean;
  inputAmountDisplay: string;
  inputAmountUsd: string;
  outputAmountDisplay: string;
  priceImpact: number;
  totalAmountUsd?: number;
}

export interface QRResult {
  success: boolean;
  qrImage: string;
  qrUrl: string;
  reference: string;
  amountDisplay?: string;
  currency?: string;
  inputAmountDisplay?: string;
  outputAmountDisplay?: string;
  inputCurrency?: string;
  type?: "swap" | "direct";
  expiresAt: number;
  businessWallet?: string;
}

export interface PizzarBalance {
  success: boolean;
  pizzarBalance: number;
  redemptionValue: number;
  canRedeem: boolean;
}

// Analytics calculated from transactions
export function calcAnalytics(transactions: Transaction[]) {
  const totalTransactions = transactions.length;
  const totalAmount = transactions.reduce((s, t) => s + (t.amount || 0), 0);
  const totalPlatformFees = transactions.reduce((s, t) => s + (t.fees?.platformFee || 0), 0);
  const totalVaultContribution = transactions.reduce((s, t) => s + (t.fees?.vaultContribution || 0), 0);
  const totalRevenue = totalAmount - totalPlatformFees - totalVaultContribution;
  return { totalTransactions, totalAmount, totalRevenue, totalPlatformFees, totalVaultContribution };
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function shortAddress(addr: string) {
  if (!addr || addr.length < 12) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-8)}`;
}
