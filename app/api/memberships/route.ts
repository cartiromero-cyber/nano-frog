import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getCurrentRep } from "@/lib/sales/auth";
import { recordMembership } from "@/lib/sales/membership";
import { MEMBERSHIP_STATUSES, TIER_NAMES } from "@/content/membership";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!(await checkRateLimit(req))) return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  const ctx = await getCurrentRep();
  if (!ctx) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (!b || !TIER_NAMES.includes(b.tier) || !(MEMBERSHIP_STATUSES as readonly string[]).includes(b.status))
    return NextResponse.json({ ok: false, error: "Valid tier and status required." }, { status: 400 });
  if (!b.passportId && !b.leadId) return NextResponse.json({ ok: false, error: "passportId or leadId required." }, { status: 400 });
  const res = await recordMembership(ctx, { passportId: b.passportId, leadId: b.leadId, tier: b.tier, status: b.status, notes: b.notes });
  return NextResponse.json(res, { status: res.ok ? 200 : 403 });
}
