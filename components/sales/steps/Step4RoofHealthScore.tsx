'use client';
import type { StepProps } from "@/types/sales";
import { computeRoofHealthScore, scoreBand } from "@/lib/sales/scoring";
import { roofTypes } from "@/content/formOptions";
import { SALES_ASSETS } from "@/content/sales-assets";
import { useAssetReady } from "@/components/sales/useAsset";

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div className="s-rowlabel"><span>{label}</span><b>{value}</b></div>
      <input className="s-range" type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

export default function Step4RoofHealthScore({ session, update }: StepProps) {
  const macro = useAssetReady(SALES_ASSETS.shingleMacro);
  const s = session.score;
  const set = (patch: Partial<typeof s>) => update({ score: { ...s, ...patch } });
  const score = computeRoofHealthScore(s);
  const band = scoreBand(score);
  const dash = 402, off = dash - (dash * score) / 100;

  return (
    <div className="s-wrap s-grid2">
      <div>
        <span className="s-eyebrow">Nano Frog Roof Health Score™</span>
        <h2 className="s-h">Let’s measure your roof together.</h2>
        <div style={{ marginTop: 18 }}>
          <div className="s-rowlabel"><span>Roof age</span><b>{s.roofAge} yrs</b></div>
          <input className="s-range" type="range" min={0} max={30} value={s.roofAge} onChange={(e) => set({ roofAge: Number(e.target.value) })} />
          <div style={{ margin: "14px 0" }}>
            <div className="s-rowlabel"><span>Roof type</span></div>
            <select className="s-input" value={s.roofType} onChange={(e) => set({ roofType: e.target.value })}>
              {roofTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <Slider label="Granule condition" value={s.granule} onChange={(v) => set({ granule: v })} />
          <Slider label="Flexibility" value={s.flexibility} onChange={(v) => set({ flexibility: v })} />
          <Slider label="Ventilation" value={s.ventilation} onChange={(v) => set({ ventilation: v })} />
          <Slider label="Repair history (100 = none)" value={s.repairHistory} onChange={(v) => set({ repairHistory: v })} />
          <Slider label="Storm exposure (100 = low)" value={s.stormExposure} onChange={(v) => set({ stormExposure: v })} />
        </div>
      </div>
      <div className="s-panel" style={{ display: "grid", placeItems: "center", minHeight: 320, overflow: "hidden" }}>
        {macro ? <img className="asset-faint" src={SALES_ASSETS.shingleMacro} alt="" /> : null}
        <div style={{ position: "relative", width: 230, height: 230, zIndex: 1 }}>
          <svg viewBox="0 0 150 150" width="230" height="230" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="75" cy="75" r="64" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="12" />
            <circle cx="75" cy="75" r="64" fill="none" stroke="var(--score)" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={dash} strokeDashoffset={off} style={{ transition: "stroke-dashoffset .6s var(--ease)" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: "var(--disp)", fontWeight: 700, fontSize: "3rem", color: "#fff", lineHeight: 1 }}>{score}</div>
            <div style={{ fontSize: ".8rem", color: "rgba(234,242,248,.6)" }}>/ 100</div>
          </div>
        </div>
        <div className="band-pill">{band}</div>
        <p style={{ fontSize: ".74rem", color: "rgba(234,242,248,.55)", marginTop: 12, textAlign: "center", maxWidth: "32ch" }}>
          Live estimate. The official Roof Health Score is confirmed on-site.
        </p>
      </div>
    </div>
  );
}
