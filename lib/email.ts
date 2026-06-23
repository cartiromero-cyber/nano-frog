import type { Lead } from "@/types";

/**
 * Send an internal notification when a new lead arrives.
 * No-op until RESEND_API_KEY + LEAD_NOTIFY_EMAIL are configured, so the app runs
 * without email set up. Swap Resend for any provider you prefer (see DEPLOYMENT.md).
 */
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
        from: process.env.LEAD_FROM_EMAIL || "leads@nanofrogpro.com",
        to,
        subject,
        text: `New ${lead.type} lead (${lead.id})\n\n` + JSON.stringify(lead.data, null, 2),
      }),
    });
  } catch (err) {
    console.error("[EMAIL:error]", err);
  }
}
