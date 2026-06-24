'use client';
import { useState } from "react";
import type { StepProps } from "@/types/sales";
import { computeFutureProjection } from "@/lib/sales/future";
import { money } from "@/lib/sales/cost";

const W = 620, H = 300, PAD = 46;

export default function StepFutureCost({ session }: StepProps) {
  const p = computeFutureProjection(session.cost, session.score, 12);
  const [wait, setWait] = useState(Math.min(5, p.horizon));
  const x = (yr: number) => PAD + (yr / p.horizon) * (W - PAD * 2);
  const y = (v: number) => H - PAD - (v / p.maxValue) * (H - PAD * 2);
  const line = (arr: number[]) => arr.map((v, i) => x(i) + "," + y(v)).join(" ");
  // shaded "gap" = the money lost by waiting (between the two cumulative-cost lines)
  const gap = p.delay.map((v, i) => x(i) + "," + y(v)).join(" ") + " " +
    p.preserve.map((v, i) => x(i) + "," + y(v)).reverse().join(" ");

  return (
    <div className="s-wrap">
      <span className="s-eyebrow">The cost of delay</span>
      <h2 className="s-h">What does waiting actually cost over time?</h2>
      <p className="s-lead">Roof problems don’t pause. This is how the numbers tend to move when maintenance is delayed versus preserved now.</p>

      <div className="s-grid2" style={{ marginTop: 18, alignItems: "center" }}>
        <div className="s-panel">
          <svg viewBox={"0 0 " + W + " " + H} width="100%" aria-hidden="true">
            {/* shaded gap = cost of waiting */}
            <polygon points={gap} fill="rgba(192,83,46,.16)" />
            <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(255,255,255,.25)" strokeWidth="1" />
            <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,.25)" strokeWidth="1" />
            {/* replacement jump marker */}
            <line x1={x(p.replaceYearDelay)} y1={PAD} x2={x(p.replaceYearDelay)} y2={H - PAD} stroke="rgba(192,83,46,.45)" strokeDasharray="3 4" />
            <polyline fill="none" stroke="var(--score)" strokeWidth="3.5" strokeLinejoin="round" points={line(p.preserve)} />
            <polyline fill="none" stroke="#C0532E" strokeWidth="3.5" strokeLinejoin="round" points={line(p.delay)} />
            <circle cx={x(p.replaceYearDelay)} cy={y(p.delay[p.replaceYearDelay])} r="6" fill="#C0532E" stroke="#fff" strokeWidth="1.5" />
            <text x={x(p.replaceYearDelay)} y={y(p.delay[p.replaceYearDelay]) - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#E58a6b">replacement</text>
            <line x1={x(wait)} y1={PAD} x2={x(wait)} y2={H - PAD} stroke="rgba(255,255,255,.4)" strokeDasharray="4 4" />
            <circle cx={x(wait)} cy={y(p.delay[wait])} r="5" fill="#C0532E" />
            <circle cx={x(wait)} cy={y(p.preserve[wait])} r="5" fill="var(--score)" />
            <text x={PAD} y={H - PAD + 18} fontSize="11" fill="rgba(234,242,248,.55)">now</text>
            <text x={W - PAD} y={H - PAD + 18} textAnchor="end" fontSize="11" fill="rgba(234,242,248,.55)">{p.horizon} years</text>
          </svg>
          <div className="fc-legend">
            <span><i style={{ background: "#C0532E" }} />Delay maintenance</span>
            <span><i style={{ background: "var(--score)" }} />Preserve now</span>
          </div>
        </div>

        <div>
          <div className="s-rowlabel"><span>If you wait…</span><b>{wait} {wait === 1 ? "year" : "years"}</b></div>
          <input className="s-range" type="range" min={1} max={p.horizon} value={wait} onChange={(e) => setWait(Number(e.target.value))} />
          <div className="fc-cards">
            <div className="s-card"><span>Likely spend by year {wait} (delay)</span><b style={{ color: "#E58a6b" }}>{money(p.delay[wait])}</b></div>
            <div className="s-card"><span>Likely spend by year {wait} (preserve)</span><b style={{ color: "var(--score)" }}>{money(p.preserve[wait])}</b></div>
            <div className="s-card hi"><span>Difference at {p.horizon} years</span><b>{money(p.extraAtHorizon)}</b></div>
          </div>
          <p style={{ fontSize: ".74rem", color: "rgba(234,242,248,.55)", marginTop: 12 }}>
            Illustrative projection from the figures entered. Repairs, replacement timing, and local pricing vary; numbers are for discussion.
          </p>
        </div>
      </div>
    </div>
  );
}
