import { redirect } from "next/navigation";
import Shell from "@/components/dashboard/Shell";
import RepForm from "@/components/crm/RepForm";
import { getCurrentRep } from "@/lib/sales/auth";
import { listReps } from "@/lib/sales/org";

export const dynamic = "force-dynamic";

export default async function NewRepPage() {
  const ctx = await getCurrentRep();
  if (!ctx) redirect("/login");
  if (ctx.role !== "ADMIN") redirect("/admin/reps");
  const all = await listReps(ctx, {});
  const managers = all.filter((r) => r.role === "MANAGER" || r.role === "ADMIN").map((r) => ({ id: r.id, name: r.name }));
  return (
    <Shell title="New Rep" area="Management" user={ctx}>
      <p className="dash-note"><a href="/admin/reps">← Back to reps</a></p>
      <section className="dash-card" style={{ maxWidth: 640 }}>
        <RepForm mode="new" managers={managers} canSetAdmin={true} />
        <p className="dash-note" style={{ marginTop: 14 }}>Leaving “Create login” checked makes a Supabase Auth user and returns a one-time temporary password. Unchecked creates a profile only (link a login later). See docs/AUTH.md.</p>
      </section>
    </Shell>
  );
}
