import { parseCsv } from "@/lib/csv";

export async function GET() {
  const url = process.env.KPIS_CSV_URL;
  if (!url) return Response.json({ error: "Missing KPIS_CSV_URL" }, { status: 500 });

  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) return Response.json({ error: `Fetch failed: ${res.status}` }, { status: 500 });

  const csv = await res.text();
  const rows = parseCsv(csv);

  if (!rows.length) return Response.json({ error: "No rows in kpis sheet" }, { status: 500 });

  const r = rows[0];
  const num = (v: string) => Number(String(v ?? "").replace(/,/g, "")) || 0;

  return Response.json({
    votesCommitted: num(r.votesCommitted),
    votesTarget: num(r.votesTarget),
    fundsRaised: num(r.fundsRaised),
    fundsGoal: num(r.fundsGoal),
    eventsHeld: num(r.eventsHeld),
    eventsUpcoming: num(r.eventsUpcoming),
    volunteers: num(r.volunteers),
    volunteersTarget: num(r.volunteersTarget),
    committedPct: num(r.committedPct),
    undecidedPct: num(r.undecidedPct),
    oppositionPct: num(r.oppositionPct),
    updatedAt: new Date().toISOString(),
  });
}
