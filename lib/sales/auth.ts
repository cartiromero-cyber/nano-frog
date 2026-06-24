import { supabaseAuthServer } from "@/lib/supabase/auth-server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type Role = "REP" | "MANAGER" | "ADMIN";
export interface RepContext {
  userId: string | null; repId: string | null; name: string; email?: string;
  role: Role; territory: string; managerId: string | null; demo: boolean;
}
export interface Scope { repIds: string[] | null; } // null = all (admin)

const DEMO: RepContext = { userId: null, repId: null, name: "Demo Admin", role: "ADMIN", territory: "All territories", managerId: null, demo: true };

/** Resolve the signed-in rep. Returns a demo ADMIN context when Supabase is not configured. */
export async function getCurrentRep(): Promise<RepContext | null> {
  const auth = supabaseAuthServer();
  if (!auth) return DEMO; // fallback/demo mode
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return null;
  const db = supabaseAdmin();
  let row: any = null;
  if (db) {
    const { data } = await db.from("reps").select("id,name,email,role,territory,manager_id").eq("user_id", user.id).limit(1);
    row = data && data[0];
  }
  return {
    userId: user.id,
    repId: row?.id ?? null,
    name: row?.name || user.email || "User",
    email: user.email || undefined,
    role: (row?.role as Role) || "REP",
    territory: row?.territory || "Unassigned",
    managerId: row?.manager_id ?? null,
    demo: false,
  };
}

/** Build the rep-id scope for queries based on role. */
export async function getScope(ctx: RepContext | null): Promise<Scope> {
  if (!ctx || ctx.role === "ADMIN") return { repIds: null }; // see all
  if (ctx.role === "MANAGER") {
    const db = supabaseAdmin();
    const ids = ctx.repId ? [ctx.repId] : [];
    if (db && ctx.repId) {
      const { data } = await db.from("reps").select("id").eq("manager_id", ctx.repId);
      (data || []).forEach((r: any) => ids.push(r.id));
    }
    return { repIds: ids };
  }
  return { repIds: ctx.repId ? [ctx.repId] : ["__none__"] }; // REP: own only
}
