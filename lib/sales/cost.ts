import type { CostInputs, ScoreInputs } from "@/types/sales";
import { computeRoofHealthScore } from "./scoring";

export interface CostResult {
  replacementCost: number;
  preservationCost: number;
  immediateSavings: number;     // replacement - preservation
  yearsExtended: number;        // estimated added usable life
  deferredCostValue: number;    // present-ish value of pushing replacement out
  costPerYearPreserve: number;  // preservation cost / years extended
}

/**
 * "Cost of waiting" model. Transparent and conservative; the homeowner should be able
 * to follow every number. Years-extended scales with current roof health.
 */
export function computeCostOfWaiting(cost: CostInputs, score: ScoreInputs): CostResult {
  const health = computeRoofHealthScore(score);
  // Healthier roofs gain more usable years from preservation (range ~3-8 yrs).
  const yearsExtended = Math.round((3 + (health / 100) * 5) * 10) / 10;
  const immediateSavings = Math.max(0, cost.replacementCost - cost.preservationCost);
  // Simple deferral value: replacement cost spread/deferred across the extended years.
  const deferredCostValue = Math.round(cost.replacementCost * (yearsExtended / 25));
  const costPerYearPreserve = yearsExtended > 0 ? Math.round(cost.preservationCost / yearsExtended) : cost.preservationCost;
  return {
    replacementCost: cost.replacementCost,
    preservationCost: cost.preservationCost,
    immediateSavings,
    yearsExtended,
    deferredCostValue,
    costPerYearPreserve,
  };
}

export function money(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}
