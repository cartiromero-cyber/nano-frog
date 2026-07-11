import type { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";
import { getCurrentRep } from "@/lib/sales/auth";
import "@/styles/sales.css";

export const metadata: Metadata = {
  title: "Elytra Shield — Roof Assessment",
  robots: { index: false, follow: false }, // presentation tool, not public SEO
  manifest: "/sales.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0A1A2F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

/** Active staff only: middleware handles authentication; this layout additionally
 *  denies deactivated accounts and auth users without an approved rep profile. */
export default async function SalesLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getCurrentRep();
  if (!ctx) redirect("/login?next=/sales");
  return <div className="sales-root">{children}</div>;
}
