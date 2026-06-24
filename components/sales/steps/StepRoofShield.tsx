'use client';
import type { StepProps } from "@/types/sales";

const THREATS = ["Rain", "Wind", "UV radiation", "Heat", "Moisture"];

export default function StepRoofShield(_: StepProps) {
  return (
    <div className="s-wrap s-grid2">
      <div>
        <span className="s-eyebrow">Your roof is the shield</span>
        <h2 className="s-h">Every day it takes the beating so the rest of your home doesn’t have to.</h2>
        <p className="s-lead">This roof stands between your family and everything the weather throws at it.</p>
        <div className="shield-list">
          {THREATS.map((t) => <span key={t} className="shield-tag">{t}</span>)}
        </div>
        <p className="shield-punch">Your roof is not decoration. It’s your home’s shield.</p>
      </div>
      <div className="s-panel" style={{ minHeight: 320, display: "grid", placeItems: "center" }}>
        <svg viewBox="0 0 360 300" width="100%" style={{ maxWidth: 420 }} aria-hidden="true">
          <g className="shield-rays" stroke="#9fb6d0" strokeWidth="2" strokeLinecap="round" opacity=".7">
            <path d="M70 20 L86 70"/><path d="M130 14 L138 66"/><path d="M190 14 L182 66"/><path d="M250 20 L234 70"/><path d="M300 26 L280 74"/>
          </g>
          <polygon points="60,150 180,72 300,150" fill="#12A589"/>
          <polygon points="60,150 180,72 300,150" fill="none" stroke="#bff09a" strokeWidth="1.5"/>
          <rect x="96" y="150" width="168" height="104" rx="6" fill="#0e2238"/>
          <g fill="rgba(255,255,255,.16)"><circle cx="150" cy="206" r="13"/><path d="M132 250c0-15 8-26 18-26s18 11 18 26z"/><circle cx="210" cy="208" r="11"/><path d="M194 250c0-13 7-22 16-22s16 9 16 22z"/></g>
          <rect x="178" y="216" width="22" height="38" rx="3" fill="rgba(255,210,120,.5)"/>
        </svg>
      </div>
    </div>
  );
}
