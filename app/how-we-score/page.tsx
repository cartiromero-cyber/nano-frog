import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// R-001 (approved): the published standard. People trust companies that show their math.
// Content mirrors lib/sales/scoring.ts exactly — if the rubric changes, update BOTH and
// note the change in the version history below (standards behave this way on purpose).
export const metadata: Metadata = {
  title: "How We Score Roof Health — Elytra Shield",
  description:
    "The exact factors, weights, and bands behind every Elytra Shield Roof Health Score. Published in full — because a score you can't inspect is just an opinion.",
};

const FACTORS = [
  { name: "Roof age", weight: "22%", what: "Age relative to the ~25-year practical service life of asphalt shingles. Newer scores higher; nothing ages a score faster than the calendar." },
  { name: "Granule condition", weight: "20%", what: "How much of the protective granule layer remains. Granule loss exposes the asphalt beneath to direct sun and rain." },
  { name: "Flexibility", weight: "20%", what: "Whether shingles retain the suppleness that keeps them watertight, or have dried toward brittleness." },
  { name: "Repair history", weight: "14%", what: "Past leaks, patches, and repairs. A clean history scores higher." },
  { name: "Ventilation", weight: "12%", what: "Attic intake and exhaust. Poor ventilation cooks shingles from below and shortens their life." },
  { name: "Storm exposure", weight: "12%", what: "Hail, wind, and severe-weather exposure the roof has absorbed." },
];

const BANDS = [
  { range: "80–100", band: "Excellent", meaning: "Strong condition — preservation protects existing value." },
  { range: "65–79", band: "Strong", meaning: "Aging normally — a likely preservation candidate." },
  { range: "50–64", band: "Fair", meaning: "Meaningful wear — candidacy depends on the specific factors." },
  { range: "Below 50", band: "At Risk", meaning: "Serious wear — replacement planning is often the honest recommendation." },
];

export default function HowWeScorePage() {
  return (
    <>
      <Header solid />
      <section className="pad mist" id="how-we-score" style={{ paddingTop: 150 }}>
        <div className="wrap">
          <div className="shead" style={{ maxWidth: "62ch" }}>
            <span className="eyebrow">The published standard</span>
            <h2>How we score roof health.</h2>
            <p className="muted">
              Every Elytra Shield Roof Health Score is computed from the six factors below, with the
              exact weights shown. We publish our math because a score you can&rsquo;t inspect is just
              an opinion &mdash; and because you should be able to check our work.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, marginTop: 34 }}>
            {FACTORS.map((f) => (
              <div className="nfcard" key={f.name} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, padding: "22px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <h3 style={{ fontSize: "1.04rem" }}>{f.name}</h3>
                  <span style={{ fontFamily: "var(--disp)", fontWeight: 700, color: "var(--green)" }}>{f.weight}</span>
                </div>
                <p style={{ fontSize: ".9rem", color: "var(--muted)", lineHeight: 1.6 }}>{f.what}</p>
              </div>
            ))}
          </div>

          <div className="shead" style={{ maxWidth: "62ch", marginTop: 48 }}>
            <span className="eyebrow">What the number means</span>
            <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.1rem)" }}>Score bands.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14, marginTop: 20 }}>
            {BANDS.map((b) => (
              <div key={b.band} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, padding: "18px 18px" }}>
                <div style={{ fontFamily: "var(--disp)", fontWeight: 700, fontSize: "1.15rem", color: "var(--ink)" }}>{b.range}</div>
                <div style={{ fontWeight: 600, color: "var(--green)", margin: "2px 0 6px" }}>{b.band}</div>
                <p style={{ fontSize: ".86rem", color: "var(--muted)", lineHeight: 1.55 }}>{b.meaning}</p>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: "62ch", marginTop: 40 }}>
            <h3 style={{ marginBottom: 8 }}>The rules we hold ourselves to</h3>
            <p className="muted" style={{ marginBottom: 10 }}>
              An official score is produced only from an on-site inspection — photographed at every
              checkpoint, scored in front of you, and delivered in a written report you keep. Roof type
              adjusts the final number slightly (different materials age differently). Every assessment
              ends in one of three written verdicts: <b>preserve</b>, <b>monitor</b>, or <b>replace</b> —
              and if the honest answer is replace, that&rsquo;s what your report will say.
            </p>
            <p className="muted" style={{ fontSize: ".86rem" }}>
              Methodology version 1.0 (published July 2026). If we change the rubric, the change and the
              reason will be listed here — that&rsquo;s what publishing a standard means.
            </p>
            <div className="cta-row" style={{ marginTop: 22 }}>
              <a className="btn btn-g" href="/book">Get My Roof&rsquo;s Score
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
              <a className="btn btn-o" href="/sample-report">See a Sample Report</a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
