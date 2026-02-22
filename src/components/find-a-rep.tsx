import { useMemo, useState } from 'react'
import { CountyCombobox } from '@/components/CountyCombobox'

// ─── Image helper ─────────────────────────────────────────────────────────────
const img = (filename: string) => `${import.meta.env.BASE_URL}${filename}`

// ─── Mock Data ────────────────────────────────────────────────────────────────
const REPRESENTATIVES = [
  {
    id: 1,
    name: 'Tyler Hanson',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(402) 555-0182',
    email: 't.hanson@bigiron.com',
    states: ['NE'],
    counties: ['ALL'],
    photo: img('sales1.jpg'),
    bio: '15 years in ag equipment auctions across the Midwest.',
  },
  {
    id: 2,
    name: 'Sara Mitchell',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(402) 555-0247',
    email: 's.mitchell@bigiron.com',
    states: ['NE'],
    counties: ['ALL'],
    photo: img('sales6.jpg'),
    bio: 'Specializing in farmland and rural property sales since 2010.',
  },
  {
    id: 3,
    name: 'Derek Olson',
    title: 'Livestock Auctioneer',
    type: 'Livestock' as RepType,
    phone: '(402) 555-0319',
    email: 'd.olson@bigiron.com',
    states: ['NE'],
    counties: ['Lancaster', 'Seward', 'Saline', 'Cass'],
    photo: img('sales2.jpg'),
    bio: 'Certified livestock auctioneer with experience in cattle and hog markets.',
  },
  {
    id: 4,
    name: 'Renae Burrows',
    title: 'Livestock Specialist',
    type: 'Livestock' as RepType,
    phone: '(402) 555-0451',
    email: 'r.burrows@bigiron.com',
    states: ['NE'],
    counties: ['Douglas', 'Sarpy', 'Washington', 'Dodge'],
    photo: img('sales7.jpg'),
    bio: 'Focused on eastern Nebraska livestock operations and feedlots.',
  },
  {
    id: 5,
    name: 'Brett Caldwell',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(515) 555-0128',
    email: 'b.caldwell@bigiron.com',
    states: ['IA'],
    counties: ['ALL'],
    photo: img('sales3.jpg'),
    bio: 'Iowa-based equipment expert with deep knowledge in row crop machinery.',
  },
  {
    id: 6,
    name: 'Donna Trevino',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(515) 555-0364',
    email: 'd.trevino@bigiron.com',
    states: ['IA'],
    counties: ['Polk', 'Warren', 'Dallas', 'Madison'],
    photo: img('sales6.jpg'),
    bio: 'Central Iowa farmland specialist with 200+ transactions closed.',
  },
  {
    id: 7,
    name: 'Marc Stein',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(563) 555-0091',
    email: 'm.stein@bigiron.com',
    states: ['IA'],
    counties: ['Scott', 'Clinton', 'Jackson', 'Cedar'],
    photo: img('sales4.jpg'),
    bio: 'Eastern Iowa rural real estate with expertise in transitional land.',
  },
  {
    id: 8,
    name: 'Angie Voss',
    title: 'Livestock Coordinator',
    type: 'Livestock' as RepType,
    phone: '(515) 555-0573',
    email: 'a.voss@bigiron.com',
    states: ['IA'],
    counties: ['ALL'],
    photo: img('sales7.jpg'),
    bio: 'Covers all of Iowa for livestock auction coordination and consulting.',
  },
  {
    id: 9,
    name: 'Phil Garrett',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(785) 555-0238',
    email: 'p.garrett@bigiron.com',
    states: ['KS'],
    counties: ['ALL'],
    photo: img('sales5.jpg'),
    bio: 'Kansas wheat and dryland farming equipment authority.',
  },
  {
    id: 10,
    name: 'Lori Ashton',
    title: 'Real Estate Agent',
    type: 'Real Estate' as RepType,
    phone: '(785) 555-0147',
    email: 'l.ashton@bigiron.com',
    states: ['KS'],
    counties: ['ALL'],
    photo: img('sales6.jpg'),
    bio: 'Statewide Kansas real estate with focus on large acre transactions.',
  },
  {
    id: 11,
    name: 'Curtis Webb',
    title: 'Livestock Specialist',
    type: 'Livestock' as RepType,
    phone: '(316) 555-0492',
    email: 'c.webb@bigiron.com',
    states: ['KS'],
    counties: ['Sedgwick', 'Harvey', 'Butler', 'Reno', 'McPherson'],
    photo: img('sales8.jpg'),
    bio: 'South-central Kansas cattle and stocker markets specialist.',
  },
  {
    id: 12,
    name: 'Janet Krueger',
    title: 'Equipment Specialist',
    type: 'Equipment' as RepType,
    phone: '(605) 555-0381',
    email: 'j.krueger@bigiron.com',
    states: ['SD'],
    counties: ['ALL'],
    photo: img('sales7.jpg'),
    bio: 'Covers all of South Dakota for farm equipment and construction machinery.',
  },
  {
    id: 13,
    name: 'Ray Halverson',
    title: 'Real Estate & Livestock Agent',
    type: 'Real Estate' as RepType,
    phone: '(605) 555-0204',
    email: 'r.halverson@bigiron.com',
    states: ['SD'],
    counties: ['ALL'],
    photo: img('sales9.jpg'),
    bio: 'Dual-licensed for SD real estate and livestock across the state.',
  },
  {
    id: 14,
    name: 'Ray Halverson',
    title: 'Real Estate & Livestock Agent',
    type: 'Livestock' as RepType,
    phone: '(605) 555-0204',
    email: 'r.halverson@bigiron.com',
    states: ['SD'],
    counties: ['ALL'],
    photo: img('sales9.jpg'),
    bio: 'Dual-licensed for SD real estate and livestock across the state.',
  },
]

// ─── Types ────────────────────────────────────────────────────────────────────
type RepType = 'Equipment' | 'Real Estate' | 'Livestock'
type FilterType = 'All' | RepType

interface Rep {
  id: number
  name: string
  title: string
  type: RepType
  phone: string
  email: string
  states: Array<string>
  counties: Array<string>
  photo: string
  bio: string
}

// ─── Type Config ──────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<
  RepType,
  {
    accent: string
    bg: string
    border: string
    badge: string
    dot: string
    ring: string
  }
> = {
  Equipment: {
    accent: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-200 dark:border-amber-800',
    badge:
      'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800',
    dot: 'bg-amber-500',
    ring: 'ring-amber-400',
  },
  'Real Estate': {
    accent: 'text-emerald-700 dark:text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    badge:
      'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-400',
  },
  Livestock: {
    accent: 'text-sky-700 dark:text-sky-500',
    bg: 'bg-sky-50 dark:bg-sky-950/20',
    border: 'border-sky-200 dark:border-sky-800',
    badge:
      'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-400 dark:border-sky-800',
    dot: 'bg-sky-500',
    ring: 'ring-sky-400',
  },
}

// ─── Rep Photo ────────────────────────────────────────────────────────────────
function RepPhoto({
  src,
  name,
  type,
}: {
  src: string
  name: string
  type: RepType
}) {
  const c = TYPE_CONFIG[type]
  return (
    <div
      className={`w-16 h-16 rounded-full flex-shrink-0 ring-2 ${c.ring} ring-offset-2 overflow-hidden bg-muted`}
    >
      <img
        src={src}
        alt={`Photo of ${name}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.currentTarget
          target.style.display = 'none'
          const parent = target.parentElement
          if (parent) {
            parent.classList.add('flex', 'items-center', 'justify-center')
            const initials = name
              .split(' ')
              .map((n) => n[0])
              .join('')
            parent.innerHTML = `<span class="text-xs font-bold text-muted-foreground">${initials}</span>`
          }
        }}
      />
    </div>
  )
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard({ type }: { type: RepType }) {
  const c = TYPE_CONFIG[type]
  return (
    <div className={`rounded-lg border ${c.border} ${c.bg} p-4 flex gap-4`}>
      <div
        className={`w-16 h-16 rounded-full flex-shrink-0 bg-muted animate-pulse ring-2 ${c.ring} ring-offset-2`}
      />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 w-32 bg-muted rounded animate-pulse" />
            <div className="h-3 w-24 bg-muted rounded animate-pulse" />
          </div>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${c.badge} opacity-60 whitespace-nowrap`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {type}
          </span>
        </div>
        <div className="space-y-1.5 pt-1">
          <div className="h-3 w-full bg-muted rounded animate-pulse" />
          <div className="h-3 w-4/5 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex gap-4 pt-0.5">
          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
          <div className="h-3 w-32 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

// ─── Rep Card ─────────────────────────────────────────────────────────────────
function RepCard({ rep }: { rep: Rep }) {
  const c = TYPE_CONFIG[rep.type]
  return (
    <div
      className={`rounded-lg border ${c.border} ${c.bg} p-4 flex gap-4 hover:shadow-sm transition-shadow duration-150`}
    >
      <RepPhoto src={rep.photo} name={rep.name} type={rep.type} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <p className="font-semibold text-foreground text-lg leading-tight">
              {rep.name}
            </p>
            <p className="text-md text-muted-foreground mt-0.5">{rep.title}</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${c.badge} whitespace-nowrap`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {rep.type}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {rep.bio}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5">
          <a
            href={`tel:${rep.phone}`}
            className={`cursor-pointer inline-flex items-center gap-1.5 text-md font-medium ${c.accent} hover:underline`}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth={0}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>
            {rep.phone}
          </a>
          <a
            href={`mailto:${rep.email}`}
            className={`cursor-pointer inline-flex items-center gap-1.5 text-md font-medium ${c.accent} hover:underline`}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            {rep.email}
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FindMySalesRep() {
  const [county, setCounty] = useState('')
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterType>('All')

  // "County, ST" → county name + state code
  const countyName = county.split(',')[0]?.trim() ?? ''
  const stateCode = county.split(',')[1]?.trim().toUpperCase() ?? ''

  const results = useMemo<Array<Rep>>(() => {
    if (!searched || !county.trim()) return []
    const ct = countyName.toLowerCase()
    const sc = stateCode
    return REPRESENTATIVES.filter((rep) => {
      if (sc && !rep.states.includes(sc)) return false
      if (rep.counties.includes('ALL')) return true
      return rep.counties.some((c) => c.toLowerCase() === ct)
    })
  }, [searched, county, countyName, stateCode])

  const filteredResults = useMemo(
    () =>
      activeFilter === 'All'
        ? results
        : results.filter((r) => r.type === activeFilter),
    [results, activeFilter],
  )

  const counts = useMemo(
    () => ({
      All: results.length,
      Equipment: results.filter((r) => r.type === 'Equipment').length,
      'Real Estate': results.filter((r) => r.type === 'Real Estate').length,
      Livestock: results.filter((r) => r.type === 'Livestock').length,
    }),
    [results],
  )

  const hasSearched = searched && !!county.trim()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearched(false)
    setLoading(true)
    setActiveFilter('All')
    setTimeout(() => {
      setLoading(false)
      setSearched(true)
    }, 1200)
  }

  function handleReset() {
    setCounty('')
    setSearched(false)
    setLoading(false)
    setActiveFilter('All')
  }

  const filters: Array<FilterType> = [
    'All',
    'Equipment',
    'Real Estate',
    'Livestock',
  ]

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Find My Sales Rep
        </h1>
        <p className="text-lg text-muted-foreground mt-1">
          Search by county to find your BigIron sales rep in your area.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch}>
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              County <span className="text-destructive">*</span>
            </label>
            <CountyCombobox
              value={county}
              onChange={(val) => {
                setCounty(val)
                setSearched(false)
              }}
              placeholder="Search county…"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!county.trim() || loading}
              className="cursor-pointer inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              )}
              {loading ? 'Searching…' : 'Find My Sales Rep'}
            </button>
            {(hasSearched || loading) && (
              <button
                type="button"
                onClick={handleReset}
                className="cursor-pointer inline-flex items-center h-9 px-4 rounded-md border border-input bg-background text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Skeleton */}
      {loading && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">
              Finding your sales reps…
            </span>
          </div>
          <SkeletonCard type="Equipment" />
          <SkeletonCard type="Real Estate" />
          <SkeletonCard type="Livestock" />
        </div>
      )}

      {/* Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {results.length > 0
                ? `${results.length} Sales Rep${results.length !== 1 ? 's' : ''} Found`
                : 'No Sales Reps Found'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{county}</p>
          </div>

          {results.length > 0 ? (
            <>
              {/* Filter Pills */}
              <div className="flex gap-2 flex-wrap">
                {filters.map((f) => {
                  const isActive = activeFilter === f
                  return (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`cursor-pointer inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                        isActive
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {f}
                      <span
                        className={`rounded-full px-1.5 py-px text-xs font-semibold ${
                          isActive
                            ? 'bg-primary-foreground/20 text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {counts[f]}
                      </span>
                    </button>
                  )
                })}
              </div>

              {filteredResults.length > 0 ? (
                <div className="space-y-3">
                  {filteredResults.map((rep) => (
                    <RepCard key={`${rep.id}-${rep.type}`} rep={rep} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-8 text-center border border-border rounded-lg bg-card">
                  No {activeFilter} reps found for your selection.
                </p>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-border bg-card p-10 text-center space-y-2">
              <p className="text-sm font-medium text-foreground">
                No sales reps found
              </p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                We don't have a rep assigned to {county} yet. Please contact
                BigIron directly.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
