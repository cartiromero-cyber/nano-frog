import type { CostInputs, ScoreInputs } from "@/types/sales";
import { computeRoofHealthScore } from "./scoring";
import { computeCostOfWaiting } from "./cost";

export interface FutureProjection {
  horizon: number;
  years: number[];
  delay: number[];            // cumulative spend if maintenance is delayed
  preserve: number[];         // cumulative spend if preserved now
  replaceYearDelay: number;   // year a replacement likely becomes unavoidable
  replaceYearPreserve: number;// deferred replacement year on the preserve path
  extraAtHorizon: number;     // delay - preserve at the horizon
  maxValue: number;
}

/**
 * Transparent multi-year projection of the financial consequences of waiting.
 * Delay path: rising repairs, then an unavoidable replacement. Preserve path:
 * a treatment now (re-applied periodically) that defers the big replacement.
 */
export function computeFutureProjection(cost: CostInputs, score: ScoreInputs, horizon = 12): FutureProjection {
  const health = computeRoofHealthScore(score);
  const ext = computeCostOfWaiting(cost, score).yearsExtended;
  const replaceYearDelay = Math.min(horizon, Math.max(2, Math.round(2 + (health / 100) * (horizon - 2))));
  const replaceYearPreserve = replaceYearDelay + Math.round(ext);

  const years: number[] = [], delay: number[] = [], preserve: number[] = [];
  let dCum = 0, pCum = 0, repair = 220;
  for (let y = 0; y <= horizon; y++) {
    // delay: escalating repairs each year, replacement lump at failure year
    if (y > 0) { dCum += repair; repair = Math.round(repair * 1.18); }
    if (y === replaceYearDelay) { dCum += cost.replacementCost; repair = 220; }
    // preserve: treatment now + re-apply every 7 yrs; light upkeep; replacement only if within horizon
    if (y === 0) pCum += cost.preservationCost;
    if (y > 0 && y % 7 === 0) pCum += cost.preservationCost;
    if (y > 0) pCum += 60;
    if (y === replaceYearPreserve && replaceYearPreserve <= horizon) pCum += cost.replacementCost;
    years.push(y); delay.push(dCum); preserve.push(pCum);
  }
  const maxValue = Math.max(...delay, ...preserve, 1);
  return { horizon, years, delay, preserve, replaceYearDelay, replaceYearPreserve, extraAtHorizon: dCum - pCum, maxValue };
}
