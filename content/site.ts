// Sitewide contact + pricing language (Approved Changes 003 + 007).
// PHONE is intentionally config-driven: set NEXT_PUBLIC_PHONE (e.g. "(478) 555-0123")
// and click-to-call renders in the header, footer, and CTA section automatically.
// No number is shown until a real business line is configured.

export const PHONE = process.env.NEXT_PUBLIC_PHONE || "";
export const PHONE_TEL = "tel:" + PHONE.replace(/[^0-9+]/g, "");

// Approved pricing language (Change 007 — no published pricing).
export const PRICING_LINE =
  "Every roof is different. Pricing is determined after your Roof Health Assessment.";
export const PRICING_SUBLINE =
  "Most qualifying roofs cost significantly less than replacement.";
