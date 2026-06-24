'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function BulkAssignBar({ reps }: { reps: { id: string; name?: string }[] }) {
  const router = useRouter();
  const [city, setCity] = useState(""); const [rep, setRep] = useState(""); const [onlyU, setOnlyU] = useState(true);
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState("");
  async function go() {
    if (!rep) { setMsg("Pick a rep."); return; }
    setBusy(true); setMsg("");
    const res = await fetch("/api/admin/leads/bulk-assign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ city, onlyUnassigned: onlyU, newRepId: rep }) });
    const d = await res.json(); setBusy(false);
    setMsg(d.ok ? `Assigned ${d.count} lead${d.count === 1 ? "" : "s"}.` : (d.error || "Failed"));
    router.refresh();
  }
  return (
    <div className="bulk-bar">
      <strong>Bulk assign</strong>
      <input className="s-input" placeholder="City (optional)" value={city} onChange={(e) => setCity(e.target.value)} />
      <label className="bulk-check"><input type="checkbox" checked={onlyU} onChange={(e) => setOnlyU(e.target.checked)} /> Unassigned only</label>
      <select value={rep} onChange={(e) => setRep(e.target.value)}><option value="">To rep\u2026</option>{reps.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
      <button className="sales-btn solid" disabled={busy} onClick={go}>{busy ? "Working\u2026" : "Assign"}</button>
      {msg ? <em>{msg}</em> : null}
    </div>
  );
}
