"use client";

import { useEffect, useMemo, useState } from "react";

type Trend = "Up" | "Down" | "Flat";

type GroupMetrics = {
  group: string;
  activeMembers: number;
  coveragePct: number;
  newCommitted: number;
  undecidedConverted: number;
  verificationPct: number;
  followupPct: number;
  totalScore: number;
  trend: Trend;
};

function badge(trend: Trend) {
  if (trend === "Up") return "text-emerald-700 bg-emerald-50";
  if (trend === "Down") return "text-rose-700 bg-rose-50";
  return "text-slate-700 bg-slate-100";
}

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}

export default function GroupPerformanceScorecard() {
  const [mode, setMode] = useState<"weekly" | "monthly">("weekly");
  const [rows, setRows] = useState<GroupMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/metrics/groups?mode=${mode}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Groups API error: ${res.status}`);
        const data = (await res.json()) as GroupMetrics[];
        if (!cancelled) setRows(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load groups");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [mode]);

  const sortedRows = useMemo(
    () => rows.slice().sort((a, b) => b.totalScore - a.totalScore),
    [rows]
  );

  return (
    <div className="w-full min-w-0">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-600">
          Monitoring: Coverage + Conversion + Verification + Follow-up
        </div>

        <div className="flex gap-2">
          <button
            className={[
              "rounded-lg border px-3 py-1 text-xs font-semibold",
              mode === "weekly" ? "border-[#0f3b34] bg-[#0f3b34] text-white" : "bg-white",
            ].join(" ")}
            onClick={() => setMode("weekly")}
            type="button"
          >
            Weekly
          </button>
          <button
            className={[
              "rounded-lg border px-3 py-1 text-xs font-semibold",
              mode === "monthly" ? "border-[#0f3b34] bg-[#0f3b34] text-white" : "bg-white",
            ].join(" ")}
            onClick={() => setMode("monthly")}
            type="button"
          >
            Monthly
          </button>
        </div>
      </div>

      {loading ? <div className="mt-4 text-sm text-slate-500">Loading group metrics...</div> : null}
      {error ? <div className="mt-4 text-sm text-rose-600">{error}</div> : null}

      {!loading && !error ? (
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
              {sortedRows.map((r) => (
                <tr key={r.group} className="border-t">
                  <td className="py-3 pr-4 font-semibold">{r.group}</td>
                  <td className="py-3 pr-4">{formatNumber(r.activeMembers)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-40 rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-emerald-700"
                          style={{ width: `${r.coveragePct}%` }}
                        />
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
        </div>
      ) : null}
    </div>
  );
}