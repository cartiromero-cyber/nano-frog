import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://nanofrogpro.com";

// NOTE: business name/phone/address are placeholders pending client verification.
// See CLIENT-HANDOFF.md.
export const BUSINESS = {
  name: "Nano Frog",
  legalName: "Nano Frog Roof Preservation",
  url: SITE,
  telephone: "+1-000-000-0000",
  areaServed: "Georgia",
  description:
    "Nanotechnology roof preservation \u2014 the alternative to premature roof replacement for eligible roofs in Georgia.",
};

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: BUSINESS.url,
    telephone: BUSINESS.telephone,
    areaServed: { "@type": "State", name: BUSINESS.areaServed },
    description: BUSINESS.description,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BUSINESS.name,
    url: BUSINESS.url,
  };
}

export function serviceSchema(name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    provider: { "@type": "RoofingContractor", name: BUSINESS.name, url: BUSINESS.url },
    areaServed: { "@type": "State", name: BUSINESS.areaServed },
    description,
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function articleSchema(title: string, description: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${SITE}/learning-center/${slug}/`,
    publisher: { "@type": "Organization", name: BUSINESS.name },
  };
}

export function buildMetadata(opts: { title: string; description: string; path?: string }): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path || "/" },
    openGraph: { title: opts.title, description: opts.description, url: opts.path || "/", type: "website" },
  };
}
