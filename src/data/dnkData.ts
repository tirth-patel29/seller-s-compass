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

const verifiedCoords: Record<string, { lat: number, lng: number }> = {
  "Ahmedabad GPO": { lat: 23.0225, lng: 72.5714 },
  "Surat IBC": { lat: 21.1702, lng: 72.8311 },
  "Rajkot HO": { lat: 22.3039, lng: 70.8022 },
  "Vadodara HO": { lat: 22.3072, lng: 73.1812 },
  "Bhuj HO": { lat: 23.2420, lng: 69.6669 },
  "Gandhinagar HO": { lat: 23.2156, lng: 72.6369 },
  "Palanpur HO": { lat: 24.1724, lng: 72.4346 },
  "Patan HO": { lat: 23.8493, lng: 72.1266 },
  "Unjha SO": { lat: 23.8037, lng: 72.3965 },
  "Himatnagar HO": { lat: 23.5979, lng: 72.9697 },
  "Modasa SO": { lat: 23.4633, lng: 73.2996 },
  "Anand HO": { lat: 22.5645, lng: 72.9289 },
  "Nadiad HO": { lat: 22.6916, lng: 72.8634 },
  "Godhra HO": { lat: 22.7759, lng: 73.6149 },
  "Dahod HO": { lat: 22.8323, lng: 74.2568 },
  "Jamnagar HO": { lat: 22.4707, lng: 70.0577 },
  "Morbi MDG": { lat: 22.8130, lng: 70.8320 },
  "Junagadh HO": { lat: 21.5222, lng: 70.4579 },
  "Porbandar HO": { lat: 21.6417, lng: 69.6293 },
  "Veraval SO": { lat: 20.9159, lng: 70.3629 },
  "Amreli HO": { lat: 21.6032, lng: 71.2185 },
  "Navsari HO": { lat: 20.9467, lng: 72.9520 },
  "Vapi MDG": { lat: 20.3708, lng: 72.9056 },
  "Silvassa MDG": { lat: 20.2763, lng: 73.0083 },
  "Daman MDG": { lat: 20.3974, lng: 72.8328 },
};

export const INITIAL_DNK_LOCATIONS: DNKLocation[] = allLocations.map((loc, i) => {
  const coords = verifiedCoords[loc.name];
  return {
    ...defaultMeta,
    id: `dnk-${(i + 1).toString().padStart(3, "0")}`,
    name: loc.name,
    state: loc.state || defaultMeta.state,
    district: loc.district,
    city: loc.city,
    postOfficeType: getTypeFromName(loc.name),
    region: loc.region,
    verificationStatus: coords ? "verified" : defaultMeta.verificationStatus,
    latitude: coords ? coords.lat : defaultMeta.latitude,
    longitude: coords ? coords.lng : defaultMeta.longitude,
  };
});
