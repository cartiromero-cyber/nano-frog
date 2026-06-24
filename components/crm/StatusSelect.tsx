'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LEAD_STATUSES, statusColor } from "@/lib/sales/crm-constants";

export default function StatusSelect({ leadId, status }: { leadId: string; status?: string }) {
  const router = useRouter(); const [busy, setBusy] = useState(false);
  async function change(v: string) {
    setBusy(true);
    await fetch(`/api/leads/${leadId}/status`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: v }) });
    setBusy(false); router.refresh();
  }
  return (
    <select className="crm-status" style={{ borderColor: statusColor(status || "New") }} disabled={busy}
      defaultValue={status || "New"} onChange={(e) => change(e.target.value)}>
      {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
