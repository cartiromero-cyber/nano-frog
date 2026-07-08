import type { ScoreInputs } from "@/types/sales";

// Age factor: newer roofs score higher. ~25 yr practical asphalt ceiling.
function ageScore(age: number): number {
  return Math.max(0, Math.min(100, 100 - (age / 25) * 100));
}

/** Standard version — cited by the code, the internal standard doc, and /how-we-score. */
export const SCORING_STANDARD_VERSION = "1.1";

/**
 * The published weights (S-001, LOCKED). Exported so public pages RENDER from these
 * exact values — the engine and the marketing can never drift apart silently.
 * Changing any weight is a v2.0 standard change (Decision Register change request).
 */
export const WEIGHTS = { age: 0.22, granule: 0.2, flexibility: 0.2, ventilation: 0.12, repairHistory: 0.14, stormExposure: 0.12 } as const;

export const TYPE_FACTOR: Record<string, number> = {
  "Architectural shingle": 1.0,
  "Asphalt shingle": 0.96,
  "Metal": 0.85,
  "Tile": 0.8,
  "Flat / low-slope": 0.75,
  "Not sure": 0.92,
};

/**
 * Roof Health Score (0-100). Transparent, weighted blend of condition signals.
 * Higher = healthier / better preservation candidate.
 */
export function computeRoofHealthScore(s: ScoreInputs): number {
  const base =
    ageScore(s.roofAge) * WEIGHTS.age +
    s.granule * WEIGHTS.granule +
    s.flexibility * WEIGHTS.flexibility +
    s.ventilation * WEIGHTS.ventilation +
    s.repairHistory * WEIGHTS.repairHistory +
    s.stormExposure * WEIGHTS.stormExposure;
  const typed = base * (TYPE_FACTOR[s.roofType] ?? 0.92);
  return Math.round(Math.max(0, Math.min(100, typed)));
}

export function scoreBand(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Strong";
  if (score >= 50) return "Fair";
  return "At Risk";
}

export function estimatedAge(s: ScoreInputs): number { return s.roofAge; }
