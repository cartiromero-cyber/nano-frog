import { NextRequest, NextResponse } from "next/server";
import { getCurrentRep } from "@/lib/sales/auth";
import { listAdminLeads } from "@/lib/sales/org";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const ctx = await getCurrentRep();
  if (!ctx || ctx.role === "REP") return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  const u = new URL(req.url);
  const data = await listAdminLeads(ctx, {
    status: u.searchParams.get("status") || undefined, rep: u.searchParams.get("rep") || undefined,
    city: u.searchParams.get("city") || undefined, source: u.searchParams.get("source") || undefined,
    unassigned: u.searchParams.get("unassigned") === "1",
  });
  return NextResponse.json({ ok: true, ...data });
}
