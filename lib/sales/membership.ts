import { supabaseAdmin } from "@/lib/supabase/admin";
import { getScope, type RepContext } from "@/lib/sales/auth";

const ENROLLED = ["Enrolled", "Active", "Pending Payment"];

async function owns(db: any, scope: { repIds: string[] | null }, leadId?: string | null, passportId?: string | null): Promise<boolean> {
  if (scope.repIds === null) return true; // admin
  if (leadId) {
    const { data } = await db.from("leads").select("rep_id").eq("id", leadId).limit(1);
    const r = data && data[0];
    if (r && r.rep_id && scope.repIds.includes(r.rep_id)) return true;
  }
  if (passportId) {
    const { data } = await db.from("roof_passports").select("rep_id,lead_id").eq("id", passportId).limit(1);
    const r = data && data[0];
    if (r) {
      if (r.rep_id && scope.repIds.includes(r.rep_id)) return true;
      if (r.lead_id) {
        const { data: l } = await db.from("leads").select("rep_id").eq("id", r.lead_id).limit(1);
        const lr = l && l[0];
        if (lr && lr.rep_id && scope.repIds.includes(lr.rep_id)) return true;
      }
    }
  }
  return false;
}

export interface RecordMembershipInput { passportId?: string | null; leadId?: string | null; tier: string; status: string; notes?: string; price?: number; }

export async function recordMembership(ctx: RepContext | null, p: RecordMembershipInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  const db = supabaseAdmin();
  if (!db) return { ok: true, id: "demo-mem" };
  if (!ctx) return { ok: false, error: "Unauthorized." };
  const scope = await getScope(ctx);
  if (!(await owns(db, scope, p.leadId, p.passportId))) return { ok: false, error: "Not permitted for this record." };

  let existing: any = null;
  if (p.passportId) { const { data } = await db.from("memberships").select("id").eq("passport_id", p.passportId).order("created_at", { ascending: false }).limit(1); existing = data && data[0]; }
  if (!existing && p.leadId) { const { data } = await db.from("memberships").select("id").eq("lead_id", p.leadId).order("created_at", { ascending: false }).limit(1); existing = data && data[0]; }

  const now = new Date();
  const enrolled = ENROLLED.includes(p.status);
  const fields: any = {
    passport_id: p.passportId || null, lead_id: p.leadId || null, rep_id: ctx.repId ?? null,
    tier: p.tier, status: p.status, interest: p.status === "Interested", notes: p.notes ?? null, price: p.price ?? null,
    enrolled_at: enrolled ? now.toISOString() : null,
    cancelled_at: p.status === "Cancelled" ? now.toISOString() : null,
    start_date: enrolled ? now.toISOString().slice(0, 10) : null,
    renewal_date: enrolled ? new Date(now.getTime() + 365 * 864e5).toISOString().slice(0, 10) : null,
  };
  try {
    if (existing) { await db.from("memberships").update(fields).eq("id", existing.id); return { ok: true, id: existing.id }; }
    const { data, error } = await db.from("memberships").insert(fields).select("id").single();
    if (error) throw error; return { ok: true, id: data?.id };
  } catch (e: any) { return { ok: false, error: e?.message || "Could not save membership." }; }
}

export async function updateMembership(ctx: RepContext | null, id: string, patch: { status?: string; tier?: string; notes?: string; price?: number }): Promise<{ ok: boolean; error?: string }> {
  const db = supabaseAdmin();
  if (!db) return { ok: true };
  if (!ctx) return { ok: false, error: "Unauthorized." };
  const scope = await getScope(ctx);
  const { data } = await db.from("memberships").select("id,lead_id,passport_id").eq("id", id).limit(1);
  const m = data && data[0];
  if (!m) return { ok: false, error: "Not found." };
  if (!(await owns(db, scope, m.lead_id, m.passport_id))) return { ok: false, error: "Not permitted." };
  const safe: any = {};
  if (patch.status) { safe.status = patch.status; if (patch.status === "Cancelled") safe.cancelled_at = new Date().toISOString(); if (ENROLLED.includes(patch.status) && !patch.tier) safe.enrolled_at = new Date().toISOString(); }
  if (patch.tier) safe.tier = patch.tier;
  if (patch.notes !== undefined) safe.notes = patch.notes;
  if (patch.price !== undefined) safe.price = patch.price;
  try { await db.from("memberships").update(safe).eq("id", id); return { ok: true }; }
  catch (e: any) { return { ok: false, error: e?.message || "Update failed." }; }
}

export async function getMembership(ctx: RepContext | null, by: { passportId?: string; leadId?: string }) {
  const db = supabaseAdmin();
  if (!db) return null;
  let q = db.from("memberships").select("*").order("created_at", { ascending: false }).limit(1);
  if (by.passportId) q = q.eq("passport_id", by.passportId);
  else if (by.leadId) q = q.eq("lead_id", by.leadId);
  else return null;
  const { data } = await q;
  return data && data[0] ? data[0] : null;
}

async function memCount(db: any, repIds: string[] | null, build?: (q: any) => any): Promise<number> {
  try {
    let q = db.from("memberships").select("*", { count: "exact", head: true });
    if (repIds) q = q.in("rep_id", repIds);
    if (build) q = build(q);
    const { count } = await q; return count || 0;
  } catch { return 0; }
}

export async function membershipMetricsRep(ctx: RepContext | null) {
  const db = supabaseAdmin();
  if (!db) return { interested: 0, enrolled: 0, renewals: 0, declined: 0 };
  const { repIds } = await getScope(ctx);
  const soon = new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10);
  const [interested, enrolled, declined, renewals] = await Promise.all([
    memCount(db, repIds, (q: any) => q.eq("status", "Interested")),
    memCount(db, repIds, (q: any) => q.in("status", ["Enrolled", "Active"])),
    memCount(db, repIds, (q: any) => q.eq("status", "Declined")),
    memCount(db, repIds, (q: any) => q.eq("status", "Active").lte("renewal_date", soon)),
  ]);
  return { interested, enrolled, declined, renewals };
}

export async function membershipMetricsAdmin() {
  const db = supabaseAdmin();
  if (!db) return null;
  const statuses = ["Interested", "Enrolled", "Pending Payment", "Active", "Cancelled", "Declined"];
  const byStatus = await Promise.all(statuses.map((s) => memCount(db, null, (q: any) => q.eq("status", s)).then((c) => ({ status: s, count: c }))));
  const soon = new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10);
  const upcomingRenewals = await memCount(db, null, (q: any) => q.eq("status", "Active").lte("renewal_date", soon));
  let byRep: any[] = [], byCity: any[] = [];
  try {
    const { data: reps } = await db.from("reps").select("id,name");
    const { data: mems } = await db.from("memberships").select("rep_id,status, leads(city)").limit(5000);
    byRep = (reps || []).map((r: any) => ({
      name: r.name,
      enrolled: (mems || []).filter((m: any) => m.rep_id === r.id && ["Enrolled", "Active"].includes(m.status)).length,
      interested: (mems || []).filter((m: any) => m.rep_id === r.id && m.status === "Interested").length,
    }));
    const cmap: Record<string, number> = {};
    (mems || []).forEach((m: any) => { if (["Enrolled", "Active"].includes(m.status)) { const c = m.leads?.city || "Unknown"; cmap[c] = (cmap[c] || 0) + 1; } });
    byCity = Object.entries(cmap).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count).slice(0, 8);
  } catch (e) { console.error("[membershipMetricsAdmin]", e); }
  return { byStatus, upcomingRenewals, byRep, byCity };
}
