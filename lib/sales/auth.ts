import { supabaseAuthServer } from "@/lib/supabase/auth-server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type Role = "REP" | "MANAGER" | "ADMIN";
export interface RepContext {
  userId: string | null; repId: string | null; name: string; email?: string;
  role: Role; territory: string; managerId: string | null; demo: boolean;
}
export interface Scope { repIds: string[] | null; } // null = all (admin)

/**
 * Resolve the signed-in rep. C1 (approved): no demo fallback — when Supabase is not
 * configured or no user is signed in, this returns null and every caller must deny access.
 */
export async function getCurrentRep(): Promise<RepContext | null> {
  const auth = supabaseAuthServer();
  if (!auth) return null; // auth not configured -> nobody is authenticated
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return null;
  const db = supabaseAdmin();
  let row: any = null;
  if (db) {
    const { data } = await db.from("reps").select("id,name,email,role,territory,manager_id,active").eq("user_id", user.id).limit(1);
    row = data && data[0];
    // Approved staff only: an auth user with no rep profile, or a deactivated one,
    // is denied everywhere ctx is required (pages, layouts, and every API).
    if (!row || row.active === false) {
      console.log("[AUTH:denied]", user.id, !row ? "no rep profile" : "inactive");
      return null;
    }
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
