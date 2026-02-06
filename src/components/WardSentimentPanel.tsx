"use client";

import { useEffect, useMemo, useState } from "react";
import {
  kadunaSouthWardsByLga,
  KadunaSouthLga,
  lgaLabels,
  makeWardId,
} from "@/data/kadunaSouthWards";

type Sentiment = {
  positivePct: number;
  neutralPct: number;
  negativePct: number;
  netScore: number; // positive - negative
  trend7d: "Up" | "Down" | "Flat";
  keywords: string[];
};

function hash01(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return (h % 100000) / 100000;
}

function buildDemoSentiment(lga: string, ward: string): Sentiment {
  const seed = hash01(`${lga}::${ward}`);
  const seed2 = hash01(`${ward}::${lga}::x`);
  const seed3 = hash01(`${lga}::${ward}::k`);

  // Keep these realistic and always sum to 100
  const negative = Math.round(8 + seed * 17); // 8..25
  const neutral = Math.round(15 + seed2 * 20); // 15..35
  let positive = 100 - negative - neutral;

  // guard rounding edge cases
  if (positive < 0) positive = 0;
  const net = positive - negative;

  const trend: Sentiment["trend7d"] =
    seed < 0.33 ? "Up" : seed < 0.66 ? "Flat" : "Down";

  const pool = [
    "Economy",
    "Security",
    "Jobs",
    "Roads",
    "Healthcare",
    "Education",
    "Farming",
    "Electricity",
    "Water",
    "Cost of living",
    "Youth outreach",
    "Women inclusion",
  ];

  const start = Math.floor(seed3 * pool.length);
  const keywords = Array.from({ length: 5 }).map((_, i) => pool[(start + i) % pool.length]);

  return { positivePct: positive, neutralPct: neutral, negativePct: negative, netScore: net, trend7d: trend, keywords };
}

export default function WardSentimentPanel() {
  const lgas = useMemo(() => Object.keys(kadunaSouthWardsByLga) as KadunaSouthLga[], []);

  const [selectedLga, setSelectedLga] = useState<KadunaSouthLga>(lgas[0]);
  const wards = useMemo(() => kadunaSouthWardsByLga[selectedLga] ?? [], [selectedLga]);

  const [selectedWard, setSelectedWard] = useState<string>(wards[0] ?? "");

  // When LGA changes, force ward to first ward in that LGA
  useEffect(() => {
    setSelectedWard(wards[0] ?? "");
  }, [selectedLga]); // eslint-disable-line react-hooks/exhaustive-deps

  const sentiment = useMemo(() => {
    if (!selectedWard) return null;
    return buildDemoSentiment(selectedLga, selectedWard);
  }, [selectedLga, selectedWard]);

  const wardId = selectedWard ? makeWardId(selectedLga, selectedWard) : "";

  return (
    <div className="w-full min-w-0">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* Controls */}
        <div className="md:col-span-4 min-w-0">
          <div className="rounded-xl border bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-600">Select Local Government</div>
            <select
              className="mt-2 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none"
              value={selectedLga}
              onChange={(e) => setSelectedLga(e.target.value as KadunaSouthLga)}
            >
              {lgas.map((lga) => (
                <option key={lga} value={lga}>
                  {lgaLabels[lga] ?? lga}
                </option>
              ))}
            </select>

            <div className="mt-4 text-xs font-semibold text-slate-600">Select Ward</div>
            <select
              className="mt-2 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none"
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
            >
              {wards.map((w) => (
                <option key={makeWardId(selectedLga, w)} value={w}>
                  {w}
                </option>
              ))}
            </select>

            <div className="mt-4 text-xs text-slate-500">
              Showing <span className="font-semibold">{wards.length}</span> wards in{" "}
              <span className="font-semibold">{lgaLabels[selectedLga] ?? selectedLga}</span>
            </div>
          </div>

          {/* Ward list (optional quick click) */}
          <div className="mt-4 max-h-72 overflow-auto rounded-xl border bg-white p-2">
            {wards.map((w) => {
              const active = w === selectedWard;
              return (
                <button
                  key={makeWardId(selectedLga, w)}
                  onClick={() => setSelectedWard(w)}
                  className={[
                    "mb-1 w-full rounded-lg px-3 py-2 text-left text-sm",
                    active ? "bg-[#0f3b34] text-white" : "hover:bg-slate-100",
                  ].join(" ")}
                >
                  {w}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sentiment display */}
        <div className="md:col-span-8 min-w-0">
          <div className="rounded-xl border bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-600">Ward Sentiment Snapshot</div>
                <div className="mt-1 text-lg font-extrabold text-slate-900 break-words">
                  {lgaLabels[selectedLga] ?? selectedLga} — {selectedWard || "Select a ward"}
                </div>
                <div className="mt-1 text-xs text-slate-500 break-words">ID: {wardId}</div>
              </div>

              {sentiment ? (
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <div className="text-xs font-semibold text-slate-600">7-day Trend</div>
                  <div
                    className={[
                      "mt-1 text-sm font-extrabold",
                      sentiment.trend7d === "Up"
                        ? "text-emerald-700"
                        : sentiment.trend7d === "Down"
                        ? "text-rose-700"
                        : "text-slate-700",
                    ].join(" ")}
                  >
                    {sentiment.trend7d}
                  </div>
                </div>
              ) : null}
            </div>

            {sentiment ? (
              <>
                {/* Distribution bar */}
                <div className="mt-4">
                  <div className="mb-2 flex flex-wrap gap-4 text-xs">
                    <div className="font-semibold text-emerald-700">
                      {sentiment.positivePct}% <span className="font-normal text-slate-600">Positive</span>
                    </div>
                    <div className="font-semibold text-slate-700">
                      {sentiment.neutralPct}% <span className="font-normal text-slate-600">Neutral</span>
                    </div>
                    <div className="font-semibold text-rose-700">
                      {sentiment.negativePct}% <span className="font-normal text-slate-600">Negative</span>
                    </div>
                  </div>

                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="flex h-3 w-full">
                      <div className="h-3 bg-emerald-600" style={{ width: `${sentiment.positivePct}%` }} />
                      <div className="h-3 bg-slate-500" style={{ width: `${sentiment.neutralPct}%` }} />
                      <div className="h-3 bg-rose-600" style={{ width: `${sentiment.negativePct}%` }} />
                    </div>
                  </div>
                </div>

                {/* KPIs */}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-600">Net Sentiment</div>
                    <div className="mt-1 text-2xl font-extrabold text-slate-900">
                      {sentiment.netScore >= 0 ? `+${sentiment.netScore}` : sentiment.netScore}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">Positive − Negative</div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-600">Priority</div>
                    <div className="mt-1 text-2xl font-extrabold text-slate-900">
                      {sentiment.netScore >= 25 ? "Hold" : sentiment.netScore >= 10 ? "Build" : "Push"}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">Suggested focus level</div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-600">Signal Quality</div>
                    <div className="mt-1 text-2xl font-extrabold text-slate-900">
                      {sentiment.neutralPct <= 18 ? "High" : sentiment.neutralPct <= 28 ? "Medium" : "Low"}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">Lower neutral = clearer signal</div>
                  </div>
                </div>

                {/* Keywords */}
                <div className="mt-4">
                  <div className="text-xs font-semibold text-slate-600">Top Drivers (demo)</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sentiment.keywords.map((k) => (
                      <span
                        key={k}
                        className="rounded-full bg-[#0f3b34]/10 px-3 py-1 text-xs font-semibold text-[#0f3b34]"
                      >
                        {k}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 text-xs text-slate-500">
                    This is demo sentiment. When you’re ready, we’ll replace this generator with live values from Google Sheets.
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                Select an LGA and a ward to view sentiment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
