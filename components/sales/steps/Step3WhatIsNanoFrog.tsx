'use client';
import type { StepProps } from "@/types/sales";

const POINTS = [
  ["Nanotechnology membrane", "A thin protective layer engineered at a microscopic scale."],
  ["Bonds to the surface", "It penetrates and binds with the shingle rather than just sitting on top."],
  ["Shields from exposure", "Designed to help deflect UV and repel water at the surface."],
  ["Preserves flexibility", "Helps shingles keep the suppleness that keeps them watertight."],
  ["Slows aging", "Reduces the everyday breakdown that shortens a roof\u2019s life."],
];

export default function Step3WhatIsNanoFrog(_: StepProps) {
  return (
    <div className="s-wrap s-grid2">
      <div>
        <span className="s-eyebrow">What is Nano Frog</span>
        <h2 className="s-h">Protection, engineered at the surface.</h2>
        <p className="s-lead">No hype \u2014 just what the technology is designed to do, in plain terms.</p>
        <div style={{ display: "grid", gap: 12, marginTop: 22 }}>
          {POINTS.map(([t, d]) => (
            <div key={t} className="s-card" style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span className="nf-tick" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>
              </span>
              <div><b style={{ color: "#fff" }}>{t}</b><div style={{ color: "rgba(234,242,248,.78)", fontSize: ".95rem", marginTop: 2 }}>{d}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div className="s-panel" style={{ minHeight: 340, display: "grid", placeItems: "center" }}>
        <div className="membrane-cut" aria-hidden="true">
          <div className="mc-shingle" /><div className="mc-membrane" /><div className="mc-label">Nano Frog membrane</div>
        </div>
      </div>
    </div>
  );
}
