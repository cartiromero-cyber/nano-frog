'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { NOTE_TYPES } from "@/lib/sales/crm-constants";

export default function NoteForm({ leadId }: { leadId: string }) {
  const router = useRouter(); const [note, setNote] = useState(""); const [type, setType] = useState("General"); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); if (!note.trim()) return; setBusy(true);
    await fetch(`/api/leads/${leadId}/notes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note, type }) });
    setBusy(false); setNote(""); router.refresh();
  }
  return (
    <form className="crm-form" onSubmit={submit}>
      <textarea className="s-input" rows={2} placeholder="Add a note…" value={note} onChange={(e) => setNote(e.target.value)} />
      <div className="crm-form-row">
        <select value={type} onChange={(e) => setType(e.target.value)}>{NOTE_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        <button className="sales-btn solid" disabled={busy}>Add note</button>
      </div>
    </form>
  );
}
