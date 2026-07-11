import type { Lead } from "@/types";

/**
 * Send an internal notification when a new lead arrives.
 * No-op until RESEND_API_KEY + LEAD_NOTIFY_EMAIL are configured, so the app runs
 * without email set up. Swap Resend for any provider you prefer (see DEPLOYMENT.md).
 */
/**
 * Change 014 (approved, simple): booking confirmation to the homeowner when they
 * provided an email. Same env-gated pattern — a no-op until Resend is configured.
 */
export async function sendBookingConfirmation(lead: Lead): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const email = (lead.data as { email?: string }).email;
  if (!key || !email) {
    console.log("[EMAIL:confirmation-skipped]", lead.id);
    return;
  }
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL || "leads@elytrashield.us",
        to: email,
        subject: "Your free Roof Health Assessment — request received",
        text:
          "Thanks for booking a free Elytra Shield Roof Health Assessment.\n\n" +
          "What happens next:\n" +
          "1. We'll call or text within one business day to confirm your assessment window.\n" +
          "2. The visit takes about 30 minutes.\n" +
          "3. You receive a documented Roof Health Report(tm) — yours to keep, whatever it says.\n\n" +
          "If you need a new roof, we'll tell you.\n\n— Elytra Shield · Roof Preservation",
      }),
    });
  } catch (err) {
    console.error("[EMAIL:error]", err);
  }
}

/**
 * Instant internal lead notification (owner audit request): fires immediately from the
 * /api/leads/assessment route with (1) a branded HTML body showing every captured field
 * and (2) an Elytra Shield–branded PDF attachment (lib/leadPdf.ts) for download/filing.
 * Env-gated as before: no-op until RESEND_API_KEY + LEAD_NOTIFY_EMAIL are set.
 */
export async function sendLeadNotification(subject: string, lead: Lead): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!key || !to) {
    console.log("[EMAIL:skipped]", subject, lead.id);
    return;
  }
  const d = lead.data as { name?: string; phone?: string; email?: string; address?: string };
  const esc = (s?: string) => String(s ?? "—").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const row = (label: string, value?: string, link?: string) =>
    `<tr><td style="padding:8px 14px;color:#5C6F7E;font-size:12px;letter-spacing:.06em;border-bottom:1px solid #E2EBF1">${label}</td>` +
    `<td style="padding:8px 14px;color:#0B1320;font-weight:600;border-bottom:1px solid #E2EBF1">${link ? `<a href="${link}" style="color:#39B54A">${esc(value)}</a>` : esc(value)}</td></tr>`;
  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;border:1px solid #E2EBF1;border-radius:12px;overflow:hidden">` +
    `<div style="background:#0B1320;border-bottom:4px solid #39B54A;padding:18px 22px">` +
    `<div style="color:#fff;font-size:19px;font-weight:800;letter-spacing:.02em">ELYTRA SHIELD</div>` +
    `<div style="color:#39B54A;font-size:9px;letter-spacing:.28em;margin-top:2px">ROOF PRESERVATION</div></div>` +
    `<div style="padding:20px 22px">` +
    `<div style="font-size:16px;font-weight:700;color:#0B1320;margin-bottom:4px">New Roof Health Assessment request</div>` +
    `<div style="font-size:12px;color:#5C6F7E;margin-bottom:14px">Contact within one business day to confirm the window. Full details attached as PDF.</div>` +
    `<table style="width:100%;border-collapse:collapse">` +
    row("NAME", d.name) +
    row("PHONE", d.phone, d.phone ? `tel:${d.phone}` : undefined) +
    row("EMAIL", d.email, d.email ? `mailto:${d.email}` : undefined) +
    row("PROPERTY ADDRESS", d.address) +
    row("RECEIVED", new Date(lead.createdAt).toLocaleString()) +
    row("LEAD ID", lead.id) +
    `</table>` +
    `<div style="font-size:10px;color:#5C6F7E;margin-top:14px">No photo, no score · Inspectors are never paid on treatment sales · The homeowner receives the entire score.</div>` +
    `</div></div>`;
  try {
    const { buildLeadPdfBase64 } = await import("./leadPdf");
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL || "leads@elytrashield.us",
        to,
        subject,
        html,
        text: `New ${lead.type} lead (${lead.id})\n\n` + JSON.stringify(lead.data, null, 2),
        attachments: [{ filename: `elytra-lead-${lead.id.slice(0, 8)}.pdf`, content: buildLeadPdfBase64(lead) }],
      }),
    });
  } catch (err) {
    console.error("[EMAIL:error]", err);
  }
}
