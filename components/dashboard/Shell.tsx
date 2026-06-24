import type { RepContext } from "@/lib/sales/auth";

export default function Shell({ title, area, user, children }: { title: string; area: string; user?: RepContext; children: React.ReactNode }) {
  return (
    <div className="dash">
      <header className="dash-bar">
        <div className="dash-brand"><img src="/assets/nanofrog-mark.png" width={26} height={26} alt="" /> Nano Frog <span>{area}</span></div>
        {user ? (
          <div className="dash-user">
            <span>Logged in as <b>{user.name}</b> \u00b7 {user.role} \u00b7 {user.territory}</span>
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
