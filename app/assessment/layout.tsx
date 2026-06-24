import "@/styles/sales.css";
export const metadata = { title: "Nano Frog \u2014 Roof Assessment", robots: { index: false } };
export default function L({ children }: { children: React.ReactNode }) { return <div className="sales-root"><div className="sales-slide" style={{ position: "static" }}>{children}</div></div>; }
