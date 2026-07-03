'use client';
import type { StepProps } from "@/types/sales";
import { buildReport } from "@/lib/sales/report";
import { money } from "@/lib/sales/cost";
import { SALES_ASSETS } from "@/content/sales-assets";
import { useAssetReady } from "@/components/sales/useAsset";

export default function Step9SavingsReport({ session }: StepProps) {
  const r = buildReport(session);
  const coverReady = useAssetReady(SALES_ASSETS.reportCover);
  return (
    <div className="s-wrap">
      <div className="report-actions">
        <div><span className="s-eyebrow">Your roof report</span><h2 className="s-h" style={{ margin: "8px 0 0" }}>A clear summary to keep.</h2></div>
        <button className="sales-btn solid no-print" onClick={() => window.print()}>Download / Print</button>
      </div>
      <div className="report-sheet">
        {coverReady ? <div className="report-cover"><img src={SALES_ASSETS.reportCover} alt="" /><div className="rc-shade" /></div> : null}
        <div className="rs-head">
          <div><img src="/assets/elytrashield-mark.svg" width={34} height={34} alt="" /><b>Elytra Shield — Roof Health Report™</b></div>
          <div className="rs-score">{r.score}<small>/100 · {r.band}</small></div>
        </div>
        <div className="rs-grid">
          <div><span>Homeowner</span><b>{r.homeowner.name || "—"}</b></div>
          <div><span>Estimated roof age</span><b>{r.estimatedAge} years</b></div>
          <div><span>Roof type</span><b>{r.roofType}</b></div>
          <div><span>Recommendation</span><b>{r.recommendation}</b></div>
        </div>
        <div className="rs-section"><h4>Assessment findings</h4><ul>{r.findings.map((f) => <li key={f}>{f}</li>)}</ul></div>
        <div className="rs-section"><h4>Potential financial impact</h4>
          <div className="rs-fin">
            <div><span>Replacement</span><b>{money(r.financial.replacementCost)}</b></div>
            <div><span>Preservation</span><b>{money(r.financial.preservationCost)}</b></div>
            <div><span>Years extended</span><b>{r.financial.yearsExtended} yrs</b></div>
            <div><span>Deferred value</span><b>{money(r.financial.deferredCostValue)}</b></div>
          </div>
        </div>
        <div className="rs-section"><h4>Next steps</h4><p>{r.recommendationSummary} Schedule an on-site inspection to confirm your official Roof Health Score and preservation plan.</p></div>
        <p className="rs-foot">Illustrative summary. Official scores and pricing are confirmed on-site. Preservation is for eligible roofs; replacement may still be necessary.</p>
      </div>
    </div>
  );
}
