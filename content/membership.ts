export const PLAN_NAME = "Roof Assurance Plan™";
export const PLAN_BLURB =
  "A simple ongoing plan that helps homeowners keep their roof documented, monitored, and protected over time.";

export interface MembershipTier { name: string; tagline: string; cadence: string; features: string[]; highlighted?: boolean; }

// Careful, confident language — no insurance promises, no coverage or roof-life guarantees.
// Tier prices are set by the owner; until then the customer-safe PRICING_NOTE below is shown.
export const membershipTiers: MembershipTier[] = [
  {
    name: "Essential", tagline: "Keep your roof documented.", cadence: "Annual",
    features: [
      "Annual Roof Health Assessment™",
      "Digital Roof Passport™ updates",
      "Roof photo documentation",
      "Annual reminder",
      "Maintenance recommendations",
    ],
  },
  {
    name: "Protected", tagline: "Stay ahead, year over year.", cadence: "Annual", highlighted: true,
    features: [
      "Everything in Essential",
      "Priority scheduling",
      "Annual Roof Health Report™",
      "Preservation monitoring",
      "Credit toward future treatment",
    ],
  },
  {
    name: "Concierge", tagline: "Total peace of mind.", cadence: "Annual",
    features: [
      "Everything in Protected",
      "Twice-yearly check-ins",
      "Priority storm review",
      "Extended documentation support",
      "VIP service",
    ],
  },
];

// H1 (approved): customer-safe pricing language.
export const PRICING_NOTE = "Pricing is determined after your Roof Health Assessment.";

export const MEMBERSHIP_STATUSES = ["Interested", "Enrolled", "Pending Payment", "Active", "Cancelled", "Declined"] as const;
export type MembershipStatus = (typeof MEMBERSHIP_STATUSES)[number];
export const TIER_NAMES = membershipTiers.map((t) => t.name);

export function membershipStatusColor(s?: string): string {
  switch (s) {
    case "Active": return "#1f9d57";
    case "Enrolled": return "var(--green-2)";
    case "Pending Payment": return "#E0A12E";
    case "Interested": return "#2f80c0";
    case "Declined": case "Cancelled": return "#C0532E";
    default: return "#9aa7b6";
  }
}
