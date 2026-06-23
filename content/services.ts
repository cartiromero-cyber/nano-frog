export interface Service { name: string; slug: string; description: string; }

export const services: Service[] = [
  { name: "Roof Preservation", slug: "roof-preservation",
    description: "Nanotechnology treatment designed to extend the life of eligible asphalt-shingle roofs." },
  { name: "Roof Health Score", slug: "roof-health-score",
    description: "An on-site evaluation that scores a roof\u2019s condition and preservation candidacy." },
  { name: "Roof & Insurance Documentation", slug: "roof-insurance",
    description: "Inspection and documentation that help homeowners prepare for insurer conversations." },
];

// Existing authority pages under /public/roof-insurance (served statically for now).
export const insurancePages = [
  { slug: "insurance-wants-me-to-replace-my-roof" },
  { slug: "roof-too-old-for-insurance" },
  { slug: "roof-age-and-insurance" },
  { slug: "acv-vs-rcv" },
  { slug: "remaining-useful-life-inspection" },
  { slug: "insurance-roof-inspection" },
  { slug: "questions-to-ask-your-insurer" },
];
