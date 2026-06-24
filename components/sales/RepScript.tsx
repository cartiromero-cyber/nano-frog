'use client';
import { useState } from "react";
import { REP_SCRIPTS } from "@/content/rep-scripts";

export default function RepScript({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const lines = REP_SCRIPTS[title] || [];
  if (!lines.length) return null;
  return (
    <>
      <button className="rep-toggle no-print" onClick={() => setOpen((o) => !o)}>
        {open ? "Hide script" : "Rep script"}
      </button>
      <div className={"rep-drawer no-print" + (open ? " open" : "")} aria-hidden={!open}>
        <div className="rep-drawer-head">Rep script — {title}</div>
        <div className="rep-drawer-body">{lines.map((l, n) => <p key={n}>{l}</p>)}</div>
      </div>
    </>
  );
}
