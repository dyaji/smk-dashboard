import { parseCsv } from "@/lib/csv";

function isValidUrl(value: string | undefined) {
  return !!value && /^https?:\/\//i.test(value);
}

function normalize(v: string) {
  return String(v ?? "").trim().toLowerCase();
}

export async function GET(req: Request) {
  const sentimentUrl = process.env.WARD_SENTIMENT_CSV_URL;
  const opsUrl = process.env.WARD_OPS_CSV_URL;

  if (!isValidUrl(sentimentUrl)) {
    return Response.json({ error: "Missing or invalid WARD_SENTIMENT_CSV_URL" }, { status: 500 });
  }

  if (!isValidUrl(opsUrl)) {
    return Response.json({ error: "Missing or invalid WARD_OPS_CSV_URL" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const lga = searchParams.get("lga") ?? "";
  const ward = searchParams.get("ward") ?? "";

  if (!lga || !ward) {
    return Response.json({ error: "Missing lga or ward" }, { status: 400 });
  }

  const [sentimentRes, opsRes] = await Promise.all([
    fetch(sentimentUrl!, { next: { revalidate: 30 } }),
    fetch(opsUrl!, { next: { revalidate: 30 } }),
  ]);

  if (!sentimentRes.ok || !opsRes.ok) {
    return Response.json(
      { error: `Fetch failed: sentiment=${sentimentRes.status}, ops=${opsRes.status}` },
      { status: 500 }
    );
  }

  const [sentimentCsv, opsCsv] = await Promise.all([sentimentRes.text(), opsRes.text()]);
  const sentimentRows = parseCsv(sentimentCsv);
  const opsRows = parseCsv(opsCsv);

  const keyLga = normalize(lga);
  const keyWard = normalize(ward);

  const s = sentimentRows.find(
    (r) => normalize(r.lga) === keyLga && normalize(r.ward) === keyWard
  );

  const o = opsRows.find((r) => normalize(r.lga) === keyLga && normalize(r.ward) === keyWard);

  const num = (v: string) => Number(String(v ?? "").replace(/,/g, "")) || 0;

  return Response.json({
    sentiment: s
      ? {
          positivePct: num(s.positivePct),
          neutralPct: num(s.neutralPct),
          negativePct: num(s.negativePct),
          netScore: num(s.netScore),
          trend7d: s.trend7d || "Flat",
          keywords: String(s.keywords ?? "")
            .split("|")
            .map((x) => x.trim())
            .filter(Boolean),
        }
      : null,
    ops: o
      ? {
          coveragePct: num(o.coveragePct),
          contactsWeek: num(o.contactsWeek),
          contactsMonth: num(o.contactsMonth),
          newCommittedWeek: num(o.newCommittedWeek),
          undecidedConvertedWeek: num(o.undecidedConvertedWeek),
          verificationPct: num(o.verificationPct),
          followupPct: num(o.followupPct),
          turnoutIntent: num(o.turnoutIntent),
          risk: o.risk || "Medium",
        }
      : null,
  });
}