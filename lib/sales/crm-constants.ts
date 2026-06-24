export const LEAD_STATUSES = [
  "New", "Contacted", "Presentation Completed", "Assessment Scheduled", "Sold", "Not Qualified", "Follow Up", "Lost",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_SOURCES = ["sales-platform", "rep-manual", "website", "referral", "event"] as const;

export const FOLLOWUP_TYPES = ["Call", "Text", "Email", "Appointment", "Revisit", "Send Report", "Membership Follow-Up"] as const;
export const FOLLOWUP_STATUSES = ["Open", "Completed", "Missed", "Rescheduled"] as const;

export const NOTE_TYPES = ["General", "Call", "Text", "Visit", "Objection", "Follow-Up", "Sale"] as const;

export const LEAD_SORTS = [
  { key: "newest", label: "Newest" },
  { key: "hot", label: "Hottest" },
  { key: "followup", label: "Next follow-up" },
  { key: "contacted", label: "Last contacted" },
] as const;

export function statusColor(s: string): string {
  switch (s) {
    case "Sold": return "#1f9d57";
    case "Presentation Completed": return "var(--green-2)";
    case "Assessment Scheduled": return "#2f80c0";
    case "Follow Up": return "#E0A12E";
    case "Contacted": return "#7a8aa0";
    case "Not Qualified": case "Lost": return "#C0532E";
    default: return "#9aa7b6"; // New
  }
}
