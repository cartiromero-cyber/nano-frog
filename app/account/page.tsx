import { redirect } from "next/navigation";
import Shell from "@/components/dashboard/Shell";
import { getCurrentRep } from "@/lib/sales/auth";

export const dynamic = "force-dynamic";
export default async function AccountPage() {
  const ctx = await getCurrentRep();
  if (!ctx) redirect("/login");
  return (
    <Shell title="Account" area="Profile" user={ctx}>
      <section className="dash-card">
        <h3>Your profile</h3>
        <div className="stat-grid">
          <div className="stat"><div className="stat-label">Name</div><div className="stat-value" style={{ fontSize: "1.2rem" }}>{ctx.name}</div></div>
          <div className="stat"><div className="stat-label">Role</div><div className="stat-value" style={{ fontSize: "1.2rem" }}>{ctx.role}</div></div>
          <div className="stat"><div className="stat-label">Territory</div><div className="stat-value" style={{ fontSize: "1.2rem" }}>{ctx.territory}</div></div>
        </div>
        <p className="dash-note" style={{ marginTop: 16 }}><a href="/logout">Sign out</a>{ctx.demo ? " · demo mode (Supabase not configured)" : ""}</p>
      </section>
    </Shell>
  );
}
