"use client";

import { useLandingEffects } from "@/hooks/useLandingEffects";
import { useLandingStats } from "@/hooks/useLandingStats";

export function LandingClientShell() {
  useLandingEffects();
  useLandingStats();
  return null;
}
