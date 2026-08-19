import type { DNKLocation } from "@/lib/types";

const defaultMeta = {
  state: "Gujarat",
  mappedFpo: "Ahmedabad",
  source: "Postal Export / e-PBE booking-office notification",
  sourceYear: "2023",
  verificationStatus: "verification_required" as const,
  latitude: null,
  longitude: null,
  pincode: "Not verified",
  address: "Available at selected DNK — verify before booking",
  services: ["e-PBE", "International Booking", "Document Upload"],
  notes: "Availability varies by location"
};

type RawLocation = { name: string; region: "North Gujarat" | "Central Gujarat" | "Saurashtra & Kutch" | "South Gujarat" | "Gujarat Circle / Union Territory record"; city: string; district: string; state?: string };

const northGujarat: RawLocation[] = [
  "Palanpur HO", "Patan HO", "Gandhinagar HO", "Unjha SO", "Himatnagar HO", "Modasa SO"
].map(name => ({ name, region: "North Gujarat" as const, city: name.split(" ")[0] || name, district: name.split(" ")[0] || name }));

const centralGujarat: RawLocation[] = [
  "Ahmedabad GPO", "Ahmedabad IBC", "Navarangpura HO", "Maninagar SO", "Manekbag SO", "Vatva IE PO",
  "Anand HO", "Nadiad HO", "Khambhat SO", "Vadodara HO", "Godhra HO", "Lunawada SO", "Chhota-Udepur SO", 
  "Dahod HO", "Rajpipla SO", "Ankelshwar IE"
].map(name => {
  const base = name.split(" ")[0] || name;
  const isAhmedabad = ["Kamraj", "Mota", "Navarangpura", "Manekbag", "Maninagar", "Vatva"].includes(base);
  return { name, region: "Central Gujarat" as const, city: isAhmedabad ? "Ahmedabad" : base, district: base };
});

const saurashtraKutch: RawLocation[] = [
  "Rajkot HO", "Jamnagar HO", "Morbi MDG", "Bhuj HO", "Gandhidham PO", "Junagadh HO", "Porbandar HO", 
  "Veraval SO", "Amreli HO", "Botad SO", "Surendranagar HO", "Khambhalia MDG"
].map(name => ({ name, region: "Saurashtra & Kutch" as const, city: name.split(" ")[0] || name, district: name.split(" ")[0] || name }));

const southGujarat: RawLocation[] = [
  "Surat IBC", "Nanpura HO", "Mota Varacha SO", "Udhana SO", "Navsari HO", "Vapi MDG", "Vyara MDG", 
  "Ahuwa MDG", "Subir SO", "Kamraj Char Rasta SO"
].map(name => {
  const base = name.split(" ")[0] || name;
  const isSurat = ["Mota", "Nanpura", "Udhana", "Kamraj"].includes(base);
  return { name, region: "South Gujarat" as const, city: isSurat ? "Surat" : base, district: isSurat ? "Surat" : base };
});

const utRecords: RawLocation[] = [
  "Silvassa MDG", "Daman MDG"
].map(name => ({ name, region: "Gujarat Circle / Union Territory record" as const, city: name.split(" ")[0] || name, district: name.split(" ")[0] || name, state: "Union Territory" }));

const allLocations: RawLocation[] = [...northGujarat, ...centralGujarat, ...saurashtraKutch, ...southGujarat, ...utRecords];

const getTypeFromName = (name: string) => {
  if (name.includes("HO") || name.includes("GPO")) return "Head Office";
  if (name.includes("SO")) return "Sub Office";
  if (name.includes("MDG")) return "MDG";
  if (name.includes("IBC")) return "IBC";
  if (name.includes("IE")) return "Industrial Estate PO";
  return "Post Office";
};

export const INITIAL_DNK_LOCATIONS: DNKLocation[] = allLocations.map((loc, i) => ({
  ...defaultMeta,
  id: `dnk-${(i + 1).toString().padStart(3, "0")}`,
  name: loc.name,
  state: loc.state || defaultMeta.state,
  district: loc.district,
  city: loc.city,
  postOfficeType: getTypeFromName(loc.name),
  region: loc.region,
}));
