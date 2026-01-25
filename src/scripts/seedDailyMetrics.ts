import { prisma } from "@/lib/prisma";

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function main() {
  // Clear existing demo rows
  await prisma.dailyMetric.deleteMany();

  const points = [
    { d: 6, support: 58, undecided: 23 },
    { d: 5, support: 59, undecided: 22 },
    { d: 4, support: 60, undecided: 21 },
    { d: 3, support: 61, undecided: 20 },
    { d: 2, support: 62, undecided: 19 },
    { d: 1, support: 61, undecided: 19 },
    { d: 0, support: 63, undecided: 18 },
  ];

  await prisma.dailyMetric.createMany({
    data: points.map((p) => ({
      date: daysAgo(p.d),
      support: p.support,
      undecided: p.undecided,
    })),
  });

  console.log("Seeded DailyMetric rows:", points.length);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
