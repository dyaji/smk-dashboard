"use client";

import { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { issue: "Security", score: 82 },
  { issue: "Jobs & Economy", score: 74 },
  { issue: "Education", score: 63 },
  { issue: "Healthcare", score: 55 },
  { issue: "Infrastructure", score: 49 },
];

export default function TopIssuesBar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent Recharts from rendering during SSR/build
  if (!mounted) {
    return (
      <div className="h-64 w-full min-w-0 flex items-center justify-center text-sm text-slate-500">
        Loading chart...
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 16, left: 18, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}`} />
          <YAxis type="category" dataKey="issue" width={120} />
          <Tooltip />
          <Bar dataKey="score" fill="#0f3b32" radius={[6, 6, 6, 6]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
