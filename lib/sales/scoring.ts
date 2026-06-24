import type { ScoreInputs } from "@/types/sales";

// Age factor: newer roofs score higher. ~25 yr practical asphalt ceiling.
function ageScore(age: number): number {
  return Math.max(0, Math.min(100, 100 - (age / 25) * 100));
}

const TYPE_FACTOR: Record<string, number> = {
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
  const weights = { age: 0.22, granule: 0.2, flexibility: 0.2, ventilation: 0.12, repairHistory: 0.14, stormExposure: 0.12 };
  const base =
    ageScore(s.roofAge) * weights.age +
    s.granule * weights.granule +
    s.flexibility * weights.flexibility +
    s.ventilation * weights.ventilation +
    s.repairHistory * weights.repairHistory +
    s.stormExposure * weights.stormExposure;
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
