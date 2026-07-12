export interface ConnectionAnswers {
  yearsLived?: string; foreverHome?: boolean; replacedBefore?: boolean; stayingLong?: boolean;
}
export interface ScoreInputs {
  roofAge: number; roofType: string; granule: number; flexibility: number;
  ventilation: number; repairHistory: number; stormExposure: number;
}
export interface CostInputs { replacementCost: number; preservationCost: number; }
/** P-002: an annotated inspection photo shown on the "Your Roof Today" slide. */
export interface RoofPhotoNote { dataUrl: string; status: "healthy" | "watch" | "concern"; label?: string; }
export interface Homeowner { name?: string; phone?: string; email?: string; city?: string; address?: string; }
export type RecommendationTier = "Excellent Candidate" | "Good Candidate" | "Needs Inspection" | "Not Recommended";

export interface SalesSession {
  homeowner: Homeowner; connection: ConnectionAnswers; score: ScoreInputs; cost: CostInputs;
  roofPhotos?: RoofPhotoNote[];
  /** P-004: the Investment slide's selected size band (Rev D pricing).
   *  price = final quoted price (band × disclosed modifier, bounded — no discounts);
   *  suggested = the system's metric-based suggestion, kept for the record. */
  investment?: { band: string; price: number; suggested?: number; modifierPct?: number };
  /** Approximate roof metrics captured on-site — drive the band/price suggestion. */
  metrics?: { homeSqFt?: number; steepPitch?: boolean; tallOrComplex?: boolean };
  /** Inspector of record (title card + report + passport). */
  inspector?: string;
  /** Explicit decision from "Let's Protect It" — drives the outcome branch
   *  deterministically (never inferred from label strings). */
  decision?: "approved" | "wait";
  nextStep?: string; createdAt: string;
}
export interface StepProps {
  session: SalesSession; update: (patch: Partial<SalesSession>) => void;
  goNext: () => void; goPrev: () => void;
}
export function newSession(): SalesSession {
  return {
    homeowner: {}, connection: {},
    score: { roofAge: 14, roofType: "Architectural shingle", granule: 70, flexibility: 70, ventilation: 75, repairHistory: 80, stormExposure: 70 },
    cost: { replacementCost: 14000, preservationCost: 2200 },
    createdAt: new Date().toISOString(),
  };
}

/* ───────── Digital Roof Passport(TM) ───────── */
export interface ScoreHistoryEntry { date: string; score: number; band: string; }
export interface InspectionEntry { date: string; inspector?: string; summary: string; }
export interface PhotoEntry { date: string; url: string; caption?: string; }
export interface PreservationEntry { date: string; treatment: string; notes?: string; }
export interface WarrantyEntry { name: string; issued: string; expires?: string; docUrl?: string; }
export interface RecommendationEntry { date: string; text: string; priority?: "low" | "medium" | "high"; }
export interface Membership { tier: string; since?: string; renews?: string; status: "active" | "none"; }

export interface RoofPassport {
  id: string;
  property: { owner?: string; address?: string; city?: string };
  createdAt: string;
  scoreHistory: ScoreHistoryEntry[];
  inspections: InspectionEntry[];
  photos: PhotoEntry[];
  preservation: PreservationEntry[];
  warranties: WarrantyEntry[];
  recommendations: RecommendationEntry[];
  membership: Membership;
}
