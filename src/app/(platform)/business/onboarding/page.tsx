import { Suspense } from "react";
import OnboardingWizard from "@/components/business/onboarding/OnboardingWizard";
import "@/styles/business-onboarding.css";

function OnboardingFallback() {
  return (
    <div className="fm-onboarding-page">
      <div className="ob-shell">
        <div className="ob-card">
          <div className="ob-loading">Loading your signup…</div>
        </div>
      </div>
    </div>
  );
}

export default function BusinessOnboardingPage() {
  return (
    <Suspense fallback={<OnboardingFallback />}>
      <OnboardingWizard />
    </Suspense>
  );
}
