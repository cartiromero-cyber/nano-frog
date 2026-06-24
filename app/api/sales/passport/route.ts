import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { createPassportFromSession, demoPassport } from "@/lib/sales/passport";
import { upsertLead, createOrUpdatePassport, lookupPassport } from "@/lib/sales/db";
import { getCurrentRep } from "@/lib/sales/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    if (!(await checkRateLimit(req))) return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
    const session = await req.json().catch(() => null);
    if (!session) return NextResponse.json({ ok: false, error: "Invalid session." }, { status: 400 });
    if (session.homeowner && typeof session.homeowner.company === "string" && session.homeowner.company.trim() !== "") return NextResponse.json({ ok: true });

    const ctx = await getCurrentRep();
    const leadId = await upsertLead(session.homeowner || {}, ctx?.repId ?? null);
    let id = await createOrUpdatePassport(session, leadId, ctx?.repId ?? null);
    if (!id) id = createPassportFromSession(session).id;
    return NextResponse.json({ ok: true, id, lead_id: leadId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Could not create passport." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const by = { id: u.searchParams.get("id") || undefined, phone: u.searchParams.get("phone") || undefined, email: u.searchParams.get("email") || undefined, address: u.searchParams.get("address") || undefined };
  if (!by.id && !by.phone && !by.email && !by.address) return NextResponse.json({ ok: true, passport: demoPassport(), demo: true });
  const passport = await lookupPassport(by);
  if (!passport) return NextResponse.json({ ok: false, error: "No passport found." }, { status: 404 });
  return NextResponse.json({ ok: true, passport });
}
