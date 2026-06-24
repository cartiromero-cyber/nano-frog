import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getCurrentRep } from "@/lib/sales/auth";
import { bulkAssign } from "@/lib/sales/org";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!(await checkRateLimit(req))) return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  const ctx = await getCurrentRep();
  if (!ctx || ctx.role === "REP") return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  const b = await req.json().catch(() => null);
  if (!b || !b.newRepId) return NextResponse.json({ ok: false, error: "newRepId required." }, { status: 400 });
  const res = await bulkAssign(ctx, { city: b.city, onlyUnassigned: !!b.onlyUnassigned, newRepId: b.newRepId, reason: b.reason });
  return NextResponse.json(res, { status: res.ok ? 200 : 403 });
}
