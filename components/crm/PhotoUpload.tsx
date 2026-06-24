'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function PhotoUpload({ leadId }: { leadId: string }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState("");
  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setBusy(true); setMsg("");
    const fd = new FormData(); fd.append("photo", file); fd.append("target", "lead"); fd.append("targetId", leadId);
    const res = await fetch("/api/upload", { method: "POST", body: fd }); const d = await res.json();
    setBusy(false); setMsg(d.ok ? (d.stored ? "Uploaded." : "Received (storage not configured).") : (d.error || "Failed"));
    router.refresh();
  }
  return <label className="crm-upload">{busy ? "Uploading\u2026" : "+ Upload photo"}<input type="file" accept="image/*" hidden onChange={onChange} />{msg ? <em>{msg}</em> : null}</label>;
}
