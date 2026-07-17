import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import type { Feature, FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import "leaflet/dist/leaflet.css";
import { getCountyRecord, repById, FIPS_TO_STATE, RegionId, CountyRecord, primeCountyAssignments } from "@/data/mockSalesForecastData";

// Public county boundary GeoJSON (FIPS-keyed: feature.id is the 5-digit FIPS
// code, feature.properties.NAME is the bare county name). Fetched once by the
// parent dashboard so the same data can also drive rep/territory rollups —
// swap for an internal tile source or a locally hosted copy if
// raw.githubusercontent.com isn't on the app's allowed network list.
export const COUNTIES_URL =
  "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json";

export const STATUS_COLOR: Record<string, string> = {
  strong: "#16a34a",
  growing: "#2563eb",
  atrisk: "#f59e0b",
  openProspect: "#dc2626",
  unassigned: "#cbd5e1",
};

export const STATUS_LABEL: Record<string, string> = {
  strong: "On/above pace",
  growing: "In progress",
  atrisk: "Needs attention",
  openProspect: "Open prospect, no rep",
  unassigned: "No rep, no activity",
};

export function countyStatus(rec: CountyRecord): keyof typeof STATUS_COLOR {
  if (!rec.repId) return rec.prospect.value > 0 ? "openProspect" : "unassigned";
  const strong = rec.closed.value + rec.signedReady.value;
  const risk = rec.prospect.value;
  if (strong >= risk && strong >= rec.working.value) return "strong";
  if (risk > strong) return "atrisk";
  return "growing";
}

export function fipsFromFeature(feature: Feature<Geometry, GeoJsonProperties>): string {
  if (feature.id != null) return String(feature.id).padStart(5, "0");
  const p = feature.properties as any;
  return `${p?.STATE ?? ""}${p?.COUNTY ?? ""}`.padStart(5, "0");
}

const INITIAL_CENTER: [number, number] = [39.5, -98.35];
const INITIAL_ZOOM = 4;

export interface TerritoryMapHandle {
  resetView: () => void;
  flyToState: (stateAbbr: string) => void;
}

interface TerritoryMapProps {
  geo: FeatureCollection | null;
  visibleRegions: RegionId[];
  stateFilter?: string | null;
  selectedFips: string | null;
  selectedCountyMeta: { name: string; stateAbbr: string } | null;
  onSelectCounty: (fips: string, name: string, stateAbbr: string) => void;
}

/** Flies the map to whatever county is currently selected. Selection alone
 * (border/fill change) is nearly invisible among ~3,100 counties at national
 * zoom, so the map needs to actually move to make a selection legible —
 * especially when the selection came from clicking a row elsewhere on the
 * page rather than clicking the map itself. */
function FlyToSelectedCounty({ geo, selectedFips }: { geo: FeatureCollection; selectedFips: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedFips) return;
    const feature = geo.features.find((f) => fipsFromFeature(f as Feature<Geometry, GeoJsonProperties>) === selectedFips);
    if (!feature) return;
    try {
      const bounds = L.geoJSON(feature as any).getBounds();
      if (bounds.isValid()) {
        map.flyToBounds(bounds, { padding: [60, 60], maxZoom: 9, duration: 0.6 });
      }
    } catch {
      // Malformed/missing geometry for this feature — leave the map as-is.
    }
  }, [selectedFips, geo, map]);
  return null;
}

/** Bridges the imperative resetView() handle (exposed to the parent) to the
 * actual Leaflet map instance, which is only reachable via useMap() from
 * inside the MapContainer tree. */
function MapController({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
}

export const TerritoryMap = forwardRef<TerritoryMapHandle, TerritoryMapProps>(function TerritoryMap(
  { geo, visibleRegions, stateFilter, selectedFips, selectedCountyMeta, onSelectCounty },
  ref
) {
  const mapInstanceRef = useRef<L.Map | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      resetView: () => {
        mapInstanceRef.current?.flyTo(INITIAL_CENTER, INITIAL_ZOOM, { duration: 0.6 });
      },
      flyToState: (stateAbbr: string) => {
        if (!geo) return;
        const bounds = L.latLngBounds([]);
        for (const feature of geo.features) {
          const fips = fipsFromFeature(feature as Feature<Geometry, GeoJsonProperties>);
          if (FIPS_TO_STATE[fips.slice(0, 2)] !== stateAbbr) continue;
          try {
            const b = L.geoJSON(feature as any).getBounds();
            if (b.isValid()) bounds.extend(b);
          } catch {
            // Skip malformed geometry for this county.
          }
        }
        if (bounds.isValid()) {
          mapInstanceRef.current?.flyToBounds(bounds, { padding: [40, 40], duration: 0.6 });
        }
      },
    }),
    [geo]
  );

  if (!geo) {
    return (
      <div className="flex h-full min-h-[480px] animate-pulse items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
        Loading county boundaries…
      </div>
    );
  }
  primeCountyAssignments(geo);

  const style = (feature?: Feature<Geometry, GeoJsonProperties>) => {
    if (!feature) return {};
    const fips = fipsFromFeature(feature);
    const name = `${(feature.properties as any)?.NAME ?? "Unknown"} County`;
    const rec = getCountyRecord(fips, name);
    const inScope = visibleRegions.includes(rec.regionId) && (!stateFilter || rec.stateAbbr === stateFilter);
    const selected = selectedFips === fips;
    const status = countyStatus(rec);
    return {
      fillColor: STATUS_COLOR[status],
      fillOpacity: !inScope ? 0.08 : selected ? 0.95 : 0.65,
      color: selected ? "#0f172a" : "#ffffff",
      weight: selected ? 1.5 : 0.4,
      // Dashed border is a second, non-color signal for "prospects exist but
      // no rep is covering this county yet" — helps it read distinctly from
      // "needs attention" (also a warm color) at a glance, including for
      // colorblind users.
      dashArray: status === "openProspect" ? "3,2" : undefined,
    };
  };

  const onEachFeature = (feature: Feature<Geometry, GeoJsonProperties>, layer: L.Layer) => {
    const fips = fipsFromFeature(feature);
    const name = `${(feature.properties as any)?.NAME ?? "Unknown"} County`;
    const stateAbbr = FIPS_TO_STATE[fips.slice(0, 2)] ?? "";
    const rec = getCountyRecord(fips, name);
    const repName = rec.repId ? repById(rec.repId)?.name : null;
    layer.on("click", () => onSelectCounty(fips, name, stateAbbr));
    layer.bindTooltip(
      `<div class="text-xs"><strong>${name}, ${stateAbbr}</strong><br/>${repName ? `Rep: ${repName}` : "No rep assigned"}</div>`,
      { sticky: true }
    );
  };

  const selectedRec = selectedFips && selectedCountyMeta ? getCountyRecord(selectedFips, selectedCountyMeta.name) : null;
  const selectedRepName = selectedRec?.repId ? repById(selectedRec.repId)?.name : null;

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={INITIAL_CENTER}
        zoom={INITIAL_ZOOM}
        scrollWheelZoom
        className="h-full w-full rounded-lg"
        style={{ background: "#f8fafc" }}
      >
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapController mapRef={mapInstanceRef} />
        <FlyToSelectedCounty geo={geo} selectedFips={selectedFips} />
        {/* Remounting on selection/scope change forces react-leaflet to re-run
            style() per feature — GeoJSON layers don't auto-restyle when a prop
            changes without this. Fine at county-level feature counts (~3.1k). */}
        <GeoJSON
          key={`${selectedFips ?? "none"}-${visibleRegions.join(",")}-${stateFilter ?? "none"}`}
          data={geo}
          style={style}
          onEachFeature={onEachFeature}
        />
      </MapContainer>

      {selectedCountyMeta && (
        <div className="pointer-events-none absolute left-3 top-3 z-[1000] rounded-md border bg-background/95 px-3 py-2 text-xs shadow-md backdrop-blur-sm">
          <p className="font-semibold text-foreground">
            {selectedCountyMeta.name}, {selectedCountyMeta.stateAbbr}
          </p>
          <p className="text-muted-foreground">{selectedRepName ? `Rep: ${selectedRepName}` : "No rep assigned"}</p>
        </div>
      )}
    </div>
  );
});
