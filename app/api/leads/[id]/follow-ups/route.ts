import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getCurrentRep } from "@/lib/sales/auth";
import { scheduleFollowUp } from "@/lib/sales/crm";
import { FOLLOWUP_TYPES } from "@/lib/sales/crm-constants";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await checkRateLimit(req))) return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  const ctx = await getCurrentRep();
  if (!ctx) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (!b || !b.due_date) return NextResponse.json({ ok: false, error: "due_date required." }, { status: 400 });
  const type = FOLLOWUP_TYPES.includes(b.type) ? b.type : "Call";
  const ok = await scheduleFollowUp(ctx, params.id, { due_date: b.due_date, type, notes: b.notes });
  if (!ok) return NextResponse.json({ ok: false, error: "Not permitted." }, { status: 403 });
  return NextResponse.json({ ok: true });
}
