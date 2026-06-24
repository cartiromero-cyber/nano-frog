import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getCurrentRep } from "@/lib/sales/auth";
import { addNote } from "@/lib/sales/crm";
import { NOTE_TYPES } from "@/lib/sales/crm-constants";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await checkRateLimit(req))) return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  const ctx = await getCurrentRep();
  if (!ctx) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (!b || !b.note || String(b.note).trim().length < 1) return NextResponse.json({ ok: false, error: "note required." }, { status: 400 });
  const type = NOTE_TYPES.includes(b.type) ? b.type : "General";
  const ok = await addNote(ctx, params.id, String(b.note).slice(0, 4000), type);
  if (!ok) return NextResponse.json({ ok: false, error: "Not permitted." }, { status: 403 });
  return NextResponse.json({ ok: true });
}
