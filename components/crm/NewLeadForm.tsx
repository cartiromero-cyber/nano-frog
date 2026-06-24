'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewLeadForm() {
  const router = useRouter(); const [open, setOpen] = useState(false); const [busy, setBusy] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", email: "", city: "", address: "" });
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const res = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const d = await res.json(); setBusy(false);
    if (d.ok) { setOpen(false); setF({ name: "", phone: "", email: "", city: "", address: "" }); if (d.id && d.id !== "demo-new") router.push(`/rep/leads/${d.id}`); else router.refresh(); }
  }
  if (!open) return <button className="sales-btn solid" onClick={() => setOpen(true)}>+ New Lead</button>;
  return (
    <form className="crm-form crm-newlead" onSubmit={submit}>
      <div className="crm-form-row"><input className="s-input" placeholder="Name" value={f.name} onChange={(e) => set("name", e.target.value)} />
        <input className="s-input" placeholder="Phone" value={f.phone} onChange={(e) => set("phone", e.target.value)} /></div>
      <div className="crm-form-row"><input className="s-input" placeholder="Email" value={f.email} onChange={(e) => set("email", e.target.value)} />
        <input className="s-input" placeholder="City" value={f.city} onChange={(e) => set("city", e.target.value)} /></div>
      <input className="s-input" placeholder="Address" value={f.address} onChange={(e) => set("address", e.target.value)} />
      <div className="crm-form-row"><button className="sales-btn ghost" type="button" onClick={() => setOpen(false)}>Cancel</button>
        <button className="sales-btn solid" disabled={busy}>Create lead</button></div>
    </form>
  );
}
