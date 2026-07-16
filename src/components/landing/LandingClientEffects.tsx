"use client";

import { useLandingEffects } from "@/hooks/useLandingEffects";
import { useLandingStats } from "@/hooks/useLandingStats";

export function LandingClientEffects() {
  useLandingEffects();
  useLandingStats();
  return null;
}
