'use client';
import type { StepProps } from "@/types/sales";
import { SALES_ASSETS } from "@/content/sales-assets";
import { useAssetReady } from "@/components/sales/useAsset";

export default function Step7ChemistStory(_: StepProps) {
  const labReady = useAssetReady(SALES_ASSETS.labPhoto);
  return (
    <div className="s-wrap s-grid2">
      <div>
        <span className="s-eyebrow">The story</span>
        <h2 className="s-h">It started with a chemist who refused to accept waste.</h2>
        <p className="s-lead">Years of development went into one question: how do you protect a roof that still has good life left in it?</p>
        <p style={{ color: "rgba(234,242,248,.78)", lineHeight: 1.7, marginTop: 14 }}>
          The work was never about a miracle product. It was about studying how roofs break down — and engineering a treatment, refined over time, that helps eligible roofs resist everyday exposure. Science, in service of the homes people live in.
        </p>
      </div>
      <div className="s-panel chem" style={{ minHeight: 340, display: "grid", placeItems: "center", overflow: "hidden" }}>
        {labReady ? <><img className="asset-cover" src={SALES_ASSETS.labPhoto} alt="Nano Frog materials-science lab" /><div className="asset-shade" /></> : (
        <svg viewBox="0 0 320 300" width="100%" style={{ maxWidth: 380 }} aria-hidden="true">
          <ellipse cx="160" cy="278" rx="130" ry="10" fill="#000" opacity="0.2" />
          {/* scientist silhouette */}
          <g fill="rgba(255,255,255,.14)"><circle cx="86" cy="120" r="22" /><path d="M60 210c0-26 12-44 26-44s26 18 26 44z" /></g>
          {/* glass flasks with green fluid */}
          <g stroke="rgba(255,255,255,.5)" strokeWidth="2" fill="none">
            <path d="M150 150 L146 230 Q146 238 154 238 L186 238 Q194 238 194 230 L190 150" />
            <line x1="148" y1="150" x2="192" y2="150" />
          </g>
          <path className="chem-fluid" d="M148 196 L146 230 Q146 238 154 238 L186 238 Q194 238 194 230 L192 196 Z" fill="url(#cf)" />
          <defs><linearGradient id="cf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#12A589" /><stop offset="1" stopColor="#0E7C66" /></linearGradient></defs>
          {/* growing tree (preservation) */}
          <g className="chem-tree">
            <rect x="252" y="214" width="8" height="40" rx="3" fill="#6b5a45" />
            <circle cx="256" cy="200" r="26" fill="#2f8f5b" />
            <circle cx="240" cy="210" r="16" fill="#37a468" />
            <circle cx="272" cy="208" r="16" fill="#37a468" />
          </g>
        </svg>
        )}
      </div>
    </div>
  );
}
