import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/LandingPage";
import { marketingUrl } from "@/lib/siteUrl";

export default function HomePage() {
  const host = headers().get("host")?.split(":")[0] || "";
  if (host === "app.slicechain.io") {
    redirect(marketingUrl("/"));
  }
  return <LandingPage />;
}
