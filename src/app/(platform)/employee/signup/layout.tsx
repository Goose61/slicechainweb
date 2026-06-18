import type { Metadata } from "next";
import { pageSeo } from "@/content/seo-metadata";

export const metadata: Metadata = pageSeo.employeeSignup;

export default function EmployeeSignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
