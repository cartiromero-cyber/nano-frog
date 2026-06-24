'use client';
import { useState } from "react";
import type { StepProps } from "@/types/sales";

const PHASES = ["Membrane flows across the surface", "Micro-cracks seal", "Water beads instantly", "Granules lock in", "UV deflected"];

export default function Step6MembraneDemo(_: StepProps) {
  const [run, setRun] = useState(true);
  return (
    <div className="s-wrap">
      <span className="s-eyebrow">Membrane demonstration</span>
      <h2 className="s-h">Watch protection happen.</h2>
      <div className={"demo-stage" + (run ? " run" : "")} aria-hidden="true">
        <div className="demo-shingle" />
        <div className="demo-membrane" />
        <div className="demo-beads">{Array.from({ length: 7 }).map((_, i) => <i key={i} className={"demo-bead b" + i} />)}</div>
        <div className="demo-uv" />
        <div className="demo-caption">{PHASES.map((p, i) => <span key={p} style={{ animationDelay: 1 + i * 1.1 + "s" }}>{p}</span>)}</div>
      </div>
      <div style={{ textAlign: "center", marginTop: 18 }}>
        <button className="sales-btn solid" onClick={() => { setRun(false); requestAnimationFrame(() => setRun(true)); }}>Replay demonstration</button>
      </div>
    </div>
  );
}
