"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LabelList } from "recharts";

const data = [
  { name: "Committed", value: 54 },
  { name: "Undecided", value: 28 },
  { name: "Opposition", value: 18 },
];

const COLORS = ["#16a34a", "#f97316", "#dc2626"];

export default function VoterIntentionPie(props: {
  committed: number;
  undecided: number;
  opposition: number;
}) {
  const { committed, undecided, opposition } = props;
  // use these values instead of hardcoded 54/28/18
}

