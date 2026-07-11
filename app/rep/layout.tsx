import "@/styles/dashboard.css";
import { redirect } from "next/navigation";
import { getCurrentRep } from "@/lib/sales/auth";

export const metadata = { title: "Elytra Shield — Rep Dashboard", robots: { index: false } };

/** Any active staff role may use /rep; inactive or profile-less users are denied. */
export default async function RepLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getCurrentRep();
  if (!ctx) redirect("/login?next=/rep");
  return <>{children}</>;
}
