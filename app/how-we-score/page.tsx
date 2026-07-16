import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WEIGHTS, SCORING_STANDARD_VERSION } from "@/lib/sales/scoring";
import { VERDICT_GATES } from "@/lib/sales/recommendation";

// R-001 (approved): the published standard. People trust companies that show their math.
// SINGLE SOURCE OF TRUTH: weights, gates, and the version number are IMPORTED from the
// scoring engine itself (lib/sales/scoring.ts, recommendation.ts) — this page cannot
// drift from the math it describes. Factor prose lives here; numbers live in the engine.
export const metadata: Metadata = {
  title: "How We Score Roof Health — Elytra Shield",
  description:
    "The exact factors, weights, and bands behind every Elytra Shield Roof Health Score. Published in full — because a score you can't inspect is just an opinion.",
};

const pct = (w: number) => `${Math.round(w * 100)}%`;

const FACTORS = [
  { name: "Roof age", weight: pct(WEIGHTS.age), what: "Age relative to the ~25-year practical service life of asphalt shingles. Newer scores higher; nothing ages a score faster than the calendar." },
  { name: "Granule condition", weight: pct(WEIGHTS.granule), what: "How much of the protective granule layer remains. Granule loss exposes the asphalt beneath to direct sun and rain." },
  { name: "Flexibility", weight: pct(WEIGHTS.flexibility), what: "Whether shingles retain the suppleness that keeps them watertight, or have dried toward brittleness." },
  { name: "Repair history", weight: pct(WEIGHTS.repairHistory), what: "Past leaks, patches, and repairs. A clean history scores higher." },
  { name: "Ventilation", weight: pct(WEIGHTS.ventilation), what: "Attic intake and exhaust. Poor ventilation cooks shingles from below and shortens their life." },
  { name: "Storm exposure", weight: pct(WEIGHTS.stormExposure), what: "Hail, wind, and severe-weather exposure the roof has absorbed." },
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
            {/* SEO: page H1 (styled to the h2 scale — no visual change) */}
            <h1 style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", margin: "16px 0 14px" }}>How we score roof health.</h1>
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

          <div className="shead" style={{ maxWidth: "62ch", marginTop: 48 }}>
            <span className="eyebrow">The verdict rules</span>
            <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.1rem)" }}>How a score becomes a recommendation.</h2>
            <p className="muted">Published in full, because the verdict should never be a mystery — or a mood.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14, marginTop: 20 }}>
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, padding: 18 }}>
              <div style={{ fontWeight: 700, color: "var(--green)", fontFamily: "var(--disp)" }}>PRESERVE</div>
              <p style={{ fontSize: ".86rem", color: "var(--muted)", lineHeight: 1.55, marginTop: 6 }}>Score {VERDICT_GATES.excellent.minScore}+ with roof age {VERDICT_GATES.excellent.maxAge} years or less (strong candidate), or {VERDICT_GATES.good.minScore}+ with age {VERDICT_GATES.good.maxAge} or less (good candidate, confirmed on-site).</p>
            </div>
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, padding: 18 }}>
              <div style={{ fontWeight: 700, color: "#E0A12E", fontFamily: "var(--disp)" }}>MONITOR</div>
              <p style={{ fontSize: ".86rem", color: "var(--muted)", lineHeight: 1.55, marginTop: 6 }}>Score {VERDICT_GATES.monitor.minScore}–{VERDICT_GATES.good.minScore - 1}, or a higher score outside the age gates — a closer evaluation before any recommendation is made.</p>
            </div>
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, padding: 18 }}>
              <div style={{ fontWeight: 700, color: "#C0532E", fontFamily: "var(--disp)" }}>REPLACE</div>
              <p style={{ fontSize: ".86rem", color: "var(--muted)", lineHeight: 1.55, marginTop: 6 }}>Score below {VERDICT_GATES.monitor.minScore}. Preservation is not the right path — your report says so in writing, and we don&rsquo;t sell roofs.</p>
            </div>
          </div>

          <div style={{ maxWidth: "62ch", marginTop: 40 }}>
            <h3 style={{ marginBottom: 8 }}>The rules we hold ourselves to</h3>
            <p className="muted" style={{ marginBottom: 10 }}>
              <b>No photo, no score.</b> Every factor we rate must cite an inspection photo from your
              roof — a score without evidence is an opinion, and we don&rsquo;t sell opinions.
            </p>
            <p className="muted" style={{ marginBottom: 10 }}>
              <b>Our inspectors are never paid on treatment sales.</b> Nobody at Elytra Shield earns
              more when your roof scores lower. The score has one job: being right.
            </p>
            <p className="muted" style={{ marginBottom: 10 }}>
              <b>You always get the whole score.</b> Overall number, every factor, every photo, and the
              written verdict — nothing held back, nothing &ldquo;internal.&rdquo; Roof type adjusts the
              final number slightly (different materials age differently), and that adjustment is shown too.
            </p>
            <p className="muted" style={{ marginBottom: 10 }}>
              <b>Every assessment ends in one of three written verdicts</b> — preserve, monitor, or
              replace — and if the honest answer is replace, that&rsquo;s what your report will say.
            </p>
            <h3 style={{ margin: "26px 0 8px" }}>What four quiet years do to a score</h3>
            <p className="muted" style={{ marginBottom: 10 }}>
              A real example from our methodology: an 8-year-old roof scoring <b>82</b> — no leaks, no
              failures, nothing dramatic — re-scored at age 12 after normal weathering and one hail
              season: <b>67</b>. Granules washed a little each season, flexibility faded as oils
              evaporated, and the calendar did the rest. Fifteen points, without a single &ldquo;problem.&rdquo;
              That&rsquo;s why a roof never scores higher than it does today.
            </p>
            <p className="muted" style={{ fontSize: ".86rem" }}>
              <b>Version history</b> — v{SCORING_STANDARD_VERSION} (July 2026): published verdict thresholds, inspector-pay
              integrity rule, no-photo-no-score rule, full-disclosure rule, and the worked aging example,
              following adoption of the internal Roof Health Score Standard v1. · v1.0 (July 2026):
              initial publication — factors, weights, bands. If we change the rubric, the change and the
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
