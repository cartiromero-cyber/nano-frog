'use client';
import type { StepProps } from "@/types/sales";

const DRIPS = ["A little UV damage", "A little moisture", "A little thermal expansion", "A little granule loss"];

export default function StepRoofNobody(_: StepProps) {
  return (
    <div className="s-wrap">
      <span className="s-eyebrow">The roof nobody thinks about</span>
      <h2 className="s-h">Deterioration doesn’t happen all at once.</h2>
      <p className="s-lead">Most homeowners don’t think about their roof until something goes wrong. The truth is it wears down a little every single day.</p>
      <div className="rn-flow">
        {DRIPS.map((d, n) => <div className="rn-chip" key={d} style={{ animationDelay: 0.2 + n * 0.15 + "s" }}>{d}</div>)}
        <div className="rn-arrow">→</div>
        <div className="rn-leak">Then one day — a leak</div>
      </div>
      <p className="rn-punch">The problem wasn’t created that day. It was created over <b>thousands of days</b>.</p>
    </div>
  );
}
