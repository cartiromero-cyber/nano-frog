import Shell from "@/components/dashboard/Shell";
export default function ReportsPage() {
  return (
    <Shell title="Reports" area="Operations">
      <section className="dash-card">
        <h3>Roof Health Reports</h3>
        <p className="dash-empty">
          Reports are generated at the end of a <a href="/sales">/sales</a> presentation (Step 9) and can be
          printed or saved to PDF on the spot. Once a store is connected, every generated report will be listed
          here for retrieval and follow-up.
        </p>
      </section>
      <p className="dash-note">Foundation view. Report objects are built by <code>lib/sales/report.ts</code>.</p>
    </Shell>
  );
}
