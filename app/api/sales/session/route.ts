import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { saveSession } from "@/lib/sales/store";
import { upsertLead, saveSalesSession } from "@/lib/sales/db";
import { enrichLeadAfterSession } from "@/lib/sales/crm";
import { computeRoofHealthScore } from "@/lib/sales/scoring";
import { getCurrentRep } from "@/lib/sales/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    if (!(await checkRateLimit(req))) return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
    const session = await req.json().catch(() => null);
    if (!session || typeof session !== "object") return NextResponse.json({ ok: false, error: "Invalid session." }, { status: 400 });
    if (session.homeowner && typeof session.homeowner.company === "string" && session.homeowner.company.trim() !== "") return NextResponse.json({ ok: true });

    const ctx = await getCurrentRep();
    const leadId = await upsertLead(session.homeowner || {}, ctx?.repId ?? null);
    const sessionId = await saveSalesSession(session, leadId, ctx?.repId ?? null, ctx?.userId ?? null);
    if (leadId) await enrichLeadAfterSession(leadId, session.score, computeRoofHealthScore(session.score));
    if (!sessionId) await saveSession(session);

    return NextResponse.json({ ok: true, session_id: sessionId, lead_id: leadId, passport_id: null, rep_id: ctx?.repId ?? null });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Could not save session." }, { status: 500 });
  }
}
