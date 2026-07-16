import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { localBusinessSchema, websiteSchema } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://elytrashield.us"),
  alternates: { canonical: "./" }, // per-path self-canonical (resolves against metadataBase)
  twitter: { card: "summary_large_image" },
  title: "Elytra Shield — Protect What Protects Your Home",
  description:
    "Advanced roof preservation designed to extend the life of aging roofing systems, help homeowners document roof condition, and avoid premature replacement. Schedule a free Roof Health Assessment.",
  openGraph: {
    title: "Elytra Shield — Protect What Protects Your Home",
    description:
      "Advanced roof preservation designed to extend roof life and help homeowners avoid premature replacement.",
    type: "website",
    url: "/",
  },
  robots: { index: true, follow: true },
  referrer: "no-referrer",
};

export const viewport: Viewport = {
  themeColor: "#0B1320",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
