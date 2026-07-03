'use client';
import type { StepProps } from "@/types/sales";
import { recommend } from "@/lib/sales/recommendation";

// P-003 (approved): "Is Replacement Necessary Today?" — the trust detonator. The verdict is
// derived from the same recommendation logic as everything else, including the honest YES.
// Design language: existing s-* classes and the established status colors only.

export default function StepReplacementVerdict({ session }: StepProps) {
  const tier = recommend(session.score).tier;
  const mode: "no" | "unclear" | "yes" =
    tier === "Not Recommended" ? "yes" : tier === "Needs Inspection" ? "unclear" : "no";

  const verdict = mode === "no" ? "No." : mode === "unclear" ? "Not yet clear." : "Yes.";
  const color = mode === "no" ? "var(--score)" : mode === "unclear" ? "#E0A12E" : "#C0532E";

  return (
    <div className="s-wrap" style={{ textAlign: "center" }}>
      <span className="s-eyebrow">The question you&rsquo;re actually asking</span>
      <h2 className="s-h">Is replacement necessary today?</h2>
      <div style={{ fontFamily: "var(--disp)", fontWeight: 600, fontSize: "clamp(3.2rem, 9vw, 5.5rem)", color, lineHeight: 1.05, margin: "26px 0 10px" }}>
        {verdict}
      </div>
      {mode === "no" ? (
        <>
          <p className="s-lead" style={{ margin: "0 auto" }}>
            <b style={{ color: "#fff" }}>You do not need a new roof today.</b>
          </p>
          <p className="s-lead" style={{ margin: "10px auto 0" }}>
            But you do have an opportunity to preserve the roof you already own.
          </p>
        </>
      ) : mode === "unclear" ? (
        <p className="s-lead" style={{ margin: "0 auto" }}>
          Parts of this roof need a closer look before that question can be answered honestly.
          No recommendation until the evidence is in.
        </p>
      ) : (
        <>
          <p className="s-lead" style={{ margin: "0 auto" }}>
            <b style={{ color: "#fff" }}>Honestly: this roof is at the point where replacement is the right plan.</b>
          </p>
          <p className="s-lead" style={{ margin: "10px auto 0" }}>
            We&rsquo;ll put that in writing in your report — and we don&rsquo;t sell roofs, so you can take
            it to any roofer you choose.
          </p>
        </>
      )}
      <p style={{ fontSize: ".74rem", color: "rgba(234,242,248,.55)", marginTop: 22 }}>
        Read directly from your Roof Health Assessment — the same answer, whatever it means for us.
      </p>
    </div>
  );
}
