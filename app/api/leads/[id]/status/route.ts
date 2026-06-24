import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getCurrentRep } from "@/lib/sales/auth";
import { updateLeadStatus } from "@/lib/sales/crm";
import { LEAD_STATUSES } from "@/lib/sales/crm-constants";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await checkRateLimit(req))) return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  const ctx = await getCurrentRep();
  if (!ctx) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (!b || !LEAD_STATUSES.includes(b.status)) return NextResponse.json({ ok: false, error: "Invalid status." }, { status: 400 });
  const ok = await updateLeadStatus(ctx, params.id, b.status);
  if (!ok) return NextResponse.json({ ok: false, error: "Not permitted." }, { status: 403 });
  return NextResponse.json({ ok: true });
}
