import type { Metadata, Viewport } from "next";
import "@/styles/sales.css";

export const metadata: Metadata = {
  title: "Sales Presentation — PREVIEW ONLY",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0A1A2F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function SalesPreviewLayout({ children }: { children: React.ReactNode }) {
  return <div className="sales-root">{children}</div>;
}
