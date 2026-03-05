import { parseCsv } from "@/lib/csv";

type Trend = "Up" | "Down" | "Flat";

function isValidUrl(value: string | undefined) {
  return !!value && /^https?:\/\//i.test(value);
}

export async function GET(req: Request) {
  const mode = new URL(req.url).searchParams.get("mode") === "monthly" ? "monthly" : "weekly";
  const url =
    mode === "monthly" ? process.env.GROUP_MONTHLY_CSV_URL : process.env.GROUP_WEEKLY_CSV_URL;

  if (!isValidUrl(url)) {
    return Response.json({ error: `Missing or invalid ${mode.toUpperCase()} CSV URL` }, { status: 500 });
  }

  const res = await fetch(url!, { next: { revalidate: 30 } });
  if (!res.ok) {
    return Response.json({ error: `Fetch failed: ${res.status}` }, { status: 500 });
  }

  const csv = await res.text();
  const rows = parseCsv(csv);

  const num = (v: string) => Number(String(v ?? "").replace(/,/g, "")) || 0;
  const trend = (v: string): Trend => (v === "Up" || v === "Down" || v === "Flat" ? v : "Flat");

  return Response.json(
    rows.map((r) => ({
      group: r.group ?? "",
      activeMembers: num(r.activeMembers),
      coveragePct: num(r.coveragePct),
      newCommitted: num(r.newCommitted),
      undecidedConverted: num(r.undecidedConverted),
      verificationPct: num(r.verificationPct),
      followupPct: num(r.followupPct),
      totalScore: num(r.totalScore),
      trend: trend(r.trend),
    }))
  );
}