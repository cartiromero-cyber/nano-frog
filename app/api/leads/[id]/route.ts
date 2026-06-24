import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getCurrentRep } from "@/lib/sales/auth";
import { getLeadDetail, updateLeadStatus } from "@/lib/sales/crm";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const ctx = await getCurrentRep();
  if (!ctx) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const detail = await getLeadDetail(ctx, params.id);
  if (!detail) return NextResponse.json({ ok: false, error: "Not found or not permitted." }, { status: 404 });
  return NextResponse.json({ ok: true, ...detail });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await checkRateLimit(req))) return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  const ctx = await getCurrentRep();
  if (!ctx) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (!b || !b.status) return NextResponse.json({ ok: false, error: "status required." }, { status: 400 });
  const ok = await updateLeadStatus(ctx, params.id, b.status);
  if (!ok) return NextResponse.json({ ok: false, error: "Not permitted." }, { status: 403 });
  return NextResponse.json({ ok: true });
}
