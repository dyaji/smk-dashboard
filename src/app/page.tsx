"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import SupportTrendChart from "@/components/SupportTrendChart";
import VoterIntentionPie from "@/components/VoterIntentionPie";
import TopIssuesBar from "@/components/TopIssuesBar";

type LiveKpis = {
  votesCommitted: number;
  votesTarget: number;
  fundsRaised: number;
  fundsGoal: number;
  eventsHeld: number;
  eventsUpcoming: number;
  volunteers: number;
  volunteersTarget: number;
  committedPct: number;
  undecidedPct: number;
  oppositionPct: number;
  updatedAt?: string;
};

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}

function formatNGN(n: number) {
  return "₦" + new Intl.NumberFormat().format(n);
}

export default function Page() {
  // Fallback values (used while API loads or if API fails)
  const fallback: LiveKpis = useMemo(
    () => ({
      votesCommitted: 482_500,
      votesTarget: 750_000,
      fundsRaised: 245_300_000,
      fundsGoal: 500_000_000,
      eventsHeld: 56,
      eventsUpcoming: 12,
      volunteers: 2_730,
      volunteersTarget: 4_000,
      committedPct: 54,
      undecidedPct: 28,
      oppositionPct: 18,
      updatedAt: "",
    }),
    []
  );

  const [liveKpis, setLiveKpis] = useState<LiveKpis | null>(null);
  const [kpisError, setKpisError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setKpisError(null);
        const res = await fetch("/api/metrics/kpis", { cache: "no-store" });
        if (!res.ok) throw new Error(`KPIs API error: ${res.status}`);
        const data = (await res.json()) as LiveKpis;
        if (!cancelled) setLiveKpis(data);
      } catch (e: any) {
        if (!cancelled) setKpisError(e?.message ?? "Failed to load KPIs");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const k = liveKpis ?? fallback;

  // Example local data (you can later move these to Sheets too if you want)
  const outreach = useMemo(
    () => ({
      doorsKnocked: 86_450,
      callsMade: 124_800,
      townHalls: 42, // extra metric to fill the empty space
    }),
    []
  );

  const social = useMemo(
    () => ({
      followers: 182_500,
      engagementsThisWeek: 36_700,
      shares: 9_230,
      mentions: 4_150,
    }),
    []
  );

  const lgaLeaderboard = useMemo(
    () => [
      { lga: "Zangon Kataf", score: 92 },
      { lga: "Kachia", score: 88 },
      { lga: "Jema’a", score: 85 },
      { lga: "Sanga", score: 82 },
      { lga: "Jaba", score: 79 },
      { lga: "Kaura", score: 77 },
      { lga: "Kagarko", score: 74 },
    ],
    []
  );

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Header */}
        <section className="overflow-hidden rounded-3xl border bg-[#0f3b34] shadow-sm">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
            <div className="relative lg:col-span-4">
              <div className="relative h-64 w-full lg:h-full">
                <Image
                  src="/images/smk.jpg"
                  alt="Senator Sunday Marshall Katung"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="p-6 lg:col-span-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-wide text-white md:text-3xl">
                    SENATOR SUNDAY MARSHALL KATUNG (SMK)
                  </h1>
                  <p className="mt-1 text-xs font-semibold tracking-[0.35em] text-white/70 md:text-sm">
                    TRUST THE PROCESS CAMPAIGN DASHBOARD
                  </p>
                  {kpisError ? (
                    <p className="mt-2 text-xs text-orange-200">
                      KPIs not live yet: {kpisError}
                    </p>
                  ) : liveKpis?.updatedAt ? (
                    <p className="mt-2 text-xs text-white/60">
                      Last sync: {new Date(liveKpis.updatedAt).toLocaleString()}
                    </p>
                  ) : null}
                </div>

                <div className="shrink-0">
                  <div className="relative h-16 w-20 overflow-hidden rounded-xl border border-white/20 bg-white/10">
                    <Image
                      src="/images/apc.png"
                      alt="APC logo"
                      fill
                      className="object-contain p-2"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white shadow-sm">
                  <div className="text-xs font-semibold text-white/80">Total Votes Committed</div>
                  <div className="mt-2 text-3xl font-extrabold">{formatNumber(k.votesCommitted)}</div>
                  <div className="mt-2 text-xs text-white/70">
                    Target: {formatNumber(k.votesTarget)}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white shadow-sm">
                  <div className="text-xs font-semibold text-white/80">Funds Raised</div>
                  <div className="mt-2 text-3xl font-extrabold">{formatNGN(k.fundsRaised)}</div>
                  <div className="mt-2 text-xs text-white/70">Goal: {formatNGN(k.fundsGoal)}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white shadow-sm">
                  <div className="text-xs font-semibold text-white/80">Events Held</div>
                  <div className="mt-2 text-3xl font-extrabold">{formatNumber(k.eventsHeld)}</div>
                  <div className="mt-2 text-xs text-white/70">
                    Upcoming: {formatNumber(k.eventsUpcoming)}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white shadow-sm">
                  <div className="text-xs font-semibold text-white/80">Volunteers</div>
                  <div className="mt-2 text-3xl font-extrabold">{formatNumber(k.volunteers)}</div>
                  <div className="mt-2 text-xs text-white/70">
                    Target: {formatNumber(k.volunteersTarget)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Body grid */}
        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Voter Intention */}
          <section className="lg:col-span-7 rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4">
              <h2 className="text-lg font-bold">Voter Intention</h2>
            </div>
            <div className="p-5">
              <div className="h-80 w-full min-w-0">
                <VoterIntentionPie
                  committed={liveKpis?.committedPct ?? 54}
                  undecided={liveKpis?.undecidedPct ?? 28}
                  opposition={liveKpis?.oppositionPct ?? 18}
                />
              </div>
            </div>
          </section>

          {/* Polls & Sentiment */}
          <section className="lg:col-span-5 rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4">
              <h2 className="text-lg font-bold">Polls &amp; Sentiment</h2>
            </div>
            <div className="p-5">
              <SupportTrendChart />
              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="font-semibold text-emerald-700">
                  72% <span className="font-normal text-slate-700">Favorable</span>
                </div>
                <div className="font-semibold text-red-600">
                  24% <span className="font-normal text-slate-700">Unfavorable</span>
                </div>
              </div>
            </div>
          </section>

          {/* Campaign Outreach */}
          <section className="lg:col-span-4 rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4">
              <h2 className="text-lg font-bold">Campaign Outreach</h2>
            </div>
            <div className="p-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-[#0f3b34] px-4 py-3 text-white">
                <div className="text-[11px] text-white/80">Doors Knocked</div>
                <div className="mt-1 text-xl font-extrabold">{formatNumber(outreach.doorsKnocked)}</div>
              </div>
              <div className="rounded-xl bg-[#0f3b34] px-4 py-3 text-white">
                <div className="text-[11px] text-white/80">Calls Made</div>
                <div className="mt-1 text-xl font-extrabold">{formatNumber(outreach.callsMade)}</div>
              </div>
              <div className="rounded-xl bg-[#0f3b34] px-4 py-3 text-white">
                <div className="text-[11px] text-white/80">Town Halls</div>
                <div className="mt-1 text-xl font-extrabold">{formatNumber(outreach.townHalls)}</div>
              </div>
            </div>
          </section>

          {/* Top Issues */}
          <section className="lg:col-span-4 rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4">
              <h2 className="text-lg font-bold">Top Issues</h2>
            </div>
            <div className="p-5">
              <TopIssuesBar />
            </div>
          </section>

          {/* Social Media Stats */}
          <section className="lg:col-span-4 rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4">
              <h2 className="text-lg font-bold">Social Media Stats</h2>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-800 px-4 py-3 text-white">
                <div className="text-[11px] text-white/70">Followers</div>
                <div className="mt-1 text-xl font-extrabold">{formatNumber(social.followers)}</div>
              </div>
              <div className="rounded-xl bg-slate-800 px-4 py-3 text-white">
                <div className="text-[11px] text-white/70">Engagements</div>
                <div className="mt-1 text-xl font-extrabold">{formatNumber(social.engagementsThisWeek)}</div>
                <div className="text-[11px] text-white/60">This week</div>
              </div>
              <div className="rounded-xl bg-slate-800 px-4 py-3 text-white">
                <div className="text-[11px] text-white/70">Shares</div>
                <div className="mt-1 text-xl font-extrabold">{formatNumber(social.shares)}</div>
              </div>
              <div className="rounded-xl bg-slate-800 px-4 py-3 text-white">
                <div className="text-[11px] text-white/70">Mentions</div>
                <div className="mt-1 text-xl font-extrabold">{formatNumber(social.mentions)}</div>
              </div>
            </div>
          </section>

          {/* LGA Leaderboard */}
          <section className="lg:col-span-12 rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4">
              <h2 className="text-lg font-bold">LGA Leaderboard</h2>
            </div>
            <div className="p-5 overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="text-left text-slate-600">
                  <tr>
                    <th className="py-2 pr-4">LGA</th>
                    <th className="py-2 pr-4">Momentum Score</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lgaLeaderboard.map((row) => {
                    const status =
                      row.score >= 85 ? "Strong" : row.score >= 75 ? "Growing" : "Needs push";
                    return (
                      <tr key={row.lga} className="border-t">
                        <td className="py-3 pr-4 font-semibold">{row.lga}</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-48 rounded-full bg-slate-200">
                              <div
                                className="h-2 rounded-full bg-emerald-700"
                                style={{ width: `${Math.min(100, Math.max(0, row.score))}%` }}
                              />
                            </div>
                            <span className="w-10 text-right font-semibold">{row.score}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}