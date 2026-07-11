'use client';
import type { StepProps } from "@/types/sales";
import { computeRoofHealthScore, scoreBand, SCORING_STANDARD_VERSION } from "@/lib/sales/scoring";
import { recommend, displayTier } from "@/lib/sales/recommendation";
import PrintButton from "@/components/sales/PrintButton";

// Audit fix (customer export): the printable Roof Health Report™, auto-populated from the
// session — contact record, inspector, score + factors, verdict, annotated photos, and the
// quoted investment. White card = print-friendly; deck chrome is hidden by the existing
// @media print rules; the rep pricing worksheet is .no-print and never appears here.

const FACTOR_ROWS: { key: "granule" | "flexibility" | "ventilation" | "repairHistory" | "stormExposure"; label: string }[] = [
  { key: "granule", label: "Granule condition" },
  { key: "flexibility", label: "Flexibility" },
  { key: "ventilation", label: "Ventilation" },
  { key: "repairHistory", label: "Repair history" },
  { key: "stormExposure", label: "Storm exposure" },
];

export default function StepReport({ session }: StepProps) {
  const score = computeRoofHealthScore(session.score);
  const band = scoreBand(score);
  const rec = recommend(session.score);
  const h = session.homeowner;
  const photos = session.roofPhotos || [];
  const inv = session.investment;
  const date = new Date().toLocaleDateString();
  const missing = [!h.name && "name", !h.phone && "phone", !h.address && "address"].filter(Boolean);

  return (
    <div className="s-wrap">
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <div>
          <span className="s-eyebrow">Your Roof Health Report™</span>
          <h2 className="s-h" style={{ fontSize: "1.5rem", margin: "6px 0 0" }}>Everything we documented — yours to keep.</h2>
        </div>
        <PrintButton label="Print / Email PDF" />
      </div>
      {missing.length ? (
        <p className="no-print" style={{ color: "#E0A12E", fontSize: ".8rem", marginBottom: 10 }}>
          ⚠ Lead record incomplete — missing: {missing.join(", ")} (capture on the first slide before finishing).
        </p>
      ) : null}

      <div style={{ background: "#fff", color: "#16314A", borderRadius: 14, padding: "28px 30px", maxWidth: 860, margin: "0 auto", fontFamily: "var(--sans)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #E2EBF1", paddingBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontFamily: "var(--disp)", fontWeight: 700, fontSize: "1.25rem", color: "#0B1320" }}>Roof Health Report™</div>
            <div style={{ fontSize: ".82rem", color: "#5C6F7E" }}>Elytra Shield · Standard v{SCORING_STANDARD_VERSION} · {date}{session.inspector ? ` · Assessed by ${session.inspector}` : ""}</div>
          </div>
          <div style={{ textAlign: "right", fontSize: ".85rem" }}>
            <div style={{ fontWeight: 600 }}>{h.name || "—"}</div>
            <div>{h.address || "—"}</div>
            <div style={{ color: "#5C6F7E" }}>{[h.phone, h.email].filter(Boolean).join(" · ")}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 26, alignItems: "center", margin: "18px 0", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--disp)", fontWeight: 700, fontSize: "2.6rem", color: "#39B54A", lineHeight: 1 }}>{score}<span style={{ fontSize: "1rem", color: "#5C6F7E" }}>/100</span></div>
            <div style={{ fontSize: ".8rem", fontWeight: 600 }}>{band}</div>
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontWeight: 700, fontSize: ".95rem" }}>Verdict: {displayTier(rec.tier)}</div>
            <div style={{ fontSize: ".88rem", color: "#39536B", marginTop: 4 }}>{rec.summary}</div>
            <div style={{ fontSize: ".78rem", color: "#5C6F7E", marginTop: 6 }}>
              Roof age {session.score.roofAge} yrs · {session.score.roofType}
              {session.metrics?.homeSqFt ? ` · ~${session.metrics.homeSqFt.toLocaleString()} sq ft home` : ""}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 8, margin: "6px 0 16px" }}>
          {FACTOR_ROWS.map((f) => (
            <div key={f.key} style={{ border: "1px solid #E2EBF1", borderRadius: 8, padding: "8px 10px", fontSize: ".8rem" }}>
              <div style={{ color: "#5C6F7E" }}>{f.label}</div>
              <b>{session.score[f.key]} / 100</b>
            </div>
          ))}
        </div>

        <div style={{ fontSize: ".85rem", marginBottom: 14 }}>
          <b>Findings:</b> {rec.reasons.join(" ")}
        </div>

        {photos.length ? (
          <>
            <div style={{ fontWeight: 700, fontSize: ".9rem", margin: "14px 0 8px" }}>Photo documentation ({photos.length})</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 8 }}>
              {photos.map((p, i) => (
                <figure key={i} style={{ margin: 0 }}>
                  <img src={p.dataUrl} alt={p.label || `Photo ${i + 1}`} style={{ width: "100%", height: 96, objectFit: "cover", borderRadius: 6 }} />
                  <figcaption style={{ fontSize: ".7rem", color: "#5C6F7E" }}>
                    {p.status === "healthy" ? "✓" : p.status === "watch" ? "⚠" : "✕"} {p.label || p.status}
                  </figcaption>
                </figure>
              ))}
            </div>
          </>
        ) : null}

        {inv && rec.tier !== "Not Recommended" ? (
          <div style={{ borderTop: "2px solid #E2EBF1", marginTop: 16, paddingTop: 12, fontSize: ".88rem" }}>
            <b>Roof Preservation System™ — quoted investment: ${inv.price.toLocaleString()}</b>
            {inv.modifierPct ? ` (includes disclosed +${inv.modifierPct}% complexity modifier)` : ""}
            <div style={{ color: "#5C6F7E", fontSize: ".78rem", marginTop: 4 }}>
              Price locked for 12 months from this assessment. Pay on completion — no deposit.
              Includes photo documentation, Roof Passport™, written warranty, and the complimentary
              annual reassessment.
            </div>
          </div>
        ) : null}

        <div style={{ fontSize: ".72rem", color: "#5C6F7E", marginTop: 16, borderTop: "1px solid #E2EBF1", paddingTop: 10 }}>
          Every assessment ends in a written verdict — preserve, monitor, or replace. This report and all
          photos are yours to keep, whatever you decide. Methodology published at elytrashield.us/how-we-score.
        </div>
      </div>
    </div>
  );
}
