// F2 / Rev D (LOCKED — Decision Register LIFE-2): single-tier Elytra Continuity Program™.
// Offered at the year-1 complimentary reassessment, NEVER at the treatment close (LIFE-1).
// The retired three-tier structure lives in git history for future B2B/commercial use.
export const PLAN_NAME = "Elytra Continuity Program™";
export const PLAN_BLURB =
  "Keep your roof's record unbroken — monitored, documented, and protected, year after year.";

export interface MembershipTier { name: string; tagline: string; cadence: string; features: string[]; highlighted?: boolean; }

export const membershipTiers: MembershipTier[] = [
  {
    name: "Continuity", tagline: "Keep your roof's record unbroken.", cadence: "Annual — $259/yr", highlighted: true,
    features: [
      "Annual Roof Health Assessment™ & updated score",
      "Updated Roof Passport™ + photo documentation",
      "Reliability Reapplication™ allowance (localized, up to 2 squares/yr)",
      "Storm review & priority scheduling",
      "Transfer-on-sale support",
      "Preservation Refresh™ price-lock eligibility",
    ],
  },
];

// Customer-safe pricing language for treatment pricing contexts (H1, approved).
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
