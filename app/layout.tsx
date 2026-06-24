import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { localBusinessSchema, websiteSchema } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nanofrogpro.com"),
  title: "Nano Frog \u2014 The Alternative to Roof Replacement",
  description:
    "Nanotechnology roof preservation designed to add years to qualifying roofs, help homeowners document roof condition, and avoid premature replacement. See if your roof qualifies.",
  openGraph: {
    title: "Nano Frog \u2014 The Alternative to Roof Replacement",
    description:
      "Nanotechnology roof preservation designed to add years to qualifying roofs and avoid premature replacement.",
    type: "website",
    url: "/",
  },
  robots: { index: true, follow: true },
  referrer: "no-referrer",
};

export const viewport: Viewport = {
  themeColor: "#0A1A2F",
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
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
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
