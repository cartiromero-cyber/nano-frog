'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function AssignSelect({ leadId, current, reps }: { leadId: string; current?: string | null; reps: { id: string; name?: string }[] }) {
  const router = useRouter(); const [busy, setBusy] = useState(false);
  async function change(v: string) {
    if (!v) return; setBusy(true);
    await fetch("/api/admin/leads/assign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId, newRepId: v }) });
    setBusy(false); router.refresh();
  }
  return (
    <select className="crm-assign" disabled={busy} defaultValue={current || ""} onChange={(e) => change(e.target.value)}>
      <option value="">{current ? "Reassign\u2026" : "Assign to\u2026"}</option>
      {reps.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
    </select>
  );
}
