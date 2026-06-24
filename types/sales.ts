export interface ConnectionAnswers {
  yearsLived?: string; foreverHome?: boolean; replacedBefore?: boolean; stayingLong?: boolean;
}
export interface ScoreInputs {
  roofAge: number; roofType: string; granule: number; flexibility: number;
  ventilation: number; repairHistory: number; stormExposure: number;
}
export interface CostInputs { replacementCost: number; preservationCost: number; }
export interface Homeowner { name?: string; phone?: string; email?: string; city?: string; address?: string; }
export type RecommendationTier = "Excellent Candidate" | "Good Candidate" | "Needs Inspection" | "Not Recommended";

export interface SalesSession {
  homeowner: Homeowner; connection: ConnectionAnswers; score: ScoreInputs; cost: CostInputs;
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
