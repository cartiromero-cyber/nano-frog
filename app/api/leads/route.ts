import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getCurrentRep } from "@/lib/sales/auth";
import { listLeads, createLead } from "@/lib/sales/crm";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const ctx = await getCurrentRep();
  if (!ctx) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const u = new URL(req.url);
  const leads = await listLeads(ctx, {
    q: u.searchParams.get("q") || undefined, status: u.searchParams.get("status") || undefined,
    source: u.searchParams.get("source") || undefined, city: u.searchParams.get("city") || undefined,
    sort: u.searchParams.get("sort") || undefined,
  });
  return NextResponse.json({ ok: true, leads });
}

export async function POST(req: NextRequest) {
  if (!(await checkRateLimit(req))) return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  const ctx = await getCurrentRep();
  if (!ctx) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (!b || (!b.name && !b.phone && !b.email)) return NextResponse.json({ ok: false, error: "Name, phone, or email required." }, { status: 400 });
  const id = await createLead(ctx, b);
  return NextResponse.json({ ok: true, id });
}
