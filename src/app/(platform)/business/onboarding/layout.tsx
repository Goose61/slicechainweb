import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create your SlicePay account | Founding Merchant",
  description: "Finish your Founding Merchant signup and create your SlicePay business account.",
};

export default function BusinessOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
