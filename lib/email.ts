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
        from: process.env.LEAD_FROM_EMAIL || "leads@elytrashieldroofing.com",
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

export async function sendLeadNotification(subject: string, lead: Lead): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!key || !to) {
    console.log("[EMAIL:skipped]", subject, lead.id);
    return;
  }
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL || "leads@elytrashieldroofing.com",
        to,
        subject,
        text: `New ${lead.type} lead (${lead.id})\n\n` + JSON.stringify(lead.data, null, 2),
      }),
    });
  } catch (err) {
    console.error("[EMAIL:error]", err);
  }
}
