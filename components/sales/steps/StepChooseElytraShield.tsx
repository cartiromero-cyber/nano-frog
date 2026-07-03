'use client';
import type { StepProps } from "@/types/sales";

export default function StepChooseElytraShield(_: StepProps) {
  return (
    <div className="s-wrap" style={{ textAlign: "center" }}>
      <span className="s-eyebrow">Why homeowners choose Elytra Shield</span>
      <h2 className="s-h">The same reason people buy insurance.</h2>
      <p className="s-lead" style={{ margin: "0 auto" }}>Not because something is wrong. Because they want to keep it that way.</p>
      <div className="choose-split">
        <div className="choose-card"><b>They’re not buying a treatment.</b><span>A one-time fix for a problem that already happened.</span></div>
        <div className="choose-vs">they’re buying</div>
        <div className="choose-card hi"><b>Protection.</b><span>An extra layer added before the problems start.</span></div>
      </div>
      <p className="choose-punch">Smart homeowners protect what matters <em>before</em> they lose it — not after.</p>
    </div>
  );
}
