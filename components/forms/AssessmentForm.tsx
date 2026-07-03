'use client';
import { useState } from "react";
import { trackFormSubmit } from "@/lib/analytics";

const field = "w-full border rounded-md px-3 py-2 text-[15px]";
const label = "block text-sm font-medium mb-1";

// Change 002 (approved with modifications): Required — Name, Phone, Property Address.
// Optional — Email. All other fields removed; details are gathered at the assessment itself.
export default function AssessmentForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const f = new FormData(e.currentTarget);
    const payload = {
      name: f.get("name"),
      phone: f.get("phone"),
      address: f.get("address"),
      email: f.get("email"),
      company: f.get("company"), // honeypot
    };
    try {
      const res = await fetch("/api/leads/assessment", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) { setStatus("ok"); setMsg(data.message); trackFormSubmit("assessment"); }
      else { setStatus("error"); setMsg(data.error || "Please check the form and try again."); }
    } catch { setStatus("error"); setMsg("Network error. Please try again."); }
  }

  // Change 014 (approved, simple): clear on-screen booking confirmation with next steps.
  if (status === "ok") return (
    <div className="grid gap-2">
      <h3 style={{ fontFamily: "var(--disp)", color: "var(--ink)" }}>Request received — you&rsquo;re on the schedule.</h3>
      <p className="text-[15px]" style={{ color: "var(--muted)" }}>{msg}</p>
      <p className="text-[15px]" style={{ color: "var(--muted)" }}>
        What happens next: we&rsquo;ll call or text within one business day to confirm your assessment window.
        The visit takes about 30 minutes, and the documented Roof Health Report&trade; is yours to keep —
        whatever it says.
      </p>
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div><label className={label}>Name</label><input name="name" required autoComplete="name" className={field} /></div>
      <div><label className={label}>Phone</label><input name="phone" required type="tel" autoComplete="tel" className={field} /></div>
      <div><label className={label}>Property address</label><input name="address" required autoComplete="street-address" placeholder="Street, city" className={field} /></div>
      <div><label className={label}>Email <span className="font-normal" style={{ color: "var(--muted)" }}>(optional)</span></label>
        <input name="email" type="email" autoComplete="email" className={field} /></div>
      <button type="submit" className="btn btn-g" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Book My Free Assessment"}
      </button>
      <p className="text-sm" style={{ color: "var(--muted)", margin: 0 }}>Free · No obligation · No subscription · You keep the report</p>
      {status === "error" && <p className="text-sm" style={{ color: "#C0532E" }}>{msg}</p>}
    </form>
  );
}
