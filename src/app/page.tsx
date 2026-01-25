"use client";

import Image from "next/image";
import SupportTrendChart from "@/components/SupportTrendChart";
import VoterIntentionPie from "@/components/VoterIntentionPie";
import TopIssuesBar from "@/components/TopIssuesBar";

export default function Page() {
  const kpis = [
    { label: "Total Votes Committed", value: "482,500", sub: "Target: 750,000" },
    { label: "Funds Raised", value: "₦245.3M", sub: "Goal: ₦500M" },
    { label: "Events Held", value: "56", sub: "Upcoming: 12" },
    { label: "Volunteers", value: "2,730", sub: "Target: 4,000" },
  ];

  const social = [
    { label: "Followers", value: "182.5K" },
    { label: "Engagements", value: "36.7K", sub: "This Week" },
    { label: "Shares", value: "9,230" },
    { label: "Mentions", value: "4,150" },
  ];

  const lgaLeaderboard = [
    { lga: "Zangon Kataf", contactRate: "48%", supporters: "32%", visits: 18420 },
    { lga: "Jema’a", contactRate: "44%", supporters: "29%", visits: 16210 },
    { lga: "Jaba", contactRate: "42%", supporters: "28%", visits: 14860 },
    { lga: "Kauru", contactRate: "41%", supporters: "27%", visits: 13980 },
    { lga: "Kaura", contactRate: "40%", supporters: "26%", visits: 13110 },
    { lga: "Kachia", contactRate: "39%", supporters: "25%", visits: 12450 },
    { lga: "Kagarko", contactRate: "38%", supporters: "25%", visits: 11890 },
    { lga: "Sanga", contactRate: "36%", supporters: "24%", visits: 11320 },
  ];

  return (
    <div className="min-h-screen bg-[#e6e6e6] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* TOP BANNER */}
        <section className="overflow-hidden rounded-2xl border bg-[#0f3b32] shadow-sm">
          <div className="relative">
            {/* subtle “cloth” feel */}
            <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_60%)]" />
            <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
              {/* Candidate photo */}
              <div className="relative h-44 w-full md:h-auto md:w-64">
                <Image
                  src="/images/smk.jpg"
                  alt="Senator Sunday Marshall Katung"
                  fill
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
              </div>

              {/* Title */}
              <div className="flex-1 px-4 pb-4 pt-4 md:px-6 md:py-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-center text-xl font-semibold tracking-wide text-white md:text-left md:text-2xl">
                      SENATOR SUNDAY MARSHALL KATUNG (SMK)
                    </h1>
                    <div className="mt-1 text-center text-xs font-medium tracking-[0.25em] text-white/80 md:text-left">
                      TRUST THE PROCESS CAMPAIGN DASHBOARD
                    </div>
                  </div>

                  {/* APC Logo */}
                  <div className="hidden md:flex items-center justify-center rounded-xl bg-white/10 p-2 ring-1 ring-white/15">
                    <Image src="/images/apc.png" alt="APC" width={62} height={62} />
                  </div>
                </div>

                {/* KPI tiles */}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {kpis.map((k) => (
                    <div
                      key={k.label}
                      className="rounded-xl bg-[#12463b] px-4 py-3 ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    >
                      <div className="text-xs font-medium text-white/80">{k.label}</div>
                      <div className="mt-1 text-2xl font-semibold text-white">{k.value}</div>
                      <div className="mt-1 text-xs text-white/75">{k.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Voter Intention */}
          <section className="lg:col-span-6 rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-4 py-3">
              <div className="text-sm font-semibold text-slate-800">Voter Intention</div>
            </div>
            <div className="px-4 py-4">
              <VoterIntentionPie />
            </div>
          </section>

          {/* Polls & Sentiment */}
          <section className="lg:col-span-6 rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-4 py-3">
              <div className="text-sm font-semibold text-slate-800">Polls & Sentiment</div>
            </div>
            <div className="px-4 py-4">
              <SupportTrendChart />
              <div className="mt-3 flex items-center justify-center gap-6 text-sm">
                <div className="text-[#16a34a] font-semibold">
                  72% <span className="text-slate-700 font-medium">Favorable</span>
                </div>
                <div className="text-[#dc2626] font-semibold">
                  24% <span className="text-slate-700 font-medium">Unfavorable</span>
                </div>
              </div>
            </div>
          </section>

{/* Campaign Outreach */}
<section className="lg:col-span-4 rounded-2xl border bg-white shadow-sm">
  <div className="bg-[#0f3b32] px-4 py-2 text-sm font-semibold text-white rounded-t-2xl">
    Campaign Outreach
  </div>

  <div className="grid grid-cols-2 gap-3 px-4 py-4">
    <div className="rounded-xl bg-[#12463b] p-3 text-white ring-1 ring-black/5">
      <div className="text-xs text-white/80">Doors Knocked</div>
      <div className="mt-1 text-xl font-semibold">86,450</div>
    </div>

    <div className="rounded-xl bg-[#12463b] p-3 text-white ring-1 ring-black/5">
      <div className="text-xs text-white/80">Calls Made</div>
      <div className="mt-1 text-xl font-semibold">124,800</div>
    </div>

    <div className="rounded-xl bg-[#12463b] p-3 text-white ring-1 ring-black/5">
      <div className="text-xs text-white/80">Supporters Confirmed</div>
      <div className="mt-1 text-xl font-semibold">31,240</div>
    </div>

    <div className="rounded-xl bg-[#12463b] p-3 text-white ring-1 ring-black/5">
      <div className="text-xs text-white/80">Follow-ups Due</div>
      <div className="mt-1 text-xl font-semibold">4,930</div>
    </div>
  </div>
</section>


          {/* Top Issues */}
          <section className="lg:col-span-4 rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-4 py-3">
              <div className="text-sm font-semibold text-slate-800">Top Issues</div>
            </div>
            <div className="px-4 py-4">
              <TopIssuesBar />
            </div>
          </section>

          {/* Social Media Stats */}
          <section className="lg:col-span-4 rounded-2xl border bg-white shadow-sm">
            <div className="bg-[#2b3b44] px-4 py-2 text-sm font-semibold text-white rounded-t-2xl">
              Social Media Stats
            </div>
            <div className="grid grid-cols-2 gap-3 px-4 py-4">
              {social.map((s) => (
                <div key={s.label} className="rounded-xl bg-[#3c4b54] p-3 text-white">
                  <div className="text-xs text-white/80">{s.label}</div>
                  <div className="mt-1 text-xl font-semibold">{s.value}</div>
                  {s.sub ? <div className="text-xs text-white/75 mt-1">{s.sub}</div> : null}
                </div>
              ))}
            </div>
          </section>

          {/* LGA Leaderboard */}
          <section className="lg:col-span-12 rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-4 py-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-800">LGA Leaderboard</div>
              <div className="text-xs text-slate-500">Contact rate • supporters • visits</div>
            </div>

            <div className="px-4 py-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-slate-500">
                  <tr className="border-b">
                    <th className="py-2 pr-4">LGA</th>
                    <th className="py-2 pr-4">Contact Rate</th>
                    <th className="py-2 pr-4">Supporters</th>
                    <th className="py-2 pr-4">Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {lgaLeaderboard.map((r) => (
                    <tr key={r.lga} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium">{r.lga}</td>
                      <td className="py-3 pr-4">{r.contactRate}</td>
                      <td className="py-3 pr-4">{r.supporters}</td>
                      <td className="py-3 pr-4">{r.visits.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
