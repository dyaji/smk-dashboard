"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { issue: "Security", score: 82 },
  { issue: "Jobs & Economy", score: 74 },
  { issue: "Education", score: 63 },
  { issue: "Healthcare", score: 55 },
  { issue: "Infrastructure", score: 49 },
];

export default function TopIssuesBar() {
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
