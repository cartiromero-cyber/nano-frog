'use client';
import type { StepProps } from "@/types/sales";
import { computeRoofHealthScore, scoreBand, SCORING_STANDARD_VERSION } from "@/lib/sales/scoring";
import { recommend, displayTier } from "@/lib/sales/recommendation";
import PrintButton from "@/components/sales/PrintButton";

// Customer export (audit fix + owner design direction): the printable Roof Health Report™,
// styled to mirror the scorecard advertised on the homepage — logo, circular gauge, status
// pill, factor bars, and the Preserve/Monitor/Replace strip — translated to a light,
// print-safe palette. Gauge and bars are SVG (SVG fills always print; CSS backgrounds
// often don't). Auto-populated from the session; rep pricing worksheet never prints.

const INK = "#0B1320", MUTED = "#5C6F7E", LINE = "#E2EBF1", GREEN = "#39B54A", AMBER = "#E0A12E", RED = "#C0532E";

const FACTORS: { key: "granule" | "flexibility" | "ventilation" | "repairHistory" | "stormExposure"; label: string }[] = [
  { key: "granule", label: "Granule condition" },
  { key: "flexibility", label: "Flexibility" },
  { key: "ventilation", label: "Ventilation" },
  { key: "repairHistory", label: "Repair history" },
  { key: "stormExposure", label: "Storm exposure" },
];
const qual = (v: number) => (v >= 85 ? "Excellent" : v >= 70 ? "Good" : v >= 55 ? "Fair" : v >= 40 ? "Moderate" : "Poor");

function Bar({ value }: { value: number }) {
  return (
    <svg width="100%" height="8" viewBox="0 0 100 8" preserveAspectRatio="none" style={{ display: "block" }}>
      <rect x="0" y="2.5" width="100" height="3" rx="1.5" fill={LINE} />
      <rect x="0" y="2.5" width={Math.max(2, Math.min(100, value))} height="3" rx="1.5" fill={GREEN} />
    </svg>
  );
}

export default function StepReport({ session }: StepProps) {
  const score = computeRoofHealthScore(session.score);
  const band = scoreBand(score);
  const rec = recommend(session.score);
  const verdict = displayTier(rec.tier);
  const activeVerdict = rec.tier === "Not Recommended" ? "REPLACE" : rec.tier === "Needs Inspection" ? "MONITOR" : "PRESERVE";
  const h = session.homeowner;
  const photos = session.roofPhotos || [];
  const inv = session.investment;
  const date = new Date().toLocaleDateString();
  const missing = [!h.name && "name", !h.phone && "phone", !h.address && "address"].filter(Boolean);
  const dash = 402, off = dash - (dash * score) / 100;
  const ageBar = Math.max(0, 100 - (session.score.roofAge / 25) * 100);

  const VERDICTS: { key: string; color: string; text: string }[] = [
    { key: "PRESERVE", color: GREEN, text: "Protectable life — the score and age gates say so." },
    { key: "MONITOR", color: AMBER, text: "Not yet clear — re-checked on a schedule, no pressure." },
    { key: "REPLACE", color: RED, text: "The honest answer, in writing — we don't sell roofs." },
  ];

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
        <p className="no-print" style={{ color: AMBER, fontSize: ".8rem", marginBottom: 10 }}>
          ⚠ Lead record incomplete — missing: {missing.join(", ")} (capture on the first slide before finishing).
        </p>
      ) : null}

      <div style={{ background: "#fff", color: "#16314A", borderRadius: 14, padding: "26px 30px", maxWidth: 860, margin: "0 auto", fontFamily: "var(--sans)", border: `1px solid ${LINE}` }}>
        {/* Brand header — mirrors the site header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `2px solid ${LINE}`, paddingBottom: 14, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <img src="/assets/elytra-shield-icon.png" alt="Elytra Shield" width={44} height={44} style={{ display: "block", borderRadius: 8 }} />
            <div>
              <div style={{ fontFamily: "var(--disp)", fontWeight: 700, fontSize: "1.15rem", color: INK, lineHeight: 1 }}>Elytra Shield</div>
              <div style={{ fontSize: ".6rem", letterSpacing: ".18em", color: MUTED, fontWeight: 600, marginTop: 3 }}>ROOF PRESERVATION</div>
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: ".85rem" }}>
            <div style={{ fontWeight: 600, color: INK }}>{h.name || "—"}</div>
            <div>{h.address || "—"}</div>
            <div style={{ color: MUTED }}>{[h.phone, h.email].filter(Boolean).join(" · ")}</div>
          </div>
        </div>

        {/* Scorecard — the advertised composition: gauge + status pill */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0 4px", flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontFamily: "var(--disp)", fontWeight: 600, color: INK }}>Roof Health Assessment™</div>
          <div style={{ fontSize: ".68rem", letterSpacing: ".14em", color: MUTED, border: `1px solid ${LINE}`, borderRadius: 999, padding: "4px 12px" }}>
            {date}{session.inspector ? ` · ASSESSED BY ${session.inspector.toUpperCase()}` : ""} · STANDARD v{SCORING_STANDARD_VERSION}
          </div>
        </div>
        <div style={{ display: "flex", gap: 26, alignItems: "center", margin: "10px 0 6px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", width: 128, height: 128, flex: "0 0 auto" }}>
            <svg width="128" height="128" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r="64" fill="none" stroke={LINE} strokeWidth="12" />
              <circle cx="75" cy="75" r="64" fill="none" stroke={GREEN} strokeWidth="12" strokeLinecap="round"
                strokeDasharray={dash} strokeDashoffset={off} transform="rotate(-90 75 75)" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
              <div>
                <div style={{ fontFamily: "var(--disp)", fontWeight: 700, fontSize: "2rem", color: INK, lineHeight: 1 }}>{score}</div>
                <div style={{ fontSize: ".7rem", color: MUTED }}>/ 100</div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontSize: ".8rem", fontWeight: 600, color: MUTED, marginBottom: 6 }}>Status</div>
            <div style={{ display: "inline-block", border: `2px solid ${GREEN}`, color: "#1f7d3a", fontWeight: 700, fontSize: ".9rem", borderRadius: 999, padding: "6px 16px" }}>
              {band} · {verdict}
            </div>
            <div style={{ fontSize: ".85rem", color: "#39536B", marginTop: 10 }}>{rec.summary}</div>
          </div>
        </div>

        {/* Factor rows — label · bar · qualitative value, exactly like the advertised card */}
        <div style={{ display: "grid", gap: 9, margin: "14px 0 4px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "150px 1fr 92px", gap: 14, alignItems: "center" }}>
            <span style={{ fontSize: ".82rem", color: MUTED }}>Roof age</span>
            <Bar value={ageBar} />
            <span style={{ fontSize: ".8rem", fontWeight: 600, color: INK, textAlign: "right" }}>{session.score.roofAge} yrs</span>
          </div>
          {FACTORS.map((f) => (
            <div key={f.key} style={{ display: "grid", gridTemplateColumns: "150px 1fr 92px", gap: 14, alignItems: "center" }}>
              <span style={{ fontSize: ".82rem", color: MUTED }}>{f.label}</span>
              <Bar value={session.score[f.key]} />
              <span style={{ fontSize: ".8rem", fontWeight: 600, color: INK, textAlign: "right" }}>{qual(session.score[f.key])}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: ".78rem", color: MUTED, margin: "8px 0 14px" }}>
          {session.score.roofType}{session.metrics?.homeSqFt ? ` · ~${session.metrics.homeSqFt.toLocaleString()} sq ft home` : ""} · Findings: {rec.reasons.join(" ")}
        </div>

        {/* Verdict strip — Preserve / Monitor / Replace, active one highlighted */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10, margin: "6px 0 16px" }}>
          {VERDICTS.map((v) => {
            const active = v.key === activeVerdict;
            return (
              <div key={v.key} style={{ border: `2px solid ${active ? v.color : LINE}`, borderRadius: 12, padding: "12px 14px", opacity: active ? 1 : 0.55 }}>
                <div style={{ fontFamily: "var(--disp)", fontWeight: 700, fontSize: ".85rem", color: v.color }}>
                  {v.key}{active ? " ✓" : ""}
                </div>
                <p style={{ fontSize: ".76rem", color: MUTED, lineHeight: 1.5, margin: "4px 0 0" }}>{v.text}</p>
              </div>
            );
          })}
        </div>

        {photos.length ? (
          <>
            <div style={{ fontWeight: 700, fontSize: ".9rem", margin: "14px 0 8px", color: INK }}>Photo documentation ({photos.length})</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 8 }}>
              {photos.map((p, i) => (
                <figure key={i} style={{ margin: 0 }}>
                  <img src={p.dataUrl} alt={p.label || `Photo ${i + 1}`} style={{ width: "100%", height: 96, objectFit: "cover", borderRadius: 6, border: `1px solid ${LINE}` }} />
                  <figcaption style={{ fontSize: ".7rem", color: MUTED }}>
                    {p.status === "healthy" ? "✓" : p.status === "watch" ? "⚠" : "✕"} {p.label || p.status}
                  </figcaption>
                </figure>
              ))}
            </div>
          </>
        ) : null}

        {inv && rec.tier !== "Not Recommended" ? (
          <div style={{ border: `2px solid ${GREEN}`, borderRadius: 12, marginTop: 16, padding: "12px 16px", fontSize: ".88rem" }}>
            <b style={{ color: INK }}>Roof Preservation System™ — quoted investment: ${inv.price.toLocaleString()}</b>
            {inv.modifierPct ? ` (includes disclosed +${inv.modifierPct}% complexity modifier)` : ""}
            <div style={{ color: MUTED, fontSize: ".78rem", marginTop: 4 }}>
              Price locked for 12 months from this assessment. Pay on completion — no deposit. Includes photo
              documentation, Roof Passport™, written warranty, and the complimentary annual reassessment.
            </div>
          </div>
        ) : null}

        <div style={{ fontSize: ".72rem", color: MUTED, marginTop: 16, borderTop: `1px solid ${LINE}`, paddingTop: 10, display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <span>
            <b style={{ color: INK }}>No photo, no score · Inspectors are never paid on treatment sales · You receive the entire score.</b>
            {" "}Methodology published at elytrashield.us/how-we-score.
          </span>
          <img src="/assets/elytra-shield-icon.png" alt="" width={22} height={22} style={{ borderRadius: 5, opacity: .85 }} />
        </div>
      </div>
    </div>
  );
}
