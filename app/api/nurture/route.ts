import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getCurrentRep } from "@/lib/sales/auth";
import { sendNurtureEmail, NURTURE_STAGES, type NurtureStage } from "@/lib/nurture";

export const runtime = "nodejs";

/** Staff-only: send one nurture email to a lead (triggered from the CRM lead page). */
export async function POST(req: NextRequest) {
  if (!(await checkRateLimit(req))) return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  const ctx = await getCurrentRep();
  if (!ctx) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => null);
  const email = typeof b?.email === "string" ? b.email.trim() : "";
  const stage = b?.stage as NurtureStage;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ ok: false, error: "Valid lead email required." }, { status: 400 });
  if (!NURTURE_STAGES.includes(stage)) return NextResponse.json({ ok: false, error: "Unknown stage." }, { status: 400 });
  const result = await sendNurtureEmail(email, typeof b?.name === "string" ? b.name : undefined, stage);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
