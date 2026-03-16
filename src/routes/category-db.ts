// ── category-db.ts ─────────────────────────────────────────────────────────────
// localStorage persistence layer for Category Definitions.
// All data is stored as a single JSON blob under DB_KEY.
// Call loadDb() to read, saveDb(state) to write.
// The component should use this instead of initialising from hardcoded data.

export interface Attribute {
  id: string
  name: string
  title: string
  editor: string
  displayOrder: number
  isOptional: boolean
  isSpecification: boolean
  notInDescription: boolean
  appendToDescription: boolean
  isChecklist?: boolean
  shouldHideOnSold?: boolean
  includeInNewChecklist?: boolean
  facet?: string | null
  prefix?: string
  value?: string
  suffix?: string
  units?: string
  unitsSeparator?: string
  isYesNo?: boolean
  omitYes?: boolean
  yesValue?: string
  omitNo?: boolean
  noValue?: string
  suppressSalebill?: boolean
  suppressNewspaper?: boolean
  values?: string
  notes?: string
  migration?: string
  isObsolete?: boolean
}

export interface CategoryDefinition {
  id: string
  guid: string
  name: string
  title: string
  auctionOrder: number
  categoryDisplayOrder: number
  auctionExtension: string
  priority: string
  isObsolete: boolean
  legacyTitle: string
  vertical: string
  effectiveDate: string
  status: 'active' | 'inactive'
  heading: {
    level1: string
    displayOrder1: string
    level2: string
    displayOrder2: string
  }
  parentConfig: {
    displayName: string
    parent1: string
    parent2: string
    parentDisplayOrder: string
  }
  industries: { industry1: string; industry2: string }
}

export type AttrOverride = Partial<{
  name: string
  title: string
  editor: string
  displayOrder: string
  isOptional: boolean
  appendToDescription: boolean
  notInDescription: boolean
  isSpecification: boolean
  isChecklist: boolean
  shouldHideOnSold: boolean
  includeInNewChecklist: boolean
  facet: string
  prefix: string
  value: string
  suffix: string
  units: string
  unitsSeparator: string
  isYesNo: boolean
  omitYes: boolean
  yesValue: string
  omitNo: boolean
  noValue: string
  suppressSalebill: boolean
  suppressNewspaper: boolean
  values: string
  notes: string
  migration: string
}>

export interface DbState {
  // The full list of category definitions
  cats: Array<CategoryDefinition>
  // Global attribute pool: attrId -> Attribute (value may be undefined if deleted)
  attrPool: Record<string, Attribute | undefined>
  // Per-category attribute assignment: catId -> attrId[]
  catAttrIds: Record<string, Array<string>>
  // Per-category per-attribute overrides: catId -> attrId -> override fields
  catAttrOverrides: Record<string, Record<string, AttrOverride>>
  // Schema version — increment when breaking changes are made
  version: number
}

const DB_KEY = 'bigiron_category_definitions_v1'
const SCHEMA_VERSION = 3

// ── Read ───────────────────────────────────────────────────────────────────────

export function loadDb(): DbState | null {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as DbState
    // If schema version mismatch, discard and re-seed
    if (parsed.version !== SCHEMA_VERSION) {
      console.warn(
        '[category-db] Schema version mismatch — clearing stored data',
      )
      localStorage.removeItem(DB_KEY)
      return null
    }
    return parsed
  } catch (err) {
    console.error('[category-db] Failed to load from localStorage:', err)
    return null
  }
}

// ── Write ──────────────────────────────────────────────────────────────────────

export function saveDb(state: DbState): void {
  try {
    localStorage.setItem(
      DB_KEY,
      JSON.stringify({ ...state, version: SCHEMA_VERSION }),
    )
  } catch (err) {
    console.error('[category-db] Failed to save to localStorage:', err)
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

// Call once on first load to write the seed data into localStorage.
// Only writes if localStorage is empty (won't overwrite existing data).
export function seedDbIfEmpty(seed: DbState): DbState {
  const existing = loadDb()
  if (existing) return existing
  saveDb(seed)
  return seed
}

// Clear all stored data (useful for dev/reset)
export function clearDb(): void {
  localStorage.removeItem(DB_KEY)
}
