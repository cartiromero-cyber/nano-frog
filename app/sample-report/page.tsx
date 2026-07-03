import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Change 005 (approved): a real, viewable sample of the deliverable — the highest-trust
// asset for skeptics. Uses the existing scorecard design language verbatim; values are
// static (no site.js on this route) and clearly marked SAMPLE.
export const metadata: Metadata = {
  title: "Sample Roof Health Report™ — Elytra Shield",
  description:
    "See exactly what you receive from a free Elytra Shield Roof Health Assessment: a measured score, factor-by-factor findings, and an honest written recommendation.",
};

const FACTORS = [
  { label: "Roof age", width: 62, value: "14 years — Moderate" },
  { label: "Granule condition", width: 74, value: "Fair" },
  { label: "Flexibility", width: 80, value: "Good" },
  { label: "Leak history", width: 88, value: "None noted" },
  { label: "Ventilation", width: 70, value: "Fair" },
  { label: "Weather exposure", width: 66, value: "Moderate" },
];

const DOCUMENTED = [
  ["Eaves & edges", "Minor granule wash at north gutter line; edges intact."],
  ["Field shingles", "Uniform wear consistent with age; no cupping or curling observed."],
  ["Flashing & penetrations", "Pipe boots serviceable; chimney flashing sound."],
  ["Moss / algae", "Light streaking on north slope; cosmetic at this stage."],
  ["Attic ventilation", "Ridge vent present; intake partially blocked — noted for correction."],
];

export default function SampleReportPage() {
  return (
    <>
      <Header solid />
      <section className="pad dark" id="sample-report" style={{ paddingTop: 150 }}>
        <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
          <div className="shead center" style={{ textAlign: "center" }}>
            <span className="eyebrow lt" style={{ justifyContent: "center" }}>Sample Roof Health Report™</span>
            <h2>This is exactly what you&rsquo;ll receive.</h2>
            <p className="muted">
              Every assessment produces this document — a measured score, factor-by-factor findings,
              and a written recommendation. Yours to keep, whether the answer is preserve or replace.
            </p>
          </div>

          <div style={{ maxWidth: 760, margin: "46px auto 0" }}>
            <div className="scorecard">
              <div className="sc-top"><span className="sc-brand">Roof Health Assessment™</span><span className="sc-tag">SAMPLE</span></div>
              <div className="gauge-wrap">
                <div className="gauge">
                  <svg width="150" height="150" viewBox="0 0 150 150">
                    <circle cx="75" cy="75" r="64" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="12" />
                    <circle cx="75" cy="75" r="64" fill="none" stroke="var(--score)" strokeWidth="12" strokeLinecap="round" strokeDasharray="402" strokeDashoffset="88" transform="rotate(-90 75 75)" />
                  </svg>
                  <div className="gval"><span className="gnum">78</span><span className="gden">/ 100</span></div>
                </div>
                <div>
                  <div className="sc-status">Status</div>
                  <div className="sc-statpill">Likely Preservation Candidate</div>
                  <div className="sc-note">Sample for illustration — your score reflects your roof&rsquo;s actual on-site condition.</div>
                </div>
              </div>
              <div className="sc-factors">
                {FACTORS.map((f) => (
                  <div className="factor" key={f.label}>
                    <span className="fl">{f.label}</span>
                    <span className="bar"><i style={{ width: `${f.width}%` }} /></span>
                    <span className="fv">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="scorecard" style={{ marginTop: 26 }}>
              <div className="sc-top"><span className="sc-brand">What your inspector documents</span><span className="sc-tag">SAMPLE</span></div>
              <div style={{ display: "grid", gap: 10, marginTop: 6 }}>
                {DOCUMENTED.map(([area, note]) => (
                  <div className="factor" key={area} style={{ gridTemplateColumns: "160px 1fr" }}>
                    <span className="fl">{area}</span>
                    <span className="fv" style={{ textAlign: "left" }}>{note}</span>
                  </div>
                ))}
              </div>
              <div className="sc-note" style={{ marginTop: 14 }}>
                Written recommendation (sample): &ldquo;This roof retains usable life and scores as a likely
                preservation candidate. Recommended: preservation treatment plus correction of blocked intake
                ventilation. Re-assess in 12 months. If conditions change, replacement guidance will be provided
                with no obligation.&rdquo;
              </div>
            </div>

            <div className="cta-row" style={{ justifyContent: "center", marginTop: 34 }}>
              <a className="btn btn-g btn-pulse" href="/book">Get My Free Assessment
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
            </div>
            <p className="muted" style={{ textAlign: "center", marginTop: 18, fontSize: ".86rem" }}>
              Sample shown for illustration only. Your report is produced from an on-site inspection of your roof —
              whether the recommendation is preserve, monitor, or replace.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
