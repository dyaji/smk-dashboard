"use client";

import { useEffect, useMemo, useState } from "react";

type ForecastRow = {
  lga: string;
  expectedVotes: number;
  confidence: "High" | "Medium" | "Low";
};

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}

export default function ForecastPanel() {
  const [rows, setRows] = useState<ForecastRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/metrics/forecast", { cache: "no-store" });
        if (!res.ok) throw new Error(`Forecast API error: ${res.status}`);
        const data = (await res.json()) as ForecastRow[];
        if (!cancelled) setRows(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load forecast");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const total = useMemo(() => rows.reduce((acc, r) => acc + r.expectedVotes, 0), [rows]);

  const confidenceSummary = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0 };
    rows.forEach((r) => counts[r.confidence]++);
    return counts;
  }, [rows]);

  const badge = (c: ForecastRow["confidence"]) => {
    if (c === "High") return "bg-emerald-50 text-emerald-700";
    if (c === "Low") return "bg-rose-50 text-rose-700";
    return "bg-amber-50 text-amber-700";
  };

  return (
    <div className="w-full min-w-0">
      {loading ? <div className="text-sm text-slate-500">Loading forecast...</div> : null}
      {error ? <div className="text-sm text-rose-600">{error}</div> : null}

      {!loading && !error ? (
        <div className="rounded-xl border bg-slate-50 p-4">
          <div className="text-xs font-semibold text-slate-600">Projected Votes</div>
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
                    <div className="text-xs text-slate-500">
                      Expected: {formatNumber(r.expectedVotes)}
                    </div>
                  </div>
                  <span className={["rounded-full px-3 py-1 text-xs font-semibold", badge(r.confidence)].join(" ")}>
                    {r.confidence}
                  </span>
                </div>
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}