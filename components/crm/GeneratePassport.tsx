'use client';
import { useState } from "react";
export default function GeneratePassport({ lead }: { lead: any }) {
  const [busy, setBusy] = useState(false); const [url, setUrl] = useState("");
  async function go() {
    setBusy(true);
    const session = { homeowner: { name: lead.name, phone: lead.phone, email: lead.email, address: lead.address, city: lead.city },
      connection: {}, score: { roofAge: lead.roof_age || 14, roofType: "Architectural shingle", granule: 70, flexibility: 70, ventilation: 75, repairHistory: 80, stormExposure: 70 },
      cost: { replacementCost: 14000, preservationCost: 2200 }, createdAt: new Date().toISOString() };
    await fetch("/api/sales/passport", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(session) });
    setBusy(false);
    setUrl(lead.phone ? `/passport?phone=${encodeURIComponent(lead.phone)}` : lead.email ? `/passport?email=${encodeURIComponent(lead.email)}` : "/passport");
  }
  if (url) return <a className="sales-btn solid" href={url}>Open Passport →</a>;
  return <button className="sales-btn ghost" disabled={busy} onClick={go}>{busy ? "Working…" : "Generate / Update Passport"}</button>;
}
