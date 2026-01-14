import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react'
import {
  AlertCircle,
  ArrowUpDown,
  Ban,
  Clock,
  ExternalLink,
  LogOut,
  Plus,
  Search,
  Settings,
  Shield,
  User,
  X,
} from 'lucide-react'
import { format } from 'date-fns'
import type {
  AuditEntry,
  BanDuration,
  BanReason,
  IPBan,
} from '@/data/mockipbandata'
import { cn } from '@/lib/utils'
import {
  banReasons,
  currentUser,
  durationOptions,
  ipBans,
} from '@/data/mockipbandata'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Route = createFileRoute('/ip-ban-management')({
  component: IPBanManagement,
})

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
  maxLength = 24,
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

// Helper to generate lot URL from lot number
const getLotUrl = (lotNumber: string) => {
  // Convert lot number to URL-friendly format
  // Example: TR4892 -> /Lots/tr4892
  const slug = lotNumber.toLowerCase()
  return `https://www.bigiron.com/Lots/${slug}`
}

// Wrapper component to handle sidebar state
function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const sidebar = useSidebar()

  // Auto-close sidebar on mount
  React.useEffect(() => {
    sidebar.setOpen(false)
  }, [])

  const handleBreadcrumbClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    sidebar.setOpen(true)
  }

  return (
    <>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
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
                  <BreadcrumbPage>IP Ban Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto h-5 flex items-center gap-2 px-3">
            <div className=" md:block text-sm text-muted-foreground">
              <span className="px-2">v1.0.0</span>
            </div>
            <Separator orientation="vertical" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8">
                  <span className="text-sm font-medium">
                    {currentUser.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {currentUser.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Separator orientation="vertical" />
            <ButtonToggle />
          </div>
        </header>
        {children}
      </SidebarInset>
    </>
  )
}

function IPBanManagement() {
  const [bans, setBans] = useState<Array<IPBan>>(ipBans)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'expired' | 'unbanned'
  >('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedBan, setSelectedBan] = useState<IPBan | null>(null)
  const [showAuditLog, setShowAuditLog] = useState(false)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Create ban form state
  const [newBan, setNewBan] = useState({
    ipAddress: '',
    banReason: '' as BanReason | '',
    duration: '' as BanDuration | '',
    customNotes: '',
    lotNumber: '',
    bidderId: '',
    bidderName: '',
    duplicateOfBidderId: '',
  })

  // Calculate statistics
  const stats = {
    totalBans: bans.length,
    activeBans: bans.filter((b) => b.status === 'active').length,
    userBans: bans.filter((b) => b.bannedBy.id === currentUser.id).length,
  }

  // Filter and sort functions
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const filteredBans = bans.filter((ban) => {
    const matchesSearch =
      ban.ipAddress.includes(searchTerm) ||
      ban.bidderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ban.lotNumber?.includes(searchTerm) ||
      ban.bannedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ban.bannedBy.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ban.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const sortedBans = [...filteredBans].sort((a, b) => {
    if (!sortColumn) return 0

    let aValue: any
    let bValue: any

    switch (sortColumn) {
      case 'ipAddress':
        aValue = a.ipAddress
        bValue = b.ipAddress
        break
      case 'reason':
        aValue = a.banReason
        bValue = b.banReason
        break
      case 'bannedBy':
        aValue = a.bannedBy.name.toLowerCase()
        bValue = b.bannedBy.name.toLowerCase()
        break
      case 'bannedAt':
        aValue = a.bannedAt.getTime()
        bValue = b.bannedAt.getTime()
        break
      case 'expiresAt':
        aValue = a.expiresAt ? a.expiresAt.getTime() : 0
        bValue = b.expiresAt ? b.expiresAt.getTime() : 0
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const handleCreateBan = () => {
    const selectedReason = banReasons.find(
      (r: (typeof banReasons)[number]) => r.value === newBan.banReason,
    )

    // Validation
    if (!newBan.ipAddress || !newBan.banReason || !newBan.duration) {
      alert('Please fill in all required fields')
      return
    }

    if (selectedReason?.requiresLot && !newBan.lotNumber) {
      alert('Lot number is required for this ban reason')
      return
    }

    if (
      selectedReason?.requiresBidder &&
      (!newBan.bidderId || !newBan.bidderName)
    ) {
      alert('Bidder information is required for this ban reason')
      return
    }

    if (
      selectedReason?.requiresDuplicateAccount &&
      !newBan.duplicateOfBidderId
    ) {
      alert('Duplicate account bidder ID is required for this ban reason')
      return
    }

    const now = new Date()
    const expiresAt =
      newBan.duration === 'permanent'
        ? null
        : (() => {
            const date = new Date(now)
            switch (newBan.duration) {
              case '1_day':
                date.setDate(date.getDate() + 1)
                break
              case '1_week':
                date.setDate(date.getDate() + 7)
                break
              case '1_month':
                date.setMonth(date.getMonth() + 1)
                break
              case '6_months':
                date.setMonth(date.getMonth() + 6)
                break
              case '1_year':
                date.setFullYear(date.getFullYear() + 1)
                break
            }
            return date
          })()

    const newBanEntry: IPBan = {
      id: `ban${bans.length + 1}`,
      ipAddress: newBan.ipAddress,
      status: 'active',
      banReason: newBan.banReason,
      customNotes: newBan.customNotes,
      duration: newBan.duration as BanDuration,
      bannedAt: now,
      expiresAt,
      bannedBy: currentUser,
      lotNumber: newBan.lotNumber || undefined,
      bidderId: newBan.bidderId || undefined,
      bidderName: newBan.bidderName || undefined,
      duplicateOfBidderId: newBan.duplicateOfBidderId || undefined,
      auditLog: [
        {
          id: `a${Date.now()}`,
          timestamp: now,
          action: 'created',
          performedBy: currentUser,
          details: `IP banned for ${banReasons.find((r: (typeof banReasons)[number]) => r.value === newBan.banReason)?.label}${newBan.lotNumber ? ` on ${newBan.lotNumber}` : ''}${newBan.duplicateOfBidderId ? ` - duplicate of account ${newBan.duplicateOfBidderId}` : ''}`,
        },
      ],
    }

    setBans([newBanEntry, ...bans])
    setShowCreateModal(false)
    setNewBan({
      ipAddress: '',
      banReason: '',
      duration: '',
      customNotes: '',
      lotNumber: '',
      bidderId: '',
      bidderName: '',
      duplicateOfBidderId: '',
    })
  }

  const handleUnban = (ban: IPBan) => {
    const reason = prompt('Enter reason for unbanning:')
    if (!reason) return

    const updatedBan: IPBan = {
      ...ban,
      status: 'unbanned',
      unbanDetails: {
        unbannedAt: new Date(),
        unbannedBy: currentUser,
        reason,
      },
      auditLog: [
        ...ban.auditLog,
        {
          id: `a${Date.now()}`,
          timestamp: new Date(),
          action: 'unbanned',
          performedBy: currentUser,
          details: reason,
        },
      ],
    }

    setBans(bans.map((b: IPBan) => (b.id === ban.id ? updatedBan : b)))
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never'
    return format(date, 'MMM dd, yyyy h:mm a')
  }

  const getDaysRemaining = (expiresAt: Date | null) => {
    if (!expiresAt) return '∞'
    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  const selectedReasonConfig = banReasons.find(
    (r: (typeof banReasons)[number]) => r.value === newBan.banReason,
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <DashboardWrapper>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-sidebar">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">
              IP Ban Management
            </h1>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Ban className="h-4 w-4" />
                  Total Bans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBans}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Active Bans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeBans}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Your Bans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.userBans}</div>
              </CardContent>
            </Card>
          </div>

          {/* IP Bans Table */}
          <Card className="scroll-mt-4">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle>IP Ban Records</CardTitle>
                  <CardDescription>
                    Manage banned IP addresses and access restrictions
                  </CardDescription>
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Ban
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as any)}
              >
                <div className="flex flex-col gap-4 mb-6">
                  {/* Tabs */}
                  <TabsList className="rounded-[12px] w-fit">
                    <TabsTrigger
                      value="all"
                      className="gap-2 cursor-pointer rounded-[10px]"
                    >
                      All
                      <Badge
                        variant="secondary"
                        className="ml-1 rounded-full bg-muted text-muted-foreground font-semibold"
                      >
                        {bans.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="active"
                      className="gap-2 cursor-pointer rounded-[10px]"
                    >
                      Active
                      <Badge
                        variant="secondary"
                        className="ml-1 rounded-full bg-muted text-muted-foreground font-semibold"
                      >
                        {bans.filter((b) => b.status === 'active').length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="expired"
                      className="gap-2 cursor-pointer rounded-[10px]"
                    >
                      Expired
                      <Badge
                        variant="secondary"
                        className="ml-1 rounded-full bg-muted text-muted-foreground font-semibold"
                      >
                        {bans.filter((b) => b.status === 'expired').length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="unbanned"
                      className="gap-2 cursor-pointer rounded-[10px]"
                    >
                      Unbanned
                      <Badge
                        variant="secondary"
                        className="ml-1 rounded-full bg-muted text-muted-foreground font-semibold"
                      >
                        {bans.filter((b) => b.status === 'unbanned').length}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by IP, bidder name, lot number, or banned by..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 bg-background"
                    />
                  </div>
                </div>

                <TabsContent value={statusFilter} className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader className="bg-muted">
                        <TableRow>
                          <SortableTableHead
                            column="ipAddress"
                            label="IP Address"
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                          <TableHead>Status</TableHead>
                          <SortableTableHead
                            column="reason"
                            label="Reason"
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                          <TableHead>Bidder/Lot</TableHead>
                          <TableHead>Duration</TableHead>
                          <SortableTableHead
                            column="bannedBy"
                            label="Banned By"
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                          <SortableTableHead
                            column="bannedAt"
                            label="Banned On"
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedBans.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={8}
                              className="text-center h-24 text-muted-foreground"
                            >
                              No bans found
                            </TableCell>
                          </TableRow>
                        ) : (
                          sortedBans.map((ban: IPBan) => (
                            <TableRow key={ban.id}>
                              <TableCell className="font-mono font-medium">
                                {ban.ipAddress}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    ban.status === 'active'
                                      ? 'destructive'
                                      : ban.status === 'expired'
                                        ? 'secondary'
                                        : 'default'
                                  }
                                  className={cn(
                                    ban.status === 'active' && 'gap-1',
                                  )}
                                >
                                  {ban.status === 'active' && (
                                    <AlertCircle className="h-3 w-3" />
                                  )}
                                  {ban.status.charAt(0).toUpperCase() +
                                    ban.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {
                                      banReasons.find(
                                        (r: (typeof banReasons)[number]) =>
                                          r.value === ban.banReason,
                                      )?.label
                                    }
                                  </span>
                                  {ban.customNotes && (
                                    <span className="text-xs text-muted-foreground">
                                      <TooltipProvider>
                                        <TruncatedCell text={ban.customNotes} />
                                      </TooltipProvider>
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {ban.bidderName && (
                                  <div className="text-sm">
                                    <div className="font-medium">
                                      {ban.bidderName}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {ban.bidderId}
                                    </div>
                                    {ban.duplicateOfBidderId && (
                                      <div className="text-xs text-destructive mt-0.5">
                                        Dup of: {ban.duplicateOfBidderId}
                                      </div>
                                    )}
                                  </div>
                                )}
                                {ban.lotNumber && (
                                  <a
                                    href={getLotUrl(ban.lotNumber)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ color: '#2563eb' }}
                                    className="text-xs font-mono mt-1 flex items-center gap-1 w-fit hover:underline transition-colors"
                                    onMouseEnter={(e) =>
                                      (e.currentTarget.style.color = '#1d4ed8')
                                    }
                                    onMouseLeave={(e) =>
                                      (e.currentTarget.style.color = '#2563eb')
                                    }
                                  >
                                    {ban.lotNumber}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                                {!ban.bidderName && !ban.lotNumber && (
                                  <span className="text-sm text-muted-foreground">
                                    —
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {
                                    durationOptions.find(
                                      (d: (typeof durationOptions)[number]) =>
                                        d.value === ban.duration,
                                    )?.label
                                  }
                                </div>
                                {ban.status === 'active' && ban.expiresAt && (
                                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {getDaysRemaining(ban.expiresAt)} days left
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <TooltipProvider>
                                    <TruncatedCell
                                      text={ban.bannedBy.name}
                                      maxLength={20}
                                    />
                                  </TooltipProvider>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  <TooltipProvider>
                                    <TruncatedCell
                                      text={ban.bannedBy.email}
                                      maxLength={20}
                                    />
                                  </TooltipProvider>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {formatDate(ban.bannedAt)}
                                </div>
                                {ban.expiresAt && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Expires: {formatDate(ban.expiresAt)}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedBan(ban)
                                      setShowAuditLog(true)
                                    }}
                                  >
                                    View Audit
                                  </Button>
                                  {ban.status === 'active' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleUnban(ban)}
                                    >
                                      Unban
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </DashboardWrapper>

      {/* Create Ban Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create IP Ban</DialogTitle>
            <DialogDescription>
              Add a new IP address to the ban list
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* IP Address */}
            <div className="space-y-2">
              <Label htmlFor="ip-address">
                IP Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ip-address"
                value={newBan.ipAddress}
                onChange={(e) =>
                  setNewBan({ ...newBan, ipAddress: e.target.value })
                }
                placeholder="192.168.1.1"
                className="font-mono bg-white"
              />
            </div>

            {/* Ban Reason */}
            <div className="space-y-2">
              <Label htmlFor="ban-reason">
                Ban Reason <span className="text-destructive">*</span>
              </Label>
              <Select
                value={newBan.banReason}
                onValueChange={(value: BanReason) =>
                  setNewBan({
                    ...newBan,
                    banReason: value,
                    lotNumber: '',
                    bidderId: '',
                    bidderName: '',
                    duplicateOfBidderId: '',
                  })
                }
              >
                <SelectTrigger id="ban-reason">
                  <SelectValue placeholder="Select a reason..." />
                </SelectTrigger>
                <SelectContent>
                  {banReasons.map((reason: (typeof banReasons)[number]) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">
                Ban Duration <span className="text-destructive">*</span>
              </Label>
              <Select
                value={newBan.duration}
                onValueChange={(value: BanDuration) =>
                  setNewBan({ ...newBan, duration: value })
                }
              >
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration..." />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map(
                    (option: (typeof durationOptions)[number]) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Conditional: Lot Number */}
            {selectedReasonConfig?.requiresLot && (
              <div className="space-y-2 bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border">
                <Label htmlFor="lot-number">
                  Lot Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lot-number"
                  value={newBan.lotNumber}
                  onChange={(e) =>
                    setNewBan({ ...newBan, lotNumber: e.target.value })
                  }
                  placeholder="AB1234"
                  maxLength={6}
                  className="font-mono uppercase bg-white"
                />
                <p className="text-xs text-muted-foreground">
                  2 letters + 4 numbers (e.g., TR4892)
                </p>
              </div>
            )}

            {/* Conditional: Bidder Info */}
            {selectedReasonConfig?.requiresBidder && (
              <div className="space-y-3 bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border">
                <div className="space-y-2">
                  <Label htmlFor="bidder-id">
                    Bidder ID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="bidder-id"
                    value={newBan.bidderId}
                    onChange={(e) =>
                      setNewBan({ ...newBan, bidderId: e.target.value })
                    }
                    placeholder="123456"
                    maxLength={6}
                    className="font-mono bg-white"
                  />
                  <p className="text-xs text-muted-foreground">
                    6 digits starting with 1
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bidder-name">
                    Bidder Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="bidder-name"
                    value={newBan.bidderName}
                    onChange={(e) =>
                      setNewBan({ ...newBan, bidderName: e.target.value })
                    }
                    placeholder="John Smith"
                    className="bg-white"
                  />
                </div>
              </div>
            )}

            {/* Conditional: Duplicate Account */}
            {selectedReasonConfig?.requiresDuplicateAccount && (
              <div className="space-y-2 bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <Label htmlFor="duplicate-bidder-id">
                  Duplicate of Bidder ID{' '}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="duplicate-bidder-id"
                  value={newBan.duplicateOfBidderId}
                  onChange={(e) =>
                    setNewBan({
                      ...newBan,
                      duplicateOfBidderId: e.target.value,
                    })
                  }
                  placeholder="123456"
                  maxLength={6}
                  className="font-mono bg-white"
                />
                <p className="text-xs text-muted-foreground">
                  Which bidder account is being duplicated
                </p>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={newBan.customNotes}
                onChange={(e) =>
                  setNewBan({ ...newBan, customNotes: e.target.value })
                }
                rows={3}
                placeholder="Provide additional context about this ban..."
                className="bg-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false)
                setNewBan({
                  ipAddress: '',
                  banReason: '',
                  duration: '',
                  customNotes: '',
                  lotNumber: '',
                  bidderId: '',
                  bidderName: '',
                  duplicateOfBidderId: '',
                })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateBan}>Create Ban</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audit Log Modal */}
      <Dialog open={showAuditLog} onOpenChange={setShowAuditLog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedBan && (
            <>
              <DialogHeader>
                <DialogTitle>Audit Log</DialogTitle>
                <DialogDescription>
                  IP: {selectedBan.ipAddress}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Ban Details Summary */}
                <div className="bg-muted rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Status
                      </div>
                      <Badge
                        variant={
                          selectedBan.status === 'active'
                            ? 'destructive'
                            : selectedBan.status === 'expired'
                              ? 'secondary'
                              : 'default'
                        }
                      >
                        {selectedBan.status.charAt(0).toUpperCase() +
                          selectedBan.status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Reason
                      </div>
                      <div className="text-sm">
                        {
                          banReasons.find(
                            (r: (typeof banReasons)[number]) =>
                              r.value === selectedBan.banReason,
                          )?.label
                        }
                      </div>
                    </div>
                    {selectedBan.bidderName && (
                      <div>
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          Bidder
                        </div>
                        <div className="text-sm">{selectedBan.bidderName}</div>
                        <div className="text-xs text-muted-foreground">
                          {selectedBan.bidderId}
                        </div>
                        {selectedBan.duplicateOfBidderId && (
                          <div className="text-xs text-destructive mt-0.5">
                            Duplicate of: {selectedBan.duplicateOfBidderId}
                          </div>
                        )}
                      </div>
                    )}
                    {selectedBan.lotNumber && (
                      <div>
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          Lot
                        </div>
                        <a
                          href={getLotUrl(selectedBan.lotNumber)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#2563eb' }}
                          className="text-sm font-mono hover:underline transition-colors inline-flex items-center gap-1"
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = '#1d4ed8')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = '#2563eb')
                          }
                        >
                          {selectedBan.lotNumber}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                  {selectedBan.customNotes && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Notes
                      </div>
                      <div className="text-sm">{selectedBan.customNotes}</div>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium uppercase tracking-wide">
                    Activity Timeline
                  </h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>

                    <div className="space-y-6">
                      {selectedBan.auditLog.map((entry: AuditEntry) => (
                        <div key={entry.id} className="relative pl-10">
                          <div
                            className={cn(
                              'absolute left-0 w-8 h-8 rounded-full flex items-center justify-center',
                              entry.action === 'created' &&
                                'bg-brand/10 text-brand',
                              entry.action === 'unbanned' &&
                                'bg-green-100 text-green-600',
                              entry.action === 'expired' &&
                                'bg-muted text-muted-foreground',
                              entry.action === 'modified' &&
                                'bg-blue-100 text-blue-600',
                            )}
                          >
                            {entry.action === 'created' && (
                              <Ban className="h-4 w-4" />
                            )}
                            {entry.action === 'unbanned' && (
                              <Shield className="h-4 w-4" />
                            )}
                            {entry.action === 'expired' && (
                              <Clock className="h-4 w-4" />
                            )}
                            {entry.action === 'modified' && (
                              <AlertCircle className="h-4 w-4" />
                            )}
                          </div>

                          <div className="bg-background border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="font-medium capitalize">
                                {entry.action.replace('_', ' ')}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(entry.timestamp)}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {entry.details}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
                                {entry.performedBy.name
                                  .split(' ')
                                  .map((n: string) => n[0])
                                  .join('')}
                              </div>
                              <span>{entry.performedBy.name}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAuditLog(false)
                    setSelectedBan(null)
                  }}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
