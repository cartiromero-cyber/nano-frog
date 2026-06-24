import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getCurrentRep } from "@/lib/sales/auth";
import { updateMembership } from "@/lib/sales/membership";

export const runtime = "nodejs";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await checkRateLimit(req))) return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  const ctx = await getCurrentRep();
  if (!ctx) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  const res = await updateMembership(ctx, params.id, b);
  return NextResponse.json(res, { status: res.ok ? 200 : 403 });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const ctx = await getCurrentRep();
  if (!ctx) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const res = await updateMembership(ctx, params.id, { status: "Cancelled" });
  return NextResponse.json(res, { status: res.ok ? 200 : 403 });
}
