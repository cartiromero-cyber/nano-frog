'use client';
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowserAuth } from "@/lib/supabase/browser";

/** Only same-site paths may be redirect targets — "next=https://evil.example" and
 *  protocol-relative "//evil.example" are rejected in favor of the default. */
function safeNext(raw: string | null): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("://")) return raw;
  return "/sales";
}

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const supabase = supabaseBrowserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) { setErr("Sign-in is unavailable until authentication is configured (see docs/AUTH.md)."); return; }
    setBusy(true); setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErr(/invalid/i.test(error.message) ? "Invalid email or password." : error.message);
      setBusy(false);
      return;
    }
    try { await fetch("/api/auth/touch", { method: "POST" }); } catch {}
    router.push(next);
    router.refresh();
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={onSubmit}>
        <div className="login-brand"><img src="/assets/elytra-shield-icon.png" width={34} height={34} alt="" /> Elytra Shield</div>
        <h1>Staff Sign-in</h1>
        <p className="login-sub">Sales presentation, rep dashboard, and admin.</p>
        {!supabase ? <div className="login-note">Sign-in is unavailable until authentication is configured.</div> : null}
        <label>Email<input className="s-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
        <label>Password<input className="s-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></label>
        {err ? <div className="login-err">{err}</div> : null}
        <button className="sales-btn solid" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        <p className="login-foot">Accounts are created by an Elytra Shield admin.</p>
      </form>
    </div>
  );
}
