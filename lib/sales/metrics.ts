import { getCurrentRep, getScope } from "./auth";
import { repMetricsLive, adminMetricsLive } from "./db";

export async function getRepMetrics() {
  const ctx = await getCurrentRep();
  const scope = await getScope(ctx);
  const live = await repMetricsLive(scope);
  if (live) return { ...live, territory: ctx?.territory || "All territories", role: ctx?.role || "REP", live: true };
  return { leads: 0, presentations: 0, conversionRate: 0, followUps: 0, passports: 0, membership: 0, territory: ctx?.territory || "Demo", role: ctx?.role || "ADMIN", live: false };
}

export async function getAdminMetrics() {
  const live = await adminMetricsLive();
  if (live) return { ...live, live: true };
  return { leads: 0, presentations: 0, assessments: 0, conversionRate: 0, recommendationsByCategory: [], revenue: 0, reps: [], cities: [], live: false };
}
