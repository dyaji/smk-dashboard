import { parseCsv } from "@/lib/csv";

export async function GET(req: Request) {
  const url = process.env.DAILY_CSV_URL;
  if (!url) return Response.json({ error: "Missing DAILY_CSV_URL" }, { status: 500 });

  const u = new URL(req.url);
  const daysParam = u.searchParams.get("days");
  const days = Math.max(1, Math.min(365, Number(daysParam ?? 30) || 30));

  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) return Response.json({ error: `Fetch failed: ${res.status}` }, { status: 500 });

  const csv = await res.text();
  const rows = parseCsv(csv);

  const num = (v: string) => Number(String(v ?? "").replace(/,/g, "")) || 0;

  const mapped = rows
    .map((r) => ({
      date: r.date,
      support: num(r.support),
      undecided: num(r.undecided),
    }))
    .filter((r) => r.date)
    .sort((a, b) => a.date.localeCompare(b.date));

  // return last N days
  const sliced = mapped.slice(Math.max(0, mapped.length - days));

  return Response.json(sliced);
}
