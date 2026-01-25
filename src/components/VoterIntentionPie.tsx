"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LabelList } from "recharts";

const data = [
  { name: "Committed", value: 54 },
  { name: "Undecided", value: 28 },
  { name: "Opposition", value: 18 },
];

const COLORS = ["#16a34a", "#f97316", "#dc2626"];

export default function VoterIntentionPie() {
  return (
    <div className="w-full min-w-0 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend
            formatter={(value, entry: any) => `${value} ${entry?.payload?.value ?? ""}%`}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
            <LabelList dataKey="value" formatter={(v: any) => `${v}%`} position="outside" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
