'use client';
import { useState } from "react";
import type { StepProps } from "@/types/sales";

type Force = "rain" | "wind" | "uv" | "heat" | "moisture";

const FORCES: { id: Force; label: string }[] = [
  { id: "rain", label: "Rain" },
  { id: "wind", label: "Wind" },
  { id: "uv", label: "UV radiation" },
  { id: "heat", label: "Heat" },
  { id: "moisture", label: "Moisture" },
];

const CAPTION: Record<Force, string> = {
  rain: "Rain hammers the surface all year — on a sealed roof it sheets off instead of soaking in.",
  wind: "Wind drives under edges and lifts material, working loose the layer that protects you.",
  uv: "UV radiation bakes the surface every daylight hour, drying and cracking it over time.",
  heat: "Heat swells and contracts the roof every day, fatiguing every seam and shingle.",
  moisture: "Moisture and vapor creep in beneath the surface, feeding rot and breaking the bond.",
};

function ForceOverlay({ force }: { force: Force }) {
  if (force === "rain") {
    return (
      <g className="fx fx-rain">
        {Array.from({ length: 11 }).map((_, i) => (
          <line
            key={i}
            className="rd"
            x1={70 + i * 22}
            y1={-24}
            x2={66 + i * 22}
            y2={-4}
            stroke="#7fc7ff"
            strokeWidth="2.4"
            strokeLinecap="round"
            style={{ animationDelay: `${(i % 5) * 0.18}s` }}
          />
        ))}
        <g className="rbead" fill="#9fd6ff">
          <circle cx="100" cy="150" r="3" />
          <circle cx="150" cy="124" r="3" />
          <circle cx="210" cy="120" r="3" />
          <circle cx="262" cy="150" r="3" />
        </g>
      </g>
    );
  }
  if (force === "wind") {
    return (
      <g className="fx fx-wind" fill="none" stroke="#cfe6ff" strokeWidth="2.6" strokeLinecap="round" opacity=".9">
        <path className="gust" d="M22 92 H150 a14 14 0 1 0 -14 -14" />
        <path className="gust" style={{ animationDelay: ".4s" }} d="M16 124 H198 a12 12 0 1 0 -12 -12" />
        <path className="gust" style={{ animationDelay: ".8s" }} d="M34 156 H168 a10 10 0 1 0 -10 -10" />
      </g>
    );
  }
  if (force === "uv") {
    return (
      <g className="fx fx-uv">
        <circle className="sun" cx="302" cy="42" r="22" fill="#ffd25a" />
        <g className="uvray" stroke="#ffcb45" strokeWidth="3" strokeLinecap="round" opacity=".9">
          <path d="M288 60 L226 118" />
          <path d="M302 66 L258 138" />
          <path d="M314 60 L300 128" />
        </g>
      </g>
    );
  }
  if (force === "heat") {
    return (
      <g className="fx fx-heat" fill="none" stroke="#ff8a3c" strokeWidth="3" strokeLinecap="round" opacity=".85">
        <path className="wave" d="M96 140 q18 -12 36 0 t36 0 t36 0" />
        <path className="wave" style={{ animationDelay: ".5s" }} d="M100 122 q18 -12 36 0 t36 0 t30 0" />
        <path className="wave" style={{ animationDelay: "1s" }} d="M110 106 q16 -10 32 0 t32 0" />
      </g>
    );
  }
  return (
    <g className="fx fx-moist" fill="#bfeede">
      {Array.from({ length: 14 }).map((_, i) => (
        <circle
          key={i}
          className="vap"
          cx={100 + ((i * 37) % 170)}
          cy={150}
          r={2.6 + (i % 3)}
          style={{ animationDelay: `${(i % 7) * 0.3}s` }}
        />
      ))}
    </g>
  );
}

export default function StepRoofShield(_: StepProps) {
  const [force, setForce] = useState<Force>("rain");

  return (
    <div className="s-wrap s-grid2">
      <div>
        <span className="s-eyebrow">Your roof is the shield</span>
        <h2 className="s-h">Every day it takes the beating so the rest of your home doesn’t have to.</h2>
        <p className="s-lead">This roof stands between your family and everything the weather throws at it.</p>

        <div className="shield-forces" role="group" aria-label="Select a force to see how it affects the roof">
          {FORCES.map((f) => (
            <button
              key={f.id}
              type="button"
              className="force-btn"
              aria-pressed={force === f.id}
              aria-label={`Show ${f.label} affecting the roof`}
              onClick={() => setForce(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="shield-caption" aria-live="polite">{CAPTION[force]}</p>
        <p className="shield-punch">Your roof is not decoration. It’s your home’s shield.</p>
      </div>

      <div className="s-panel" style={{ minHeight: 320, display: "grid", placeItems: "center" }}>
        <svg viewBox="0 0 360 300" width="100%" style={{ maxWidth: 420 }} aria-hidden="true">
          <polygon points="60,150 180,72 300,150" fill="#45C55A" />
          <polygon points="60,150 180,72 300,150" fill="none" stroke="#bff09a" strokeWidth="1.5" />
          <rect x="96" y="150" width="168" height="104" rx="6" fill="#0e2238" />
          <g fill="rgba(255,255,255,.16)">
            <circle cx="150" cy="206" r="13" />
            <path d="M132 250c0-15 8-26 18-26s18 11 18 26z" />
            <circle cx="210" cy="208" r="11" />
            <path d="M194 250c0-13 7-22 16-22s16 9 16 22z" />
          </g>
          <rect x="178" y="216" width="22" height="38" rx="3" fill="rgba(255,210,120,.5)" />
          <ForceOverlay force={force} />
        </svg>
      </div>
    </div>
  );
}
