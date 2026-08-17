import { useEffect, useMemo, useState, useRef, Fragment } from "react";
import type { FeatureCollection } from "geojson";
import * as XLSX from "xlsx";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, Handshake, Gavel, ChevronDown, ChevronRight,
  CalendarClock, Target, X, CheckCircle2, Users, ArrowUp, ArrowDown, ArrowUpDown, RotateCcw,
  Search, MapPin, ListFilter, Download, ExternalLink, Info, ClipboardList, BadgeDollarSign,
  Map as MapIcon, List as ListIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip as InfoTooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
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
  REGIONS, REPS, repById, auctionById, primeCountyAssignments, mulberry32, hashStr, regionForState,
  getCountyRecord, getCountyListings, getAuctionListings,
  getMonthlyPipeline, getQuarterlyPipeline, getCurrentQuarterMonths, FIPS_TO_STATE,
  getListingItems, STATE_NAMES, getTimeframeDateRange,
  AUCTIONS, STAGE_LABEL, STAGE_COLOR, PHASE_LABEL, PHASE_COLOR, LEAKAGE_TOOLTIP, AUCTION_TYPES,
  RegionId, PipelineStage, FunnelPhase, CountyRecord, AuctionType,
} from "@/data/mockSalesForecastData";

// Alaska and Hawaii are excluded from this dashboard entirely — no coverage
// there, so they're filtered out of the map, county/state search, and every
// aggregation as soon as county data loads. "US" is also excluded — it's a
// fallback stateAbbr for any county whose FIPS prefix isn't recognized,
// never a real state to show.
const EXCLUDED_STATES = new Set(["AK", "HI", "US"]);

const fmtMoney = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(2)}`;
};
const fmtPct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
const fmtNum = (n: number) => n.toLocaleString();
const fmtVariance = (n: number) => `${n > 0 ? "+" : n < 0 ? "-" : ""}${fmtMoney(Math.abs(n))}`;
const truncate30 = (s: string) => (s.length > 30 ? `${s.slice(0, 30)}…` : s);

/** Territory/District/DM/RM for a listing's assigned rep, following the same
 * `{name} — District` convention used for the top team-scope selector's
 * district options. Territory Manager / Independent Sales Rep = the rep
 * itself; District Manager = its parent; Regional Manager = the district's parent. */
function repHierarchy(repId: string | null | undefined) {
  const rep = repId ? repById(repId) : undefined;
  const dm = rep?.parentId ? repById(rep.parentId) : undefined;
  const rm = dm?.parentId ? repById(dm.parentId) : undefined;
  return {
    territory: rep ? `${rep.name} — Territory` : "Unassigned",
    district: dm ? `${dm.name} — District` : "—",
    dmName: dm?.name ?? "—",
    rmName: rm?.name ?? "—",
  };
}

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

const STAGE_BADGE_CLASS: Record<PipelineStage, string> = {
  closed: "bg-green-50 text-green-700 border-green-200",
  signedReady: "bg-violet-50 text-violet-700 border-violet-200",
  working: "bg-blue-50 text-blue-700 border-blue-200",
  prospect: "bg-orange-50 text-orange-700 border-orange-200",
};

interface RepRollup {
  repId: string;
  counties: number;
  unvaluedProspectCount: number;
  unvaluedProspectUncontactedCount: number;
  valuedProspect: number;
  valuedProspectCount: number;
  working: number;
  workingCount: number;
  signedReady: number;
  signedReadyCount: number;
  closed: number;
  closedCount: number;
}

/** Display order for the 5-phase funnel in rep-scoped views (Reps & Territories table, expanded rep cards, county info panel) — matches the Overview funnel order. */
const REP_PHASE_ORDER: FunnelPhase[] = ["unvaluedProspect", "valuedProspect", "working", "signedReady", "closed"];

const emptyRepRollup = (repId: string): RepRollup => ({
  repId,
  counties: 0,
  unvaluedProspectCount: 0,
  unvaluedProspectUncontactedCount: 0,
  valuedProspect: 0,
  valuedProspectCount: 0,
  working: 0,
  workingCount: 0,
  signedReady: 0,
  signedReadyCount: 0,
  closed: 0,
  closedCount: 0,
});

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

/** One metric row inside a FunnelPhaseCard — plain label/value, or with an
 * info-tooltip when `tooltip` is provided (used for the Leakage metrics). */
/** One label/value field inside a listing row's expanded detail panel.
 * `m-0` on both lines kills the default paragraph margin that was making a
 * value sit visually closer to the *next* field's label than to its own —
 * the small `mt-0.5` below re-adds just enough space to read label-then-value
 * as a pair, while the grid's own `gap-y` (kept larger) separates one field
 * from the next. Values are hard-truncated at 30 characters with an
 * ellipsis; the untruncated text is always available via the native title
 * tooltip on hover. */
/** Shape needed to render one phase card — count always meaningful, value only for the four valued phases. */
type PhaseAmounts = Record<FunnelPhase, { count: number; value: number }>;

/** Read-only 6-card grid: the 5 funnel phases in canonical order, plus a
 * trailing Potential GTV card (sum of the four valued phases). Used for the
 * Territories county info panel, both when a county is selected and — with
 * scope-level totals instead — when it isn't. Follows the same count-as-primary
 * convention as the Overview tab's cards: count leads for every phase except
 * Actualized/Potential GTV (where the dollar value leads and listing count
 * is the secondary line). */
function PhaseCardGrid({ amounts, factor, uncontactedCount }: { amounts: PhaseAmounts; factor: number; uncontactedCount: number }) {
  const totalPotential = (amounts.valuedProspect.value + amounts.working.value + amounts.signedReady.value + amounts.closed.value) * factor;
  const totalPotentialCount = amounts.valuedProspect.count + amounts.working.count + amounts.signedReady.count + amounts.closed.count;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {REP_PHASE_ORDER.map((phase) => {
        const amt = amounts[phase];
        const isValuePrimary = phase === "closed";
        const primaryText = isValuePrimary ? fmtMoney(amt.value * factor) : fmtNum(amt.count);
        const secondaryText =
          phase === "unvaluedProspect" ? `${fmtNum(uncontactedCount)} uncontacted` : isValuePrimary ? `${fmtNum(amt.count)} listings` : fmtMoney(amt.value * factor);
        return (
          <div key={phase} className="rounded-lg border p-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ background: PHASE_COLOR[phase] }} />
              {PHASE_LABEL[phase]}
            </div>
            <p className="mt-1 text-lg font-semibold">{primaryText}</p>
            <p className="text-xs text-muted-foreground">{secondaryText}</p>
          </div>
        );
      })}
      <div className="rounded-lg border p-3" style={{ borderColor: "#ffc901" }}>
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: "#ffc901" }} />
          Potential GTV
        </div>
        <p className="mt-1 text-lg font-semibold">{fmtMoney(totalPotential)}</p>
        <p className="text-xs text-muted-foreground">{fmtNum(totalPotentialCount)} listings</p>
      </div>
    </div>
  );
}

function ExpandField({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className={`mt-0.5 font-medium ${valueClassName ?? ""}`} title={value.length > 30 ? value : undefined}>
        {truncate30(value)}
      </div>
    </div>
  );
}

function PhaseMetric({ label, value, tooltip }: { label: string; value: string; tooltip?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        {label}
        {tooltip && (
          <InfoTooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-56 text-xs">{tooltip}</TooltipContent>
          </InfoTooltip>
        )}
      </span>
      <span className="text-xs font-medium">{value}</span>
    </div>
  );
}

/** Overview funnel card: a primary headline metric plus a compact stack of
 * secondary count/value/leakage metrics beneath it. Distinct from `StatCard`
 * (used elsewhere, e.g. Auctions) because each funnel phase needs several
 * metrics at once rather than one big number. Only phases that still show a
 * progress bar (currently just Sold Actuals) pass barPct/barCaption/barColor. */
function FunnelPhaseCard({
  label,
  icon,
  accentColor,
  onClick,
  active,
  primary,
  footer,
  metrics,
  barPct,
  barCaption,
  barColor,
}: {
  label: string;
  icon: React.ReactNode;
  accentColor?: string;
  onClick?: () => void;
  active?: boolean;
  primary: { label: string; value: string };
  footer?: React.ReactNode;
  metrics?: { label: string; value: string; tooltip?: string }[];
  barPct?: number;
  barCaption?: string;
  barColor?: string;
}) {
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
        <p className="mt-1.5 text-2xl font-semibold">{primary.value}</p>
        <p className="text-[11px] text-muted-foreground">{primary.label}</p>
        {footer && <div className="mt-0.5 text-xs">{footer}</div>}

        {metrics && metrics.length > 0 && (
          <div className="mt-2.5 space-y-1 border-t pt-2">
            {metrics.map((m) => (
              <PhaseMetric key={m.label} label={m.label} value={m.value} tooltip={m.tooltip} />
            ))}
          </div>
        )}

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

/** Small "this would link out" affordance used on auction/listing/lot
 * references throughout the dashboard. Since there's no real external editor
 * to deep-link into yet, clicking opens a modal explaining what would happen
 * instead of silently doing nothing (or fighting with the row's own onClick,
 * hence the stopPropagation). */
/** Switches the Territories tab between its Table (Reps & Territories) and
 * Map (Coverage Map + county detail) views. Lives inside each view's own
 * card header — pass the view that's currently showing, and this renders
 * the button to switch to the *other* one. */
function TerritoriesViewToggle({ view, onChange }: { view: "table" | "map"; onChange: (v: "table" | "map") => void }) {
  return view === "table" ? (
    <button
      onClick={() => onChange("map")}
      className="inline-flex items-center gap-1.5 rounded-md border bg-white px-2.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm hover:bg-muted"
      title="Switch to map view"
    >
      <MapIcon className="h-3.5 w-3.5" />
      Map View
    </button>
  ) : (
    <button
      onClick={() => onChange("table")}
      className="inline-flex items-center gap-1.5 rounded-md border bg-white px-2.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm hover:bg-muted"
      title="Switch to table view"
    >
      <ListIcon className="h-3.5 w-3.5" />
      Table View
    </button>
  );
}

function EditorLink({
  label,
  kind,
  onOpen,
}: {
  label: React.ReactNode;
  kind: "auction" | "listing" | "lot";
  onOpen: (kind: "auction" | "listing" | "lot", label: string) => void;
}) {
  if (label == null || label === "" || label === "—") return <>{label}</>;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpen(kind, String(label));
      }}
      className="text-foreground underline-offset-2 hover:underline hover:text-slate-900"
    >
      {label}
    </button>
  );
}

/** Fires when an EditorLink is clicked — stands in for actually navigating to
 * the (not-yet-built) auction/listing/lot editor. */
function EditorOpeningModal({
  state,
  onClose,
}: {
  state: { kind: "auction" | "listing" | "lot"; label: string } | null;
  onClose: () => void;
}) {
  if (!state) return null;
  const kindLabel = state.kind === "auction" ? "Auction" : state.kind === "listing" ? "Listing" : "Lot";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-lg border bg-background p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Opening {kindLabel.toLowerCase()} editor…</h3>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          A new page would open here to edit the {kindLabel.toLowerCase()}{" "}
          <span className="font-medium text-foreground">"{state.label}"</span>.
        </p>
        <Button size="sm" className="mt-4 w-full" onClick={onClose}>
          Got it
        </Button>
      </div>
    </div>
  );
}

/** Simple day-of-year based week number (not strict ISO 8601, but close
 * enough for a rolling "Week N of YYYY" label) — Aug 11 2026 comes out to
 * Week 33, matching the calendar week most people would expect. */
function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000;
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.ceil(diff / oneWeek + 1);
}

/** Builds the header title off the selected timeframe, e.g. "Sales Funnel
 * Insights for Q3 2026" or "Sales Funnel Insights for 2026". Anchored to
 * today's date since these are rolling windows (this week/month/quarter/year),
 * not a picked date range. */
function getTimeframeTitle(timeframe: TimeframeId): string {
  const now = new Date();
  const year = now.getFullYear();
  if (timeframe === "week") {
    return `Sales Funnel Insights for Week ${getWeekNumber(now)} of ${year}`;
  }
  if (timeframe === "month") {
    return `Sales Funnel Insights for ${now.toLocaleDateString("en-US", { month: "long" })} ${year}`;
  }
  if (timeframe === "quarter") {
    const q = Math.floor(now.getMonth() / 3) + 1;
    return `Sales Funnel Insights for Q${q} ${year}`;
  }
  return `Sales Funnel Insights for ${year}`;
}

export default function SalesForecastingDashboard() {
  const [timeframe, setTimeframe] = useState<TimeframeId>("month");
  // Page-wide filter: narrows every listing/auction shown (Overview,
  // Territories, Auctions) to just this auction type.
  const [auctionTypeFilter, setAuctionTypeFilter] = useState<"all" | AuctionType>("all");
  const [role, setRole] = useState<"forecaster" | "regional" | "district">("forecaster");
  const [teamId, setTeamId] = useState("all");
  // Optional deeper scope, shown as an extra select to the right of the
  // primary one: when a Region is picked, an optional District drill-down
  // appears (defaults "All Districts"); once a District is in effect —
  // either picked directly at the top level or via that Region drill-down —
  // an optional Territory drill-down appears too (defaults "All Territories").
  const [districtDrillId, setDistrictDrillId] = useState("all");
  const [territoryDrillId, setTerritoryDrillId] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  // Modal shown when an auction/listing/lot link is clicked anywhere on the page.
  const [editorState, setEditorState] = useState<{ kind: "auction" | "listing" | "lot"; label: string } | null>(null);
  const openEditor = (kind: "auction" | "listing" | "lot", label: string) => setEditorState({ kind, label });

  // Captured once on load so "Updated as of" reflects when this data was pulled, not a live-ticking clock.
  const [updatedAt] = useState(() => new Date());

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
  const byStateCardRef = useRef<HTMLDivElement | null>(null);
  const territoryMapRef = useRef<TerritoryMapHandle | null>(null);
  // Selects a county everywhere that needs it (map highlight + drill-down
  // panel) and, when requested, scrolls the map into view — used by rows
  // elsewhere on the page (like Reps & Territories) that reference a county
  // but aren't next to the map themselves.
  const focusCounty = (fips: string, name: string, stateAbbr: string, scrollToMap = false) => {
    setSelectedFips(fips);
    setSelectedCountyMeta({ name, stateAbbr });
    if (scrollToMap) {
      setTerritoriesView("map");
      // Wait a tick for the map view to actually mount before scrolling to it.
      setTimeout(() => mapCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
  };
  const [expandedRepId, setExpandedRepId] = useState<string | null>(null);
  const [displayRepId, setDisplayRepId] = useState<string | null>(null);
  const [repStageFilter, setRepStageFilter] = useState<FunnelPhase | null>(null);

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
  // Overview tab's By State breakdown — triggered from inside Research
  // Filters, scrolls itself to the top of the viewport when opened.
  const [showStateBreakdown, setShowStateBreakdown] = useState(false);
  // Up to 5 states picked for side-by-side comparison, and whether the
  // focused "Compare" view (vs. the full row list) is currently showing.
  const [compareStates, setCompareStates] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [addStateOpen, setAddStateOpen] = useState(false);
  const [addStateQuery, setAddStateQuery] = useState("");
  // Set when someone searches the map (Territories tab) and picks a state —
  // narrows the map and the Reps & Territories table below to that state
  // until cleared. Independent from the Overview tab's own state filter above.
  const [mapStateFilter, setMapStateFilter] = useState<string | null>(null);
  // Same idea, but for a specific rep picked from the map search — mutually
  // exclusive with mapStateFilter.
  const [mapRepFilter, setMapRepFilter] = useState<string | null>(null);
  // Territories tab shows either the Reps & Territories table or the map +
  // county detail, one at a time — table is the default landing view.
  const [territoriesView, setTerritoriesView] = useState<"table" | "map">("table");

  // Reps & Territories table search (name / state / county)
  const [repSearchQuery, setRepSearchQuery] = useState("");
  useEffect(() => {
    if (expandedRepId) {
      setDisplayRepId(expandedRepId);
      setRepStageFilter(null);
    }
  }, [expandedRepId]);
  // Auctions aren't naturally scoped the way Territories counties are, so
  // landing on the tab always starts from the full national view — the
  // person can still narrow it with the same top role/team selector.
  useEffect(() => {
    if (activeTab === "auctions") {
      setRole("forecaster");
      setTeamId("all");
      setDistrictDrillId("all");
      setTerritoryDrillId("all");
    }
  }, [activeTab]);
  const [expandedAuctionId, setExpandedAuctionId] = useState<string | null>(null);
  const [expandedAuctionListingId, setExpandedAuctionListingId] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<FunnelPhase | null>(null);
  const [displayStage, setDisplayStage] = useState<FunnelPhase | null>(null);
  const [expandedStageListingId, setExpandedStageListingId] = useState<string | null>(null);
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

  // Research Filters auto-closes the moment something happens outside the
  // panel itself (e.g. picking a funnel card) — it only stays open while
  // nothing else on the page has been touched yet.
  useEffect(() => {
    if (selectedStage) setFiltersOpen(false);
  }, [selectedStage]);

  useEffect(() => {
    let cancelled = false;
    fetch(COUNTIES_URL)
      .then((r) => r.json())
      .then((data: FeatureCollection) => {
        if (cancelled) return;
        const features = data.features.filter((f) => {
          const fips = fipsFromFeature(f as any);
          return !EXCLUDED_STATES.has(FIPS_TO_STATE[fips.slice(0, 2)] ?? "");
        });
        setGeo({ ...data, features });
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

  // Optional drill-down #1: districts within the selected region.
  const regionDistrictOptions = useMemo(() => {
    if (role !== "regional" || teamId === "all") return [];
    return REPS.filter((r) => r.type === "district" && r.regionId === teamId).map((d) => ({ value: d.id, label: `${d.name} — District` }));
  }, [role, teamId]);

  // Whichever district is actually in effect right now — picked directly at
  // the top level (role === "district"), or drilled into from a Region.
  const effectiveDistrictId = role === "district" ? teamId : role === "regional" && districtDrillId !== "all" ? districtDrillId : null;

  // Optional drill-down #2: territories (individual reps) within the effective district.
  const districtTerritoryOptions = useMemo(() => {
    if (!effectiveDistrictId) return [];
    return REPS.filter((r) => r.parentId === effectiveDistrictId && (r.type === "territory" || r.type === "independent")).map((r) => ({
      value: r.id,
      label: r.name,
    }));
  }, [effectiveDistrictId]);

  // Label for whatever's selected in the top role/team scope selector —
  // used as the county info panel's heading when no county is selected yet.
  const topScopeLabel =
    territoryDrillId !== "all" && effectiveDistrictId
      ? `${repById(territoryDrillId)?.name ?? "Territory"} — Territory`
      : effectiveDistrictId
      ? `${repById(effectiveDistrictId)?.name ?? "District"} — District`
      : role === "forecaster" || teamId === "all"
      ? "All Territories"
      : role === "regional"
      ? REGIONS.find((r) => r.id === teamId)?.name ?? "Region"
      : `${repById(teamId)?.name ?? "District"} — District`;

  const handleRoleChange = (v: string) => {
    const next = v as typeof role;
    setRole(next);
    setTeamId(next === "forecaster" ? "all" : next === "regional" ? REGIONS[0].id : REPS.find((r) => r.type === "district")!.id);
    setDistrictDrillId("all");
    setTerritoryDrillId("all");
  };

  const handleTeamChange = (v: string) => {
    setTeamId(v);
    setDistrictDrillId("all");
    setTerritoryDrillId("all");
  };

  const handleDistrictDrillChange = (v: string) => {
    setDistrictDrillId(v);
    setTerritoryDrillId("all");
  };

  // Jumps to the Territories tab and expands a specific rep's breakdown.
  // Resets role/team scope to "everything" first — otherwise a rep outside
  // the currently-active filter would land on a tab where their row doesn't
  // even render.
  const goToRepBreakdown = (repId: string) => {
    setRole("forecaster");
    setTeamId("all");
    setDistrictDrillId("all");
    setTerritoryDrillId("all");
    setActiveTab("territories");
    setTerritoriesView("table");
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
    if (territoryDrillId !== "all" && effectiveDistrictId) return new Set([territoryDrillId]);
    if (effectiveDistrictId) return new Set(REPS.filter((r) => r.parentId === effectiveDistrictId).map((r) => r.id));
    return null;
  }, [effectiveDistrictId, territoryDrillId]);

  const { totals, repRollups, countiesByRep, totalsByState } = useMemo(() => {
    const totals = {
      prospect: 0, prospectAssigned: 0, working: 0, signedReady: 0, closed: 0, priorYearClosed: 0, budget: 0,
      unvaluedProspectCount: 0, unvaluedProspectUncontactedCount: 0,
      valuedProspectCount: 0, valuedProspectValue: 0,
      workingCount: 0, signedReadyCount: 0, closedCount: 0,
    };
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
        if (visibleRepIds && (!rec.repId || !visibleRepIds.has(rec.repId))) continue;

        totals.prospect += rec.prospect.value;
        if (rec.repId) totals.prospectAssigned += rec.prospect.value;
        totals.working += rec.working.value;
        totals.signedReady += rec.signedReady.value;
        totals.closed += rec.closed.value;
        totals.priorYearClosed += rec.priorYearClosed;
        totals.budget += rec.budget;
        totals.unvaluedProspectCount += rec.unvaluedProspect.count;
        totals.unvaluedProspectUncontactedCount += rec.unvaluedProspectUncontactedCount;
        totals.valuedProspectCount += rec.valuedProspect.count;
        totals.valuedProspectValue += rec.valuedProspect.value;
        totals.workingCount += rec.working.count;
        totals.signedReadyCount += rec.signedReady.count;
        totals.closedCount += rec.closed.count;

        const st = byState.get(rec.stateAbbr) ?? {
          prospect: 0, prospectAssigned: 0, working: 0, signedReady: 0, closed: 0, priorYearClosed: 0, budget: 0,
          unvaluedProspectCount: 0, unvaluedProspectUncontactedCount: 0,
          valuedProspectCount: 0, valuedProspectValue: 0,
          workingCount: 0, signedReadyCount: 0, closedCount: 0,
        };
        st.prospect += rec.prospect.value;
        if (rec.repId) st.prospectAssigned += rec.prospect.value;
        st.working += rec.working.value;
        st.signedReady += rec.signedReady.value;
        st.closed += rec.closed.value;
        st.priorYearClosed += rec.priorYearClosed;
        st.budget += rec.budget;
        st.unvaluedProspectCount += rec.unvaluedProspect.count;
        st.unvaluedProspectUncontactedCount += rec.unvaluedProspectUncontactedCount;
        st.valuedProspectCount += rec.valuedProspect.count;
        st.valuedProspectValue += rec.valuedProspect.value;
        st.workingCount += rec.working.count;
        st.signedReadyCount += rec.signedReady.count;
        st.closedCount += rec.closed.count;
        byState.set(rec.stateAbbr, st);

        if (rec.repId) {
          const r = rollups.get(rec.repId) ?? emptyRepRollup(rec.repId);
          r.counties += 1;
          r.unvaluedProspectCount += rec.unvaluedProspect.count;
          r.unvaluedProspectUncontactedCount += rec.unvaluedProspectUncontactedCount;
          r.valuedProspect += rec.valuedProspect.value;
          r.valuedProspectCount += rec.valuedProspect.count;
          r.working += rec.working.value;
          r.workingCount += rec.working.count;
          r.signedReady += rec.signedReady.value;
          r.signedReadyCount += rec.signedReady.count;
          r.closed += rec.closed.value;
          r.closedCount += rec.closed.count;
          rollups.set(rec.repId, r);

          const list = byRep.get(rec.repId) ?? [];
          list.push(rec);
          byRep.set(rec.repId, list);
        }
      }
    }
    return { totals, repRollups: rollups, countiesByRep: byRep, totalsByState: byState };
  }, [geo, visibleRegions, visibleRepIds]);

  // Territories-tab-only view of the above, narrowed to mapStateFilter when
  // set (from the map search). Kept separate from the Overview tab's own
  // state filter so the two don't cross-affect each other.
  const countiesByRepMapScoped = useMemo(() => {
    if (!mapStateFilter) return countiesByRep;
    const filtered = new Map<string, CountyRecord[]>();
    for (const [repId, counties] of countiesByRep) {
      const inState = counties.filter((c) => c.stateAbbr === mapStateFilter);
      if (inState.length) filtered.set(repId, inState);
    }
    return filtered;
  }, [countiesByRep, mapStateFilter]);

  // Coverage counts for the county panel's placeholder (no county selected
  // yet) — Regional Managers / DMs / Reps / Districts / Territories /
  // Counties with reps, all scoped to whatever's currently filtered: the top
  // role/team selector first, then the map's own state or rep search on top
  // of that.
  const territoriesScopeCounts = useMemo(() => {
    if (mapRepFilter) {
      const rep = repById(mapRepFilter);
      const dm = rep?.parentId ? repById(rep.parentId) : undefined;
      const rm = dm?.parentId ? repById(dm.parentId) : undefined;
      const countyCount = countiesByRep.get(mapRepFilter)?.length ?? 0;
      return {
        regionalManagers: rm ? 1 : 0,
        districtManagers: dm ? 1 : 0,
        reps: rep ? 1 : 0,
        districts: dm ? 1 : 0,
        territories: rep ? 1 : 0,
        countiesWithReps: countyCount,
      };
    }

    if (mapStateFilter) {
      // A state filter is inherently county-driven — base headcounts on
      // whichever reps actually have a county in that state right now.
      const repIdsInState = Array.from(countiesByRepMapScoped.keys());
      const districtIds = new Set(repIdsInState.map((id) => repById(id)?.parentId).filter((id): id is string => !!id));
      const regionIds = new Set(Array.from(districtIds).map((id) => repById(id)?.parentId).filter((id): id is string => !!id));
      const countiesWithReps = Array.from(countiesByRepMapScoped.values()).reduce((s, list) => s + list.length, 0);
      return {
        regionalManagers: regionIds.size,
        districtManagers: districtIds.size,
        reps: repIdsInState.length,
        districts: districtIds.size,
        territories: repIdsInState.length,
        countiesWithReps,
      };
    }

    // Pure top-level scope (role/team + district/territory drill-down) —
    // the real roster in scope, not just reps who happen to have a county.
    const regionalManagers = REPS.filter((r) => r.type === "regional" && visibleRegions.includes(r.regionId)).length;
    const districtReps = REPS.filter(
      (r) => r.type === "district" && visibleRegions.includes(r.regionId) && (!effectiveDistrictId || r.id === effectiveDistrictId)
    );
    const fieldReps = REPS.filter(
      (r) => (r.type === "territory" || r.type === "independent") && visibleRegions.includes(r.regionId) && (!visibleRepIds || visibleRepIds.has(r.id))
    );
    const countiesWithReps = Array.from(countiesByRepMapScoped.values()).reduce((s, list) => s + list.length, 0);
    return {
      regionalManagers,
      districtManagers: districtReps.length,
      reps: fieldReps.length,
      districts: districtReps.length,
      territories: fieldReps.length,
      countiesWithReps,
    };
  }, [mapRepFilter, mapStateFilter, countiesByRepMapScoped, countiesByRep, visibleRegions, visibleRepIds, effectiveDistrictId]);

  const repRollupsMapScoped = useMemo(() => {
    if (!mapStateFilter) return repRollups;
    const rollups = new Map<string, RepRollup>();
    for (const [repId, counties] of countiesByRepMapScoped) {
      const roll = counties.reduce(
        (acc, c) => ({
          repId,
          counties: acc.counties + 1,
          unvaluedProspectCount: acc.unvaluedProspectCount + c.unvaluedProspect.count,
          unvaluedProspectUncontactedCount: acc.unvaluedProspectUncontactedCount + c.unvaluedProspectUncontactedCount,
          valuedProspect: acc.valuedProspect + c.valuedProspect.value,
          valuedProspectCount: acc.valuedProspectCount + c.valuedProspect.count,
          working: acc.working + c.working.value,
          workingCount: acc.workingCount + c.working.count,
          signedReady: acc.signedReady + c.signedReady.value,
          signedReadyCount: acc.signedReadyCount + c.signedReady.count,
          closed: acc.closed + c.closed.value,
          closedCount: acc.closedCount + c.closed.count,
        }),
        emptyRepRollup(repId)
      );
      rollups.set(repId, roll);
    }
    return rollups;
  }, [countiesByRepMapScoped, mapStateFilter]);

  // The Overview "research" filters narrow just the KPI cards/trend below —
  // most specific wins: a single county > a single rep's book > a whole
  // state > the existing role/team scope. Territories tab (map, rep table)
  // is intentionally untouched by these — it already has its own drill-down.
  const emptyOverviewTotals = { prospect: 0, prospectAssigned: 0, working: 0, signedReady: 0, closed: 0, priorYearClosed: 0, budget: 0 };

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
        emptyOverviewTotals
      );
    }
    if (stateFilter) {
      return totalsByState.get(stateFilter) ?? emptyOverviewTotals;
    }
    return totals;
  }, [countyFilterFips, countyFilterMeta, repFilterId, countiesByRep, stateFilter, totalsByState, totals]);

  // The actual counties behind whatever's currently in scope (same
  // precedence as overviewTotals) — used to generate real listings so the
  // KPI cards and their drill-down tables are guaranteed to agree, instead
  // of a card showing a smoothed proportional number while its drill-down
  // showed a totally different unfiltered list.
  const inScopeCounties = useMemo(() => {
    if (countyFilterFips && countyFilterMeta) {
      return [{ fips: countyFilterFips, name: countyFilterMeta.name, stateAbbr: countyFilterMeta.stateAbbr }];
    }
    if (repFilterId) {
      return (countiesByRep.get(repFilterId) ?? []).map((c) => ({ fips: c.fips, name: c.name, stateAbbr: c.stateAbbr }));
    }
    if (!geo) return [];
    const list: { fips: string; name: string; stateAbbr: string }[] = [];
    for (const feature of geo.features) {
      const fips = fipsFromFeature(feature as any);
      const name = `${(feature.properties as any)?.NAME ?? "Unknown"} County`;
      const rec = getCountyRecord(fips, name);
      if (!visibleRegions.includes(rec.regionId)) continue;
      if (stateFilter && rec.stateAbbr !== stateFilter) continue;
      list.push({ fips, name, stateAbbr: rec.stateAbbr });
    }
    return list;
  }, [geo, countyFilterFips, countyFilterMeta, repFilterId, countiesByRep, visibleRegions, stateFilter]);

  const inScopeListings = useMemo(
    () =>
      inScopeCounties
        .flatMap((c) => getCountyListings(c.fips, c.name, c.stateAbbr))
        .filter((l) => auctionTypeFilter === "all" || l.auctionType === auctionTypeFilter),
    [inScopeCounties, auctionTypeFilter]
  );

  const timeframeAuctionRange = useMemo(() => getTimeframeDateRange(timeframe), [timeframe]);

  /** Sums a stage's listings whose linked auction ends within `range` — the
   * real, listing-level version of what the card shows. An unscheduled
   * auction (currently only "Auction TBA") is always included regardless of
   * range, same convention as the Auctions tab. */
  function sumListingsInRange(stage: PipelineStage, range: { start: number; end: number }) {
    let sum = 0;
    for (const l of inScopeListings) {
      if (l.stage !== stage) continue;
      const auction = l.auctionId ? auctionById(l.auctionId) : undefined;
      if (!auction) continue;
      if (auction.scheduled && (auction.endDateTimestamp < range.start || auction.endDateTimestamp > range.end)) continue;
      sum += l.value;
    }
    return sum;
  }

  /** Prospect-phase listings (no auction/date to filter by) — approximated
   * with the same proportional, deterministically-shuffled sample the old
   * single Prospects card used, split by the `valued` flag. */
  function sampleProspectListings(valued: boolean) {
    const matching = inScopeListings.filter((l) => l.stage === "prospect" && Boolean(l.valued) === valued);
    const shuffled = [...matching].sort(
      (a, b) => mulberry32(hashStr(a.fips + a.description + a.value))() - mulberry32(hashStr(b.fips + b.description + b.value))()
    );
    const targetCount = matching.length === 0 ? 0 : Math.max(1, Math.round(matching.length * factor));
    return shuffled.slice(0, targetCount).sort((a, b) => b.value - a.value);
  }

  /** Unsigned/Signed/Sold listings, scoped to the current timeframe. An
   * unscheduled auction (Unsigned Listings are always pinned to "Auction
   * TBA") is always included regardless of range. */
  function timeframeStageListings(stage: PipelineStage) {
    return inScopeListings
      .filter((l) => {
        if (l.stage !== stage) return false;
        const auction = l.auctionId ? auctionById(l.auctionId) : undefined;
        if (!auction) return false;
        if (!auction.scheduled) return true;
        return auction.endDateTimestamp >= timeframeAuctionRange.start && auction.endDateTimestamp <= timeframeAuctionRange.end;
      })
      .sort((a, b) => b.value - a.value);
  }

  // One listing array per funnel phase — both the cards (via `scaled` below)
  // and the drilldown table read from these same arrays, so the numbers on
  // a card and the rows under it always agree, and Leakage Count/Value are
  // always derived from the same tagged listings (never independently
  // randomized), guaranteeing a zero count implies a zero value.
  const unvaluedProspectListings = useMemo(() => sampleProspectListings(false), [inScopeListings, factor]);
  const valuedProspectListings = useMemo(() => sampleProspectListings(true), [inScopeListings, factor]);
  const workingListings = useMemo(() => timeframeStageListings("working"), [inScopeListings, timeframeAuctionRange]);
  const signedReadyListings = useMemo(() => timeframeStageListings("signedReady"), [inScopeListings, timeframeAuctionRange]);
  const closedListings = useMemo(() => timeframeStageListings("closed"), [inScopeListings, timeframeAuctionRange]);

  const sumValue = (list: { value: number }[]) => list.reduce((s, l) => s + l.value, 0);
  const leakedOnly = (list: { leaked?: boolean }[]) => list.filter((l) => l.leaked);

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

  // Coverage Map search: matches whole states, individual counties (both
  // fly-to-bounds), and reps by name (fly-to-bounds over their territory).
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [mapSearchOpen, setMapSearchOpen] = useState(false);
  const mapSearchMatches = useMemo(() => {
    const q = mapSearchQuery.trim().toLowerCase();
    if (q.length < 2)
      return {
        states: [] as { abbr: string; name: string }[],
        counties: [] as { fips: string; name: string; stateAbbr: string }[],
        reps: [] as { id: string; name: string; type: string }[],
      };

    const states = Object.entries(STATE_NAMES)
      .filter(([abbr]) => !EXCLUDED_STATES.has(abbr))
      .filter(([abbr, name]) => abbr.toLowerCase().includes(q) || name.toLowerCase().includes(q))
      .slice(0, 8)
      .map(([abbr, name]) => ({ abbr, name }));

    const counties: { fips: string; name: string; stateAbbr: string }[] = [];
    if (geo) {
      for (const feature of geo.features) {
        const fips = fipsFromFeature(feature as any);
        const name = `${(feature.properties as any)?.NAME ?? "Unknown"} County`;
        const stateAbbr = FIPS_TO_STATE[fips.slice(0, 2)] ?? "";
        if (name.toLowerCase().includes(q) || stateAbbr.toLowerCase().includes(q)) {
          counties.push({ fips, name, stateAbbr });
          if (counties.length >= 15) break;
        }
      }
    }

    const reps = REPS.filter((r) => (r.type === "territory" || r.type === "independent") && r.name.toLowerCase().includes(q))
      .slice(0, 8)
      .map((r) => ({ id: r.id, name: r.name, type: r.type }));

    return { states, counties, reps };
  }, [geo, mapSearchQuery]);

  const allStates = useMemo(
    () => Array.from(new Set(Object.values(FIPS_TO_STATE))).filter((abbr) => !EXCLUDED_STATES.has(abbr)).sort(),
    []
  );

  const repFilterMatches = useMemo(() => {
    const pool = REPS.filter((r) => r.type === "territory" || r.type === "independent");
    if (!repFilterQuery.trim()) return pool.slice(0, 30);
    const q = repFilterQuery.trim().toLowerCase();
    return pool.filter((r) => r.name.toLowerCase().includes(q)).slice(0, 30);
  }, [repFilterQuery]);

  const hasOverviewFilter = !!(countyFilterFips || repFilterId || stateFilter);
  // Effective visibility of the By State section — hidden whenever a
  // state/county/salesperson filter is active, same as its render check below.
  const byStateVisible = showStateBreakdown && !hasOverviewFilter;
  useEffect(() => {
    if (!byStateVisible) {
      setCompareStates([]);
      setCompareMode(false);
    }
  }, [byStateVisible]);
  // A filter turning on isn't just a reason to hide By State — it resets the
  // underlying intent to show it at all, so clearing that filter afterward
  // doesn't bring By State back on its own. It only reappears if the "By
  // State" button is clicked again on purpose.
  useEffect(() => {
    if (hasOverviewFilter) setShowStateBreakdown(false);
  }, [hasOverviewFilter]);
  const clearOverviewFilters = () => {
    setCountyFilterFips(null);
    setCountyFilterMeta(null);
    setCountyQuery("");
    setRepFilterId(null);
    setRepFilterQuery("");
    setStateFilter(null);
  };

  const scaled = {
    // Unvalued Prospects — count only, no dollar value (not yet valued).
    unvaluedProspectCount: unvaluedProspectListings.length,
    unvaluedProspectLeakageCount: leakedOnly(unvaluedProspectListings).length,
    unvaluedProspectUncontactedCount: unvaluedProspectListings.filter((l) => !l.contactDate).length,
    // Valued Prospects
    valuedProspectCount: valuedProspectListings.length,
    valuedProspectValue: sumValue(valuedProspectListings),
    valuedProspectLeakageCount: leakedOnly(valuedProspectListings).length,
    valuedProspectLeakageValue: sumValue(leakedOnly(valuedProspectListings)),
    // Unsigned Listings
    workingCount: workingListings.length,
    workingValue: sumValue(workingListings),
    workingLeakageCount: leakedOnly(workingListings).length,
    workingLeakageValue: sumValue(leakedOnly(workingListings)),
    // Signed Listings
    signedReadyCount: signedReadyListings.length,
    signedReadyValue: sumValue(signedReadyListings),
    signedReadyLeakageCount: leakedOnly(signedReadyListings).length,
    signedReadyLeakageValue: sumValue(leakedOnly(signedReadyListings)),
    // Sold Actuals — terminal phase, no leakage.
    closedCount: closedListings.length,
    closedValue: sumValue(closedListings),
    priorYearClosed: Math.round(overviewTotals.priorYearClosed * factor),
    budget: Math.round(overviewTotals.budget * factor),
  };
  const totalPotential = scaled.closedValue + scaled.signedReadyValue + scaled.workingValue + scaled.valuedProspectValue;
  const totalPotentialCount = scaled.closedCount + scaled.signedReadyCount + scaled.workingCount + scaled.valuedProspectCount;
  const varPct = scaled.priorYearClosed > 0 ? ((scaled.closedValue - scaled.priorYearClosed) / scaled.priorYearClosed) * 100 : 0;

  // Same funnel metrics as the cards above, broken out per state (excludes
  // AK/HI like everywhere else) — backs the Overview tab's By State table
  // and the 2-5-state comparison view.
  const stateRows = Array.from(totalsByState.entries())
    .filter(([abbr]) => !EXCLUDED_STATES.has(abbr))
    .map(([abbr, st]) => ({
      abbr,
      name: STATE_NAMES[abbr] ?? abbr,
      unvaluedProspectCount: Math.round(st.unvaluedProspectCount * factor),
      unvaluedProspectUncontactedCount: Math.round(st.unvaluedProspectUncontactedCount * factor),
      valuedProspectCount: Math.round(st.valuedProspectCount * factor),
      valuedProspectValue: Math.round(st.valuedProspectValue * factor),
      workingCount: Math.round(st.workingCount * factor),
      workingValue: Math.round(st.working * factor),
      signedReadyCount: Math.round(st.signedReadyCount * factor),
      signedReadyValue: Math.round(st.signedReady * factor),
      closedCount: Math.round(st.closedCount * factor),
      closedValue: Math.round(st.closed * factor),
      potentialValue: Math.round((st.valuedProspectValue + st.working + st.signedReady + st.closed) * factor),
      potentialCount: Math.round(st.valuedProspectCount + st.workingCount + st.signedReadyCount + st.closedCount),
    }));

  const stateSort = useSort("potentialValue", "desc");
  const stateAccessors = {
    name: (r: (typeof stateRows)[number]) => r.name,
    unvaluedProspect: (r: (typeof stateRows)[number]) => r.unvaluedProspectCount,
    valuedProspect: (r: (typeof stateRows)[number]) => r.valuedProspectValue,
    working: (r: (typeof stateRows)[number]) => r.workingValue,
    signedReady: (r: (typeof stateRows)[number]) => r.signedReadyValue,
    closed: (r: (typeof stateRows)[number]) => r.closedValue,
    potentialValue: (r: (typeof stateRows)[number]) => r.potentialValue,
  };
  const sortedStateRows = sortRows(stateRows, stateSort.sort, stateAccessors);

  const toggleCompareState = (abbr: string) => {
    setCompareStates((prev) => (prev.includes(abbr) ? prev.filter((a) => a !== abbr) : prev.length >= 5 ? prev : [...prev, abbr]));
  };
  const compareStateRows = compareStates.map((abbr) => stateRows.find((r) => r.abbr === abbr)).filter((r): r is (typeof stateRows)[number] => !!r);
  const compareMetricRows: { label: string; getValue: (r: (typeof stateRows)[number]) => string }[] = [
    { label: "New Prospects — Count", getValue: (r) => fmtNum(r.unvaluedProspectCount) },
    { label: "New Prospects — Uncontacted", getValue: (r) => fmtNum(r.unvaluedProspectUncontactedCount) },
    { label: "Interested Prospects — Count", getValue: (r) => fmtNum(r.valuedProspectCount) },
    { label: "Interested Prospects — Estimated Value", getValue: (r) => fmtMoney(r.valuedProspectValue) },
    { label: "Unsigned Listings — Count", getValue: (r) => fmtNum(r.workingCount) },
    { label: "Unsigned Listings — Estimated Value", getValue: (r) => fmtMoney(r.workingValue) },
    { label: "Signed Listings — Count", getValue: (r) => fmtNum(r.signedReadyCount) },
    { label: "Signed Listings — Estimated Value", getValue: (r) => fmtMoney(r.signedReadyValue) },
    { label: "Actualized GTV — Value", getValue: (r) => fmtMoney(r.closedValue) },
    { label: "Actualized GTV — Listings", getValue: (r) => fmtNum(r.closedCount) },
    { label: "Potential GTV — Value", getValue: (r) => fmtMoney(r.potentialValue) },
    { label: "Potential GTV — Listings", getValue: (r) => fmtNum(r.potentialCount) },
  ];

  // Per the Overview redesign, only Sold Actuals keeps a progress meter
  // (progress toward the targeted budget goal). Every other funnel phase
  // card is metrics-only, no bar.
  const soldBar = {
    pct: scaled.budget > 0 ? Math.min((scaled.closedValue / scaled.budget) * 100, 100) : 0,
    caption: `of ${fmtMoney(scaled.budget)} targeted goal`,
  };

  // Deterministic per-timeframe variation so the trend chart shows realistic
  // week-to-week/quarter-to-quarter movement instead of the same ratio
  // scaled by a constant factor (which always looked identical across bars).
  const trendJitter = (key: string, min = 0.82, max = 1.18) => min + mulberry32(hashStr(key))() * (max - min);
  const trendData = TIMEFRAMES.map((tf) => ({
    id: tf.id,
    name: tf.label.replace("This ", ""),
    Actual: sumListingsInRange("closed", getTimeframeDateRange(tf.id)),
    // This Week's prior-year comparison is intentionally trended lower (vs.
    // the normal 0.82-1.18 jitter) so the "current year ahead of last year"
    // state is easy to see without waiting for a week where it happens
    // naturally — every other timeframe keeps the normal, evenly-mixed jitter.
    "Prior Year": Math.round(
      overviewTotals.priorYearClosed * tf.factor * (tf.id === "week" ? trendJitter(`${tf.id}-prior`, 0.45, 0.65) : trendJitter(`${tf.id}-prior`))
    ),
    Goal: Math.round(overviewTotals.budget * tf.factor),
  }));

  const repTableSort = useSort("total", "desc");
  const repTableRows = useMemo(() => {
    let reps = REPS.filter((r) => (r.type === "territory" || r.type === "independent") && visibleRegions.includes(r.regionId));
    if (visibleRepIds) reps = reps.filter((r) => visibleRepIds.has(r.id));
    return reps
      .map((r) => {
        const roll = repRollupsMapScoped.get(r.id) ?? emptyRepRollup(r.id);
        const manager = repById(r.parentId);
        // Unvalued Prospects has no $ value (not yet valued), so — same convention as
        // Overview's Total Potential — Total is Valued Prospects + Unsigned + Signed + Sold.
        return { rep: r, manager, roll, total: roll.valuedProspect + roll.working + roll.signedReady + roll.closed };
      })
      .filter((row) => !mapStateFilter || row.roll.counties > 0);
  }, [visibleRegions, visibleRepIds, repRollupsMapScoped, mapStateFilter]);

  const repTableAccessors = {
    name: (r: (typeof repTableRows)[number]) => r.rep.name,
    type: (r: (typeof repTableRows)[number]) => r.rep.type,
    manager: (r: (typeof repTableRows)[number]) => r.manager?.name ?? "",
    counties: (r: (typeof repTableRows)[number]) => r.roll.counties,
    unvaluedProspectCount: (r: (typeof repTableRows)[number]) => r.roll.unvaluedProspectCount,
    valuedProspect: (r: (typeof repTableRows)[number]) => r.roll.valuedProspect,
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
      const counties = countiesByRepMapScoped.get(rep.id) ?? [];
      return counties.some((c) => c.name.toLowerCase().includes(q) || c.stateAbbr.toLowerCase().includes(q));
    });
  }, [repTableRows, repSearchQuery, countiesByRepMapScoped]);

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
  const selectedCountyListings = (
    displayFips && displayCountyMeta ? getCountyListings(displayFips, displayCountyMeta.name, displayCountyMeta.stateAbbr) : []
  ).filter((l) => auctionTypeFilter === "all" || l.auctionType === auctionTypeFilter);
  useEffect(() => setExpandedCountyListingId(null), [displayFips]);

  const countyListingsSort = useSort("value", "desc");
  const [expandedCountyListingId, setExpandedCountyListingId] = useState<string | null>(null);
  const countyListingsAccessors = {
    description: (l: (typeof selectedCountyListings)[number]) => l.description,
    stage: (l: (typeof selectedCountyListings)[number]) => l.stage,
    rep: (l: (typeof selectedCountyListings)[number]) => (l.repId ? repById(l.repId)?.name ?? "" : ""),
    auction: (l: (typeof selectedCountyListings)[number]) => (l.auctionId ? auctionById(l.auctionId)?.name ?? "" : ""),
    auctionEndDate: (l: (typeof selectedCountyListings)[number]) => (l.auctionId ? auctionById(l.auctionId)?.endDate ?? "" : ""),
    auctionType: (l: (typeof selectedCountyListings)[number]) => l.auctionType ?? "",
    value: (l: (typeof selectedCountyListings)[number]) => l.value,
  };
  const sortedCountyListings = sortRows(selectedCountyListings, countyListingsSort.sort, countyListingsAccessors);

  const expandedRepListings = useMemo(() => {
    if (!displayRepId) return [];
    const repCounties = countiesByRepMapScoped.get(displayRepId) ?? [];
    const rows: Array<ReturnType<typeof getCountyListings>[number]> = [];
    repCounties.forEach((c) => rows.push(...getCountyListings(c.fips, c.name, c.stateAbbr)));
    return rows.filter((l) => auctionTypeFilter === "all" || l.auctionType === auctionTypeFilter).sort((a, b) => b.value - a.value);
  }, [displayRepId, countiesByRepMapScoped, auctionTypeFilter]);

  const repBreakdownSort = useSort("value", "desc");
  const repBreakdownAccessors = {
    county: (l: (typeof expandedRepListings)[number]) => l.countyName,
    description: (l: (typeof expandedRepListings)[number]) => l.description,
    stage: (l: (typeof expandedRepListings)[number]) => l.stage,
    auction: (l: (typeof expandedRepListings)[number]) => (l.auctionId ? auctionById(l.auctionId)?.name ?? "" : ""),
    auctionEndDate: (l: (typeof expandedRepListings)[number]) => (l.auctionId ? auctionById(l.auctionId)?.endDate ?? "" : ""),
    auctionType: (l: (typeof expandedRepListings)[number]) => l.auctionType ?? "",
    value: (l: (typeof expandedRepListings)[number]) => l.value,
  };
  const filteredExpandedRepListings = useMemo(() => {
    if (!repStageFilter) return expandedRepListings;
    if (repStageFilter === "unvaluedProspect") return expandedRepListings.filter((l) => l.stage === "prospect" && !l.valued);
    if (repStageFilter === "valuedProspect") return expandedRepListings.filter((l) => l.stage === "prospect" && !!l.valued);
    return expandedRepListings.filter((l) => l.stage === repStageFilter);
  }, [expandedRepListings, repStageFilter]);
  const sortedExpandedRepListings = useMemo(
    () => sortRows(filteredExpandedRepListings, repBreakdownSort.sort, repBreakdownAccessors),
    [filteredExpandedRepListings, repBreakdownSort.sort]
  );

  const stageListings = useMemo(() => {
    switch (displayStage) {
      case "unvaluedProspect": return unvaluedProspectListings;
      case "valuedProspect": return valuedProspectListings;
      case "working": return workingListings;
      case "signedReady": return signedReadyListings;
      case "closed": return closedListings;
      default: return [];
    }
  }, [displayStage, unvaluedProspectListings, valuedProspectListings, workingListings, signedReadyListings, closedListings]);

  useEffect(() => setExpandedStageListingId(null), [displayStage]);

  const stageListingsSort = useSort("value", "desc");
  const stageListingsAccessors = {
    county: (l: (typeof stageListings)[number]) => l.countyName,
    description: (l: (typeof stageListings)[number]) => l.description,
    rep: (l: (typeof stageListings)[number]) => (l.repId ? repById(l.repId)?.name ?? "" : ""),
    status: (l: (typeof stageListings)[number]) => (l.leaked ? "Leaked" : "Active"),
    auction: (l: (typeof stageListings)[number]) => (l.auctionId ? auctionById(l.auctionId)?.name ?? "" : ""),
    auctionEndDate: (l: (typeof stageListings)[number]) => (l.auctionId ? auctionById(l.auctionId)?.endDate ?? "" : ""),
    auctionType: (l: (typeof stageListings)[number]) => l.auctionType ?? "",
    contactDate: (l: (typeof stageListings)[number]) => l.contactDateTimestamp ?? 0,
    value: (l: (typeof stageListings)[number]) => l.value,
  };
  const sortedStageListings = useMemo(
    () => sortRows(stageListings, stageListingsSort.sort, stageListingsAccessors),
    [stageListings, stageListingsSort.sort]
  );

  // Auction listings carry a real rep (and that rep's region, stashed in
  // stateAbbr — see getAuctionListings) even though auctions themselves
  // aren't tied to a single county. Scoping filters to just the listings
  // whose rep falls within the top role/team selector's current scope —
  // the same visibleRegions/visibleRepIds used by the Territories tab —
  // instead of a synthetic percentage split.
  const auctionListingInScope = (l: Listing): boolean => {
    if (!visibleRegions.includes(l.stateAbbr as RegionId)) return false;
    if (visibleRepIds && (!l.repId || !visibleRepIds.has(l.repId))) return false;
    return true;
  };

  const scopedAuctions = useMemo(
    () =>
      AUCTIONS.filter((a) => auctionTypeFilter === "all" || a.auctionType === auctionTypeFilter).map((a) => {
        const listings = getAuctionListings(a.id).filter(auctionListingInScope);
        const unsignedAll = listings.filter((l) => l.stage === "working");
        const cancelledListings = unsignedAll.filter((l) => l.leaked);
        const unsignedListings = unsignedAll.filter((l) => !l.leaked);
        const signedListings = listings.filter((l) => l.stage === "signedReady");
        // Sold (closed) listings always have an actualValue set (see
        // getAuctionListings) — Actualized GTV uses that real sale value,
        // not the pre-sale estimate. Variance is only meaningful once sold.
        const soldListings = listings.filter((l) => l.stage === "closed");
        const unsignedValue = unsignedListings.reduce((s, l) => s + l.value, 0);
        const cancelledValue = cancelledListings.reduce((s, l) => s + l.value, 0);
        const signedValue = signedListings.reduce((s, l) => s + l.value, 0);
        const soldEstimatedValue = soldListings.reduce((s, l) => s + l.value, 0);
        const soldActualValue = soldListings.reduce((s, l) => s + (l.actualValue ?? 0), 0);
        const soldVarianceValue = soldActualValue - soldEstimatedValue;
        // Total Potential's makeup depends on where the auction actually is
        // in its lifecycle:
        //  - Closed (fully reconciled): just what it actualized.
        //  - Live (a real mix of sold/pending): Signed + Actualized — an
        //    unsigned listing this late isn't realistically converting in time.
        //  - Upcoming (incl. Auction TBA): Unsigned + Signed — nothing's sold yet.
        const totalPotentialValue = a.closed ? soldActualValue : a.live ? signedValue + soldActualValue : unsignedValue + signedValue;
        return {
          ...a,
          // Everything tied to this auction that's actually in a phase we
          // report on (excludes the "prospect" guess-bucket, which isn't
          // shown anywhere in this table) — Unsigned + Cancelled + Signed + Sold.
          reportedListingCount: unsignedListings.length + cancelledListings.length + signedListings.length + soldListings.length,
          unsignedCount: unsignedListings.length,
          cancelledCount: cancelledListings.length,
          signedCount: signedListings.length,
          soldCount: soldListings.length,
          unsignedValue,
          cancelledValue,
          signedValue,
          soldEstimatedValue,
          soldActualValue,
          soldVarianceValue,
          totalPotentialValue,
        };
      }),
    [visibleRegions, visibleRepIds, auctionTypeFilter]
  );

  // This Week/Month/Quarter/Year (the same top-level selector driving the
  // rest of the Overview tab) also scopes which auctions show up here, by
  // real calendar date — Auction TBA has no confirmed date, so it's always
  // included regardless of which window is selected.
  const timeframeFilteredAuctions = useMemo(
    () =>
      scopedAuctions.filter(
        (a) => !a.scheduled || (a.endDateTimestamp >= timeframeAuctionRange.start && a.endDateTimestamp <= timeframeAuctionRange.end)
      ),
    [scopedAuctions, timeframeAuctionRange]
  );
  const scheduledAuctions = timeframeFilteredAuctions.filter((a) => a.scheduled);
  const tbaAuction = timeframeFilteredAuctions.find((a) => !a.scheduled) ?? null;

  // Estimated GTV = still-in-motion value across confirmed auctions (Unsigned + Signed, not yet sold).
  // Actualized GTV = already-sold value across confirmed auctions (real sale prices, not estimates).
  // Potential GTV = everything that could happen — confirmed auctions' full Total Potential, plus Auction TBA's.
  const estimatedUnsigned = scheduledAuctions.reduce((s, a) => s + a.unsignedValue, 0);
  const estimatedSigned = scheduledAuctions.reduce((s, a) => s + a.signedValue, 0);
  const potentialConfirmed = scheduledAuctions.reduce((s, a) => s + a.totalPotentialValue, 0);
  const potentialTBA = tbaAuction?.totalPotentialValue ?? 0;
  const auctionTotals = {
    estimated: estimatedUnsigned + estimatedSigned,
    actualized: scheduledAuctions.reduce((s, a) => s + a.soldActualValue, 0),
    potential: potentialConfirmed + potentialTBA,
    estimatedUnsigned,
    estimatedSigned,
    potentialConfirmed,
    potentialTBA,
  };
  const auctionRemaining = Math.max(auctionTotals.potential - auctionTotals.actualized, 0);

  const auctionsSort = useSort("", "asc");
  const auctionsAccessors = {
    name: (a: (typeof scopedAuctions)[number]) => a.name,
    eventType: (a: (typeof scopedAuctions)[number]) => a.eventType,
    lineOfBusiness: (a: (typeof scopedAuctions)[number]) => a.lineOfBusiness,
    week: (a: (typeof scopedAuctions)[number]) => a.endDateTimestamp,
    unsigned: (a: (typeof scopedAuctions)[number]) => a.unsignedValue,
    cancelled: (a: (typeof scopedAuctions)[number]) => a.cancelledValue,
    signed: (a: (typeof scopedAuctions)[number]) => a.signedValue,
    sold: (a: (typeof scopedAuctions)[number]) => a.soldActualValue,
    totalPotential: (a: (typeof scopedAuctions)[number]) => a.totalPotentialValue,
  };
  const sortedAuctions = useMemo(() => sortRows(timeframeFilteredAuctions, auctionsSort.sort, auctionsAccessors), [timeframeFilteredAuctions, auctionsSort.sort]);

  useEffect(() => setExpandedAuctionListingId(null), [expandedAuctionId]);

  // Scoped the same way the row's own Unsigned/Cancelled/Signed/Sold columns
  // are (region/district/territory + auction type), and excludes the
  // "prospect" guess-bucket that those columns don't count either — so the
  // listing count shown here always matches what those columns add up to.
  const expandedAuctionListings = useMemo(
    () => (expandedAuctionId ? getAuctionListings(expandedAuctionId).filter(auctionListingInScope).filter((l) => l.stage !== "prospect") : []),
    [expandedAuctionId, visibleRegions, visibleRepIds]
  );
  const auctionListingsSort = useSort("value", "desc");
  const auctionListingsAccessors = {
    description: (l: (typeof expandedAuctionListings)[number]) => l.description,
    stage: (l: (typeof expandedAuctionListings)[number]) => l.stage,
    rep: (l: (typeof expandedAuctionListings)[number]) => (l.repId ? repById(l.repId)?.name ?? "" : ""),
    manager: (l: (typeof expandedAuctionListings)[number]) => repHierarchy(l.repId).dmName,
    value: (l: (typeof expandedAuctionListings)[number]) => l.value,
  };
  const sortedExpandedAuctionListings = useMemo(
    () => sortRows(expandedAuctionListings, auctionListingsSort.sort, auctionListingsAccessors),
    [expandedAuctionListings, auctionListingsSort.sort]
  );

  // Shared row shape for both By State exports below.
  const toStateSheetRow = (r: (typeof stateRows)[number]) => ({
    State: r.name,
    "New Prospects — Count": r.unvaluedProspectCount,
    "New Prospects — Uncontacted": r.unvaluedProspectUncontactedCount,
    "Interested Prospects — Count": r.valuedProspectCount,
    "Interested Prospects — Estimated Value": r.valuedProspectValue,
    "Unsigned Listings — Count": r.workingCount,
    "Unsigned Listings — Estimated Value": r.workingValue,
    "Signed Listings — Count": r.signedReadyCount,
    "Signed Listings — Estimated Value": r.signedReadyValue,
    "Actualized GTV — Value": r.closedValue,
    "Actualized GTV — Listings": r.closedCount,
    "Potential GTV — Value": r.potentialValue,
    "Potential GTV — Listings": r.potentialCount,
  });

  // Downloads just the states currently picked for comparison.
  const exportStatesToExcel = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(compareStateRows.map(toStateSheetRow)), "State Comparison");
    XLSX.writeFile(wb, "state-comparison-export.xlsx");
  };

  // Downloads every state currently showing in the By State table — i.e.
  // whatever the top-level role/team scope has filtered in, regardless of
  // whether anything's been picked to compare.
  const exportAllStatesToExcel = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sortedStateRows.map(toStateSheetRow)), "By State");
    XLSX.writeFile(wb, "by-state-export.xlsx");
  };

  const exportToExcel = () => {
    const repsSheet = sortedRepTableRows.map(({ rep, manager, roll, total }) => ({
      Rep: rep.name,
      Type: rep.type === "territory" ? "Territory Manager" : "Independent Sales Rep",
      "District Manager": manager?.name ?? "",
      Counties: roll.counties,
      "Prospects (Count)": roll.unvaluedProspectCount,
      "Interested Prospects": Math.round(roll.valuedProspect * factor),
      "Unsigned Listings": Math.round(roll.working * factor),
      "Signed Listings": Math.round(roll.signedReady * factor),
      "Actualized GTV": Math.round(roll.closed * factor),
      Total: Math.round(total * factor),
    }));

    const auctionsSheet = scopedAuctions.map((a) => ({
      Auction: a.name,
      Status: a.scheduled ? "Scheduled" : "TBA",
      Date: a.endDate,
      "Event Type": a.eventType,
      LoB: a.lineOfBusiness,
      "Unsigned Listings Count": a.unsignedCount,
      "Unsigned Listings Value": a.unsignedValue,
      "Cancelled Listings Count": a.cancelledCount,
      "Cancelled Listings Value": a.cancelledValue,
      "Signed Listings Count": a.signedCount,
      "Signed Listings Value": a.signedValue,
      "Actualized GTV Count": a.soldCount,
      "Actualized GTV Value": a.soldActualValue,
      "Estimated GTV of Sold": a.soldEstimatedValue,
      "Variance (Actual vs. Estimated)": a.closed ? a.soldVarianceValue : "",
      "Total Potential": a.totalPotentialValue,
    }));

    const summarySheet = [
      { Metric: "Timeframe", Value: TIMEFRAMES.find((t) => t.id === timeframe)!.label },
      { Metric: "Unvalued Prospects — Count", Value: scaled.unvaluedProspectCount },
      { Metric: "Unvalued Prospects — Leakage Count", Value: scaled.unvaluedProspectLeakageCount },
      { Metric: "Valued Prospects — Count", Value: scaled.valuedProspectCount },
      { Metric: "Valued Prospects — Value", Value: scaled.valuedProspectValue },
      { Metric: "Valued Prospects — Leakage Count", Value: scaled.valuedProspectLeakageCount },
      { Metric: "Valued Prospects — Leakage Value", Value: scaled.valuedProspectLeakageValue },
      { Metric: "Unsigned Listings — Count", Value: scaled.workingCount },
      { Metric: "Unsigned Listings — Value", Value: scaled.workingValue },
      { Metric: "Unsigned Listings — Leakage Count", Value: scaled.workingLeakageCount },
      { Metric: "Unsigned Listings — Leakage Value", Value: scaled.workingLeakageValue },
      { Metric: "Signed Listings — Count", Value: scaled.signedReadyCount },
      { Metric: "Signed Listings — Value", Value: scaled.signedReadyValue },
      { Metric: "Signed Listings — Leakage Count", Value: scaled.signedReadyLeakageCount },
      { Metric: "Signed Listings — Leakage Value", Value: scaled.signedReadyLeakageValue },
      { Metric: "Sold Actuals — Count", Value: scaled.closedCount },
      { Metric: "Sold Actuals — Value", Value: scaled.closedValue },
      { Metric: "Total Potential", Value: totalPotential },
      { Metric: "Prior Year (Closed)", Value: scaled.priorYearClosed },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summarySheet), "Overview Summary");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(repsSheet), "Reps & Territories");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(auctionsSheet), "Auctions");
    XLSX.writeFile(wb, "sales-funnel-insights-export.xlsx");
  };

  return (
    <div className="space-y-6">
      {/* Collapsible sections (Research Filters, By State, funnel/table row
          drilldowns) stay permanently mounted so their close animation can
          play — but that means the wrapper still occupies a slot in this
          page's space-y-* flow even at 0 height, doubling up with the next
          section's own margin. Targeting grid-rows-[0fr] specifically (only
          present while collapsed) zeroes that one margin without touching
          the gap while a section is actually open. */}
      <style>{`.grid-rows-\\[0fr\\] { margin-top: 0 !important; }`}</style>
      {/* Header + filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{getTimeframeTitle(timeframe)}</h1>
          <p className="text-sm text-muted-foreground">Actual sales, work in progress, and prospecting across all territories</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Updated as of{" "}
            {updatedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })},{" "}
            {updatedAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
          </p>
        </div>
        <div className="flex flex-col items-start gap-1.5 md:items-end">
          <p className="text-2xl font-thin tracking-tight text-foreground">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
          <div className="flex flex-wrap items-center gap-2">
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

            <div className="mx-1 h-5 w-px bg-slate-400" />

            <Button
              variant="outline"
              size="icon"
              onClick={exportToExcel}
              className="h-9 w-9 bg-white shadow-sm"
              title="Export to Excel"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {geoError && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          Couldn't load county boundary data (raw.githubusercontent.com). Map and territory rollups will stay empty until that's reachable.
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={auctionTypeFilter} onValueChange={(v) => setAuctionTypeFilter(v as typeof auctionTypeFilter)}>
              <SelectTrigger className="h-8 w-[200px] bg-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Auction Types</SelectItem>
                {AUCTION_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mx-1 h-5 w-px bg-slate-400" />

            <Select value={role} onValueChange={handleRoleChange}>
              <SelectTrigger className="h-8 w-[200px] bg-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="forecaster">All locations</SelectItem>
                <SelectItem value="regional">Regional</SelectItem>
                <SelectItem value="district">District</SelectItem>
              </SelectContent>
            </Select>

            {role !== "forecaster" && (
              <Select value={teamId} onValueChange={handleTeamChange}>
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

            {role === "regional" && teamId !== "all" && regionDistrictOptions.length > 0 && (
              <Select value={districtDrillId} onValueChange={handleDistrictDrillChange}>
                <SelectTrigger className="h-8 w-[200px] bg-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {regionDistrictOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {effectiveDistrictId && districtTerritoryOptions.length > 0 && (
              <Select value={territoryDrillId} onValueChange={setTerritoryDrillId}>
                <SelectTrigger className="h-8 w-[200px] bg-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Territories</SelectItem>
                  {districtTerritoryOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {activeTab === "overview" && (
              <>
                <div className="mx-1 h-5 w-px bg-slate-400" />
                <div className="relative">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setFiltersOpen((o) => !o)}
                    className={`h-9 w-9 bg-white shadow-sm ${filtersOpen || hasOverviewFilter ? "border-slate-900" : ""}`}
                    title="Research filters"
                  >
                    <ListFilter className="h-4 w-4" />
                  </Button>
                  {hasOverviewFilter && (
                    <span className="pointer-events-none absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
                  )}
                </div>
                {!filtersOpen && stateFilter && (
                  <Badge variant="outline" className="h-8 gap-1.5 bg-white pl-2.5 pr-1.5 text-xs font-normal">
                    {STATE_NAMES[stateFilter] ?? stateFilter}
                    <button
                      onClick={() => setStateFilter(null)}
                      className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      title="Clear state filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </>
            )}
          </div>
          <div className="flex w-full items-center justify-between gap-2 md:w-auto md:justify-end">
            <TabsList className="shadow-sm">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="territories">Territories</TabsTrigger>
              <TabsTrigger value="auctions">Auctions</TabsTrigger>
            </TabsList>
          </div>
        </div>

        {auctionTypeFilter === "Realty" && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs text-blue-800">
            Realty figures shown here are for realty auctions on BigIron.com only.
          </div>
        )}

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
                            setFiltersOpen(false);
                          }
                        }}
                      >
                        <SelectTrigger className="!h-8 w-32 !border-input bg-white text-xs">
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

                    <div className="mx-1 h-8 w-px self-end bg-slate-300" />

                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-medium text-muted-foreground">County</span>
                      <Popover open={countyPopoverOpen} onOpenChange={setCountyPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" role="combobox" className="h-8 w-56 justify-start bg-white text-xs font-normal">
                            <MapPin className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                            <span className="truncate">{countyFilterMeta ? `${countyFilterMeta.name}, ${countyFilterMeta.stateAbbr}` : "Search a county…"}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-0 !z-[2000]" align="start">
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
                        <PopoverContent className="w-64 p-0 !z-[2000]" align="start">
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

                    <div className="mx-1 h-8 w-px self-end bg-slate-300" />

                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-medium text-muted-foreground">View</span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={hasOverviewFilter}
                        onClick={() => {
                          setShowStateBreakdown(true);
                          setFiltersOpen(false);
                          setSelectedStage(null);
                          setTimeout(() => byStateCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                        }}
                        className={`h-8 justify-start bg-white text-xs font-normal disabled:opacity-40 ${showStateBreakdown ? "border-slate-900" : ""}`}
                        title={hasOverviewFilter ? "Clear the state, county, or salesperson filter first" : undefined}
                      >
                        <MapPin className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                        By State
                      </Button>
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

          <TooltipProvider delayDuration={150}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <FunnelPhaseCard
                label={PHASE_LABEL.unvaluedProspect}
                icon={<ClipboardList className="h-4 w-4" />}
                onClick={() => setSelectedStage(selectedStage === "unvaluedProspect" ? null : "unvaluedProspect")}
                active={selectedStage === "unvaluedProspect"}
                primary={{ label: "Total Prospect Count", value: fmtNum(scaled.unvaluedProspectCount) }}
                metrics={[
                  { label: "Uncontacted Prospects", value: fmtNum(scaled.unvaluedProspectUncontactedCount) },
                  { label: "Leakage Count", value: fmtNum(scaled.unvaluedProspectLeakageCount), tooltip: LEAKAGE_TOOLTIP.unvaluedProspect },
                ]}
              />
              <FunnelPhaseCard
                label={PHASE_LABEL.valuedProspect}
                icon={<BadgeDollarSign className="h-4 w-4" />}
                onClick={() => setSelectedStage(selectedStage === "valuedProspect" ? null : "valuedProspect")}
                active={selectedStage === "valuedProspect"}
                primary={{ label: "Total Prospect Count", value: fmtNum(scaled.valuedProspectCount) }}
                metrics={[
                  { label: "Estimated Value", value: fmtMoney(scaled.valuedProspectValue) },
                  { label: "Leakage Count", value: fmtNum(scaled.valuedProspectLeakageCount), tooltip: LEAKAGE_TOOLTIP.valuedProspect },
                  { label: "Leakage Value", value: fmtMoney(scaled.valuedProspectLeakageValue), tooltip: LEAKAGE_TOOLTIP.valuedProspect },
                ]}
              />
              <FunnelPhaseCard
                label={PHASE_LABEL.working}
                icon={<Handshake className="h-4 w-4" />}
                onClick={() => setSelectedStage(selectedStage === "working" ? null : "working")}
                active={selectedStage === "working"}
                primary={{ label: "Total Listing Count", value: fmtNum(scaled.workingCount) }}
                metrics={[
                  { label: "Estimated Value", value: fmtMoney(scaled.workingValue) },
                  { label: "Leakage Count", value: fmtNum(scaled.workingLeakageCount), tooltip: LEAKAGE_TOOLTIP.working },
                  { label: "Leakage Value", value: fmtMoney(scaled.workingLeakageValue), tooltip: LEAKAGE_TOOLTIP.working },
                ]}
              />
              <FunnelPhaseCard
                label={PHASE_LABEL.signedReady}
                icon={<CheckCircle2 className="h-4 w-4" />}
                onClick={() => setSelectedStage(selectedStage === "signedReady" ? null : "signedReady")}
                active={selectedStage === "signedReady"}
                primary={{ label: "Total Listing Count", value: fmtNum(scaled.signedReadyCount) }}
                metrics={[
                  { label: "Estimated Value", value: fmtMoney(scaled.signedReadyValue) },
                  { label: "Leakage Count", value: fmtNum(scaled.signedReadyLeakageCount), tooltip: LEAKAGE_TOOLTIP.signedReady },
                  { label: "Leakage Value", value: fmtMoney(scaled.signedReadyLeakageValue), tooltip: LEAKAGE_TOOLTIP.signedReady },
                ]}
              />
              <FunnelPhaseCard
                label={PHASE_LABEL.closed}
                icon={<Target className="h-4 w-4" />}
                onClick={() => setSelectedStage(selectedStage === "closed" ? null : "closed")}
                active={selectedStage === "closed"}
                primary={{ label: "Actual Value", value: fmtMoney(scaled.closedValue) }}
                footer={
                  <div className="flex items-center gap-1">
                    {varPct >= 0 ? <TrendingUp className="h-3.5 w-3.5 text-green-600" /> : <TrendingDown className="h-3.5 w-3.5 text-red-600" />}
                    <span className={varPct >= 0 ? "text-green-600" : "text-red-600"}>{fmtPct(varPct)}</span>
                    <span className="text-muted-foreground">vs prior year</span>
                  </div>
                }
                metrics={[{ label: "Total Listing Count", value: fmtNum(scaled.closedCount) }]}
                barPct={soldBar.pct}
                barCaption={soldBar.caption}
                barColor={STAGE_COLOR.closed}
              />
              <FunnelPhaseCard
                label="Total Potential"
                icon={<Gavel className="h-4 w-4" />}
                accentColor="#ffc901"
                primary={{ label: "Sum of four valued phases", value: fmtMoney(totalPotential) }}
                metrics={[{ label: "Total Listing Count", value: fmtNum(totalPotentialCount) }]}
              />
            </div>
          </TooltipProvider>

          <div
            className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${selectedStage ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            onTransitionEnd={() => {
              if (!selectedStage) setDisplayStage(null);
            }}
          >
            <div className="min-h-0 overflow-hidden">
              {displayStage && (() => {
                const isProspectDrilldown = displayStage === "unvaluedProspect" || displayStage === "valuedProspect";
                // Unvalued Prospects have no dollar value yet, so no Value column.
                const showValueColumn = displayStage !== "unvaluedProspect";
                const valueColumnLabel = displayStage === "closed" ? "Actual Value" : "Estimated GTV";
                // Only phases that can leak show a Status column (Sold Actuals is terminal; Unvalued Prospects has no per-listing $ to cross out).
                const showStatusColumn = displayStage === "valuedProspect" || displayStage === "working" || displayStage === "signedReady";
                // "Active" reads differently per phase; leaked rows are always "Cancelled".
                const activeStatusLabel = displayStage === "signedReady" ? "Signed" : "Unsigned";
                // Prospects has no $ value at all yet; Qualified Prospects and Unsigned
                // Listings haven't had a final appraisal locked in either — Actual
                // Value / Variance only make sense once Signed or sold.
                const showValueBasedFields = displayStage === "signedReady" || displayStage === "closed";
                // Contact Date and Signed Date both live in the expanded panel now, not as table columns.
                const showContactDateField = displayStage !== "closed";
                const showSignedDateField = displayStage === "signedReady" || displayStage === "closed";
                const showSoldDateField = displayStage === "closed";
                const columnCount =
                  2 + // County, Rep
                  (isProspectDrilldown ? 0 : 1) + // Listing
                  (isProspectDrilldown ? 1 : 3) + // Auction Type only, vs Auction/End/Type
                  (showValueColumn ? 1 : 0) +
                  (showStatusColumn ? 1 : 0);
                return (
                <Card className="!py-2">
                  <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 !py-2">
                    <div>
                      <CardTitle className="text-sm font-semibold">{PHASE_LABEL[displayStage]}</CardTitle>
                      <CardDescription>
                        {stageListings.length} listings · {TIMEFRAMES.find((t) => t.id === timeframe)!.label.toLowerCase()}
                        {!isProspectDrilldown ? " (by auction date)" : " (approximate, no fixed date yet)"}
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
                            {!isProspectDrilldown && (
                              <SortableHead label="Listing" sortKey="description" sort={stageListingsSort.sort} onSort={stageListingsSort.onSort} />
                            )}
                            <SortableHead label="Rep" sortKey="rep" sort={stageListingsSort.sort} onSort={stageListingsSort.onSort} />
                            {!isProspectDrilldown ? (
                              <>
                                <SortableHead label="Auction" sortKey="auction" sort={stageListingsSort.sort} onSort={stageListingsSort.onSort} />
                                <SortableHead label="Auction End" sortKey="auctionEndDate" sort={stageListingsSort.sort} onSort={stageListingsSort.onSort} />
                                <SortableHead label="Auction Type" sortKey="auctionType" sort={stageListingsSort.sort} onSort={stageListingsSort.onSort} />
                              </>
                            ) : (
                              <SortableHead label="Auction Type" sortKey="auctionType" sort={stageListingsSort.sort} onSort={stageListingsSort.onSort} />
                            )}
                            {showValueColumn && (
                              <SortableHead label={valueColumnLabel} sortKey="value" sort={stageListingsSort.sort} onSort={stageListingsSort.onSort} align="right" />
                            )}
                            {showStatusColumn && (
                              <SortableHead label="Status" sortKey="status" sort={stageListingsSort.sort} onSort={stageListingsSort.onSort} />
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedStageListings.map((l, i) => {
                            const auction = l.auctionId ? auctionById(l.auctionId) : undefined;
                            const isOpen = expandedStageListingId === l.id;
                            const hierarchy = repHierarchy(l.repId);
                            const region = REGIONS.find((r) => r.id === regionForState(l.stateAbbr))?.name ?? "—";
                            const variance = (l.actualValue ?? 0) - l.value;
                            return (
                              <Fragment key={l.id}>
                                <TableRow
                                  className={`cursor-pointer ${l.leaked ? "text-muted-foreground" : ""}`}
                                  onClick={() => setExpandedStageListingId(isOpen ? null : l.id)}
                                >
                                  <TableCell className="text-muted-foreground">
                                    <span className="inline-flex items-center gap-1.5">
                                      {isOpen ? (
                                        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                      ) : (
                                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                      )}
                                      {l.countyName}, {l.stateAbbr}
                                    </span>
                                  </TableCell>
                                  {!isProspectDrilldown && (
                                    <TableCell className={l.leaked ? "line-through" : undefined}>
                                      <EditorLink label={l.description} kind="listing" onOpen={openEditor} />
                                    </TableCell>
                                  )}
                                  <TableCell className="text-muted-foreground">
                                    {l.repId ? (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          goToRepBreakdown(l.repId!);
                                        }}
                                        className="text-foreground underline-offset-2 hover:underline"
                                      >
                                        {repById(l.repId)?.name}
                                      </button>
                                    ) : (
                                      "Unassigned"
                                    )}
                                  </TableCell>
                                  {!isProspectDrilldown ? (
                                    <>
                                      <TableCell className="text-muted-foreground">
                                        <EditorLink label={auction?.name ?? "—"} kind="auction" onOpen={openEditor} />
                                      </TableCell>
                                      <TableCell className="text-muted-foreground">{auction?.endDate ?? "—"}</TableCell>
                                      <TableCell className="text-muted-foreground">{l.auctionType ?? "—"}</TableCell>
                                    </>
                                  ) : (
                                    <TableCell className="text-muted-foreground">{l.auctionType ?? "—"}</TableCell>
                                  )}
                                  {showValueColumn && (
                                    <TableCell className={`text-right font-medium ${l.leaked ? "line-through text-muted-foreground" : ""}`}>
                                      {fmtMoney(l.value)}
                                    </TableCell>
                                  )}
                                  {showStatusColumn && (
                                    <TableCell>
                                      <Badge
                                        variant="outline"
                                        className={l.leaked ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}
                                      >
                                        {l.leaked ? "Cancelled" : activeStatusLabel}
                                      </Badge>
                                    </TableCell>
                                  )}
                                </TableRow>
                                <TableRow>
                                  <TableCell colSpan={columnCount} className="p-0">
                                    <div className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                                      <div className="min-h-0 overflow-hidden">
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t bg-muted/30 p-3 text-xs sm:grid-cols-5">
                                          <ExpandField label="Terms (Seller) Commission Option" value={l.commissionOption} />
                                          {showValueBasedFields && <ExpandField label="Actual Value" value={fmtMoney(l.actualValue ?? 0)} />}
                                          {showValueBasedFields && (
                                            <ExpandField
                                              label="Variance (Actual vs. Estimated GTV)"
                                              value={fmtVariance(variance)}
                                              valueClassName={variance > 0 ? "text-green-600" : variance < 0 ? "text-red-600" : ""}
                                            />
                                          )}
                                          <ExpandField label="Vertical" value={l.vertical} />
                                          <ExpandField label="Seller Type" value={l.sellerType} />
                                          <ExpandField label="DM" value={hierarchy.dmName} />
                                          <ExpandField label="RM" value={hierarchy.rmName} />
                                          <ExpandField label="Territory" value={hierarchy.territory} />
                                          <ExpandField label="District" value={hierarchy.district} />
                                          <ExpandField label="Region" value={region} />
                                          {showContactDateField && <ExpandField label="Contact Date" value={l.contactDate ?? "—"} />}
                                          {showSignedDateField && <ExpandField label="Signed Date" value={l.signedDate ?? "—"} />}
                                          {showSoldDateField && <ExpandField label="Sold Date" value={l.soldDate ?? "—"} />}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              </Fragment>
                            );
                          })}
                          {stageListings.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={columnCount} className="py-8 text-center text-muted-foreground">
                                {geo ? "No listings at this stage in the current scope." : "Waiting on county data to load…"}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
                );
              })()}
            </div>
          </div>

          {/* By State — same funnel metrics as the cards above, broken out per state. Opened via Research Filters' "By State" button.
              !mt-0 when collapsed: this wrapper still occupies a slot in the space-y-4 flow even at 0 height, so without
              zeroing its own top margin here, the gap before it (this wrapper's margin) stacks with the gap after it
              (the next card's own margin), doubling the visible space whenever By State is closed. */}
          <div
            className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${byStateVisible ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
          >
          <div className="min-h-0 overflow-hidden">
          <div ref={byStateCardRef}>
            <Card className="!py-2">
              <CardHeader className="!py-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-sm font-semibold">{compareMode ? "Comparing States" : "By State"}</CardTitle>
                    <CardDescription>
                      {compareMode
                        ? "Add or remove states below — up to 5 at a time"
                        : compareStates.length > 0
                        ? `${compareStates.length} of 5 selected to compare`
                        : "Check 2-5 states to compare them side by side"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    {!compareMode && compareStates.length === 0 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={exportAllStatesToExcel}
                        disabled={sortedStateRows.length === 0}
                        className="h-8 w-8 bg-white"
                        title="Download Excel for all states shown"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    {!compareMode && compareStates.length >= 2 && (
                      <Button size="sm" onClick={() => setCompareMode(true)} className="h-8 text-xs">
                        Compare ({compareStates.length})
                      </Button>
                    )}
                    {(compareStates.length > 0 || compareMode) && (
                      <button
                        onClick={() => {
                          setCompareStates([]);
                          setCompareMode(false);
                        }}
                        className="text-xs text-muted-foreground hover:underline"
                      >
                        Clear
                      </button>
                    )}
                    <button onClick={() => setShowStateBreakdown(false)} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>

              {!compareMode ? (
                <CardContent className="!p-0">
                  <div className="max-h-96 overflow-y-auto [&>div]:overflow-visible">
                    <Table>
                      <TableHeader className="sticky top-0 z-10 bg-background">
                        <TableRow>
                          <TableHead className="w-8" />
                          <SortableHead label="State" sortKey="name" sort={stateSort.sort} onSort={stateSort.onSort} />
                          <SortableHead label="New Prospects" sortKey="unvaluedProspect" sort={stateSort.sort} onSort={stateSort.onSort} align="right" />
                          <SortableHead label="Interested Prospects" sortKey="valuedProspect" sort={stateSort.sort} onSort={stateSort.onSort} align="right" />
                          <SortableHead label="Unsigned Listings" sortKey="working" sort={stateSort.sort} onSort={stateSort.onSort} align="right" />
                          <SortableHead label="Signed Listings" sortKey="signedReady" sort={stateSort.sort} onSort={stateSort.onSort} align="right" />
                          <SortableHead label="Actualized GTV" sortKey="closed" sort={stateSort.sort} onSort={stateSort.onSort} align="right" />
                          <SortableHead label="Potential GTV" sortKey="potentialValue" sort={stateSort.sort} onSort={stateSort.onSort} align="right" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedStateRows.map((r) => {
                          const isSelected = compareStates.includes(r.abbr);
                          const disabled = !isSelected && compareStates.length >= 5;
                          return (
                            <TableRow key={r.abbr} className={isSelected ? "bg-muted/40" : undefined}>
                              <TableCell>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  disabled={disabled}
                                  onChange={() => toggleCompareState(r.abbr)}
                                  className="h-3.5 w-3.5 accent-slate-900 disabled:opacity-30"
                                  title={disabled ? "Up to 5 states at a time" : isSelected ? "Remove from comparison" : "Add to comparison"}
                                />
                              </TableCell>
                              <TableCell className="font-medium">{r.name}</TableCell>
                              <TableCell className="text-right">{fmtNum(r.unvaluedProspectCount)}</TableCell>
                              <TableCell className="text-right">
                                {fmtNum(r.valuedProspectCount)} · {fmtMoney(r.valuedProspectValue)}
                              </TableCell>
                              <TableCell className="text-right">
                                {fmtNum(r.workingCount)} · {fmtMoney(r.workingValue)}
                              </TableCell>
                              <TableCell className="text-right">
                                {fmtNum(r.signedReadyCount)} · {fmtMoney(r.signedReadyValue)}
                              </TableCell>
                              <TableCell className="text-right">
                                {fmtMoney(r.closedValue)} · {fmtNum(r.closedCount)} listings
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {fmtMoney(r.potentialValue)} · {fmtNum(r.potentialCount)} listings
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {sortedStateRows.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                              {geo ? "No state-level activity in the current scope." : "Waiting on county data to load…"}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="space-y-3 !pt-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {compareStateRows.map((r) => (
                        <Badge key={r.abbr} variant="outline" className="h-7 gap-1 bg-white pl-2.5 pr-1.5 text-xs font-normal">
                          {r.name}
                          <button
                            onClick={() => toggleCompareState(r.abbr)}
                            className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                            title={`Remove ${r.name}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {compareStates.length < 5 && (
                        <Popover open={addStateOpen} onOpenChange={setAddStateOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              + Add state
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-0 !z-[2000]" align="start">
                            <Command shouldFilter={false}>
                              <CommandInput placeholder="Search states…" value={addStateQuery} onValueChange={setAddStateQuery} />
                              <CommandList>
                                <CommandEmpty>No matches found.</CommandEmpty>
                                {stateRows
                                  .filter((r) => !compareStates.includes(r.abbr) && r.name.toLowerCase().includes(addStateQuery.trim().toLowerCase()))
                                  .slice(0, 8)
                                  .map((r) => (
                                    <CommandItem
                                      key={r.abbr}
                                      onSelect={() => {
                                        toggleCompareState(r.abbr);
                                        setAddStateQuery("");
                                        setAddStateOpen(false);
                                      }}
                                    >
                                      {r.name}
                                    </CommandItem>
                                  ))}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={exportStatesToExcel}
                      disabled={compareStateRows.length === 0}
                      className="h-8 w-8 shrink-0 bg-white"
                      title="Download Excel for these states"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  {compareStateRows.length >= 2 ? (
                    <div className="overflow-x-auto rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Metric</TableHead>
                            {compareStateRows.map((r) => (
                              <TableHead key={r.abbr} className="text-right">
                                {r.name}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {compareMetricRows.map((metric) => (
                            <TableRow key={metric.label}>
                              <TableCell className="text-muted-foreground">{metric.label}</TableCell>
                              {compareStateRows.map((r) => (
                                <TableCell key={r.abbr} className="text-right font-medium">
                                  {metric.getValue(r)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="py-8 text-center text-xs text-muted-foreground">Add at least one more state to compare.</p>
                  )}
                </CardContent>
              )}
            </Card>
          </div>
          </div>
          </div>

          <Card className="!py-2">
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 !py-2">
              <div>
                <CardTitle className="text-sm font-semibold">Actualized GTV vs. Prior Year</CardTitle>
                <CardDescription>Totals above compared across timeframes</CardDescription>
              </div>
              <div className="flex items-center gap-3 pt-0.5">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-sm bg-slate-900" />
                  Actual
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="h-2.5 w-1 rounded-sm bg-slate-500" />
                  Prior Year
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="h-2.5 w-1 rounded-sm bg-amber-500" />
                  Current Year Goals (Quarter/Year)
                </div>
              </div>
            </CardHeader>
            <CardContent className="!pt-0 !pb-2">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {trendData.map((row) => {
                  const priorYear = row["Prior Year"];
                  const hasGoal = row.id === "quarter" || row.id === "year";
                  const max = Math.max(row.Actual, priorYear, hasGoal ? row.Goal : 0, 1) * 1.08;
                  const actualPct = Math.min((row.Actual / max) * 100, 100);
                  const priorPct = Math.min((priorYear / max) * 100, 100);
                  const goalPct = hasGoal ? Math.min((row.Goal / max) * 100, 100) : null;
                  const pctOfGoal = hasGoal && row.Goal > 0 ? (row.Actual / row.Goal) * 100 : null;
                  const overGoal = pctOfGoal != null && pctOfGoal >= 100;
                  const vsPriorPct = priorYear > 0 ? ((row.Actual - priorYear) / priorYear) * 100 : 0;
                  return (
                    <div key={row.name} className="rounded-lg border-2 p-3">
                      <div className="mb-2 flex items-baseline justify-between">
                        <p className="text-xs font-medium text-muted-foreground">{row.name}</p>
                        <p className="text-lg font-semibold">{fmtMoney(row.Actual)}</p>
                      </div>

                      <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${hasGoal ? (overGoal ? "bg-green-600" : "bg-slate-900") : "bg-slate-900"}`}
                          style={{ width: `${actualPct}%` }}
                        />
                        <div className="absolute top-0 h-full w-[3px] bg-slate-500" style={{ left: `calc(${priorPct}% - 1.5px)` }} title="Prior Year" />
                        {goalPct != null && (
                          <div className="absolute top-0 h-full w-[3px] bg-amber-500" style={{ left: `calc(${goalPct}% - 1.5px)` }} title="Goal" />
                        )}
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 text-[11px]">
                        <span className="inline-flex items-center gap-0.5">
                          {vsPriorPct >= 0 ? <TrendingUp className="h-3 w-3 text-green-600" /> : <TrendingDown className="h-3 w-3 text-red-600" />}
                          <span className={vsPriorPct >= 0 ? "text-green-600" : "text-red-600"}>{fmtPct(vsPriorPct)}</span>
                          <span className="text-muted-foreground">vs {fmtMoney(priorYear)} last year</span>
                        </span>
                        {hasGoal &&
                          (pctOfGoal != null ? (
                            <span>
                              <span className="text-muted-foreground">{pctOfGoal.toFixed(0)}% of </span>
                              <span className={overGoal ? "font-medium text-green-600" : "font-medium text-amber-600"}>{fmtMoney(row.Goal)}</span>
                              <span className="text-muted-foreground"> goal</span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground">No goal set</span>
                          ))}
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
          {territoriesView === "map" && (
          <div ref={mapCardRef} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* LEFT: map */}
            <Card className="!py-2">
              <CardHeader className="!py-2 !gap-1">
                <div className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-sm font-semibold">Coverage Map</CardTitle>
                    <CardDescription>Click a county for its full pipeline breakdown</CardDescription>
                  </div>
                  <TerritoriesViewToggle view="map" onChange={setTerritoriesView} />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                  <Popover open={mapSearchOpen} onOpenChange={setMapSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="h-8 w-72 justify-start bg-white text-xs font-normal">
                        <Search className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                        Search a rep, state, or county…
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0 !z-[2000]" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput placeholder="Type a rep, state, or county…" value={mapSearchQuery} onValueChange={setMapSearchQuery} />
                        <CommandList>
                          <CommandEmpty>{mapSearchQuery.trim().length < 2 ? "Type at least 2 characters…" : "No matches found."}</CommandEmpty>
                          {mapSearchMatches.reps.length > 0 && (
                            <div className="px-2 pb-1 pt-2 text-[11px] font-medium text-muted-foreground">Reps</div>
                          )}
                          {mapSearchMatches.reps.map((r) => (
                            <CommandItem
                              key={r.id}
                              onSelect={() => {
                                territoryMapRef.current?.flyToRep(r.id);
                                setMapRepFilter(r.id);
                                setMapStateFilter(null);
                                setMapSearchOpen(false);
                              }}
                            >
                              <Users className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                              {r.name} <span className="ml-1 text-muted-foreground">({r.type === "territory" ? "TM" : "ISR"})</span>
                            </CommandItem>
                          ))}
                          {mapSearchMatches.states.length > 0 && (
                            <div className="px-2 pb-1 pt-2 text-[11px] font-medium text-muted-foreground">States</div>
                          )}
                          {mapSearchMatches.states.map((s) => (
                            <CommandItem
                              key={s.abbr}
                              onSelect={() => {
                                territoryMapRef.current?.flyToState(s.abbr);
                                setMapStateFilter(s.abbr);
                                setMapRepFilter(null);
                                setMapSearchOpen(false);
                              }}
                            >
                              <MapPin className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                              {s.name} ({s.abbr})
                            </CommandItem>
                          ))}
                          {mapSearchMatches.counties.length > 0 && (
                            <div className="px-2 pb-1 pt-2 text-[11px] font-medium text-muted-foreground">Counties</div>
                          )}
                          {mapSearchMatches.counties.map((c) => (
                            <CommandItem
                              key={c.fips}
                              onSelect={() => {
                                focusCounty(c.fips, c.name, c.stateAbbr, true);
                                setMapSearchOpen(false);
                              }}
                            >
                              {c.name}, {c.stateAbbr}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {mapStateFilter && (
                    <Badge variant="outline" className="h-8 gap-1.5 bg-white pl-2.5 pr-1.5 text-xs font-normal">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      Filtered to {STATE_NAMES[mapStateFilter] ?? mapStateFilter}
                      <button
                        onClick={() => setMapStateFilter(null)}
                        className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="Clear state filter"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {mapRepFilter && (
                    <Badge variant="outline" className="h-8 gap-1.5 bg-white pl-2.5 pr-1.5 text-xs font-normal">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      Filtered to {repById(mapRepFilter)?.name ?? mapRepFilter}
                      <button
                        onClick={() => setMapRepFilter(null)}
                        className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="Clear rep filter"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  </div>
                  <button
                    onClick={() => {
                      territoryMapRef.current?.resetView();
                      setSelectedFips(null);
                      setDisplayFips(null);
                      setDisplayCountyMeta(null);
                    }}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Clear
                  </button>
                </div>
              </CardHeader>
              <CardContent className="!py-2">
                <div className="h-[525px]">
                  <TerritoryMap
                    ref={territoryMapRef}
                    geo={geo}
                    visibleRegions={visibleRegions}
                    stateFilter={mapStateFilter}
                    visibleRepIds={visibleRepIds}
                    repFilter={mapRepFilter}
                    selectedFips={selectedFips}
                    selectedCountyMeta={selectedCountyMeta}
                    onSelectCounty={(fips, name, stateAbbr) => focusCounty(fips, name, stateAbbr, true)}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-3 border-t pt-3">
                  {(Object.keys(STATUS_COLOR) as (keyof typeof STATUS_COLOR)[]).map((k) => (
                    <div key={k} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: STATUS_COLOR[k] }} />
                      {STATUS_LABEL[k]}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* RIGHT: county detail, appears once a county is selected */}
            <Card className="!py-2">
              {displayCountyMeta && selectedCountyRecord ? (
                <>
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
                    <button
                      onClick={() => {
                        setSelectedFips(null);
                        setDisplayFips(null);
                        setDisplayCountyMeta(null);
                      }}
                      className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </CardHeader>
                  <CardContent className="space-y-4 !py-2">
                    {selectedCountyRecord.repId &&
                      (() => {
                        const rep = repById(selectedCountyRecord.repId!);
                        const hierarchy = repHierarchy(selectedCountyRecord.repId);
                        const repCountyCount = countiesByRepMapScoped.get(selectedCountyRecord.repId!)?.length ?? 0;
                        return (
                          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 rounded-lg border bg-muted/30 px-3 py-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Rep: </span>
                              <span className="font-medium text-foreground">{rep?.name}</span>
                            </div>
                            <div className="h-3 w-px bg-border" />
                            <div>
                              <span className="text-muted-foreground">Type: </span>
                              <span className="font-medium text-foreground">{rep?.type === "territory" ? "Territory Manager" : "ISR"}</span>
                            </div>
                            <div className="h-3 w-px bg-border" />
                            <div>
                              <span className="text-muted-foreground">District Manager: </span>
                              <span className="font-medium text-foreground">{hierarchy.dmName}</span>
                            </div>
                            <div className="h-3 w-px bg-border" />
                            <div>
                              <span className="text-muted-foreground">Counties: </span>
                              <span className="font-medium text-foreground">{repCountyCount}</span>
                            </div>
                          </div>
                        );
                      })()}

                    <PhaseCardGrid
                      amounts={{
                        unvaluedProspect: selectedCountyRecord.unvaluedProspect,
                        valuedProspect: selectedCountyRecord.valuedProspect,
                        working: selectedCountyRecord.working,
                        signedReady: selectedCountyRecord.signedReady,
                        closed: selectedCountyRecord.closed,
                      }}
                      factor={factor}
                      uncontactedCount={selectedCountyRecord.unvaluedProspectUncontactedCount}
                    />

                    <div className="max-h-96 overflow-y-auto rounded-md border [&>div]:overflow-visible">
                      <Table>
                        <TableHeader className="sticky top-0 z-10 bg-background">
                          <TableRow>
                            <TableHead className="w-8" />
                            <SortableHead label="Listing" sortKey="description" sort={countyListingsSort.sort} onSort={countyListingsSort.onSort} />
                            <SortableHead label="Stage" sortKey="stage" sort={countyListingsSort.sort} onSort={countyListingsSort.onSort} />
                            <SortableHead label="Rep" sortKey="rep" sort={countyListingsSort.sort} onSort={countyListingsSort.onSort} />
                            <SortableHead label="Value" sortKey="value" sort={countyListingsSort.sort} onSort={countyListingsSort.onSort} align="right" />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedCountyListings.map((l) => {
                            const auction = l.auctionId ? auctionById(l.auctionId) : undefined;
                            const isOpen = expandedCountyListingId === l.id;
                            return (
                              <Fragment key={l.id}>
                                <TableRow className="cursor-pointer" onClick={() => setExpandedCountyListingId(isOpen ? null : l.id)}>
                                  <TableCell>
                                    {isOpen ? (
                                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                    ) : (
                                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                    )}
                                  </TableCell>
                                  <TableCell className="text-foreground" title={l.description.length > 30 ? l.description : undefined}>
                                    <EditorLink label={truncate30(l.description)} kind="listing" onOpen={openEditor} />
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className={STAGE_BADGE_CLASS[l.stage]}>
                                      {STAGE_LABEL[l.stage]}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">{l.repId ? repById(l.repId)?.name : "Unassigned"}</TableCell>
                                  <TableCell className="text-right font-medium">{fmtMoney(l.value)}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell colSpan={5} className="p-0">
                                    <div className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                                      <div className="min-h-0 overflow-hidden">
                                        <div className="grid grid-cols-3 gap-x-4 gap-y-3 border-t bg-muted/30 p-3 text-xs">
                                          <ExpandField label="Auction" value={auction?.name ?? "—"} />
                                          <ExpandField label="Auction End Date" value={auction?.endDate ?? "—"} />
                                          <ExpandField label="Auction Type" value={l.auctionType ?? "—"} />
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              </Fragment>
                            );
                          })}
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
                </>
              ) : (
                <>
                  <CardHeader className="!py-2">
                    <CardTitle className="text-sm font-semibold">{topScopeLabel}</CardTitle>
                    <CardDescription>
                      Select a county on the map for its own breakdown — these are the overall totals for {topScopeLabel.toLowerCase()}, figures for{" "}
                      {TIMEFRAMES.find((t) => t.id === timeframe)!.label.toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 !py-2">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <div className="rounded-lg border p-3">
                        <p className="text-xs font-medium text-muted-foreground">Regional Managers</p>
                        <p className="mt-1 text-lg font-semibold">{fmtNum(territoriesScopeCounts.regionalManagers)}</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <p className="text-xs font-medium text-muted-foreground">District Managers</p>
                        <p className="mt-1 text-lg font-semibold">{fmtNum(territoriesScopeCounts.districtManagers)}</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <p className="text-xs font-medium text-muted-foreground">Reps</p>
                        <p className="mt-1 text-lg font-semibold">{fmtNum(territoriesScopeCounts.reps)}</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <p className="text-xs font-medium text-muted-foreground">Districts</p>
                        <p className="mt-1 text-lg font-semibold">{fmtNum(territoriesScopeCounts.districts)}</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <p className="text-xs font-medium text-muted-foreground">Territories</p>
                        <p className="mt-1 text-lg font-semibold">{fmtNum(territoriesScopeCounts.territories)}</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <p className="text-xs font-medium text-muted-foreground">Counties with Reps</p>
                        <p className="mt-1 text-lg font-semibold">{fmtNum(territoriesScopeCounts.countiesWithReps)}</p>
                      </div>
                    </div>

                    <PhaseCardGrid
                      amounts={{
                        unvaluedProspect: { count: totals.unvaluedProspectCount, value: 0 },
                        valuedProspect: { count: totals.valuedProspectCount, value: totals.valuedProspectValue },
                        working: { count: totals.workingCount, value: totals.working },
                        signedReady: { count: totals.signedReadyCount, value: totals.signedReady },
                        closed: { count: totals.closedCount, value: totals.closed },
                      }}
                      factor={factor}
                      uncontactedCount={totals.unvaluedProspectUncontactedCount}
                    />
                  </CardContent>
                </>
              )}
            </Card>
          </div>
          )}

          {territoriesView === "table" && (
          <div ref={repsCardRef}>
            <Card className="!py-2">
              <CardHeader className="!py-2">
                <div className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-sm font-semibold">Reps & Territories</CardTitle>
                    <CardDescription>
                      Territory Managers and Independent Sales Reps, ranked by total pipeline for {TIMEFRAMES.find((t) => t.id === timeframe)!.label.toLowerCase()} · click a rep for their full breakdown
                    </CardDescription>
                  </div>
                  <TerritoriesViewToggle view="table" onChange={setTerritoriesView} />
                </div>
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
                      <SortableHead label={PHASE_LABEL.unvaluedProspect} sortKey="unvaluedProspectCount" sort={repTableSort.sort} onSort={repTableSort.onSort} align="right" />
                      <SortableHead label={PHASE_LABEL.valuedProspect} sortKey="valuedProspect" sort={repTableSort.sort} onSort={repTableSort.onSort} align="right" />
                    <SortableHead label={PHASE_LABEL.working} sortKey="working" sort={repTableSort.sort} onSort={repTableSort.onSort} align="right" />
                    <SortableHead label={PHASE_LABEL.signedReady} sortKey="signedReady" sort={repTableSort.sort} onSort={repTableSort.onSort} align="right" />
                    <SortableHead label={PHASE_LABEL.closed} sortKey="closed" sort={repTableSort.sort} onSort={repTableSort.onSort} align="right" />
                    <SortableHead label="Total" sortKey="total" sort={repTableSort.sort} onSort={repTableSort.onSort} align="right" className="pr-6" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRepTableRows.map(({ rep, manager, roll, total }) => {
                    const isOpen = expandedRepId === rep.id;
                    const repCounties = countiesByRepMapScoped.get(rep.id) ?? [];
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
                          <TableCell className="text-right">{fmtNum(roll.unvaluedProspectCount)}</TableCell>
                          <TableCell className="text-right">{fmtMoney(roll.valuedProspect * factor)}</TableCell>
                          <TableCell className="text-right">{fmtMoney(roll.working * factor)}</TableCell>
                          <TableCell className="text-right">{fmtMoney(roll.signedReady * factor)}</TableCell>
                          <TableCell className="text-right">{fmtMoney(roll.closed * factor)}</TableCell>
                          <TableCell className="pr-6 text-right font-semibold">{fmtMoney(total * factor)}</TableCell>
                        </TableRow>
                        {(isOpen || displayRepId === rep.id) && (
                          <TableRow>
                            <TableCell />
                            <TableCell colSpan={10} className="p-0">
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
                                    <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-6">
                                      {REP_PHASE_ORDER.map((phase) => {
                                        const isActive = repStageFilter === phase;
                                        let primaryText: string;
                                        let secondaryText: string;
                                        if (phase === "unvaluedProspect") {
                                          primaryText = fmtNum(roll.unvaluedProspectCount);
                                          secondaryText = `${fmtNum(roll.unvaluedProspectUncontactedCount)} uncontacted`;
                                        } else if (phase === "valuedProspect") {
                                          primaryText = fmtNum(roll.valuedProspectCount);
                                          secondaryText = fmtMoney(roll.valuedProspect * factor);
                                        } else if (phase === "working") {
                                          primaryText = fmtNum(roll.workingCount);
                                          secondaryText = fmtMoney(roll.working * factor);
                                        } else if (phase === "signedReady") {
                                          primaryText = fmtNum(roll.signedReadyCount);
                                          secondaryText = fmtMoney(roll.signedReady * factor);
                                        } else {
                                          primaryText = fmtMoney(roll.closed * factor);
                                          secondaryText = `${fmtNum(roll.closedCount)} listings`;
                                        }
                                        return (
                                          <button
                                            key={phase}
                                            onClick={() => setRepStageFilter(isActive ? null : phase)}
                                            className={`rounded-md border bg-background p-2.5 text-left transition-colors hover:border-foreground/30 ${
                                              isActive ? "ring-2 ring-offset-1" : ""
                                            }`}
                                            style={isActive ? ({ ["--tw-ring-color" as any]: PHASE_COLOR[phase] } as React.CSSProperties) : undefined}
                                          >
                                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                                              <span className="h-2 w-2 rounded-full" style={{ background: PHASE_COLOR[phase] }} />
                                              {PHASE_LABEL[phase]}
                                            </div>
                                            <p className="mt-1 text-sm font-semibold">{primaryText}</p>
                                            <p className="text-[10px] text-muted-foreground">{secondaryText}</p>
                                          </button>
                                        );
                                      })}
                                      <div className="rounded-md border bg-background p-2.5 text-left" style={{ borderColor: "#ffc901" }}>
                                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                                          <span className="h-2 w-2 rounded-full" style={{ background: "#ffc901" }} />
                                          Potential GTV
                                        </div>
                                        <p className="mt-1 text-sm font-semibold">
                                          {fmtMoney((roll.valuedProspect + roll.working + roll.signedReady + roll.closed) * factor)}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">
                                          {fmtNum(roll.valuedProspectCount + roll.workingCount + roll.signedReadyCount + roll.closedCount)} listings
                                        </p>
                                      </div>
                                    </div>
                                    {repStageFilter && (
                                      <div className="mb-3 flex items-center justify-between rounded-md bg-muted/60 px-3 py-1.5 text-xs">
                                        <span className="text-muted-foreground">
                                          Filtered to <span className="font-medium text-foreground">{PHASE_LABEL[repStageFilter]}</span>
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
                                            <SortableHead label="Auction End Date" sortKey="auctionEndDate" sort={repBreakdownSort.sort} onSort={repBreakdownSort.onSort} />
                                            <SortableHead label="Auction Type" sortKey="auctionType" sort={repBreakdownSort.sort} onSort={repBreakdownSort.onSort} />
                                            <SortableHead label="Value" sortKey="value" sort={repBreakdownSort.sort} onSort={repBreakdownSort.onSort} align="right" />
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {sortedExpandedRepListings.map((l) => {
                                            const auction = l.auctionId ? auctionById(l.auctionId) : undefined;
                                            return (
                                              <TableRow
                                                key={l.id}
                                                className="cursor-pointer"
                                                onClick={() => focusCounty(l.fips, l.countyName, l.stateAbbr, true)}
                                              >
                                                <TableCell className="text-muted-foreground">
                                                  {l.countyName}, {l.stateAbbr}
                                                </TableCell>
                                                <TableCell>
                                                  <EditorLink label={l.description} kind="listing" onOpen={openEditor} />
                                                </TableCell>
                                                <TableCell>
                                                  <Badge variant="outline" className={STAGE_BADGE_CLASS[l.stage]}>
                                                    {STAGE_LABEL[l.stage]}
                                                  </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                  <EditorLink label={auction?.name ?? "—"} kind="auction" onOpen={openEditor} />
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">{auction?.endDate ?? "—"}</TableCell>
                                                <TableCell className="text-muted-foreground">{l.auctionType ?? "—"}</TableCell>
                                                <TableCell className="text-right font-medium">{fmtMoney(l.value)}</TableCell>
                                              </TableRow>
                                            );
                                          })}
                                          {sortedExpandedRepListings.length === 0 && (
                                            <TableRow>
                                              <TableCell colSpan={7} className="py-6 text-center text-muted-foreground">
                                                {repStageFilter
                                                  ? `No ${PHASE_LABEL[repStageFilter]} listings for this rep.`
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
          )}
        </TabsContent>

        {/* ------------------------------- AUCTIONS ------------------------------- */}
        <TabsContent value="auctions" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Estimated GTV"
              value={fmtMoney(auctionTotals.estimated)}
              icon={<Target className="h-4 w-4" />}
              footer={
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">{fmtMoney(auctionTotals.estimatedUnsigned)}</span> Unsigned +{" "}
                  <span className="font-medium text-foreground">{fmtMoney(auctionTotals.estimatedSigned)}</span> Signed
                </span>
              }
            />
            <StatCard
              label="Potential GTV"
              value={fmtMoney(auctionTotals.potential)}
              icon={<Gavel className="h-4 w-4" />}
              footer={
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">{fmtMoney(auctionTotals.potentialConfirmed)}</span> Confirmed +{" "}
                  <span className="font-medium text-foreground">{fmtMoney(auctionTotals.potentialTBA)}</span> Auction TBA
                </span>
              }
            />
            <StatCard label="Actualized GTV" value={fmtMoney(auctionTotals.actualized)} icon={<CheckCircle2 className="h-4 w-4" />} footer={<span className="text-muted-foreground">Already-sold, confirmed auctions</span>} />
            <StatCard
              label="Remaining vs Actualized"
              value={fmtMoney(auctionRemaining)}
              icon={<ArrowUpDown className="h-4 w-4" />}
              barPct={auctionTotals.potential > 0 ? (auctionTotals.actualized / auctionTotals.potential) * 100 : 0}
              barCaption={`${fmtMoney(auctionTotals.actualized)} actualized of ${fmtMoney(auctionTotals.potential)} potential`}
              footer={<span className="text-muted-foreground">Remaining to close</span>}
            />
          </div>

          <Card className="!py-2">
            <CardHeader className="!py-2">
              <CardTitle className="text-sm font-semibold">Auctions</CardTitle>
              <CardDescription>
                {TIMEFRAMES.find((t) => t.id === timeframe)!.label} · {sortedAuctions.length} auctions · click one for its listings
              </CardDescription>
            </CardHeader>
            <CardContent className="!p-0">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow>
                    <TableHead className="w-8" />
                    <SortableHead label="Auction" sortKey="name" sort={auctionsSort.sort} onSort={auctionsSort.onSort} />
                    <SortableHead label="Event Type" sortKey="eventType" sort={auctionsSort.sort} onSort={auctionsSort.onSort} />
                    <SortableHead label="LoB" sortKey="lineOfBusiness" sort={auctionsSort.sort} onSort={auctionsSort.onSort} />
                    <SortableHead label="Date" sortKey="week" sort={auctionsSort.sort} onSort={auctionsSort.onSort} />
                    <SortableHead label="Unsigned Listings" sortKey="unsigned" sort={auctionsSort.sort} onSort={auctionsSort.onSort} align="right" />
                    <SortableHead label="Cancelled Listings" sortKey="cancelled" sort={auctionsSort.sort} onSort={auctionsSort.onSort} align="right" />
                    <SortableHead label="Signed Listings" sortKey="signed" sort={auctionsSort.sort} onSort={auctionsSort.onSort} align="right" />
                    <SortableHead label="Actualized GTV" sortKey="sold" sort={auctionsSort.sort} onSort={auctionsSort.onSort} align="right" />
                    <SortableHead label="Total Potential" sortKey="totalPotential" sort={auctionsSort.sort} onSort={auctionsSort.onSort} align="right" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAuctions.map((a) => {
                    const isOpen = expandedAuctionId === a.id;
                    return (
                      <Fragment key={a.id}>
                        <TableRow
                          className={`cursor-pointer ${!a.scheduled ? "bg-orange-50/60 hover:bg-orange-50" : ""}`}
                          onClick={() => setExpandedAuctionId(isOpen ? null : a.id)}
                        >
                          <TableCell>
                            {isOpen ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                          </TableCell>
                          <TableCell className="font-medium">
                            <span className="inline-flex items-center gap-1.5">
                              <EditorLink label={a.name} kind="auction" onOpen={openEditor} />
                              {!a.scheduled && <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">TBA</Badge>}
                              {a.live && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Live</Badge>}
                              {a.closed && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Closed</Badge>}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{a.eventType}</TableCell>
                          <TableCell className="text-muted-foreground">{a.lineOfBusiness}</TableCell>
                          <TableCell className="text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <CalendarClock className="h-3.5 w-3.5" />
                              {a.week}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {a.unsignedValue > 0 || a.unsignedCount > 0 ? `${a.unsignedCount} · ${fmtMoney(a.unsignedValue)}` : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            {a.cancelledCount > 0 ? `${a.cancelledCount} · ${fmtMoney(a.cancelledValue)}` : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            {a.signedCount > 0 ? `${a.signedCount} · ${fmtMoney(a.signedValue)}` : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            {a.soldCount > 0 ? `${a.soldCount} · ${fmtMoney(a.soldActualValue)}` : "—"}
                          </TableCell>
                          <TableCell className="text-right font-medium">{fmtMoney(a.totalPotentialValue)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={10} className="p-0">
                            <div className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                              <div className="min-h-0 overflow-hidden">
                                <div className="border-t bg-muted/30 p-3">
                                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                                    {a.reportedListingCount} listings tied to this auction
                                  </p>
                                  <div className="max-h-96 overflow-y-auto rounded-md border bg-background [&>div]:overflow-visible">
                                    <Table>
                                      <TableHeader className="sticky top-0 z-10 bg-background">
                                        <TableRow>
                                          <SortableHead label="Listing" sortKey="description" sort={auctionListingsSort.sort} onSort={auctionListingsSort.onSort} />
                                          <SortableHead label="Stage" sortKey="stage" sort={auctionListingsSort.sort} onSort={auctionListingsSort.onSort} />
                                          <SortableHead label="Rep" sortKey="rep" sort={auctionListingsSort.sort} onSort={auctionListingsSort.onSort} />
                                          <SortableHead label="District Manager" sortKey="manager" sort={auctionListingsSort.sort} onSort={auctionListingsSort.onSort} />
                                          <SortableHead label="Estimated GTV" sortKey="value" sort={auctionListingsSort.sort} onSort={auctionListingsSort.onSort} align="right" />
                                          <TableHead className="text-right">Target Value</TableHead>
                                          <TableHead className="text-right">Untargeted Lots</TableHead>
                                          <TableHead className="text-right">Actual GTV</TableHead>
                                          <TableHead className="text-right">Variance</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {sortedExpandedAuctionListings.map((l) => {
                                          const isListingOpen = expandedAuctionListingId === l.id;
                                          const sold = l.stage === "closed";
                                          const items = getListingItems(l.id, l.value, sold);
                                          const targetValue = items.reduce((s, it) => s + (it.targetPrice ?? 0), 0);
                                          const untargetedCount = items.filter((it) => it.targetPrice == null).length;
                                          const variance = sold ? (l.actualValue ?? 0) - l.value : null;
                                          return (
                                            <Fragment key={l.id}>
                                              <TableRow
                                                className={`cursor-pointer ${l.leaked ? "text-muted-foreground" : ""}`}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setExpandedAuctionListingId(isListingOpen ? null : l.id);
                                                }}
                                              >
                                                <TableCell className={l.leaked ? "line-through" : undefined}>
                                                  <span className="inline-flex items-center gap-1.5">
                                                    {isListingOpen ? (
                                                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                                    ) : (
                                                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                                    )}
                                                    <EditorLink label={l.description} kind="listing" onOpen={openEditor} />
                                                    {l.leaked && (
                                                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 no-underline">
                                                        Cancelled
                                                      </Badge>
                                                    )}
                                                  </span>
                                                </TableCell>
                                                <TableCell>
                                                  <Badge variant="outline" className={STAGE_BADGE_CLASS[l.stage]}>
                                                    {STAGE_LABEL[l.stage]}
                                                  </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">{l.repId ? repById(l.repId)?.name : "Unassigned"}</TableCell>
                                                <TableCell className="text-muted-foreground">{repHierarchy(l.repId).dmName}</TableCell>
                                                <TableCell className={`text-right font-medium ${l.leaked ? "line-through" : ""}`}>{fmtMoney(l.value)}</TableCell>
                                                <TableCell className="text-right text-muted-foreground">{fmtMoney(targetValue)}</TableCell>
                                                <TableCell className="text-right text-muted-foreground">{untargetedCount}</TableCell>
                                                <TableCell className="text-right text-muted-foreground">{sold ? fmtMoney(l.actualValue ?? 0) : "—"}</TableCell>
                                                <TableCell
                                                  className={`text-right ${variance == null ? "text-muted-foreground" : variance > 0 ? "text-green-600" : variance < 0 ? "text-red-600" : ""}`}
                                                >
                                                  {variance == null ? "—" : fmtVariance(variance)}
                                                </TableCell>
                                              </TableRow>
                                              <TableRow>
                                                <TableCell colSpan={9} className="p-0">
                                                  <div
                                                    className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${
                                                      isListingOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                                    }`}
                                                  >
                                                    <div className="min-h-0 overflow-hidden">
                                                      <div className="border-t bg-muted/30 p-3">
                                                        <p className="mb-2 text-xs font-medium text-muted-foreground">{items.length} lots in this listing</p>
                                                        <div className="overflow-hidden rounded-md border bg-background">
                                                          <Table>
                                                            <TableHeader>
                                                              <TableRow>
                                                                <TableHead>Lot #</TableHead>
                                                                <TableHead>Lot Description</TableHead>
                                                                <TableHead className="text-right">Estimated GTV</TableHead>
                                                                <TableHead>Estimate Confidence</TableHead>
                                                                <TableHead className="text-right">Target Value</TableHead>
                                                                <TableHead className="text-right">Actual GTV</TableHead>
                                                                <TableHead className="text-right">Variance</TableHead>
                                                              </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                              {items.map((item) => {
                                                                const itemVariance = item.actualGTV != null ? item.actualGTV - item.estimatedGTV : null;
                                                                return (
                                                                <TableRow key={item.id}>
                                                                  <TableCell className="text-muted-foreground">{item.lotNumber}</TableCell>
                                                                  <TableCell>
                                                                    <EditorLink label={item.lotDescription} kind="lot" onOpen={openEditor} />
                                                                  </TableCell>
                                                                  <TableCell className="text-right">{fmtMoney(item.estimatedGTV)}</TableCell>
                                                                  <TableCell>
                                                                    <Badge
                                                                      variant="outline"
                                                                      className={
                                                                        item.estimateConfidence === "High"
                                                                          ? "bg-green-50 text-green-700 border-green-200"
                                                                          : item.estimateConfidence === "Medium"
                                                                          ? "bg-blue-50 text-blue-700 border-blue-200"
                                                                          : "bg-orange-50 text-orange-700 border-orange-200"
                                                                      }
                                                                    >
                                                                      {item.estimateConfidence}
                                                                    </Badge>
                                                                  </TableCell>
                                                                  <TableCell className="text-right">
                                                                    {item.targetPrice != null ? fmtMoney(item.targetPrice) : "—"}
                                                                  </TableCell>
                                                                  <TableCell className="text-right">{item.actualGTV != null ? fmtMoney(item.actualGTV) : "—"}</TableCell>
                                                                  <TableCell
                                                                    className={`text-right ${itemVariance == null ? "text-muted-foreground" : itemVariance > 0 ? "text-green-600" : itemVariance < 0 ? "text-red-600" : ""}`}
                                                                  >
                                                                    {itemVariance == null ? "—" : fmtVariance(itemVariance)}
                                                                  </TableCell>
                                                                </TableRow>
                                                                );
                                                              })}
                                                            </TableBody>
                                                          </Table>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </TableCell>
                                              </TableRow>
                                            </Fragment>
                                          );
                                        })}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EditorOpeningModal state={editorState} onClose={() => setEditorState(null)} />
    </div>
  );
}
