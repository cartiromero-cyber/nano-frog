'use client';
import type { StepProps } from "@/types/sales";
import { SALES_ASSETS } from "@/content/sales-assets";
import { useAssetReady } from "@/components/sales/useAsset";

const POINTS = [
  ["Protective membrane", "A thin protective layer engineered at a microscopic scale."],
  ["Bonds to the surface", "It penetrates and binds with the shingle rather than just sitting on top."],
  ["Hydrophobic & UV-resistant", "Designed to help repel water and deflect UV at the surface."],
  ["Preserves flexibility", "Helps shingles keep the suppleness that keeps them watertight."],
  ["Slows aging", "Reduces the everyday breakdown that shortens a roof’s life."],
];

export default function Step3WhatIsElytraShield(_: StepProps) {
  const macro = useAssetReady(SALES_ASSETS.shingleMacro);
  return (
    <div className="s-wrap s-grid2">
      <div>
        <span className="s-eyebrow">What is Elytra Shield</span>
        <h2 className="s-h">Protection, engineered at the surface.</h2>
        <p className="s-lead">No hype — just what the technology is designed to do, in plain terms.</p>
        <div style={{ display: "grid", gap: 12, marginTop: 22 }}>
          {POINTS.map(([t, d]) => (
            <div key={t} className="s-card" style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span className="nf-tick" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg></span>
              <div><b style={{ color: "#fff" }}>{t}</b><div style={{ color: "rgba(234,242,248,.78)", fontSize: ".95rem", marginTop: 2 }}>{d}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div className="s-panel" style={{ minHeight: 360, display: "grid", placeItems: "center", overflow: "hidden" }}>
        {macro ? <img className="asset-faint" src={SALES_ASSETS.shingleMacro} alt="" /> : null}
        <svg viewBox="0 0 360 320" width="100%" style={{ maxWidth: 400, position: "relative", zIndex: 1 }} aria-hidden="true">
          <defs>
            <linearGradient id="memG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bff09a"/><stop offset="1" stopColor="#45C55A"/></linearGradient>
            <radialGradient id="beadG2" cx="38%" cy="32%" r="62%"><stop offset="0" stopColor="#fff" stopOpacity=".92"/><stop offset="45%" stopColor="#dff7e6" stopOpacity=".28"/><stop offset="100%" stopColor="#9fd7b4" stopOpacity=".1"/></radialGradient>
          </defs>
          {/* UV rays deflecting off the membrane */}
          <g className="cs-uv" stroke="#ffd27a" strokeWidth="2" strokeLinecap="round" opacity=".8">
            <path d="M70 30 L90 70"/><path d="M150 20 L150 64"/><path d="M230 30 L210 70"/>
            <path d="M110 24 L122 66"/><path d="M190 24 L178 66"/>
          </g>
          {/* water beads on top of the membrane */}
          <g>
            <circle cx="96" cy="96" r="13" fill="url(#beadG2)"/><circle cx="150" cy="90" r="9" fill="url(#beadG2)"/>
            <circle cx="206" cy="98" r="15" fill="url(#beadG2)"/><circle cx="258" cy="92" r="8" fill="url(#beadG2)"/>
          </g>
          {/* Elytra Shield membrane (thin sheen at surface) */}
          <rect x="40" y="104" width="280" height="16" rx="4" fill="url(#memG)"/>
          <rect x="40" y="104" width="280" height="4" fill="#fff" opacity=".35"/>
          <text x="324" y="100" textAnchor="end" fontFamily="Inter,sans-serif" fontSize="10" fill="#bff09a">Elytra Shield membrane</text>
          {/* granule layer */}
          <rect x="40" y="120" width="280" height="40" fill="#5a5e63"/>
          <g fill="#74787d">{Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={48 + (i * 13) % 270} cy={128 + (i * 7) % 26} r="2.2" />)}</g>
          <text x="48" y="150" fontFamily="Inter,sans-serif" fontSize="10" fill="#cfd6dd">Granule layer</text>
          {/* asphalt layer */}
          <rect x="40" y="160" width="280" height="46" fill="#34373b"/>
          <text x="48" y="188" fontFamily="Inter,sans-serif" fontSize="10" fill="#aeb5bd">Asphalt layer</text>
          {/* mat / base */}
          <rect x="40" y="206" width="280" height="18" fill="#22252a"/>
          <text x="48" y="219" fontFamily="Inter,sans-serif" fontSize="9" fill="#8b939b">Fiberglass mat</text>
        </svg>
      </div>
    </div>
  );
}
