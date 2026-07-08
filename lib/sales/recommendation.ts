import type { ScoreInputs, RecommendationTier } from "@/types/sales";
import { computeRoofHealthScore } from "./scoring";

export interface Recommendation {
  tier: RecommendationTier;
  score: number;
  reasons: string[];
  summary: string;
}

/**
 * The published verdict gates (S-001, LOCKED). Exported so /how-we-score renders from
 * the same values the engine enforces. Changing any gate is a v2.0 standard change.
 */
export const VERDICT_GATES = {
  excellent: { minScore: 78, maxAge: 18 },
  good: { minScore: 62, maxAge: 22 },
  monitor: { minScore: 45 },
} as const;

/**
 * Objective candidacy logic. The software is the authority; it can also say "no".
 */
export function recommend(s: ScoreInputs): Recommendation {
  const score = computeRoofHealthScore(s);
  const reasons: string[] = [];
  if (s.roofAge <= 15) reasons.push("Roof age is within a strong preservation window.");
  else if (s.roofAge <= 20) reasons.push("Roof age is workable but on the older side.");
  else reasons.push("Roof age is advanced — close evaluation needed.");
  if (s.granule >= 60) reasons.push("Granule condition still has protective coverage.");
  else reasons.push("Granule loss is significant.");
  if (s.flexibility >= 60) reasons.push("Shingles retain useful flexibility.");
  else reasons.push("Shingles are showing brittleness.");

  let tier: RecommendationTier;
  if (score >= VERDICT_GATES.excellent.minScore && s.roofAge <= VERDICT_GATES.excellent.maxAge) tier = "Excellent Candidate";
  else if (score >= VERDICT_GATES.good.minScore && s.roofAge <= VERDICT_GATES.good.maxAge) tier = "Good Candidate";
  else if (score >= VERDICT_GATES.monitor.minScore) tier = "Needs Inspection";
  else tier = "Not Recommended";

  const summary =
    tier === "Excellent Candidate" ? "This roof is a strong fit for preservation and has clear usable life to protect."
    : tier === "Good Candidate" ? "This roof is a good preservation candidate, pending an on-site confirmation."
    : tier === "Needs Inspection" ? "This roof needs monitoring and a closer evaluation before an honest recommendation can be made."
    : "Preservation is not the right path for this roof; replacement planning is more appropriate.";

  return { tier, score, reasons, summary };
}

/**
 * LANG-1-FIX-02 (approved): customer-facing display label for a tier. The internal typed
 * value "Needs Inspection" is preserved (saved sessions/CRM records depend on it); every
 * customer-visible surface maps it to "Monitor" — matching the published Preserve ·
 * Monitor · Replace vocabulary homeowners are taught.
 */
export function displayTier(t: RecommendationTier): string {
  return t === "Needs Inspection" ? "Monitor" : t;
}

export const TIER_COLOR: Record<RecommendationTier, string> = {
  "Excellent Candidate": "var(--score)",
  "Good Candidate": "var(--green-2)",
  "Needs Inspection": "#E0A12E",
  "Not Recommended": "#C0532E",
};
