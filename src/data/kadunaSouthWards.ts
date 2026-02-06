export const kadunaSouthWardsByLga = {
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
  "Jema'a": [
    "Kafanchan 'A'",
    "Kafanchan 'B'",
    "Maigizo 'A'",
    "Kaninkon",
    "Jagindi",
    "Godogodo",
    "Gidan Waya",
    "Atuku",
    "Asso",
    "Bedde",
    "Kagoma",
    "Takau 'B'",
  ],
  Kachia: [
    "Agunu",
    "Awon",
    "Doka",
    "Gumel",
    "Gidan Tagwai",
    "Kwaturu",
    "Ankwa",
    "Katari",
    "Bishini",
    "Kachia Urban",
    "Sabon Sarki",
    "Kurmin Musa",
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
  Kaura: [
    "Fada",
    "Kukum",
    "Kpak",
    "Agban",
    "Kadarko",
    "Mallagum",
    "Manchok",
    "Bondon",
    "Kaura",
    "Zankan",
  ],
  Kauru: [
    "Kauru West",
    "Makami",
    "Dawaki",
    "Kwassam",
    "Bital",
    "Geshere",
    "Damakasuwa",
    "Badurum Sama",
    "Kamaru",
    "Pari",
    "Kauru East",
  ],
  Sanga: [
    "Gwantu",
    "Fadan Karshi",
    "Ayu",
    "Ninzam North",
    "Ninzam South",
    "Bokana",
    "Aboro",
    "Ninzam West",
    "Wasa Station",
    "Arak",
    "Nandu",
  ],
  "Zangon Kataf": [
    "Gora",
    "Zonzon",
    "Zaman Dabo",
    "Unguwar Gaiya",
    "Zonkwa",
    "Madakiya",
    "Unguwar Rimi",
    "Gidan Jatau",
    "Kamantan",
    "Kamuru Ikulu North",
    "Zango Urban",
  ],
} as const;

export type KadunaSouthLga = keyof typeof kadunaSouthWardsByLga;

export type WardRow = {
  lga: KadunaSouthLga;
  ward: string;
};

export const kadunaSouthWards: WardRow[] = Object.entries(kadunaSouthWardsByLga).flatMap(
  ([lga, wards]) => wards.map((ward) => ({ lga: lga as KadunaSouthLga, ward }))
);

export function makeWardId(lga: string, ward: string) {
  return `${lga}::${ward}`;
}

export const lgaLabels: Record<KadunaSouthLga, string> = {
  Jaba: "Jaba",
  "Jema'a": "Jema’a",
  Kachia: "Kachia",
  Kagarko: "Kagarko",
  Kaura: "Kaura",
  Kauru: "Kauru",
  Sanga: "Sanga",
  "Zangon Kataf": "Zangon Kataf",
};
