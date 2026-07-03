import { NextRequest, NextResponse } from "next/server";
import { validateAssessment } from "@/lib/validation";
import { saveLead } from "@/lib/leads";
import { sendLeadNotification, sendBookingConfirmation } from "@/lib/email";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    if (!(await checkRateLimit(req))) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again in a moment." },
        { status: 429 }
      );
    }
    const data = await req.json().catch(() => null);
    if (!data) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });

    // Honeypot spam protection: real users never fill the hidden "company" field.
    if (typeof data.company === "string" && data.company.trim() !== "") {
      return NextResponse.json({ ok: true }); // silently accept + drop
    }

    const { valid, errors } = validateAssessment(data);
    if (!valid) return NextResponse.json({ ok: false, errors }, { status: 400 });

    const lead = await saveLead("assessment", data);
    await sendLeadNotification("New Free Roof Assessment request", lead);
    await sendBookingConfirmation(lead); // Change 014: simple homeowner confirmation

    return NextResponse.json({ ok: true, id: lead.id, message: "Thanks! We’ll call or text within one business day to confirm your assessment window." });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please call us or try again shortly." },
      { status: 500 }
    );
  }
}
