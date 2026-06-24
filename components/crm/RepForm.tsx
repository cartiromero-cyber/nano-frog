'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function RepForm({ mode, rep, managers, canSetAdmin }: { mode: "new" | "edit"; rep?: any; managers: { id: string; name?: string }[]; canSetAdmin: boolean }) {
  const router = useRouter();
  const [f, setF] = useState({
    name: rep?.name || "", email: rep?.email || "", phone: rep?.phone || "", role: rep?.role || "REP",
    territory: rep?.territory || "", manager_id: rep?.manager_id || "", active: rep?.active !== false, invite: mode === "new",
  });
  const set = (k: string, v: any) => setF((s) => ({ ...s, [k]: v }));
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState(""); const [temp, setTemp] = useState("");
  const roles = canSetAdmin ? ["REP", "MANAGER", "ADMIN"] : ["REP", "MANAGER"];

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(""); setTemp("");
    const body = { ...f, manager_id: f.manager_id || null };
    const url = mode === "new" ? (f.invite ? "/api/admin/reps/invite" : "/api/admin/reps") : `/api/admin/reps/${rep.id}`;
    const method = mode === "new" ? "POST" : "PATCH";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await res.json(); setBusy(false);
    if (!d.ok) { setMsg(d.error || "Failed"); return; }
    if (d.tempPassword) { setTemp(d.tempPassword); setMsg("Rep created. Share the temporary password below (shown once)."); }
    else { setMsg("Saved."); if (mode === "new" && d.id) router.push(`/admin/reps/${d.id}`); else router.refresh(); }
  }

  return (
    <form className="rep-form" onSubmit={submit}>
      <div className="crm-form-row"><label>Name<input className="s-input" value={f.name} onChange={(e) => set("name", e.target.value)} required /></label>
        <label>Email<input className="s-input" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} required disabled={mode === "edit"} /></label></div>
      <div className="crm-form-row"><label>Phone<input className="s-input" value={f.phone} onChange={(e) => set("phone", e.target.value)} /></label>
        <label>Territory<input className="s-input" value={f.territory} onChange={(e) => set("territory", e.target.value)} /></label></div>
      <div className="crm-form-row">
        <label>Role<select value={f.role} onChange={(e) => set("role", e.target.value)}>{roles.map((r) => <option key={r}>{r}</option>)}</select></label>
        <label>Manager<select value={f.manager_id} onChange={(e) => set("manager_id", e.target.value)}><option value="">None</option>{managers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></label>
      </div>
      <label className="bulk-check"><input type="checkbox" checked={f.active} onChange={(e) => set("active", e.target.checked)} /> Active</label>
      {mode === "new" ? <label className="bulk-check"><input type="checkbox" checked={f.invite} onChange={(e) => set("invite", e.target.checked)} /> Create login (Supabase Auth user)</label> : null}
      <div className="crm-form-row"><button className="sales-btn solid" disabled={busy}>{busy ? "Saving\u2026" : mode === "new" ? "Create rep" : "Save changes"}</button></div>
      {msg ? <p className="rep-msg">{msg}</p> : null}
      {temp ? <p className="rep-temp">Temporary password: <code>{temp}</code> \u2014 the rep signs in at <a href="/login">/login</a> and should change it.</p> : null}
    </form>
  );
}
