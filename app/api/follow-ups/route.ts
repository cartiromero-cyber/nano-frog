import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getCurrentRep } from "@/lib/sales/auth";
import { listFollowUps, completeFollowUp } from "@/lib/sales/crm";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const ctx = await getCurrentRep();
  if (!ctx) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const bucket = new URL(req.url).searchParams.get("bucket") || "today";
  const items = await listFollowUps(ctx, bucket);
  return NextResponse.json({ ok: true, items });
}

export async function PATCH(req: NextRequest) {
  if (!(await checkRateLimit(req))) return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  const ctx = await getCurrentRep();
  if (!ctx) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (!b || !b.id) return NextResponse.json({ ok: false, error: "id required." }, { status: 400 });
  const ok = await completeFollowUp(ctx, b.id);
  if (!ok) return NextResponse.json({ ok: false, error: "Not permitted." }, { status: 403 });
  return NextResponse.json({ ok: true });
}
