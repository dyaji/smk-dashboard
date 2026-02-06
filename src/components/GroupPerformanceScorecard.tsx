"use client";

import { useMemo, useState } from "react";
import { buildDemoGroupMetrics, GroupMetrics } from "@/lib/demoOps";

function badge(trend: GroupMetrics["trend"]) {
  if (trend === "Up") return "text-emerald-700 bg-emerald-50";
  if (trend === "Down") return "text-rose-700 bg-rose-50";
  return "text-slate-700 bg-slate-100";
}

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}

export default function GroupPerformanceScorecard() {
  const [mode, setMode] = useState<"weekly" | "monthly">("weekly");

  const rows = useMemo(() => buildDemoGroupMetrics(mode), [mode]);

  return (
    <div className="w-full min-w-0">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-600">
          Monitoring: Coverage + Conversion + Verification + Follow-up
        </div>

        <div className="flex gap-2">
          <button
            className={[
              "rounded-lg px-3 py-1 text-xs font-semibold border",
              mode === "weekly" ? "bg-[#0f3b34] text-white border-[#0f3b34]" : "bg-white",
            ].join(" ")}
            onClick={() => setMode("weekly")}
          >
            Weekly
          </button>
          <button
            className={[
              "rounded-lg px-3 py-1 text-xs font-semibold border",
              mode === "monthly" ? "bg-[#0f3b34] text-white border-[#0f3b34]" : "bg-white",
            ].join(" ")}
            onClick={() => setMode("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="text-left text-slate-600">
            <tr>
              <th className="py-2 pr-4">Support Group</th>
              <th className="py-2 pr-4">Members</th>
              <th className="py-2 pr-4">Coverage</th>
              <th className="py-2 pr-4">New Committed</th>
              <th className="py-2 pr-4">Undecided → Committed</th>
              <th className="py-2 pr-4">Verification</th>
              <th className="py-2 pr-4">Follow-up</th>
              <th className="py-2 pr-4">Score</th>
              <th className="py-2">Trend</th>
            </tr>
          </thead>
          <tbody>
            {rows
              .slice()
              .sort((a, b) => b.totalScore - a.totalScore)
              .map((r) => (
                <tr key={r.group} className="border-t">
                  <td className="py-3 pr-4 font-semibold">{r.group}</td>
                  <td className="py-3 pr-4">{formatNumber(r.activeMembers)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-40 rounded-full bg-slate-200">
                        <div className="h-2 rounded-full bg-emerald-700" style={{ width: `${r.coveragePct}%` }} />
                      </div>
                      <span className="w-10 text-right font-semibold">{r.coveragePct}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-semibold">{formatNumber(r.newCommitted)}</td>
                  <td className="py-3 pr-4 font-semibold">{formatNumber(r.undecidedConverted)}</td>
                  <td className="py-3 pr-4 font-semibold">{r.verificationPct}%</td>
                  <td className="py-3 pr-4 font-semibold">{r.followupPct}%</td>
                  <td className="py-3 pr-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-800">
                      {r.totalScore}/100
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={["rounded-full px-3 py-1 text-xs font-semibold", badge(r.trend)].join(" ")}>
                      {r.trend}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="mt-3 text-xs text-slate-500">
          Demo scoring. Later: replace with Google Sheets weekly/monthly logs + verification sampling.
        </div>
      </div>
    </div>
  );
}
