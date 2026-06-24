import type { SalesSession } from "@/types/sales";
import { computeRoofHealthScore, scoreBand } from "./scoring";
import { computeCostOfWaiting } from "./cost";
import { recommend } from "./recommendation";

export function buildReport(s: SalesSession) {
  const score = computeRoofHealthScore(s.score);
  const cost = computeCostOfWaiting(s.cost, s.score);
  const rec = recommend(s.score);
  return {
    generatedAt: new Date().toISOString(),
    homeowner: s.homeowner,
    score,
    band: scoreBand(score),
    estimatedAge: s.score.roofAge,
    roofType: s.score.roofType,
    findings: rec.reasons,
    recommendation: rec.tier,
    recommendationSummary: rec.summary,
    financial: cost,
  };
}

export type RoofReport = ReturnType<typeof buildReport>;
