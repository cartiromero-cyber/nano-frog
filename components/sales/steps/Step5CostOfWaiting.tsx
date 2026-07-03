'use client';
import type { StepProps } from "@/types/sales";
import { computeCostOfWaiting, money } from "@/lib/sales/cost";

export default function Step5CostOfWaiting({ session, update }: StepProps) {
  const c = session.cost;
  const set = (patch: Partial<typeof c>) => update({ cost: { ...c, ...patch } });
  const r = computeCostOfWaiting(c, session.score);
  const maxC = Math.max(c.replacementCost, c.preservationCost, 1);

  return (
    <div className="s-wrap s-grid2">
      <div>
        <span className="s-eyebrow">The cost of waiting</span>
        <h2 className="s-h">What does time actually cost?</h2>
        <p className="s-lead">Adjust the numbers for this home — the comparison is yours to see.</p>
        <div style={{ marginTop: 20 }}>
          <div className="s-rowlabel"><span>Estimated replacement cost</span><b>{money(c.replacementCost)}</b></div>
          <input className="s-range" type="range" min={6000} max={40000} step={500} value={c.replacementCost} onChange={(e) => set({ replacementCost: Number(e.target.value) })} />
          <div className="s-rowlabel" style={{ marginTop: 14 }}><span>Estimated preservation cost</span><b>{money(c.preservationCost)}</b></div>
          <input className="s-range" type="range" min={800} max={6000} step={100} value={c.preservationCost} onChange={(e) => set({ preservationCost: Number(e.target.value) })} />
        </div>
        <p style={{ fontSize: ".74rem", color: "rgba(234,242,248,.55)", marginTop: 16, maxWidth: "52ch" }}>
          Roof replacement costs vary widely by size, material, slope, labor, and local market. Figures are illustrative.
        </p>
      </div>
      <div className="s-panel">
        <div className="cw-bars">
          <div className="cw-col"><div className="cw-bar repl" style={{ height: (c.replacementCost / maxC) * 180 }} /><span>Replace</span><b>{money(c.replacementCost)}</b></div>
          <div className="cw-col"><div className="cw-bar pres" style={{ height: (c.preservationCost / maxC) * 180 }} /><span>Preserve</span><b>{money(c.preservationCost)}</b></div>
        </div>
        {/* P-008 (approved): years-extended and its derived figures are suppressed until
            documented field data substantiates them. Only the arithmetic difference remains. */}
        <div className="cw-stats">
          <div><span>Immediate difference</span><b>{money(r.immediateSavings)}</b></div>
        </div>
      </div>
    </div>
  );
}
