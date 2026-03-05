import { parseCsv } from "@/lib/csv";

type Confidence = "High" | "Medium" | "Low";

function isValidUrl(value: string | undefined) {
  return !!value && /^https?:\/\//i.test(value);
}

export async function GET() {
  const url = process.env.FORECAST_CSV_URL;

  if (!isValidUrl(url)) {
    return Response.json({ error: "Missing or invalid FORECAST_CSV_URL" }, { status: 500 });
  }

  const res = await fetch(url!, { next: { revalidate: 30 } });
  if (!res.ok) {
    return Response.json({ error: `Fetch failed: ${res.status}` }, { status: 500 });
  }

  const csv = await res.text();
  const rows = parseCsv(csv);

  const num = (v: string) => Number(String(v ?? "").replace(/,/g, "")) || 0;
  const confidence = (v: string): Confidence =>
    v === "High" || v === "Medium" || v === "Low" ? v : "Medium";

  return Response.json(
    rows.map((r) => ({
      lga: r.lga ?? "",
      expectedVotes: num(r.expectedVotes),
      confidence: confidence(r.confidence),
    }))
  );
}