import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.dailyMetric.findMany({
    orderBy: { date: "asc" },
    take: 30,
  });

  return Response.json(
    rows.map((r) => ({
      date: r.date.toISOString().slice(0, 10),
      support: r.support,
      undecided: r.undecided,
    }))
  );
}
