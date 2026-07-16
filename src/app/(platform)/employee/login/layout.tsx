import type { Metadata } from "next";
import { pageSeo } from "@/content/seo-metadata";

export const metadata: Metadata = pageSeo.employeeLogin;

export default function EmployeeLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
