"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

type ApiPoint = { date: string; support: number; undecided: number };

function formatDayLabel(isoDate: string) {
  // isoDate like "2026-01-25"
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export default function SupportTrendChart() {
  const [rows, setRows] = useState<ApiPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/metrics/daily", { cache: "no-store" });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = (await res.json()) as ApiPoint[];
        if (!cancelled) setRows(json);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const data = useMemo(() => {
    return rows.map((r) => ({
      ...r,
      label: formatDayLabel(r.date),
    }));
  }, [rows]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-slate-500">
        Loading chart...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-2 text-sm">
        <div className="text-red-600 font-semibold">Chart failed to load</div>
        <div className="text-slate-600">{error}</div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-slate-500">
        No data yet
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend />
          <Line name="Support" type="monotone" dataKey="support" stroke="#16a34a" strokeWidth={3} dot={false} />
          <Line name="Undecided" type="monotone" dataKey="undecided" stroke="#f97316" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
