'use client';
import { useState } from "react";
import type { StepProps } from "@/types/sales";
import { SALES_ASSETS } from "@/content/sales-assets";
import { useAssetReady } from "@/components/sales/useAsset";

const FACTORS = [
  { key: "uv", name: "UV Degradation", body: "Ultraviolet radiation breaks down the asphalt binder that holds shingles together, drying them out over time." },
  { key: "moisture", name: "Moisture Intrusion", body: "Repeated wetting and drying works moisture into the shingle matrix, accelerating breakdown and lifting edges." },
  { key: "thermal", name: "Thermal Expansion", body: "Daily heating and cooling makes shingles expand and contract, fatiguing the material and opening micro-cracks." },
  { key: "granule", name: "Granule Loss", body: "The protective granule layer sheds with weathering, exposing the asphalt beneath to direct sun and rain." },
  { key: "oxidation", name: "Oxidation", body: "As oils evaporate, shingles oxidize and stiffen — losing the flexibility that keeps them watertight." },
];

export default function Step2WhyRoofsAge(_: StepProps) {
  const [active, setActive] = useState(0);
  const macro = useAssetReady(SALES_ASSETS.shingleMacro);
  const f = FACTORS[active];
  return (
    <div className="s-wrap">
      <span className="s-eyebrow">The science of weathering</span>
      <h2 className="s-h">Every roof ages. Here’s exactly why.</h2>
      {/* P-001: punchline merged from the retired "Roof Nobody Thinks About" slide */}
      <p className="s-lead">Deterioration doesn’t happen all at once — it happens a little every day. A leak is never created the day it appears. It’s created over <b style={{ color: "#fff" }}>thousands of days</b>.</p>
      <div className="s-grid2" style={{ marginTop: 20, alignItems: "stretch" }}>
        <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
          {FACTORS.map((x, n) => (
            <button key={x.key} className={"why-item" + (n === active ? " on" : "")} onClick={() => setActive(n)}>
              <span className="why-num">{n + 1}</span>{x.name}
            </button>
          ))}
        </div>
        <div className="s-panel" style={{ minHeight: 320 }}>
          <div className={"why-vis why-" + f.key} aria-hidden="true">
            <div className="why-shingle roof-tex" style={macro ? { backgroundImage: `url(${SALES_ASSETS.shingleMacro})`, backgroundSize: "cover", backgroundPosition: "center", filter: "none" } : undefined} />
            <div className="why-fx" />
          </div>
          <h3 style={{ fontFamily: "var(--disp)", color: "#fff", margin: "16px 0 8px", fontSize: "1.2rem" }}>{f.name}</h3>
          <p style={{ color: "rgba(234,242,248,.82)", lineHeight: 1.6 }}>{f.body}</p>
        </div>
      </div>
    </div>
  );
}
