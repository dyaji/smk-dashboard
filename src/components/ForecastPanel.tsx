"use client";

import { useMemo } from "react";
import { buildDemoForecast } from "@/lib/demoOps";
import { kadunaSouthWardsByLga } from "@/data/kadunaSouthWards";

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}

export default function ForecastPanel() {
  const lgas = useMemo(() => Object.keys(kadunaSouthWardsByLga), []);

  const rows = useMemo(() => buildDemoForecast(lgas), [lgas]);

  const total = useMemo(
    () => rows.reduce((acc, r) => acc + r.expectedVotes, 0),
    [rows]
  );

  const confidenceSummary = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0 } as Record<"High" | "Medium" | "Low", number>;
    rows.forEach((r) => counts[r.confidence]++);
    return counts;
  }, [rows]);

  const badge = (c: "High" | "Medium" | "Low") => {
    if (c === "High") return "text-emerald-700 bg-emerald-50";
    if (c === "Low") return "text-rose-700 bg-rose-50";
    return "text-amber-700 bg-amber-50";
  };

  return (
    <div className="w-full min-w-0">
      <div className="rounded-xl bg-slate-50 p-4 border">
        <div className="text-xs font-semibold text-slate-600">Projected Votes (Demo)</div>
        <div className="mt-1 text-3xl font-extrabold text-slate-900">{formatNumber(total)}</div>

        <div className="mt-2 text-xs text-slate-600">
          Confidence mix:{" "}
          <span className="font-semibold text-emerald-700">{confidenceSummary.High} High</span>,{" "}
          <span className="font-semibold text-amber-700">{confidenceSummary.Medium} Medium</span>,{" "}
          <span className="font-semibold text-rose-700">{confidenceSummary.Low} Low</span>
        </div>

        <div className="mt-4 space-y-2">
          {rows
            .slice()
            .sort((a, b) => b.expectedVotes - a.expectedVotes)
            .map((r) => (
              <div key={r.lga} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-800">{r.lga}</div>
                  <div className="text-xs text-slate-500">Expected: {formatNumber(r.expectedVotes)}</div>
                </div>
                <span className={["rounded-full px-3 py-1 text-xs font-semibold", badge(r.confidence)].join(" ")}>
                  {r.confidence}
                </span>
              </div>
            ))}
        </div>

        <div className="mt-3 text-xs text-slate-500">
          Demo model. Later: expected votes = committed*turnout + undecided*conversion*turnout, weighted by coverage + verification.
        </div>
      </div>
    </div>
  );
}
