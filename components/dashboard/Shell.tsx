import type { RepContext } from "@/lib/sales/auth";

export default function Shell({ title, area, user, children }: { title: string; area: string; user?: RepContext; children: React.ReactNode }) {
  return (
    <div className="dash">
      <header className="dash-bar">
        <div className="dash-brand"><img src="/assets/elytra-shield-icon.png" width={26} height={26} alt="" /> Elytra Shield <span>{area}</span></div>
        {user ? (
          <div className="dash-user">
            <span>Logged in as <b>{user.name}</b> · {user.role} · {user.territory}</span>
            <a href="/logout">Sign out</a>
          </div>
        ) : null}
      </header>
      <main className="dash-main">
        <h1 className="dash-h">{title}</h1>
        {children}
      </main>
    </div>
  );
}
