import { useEffect, useMemo, useState, useRef, Fragment } from "react";
import type { FeatureCollection } from "geojson";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, Handshake, Gavel, ChevronDown, ChevronRight,
  CalendarClock, Target, X, ArrowLeft, CheckCircle2, FileText, Users, ArrowUp, ArrowDown, ArrowUpDown, RotateCcw,
  Search, MapPin, ListFilter,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from "@/components/ui/command";

import { TerritoryMap, TerritoryMapHandle } from "./territory-map";
import { COUNTIES_URL, STATUS_COLOR, STATUS_LABEL, fipsFromFeature } from "./territory-map";
import {
  REGIONS, REPS, repById, auctionById, primeCountyAssignments, mulberry32, hashStr,
  getCountyRecord, getCountyListings, getAuctionWeeklyTrend, getAuctionListings,
  getMonthlyPipeline, getQuarterlyPipeline, getCurrentQuarterMonths, FIPS_TO_STATE,
  AUCTIONS, STAGE_LABEL, STAGE_COLOR,
  RegionId, PipelineStage, CountyRecord,
} from "@/data/mockSalesForecastData";

const fmtMoney = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(2)}`;
};
const fmtPct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

/** Darkens a #rrggbb hex color by `amount` (0-1) for a subtle depth ring, without needing a color library. */
function darkenHex(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const r = Math.max(0, Math.floor(((num >> 16) & 0xff) * (1 - amount)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0xff) * (1 - amount)));
  const b = Math.max(0, Math.floor((num & 0xff) * (1 - amount)));
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

const TIMEFRAMES = [
  { id: "week", label: "This Week", factor: 1 / 52 },
  { id: "month", label: "This Month", factor: 1 / 12 },
  { id: "quarter", label: "This Quarter", factor: 1 / 4 },
  { id: "year", label: "This Year", factor: 1 },
] as const;
type TimeframeId = (typeof TIMEFRAMES)[number]["id"];

const STAGE_ORDER: PipelineStage[] = ["prospect", "working", "signedReady", "closed"];
// Rep breakdown panel uses its own order per request: Closed, Signed & Ready, WIP, Prospect.
const REP_STAGE_ORDER: PipelineStage[] = ["closed", "signedReady", "working", "prospect"];

const STAGE_BADGE_CLASS: Record<PipelineStage, string> = {
  closed: "bg-green-50 text-green-700 border-green-200",
  signedReady: "bg-violet-50 text-violet-700 border-violet-200",
  working: "bg-blue-50 text-blue-700 border-blue-200",
  prospect: "bg-orange-50 text-orange-700 border-orange-200",
};

interface RepRollup {
  repId: string;
  counties: number;
  prospect: number;
  working: number;
  signedReady: number;
  closed: number;
}

/* -------------------------- generic table sorting -------------------------- */

type SortDir = "asc" | "desc";
interface SortState {
  key: string;
  dir: SortDir;
}

function compareValues(a: string | number, b: string | number): number {
  if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
  return (a as number) - (b as number);
}

/** Sorts a copy of `rows` by the accessor matching `sort.key`. Falls back to
 * the incoming order (untouched) if no sort is active or the key is unknown —
 * so a table can start in its natural/curated order until a header is clicked. */
function sortRows<T>(rows: T[], sort: SortState, accessors: Record<string, (row: T) => string | number>): T[] {
  const acc = accessors[sort.key];
  if (!acc) return rows;
  const copy = [...rows];
  copy.sort((a, b) => {
    const cmp = compareValues(acc(a), acc(b));
    return sort.dir === "asc" ? cmp : -cmp;
  });
  return copy;
}

/** Local sort state for a single table. `defaultKey` can be "" to start unsorted. */
function useSort(defaultKey: string, defaultDir: SortDir = "desc") {
  const [sort, setSort] = useState<SortState>({ key: defaultKey, dir: defaultDir });
  const onSort = (key: string) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  };
  return { sort, onSort };
}

function SortableHead({
  label,
  sortKey,
  sort,
  onSort,
  align = "left",
  className = "",
}: {
  label: string;
  sortKey: string;
  sort: SortState;
  onSort: (key: string) => void;
  align?: "left" | "right";
  className?: string;
}) {
  const active = sort.key === sortKey;
  return (
    <TableHead className={`${align === "right" ? "text-right" : ""} ${className}`}>
      <button
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1 hover:text-foreground ${align === "right" ? "flex-row-reverse" : ""} ${
          active ? "text-foreground" : ""
        }`}
      >
        {label}
        {active ? (
          sort.dir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-40" />
        )}
      </button>
    </TableHead>
  );
}

/** Small page-local composition on top of Card — not a design-system primitive, just a layout helper for this page. */
function StatCard({
  label,
  value,
  icon,
  accentColor,
  footer,
  onClick,
  active,
  barPct,
  barCaption,
  barColor,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accentColor?: string;
  footer?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  barPct?: number;
  barCaption?: string;
  barColor?: string;
}) {
  // A darker inner ring (not just a solid border) is what reads as "depth" —
  // a flat single-color border on a bright accent color looks flat instead.
  const darkerAccent = accentColor ? darkenHex(accentColor, 0.15) : undefined;

  return (
    <Card
      className={`!py-2 ${onClick ? "cursor-pointer transition-shadow hover:shadow-md" : ""} ${active ? "ring-2 ring-slate-900" : ""}`}
      style={
        accentColor
          ? { border: `2px solid ${accentColor}`, boxShadow: `inset 0 0 0 1px ${darkerAccent}` }
          : undefined
      }
      onClick={onClick}
    >
      <CardContent className="!p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-md ${!accentColor ? "bg-muted text-muted-foreground" : ""}`}
            style={accentColor ? { background: accentColor, color: "#000000" } : undefined}
          >
            {icon}
          </span>
        </div>
        <p className="mt-1.5 text-2xl font-semibold">{value}</p>
        {footer && <div className="mt-0.5 text-xs">{footer}</div>}
        {barPct != null && (
          <div className="mt-2">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full" style={{ width: `${Math.min(Math.max(barPct, 0), 100)}%`, background: barColor ?? "#0f172a" }} />
            </div>
            {barCaption && (
              <p className="mt-1 text-[11px] text-muted-foreground">
                {barPct.toFixed(0)}% {barCaption}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function SalesForecastingDashboard() {
  const [timeframe, setTimeframe] = useState<TimeframeId>("month");
  const [role, setRole] = useState<"forecaster" | "regional" | "district">("forecaster");
  const [teamId, setTeamId] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  const [geo, setGeo] = useState<FeatureCollection | null>(null);
  const [geoError, setGeoError] = useState(false);

  const [selectedFips, setSelectedFips] = useState<string | null>(null);
  const [selectedCountyMeta, setSelectedCountyMeta] = useState<{ name: string; stateAbbr: string } | null>(null);
  const [displayFips, setDisplayFips] = useState<string | null>(null);
  const [displayCountyMeta, setDisplayCountyMeta] = useState<{ name: string; stateAbbr: string } | null>(null);
  useEffect(() => {
    if (selectedFips && selectedCountyMeta) {
      setDisplayFips(selectedFips);
      setDisplayCountyMeta(selectedCountyMeta);
    }
  }, [selectedFips, selectedCountyMeta]);
  const mapCardRef = useRef<HTMLDivElement | null>(null);
  const repsCardRef = useRef<HTMLDivElement | null>(null);
  const territoryMapRef = useRef<TerritoryMapHandle | null>(null);
  // Selects a county everywhere that needs it (map highlight + drill-down
  // panel) and, when requested, scrolls the map into view — used by rows
  // elsewhere on the page (like Reps & Territories) that reference a county
  // but aren't next to the map themselves.
  const focusCounty = (fips: string, name: string, stateAbbr: string, scrollToMap = false) => {
    setSelectedFips(fips);
    setSelectedCountyMeta({ name, stateAbbr });
    if (scrollToMap) mapCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const [expandedRepId, setExpandedRepId] = useState<string | null>(null);
  const [displayRepId, setDisplayRepId] = useState<string | null>(null);
  const [repStageFilter, setRepStageFilter] = useState<PipelineStage | null>(null);

  // Overview tab "research" filters — narrow the KPI cards/trend to a single
  // county, a single rep's book, or a whole state. Most-specific wins:
  // county > rep > state > the existing role/team scope.
  const [countyFilterFips, setCountyFilterFips] = useState<string | null>(null);
  const [countyFilterMeta, setCountyFilterMeta] = useState<{ name: string; stateAbbr: string } | null>(null);
  const [countyQuery, setCountyQuery] = useState("");
  const [countyPopoverOpen, setCountyPopoverOpen] = useState(false);
  const [repFilterId, setRepFilterId] = useState<string | null>(null);
  const [repFilterQuery, setRepFilterQuery] = useState("");
  const [repFilterPopoverOpen, setRepFilterPopoverOpen] = useState(false);
  const [stateFilter, setStateFilter] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Reps & Territories table search (name / state / county)
  const [repSearchQuery, setRepSearchQuery] = useState("");
  useEffect(() => {
    if (expandedRepId) {
      setDisplayRepId(expandedRepId);
      setRepStageFilter(null);
    }
  }, [expandedRepId]);
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(null);
  const [displayStage, setDisplayStage] = useState<PipelineStage | null>(null);
  const [expandedMonthId, setExpandedMonthId] = useState<string | null>(null);
  const [displayMonthId, setDisplayMonthId] = useState<string | null>(null);
  useEffect(() => {
    if (expandedMonthId) setDisplayMonthId(expandedMonthId);
  }, [expandedMonthId]);
  const repRowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});
  const [pendingRepFocus, setPendingRepFocus] = useState<string | null>(null);

  useEffect(() => {
    if (selectedStage) setDisplayStage(selectedStage);
  }, [selectedStage]);

  useEffect(() => {
    let cancelled = false;
    fetch(COUNTIES_URL)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setGeo(data);
      })
      .catch(() => {
        if (!cancelled) setGeoError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const factor = TIMEFRAMES.find((t) => t.id === timeframe)!.factor;
  const showMonthlyPipeline = timeframe === "year" || timeframe === "quarter";
  const monthlyPipeline = useMemo(() => {
    if (timeframe === "year") return getQuarterlyPipeline();
    if (timeframe === "quarter") return getMonthlyPipeline(getCurrentQuarterMonths());
    return [];
  }, [timeframe]);

  const teamOptions = useMemo(() => {
    if (role === "regional") return REGIONS.map((r) => ({ value: r.id, label: r.name }));
    if (role === "district")
      return REPS.filter((r) => r.type === "district").map((d) => ({ value: d.id, label: `${d.name} — District` }));
    return [{ value: "all", label: "All Territories" }];
  }, [role]);

  const handleRoleChange = (v: string) => {
    const next = v as typeof role;
    setRole(next);
    setTeamId(next === "forecaster" ? "all" : next === "regional" ? REGIONS[0].id : REPS.find((r) => r.type === "district")!.id);
  };

  // Jumps to the Territories tab and expands a specific rep's breakdown.
  // Resets role/team scope to "everything" first — otherwise a rep outside
  // the currently-active filter would land on a tab where their row doesn't
  // even render.
  const goToRepBreakdown = (repId: string) => {
    setRole("forecaster");
    setTeamId("all");
    setActiveTab("territories");
    setExpandedRepId(repId);
    setPendingRepFocus(repId);
    setRepSearchQuery(repById(repId)?.name ?? "");
  };

  const visibleRegions: RegionId[] = useMemo(() => {
    if (role === "forecaster" || teamId === "all") return REGIONS.map((r) => r.id);
    if (role === "regional") return [teamId as RegionId];
    if (role === "district") {
      const dm = REPS.find((r) => r.id === teamId);
      return dm ? [dm.regionId] : REGIONS.map((r) => r.id);
    }
    return REGIONS.map((r) => r.id);
  }, [role, teamId]);

  const visibleRepIds = useMemo(() => {
    if (role === "district") return new Set(REPS.filter((r) => r.parentId === teamId).map((r) => r.id));
    return null;
  }, [role, teamId]);

  const { totals, repRollups, countiesByRep, totalsByState } = useMemo(() => {
    const totals = { prospect: 0, prospectAssigned: 0, working: 0, signedReady: 0, closed: 0, priorYearClosed: 0, budget: 0 };
    const rollups = new Map<string, RepRollup>();
    const byRep = new Map<string, CountyRecord[]>();
    const byState = new Map<string, typeof totals>();

    if (geo) {
      primeCountyAssignments(geo);
      for (const feature of geo.features) {
        const fips = fipsFromFeature(feature as any);
        const name = `${(feature.properties as any)?.NAME ?? "Unknown"} County`;
        const rec = getCountyRecord(fips, name);
        if (!visibleRegions.includes(rec.regionId)) continue;

        totals.prospect += rec.prospect.value;
        if (rec.repId) totals.prospectAssigned += rec.prospect.value;
        totals.working += rec.working.value;
        totals.signedReady += rec.signedReady.value;
        totals.closed += rec.closed.value;
        totals.priorYearClosed += rec.priorYearClosed;
        totals.budget += rec.budget;

        const st = byState.get(rec.stateAbbr) ?? { prospect: 0, prospectAssigned: 0, working: 0, signedReady: 0, closed: 0, priorYearClosed: 0, budget: 0 };
        st.prospect += rec.prospect.value;
        if (rec.repId) st.prospectAssigned += rec.prospect.value;
        st.working += rec.working.value;
        st.signedReady += rec.signedReady.value;
        st.closed += rec.closed.value;
        st.priorYearClosed += rec.priorYearClosed;
        st.budget += rec.budget;
        byState.set(rec.stateAbbr, st);

        if (rec.repId) {
          const r = rollups.get(rec.repId) ?? { repId: rec.repId, counties: 0, prospect: 0, working: 0, signedReady: 0, closed: 0 };
          r.counties += 1;
          r.prospect += rec.prospect.value;
          r.working += rec.working.value;
          r.signedReady += rec.signedReady.value;
          r.closed += rec.closed.value;
          rollups.set(rec.repId, r);

          const list = byRep.get(rec.repId) ?? [];
          list.push(rec);
          byRep.set(rec.repId, list);
        }
      }
    }
    return { totals, repRollups: rollups, countiesByRep: byRep, totalsByState: byState };
  }, [geo, visibleRegions]);

  // The Overview "research" filters narrow just the KPI cards/trend below —
  // most specific wins: a single county > a single rep's book > a whole
  // state > the existing role/team scope. Territories tab (map, rep table)
  // is intentionally untouched by these — it already has its own drill-down.
  const overviewTotals = useMemo(() => {
    if (countyFilterFips && countyFilterMeta) {
      const rec = getCountyRecord(countyFilterFips, countyFilterMeta.name);
      return {
        prospect: rec.prospect.value,
        prospectAssigned: rec.repId ? rec.prospect.value : 0,
        working: rec.working.value,
        signedReady: rec.signedReady.value,
        closed: rec.closed.value,
        priorYearClosed: rec.priorYearClosed,
        budget: rec.budget,
      };
    }
    if (repFilterId) {
      const counties = countiesByRep.get(repFilterId) ?? [];
      return counties.reduce(
        (acc, c) => ({
          prospect: acc.prospect + c.prospect.value,
          prospectAssigned: acc.prospectAssigned + (c.repId ? c.prospect.value : 0),
          working: acc.working + c.working.value,
          signedReady: acc.signedReady + c.signedReady.value,
          closed: acc.closed + c.closed.value,
          priorYearClosed: acc.priorYearClosed + c.priorYearClosed,
          budget: acc.budget + c.budget,
        }),
        { prospect: 0, prospectAssigned: 0, working: 0, signedReady: 0, closed: 0, priorYearClosed: 0, budget: 0 }
      );
    }
    if (stateFilter) {
      return totalsByState.get(stateFilter) ?? { prospect: 0, prospectAssigned: 0, working: 0, signedReady: 0, closed: 0, priorYearClosed: 0, budget: 0 };
    }
    return totals;
  }, [countyFilterFips, countyFilterMeta, repFilterId, countiesByRep, stateFilter, totalsByState, totals]);

  const countyMatches = useMemo(() => {
    if (!geo || countyQuery.trim().length < 2) return [];
    const q = countyQuery.trim().toLowerCase();
    const matches: { fips: string; name: string; stateAbbr: string }[] = [];
    for (const feature of geo.features) {
      const fips = fipsFromFeature(feature as any);
      const name = `${(feature.properties as any)?.NAME ?? "Unknown"} County`;
      const stateAbbr = FIPS_TO_STATE[fips.slice(0, 2)] ?? "";
      if (name.toLowerCase().includes(q) || stateAbbr.toLowerCase().includes(q)) {
        matches.push({ fips, name, stateAbbr });
        if (matches.length >= 20) break;
      }
    }
    return matches;
  }, [geo, countyQuery]);

  const allStates = useMemo(() => Array.from(new Set(Object.values(FIPS_TO_STATE))).sort(), []);

  const repFilterMatches = useMemo(() => {
    const pool = REPS.filter((r) => r.type === "territory" || r.type === "independent");
    if (!repFilterQuery.trim()) return pool.slice(0, 30);
    const q = repFilterQuery.trim().toLowerCase();
    return pool.filter((r) => r.name.toLowerCase().includes(q)).slice(0, 30);
  }, [repFilterQuery]);

  const hasOverviewFilter = !!(countyFilterFips || repFilterId || stateFilter);
  const clearOverviewFilters = () => {
    setCountyFilterFips(null);
    setCountyFilterMeta(null);
    setCountyQuery("");
    setRepFilterId(null);
    setRepFilterQuery("");
    setStateFilter(null);
  };

  const scaled = {
    prospect: Math.round(overviewTotals.prospect * factor),
    prospectAssigned: Math.round(overviewTotals.prospectAssigned * factor),
    working: Math.round(overviewTotals.working * factor),
    signedReady: Math.round(overviewTotals.signedReady * factor),
    closed: Math.round(overviewTotals.closed * factor),
    priorYearClosed: Math.round(overviewTotals.priorYearClosed * factor),
    budget: Math.round(overviewTotals.budget * factor),
  };
  const totalPotential = scaled.closed + scaled.signedReady + scaled.working + scaled.prospect;
  const varPct = scaled.priorYearClosed > 0 ? ((scaled.closed - scaled.priorYearClosed) / scaled.priorYearClosed) * 100 : 0;

  // Each card's bar means something different, matched to what's actually
  // being measured rather than one generic "goal" concept:
  //  - Closed: progress toward the targeted budget goal.
  //  - Signed & Ready / Work In Progress: each one's share of the combined
  //    signed+working pool (they're two snapshots of the same in-flight pool).
  //  - Prospects: how much of prospect value sits in rep-covered counties
  //    vs. open/unassigned territory.
  const signedPlusWorking = scaled.signedReady + scaled.working;
  const cardBars = {
    closed: { pct: scaled.budget > 0 ? Math.min((scaled.closed / scaled.budget) * 100, 100) : 0, caption: `of ${fmtMoney(scaled.budget)} targeted goal` },
    signedReady: { pct: signedPlusWorking > 0 ? (scaled.signedReady / signedPlusWorking) * 100 : 0, caption: "of Signed & Ready + Work In Progress" },
    working: { pct: signedPlusWorking > 0 ? (scaled.working / signedPlusWorking) * 100 : 0, caption: "of Signed & Ready + Work In Progress" },
    prospect: { pct: scaled.prospect > 0 ? (scaled.prospectAssigned / scaled.prospect) * 100 : 0, caption: "in counties with a rep assigned" },
  };

  // Deterministic per-timeframe variation so the trend chart shows realistic
  // week-to-week/quarter-to-quarter movement instead of the same ratio
  // scaled by a constant factor (which always looked identical across bars).
  const trendJitter = (key: string) => 0.82 + mulberry32(hashStr(key))() * 0.36;
  const trendData = TIMEFRAMES.map((tf) => ({
    name: tf.label.replace("This ", ""),
    Actual: Math.round(overviewTotals.closed * tf.factor * trendJitter(`${tf.id}-actual`)),
    "Prior Year": Math.round(overviewTotals.priorYearClosed * tf.factor * trendJitter(`${tf.id}-prior`)),
  }));

  const repTableSort = useSort("total", "desc");
  const repTableRows = useMemo(() => {
    let reps = REPS.filter((r) => (r.type === "territory" || r.type === "independent") && visibleRegions.includes(r.regionId));
    if (visibleRepIds) reps = reps.filter((r) => visibleRepIds.has(r.id));
    return reps.map((r) => {
      const roll = repRollups.get(r.id) ?? { repId: r.id, counties: 0, prospect: 0, working: 0, signedReady: 0, closed: 0 };
      const manager = repById(r.parentId);
      return { rep: r, manager, roll, total: roll.prospect + roll.working + roll.signedReady + roll.closed };
    });
  }, [visibleRegions, visibleRepIds, repRollups]);

  const repTableAccessors = {
    name: (r: (typeof repTableRows)[number]) => r.rep.name,
    type: (r: (typeof repTableRows)[number]) => r.rep.type,
    manager: (r: (typeof repTableRows)[number]) => r.manager?.name ?? "",
    counties: (r: (typeof repTableRows)[number]) => r.roll.counties,
    prospect: (r: (typeof repTableRows)[number]) => r.roll.prospect,
    working: (r: (typeof repTableRows)[number]) => r.roll.working,
    signedReady: (r: (typeof repTableRows)[number]) => r.roll.signedReady,
    closed: (r: (typeof repTableRows)[number]) => r.roll.closed,
    total: (r: (typeof repTableRows)[number]) => r.total,
  };
  const repTableSearchFiltered = useMemo(() => {
    if (!repSearchQuery.trim()) return repTableRows;
    const q = repSearchQuery.trim().toLowerCase();
    return repTableRows.filter(({ rep }) => {
      if (rep.name.toLowerCase().includes(q)) return true;
      const counties = countiesByRep.get(rep.id) ?? [];
      return counties.some((c) => c.name.toLowerCase().includes(q) || c.stateAbbr.toLowerCase().includes(q));
    });
  }, [repTableRows, repSearchQuery, countiesByRep]);

  const sortedRepTableRows = useMemo(
    () => sortRows(repTableSearchFiltered, repTableSort.sort, repTableAccessors),
    [repTableSearchFiltered, repTableSort.sort]
  );

  useEffect(() => {
    if (activeTab !== "territories" || !pendingRepFocus) return;
    // scrollIntoView to a specific element wasn't landing reliably — falling
    // back to "scroll whatever's actually scrollable all the way down" is
    // cruder but much harder to silently fail. The rep's detail panel takes
    // 300ms to expand (grid-rows transition), so scrollHeight measured
    // immediately reflects the still-collapsed height — wait for the
    // animation to finish before measuring, or we land short (around the map).
    const timer = setTimeout(() => {
      let el: HTMLElement | null = repsCardRef.current;
      while (el) {
        if (el.scrollHeight > el.clientHeight + 4) {
          el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
          break;
        }
        el = el.parentElement;
      }
      const scroller = document.scrollingElement ?? document.documentElement;
      scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 350);
    setPendingRepFocus(null);
    return () => clearTimeout(timer);
  }, [activeTab, pendingRepFocus]);

  const selectedCountyRecord = displayFips && displayCountyMeta ? getCountyRecord(displayFips, displayCountyMeta.name) : null;
  const selectedCountyListings = displayFips && displayCountyMeta ? getCountyListings(displayFips, displayCountyMeta.name, displayCountyMeta.stateAbbr) : [];

  const countyListingsSort = useSort("value", "desc");
  const countyListingsAccessors = {
    description: (l: (typeof selectedCountyListings)[number]) => l.description,
    stage: (l: (typeof selectedCountyListings)[number]) => l.stage,
    rep: (l: (typeof selectedCountyListings)[number]) => (l.repId ? repById(l.repId)?.name ?? "" : ""),
    auction: (l: (typeof selectedCountyListings)[number]) => (l.auctionId ? auctionById(l.auctionId)?.name ?? "" : ""),
    value: (l: (typeof selectedCountyListings)[number]) => l.value,
  };
  const sortedCountyListings = sortRows(selectedCountyListings, countyListingsSort.sort, countyListingsAccessors);

  const expandedRepListings = useMemo(() => {
    if (!displayRepId) return [];
    const repCounties = countiesByRep.get(displayRepId) ?? [];
    const rows: Array<ReturnType<typeof getCountyListings>[number]> = [];
    repCounties.forEach((c) => rows.push(...getCountyListings(c.fips, c.name, c.stateAbbr)));
    return rows.sort((a, b) => b.value - a.value);
  }, [displayRepId, countiesByRep]);

  const repBreakdownSort = useSort("value", "desc");
  const repBreakdownAccessors = {
    county: (l: (typeof expandedRepListings)[number]) => l.countyName,
    description: (l: (typeof expandedRepListings)[number]) => l.description,
    stage: (l: (typeof expandedRepListings)[number]) => l.stage,
    auction: (l: (typeof expandedRepListings)[number]) => (l.auctionId ? auctionById(l.auctionId)?.name ?? "" : ""),
    value: (l: (typeof expandedRepListings)[number]) => l.value,
  };
  const filteredExpandedRepListings = useMemo(
    () => (repStageFilter ? expandedRepListings.filter((l) => l.stage === repStageFilter) : expandedRepListings),
    [expandedRepListings, repStageFilter]
  );
  const sortedExpandedRepListings = useMemo(
    () => sortRows(filteredExpandedRepListings, repBreakdownSort.sort, repBreakdownAccessors),
    [filteredExpandedRepListings, repBreakdownSort.sort]
  );

  const stageListings = useMemo(() => {
    if (!displayStage || !geo) return [];
    const rows: { fips: string; countyName: string; stateAbbr: string; repId: string | null; description: string; value: number; auctionId: string | null }[] = [];
    for (const feature of geo.features) {
      const fips = fipsFromFeature(feature as any);
      const name = `${(feature.properties as any)?.NAME ?? "Unknown"} County`;
      const rec = getCountyRecord(fips, name);
      if (!visibleRegions.includes(rec.regionId)) continue;
      if (rec[displayStage].count === 0) continue;
      const stateAbbr = rec.stateAbbr;
      const listings = getCountyListings(fips, name, stateAbbr).filter((l) => l.stage === displayStage);
      for (const l of listings) {
        rows.push({ fips, countyName: name, stateAbbr, repId: l.repId, description: l.description, value: l.value, auctionId: l.auctionId });
      }
    }
    return rows.sort((a, b) => b.value - a.value);
  }, [displayStage, geo, visibleRegions]);

  const stageListingsSort = useSort("value", "desc");
  const stageListingsAccessors = {
    county: (l: (typeof stageListings)[number]) => l.countyName,
    description: (l: (typeof stageListings)[number]) => l.description,
    rep: (l: (typeof stageListings)[number]) => (l.repId ? repById(l.repId)?.name ?? "" : ""),
    auction: (l: (typeof stageListings)[number]) => (l.auctionId ? auctionById(l.auctionId)?.name ?? "" : ""),
    value: (l: (typeof stageListings)[number]) => l.value,
  };
  const sortedStageListings = useMemo(
    () => sortRows(stageListings, stageListingsSort.sort, stageListingsAccessors),
    [stageListings, stageListingsSort.sort]
  );

  const scheduledAuctions = AUCTIONS.filter((a) => a.scheduled);
  const tbaAuction = AUCTIONS.find((a) => !a.scheduled) ?? null;
  const selectedAuction = selectedAuctionId ? AUCTIONS.find((a) => a.id === selectedAuctionId) : null;

  // Actual = already-accepted business across confirmed auctions.
  // Projected = that same confirmed set's full submitted pipeline (accepted + still working).
  // Possible = Projected + whatever Auction TBA could add if it lands on the calendar.
  const auctionTotals = {
    actual: scheduledAuctions.reduce((s, a) => s + a.acceptedValue, 0),
    projected: scheduledAuctions.reduce((s, a) => s + a.submittedValue, 0),
    possible: scheduledAuctions.reduce((s, a) => s + a.submittedValue, 0) + (tbaAuction?.submittedValue ?? 0),
  };

  const auctionsSort = useSort("", "asc");
  const auctionsAccessors = {
    name: (a: (typeof AUCTIONS)[number]) => a.name,
    week: (a: (typeof AUCTIONS)[number]) => a.week,
    submitted: (a: (typeof AUCTIONS)[number]) => a.submittedValue,
    working: (a: (typeof AUCTIONS)[number]) => a.workingValue,
    accepted: (a: (typeof AUCTIONS)[number]) => a.acceptedValue,
  };
  const sortedAuctions = useMemo(() => sortRows(AUCTIONS, auctionsSort.sort, auctionsAccessors), [auctionsSort.sort]);

  return (
    <div className="space-y-6">
      {/* Header + filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Sales Forecasting</h1>
          <p className="text-sm text-muted-foreground">Actual sales, work in progress, and prospecting across all territories</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger className="h-8 w-[200px] bg-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="forecaster">Financial Forecaster</SelectItem>
              <SelectItem value="regional">Regional Sales Manager</SelectItem>
              <SelectItem value="district">District Sales Manager</SelectItem>
            </SelectContent>
          </Select>

          {role !== "forecaster" && (
            <Select value={teamId} onValueChange={setTeamId}>
              <SelectTrigger className="h-8 w-[200px] bg-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {teamOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="mx-1 h-5 w-px bg-border" />

          <Select value={timeframe} onValueChange={(v) => setTimeframe(v as TimeframeId)}>
            <SelectTrigger className="h-8 w-[140px] bg-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEFRAMES.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {geoError && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          Couldn't load county boundary data (raw.githubusercontent.com). Map and territory rollups will stay empty until that's reachable.
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="shadow-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="territories">Territories</TabsTrigger>
            <TabsTrigger value="auctions">Auctions</TabsTrigger>
          </TabsList>
          {activeTab === "overview" && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFiltersOpen((o) => !o)}
              className={`h-9 w-9 bg-white shadow-sm ${filtersOpen || hasOverviewFilter ? "border-slate-900" : ""}`}
              title="Research filters"
            >
              <ListFilter className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* ------------------------------- OVERVIEW ------------------------------- */}
        <TabsContent value="overview" className="space-y-4">
          <div
            className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${filtersOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
          >
            <div className="min-h-0 overflow-hidden">
              <Card className="!py-2">
                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 !py-2">
                  <div>
                    <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
                      <ListFilter className="h-4 w-4" />
                      Research Filters
                    </CardTitle>
                    <CardDescription>Narrow the numbers below to a specific state, county, or salesperson</CardDescription>
                  </div>
                  <button onClick={() => setFiltersOpen(false)} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
                    <X className="h-4 w-4" />
                  </button>
                </CardHeader>
                <CardContent className="!pt-0 !pb-3">
                  <div className="flex flex-wrap items-end gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-medium text-muted-foreground">State</span>
                      <Select
                        value={stateFilter ?? "all"}
                        onValueChange={(v) => {
                          const next = v === "all" ? null : v;
                          setStateFilter(next);
                          if (next) {
                            setCountyFilterFips(null);
                            setCountyFilterMeta(null);
                            setRepFilterId(null);
                          }
                        }}
                      >
                        <SelectTrigger className="h-8 w-32 bg-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All states</SelectItem>
                          {allStates.map((st) => (
                            <SelectItem key={st} value={st}>
                              {st}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-medium text-muted-foreground">County</span>
                      <Popover open={countyPopoverOpen} onOpenChange={setCountyPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" role="combobox" className="h-8 w-56 justify-start bg-white text-xs font-normal">
                            <MapPin className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                            <span className="truncate">{countyFilterMeta ? `${countyFilterMeta.name}, ${countyFilterMeta.stateAbbr}` : "Search a county…"}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-0" align="start">
                          <Command shouldFilter={false}>
                            <CommandInput placeholder="Type a county or state…" value={countyQuery} onValueChange={setCountyQuery} />
                            <CommandList>
                              <CommandEmpty>{countyQuery.trim().length < 2 ? "Type at least 2 characters…" : "No counties found."}</CommandEmpty>
                              {countyMatches.map((c) => (
                                <CommandItem
                                  key={c.fips}
                                  onSelect={() => {
                                    setCountyFilterFips(c.fips);
                                    setCountyFilterMeta({ name: c.name, stateAbbr: c.stateAbbr });
                                    setRepFilterId(null);
                                    setStateFilter(null);
                                    setCountyPopoverOpen(false);
                                  }}
                                >
                                  {c.name}, {c.stateAbbr}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-medium text-muted-foreground">Salesperson</span>
                      <Popover open={repFilterPopoverOpen} onOpenChange={setRepFilterPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" role="combobox" className="h-8 w-56 justify-start bg-white text-xs font-normal">
                            <Users className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                            <span className="truncate">{repFilterId ? repById(repFilterId)?.name : "Search a salesperson…"}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-0" align="start">
                          <Command shouldFilter={false}>
                            <CommandInput placeholder="Type a name…" value={repFilterQuery} onValueChange={setRepFilterQuery} />
                            <CommandList>
                              <CommandEmpty>No salespeople found.</CommandEmpty>
                              {repFilterMatches.map((r) => (
                                <CommandItem
                                  key={r.id}
                                  onSelect={() => {
                                    setRepFilterId(r.id);
                                    setCountyFilterFips(null);
                                    setCountyFilterMeta(null);
                                    setStateFilter(null);
                                    setRepFilterPopoverOpen(false);
                                  }}
                                >
                                  {r.name}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {hasOverviewFilter && (
                      <Button variant="ghost" size="sm" onClick={clearOverviewFilters} className="h-8 text-xs text-muted-foreground">
                        <X className="mr-1 h-3.5 w-3.5" />
                        Clear filters
                      </Button>
                    )}
                  </div>

                  {hasOverviewFilter && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Showing figures for{" "}
                      <span className="font-medium text-foreground">
                        {countyFilterMeta
                          ? `${countyFilterMeta.name}, ${countyFilterMeta.stateAbbr}`
                          : repFilterId
                          ? repById(repFilterId)?.name
                          : stateFilter}
                      </span>{" "}
                      only — role/timeframe filters above still apply everywhere else.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              label="Actual Sales (Closed)"
              value={fmtMoney(scaled.closed)}
              icon={<Target className="h-4 w-4" />}
              onClick={() => setSelectedStage(selectedStage === "closed" ? null : "closed")}
              active={selectedStage === "closed"}
              barPct={cardBars.closed.pct}
              barCaption={cardBars.closed.caption}
              barColor={STAGE_COLOR.closed}
              footer={
                <div className="flex items-center gap-1">
                  {varPct >= 0 ? <TrendingUp className="h-3.5 w-3.5 text-green-600" /> : <TrendingDown className="h-3.5 w-3.5 text-red-600" />}
                  <span className={varPct >= 0 ? "text-green-600" : "text-red-600"}>{fmtPct(varPct)}</span>
                  <span className="text-muted-foreground">vs prior year</span>
                </div>
              }
            />
            <StatCard
              label="Signed & Ready"
              value={fmtMoney(scaled.signedReady)}
              icon={<CheckCircle2 className="h-4 w-4" />}
              onClick={() => setSelectedStage(selectedStage === "signedReady" ? null : "signedReady")}
              active={selectedStage === "signedReady"}
              barPct={cardBars.signedReady.pct}
              barCaption={cardBars.signedReady.caption}
              barColor={STAGE_COLOR.signedReady}
              footer={<span className="text-muted-foreground">Signed, awaiting sale</span>}
            />
            <StatCard
              label="Work In Progress"
              value={fmtMoney(scaled.working)}
              icon={<Handshake className="h-4 w-4" />}
              onClick={() => setSelectedStage(selectedStage === "working" ? null : "working")}
              active={selectedStage === "working"}
              barPct={cardBars.working.pct}
              barCaption={cardBars.working.caption}
              barColor={STAGE_COLOR.working}
              footer={<span className="text-muted-foreground">Not yet signed</span>}
            />
            <StatCard
              label="Prospects"
              value={fmtMoney(scaled.prospect)}
              icon={<Users className="h-4 w-4" />}
              onClick={() => setSelectedStage(selectedStage === "prospect" ? null : "prospect")}
              active={selectedStage === "prospect"}
              barPct={cardBars.prospect.pct}
              barCaption={cardBars.prospect.caption}
              barColor={STAGE_COLOR.prospect}
              footer={<span className="text-muted-foreground">Not yet contacted</span>}
            />
            <StatCard
              label="Total Potential"
              value={fmtMoney(totalPotential)}
              icon={<Gavel className="h-4 w-4" />}
              accentColor="#ffc901"
              footer={<span className="text-muted-foreground">Sum of all four</span>}
            />
          </div>

          <div
            className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${selectedStage ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            onTransitionEnd={() => {
              if (!selectedStage) setDisplayStage(null);
            }}
          >
            <div className="min-h-0 overflow-hidden">
              {displayStage && (
                <Card className="!py-2">
                  <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 !py-2">
                    <div>
                      <CardTitle className="text-sm font-semibold">{STAGE_LABEL[displayStage]} Listings</CardTitle>
                      <CardDescription>
                        {stageListings.length} listings across {visibleRegions.length === REGIONS.length ? "all regions" : "the selected scope"}
                      </CardDescription>
                    </div>
                    <button onClick={() => setSelectedStage(null)} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
                      <X className="h-4 w-4" />
                    </button>
                  </CardHeader>
                  <CardContent className="!p-0">
                    <div className="max-h-96 overflow-y-auto [&>div]:overflow-visible">
                      <Table>
                        <TableHeader className="sticky top-0 z-10 bg-background">
                          <TableRow>
                            <SortableHead label="County" sortKey="county" sort={stageListingsSort.sort} onSort={stageListingsSort.onSort} />
                            <SortableHead label="Listing" sortKey="description" sort={stageListingsSort.sort} onSort={stageListingsSort.onSort} />
                            <SortableHead label="Rep" sortKey="rep" sort={stageListingsSort.sort} onSort={stageListingsSort.onSort} />
                            {displayStage === "closed" && (
                              <SortableHead label="Auction" sortKey="auction" sort={stageListingsSort.sort} onSort={stageListingsSort.onSort} />
                            )}
                            <SortableHead label="Value" sortKey="value" sort={stageListingsSort.sort} onSort={stageListingsSort.onSort} align="right" />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedStageListings.map((l, i) => (
                            <TableRow key={`${l.fips}-${i}`}>
                              <TableCell className="text-muted-foreground">
                                {l.countyName}, {l.stateAbbr}
                              </TableCell>
                              <TableCell>{l.description}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {l.repId ? (
                                  <button
                                    onClick={() => goToRepBreakdown(l.repId!)}
                                    className="text-foreground underline-offset-2 hover:underline"
                                  >
                                    {repById(l.repId)?.name}
                                  </button>
                                ) : (
                                  "Unassigned"
                                )}
                              </TableCell>
                              {displayStage === "closed" && (
                                <TableCell className="text-muted-foreground">{l.auctionId ? auctionById(l.auctionId)?.name : "—"}</TableCell>
                              )}
                              <TableCell className="text-right font-medium">{fmtMoney(l.value)}</TableCell>
                            </TableRow>
                          ))}
                          {stageListings.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={displayStage === "closed" ? 5 : 4} className="py-8 text-center text-muted-foreground">
                                {geo ? "No listings at this stage in the current scope." : "Waiting on county data to load…"}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <Card className="!py-2">
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 !py-2">
              <div>
                <CardTitle className="text-sm font-semibold">Actual vs. Prior Year</CardTitle>
                <CardDescription>Same totals as above, compared across timeframes</CardDescription>
              </div>
              <div className="flex items-center gap-3 pt-0.5">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-sm bg-slate-900" />
                  This Year
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-sm bg-slate-300" />
                  Last Year
                </div>
              </div>
            </CardHeader>
            <CardContent className="!pt-0 !pb-2">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {trendData.map((row) => {
                  const priorYear = row["Prior Year"];
                  const max = Math.max(row.Actual, priorYear, 1);
                  return (
                    <div key={row.name} className="rounded-lg border-2 p-3">
                      <p className="mb-2 text-xs font-medium text-muted-foreground">{row.name}</p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-slate-900" style={{ width: `${(row.Actual / max) * 100}%` }} />
                          </div>
                          <span className="w-16 shrink-0 text-right text-xs font-semibold">{fmtMoney(row.Actual)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-slate-300" style={{ width: `${(priorYear / max) * 100}%` }} />
                          </div>
                          <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">{fmtMoney(priorYear)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Pipeline by Month/Quarter — only meaningful for Year/Quarter, where the bucket is well-defined */}
          {showMonthlyPipeline && (
            <Card className="!py-2">
              <CardHeader className="!py-2">
                <CardTitle className="text-sm font-semibold">{timeframe === "year" ? "Pipeline by Quarter" : "Pipeline by Month"}</CardTitle>
                <CardDescription>
                  {timeframe === "year" ? "This year" : "This quarter"} · {monthlyPipeline.reduce((s, m) => s + m.auctionCount, 0)} auctions ·{" "}
                  {monthlyPipeline.reduce((s, m) => s + m.itemCount, 0)} items
                </CardDescription>
              </CardHeader>
              <CardContent className="!py-2">
                <div className={`grid gap-5 ${timeframe === "quarter" ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
                  {monthlyPipeline.map((m) => {
                    const isOpen = expandedMonthId === m.id;
                    return (
                      <div key={m.id} className="overflow-hidden rounded-lg border-2">
                        <button
                          onClick={() => setExpandedMonthId(isOpen ? null : m.id)}
                          className={`flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-muted/40 ${isOpen ? "bg-muted/40" : ""}`}
                        >
                          <div>
                            <p className="text-sm font-semibold leading-tight !mb-2">{m.label}</p>
                            <p className="text-xs leading-tight text-muted-foreground">
                              {m.auctionCount} auctions · {m.itemCount} items
                            </p>
                          </div>
                          {isOpen ? <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
                        </button>

                        <div className="grid grid-cols-2 gap-3 border-t px-4 py-3">
                          <div className="border-l-4 pl-2" style={{ borderColor: STAGE_COLOR.closed }}>
                            <p className="text-[11px] leading-tight text-muted-foreground">Sold</p>
                            <p className="text-sm font-semibold leading-tight">{fmtMoney(m.sold)}</p>
                          </div>
                          <div className="border-l-4 pl-2" style={{ borderColor: STAGE_COLOR.signedReady }}>
                            <p className="text-[11px] leading-tight text-muted-foreground">Signed</p>
                            <p className="text-sm font-semibold leading-tight">{fmtMoney(m.signed)}</p>
                          </div>
                          <div className="border-l-4 pl-2" style={{ borderColor: STAGE_COLOR.working }}>
                            <p className="text-[11px] leading-tight text-muted-foreground">Unsigned</p>
                            <p className="text-sm font-semibold leading-tight">{fmtMoney(m.unsigned)}</p>
                          </div>
                          <div className="border-l-4 pl-2" style={{ borderColor: "#d97706" }}>
                            <p className="text-[11px] leading-tight text-muted-foreground">Projected</p>
                            <p className="text-sm font-semibold leading-tight text-amber-600">{fmtMoney(m.projected)}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground">
                          <span>Original Forecast</span>
                          <span className="font-medium text-foreground">{fmtMoney(m.originalForecast)}</span>
                        </div>

                        <div
                          className={`grid overflow-hidden border-t transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-t-0"}`}
                          onTransitionEnd={() => {
                            if (!isOpen && displayMonthId === m.id) setDisplayMonthId(null);
                          }}
                        >
                          <div className="min-h-0 overflow-hidden divide-y">
                            {displayMonthId === m.id &&
                              m.auctions.map((a) => (
                                <div key={a.id} className="flex items-center justify-between gap-3 px-4 py-3">
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">{a.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {a.dateLabel} · {a.itemCount} items
                                    </p>
                                  </div>
                                  <div className="flex shrink-0 items-center gap-3">
                                    <div className="text-right">
                                      <p className="text-[11px] text-muted-foreground">Forecast</p>
                                      <p className="text-xs font-medium">{fmtMoney(a.forecastValue)}</p>
                                    </div>
                                    {a.status === "sold" && (
                                      <div className="text-right">
                                        <p className="text-[11px] text-muted-foreground">Sold</p>
                                        <p className="text-xs font-medium text-green-600">{fmtMoney(a.soldValue)}</p>
                                      </div>
                                    )}
                                    <Badge
                                      variant="outline"
                                      className={
                                        a.status === "sold"
                                          ? "bg-green-50 text-green-700 border-green-200"
                                          : a.status === "scheduled"
                                          ? "bg-blue-50 text-blue-700 border-blue-200"
                                          : "bg-orange-50 text-orange-700 border-orange-200"
                                      }
                                    >
                                      {a.status === "sold" ? "Sold" : a.status === "scheduled" ? "Scheduled" : "Unscheduled"}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ----------------------------- TERRITORIES ----------------------------- */}
        <TabsContent value="territories" className="space-y-4">
          <div ref={mapCardRef}>
            <Card className="!py-2">
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 !py-2">
                <div>
                  <CardTitle className="text-sm font-semibold">Coverage Map</CardTitle>
                  <CardDescription>Click a county for its full pipeline breakdown</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden gap-3 sm:flex">
                    {(Object.keys(STATUS_COLOR) as (keyof typeof STATUS_COLOR)[]).map((k) => (
                      <div key={k} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: STATUS_COLOR[k] }} />
                        {STATUS_LABEL[k]}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => territoryMapRef.current?.resetView()}
                    className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset view
                  </button>
                </div>
              </CardHeader>
              <CardContent className="!py-2">
                <div className="h-[520px]">
                  <TerritoryMap
                    ref={territoryMapRef}
                    geo={geo}
                    visibleRegions={visibleRegions}
                    selectedFips={selectedFips}
                    selectedCountyMeta={selectedCountyMeta}
                    onSelectCounty={(fips, name, stateAbbr) => {
                      setSelectedFips(fips);
                      setSelectedCountyMeta({ name, stateAbbr });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* County drill-down: all four pipeline stages at once, slides open/closed */}
          <div
            className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${selectedFips ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            onTransitionEnd={() => {
              if (!selectedFips) {
                setDisplayFips(null);
                setDisplayCountyMeta(null);
              }
            }}
          >
            <div className="min-h-0 overflow-hidden">
              {displayCountyMeta && selectedCountyRecord && (
                <Card className="!py-2">
                  <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 !py-2">
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        {displayCountyMeta.name}, {displayCountyMeta.stateAbbr}
                      </CardTitle>
                      <CardDescription>
                        {selectedCountyRecord.repId ? `Rep: ${repById(selectedCountyRecord.repId)?.name}` : "No rep assigned — open prospecting territory"} · figures
                        for {TIMEFRAMES.find((t) => t.id === timeframe)!.label.toLowerCase()}
                      </CardDescription>
                    </div>
                    <button onClick={() => setSelectedFips(null)} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
                      <X className="h-4 w-4" />
                    </button>
                  </CardHeader>
                  <CardContent className="space-y-4 !py-2">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {STAGE_ORDER.map((stage) => (
                        <div key={stage} className="rounded-lg border p-3">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <span className="h-2 w-2 rounded-full" style={{ background: STAGE_COLOR[stage] }} />
                            {STAGE_LABEL[stage]}
                          </div>
                          <p className="mt-1 text-lg font-semibold">{fmtMoney(selectedCountyRecord[stage].value * factor)}</p>
                          <p className="text-xs text-muted-foreground">{selectedCountyRecord[stage].count} listings</p>
                        </div>
                      ))}
                    </div>

                    <div className="max-h-72 overflow-y-auto rounded-md border [&>div]:overflow-visible">
                      <Table>
                        <TableHeader className="sticky top-0 z-10 bg-background">
                          <TableRow>
                            <SortableHead label="Listing" sortKey="description" sort={countyListingsSort.sort} onSort={countyListingsSort.onSort} />
                            <SortableHead label="Stage" sortKey="stage" sort={countyListingsSort.sort} onSort={countyListingsSort.onSort} />
                            <SortableHead label="Rep" sortKey="rep" sort={countyListingsSort.sort} onSort={countyListingsSort.onSort} />
                            <SortableHead label="Auction" sortKey="auction" sort={countyListingsSort.sort} onSort={countyListingsSort.onSort} />
                            <SortableHead label="Value" sortKey="value" sort={countyListingsSort.sort} onSort={countyListingsSort.onSort} align="right" />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedCountyListings.map((l) => (
                            <TableRow key={l.id}>
                              <TableCell className="text-foreground">{l.description}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={STAGE_BADGE_CLASS[l.stage]}>
                                  {STAGE_LABEL[l.stage]}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{l.repId ? repById(l.repId)?.name : "Unassigned"}</TableCell>
                              <TableCell className="text-muted-foreground">{l.auctionId ? auctionById(l.auctionId)?.name : "—"}</TableCell>
                              <TableCell className="text-right font-medium">{fmtMoney(l.value)}</TableCell>
                            </TableRow>
                          ))}
                          {sortedCountyListings.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                                No listings recorded for this county yet.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Reps, tied to their actual assigned counties + listings */}
          <div ref={repsCardRef}>
            <Card className="!py-2">
              <CardHeader className="!py-2">
                <CardTitle className="text-sm font-semibold">Reps & Territories</CardTitle>
                <CardDescription>
                  Territory Managers and Independent Sales Reps, ranked by total pipeline for {TIMEFRAMES.find((t) => t.id === timeframe)!.label.toLowerCase()} · click a rep for their full breakdown
                </CardDescription>
              </CardHeader>
              <CardContent className="!p-0">
                <div className="border-b px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={repSearchQuery}
                        onChange={(e) => setRepSearchQuery(e.target.value)}
                        placeholder="Search by rep name, state, or county…"
                        className="h-8 bg-white pl-8 text-xs"
                      />
                    </div>
                    {repSearchQuery && (
                      <button onClick={() => setRepSearchQuery("")} className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline">
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-[600px] overflow-y-auto [&>div]:overflow-visible">
                  <Table>
                  <TableHeader className="sticky top-0 z-10 bg-background">
                    <TableRow>
                      <TableHead className="w-8" />
                      <SortableHead label="Rep" sortKey="name" sort={repTableSort.sort} onSort={repTableSort.onSort} />
                      <SortableHead label="Type" sortKey="type" sort={repTableSort.sort} onSort={repTableSort.onSort} />
                      <SortableHead label="District Manager" sortKey="manager" sort={repTableSort.sort} onSort={repTableSort.onSort} />
                      <SortableHead label="Counties" sortKey="counties" sort={repTableSort.sort} onSort={repTableSort.onSort} align="right" />
                      <SortableHead label="Prospect" sortKey="prospect" sort={repTableSort.sort} onSort={repTableSort.onSort} align="right" />
                    <SortableHead label="Work In Progress" sortKey="working" sort={repTableSort.sort} onSort={repTableSort.onSort} align="right" />
                    <SortableHead label="Signed & Ready" sortKey="signedReady" sort={repTableSort.sort} onSort={repTableSort.onSort} align="right" />
                    <SortableHead label="Closed" sortKey="closed" sort={repTableSort.sort} onSort={repTableSort.onSort} align="right" />
                    <SortableHead label="Total" sortKey="total" sort={repTableSort.sort} onSort={repTableSort.onSort} align="right" className="pr-6" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRepTableRows.map(({ rep, manager, roll, total }) => {
                    const isOpen = expandedRepId === rep.id;
                    const repCounties = countiesByRep.get(rep.id) ?? [];
                    return (
                      <Fragment key={rep.id}>
                        <TableRow
                          ref={(el) => {
                            repRowRefs.current[rep.id] = el;
                          }}
                          className="scroll-mt-10 cursor-pointer"
                          onClick={() => setExpandedRepId(isOpen ? null : rep.id)}
                        >
                          <TableCell>{isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}</TableCell>
                          <TableCell className="font-medium">{rep.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{rep.type === "territory" ? "Territory Manager" : "Independent Sales Rep"}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{manager?.name ?? "—"}</TableCell>
                          <TableCell className="text-right">{roll.counties}</TableCell>
                          <TableCell className="text-right">{fmtMoney(roll.prospect * factor)}</TableCell>
                          <TableCell className="text-right">{fmtMoney(roll.working * factor)}</TableCell>
                          <TableCell className="text-right">{fmtMoney(roll.signedReady * factor)}</TableCell>
                          <TableCell className="text-right">{fmtMoney(roll.closed * factor)}</TableCell>
                          <TableCell className="pr-6 text-right font-semibold">{fmtMoney(total * factor)}</TableCell>
                        </TableRow>
                        {(isOpen || displayRepId === rep.id) && (
                          <TableRow>
                            <TableCell />
                            <TableCell colSpan={9} className="p-0">
                              <div
                                className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                                onTransitionEnd={() => {
                                  if (!isOpen && displayRepId === rep.id) setDisplayRepId(null);
                                }}
                              >
                                <div className="min-h-0 overflow-hidden">
                                  <div className="mx-2 my-2 rounded-lg border bg-muted/40 p-3">
                                    <p className="mb-3 text-xs font-medium text-muted-foreground">
                                      {repCounties.length} {repCounties.length === 1 ? "county" : "counties"} assigned to {rep.name} · figures for{" "}
                                      {TIMEFRAMES.find((t) => t.id === timeframe)!.label.toLowerCase()}
                                    </p>
                                    <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                      {REP_STAGE_ORDER.map((stage) => {
                                        const isActive = repStageFilter === stage;
                                        return (
                                          <button
                                            key={stage}
                                            onClick={() => setRepStageFilter(isActive ? null : stage)}
                                            className={`rounded-md border bg-background p-2.5 text-left transition-colors hover:border-foreground/30 ${
                                              isActive ? "ring-2 ring-offset-1" : ""
                                            }`}
                                            style={isActive ? ({ ["--tw-ring-color" as any]: STAGE_COLOR[stage] } as React.CSSProperties) : undefined}
                                          >
                                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                                              <span className="h-2 w-2 rounded-full" style={{ background: STAGE_COLOR[stage] }} />
                                              {STAGE_LABEL[stage]}
                                            </div>
                                            <p className="mt-1 text-sm font-semibold">{fmtMoney(roll[stage] * factor)}</p>
                                          </button>
                                        );
                                      })}
                                    </div>
                                    {repStageFilter && (
                                      <div className="mb-3 flex items-center justify-between rounded-md bg-muted/60 px-3 py-1.5 text-xs">
                                        <span className="text-muted-foreground">
                                          Filtered to <span className="font-medium text-foreground">{STAGE_LABEL[repStageFilter]}</span>
                                        </span>
                                        <button onClick={() => setRepStageFilter(null)} className="font-medium text-foreground hover:underline">
                                          Clear
                                        </button>
                                      </div>
                                    )}
                                    <div className="max-h-72 overflow-y-auto rounded-md border bg-background [&>div]:overflow-visible">
                                      <Table>
                                        <TableHeader className="sticky top-0 z-10 bg-background">
                                          <TableRow>
                                            <SortableHead label="County" sortKey="county" sort={repBreakdownSort.sort} onSort={repBreakdownSort.onSort} />
                                            <SortableHead label="Listing" sortKey="description" sort={repBreakdownSort.sort} onSort={repBreakdownSort.onSort} />
                                            <SortableHead label="Stage" sortKey="stage" sort={repBreakdownSort.sort} onSort={repBreakdownSort.onSort} />
                                            <SortableHead label="Auction" sortKey="auction" sort={repBreakdownSort.sort} onSort={repBreakdownSort.onSort} />
                                            <SortableHead label="Value" sortKey="value" sort={repBreakdownSort.sort} onSort={repBreakdownSort.onSort} align="right" />
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {sortedExpandedRepListings.map((l) => (
                                            <TableRow
                                              key={l.id}
                                              className="cursor-pointer"
                                              onClick={() => focusCounty(l.fips, l.countyName, l.stateAbbr, true)}
                                            >
                                              <TableCell className="text-muted-foreground">
                                                {l.countyName}, {l.stateAbbr}
                                              </TableCell>
                                              <TableCell>{l.description}</TableCell>
                                              <TableCell>
                                                <Badge variant="outline" className={STAGE_BADGE_CLASS[l.stage]}>
                                                  {STAGE_LABEL[l.stage]}
                                                </Badge>
                                              </TableCell>
                                              <TableCell className="text-muted-foreground">{l.auctionId ? auctionById(l.auctionId)?.name : "—"}</TableCell>
                                              <TableCell className="text-right font-medium">{fmtMoney(l.value)}</TableCell>
                                            </TableRow>
                                          ))}
                                          {sortedExpandedRepListings.length === 0 && (
                                            <TableRow>
                                              <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                                                {repStageFilter
                                                  ? `No ${STAGE_LABEL[repStageFilter]} listings for this rep.`
                                                  : "No listings recorded for this rep's counties yet."}
                                              </TableCell>
                                            </TableRow>
                                          )}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })}
                  {sortedRepTableRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} className="py-8 text-center text-muted-foreground">
                        {!geo ? "Waiting on county data to load…" : repSearchQuery ? "No reps match that search." : "No reps in scope for this filter."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        {/* ------------------------------- AUCTIONS ------------------------------- */}
        <TabsContent value="auctions" className="space-y-4">
          {!selectedAuction ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Actual" value={fmtMoney(auctionTotals.actual)} icon={<CheckCircle2 className="h-4 w-4" />} footer={<span className="text-muted-foreground">Already-accepted, confirmed auctions</span>} />
                <StatCard label="Projected" value={fmtMoney(auctionTotals.projected)} icon={<Target className="h-4 w-4" />} footer={<span className="text-muted-foreground">Accepted + working, confirmed auctions</span>} />
                <StatCard label="Possible" value={fmtMoney(auctionTotals.possible)} icon={<Gavel className="h-4 w-4" />} footer={<span className="text-muted-foreground">Projected + Auction TBA</span>} />
              </div>

              <Card className="!py-2">
                <CardHeader className="!py-2">
                  <CardTitle className="text-sm font-semibold">Weekly Auction Forecast</CardTitle>
                  <CardDescription>Click an auction for its week-by-week detail</CardDescription>
                </CardHeader>
                <CardContent className="!p-0">
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-background">
                      <TableRow>
                        <SortableHead label="Auction" sortKey="name" sort={auctionsSort.sort} onSort={auctionsSort.onSort} />
                        <SortableHead label="Week" sortKey="week" sort={auctionsSort.sort} onSort={auctionsSort.onSort} />
                        <SortableHead label="Submitted" sortKey="submitted" sort={auctionsSort.sort} onSort={auctionsSort.onSort} align="right" />
                        <SortableHead label="Working" sortKey="working" sort={auctionsSort.sort} onSort={auctionsSort.onSort} align="right" />
                        <SortableHead label="Accepted" sortKey="accepted" sort={auctionsSort.sort} onSort={auctionsSort.onSort} align="right" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedAuctions.map((a) => (
                        <TableRow
                          key={a.id}
                          className={`cursor-pointer ${!a.scheduled ? "bg-orange-50/60 hover:bg-orange-50" : ""}`}
                          onClick={() => setSelectedAuctionId(a.id)}
                        >
                          <TableCell className="font-medium">
                            <span className="inline-flex items-center gap-1.5">
                              {a.name}
                              {!a.scheduled && <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">TBA</Badge>}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <CalendarClock className="h-3.5 w-3.5" />
                              {a.week}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {a.submittedCount} · {fmtMoney(a.submittedValue)}
                          </TableCell>
                          <TableCell className="text-right">
                            {a.workingCount} · {fmtMoney(a.workingValue)}
                          </TableCell>
                          <TableCell className="text-right">
                            {a.acceptedCount} · {fmtMoney(a.acceptedValue)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          ) : (
            <AuctionDetail auctionId={selectedAuction.id} onBack={() => setSelectedAuctionId(null)} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------------------------------------------------------------------- */

function AuctionDetail({ auctionId, onBack }: { auctionId: string; onBack: () => void }) {
  const auction = AUCTIONS.find((a) => a.id === auctionId)!;
  const trend = getAuctionWeeklyTrend(auctionId);
  const listings = getAuctionListings(auctionId);

  const listingsSort = useSort("value", "desc");
  const listingsAccessors = {
    description: (l: (typeof listings)[number]) => l.description,
    stage: (l: (typeof listings)[number]) => l.stage,
    rep: (l: (typeof listings)[number]) => (l.repId ? repById(l.repId)?.name ?? "" : ""),
    value: (l: (typeof listings)[number]) => l.value,
  };
  const sortedListings = sortRows(listings, listingsSort.sort, listingsAccessors);

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to auctions
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{auction.name}</h2>
          <p className="text-sm text-muted-foreground">{auction.week}</p>
        </div>
        {!auction.scheduled && (
          <Badge variant="outline" className={STAGE_BADGE_CLASS.prospect}>
            TBA
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Submitted" value={`${auction.submittedCount} · ${fmtMoney(auction.submittedValue)}`} icon={<FileText className="h-4 w-4" />} />
        <StatCard label="Working" value={`${auction.workingCount} · ${fmtMoney(auction.workingValue)}`} icon={<Handshake className="h-4 w-4" />} />
        <StatCard label="Accepted" value={`${auction.acceptedCount} · ${fmtMoney(auction.acceptedValue)}`} icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      <Card className="!py-2">
        <CardHeader className="!py-2">
          <CardTitle className="text-sm font-semibold">Weekly progress</CardTitle>
          <CardDescription>Listings by stage, week over week leading into the sale</CardDescription>
        </CardHeader>
        <CardContent className="!py-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid vertical={false} className="stroke-muted" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="submitted" stroke="#94a3b8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="working" stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="accepted" stroke="#16a34a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="!py-2">
        <CardHeader className="!py-2">
          <CardTitle className="text-sm font-semibold">Listings</CardTitle>
          <CardDescription>{listings.length} lots tied to this auction</CardDescription>
        </CardHeader>
        <CardContent className="!p-0">
          <div className="max-h-96 overflow-y-auto [&>div]:overflow-visible">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background">
                <TableRow>
                  <SortableHead label="Listing" sortKey="description" sort={listingsSort.sort} onSort={listingsSort.onSort} />
                  <SortableHead label="Stage" sortKey="stage" sort={listingsSort.sort} onSort={listingsSort.onSort} />
                  <SortableHead label="Rep" sortKey="rep" sort={listingsSort.sort} onSort={listingsSort.onSort} />
                  <SortableHead label="Value" sortKey="value" sort={listingsSort.sort} onSort={listingsSort.onSort} align="right" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedListings.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>{l.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STAGE_BADGE_CLASS[l.stage]}>
                        {STAGE_LABEL[l.stage]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{l.repId ? repById(l.repId)?.name : "Unassigned"}</TableCell>
                    <TableCell className="text-right font-medium">{fmtMoney(l.value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
