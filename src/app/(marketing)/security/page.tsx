import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { SecurityReportPage } from "@/components/security/SecurityReportPage";
import { pageSeo } from "@/content/seo-metadata";

export const metadata: Metadata = pageSeo.security;

export default function SecurityRoute() {
  const markdown = fs.readFileSync(path.join(process.cwd(), "public/security.md"), "utf8");
  return <SecurityReportPage markdown={markdown} />;
}
