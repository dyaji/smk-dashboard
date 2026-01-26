"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function VoterIntentionPie(props: {
  committed: number;
  undecided: number;
  opposition: number;
}) {
  const { committed, undecided, opposition } = props;

  const data = [
    { name: "Committed", value: committed },
    { name: "Undecided", value: undecided },
    { name: "Opposition", value: opposition },
  ];

  const colors = ["#16a34a", "#f59e0b", "#ef4444"]; // green, orange, red

  return (
    <div className="h-full w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={2}
            isAnimationActive={false}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: any) => [`${v}%`, ""]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
