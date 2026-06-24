'use client';
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LEAD_STATUSES, LEAD_SOURCES, LEAD_SORTS } from "@/lib/sales/crm-constants";

export default function FilterBar() {
  const router = useRouter(); const pathname = usePathname(); const sp = useSearchParams();
  function set(key: string, value: string) {
    const p = new URLSearchParams(sp.toString());
    if (value) p.set(key, value); else p.delete(key);
    router.push(pathname + "?" + p.toString());
  }
  return (
    <div className="crm-filters">
      <input className="crm-search" placeholder="Search name, phone, email, address, city…"
        defaultValue={sp.get("q") || ""} onKeyDown={(e) => { if (e.key === "Enter") set("q", (e.target as HTMLInputElement).value); }} />
      <select defaultValue={sp.get("status") || ""} onChange={(e) => set("status", e.target.value)}>
        <option value="">All statuses</option>{LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <select defaultValue={sp.get("source") || ""} onChange={(e) => set("source", e.target.value)}>
        <option value="">All sources</option>{LEAD_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <input className="crm-city" placeholder="City" defaultValue={sp.get("city") || ""}
        onKeyDown={(e) => { if (e.key === "Enter") set("city", (e.target as HTMLInputElement).value); }} />
      <select defaultValue={sp.get("sort") || "newest"} onChange={(e) => set("sort", e.target.value)}>
        {LEAD_SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
      </select>
    </div>
  );
}
