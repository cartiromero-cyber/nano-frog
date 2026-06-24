import { supabaseAdmin } from "@/lib/supabase/admin";
import type { SalesSession, Homeowner, RoofPassport } from "@/types/sales";
import { computeRoofHealthScore, scoreBand } from "./scoring";
import { recommend } from "./recommendation";

export interface Scope { repIds: string[] | null; } // null = all (admin)
export const persistenceEnabled = () => supabaseAdmin() !== null;

export async function upsertLead(h: Homeowner, repId?: string | null): Promise<string | null> {
  const db = supabaseAdmin();
  if (!db) return null;
  try {
    if (h.email) { const { data } = await db.from("leads").select("id").eq("email", h.email).limit(1); if (data && data[0]) return data[0].id as string; }
    if (h.phone) { const { data } = await db.from("leads").select("id").eq("phone", h.phone).limit(1); if (data && data[0]) return data[0].id as string; }
    const { data, error } = await db.from("leads")
      .insert({ name: h.name, email: h.email, phone: h.phone, address: h.address, city: h.city, rep_id: repId ?? null })
      .select("id").single();
    if (error) throw error;
    return data?.id ?? null;
  } catch (e) { console.error("[db.upsertLead]", e); return null; }
}

export async function saveSalesSession(s: SalesSession, leadId: string | null, repId?: string | null, userId?: string | null): Promise<string | null> {
  const db = supabaseAdmin();
  if (!db) return null;
  try {
    const score = computeRoofHealthScore(s.score);
    const rec = recommend(s.score);
    const { data, error } = await db.from("sales_sessions").insert({
      lead_id: leadId, rep_id: repId ?? null, user_id: userId ?? null,
      connection: s.connection, score_inputs: s.score, cost_inputs: s.cost,
      recommendation: rec.summary, recommendation_tier: rec.tier, next_step: s.nextStep, territory: s.homeowner.city,
    }).select("id").single();
    if (error) throw error;
    const sessionId = data?.id as string;
    await db.from("roof_assessments").insert({ lead_id: leadId, session_id: sessionId, roof_age: s.score.roofAge, roof_type: s.score.roofType, score, condition_summary: rec.summary });
    await db.from("roof_health_scores").insert({ session_id: sessionId, score, band: scoreBand(score) });
    await db.from("recommendations").insert({ session_id: sessionId, text: rec.summary, priority: "medium", category: rec.tier });
    return sessionId;
  } catch (e) { console.error("[db.saveSalesSession]", e); return null; }
}

export async function createOrUpdatePassport(s: SalesSession, leadId: string | null, repId?: string | null): Promise<string | null> {
  const db = supabaseAdmin();
  if (!db) return null;
  try {
    const score = computeRoofHealthScore(s.score);
    const rec = recommend(s.score);
    const h = s.homeowner;
    let existing: string | null = null;
    for (const [col, val] of [["email", h.email], ["phone", h.phone], ["address", h.address]] as const) {
      if (existing || !val) continue;
      const { data } = await db.from("roof_passports").select("id").eq(col, val).limit(1);
      if (data && data[0]) existing = data[0].id as string;
    }
    const today = new Date().toISOString().slice(0, 10);
    const payload = {
      lead_id: leadId, rep_id: repId ?? null, owner_name: h.name, phone: h.phone, email: h.email, address: h.address, city: h.city,
      roof_age: s.score.roofAge, roof_type: s.score.roofType, latest_score: score, condition_summary: rec.summary, recommendation: rec.tier,
    };
    let passportId: string;
    if (existing) { await db.from("roof_passports").update(payload).eq("id", existing); passportId = existing; }
    else {
      const { data, error } = await db.from("roof_passports")
        .insert({ ...payload, inspections: [{ date: today, summary: "Initial in-home assessment completed." }], preservation: [] })
        .select("id").single();
      if (error) throw error; passportId = data?.id as string;
    }
    await db.from("roof_health_scores").insert({ passport_id: passportId, score, band: scoreBand(score) });
    await db.from("recommendations").insert({ passport_id: passportId, text: rec.summary, priority: "medium", category: rec.tier });
    return passportId;
  } catch (e) { console.error("[db.createOrUpdatePassport]", e); return null; }
}

export async function lookupPassport(by: { id?: string; phone?: string; email?: string; address?: string }): Promise<RoofPassport | null> {
  const db = supabaseAdmin();
  if (!db) return null;
  try {
    let q = db.from("roof_passports").select("*").limit(1);
    if (by.id) q = q.eq("id", by.id);
    else if (by.email) q = q.eq("email", by.email);
    else if (by.phone) q = q.eq("phone", by.phone);
    else if (by.address) q = q.eq("address", by.address);
    else return null;
    const { data: rows } = await q;
    const p = rows && rows[0];
    if (!p) return null;
    const [scores, recs, photos, docs, mem] = await Promise.all([
      db.from("roof_health_scores").select("*").eq("passport_id", p.id).order("created_at"),
      db.from("recommendations").select("*").eq("passport_id", p.id).order("created_at"),
      db.from("passport_photos").select("*").eq("passport_id", p.id).order("created_at"),
      db.from("passport_documents").select("*").eq("passport_id", p.id).order("created_at"),
      db.from("memberships").select("*").eq("passport_id", p.id).order("created_at", { ascending: false }).limit(1),
    ]);
    const m = mem.data && mem.data[0];
    return {
      id: p.id, property: { owner: p.owner_name, address: p.address, city: p.city }, createdAt: p.created_at,
      scoreHistory: (scores.data || []).map((x: any) => ({ date: x.created_at, score: x.score, band: x.band })),
      inspections: (p.inspections || []) as any[],
      photos: (photos.data || []).map((x: any) => ({ date: x.created_at, url: x.url, caption: x.caption })),
      preservation: (p.preservation || []) as any[],
      warranties: (docs.data || []).map((x: any) => ({ name: x.name, issued: x.issued || x.created_at, expires: x.expires, docUrl: x.url })),
      recommendations: (recs.data || []).map((x: any) => ({ date: x.created_at, text: x.text, priority: x.priority })),
      membership: m ? { tier: m.tier, since: m.since, renews: m.renews, status: m.status === "active" ? "active" : "none" } : { tier: "None", status: "none" },
    };
  } catch (e) { console.error("[db.lookupPassport]", e); return null; }
}

export type UploadTarget = "lead" | "sales_session" | "roof_passport" | "assessment";
export async function attachUpload(meta: { target: UploadTarget; targetId?: string; path: string; url: string; fileType: string; caption?: string; uploadedBy?: string; }): Promise<string | null> {
  const db = supabaseAdmin();
  if (!db) return null;
  try {
    const isImage = meta.fileType.startsWith("image/");
    const base: any = { path: meta.path, url: meta.url, file_type: meta.fileType, uploaded_by: meta.uploadedBy };
    const link = meta.target === "roof_passport" ? { passport_id: meta.targetId } : meta.target === "lead" ? { lead_id: meta.targetId } : meta.target === "sales_session" ? { session_id: meta.targetId } : { assessment_id: meta.targetId };
    if (isImage) { const { data, error } = await db.from("passport_photos").insert({ ...base, caption: meta.caption, ...link }).select("id").single(); if (error) throw error; return data?.id ?? null; }
    const { data, error } = await db.from("passport_documents").insert({ ...base, name: meta.caption || "Document", passport_id: link.passport_id }).select("id").single();
    if (error) throw error; return data?.id ?? null;
  } catch (e) { console.error("[db.attachUpload]", e); return null; }
}

export async function recordMembershipInterest(passportId: string | null, leadId: string | null, tier: string) {
  const db = supabaseAdmin();
  if (!db) return null;
  try { const { data } = await db.from("memberships").insert({ passport_id: passportId, lead_id: leadId, tier, status: "interest", interest: true }).select("id").single(); return data?.id ?? null; }
  catch (e) { console.error("[db.recordMembershipInterest]", e); return null; }
}

// ── aggregates (role-scoped) ──
async function scopedCount(table: string, scope?: Scope, build?: (q: any) => any): Promise<number> {
  const db = supabaseAdmin(); if (!db) return 0;
  try {
    let q = db.from(table).select("*", { count: "exact", head: true });
    if (scope && scope.repIds) q = q.in("rep_id", scope.repIds);
    if (build) q = build(q);
    const { count } = await q; return count || 0;
  } catch { return 0; }
}

export async function repMetricsLive(scope: Scope) {
  if (!persistenceEnabled()) return null;
  const [leads, presentations, followUps, passports, membership, converted] = await Promise.all([
    scopedCount("leads", scope), scopedCount("sales_sessions", scope), scopedCount("follow_ups", scope, (q) => q.eq("status", "open")),
    scopedCount("roof_passports", scope), scopedCount("memberships"), scopedCount("sales_sessions", scope, (q) => q.not("next_step", "is", null)),
  ]);
  const conversionRate = presentations ? Math.round((converted / presentations) * 100) : 0;
  return { leads, presentations, conversionRate, followUps, passports, membership };
}

export async function adminMetricsLive() {
  const db = supabaseAdmin(); if (!db) return null;
  const tiers = ["Excellent Candidate", "Good Candidate", "Needs Inspection", "Not Recommended"];
  const [leads, presentations, assessments, converted] = await Promise.all([
    scopedCount("leads"), scopedCount("sales_sessions"), scopedCount("roof_assessments"), scopedCount("sales_sessions", undefined, (q) => q.not("next_step", "is", null)),
  ]);
  const byCat = await Promise.all(tiers.map((t) => scopedCount("sales_sessions", undefined, (q) => q.eq("recommendation_tier", t))));
  let cities: { city: string; count: number }[] = [];
  let reps: { name: string; presentations: number }[] = [];
  try {
    const { data: leadRows } = await db.from("leads").select("city").limit(2000);
    const cmap: Record<string, number> = {};
    (leadRows || []).forEach((r: any) => { const c = r.city || "Unknown"; cmap[c] = (cmap[c] || 0) + 1; });
    cities = Object.entries(cmap).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count).slice(0, 8);
    const { data: repRows } = await db.from("reps").select("id,name");
    const { data: sess } = await db.from("sales_sessions").select("rep_id").limit(5000);
    reps = (repRows || []).map((r: any) => ({ name: r.name, presentations: (sess || []).filter((x: any) => x.rep_id === r.id).length }));
  } catch (e) { console.error("[db.adminMetricsLive]", e); }
  return { leads, presentations, assessments, conversionRate: presentations ? Math.round((converted / presentations) * 100) : 0, recommendationsByCategory: tiers.map((t, i) => ({ tier: t, count: byCat[i] })), revenue: 0, reps, cities };
}
