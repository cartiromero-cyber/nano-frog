import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getCurrentRep } from "@/lib/sales/auth";
import { getRep, updateRep, canAccessAdminOrg } from "@/lib/sales/org";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const ctx = await getCurrentRep();
  if (!canAccessAdminOrg(ctx)) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  const data = await getRep(ctx, params.id);
  if (!data) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, ...data });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await checkRateLimit(req))) return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  const ctx = await getCurrentRep();
  if (!canAccessAdminOrg(ctx)) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  const res = await updateRep(ctx, params.id, b);
  return NextResponse.json(res, { status: res.ok ? 200 : 403 });
}
