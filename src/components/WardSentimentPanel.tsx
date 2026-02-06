"use client";

import { useMemo, useState } from "react";
import { kadunaSouthWards } from "@/data/kadunaSouthWards";

type WardRow = { lga: string; ward: string };

function hashInt(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

function demoMetrics(id: string) {
  const h = hashInt(id);
  // stable, realistic-ish ranges
  const positive = 45 + (h % 26); // 45..70
  const negative = 12 + ((h >>> 5) % 19); // 12..30
  let neutral = 100 - positive - negative;
  if (neutral < 5) neutral = 5;
  const net = positive - negative; // -100..100 (here usually positive)
  const volume = 30 + ((h >>> 10) % 111); // 30..140
  return { positive, neutral, negative, net, volume };
}

export default function WardSentimentPanel() {
  const wards = useMemo(() => kadunaSouthWards as WardRow[], []);

  const lgas = useMemo(() => {
    const set = new Set<string>();
    wards.forEach((w) => set.add(w.lga));
    return ["All LGAs", ...Array.from(set).sort()];
  }, [wards]);

  const [selectedLga, setSelectedLga] = useState<string>("All LGAs");
  const [query, setQuery] = useState<string>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return wards.filter((w) => {
      const lgaOk = selectedLga === "All LGAs" ? true : w.lga === selectedLga;
      const qOk = !q ? true : (w.ward + " " + w.lga).toLowerCase().includes(q);
      return lgaOk && qOk;
    });
  }, [wards, selectedLga, query]);

  const [selectedId, setSelectedId] = useState<string>(() => {
    const first = wards[0];
    return first ? `${first.lga}::${first.ward}` : "";
  });

  const selected = useMemo(() => {
    const [lga, ward] = selectedId.split("::");
    return { lga: lga || "", ward: ward || "" };
  }, [selectedId]);

  // If the current selection is filtered out, fall back to first visible.
  useMemo(() => {
    if (!filtered.length) return;
    const exists = filtered.some((w) => `${w.lga}::${w.ward}` === selectedId);
    if (!exists) setSelectedId(`${filtered[0].lga}::${filtered[0].ward}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  const m = useMemo(() => demoMetrics(selectedId || "seed"), [selectedId]);

  return (
    <div className="w-full">
      {/* Top controls (wrap safely) */}
      <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <div className="text-lg font-bold">Ward Sentiment</div>
          <div className="text-sm text-slate-500">
            (Kaduna South • {wards.length} Wards)
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:ml-auto lg:w-auto">
          <select
            value={selectedLga}
            onChange={(e) => setSelectedLga(e.target.value)}
            className="w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm sm:w-56"
          >
            {lgas.map((lga) => (
              <option key={lga} value={lga}>
                {lga}
              </option>
            ))}
          </select>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ward or LGA..."
            className="w-full min-w-0 rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 shadow-sm sm:w-[420px]"
          />
        </div>
      </div>

      {/* Main layout */}
      <div className="mt-5 grid w-full grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left list */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-4 py-3 text-sm font-semibold text-slate-800">
              Click a ward{" "}
              <span className="font-normal text-slate-500">({filtered.length} results)</span>
            </div>

            <div className="max-h-[520px] overflow-y-auto p-3">
              <div className="space-y-2">
                {filtered.map((w) => {
                  const id = `${w.lga}::${w.ward}`;
                  const active = id === selectedId;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedId(id)}
                      className={[
                        "w-full rounded-xl border px-3 py-3 text-left transition",
                        active
                          ? "border-transparent bg-[#0f3b34] text-white"
                          : "border-slate-200 bg-white hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <div className={active ? "font-extrabold" : "font-semibold"}>
                        <span className="block truncate">{w.ward}</span>
                      </div>
                      <div
                        className={[
                          "mt-1 text-xs",
                          active ? "text-white/80" : "text-slate-500",
                        ].join(" ")}
                      >
                        {w.lga}
                      </div>
                    </button>
                  );
                })}

                {!filtered.length ? (
                  <div className="rounded-xl border border-dashed p-4 text-sm text-slate-500">
                    No wards match your filter.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Right details */}
        <div className="min-w-0 lg:col-span-8">
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-4 py-3">
              <div className="text-xs text-slate-500">Selected ward</div>
              <div className="mt-1 text-xl font-extrabold text-slate-900">
                <span className="truncate">{selected.ward}</span>{" "}
                <span className="text-slate-400">•</span>{" "}
                <span className="font-semibold text-slate-700">{selected.lga}</span>
              </div>
            </div>

            <div className="p-4">
              {/* Metric tiles */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-xl border bg-white p-3">
                  <div className="text-xs text-slate-500">Positive</div>
                  <div className="mt-1 text-2xl font-extrabold text-emerald-700">
                    {m.positive}%
                  </div>
                </div>

                <div className="rounded-xl border bg-white p-3">
                  <div className="text-xs text-slate-500">Neutral</div>
                  <div className="mt-1 text-2xl font-extrabold text-slate-700">
                    {m.neutral}%
                  </div>
                </div>

                <div className="rounded-xl border bg-white p-3">
                  <div className="text-xs text-slate-500">Negative</div>
                  <div className="mt-1 text-2xl font-extrabold text-red-600">
                    {m.negative}%
                  </div>
                </div>

                <div className="rounded-xl border bg-white p-3">
                  <div className="text-xs text-slate-500">Net score</div>
                  <div className="mt-1 text-2xl font-extrabold text-slate-900">
                    {m.net >= 0 ? `+${m.net}` : m.net}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">Volume: {m.volume}</div>
                </div>
              </div>

              {/* Sentiment bar */}
              <div className="mt-5">
                <div className="mb-2 text-sm font-semibold text-slate-800">Sentiment split</div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="flex h-full w-full">
                    <div
                      className="h-full bg-emerald-600"
                      style={{ width: `${m.positive}%` }}
                      title={`Positive ${m.positive}%`}
                    />
                    <div
                      className="h-full bg-slate-500"
                      style={{ width: `${m.neutral}%` }}
                      title={`Neutral ${m.neutral}%`}
                    />
                    <div
                      className="h-full bg-red-600"
                      style={{ width: `${m.negative}%` }}
                      title={`Negative ${m.negative}%`}
                    />
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-500">
                  Demo scoring (replace with Google Sheets later).
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
