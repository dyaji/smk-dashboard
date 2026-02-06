export type GroupName =
  | "SMK Ambassadors"
  | "SMK Divas"
  | "Trust The Process Advocates"
  | "APC Wards & PUs Coordinators";

export type GroupMetrics = {
  group: GroupName;
  activeMembers: number;
  coveragePct: number; // 0-100
  newCommitted: number;
  undecidedConverted: number;
  verificationPct: number; // 0-100
  followupPct: number; // 0-100
  totalScore: number; // 0-100
  trend: "Up" | "Down" | "Flat";
};

export type WardOps = {
  coveragePct: number;
  contactsWeek: number;
  contactsMonth: number;
  newCommittedWeek: number;
  undecidedConvertedWeek: number;
  verificationPct: number;
  followupPct: number;
  turnoutIntent: number; // 0-100
  risk: "Low" | "Medium" | "High";
};

export type ForecastRow = {
  lga: string;
  expectedVotes: number;
  confidence: "High" | "Medium" | "Low";
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

// deterministic pseudo-random 0..1 from a string
export function hash01(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return (h % 100000) / 100000;
}

export function buildDemoGroupMetrics(mode: "weekly" | "monthly"): GroupMetrics[] {
  const groups: GroupName[] = [
    "SMK Ambassadors",
    "SMK Divas",
    "Trust The Process Advocates",
    "APC Wards & PUs Coordinators",
  ];

  return groups.map((g) => {
    const s1 = hash01(`${g}::a::${mode}`);
    const s2 = hash01(`${g}::b::${mode}`);
    const s3 = hash01(`${g}::c::${mode}`);

    const multiplier = mode === "monthly" ? 4 : 1;

    const activeMembers = Math.round(120 + s1 * 280); // 120..400
    const coveragePct = Math.round(55 + s2 * 40); // 55..95
    const verificationPct = Math.round(50 + s3 * 45); // 50..95
    const followupPct = Math.round(45 + hash01(`${g}::f::${mode}`) * 50); // 45..95

    const newCommitted = Math.round((90 + hash01(`${g}::nc::${mode}`) * 260) * multiplier);
    const undecidedConverted = Math.round((40 + hash01(`${g}::uc::${mode}`) * 180) * multiplier);

    // Scoring: Coverage 40, Conversion 40, Quality 20
    const conversionScore = clamp(
      Math.round(((newCommitted + undecidedConverted) / (multiplier * 600)) * 100),
      0,
      100
    );
    const coverageScore = coveragePct;
    const qualityScore = Math.round((verificationPct * 0.6 + followupPct * 0.4));

    const totalScore = clamp(
      Math.round(coverageScore * 0.4 + conversionScore * 0.4 + qualityScore * 0.2),
      0,
      100
    );

    const t = hash01(`${g}::trend::${mode}`);
    const trend: GroupMetrics["trend"] = t < 0.33 ? "Up" : t < 0.66 ? "Flat" : "Down";

    return {
      group: g,
      activeMembers,
      coveragePct,
      newCommitted,
      undecidedConverted,
      verificationPct,
      followupPct,
      totalScore,
      trend,
    };
  });
}

export function buildDemoWardOps(lga: string, ward: string): WardOps {
  const seed = hash01(`${lga}::${ward}::ops`);
  const seed2 = hash01(`${ward}::${lga}::ops2`);

  const coveragePct = Math.round(45 + seed * 50); // 45..95
  const verificationPct = Math.round(45 + seed2 * 50); // 45..95
  const followupPct = Math.round(40 + hash01(`${lga}::${ward}::fup`) * 55); // 40..95
  const turnoutIntent = Math.round(42 + hash01(`${lga}::${ward}::ti`) * 50); // 42..92

  const contactsWeek = Math.round(220 + seed * 480); // 220..700
  const contactsMonth = contactsWeek * 4 + Math.round(hash01(`${lga}::${ward}::m`) * 120);

  const newCommittedWeek = Math.round(18 + seed2 * 70); // 18..88
  const undecidedConvertedWeek = Math.round(8 + hash01(`${lga}::${ward}::u`) * 45); // 8..53

  // risk: low verification + low coverage
  const riskScore = (100 - coveragePct) * 0.55 + (100 - verificationPct) * 0.45;
  const risk: WardOps["risk"] = riskScore < 28 ? "Low" : riskScore < 48 ? "Medium" : "High";

  return {
    coveragePct,
    contactsWeek,
    contactsMonth,
    newCommittedWeek,
    undecidedConvertedWeek,
    verificationPct,
    followupPct,
    turnoutIntent,
    risk,
  };
}

export function buildDemoForecast(lgas: string[]): ForecastRow[] {
  return lgas.map((lga) => {
    const s = hash01(`${lga}::forecast`);
    const coverage = 55 + hash01(`${lga}::cov`) * 40;
    const verify = 50 + hash01(`${lga}::ver`) * 45;

    const expectedVotes = Math.round(65_000 + s * 55_000); // 65k..120k

    const confidenceScore = coverage * 0.5 + verify * 0.5;
    const confidence: ForecastRow["confidence"] =
      confidenceScore >= 78 ? "High" : confidenceScore >= 62 ? "Medium" : "Low";

    return { lga, expectedVotes, confidence };
  });
}
