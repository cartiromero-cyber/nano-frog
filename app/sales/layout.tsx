import type { Metadata, Viewport } from "next";
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

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return <div className="sales-root">{children}</div>;
}
