import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AssessmentForm from "@/components/forms/AssessmentForm";
import { PHONE, PHONE_TEL, PRICING_LINE, PRICING_SUBLINE } from "@/content/site";

// Change 001 (approved): the booking page every CTA points to.
// Built entirely from the existing design system — no new colors, fonts, or components.
export const metadata: Metadata = {
  title: "Book Your Free Roof Health Assessment — Elytra Shield",
  description:
    "Schedule a free, documented Roof Health Assessment. A measured score, photos, and an honest recommendation — yours to keep, whatever it says.",
};

export default function BookPage() {
  return (
    <>
      <Header solid />
      <section className="pad mist" id="book" style={{ paddingTop: 150 }}>
        <div className="wrap qsplit">
          <div>
            <span className="eyebrow">Free Roof Health Assessment</span>
            <h2 style={{ margin: "16px 0 14px" }}>Book your free Roof Health Assessment.</h2>
            <p className="muted">
              A roughly 30-minute, photo-documented inspection of your roof&rsquo;s condition — scored,
              explained in plain English, and written up in a Roof Health Report&trade; that&rsquo;s yours
              to keep. If preservation is right for your roof, we&rsquo;ll show you why. If it
              isn&rsquo;t, we&rsquo;ll tell you that too.
            </p>
            <ul className="qcheck">
              <li>
                <span className="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg></span>
                <div><b>Free and no obligation</b> — no subscription, no pressure, no second visit required.</div>
              </li>
              <li>
                <span className="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg></span>
                <div><b>An honest verdict</b> — if you need a new roof, we&rsquo;ll tell you.</div>
              </li>
              <li>
                <span className="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg></span>
                <div><b>Documentation you keep</b> — score, photos, and recommendations, whatever you decide.</div>
              </li>
            </ul>
            <p className="muted" style={{ marginTop: 14, fontSize: ".92rem" }}>
              {PRICING_LINE} {PRICING_SUBLINE}
            </p>
            {PHONE ? (
              <p style={{ marginTop: 16 }}>
                Prefer to talk? <a href={PHONE_TEL} style={{ color: "var(--green)", fontWeight: 600 }}>Call {PHONE}</a>
              </p>
            ) : null}
            <p className="muted" style={{ marginTop: 12, fontSize: ".85rem" }}>
              Want to see the deliverable first? <a href="/sample-report" style={{ color: "var(--green)", fontWeight: 600 }}>View a sample Roof Health Report&trade;</a>
            </p>
            <p className="muted" style={{ marginTop: 10, fontSize: ".82rem" }}>
              Selling, or a realtor preparing a listing? A standalone documented assessment is <b>$249 flat</b> —
              same score, same photos, same written verdict.
            </p>
          </div>
          <div className="calc" style={{ alignSelf: "start" }}>
            <div style={{ fontFamily: "var(--disp)", fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
              Schedule your free assessment
            </div>
            <div className="muted" style={{ fontSize: ".82rem", marginBottom: 14 }}>
              Three quick fields — we confirm your window by call or text.
            </div>
            <AssessmentForm />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
