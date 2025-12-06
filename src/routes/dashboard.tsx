import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react'
import {
  ArrowUpDown,
  CalendarIcon,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Eye,
  Filter,
  Gavel,
  X,
} from 'lucide-react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import type { AuctionListing } from '@/data/mockAuctionData'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import { auctionListings } from '@/data/mockAuctionData'
import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { ButtonToggle } from '@/components/button-toggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

// Helper function to get badge variant and custom classes based on status
const getStatusBadgeVariant = (
  status: string,
):
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'successful'
  | 'warning'
  | 'neutral'
  | 'information' => {
  switch (status) {
    case 'Needs Attention':
      return 'destructive'
    case 'Active':
    case 'Completed':
    case 'Published':
      return 'successful'
    case 'Pending':
    case 'Pending Payment':
    case 'Pending Pickup':
    case 'In Ops Hands':
      return 'warning'
    case 'Queued':
    case 'Submitted':
      return 'secondary'
    default:
      return 'outline'
  }
}

// Sortable table header component
interface SortableTableHeadProps {
  column: string
  label: string
  sortColumn: string | null
  sortDirection: 'asc' | 'desc'
  onSort: (column: string) => void
  className?: string
}

const SortableTableHead = ({
  column,
  label,
  sortColumn,
  sortDirection,
  onSort,
  className,
}: SortableTableHeadProps) => {
  const isActive = sortColumn === column

  return (
    <TableHead className={className}>
      <button
        onClick={() => onSort(column)}
        className="flex items-center gap-1 hover:text-foreground transition-colors font-medium"
      >
        {label}
        <ArrowUpDown
          className={`h-4 w-4 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}
        />
      </button>
    </TableHead>
  )
}

// Component to truncate text and show full text in tooltip
const TruncatedCell = ({
  text,
  maxLength = 20,
}: {
  text: string
  maxLength?: number
}) => {
  const shouldTruncate = text && text.length > maxLength
  const truncatedText = shouldTruncate
    ? `${text.substring(0, maxLength)}...`
    : text

  if (!shouldTruncate) {
    return <>{text}</>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help">{truncatedText}</span>
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  )
}

// Wrapper component to handle sidebar state (must be inside SidebarProvider)
function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const sidebar = useSidebar()

  // Auto-close sidebar on mount only (only for dashboards)
  React.useEffect(() => {
    sidebar.setOpen(false)
  }, []) // Empty dependency array - only run once on mount

  const handleBreadcrumbClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    sidebar.setOpen(true)
  }

  return (
    <>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            {/* SidebarTrigger automatically toggles sidebar open/closed */}
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" onClick={handleBreadcrumbClick}>
                    Dashboards
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Auction Insights</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto h-5 flex items-center gap-2 px-3">
            <div className=" md:block text-sm text-muted-foreground">
              <span className="px-2">v1.0.0</span>
            </div>
            <Separator orientation="vertical" />
            <ButtonToggle />
          </div>
        </header>
        {children}
      </SidebarInset>
    </>
  )
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState('live-auction')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Filter states
  const [filterAuctionId, setFilterAuctionId] = useState('')
  const [filterTitle, setFilterTitle] = useState('')
  const [filterSalesRep, setFilterSalesRep] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Modal state
  const [selectedListing, setSelectedListing] = useState<AuctionListing | null>(
    null,
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Ref for scrolling to table
  const tableCardRef = React.useRef<HTMLDivElement>(null)

  const openListingModal = (listing: AuctionListing) => {
    setSelectedListing(listing)
    setIsModalOpen(true)
  }

  const closeListingModal = () => {
    setIsModalOpen(false)
    setSelectedListing(null)
  }

  const getActionSuggestion = (status: string) => {
    switch (status) {
      case 'Submitted':
        return {
          suggestion:
            'This listing has been submitted and is awaiting review. Please review the details and approve for publication.',
          action: 'Review & Approve',
        }
      case 'Pending':
        return {
          suggestion:
            'This listing is pending final approval. Review the information and move to published when ready.',
          action: 'Approve Listing',
        }
      case 'Queued':
        return {
          suggestion:
            'This listing is queued for publication. It will automatically go live on the scheduled date. Operations is expected to begin review on the ETA date.',
          action: 'Edit Schedule',
        }
      case 'In Ops Hands':
        return {
          suggestion:
            'This listing is currently being reviewed by the operations team. Double check that all details are correct.',
          action: 'Review Details',
        }
      case 'Needs Attention':
        return {
          suggestion:
            'This listing requires immediate attention. There may be missing information or issues that need to be resolved.',
          action: 'Resolve Issues',
        }
      case 'Published':
        return {
          suggestion:
            'This listing is published and ready to go live. It will begin accepting bids on the scheduled date.',
          action: 'View Public Page',
        }
      case 'Active':
        return {
          suggestion:
            'This auction is currently live and accepting bids. Monitor bidding activity and respond to inquiries.',
          action: 'Monitor Auction',
        }
      case 'Pending Payment':
        return {
          suggestion:
            'This auction has ended. The winning bidder needs to complete payment before pickup can be scheduled.',
          action: 'Send Payment Reminder',
        }
      case 'Pending Pickup':
        return {
          suggestion:
            'Payment has been received. Coordinate with the buyer to schedule pickup of the item.',
          action: 'Schedule Pickup',
        }
      case 'Completed':
        return {
          suggestion:
            'This auction has been completed successfully. All payment and pickup have been finalized.',
          action: 'View Final Report',
        }
      default:
        return {
          suggestion: 'Review this listing for any required actions.',
          action: 'View Details',
        }
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new column and default to ascending
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const clearFilters = () => {
    setFilterAuctionId('')
    setFilterTitle('')
    setFilterSalesRep('')
    setDateRange(undefined)
  }

  const hasActiveFilters =
    filterAuctionId ||
    filterTitle ||
    filterSalesRep ||
    dateRange?.from ||
    dateRange?.to

  // Get unique values for filter dropdowns
  const uniqueAuctionNames = [
    ...new Set(auctionListings.map((l) => l.auctionName)),
  ].sort()
  const uniqueTitles = [...new Set(auctionListings.map((l) => l.title))].sort()
  const uniqueSalesReps = [
    ...new Set(auctionListings.map((l) => l.salesRep)),
  ].sort()

  const filteredListings = auctionListings.filter(
    (listing) => listing.status === activeTab,
  )

  // Apply filters without tab filtering (for cross-tab stats)
  const allFilteredListings = auctionListings.filter((listing) => {
    // Filter by Auction Name
    if (
      filterAuctionId &&
      !listing.auctionName.toLowerCase().includes(filterAuctionId.toLowerCase())
    ) {
      return false
    }

    // Filter by Title
    if (
      filterTitle &&
      !listing.title.toLowerCase().includes(filterTitle.toLowerCase())
    ) {
      return false
    }

    // Filter by Sales Rep
    if (
      filterSalesRep &&
      !listing.salesRep.toLowerCase().includes(filterSalesRep.toLowerCase())
    ) {
      return false
    }

    // Filter by Date Range
    if (dateRange?.from || dateRange?.to) {
      const listingDate = new Date(listing.endDate)

      if (dateRange.from) {
        const startDate = new Date(dateRange.from)
        startDate.setHours(0, 0, 0, 0)
        if (listingDate < startDate) return false
      }

      if (dateRange.to) {
        const endDate = new Date(dateRange.to)
        endDate.setHours(23, 59, 59, 999)
        if (listingDate > endDate) return false
      }
    }

    return true
  })

  // Apply filters to current tab
  const filteredBySearch = filteredListings.filter((listing) => {
    // Filter by Auction Name
    if (
      filterAuctionId &&
      !listing.auctionName.toLowerCase().includes(filterAuctionId.toLowerCase())
    ) {
      return false
    }

    // Filter by Title
    if (
      filterTitle &&
      !listing.title.toLowerCase().includes(filterTitle.toLowerCase())
    ) {
      return false
    }

    // Filter by Sales Rep
    if (
      filterSalesRep &&
      !listing.salesRep.toLowerCase().includes(filterSalesRep.toLowerCase())
    ) {
      return false
    }

    // Filter by Date Range
    if (dateRange?.from || dateRange?.to) {
      const listingDate = new Date(listing.endDate)

      if (dateRange.from) {
        const startDate = new Date(dateRange.from)
        startDate.setHours(0, 0, 0, 0)
        if (listingDate < startDate) return false
      }

      if (dateRange.to) {
        const endDate = new Date(dateRange.to)
        endDate.setHours(23, 59, 59, 999)
        if (listingDate > endDate) return false
      }
    }

    return true
  })

  // Sort the filtered listings
  const sortedListings = [...filteredBySearch].sort((a, b) => {
    if (!sortColumn) return 0

    let aValue: any
    let bValue: any

    switch (sortColumn) {
      case 'id':
        aValue = a.id
        bValue = b.id
        break
      case 'title':
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case 'category':
        aValue = a.category
        bValue = b.category
        break
      case 'status':
        aValue = a.auctionStatus
        bValue = b.auctionStatus
        break
      case 'openingBid':
        aValue = a.startingBid
        bValue = b.startingBid
        break
      case 'currentBid':
      case 'winningBid':
        aValue = a.currentBid
        bValue = b.currentBid
        break
      case 'bids':
        aValue = a.bids
        bValue = b.bids
        break
      case 'endDate':
      case 'scheduledDate':
        aValue = new Date(a.endDate).getTime()
        bValue = new Date(b.endDate).getTime()
        break
      case 'location':
        aValue = a.location.toLowerCase()
        bValue = b.location.toLowerCase()
        break
      case 'salesRep':
        aValue = a.salesRep.toLowerCase()
        bValue = b.salesRep.toLowerCase()
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // Pagination calculations
  const totalItems = sortedListings.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedListings = sortedListings.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [
    filterAuctionId,
    filterTitle,
    filterSalesRep,
    dateRange,
    activeTab,
    itemsPerPage,
  ])

  // Jake's personal stats for top cards
  const jakeStats = {
    'pre-auction': auctionListings.filter(
      (l) => l.status === 'pre-auction' && l.salesRep === 'Jake Peters',
    ).length,
    'live-auction': auctionListings.filter(
      (l) => l.status === 'live-auction' && l.salesRep === 'Jake Peters',
    ).length,
    'post-auction': auctionListings.filter(
      (l) => l.status === 'post-auction' && l.salesRep === 'Jake Peters',
    ).length,
  }

  // All stats for tabs
  const stats = {
    'pre-auction': auctionListings.filter((l) => l.status === 'pre-auction')
      .length,
    'live-auction': auctionListings.filter((l) => l.status === 'live-auction')
      .length,
    'post-auction': auctionListings.filter((l) => l.status === 'post-auction')
      .length,
  }

  // Filtered stats for tabs (based on applied filters across all tabs)
  const filteredStats = {
    'pre-auction': allFilteredListings.filter((l) => l.status === 'pre-auction')
      .length,
    'live-auction': allFilteredListings.filter(
      (l) => l.status === 'live-auction',
    ).length,
    'post-auction': allFilteredListings.filter(
      (l) => l.status === 'post-auction',
    ).length,
  }

  // Status tallies across all tabs (based on filtered results)
  const statusTallies = {
    pending: allFilteredListings.filter(
      (l) =>
        l.auctionStatus === 'Pending' ||
        l.auctionStatus === 'Queued' ||
        l.auctionStatus === 'Pending Payment' ||
        l.auctionStatus === 'Pending Pickup' ||
        l.auctionStatus === 'Submitted',
    ).length,
    needsAttention: allFilteredListings.filter(
      (l) => l.auctionStatus === 'Needs Attention',
    ).length,
    published: allFilteredListings.filter(
      (l) => l.auctionStatus === 'Published' || l.auctionStatus === 'Active',
    ).length,
    completed: allFilteredListings.filter(
      (l) => l.auctionStatus === 'Completed',
    ).length,
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <DashboardWrapper>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-sidebar">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">
              Auction Insights
            </h1>
            <div className="flex items-center gap-4 sm:justify-start justify-end">
              <div className="text-left lg:text-right">
                <h2 className="text-base font-semibold">
                  Hello Jake, take action on your items
                </h2>
                <p className="text-sm text-muted-foreground">
                  You have{' '}
                  <span className="font-semibold">
                    {
                      auctionListings.filter(
                        (l) =>
                          l.salesRep === 'Jake Peters' &&
                          l.status === 'pre-auction',
                      ).length
                    }{' '}
                    items currently in Pre-Auction
                  </span>{' '}
                  and{' '}
                  <span className="font-semibold">
                    {
                      auctionListings.filter(
                        (l) =>
                          l.salesRep === 'Jake Peters' &&
                          l.auctionStatus === 'Needs Attention',
                      ).length
                    }{' '}
                    items that need your immediate attention
                  </span>
                </p>
              </div>
              <Separator
                orientation="vertical"
                className="hidden lg:block min-h-12 w-px bg-foreground/30"
              />
              <div className="hidden lg:flex min-h-12 min-w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-lg">
                JP
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="gap-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  My Pre-Auction
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-row mt-auto justify-between items-end">
                  <div>
                    <div className="text-2xl font-bold">
                      {jakeStats['pre-auction']}
                    </div>
                    <div className="flex items-end justify-between mt-1">
                      <p className="text-xs text-muted-foreground mb-0">
                        Upcoming auctions
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      setActiveTab('pre-auction')
                      setFilterSalesRep('Jake Peters')
                      setTimeout(() => {
                        tableCardRef.current?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        })
                      }, 100)
                    }}
                  >
                    Show Me
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="gap-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  My Live Auctions
                </CardTitle>
                <Gavel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-row mt-auto justify-between items-end">
                  <div>
                    <div className="text-2xl font-bold">
                      {jakeStats['live-auction']}
                    </div>
                    <div className="flex items-end justify-between mt-1">
                      <p className="text-xs text-muted-foreground mb-0">
                        Currently active
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      setActiveTab('live-auction')
                      setFilterSalesRep('Jake Peters')
                      setTimeout(() => {
                        tableCardRef.current?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        })
                      }, 100)
                    }}
                  >
                    Show Me
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="gap-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  My Post-Auction
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-row mt-auto justify-between items-end">
                  <div>
                    <div className="text-2xl font-bold">
                      {jakeStats['post-auction']}
                    </div>
                    <div className="flex items-end justify-between mt-1">
                      <p className="text-xs text-muted-foreground mb-0">
                        Completed auctions
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      setActiveTab('post-auction')
                      setFilterSalesRep('Jake Peters')
                      setTimeout(() => {
                        tableCardRef.current?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        })
                      }, 200)
                    }}
                  >
                    Show Me
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Auction Listings Table */}
          <Card ref={tableCardRef} className="scroll-mt-4 gap-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="pr-4">
                  <CardTitle>Browse Listings</CardTitle>
                  <CardDescription>
                    View and manage auction listings across all stages
                  </CardDescription>
                </div>
                <Button variant="outline">HubSpot</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value={activeTab} className="mt-0">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    defaultValue="item-1"
                  >
                    <AccordionItem
                      value="item-1"
                      className="mb-4 border rounded-lg bg-muted"
                    >
                      <AccordionTrigger className="px-4 hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span>Filter</span>
                          {hasActiveFilters && (
                            <Badge
                              variant="default"
                              className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                            >
                              {
                                [
                                  filterAuctionId,
                                  filterTitle,
                                  filterSalesRep,
                                  dateRange?.from || dateRange?.to,
                                ].filter(Boolean).length
                              }
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Separator className="flex-1" />
                            {hasActiveFilters && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="h-8 text-xs ml-4"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Clear All Filters
                              </Button>
                            )}
                          </div>
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {/* Auction Filter */}
                            <div className="space-y-2 min-w-[200px]">
                              <Label
                                htmlFor="filter-auction-id"
                                className="text-xs"
                              >
                                Auction
                              </Label>
                              <div className="relative">
                                <Input
                                  id="filter-auction-id"
                                  placeholder="Search by auction..."
                                  value={filterAuctionId}
                                  onChange={(e) =>
                                    setFilterAuctionId(e.target.value)
                                  }
                                  className="h-9 pr-8 bg-background border-neutral-400"
                                  list="auction-names"
                                />
                                {filterAuctionId && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFilterAuctionId('')}
                                    className="absolute right-0 top-0 h-9 w-9 p-0 hover:bg-transparent"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                              <datalist id="auction-names">
                                {uniqueAuctionNames.map((name) => (
                                  <option key={name} value={name} />
                                ))}
                              </datalist>
                            </div>

                            {/* Auction Title Filter */}
                            <div className="space-y-2 min-w-[200px]">
                              <Label htmlFor="filter-title" className="text-xs">
                                Auction Title
                              </Label>
                              <div className="relative">
                                <Input
                                  id="filter-title"
                                  placeholder="Search by title..."
                                  value={filterTitle}
                                  onChange={(e) =>
                                    setFilterTitle(e.target.value)
                                  }
                                  className="h-9 pr-8 bg-background border-neutral-400"
                                  list="auction-titles"
                                />
                                {filterTitle && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFilterTitle('')}
                                    className="absolute right-0 top-0 h-9 w-9 p-0 hover:bg-transparent"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                              <datalist id="auction-titles">
                                {uniqueTitles.map((title) => (
                                  <option key={title} value={title} />
                                ))}
                              </datalist>
                            </div>

                            {/* Sales Rep Filter */}
                            <div className="space-y-2 min-w-[200px]">
                              <Label
                                htmlFor="filter-sales-rep"
                                className="text-xs"
                              >
                                Sales Rep
                              </Label>
                              <div className="relative">
                                <Input
                                  id="filter-sales-rep"
                                  placeholder="Search by rep..."
                                  value={filterSalesRep}
                                  onChange={(e) =>
                                    setFilterSalesRep(e.target.value)
                                  }
                                  className="h-9 pr-8 bg-background border-neutral-400"
                                  list="sales-reps"
                                />
                                {filterSalesRep && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFilterSalesRep('')}
                                    className="absolute right-0 top-0 h-9 w-9 p-0 hover:bg-transparent"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                              <datalist id="sales-reps">
                                {uniqueSalesReps.map((rep) => (
                                  <option key={rep} value={rep} />
                                ))}
                              </datalist>
                            </div>

                            {/* Date Range Filter */}
                            <div className="space-y-2 min-w-[200px]">
                              <Label className="text-xs">Date Range</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      'w-full h-9 justify-start text-left font-normal text-xs bg-background',
                                      !dateRange && 'text-muted-foreground',
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-3 w-3" />
                                    {dateRange?.from ? (
                                      dateRange.to ? (
                                        <>
                                          {format(dateRange.from, 'LLL dd, y')}{' '}
                                          - {format(dateRange.to, 'LLL dd, y')}
                                        </>
                                      ) : (
                                        format(dateRange.from, 'LLL dd, y')
                                      )
                                    ) : (
                                      <span>Pick a date range</span>
                                    )}
                                    {dateRange?.from && (
                                      <span
                                        className="ml-auto flex items-center cursor-pointer hover:text-destructive"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setDateRange(undefined)
                                        }}
                                      >
                                        <X className="h-4 w-4" />
                                      </span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    numberOfMonths={2}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Tabs and Status Tallies - Moved below filters */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <TabsList className="rounded-[10px] w-full lg:w-auto">
                      <TabsTrigger
                        value="pre-auction"
                        className="gap-2 cursor-pointer rounded-lg flex-1 lg:flex-initial"
                      >
                        <div className="flex">
                          <span>Pre</span>
                          <span className="hidden sm:flex">-Auction</span>
                        </div>
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: hasActiveFilters
                              ? 'hsl(48 96% 53%)'
                              : 'color-mix(in oklab, var(--muted-foreground) 30%, transparent)',
                          }}
                          className={
                            hasActiveFilters ? 'text-black' : 'text-foreground'
                          }
                        >
                          {hasActiveFilters
                            ? filteredStats['pre-auction']
                            : stats['pre-auction']}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger
                        value="live-auction"
                        className="gap-2 cursor-pointer rounded-lg flex-1 lg:flex-initial"
                      >
                        <div className="flex">
                          <span>Live</span>
                          <span className="hidden sm:flex">&nbsp; Auction</span>
                        </div>
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: hasActiveFilters
                              ? 'hsl(48 96% 53%)'
                              : 'color-mix(in oklab, var(--muted-foreground) 30%, transparent)',
                          }}
                          className={
                            hasActiveFilters ? 'text-black' : 'text-foreground'
                          }
                        >
                          {hasActiveFilters
                            ? filteredStats['live-auction']
                            : stats['live-auction']}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger
                        value="post-auction"
                        className="gap-2 cursor-pointer rounded-lg flex-1 lg:flex-initial"
                      >
                        <div className="flex">
                          <span>Post</span>
                          <span className="hidden sm:flex">-Auction</span>
                        </div>
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: hasActiveFilters
                              ? 'hsl(48 96% 53%)'
                              : 'color-mix(in oklab, var(--muted-foreground) 30%, transparent)',
                          }}
                          className={
                            hasActiveFilters ? 'text-black' : 'text-foreground'
                          }
                        >
                          {hasActiveFilters
                            ? filteredStats['post-auction']
                            : stats['post-auction']}
                        </Badge>
                      </TabsTrigger>
                    </TabsList>

                    {/* Status Tallies */}
                    <div className="flex flex-wrap items-center gap-2 justify-start lg:justify-end">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="warning"
                              className="gap-1 cursor-help"
                            >
                              Pending
                              <span className="ml-1 font-semibold">
                                {statusTallies.pending}
                              </span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            Includes Pending, Queued, Pending Payment and
                            Pending Pickup
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="destructive"
                              className="gap-1 cursor-help"
                            >
                              Needs Attention
                              <span className="ml-1 font-semibold">
                                {statusTallies.needsAttention}
                              </span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            Includes Pre, Live and Post-Auction
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="information"
                              className="gap-1 cursor-help"
                            >
                              Published
                              <span className="ml-1 font-semibold">
                                {statusTallies.published}
                              </span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            All approved auctions that are ready to go Live
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="successful"
                              className="gap-1 cursor-help"
                            >
                              Completed
                              <span className="ml-1 font-semibold">
                                {statusTallies.completed}
                              </span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            All auctions that have finished, paid and picked up
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader className="bg-muted">
                        <TableRow>
                          <SortableTableHead
                            column="id"
                            label="Auction"
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                          <SortableTableHead
                            column="title"
                            label="Item Name"
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                          <SortableTableHead
                            column="category"
                            label="Category"
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                          <SortableTableHead
                            column="status"
                            label="Status"
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                          {activeTab !== 'post-auction' && (
                            <SortableTableHead
                              column="openingBid"
                              label="Opening Bid"
                              sortColumn={sortColumn}
                              sortDirection={sortDirection}
                              onSort={handleSort}
                            />
                          )}
                          {activeTab !== 'pre-auction' && (
                            <SortableTableHead
                              column={
                                activeTab === 'post-auction'
                                  ? 'winningBid'
                                  : 'currentBid'
                              }
                              label={
                                activeTab === 'post-auction'
                                  ? 'Winning Bid'
                                  : 'Current Bid'
                              }
                              sortColumn={sortColumn}
                              sortDirection={sortDirection}
                              onSort={handleSort}
                            />
                          )}
                          {activeTab !== 'pre-auction' && (
                            <SortableTableHead
                              column="bids"
                              label="Bids"
                              sortColumn={sortColumn}
                              sortDirection={sortDirection}
                              onSort={handleSort}
                              className="text-center"
                            />
                          )}
                          <SortableTableHead
                            column={
                              activeTab === 'pre-auction'
                                ? 'scheduledDate'
                                : 'endDate'
                            }
                            label={
                              activeTab === 'pre-auction'
                                ? 'Scheduled Date'
                                : 'End Date'
                            }
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                          <SortableTableHead
                            column="location"
                            label="Location"
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                          <SortableTableHead
                            column="salesRep"
                            label="Sales Rep"
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedListings.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={11}
                              className="text-center h-24 text-muted-foreground"
                            >
                              {hasActiveFilters
                                ? 'No listings match your filter criteria'
                                : 'No listings found in this category'}
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedListings.map((listing) => (
                            <TableRow key={listing.id}>
                              <TableCell className="font-medium">
                                <TooltipProvider>
                                  <TruncatedCell text={listing.auctionName} />
                                </TooltipProvider>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    <TooltipProvider>
                                      <TruncatedCell text={listing.title} />
                                    </TooltipProvider>
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    <TooltipProvider>
                                      <TruncatedCell text={listing.seller} />
                                    </TooltipProvider>
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  <TooltipProvider>
                                    <TruncatedCell text={listing.category} />
                                  </TooltipProvider>
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={getStatusBadgeVariant(
                                    listing.auctionStatus,
                                  )}
                                >
                                  <TooltipProvider>
                                    <TruncatedCell
                                      text={listing.auctionStatus}
                                    />
                                  </TooltipProvider>
                                </Badge>
                              </TableCell>
                              {activeTab !== 'post-auction' && (
                                <TableCell>
                                  {formatCurrency(listing.startingBid)}
                                </TableCell>
                              )}
                              {activeTab !== 'pre-auction' && (
                                <TableCell className="font-semibold">
                                  {formatCurrency(listing.currentBid)}
                                </TableCell>
                              )}
                              {activeTab !== 'pre-auction' && (
                                <TableCell className="text-center">
                                  {listing.bids}
                                </TableCell>
                              )}
                              <TableCell>
                                {formatDate(listing.endDate)}
                              </TableCell>
                              <TableCell>
                                <TooltipProvider>
                                  <TruncatedCell text={listing.location} />
                                </TooltipProvider>
                              </TableCell>
                              <TableCell>
                                <TooltipProvider>
                                  <TruncatedCell text={listing.salesRep} />
                                </TooltipProvider>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openListingModal(listing)}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View details</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination Controls */}
                  {totalItems > 0 && (
                    <div className="flex items-center justify-between px-2 py-4">
                      <div className="sm:flex hidden items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          {' '}
                          <span className="font-medium">
                            {startIndex + 1}
                          </span>{' '}
                          to{' '}
                          <span className="font-medium">
                            {Math.min(endIndex, totalItems)}
                          </span>{' '}
                          of <span className="font-medium">{totalItems}</span>
                        </div>
                      </div>
                      <div className="flex ml-auto items-center gap-6 w-fit">
                        <div className="sm:flex hidden items-center gap-2">
                          <p className="text-sm text-muted-foreground !mb-0">
                            Rows per page
                          </p>
                          <Select
                            value={itemsPerPage.toString()}
                            onValueChange={(value) =>
                              setItemsPerPage(Number(value))
                            }
                          >
                            <SelectTrigger className="h-8 w-[70px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="text-sm font-medium mr-1">
                          Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 sm:flex hidden"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                          >
                            <ChevronsLeft className="h-4 w-4" />
                            <span className="sr-only">First page</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous page</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next page</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 sm:flex hidden"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronsRight className="h-4 w-4" />
                            <span className="sr-only">Last page</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </DashboardWrapper>

      {/* Listing Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedListing && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedListing.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedListing.id} • {selectedListing.auctionName} •{' '}
                  {selectedListing.category}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status Badge */}
                <div>
                  <Badge
                    variant={getStatusBadgeVariant(
                      selectedListing.auctionStatus,
                    )}
                  >
                    {selectedListing.auctionStatus}
                  </Badge>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Opening Bid
                    </Label>
                    <p className="text-lg font-semibold">
                      {formatCurrency(selectedListing.startingBid)}
                    </p>
                  </div>

                  {/* Current Bid / Winning Bid - only for Live and Post */}
                  {selectedListing.status !== 'pre-auction' && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        {selectedListing.status === 'post-auction'
                          ? 'Winning Bid'
                          : 'Current Bid'}
                      </Label>
                      <p className="text-lg font-semibold">
                        {selectedListing.currentBid === 0 ? (
                          <span className="text-muted-foreground text-sm">
                            Not yet available
                          </span>
                        ) : (
                          formatCurrency(selectedListing.currentBid)
                        )}
                      </p>
                    </div>
                  )}

                  {/* Total Bids - only for Live and Post */}
                  {selectedListing.status !== 'pre-auction' && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Total Bids
                      </Label>
                      <p className="text-lg font-semibold">
                        {selectedListing.bids}
                      </p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      {selectedListing.status === 'pre-auction'
                        ? 'Scheduled Date'
                        : 'End Date'}
                    </Label>
                    <p className="text-lg font-semibold">
                      {formatDate(selectedListing.endDate)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Location
                    </Label>
                    <p className="text-base">{selectedListing.location}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Sales Rep
                    </Label>
                    <p className="text-base">{selectedListing.salesRep}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-xs text-muted-foreground">
                      Seller
                    </Label>
                    <p className="text-base">{selectedListing.seller}</p>
                  </div>

                  {/* Operations Handler - only for In Ops Hands */}
                  {selectedListing.auctionStatus === 'In Ops Hands' &&
                    selectedListing.opsHandler && (
                      <>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Operations Handler
                          </Label>
                          <p className="text-base font-medium">
                            {selectedListing.opsHandler}
                          </p>
                        </div>
                        {selectedListing.opsETA && (
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Expected Completion
                            </Label>
                            <p className="text-base font-medium">
                              {formatDate(selectedListing.opsETA)}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                  {/* Operations ETA - only for Queued */}
                  {selectedListing.auctionStatus === 'Queued' &&
                    selectedListing.opsETA && (
                      <div className="space-y-1 col-span-2">
                        <Label className="text-xs text-muted-foreground">
                          Operations Review Starts
                        </Label>
                        <p className="text-base font-medium">
                          {formatDate(selectedListing.opsETA)}
                        </p>
                      </div>
                    )}

                  {/* Winner Information - only for Post-Auction */}
                  {selectedListing.status === 'post-auction' &&
                    selectedListing.winnerName && (
                      <>
                        <div className="space-y-1 col-span-2">
                          <Separator />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Winning Bidder
                          </Label>
                          <p className="text-base font-medium">
                            {selectedListing.winnerName}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Bidder ID
                          </Label>
                          <p className="text-base">
                            {selectedListing.winnerBidderId}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Phone
                          </Label>
                          <p className="text-base">
                            {selectedListing.winnerPhone}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Email
                          </Label>
                          <p className="text-base">
                            {selectedListing.winnerEmail}
                          </p>
                        </div>
                      </>
                    )}
                </div>

                <Separator />

                {/* Action Suggestion */}
                <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <Label className="text-sm font-semibold">
                        Recommended Action
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {
                          getActionSuggestion(selectedListing.auctionStatus)
                            .suggestion
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={closeListingModal}>
                  Close
                </Button>
                <Button onClick={closeListingModal}>
                  {getActionSuggestion(selectedListing.auctionStatus).action}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
