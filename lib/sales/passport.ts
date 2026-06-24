import type { RoofPassport, SalesSession } from "@/types/sales";
import { computeRoofHealthScore, scoreBand } from "./scoring";
import { recommend } from "./recommendation";

// Isomorphic id (no node-only crypto so this file is safe on client + server).
const rid = () => "rp_" + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
const today = () => new Date().toISOString().slice(0, 10);

/** Seed a brand-new passport from a completed presentation session. */
export function createPassportFromSession(session: SalesSession): RoofPassport {
  const score = computeRoofHealthScore(session.score);
  const rec = recommend(session.score);
  return {
    id: rid(),
    property: { owner: session.homeowner.name, address: session.homeowner.address, city: session.homeowner.city },
    createdAt: new Date().toISOString(),
    scoreHistory: [{ date: today(), score, band: scoreBand(score) }],
    inspections: [{ date: today(), summary: "Initial in-home assessment completed." }],
    photos: [],
    preservation: [],
    warranties: [],
    recommendations: [{ date: today(), text: rec.summary, priority: rec.tier === "Excellent Candidate" ? "high" : "medium" }],
    membership: { tier: "None", status: "none" },
  };
}

/** Example passport for the /passport preview (shows what a maintained record looks like). */
export function demoPassport(): RoofPassport {
  return {
    id: "rp_demo01",
    property: { owner: "Sample Homeowner", address: "123 Maple Street", city: "Georgia" },
    createdAt: "2024-05-12T00:00:00Z",
    scoreHistory: [
      { date: "2024-05-12", score: 74, band: "Strong" },
      { date: "2025-05-20", score: 78, band: "Strong" },
      { date: "2026-05-18", score: 80, band: "Excellent" },
    ],
    inspections: [
      { date: "2024-05-12", inspector: "Field Specialist", summary: "Initial assessment \u2014 strong preservation candidate." },
      { date: "2025-05-20", inspector: "Field Specialist", summary: "Annual check-up \u2014 surface holding well." },
      { date: "2026-05-18", inspector: "Field Specialist", summary: "Annual check-up \u2014 membrane performing as designed." },
    ],
    photos: [
      { date: "2024-05-12", url: "/assets/nanofrog-mark.png", caption: "Pre-treatment, south slope" },
      { date: "2025-05-20", url: "/assets/nanofrog-mark.png", caption: "12-month follow-up" },
    ],
    preservation: [
      { date: "2024-05-15", treatment: "Nano Frog preservation application", notes: "Full roof, eligible architectural shingle." },
    ],
    warranties: [
      { name: "Preservation Service Record", issued: "2024-05-15", expires: "2029-05-15" },
    ],
    recommendations: [
      { date: "2026-05-18", text: "Continue annual Roof Health Score check-ups; re-evaluate re-treatment window in ~3 years.", priority: "medium" },
    ],
    membership: { tier: "Protected", since: "2024-05-15", renews: "2027-05-15", status: "active" },
  };
}

/** Persist / append \u2014 pluggable, same env pattern as lib/leads.ts; logs by default. */
export async function savePassport(p: RoofPassport) {
  switch (process.env.LEAD_STORE) {
    case "supabase": case "postgres": case "airtable": /* TODO: upsert passport by id */ break;
    default: console.log("[ROOF_PASSPORT]", p.id);
  }
  return p;
}
