import { supabaseAdmin } from "@/lib/supabase/admin";
import type { RepContext } from "@/lib/sales/auth";

export interface RepPerf { assignedLeads: number; presentations: number; sold: number; conversion: number; overdue: number; }
export interface RepRow {
  id: string; name?: string; email?: string; phone?: string; role?: string; territory?: string;
  manager_id?: string | null; active?: boolean; user_id?: string | null; last_login_at?: string | null; created_at?: string;
  perf?: RepPerf;
}
const EMPTY: RepPerf = { assignedLeads: 0, presentations: 0, sold: 0, conversion: 0, overdue: 0 };
const clean = (s?: string) => (s || "").replace(/[,()%*]/g, " ").trim();
const genPass = () => Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 5).toUpperCase() + "!7";

async function teamIds(db: any, managerRepId: string | null): Promise<string[]> {
  if (!managerRepId) return [];
  const ids = [managerRepId];
  const { data } = await db.from("reps").select("id").eq("manager_id", managerRepId);
  (data || []).forEach((r: any) => ids.push(r.id));
  return ids;
}

async function repPerfMap(db: any, ids: string[]): Promise<Record<string, RepPerf>> {
  const map: Record<string, RepPerf> = {};
  if (!ids.length) return map;
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: leads }, { data: sess }, { data: fus }] = await Promise.all([
    db.from("leads").select("rep_id,status").in("rep_id", ids),
    db.from("sales_sessions").select("rep_id").in("rep_id", ids),
    db.from("follow_ups").select("rep_id,status,due_date").in("rep_id", ids),
  ]);
  ids.forEach((id) => {
    const l = (leads || []).filter((x: any) => x.rep_id === id);
    const s = (sess || []).filter((x: any) => x.rep_id === id);
    const sold = l.filter((x: any) => x.status === "Sold").length;
    const overdue = (fus || []).filter((x: any) => x.rep_id === id && x.status === "Open" && x.due_date && x.due_date < today).length;
    map[id] = { assignedLeads: l.length, presentations: s.length, sold, conversion: s.length ? Math.round((sold / s.length) * 100) : 0, overdue };
  });
  return map;
}

export function canAccessAdminOrg(ctx: RepContext | null): boolean {
  return !!ctx && (ctx.role === "ADMIN" || ctx.role === "MANAGER");
}

/* ── reps ── */
export async function listReps(ctx: RepContext | null, f: { q?: string; role?: string; active?: string }): Promise<RepRow[]> {
  const db = supabaseAdmin();
  if (!db) return demoReps();
  if (!canAccessAdminOrg(ctx)) return [];
  let q = db.from("reps").select("*");
  if (ctx!.role === "MANAGER") q = q.eq("manager_id", ctx!.repId);
  if (f.role) q = q.eq("role", f.role);
  if (f.active === "active") q = q.eq("active", true);
  else if (f.active === "inactive") q = q.eq("active", false);
  const s = clean(f.q);
  if (s) q = q.or(`name.ilike.%${s}%,email.ilike.%${s}%,territory.ilike.%${s}%,role.ilike.%${s}%`);
  const { data: reps } = await q.order("name");
  const perf = await repPerfMap(db, (reps || []).map((r: any) => r.id));
  return (reps || []).map((r: any) => ({ ...r, perf: perf[r.id] || EMPTY }));
}

export async function getRep(ctx: RepContext | null, id: string) {
  const db = supabaseAdmin();
  if (!db) return { rep: demoReps()[0], leads: [], assignable: demoReps() };
  if (!canAccessAdminOrg(ctx)) return null;
  const { data } = await db.from("reps").select("*").eq("id", id).limit(1);
  const rep = data && data[0];
  if (!rep) return null;
  if (ctx!.role === "MANAGER" && rep.manager_id !== ctx!.repId && rep.id !== ctx!.repId) return null;
  const perf = await repPerfMap(db, [id]);
  const { data: leads } = await db.from("leads").select("id,name,city,status,latest_score").eq("rep_id", id).order("created_at", { ascending: false }).limit(50);
  const assignable = await listAssignableReps(ctx);
  return { rep: { ...rep, perf: perf[id] || EMPTY }, leads: leads || [], assignable };
}

export async function listAssignableReps(ctx: RepContext | null): Promise<RepRow[]> {
  const db = supabaseAdmin();
  if (!db) return demoReps();
  if (!canAccessAdminOrg(ctx)) return [];
  let q = db.from("reps").select("id,name,territory,role,active").eq("active", true);
  if (ctx!.role === "MANAGER") q = q.or(`id.eq.${ctx!.repId},manager_id.eq.${ctx!.repId}`);
  const { data } = await q.order("name");
  return (data || []) as RepRow[];
}

export async function createRep(ctx: RepContext | null, p: any): Promise<{ ok: boolean; id?: string; tempPassword?: string; placeholder?: boolean; error?: string }> {
  if (ctx?.role !== "ADMIN") return { ok: false, error: "Admin only." };
  const db = supabaseAdmin();
  if (!db) return { ok: false, error: "Supabase not configured.", placeholder: true };
  let userId: string | null = null;
  let tempPassword: string | undefined;
  if (p.invite) {
    try {
      tempPassword = genPass();
      const { data, error } = await db.auth.admin.createUser({ email: p.email, password: tempPassword, email_confirm: true });
      if (error) return { ok: false, error: error.message };
      userId = data.user?.id ?? null;
    } catch (e: any) { return { ok: false, error: e?.message || "Auth user creation failed." }; }
  }
  const { data, error } = await db.from("reps").insert({
    user_id: userId, name: p.name, email: p.email, phone: p.phone, role: p.role || "REP",
    territory: p.territory, manager_id: p.manager_id || null, active: p.active !== false,
  }).select("id").single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data?.id, tempPassword };
}

export async function updateRep(ctx: RepContext | null, id: string, patch: any): Promise<{ ok: boolean; error?: string }> {
  const db = supabaseAdmin();
  if (!db) return { ok: true };
  if (!canAccessAdminOrg(ctx)) return { ok: false, error: "Not permitted." };
  const { data } = await db.from("reps").select("*").eq("id", id).limit(1);
  const target = data && data[0];
  if (!target) return { ok: false, error: "Not found." };
  if (ctx!.role === "MANAGER") {
    if (target.manager_id !== ctx!.repId) return { ok: false, error: "Outside your team." };
    if (target.role === "ADMIN") return { ok: false, error: "Cannot edit an admin." };
  }
  const safe: any = {};
  ["name", "phone", "territory", "manager_id", "active"].forEach((k) => { if (k in patch) safe[k] = patch[k]; });
  if ("role" in patch) {
    if (ctx!.role === "ADMIN") safe.role = patch.role;
    else if (patch.role !== "ADMIN") safe.role = patch.role; // managers cannot promote to ADMIN
  }
  try { await db.from("reps").update(safe).eq("id", id); return { ok: true }; }
  catch (e: any) { return { ok: false, error: e?.message || "Update failed." }; }
}

/* ── lead assignment ── */
export async function assignLead(ctx: RepContext | null, leadId: string, newRepId: string, reason?: string): Promise<{ ok: boolean; error?: string }> {
  const db = supabaseAdmin();
  if (!db) return { ok: true };
  if (!ctx || ctx.role === "REP") return { ok: false, error: "Not permitted." };
  const { data: ld } = await db.from("leads").select("rep_id").eq("id", leadId).limit(1);
  const lead = ld && ld[0];
  if (!lead) return { ok: false, error: "Lead not found." };
  if (ctx.role === "MANAGER") {
    const team = await teamIds(db, ctx.repId);
    if (!team.includes(newRepId)) return { ok: false, error: "Target rep is outside your team." };
    if (lead.rep_id && !team.includes(lead.rep_id)) return { ok: false, error: "Lead is outside your team." };
  }
  try {
    await db.from("leads").update({ rep_id: newRepId }).eq("id", leadId);
    await db.from("follow_ups").update({ rep_id: newRepId }).eq("lead_id", leadId);
    await db.from("lead_assignment_history").insert({ lead_id: leadId, previous_rep_id: lead.rep_id, new_rep_id: newRepId, changed_by_rep_id: ctx.repId, reason });
    return { ok: true };
  } catch (e: any) { return { ok: false, error: e?.message || "Assign failed." }; }
}

export async function bulkAssign(ctx: RepContext | null, opts: { city?: string; onlyUnassigned?: boolean; newRepId: string; reason?: string }): Promise<{ ok: boolean; count?: number; error?: string }> {
  const db = supabaseAdmin();
  if (!db) return { ok: true, count: 0 };
  if (!ctx || ctx.role === "REP") return { ok: false, error: "Not permitted." };
  let q = db.from("leads").select("id,rep_id");
  if (opts.city) q = q.ilike("city", `%${clean(opts.city)}%`);
  if (opts.onlyUnassigned) q = q.is("rep_id", null);
  if (ctx.role === "MANAGER") {
    const team = await teamIds(db, ctx.repId);
    if (!team.includes(opts.newRepId)) return { ok: false, error: "Target rep is outside your team." };
    q = q.or(`rep_id.is.null,rep_id.in.(${team.join(",")})`);
  }
  const { data: rows } = await q.limit(500);
  const ids = (rows || []).map((r: any) => r.id);
  if (!ids.length) return { ok: true, count: 0 };
  try {
    await db.from("leads").update({ rep_id: opts.newRepId }).in("id", ids);
    await db.from("follow_ups").update({ rep_id: opts.newRepId }).in("lead_id", ids);
    await db.from("lead_assignment_history").insert((rows || []).map((r: any) => ({ lead_id: r.id, previous_rep_id: r.rep_id, new_rep_id: opts.newRepId, changed_by_rep_id: ctx.repId, reason: opts.reason || "bulk" })));
    return { ok: true, count: ids.length };
  } catch (e: any) { return { ok: false, error: e?.message || "Bulk assign failed." }; }
}

export async function listAdminLeads(ctx: RepContext | null, f: { status?: string; rep?: string; city?: string; source?: string; unassigned?: boolean }) {
  const db = supabaseAdmin();
  if (!db) return { leads: demoAdminLeads(), reps: demoReps() };
  if (!ctx || ctx.role === "REP") return { leads: [], reps: [] };
  let q = db.from("leads").select("*");
  if (ctx.role === "MANAGER") { const team = await teamIds(db, ctx.repId); q = q.or(`rep_id.is.null,rep_id.in.(${team.join(",")})`); }
  if (f.status) q = q.eq("status", f.status);
  if (f.rep) q = q.eq("rep_id", f.rep);
  if (f.city) q = q.ilike("city", `%${clean(f.city)}%`);
  if (f.source) q = q.eq("source", f.source);
  if (f.unassigned) q = q.is("rep_id", null);
  const { data: leads } = await q.order("created_at", { ascending: false }).limit(300);
  const assignable = await listAssignableReps(ctx);
  const nameById: Record<string, string> = {};
  assignable.forEach((r) => { if (r.id) nameById[r.id] = r.name || ""; });
  const withNames = (leads || []).map((l: any) => ({ ...l, rep_name: l.rep_id ? (nameById[l.rep_id] || "Assigned") : null }));
  return { leads: withNames, reps: assignable };
}

export async function assignmentHistory(leadId: string) {
  const db = supabaseAdmin();
  if (!db) return [];
  const { data } = await db.from("lead_assignment_history").select("*").eq("lead_id", leadId).order("created_at", { ascending: false });
  return data || [];
}

/* ── demo fallback ── */
function demoReps(): RepRow[] {
  return [
    { id: "r1", name: "Jane Rep", email: "jane@nanofrog.com", role: "REP", territory: "Macon", manager_id: "m1", active: true, perf: { assignedLeads: 12, presentations: 8, sold: 3, conversion: 38, overdue: 1 } },
    { id: "m1", name: "Sam Manager", email: "sam@nanofrog.com", role: "MANAGER", territory: "Middle GA", manager_id: null, active: true, perf: { assignedLeads: 0, presentations: 0, sold: 0, conversion: 0, overdue: 0 } },
  ];
}
function demoAdminLeads() {
  return [
    { id: "d1", name: "Sample Homeowner", city: "Macon", status: "Follow Up", source: "sales-platform", rep_id: "r1", rep_name: "Jane Rep", latest_score: 78 },
    { id: "d2", name: "Unassigned Lead", city: "Perry", status: "New", source: "website", rep_id: null, rep_name: null, latest_score: 84 },
  ];
}
