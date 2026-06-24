'use client';
export default function PrintButton({ label = "Print / Save PDF" }: { label?: string }) {
  return <button className="sales-btn solid no-print" onClick={() => window.print()}>{label}</button>;
}
