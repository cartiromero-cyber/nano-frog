import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getCurrentRep } from "@/lib/sales/auth";
import { buildReportPdfBase64 } from "@/lib/reportPdf";
import type { SalesSession } from "@/types/sales";

export const runtime = "nodejs";

/** Staff-only: email the homeowner their Roof Health Report™ (branded PDF) from the
 *  presentation finale. Env-gated like all email. */
export async function POST(req: NextRequest) {
  if (!(await checkRateLimit(req))) return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  const ctx = await getCurrentRep();
  if (!ctx) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ ok: false, error: "Email is not configured." }, { status: 503 });

  const session = (await req.json().catch(() => null)) as SalesSession | null;
  const email = session?.homeowner?.email?.trim();
  if (!session || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ ok: false, error: "Homeowner email required (slide 1)." }, { status: 400 });

  const first = (session.homeowner.name || "").split(" ")[0];
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://elytrashield.us";
  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;border:1px solid #E2EBF1;border-radius:12px;overflow:hidden">` +
    `<div style="background:#0B1320;border-bottom:4px solid #39B54A;padding:16px 22px">` +
    `<table style="border-collapse:collapse"><tr><td style="padding-right:12px"><img src="${site}/assets/elytra-shield-icon.png" width="42" height="42" alt="Elytra Shield" style="display:block;border-radius:8px"/></td>` +
    `<td><div style="color:#fff;font-size:19px;font-weight:800">ELYTRA SHIELD</div>` +
    `<div style="color:#39B54A;font-size:9px;letter-spacing:.28em;margin-top:2px">ROOF PRESERVATION</div></td></tr></table></div>` +
    `<div style="padding:20px 22px;color:#16314A;font-size:14px;line-height:1.65">` +
    `<p style="margin:0 0 12px">${first ? `Hi ${first},` : "Hi,"}</p>` +
    `<p style="margin:0 0 12px">As promised — your <b>Roof Health Report&trade;</b> is attached: your score, the factor breakdown, the written verdict, and your quoted investment terms. The photos we walked through together stay with your Roof Passport&trade;.</p>` +
    `<p style="margin:0 0 12px">Whatever you decide, this record is yours — and your quoted price is locked for 12 months.</p>` +
    `<p style="font-size:10px;color:#5C6F7E;margin-top:18px;border-top:1px solid #E2EBF1;padding-top:10px">No photo, no score · Inspectors are never paid on treatment sales · You receive the entire score.<br/>Methodology: <a href="${site}/how-we-score" style="color:#39B54A">${site.replace("https://", "")}/how-we-score</a></p>` +
    `</div></div>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL || "leads@elytrashield.us",
        to: email,
        subject: "Your Roof Health Report™ — Elytra Shield",
        html,
        attachments: [{ filename: "elytra-roof-health-report.pdf", content: buildReportPdfBase64(session) }],
      }),
    });
    if (!r.ok) return NextResponse.json({ ok: false, error: `Send failed (${r.status}).` }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Network error sending email." }, { status: 502 });
  }
}
