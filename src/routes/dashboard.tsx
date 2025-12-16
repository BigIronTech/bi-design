import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react'
import {
  ArrowUpDown,
  CalendarIcon,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Eye,
  Filter,
  Gavel,
  X,
} from 'lucide-react'
import { format } from 'date-fns'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import type { DateRange } from 'react-day-picker'
import type { AuctionListing } from '@/data/mockAuctionData'
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
    case 'Unassigned':
      return 'destructive'
    case 'Active':
      return 'successful'
    case 'Completed':
      return 'neutral'
    case 'Published':
      return 'information'
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

  // View mode state
  const [viewMode, setViewMode] = useState<'listings' | 'auctions'>('listings')

  // Modal state
  const [selectedListing, setSelectedListing] = useState<AuctionListing | null>(
    null,
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [assignToAuction, setAssignToAuction] = useState<string>('')

  const openListingModal = (listing: AuctionListing) => {
    setSelectedListing(listing)
    setIsModalOpen(true)
    setAssignToAuction('')
  }

  const closeListingModal = () => {
    setIsModalOpen(false)
    setSelectedListing(null)
    setAssignToAuction('')
  }

  const handleAssignAuction = () => {
    if (!selectedListing || !assignToAuction) return

    // In a real app, this would call an API to update the listing
    console.log(
      `Assigning listing ${selectedListing.id} to auction: ${assignToAuction}`,
    )

    // Close modal and show success (in real app, would update data and refetch)
    alert(
      `Lot "${selectedListing.title}" has been assigned to auction: ${assignToAuction}`,
    )
    closeListingModal()
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

  const filteredListings = auctionListings.filter((listing) => {
    // Filter by tab status
    if (listing.status !== activeTab) return false

    // For Pre-Auction tab, only show Published, Needs Attention, and Unassigned
    if (activeTab === 'pre-auction') {
      return (
        listing.auctionStatus === 'Published' ||
        listing.auctionStatus === 'Needs Attention' ||
        listing.auctionStatus === 'Unassigned'
      )
    }

    return true
  })

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
      // Skip date filtering for listings without endDate (like Unassigned)
      if (!listing.endDate) return true

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
      // Skip date filtering for listings without endDate (like Unassigned)
      if (!listing.endDate) return true

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
        // Handle empty endDate for unassigned listings
        aValue = a.endDate ? new Date(a.endDate).getTime() : 0
        bValue = b.endDate ? new Date(b.endDate).getTime() : 0
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
    viewMode,
  ])

  // Group listings by auction for auctions view
  const groupedByAuction = React.useMemo(() => {
    const groups = new Map<string, Array<AuctionListing>>()

    sortedListings.forEach((listing) => {
      const auctionName = listing.auctionName
      if (!groups.has(auctionName)) {
        groups.set(auctionName, [])
      }
      groups.get(auctionName)!.push(listing)
    })

    // Convert to array and sort: Unassigned first, then alphabetically
    return Array.from(groups.entries())
      .map(([auctionName, listings]) => ({
        auctionName,
        listings,
        totalListings: listings.length,
        totalStartingBid: listings.reduce((sum, l) => sum + l.startingBid, 0),
        totalCurrentBid: listings.reduce((sum, l) => sum + l.currentBid, 0),
        totalBids: listings.reduce((sum, l) => sum + l.bids, 0),
      }))
      .sort((a, b) => {
        // Unassigned always first
        if (a.auctionName === 'Unassigned') return -1
        if (b.auctionName === 'Unassigned') return 1
        // Then alphabetically
        return a.auctionName.localeCompare(b.auctionName)
      })
  }, [sortedListings])

  // All stats for tabs
  const stats = {
    'pre-auction': auctionListings.filter(
      (l) =>
        l.status === 'pre-auction' &&
        (l.auctionStatus === 'Published' ||
          l.auctionStatus === 'Needs Attention' ||
          l.auctionStatus === 'Unassigned'),
    ).length,
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
      (l) =>
        l.auctionStatus === 'Needs Attention' ||
        l.auctionStatus === 'Unassigned',
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
    if (!dateString) return 'TBD'
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
              Auction Cockpit
            </h1>
          </div>

          {/* Auction Listings Table */}
          <Card className="scroll-mt-4">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Browse Auctions and Lots</CardTitle>
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
                  {/* Filters Section */}
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
                                      <X
                                        className="ml-auto h-3 w-3"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setDateRange(undefined)
                                        }}
                                      />
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

                  {/* View Mode Toggle */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        View:
                      </span>
                      <Tabs
                        value={viewMode}
                        onValueChange={(value) =>
                          setViewMode(value as 'listings' | 'auctions')
                        }
                        className="w-auto"
                      >
                        <TabsList className="h-9">
                          <TabsTrigger
                            value="listings"
                            className="text-xs px-3 cursor-pointer"
                          >
                            Lots
                          </TabsTrigger>
                          <TabsTrigger
                            value="auctions"
                            className="text-xs px-3 cursor-pointer"
                          >
                            Auctions
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>

                  {/* Tabs and Status Tallies - Moved below filters */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <TabsList className="rounded-xl w-full lg:w-auto">
                      <TabsTrigger
                        value="pre-auction"
                        className="gap-2 cursor-pointer rounded-xl flex-1 lg:flex-initial"
                      >
                        Pre-Auction
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
                        className="gap-2 cursor-pointer rounded-xl flex-1 lg:flex-initial"
                      >
                        Live Auction
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
                        className="gap-2 cursor-pointer rounded-xl flex-1 lg:flex-initial"
                      >
                        Post-Auction
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
                              variant="neutral"
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

                  {/* Listings View */}
                  {viewMode === 'listings' && (
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
                              label="Lot Title"
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
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
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
                              <TableRow
                                key={listing.id}
                                className="cursor-pointer"
                                onClick={() => openListingModal(listing)}
                              >
                                <TableCell className="font-medium">
                                  <TooltipProvider>
                                    <TruncatedCell
                                      text={
                                        listing.auctionName === 'Unassigned'
                                          ? 'No Auction Assigned'
                                          : listing.auctionName
                                      }
                                    />
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
                                        text={
                                          listing.auctionStatus === 'Unassigned'
                                            ? 'Unassigned Auction'
                                            : listing.auctionStatus
                                        }
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
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openListingModal(listing)
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">
                                      View details
                                    </span>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Auctions View */}
                  {viewMode === 'auctions' && (
                    <div className="space-y-4">
                      {groupedByAuction.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground border rounded-md">
                          {hasActiveFilters
                            ? 'No auctions match your filter criteria'
                            : 'No auctions found in this category'}
                        </div>
                      ) : (
                        <Accordion type="multiple" className="w-full space-y-3">
                          {groupedByAuction.map((auction) => (
                            <AccordionItem
                              key={auction.auctionName}
                              value={auction.auctionName}
                              className="border rounded-lg bg-background hover:bg-muted/50 transition-colors cursor-pointer group"
                            >
                              <AccordionTrigger className="px-6 py-4 hover:no-underline cursor-pointer w-full">
                                <div className="flex items-center justify-between w-full gap-4">
                                  {/* Left: Auction Name & Count */}
                                  <div className="flex flex-col items-start gap-1 flex-1">
                                    <span className="font-semibold text-base">
                                      {auction.auctionName === 'Unassigned'
                                        ? 'Unassigned Lots'
                                        : auction.auctionName}
                                    </span>
                                    <span className="text-xs text-muted-foreground font-normal">
                                      {auction.totalListings}{' '}
                                      {auction.totalListings === 1
                                        ? 'listing'
                                        : 'listings'}
                                      {activeTab !== 'pre-auction' &&
                                        ` • ${auction.totalBids} ${auction.totalBids === 1 ? 'bid' : 'bids'}`}
                                    </span>
                                  </div>

                                  {/* Center: Dates */}
                                  <div className="flex items-center gap-4 flex-1 justify-center">
                                    {auction.auctionName !== 'Unassigned' &&
                                    auction.listings[0]?.endDate ? (
                                      <>
                                        <div className="text-center">
                                          <div className="text-xs text-muted-foreground">
                                            {activeTab === 'pre-auction'
                                              ? 'Opens'
                                              : 'Opened'}
                                          </div>
                                          <div className="text-sm font-medium">
                                            {format(
                                              new Date(
                                                auction.listings[0].endDate,
                                              ).setDate(
                                                new Date(
                                                  auction.listings[0].endDate,
                                                ).getDate() - 14,
                                              ),
                                              'MMM dd, yyyy',
                                            )}
                                          </div>
                                        </div>
                                        <span className="text-muted-foreground">
                                          →
                                        </span>
                                        <div className="text-center">
                                          <div className="text-xs text-muted-foreground">
                                            {activeTab === 'pre-auction'
                                              ? 'Closes'
                                              : activeTab === 'post-auction'
                                                ? 'Closed'
                                                : 'Closes'}
                                          </div>
                                          <div className="text-sm font-medium">
                                            {format(
                                              new Date(
                                                auction.listings[0].endDate,
                                              ),
                                              'MMM dd, yyyy',
                                            )}
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <span className="text-sm text-muted-foreground">
                                        No dates assigned
                                      </span>
                                    )}
                                  </div>

                                  {/* Right: Bid Totals & Expand Icon */}
                                  <div className="flex items-center gap-6 flex-1 justify-end">
                                    {/* Total Target (always shown) */}
                                    <div className="text-right">
                                      <div className="text-xs text-muted-foreground">
                                        Total Target
                                      </div>
                                      <div className="text-sm font-semibold">
                                        {formatCurrency(
                                          auction.totalStartingBid,
                                        )}
                                      </div>
                                    </div>

                                    {/* Actual Total (live and post-auction only) */}
                                    {activeTab !== 'pre-auction' && (
                                      <div className="text-right">
                                        <div className="text-xs text-muted-foreground">
                                          Actual Total
                                        </div>
                                        <div className="text-sm font-semibold">
                                          {formatCurrency(
                                            auction.totalCurrentBid,
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Chevron with rotation */}
                                    <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 cursor-pointer group-data-[state=open]:rotate-180" />
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-4">
                                <div className="rounded-md border mt-2">
                                  <Table>
                                    <TableHeader className="bg-muted">
                                      <TableRow>
                                        <TableHead>Lot Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        {activeTab !== 'post-auction' && (
                                          <TableHead>Opening Bid</TableHead>
                                        )}
                                        {activeTab !== 'pre-auction' && (
                                          <TableHead>
                                            {activeTab === 'post-auction'
                                              ? 'Winning Bid'
                                              : 'Current Bid'}
                                          </TableHead>
                                        )}
                                        {activeTab !== 'pre-auction' && (
                                          <TableHead className="text-center">
                                            Bids
                                          </TableHead>
                                        )}
                                        <TableHead>
                                          {activeTab === 'pre-auction'
                                            ? 'Scheduled Date'
                                            : 'End Date'}
                                        </TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Sales Rep</TableHead>
                                        <TableHead className="text-right">
                                          Actions
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {auction.listings.map((listing) => (
                                        <TableRow
                                          key={listing.id}
                                          className="cursor-pointer"
                                          onClick={() =>
                                            openListingModal(listing)
                                          }
                                        >
                                          <TableCell>
                                            <div className="flex flex-col">
                                              <span className="font-medium">
                                                <TooltipProvider>
                                                  <TruncatedCell
                                                    text={listing.title}
                                                  />
                                                </TooltipProvider>
                                              </span>
                                              <span className="text-xs text-muted-foreground">
                                                <TooltipProvider>
                                                  <TruncatedCell
                                                    text={listing.seller}
                                                  />
                                                </TooltipProvider>
                                              </span>
                                            </div>
                                          </TableCell>
                                          <TableCell>
                                            <Badge variant="outline">
                                              <TooltipProvider>
                                                <TruncatedCell
                                                  text={listing.category}
                                                />
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
                                                  text={
                                                    listing.auctionStatus ===
                                                    'Unassigned'
                                                      ? 'Unassigned Auction'
                                                      : listing.auctionStatus
                                                  }
                                                />
                                              </TooltipProvider>
                                            </Badge>
                                          </TableCell>
                                          {activeTab !== 'post-auction' && (
                                            <TableCell>
                                              {formatCurrency(
                                                listing.startingBid,
                                              )}
                                            </TableCell>
                                          )}
                                          {activeTab !== 'pre-auction' && (
                                            <TableCell className="font-semibold">
                                              {formatCurrency(
                                                listing.currentBid,
                                              )}
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
                                              <TruncatedCell
                                                text={listing.location}
                                              />
                                            </TooltipProvider>
                                          </TableCell>
                                          <TableCell>
                                            <TooltipProvider>
                                              <TruncatedCell
                                                text={listing.salesRep}
                                              />
                                            </TooltipProvider>
                                          </TableCell>
                                          <TableCell className="text-right">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                openListingModal(listing)
                                              }}
                                            >
                                              <Eye className="h-4 w-4" />
                                              <span className="sr-only">
                                                View details
                                              </span>
                                            </Button>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      )}
                    </div>
                  )}

                  {/* Pagination Controls */}
                  {viewMode === 'listings' && totalItems > 0 && (
                    <div className="flex items-center justify-between px-2 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-muted-foreground m-0">
                            Rows per page
                          </div>
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
                        <div className="text-sm text-muted-foreground">
                          Showing{' '}
                          <span className="font-medium">{startIndex + 1}</span>{' '}
                          to{' '}
                          <span className="font-medium">
                            {Math.min(endIndex, totalItems)}
                          </span>{' '}
                          of <span className="font-medium">{totalItems}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground mr-2">
                          Page {currentPage} of {totalPages}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
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
                          className="h-8 w-8"
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronsRight className="h-4 w-4" />
                          <span className="sr-only">Last page</span>
                        </Button>
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

                {/* Auction Assignment - only for Unassigned listings */}
                {selectedListing.auctionStatus === 'Unassigned' && (
                  <div className="space-y-3 bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div>
                      <Label className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                        Assign to Auction
                      </Label>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                        This lot needs to be assigned to an auction before it
                        can be published.
                      </p>
                    </div>
                    <Select
                      value={assignToAuction}
                      onValueChange={setAssignToAuction}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an auction..." />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueAuctionNames
                          .filter((name) => name !== 'Unassigned')
                          .map((name) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

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
                {selectedListing.auctionStatus === 'Unassigned' ? (
                  <Button
                    onClick={handleAssignAuction}
                    disabled={!assignToAuction}
                  >
                    Save Assignment
                  </Button>
                ) : (
                  <Button onClick={closeListingModal}>
                    {getActionSuggestion(selectedListing.auctionStatus).action}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
