'use client';
import { useState } from "react";
import type { StepProps } from "@/types/sales";
import ReportCard from "@/components/sales/ReportCard";
import PrintButton from "@/components/sales/PrintButton";

/**
 * The real end of the presentation (owner-requested): deliver the report.
 * Print / save PDF · email the branded report PDF to the homeowner · open the
 * Roof Passport. The printable ReportCard is included on this slide so print
 * works right here; deck chrome and buttons are .no-print.
 */
export default function StepFinish({ session }: StepProps) {
  const [mail, setMail] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const approved = session.decision === "approved";
  const email = session.homeowner.email;
  const passportHref = session.homeowner.phone ? `/passport?phone=${encodeURIComponent(session.homeowner.phone)}` : "/passport";

  async function sendEmail() {
    setBusy(true); setMail("");
    const r = await fetch("/api/report/send", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(session),
    });
    const d = await r.json().catch(() => ({ ok: false, error: "Failed" }));
    setBusy(false);
    setMail(d.ok ? `Sent to ${email} ✓` : d.error || "Send failed");
  }

  return (
    <div className="s-wrap">
      <div className="no-print" style={{ textAlign: "center", marginBottom: 18 }}>
        <span className="s-eyebrow">Before we say goodbye</span>
        <h2 className="s-h">Your report goes with you.</h2>
        <p className="s-lead" style={{ margin: "0 auto" }}>
          {approved
            ? "Everything we documented today — and your quoted terms — delivered your way. We'll see you on application day."
            : "No decision needed today. Everything we documented is yours, and your quoted price is locked for 12 months."}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 18 }}>
          <PrintButton label="Print / Save PDF" />
          {email ? (
            <button className="sales-btn solid" disabled={busy} onClick={sendEmail}>
              {busy ? "Sending…" : `Email report to ${email}`}
            </button>
          ) : (
            <span style={{ fontSize: ".78rem", color: "#E0A12E", alignSelf: "center" }}>No email on file — capture on slide 1 to send.</span>
          )}
          <a className="sales-btn ghost" href={passportHref}>Open Roof Passport™</a>
        </div>
        {mail ? <p style={{ fontSize: ".8rem", color: mail.endsWith("✓") ? "var(--score)" : "#E0A12E", marginTop: 10 }}>{mail}</p> : null}
        <p style={{ fontSize: ".74rem", color: "rgba(234,242,248,.55)", marginTop: 12 }}>
          Thank you for letting us on your roof. — Elytra Shield
        </p>
      </div>
      <ReportCard session={session} />
    </div>
  );
}
