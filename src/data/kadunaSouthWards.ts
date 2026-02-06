// src/data/kadunaSouthWards.ts

export type KadunaSouthLGA =
  | "Jaba"
  | "Kaura"
  | "Kagarko"
  | "Jema'a"
  | "Kachia"
  | "Kauru"
  | "Sanga"
  | "Zangon Kataf";

export const KADUNA_SOUTH_LGAS: KadunaSouthLGA[] = [
  "Jaba",
  "Kaura",
  "Kagarko",
  "Jema'a",
  "Kachia",
  "Kauru",
  "Sanga",
  "Zangon Kataf",
];

export const WARDS_BY_LGA: Record<KadunaSouthLGA, string[]> = {
  Jaba: [
    "Nduyah",
    "Sambam",
    "Fada",
    "Sabchem",
    "Sabzuro",
    "Dura/Bitaro",
    "Daddu",
    "Chori",
    "Nok",
    "Fai",
  ],
  Kaura: [
    "Fada",
    "Kukum",
    "Kpak",
    "Agban",
    "Kadarko",
    "Mallagum",
    "Manchok",
    "Bondong",
    "Kaura",
    "Zankan",
  ],
  Kagarko: [
    "Kagarko North",
    "Kagarko South",
    "Kushe",
    "Jere North",
    "Jere South",
    "Iddah",
    "Aribi",
    "Kurmin Jibrin",
    "Katugal",
    "Kukui",
  ],
  "Jema'a": [
    "Asso",
    "Atuku",
    "Barde",
    "Gidan Waya",
    "Godogodo",
    "Jagindi",
    "Kafanchan A",
    "Kafanchan B",
    "Kagoma (Gwong)",
    "Kaninkon (Nikyob)",
    "Maigizo (Kadajya)",
    "Takau",
  ],
  Kachia: [
    "Agunu",
    "Awon",
    "Doka",
    "Gumel",
    "Gidan Tagwai",
    "Kwatiru",
    "Ankwa",
    "Katari",
    "Bishini",
    "Kachia Urban",
    "Sabon Sarki",
    "Kurmin Musa",
  ],
  Kauru: [
    "Badurum",
    "Bital",
    "Damakasuwa",
    "Dawaki",
    "Geshere",
    "Kamaru",
    "Kauru East",
    "Kauru West",
    "Kwassam",
    "Makami",
    "Pari",
  ],
  Sanga: [
    "Aboro",
    "Arak",
    "Ayu",
    "Bokana",
    "Fadan Karshi",
    "Gwantu",
    "Nandu",
    "Ninzam North",
    "Ninzam South",
    "Ninzam West",
    "Wasa Station",
  ],
  "Zangon Kataf": [
    "Atak Nfang (Zaman Dabo)",
    "Gidan Jatau",
    "Ikulu",
    "Jei",
    "Kamantan",
    "Kanai",
    "Madakiya",
    "Unguwar Rimi",
    "Zango Urban",
    "Zonkwa",
    "Zonzon",
  ],
};

export function makeWardId(lga: string, ward: string) {
  const raw = `${lga}-${ward}`.toLowerCase();
  return raw.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export type WardRecord = {
  id: string;
  lga: KadunaSouthLGA;
  ward: string;
};

export const ALL_WARDS: WardRecord[] = KADUNA_SOUTH_LGAS.flatMap((lga) =>
  WARDS_BY_LGA[lga].map((ward) => ({
    id: makeWardId(lga, ward),
    lga,
    ward,
  }))
);
