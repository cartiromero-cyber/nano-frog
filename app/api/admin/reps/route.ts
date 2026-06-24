import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getCurrentRep } from "@/lib/sales/auth";
import { listReps, createRep, canAccessAdminOrg } from "@/lib/sales/org";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const ctx = await getCurrentRep();
  if (!canAccessAdminOrg(ctx)) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  const u = new URL(req.url);
  const reps = await listReps(ctx, { q: u.searchParams.get("q") || undefined, role: u.searchParams.get("role") || undefined, active: u.searchParams.get("active") || undefined });
  return NextResponse.json({ ok: true, reps });
}

export async function POST(req: NextRequest) {
  if (!(await checkRateLimit(req))) return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  const ctx = await getCurrentRep();
  if (ctx?.role !== "ADMIN") return NextResponse.json({ ok: false, error: "Admin only" }, { status: 403 });
  const b = await req.json().catch(() => null);
  if (!b || !b.name || !b.email) return NextResponse.json({ ok: false, error: "Name and email required." }, { status: 400 });
  const res = await createRep(ctx, { ...b, invite: false });
  return NextResponse.json(res, { status: res.ok ? 200 : 400 });
}
