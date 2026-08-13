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

/** The 5-phase Overview funnel. `PipelineStage` still drives Territories/
 * Auctions/map data untouched — here `prospect` is split into
 * `unvaluedProspect` and `valuedProspect` so the Overview cards can surface
 * the valuation step as its own phase. */
export type FunnelPhase = "unvaluedProspect" | "valuedProspect" | "working" | "signedReady" | "closed";

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
  /** Combined prospect total (unvaluedProspect + valuedProspect) — kept for existing map/rep-table consumers. */
  prospect: StageAmount;
  /** Split of `prospect` — prospects not yet assigned an estimated value. */
  unvaluedProspect: StageAmount;
  /** Split of `prospect` — prospects that have been valued. unvaluedProspect.count + valuedProspect.count === prospect.count. */
  valuedProspect: StageAmount;
  working: StageAmount;
  signedReady: StageAmount;
  closed: StageAmount;
  /** Unvalued prospects that dropped out of the funnel before ever being valued — no dollar value, since they were never valued. */
  unvaluedProspectLeakageCount: number;
  /** Unvalued prospects that haven't been reached out to yet at all — a subset of unvaluedProspect.count (a prospect can be both uncontacted and, separately, counted in leakage if it never gets contacted in time). */
  unvaluedProspectUncontactedCount: number;
  /** Valued prospects that dropped out before converting to an Unsigned Listing. A count only — leakage $ value is derived from the actual tagged Listing records (see getCountyListings), never stored/randomized separately, so a zero count always implies a zero value. */
  valuedProspectLeakageCount: number;
  /** Unsigned Listings that dropped out before becoming Signed Listings. Count only, same reasoning as above. */
  workingLeakageCount: number;
  /** Signed Listings that dropped out before becoming Sold Actuals. Count only, same reasoning as above. */
  signedReadyLeakageCount: number;
  priorYearClosed: number;
  /** Target GTV for this county for the current period — the "goal" the bars in the UI measure progress against. */
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
  /** Only meaningful when stage === "prospect": whether this prospect has been valued yet (splits Unvalued/Valued Prospects). */
  valued?: boolean;
  /** Meaningful for stage === "prospect" (valued only), "working", and "signedReady": whether this specific listing is the one counted in that phase's Leakage metric (dropped out rather than advancing). Undefined/false = still active. */
  leaked?: boolean;
  /** When the seller was first contacted. Not set for Sold Actuals (closed) — that table shows Auction End Date instead. */
  contactDate?: string;
  contactDateTimestamp?: number;
  /** When the seller signed. Only set for stage "signedReady" and "closed" — the two phases where a signature has actually happened. Always defined for those two stages, never blank. */
  signedDate?: string;
  signedDateTimestamp?: number;
  /** When the item actually sold. Only set for stage "closed" — always defined there, never blank. */
  soldDate?: string;
  soldDateTimestamp?: number;
  /** Seller's commission terms for this listing. */
  commissionOption: CommissionOption;
  /** The equipment/asset category. */
  vertical: Vertical;
  /** Who's selling. */
  sellerType: SellerType;
  /** Latest appraised/actual value — distinct from `value` (the estimated GTV) so a Variance can be shown. Always set for county-sourced listings; for auction-sourced listings, only set once the item has actually sold (stage "closed"). */
  actualValue?: number;
}

export type CommissionOption = "Straight Commission" | "Flat Fee" | "Reserve + Commission" | "Buyer's Premium Split";
export type Vertical =
  | "Row Crop & Tillage"
  | "Cattle & Livestock"
  | "Grain Handling & Storage"
  | "Construction & Excavation"
  | "Dairy"
  | "Hay & Forage"
  | "Irrigation"
  | "Harvest Equipment"
  | "Trucks & Trailers"
  | "Timber & Forestry";
export type SellerType = "Private Owner" | "Dealer / Retailer" | "Bank / Lender" | "Estate" | "Municipality / Government" | "Corporate Fleet";

export type AuctionType = "Equipment" | "Livestock" | "Realty" | "Sullivan Classic Cars" | "Sullivan Equipment" | "Private";

export type EventType = "Single Seller" | "Multi-Seller";
export type LineOfBusiness = "Agriculture" | "Collector Cars" | "Const/Trans" | "Livestock" | "Real Estate";

export interface Auction {
  id: string;
  name: string;
  scheduled: boolean;
  /** True once the auction is fully reconciled — every lot sold, nothing left pending. Only closed auctions ever get a "Total Potential" that's just their Actualized GTV. */
  closed: boolean;
  /** True for an auction that already happened recently but isn't fully reconciled yet — a real mix of sold and still-pending lots. Mutually exclusive with `closed`. */
  live: boolean;
  week: string;
  /** Formatted end date (or expected end date, for the TBA auction). */
  endDate: string;
  /** Raw timestamp backing `endDate` — lets the UI filter by real date ranges (week/month/quarter/year) instead of parsing the formatted string. */
  endDateTimestamp: number;
  auctionType: AuctionType;
  eventType: EventType;
  lineOfBusiness: LineOfBusiness;
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

type LngLat = [number, number];

/** Bounding-box center of a county's geometry — fast and good enough for
 * clustering purposes (doesn't need true area-weighted polygon centroids). */
function centroidOfFeature(feature: any): LngLat | null {
  const geom = feature?.geometry;
  if (!geom) return null;
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
  const visit = (coords: any, depth: number) => {
    if (depth === 0) {
      const [lng, lat] = coords;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    } else {
      for (const c of coords) visit(c, depth - 1);
    }
  };
  const depth = geom.type === "Polygon" ? 2 : geom.type === "MultiPolygon" ? 3 : -1;
  if (depth < 0) return null;
  visit(geom.coordinates, depth);
  if (!isFinite(minLng) || !isFinite(minLat)) return null;
  return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
}

/** Groups counties into `k` geographically-contiguous clusters via a small
 * deterministic k-means pass over their centroids — seeded by spreading
 * initial centers across a longitude sort (rather than randomly), so
 * clusters separate cleanly from the first iteration instead of needing many
 * passes to untangle a random start. Used so each district ends up as one
 * compact patch of neighboring counties instead of scattered picks across
 * the whole region. */
function clusterByGeography(entries: { fips: string; centroid: LngLat }[], k: number): string[][] {
  if (entries.length === 0 || k <= 0) return [];
  if (k >= entries.length) return entries.map((e) => [e.fips]);

  const byLng = [...entries].sort((a, b) => a.centroid[0] - b.centroid[0]);
  const seeds: LngLat[] = Array.from({ length: k }, (_, i) => {
    const idx = Math.min(Math.floor((i + 0.5) * (byLng.length / k)), byLng.length - 1);
    return [...byLng[idx].centroid];
  });

  const assignment = new Array(entries.length).fill(0);
  for (let iter = 0; iter < 8; iter++) {
    for (let i = 0; i < entries.length; i++) {
      const [lng, lat] = entries[i].centroid;
      let best = 0;
      let bestDist = Infinity;
      for (let s = 0; s < seeds.length; s++) {
        const dLng = lng - seeds[s][0];
        const dLat = lat - seeds[s][1];
        const dist = dLng * dLng + dLat * dLat;
        if (dist < bestDist) {
          bestDist = dist;
          best = s;
        }
      }
      assignment[i] = best;
    }
    const sums: [number, number, number][] = Array.from({ length: k }, () => [0, 0, 0]);
    for (let i = 0; i < entries.length; i++) {
      const s = sums[assignment[i]];
      s[0] += entries[i].centroid[0];
      s[1] += entries[i].centroid[1];
      s[2] += 1;
    }
    for (let s = 0; s < k; s++) {
      if (sums[s][2] > 0) seeds[s] = [sums[s][0] / sums[s][2], sums[s][1] / sums[s][2]];
    }
  }

  const clusters: string[][] = Array.from({ length: k }, () => []);
  for (let i = 0; i < entries.length; i++) clusters[assignment[i]].push(entries[i].fips);
  return clusters;
}

/**
 * Run once (idempotent) against the full county GeoJSON before any
 * getCountyRecord() calls that need real rep coverage. Counties are first
 * clustered geographically into each region's districts (so a district is
 * always one contiguous patch of neighboring counties, never scattered
 * picks), then — within its own district's cluster only — each field rep is
 * given a deterministic, skewed-low random target between 1 and
 * MAX_COUNTIES_PER_REP (product of two uniforms → averages ~3-4,
 * occasionally reaches the cap) — matching a realistic territory size
 * instead of every rep maxing out. Counties left over once every rep in a
 * district has been assigned their target stay unassigned — open
 * prospecting territory, same as before.
 */
/**
 * Grows one contiguous, adjacent county group per rep out of a district's
 * own (already-contiguous) pool — a simple nearest-neighbor territory-growth
 * pass: each rep gets a deterministic seed county, then repeatedly claims
 * whichever unclaimed county is nearest to its territory-so-far, until it
 * hits its target size or the pool runs out. Reps with bigger targets go
 * first so they're not left fragmenting whatever's left over.
 */
function growContiguousTerritories(
  clusterFips: string[],
  centroidByFips: Map<string, LngLat>,
  repTargets: { repId: string; target: number }[]
): Map<string, string> {
  const remaining = new Set(clusterFips);
  const assignment = new Map<string, string>();
  const ordered = [...repTargets].sort((a, b) => b.target - a.target);

  for (const { repId, target } of ordered) {
    if (remaining.size === 0) break;
    const remainingArr = Array.from(remaining);
    const seedIdx = Math.floor(mulberry32(hashStr(repId + "-seed"))() * remainingArr.length);
    const seedFips = remainingArr[seedIdx];
    const territory: string[] = [seedFips];
    remaining.delete(seedFips);

    while (territory.length < target && remaining.size > 0) {
      let best: string | null = null;
      let bestDist = Infinity;
      for (const cand of remaining) {
        const [clng, clat] = centroidByFips.get(cand) ?? [0, 0];
        for (const t of territory) {
          const [tlng, tlat] = centroidByFips.get(t) ?? [0, 0];
          const d = (clng - tlng) ** 2 + (clat - tlat) ** 2;
          if (d < bestDist) {
            bestDist = d;
            best = cand;
          }
        }
      }
      if (best == null) break;
      territory.push(best);
      remaining.delete(best);
    }
    for (const f of territory) assignment.set(f, repId);
  }
  return assignment;
}

export function primeCountyAssignments(geo: { features: any[] }) {
  if (assignmentsComputed) return;

  const byRegion = new Map<RegionId, { fips: string; centroid: LngLat }[]>();
  const centroidByFips = new Map<string, LngLat>();
  for (const feature of geo.features) {
    const { fips, stateAbbr } = fipsAndStateFromFeature(feature);
    const region = regionForState(stateAbbr);
    const centroid = centroidOfFeature(feature) ?? [0, 0];
    centroidByFips.set(fips, centroid);
    const list = byRegion.get(region) ?? [];
    list.push({ fips, centroid });
    byRegion.set(region, list);
  }

  REGIONS.forEach((region) => {
    const entries = byRegion.get(region.id) ?? [];
    const districts = REPS.filter((r) => r.type === "district" && r.regionId === region.id);
    const clusters = clusterByGeography(entries, districts.length);

    districts.forEach((dm, di) => {
      const clusterFips = clusters[di] ?? [];

      const fieldReps = REPS.filter((r) => r.parentId === dm.id && (r.type === "territory" || r.type === "independent"));
      const repTargets = fieldReps.map((rep) => {
        const skewRng = mulberry32(hashStr(rep.id + "-territory-size"));
        const skewed = Math.sqrt(skewRng());
        const target = Math.min(MAX_COUNTIES_PER_REP, Math.max(1, Math.round(1 + skewed * (MAX_COUNTIES_PER_REP - 1))));
        return { repId: rep.id, target };
      });

      // Territories are themselves contiguous, adjacent county groups —
      // grown geographically within the district's own cluster, not sliced
      // off a shuffled list.
      const assignment = growContiguousTerritories(clusterFips, centroidByFips, repTargets);
      for (const fips of clusterFips) {
        repAssignment.set(fips, assignment.get(fips) ?? null);
      }
    });
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

const COMMISSION_OPTIONS: CommissionOption[] = ["Straight Commission", "Flat Fee", "Reserve + Commission", "Buyer's Premium Split"];
const VERTICALS: Vertical[] = [
  "Row Crop & Tillage", "Cattle & Livestock", "Grain Handling & Storage", "Construction & Excavation",
  "Dairy", "Hay & Forage", "Irrigation", "Harvest Equipment", "Trucks & Trailers", "Timber & Forestry",
];
const SELLER_TYPES: SellerType[] = ["Private Owner", "Dealer / Retailer", "Bank / Lender", "Estate", "Municipality / Government", "Corporate Fleet"];

export type EstimateConfidence = "High" | "Medium" | "Low";

export interface ListingItem {
  id: string;
  /** Lot # — 2 letters + 4 digits, e.g. "KH7260". */
  lotNumber: string;
  lotDescription: string;
  estimatedGTV: number;
  estimateConfidence: EstimateConfidence;
  /** Not every lot has a target set yet — undefined means untargeted. */
  targetPrice?: number;
  /** Only set once the lot has actually sold — never present otherwise (e.g. Auction TBA, or any not-yet-closed auction). */
  actualGTV?: number;
}

const LOT_NUMBER_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // no I/O, avoids look-alikes

function makeLotNumber(rng: () => number): string {
  const letter = () => LOT_NUMBER_LETTERS[Math.floor(rng() * LOT_NUMBER_LETTERS.length)];
  const digits = String(Math.floor(rng() * 10000)).padStart(4, "0");
  return `${letter()}${letter()}${digits}`;
}

/** Breaks a Listing's total value down into the individual lots/items that
 * make it up — deterministic per listing, so re-expanding shows the same
 * items. `sold` gates whether a lot gets an Actual GTV at all — only items
 * that have actually sold ever get one. */
export function getListingItems(listingId: string, listingValue: number, sold: boolean): ListingItem[] {
  const rng = mulberry32(hashStr(listingId + "-items"));
  const count = 2 + Math.floor(rng() * 5); // 2-6 items
  const confidenceLevels: EstimateConfidence[] = ["High", "Medium", "Low"];
  const weights = Array.from({ length: count }, () => 0.5 + rng());
  const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;

  return Array.from({ length: count }).map((_, i) => {
    const share = weights[i] / totalWeight;
    const estimatedGTV = Math.round(listingValue * share);
    const confidence = confidenceLevels[Math.floor(rng() * confidenceLevels.length)];
    const confidenceMultiplier =
      confidence === "High" ? 0.97 + rng() * 0.06 : confidence === "Medium" ? 0.85 + rng() * 0.15 : 0.65 + rng() * 0.2;
    // About 1 in 5 lots hasn't had a target set yet.
    const hasTarget = rng() > 0.2;
    return {
      id: `${listingId}-item-${i}`,
      lotNumber: makeLotNumber(rng),
      lotDescription: LOT_DESCRIPTORS[Math.floor(rng() * LOT_DESCRIPTORS.length)],
      estimatedGTV,
      estimateConfidence: confidence,
      targetPrice: hasTarget ? Math.round(estimatedGTV * confidenceMultiplier) : undefined,
      actualGTV: sold ? Math.round(estimatedGTV * (0.85 + rng() * 0.3)) : undefined,
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

  // Assigned counties always may carry prospect value. Unassigned counties
  // only get one ~18% of the time — otherwise every gray (no-rep) county
  // would show a prospect signal, which is the opposite of "sprinkled."
  const prospectAmt = rep ? mk(0.9, 4) : rng() < 0.18 ? mk(0.9, 4) : { count: 0, value: 0 };
  const workingAmt = rep ? mk(0.6, 3) : { count: 0, value: 0 };
  const signedReadyAmt = rep ? mk(0.75, 2) : { count: 0, value: 0 };
  const closedAmt = rep ? mk(1.1, 3) : { count: 0, value: 0 };

  // Split prospects into unvalued vs. valued — valued prospects have had an
  // estimate produced, unvalued ones are still waiting. Share is randomized
  // per-county in a moderate band so no county is ever 100% one or the other.
  const valuedShare = 0.35 + rng() * 0.35; // ~35%-70% of prospects already valued
  const valuedProspectCount = Math.min(prospectAmt.count, Math.round(prospectAmt.count * valuedShare));
  const unvaluedProspectCount = prospectAmt.count - valuedProspectCount;
  const valuedProspectValue = Math.round(prospectAmt.value * valuedShare);

  const record: CountyRecord = {
    fips,
    name: rawName,
    stateAbbr,
    regionId,
    repId: rep ? rep.id : null,
    prospect: prospectAmt,
    // Unvalued prospects carry no dollar figure — they haven't been valued yet.
    unvaluedProspect: { count: unvaluedProspectCount, value: 0 },
    valuedProspect: { count: valuedProspectCount, value: valuedProspectValue },
    working: workingAmt,
    signedReady: signedReadyAmt,
    closed: closedAmt,
    // Leakage: rare, by design — most counties/phases have zero leaked
    // listings; a small fraction have exactly one. Counts only —
    // getCountyListings tags the corresponding number of actual Listing
    // records as `leaked`, and the dashboard derives Leakage $ value by
    // summing those real records' values, so a zero leakage count always
    // means a zero leakage value.
    unvaluedProspectLeakageCount: unvaluedProspectCount > 0 && rng() < 0.012 ? 1 : 0,
    // Uncontacted: a real chunk of New Prospects — unlike leakage, this isn't
    // rare. Most brand-new leads simply haven't been reached out to yet.
    unvaluedProspectUncontactedCount: Math.round(unvaluedProspectCount * (0.25 + rng() * 0.3)),
    valuedProspectLeakageCount: valuedProspectCount > 0 && rng() < 0.012 ? 1 : 0,
    workingLeakageCount: workingAmt.count > 0 && rng() < 0.009 ? 1 : 0,
    signedReadyLeakageCount: signedReadyAmt.count > 0 && rng() < 0.006 ? 1 : 0,
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
      // Unsigned Listings haven't signed onto a real sale yet either, so
      // they're always pinned to the single unscheduled Auction TBA.
      // Everything past that point is tied to a real dated auction.
      const auctionId = stage === "prospect" ? null : stage === "working" ? TBA_AUCTION.id : AUCTIONS[Math.floor(rng() * AUCTIONS.length)].id;
      const auctionType = auctionId
        ? AUCTIONS.find((a) => a.id === auctionId)?.auctionType ?? null
        : AUCTION_TYPE_POOL[Math.floor(rng() * AUCTION_TYPE_POOL.length)];

      // Valued/unvalued split (prospects only) and the Leakage tag (valued
      // prospects, Unsigned Listings, Signed Listings) are both deterministic
      // "first N of this block" assignments — matches the counts computed in
      // getCountyRecord so a phase's Leakage Count always equals the number
      // of listings actually tagged `leaked` in that phase.
      let valued: boolean | undefined;
      let leaked: boolean | undefined;
      let uncontacted = false;
      if (stage === "prospect") {
        valued = i < rec.valuedProspect.count;
        leaked = valued ? i < rec.valuedProspectLeakageCount : i - rec.valuedProspect.count < rec.unvaluedProspectLeakageCount;
        uncontacted = !valued && i - rec.valuedProspect.count < rec.unvaluedProspectUncontactedCount;
      } else if (stage === "working") {
        leaked = i < rec.workingLeakageCount;
      } else if (stage === "signedReady") {
        leaked = i < rec.signedReadyLeakageCount;
      }

      const value = Math.round((amt.value / Math.max(amt.count, 1)) * (0.7 + rng() * 0.6));
      // Actual/latest-appraised value jittered off the estimated GTV — gives
      // every listing (any stage) a real Variance without waiting for a sale.
      const actualValue = Math.round(value * (0.85 + rng() * 0.3));

      // Contact date: not meaningful once Sold (that table shows Auction End
      // Date instead), and genuinely absent for prospects who haven't been
      // reached out to yet — otherwise somewhere between ~3 weeks and ~14 months back.
      const contactDateTimestamp =
        stage === "closed" || uncontacted ? undefined : Date.now() - Math.round((21 + rng() * 400) * 24 * 60 * 60 * 1000);

      // Signed date: only meaningful once a seller has actually signed —
      // Signed Listings and Sold Actuals. Somewhere between ~1 and ~90 days back.
      // Guaranteed non-undefined for those two stages — never blank.
      const signedDateTimestamp =
        stage === "signedReady" || stage === "closed" ? Date.now() - Math.round((1 + rng() * 89) * 24 * 60 * 60 * 1000) : undefined;

      // Sold date: only meaningful once actually sold — Sold Actuals only.
      // Always somewhere between signedDateTimestamp and now, so it's both
      // guaranteed non-undefined and chronologically after the signed date.
      const soldDateTimestamp =
        stage === "closed" && signedDateTimestamp != null
          ? signedDateTimestamp + Math.round(rng() * (Date.now() - signedDateTimestamp))
          : undefined;

      listings.push({
        id: `${fips}-${stage}-${i}`,
        fips,
        countyName,
        stateAbbr,
        repId: rec.repId,
        stage,
        description: DESCRIPTORS[Math.floor(rng() * DESCRIPTORS.length)],
        value,
        auctionId,
        auctionType,
        valued,
        leaked,
        contactDateTimestamp,
        contactDate: contactDateTimestamp ? formatAuctionDate(new Date(contactDateTimestamp)) : undefined,
        signedDateTimestamp,
        signedDate: signedDateTimestamp ? formatAuctionDate(new Date(signedDateTimestamp)) : undefined,
        soldDateTimestamp,
        soldDate: soldDateTimestamp ? formatAuctionDate(new Date(soldDateTimestamp)) : undefined,
        commissionOption: COMMISSION_OPTIONS[Math.floor(rng() * COMMISSION_OPTIONS.length)],
        vertical: VERTICALS[Math.floor(rng() * VERTICALS.length)],
        sellerType: SELLER_TYPES[Math.floor(rng() * SELLER_TYPES.length)],
        actualValue,
      });
    }
  });
  return listings;
}

export const STAGE_LABEL: Record<PipelineStage, string> = {
  prospect: "Prospect",
  working: "Unsigned",
  signedReady: "Signed & Ready",
  closed: "Closed",
};

export const STAGE_COLOR: Record<PipelineStage, string> = {
  prospect: "#f97316",
  working: "#2563eb",
  signedReady: "#7c3aed",
  closed: "#16a34a",
};

export const PHASE_LABEL: Record<FunnelPhase, string> = {
  unvaluedProspect: "New Prospects",
  valuedProspect: "Interested Prospects",
  working: "Unsigned Listings",
  signedReady: "Signed Listings",
  closed: "Actualized GTV",
};

export const PHASE_COLOR: Record<FunnelPhase, string> = {
  unvaluedProspect: "#fdba74",
  valuedProspect: "#f97316",
  working: "#2563eb",
  signedReady: "#7c3aed",
  closed: "#16a34a",
};

/** Tooltip copy for each phase's Leakage metric — what it counts as not advancing to the next phase. */
export const LEAKAGE_TOOLTIP: Record<FunnelPhase, string> = {
  unvaluedProspect: "Prospects that did not advance to Valued Prospects. There's no leakage value here since these prospects haven't been valued yet.",
  valuedProspect: "Valued prospects that did not convert to an Unsigned Listing.",
  working: "Unsigned Listings that did not progress to Signed Listings.",
  signedReady: "Signed Listings that did not progress to Sold Actuals.",
  closed: "Sold Actuals is the final phase — there's nothing further for it to leak to.",
};

/* ---------------------------------- auctions -------------------------------- */

const AUCTION_NAMES = [
  "Midwest Ag Equipment", "Southern Row Crop Liquidation", "Rocky Mountain Ranch Dispersal",
  "Texas Panhandle Cattle & Iron", "Great Lakes Dairy Equipment", "Delta Region Farm Auction",
  "Gulf Coast Construction Iron", "Corn Belt Consignment", "High Plains Grain Systems",
  "Appalachian Timber & Ag", "Central Valley Row Crop", "Northeast Dairy Retirement",
  "Southwest Irrigation Equipment", "Pacific Northwest Forestry",
];

export const AUCTION_TYPES: AuctionType[] = ["Equipment", "Livestock", "Realty", "Sullivan Classic Cars", "Sullivan Equipment", "Private"];
// Weighted for generation — Equipment is BigIron's core business, Livestock
// is common, Realty/Sullivan brands/Private sales are smaller niches.
const AUCTION_TYPE_POOL: AuctionType[] = [
  "Equipment", "Equipment", "Equipment", "Equipment",
  "Livestock", "Livestock",
  "Realty", "Sullivan Classic Cars", "Sullivan Equipment", "Private",
];

const EVENT_TYPES: EventType[] = ["Single Seller", "Multi-Seller"];
const LINES_OF_BUSINESS: LineOfBusiness[] = ["Agriculture", "Collector Cars", "Const/Trans", "Livestock", "Real Estate"];

function formatAuctionDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/**
 * Spans 3 months back through 11 months forward, with a handful of
 * real-dated auctions per month — enough density that filtering the
 * Auctions tab by This Week/Month/Quarter/Year actually shows different
 * subsets, rather than the same short list regardless of timeframe. The
 * months in the past are all real, closed (already-sold) auctions.
 */
function buildAuctions(): Auction[] {
  const now = new Date();
  const auctions: Auction[] = [];
  let counter = 0;

  for (let offset = 3; offset >= -11; offset--) {
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

      const daysSinceEnd = (now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000);
      // Past auctions aren't instantly fully reconciled — anything within
      // the last ~10 days is still "live" (a real mix of sold and pending
      // lots); older than that, it's "closed" (everything's settled).
      const live = daysSinceEnd >= 0 && daysSinceEnd <= 10;
      const closed = daysSinceEnd > 10;

      auctions.push({
        id: `auction-${counter++}`,
        name,
        scheduled: true,
        closed,
        live,
        week: endDateLabel,
        endDate: endDateLabel,
        endDateTimestamp: date.getTime(),
        auctionType: AUCTION_TYPE_POOL[Math.floor(aRng() * AUCTION_TYPE_POOL.length)],
        eventType: EVENT_TYPES[Math.floor(aRng() * EVENT_TYPES.length)],
        lineOfBusiness: LINES_OF_BUSINESS[Math.floor(aRng() * LINES_OF_BUSINESS.length)],
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
  // Never closed — it's just a placeholder until it's given a name and date.
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
    closed: false,
    live: false,
    week: `${tbaEndDateLabel} (expected)`,
    endDate: tbaEndDateLabel,
    endDateTimestamp: tbaExpected.getTime(),
    auctionType: AUCTION_TYPE_POOL[Math.floor(tbaRng() * AUCTION_TYPE_POOL.length)],
    eventType: EVENT_TYPES[Math.floor(tbaRng() * EVENT_TYPES.length)],
    lineOfBusiness: LINES_OF_BUSINESS[Math.floor(tbaRng() * LINES_OF_BUSINESS.length)],
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

// Unsigned Listings haven't been scheduled onto any real auction yet, so
// every one of them is pinned to the single unscheduled "Auction TBA" —
// consistent Auction/Auction End Date/Auction Type across the board until
// a listing signs and moves to a real dated auction.
const TBA_AUCTION = AUCTIONS.find((a) => !a.scheduled)!;

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
  // Stage mix follows the auction's real lifecycle:
  //  - Closed: fully reconciled, every lot sold.
  //  - Live: recently happened, a genuine mix of sold and still-pending lots.
  //  - Upcoming (incl. Auction TBA): nothing's sold yet.
  const stages: PipelineStage[] = auction.closed
    ? ["closed"]
    : auction.live
    ? ["working", "signedReady", "closed"]
    : ["prospect", "working", "signedReady"];
  return Array.from({ length: total }).map((_, i) => {
    const stage = stages[Math.floor(rng() * stages.length)];
    const rep = REPS[Math.floor(rng() * REPS.length)];
    const value = Math.round((6 + rng() * 30) * 1000);
    const contactDateTimestamp =
      stage === "closed" ? undefined : Date.now() - Math.round((21 + rng() * 400) * 24 * 60 * 60 * 1000);
    const signedDateTimestamp =
      stage === "signedReady" || stage === "closed" ? Date.now() - Math.round((1 + rng() * 89) * 24 * 60 * 60 * 1000) : undefined;
    const soldDateTimestamp =
      stage === "closed" && signedDateTimestamp != null
        ? signedDateTimestamp + Math.round(rng() * (Date.now() - signedDateTimestamp))
        : undefined;
    // Cancelled: a portion of Unsigned Listings never firmed up.
    const leaked = stage === "working" ? rng() < 0.12 : undefined;
    return {
      id: `${auctionId}-listing-${i}`,
      fips: "",
      countyName: "",
      stateAbbr: rep.regionId,
      repId: rep.type === "territory" || rep.type === "independent" ? rep.id : null,
      stage,
      description: DESCRIPTORS[Math.floor(rng() * DESCRIPTORS.length)],
      value,
      auctionId,
      auctionType: auction.auctionType,
      leaked,
      contactDateTimestamp,
      contactDate: contactDateTimestamp ? formatAuctionDate(new Date(contactDateTimestamp)) : undefined,
      signedDateTimestamp,
      signedDate: signedDateTimestamp ? formatAuctionDate(new Date(signedDateTimestamp)) : undefined,
      soldDateTimestamp,
      soldDate: soldDateTimestamp ? formatAuctionDate(new Date(soldDateTimestamp)) : undefined,
      commissionOption: COMMISSION_OPTIONS[Math.floor(rng() * COMMISSION_OPTIONS.length)],
      vertical: VERTICALS[Math.floor(rng() * VERTICALS.length)],
      sellerType: SELLER_TYPES[Math.floor(rng() * SELLER_TYPES.length)],
      // Only items that have actually sold ever get an Actual GTV.
      actualValue: stage === "closed" ? Math.round(value * (0.85 + rng() * 0.3)) : undefined,
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
