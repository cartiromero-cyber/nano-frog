import { supabaseAdmin } from "@/lib/supabase/admin";
import { getScope, type RepContext } from "@/lib/sales/auth";

export interface LeadRow {
  id: string; name?: string; email?: string; phone?: string; address?: string; city?: string;
  status?: string; source?: string; rep_id?: string | null;
  roof_age?: number | null; insurance_concern?: boolean | null; visible_damage?: boolean | null;
  latest_score?: number | null; next_follow_up_at?: string | null; last_contacted_at?: string | null; created_at?: string;
}
export interface LeadFilters { q?: string; status?: string; source?: string; city?: string; sort?: string; }

function applyScope(q: any, repIds: string[] | null) { return repIds ? q.in("rep_id", repIds) : q; }
const clean = (s?: string) => (s || "").replace(/[,()%*]/g, " ").trim();

async function leadAllowed(db: any, repIds: string[] | null, id: string): Promise<boolean> {
  if (repIds === null) return true; // admin
  const { data } = await db.from("leads").select("rep_id").eq("id", id).limit(1);
  const r = data && data[0];
  return !!r && r.rep_id != null && repIds.includes(r.rep_id);
}

/* ── reads ── */
export async function listLeads(ctx: RepContext | null, f: LeadFilters): Promise<LeadRow[]> {
  const db = supabaseAdmin();
  if (!db) return demoLeads();
  const { repIds } = await getScope(ctx);
  let q = applyScope(db.from("leads").select("*"), repIds);
  if (f.status) q = q.eq("status", f.status);
  if (f.source) q = q.eq("source", f.source);
  if (f.city) q = q.ilike("city", `%${clean(f.city)}%`);
  const s = clean(f.q);
  if (s) q = q.or(`name.ilike.%${s}%,email.ilike.%${s}%,phone.ilike.%${s}%,address.ilike.%${s}%,city.ilike.%${s}%`);
  if (f.sort === "hot") q = q.order("latest_score", { ascending: false, nullsFirst: false });
  else if (f.sort === "followup") q = q.order("next_follow_up_at", { ascending: true, nullsFirst: false });
  else if (f.sort === "contacted") q = q.order("last_contacted_at", { ascending: false, nullsFirst: false });
  else q = q.order("created_at", { ascending: false });
  const { data } = await q.limit(200);
  return (data || []) as LeadRow[];
}

export async function getLeadDetail(ctx: RepContext | null, id: string) {
  const db = supabaseAdmin();
  if (!db) return demoLeadDetail(id);
  const { repIds } = await getScope(ctx);
  if (!(await leadAllowed(db, repIds, id))) return null;
  const { data: leadRows } = await db.from("leads").select("*").eq("id", id).limit(1);
  const lead = leadRows && leadRows[0];
  if (!lead) return null;
  const [notes, follows, sessions, photos, mems, passports] = await Promise.all([
    db.from("lead_notes").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
    db.from("follow_ups").select("*").eq("lead_id", id).order("due_date", { ascending: true }),
    db.from("sales_sessions").select("id,created_at,recommendation_tier,next_step").eq("lead_id", id).order("created_at", { ascending: false }),
    db.from("passport_photos").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
    db.from("memberships").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
    db.from("roof_passports").select("id,latest_score").eq("lead_id", id).limit(1),
  ]);
  const sessionIds = (sessions.data || []).map((s: any) => s.id);
  let scores: any[] = [], recList: any[] = [];
  if (sessionIds.length) {
    const [{ data: sc }, { data: rc }] = await Promise.all([
      db.from("roof_health_scores").select("*").in("session_id", sessionIds).order("created_at"),
      db.from("recommendations").select("*").in("session_id", sessionIds).order("created_at", { ascending: false }),
    ]);
    scores = sc || []; recList = rc || [];
  }
  return {
    lead, notes: notes.data || [], followUps: follows.data || [], sessions: sessions.data || [],
    scores, recommendations: recList, photos: photos.data || [], memberships: mems.data || [],
    passportId: passports.data && passports.data[0] ? passports.data[0].id : null,
  };
}

export async function repCockpit(ctx: RepContext | null) {
  const db = supabaseAdmin();
  if (!db) return demoCockpit();
  const { repIds } = await getScope(ctx);
  const today = new Date().toISOString().slice(0, 10);
  const fuBase = () => applyScope(db.from("follow_ups").select("*, leads(name,phone,city)"), repIds).eq("status", "Open");
  const [todays, hot, recent, passports, assess, sold, total] = await Promise.all([
    fuBase().eq("due_date", today).order("due_date"),
    applyScope(db.from("leads").select("*"), repIds).order("latest_score", { ascending: false, nullsFirst: false }).limit(6),
    applyScope(db.from("sales_sessions").select("id,created_at,recommendation_tier, leads(name,city)"), repIds).order("created_at", { ascending: false }).limit(5),
    countScoped(db, "roof_passports", repIds),
    countScoped(db, "leads", repIds, (q: any) => q.eq("status", "Assessment Scheduled")),
    countScoped(db, "leads", repIds, (q: any) => q.eq("status", "Sold")),
    countScoped(db, "leads", repIds),
  ]);
  return {
    todays: todays.data || [], hot: hot.data || [], recent: recent.data || [],
    passports, assess, conversion: total ? Math.round((sold / total) * 100) : 0,
  };
}

export async function listFollowUps(ctx: RepContext | null, bucket: string) {
  const db = supabaseAdmin();
  if (!db) return demoFollowUps(bucket);
  const { repIds } = await getScope(ctx);
  const today = new Date().toISOString().slice(0, 10);
  let q = applyScope(db.from("follow_ups").select("*, leads(name,phone,city)"), repIds);
  if (bucket === "completed") q = q.eq("status", "Completed").order("completed_at", { ascending: false });
  else if (bucket === "overdue") q = q.eq("status", "Open").lt("due_date", today).order("due_date");
  else if (bucket === "upcoming") q = q.eq("status", "Open").gt("due_date", today).order("due_date");
  else q = q.eq("status", "Open").eq("due_date", today).order("due_date"); // today
  const { data } = await q.limit(100);
  return data || [];
}

async function countScoped(db: any, table: string, repIds: string[] | null, build?: (q: any) => any): Promise<number> {
  try {
    let q = applyScope(db.from(table).select("*", { count: "exact", head: true }), repIds);
    if (build) q = build(q);
    const { count } = await q; return count || 0;
  } catch { return 0; }
}

/* ── mutations (role enforced) ── */
export async function createLead(ctx: RepContext | null, p: Partial<LeadRow>): Promise<string | null> {
  const db = supabaseAdmin();
  if (!db) return "demo-new";
  try {
    const { data, error } = await db.from("leads").insert({
      name: p.name, email: p.email, phone: p.phone, address: p.address, city: p.city,
      roof_age: p.roof_age, insurance_concern: p.insurance_concern, visible_damage: p.visible_damage,
      source: "rep-manual", status: "New", rep_id: ctx?.repId ?? null,
    }).select("id").single();
    if (error) throw error; return data?.id ?? null;
  } catch (e) { console.error("[crm.createLead]", e); return null; }
}

export async function updateLeadStatus(ctx: RepContext | null, id: string, status: string): Promise<boolean> {
  const db = supabaseAdmin();
  if (!db) return true;
  const { repIds } = await getScope(ctx);
  if (!(await leadAllowed(db, repIds, id))) return false;
  try { await db.from("leads").update({ status, last_contacted_at: new Date().toISOString() }).eq("id", id); return true; }
  catch (e) { console.error("[crm.updateLeadStatus]", e); return false; }
}

export async function addNote(ctx: RepContext | null, id: string, note: string, type: string): Promise<boolean> {
  const db = supabaseAdmin();
  if (!db) return true;
  const { repIds } = await getScope(ctx);
  if (!(await leadAllowed(db, repIds, id))) return false;
  try {
    await db.from("lead_notes").insert({ lead_id: id, rep_id: ctx?.repId ?? null, note, type });
    if (["Call", "Text", "Visit"].includes(type)) await db.from("leads").update({ last_contacted_at: new Date().toISOString() }).eq("id", id);
    return true;
  } catch (e) { console.error("[crm.addNote]", e); return false; }
}

export async function scheduleFollowUp(ctx: RepContext | null, id: string, fu: { due_date: string; type: string; notes?: string }): Promise<boolean> {
  const db = supabaseAdmin();
  if (!db) return true;
  const { repIds } = await getScope(ctx);
  if (!(await leadAllowed(db, repIds, id))) return false;
  try {
    await db.from("follow_ups").insert({ lead_id: id, rep_id: ctx?.repId ?? null, due_date: fu.due_date, type: fu.type, notes: fu.notes, status: "Open" });
    await db.from("leads").update({ next_follow_up_at: fu.due_date }).eq("id", id);
    return true;
  } catch (e) { console.error("[crm.scheduleFollowUp]", e); return false; }
}

export async function completeFollowUp(ctx: RepContext | null, followUpId: string): Promise<boolean> {
  const db = supabaseAdmin();
  if (!db) return true;
  const { repIds } = await getScope(ctx);
  try {
    if (repIds) {
      const { data } = await db.from("follow_ups").select("rep_id").eq("id", followUpId).limit(1);
      const r = data && data[0];
      if (!r || !repIds.includes(r.rep_id)) return false;
    }
    await db.from("follow_ups").update({ status: "Completed", completed_at: new Date().toISOString() }).eq("id", followUpId);
    return true;
  } catch (e) { console.error("[crm.completeFollowUp]", e); return false; }
}

/** Called after a presentation to keep the lead card current. */
export async function enrichLeadAfterSession(leadId: string | null, scoreInputs: any, latestScore: number) {
  const db = supabaseAdmin();
  if (!db || !leadId) return;
  try {
    await db.from("leads").update({
      latest_score: latestScore, roof_age: scoreInputs?.roofAge ?? null,
      last_contacted_at: new Date().toISOString(), status: "Presentation Completed",
    }).eq("id", leadId);
  } catch (e) { console.error("[crm.enrichLeadAfterSession]", e); }
}

/* ── demo fallback data (no Supabase configured) ── */
function demoLeads(): LeadRow[] {
  return [
    { id: "d1", name: "Sample Homeowner", phone: "(478) 555-0101", email: "sample@example.com", city: "Macon", address: "123 Maple St", status: "Follow Up", source: "sales-platform", roof_age: 16, insurance_concern: true, visible_damage: false, latest_score: 78, next_follow_up_at: new Date().toISOString(), created_at: new Date().toISOString() },
    { id: "d2", name: "Demo Lead Two", phone: "(478) 555-0102", email: "two@example.com", city: "Warner Robins", address: "44 Oak Ave", status: "New", source: "website", roof_age: 12, insurance_concern: false, visible_damage: true, latest_score: 84, created_at: new Date().toISOString() },
  ];
}
function demoLeadDetail(id: string) {
  return { lead: demoLeads()[0], notes: [], followUps: [], sessions: [], scores: [], recommendations: [], photos: [], memberships: [], passportId: null };
}
function demoCockpit() { return { todays: [], hot: demoLeads(), recent: [], passports: 0, assess: 0, conversion: 0 }; }
function demoFollowUps(_: string) { return []; }


/** Admin-wide activity (no scope). Returns null when Supabase not configured. */
export async function adminActivity() {
  const db = supabaseAdmin();
  if (!db) return null;
  const statuses = ["New", "Contacted", "Presentation Completed", "Assessment Scheduled", "Sold", "Not Qualified", "Follow Up", "Lost"];
  const today = new Date().toISOString().slice(0, 10);
  const statusCounts = await Promise.all(statuses.map((s) => countScoped(db, "leads", null, (q: any) => q.eq("status", s)).then((n) => ({ status: s, count: n }))));
  const overdue = await countScoped(db, "follow_ups", null, (q: any) => q.eq("status", "Open").lt("due_date", today));
  let repActivity: any[] = [];
  try {
    const [{ data: reps }, { data: sessions }, { data: leads }, { data: fus }] = await Promise.all([
      db.from("reps").select("id,name,territory"),
      db.from("sales_sessions").select("rep_id,next_step").limit(5000),
      db.from("leads").select("rep_id,status").limit(5000),
      db.from("follow_ups").select("rep_id,status").limit(5000),
    ]);
    repActivity = (reps || []).map((r: any) => {
      const sess = (sessions || []).filter((x: any) => x.rep_id === r.id);
      const sold = (leads || []).filter((x: any) => x.rep_id === r.id && x.status === "Sold").length;
      const open = (fus || []).filter((x: any) => x.rep_id === r.id && x.status === "Open").length;
      return { name: r.name, territory: r.territory, presentations: sess.length, sold, openFollowUps: open, conversion: sess.length ? Math.round((sold / sess.length) * 100) : 0 };
    });
  } catch (e) { console.error("[crm.adminActivity]", e); }
  return { statusCounts, overdue, repActivity };
}
