// ----------------------------------------------------------------------------
// Mock data layer.
//
// Real county geometry comes from a public GeoJSON source at runtime (see
// TerritoryMap.tsx) — this file never hard-codes county lists. Instead it
// deterministically derives rep assignment + pipeline financials for any
// county FIPS code it's asked about, so it lines up with whatever the map
// renders. Swap `getCountyRecord` for a real API call once listings data
// exists server-side; everything downstream (map, rep table, KPIs) already
// consumes the same shape.
// ----------------------------------------------------------------------------

export type PipelineStage = "prospect" | "working" | "signedReady" | "closed";

export type RepType = "regional" | "district" | "territory" | "independent";

export interface Rep {
  id: string;
  name: string;
  type: RepType;
  regionId: RegionId;
  parentId: string | null;
}

export type RegionId = "west" | "east";

export interface StageAmount {
  count: number;
  value: number;
}

export interface CountyRecord {
  fips: string;
  name: string;
  stateAbbr: string;
  regionId: RegionId;
  repId: string | null;
  prospect: StageAmount;
  working: StageAmount;
  signedReady: StageAmount;
  closed: StageAmount;
  priorYearClosed: number;
  /** Target GMV for this county for the current period — the "goal" the bars in the UI measure progress against. */
  budget: number;
}

export interface Listing {
  id: string;
  fips: string;
  countyName: string;
  stateAbbr: string;
  repId: string | null;
  stage: PipelineStage;
  description: string;
  value: number;
  auctionId: string | null;
  /** Known even for prospects (a likely category), unlike auctionId/end date which aren't decided yet for them. */
  auctionType: AuctionType | null;
}

export type AuctionType = "Single Seller" | "Equipment" | "At Risk";

export interface Auction {
  id: string;
  name: string;
  scheduled: boolean;
  week: string;
  /** Formatted end date (or expected end date, for the TBA auction). */
  endDate: string;
  /** Raw timestamp backing `endDate` — lets the UI filter by real date ranges (week/month/quarter/year) instead of parsing the formatted string. */
  endDateTimestamp: number;
  auctionType: AuctionType;
  submittedCount: number;
  workingCount: number;
  acceptedCount: number;
  submittedValue: number;
  workingValue: number;
  acceptedValue: number;
}

export interface AuctionWeekPoint {
  label: string;
  submitted: number;
  working: number;
  accepted: number;
}

/* ---------------------------- deterministic RNG --------------------------- */

export function hashStr(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
export function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------ state -> region ---------------------------- */

export const FIPS_TO_STATE: Record<string, string> = {
  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA", "08": "CO",
  "09": "CT", "10": "DE", "11": "DC", "12": "FL", "13": "GA", "15": "HI",
  "16": "ID", "17": "IL", "18": "IN", "19": "IA", "20": "KS", "21": "KY",
  "22": "LA", "23": "ME", "24": "MD", "25": "MA", "26": "MI", "27": "MN",
  "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH",
  "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND", "39": "OH",
  "40": "OK", "41": "OR", "42": "PA", "44": "RI", "45": "SC", "46": "SD",
  "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA",
  "54": "WV", "55": "WI", "56": "WY",
};

export const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon",
  PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota",
  TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia",
  WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

const WEST = new Set([
  "WA","OR","CA","NV","ID","MT","WY","UT","CO","AZ","NM","AK","HI",
  "ND","SD","NE","KS","OK","TX","MN","IA","MO","AR","LA",
]);

export function regionForState(abbr: string): RegionId {
  return WEST.has(abbr) ? "west" : "east";
}

export const REGIONS: { id: RegionId; name: string }[] = [
  { id: "west", name: "West Region" },
  { id: "east", name: "East Region" },
];

/* --------------------------------- rep tree -------------------------------- */

const FIRST_NAMES = ["Jordan","Casey","Morgan","Riley","Taylor","Cameron","Avery","Reese","Dakota","Skyler","Peyton","Quinn","Sawyer","Rowan","Emerson","Blake","Harper","Adrian"];
const LAST_NAMES = ["Whitfield","Brennan","Ostrander","Callahan","Marchetti","Nystrom","Pemberton","Roskam","Vandermeer","Kowalczyk","Sutcliffe","Habersham","Lindqvist","Farrow","Denholm","Mercado","Aldrich"];

function nameFor(rng: () => number) {
  const f = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
  const l = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
  return `${f} ${l}`;
}

function buildReps(): Rep[] {
  const rng = mulberry32(7);
  const reps: Rep[] = [];

  // Field-rep headcount is proportional to each region's real county count
  // (West ~48%, East ~52% of all US counties with this split) so coverage
  // density ends up roughly even across both. ~145 people total.
  const REGION_CONFIG: Record<RegionId, { districts: number; fieldRepsPerDistrict: number }> = {
    west: { districts: 6, fieldRepsPerDistrict: 10 }, // 60 field reps
    east: { districts: 7, fieldRepsPerDistrict: 10 }, // 70 field reps
  };

  REGIONS.forEach((region) => {
    const rm: Rep = { id: `rm-${region.id}`, name: nameFor(rng), type: "regional", regionId: region.id, parentId: null };
    reps.push(rm);
    const { districts, fieldRepsPerDistrict } = REGION_CONFIG[region.id];
    for (let d = 0; d < districts; d++) {
      const dmId = `dm-${region.id}-${d}`;
      reps.push({ id: dmId, name: nameFor(rng), type: "district", regionId: region.id, parentId: rm.id });
      // Roughly 2/3 Territory Managers, 1/3 Independent Sales Reps per district.
      const territoryCount = Math.round(fieldRepsPerDistrict * 0.64);
      const independentCount = fieldRepsPerDistrict - territoryCount;
      for (let t = 0; t < territoryCount; t++) {
        reps.push({ id: `tm-${region.id}-${d}-${t}`, name: nameFor(rng), type: "territory", regionId: region.id, parentId: dmId });
      }
      for (let j = 0; j < independentCount; j++) {
        reps.push({ id: `isr-${region.id}-${d}-${j}`, name: nameFor(rng), type: "independent", regionId: region.id, parentId: dmId });
      }
    }
  });
  return reps;
}

export const REPS: Rep[] = buildReps();

export function repsByRegion(regionId: RegionId): Rep[] {
  return REPS.filter((r) => r.regionId === regionId && (r.type === "territory" || r.type === "independent"));
}

export function repById(id: string | null | undefined): Rep | undefined {
  if (!id) return undefined;
  return REPS.find((r) => r.id === id);
}/* ------------------------------ county records ----------------------------- */

const countyCache = new Map<string, CountyRecord>();

// fips -> assigned rep id (or null if no rep — an open prospecting county).
// Populated in one pass by primeCountyAssignments() so caps apply across the
// whole region rather than per-county in isolation.
const repAssignment = new Map<string, string | null>();
let assignmentsComputed = false;
const MAX_COUNTIES_PER_REP = 11;

function fipsAndStateFromFeature(feature: any): { fips: string; stateAbbr: string } {
  const fips =
    feature.id != null
      ? String(feature.id).padStart(5, "0")
      : `${feature.properties?.STATE ?? ""}${feature.properties?.COUNTY ?? ""}`.padStart(5, "0");
  return { fips, stateAbbr: FIPS_TO_STATE[fips.slice(0, 2)] ?? "US" };
}

/**
 * Run once (idempotent) against the full county GeoJSON before any
 * getCountyRecord() calls that need real rep coverage. Each rep is given a
 * deterministic, skewed-low random target between 1 and MAX_COUNTIES_PER_REP
 * (product of two uniforms → averages ~3-4, occasionally reaches the cap) —
 * matching a realistic territory size instead of every rep maxing out.
 * Counties left over once every rep in a region has been assigned their
 * target stay unassigned — open prospecting territory, same as before.
 */
export function primeCountyAssignments(geo: { features: any[] }) {
  if (assignmentsComputed) return;

  const byRegion = new Map<RegionId, string[]>();
  for (const feature of geo.features) {
    const { fips, stateAbbr } = fipsAndStateFromFeature(feature);
    const region = regionForState(stateAbbr);
    const list = byRegion.get(region) ?? [];
    list.push(fips);
    byRegion.set(region, list);
  }

  REGIONS.forEach((region) => {
    const fipsList = byRegion.get(region.id) ?? [];
    // Deterministic shuffle so assignment doesn't depend on GeoJSON feature order.
    const shuffled = fipsList
      .map((f) => ({ f, key: mulberry32(hashStr(f + "-shuffle"))() }))
      .sort((a, b) => a.key - b.key)
      .map((x) => x.f);

    const reps = repsByRegion(region.id);
    let cursor = 0;
    for (const rep of reps) {
      const skewRng = mulberry32(hashStr(rep.id + "-territory-size"));
      // sqrt(uniform) skews toward the higher end (average ~0.67 vs 0.5 for a
      // plain uniform) — still respects the 1-11 cap, but assigns meaningfully
      // more counties overall than the earlier low-skewed version.
      const skewed = Math.sqrt(skewRng());
      const target = Math.min(MAX_COUNTIES_PER_REP, Math.max(1, Math.round(1 + skewed * (MAX_COUNTIES_PER_REP - 1))));
      for (let k = 0; k < target && cursor < shuffled.length; k++) {
        repAssignment.set(shuffled[cursor], rep.id);
        cursor++;
      }
    }
    // Anything past `cursor` never got assigned — stays unassigned/prospecting.
    for (; cursor < shuffled.length; cursor++) {
      repAssignment.set(shuffled[cursor], null);
    }
  });

  assignmentsComputed = true;
}

const DESCRIPTORS = [
  "Row crop tractors & planting equipment",
  "Cattle ranch dispersal — full line",
  "Grain handling & storage systems",
  "Construction & excavation iron",
  "Dairy retirement — parlor & equipment",
  "Hay & forage equipment package",
  "Irrigation systems & pivots",
  "Combine & harvest equipment",
  "Trucks, trailers & support equipment",
  "Timber & forestry equipment",
];

const LOT_DESCRIPTORS = [
  "John Deere 8320 Tractor", "Case IH 2588 Combine", "Grain Bin — 10,000 bu",
  "Kinze 3600 Planter", "Flatbed Trailer — 40ft", "Chevy Silverado 2500HD",
  "New Holland BR7090 Baler", "Grain Cart — 1000 bu", "Case IH Patriot Sprayer",
  "Disc Harrow — 24ft", "Bobcat S650 Skid Steer", "CAT 320 Excavator",
  "Peterbilt 367 Dump Truck", "100kW Diesel Generator", "Livestock Trailer — 24ft",
  "Center Pivot Irrigation System", "Round Baler — Vermeer 605N", "Grain Auger — 10in x 71ft",
];

export type EstimateConfidence = "High" | "Medium" | "Low";

export interface ListingItem {
  id: string;
  lotDescription: string;
  estimatedGMV: number;
  estimateConfidence: EstimateConfidence;
  targetPrice: number;
}

/** Breaks a Listing's total value down into the individual lots/items that
 * make it up — deterministic per listing, so re-expanding shows the same items. */
export function getListingItems(listingId: string, listingValue: number): ListingItem[] {
  const rng = mulberry32(hashStr(listingId + "-items"));
  const count = 2 + Math.floor(rng() * 5); // 2-6 items
  const confidenceLevels: EstimateConfidence[] = ["High", "Medium", "Low"];
  const weights = Array.from({ length: count }, () => 0.5 + rng());
  const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;

  return Array.from({ length: count }).map((_, i) => {
    const share = weights[i] / totalWeight;
    const estimatedGMV = Math.round(listingValue * share);
    const confidence = confidenceLevels[Math.floor(rng() * confidenceLevels.length)];
    const confidenceMultiplier =
      confidence === "High" ? 0.97 + rng() * 0.06 : confidence === "Medium" ? 0.85 + rng() * 0.15 : 0.65 + rng() * 0.2;
    return {
      id: `${listingId}-item-${i}`,
      lotDescription: LOT_DESCRIPTORS[Math.floor(rng() * LOT_DESCRIPTORS.length)],
      estimatedGMV,
      estimateConfidence: confidence,
      targetPrice: Math.round(estimatedGMV * confidenceMultiplier),
    };
  });
}

export function getCountyRecord(fips: string, rawName: string): CountyRecord {
  const cached = countyCache.get(fips);
  if (cached) return cached;

  const stateFips = fips.slice(0, 2);
  const stateAbbr = FIPS_TO_STATE[stateFips] ?? "US";
  const regionId = regionForState(stateAbbr);
  const rng = mulberry32(hashStr(fips));

  let repId: string | null;
  if (assignmentsComputed && repAssignment.has(fips)) {
    repId = repAssignment.get(fips) ?? null;
  } else {
    // Fallback for a county requested before primeCountyAssignments() has run
    // against the full list (e.g. an isolated lookup) — best-effort only;
    // normal dashboard usage primes assignments first, so this path shouldn't
    // usually fire, and won't reflect the 1–16-per-rep cap.
    const pool = repsByRegion(regionId);
    repId = rng() < 0.14 || pool.length === 0 ? null : pool[Math.floor(rng() * pool.length)].id;
  }
  const rep = repId ? repById(repId) : undefined;

  const base = 8_000 + rng() * 90_000;
  const mk = (mult: number, countMax: number): StageAmount => ({
    count: Math.round(rng() * countMax),
    value: Math.round(base * mult * (0.4 + rng() * 1.2)),
  });

  const record: CountyRecord = {
    fips,
    name: rawName,
    stateAbbr,
    regionId,
    repId: rep ? rep.id : null,
    // Assigned counties always may carry prospect value. Unassigned counties
    // only get one ~18% of the time — otherwise every gray (no-rep) county
    // would show a prospect signal, which is the opposite of "sprinkled."
    prospect: rep ? mk(0.9, 4) : rng() < 0.18 ? mk(0.9, 4) : { count: 0, value: 0 },
    working: rep ? mk(0.6, 3) : { count: 0, value: 0 },
    signedReady: rep ? mk(0.75, 2) : { count: 0, value: 0 },
    closed: rep ? mk(1.1, 3) : { count: 0, value: 0 },
    priorYearClosed: 0,
    budget: 0,
  };
  record.priorYearClosed = Math.round(record.closed.value * (0.7 + rng() * 0.55));
  // Budget/goal is a modest stretch above current actual — swap for a real
  // assigned quota once that exists (e.g. from a planning/budgeting system).
  record.budget = Math.round(record.closed.value * (1.08 + rng() * 0.3));
  countyCache.set(fips, record);
  return record;
}

export function getCountyListings(fips: string, countyName: string, stateAbbr: string): Listing[] {
  const rec = getCountyRecord(fips, countyName);
  const rng = mulberry32(hashStr(fips + "-listings"));
  const listings: Listing[] = [];
  (["prospect", "working", "signedReady", "closed"] as PipelineStage[]).forEach((stage) => {
    const amt = rec[stage];
    for (let i = 0; i < amt.count; i++) {
      // Prospects haven't been slated for any specific auction yet — no name,
      // no end date — but a likely category is still a reasonable guess.
      // Everything further along the pipeline is tied to an actual auction,
      // whether already sold there or expected to be added.
      const auctionId = stage === "prospect" ? null : AUCTIONS[Math.floor(rng() * AUCTIONS.length)].id;
      const auctionType = auctionId
        ? AUCTIONS.find((a) => a.id === auctionId)?.auctionType ?? null
        : AUCTION_TYPES[Math.floor(rng() * AUCTION_TYPES.length)];
      listings.push({
        id: `${fips}-${stage}-${i}`,
        fips,
        countyName,
        stateAbbr,
        repId: rec.repId,
        stage,
        description: DESCRIPTORS[Math.floor(rng() * DESCRIPTORS.length)],
        value: Math.round((amt.value / Math.max(amt.count, 1)) * (0.7 + rng() * 0.6)),
        auctionId,
        auctionType,
      });
    }
  });
  return listings;
}

export const STAGE_LABEL: Record<PipelineStage, string> = {
  prospect: "Prospect",
  working: "Work In Progress",
  signedReady: "Signed & Ready",
  closed: "Closed",
};

export const STAGE_COLOR: Record<PipelineStage, string> = {
  prospect: "#f97316",
  working: "#2563eb",
  signedReady: "#7c3aed",
  closed: "#16a34a",
};

/* ---------------------------------- auctions -------------------------------- */

const AUCTION_NAMES = [
  "Midwest Ag Equipment", "Southern Row Crop Liquidation", "Rocky Mountain Ranch Dispersal",
  "Texas Panhandle Cattle & Iron", "Great Lakes Dairy Equipment", "Delta Region Farm Auction",
  "Gulf Coast Construction Iron", "Corn Belt Consignment", "High Plains Grain Systems",
  "Appalachian Timber & Ag", "Central Valley Row Crop", "Northeast Dairy Retirement",
  "Southwest Irrigation Equipment", "Pacific Northwest Forestry",
];

const AUCTION_TYPES: AuctionType[] = ["Single Seller", "Equipment", "At Risk"];

function formatAuctionDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/**
 * Spans roughly a month back through 11 months forward, with a handful of
 * real-dated auctions per month — enough density that filtering the
 * Auctions tab by This Week/Month/Quarter/Year actually shows different
 * subsets, rather than the same short list regardless of timeframe.
 */
function buildAuctions(): Auction[] {
  const now = new Date();
  const auctions: Auction[] = [];
  let counter = 0;

  for (let offset = 1; offset >= -11; offset--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const monthLabel = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
    const monthRng = mulberry32(hashStr(monthLabel + "-auction-count"));
    const count = 2 + Math.floor(monthRng() * 5); // 2-6 auctions this month

    for (let i = 0; i < count; i++) {
      const aRng = mulberry32(hashStr(monthLabel + "-auction-" + i));
      const day = 1 + Math.floor(aRng() * 27);
      const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      const name = AUCTION_NAMES[Math.floor(aRng() * AUCTION_NAMES.length)];
      const submittedCount = 8 + Math.floor(aRng() * 40);
      const acceptedCount = Math.floor(submittedCount * (0.2 + aRng() * 0.35));
      const workingCount = submittedCount - acceptedCount;
      const avgLot = (8 + aRng() * 22) * 1000;
      const endDateLabel = formatAuctionDate(date);

      auctions.push({
        id: `auction-${counter++}`,
        name,
        scheduled: true,
        week: `Week of ${endDateLabel}`,
        endDate: endDateLabel,
        endDateTimestamp: date.getTime(),
        auctionType: AUCTION_TYPES[Math.floor(aRng() * AUCTION_TYPES.length)],
        submittedCount,
        workingCount,
        acceptedCount,
        submittedValue: Math.round(submittedCount * avgLot),
        workingValue: Math.round(workingCount * avgLot),
        acceptedValue: Math.round(acceptedCount * avgLot),
      });
    }
  }

  // Exactly one "Auction TBA" — no confirmed date, shown regardless of
  // whatever date-range filter is active since it doesn't have a real one.
  const tbaRng = mulberry32(hashStr("auction-tba"));
  const tbaExpected = new Date(now.getTime() + (14 + Math.floor(tbaRng() * 30)) * 24 * 60 * 60 * 1000);
  const tbaSubmittedCount = 8 + Math.floor(tbaRng() * 40);
  const tbaAcceptedCount = Math.floor(tbaSubmittedCount * (0.2 + tbaRng() * 0.35));
  const tbaWorkingCount = tbaSubmittedCount - tbaAcceptedCount;
  const tbaAvgLot = (8 + tbaRng() * 22) * 1000;
  const tbaEndDateLabel = formatAuctionDate(tbaExpected);
  auctions.push({
    id: `auction-${counter++}`,
    name: "Auction TBA",
    scheduled: false,
    week: `Week of ${tbaEndDateLabel} (expected)`,
    endDate: tbaEndDateLabel,
    endDateTimestamp: tbaExpected.getTime(),
    auctionType: AUCTION_TYPES[Math.floor(tbaRng() * AUCTION_TYPES.length)],
    submittedCount: tbaSubmittedCount,
    workingCount: tbaWorkingCount,
    acceptedCount: tbaAcceptedCount,
    submittedValue: Math.round(tbaSubmittedCount * tbaAvgLot),
    workingValue: Math.round(tbaWorkingCount * tbaAvgLot),
    acceptedValue: Math.round(tbaAcceptedCount * tbaAvgLot),
  });

  return auctions;
}

export const AUCTIONS: Auction[] = buildAuctions();

export function auctionById(id: string | null | undefined): Auction | undefined {
  if (!id) return undefined;
  return AUCTIONS.find((a) => a.id === id);
}

/**
 * Auctions aren't inherently tied to a region/district in this data model —
 * they're a separate national list. To support scoping the Auctions tab by
 * region/district, each auction gets a deterministic attribution split
 * across the two regions (summing to 1), and within a region, further split
 * across that region's districts (summing to the region's share). This is
 * illustrative attribution for the mock, not a claim about real geography.
 */
export function getAuctionRegionShare(auctionId: string, regionId: RegionId): number {
  const rng = mulberry32(hashStr(auctionId + "-region-split"));
  const westShare = 0.3 + rng() * 0.4; // 30-70%
  return regionId === "west" ? westShare : 1 - westShare;
}

export function getAuctionDistrictShare(auctionId: string, districtId: string): number {
  const district = REPS.find((r) => r.id === districtId && r.type === "district");
  if (!district) return 0;
  const regionShare = getAuctionRegionShare(auctionId, district.regionId);
  const districtsInRegion = REPS.filter((r) => r.type === "district" && r.regionId === district.regionId);
  const weights = districtsInRegion.map((d) => mulberry32(hashStr(auctionId + "-weight-" + d.id))());
  const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;
  const idx = districtsInRegion.findIndex((d) => d.id === districtId);
  return idx === -1 ? 0 : regionShare * (weights[idx] / totalWeight);
}

export function getAuctionWeeklyTrend(auctionId: string): AuctionWeekPoint[] {
  const auction = AUCTIONS.find((a) => a.id === auctionId);
  if (!auction) return [];
  const rng = mulberry32(hashStr(auctionId + "-trend"));
  const weeks = 6;
  const points: AuctionWeekPoint[] = [];
  for (let w = 0; w < weeks; w++) {
    const progress = (w + 1) / weeks;
    const submitted = Math.round(auction.submittedCount * progress * (0.9 + rng() * 0.15));
    // Accepted ramps up later than submitted; working is always the remainder,
    // so working + accepted == submitted at every week, same as the totals above.
    const rawAccepted = Math.round(auction.acceptedCount * Math.max(0, progress - 0.15) * (0.85 + rng() * 0.2));
    const accepted = Math.min(rawAccepted, submitted);
    const working = submitted - accepted;
    points.push({ label: `Wk ${w + 1}`, submitted, working, accepted });
  }
  return points;
}

export function getAuctionListings(auctionId: string): Listing[] {
  const rng = mulberry32(hashStr(auctionId + "-listings"));
  const auction = AUCTIONS.find((a) => a.id === auctionId);
  if (!auction) return [];
  const total = auction.submittedCount;
  const stages: PipelineStage[] = ["prospect", "working", "signedReady", "closed"];
  return Array.from({ length: total }).map((_, i) => {
    const stage = stages[Math.floor(rng() * stages.length)];
    const rep = REPS[Math.floor(rng() * REPS.length)];
    return {
      id: `${auctionId}-listing-${i}`,
      fips: "",
      countyName: "",
      stateAbbr: rep.regionId,
      repId: rep.type === "territory" || rep.type === "independent" ? rep.id : null,
      stage,
      description: DESCRIPTORS[Math.floor(rng() * DESCRIPTORS.length)],
      value: Math.round((6 + rng() * 30) * 1000),
      auctionId,
      auctionType: auction.auctionType,
    };
  });
}

/* ----------------------------- monthly pipeline ----------------------------- */
// A separate, purpose-built dataset for the "Pipeline by Month" view (mirrors
// the existing BigIron mobile forecasting screen). Kept independent from the
// AUCTIONS array above rather than reworking that model — the Auctions tab
// has its own established shape (submitted/working/accepted) and this avoids
// destabilizing it for what's a different, month-bucketed view of the pipeline.

export type MonthlyAuctionStatus = "sold" | "scheduled" | "unscheduled";

export interface MonthlyAuctionEntry {
  id: string;
  name: string;
  dateLabel: string;
  itemCount: number;
  forecastValue: number;
  soldValue: number;
  status: MonthlyAuctionStatus;
}

export interface MonthlyPipelineEntry {
  id: string;
  label: string;
  auctionCount: number;
  itemCount: number;
  sold: number;
  signed: number;
  unsigned: number;
  /** Sold + Signed + Unsigned — the month's current total forecast. */
  projected: number;
  /** The original baseline forecast set earlier, for comparison against `projected`. */
  originalForecast: number;
  auctions: MonthlyAuctionEntry[];
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface MonthTarget {
  year: number;
  /** 0-indexed, same convention as Date.getMonth() */
  month: number;
}

/** All 12 months of the current calendar year. */
export function getCurrentYearMonths(): MonthTarget[] {
  const year = new Date().getFullYear();
  return Array.from({ length: 12 }, (_, month) => ({ year, month }));
}

/** The 3 months making up the current calendar quarter. */
export function getCurrentQuarterMonths(): MonthTarget[] {
  const now = new Date();
  const quarterStart = Math.floor(now.getMonth() / 3) * 3;
  const year = now.getFullYear();
  return [0, 1, 2].map((i) => ({ year, month: quarterStart + i }));
}

export type AuctionTimeframe = "week" | "month" | "quarter" | "year";

/**
 * Date range (as timestamps) for filtering the Auctions tab by the top-level
 * timeframe selector: This Week = today through next week (~14 days), This
 * Month = the calendar month, This Quarter = the calendar quarter, This Year
 * = the calendar year.
 */
export function getTimeframeDateRange(timeframe: AuctionTimeframe): { start: number; end: number } {
  const now = new Date();
  if (timeframe === "week") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start.getTime() + 14 * 24 * 60 * 60 * 1000);
    return { start: start.getTime(), end: end.getTime() };
  }
  if (timeframe === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return { start: start.getTime(), end: end.getTime() };
  }
  if (timeframe === "quarter") {
    const quarterStart = Math.floor(now.getMonth() / 3) * 3;
    const start = new Date(now.getFullYear(), quarterStart, 1);
    const end = new Date(now.getFullYear(), quarterStart + 3, 0, 23, 59, 59);
    return { start: start.getTime(), end: end.getTime() };
  }
  // year
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
  return { start: start.getTime(), end: end.getTime() };
}

/**
 * Builds the "Pipeline by Month" dataset for a specific, explicit set of
 * (year, month) targets — e.g. all 12 months of the current year, or just
 * the current quarter's 3 months. Months before the current one are treated
 * as fully "sold" (closed); the current and future months mix
 * sold/scheduled/unscheduled auctions, tapering off in volume further out.
 */
export function getMonthlyPipeline(targets: MonthTarget[]): MonthlyPipelineEntry[] {
  const now = new Date();
  const months: MonthlyPipelineEntry[] = [];

  for (const { year, month } of targets) {
    const label = `${MONTH_NAMES[month]} ${year}`;
    const isPast = year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth());
    const isCurrent = year === now.getFullYear() && month === now.getMonth();
    const monthRng = mulberry32(hashStr(label + "-monthly-pipeline"));

    const auctionCount = isPast ? 2 + Math.floor(monthRng() * 8) : 1 + Math.floor(monthRng() * 5);
    const auctions: MonthlyAuctionEntry[] = [];
    let itemCount = 0;
    let sold = 0;
    let signed = 0;
    let unsigned = 0;

    for (let i = 0; i < auctionCount; i++) {
      const aRng = mulberry32(hashStr(label + "-monthly-auction-" + i));
      const items = 1 + Math.floor(aRng() * 90);
      const avgLot = (5 + aRng() * 20) * 1000;
      const forecastValue = Math.round(items * avgLot * (0.85 + aRng() * 0.3));
      const day = 1 + Math.floor(aRng() * 27);
      const dateLabel = `${MONTH_NAMES[month]} ${day}, ${year}`;
      const name = AUCTION_NAMES[Math.floor(aRng() * AUCTION_NAMES.length)];

      let status: MonthlyAuctionStatus;
      let soldValue = 0;
      if (isPast || (isCurrent && aRng() < 0.45)) {
        status = "sold";
        soldValue = Math.round(forecastValue * (0.85 + aRng() * 0.35));
        sold += soldValue;
      } else if (aRng() < 0.7) {
        status = "scheduled";
        signed += Math.round(forecastValue * 0.6);
        unsigned += Math.round(forecastValue * 0.4);
      } else {
        status = "unscheduled";
        unsigned += forecastValue;
      }

      itemCount += items;
      auctions.push({ id: `${label}-monthly-auction-${i}`, name, dateLabel, itemCount: items, forecastValue, soldValue, status });
    }

    const projected = sold + signed + unsigned;
    const originalForecast = Math.round(projected * (0.55 + monthRng() * 0.3));

    months.push({
      id: label,
      label,
      auctionCount,
      itemCount,
      sold,
      signed,
      unsigned,
      projected,
      originalForecast,
      auctions: auctions.sort((a, b) => b.forecastValue - a.forecastValue),
    });
  }

  return months;
}

/**
 * Aggregates the current year's 12 months into 4 quarters — same underlying
 * data as getMonthlyPipeline (so figures stay consistent between the two
 * views), just grouped differently. Used for "This Year", where a 12-tile
 * monthly grid is too granular; quarters are the more useful breakdown.
 */
export function getQuarterlyPipeline(): MonthlyPipelineEntry[] {
  const year = new Date().getFullYear();
  const months = getMonthlyPipeline(getCurrentYearMonths());
  const quarters: MonthlyPipelineEntry[] = [];

  for (let q = 0; q < 4; q++) {
    const group = months.slice(q * 3, q * 3 + 3);
    const auctionCount = group.reduce((s, m) => s + m.auctionCount, 0);
    const itemCount = group.reduce((s, m) => s + m.itemCount, 0);
    const sold = group.reduce((s, m) => s + m.sold, 0);
    const signed = group.reduce((s, m) => s + m.signed, 0);
    const unsigned = group.reduce((s, m) => s + m.unsigned, 0);
    const originalForecast = group.reduce((s, m) => s + m.originalForecast, 0);
    const label = `Q${q + 1} ${year}`;
    quarters.push({
      id: label,
      label,
      auctionCount,
      itemCount,
      sold,
      signed,
      unsigned,
      projected: sold + signed + unsigned,
      originalForecast,
      auctions: group.flatMap((m) => m.auctions).sort((a, b) => b.forecastValue - a.forecastValue),
    });
  }

  return quarters;
}
