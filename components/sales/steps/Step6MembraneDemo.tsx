'use client';
import { useEffect, useRef, useState } from "react";
import type { StepProps } from "@/types/sales";
import { SALES_ASSETS } from "@/content/sales-assets";
import { useAssetReady } from "@/components/sales/useAsset";

const PHASES = ["Dry, weathered shingle surface", "Elytra Shield membrane flows across", "Surface seals — granules stabilize", "Water beads on contact", "Protected — documented"];

export default function Step6MembraneDemo(_: StepProps) {
  const [run, setRun] = useState(true);
  const [hasVideo, setHasVideo] = useState(false);
  const macro = useAssetReady(SALES_ASSETS.shingleMacro);
  const vref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = vref.current; if (!v) return;
    const ok = () => setHasVideo(true);
    const bad = () => setHasVideo(false);
    v.addEventListener("canplay", ok); v.addEventListener("error", bad);
    v.src = SALES_ASSETS.membraneVideo; v.load();
    return () => { v.removeEventListener("canplay", ok); v.removeEventListener("error", bad); };
  }, []);

  return (
    <div className="s-wrap">
      <span className="s-eyebrow">Membrane demonstration</span>
      <h2 className="s-h">Watch protection happen — up close.</h2>
      <div className={"mem2-stage" + (run ? " run" : "") + (hasVideo ? " hasvid" : "")} aria-hidden="true">
        <video ref={vref} className="mem2-video" muted loop playsInline autoPlay />
        <div className="mem2-roof roof-tex" style={macro ? { backgroundImage: `url(${SALES_ASSETS.shingleMacro})`, backgroundSize: "cover", backgroundPosition: "center", filter: "contrast(1.04)" } : undefined} />
        <div className="mem2-grain" />
        <div className="mem2-darken" />
        <div className="mem2-flow" />
        <div className="mem2-beads">{Array.from({ length: 9 }).map((_, i) => <i key={i} className={"mem2-bead b" + i} />)}</div>
        <div className="mem2-vignette" />
        <div className="mem2-caption">{PHASES.map((p, i) => <span key={p} style={{ animationDelay: 0.8 + i * 1.1 + "s" }}>{p}</span>)}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 16, alignItems: "center" }}>
        <button className="sales-btn solid" onClick={() => { setRun(false); requestAnimationFrame(() => setRun(true)); const v = vref.current; if (v) { v.currentTime = 0; v.play().catch(() => {}); } }}>Replay</button>
        <span className="s-lead" style={{ fontSize: ".82rem", opacity: .6 }}>Hydrophobic beading · UV resistance · flexibility preserved</span>
      </div>
    </div>
  );
}
