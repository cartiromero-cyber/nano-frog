import "@/styles/dashboard.css";
import { redirect } from "next/navigation";
import { getCurrentRep } from "@/lib/sales/auth";

export const metadata = { title: "Elytra Shield — Admin", robots: { index: false } };

/** Role gate: /admin is ADMIN + MANAGER territory. Reps are sent to their own
 *  dashboard; unauthenticated/inactive users (ctx null) go to /login. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getCurrentRep();
  if (!ctx) redirect("/login?next=/admin");
  if (ctx.role === "REP") redirect("/rep");
  return <>{children}</>;
}
