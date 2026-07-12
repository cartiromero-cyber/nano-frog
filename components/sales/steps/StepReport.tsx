'use client';
import type { StepProps } from "@/types/sales";
import ReportCard from "@/components/sales/ReportCard";
import PrintButton from "@/components/sales/PrintButton";

// The report slide — presentation framing around the shared printable ReportCard.
export default function StepReport({ session }: StepProps) {
  const h = session.homeowner;
  const missing = [!h.name && "name", !h.phone && "phone", !h.address && "address"].filter(Boolean);
  return (
    <div className="s-wrap">
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <div>
          <span className="s-eyebrow">Your Roof Health Report™</span>
          <h2 className="s-h" style={{ fontSize: "1.5rem", margin: "6px 0 0" }}>Everything we documented — yours to keep.</h2>
        </div>
        <PrintButton label="Print / Save PDF" />
      </div>
      {missing.length ? (
        <p className="no-print" style={{ color: "#E0A12E", fontSize: ".8rem", marginBottom: 10 }}>
          ⚠ Lead record incomplete — missing: {missing.join(", ")} (capture on the first slide before finishing).
        </p>
      ) : null}
      <ReportCard session={session} />
    </div>
  );
}
