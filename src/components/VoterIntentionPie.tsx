"use client";

import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

type Props = {
  committed: number;
  undecided: number;
  opposition: number;
};

export default function VoterIntentionPie({ committed, undecided, opposition }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = useMemo(
    () => [
      { name: "Committed", value: committed },
      { name: "Undecided", value: undecided },
      { name: "Opposition", value: opposition },
    ],
    [committed, undecided, opposition]
  );

  const colors = ["#16a34a", "#f59e0b", "#ef4444"]; // green, orange, red

  // Prevent Recharts from rendering during SSR/build (removes width/height -1 warnings)
  if (!mounted) {
    return (
      <div className="h-full w-full min-w-0 flex items-center justify-center text-sm text-slate-500">
        Loading chart...
      </div>
    );
  }

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
