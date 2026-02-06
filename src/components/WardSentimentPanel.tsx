"use client";

import React, { useMemo, useState } from "react";
import { ALL_WARDS, KADUNA_SOUTH_LGAS, type WardRecord } from "@/data/kadunaSouthWards";

type WardSentiment = {
  positive: number; // 0-100
  neutral: number;  // 0-100
  negative: number; // 0-100
  netScore: number; // -100..100
  volume: number;   // mentions/responses
  notes: string;
  topThemes: string[];
};

function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Demo-only: deterministic numbers per ward id (so it won’t “jump” on refresh)
function getDemoWardSentiment(wardId: string): WardSentiment {
  const r = mulberry32(hashString(wardId));

  // Bias slightly toward positive/neutral in demo (edit as you like)
  let positive = Math.round(42 + r() * 28); // 42..70
  let neutral = Math.round(14 + r() * 22);  // 14..36
  let negative = 100 - positive - neutral;

  // enforce floor so no category disappears
  if (negative < 6) {
    negative = 6;
    neutral = 100 - positive - negative;
  }
  if (neutral < 8) {
    neutral = 8;
    negative = 100 - positive - neutral;
  }

  const volume = Math.round(60 + r() * 320); // 60..380
  const netScore = positive - negative;      // -100..100

  const themePool = ["Security", "Roads", "Jobs", "Healthcare", "Education", "Water", "Agriculture", "Cost of Living"];
  const themes = [...themePool]
    .sort(() => r() - 0.5)
    .slice(0, 3);

  const notes =
    netScore >= 25
      ? "Strong advantage: maintain presence and protect gains."
      : netScore >= 5
      ? "Slightly positive: increase engagement to convert neutrals."
      : netScore >= -5
      ? "Tight zone: messaging + ground game decides outcome."
      : "Weak zone: needs targeted intervention and trusted validators.";

  return { positive, neutral, negative, netScore, volume, notes, topThemes: themes };
}

function pctBar({ positive, neutral, negative }: Pick<WardSentiment, "positive" | "neutral" | "negative">) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
      <div className="flex h-full w-full">
        <div className="h-full bg-emerald-500" style={{ width: `${positive}%` }} />
        <div className="h-full bg-orange-400" style={{ width: `${neutral}%` }} />
        <div className="h-full bg-rose-500" style={{ width: `${negative}%` }} />
      </div>
    </div>
  );
}

export default function WardSentimentPanel() {
  const [selectedLga, setSelectedLga] = useState<string>("All");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string>(ALL_WARDS[0]?.id ?? "");

  const filtered: WardRecord[] = useMemo(() => {
    const query = q.trim().toLowerCase();
    return ALL_WARDS.filter((w) => {
      const lgaOk = selectedLga === "All" ? true : w.lga === selectedLga;
      if (!lgaOk) return false;
      if (!query) return true;
      return `${w.lga} ${w.ward}`.toLowerCase().includes(query);
    });
  }, [selectedLga, q]);

  const selectedWard = useMemo(
    () => ALL_WARDS.find((w) => w.id === selectedId) ?? filtered[0] ?? ALL_WARDS[0],
    [selectedId, filtered]
  );

  const sentiment = useMemo(() => getDemoWardSentiment(selectedWard?.id ?? "none"), [selectedWard]);

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      {/* Controls */}
      <div className="lg:col-span-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-slate-900">Ward Sentiment</div>
          <div className="text-xs text-slate-500">(Kaduna South • 87 Wards)</div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            className="h-10 rounded-xl border bg-white px-3 text-sm"
            value={selectedLga}
            onChange={(e) => {
              setSelectedLga(e.target.value);
              // keep selection sane if the selected ward falls out of filter
              setTimeout(() => {
                const first = ALL_WARDS.find((w) => (e.target.value === "All" ? true : w.lga === e.target.value));
                if (first) setSelectedId(first.id);
              }, 0);
            }}
          >
            <option value="All">All LGAs</option>
            {KADUNA_SOUTH_LGAS.map((lga) => (
              <option key={lga} value={lga}>
                {lga}
              </option>
            ))}
          </select>

          <input
            className="h-10 w-full sm:w-72 rounded-xl border bg-white px-3 text-sm outline-none"
            placeholder="Search ward or LGA..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {/* Ward list */}
      <div className="lg:col-span-4 rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-4 py-3">
          <div className="text-xs text-slate-500">Click a ward</div>
          <div className="text-sm font-semibold text-slate-900">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="max-h-[520px] overflow-auto p-2">
          {filtered.map((w) => {
            const active = w.id === selectedWard?.id;
            return (
              <button
                key={w.id}
                onClick={() => setSelectedId(w.id)}
                className={[
                  "w-full rounded-xl px-3 py-2 text-left transition",
                  active ? "bg-slate-900 text-white" : "hover:bg-slate-50 text-slate-900",
                ].join(" ")}
              >
                <div className="text-sm font-semibold">{w.ward}</div>
                <div className={active ? "text-xs text-slate-200" : "text-xs text-slate-500"}>{w.lga}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ward detail */}
      <div className="lg:col-span-8 rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <div className="text-xs text-slate-500">Selected ward</div>
          <div className="text-lg font-semibold text-slate-900">
            {selectedWard?.ward} <span className="text-slate-400">•</span> {selectedWard?.lga}
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* KPIs */}
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border p-4">
              <div className="text-xs text-slate-500">Positive</div>
              <div className="text-2xl font-semibold text-emerald-600">{sentiment.positive}%</div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="text-xs text-slate-500">Neutral</div>
              <div className="text-2xl font-semibold text-orange-500">{sentiment.neutral}%</div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="text-xs text-slate-500">Negative</div>
              <div className="text-2xl font-semibold text-rose-600">{sentiment.negative}%</div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="text-xs text-slate-500">Net Score</div>
              <div className="text-2xl font-semibold text-slate-900">
                {sentiment.netScore > 0 ? "+" : ""}
                {sentiment.netScore}
              </div>
              <div className="text-xs text-slate-500">Volume: {sentiment.volume}</div>
            </div>
          </div>

          {/* Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Sentiment split</span>
              <span>Demo scoring (replace with Sheets later)</span>
            </div>
            {pctBar(sentiment)}
            <div className="flex gap-4 text-xs text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Positive
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-400" /> Neutral
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Negative
              </span>
            </div>
          </div>

          {/* Insight + themes */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border p-4">
              <div className="text-xs text-slate-500">Field read</div>
              <div className="text-sm font-semibold text-slate-900">{sentiment.notes}</div>
              <div className="mt-2 text-xs text-slate-500">
                If you disagree with the score, your input data is the issue—not the UI. Fix collection first.
              </div>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="text-xs text-slate-500">Top themes (placeholder)</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {sentiment.topThemes.map((t) => (
                  <span key={t} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-xs text-slate-500">
                Later: drive these from ward-level text responses or coded issue tags.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
