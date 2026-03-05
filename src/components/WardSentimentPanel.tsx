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
  netScore: number;
  trend7d: "Up" | "Down" | "Flat";
  keywords: string[];
};

type WardOps = {
  coveragePct: number;
  contactsWeek: number;
  contactsMonth: number;
  newCommittedWeek: number;
  undecidedConvertedWeek: number;
  verificationPct: number;
  followupPct: number;
  turnoutIntent: number;
  risk: "Low" | "Medium" | "High";
};

export default function WardSentimentPanel() {
  const lgas = useMemo(
    () => Object.keys(kadunaSouthWardsByLga) as KadunaSouthLga[],
    []
  );

  const safeDefaultLga = lgas[0];
  const [selectedLga, setSelectedLga] = useState<KadunaSouthLga>(safeDefaultLga);
  const wards = useMemo<string[]>(
    () => ((kadunaSouthWardsByLga[selectedLga] ?? []) as unknown as string[]),
    [selectedLga]
  );

  const [selectedWard, setSelectedWard] = useState<string>(() => wards[0] ?? "");
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [ops, setOps] = useState<WardOps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedWard((prev) => {
      if (!wards.length) return "";
      if (prev && wards.includes(prev)) return prev;
      return wards[0];
    });
  }, [selectedLga, wards]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!selectedLga || !selectedWard) {
        setSentiment(null);
        setOps(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          lga: selectedLga,
          ward: selectedWard,
        });

        const res = await fetch(`/api/metrics/ward-detail?${params.toString()}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`Ward detail API error: ${res.status}`);
        const data = await res.json();

        if (!cancelled) {
          setSentiment(data.sentiment ?? null);
          setOps(data.ops ?? null);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? "Failed to load ward detail");
          setSentiment(null);
          setOps(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [selectedLga, selectedWard]);

  const wardId = selectedWard ? makeWardId(selectedLga, selectedWard) : "";

  return (
    <div className="w-full min-w-0">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
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
              disabled={!wards.length}
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

          <div className="mt-4 max-h-72 overflow-auto rounded-xl border bg-white p-2">
            {wards.length ? (
              wards.map((w) => {
                const active = w === selectedWard;
                return (
                  <button
                    key={makeWardId(selectedLga, w)}
                    onClick={() => setSelectedWard(w)}
                    className={[
                      "mb-1 w-full rounded-lg px-3 py-2 text-left text-sm",
                      active ? "bg-[#0f3b34] text-white" : "hover:bg-slate-100",
                    ].join(" ")}
                    type="button"
                  >
                    {w}
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-sm text-slate-600">No wards configured for this LGA yet.</div>
            )}
          </div>
        </div>

        <div className="md:col-span-8 min-w-0">
          <div className="rounded-xl border bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-600">Ward Sentiment Snapshot</div>
                <div className="mt-1 text-lg font-extrabold text-slate-900 break-words">
                  {lgaLabels[selectedLga] ?? selectedLga} — {selectedWard || "Select a ward"}
                </div>
                <div className="mt-1 text-xs text-slate-500 break-words">ID: {wardId || "—"}</div>
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

            {loading ? <div className="mt-4 text-sm text-slate-500">Loading ward detail...</div> : null}
            {error ? <div className="mt-4 text-sm text-rose-600">{error}</div> : null}

            {!loading && !error && sentiment ? (
              <>
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

                <div className="mt-4">
                  <div className="text-xs font-semibold text-slate-600">Top Drivers</div>
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
                </div>

                {ops ? (
                  <div className="mt-5">
                    <div className="text-xs font-semibold text-slate-600">Ward Ops Snapshot</div>

                    <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="text-xs font-semibold text-slate-600">Coverage</div>
                        <div className="mt-1 text-2xl font-extrabold">{ops.coveragePct}%</div>
                        <div className="mt-1 text-xs text-slate-500">Ward/PU touch rate</div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="text-xs font-semibold text-slate-600">Verification</div>
                        <div className="mt-1 text-2xl font-extrabold">{ops.verificationPct}%</div>
                        <div className="mt-1 text-xs text-slate-500">Quality control</div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="text-xs font-semibold text-slate-600">Follow-up</div>
                        <div className="mt-1 text-2xl font-extrabold">{ops.followupPct}%</div>
                        <div className="mt-1 text-xs text-slate-500">2nd/3rd touches</div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="text-xs font-semibold text-slate-600">Contacts</div>
                        <div className="mt-1 text-lg font-extrabold">{ops.contactsWeek.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">This week</div>
                        <div className="mt-2 text-lg font-extrabold">{ops.contactsMonth.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">This month</div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="text-xs font-semibold text-slate-600">Conversion</div>
                        <div className="mt-1 text-lg font-extrabold">{ops.newCommittedWeek.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">New committed (week)</div>
                        <div className="mt-2 text-lg font-extrabold">
                          {ops.undecidedConvertedWeek.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">Undecided → committed</div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="text-xs font-semibold text-slate-600">Turnout Intent</div>
                        <div className="mt-1 text-2xl font-extrabold">{ops.turnoutIntent}%</div>
                        <div className="mt-2 text-xs text-slate-500">Risk level</div>
                        <div
                          className={[
                            "mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                            ops.risk === "Low"
                              ? "bg-emerald-50 text-emerald-700"
                              : ops.risk === "Medium"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700",
                          ].join(" ")}
                        >
                          {ops.risk}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}

            {!loading && !error && !sentiment ? (
              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                No live sentiment row found for this ward yet.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}