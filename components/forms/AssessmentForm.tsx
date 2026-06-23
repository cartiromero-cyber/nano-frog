'use client';
import { useState } from "react";
import { roofTypes, roofAgeRanges } from "@/content/formOptions";
import { trackFormSubmit } from "@/lib/analytics";

const field = "w-full border rounded-md px-3 py-2 text-[15px]";
const label = "block text-sm font-medium mb-1";

export default function AssessmentForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const f = new FormData(e.currentTarget);
    const payload = {
      name: f.get("name"), phone: f.get("phone"), email: f.get("email"), city: f.get("city"),
      roofAge: f.get("roofAge"), roofType: f.get("roofType"),
      insuranceConcern: f.get("insuranceConcern") === "Yes",
      visibleDamage: f.get("visibleDamage") === "Yes",
      message: f.get("message"), company: f.get("company"), // honeypot
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

  if (status === "ok") return <p className="text-[15px]">{msg}</p>;

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div><label className={label}>Name</label><input name="name" required className={field} /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className={label}>Phone</label><input name="phone" required className={field} /></div>
        <div><label className={label}>Email</label><input name="email" type="email" required className={field} /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className={label}>City</label><input name="city" className={field} /></div>
        <div><label className={label}>Roof age</label>
          <select name="roofAge" className={field}>{roofAgeRanges.map((o) => <option key={o}>{o}</option>)}</select></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className={label}>Roof type</label>
          <select name="roofType" className={field}>{roofTypes.map((o) => <option key={o}>{o}</option>)}</select></div>
        <div><label className={label}>Insurance concern?</label>
          <select name="insuranceConcern" className={field}><option>No</option><option>Yes</option></select></div>
      </div>
      <div><label className={label}>Visible damage?</label>
        <select name="visibleDamage" className={field}><option>No</option><option>Yes</option><option>Not sure</option></select></div>
      <div><label className={label}>Message (optional)</label><textarea name="message" rows={3} className={field} /></div>
      <div><label className={label}>Roof photo (optional)</label><input name="photo" type="file" accept="image/*" className={field} /></div>
      <button type="submit" className="btn btn-g" disabled={status === "sending"}>
        {status === "sending" ? "Sending\u2026" : "Request My Free Assessment"}
      </button>
      {status === "error" && <p className="text-sm" style={{ color: "#C0532E" }}>{msg}</p>}
    </form>
  );
}
