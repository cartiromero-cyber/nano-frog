'use client';
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowserAuth } from "@/lib/supabase/browser";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/rep";
  const supabase = supabaseBrowserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) { setErr("Authentication is not configured yet. Add Supabase env vars (see docs/AUTH.md)."); return; }
    setBusy(true); setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setErr(error.message); setBusy(false); return; }
    try { await fetch("/api/auth/touch", { method: "POST" }); } catch {}
    router.push(next);
    router.refresh();
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={onSubmit}>
        <div className="login-brand"><img src="/assets/nanofrog-mark.png" width={34} height={34} alt="" /> Nano Frog</div>
        <h1>Field Sales Sign-in</h1>
        <p className="login-sub">For reps, managers, and admins.</p>
        {!supabase ? <div className="login-note">Auth not configured \u2014 the platform runs in demo mode. See docs/AUTH.md.</div> : null}
        <label>Email<input className="s-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Password<input className="s-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {err ? <div className="login-err">{err}</div> : null}
        <button className="sales-btn solid" type="submit" disabled={busy}>{busy ? "Signing in\u2026" : "Sign in"}</button>
        <p className="login-foot">Magic-link sign-in can be enabled later. Accounts are created in Supabase by an admin.</p>
      </form>
    </div>
  );
}
