'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function CompleteFollowUp({ id }: { id: string }) {
  const router = useRouter(); const [busy, setBusy] = useState(false);
  async function done() { setBusy(true); await fetch("/api/follow-ups", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); setBusy(false); router.refresh(); }
  return <button className="sales-btn ghost" disabled={busy} onClick={done}>Mark done</button>;
}
