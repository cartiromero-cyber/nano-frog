'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FOLLOWUP_TYPES } from "@/lib/sales/crm-constants";

export default function FollowUpForm({ leadId }: { leadId: string }) {
  const router = useRouter(); const [due, setDue] = useState(""); const [type, setType] = useState("Call"); const [notes, setNotes] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); if (!due) return; setBusy(true);
    await fetch(`/api/leads/${leadId}/follow-ups`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ due_date: due, type, notes }) });
    setBusy(false); setDue(""); setNotes(""); router.refresh();
  }
  return (
    <form className="crm-form" onSubmit={submit}>
      <div className="crm-form-row">
        <input className="s-input" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        <select value={type} onChange={(e) => setType(e.target.value)}>{FOLLOWUP_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
      </div>
      <input className="s-input" placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <button className="sales-btn solid" disabled={busy}>Schedule follow-up</button>
    </form>
  );
}
