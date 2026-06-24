import { NextResponse } from "next/server";
import { getCurrentRep } from "@/lib/sales/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export async function POST() {
  const ctx = await getCurrentRep();
  const db = supabaseAdmin();
  if (ctx?.repId && db) {
    try { await db.from("reps").update({ last_login_at: new Date().toISOString() }).eq("id", ctx.repId); } catch {}
  }
  return NextResponse.json({ ok: true });
}
