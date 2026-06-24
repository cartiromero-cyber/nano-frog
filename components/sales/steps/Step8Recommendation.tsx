'use client';
import type { StepProps } from "@/types/sales";
import { recommend, TIER_COLOR } from "@/lib/sales/recommendation";

export default function Step8Recommendation({ session }: StepProps) {
  const r = recommend(session.score);
  return (
    <div className="s-wrap" style={{ textAlign: "center" }}>
      <span className="s-eyebrow">The assessment</span>
      <h2 className="s-h">Based on everything we measured…</h2>
      <div className="rec-badge" style={{ borderColor: TIER_COLOR[r.tier], color: TIER_COLOR[r.tier] }}>
        <div className="rec-score">{r.score}<small>/100</small></div>
        <div className="rec-tier">{r.tier}</div>
      </div>
      <p className="s-lead" style={{ margin: "18px auto 0" }}>{r.summary}</p>
      <div className="rec-reasons">
        {r.reasons.map((x) => <div key={x} className="s-card" style={{ textAlign: "left" }}>{x}</div>)}
      </div>
      <p style={{ fontSize: ".74rem", color: "rgba(234,242,248,.55)", marginTop: 18 }}>
        Generated objectively from the inputs above. A final recommendation is confirmed by an on-site inspection.
      </p>
    </div>
  );
}
